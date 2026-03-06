package cloud.xcan.agentx.vectorstore.milvus;

import cloud.xcan.core.vectorstore.VectorStoreConfigDefinition;
import cloud.xcan.core.vectorstore.VectorStoreFactory;
import dev.langchain4j.data.segment.TextSegment;
import dev.langchain4j.store.embedding.EmbeddingStore;
import dev.langchain4j.store.embedding.milvus.MilvusEmbeddingStore;
import java.util.Map;
import lombok.extern.slf4j.Slf4j;

public class MilvusAutoConfiguration {

  @Slf4j
  public static class MilvusStoreFactory implements VectorStoreFactory {

    @Override
    public String getType() {
      return "milvus";
    }

    @Override
    public EmbeddingStore<TextSegment> createEmbeddingStore(VectorStoreConfigDefinition config) {
      log.info("Creating Milvus embedding store: collection={}, dimension={}",
          config.getCollectionName(), config.getDimension());

      String collection =
          config.getCollectionName() != null ? config.getCollectionName() : "embeddings";
      int dimension = config.getDimension() != null ? config.getDimension() : 1536;
      Map<String, Object> extra = config.getExtraProperties();

      var builder = MilvusEmbeddingStore.builder()
          .uri(config.getUrl())
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
