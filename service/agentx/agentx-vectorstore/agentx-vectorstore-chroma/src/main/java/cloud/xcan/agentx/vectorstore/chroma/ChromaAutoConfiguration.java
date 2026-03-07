package cloud.xcan.agentx.vectorstore.chroma;

import cloud.xcan.agentx.core.vectorstore.VectorStoreConfigDefinition;
import cloud.xcan.agentx.core.vectorstore.VectorStoreFactory;
import dev.langchain4j.data.segment.TextSegment;
import dev.langchain4j.store.embedding.EmbeddingStore;
import dev.langchain4j.store.embedding.chroma.ChromaEmbeddingStore;
import lombok.extern.slf4j.Slf4j;

public class ChromaAutoConfiguration {

  @Slf4j
  public static class ChromaStoreFactory implements VectorStoreFactory {

    @Override
    public String getType() {
      return "chroma";
    }

    @Override
    public EmbeddingStore<TextSegment> createEmbeddingStore(VectorStoreConfigDefinition config) {
      log.info("Creating Chroma embedding store: collection={}",
          config.getCollectionName());

      String collection =
          config.getCollectionName() != null ? config.getCollectionName() : "embeddings";
      String baseUrl = config.getUrl() != null ? config.getUrl() : "http://localhost:8000";

      return ChromaEmbeddingStore.builder()
          .baseUrl(baseUrl)
          .collectionName(collection)
          .build();
    }
  }
}
