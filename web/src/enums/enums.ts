/** 通知类型：SUCCESS-成功, WARNING-警告, INFO-信息 */
export enum NotificationTypeEnum {
  SUCCESS = 'SUCCESS',
  WARNING = 'WARNING',
  INFO = 'INFO',
}

/** 通知优先级：HIGH-高优先级, MEDIUM-中优先级, LOW-低优先级 */
export enum NotificationPriorityEnum {
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
}

/** 通知分类：ALL-全部消息, UNREAD-未读消息, STARRED-星标消息, ARCHIVED-已归档 */
export enum NotificationCategoryEnum {
  ALL = 'ALL',
  UNREAD = 'UNREAD',
  STARRED = 'STARRED',
  ARCHIVED = 'ARCHIVED',
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

/** 性别：MALE-男, FEMALE-女, UNKNOWN-未知 */
export enum GenderEnum {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  UNKNOWN = 'UNKNOWN',
}

/** 用户状态：ACTIVE-已激活, DISABLED-已禁用, PENDING-待审核 */
export enum UserStatusEnum {
  ACTIVE = 'ACTIVE',
  DISABLED = 'DISABLED',
  PENDING = 'PENDING',
}

/** 用户来源：REGISTER-注册, INVITE-邀请, LDAP-LDAP, ADMIN_CREATE-管理员创建 */
export enum UserSourceEnum {
  REGISTER = 'REGISTER',
  INVITE = 'INVITE',
  LDAP = 'LDAP',
  ADMIN_CREATE = 'ADMIN_CREATE',
}

/** 邀请方式：LINK-链接邀请, EMAIL-邮件邀请 */
export enum InviteTypeEnum {
  LINK = 'LINK',
  EMAIL = 'EMAIL',
}

/** GM 邀请状态：PENDING-待接受, EXPIRED-已过期, ACCEPTED-已接受, CANCELLED-已取消, REJECTED-已拒绝 */
export enum InviteStatusEnum {
  PENDING = 'PENDING',
  EXPIRED = 'EXPIRED',
  ACCEPTED = 'ACCEPTED',
  CANCELLED = 'CANCELLED',
  REJECTED = 'REJECTED',
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

/** 模型提供商 — 与后端 ModelProvider 枚举值一致 */
export enum ModelProviderEnum {
  OPEN_AI = 'OPEN_AI',
  ANTHROPIC = 'ANTHROPIC',
  OLLAMA = 'OLLAMA',
  GEMINI = 'GEMINI',
  AMAZON_BEDROCK = 'AMAZON_BEDROCK',
  GITHUB_MODELS = 'GITHUB_MODELS',
  /** @deprecated */
  AZURE_OPEN_AI = 'AZURE_OPEN_AI',
  GOOGLE_AI_GEMINI = 'GOOGLE_AI_GEMINI',
  GOOGLE_VERTEX_AI_GEMINI = 'GOOGLE_VERTEX_AI_GEMINI',
  GOOGLE_VERTEX_AI_ANTHROPIC = 'GOOGLE_VERTEX_AI_ANTHROPIC',
  MICROSOFT_FOUNDRY = 'MICROSOFT_FOUNDRY',
  MISTRAL_AI = 'MISTRAL_AI',
  WATSONX = 'WATSONX',
  OTHER = 'OTHER',
  /** 通义千问（阿里） */
  QWEN = 'QWEN',
  /** 智谱 GLM */
  ZHIPU = 'ZHIPU',
  /** DeepSeek */
  DEEPSEEK = 'DEEPSEEK',
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
  ACTIVE = 'ACTIVE',
  DISABLED = 'DISABLED',
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
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

/** 数据集类型 */
export enum DatasetTypeEnum {
  FILE = 'FILE',
  DATASOURCE = 'DATASOURCE',
}

/** 数据库类型 */
export enum DatasourceTypeEnum {
  MySQL = 'MySQL',
  SQLServer = 'SQLServer',
  DB2 = 'DB2',
  PostgreSQL = 'PostgreSQL',
  Oracle = 'Oracle',
  DM = 'DM',
}

/** 应用分类 */
export enum ApplicationCategoryEnum {
  CHATBOT = 'CHATBOT',
  CONTENT_CREATION = 'CONTENT_CREATION',
  KNOWLEDGE_QA = 'KNOWLEDGE_QA',
  AGENT_PROXY = 'AGENT_PROXY',
}

/** 应用状态 */
export enum ApplicationStatusEnum {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  PAUSED = 'PAUSED',
}

/** 智能体状态：ACTIVE-已发布, INACTIVE-离线 */
export enum AgentStatusEnum {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

/** 智能体交互模式（与后端 InteractionMode 一致） */
export enum InteractionModeEnum {
  CHATBOT = 'CHATBOT',
  COMPLETION = 'COMPLETION',
  WORKFLOW = 'WORKFLOW',
  AGENT_AS_API = 'AGENT_AS_API',
  MULTI_TURN_TASK = 'MULTI_TURN_TASK',
}

/** 智能体推理策略（与后端 ReasoningStrategy 一致） */
export enum ReasoningStrategyEnum {
  SIMPLE_LLM = 'SIMPLE_LLM',
  FUNCTION_CALLING = 'FUNCTION_CALLING',
  REACT = 'REACT',
  PLAN_AND_EXECUTE = 'PLAN_AND_EXECUTE',
  MULTI_AGENT = 'MULTI_AGENT',
}

/** 智能体自治等级（与后端 AutonomyLevel 一致） */
export enum AutonomyLevelEnum {
  TOOL = 'TOOL',
  ASSISTANT = 'ASSISTANT',
  COLLABORATOR = 'COLLABORATOR',
  DELEGATE = 'DELEGATE',
  AUTONOMOUS = 'AUTONOMOUS',
}

/** 记忆策略（与后端 MemoryStrategy 一致） */
export enum MemoryStrategyEnum {
  NONE = 'NONE',
  MESSAGE_WINDOW = 'MESSAGE_WINDOW',
  TOKEN_WINDOW = 'TOKEN_WINDOW',
  SUMMARY = 'SUMMARY',
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
  JSON = 'JSON',
  XML = 'XML',
  TABLE = 'TABLE',
}

/** 状态 */
export enum DatasetDataStatusEnum {
  PENDING = 'PENDING',
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

/** 向量存储源类型（与后端 VectorStoreType 一致） */
export enum VectorStoreTypeEnum {
  PGVECTOR = 'PGVECTOR',
  MILVUS = 'MILVUS',
  QDRANT = 'QDRANT',
  CHROMA = 'CHROMA',
  ELASTICSEARCH = 'ELASTICSEARCH',
  WEAVIATE = 'WEAVIATE',
  MARIADB = 'MARIADB',
}

export enum EnabledStatusEnum {
  ENABLED = 'ENABLED',
  DISABLED = 'DISABLED',
}

/** 活动记录目标类型 */
export enum ActivityTargetTypeEnum {
  APPLICATION = 'APPLICATION',
  WORKFLOW = 'WORKFLOW',
  KNOWLEDGE_BASE = 'KNOWLEDGE_BASE',
  DATASET = 'DATASET',
  MODEL = 'MODEL',
  TEAM_MEMBER = 'TEAM_MEMBER',
  API_KEY = 'API_KEY',
  PROMPT = 'PROMPT',
}

/** 活动记录操作类型 */
export enum ActivityActionTypeEnum {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  VIEW = 'VIEW',
  SHARE = 'SHARE',
  EXPORT = 'EXPORT',
  IMPORT = 'IMPORT',
  EXECUTE = 'EXECUTE',
  UNKNOWN = 'UNKNOWN',
}

/** 角色效果：ALLOW-允许, DENY-拒绝 */
export enum RoleEffectEnum {
  ALLOW = 'ALLOW',
  DENY = 'DENY',
}

/** 应用菜单类型：MENU-菜单, BUTTON-按钮, PANEL-面板 */
export enum ApplicationMenuTypeEnum {
  MENU = 'MENU',
  BUTTON = 'BUTTON',
  PANEL = 'PANEL',
}

export enum DatasourceConnectionStatusEnum {
  IDLE = 'idle',
  SUCCESS = 'success',
  ERROR = 'error',
}

export const enumNamespaceMap = new Map<any, string>([
  [NotificationTypeEnum, 'enum.NotificationTypeEnum'],
  [NotificationPriorityEnum, 'enum.NotificationPriorityEnum'],
  [NotificationCategoryEnum, 'enum.NotificationCategoryEnum'],
  [WorkflowTypeEnum, 'enum.WorkflowTypeEnum'],
  [WorkflowStatusEnum, 'enum.WorkflowStatusEnum'],
  [TeamScaleEnum, 'enum.TeamScaleEnum'],
  [IndustryEnum, 'enum.IndustryEnum'],
  [GenderEnum, 'enum.GenderEnum'],
  [UserStatusEnum, 'enum.UserStatusEnum'],
  [UserSourceEnum, 'enum.UserSourceEnum'],
  [InviteTypeEnum, 'enum.InviteTypeEnum'],
  [InviteStatusEnum, 'enum.InviteStatusEnum'],
  [MemberPermissionEnum, 'enum.MemberPermissionEnum'],
  [ResourceTypeEnum, 'enum.ResourceTypeEnum'],
  [SharedWithEnum, 'enum.SharedWithEnum'],
  [PluginCategoryEnum, 'enum.PluginCategoryEnum'],
  [PluginStatusEnum, 'enum.PluginStatusEnum'],
  [PluginTypeEnum, 'enum.PluginTypeEnum'],
  [ModelTypeEnum, 'enum.ModelTypeEnum'],
  [ModelProviderEnum, 'enum.ModelProviderEnum'],
  [ModelFeaturesEnum, 'enum.ModelFeaturesEnum'],
  [ModelStatusEnum, 'enum.ModelStatusEnum'],
  [VisibilityEnum, 'enum.VisibilityEnum'],
  [KnowledgeBaseDocTypeEnum, 'enum.KnowledgeBaseDocTypeEnum'],
  [KnowledgeBaseDocStatusEnum, 'enum.KnowledgeBaseDocStatusEnum'],
  [DatasetTypeEnum, 'enum.DatasetTypeEnum'],
  [DatasourceTypeEnum, 'enum.DatasourceTypeEnum'],
  [ApplicationCategoryEnum, 'enum.ApplicationCategoryEnum'],
  [ApplicationStatusEnum, 'enum.ApplicationStatusEnum'],
  [AgentStatusEnum, 'enum.AgentStatusEnum'],
  [InteractionModeEnum, 'enum.InteractionModeEnum'],
  [ReasoningStrategyEnum, 'enum.ReasoningStrategyEnum'],
  [AutonomyLevelEnum, 'enum.AutonomyLevelEnum'],
  [MemoryStrategyEnum, 'enum.MemoryStrategyEnum'],
  [ApiKeyPermissionsEnum, 'enum.ApiKeyPermissionsEnum'],
  [ApiKeyStatusEnum, 'enum.ApiKeyStatusEnum'],
  [DatasetDataTypeEnum, 'enum.DatasetDataTypeEnum'],
  [DatasetDataStatusEnum, 'enum.DatasetDataStatusEnum'],
  [SyncDataStatusEnum, 'enum.SyncDataStatusEnum'],
  [MessageRoleEnum, 'enum.MessageRoleEnum'],
  [MetricTrendEnum, 'enum.MetricTrendEnum'],
  [StatisticsPeriodEnum, 'enum.StatisticsPeriodEnum'],
  [TimeRangeEnum, 'enum.TimeRangeEnum'],
  [GranularityEnum, 'enum.GranularityEnum'],
  [ApiCollectionSourceEnum, 'enum.ApiCollectionSourceEnum'],
  [HttpMethodEnum, 'enum.HttpMethodEnum'],
  [ApiCollectionImportTypeEnum, 'enum.ApiCollectionImportTypeEnum'],
  [ConflictStrategyEnum, 'enum.ConflictStrategyEnum'],
  [ImportStatusEnum, 'enum.ImportStatusEnum'],
  [ConnectionStatusEnum, 'enum.ConnectionStatusEnum'],
  [VectorStoreTypeEnum, 'enum.VectorStoreTypeEnum'],
  [EnabledStatusEnum, 'enum.EnabledStatusEnum'],
  [ActivityTargetTypeEnum, 'enum.ActivityTargetTypeEnum'],
  [ActivityActionTypeEnum, 'enum.ActivityActionTypeEnum'],
]);
