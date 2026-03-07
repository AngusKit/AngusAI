package cloud.xcan.agentx.vectorstore.weaviate;

import cloud.xcan.agentx.core.vectorstore.VectorStoreConfigDefinition;
import cloud.xcan.agentx.core.vectorstore.VectorStoreFactory;
import dev.langchain4j.data.segment.TextSegment;
import dev.langchain4j.store.embedding.EmbeddingStore;
import dev.langchain4j.store.embedding.weaviate.WeaviateEmbeddingStore;
import java.util.Map;
import lombok.extern.slf4j.Slf4j;

public class WeaviateAutoConfiguration {

  @Slf4j
  public static class WeaviateStoreFactory implements VectorStoreFactory {

    @Override
    public String getType() {
      return "weaviate";
    }

    @Override
    public EmbeddingStore<TextSegment> createEmbeddingStore(VectorStoreConfigDefinition config) {
      log.info("Creating Weaviate embedding store: collection={}",
          config.getCollectionName());

      String collection =
          config.getCollectionName() != null ? config.getCollectionName() : "Embeddings";
      String scheme = "http";
      String host = config.getUrl() != null ? config.getUrl() : "localhost:8080";
      Map<String, Object> extra = config.getExtraProperties();

      if (extra != null && extra.containsKey("scheme")) {
        scheme = (String) extra.get("scheme");
      }

      var builder = WeaviateEmbeddingStore.builder()
          .scheme(scheme)
          .host(host)
          .objectClass(collection);

      if (extra != null && extra.containsKey("apiKey")) {
        builder.apiKey((String) extra.get("apiKey"));
      }

      return builder.build();
    }
  }
}
