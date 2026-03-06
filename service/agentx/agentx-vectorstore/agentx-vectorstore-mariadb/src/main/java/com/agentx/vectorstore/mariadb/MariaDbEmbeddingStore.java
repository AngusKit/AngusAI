package com.agentx.vectorstore.mariadb;

import dev.langchain4j.data.document.Metadata;
import dev.langchain4j.data.embedding.Embedding;
import dev.langchain4j.data.segment.TextSegment;
import dev.langchain4j.store.embedding.EmbeddingMatch;
import dev.langchain4j.store.embedding.EmbeddingSearchRequest;
import dev.langchain4j.store.embedding.EmbeddingSearchResult;
import dev.langchain4j.store.embedding.EmbeddingStore;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import javax.sql.DataSource;
import lombok.Builder;
import lombok.extern.slf4j.Slf4j;

/**
 * MariaDB 向量存储实现 — 基于 MariaDB 11.7+ VECTOR 类型。
 * <p>
 * MariaDB 11.7 引入了原生 VECTOR 数据类型和 VEC_DISTANCE_COSINE 函数， 支持高效的向量相似度搜索。
 * </p>
 */
@Slf4j
public class MariaDbEmbeddingStore implements EmbeddingStore<TextSegment> {

  private final DataSource dataSource;
  private final String tableName;
  private final int dimension;

  @Builder
  public MariaDbEmbeddingStore(DataSource dataSource, String tableName, int dimension) {
    this.dataSource = dataSource;
    this.tableName = tableName != null ? tableName : "agentx_embeddings";
    this.dimension = dimension > 0 ? dimension : 1536;
    initTable();
  }

  private void initTable() {
    String sql = """
        CREATE TABLE IF NOT EXISTS %s (
            id VARCHAR(36) PRIMARY KEY,
            embedding VECTOR(%d) NOT NULL,
            text_content LONGTEXT,
            metadata JSON,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        """.formatted(tableName, dimension);
    try (Connection conn = dataSource.getConnection();
        Statement stmt = conn.createStatement()) {
      stmt.execute(sql);
      log.info("MariaDB vector table initialized: {} (dimension={})", tableName, dimension);
    } catch (SQLException e) {
      log.warn("Table init may have failed (table might already exist): {}", e.getMessage());
    }
  }

  @Override
  public String add(Embedding embedding) {
    String id = UUID.randomUUID().toString();
    addInternal(id, embedding, null);
    return id;
  }

  @Override
  public String add(Embedding embedding, TextSegment textSegment) {
    String id = UUID.randomUUID().toString();
    addInternal(id, embedding, textSegment);
    return id;
  }

  @Override
  public void add(String id, Embedding embedding) {
    addInternal(id, embedding, null);
  }

  @Override
  public List<String> addAll(List<Embedding> embeddings) {
    List<String> ids = new ArrayList<>();
    for (Embedding embedding : embeddings) {
      ids.add(add(embedding));
    }
    return ids;
  }

  @Override
  public EmbeddingSearchResult<TextSegment> search(EmbeddingSearchRequest request) {
    String vectorStr = toVectorString(request.queryEmbedding().vector());
    int maxResults = request.maxResults();
    double minScore = request.minScore();

    String sql = """
        SELECT id, text_content, metadata,
               1 - VEC_DISTANCE_COSINE(embedding, VEC_FromText('%s')) AS score
        FROM %s
        ORDER BY VEC_DISTANCE_COSINE(embedding, VEC_FromText('%s')) ASC
        LIMIT %d
        """.formatted(vectorStr, tableName, vectorStr, maxResults);

    List<EmbeddingMatch<TextSegment>> matches = new ArrayList<>();
    try (Connection conn = dataSource.getConnection();
        Statement stmt = conn.createStatement();
        ResultSet rs = stmt.executeQuery(sql)) {

      while (rs.next()) {
        double score = rs.getDouble("score");
        if (score < minScore) {
          continue;
        }

        String id = rs.getString("id");
        String textContent = rs.getString("text_content");
        TextSegment segment = textContent != null
            ? TextSegment.from(textContent, parseMetadata(rs.getString("metadata")))
            : null;

        matches.add(new EmbeddingMatch<>(score, id, null, segment));
      }
    } catch (SQLException e) {
      log.error("MariaDB vector search failed: {}", e.getMessage());
    }

    return new EmbeddingSearchResult<>(matches);
  }

  @Override
  public void removeAll(Collection<String> ids) {
    if (ids == null || ids.isEmpty()) {
      return;
    }
    String placeholders = String.join(",", Collections.nCopies(ids.size(), "?"));
    String sql = "DELETE FROM " + tableName + " WHERE id IN (" + placeholders + ")";
    try (Connection conn = dataSource.getConnection();
        PreparedStatement ps = conn.prepareStatement(sql)) {
      int i = 1;
      for (String id : ids) {
        ps.setString(i++, id);
      }
      ps.executeUpdate();
    } catch (SQLException e) {
      log.error("MariaDB vector delete failed: {}", e.getMessage());
    }
  }

  @Override
  public void removeAll() {
    try (Connection conn = dataSource.getConnection();
        Statement stmt = conn.createStatement()) {
      stmt.execute("TRUNCATE TABLE " + tableName);
    } catch (SQLException e) {
      log.error("MariaDB vector truncate failed: {}", e.getMessage());
    }
  }

  private void addInternal(String id, Embedding embedding, TextSegment segment) {
    String sql = """
        INSERT INTO %s (id, embedding, text_content, metadata)
        VALUES (?, VEC_FromText(?), ?, ?)
        ON DUPLICATE KEY UPDATE embedding = VEC_FromText(?), text_content = ?, metadata = ?
        """.formatted(tableName);
    try (Connection conn = dataSource.getConnection();
        PreparedStatement ps = conn.prepareStatement(sql)) {
      String vectorStr = toVectorString(embedding.vector());
      String text = segment != null ? segment.text() : null;
      String metadata = segment != null && segment.metadata() != null
          ? metadataToJson(segment.metadata()) : null;
      ps.setString(1, id);
      ps.setString(2, vectorStr);
      ps.setString(3, text);
      ps.setString(4, metadata);
      ps.setString(5, vectorStr);
      ps.setString(6, text);
      ps.setString(7, metadata);
      ps.executeUpdate();
    } catch (SQLException e) {
      log.error("MariaDB vector insert failed: {}", e.getMessage());
    }
  }

  private String toVectorString(float[] vector) {
    StringBuilder sb = new StringBuilder("[");
    for (int i = 0; i < vector.length; i++) {
      if (i > 0) {
        sb.append(",");
      }
      sb.append(vector[i]);
    }
    sb.append("]");
    return sb.toString();
  }

  private String metadataToJson(Metadata metadata) {
    if (metadata == null) {
      return null;
    }
    StringBuilder sb = new StringBuilder("{");
    boolean first = true;
    for (Map.Entry<String, Object> entry : metadata.toMap().entrySet()) {
      if (!first) {
        sb.append(",");
      }
      sb.append("\"").append(entry.getKey().replace("\"", "\\\"")).append("\":");
      Object val = entry.getValue();
      if (val instanceof String s) {
        sb.append("\"").append(s.replace("\"", "\\\"")).append("\"");
      } else {
        sb.append(val);
      }
      first = false;
    }
    sb.append("}");
    return sb.toString();
  }

  private Metadata parseMetadata(String json) {
    if (json == null || json.isBlank()) {
      return new Metadata();
    }
    // Simple JSON parsing for flat key-value metadata
    Metadata metadata = new Metadata();
    json = json.trim();
    if (json.startsWith("{") && json.endsWith("}")) {
      json = json.substring(1, json.length() - 1);
      for (String pair : json.split(",")) {
        String[] kv = pair.split(":", 2);
        if (kv.length == 2) {
          String key = kv[0].trim().replaceAll("^\"|\"$", "");
          String value = kv[1].trim().replaceAll("^\"|\"$", "");
          metadata.put(key, value);
        }
      }
    }
    return metadata;
  }
}
