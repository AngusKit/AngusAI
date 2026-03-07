package cloud.xcan.agentx.vectorstore.pgvector;

import cloud.xcan.agentx.core.vectorstore.VectorStoreConfigDefinition;
import cloud.xcan.agentx.core.vectorstore.VectorStoreConfigProvider;
import cloud.xcan.agentx.core.vectorstore.VectorStoreFactory;
import cloud.xcan.agentx.core.vectorstore.VectorStoreType;
import dev.langchain4j.data.segment.TextSegment;
import dev.langchain4j.store.embedding.EmbeddingStore;
import dev.langchain4j.store.embedding.pgvector.PgVectorEmbeddingStore;
import lombok.extern.slf4j.Slf4j;

/**
 * PgVector 模块自动配置 — 提供 PgVectorStoreFactory 组件。
 * <p>
 * 向量存储配置由 {@link VectorStoreConfigProvider} 从数据库等外部源加载，不再从 application.yml 读取。
 * </p>
 */
public class PgVectorAutoConfiguration {

  @Slf4j
  public static class PgVectorStoreFactory implements VectorStoreFactory {

    @Override
    public VectorStoreType getType() {
      return VectorStoreType.PGVECTOR;
    }

    @Override
    public EmbeddingStore<TextSegment> createEmbeddingStore(VectorStoreConfigDefinition config) {
      log.info("Creating PgVector embedding store: collection={}, dimension={}",
          config.getEffectiveCollectionName(), config.getEffectiveDimension());

      String host = config.getEffectiveHost();
      int port = config.getEffectivePort(5432);
      String database = config.getDatabase() != null ? config.getDatabase() : "postgres";
      String table = config.getEffectiveCollectionName();
      int dimension = config.getEffectiveDimension();

      return PgVectorEmbeddingStore.builder()
          .host(host)
          .port(port)
          .database(database)
          .user(config.getUsername())
          .password(config.getPassword())
          .table(table)
          .dimension(dimension)
          .build();
    }
  }
}
