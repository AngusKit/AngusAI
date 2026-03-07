package cloud.xcan.agentx.core.vectorstore;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.media.Schema.AccessMode;
import io.swagger.v3.oas.annotations.media.Schema.RequiredMode;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import java.util.Map;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.apache.commons.lang3.StringUtils;

/**
 * 向量存储配置定义 — 统一的向量库连接配置，用于 API 入参、实体存储、工厂构建。
 * <p>
 * 支持两种连接方式：1) 完整 URL（url/endpoint）；2) host+port+database 分字段。
 * 工厂实现优先使用 url，若为空则根据 host/port/database 构建。
 * </p>
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(
    name = "VectorStoreConfigDefinition",
    description = "向量存储配置：不同类型(VectorStoreType)的向量库需要的字段各不相同。支持 url/endpoint 或 host+port 两种连接方式。")
public class VectorStoreConfigDefinition {

  /**
   * 配置唯一标识（由 VectorStoreConfigProvider 加载时填充，API 入参通常为空）
   */
  @Schema(description = "配置唯一标识")
  private String id;

  @NotNull
  @Schema(description = "向量存储类型", requiredMode = RequiredMode.REQUIRED)
  private VectorStoreType type;

  /**
   * 连接 URL：JDBC、http(s) 或 host:port 形式。优先使用此字段。
   */
  @Schema(
      description = "连接 URL。支持：JDBC(jdbc:postgresql://...)、HTTP(http://localhost:9200)、或 host:port。",
      example = "jdbc:postgresql://localhost:5432/vector_db")
  private String url;

  /**
   * API 端点，与 url 等价（HTTP 场景）。若 url 为空且 endpoint 有值，工厂可据此构建连接。
   */
  @Schema(
      description = "API 端点/连接地址。HTTP 类型时使用，与 url 等价。",
      example = "https://localhost:9200")
  private String endpoint;

  @Schema(
      description = "API 密钥。Elasticsearch/Qdrant/Weaviate 等可选。",
      accessMode = AccessMode.WRITE_ONLY,
      example = "******")
  @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
  private String apiKey;

  @Schema(description = "主机名。与 port 配合使用。", example = "127.0.0.1")
  private String host;

  @Schema(description = "端口号", example = "5432", minimum = "1", maximum = "65535")
  @Min(1)
  @Max(65535)
  private Integer port;

  @Schema(description = "数据库名。PgVector/MariaDB 等需要。", example = "vector_db")
  private String database;

  /**
   * 集合/表/索引名。JSON 序列化支持 collection 别名以兼容前端。
   */
  @Schema(description = "集合/表/索引名", example = "embeddings")
  @JsonProperty(value = "collection", access = JsonProperty.Access.READ_WRITE)
  private String collectionName;

  @Schema(description = "用户名", example = "app_user")
  private String username;

  @Schema(
      description = "密码",
      accessMode = AccessMode.WRITE_ONLY,
      example = "******")
  @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
  private String password;

  @NotNull
  @Min(1)
  @Max(4096)
  @Schema(
      description = "向量维度，须与嵌入模型一致。常见：1536(OpenAI)、768(BERT)、384(all-MiniLM)。",
      requiredMode = RequiredMode.REQUIRED,
      example = "1536",
      minimum = "1",
      maximum = "4096")
  @Builder.Default
  private Integer dimension = 1536;

  @Schema(description = "连接超时(毫秒)", example = "30000")
  @Min(1000)
  @Max(600000)
  @Builder.Default
  private Integer timeout = 30000;

  @Schema(description = "是否启用 SSL/TLS", example = "false")
  @Builder.Default
  private Boolean sslEnabled = false;

  @Schema(description = "连接池最大连接数", example = "10")
  @Min(1)
  @Max(1000)
  @Builder.Default
  private Integer maxConnections = 10;

  @Schema(description = "命名空间。Pinecone/Weaviate/Qdrant 等逻辑分区。", example = "tenantA")
  private String namespace;

  @Schema(description = "是否为默认配置")
  @Builder.Default
  private boolean defaultConfig = false;

  @Schema(description = "租户 ID，null 为全局")
  private String tenantId;

  @Schema(description = "扩展参数。如 token、grpcPort、apiKey、scheme 等。")
  private Map<String, Object> extraProperties;

  // --- 便捷方法 ---

  /**
   * 获取有效的连接 URL。优先 url，其次 endpoint，再根据 host:port 构建。
   */
  public String getEffectiveUrl() {
    if (StringUtils.isNotBlank(url)) {
      return url.trim();
    }
    if (StringUtils.isNotBlank(endpoint)) {
      return endpoint.trim();
    }
    if (StringUtils.isNotBlank(host) && port != null) {
      return host.trim() + ":" + port;
    }
    return null;
  }

  /**
   * 获取连接主机。优先 host 字段，否则从 getEffectiveUrl() 解析（支持 host:port、http(s)://、jdbc: 格式）。
   */
  public String getEffectiveHost() {
    if (StringUtils.isNotBlank(host)) {
      return host.trim();
    }
    String u = getEffectiveUrl();
    if (StringUtils.isBlank(u)) {
      return "localhost";
    }
    u = u.trim();
    if (u.startsWith("http://") || u.startsWith("https://")) {
      try {
        java.net.URI uri = java.net.URI.create(u);
        return uri.getHost() != null ? uri.getHost() : "localhost";
      } catch (Exception ignored) {
        return "localhost";
      }
    }
    if (u.startsWith("jdbc:postgresql://") || u.startsWith("jdbc:mariadb://")) {
      try {
        java.net.URI uri = java.net.URI.create(u.replace("jdbc:postgresql://", "http://").replace("jdbc:mariadb://", "http://"));
        return uri.getHost() != null ? uri.getHost() : "localhost";
      } catch (Exception ignored) {
        return "localhost";
      }
    }
    if (u.contains(":")) {
      int idx = u.indexOf(':');
      return u.substring(0, idx).trim();
    }
    return u;
  }

  /**
   * 获取连接端口。优先 port 字段，否则从 getEffectiveUrl() 解析，或返回默认值。
   */
  public int getEffectivePort(int defaultPort) {
    if (port != null && port > 0) {
      return port;
    }
    String u = getEffectiveUrl();
    if (StringUtils.isNotBlank(u)) {
      u = u.trim();
      if (u.startsWith("http://") || u.startsWith("https://")) {
        try {
          java.net.URI uri = java.net.URI.create(u);
          return uri.getPort() > 0 ? uri.getPort() : defaultPort;
        } catch (Exception ignored) {
          return defaultPort;
        }
      }
      if (u.startsWith("jdbc:postgresql://") || u.startsWith("jdbc:mariadb://")) {
        try {
          String httpLike = u.replace("jdbc:postgresql://", "http://").replace("jdbc:mariadb://", "http://");
          java.net.URI uri = java.net.URI.create(httpLike);
          return uri.getPort() > 0 ? uri.getPort() : defaultPort;
        } catch (Exception ignored) {
          return defaultPort;
        }
      }
      int idx = u.indexOf(':');
      if (idx >= 0 && idx < u.length() - 1) {
        String portStr = u.substring(idx + 1).replaceAll("/.*", "").trim();
        try {
          return Integer.parseInt(portStr);
        } catch (NumberFormatException ignored) {
          // fall through
        }
      }
    }
    return defaultPort;
  }

  /**
   * 获取有效的集合/表名
   */
  public String getEffectiveCollectionName() {
    return StringUtils.isNotBlank(collectionName) ? collectionName : "embeddings";
  }

  /**
   * 获取有效的向量维度
   */
  public int getEffectiveDimension() {
    return dimension != null ? dimension : 1536;
  }

  /**
   * 从 extraProperties 获取字符串值
   */
  @SuppressWarnings("unchecked")
  public <T> T getExtra(String key, Class<T> type) {
    if (extraProperties == null) {
      return null;
    }
    Object v = extraProperties.get(key);
    if (v == null) {
      return null;
    }
    if (type.isInstance(v)) {
      return (T) v;
    }
    if (type == String.class) {
      return (T) String.valueOf(v);
    }
    if (type == Integer.class && v instanceof Number) {
      return (T) Integer.valueOf(((Number) v).intValue());
    }
    if (type == Boolean.class) {
      return (T) Boolean.valueOf(v.toString());
    }
    return null;
  }

  /**
   * 按类型校验必要配置，抛出 IllegalArgumentException 表示不合法。
   */
  public void validateVectorDataSourceConfig() {
    if (type == null) {
      throw new IllegalArgumentException("Vector data source type must be specified");
    }
    switch (type) {
      case ELASTICSEARCH:
      case QDRANT:
      case WEAVIATE:
      case CHROMA:
        break;
      case MILVUS:
        requireHostAndPort(type);
        if (StringUtils.isBlank(collectionName)) {
          throw new IllegalArgumentException("Collection is required for " + type);
        }
        break;
      case PGVECTOR:
      case MARIADB:
        if (StringUtils.isBlank(getEffectiveUrl()) && (StringUtils.isBlank(host) || port == null)) {
          throw new IllegalArgumentException("Host and port (or url) are required for " + type);
        }
        if (type == VectorStoreType.PGVECTOR || type == VectorStoreType.MARIADB) {
          if (StringUtils.isBlank(database) && StringUtils.isBlank(getEffectiveUrl())) {
            throw new IllegalArgumentException("Database is required for " + type);
          }
          if (StringUtils.isBlank(username) || StringUtils.isBlank(password)) {
            throw new IllegalArgumentException("Username and password are required for " + type);
          }
        }
        break;
      default:
        break;
    }
  }

  private void requireHostAndPort(VectorStoreType t) {
    if (StringUtils.isBlank(getEffectiveUrl()) && (StringUtils.isBlank(host) || port == null)) {
      throw new IllegalArgumentException("Host and port (or url) are required for " + t);
    }
    if (port != null && (port < 1 || port > 65535)) {
      throw new IllegalArgumentException("Port out of range (1-65535) for " + t);
    }
  }
}
