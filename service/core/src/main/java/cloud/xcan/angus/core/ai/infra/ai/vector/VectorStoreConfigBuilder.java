package cloud.xcan.angus.core.ai.infra.ai.vector;

import java.util.HashMap;

/**
 * 向量存储库配置构建器
 */
public class VectorStoreConfigBuilder {

  private final VectorStoreConfig config;

  public VectorStoreConfigBuilder(VectorStoreType storeType) {
    this.config = new VectorStoreConfig();
    this.config.setStoreType(storeType);
    this.config.setCustomParams(new HashMap<>());
  }

  /**
   * 设置连接字符串
   */
  public VectorStoreConfigBuilder connectionString(String connectionString) {
    config.setConnectionString(connectionString);
    return this;
  }

  /**
   * 设置主机和端口
   */
  public VectorStoreConfigBuilder hostAndPort(String host, Integer port) {
    config.setHost(host);
    config.setPort(port);
    return this;
  }

  /**
   * 设置数据库
   */
  public VectorStoreConfigBuilder database(String database) {
    config.setDatabase(database);
    return this;
  }

  /**
   * 设置集合/表名
   */
  public VectorStoreConfigBuilder collection(String collection) {
    config.setCollection(collection);
    return this;
  }

  /**
   * 设置认证信息
   */
  public VectorStoreConfigBuilder credentials(String username, String password) {
    config.setUsername(username);
    config.setPassword(password);
    return this;
  }

  /**
   * 设置API密钥
   */
  public VectorStoreConfigBuilder apiKey(String apiKey) {
    config.setApiKey(apiKey);
    return this;
  }

  /**
   * 设置API端点
   */
  public VectorStoreConfigBuilder apiEndpoint(String apiEndpoint) {
    config.setApiEndpoint(apiEndpoint);
    return this;
  }

  /**
   * 设置向量维度
   */
  public VectorStoreConfigBuilder dimension(Integer dimension) {
    config.setDimension(dimension);
    return this;
  }

  /**
   * 设置索引名称
   */
  public VectorStoreConfigBuilder indexName(String indexName) {
    config.setIndexName(indexName);
    return this;
  }

  /**
   * 设置超时时间
   */
  public VectorStoreConfigBuilder timeout(Integer timeout) {
    config.setTimeout(timeout);
    return this;
  }

  /**
   * 设置最大连接数
   */
  public VectorStoreConfigBuilder maxConnections(Integer maxConnections) {
    config.setMaxConnections(maxConnections);
    return this;
  }

  /**
   * 启用SSL
   */
  public VectorStoreConfigBuilder enableSsl() {
    config.setSslEnabled(true);
    return this;
  }

  /**
   * 设置SSL证书路径
   */
  public VectorStoreConfigBuilder sslCertPath(String sslCertPath) {
    config.setSslCertPath(sslCertPath);
    return this;
  }

  /**
   * 设置区域
   */
  public VectorStoreConfigBuilder region(String region) {
    config.setRegion(region);
    return this;
  }

  /**
   * 设置项目ID
   */
  public VectorStoreConfigBuilder projectId(String projectId) {
    config.setProjectId(projectId);
    return this;
  }

  /**
   * 设置命名空间
   */
  public VectorStoreConfigBuilder namespace(String namespace) {
    config.setNamespace(namespace);
    return this;
  }

  /**
   * 设置存储桶名称 (Couchbase)
   */
  public VectorStoreConfigBuilder bucket(String bucket) {
    config.setBucket(bucket);
    return this;
  }

  /**
   * 设置作用域名称 (Couchbase)
   */
  public VectorStoreConfigBuilder scope(String scope) {
    config.setScope(scope);
    return this;
  }

  /**
   * 设置表空间名称 (Oracle)
   */
  public VectorStoreConfigBuilder tablespace(String tablespace) {
    config.setTablespace(tablespace);
    return this;
  }

  /**
   * 设置模式名称 (PostgreSQL)
   */
  public VectorStoreConfigBuilder schema(String schema) {
    config.setSchema(schema);
    return this;
  }

  /**
   * 添加自定义参数
   */
  public VectorStoreConfigBuilder customParam(String key, Object value) {
    config.getCustomParams().put(key, value);
    return this;
  }

  /**
   * 构建配置
   */
  public VectorStoreConfig build() {
    return config;
  }

  // 静态工厂方法

  /**
   * 创建Azure AI Service配置
   */
  public static VectorStoreConfigBuilder azureAIService(String apiKey, String apiEndpoint) {
    return new VectorStoreConfigBuilder(VectorStoreType.AZURE_AI_SERVICE)
        .apiKey(apiKey)
        .apiEndpoint(apiEndpoint);
  }

  /**
   * 创建Azure Cosmos DB配置
   */
  public static VectorStoreConfigBuilder azureCosmosDB(String connectionString) {
    return new VectorStoreConfigBuilder(VectorStoreType.AZURE_COSMOS_DB)
        .connectionString(connectionString);
  }

  /**
   * 创建Chroma配置
   */
  public static VectorStoreConfigBuilder chroma(String host, Integer port) {
    return new VectorStoreConfigBuilder(VectorStoreType.CHROMA)
        .hostAndPort(host, port);
  }

  /**
   * 创建Couchbase配置
   */
  public static VectorStoreConfigBuilder couchbase(String host, Integer port, String username,
      String password, String bucket) {
    return new VectorStoreConfigBuilder(VectorStoreType.COUCHBASE)
        .hostAndPort(host, port)
        .credentials(username, password)
        .bucket(bucket);
  }

  public static VectorStoreConfigBuilder elasticsearch(String host, Integer port,
      String indexName) {
    return new VectorStoreConfigBuilder(VectorStoreType.ELASTICSEARCH)
        .hostAndPort(host, port)
        .indexName(indexName);
  }

  /**
   * 创建Milvus配置
   */
  public static VectorStoreConfigBuilder milvus(String host, Integer port, String collection) {
    return new VectorStoreConfigBuilder(VectorStoreType.MILVUS)
        .hostAndPort(host, port)
        .collection(collection);
  }

  /**
   * 创建MongoDB Atlas配置
   */
  public static VectorStoreConfigBuilder mongodbAtlas(String connectionString) {
    return new VectorStoreConfigBuilder(VectorStoreType.MONGODB_ATLAS)
        .connectionString(connectionString);
  }

  /**
   * 创建Neo4j配置
   */
  public static VectorStoreConfigBuilder neo4j(String host, Integer port, String username,
      String password) {
    return new VectorStoreConfigBuilder(VectorStoreType.NEO4J)
        .hostAndPort(host, port)
        .credentials(username, password);
  }

  /**
   * 创建PGvector配置
   */
  public static VectorStoreConfigBuilder pgvector(String host, Integer port, String database,
      String username, String password) {
    return new VectorStoreConfigBuilder(VectorStoreType.PGVECTOR)
        .hostAndPort(host, port)
        .database(database)
        .credentials(username, password);
  }

  /**
   * 创建Pinecone配置
   */
  public static VectorStoreConfigBuilder pinecone(String apiKey, String apiEndpoint) {
    return new VectorStoreConfigBuilder(VectorStoreType.PINECONE)
        .apiKey(apiKey)
        .apiEndpoint(apiEndpoint);
  }

  /**
   * 创建Qdrant配置
   */
  public static VectorStoreConfigBuilder qdrant(String host, Integer port) {
    return new VectorStoreConfigBuilder(VectorStoreType.QDRANT)
        .hostAndPort(host, port);
  }

  /**
   * 创建Redis配置
   */
  public static VectorStoreConfigBuilder redis(String host, Integer port) {
    return new VectorStoreConfigBuilder(VectorStoreType.REDIS)
        .hostAndPort(host, port);
  }

  /**
   * 创建Weaviate配置
   */
  public static VectorStoreConfigBuilder weaviate(String host, Integer port) {
    return new VectorStoreConfigBuilder(VectorStoreType.WEAVIATE)
        .hostAndPort(host, port);
  }
}
