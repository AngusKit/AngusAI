package cloud.xcan.agentx.vectorstore.mariadb;

import cloud.xcan.agentx.core.vectorstore.VectorStoreConfigDefinition;
import cloud.xcan.agentx.core.vectorstore.VectorStoreFactory;
import cloud.xcan.agentx.core.vectorstore.VectorStoreType;
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
    public VectorStoreType getType() {
      return VectorStoreType.MARIADB;
    }

    @Override
    public EmbeddingStore<TextSegment> createEmbeddingStore(VectorStoreConfigDefinition config) {
      log.info("Creating MariaDB embedding store: collection={}, dimension={}",
          config.getCollectionName(), config.getDimension());

      try {
        MariaDbPoolDataSource dataSource = new MariaDbPoolDataSource();
        String jdbcUrl = config.getEffectiveUrl();
        if (jdbcUrl == null || !jdbcUrl.startsWith("jdbc:")) {
          jdbcUrl = String.format("jdbc:mariadb://%s:%d/%s",
              config.getEffectiveHost(),
              config.getEffectivePort(3306),
              config.getDatabase() != null ? config.getDatabase() : "vector_db");
        }
        dataSource.setUrl(jdbcUrl);
        if (config.getUsername() != null) {
          dataSource.setUser(config.getUsername());
        }
        if (config.getPassword() != null) {
          dataSource.setPassword(config.getPassword());
        }

        return MariaDbEmbeddingStore.builder()
            .dataSource(dataSource)
            .tableName(config.getEffectiveCollectionName())
            .dimension(config.getEffectiveDimension())
            .build();
      } catch (SQLException e) {
        throw new RuntimeException("Failed to create MariaDB data source", e);
      }
    }
  }
}
