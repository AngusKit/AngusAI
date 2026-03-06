package cloud.xcan.agentx.vectorstore.qdrant;

import cloud.xcan.core.vectorstore.VectorStoreConfigDefinition;
import cloud.xcan.core.vectorstore.VectorStoreFactory;
import dev.langchain4j.data.segment.TextSegment;
import dev.langchain4j.store.embedding.EmbeddingStore;
import dev.langchain4j.store.embedding.qdrant.QdrantEmbeddingStore;
import java.util.Map;
import lombok.extern.slf4j.Slf4j;

public class QdrantAutoConfiguration {

  @Slf4j
  public static class QdrantStoreFactory implements VectorStoreFactory {

    @Override
    public String getType() {
      return "qdrant";
    }

    @Override
    public EmbeddingStore<TextSegment> createEmbeddingStore(VectorStoreConfigDefinition config) {
      log.info("Creating Qdrant embedding store: collection={}, dimension={}",
          config.getCollectionName(), config.getDimension());

      String collection =
          config.getCollectionName() != null ? config.getCollectionName() : "embeddings";
      Map<String, Object> extra = config.getExtraProperties();

      String host = config.getUrl() != null ? config.getUrl() : "localhost";
      int port = 6334;
      if (extra != null && extra.containsKey("grpcPort")) {
        port = ((Number) extra.get("grpcPort")).intValue();
      }

      var builder = QdrantEmbeddingStore.builder()
          .host(host)
          .port(port)
          .collectionName(collection);

      if (extra != null && extra.containsKey("apiKey")) {
        builder.apiKey((String) extra.get("apiKey"));
      }
      if (extra != null && extra.containsKey("useTls") && (Boolean) extra.get("useTls")) {
        builder.useTls(true);
      }

      return builder.build();
    }
  }
}
