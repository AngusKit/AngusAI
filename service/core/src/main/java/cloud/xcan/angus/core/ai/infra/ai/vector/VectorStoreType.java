package cloud.xcan.angus.core.ai.infra.ai.vector;

import lombok.Getter;

/**
 * 向量数据库类型枚举
 */
@Getter
public enum VectorStoreType {
  AZURE_AI_SERVICE, // Azure AI Service
  AZURE_COSMOS_DB, // Azure Cosmos DB
  APACHE_CASSANDRA, // Apache Cassandra Vector Store
  CHROMA, // Chroma
  COUCHBASE, // Couchbase
  ELASTICSEARCH, // Elasticsearch
  GEMFIRE, // GemFire
  MARIADB, // MariaDB Vector Store
  MILVUS, // Milvus
  MONGODB_ATLAS, // MongoDB Atlas
  NEO4J, // Neo4j
  OPENSEARCH, // OpenSearch
  ORACLE, // Oracle
  PGVECTOR, // PGvector
  PINECONE, // Pinecone
  QDRANT, // Qdrant
  REDIS, // Redis
  SAP_HANA, // SAP Hana
  TYPESENSE, // Typesense
  WEAVIATE; // Weaviate

}
