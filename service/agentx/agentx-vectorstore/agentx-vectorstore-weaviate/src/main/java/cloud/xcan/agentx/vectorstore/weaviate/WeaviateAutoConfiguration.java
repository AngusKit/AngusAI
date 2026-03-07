package cloud.xcan.agentx.vectorstore.weaviate;

import cloud.xcan.agentx.core.vectorstore.VectorStoreConfigDefinition;
import cloud.xcan.agentx.core.vectorstore.VectorStoreFactory;
import cloud.xcan.agentx.core.vectorstore.VectorStoreType;
import dev.langchain4j.data.segment.TextSegment;
import dev.langchain4j.store.embedding.EmbeddingStore;
import dev.langchain4j.store.embedding.weaviate.WeaviateEmbeddingStore;
import java.util.Map;
import lombok.extern.slf4j.Slf4j;

public class WeaviateAutoConfiguration {

  @Slf4j
  public static class WeaviateStoreFactory implements VectorStoreFactory {

    @Override
    public VectorStoreType getType() {
      return VectorStoreType.WEAVIATE;
    }

    @Override
    public EmbeddingStore<TextSegment> createEmbeddingStore(VectorStoreConfigDefinition config) {
      log.info("Creating Weaviate embedding store: collection={}",
          config.getCollectionName());

      String collection = config.getEffectiveCollectionName();
      String scheme = config.getExtra("scheme", String.class);
      if (scheme == null) {
        String u = config.getEffectiveUrl();
        scheme = (u != null && u.startsWith("https")) ? "https" : "http";
      }
      String host = config.getEffectiveHost() + ":" + config.getEffectivePort(8080);
      Map<String, Object> extra = config.getExtraProperties();

      var builder = WeaviateEmbeddingStore.builder()
          .scheme(scheme)
          .host(host)
          .objectClass(collection);

      String apiKey = config.getApiKey() != null ? config.getApiKey() : config.getExtra("apiKey", String.class);
      if (apiKey != null) {
        builder.apiKey(apiKey);
      }

      return builder.build();
    }
  }
}
