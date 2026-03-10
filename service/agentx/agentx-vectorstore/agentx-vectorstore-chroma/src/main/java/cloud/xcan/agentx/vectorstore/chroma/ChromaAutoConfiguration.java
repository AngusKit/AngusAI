package cloud.xcan.agentx.vectorstore.chroma;

import cloud.xcan.agentx.core.vectorstore.VectorStoreConfigDefinition;
import cloud.xcan.agentx.core.vectorstore.VectorStoreFactory;
import cloud.xcan.agentx.core.vectorstore.VectorStoreType;
import dev.langchain4j.data.segment.TextSegment;
import dev.langchain4j.store.embedding.EmbeddingStore;
import dev.langchain4j.store.embedding.chroma.ChromaEmbeddingStore;
import lombok.extern.slf4j.Slf4j;

public class ChromaAutoConfiguration {

  @Slf4j
  public static class ChromaStoreFactory implements VectorStoreFactory {

    @Override
    public VectorStoreType getType() {
      return VectorStoreType.CHROMA;
    }

    @Override
    public EmbeddingStore<TextSegment> createEmbeddingStore(VectorStoreConfigDefinition config) {
      log.info("Creating Chroma embedding store: collection={}",
          config.getCollectionName());

      String collection = config.getEffectiveCollectionName();
      String baseUrl =
          config.getEffectiveUrl() != null ? config.getEffectiveUrl() : "http://localhost:8000";

      return ChromaEmbeddingStore.builder()
          .baseUrl(baseUrl)
          .collectionName(collection)
          .build();
    }
  }
}
