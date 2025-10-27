package cloud.xcan.angus.core.ai.infra.ai.vector;

import java.util.Map;
import lombok.Data;

/**
 * 向量存储库配置类
 * <p>
 * 用于配置不同类型的向量数据库连接参数和操作选项
 */
@Data
public class VectorStoreConfig {

  /**
   * 向量存储库类型 指定要使用的向量数据库类型，如 Pinecone、Milvus、Redis 等
   */
  private VectorStoreType storeType;

  /**
   * 连接字符串 完整的数据库连接字符串，适用于 MongoDB Atlas、Azure Cosmos DB 等 格式示例:
   * mongodb+srv://username:password@cluster.mongodb.net/database
   */
  private String connectionString;

  /**
   * 主机地址 向量数据库服务器的主机名或IP地址 例如: localhost, 192.168.1.100, vector-db.example.com
   */
  private String host;

  /**
   * 端口号 向量数据库服务的端口号 常见端口: Redis(6379), Milvus(19530), Elasticsearch(9200), Chroma(8000)
   */
  private Integer port;

  /**
   * 数据库名称 目标数据库的名称，适用于关系型数据库和文档数据库 例如: vector_db, embeddings, search_index
   */
  private String database;

  /**
   * 集合名称 向量数据的集合或表名，用于存储向量数据 例如: documents, embeddings, vectors
   */
  private String collection;

  /**
   * 用户名 数据库连接的用户名，用于身份验证
   */
  private String username;

  /**
   * 密码 数据库连接的密码，用于身份验证 建议使用环境变量或加密存储
   */
  private String password;

  /**
   * API密钥 云服务提供商的API密钥，用于访问云向量数据库 适用于: Pinecone, Qdrant, Weaviate, Azure AI Service
   */
  private String apiKey;

  /**
   * API端点 云服务的API端点URL 例如: https://your-project.svc.pinecone.io, https://api.qdrant.io
   */
  private String apiEndpoint;

  /**
   * 向量维度 向量数据的维度大小，必须与存储的向量维度一致 常见维度: OpenAI(1536), Sentence-BERT(384), BERT(768)
   */
  private Integer dimension;

  /**
   * 索引名称 Elasticsearch/OpenSearch 中的索引名称 用于组织和搜索向量数据
   */
  private String indexName;

  /**
   * 自定义参数 特定数据库的额外配置参数 例如: {"batch_size": 1000, "distance_metric": "cosine"}
   */
  private Map<String, Object> customParams;

  /**
   * 连接超时时间（毫秒） 建立连接的最大等待时间 默认值: 30000ms (30秒)
   */
  private Integer timeout;

  /**
   * 最大连接数 连接池中的最大连接数量 默认值: 10
   */
  private Integer maxConnections;

  /**
   * 是否启用SSL 是否使用SSL/TLS加密连接 生产环境建议启用
   */
  private Boolean sslEnabled;

  /**
   * SSL证书路径 SSL证书文件的路径 用于自定义SSL证书验证
   */
  private String sslCertPath;

  /**
   * 区域 云服务的地理区域 例如: us-east-1, eu-west-1, ap-southeast-1
   */
  private String region;

  /**
   * 项目ID 云服务中的项目标识符 用于多项目环境中的资源隔离
   */
  private String projectId;

  /**
   * 命名空间 数据隔离的命名空间 用于多租户环境中的数据分离
   */
  private String namespace;

  /**
   * 存储桶名称 Couchbase 中的存储桶名称 用于 Couchbase 向量存储库
   */
  private String bucket;

  /**
   * 作用域名称 Couchbase 中的作用域名称 用于 Couchbase 向量存储库
   */
  private String scope;

  /**
   * 表空间名称 Oracle 数据库中的表空间名称 用于 Oracle 向量存储库
   */
  private String tablespace;

  /**
   * 模式名称 PostgreSQL 数据库中的模式名称 用于 PGvector 存储库
   */
  private String schema;

  /**
   * 验证配置是否完整 根据不同的存储库类型检查必需的配置参数
   *
   * @return true 如果配置有效，false 如果配置不完整
   */
  public boolean isValid() {
    if (storeType == null) {
      return false;
    }

    switch (storeType) {
      case AZURE_AI_SERVICE:
        // Azure AI Service 需要 API 密钥和端点
        return apiKey != null && apiEndpoint != null;

      case AZURE_COSMOS_DB:
        // Azure Cosmos DB 需要连接字符串或主机+端口+数据库
        return connectionString != null || (host != null && port != null && database != null);

      case APACHE_CASSANDRA:
        // Apache Cassandra 需要主机、端口和数据库（keyspace）
        return host != null && port != null && database != null;

      case CHROMA:
        // Chroma 需要主机和端口
        return host != null && port != null;

      case COUCHBASE:
        // Couchbase 需要主机、端口、用户名、密码和存储桶
        return host != null && port != null && username != null && password != null
            && bucket != null;

      case ELASTICSEARCH:
      case OPENSEARCH:
        // Elasticsearch/OpenSearch 需要主机、端口和索引名
        return host != null && port != null && indexName != null;

      case GEMFIRE:
        // GemFire 需要主机、端口和区域
        return host != null && port != null && region != null;

      case MARIADB:
        // MariaDB 需要主机、端口、数据库、用户名和密码
        return host != null && port != null && database != null && username != null
            && password != null;

      case MILVUS:
        // Milvus 需要主机、端口和集合名
        return host != null && port != null && collection != null;

      case MONGODB_ATLAS:
        // MongoDB Atlas 需要连接字符串或主机+端口+数据库
        return connectionString != null || (host != null && port != null && database != null);

      case NEO4J:
        // Neo4j 需要主机、端口、用户名和密码
        return host != null && port != null && username != null && password != null;

      case ORACLE:
        // Oracle 需要主机、端口、数据库（服务名）、用户名和密码
        return host != null && port != null && database != null && username != null
            && password != null;

      case PGVECTOR:
        // PGvector 需要主机、端口、数据库、用户名和密码
        return host != null && port != null && database != null && username != null
            && password != null;

      case PINECONE:
        // Pinecone 需要 API 密钥和端点
        return apiKey != null && apiEndpoint != null;

      case QDRANT:
        // Qdrant 需要主机和端口
        return host != null && port != null;

      case REDIS:
        // Redis 需要主机和端口
        return host != null && port != null;

      case SAP_HANA:
        // SAP HANA 需要主机、端口、数据库、用户名和密码
        return host != null && port != null && username != null && password != null;

      case TYPESENSE:
        // Typesense 需要主机、端口和 API 密钥
        return host != null && port != null && apiKey != null;

      case WEAVIATE:
        // Weaviate 需要主机和端口
        return host != null && port != null;

      default:
        return false;
    }
  }
}
