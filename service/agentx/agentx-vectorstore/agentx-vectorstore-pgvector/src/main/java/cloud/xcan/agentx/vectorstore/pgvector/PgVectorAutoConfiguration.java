package cloud.xcan.agentx.vectorstore.pgvector;

import cloud.xcan.agentx.core.vectorstore.VectorStoreConfigDefinition;
import cloud.xcan.agentx.core.vectorstore.VectorStoreConfigProvider;
import cloud.xcan.agentx.core.vectorstore.VectorStoreFactory;
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
    public String getType() {
      return "pgvector";
    }

    @Override
    public EmbeddingStore<TextSegment> createEmbeddingStore(VectorStoreConfigDefinition config) {
      log.info("Creating PgVector embedding store: collection={}, dimension={}",
          config.getCollectionName(), config.getDimension());

      String host = config.getUrl();
      String table = config.getCollectionName() != null ? config.getCollectionName() : "embeddings";
      int dimension = config.getDimension() != null ? config.getDimension() : 1536;

      return PgVectorEmbeddingStore.builder()
          .host(host)
          .user(config.getUsername())
          .password(config.getPassword())
          .table(table)
          .dimension(dimension)
          .build();
    }
  }
}
