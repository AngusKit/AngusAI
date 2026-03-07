package cloud.xcan.agentx.vectorstore.elasticsearch;

import cloud.xcan.agentx.core.vectorstore.VectorStoreConfigDefinition;
import cloud.xcan.agentx.core.vectorstore.VectorStoreFactory;
import dev.langchain4j.data.segment.TextSegment;
import dev.langchain4j.store.embedding.EmbeddingStore;
import dev.langchain4j.store.embedding.elasticsearch.ElasticsearchEmbeddingStore;
import java.util.Map;
import lombok.extern.slf4j.Slf4j;

public class ElasticsearchAutoConfiguration {

  @Slf4j
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
