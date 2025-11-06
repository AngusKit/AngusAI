import {ApiLocaleResult, TenantAuditingVo} from '@xcan-angus/infra';
import {ApplicationCategoryEnum, ModelProviderEnum, ModelTypeEnum,} from "@/enums/enums.ts";

/** 应用详情 */
export interface ApplicationDetailVo extends TenantAuditingVo {
    /**
     * 应用ID
     * @format int64
     */
    id?: number;
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
    /** 默认语言 */
    language?: string;
    /**
     * 发布时间
     * @format date-time
     */
    publishedDate?: string;
    /** 详细配置 */
    config?: ApplicationConfigVo;
    /** 分享信息 */
    shareInfo?: ApplicationShareInfoVo;
}

/** The API response result of supporting international message. */
export type ApplicationDetailResult = ApiLocaleResult & {
    /** Actual response data or error details. */
    data?: ApplicationDetailVo;
};

/** 应用配置 */
export interface ApplicationConfigVo {
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
    knowledgeBaseId?: number;
    /** 关联的知识库名称 */
    knowledgeBaseName?: string;
    /**
     * 关联的数据集ID
     * @format int64
     */
    datasetId?: number;
    /** 关联的数据集名称 */
    datasetName?: string;
    /**
     * 关联的工作流ID
     * @format int64
     */
    workflowId?: number;
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
    knowledgeBaseId?: number;
    /**
     * 关联的数据集ID
     * @format int64
     */
    datasetId?: number;
    /**
     * 关联的工作流ID
     * @format int64
     */
    workflowId?: number;
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

/** 模型配置 */
export interface ModelConfig {
    /** 模型名称，例如 gpt-4o-mini */
    modelName: string;
    /** 模型类型，如：CHAT, EMBEDDING, VISION 等 */
    modelType: ModelTypeEnum;
    /** 模型提供商，如：OPENAI、ANTHROPIC、OLLAMA 等 */
    provider: ModelProviderEnum;
    /** 模型版本标识 */
    version: string;
    /** 模型用途或能力描述 */
    description?: string;
    /** 访问模型所需的API密钥 */
    apiKey: string;
    /** 模型服务的基础URL */
    apiEndpoint: string;
    /**
     * 温度，控制创造性，通常0.0-2.0
     * @format double
     */
    temperature?: number;
    /**
     * 最大生成token数
     * @format int32
     */
    maxTokens?: number;
    /**
     * 上下文窗口大小，模型最大可处理的上下文长度
     * @format int32
     */
    contextWindow?: number;
    /**
     * 请求超时时间（毫秒）
     * @format int64
     */
    timeout?: number;
    /**
     * 失败重试次数
     * @format int32
     */
    retryCount?: number;
    /** 是否启用流式响应 */
    streaming?: boolean;
    /**
     * 优先级（越小越高）
     * @format int32
     */
    priority?: number;
    /** 是否启用该模型配置 */
    enabled?: boolean;
    /** 是否本地部署模型 */
    isLocal?: boolean;
    /** 是否兼容OpenAI API接口 */
    openaiCompatible?: boolean;
    /**
     * 成本等级（1-5）
     * @format int32
     */
    costLevel?: number;
    /**
     * 性能等级（1-5）
     * @format int32
     */
    performanceLevel?: number;
    /**
     * 模型支持的特性枚举集合
     * @uniqueItems true
     */
    features?: string[];
    /**
     * 支持的多模态类型，例如：image, audio
     * @uniqueItems true
     */
    multimodalityTypes?: string[];
    /** 默认请求参数键值对 */
    defaultParams?: Record<string, object>;
    /**
     * 支持的输入格式集合
     * @uniqueItems true
     */
    inputFormats?: string[];
}

/** 应用配置更新请求参数 */
export interface ApplicationConfig {
    /** 模型配置 */
    model: ModelConfig;
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
    /**
     * 默认语言
     * @example "zh-CN"
     */
    language?: string;
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
    /**
     * 默认语言
     * @example "zh-CN"
     */
    language?: string;
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
    userId?: number;
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
    CreatedDate = "createdDate",
    ModifiedDate = "modifiedDate",
    Status = "status",
    Category = "category",
    Name = "name",
}
