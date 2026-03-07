package cloud.xcan.agentx.vectorstore.milvus;

import cloud.xcan.agentx.core.vectorstore.VectorStoreConfigDefinition;
import cloud.xcan.agentx.core.vectorstore.VectorStoreFactory;
import cloud.xcan.agentx.core.vectorstore.VectorStoreType;
import dev.langchain4j.data.segment.TextSegment;
import dev.langchain4j.store.embedding.EmbeddingStore;
import dev.langchain4j.store.embedding.milvus.MilvusEmbeddingStore;
import java.util.Map;
import lombok.extern.slf4j.Slf4j;

public class MilvusAutoConfiguration {

  @Slf4j
  public static class MilvusStoreFactory implements VectorStoreFactory {

    @Override
    public VectorStoreType getType() {
      return VectorStoreType.MILVUS;
    }

    @Override
    public EmbeddingStore<TextSegment> createEmbeddingStore(VectorStoreConfigDefinition config) {
      log.info("Creating Milvus embedding store: collection={}, dimension={}",
          config.getCollectionName(), config.getDimension());

      String collection = config.getEffectiveCollectionName();
      int dimension = config.getEffectiveDimension();
      Map<String, Object> extra = config.getExtraProperties();

      var builder = MilvusEmbeddingStore.builder()
          .uri(config.getEffectiveUrl() != null ? config.getEffectiveUrl() : "http://localhost:19530")
          .collectionName(collection)
          .dimension(dimension);

      if (config.getUsername() != null) {
        builder.username(config.getUsername());
      }
      if (config.getPassword() != null) {
        builder.password(config.getPassword());
      }
      if (extra != null && extra.containsKey("token")) {
        builder.token((String) extra.get("token"));
      }
      if (extra != null && extra.containsKey("databaseName")) {
        builder.databaseName((String) extra.get("databaseName"));
      }

      return builder.build();
    }
  }
}
