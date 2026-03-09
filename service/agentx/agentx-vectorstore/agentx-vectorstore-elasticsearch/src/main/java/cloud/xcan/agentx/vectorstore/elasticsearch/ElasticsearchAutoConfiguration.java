package cloud.xcan.agentx.vectorstore.elasticsearch;

import cloud.xcan.agentx.core.vectorstore.VectorStoreConfigDefinition;
import cloud.xcan.agentx.core.vectorstore.VectorStoreFactory;
import cloud.xcan.agentx.core.vectorstore.VectorStoreType;
import dev.langchain4j.data.segment.TextSegment;
import dev.langchain4j.store.embedding.EmbeddingStore;
import dev.langchain4j.store.embedding.elasticsearch.ElasticsearchEmbeddingStore;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import lombok.extern.slf4j.Slf4j;
import org.apache.http.Header;
import org.apache.http.HttpHost;
import org.apache.http.message.BasicHeader;
import org.elasticsearch.client.RestClient;
import org.elasticsearch.client.RestClientBuilder;

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
      String serverUrl =
          config.getEffectiveUrl() != null ? config.getEffectiveUrl() : "http://localhost:9200";
      if (!serverUrl.contains("://")) {
        serverUrl = "http://" + serverUrl;
      }

      RestClientBuilder clientBuilder = RestClient.builder(HttpHost.create(serverUrl));

      // 认证：优先 API Key，其次 Basic Auth
      String apiKey = config.getApiKey() != null
          ? config.getApiKey() : config.getExtra("apiKey", String.class);
      if (apiKey != null && !apiKey.isBlank()) {
        clientBuilder.setDefaultHeaders(new Header[]{
            new BasicHeader("Authorization", "ApiKey " + apiKey)
        });
      } else if (config.getUsername() != null && config.getPassword() != null) {
        String creds = config.getUsername() + ":" + config.getPassword();
        String encoded = Base64.getEncoder().encodeToString(creds.getBytes(StandardCharsets.UTF_8));
        clientBuilder.setDefaultHeaders(new Header[]{
            new BasicHeader("Authorization", "Basic " + encoded)
        });
      }

      RestClient restClient = clientBuilder.build();

      return ElasticsearchEmbeddingStore.builder()
          .restClient(restClient)
          .indexName(indexName)
          .build();
    }
  }
}
