// Node Related Enums
export enum NodeSource {
  OWN_NODE = 'OWN_NODE',
  ONLINE_BUY = 'ONLINE_BUY',
}

/** 工作流类型 */
export enum WorkflowTypeEnum {
  SINGLE_TASK = 'SINGLE_TASK',
  MULTI_TURN = 'MULTI_TURN',
  SCHEDULED = 'SCHEDULED',
  EVENT_DRIVEN = 'EVENT_DRIVEN',
}

/** 工作流状态 */
export enum WorkflowStatusEnum {
  DRAFT = 'DRAFT',
  RUNNING = 'RUNNING',
  STOPPED = 'STOPPED',
}

/** 团队规模 */
export enum TeamScaleEnum {
  MICRO = 'MICRO',
  SMALL = 'SMALL',
  MEDIUM = 'MEDIUM',
  LARGE = 'LARGE',
  ENTERPRISE = 'ENTERPRISE',
}

/** 所在行业 */
export enum IndustryEnum {
  INTERNET = 'INTERNET',
  FINANCE = 'FINANCE',
  MANUFACTURING = 'MANUFACTURING',
  RETAIL = 'RETAIL',
  EDUCATION = 'EDUCATION',
  MEDICAL = 'MEDICAL',
  ENTERTAINMENT = 'ENTERTAINMENT',
  REAL_ESTATE = 'REAL_ESTATE',
  LOGISTICS = 'LOGISTICS',
  ENERGY = 'ENERGY',
  GOVERNMENT = 'GOVERNMENT',
  CONSULTING = 'CONSULTING',
  AGRICULTURE = 'AGRICULTURE',
  OTHER = 'OTHER',
}

/** 权限 */
export enum MemberPermissionEnum {
  VIEW = 'VIEW',
  EDIT = 'EDIT',
  MANAGE = 'MANAGE',
}

/** 资源类型 */
export enum ResourceTypeEnum {
  APPLICATION = 'APPLICATION',
  WORKFLOW = 'WORKFLOW',
  DATASET = 'DATASET',
  KNOWLEDGE = 'KNOWLEDGE',
  PLUGIN = 'PLUGIN',
  MODEL = 'MODEL',
}

/** 共享范围 */
export enum SharedWithEnum {
  ALL = 'ALL',
  SPECIFIC = 'SPECIFIC',
}

/** 插件分类 */
export enum PluginCategoryEnum {
  TOOLS = 'TOOLS',
  DATASOURCE = 'DATASOURCE',
  NOTIFICATION = 'NOTIFICATION',
  FILE_PROCESSING = 'FILE_PROCESSING',
  SEARCH = 'SEARCH',
  ANALYTICS = 'ANALYTICS',
  INTEGRATION = 'INTEGRATION',
  OTHER = 'OTHER',
}

/** 插件状态 */
export enum PluginStatusEnum {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  UNINSTALLED = 'UNINSTALLED',
  MAINTENANCE = 'MAINTENANCE',
  DEPRECATED = 'DEPRECATED',
}

/** 插件类型 */
export enum PluginTypeEnum {
  API = 'API',
  TOOL = 'TOOL',
  DATASOURCE = 'DATASOURCE',
  EXTENSION = 'EXTENSION',
  THEME = 'THEME',
}

/** 模型类型 */
export enum ModelTypeEnum {
  CHAT = 'CHAT',
  IMAGE = 'IMAGE',
  AUDIO = 'AUDIO',
  EMBEDDING = 'EMBEDDING',
  MODERATION = 'MODERATION',
}

/** 模型提供商 */
export enum ModelProviderEnum {
  OPENAI = 'OPENAI',
  ANTHROPIC = 'ANTHROPIC',
  AZURE_OPENAI = 'AZURE_OPENAI',
  GOOGLE_VERTEXAI = 'GOOGLE_VERTEXAI',
  AMAZON_BEDROCK = 'AMAZON_BEDROCK',
  OLLAMA = 'OLLAMA',
  HUGGINGFACE = 'HUGGINGFACE',
  ONNX_TRANSFORMERS = 'ONNX_TRANSFORMERS',
  POSTGRESML = 'POSTGRESML',
  MISTRAL_AI = 'MISTRAL_AI',
  DEEPSEEK = 'DEEPSEEK',
  MOONSHOT_AI = 'MOONSHOT_AI',
  ZHIPU_AI = 'ZHIPU_AI',
  MINIMAX = 'MINIMAX',
  GROQ = 'GROQ',
  NVIDIA = 'NVIDIA',
  OCI_GENAI = 'OCI_GENAI',
  PERPLEXITY = 'PERPLEXITY',
  QIANFAN = 'QIANFAN',
  STABILITY = 'STABILITY',
  LOCAL = 'LOCAL',
  CUSTOM = 'CUSTOM',
}

export enum ModelFeaturesEnum {
  MULTIMODALITY = 'MULTIMODALITY',
  TOOLS_FUNCTIONS = 'TOOLS_FUNCTIONS',
  STREAMING = 'STREAMING',
  RETRY = 'RETRY',
  OBSERVABILITY = 'OBSERVABILITY',
  BUILT_IN_JSON = 'BUILT_IN_JSON',
  LOCAL = 'LOCAL',
  OPENAI_API_COMPATIBLE = 'OPENAI_API_COMPATIBLE',
}

/** 模型状态 */
export enum ModelStatusEnum {
  STOPPED = 'STOPPED',
  RUNNING = 'RUNNING',
  ERROR = 'ERROR',
}

/**
 * 可见性
 * @example "PRIVATE"
 */
export enum VisibilityEnum {
  PRIVATE = 'PRIVATE',
  TEAM = 'TEAM',
  PUBLIC = 'PUBLIC',
}

/**
 * 文档类型
 * @example "PDF"
 */
export enum KnowledgeBaseDocTypeEnum {
  TXT = 'TXT',
  PDF = 'PDF',
  DOCX = 'DOCX',
  MD = 'MD',
  HTML = 'HTML',
}

/**
 * 处理状态
 * @example "COMPLETED"
 */
export enum KnowledgeBaseDocStatusEnum {
  UPLOADING = 'UPLOADING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

/** 数据集类型 */
export enum DatasetTypeEnum {
  FILE = 'FILE',
  DATASOURCE = 'DATASOURCE',
}

/** 数据集状态 */
export enum DatasetStatusEnum {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  PREPARING = 'PREPARING',
}

/** 数据库类型 */
export enum DatasourceTypeEnum {
  MySQL = 'MySQL',
  SQLServer = 'SQLServer',
  DB2 = 'DB2',
  PostgreSQL = 'PostgreSQL',
  Oracle = 'Oracle',
}

/** 应用分类 */
export enum ApplicationCategoryEnum {
  CHATBOT = 'CHATBOT',
  ASSISTANT = 'ASSISTANT',
  WORKFLOW = 'WORKFLOW',
  KNOWLEDGE_BASE = 'KNOWLEDGE_BASE',
}

/** 应用状态 */
export enum ApplicationStatusEnum {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  PAUSED = 'PAUSED',
}

export enum ApiKeyPermissionsEnum {
  READ = 'READ',
  WRITE = 'WRITE',
  DELETE = 'DELETE',
}

/** 状态 */
export enum ApiKeyStatusEnum {
  ACTIVE = 'ACTIVE',
  REVOKED = 'REVOKED',
  EXPIRED = 'EXPIRED',
}

/** 数据类型 */
export enum DatasetDataTypeEnum {
  EXCEL = 'EXCEL',
  CSV = 'CSV',
  TABLE = 'TABLE',
}

/** 状态 */
export enum DatasetDataStatusEnum {
  UPLOADING = 'UPLOADING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

/** 同步状态 */
export enum SyncDataStatusEnum {
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

/** 消息角色 */
export enum MessageRoleEnum {
  USER = 'USER',
  ASSISTANT = 'ASSISTANT',
  SYSTEM = 'SYSTEM',
}

/** 趋势 */
export enum MetricTrendEnum {
  Up = 'up',
  Down = 'down',
}

/** 统计周期 */
export enum StatisticsPeriodEnum {
  TODAY = 'TODAY',
  LAST_7_DAYS = 'LAST_7_DAYS',
  LAST_30_DAYS = 'LAST_30_DAYS',
}

/**
 * 时间范围
 * @example "7days"
 */
export enum TimeRangeEnum {
  Value24Hours = '24hours',
  Value7Days = '7days',
  Value30Days = '30days',
  Value90Days = '90days',
}

/** 数据粒度 */
export enum GranularityEnum {
  Hour = 'hour',
  Day = 'day',
  Week = 'week',
}

/** 来源 */
export enum ApiCollectionSourceEnum {
  OPENAPI = 'OPENAPI',
  SWAGGER = 'SWAGGER',
  POSTMAN = 'POSTMAN',
  MANUAL = 'MANUAL',
}

/** HTTP方法：GET、POST、PUT、DELETE、PATCH等 */
export enum HttpMethodEnum {
  POST = 'POST',
  GET = 'GET',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
  HEAD = 'HEAD',
  OPTIONS = 'OPTIONS',
  TRACE = 'TRACE',
}

/** 文件类型 */
export enum ApiCollectionImportTypeEnum {
  OPENAPI = 'OPENAPI',
  SWAGGER = 'SWAGGER',
  POSTMAN = 'POSTMAN',
}

/**
 * 冲突处理策略：OVERWRITE-覆盖现有接口，IGNORE-跳过重复接口，MERGE-合并配置
 * @example "IGNORE"
 */
export enum ConflictStrategyEnum {
  OVERWRITE = 'OVERWRITE',
  IGNORE = 'IGNORE',
  MERGE = 'MERGE',
}

/** 状态 */
export enum ImportStatusEnum {
  Imported = 'imported',
  Skipped = 'skipped',
  Error = 'error',
}

/** 连接状态 */
export enum ConnectionStatusEnum {
  CONNECTED = 'CONNECTED',
  DISCONNECTED = 'DISCONNECTED',
}

/** 向量存储源类型 */
export enum VectorStoreTypeEnum {
  AZURE_AI_SERVICE = 'AZURE_AI_SERVICE',
  AZURE_COSMOS_DB = 'AZURE_COSMOS_DB',
  APACHE_CASSANDRA = 'APACHE_CASSANDRA',
  CHROMA = 'CHROMA',
  COUCHBASE = 'COUCHBASE',
  ELASTICSEARCH = 'ELASTICSEARCH',
  GEMFIRE = 'GEMFIRE',
  MARIADB = 'MARIADB',
  MILVUS = 'MILVUS',
  MONGODB_ATLAS = 'MONGODB_ATLAS',
  NEO4J = 'NEO4J',
  OPENSEARCH = 'OPENSEARCH',
  ORACLE = 'ORACLE',
  PGVECTOR = 'PGVECTOR',
  PINECONE = 'PINECONE',
  QDRANT = 'QDRANT',
  REDIS = 'REDIS',
  SAP_HANA = 'SAP_HANA',
  TYPESENSE = 'TYPESENSE',
  WEAVIATE = 'WEAVIATE',
}

export const enumNamespaceMap = new Map<any, string>([[NodeSource, 'xcm.enum.NodeSource']]);
