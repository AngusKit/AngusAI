package cloud.xcan.agentx.vectorstore.elasticsearch;

import cloud.xcan.agentx.core.vectorstore.VectorStoreConfigDefinition;
import cloud.xcan.agentx.core.vectorstore.VectorStoreFactory;
import cloud.xcan.agentx.core.vectorstore.VectorStoreType;
import dev.langchain4j.data.segment.TextSegment;
import dev.langchain4j.store.embedding.EmbeddingStore;
import dev.langchain4j.store.embedding.elasticsearch.ElasticsearchEmbeddingStore;
import java.util.Map;
import lombok.extern.slf4j.Slf4j;

public class ElasticsearchAutoConfiguration {

  @Slf4j
  public static class ElasticsearchStoreFactory implements VectorStoreFactory {

    @Override
    public VectorStoreType getType() {
      return VectorStoreType.ELASTICSEARCH;
    }

    @Override
    public EmbeddingStore<TextSegment> createEmbeddingStore(VectorStoreConfigDefinition config) {
      log.info("Creating Elasticsearch embedding store: index={}",
          config.getCollectionName());

      String indexName = config.getEffectiveCollectionName();
      String serverUrl = config.getEffectiveUrl() != null ? config.getEffectiveUrl() : "http://localhost:9200";
      Map<String, Object> extra = config.getExtraProperties();

      var builder = ElasticsearchEmbeddingStore.builder()
          .serverUrl(serverUrl)
          .indexName(indexName);

      if (config.getUsername() != null && config.getPassword() != null) {
        builder.userName(config.getUsername());
        builder.password(config.getPassword());
      }
      String apiKey = config.getApiKey() != null ? config.getApiKey() : config.getExtra("apiKey", String.class);
      if (apiKey != null) {
        builder.apiKey(apiKey);
      }

      return builder.build();
    }
  }
}
