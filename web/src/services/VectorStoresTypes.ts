import { ApiLocaleResult, TenantAuditingVo } from '@xcan-angus/infra';
import { ConnectionStatusEnum, VectorStoreTypeEnum } from '@/enums/enums.ts';

/** 向量存储源配置 */
export interface VectorStoreConfig {
  /** 向量存储源类型 */
  type: VectorStoreTypeEnum;
  /**
   * API端点/连接地址。当 type 为 [PINECONE, AZURE_AI_SERVICE, AZURE_COSMOS_DB] 时必须；其余类型通常使用 host+port。要求以 http:// 或 https:// 开头。
   * @example "https://example-env.us-east-1.pinecone.io"
   */
  endpoint?: string;
  /**
   * API 密钥。当 type 为 [PINECONE, AZURE_AI_SERVICE, AZURE_COSMOS_DB, TYPESENSE] 时必须。
   * @example "pcn-xxxxxxxxxxxxxxxxxxxxxxxx"
   */
  apiKey?: string;
  /**
   * 主机名。当 type 为 [REDIS, ELASTICSEARCH, OPENSEARCH, QDRANT, WEAVIATE, CHROMA, APACHE_CASSANDRA, COUCHBASE, GEMFIRE, MONGODB_ATLAS, MILVUS, PGVECTOR, MARIADB, ORACLE, SAP_HANA, NEO4J, TYPESENSE] 时须与 port 一起提供。
   * @example "127.0.0.1"
   */
  host?: string;
  /**
   * 端口号。与 host 配合使用的类型同上（见 host 字段）。
   * @format int32
   * @example 6379
   */
  port?: number;
  /**
   * 数据库名。当 type 为 [MONGODB_ATLAS, PGVECTOR, MARIADB, ORACLE, SAP_HANA, NEO4J] 时必须。
   * @example "vector_db"
   */
  database?: string;
  /**
   * 集合/表名。当 type 为 [MILVUS] 时必须，用于指定集合名称。
   * @example "embeddings"
   */
  collection?: string;
  /**
   * 用户名。当 type 为 [PGVECTOR, MARIADB, ORACLE, SAP_HANA, NEO4J] 时必须。
   * @example "app_user"
   */
  username?: string;
  /**
   * 密码。当 type 为 [PGVECTOR, MARIADB, ORACLE, SAP_HANA, NEO4J] 时必须。
   * @example "******"
   */
  password?: string;
  /**
   * 连接/请求超时(毫秒)
   * @format int32
   * @example 30000
   */
  timeout?: number;
  /**
   * 是否启用 SSL/TLS
   * @example false
   */
  sslEnabled?: boolean;
  /**
   * 连接池最大连接数
   * @format int32
   * @example 10
   */
  maxConnections?: number;
  /**
   * 命名空间（可选）。例如 Pinecone/Weaviate/Qdrant 的逻辑分区。
   * @example "tenantA"
   */
  namespace?: string;
  /**
   * 向量维度。必须与所用嵌入模型输出维度一致，否则入库/检索会失败。
   * 常见示例：
   * - 1536：OpenAI text-embedding-3-large/ada-002 等
   * - 1024：部分 MiniLM/Cohere 模型
   * - 768：BERT/MPNet/BGE-large 等
   * - 512：E5-base/BGE-base 等
   * - 384：all-MiniLM-L6-v2/E5-small 等
   * 不同存储会据此建索引/集合：Elasticsearch/OpenSearch dense_vector.dims、Milvus/Qdrant/Weaviate/Pinecone 的集合 schema、PGVector 列维度等。
   * @format int32
   * @min 1
   * @max 4096
   * @example 1536
   */
  dimension: number;
}

/** 创建向量存储源请求参数 */
export interface VectorStoreCreateDto {
  /** 存储源名称 */
  name: string;
  /** 数据库类型 */
  type: VectorStoreTypeEnum;
  /** 描述 */
  description?: string;
  /** 配置信息 */
  config: VectorStoreConfig;
}

/** 向量存储源详情 */
export interface VectorStoreVo extends TenantAuditingVo {
  /**
   * 存储源ID
   * @format int64
   */
  id?: string;
  /** 名称 */
  name?: string;
  /** 数据库类型 */
  type?: VectorStoreTypeEnum;
  /** 描述 */
  description?: string;
  /** 状态 */
  status?: ConnectionStatusEnum;
  /** 是否启用 */
  enabled?: boolean;
  /**
   * 索引数量
   * @format int64
   */
  indexCount?: number;
  /** 配置信息 */
  config?: VectorStoreConfig;
}

/** The API response result of supporting international message. */
export type VectorStoreResult = ApiLocaleResult & {
  /** Actual response data or error details. */
  data?: VectorStoreVo;
};

/** 连接测试请求参数 */
export interface ConnectionTestDto {
  /**
   * 超时时间（秒）
   * @format int32
   * @example 30
   */
  timeout?: number;
  /** 向量存储配置 */
  config?: VectorStoreConfig;
}

/** 测试详情 */
export interface ConnectionTestDetails {
  /**
   * 索引数量
   * @format int64
   */
  indexCount?: number;
  /**
   * 向量维度
   * @format int32
   */
  dimension?: number;
  /**
   * 响应时间（毫秒）
   * @format int64
   */
  responseTime?: number;
  /** 数据库版本 */
  version?: string;
}

/** 连接测试结果 */
export interface ConnectionTestVo {
  /** 是否成功 */
  success?: boolean;
  /** 状态 */
  status?: ConnectionStatusEnum;
  /** 测试连接返回信息 */
  message?: string;
  /** 测试详情 */
  testDetails?: ConnectionTestDetails;
}

/** The API response result of supporting international message. */
export type ConnectionTestResult = ApiLocaleResult & {
  /** Actual response data or error details. */
  data?: ConnectionTestVo;
};

/** 更新向量存储源请求参数 */
export interface VectorStoreUpdateDto {
  /** 存储源名称 */
  name: string;
  /** 描述 */
  description?: string;
  /** 配置信息 */
  config: VectorStoreConfig;
}

export interface PageResultVectorStoreVo {
  /**
   * Total number
   * @format int64
   * @example 10
   */
  total?: number;
  /** Page data */
  list?: VectorStoreVo[];
}

/** The API response result of supporting international message. */
export type PageResultVectorStoreResult = ApiLocaleResult & {
  /** Actual response data or error details. */
  data?: PageResultVectorStoreVo;
};

/** 总体统计 */
export interface VectorStoreOverview {
  /**
   * 存储源总数
   * @format int64
   */
  totalStores?: number;
  /**
   * 已连接数
   * @format int64
   */
  connectedStores?: number;
  /**
   * 向量总数
   * @format int64
   */
  totalVectors?: number;
  /**
   * 今日查询数
   * @format int64
   */
  todayQueries?: number;
}

/** 性能趋势 */
export interface VectorStorePerformanceTrend {
  /**
   * 时间戳
   * @format int64
   */
  timestamp?: number;
  /** 日期 */
  date?: string;
  /**
   * 总查询数
   * @format int64
   */
  totalQueries?: number;
  /**
   * 平均响应时间（毫秒）
   * @format int64
   */
  avgResponseTime?: number;
  /**
   * 错误率（百分比）
   * @format double
   */
  errorRate?: number;
}

/** 使用率排行 */
export interface VectorStoreTopStore {
  /**
   * 存储源ID
   * @format int64
   */
  id?: string;
  /** 名称 */
  name?: string;
  /** 类型 */
  type?: VectorStoreTypeEnum;
  /**
   * 查询次数
   * @format int64
   */
  queryCount?: number;
  /**
   * 索引数量
   * @format int64
   */
  indexCount?: number;
  /**
   * 平均响应时间（毫秒）
   * @format int64
   */
  avgResponseTime?: number;
}

/** 类型分布 */
export interface VectorStoreTypeDistribution {
  /** 类型 */
  type?: VectorStoreTypeEnum;
  /**
   * 数量
   * @format int64
   */
  count?: number;
  /**
   * 百分比
   * @format double
   */
  percentage?: number;
}

/** 向量存储源统计信息 */
export interface VectorStoreStatisticsVo {
  /** 总体统计 */
  overview?: VectorStoreOverview;
  /** 近一月趋势 */
  lastMonthGrowthTrend?: VectorStoreOverview;
  /** 类型分布 */
  typeDistribution?: VectorStoreTypeDistribution[];
  /** 使用率排行 */
  topStores?: VectorStoreTopStore[];
  /** 性能趋势 */
  performanceTrend?: VectorStorePerformanceTrend[];
}

/** The API response result of supporting international message. */
export type VectorStoreStatisticsResult = ApiLocaleResult & {
  /** Actual response data or error details. */
  data?: VectorStoreStatisticsVo;
};

/** 排序字段 */
export enum VectorStoreListParamsOrderByEnum {
  Id = 'id',
  Name = 'name',
  CreatedDate = 'createdDate',
  Type = 'type',
  Status = 'status',
}
