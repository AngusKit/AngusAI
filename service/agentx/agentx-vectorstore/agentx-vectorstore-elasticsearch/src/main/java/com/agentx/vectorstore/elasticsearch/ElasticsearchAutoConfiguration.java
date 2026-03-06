package com.agentx.vectorstore.elasticsearch;

import com.agentx.core.vectorstore.VectorStoreConfigDefinition;
import com.agentx.core.vectorstore.VectorStoreFactory;
import dev.langchain4j.data.segment.TextSegment;
import dev.langchain4j.store.embedding.EmbeddingStore;
import dev.langchain4j.store.embedding.elasticsearch.ElasticsearchEmbeddingStore;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Component;

import java.util.Map;

@Configuration
public class ElasticsearchAutoConfiguration {

  @Slf4j
  @Component
  public static class ElasticsearchStoreFactory implements VectorStoreFactory {

    @Override
    public String getType() {
      return "elasticsearch";
    }

    @Override
    public EmbeddingStore<TextSegment> createEmbeddingStore(VectorStoreConfigDefinition config) {
      log.info("Creating Elasticsearch embedding store: index={}",
          config.getCollectionName());

      String indexName =
          config.getCollectionName() != null ? config.getCollectionName() : "embeddings";
      String serverUrl = config.getUrl() != null ? config.getUrl() : "http://localhost:9200";
      Map<String, Object> extra = config.getExtraProperties();

      var builder = ElasticsearchEmbeddingStore.builder()
          .serverUrl(serverUrl)
          .indexName(indexName);

      if (config.getUsername() != null && config.getPassword() != null) {
        builder.userName(config.getUsername());
        builder.password(config.getPassword());
      }
      if (extra != null && extra.containsKey("apiKey")) {
        builder.apiKey((String) extra.get("apiKey"));
      }

      return builder.build();
    }
  }
}
