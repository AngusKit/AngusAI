package cloud.xcan.angus.core.ai.domain.vector;

import cloud.xcan.angus.core.ai.infra.ai.vector.VectorStoreType;
import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.media.Schema.AccessMode;
import io.swagger.v3.oas.annotations.media.Schema.RequiredMode;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.ToString;
import org.apache.commons.lang3.StringUtils;
import org.hibernate.validator.constraints.Length;

@Data
@ToString(exclude = {"apiKey", "password"})
@Schema(name = "VectorStoreConfig", description = "向量存储配置：不同类型(VectorStoreType)的向量库需要的字段各不相同，具体见字段说明。")
public class VectorStoreConfig {

  @NotNull
  @Schema(description = "向量存储源类型", requiredMode = RequiredMode.REQUIRED)
  private VectorStoreType type;

  @Length(max = 500)
  @Schema(
      description = "API端点/连接地址。当 type 为 [PINECONE, AZURE_AI_SERVICE, AZURE_COSMOS_DB] 时必须；其余类型通常使用 host+port。要求以 http:// 或 https:// 开头。",
      example = "https://example-env.us-east-1.pinecone.io")
  private String endpoint;

  @Length(max = 4096)
  @Schema(
      description = "API 密钥。当 type 为 [PINECONE, AZURE_AI_SERVICE, AZURE_COSMOS_DB, TYPESENSE] 时必须。",
      accessMode = AccessMode.WRITE_ONLY,
      example = "pcn-xxxxxxxxxxxxxxxxxxxxxxxx")
  @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
  private String apiKey;

  @Length(max = 255)
  @Schema(
      description = "主机名。当 type 为 [REDIS, ELASTICSEARCH, OPENSEARCH, QDRANT, WEAVIATE, CHROMA, APACHE_CASSANDRA, COUCHBASE, GEMFIRE, MONGODB_ATLAS, MILVUS, PGVECTOR, MARIADB, ORACLE, SAP_HANA, NEO4J, TYPESENSE] 时须与 port 一起提供。",
      example = "127.0.0.1")
  private String host;

  @Min(1)
  @Max(65535)
  @Schema(
      description = "端口号。与 host 配合使用的类型同上（见 host 字段）。",
      example = "6379")
  private Integer port;

  @Length(max = 255)
  @Schema(
      description = "数据库名。当 type 为 [MONGODB_ATLAS, PGVECTOR, MARIADB, ORACLE, SAP_HANA, NEO4J] 时必须。",
      example = "vector_db")
  private String database;

  @Length(max = 255)
  @Schema(
      description = "集合/表名。当 type 为 [MILVUS] 时必须，用于指定集合名称。",
      example = "embeddings")
  private String collection;

  @Length(max = 255)
  @Schema(
      description = "用户名。当 type 为 [PGVECTOR, MARIADB, ORACLE, SAP_HANA, NEO4J] 时必须。",
      example = "app_user")
  private String username;

  @Length(max = 4096)
  @Schema(
      description = "密码。当 type 为 [PGVECTOR, MARIADB, ORACLE, SAP_HANA, NEO4J] 时必须。",
      accessMode = AccessMode.WRITE_ONLY,
      example = "******")
  @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
  private String password;

  @Min(1000)
  @Max(600000)
  @Schema(description = "连接/请求超时(毫秒)", example = "30000")
  private Integer timeout = 30000;

  @Schema(description = "是否启用 SSL/TLS", example = "false")
  private Boolean sslEnabled = false;

  @Min(1)
  @Max(1000)
  @Schema(description = "连接池最大连接数", example = "10")
  private Integer maxConnections = 10;

  @Length(max = 255)
  @Schema(description = "命名空间（可选）。例如 Pinecone/Weaviate/Qdrant 的逻辑分区。", example = "tenantA")
  private String namespace;

  // TODO 在接口实现处加入一次运行时校验（例如校验已存在集合/索引的维度与请求一致），并在失败时返回可读的错误提示
  @NotNull
  @Min(1)
  @Max(4096)
  @Schema(
      description = """
          向量维度。必须与所用嵌入模型输出维度一致，否则入库/检索会失败。
          常见示例：
          - 1536：OpenAI text-embedding-3-large/ada-002 等
          - 1024：部分 MiniLM/Cohere 模型
          - 768：BERT/MPNet/BGE-large 等
          - 512：E5-base/BGE-base 等
          - 384：all-MiniLM-L6-v2/E5-small 等
          不同存储会据此建索引/集合：Elasticsearch/OpenSearch dense_vector.dims、Milvus/Qdrant/Weaviate/Pinecone 的集合 schema、PGVector 列维度等。""",
      requiredMode = RequiredMode.REQUIRED,
      example = "1536",
      minimum = "1",
      maximum = "4096")
  private Integer dimension;

  /**
   * 按类型校验必要的连接配置，抛出 IllegalArgumentException 表示配置不完整/不合法。
   */
  public void validateVectorDataSourceConfig() {
    if (type == null) {
      throw new IllegalArgumentException("Vector data source type must be specified");
    }

    // 根据不同类型验证必要参数
    switch (type) {
      case REDIS:
      case ELASTICSEARCH:
      case OPENSEARCH:
      case QDRANT:
      case WEAVIATE:
      case CHROMA:
      case APACHE_CASSANDRA:
      case COUCHBASE:
      case GEMFIRE:
        requireHostAndPort(type);
        break;

      case MONGODB_ATLAS:
        // Atlas 通常需要 host+port，推荐提供 database
        requireHostAndPort(type);
        if (StringUtils.isBlank(database)) {
          throw new IllegalArgumentException("Database is required for " + type);
        }
        break;

      case MILVUS:
        requireHostAndPort(type);
        if (StringUtils.isBlank(collection)) {
          throw new IllegalArgumentException("Collection is required for " + type);
        }
        break;

      case PGVECTOR:
      case MARIADB:
      case ORACLE:
      case SAP_HANA:
      case NEO4J:
        requireHostAndPort(type);
        if (StringUtils.isBlank(database)) {
          throw new IllegalArgumentException("Database is required for " + type);
        }
        if (StringUtils.isBlank(username) || StringUtils.isBlank(password)) {
          throw new IllegalArgumentException("Username and password are required for " + type);
        }
        break;

      case TYPESENSE:
        requireHostAndPort(type);
        if (StringUtils.isBlank(apiKey)) {
          throw new IllegalArgumentException("API key is required for " + type);
        }
        break;

      case PINECONE:
      case AZURE_AI_SERVICE:
        if (StringUtils.isBlank(apiKey) || StringUtils.isBlank(endpoint)) {
          throw new IllegalArgumentException("API key and endpoint are required for " + type);
        }
        ensureHttpEndpoint(endpoint, type);
        break;

      case AZURE_COSMOS_DB:
        if (StringUtils.isBlank(endpoint) || StringUtils.isBlank(apiKey)) {
          throw new IllegalArgumentException(
              "Endpoint and API key are required for Azure Cosmos DB");
        }
        ensureHttpEndpoint(endpoint, type);
        break;

      default:
        // 其他类型暂不强制校验，调用方可根据需要补充
        break;
    }
  }

  private void requireHostAndPort(VectorStoreType t) {
    if (StringUtils.isBlank(host) || port == null) {
      throw new IllegalArgumentException("Host and port are required for " + t);
    }
    if (port < 1 || port > 65535) {
      throw new IllegalArgumentException("Port out of range (1-65535) for " + t);
    }
  }

  private void ensureHttpEndpoint(String url, VectorStoreType t) {
    String u = StringUtils.trimToEmpty(url).toLowerCase();
    if (!(u.startsWith("http://") || u.startsWith("https://"))) {
      throw new IllegalArgumentException("Endpoint must start with http:// or https:// for " + t);
    }
  }
}
