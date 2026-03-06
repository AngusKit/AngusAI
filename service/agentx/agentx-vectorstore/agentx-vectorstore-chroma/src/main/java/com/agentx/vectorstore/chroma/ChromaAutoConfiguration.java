package com.agentx.vectorstore.chroma;

import com.agentx.core.vectorstore.VectorStoreConfigDefinition;
import com.agentx.core.vectorstore.VectorStoreFactory;
import dev.langchain4j.data.segment.TextSegment;
import dev.langchain4j.store.embedding.EmbeddingStore;
import dev.langchain4j.store.embedding.chroma.ChromaEmbeddingStore;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Component;

@Configuration
public class ChromaAutoConfiguration {

  @Slf4j
  @Component
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
