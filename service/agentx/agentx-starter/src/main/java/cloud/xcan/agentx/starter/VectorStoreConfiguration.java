package cloud.xcan.agentx.starter;

import cloud.xcan.agentx.vectorstore.chroma.ChromaAutoConfiguration;
import cloud.xcan.agentx.vectorstore.elasticsearch.ElasticsearchAutoConfiguration;
import cloud.xcan.agentx.vectorstore.mariadb.MariaDbAutoConfiguration;
import cloud.xcan.agentx.vectorstore.milvus.MilvusAutoConfiguration;
import cloud.xcan.agentx.vectorstore.pgvector.PgVectorAutoConfiguration;
import cloud.xcan.agentx.vectorstore.qdrant.QdrantAutoConfiguration;
import cloud.xcan.agentx.vectorstore.weaviate.WeaviateAutoConfiguration;
import cloud.xcan.agentx.core.vectorstore.VectorStoreFactory;
import org.springframework.boot.autoconfigure.condition.ConditionalOnClass;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * AgentX 向量存储 Bean 集中注册 — 基于 classpath 条件按需加载
 */
@Configuration
public class VectorStoreConfiguration {

  @Configuration
  @ConditionalOnClass(name = "cloud.xcan.agentx.vectorstore.pgvector.PgVectorAutoConfiguration")
  static class PgVectorConfig {

    @Bean
    public VectorStoreFactory pgVectorStoreFactory() {
      return new PgVectorAutoConfiguration.PgVectorStoreFactory();
    }
  }

  @Configuration
  @ConditionalOnClass(name = "cloud.xcan.agentx.vectorstore.milvus.MilvusAutoConfiguration")
  static class MilvusConfig {

    @Bean
    public VectorStoreFactory milvusVectorStoreFactory() {
      return new MilvusAutoConfiguration.MilvusStoreFactory();
    }
  }

  @Configuration
  @ConditionalOnClass(name = "cloud.xcan.agentx.vectorstore.qdrant.QdrantAutoConfiguration")
  static class QdrantConfig {

    @Bean
    public VectorStoreFactory qdrantVectorStoreFactory() {
      return new QdrantAutoConfiguration.QdrantStoreFactory();
    }
  }

  @Configuration
  @ConditionalOnClass(name = "cloud.xcan.agentx.vectorstore.chroma.ChromaAutoConfiguration")
  static class ChromaConfig {

    @Bean
    public VectorStoreFactory chromaVectorStoreFactory() {
      return new ChromaAutoConfiguration.ChromaStoreFactory();
    }
  }

  @Configuration
  @ConditionalOnClass(name = "cloud.xcan.agentx.vectorstore.elasticsearch.ElasticsearchAutoConfiguration")
  static class ElasticsearchConfig {

    @Bean
    public VectorStoreFactory elasticsearchVectorStoreFactory() {
      return new ElasticsearchAutoConfiguration.ElasticsearchStoreFactory();
    }
  }

  @Configuration
  @ConditionalOnClass(name = "cloud.xcan.agentx.vectorstore.weaviate.WeaviateAutoConfiguration")
  static class WeaviateConfig {

    @Bean
    public VectorStoreFactory weaviateVectorStoreFactory() {
      return new WeaviateAutoConfiguration.WeaviateStoreFactory();
    }
  }

  @Configuration
  @ConditionalOnClass(name = "cloud.xcan.agentx.vectorstore.mariadb.MariaDbAutoConfiguration")
  static class MariaDbConfig {

    @Bean
    public VectorStoreFactory mariaDbVectorStoreFactory() {
      return new MariaDbAutoConfiguration.MariaDbVectorStoreFactory();
    }
  }
}
