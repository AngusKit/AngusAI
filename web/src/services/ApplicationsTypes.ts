import { ApiLocaleResult, TenantAuditingVo } from '@xcan-angus/infra';
import { ApplicationCategoryEnum, ModelProviderEnum, ModelTypeEnum } from '@/enums/enums.ts';

/** 应用详情 */
export interface ApplicationDetailVo extends TenantAuditingVo {
  /**
   * 应用ID
   * @format int64
   */
  id?: string;
  /** 应用名称 */
  name?: string;
  /** 应用图标 */
  icon?: string;
  /** 应用描述 */
  description?: string;
  /** 应用分类 */
  category?: ApplicationCategoryEnum;
  /** 应用状态 */
  status?: string;
  /**
   * 发布时间
   * @format date-time
   */
  publishedDate?: string;
  /** 详细配置 */
  config?: ApplicationConfigVo;
  /** 分享信息 */
  shareInfo?: ApplicationShareInfoVo;

  /** 绑定的智能体ID列表（列表接口返回） */
  agentIds?: (string | number)[];
  /** 默认智能体ID（列表接口返回） */
  defaultAgentId?: string | number;

  apiCalls?: number;
}

/** The API response result of supporting international message. */
export type ApplicationDetailResult = ApiLocaleResult & {
  /** Actual response data or error details. */
  data?: ApplicationDetailVo;
};

/** 资源信息（id + name） */
export interface ResourceInfoVo {
  id?: number;
  name?: string;
}

/** 应用配置 */
export interface ApplicationConfigVo {
  /**
   * 绑定的智能体列表
   */
  agents?: ResourceInfoVo[];
  /**
   * 默认智能体（用于对话）
   */
  defaultAgent?: ResourceInfoVo;
  /** 模型配置 */
  model?: ModelConfigVo;
  /** 关联资源 */
  resources?: ResourcesConfigVo;
  /** 提示词配置 */
  prompts?: PromptsConfigVo;
  /** 对话设置 */
  conversation?: ConversationConfigVo;
  /** 功能设置 */
  features?: FeaturesConfigVo;
  /** 安全设置 */
  security?: SecurityConfigVo;
  /** 发布设置 */
  publish?: PublishConfigVo;
}

/** 模型配置 */
export interface ModelConfigVo {
  /** 模型提供商 */
  provider?: string;
  /** 模型名称 */
  modelName?: string;
  /**
   * 温度
   * @format double
   */
  temperature?: number;
  /**
   * 最大token数
   * @format int32
   */
  maxTokens?: number;
  /**
   * top_p
   * @format double
   */
  topP?: number;
  /**
   * 频率惩罚
   * @format double
   */
  frequencyPenalty?: number;
  /**
   * 存在惩罚
   * @format double
   */
  presencePenalty?: number;
}

/** 关联资源配置 */
export interface ResourcesConfigVo {
  /**
   * 关联的知识库ID
   * @format int64
   */
  knowledgeBaseId?: string;
  /** 关联的知识库名称 */
  knowledgeBaseName?: string;
  /**
   * 关联的数据集ID
   * @format int64
   */
  datasetId?: string;
  /** 关联的数据集名称 */
  datasetName?: string;
  /**
   * 关联的工作流ID
   * @format int64
   */
  workflowId?: string;
  /** 关联的工作流名称 */
  workflowName?: string;
}

/** 提示词配置 */
export interface PromptsConfigVo {
  /** 系统提示词 */
  system?: string;
  /** 上下文提示词 */
  context?: string;
}

/** 对话设置 */
export interface ConversationConfigVo {
  /** 欢迎消息 */
  welcomeMessage?: string;
  /** 开场问题列表 */
  openingQuestions?: string[];
  /**
   * 最大历史长度
   * @format int32
   */
  maxHistoryLength?: number;
}

/** 功能设置 */
export interface FeaturesConfigVo {
  /** 启用文件上传 */
  enableFileUpload?: boolean;
  /** 启用语音输入 */
  enableVoiceInput?: boolean;
  /** 启用图片输入 */
  enableImageInput?: boolean;
  /** 启用建议 */
  enableSuggestions?: boolean;
  /** 启用历史记录 */
  enableHistory?: boolean;
}

/** 安全设置 */
export interface SecurityConfigVo {
  /** 启用内容过滤 */
  enableContentFilter?: boolean;
  /** 启用数据加密 */
  enableDataEncryption?: boolean;
  /**
   * 数据保留天数
   * @format int32
   */
  dataRetentionDays?: number;
  /** 启用匿名化 */
  enableAnonymization?: boolean;
}

/** 发布设置 */
export interface PublishConfigVo {
  /** 公开访问 */
  publicAccess?: boolean;
  /** 启用嵌入 */
  embedEnabled?: boolean;
  /** 启用API */
  apiEnabled?: boolean;
}

/** 应用分享信息 */
export interface ApplicationShareInfoVo {
  /** 公开访问：允许任何人通过链接访问应用 */
  publicAccess?: boolean;
  /** 匿名访问：允许未登录用户访问应用 */
  anonymousAccess?: boolean;
  /** 授权访问：只有授权用户才可访问 */
  authorizationRequired?: boolean;
  /**
   * 有效期（小时），0表示永久
   * @format int32
   * @example 24
   */
  expiresIn?: number;
}

/** 对话设置 */
export interface ConversationConfig {
  /** 欢迎消息 */
  welcomeMessage?: string;
  /** 开场问题列表 */
  openingQuestions?: string[];
  /**
   * 最大历史长度
   * @format int32
   * @example 10
   */
  maxHistoryLength?: number;
}

/** 功能设置 */
export interface FeaturesConfig {
  /** 启用文件上传 */
  enableFileUpload?: boolean;
  /** 启用语音输入 */
  enableVoiceInput?: boolean;
  /** 启用图片输入 */
  enableImageInput?: boolean;
  /** 启用建议 */
  enableSuggestions?: boolean;
  /** 启用历史记录 */
  enableHistory?: boolean;
}

/** 提示词配置 */
export interface PromptsConfig {
  /** 系统提示词 */
  system?: string;
  /** 上下文提示词 */
  context?: string;
}

/** 发布设置 */
export interface PublishConfig {
  /** 公开访问 */
  publicAccess?: boolean;
  /** 启用嵌入 */
  embedEnabled?: boolean;
  /** 启用API */
  apiEnabled?: boolean;
}

/** 关联资源配置 */
export interface ResourcesConfig {
  /**
   * 关联的知识库ID
   * @format int64
   */
  knowledgeBaseId?: string;
  /**
   * 关联的数据集ID
   * @format int64
   */
  datasetId?: string;
  /**
   * 关联的工作流ID
   * @format int64
   */
  workflowId?: string;
}

/** 安全设置 */
export interface SecurityConfig {
  /** 启用内容过滤 */
  enableContentFilter?: boolean;
  /** 启用数据加密 */
  enableDataEncryption?: boolean;
  /**
   * 数据保留天数
   * @format int32
   * @example 30
   */
  dataRetentionDays?: number;
  /** 启用匿名化 */
  enableAnonymization?: boolean;
}

/** 模型配置定义 — 与后端 ModelConfigDefinition 一致 */
export interface ModelConfigDefinition {
  /** 配置唯一标识 */
  id?: string;
  /** 模型提供商：OPEN_AI/ANTHROPIC/OLLAMA/GEMINI/QWEN/ZHIPU/DEEPSEEK 等 */
  provider?: ModelProviderEnum;
  /** 模型类型：chat/image/audio/embedding/moderation */
  type?: ModelTypeEnum;
  /** 模型名称，例如 gpt-4 */
  modelName?: string;
  /** API Key（加密存储，敏感字段） */
  apiKey?: string;
  /** API Base URL（用于自托管或代理） */
  baseUrl?: string;
  /**
   * 温度参数，0-2
   * @format double
   */
  temperature?: number;
  /**
   * 最大 Token 数
   * @format int32
   */
  maxTokens?: number;
  /** Embedding 模型名称（用于 RAG 等场景） */
  embeddingModelName?: string;
  /** 是否为默认配置 — 多个模型时优先选择默认模型 */
  defaultConfig?: boolean;
  /**
   * 优先级 — 数值越大优先级越高；无默认模型时选择优先级最高的
   * @format int32
   */
  priority?: number;
  /** 租户 ID（null 为全局） */
  tenantId?: string;
  /** 扩展参数 */
  extraProperties?: Record<string, object>;
}

/** 应用配置更新请求参数 */
export interface ApplicationConfig {
  /**
   * 绑定的智能体ID列表（至少一个）
   */
  agentIds?: string[];
  /**
   * 默认智能体ID（用于对话，不传则取 agentIds 第一个）
   */
  defaultAgentId?: string;
  /** 模型配置 */
  model: ModelConfigDefinition;
  /** 关联资源 */
  resources?: ResourcesConfig;
  /** 提示词配置 */
  prompts: PromptsConfig;
  /** 对话设置 */
  conversation?: ConversationConfig;
  /** 功能设置 */
  features?: FeaturesConfig;
  /** 安全设置 */
  security?: SecurityConfig;
  /** 发布设置 */
  publish?: PublishConfig;
}

/** 创建应用请求参数 */
export interface ApplicationCreateDto {
  /**
   * 绑定的智能体ID列表（必填，至少一个）
   */
  agentIds: string[];
  /**
   * 默认智能体ID（用于对话，不传则取 agentIds 第一个）
   */
  defaultAgentId?: string;
  /**
   * 应用名称
   * @example "我的智能助手"
   */
  name: string;
  /**
   * 应用图标（emoji或URL）
   * @example "🤖"
   */
  icon: string;
  /**
   * 应用描述
   * @example "这是一个智能助手应用"
   */
  description?: string;
  /** 应用分类 */
  category: ApplicationCategoryEnum;
}

/** 应用分享请求参数，访问设置全部为false时，只允许自己访问 */
export interface ApplicationShareDto {
  /** 公开访问：允许任何人通过链接访问应用 */
  publicAccess?: boolean;
  /** 匿名访问：允许未登录用户访问应用 */
  anonymousAccess?: boolean;
  /** 授权访问：只有授权用户才可访问 */
  authorizationRequired?: boolean;
  /**
   * 有效期（小时），0表示永久
   * @format int32
   * @example 24
   */
  expiresIn?: number;
}

/** 复制应用请求参数 */
export interface ApplicationDuplicateDto {
  /**
   * 新应用名称
   * @example "我的智能助手副本"
   */
  name?: string;
}

/** 更新应用基本信息请求参数 */
export interface ApplicationUpdateDto {
  /**
   * 绑定的智能体ID列表
   */
  agentIds?: string[];
  /**
   * 默认智能体ID（用于对话，不传则取 agentIds 第一个）
   */
  defaultAgentId?: string;
  /**
   * 应用名称
   * @example "我的智能助手"
   */
  name?: string;
  /**
   * 应用图标（emoji或URL）
   * @example "🤖"
   */
  icon?: string;
  /**
   * 应用描述
   * @example "这是一个智能助手应用"
   */
  description?: string;
  /** 应用分类 */
  category?: ApplicationCategoryEnum;
}

/** 概览统计 */
export interface OverviewStatsVo {
  /**
   * 总调用次数
   * @format int64
   */
  totalCalls?: number;
  /**
   * 总token数
   * @format int64
   */
  totalTokens?: number;
  /**
   * 总成本
   * @format double
   */
  totalCost?: number;
  /**
   * 平均响应时间
   * @format double
   */
  avgResponseTime?: number;
  /**
   * 成功率
   * @format double
   */
  successRate?: number;
}

/** 热门用户 */
export interface TopUserVo {
  /**
   * 用户ID
   * @format int64
   */
  userId?: string;
  /** 用户名 */
  username?: string;
  /**
   * 调用次数
   * @format int64
   */
  callCount?: number;
}

/** 趋势数据项 */
export interface TrendDataVo {
  /**
   * 时间戳
   * @format int64
   */
  datetime?: number;
  /**
   * 数值
   * @format double
   */
  value?: number;
}

/** 趋势数据 */
export interface TrendsStatsVo {
  /** 调用次数趋势 */
  calls?: TrendDataVo[];
  /** token数趋势 */
  tokens?: TrendDataVo[];
  /** 响应时间趋势 */
  responseTime?: TrendDataVo[];
}

/** 应用统计数据 */
export interface ApplicationStatisticsVo {
  /** 概览统计 */
  overview?: OverviewStatsVo;
  /** 趋势数据 */
  trends?: TrendsStatsVo;
  /** 热门用户 */
  topUsers?: TopUserVo[];
}

/** The API response result of supporting international message. */
export type ApplicationStatisticsResult = ApiLocaleResult & {
  /** Actual response data or error details. */
  data?: ApplicationStatisticsVo;
};

/**
 * 排序字段
 * @example "modifiedDate"
 */
export enum GetApplicationListOrderByEnum {
  CreatedDate = 'createdDate',
  ModifiedDate = 'modifiedDate',
  Status = 'status',
  Category = 'category',
  Name = 'name',
}
