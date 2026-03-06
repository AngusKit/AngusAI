package cloud.xcan.agentx.vectorstore.mariadb;

import cloud.xcan.core.vectorstore.VectorStoreConfigDefinition;
import cloud.xcan.core.vectorstore.VectorStoreFactory;
import dev.langchain4j.data.segment.TextSegment;
import dev.langchain4j.store.embedding.EmbeddingStore;
import java.sql.SQLException;
import lombok.extern.slf4j.Slf4j;
import org.mariadb.jdbc.MariaDbPoolDataSource;

/**
 * MariaDB 向量存储模块自动配置 — 提供 MariaDbVectorStoreFactory 组件。
 * <p>
 * 需要 MariaDB 11.7+ 以支持原生 VECTOR 数据类型。
 * </p>
 */
public class MariaDbAutoConfiguration {

  @Slf4j
  public static class MariaDbVectorStoreFactory implements VectorStoreFactory {

    @Override
    public String getType() {
      return "mariadb";
    }

    @Override
    public EmbeddingStore<TextSegment> createEmbeddingStore(VectorStoreConfigDefinition config) {
      log.info("Creating MariaDB embedding store: collection={}, dimension={}",
          config.getCollectionName(), config.getDimension());

      try {
        MariaDbPoolDataSource dataSource = new MariaDbPoolDataSource();
        dataSource.setUrl(config.getUrl());
        if (config.getUsername() != null) {
          dataSource.setUser(config.getUsername());
        }
        if (config.getPassword() != null) {
          dataSource.setPassword(config.getPassword());
        }

        return MariaDbEmbeddingStore.builder()
            .dataSource(dataSource)
            .tableName(config.getCollectionName() != null ? config.getCollectionName()
                : "agentx_embeddings")
            .dimension(config.getDimension() != null ? config.getDimension() : 1536)
            .build();
      } catch (SQLException e) {
        throw new RuntimeException("Failed to create MariaDB data source", e);
      }
    }
  }
}
