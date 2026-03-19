package cloud.xcan.agentx.vectorstore.qdrant;

import cloud.xcan.agentx.core.vectorstore.VectorStoreConfigDefinition;
import cloud.xcan.agentx.core.vectorstore.VectorStoreFactory;
import cloud.xcan.agentx.core.vectorstore.VectorStoreType;
import dev.langchain4j.data.segment.TextSegment;
import dev.langchain4j.store.embedding.EmbeddingStore;
import dev.langchain4j.store.embedding.qdrant.QdrantEmbeddingStore;
import java.util.Map;
import lombok.extern.slf4j.Slf4j;

public class QdrantAutoConfiguration {

  @Slf4j
  public static class QdrantStoreFactory implements VectorStoreFactory {

    @Override
    public VectorStoreType getType() {
      return VectorStoreType.QDRANT;
    }

    @Override
    public EmbeddingStore<TextSegment> createEmbeddingStore(VectorStoreConfigDefinition config) {
      log.info("Creating Qdrant embedding store: collection={}, dimension={}",
          config.getCollectionName(), config.getDimension());

      String collection = config.getEffectiveCollectionName();
      Map<String, Object> extra = config.getExtraProperties();

      String host = config.getEffectiveHost();
      int port = 6334;
      if (extra != null && extra.containsKey("grpcPort")) {
        port = ((Number) extra.get("grpcPort")).intValue();
      }

      var builder = QdrantEmbeddingStore.builder()
          .host(host)
          .port(port)
          .collectionName(collection);

      String apiKey = config.getApiKey();
      if (apiKey == null && extra != null && extra.containsKey("apiKey")) {
        apiKey = (String) extra.get("apiKey");
      }
      if (apiKey != null && !apiKey.isBlank()) {
        builder.apiKey(apiKey);
      }
      if (extra != null && extra.containsKey("useTls") && (Boolean) extra.get("useTls")) {
        builder.useTls(true);
      }

      return builder.build();
    }
  }
}
