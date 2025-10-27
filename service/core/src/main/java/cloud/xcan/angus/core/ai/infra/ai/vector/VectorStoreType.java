package cloud.xcan.angus.core.ai.infra.ai.vector;

/**
 * 向量数据库类型枚举
 */
public enum VectorStoreType {
  AZURE_AI_SERVICE("Azure AI Service"),
  AZURE_COSMOS_DB("Azure Cosmos DB"),
  APACHE_CASSANDRA("Apache Cassandra Vector Store"),
  CHROMA("Chroma"),
  COUCHBASE("Couchbase"),
  ELASTICSEARCH("Elasticsearch"),
  GEMFIRE("GemFire"),
  MARIADB("MariaDB Vector Store"),
  MILVUS("Milvus"),
  MONGODB_ATLAS("MongoDB Atlas"),
  NEO4J("Neo4j"),
  OPENSEARCH("OpenSearch"),
  ORACLE("Oracle"),
  PGVECTOR("PGvector"),
  PINECONE("Pinecone"),
  QDRANT("Qdrant"),
  REDIS("Redis"),
  SAP_HANA("SAP Hana"),
  TYPESENSE("Typesense"),
  WEAVIATE("Weaviate");

  private final String displayName;

  VectorStoreType(String displayName) {
    this.displayName = displayName;
  }

  public String getDisplayName() {
    return displayName;
  }
}
