import {ApiLocaleResult, TenantAuditingVo} from '@xcan-angus/infra';
import {OpenAPIV3_1} from '@/types/openapi-types';
import {
    ApiCollectionImportTypeEnum,
    ApiCollectionSourceEnum,
    ApiKeyPermissionsEnum,
    ApiKeyStatusEnum,
    ApplicationCategoryEnum,
    ApplicationStatusEnum,
    ConflictStrategyEnum,
    ConnectionStatusEnum,
    DatasetDataStatusEnum,
    DatasetDataTypeEnum,
    DatasetStatusEnum,
    DatasetTypeEnum,
    DatasourceTypeEnum,
    HttpMethodEnum,
    ImportStatusEnum,
    IndustryEnum,
    KnowledgeBaseDocStatusEnum,
    KnowledgeBaseDocTypeEnum,
    MemberPermissionEnum,
    MessageRoleEnum,
    MetricTrendEnum,
    ModelFeaturesEnum,
    ModelProviderEnum,
    ModelStatusEnum,
    ModelTypeEnum,
    PluginCategoryEnum,
    PluginStatusEnum,
    PluginTypeEnum,
    ResourceTypeEnum,
    SharedWithEnum,
    SyncDataStatusEnum,
    TeamScaleEnum,
    VectorStoreTypeEnum,
    VisibilityEnum,
    WorkflowStatusEnum,
    WorkflowTypeEnum
} from "@/enums/enums.ts";

export interface ExecutionStats {
    /** @format int64 */
    totalExecutions?: number;
    /** @format int64 */
    successfulExecutions?: number;
    /** @format int64 */
    failedExecutions?: number;
    /** @format double */
    avgExecutionTime?: number;
    /** @format int64 */
    lastExecutionTime?: number;
    lastExecutionStatus?: string;
}

/** The API response result of supporting international message. */
export type WorkflowDetailResult = ApiLocaleResult & {
    /** Actual response data or error details. */
    data?: WorkflowDetailVo;
};

/** 工作流详情响应 */
export interface WorkflowDetailVo extends TenantAuditingVo {
    /**
     * 工作流ID
     * @format int64
     */
    id?: number;
    /** 工作流名称 */
    name?: string;
    /** 工作流描述 */
    description?: string;
    /** 图标emoji */
    icon?: string;
    /** 背景色 */
    iconBg?: string;
    /** 工作流类型 */
    type?: WorkflowTypeEnum;
    /** 工作流状态 */
    status?: WorkflowStatusEnum;
    /** 是否启用 */
    enabled?: boolean;
    /** 版本号 */
    version?: string;
    /** 工作流配置 */
    config?: object;
    /** 统计数据 */
    executionStats?: ExecutionStats;
}

/** 更新工作流配置请求参数 */
export interface WorkflowConfigUpdateDto {
    /** 节点列表 */
    nodes: object[];
    /** 连线列表 */
    edges: object[];
    /** 变量定义 */
    variables?: object[];
    /** 运行配置 */
    config?: object;
}

export interface TeamSettingsDto {
    /** 团队头像 */
    teamAvatar?: string;
    /** 团队名称 */
    teamName?: string;
    /** 团队邮箱 */
    teamEmail?: string;
    /** 团队描述 */
    teamDescription?: string;
    /** 团队规模 */
    teamScale?: TeamScaleEnum;
    /** 所在行业 */
    industry?: IndustryEnum;
}

/** The API response result of supporting international message. */
export type TeamSettingsResult = ApiLocaleResult & {
    /** Actual response data or error details. */
    data?: TeamSettingsVo;
};

export interface TeamSettingsVo extends TenantAuditingVo {
    /**
     * 团队ID
     * @format int64
     */
    id?: number;
    /** 团队头像 */
    teamAvatar?: string;
    /** 团队名称 */
    teamName?: string;
    /** 团队邮箱 */
    teamEmail?: string;
    /** 团队描述 */
    teamDescription?: string;
    /** 团队规模 */
    teamScale?: TeamScaleEnum;
    /** 所在行业 */
    industry?: IndustryEnum;
}

/** 资源共享启用状态切换请求参数 */
export interface ResourceSharingToggleDto {
    /**
     * 启用状态
     * @example true
     */
    enabled: boolean;
}

/** The API response result of supporting international message. */
export type ResourceSharingDetailResult = ApiLocaleResult & {
    /** Actual response data or error details. */
    data?: ResourceSharingDetailVo;
};

/** 成员信息 */
export interface MemberVo {
    /**
     * 用户ID
     * @format int64
     */
    userId?: number;
    /** 用户名 */
    userName?: string;
    /** 头像 */
    userAvatar?: string;
    /** 权限 */
    permission?: MemberPermissionEnum;
    /**
     * 共享时间
     * @format date-time
     */
    sharedAt?: string;
    /**
     * 最后访问时间
     * @format date-time
     */
    lastAccessed?: string;
    /**
     * 访问次数
     * @format int64
     */
    accessCount?: number;
}

/** 所有者信息 */
export interface OwnerVo {
    /**
     * 用户ID
     * @format int64
     */
    userId?: number;
    /** 用户名 */
    userName?: string;
    /** 头像 */
    avatar?: string;
}

/** 资源共享详情 */
export interface ResourceSharingDetailVo extends TenantAuditingVo {
    /**
     * 共享ID
     * @format int64
     */
    id?: number;
    /**
     * 资源ID
     * @format int64
     */
    resourceId?: number;
    /** 资源名称 */
    resourceName?: string;
    /** 资源类型 */
    resourceType?: ResourceTypeEnum;
    /** 是否启用 */
    enabled?: boolean;
    /** 所有者信息 */
    owner?: OwnerVo;
    /** 共享范围 */
    sharedWith?: SharedWithEnum;
    /** 默认权限 */
    permission?: MemberPermissionEnum;
    /**
     * 成员数量
     * @format int64
     */
    memberCount?: number;
    /** 共享成员列表 */
    members?: MemberVo[];
}

/** 更新资源共享参数 */
export interface ResourceSharingUpdateDto {
    /** 共享范围 */
    sharedWith: SharedWithEnum;
    /** 权限 */
    permission: MemberPermissionEnum;
    /** 成员ID列表 */
    memberIds?: number[];
}

/** The API response result of supporting international message. */
export type PluginDetailResult = ApiLocaleResult & {
    /** Actual response data or error details. */
    data?: PluginDetailVo;
};

/** 插件详情 */
export interface PluginDetailVo extends TenantAuditingVo {
    /**
     * 插件ID
     * @format int64
     */
    id?: number;
    /** 插件名称 */
    name?: string;
    /** 插件图标 */
    icon?: string;
    /** 插件描述 */
    description?: string;
    /** 作者 */
    author?: string;
    /** 版本号 */
    version?: string;
    /** 插件分类 */
    category?: PluginCategoryEnum;
    /** 插件状态 */
    status?: PluginStatusEnum;
    /** 插件类型 */
    type?: PluginTypeEnum;
    /** 标签列表 */
    tags?: string[];
    /**
     * 安装次数
     * @format int64
     */
    installCount?: number;
    /**
     * 使用次数
     * @format int64
     */
    usageCount?: number;
    /**
     * 评分
     * @format double
     */
    rating?: number;
    /**
     * 评价数量
     * @format int64
     */
    reviewCount?: number;
    /** 是否收藏 */
    isFavorite?: boolean;
    /** 是否系统插件 */
    isSystem?: boolean;
    /** 是否公开 */
    isPublic?: boolean;
    /** 是否已验证 */
    isVerified?: boolean;
    /** 最小系统版本要求 */
    minVersion?: string;
    /** 主页URL */
    homepageUrl?: string;
    /** 文档URL */
    documentationUrl?: string;
    /** 源码仓库URL */
    repositoryUrl?: string;
    /** 支持URL */
    supportUrl?: string;
    /** 许可证 */
    license?: string;
    /**
     * 价格
     * @format double
     */
    price?: number;
    /** 货币单位 */
    currency?: string;
    /**
     * 发布时间
     * @format date-time
     */
    publishedDate?: string;
    /** 统计数据 */
    stats?: PluginStatsVo;
}

/** 插件统计数据 */
export interface PluginStatsVo {
    /**
     * 总安装数
     * @format int64
     */
    totalInstalls?: number;
    /**
     * 总使用数
     * @format int64
     */
    totalUsages?: number;
    /**
     * 活跃用户数
     * @format int64
     */
    activeUsers?: number;
    /**
     * 平均评分
     * @format double
     */
    averageRating?: number;
    /**
     * 评价总数
     * @format int64
     */
    totalReviews?: number;
}

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
    features?: ModelFeaturesEnum[];
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
    /**
     * 支持的输出格式集合
     * @uniqueItems true
     */
    outputFormats?: string[];
    /**
     * 业务场景标签集合
     * @uniqueItems true
     */
    businessScenarios?: string[];
    /** 自定义参数（兼容旧版配置） */
    customParams?: Record<string, object>;
    valid?: boolean;
    summary?: string;
    available?: boolean;
}

/** The API response result of supporting international message. */
export type ModelDetailResult = ApiLocaleResult & {
    /** Actual response data or error details. */
    data?: ModelDetailVo;
};

/** 近一月增长趋势 */
export interface LastMonthGrowthTrend {
    /**
     * 本月新增模型数量
     * @format int64
     */
    addedModels?: number;
    /**
     * 本月新增成本，单位货币
     * @format double
     */
    addedCost?: number;
    /**
     * 本月新增Tokens
     * @format int64
     */
    addedTokens?: number;
    /**
     * 本月新增调用次数
     * @format int64
     */
    addedCalls?: number;
    /**
     * 本月平均延迟（毫秒）
     * @format double
     */
    averageLatencyMs?: number;
    /**
     * 较上月延迟降低（毫秒），正值表示延迟降低的毫秒数
     * @format int64
     */
    latencyDecreaseFromLastMonthMs?: number;
}

/** 模型访问限制配置 */
export interface ModelAccessLimit {
    /**
     * 每秒请求数上限（RPS）
     * @format int32
     */
    rateLimit?: number;
    /**
     * 每日请求总量上限
     * @format int32
     */
    dailyLimit?: number;
    /**
     * 最大并发数
     * @format int32
     */
    maxConcurrent?: number;
}

/** 模型详情响应 */
export interface ModelDetailVo extends TenantAuditingVo {
    /**
     * 模型ID
     * @format int64
     */
    id?: number;
    /** 模型名称 */
    name?: string;
    /** 模型描述 */
    description?: string;
    /** 模型类型 */
    type?: ModelTypeEnum;
    /** 模型提供商 */
    provider?: ModelProviderEnum;
    /** 版本号 */
    version?: string;
    /** 模型状态 */
    status?: ModelStatusEnum;
    /** 配置信息 */
    config?: ModelConfig;
    /** 模型访问限制 */
    accessLimit?: ModelAccessLimit;
    /** 统计数据 */
    stats?: ModelStats;
    /** 性能指标 */
    performance?: ModelPerformance;
}

/** 模型性能指标 */
export interface ModelPerformance {
    /** 延迟（可读格式，如：120ms） */
    latency?: string;
    /**
     * 延迟（毫秒）
     * @format double
     */
    latencyMs?: number;
    /** 吞吐量（可读格式，如：100 req/s） */
    throughput?: string;
    /**
     * 吞吐量原始值
     * @format double
     */
    throughputRaw?: number;
    /** 准确率（可读格式，如：98%） */
    accuracy?: string;
    /**
     * 准确率（百分比，0-100）
     * @format double
     */
    accuracyPercent?: number;
}

/** 模型调用统计汇总 */
export interface ModelStats {
    /**
     * 总模型数
     * @format int64
     */
    totalModels?: number;
    /**
     * 运行中的模型数
     * @format int64
     */
    runningModels?: number;
    /**
     * 总调用次数
     * @format int64
     */
    totalCalls?: number;
    /**
     * 成功调用次数
     * @format int64
     */
    successfulCalls?: number;
    /**
     * 失败调用次数
     * @format int64
     */
    failedCalls?: number;
    /**
     * 总Token消耗数
     * @format int64
     */
    totalTokens?: number;
    /**
     * 总成本（货币单位由业务侧定义）
     * @format double
     */
    totalCost?: number;
    /**
     * 成功率（0-100%），可由 successfulCalls/totalCalls 计算
     * @format double
     */
    successRate?: number;
    /**
     * 累计消耗的 tokens 数量
     * @format int64
     */
    totalTokensConsumed?: number;
    /**
     * 平均延迟（毫秒）
     * @format double
     */
    averageLatencyMs?: number;
    /** 近一月增长趋势 */
    lastMonthGrowthTrend?: LastMonthGrowthTrend;
    /** 今天增长趋势 */
    todayGrowthTrend?: TodayGrowthTrend;
}

/** 今天增长趋势 */
export interface TodayGrowthTrend {
    /**
     * 今日新增模型数量
     * @format int64
     */
    addedModels?: number;
    /**
     * 今日新增成本，单位货币
     * @format double
     */
    addedCost?: number;
    /**
     * 今日新增Tokens
     * @format int64
     */
    addedTokens?: number;
    /**
     * 今日新增调用次数
     * @format int64
     */
    addedCalls?: number;
    /**
     * 今日平均延迟（毫秒）
     * @format double
     */
    averageLatencyMs?: number;
    /**
     * 较昨日延迟降低（毫秒），正值表示延迟降低的毫秒数
     * @format int64
     */
    latencyDecreaseFromYesterdayMs?: number;
}

/** The API response result of supporting international message. */
export type KnowledgeBaseDetailResult = ApiLocaleResult & {
    /** Actual response data or error details. */
    data?: KnowledgeBaseDetailVo;
};

/** 知识库配置信息 */
export interface KnowledgeBaseConfigVo {
    /**
     * 分段大小
     * @format int32
     * @example 512
     */
    chunkSize?: number;
    /**
     * 分段重叠
     * @format int32
     * @example 50
     */
    chunkOverlap?: number;
    /**
     * 向量化模型
     * @example "text-embedding-ada-002"
     */
    embeddingModel?: string;
}

/** 知识库详情视图对象 */
export interface KnowledgeBaseDetailVo extends TenantAuditingVo {
    /**
     * 知识库ID
     * @format int64
     * @example 1
     */
    id?: number;
    /**
     * 知识库名称
     * @example "产品文档库"
     */
    name?: string;
    /**
     * 图标
     * @example "📚"
     */
    icon?: string;
    /**
     * 背景色
     * @example "bg-blue-100"
     */
    iconBg?: string;
    /**
     * 描述
     * @example "存储产品相关文档和资料"
     */
    description?: string;
    /**
     * 文档数量
     * @format int32
     * @example 15
     */
    documentsCount?: number;
    /**
     * 总大小
     * @example 2.5
     */
    totalSize?: string;
    /**
     * 是否启用
     * @example true
     */
    enabled?: boolean;
    /**
     * 标签
     * @example ["产品","文档"]
     */
    tags?: string[];
    /**
     * 可见性
     * @example "PRIVATE"
     */
    visibility?: VisibilityEnum;
    /** 统计信息 */
    stats?: KnowledgeBaseStatsVo;
    /** 配置信息 */
    config?: KnowledgeBaseConfigVo;
}

/** 知识库统计信息 */
export interface KnowledgeBaseStatsVo {
    /**
     * 总文档数
     * @format int32
     * @example 15
     */
    totalDocuments?: number;
    /**
     * 已启用文档数
     * @format int32
     * @example 12
     */
    activeDocuments?: number;
    /**
     * 总分段数
     * @format int32
     * @example 120
     */
    totalChunks?: number;
    /**
     * 平均分段大小
     * @format int32
     * @example 512
     */
    avgChunkSize?: number;
}

/** 知识库启用状态切换请求参数 */
export interface KnowledgeBaseToggleDto {
    /**
     * 启用状态
     * @example true
     */
    enabled: boolean;
}

/** 文档启用状态切换请求参数 */
export interface KnowledgeBaseDocToggleDto {
    /**
     * 启用状态
     * @example true
     */
    enabled: boolean;
}

/** The API response result of supporting international message. */
export type KnowledgeBaseDocLisResult = ApiLocaleResult & {
    /** Actual response data or error details. */
    data?: KnowledgeBaseDocListVo;
};

/** 文档列表视图对象 */
export interface KnowledgeBaseDocListVo extends TenantAuditingVo {
    /**
     * 文档ID
     * @format int64
     * @example 1
     */
    id?: number;
    /**
     * 文档名称
     * @example "产品手册.pdf"
     */
    name?: string;
    /**
     * 文档类型
     * @example "PDF"
     */
    type?: KnowledgeBaseDocTypeEnum;
    /**
     * 文件大小
     * @example 2.5
     */
    size?: string;
    /**
     * 处理状态
     * @example "COMPLETED"
     */
    status?: KnowledgeBaseDocStatusEnum;
    /**
     * 是否启用
     * @example true
     */
    enabled?: boolean;
    /**
     * 分段数量
     * @format int32
     * @example 8
     */
    chunks?: number;
    /**
     * 处理进度
     * @format int32
     * @example 100
     */
    processingProgress?: number;
    /** 错误信息 */
    errorMessage?: string;
}

/** The API response result of supporting international message. */
export type DatasetDetailResult = ApiLocaleResult & {
    /** Actual response data or error details. */
    data?: DatasetDetailVo;
};

/** 数据集数据统计响应 */
export interface DatasetDataStatisticsVo {
    /**
     * 总文件或表数
     * @format int64
     */
    totalFilesOrTables?: number;
    /**
     * 总记录数
     * @format int64
     */
    totalRecords?: number;
    /** 记录总大小 */
    totalRecordsSize?: string;
    /** 已使用存储空间大小 */
    usedStoreSize?: string;
}

/** 数据集详情响应 */
export interface DatasetDetailVo extends TenantAuditingVo {
    /**
     * 数据集ID
     * @format int64
     */
    id?: number;
    /** 数据集名称 */
    name?: string;
    /** 数据集描述 */
    description?: string;
    /** 数据集类型 */
    type?: DatasetTypeEnum;
    /** 数据集状态 */
    status?: DatasetStatusEnum;
    /** 可见性 */
    visibility?: VisibilityEnum;
    /** 图标emoji */
    icon?: string;
    /** 背景色 */
    iconBg?: string;
    /** 标签 */
    tags?: string[];
    /** 数据源配置信息 */
    datasourceConfig?: DatasourceConfigVo;
    /** 统计信息 */
    dataStatistics?: DatasetDataStatisticsVo;
}

/** 数据源详情响应 */
export interface DatasourceConfigVo {
    /** 数据源名称 */
    name?: string;
    /** 数据库类型 */
    databaseType?: DatasourceTypeEnum;
    /** 数据库 */
    database?: string;
    /** 数据库Jdbc URL */
    jdbcUrl?: string;
    /** 数据库主机名或IP */
    host?: string;
    /**
     * 数据库端口
     * @format int32
     */
    port?: number;
    /** 数据库用户名 */
    username?: string;
    /** 数据库密码 */
    password?: string;
}

/** 添加数据源请求参数 */
export interface DataSourceUpdateDto {
    /**
     * 数据源名称
     * @example "MySQL数据库"
     */
    name: string;
    /**
     * 数据源类型
     * @example "database"
     */
    databaseType: DatasourceTypeEnum;
    /** 数据库 */
    database?: string;
    /** 数据库Jdbc URL */
    jdbcUrl?: string;
    /** 数据库主机名或IP */
    host?: string;
    /**
     * 数据库端口
     * @format int32
     */
    port?: number;
    /** 数据库用户名 */
    username?: string;
    /** 数据库密码 */
    password?: string;
}

/** The API response result of supporting international message. */
export type DatasourceConfigResult = ApiLocaleResult & {
    /** Actual response data or error details. */
    data?: DatasourceConfigVo;
};

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
    status?: ApplicationStatusEnum;
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
    share?: ApplicationShareVo;
    /** 统计数据 */
    stats?: ApplicationStatsVo;
}

/** 分享信息 */
export interface ApplicationShareVo {
    /** 公开访问：允许任何人通过链接访问应用 */
    publicAccess?: boolean;
    /** 匿名访问：允许未登录用户访问应用 */
    anonymousAccess?: boolean;
    /** 授权访问：只有授权用户才可访问 */
    authorizationRequired?: boolean;
    /** 分享ID */
    shareId?: string;
    /** 分享链接 */
    shareUrl?: string;
    /** 邀请码 */
    inviteCode?: string;
    /** 二维码图片URL */
    qrCode?: string;
    /**
     * 过期时间
     * @format date-time
     */
    expiresAt?: string;
}

/** 应用统计 */
export interface ApplicationStatsVo {
    /**
     * 总API调用次数
     * @format int64
     */
    totalApiCalls?: number;
    /**
     * 总token数
     * @format int64
     */
    totalTokens?: number;
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

/** 提示词配置 */
export interface PromptsConfigVo {
    /** 系统提示词 */
    system?: string;
    /** 上下文提示词 */
    context?: string;
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

/** 创建工作流请求参数 */
export interface WorkflowCreateDto {
    /**
     * 工作流名称
     * @example "用户注册流程"
     */
    name: string;
    /**
     * 工作流描述
     * @example "处理用户注册的完整流程"
     */
    description: string;
    /**
     * 图标emoji
     * @example "🔄"
     */
    icon?: string;
    /**
     * 背景色
     * @example "bg-blue-500"
     */
    iconBg?: string;
    /** 工作流类型 */
    type: WorkflowTypeEnum;
    /** 初始配置 */
    config?: object;
}

/** 执行工作流请求参数 */
export interface WorkflowExecuteDto {
    /** 输入变量 */
    inputs?: object;
    /**
     * 执行模式
     * @example "async"
     */
    mode?: string;
}

/** The API response result of supporting international message. */
export type WorkflowExecuteResult = ApiLocaleResult & {
    /** Actual response data or error details. */
    data?: WorkflowExecuteResultVo;
};

/** 工作流执行结果响应 */
export interface WorkflowExecuteResultVo {
    /** 执行ID */
    executionId?: string;
    /** 执行状态 */
    status?: string;
    /** 执行结果 */
    result?: object;
    /**
     * 执行时间（毫秒）
     * @format int64
     */
    executionTime?: number;
    /**
     * 开始时间
     * @format int64
     */
    startedAt?: number;
    /**
     * 完成时间
     * @format int64
     */
    completedAt?: number;
}

/** 创建资源共享参数 */
export interface ResourceSharingCreateDto {
    /**
     * 资源ID
     * @format int64
     */
    resourceId: number;
    /** 资源类型 */
    resourceType: ResourceTypeEnum;
    /** 共享范围（all-全体成员，specific-指定成员） */
    sharedWith: SharedWithEnum;
    /** 权限（view-查看，edit-编辑，manage-管理） */
    permission: MemberPermissionEnum;
    /** 指定成员ID列表（sharedWith为specific时必填） */
    memberIds?: number[];
}

/** 创建API密钥请求 */
export interface ApiKeyCreateDto {
    /**
     * 密钥名称
     * @example "全权限API密钥"
     */
    name: string;
    /**
     * 权限列表
     * @example ["READ","WRITE"]
     */
    permissions: ApiKeyPermissionsEnum[];
    /** 授权资源列表 */
    authorizedResources?: AuthorizedResource[];
    /**
     * 速率限制（次/分钟）
     * @format int32
     * @example 1000
     */
    rateLimit?: number;
    /**
     * 每日限额
     * @format int32
     * @example 100000
     */
    dailyLimit?: number;
    /** IP白名单 */
    ipWhitelist?: string[];
    /**
     * 有效期（天数）
     * @format int32
     * @example 365
     */
    expiresIn?: number;
    /**
     * 是否永不过期
     * @example false
     */
    neverExpires?: boolean;
}

/** 授权资源 */
export interface AuthorizedResource {
    /**
     * 资源类型
     * @example "APPLICATION"
     */
    type?: ResourceTypeEnum;
    /**
     * 资源ID列表（空数组表示全部）
     * @example []
     */
    ids?: number[];
}

/** API密钥详情 */
export interface ApiKeyDetailVo extends TenantAuditingVo {
    /**
     * 密钥ID
     * @format int64
     */
    id?: number;
    /** 密钥名称 */
    name?: string;
    /** 密钥前缀（用于部分显示）sk-abc123 */
    keyPrefix?: string;
    /** 完整密钥（仅创建时返回） */
    key?: string;
    /** 部分可见密钥 */
    keyVisible?: string;
    /** 状态 */
    status?: ApiKeyStatusEnum;
    /** 状态颜色 */
    statusColor?: string;
    /** 权限列表 */
    permissions?: ApiKeyPermissionsEnum[];
    /** 授权资源列表 */
    authorizedResources?: AuthorizedResourceVo[];
    /**
     * 速率限制
     * @format int32
     */
    rateLimit?: number;
    /**
     * 每日限额
     * @format int32
     */
    dailyLimit?: number;
    /** IP白名单 */
    ipWhitelist?: string[];
    /**
     * 使用次数
     * @format int64
     */
    usageCount?: number;
    /**
     * 最后使用时间（格式化）
     * @format date-time
     */
    lastUsedAt?: string;
    /**
     * 过期时间戳
     * @format date-time
     */
    expiresAt?: string;
    /**
     * 撤销时间戳
     * @format date-time
     */
    revokedAt?: string;
    /** 撤销原因 */
    revokeReason?: string;
    /** 警告信息 */
    warning?: string;
    /** 使用统计 */
    usageStats?: UsageStatsVo;
}

/** The API response result of supporting international message. */
export type ApiKeyDetailResult = ApiLocaleResult & {
    /** Actual response data or error details. */
    data?: ApiKeyDetailVo;
};

/** 授权资源 */
export interface AuthorizedResourceVo {
    /** 资源类型 */
    type?: ResourceTypeEnum;
    /** 资源ID列表 */
    ids?: number[];
    /** 资源名称列表 */
    names?: string[];
}

/** 使用统计 */
export interface UsageStatsVo {
    /**
     * 总计
     * @format int64
     */
    total?: number;
    /**
     * 今日
     * @format int64
     */
    today?: number;
    /**
     * 本周
     * @format int64
     */
    thisWeek?: number;
    /**
     * 本月
     * @format int64
     */
    thisMonth?: number;
}

/** 撤销API密钥请求 */
export interface ApiKeyRevokeDto {
    /**
     * 撤销原因
     * @example "密钥泄露"
     */
    reason?: string;
}

/** 创建提示词请求参数 */
export interface PromptCreateDto {
    /** 提示词标题 */
    title: string;
    /** 提示词内容 */
    content: string;
    /** 描述 */
    description?: string;
    /**
     * 分类ID
     * @format int64
     */
    categoryId: number;
    /** 标签 */
    tags?: string[];
}

/** The API response result of supporting international message. */
export type PromptDetailResult = ApiLocaleResult & {
    /** Actual response data or error details. */
    data?: PromptDetailVo;
};

/** 提示词详情 */
export interface PromptDetailVo extends TenantAuditingVo {
    /**
     * ID
     * @format int64
     */
    id?: number;
    /** 标题 */
    title?: string;
    /** 内容 */
    content?: string;
    /** 描述 */
    description?: string;
    /**
     * 分类ID
     * @format int64
     */
    categoryId?: number;
    /** 分类名称 */
    categoryName?: string;
    /** 标签 */
    tags?: string[];
    /** 是否收藏 */
    isFavorite?: boolean;
    /** 是否为系统模板 */
    isSystem?: boolean;
    /** 统计信息 */
    stats?: PromptStatsVo;
}

/** 提示词统计信息 */
export interface PromptStatsVo {
    /**
     * 总使用次数
     * @format int64
     */
    totalUses?: number;
    /**
     * 收藏次数
     * @format int64
     */
    favorites?: number;
}

/** 创建分类请求参数 */
export interface PromptCategoryCreateDto {
    /** 分类名称 */
    name: string;
    /** 图标名称 */
    icon?: string;
    /** 颜色类名 */
    color?: string;
    /**
     * 父分类ID（可选，为空表示根分类）
     * @format int64
     */
    parentId?: number;
}

/** The API response result of supporting international message. */
export type PromptCategoryResult = ApiLocaleResult & {
    /** Actual response data or error details. */
    data?: PromptCategoryVo;
};

/** 分类详情 */
export interface PromptCategoryVo {
    /**
     * ID
     * @format int64
     */
    id?: number;
    /** 分类名称 */
    name?: string;
    /** 图标名称 */
    icon?: string;
    /** 颜色类名 */
    color?: string;
    /**
     * 父分类ID
     * @format int64
     */
    parentId?: number;
    /** 是否为系统分类 */
    isSystem?: boolean;
    /**
     * 该分类下的提示词数量
     * @format int64
     */
    promptCount?: number;
    /**
     * 排序
     * @format int32
     */
    orderNum?: number;
    /** 子分类列表 */
    children?: PromptCategoryVo[];
}

/** 创建插件请求参数 */
export interface PluginCreateDto {
    /**
     * 插件名称
     * @example "天气查询插件"
     */
    name: string;
    /**
     * 插件图标
     * @example "🌤️"
     */
    icon?: string;
    /**
     * 插件描述
     * @example "提供实时天气查询功能"
     */
    description?: string;
    /**
     * 作者
     * @example "XCan"
     */
    author?: string;
    /**
     * 版本号
     * @example "1.0.0"
     */
    version: string;
    /** 插件分类 */
    category: PluginCategoryEnum;
    /** 插件类型 */
    type: PluginTypeEnum;
    /** 标签列表 */
    tags?: string[];
    /**
     * 是否公开
     * @example false
     */
    isPublic?: boolean;
    /**
     * 最小系统版本要求
     * @example "1.0.0"
     */
    minVersion?: string;
    /** 主页URL */
    homepageUrl?: string;
    /** 文档URL */
    documentationUrl?: string;
    /** 源码仓库URL */
    repositoryUrl?: string;
    /** 支持URL */
    supportUrl?: string;
    /**
     * 许可证
     * @example "MIT"
     */
    license?: string;
    /**
     * 插件规范文件，最大支持200MB
     * @format binary
     */
    file: File;
    /**
     * 价格（0表示免费）
     * @format double
     * @example 0
     */
    price?: number;
    /**
     * 货币单位
     * @example "CNY"
     */
    currency?: string;
}

/** 创建插件评级请求体 */
export interface PluginReviewCreateDto {
    /**
     * 评分星级（1-5）
     * @format int32
     */
    rating: number;
    /** 评价内容（最长200字符） */
    content?: string;
}

/** The API response result of supporting international message. */
export type PluginReviewResult = ApiLocaleResult & {
    /** Actual response data or error details. */
    data?: PluginReviewVo;
};

/** 插件评级记录 */
export interface PluginReviewVo {
    /** @format int64 */
    id?: number;
    /** @format int64 */
    pluginId?: number;
    /** @format int32 */
    rating?: number;
    content?: string;
    /**
     * 创建者ID
     * @format int64
     */
    createdBy?: number;
    /** 创建者姓名 */
    creator?: string;
    /**
     * 创建时间
     * @format date-time
     */
    createdDate?: string;
}

/** 创建插件请求参数 */
export interface PluginVerifyDto {
    /**
     * 插件名称
     * @example "天气查询插件"
     */
    name: string;
    /**
     * 版本号
     * @example "1.0.0"
     */
    version: string;
    /** 插件分类 */
    category: PluginCategoryEnum;
    /** 插件类型 */
    type: PluginTypeEnum;
    /**
     * 插件规范文件，最大支持200MB
     * @format binary
     */
    file: File;
}

/** 创建模型请求参数 */
export interface ModelCreateDto {
    /**
     * 模型名称
     * @example "GPT-4"
     */
    name: string;
    /**
     * 模型描述
     * @example "OpenAI GPT-4 语言模型"
     */
    description: string;
    /** 模型类型 */
    type: ModelTypeEnum;
    /** 模型提供商 */
    provider: ModelProviderEnum;
    /**
     * 版本号
     * @example "gpt-4-1106-preview"
     */
    version?: string;
    /**
     * API端点
     * @example "https://api.openai.com/v1/chat/completions"
     */
    apiEndpoint?: string;
    /** API密钥 */
    apiKey?: string;
    /**
     * 温度参数
     * @format double
     */
    temperature?: number;
    /**
     * 最大token数
     * @format int32
     */
    maxTokens?: number;
}

/** 测试模型请求参数 */
export interface ModelTestDto {
    /**
     * 测试提示词
     * @example "你好，请介绍一下自己"
     */
    testPrompt: string;
}

/** 知识库配置 */
export interface KnowledgeBaseConfigDto {
    /**
     * 分段大小
     * @format int32
     * @example 512
     */
    chunkSize?: number;
    /**
     * 分段重叠
     * @format int32
     * @example 50
     */
    chunkOverlap?: number;
    /**
     * 向量化模型
     * @example "text-embedding-ada-002"
     */
    embeddingModel?: string;
}

/** 创建知识库请求参数 */
export interface KnowledgeBaseCreateDto {
    /**
     * 知识库名称
     * @example "产品文档库"
     */
    name: string;
    /**
     * 图标
     * @example "📚"
     */
    icon: string;
    /**
     * 背景色
     * @example "bg-blue-100"
     */
    iconBg: string;
    /**
     * 描述
     * @example "存储产品相关文档和资料"
     */
    description: string;
    /**
     * 可见性
     * @example "PRIVATE"
     */
    visibility: VisibilityEnum;
    /**
     * 标签
     * @example ["产品","文档"]
     */
    tags?: string[];
    /** 配置信息 */
    config?: KnowledgeBaseConfigDto;
}

/** The API response result of supporting international message. */
export type KnowledgeBaseDocStatusResult = ApiLocaleResult & {
    /** Actual response data or error details. */
    data?: KnowledgeBaseDocStatusVo;
};

/** 文档状态视图对象 */
export interface KnowledgeBaseDocStatusVo {
    /**
     * 文档ID
     * @format int64
     * @example 1
     */
    id?: number;
    /**
     * 处理状态
     * @example "PROCESSING"
     */
    status?: KnowledgeBaseDocStatusEnum;
    /**
     * 处理进度
     * @format int32
     * @example 75
     */
    processingProgress?: number;
    /**
     * 分段数量
     * @format int32
     * @example 8
     */
    chunks?: number;
    /** 错误信息 */
    errorMessage?: string;
}

/** The API response result of supporting international message. */
export type ListKnowledgeBaseDocListResult = ApiLocaleResult & {
    /** Actual response data or error details. */
    data?: KnowledgeBaseDocListVo[];
};

/** 文档检索请求参数 */
export interface KnowledgeBaseDocSearchDto {
    /** 搜索关键字 */
    keyword?: string;
    /**
     * 返回数量
     * @format int32
     * @example 5
     */
    limit?: number;
    /**
     * 相似度阈值
     * @format double
     * @example 0.5
     */
    threshold?: number;
}

/** The API response result of supporting international message. */
export type ListKnowledgeBaseDocSearchResult = ApiLocaleResult & {
    /** Actual response data or error details. */
    data?: KnowledgeBaseDocSearchResultVo[];
};

/** 文档检索结果 */
export interface KnowledgeBaseDocSearchResultVo {
    /**
     * 文档ID
     * @format int64
     * @example 1
     */
    documentId?: number;
    /**
     * 文档名称
     * @example "产品手册.pdf"
     */
    documentName?: string;
    /**
     * 分段ID
     * @example "chunk_001"
     */
    chunkId?: string;
    /**
     * 分段内容
     * @example "产品功能介绍..."
     */
    content?: string;
    /**
     * 相似度分数
     * @format double
     * @example 0.85
     */
    score?: number;
    /**
     * 元数据
     * @example {"pageNo":1,"position":"header"}
     */
    metadata?: Record<string, object>;
}

/** 批量删除文档请求参数 */
export interface KnowledgeBaseDocBatchDeleteDto {
    /**
     * 文档ID列表
     * @example [1,2,3]
     */
    documentIds: number[];
}

/** 创建数据集请求参数 */
export interface DatasetCreateDto {
    /**
     * 数据集名称
     * @example "用户行为数据"
     */
    name: string;
    /**
     * 数据集描述
     * @example "用户行为分析数据集"
     */
    description: string;
    /** 数据类型 */
    type: DatasetTypeEnum;
    /** 可见性 */
    visibility: VisibilityEnum;
    /**
     * 图标emoji
     * @example "📊"
     */
    icon?: string;
    /**
     * 背景色
     * @example "bg-blue-500"
     */
    iconBg?: string;
    /** 标签，最多5个 */
    tags?: string[];
}

/** The API response result of supporting international message. */
export type ListDatasetDataResult = ApiLocaleResult & {
    /** Actual response data or error details. */
    data?: DatasetDataListVo[];
};

/** 数据集数据列表项响应 */
export interface DatasetDataListVo extends TenantAuditingVo {
    /**
     * 数据ID
     * @format int64
     */
    id?: number;
    /** 数据集数据名称 */
    name?: string;
    /** 数据类型 */
    type?: DatasetDataTypeEnum;
    /** 状态 */
    status?: DatasetDataStatusEnum;
    /**
     * 数据记录数
     * @format int64
     */
    dataCount?: number;
    /** 数据大小 */
    dataSize?: string;
}

/** The API response result of supporting international message. */
export type ListSyncDataResult = ApiLocaleResult & {
    /** Actual response data or error details. */
    data?: SyncDataVo[];
};

/** 同步结果响应 */
export interface SyncDataVo {
    /** 同步文件名或表名 */
    name?: string;
    /** 同步状态 */
    status?: SyncDataStatusEnum;
    /** 失败原因 */
    failedReason?: string;
}

/** 测试数据源连接请求参数 */
export interface DatasourceConnectionTestDto {
    /**
     * 已保存数据集ID
     * @format int64
     */
    datasetId?: number;
    /** 数据源类型 */
    databaseType?: DatasourceTypeEnum;
    /** 数据库 */
    database?: string;
    /** 数据库Jdbc URL */
    jdbcUrl?: string;
    /** 数据库主机名或IP */
    host?: string;
    /**
     * 数据库端口
     * @format int32
     */
    port?: number;
    /** 数据库用户名 */
    username?: string;
    /** 数据库密码 */
    password?: string;
}

/** The API response result of supporting international message. */
export type DatasourceConnectionTestResult = ApiLocaleResult & {
    /** Actual response data or error details. */
    data?: DatasourceConnectionTestVo;
};

/** 连接测试响应 */
export interface DatasourceConnectionTestVo {
    /** 状态 */
    success?: boolean;
    /** 消息 */
    message?: string;
    /** 详细信息 */
    details?: string;
}

/** 会话配置 */
export interface SessionConfig {
    /**
     * 温度参数，范围 0-2，用于控制生成文本的随机性，越大越随机。
     * @format double
     * @example 0.5
     */
    temperature?: number;
    /**
     * 最大令牌数（max tokens），控制生成文本的最大长度。若为空则使用模型默认值。
     * @format int32
     * @example 1024
     */
    maxTokens?: number;
    /**
     * Top-p (nucleus sampling) 参数，范围 0-1，用于采样时截断概率分布。
     * @format double
     * @example 0.9
     */
    topP?: number;
    /**
     * 频率惩罚（frequency penalty），范围 0-2，用于降低重复词语的概率。
     * @format double
     * @example 0
     */
    frequencyPenalty?: number;
    /**
     * 存在惩罚（presence penalty），范围 0-2，用于鼓励模型引入新话题。
     * @format double
     * @example 0
     */
    presencePenalty?: number;
    /** 系统提示词（system prompt），用于设定对话的系统角色或上下文，最大长度 60000 字符。 */
    systemPrompt: string;
    /**
     * 是否启用流式响应（stream response）；为 null 时自动根据接口类型判断。
     * @example true
     */
    streamResponse?: boolean;
    /**
     * 是否保存历史记录（save history），默认 true。
     * @example true
     */
    saveHistory?: boolean;
}

/** 创建会话请求 */
export interface SessionCreateDto {
    /**
     * 会话标题
     * @example "新对话"
     */
    title?: string;
    /**
     * 关联的应用ID
     * @format int64
     */
    appId: number;
    /**
     * 使用的模型ID
     * @format int64
     */
    modelId?: number;
    /** 会话配置 */
    config?: SessionConfig;
}

/** The API response result of supporting international message. */
export type SessionDetailResult = ApiLocaleResult & {
    /** Actual response data or error details. */
    data?: SessionDetailVo;
};

/** 会话详情视图 */
export interface SessionDetailVo extends TenantAuditingVo {
    /**
     * 会话ID
     * @format int64
     */
    id?: number;
    /** 会话标题 */
    title?: string;
    /**
     * 关联的应用ID
     * @format int64
     */
    appId?: number;
    /** 应用名称 */
    appName?: string;
    /**
     * 使用的模型ID
     * @format int64
     */
    modelId?: number;
    /** 模型名称 */
    modelName?: string;
    /** 会话配置 */
    config?: SessionConfig;
    /**
     * 消息总数
     * @format int32
     */
    messageCount?: number;
    /** 是否收藏 */
    isStarred?: boolean;
}

/** The API response result of supporting international message. */
export type MessageResult = ApiLocaleResult & {
    /** Actual response data or error details. */
    data?: MessageVo;
};

export interface MessageAttachment {
    /** @format int64 */
    id?: number;
    name?: string;
    type?: string;
    /** @format int64 */
    size?: number;
    url?: string;
}

export interface MessageUsage {
    /** @format int32 */
    promptTokens?: number;
    /** @format int32 */
    completionTokens?: number;
    /** @format int32 */
    totalTokens?: number;
    cost?: number;
}

/** 消息视图 */
export interface MessageVo {
    /**
     * 消息ID
     * @format int64
     */
    id?: number;
    /**
     * 会话ID
     * @format int64
     */
    sessionId?: number;
    /** 消息角色 */
    role?: MessageRoleEnum;
    /** 消息内容 */
    content?: string;
    /** 附件列表 */
    attachments?: MessageAttachment[];
    /** 使用统计（仅AI消息） */
    usage?: MessageUsage;
    /**
     * 消息时间
     * @format date-time
     */
    datetime?: string;
    /** 是否正在流式生成 */
    isStreaming?: boolean;
}

/** 发送消息请求 */
export interface MessageSendDto {
    /** 消息内容 */
    content: string;
    /** 附件列表 */
    attachments?: MessageAttachment[];
    /** 覆盖会话配置 */
    overrideConfig?: SessionConfig;
    /**
     * 应用的提示词ID，用于统计分析
     * @format int64
     */
    promptId?: number;
}

/** The API response result of supporting international message. */
export type MessageSendResult = ApiLocaleResult & {
    /** Actual response data or error details. */
    data?: MessageSendVo;
};

/** 发送消息响应 */
export interface MessageSendVo {
    /** 用户消息 */
    userMsg?: MessageVo;
    /** AI响应消息 */
    assistantMsg?: MessageVo;
}

/** 消息反馈请求 */
export interface MessageFeedbackDto {
    /** 反馈类型：like或dislike */
    feedbackType: string;
    /** 反馈说明 */
    comment?: string;
}

export interface SseEmitter {
    /** @format int64 */
    timeout?: number;
}

/** 批量删除会话请求 */
export interface SessionBatchDeleteDto {
    /** 会话ID列表 */
    sessionIds: number[];
}

/** The API response result of supporting international message. */
export type AttachmentUploadResult = ApiLocaleResult & {
    /** Actual response data or error details. */
    data?: AttachmentUploadVo;
};

/** 附件上传响应 */
export interface AttachmentUploadVo {
    /**
     * 附件ID
     * @format int64
     */
    id?: number;
    /** 文件名 */
    name?: string;
    /** MIME类型 */
    type?: string;
    /**
     * 文件大小
     * @format int64
     */
    size?: number;
    /** 访问URL */
    url?: string;
    /**
     * 上传时间
     * @format int64
     */
    uploadedAt?: number;
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

/** 更新工作流请求参数 */
export interface WorkflowUpdateDto {
    /**
     * 工作流名称
     * @example "用户注册流程"
     */
    name?: string;
    /**
     * 工作流描述
     * @example "处理用户注册的完整流程"
     */
    description?: string;
    /**
     * 图标emoji
     * @example "🔄"
     */
    icon?: string;
    /**
     * 背景色
     * @example "bg-blue-500"
     */
    iconBg?: string;
    /** 工作流类型 */
    type?: WorkflowTypeEnum;
}

/** 更新提示词请求参数 */
export interface PromptUpdateDto {
    /** 提示词标题 */
    title?: string;
    /** 提示词内容 */
    content?: string;
    /** 描述 */
    description?: string;
    /**
     * 分类ID
     * @format int64
     */
    categoryId?: number;
    /** 标签 */
    tags?: string[];
}

/** 更新分类请求参数 */
export interface PromptCategoryUpdateDto {
    /** 分类名称 */
    name?: string;
    /** 图标名称 */
    icon?: string;
    /** 颜色类名 */
    color?: string;
    /**
     * 父分类ID（可选）
     * @format int64
     */
    parentId?: number;
}

/** 更新插件请求参数 */
export interface PluginUpdateDto {
    /** 插件名称 */
    name?: string;
    /** 插件图标 */
    icon?: string;
    /** 插件描述 */
    description?: string;
    /** 作者 */
    author?: string;
    /** 版本号 */
    version?: string;
    /** 插件分类 */
    category?: PluginCategoryEnum;
    /** 插件状态 */
    status?: PluginStatusEnum;
    /** 插件类型 */
    type?: PluginTypeEnum;
    /** 标签列表 */
    tags?: string[];
    /** 是否公开 */
    isPublic?: boolean;
    /** 最小系统版本要求 */
    minVersion?: string;
    /** 主页URL */
    homepageUrl?: string;
    /** 文档URL */
    documentationUrl?: string;
    /** 源码仓库URL */
    repositoryUrl?: string;
    /** 支持URL */
    supportUrl?: string;
    /** 许可证 */
    license?: string;
    /**
     * 插件规范文件，最大支持200MB
     * @format binary
     */
    file?: File;
    /**
     * 价格
     * @format double
     */
    price?: number;
    /** 货币单位 */
    currency?: string;
}

/** 更新模型请求参数 */
export interface ModelUpdateDto {
    /**
     * 模型名称
     * @example "GPT-4"
     */
    name?: string;
    /**
     * 模型描述
     * @example "OpenAI GPT-4 语言模型"
     */
    description?: string;
    /** 模型类型 */
    type?: ModelTypeEnum;
    /** 模型提供商 */
    provider?: ModelProviderEnum;
    /**
     * 版本号
     * @example "gpt-4-1106-preview"
     */
    version?: string;
    /**
     * API端点
     * @example "https://api.openai.com/v1/chat/completions"
     */
    apiEndpoint?: string;
    /** API密钥 */
    apiKey?: string;
    /**
     * 温度参数
     * @format double
     */
    temperature?: number;
    /**
     * 最大token数
     * @format int32
     */
    maxTokens?: number;
}

/** 更新知识库请求参数 */
export interface KnowledgeBaseUpdateDto {
    /**
     * 知识库名称
     * @example "产品文档库"
     */
    name?: string;
    /**
     * 图标
     * @example "📚"
     */
    icon?: string;
    /**
     * 背景色
     * @example "bg-blue-100"
     */
    iconBg?: string;
    /**
     * 描述
     * @example "存储产品相关文档和资料"
     */
    description?: string;
    /**
     * 可见性
     * @example "PRIVATE"
     */
    visibility?: VisibilityEnum;
    /**
     * 标签
     * @example ["产品","文档"]
     */
    tags?: string[];
    /** 配置信息 */
    config?: KnowledgeBaseConfigDto;
}

/** 更新数据集请求参数 */
export interface DatasetUpdateDto {
    /**
     * 数据集名称
     * @example "用户行为数据"
     */
    name?: string;
    /**
     * 数据集描述
     * @example "用户行为分析数据集"
     */
    description?: string;
    /**
     * 图标emoji
     * @example "📊"
     */
    icon?: string;
    /**
     * 背景色
     * @example "bg-blue-500"
     */
    iconBg?: string;
    /** 可见性 */
    visibility?: VisibilityEnum;
    /** 标签，最多5个 */
    tags?: string[];
}

/** 切换模型请求 */
export interface SessionSwitchModelDto {
    /**
     * 新模型ID
     * @format int64
     */
    modelId: number;
}

/** 切换应用请求 */
export interface SessionSwitchAppDto {
    /**
     * 新应用ID
     * @format int64
     */
    appId: number;
}

/** 收藏会话请求 */
export interface SessionStarDto {
    /** 是否收藏 */
    isStarred: boolean;
}

/** 更新会话请求 */
export interface SessionUpdateDto {
    /** 会话标题 */
    title?: string;
    /** 会话配置 */
    config?: SessionConfig;
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

/** The API response result of supporting international message. */
export type WorkflowListResult = ApiLocaleResult & {
    /** Actual response data or error details. */
    data?: PageWorkflowListVo;
};

export interface PageWorkflowListVo {
    /**
     * Total number
     * @format int64
     * @example 10
     */
    total?: number;
    /** Page data */
    list?: WorkflowListVo[];
}

/** 工作流列表项响应 */
export interface WorkflowListVo extends TenantAuditingVo {
    /**
     * 工作流ID
     * @format int64
     */
    id?: number;
    /** 工作流名称 */
    name?: string;
    /** 工作流描述 */
    description?: string;
    /** 图标emoji */
    icon?: string;
    /** 背景色 */
    iconBg?: string;
    /** 工作流类型 */
    type?: WorkflowTypeEnum;
    /** 工作流状态 */
    status?: WorkflowStatusEnum;
    /** 是否启用 */
    enabled?: boolean;
    /**
     * 节点数量
     * @format int32
     */
    nodesCount?: number;
    /** 版本号 */
    version?: string;
    /** 统计信息 */
    stats?: object;
}

/** The API response result of supporting international message. */
export type WorkflowStatisticsResult = ApiLocaleResult & {
    /** Actual response data or error details. */
    data?: WorkflowStatisticsVo;
};

/** 工作流统计响应 */
export interface WorkflowStatisticsVo {
    /** 总工作流数 */
    totalWorkflows?: object;
    /** 运行中的工作流数 */
    runningWorkflows?: object;
    /** 今日调用次数 */
    todayCalls?: object;
    /** 成功率 */
    successRate?: object;
}

/** The API response result of supporting international message. */
export type ExecutionDetailResult = ApiLocaleResult & {
    /** Actual response data or error details. */
    data?: ExecutionDetailVo;
};

/** 执行详情响应 */
export interface ExecutionDetailVo {
    /** 执行ID */
    executionId?: string;
    /**
     * 工作流ID
     * @format int64
     */
    workflowId?: number;
    /** 工作流名称 */
    workflowName?: string;
    /** 执行状态 */
    status?: string;
    /**
     * 开始时间
     * @format int64
     */
    startedAt?: number;
    /**
     * 完成时间
     * @format int64
     */
    completedAt?: number;
    /**
     * 执行时间（毫秒）
     * @format int64
     */
    executionTime?: number;
    /** 输入参数 */
    inputs?: object;
    /** 输出结果 */
    outputs?: object;
    /** 节点执行详情 */
    nodeExecutions?: object;
    /** 错误信息 */
    error?: object;
}

/** The API response result of supporting international message. */
export type ExecutionLogResult = ApiLocaleResult & {
    /** Actual response data or error details. */
    data?: PageExecutionLogVo;
};

/** 执行日志响应 */
export interface ExecutionLogVo {
    /**
     * 日志ID
     * @format int64
     */
    id?: number;
    /** 执行ID */
    executionId?: string;
    /**
     * 工作流ID
     * @format int64
     */
    workflowId?: number;
    /** 工作流名称 */
    workflowName?: string;
    /** 活动描述 */
    activity?: string;
    /** 执行状态 */
    status?: string;
    /** 状态颜色 */
    statusColor?: string;
    /** 操作人 */
    operator?: string;
    /**
     * 执行时间（毫秒）
     * @format int64
     */
    executionTime?: number;
    /**
     * 创建时间
     * @format date-time
     */
    createdDate?: string;
    /** 输入参数 */
    inputs?: object;
    /** 输出结果 */
    outputs?: object;
    /** 错误信息 */
    error?: string;
    /** 节点执行详情 */
    nodeExecutions?: object;
}

export interface PageExecutionLogVo {
    /**
     * Total number
     * @format int64
     * @example 10
     */
    total?: number;
    /** Page data */
    list?: ExecutionLogVo[];
}

/** The API response result of supporting international message. */
export type ResourceSharingListResult = ApiLocaleResult & {
    /** Actual response data or error details. */
    data?: PageResourceSharingListVo;
};

export interface PageResourceSharingListVo {
    /**
     * Total number
     * @format int64
     * @example 10
     */
    total?: number;
    /** Page data */
    list?: ResourceSharingListVo[];
}

/** 资源共享列表项 */
export interface ResourceSharingListVo extends TenantAuditingVo {
    /**
     * 共享ID
     * @format int64
     */
    id?: number;
    /**
     * 资源ID
     * @format int64
     */
    resourceId?: number;
    /** 资源名称 */
    resourceName?: string;
    /** 资源类型 */
    resourceType?: ResourceTypeEnum;
    /** 是否启用 */
    enabled?: boolean;
    /**
     * 所有者ID
     * @format int64
     */
    ownerId?: number;
    /** 所有者姓名 */
    ownerName?: string;
    /** 所有者邮箱 */
    ownerEmail?: string;
    /** 所有者头像 */
    ownerAvatar?: string;
    /** 共享范围 */
    sharedWith?: SharedWithEnum;
    /**
     * 成员数量
     * @format int32
     */
    memberCount?: number;
    /** 权限 */
    permission?: MemberPermissionEnum;
    /**
     * 访问次数
     * @format int64
     */
    views?: number;
    /**
     * 编辑次数
     * @format int64
     */
    edits?: number;
}

/** 统计信息 */
export interface AccessStatisticsVo {
    /**
     * 总访问次数
     * @format int64
     */
    totalViews?: number;
    /**
     * 总编辑次数
     * @format int64
     */
    totalEdits?: number;
    /**
     * 独立访客数
     * @format int64
     */
    uniqueVisitors?: number;
    /**
     * 平均每用户访问次数
     * @format double
     */
    avgAccessesPerUser?: number;
    /** 访问趋势 */
    viewTrend?: ViewTrendVo[];
}

/** The API response result of supporting international message. */
export type ResourceSharingStatisticsResult = ApiLocaleResult & {
    /** Actual response data or error details. */
    data?: ResourceSharingStatisticsVo;
};

/** 资源共享统计 */
export interface ResourceSharingStatisticsVo {
    /**
     * 总共享数
     * @format int64
     */
    totalSharing?: number;
    /**
     * 总共享资源数
     * @format int64
     */
    totalResources?: number;
    /**
     * 总访问次数
     * @format int64
     */
    totalAccesses?: number;
    /** 共享资源平均授权权限 */
    avgPermission?: MemberPermissionEnum;
    /** 共享资源访问统计 */
    accessStats?: AccessStatisticsVo;
}

/** 访问趋势 */
export interface ViewTrendVo {
    /** 日期 */
    date?: string;
    /**
     * 访问次数
     * @format int64
     */
    views?: number;
    /**
     * 用户数
     * @format int64
     */
    users?: number;
}

/** The API response result of supporting international message. */
export type ResourceAccessCheckResult = ApiLocaleResult & {
    /** Actual response data or error details. */
    data?: ResourceAccessCheckVo;
};

/** 访问权限检查结果 */
export interface ResourceAccessCheckVo {
    /** 是否有访问权限 */
    hasAccess?: boolean;
    /** 资源授权权限列表 */
    resourcePermissions?: MemberPermissionEnum[];
    /**
     * 授权用户ID
     * @format int64
     */
    userId?: number;
    /** 授权用户名称 */
    userName?: string;
}

/** The API response result of supporting international message. */
export type ResourceInfoListSharePermissionResult = ApiLocaleResult & {
    /** Actual response data or error details. */
    data?: Record<
        string, MemberPermissionEnum[]
    >;
};

/** API密钥列表项 */
export interface ApiKeyListVo extends TenantAuditingVo {
    /**
     * 密钥ID
     * @format int64
     */
    id?: number;
    /** 密钥名称 */
    name?: string;
    /** 密钥前缀（用于部分显示）sk-abc123 */
    keyPrefix?: string;
    /** 部分可见密钥 */
    keyVisible?: string;
    /** 状态 */
    status?: ApiKeyStatusEnum;
    /** 状态颜色 */
    statusColor?: string;
    /** 权限列表 */
    permissions?: ApiKeyPermissionsEnum[];
    /** 授权资源列表 */
    authorizedResources?: AuthorizedResourceVo[];
    /**
     * 速率限制
     * @format int32
     */
    rateLimit?: number;
    /**
     * 每日限额
     * @format int32
     */
    dailyLimit?: number;
    /**
     * 使用次数
     * @format int64
     */
    usageCount?: number;
    /**
     * 最后使用时间（格式化）
     * @format date-time
     */
    lastUsedAt?: string;
    /**
     * 过期时间戳
     * @format date-time
     */
    expiresAt?: string;
    /**
     * 撤销时间戳
     * @format date-time
     */
    revokedAt?: string;
}

/** The API response result of supporting international message. */
export type ListApiKeyResult = ApiLocaleResult & {
    /** Actual response data or error details. */
    data?: ApiKeyListVo[];
};

/** The API response result of supporting international message. */
export type PagePromptListResult = ApiLocaleResult & {
    /** Actual response data or error details. */
    data?: PageResultPromptListVo;
};

export interface PageResultPromptListVo {
    /**
     * Total number
     * @format int64
     * @example 10
     */
    total?: number;
    /** Page data */
    list?: PromptListVo[];
}

/** 提示词列表项 */
export interface PromptListVo extends TenantAuditingVo {
    /**
     * ID
     * @format int64
     */
    id?: number;
    /** 标题 */
    title?: string;
    /** 内容 */
    content?: string;
    /**
     * 分类ID
     * @format int64
     */
    categoryId?: number;
    /** 分类名称 */
    categoryName?: string;
    /** 标签 */
    tags?: string[];
    /** 是否收藏 */
    isFavorite?: boolean;
    /** 是否为系统模板 */
    isSystem?: boolean;
}

/** The API response result of supporting international message. */
export type ListPromptCategoryResult = ApiLocaleResult & {
    /** Actual response data or error details. */
    data?: PromptCategoryVo[];
};

/** The API response result of supporting international message. */
export type PageResultPluginListResult = ApiLocaleResult & {
    /** Actual response data or error details. */
    data?: PageResultPluginListVo;
};

export interface PageResultPluginListVo {
    /**
     * Total number
     * @format int64
     * @example 10
     */
    total?: number;
    /** Page data */
    list?: PluginListVo[];
}

/** 插件列表项 */
export interface PluginListVo extends TenantAuditingVo {
    /**
     * 插件ID
     * @format int64
     */
    id?: number;
    /** 插件名称 */
    name?: string;
    /** 插件图标 */
    icon?: string;
    /** 插件描述 */
    description?: string;
    /** 作者 */
    author?: string;
    /** 版本号 */
    version?: string;
    /** 插件分类 */
    category?: PluginCategoryEnum;
    /** 插件状态 */
    status?: PluginStatusEnum;
    /** 插件类型 */
    type?: PluginTypeEnum;
    /** 标签列表 */
    tags?: string[];
    /**
     * 安装次数
     * @format int64
     */
    installCount?: number;
    /**
     * 使用次数
     * @format int64
     */
    usageCount?: number;
    /**
     * 评分
     * @format double
     */
    rating?: number;
    /**
     * 评价数量
     * @format int64
     */
    reviewCount?: number;
    /** 是否收藏 */
    isFavorite?: boolean;
    /** 是否系统插件 */
    isSystem?: boolean;
    /** 是否公开 */
    isPublic?: boolean;
    /** 是否已验证 */
    isVerified?: boolean;
    /**
     * 价格
     * @format double
     */
    price?: number;
    /** 货币单位 */
    currency?: string;
    /**
     * 发布时间
     * @format date-time
     */
    publishedDate?: string;
}

/** The API response result of supporting international message. */
export type ListPluginReviewResult = ApiLocaleResult & {
    /** Actual response data or error details. */
    data?: PluginReviewVo[];
};

/** The API response result of supporting international message. */
export type PluginStatisticsResult = ApiLocaleResult & {
    /** Actual response data or error details. */
    data?: PluginStatisticsVo;
};

/** 分类统计 */
export interface CategoryStats {
    /** 分类 */
    category?: PluginCategoryEnum;
    /**
     * 插件数量
     * @format int64
     */
    count?: number;
    /**
     * 安装数量
     * @format int64
     */
    installCount?: number;
}

/** 插件统计数据 */
export interface PluginStatisticsVo {
    /**
     * 总插件数
     * @format int64
     */
    totalPlugins?: number;
    /**
     * 总可用插件数
     * @format int64
     */
    totalAvailablePlugins?: number;
    /**
     * 我的插件数
     * @format int64
     */
    myPlugins?: number;
    /**
     * 已安装插件数
     * @format int64
     */
    installedPlugins?: number;
    /**
     * 总下载插件数
     * @format int64
     */
    downloadPlugins?: number;
    /**
     * 总访问插件数
     * @format int64
     */
    visitsPlugins?: number;
    /**
     * 公开插件数
     * @format int64
     */
    publicPlugins?: number;
    /**
     * 总安装数
     * @format int64
     */
    totalInstalls?: number;
    /**
     * 总使用数
     * @format int64
     */
    totalUsages?: number;
    /**
     * 总评级数
     * @format int64
     */
    totalRatings?: number;
    /** 分类统计 */
    categoryStats?: CategoryStats[];
    /** 近一月趋势 */
    lastMonthGrowthTrend?: LastMonthGrowthTrend;
    /** 热门插件 */
    trendingPlugins?: TrendingPlugin[];
}

/** 热门插件 */
export interface TrendingPlugin {
    /**
     * 插件ID
     * @format int64
     */
    id?: number;
    /** 插件名称 */
    name?: string;
    /** 插件图标 */
    icon?: string;
    /**
     * 安装次数
     * @format int64
     */
    installCount?: number;
    /**
     * 评分
     * @format double
     */
    rating?: number;
}

/** The API response result of supporting international message. */
export type PageResultModelListResult = ApiLocaleResult & {
    /** Actual response data or error details. */
    data?: PageModelListVo;
};

/** 模型列表项响应 */
export interface ModelListVo extends TenantAuditingVo {
    /**
     * 模型ID
     * @format int64
     */
    id?: number;
    /** 模型名称 */
    name?: string;
    /** 模型描述 */
    description?: string;
    /** 模型类型 */
    type?: ModelTypeEnum;
    /** 模型提供商 */
    provider?: ModelProviderEnum;
    /** 版本号 */
    version?: string;
    /** 模型状态 */
    status?: ModelStatusEnum;
}

export interface PageModelListVo {
    /**
     * Total number
     * @format int64
     * @example 10
     */
    total?: number;
    /** Page data */
    list?: ModelListVo[];
}

/** The API response result of supporting international message. */
export type ModelStatisticsResult = ApiLocaleResult & {
    /** Actual response data or error details. */
    data?: ModelStatisticsVo;
};

/** 模型统计响应 */
export interface ModelStatisticsVo {
    /**
     * 总模型数
     * @format int64
     */
    totalModels?: number;
    /**
     * 运行中的模型数
     * @format int64
     */
    runningModels?: number;
    /**
     * 总调用次数
     * @format int64
     */
    totalCalls?: number;
    /**
     * 成功调用次数
     * @format int64
     */
    successfulCalls?: number;
    /**
     * 失败调用次数
     * @format int64
     */
    failedCalls?: number;
    /**
     * 总Token消耗数
     * @format int64
     */
    totalTokens?: number;
    /**
     * 总成本（货币单位由业务侧定义）
     * @format double
     */
    totalCost?: number;
    /**
     * 成功率（0-100%），可由 successfulCalls/totalCalls 计算
     * @format double
     */
    successRate?: number;
    /**
     * 累计消耗的 tokens 数量
     * @format int64
     */
    totalTokensConsumed?: number;
    /**
     * 平均延迟（毫秒）
     * @format double
     */
    averageLatencyMs?: number;
    /** 近一月增长趋势 */
    lastMonthGrowthTrend?: LastMonthGrowthTrend;
    /** 今天增长趋势 */
    todayGrowthTrend?: TodayGrowthTrend;
}

/** The API response result of supporting international message. */
export type PageResultKnowledgeBaseListResult = ApiLocaleResult & {
    /** Actual response data or error details. */
    data?: PageKnowledgeBaseListVo;
};

/** 知识库列表视图对象 */
export interface KnowledgeBaseListVo extends TenantAuditingVo {
    /**
     * 知识库ID
     * @format int64
     * @example 1
     */
    id?: number;
    /**
     * 知识库名称
     * @example "产品文档库"
     */
    name?: string;
    /**
     * 图标
     * @example "📚"
     */
    icon?: string;
    /**
     * 背景色
     * @example "bg-blue-100"
     */
    iconBg?: string;
    /**
     * 描述
     * @example "存储产品相关文档和资料"
     */
    description?: string;
    /**
     * 文档数量
     * @format int32
     * @example 15
     */
    documentsCount?: number;
    /**
     * 总大小
     * @example 2.5
     */
    totalSize?: string;
    /**
     * 是否启用
     * @example true
     */
    enabled?: boolean;
    /**
     * 标签
     * @example ["产品","文档"]
     */
    tags?: string[];
    /**
     * 可见性
     * @example "PRIVATE"
     */
    visibility?: VisibilityEnum;
}

export interface PageKnowledgeBaseListVo {
    /**
     * Total number
     * @format int64
     * @example 10
     */
    total?: number;
    /** Page data */
    list?: KnowledgeBaseListVo[];
}

/** The API response result of supporting international message. */
export type PageKnowledgeBaseDocListResult = ApiLocaleResult & {
    /** Actual response data or error details. */
    data?: PageKnowledgeBaseDocListVo;
};

export interface PageKnowledgeBaseDocListVo {
    /**
     * Total number
     * @format int64
     * @example 10
     */
    total?: number;
    /** Page data */
    list?: KnowledgeBaseDocListVo[];
}

/** The API response result of supporting international message. */
export type PageDatasetListResult = ApiLocaleResult & {
    /** Actual response data or error details. */
    data?: PageResultDatasetListVo;
};

/** 数据集列表项响应 */
export interface DatasetListVo extends TenantAuditingVo {
    /**
     * 数据集ID
     * @format int64
     */
    id?: number;
    /** 数据集名称 */
    name?: string;
    /** 数据集描述 */
    description?: string;
    /** 数据集类型 */
    type?: DatasetTypeEnum;
    /** 数据集状态 */
    status?: DatasetStatusEnum;
    /** 可见性 */
    visibility?: VisibilityEnum;
    /** 图标emoji */
    icon?: string;
    /** 背景色 */
    iconBg?: string;
    /** 标签 */
    tags?: string[];
    /** 数据源配置信息 */
    datasourceConfig?: DatasourceConfigVo;
    /** 统计信息 */
    dataStatistics?: DatasetDataStatisticsVo;
}

export interface PageResultDatasetListVo {
    /**
     * Total number
     * @format int64
     * @example 10
     */
    total?: number;
    /** Page data */
    list?: DatasetListVo[];
}

/** The API response result of supporting international message. */
export type DatasourceTableDataPreviewResult = ApiLocaleResult & {
    /** Actual response data or error details. */
    data?: DatasourceTableDataPreviewVo;
};

/** 表数据预览响应 */
export interface DatasourceTableDataPreviewVo {
    /** 是否成功 */
    success?: boolean;
    /** 消息 */
    message?: string;
    /** 详细信息 */
    details?: string;
    /** 列名列表 */
    columns?: string[];
    /** 数据行列表 */
    data?: Record<string, object>[];
    /**
     * 总记录数
     * @format int64
     */
    total?: number;
}

/** The API response result of supporting international message. */
export type PageDatasetDataListResult = ApiLocaleResult & {
    /** Actual response data or error details. */
    data?: PageDatasetDataListVo;
};

export interface PageDatasetDataListVo {
    /**
     * Total number
     * @format int64
     * @example 10
     */
    total?: number;
    /** Page data */
    list?: DatasetDataListVo[];
}

/** The API response result of supporting international message. */
export type DatasetStatisticsResult = ApiLocaleResult & {
    /** Actual response data or error details. */
    data?: DatasetStatisticsVo;
};

/** 数据集统计响应 */
export interface DatasetStatisticsVo {
    /**
     * 总数据集数
     * @format int64
     */
    totalDatasets?: number;
    /**
     * 活跃（被引用）数据集数
     * @format int64
     */
    activeDatasets?: number;
    /**
     * 总文件或表数
     * @format int64
     */
    totalFilesOrTables?: number;
    /**
     * 总记录数
     * @format int64
     */
    totalRecords?: number;
    /**
     * 记录总大小
     * @format int64
     */
    totalRecordsSize?: number;
    /** 已使用存储空间大小 */
    usedStoreSize?: string;
    /** 授权的存储空间大小，自定义数据源返回空 */
    totalStoreSize?: string;
    /** 已使用存储空间占比，自定义数据源返回空 */
    usedStoreRate?: string;
}

/** The API response result of supporting international message. */
export type PageSessionListResult = ApiLocaleResult & {
    /** Actual response data or error details. */
    data?: PageSessionListVo;
};

/** 最后一条消息 */
export interface LastMessage {
    /** 消息角色 */
    role?: MessageRoleEnum;
    /** 消息摘要 */
    content?: string;
    /**
     * 消息时间
     * @format int64
     */
    datetime?: number;
}

export interface PageSessionListVo {
    /**
     * Total number
     * @format int64
     * @example 10
     */
    total?: number;
    /** Page data */
    list?: SessionListVo[];
}

/** 会话列表视图 */
export interface SessionListVo extends TenantAuditingVo {
    /**
     * 会话ID
     * @format int64
     */
    id?: number;
    /** 会话标题 */
    title?: string;
    /**
     * 关联的应用ID
     * @format int64
     */
    appId?: number;
    /** 应用名称 */
    appName?: string;
    /**
     * 使用的模型ID
     * @format int64
     */
    modelId?: number;
    /** 模型名称 */
    modelName?: string;
    /** 最后一条消息 */
    lastMessage?: LastMessage;
    /**
     * 消息总数
     * @format int32
     */
    messageCount?: number;
    /** 是否收藏 */
    isStarred?: boolean;
}

/** The API response result of supporting international message. */
export type PageMessageResult = ApiLocaleResult & {
    /** Actual response data or error details. */
    data?: PageMessageVo;
};

export interface PageMessageVo {
    /**
     * Total number
     * @format int64
     * @example 10
     */
    total?: number;
    /** Page data */
    list?: MessageVo[];
}

/** The API response result of supporting international message. */
export type ChatStatisticsResult = ApiLocaleResult & {
    /** Actual response data or error details. */
    data?: ChatStatisticsVo;
};

/** 对话统计数据 */
export interface ChatStatisticsVo {
    /**
     * 总会话数
     * @format int64
     */
    totalSessions?: number;
    /**
     * 总消息数
     * @format int64
     */
    totalMessages?: number;
    /**
     * 总Token数
     * @format int64
     */
    totalTokens?: number;
    /** 总成本 */
    totalCost?: number;
    /** 今日统计 */
    todayStats?: TodayStats;
    /** 使用趋势 */
    usageTrend?: UsageTrend[];
    /** Top应用 */
    topApps?: TopApp[];
    /** Top模型 */
    topModels?: TopModel[];
}

/** 今日统计 */
export interface TodayStats {
    /**
     * 会话数
     * @format int64
     */
    sessions?: number;
    /**
     * 消息数
     * @format int64
     */
    messages?: number;
    /**
     * Token数
     * @format int64
     */
    tokens?: number;
    /** 成本 */
    cost?: number;
}

/** Top应用 */
export interface TopApp {
    /**
     * 应用ID
     * @format int64
     */
    appId?: number;
    /** 应用名称 */
    appName?: string;
    /**
     * 消息数量
     * @format int64
     */
    messageCount?: number;
    /**
     * 占比
     * @format double
     */
    percentage?: number;
}

/** Top模型 */
export interface TopModel {
    /**
     * 模型ID
     * @format int64
     */
    modelId?: number;
    /** 模型名称 */
    modelName?: string;
    /**
     * 消息数量
     * @format int64
     */
    messageCount?: number;
    /**
     * Token数量
     * @format int64
     */
    tokens?: number;
}

/** 使用趋势 */
export interface UsageTrend {
    /** 日期 */
    date?: string;
    /**
     * 会话数
     * @format int64
     */
    sessions?: number;
    /**
     * 消息数
     * @format int64
     */
    messages?: number;
    /**
     * Token数
     * @format int64
     */
    tokens?: number;
}

/** The API response result of supporting international message. */
export type PageApplicationListResult = ApiLocaleResult & {
    /** Actual response data or error details. */
    data?: PageApplicationListVo;
};

/** 应用列表项 */
export interface ApplicationListVo extends TenantAuditingVo {
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
    status?: ApplicationStatusEnum;
    /** 使用的模型 */
    model?: string;
    /**
     * 关联知识库数
     * @format int32
     */
    knowledgeBaseCount?: number;
    /**
     * 关联工作流数
     * @format int32
     */
    workflowCount?: number;
    /** 是否公开访问 */
    publicAccess?: boolean;
    /** 是否启用嵌入 */
    embedEnabled?: boolean;
    /** 是否启用API */
    apiEnabled?: boolean;
    /**
     * API调用次数
     * @format int64
     */
    apiCalls?: number;
    /**
     * 发布时间
     * @format date-time
     */
    publishedDate?: string;
}

export interface PageApplicationListVo {
    /**
     * Total number
     * @format int64
     * @example 10
     */
    total?: number;
    /** Page data */
    list?: ApplicationListVo[];
}

/** The API response result of supporting international message. */
export type ApplicationStatisticsResult = ApiLocaleResult & {
    /** Actual response data or error details. */
    data?: ApplicationStatisticsVo;
};

/** 应用统计数据 */
export interface ApplicationStatisticsVo {
    /** 概览统计 */
    overview?: OverviewStatsVo;
    /** 趋势数据 */
    trends?: TrendsStatsVo;
    /** 热门用户 */
    topUsers?: TopUserVo[];
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

/** The API response result of supporting international message. */
export type TopEndpointsResult = ApiLocaleResult & {
    /** Actual response data or error details. */
    data?: TopEndpointsVo;
};

/** 接口项 */
export interface EndpointItemVo {
    /**
     * 接口路径
     * @example "/v1/chat/completions"
     */
    endpoint?: string;
    /**
     * HTTP方法
     * @example "POST"
     */
    method?: string;
    /**
     * 调用次数
     * @format int64
     */
    calls?: number;
    /**
     * 平均响应时间(显示)
     * @example "1.2s"
     */
    avgTime?: string;
    /**
     * 平均响应时间(毫秒)
     * @format int32
     */
    avgTimeMs?: number;
    /**
     * 成功率(显示)
     * @example "98.5%"
     */
    successRate?: string;
    /**
     * 成功率(数值)
     * @format double
     */
    successRateValue?: number;
    /**
     * 总Token数
     * @format int64
     */
    totalTokens?: number;
    /**
     * 错误次数
     * @format int64
     */
    errors?: number;
}

/** Top接口统计 */
export interface TopEndpointsVo {
    /** 接口列表 */
    items?: EndpointItemVo[];
}

/** The API response result of supporting international message. */
export type TokenUsageTrendResult = ApiLocaleResult & {
    /** Actual response data or error details. */
    data?: TokenUsageTrendVo;
};

/** 汇总统计 */
export interface SummaryVo {
    /**
     * 总输入Token
     * @format int64
     */
    totalInput?: number;
    /**
     * 总输出Token
     * @format int64
     */
    totalOutput?: number;
    /**
     * 总Token
     * @format int64
     */
    totalTokens?: number;
    /**
     * 总费用
     * @format int64
     */
    totalCost?: number;
    /**
     * 平均每次调用Token
     * @format double
     */
    avgTokensPerCall?: number;
}

/** Token使用趋势 */
export interface TokenUsageTrendVo {
    /** 趋势数据点列表 */
    items?: TrendItemVo[];
    /** 汇总统计 */
    summary?: SummaryVo;
}

/** 趋势数据点 */
export interface TrendItemVo {
    /**
     * 时间戳
     * @format int64
     */
    datetime?: number;
    /** 日期显示 */
    date?: string;
    /**
     * 输入Token
     * @format int64
     */
    inputTokens?: number;
    /**
     * 输出Token
     * @format int64
     */
    outputTokens?: number;
    /**
     * 总Token
     * @format int64
     */
    totalTokens?: number;
    /**
     * 费用(分)
     * @format int64
     */
    cost?: number;
}

/** The API response result of supporting international message. */
export type ResponseTimeAnalysisResult = ApiLocaleResult & {
    /** Actual response data or error details. */
    data?: ResponseTimeAnalysisVo;
};

/** 响应时间分析 */
export interface ResponseTimeAnalysisVo {
    /** 趋势数据点列表 */
    items?: TrendItemVo[];
    /** 汇总统计 */
    summary?: SummaryVo;
}

/** 分析概览统计 */
export interface AnalyticsOverviewVo {
    /** 时间范围 */
    timeRange?: string;
    /** 统计周期 */
    period?: PeriodVo;
    /** 核心指标 */
    stats?: StatsVo;
    /** 成功率 */
    successRate?: SuccessRateVo;
}

/** The API response result of supporting international message. */
export type AnalyticsOverviewResult = ApiLocaleResult & {
    /** Actual response data or error details. */
    data?: AnalyticsOverviewVo;
};

/** 指标详情 */
export interface MetricVo {
    /**
     * 数值
     * @format int64
     */
    value?: number;
    /**
     * 显示值
     * @example "25,590"
     */
    valueDisplay?: string;
    /**
     * 变化百分比
     * @example "+12.5%"
     */
    change?: string;
    /** 趋势 */
    trend?: MetricTrendEnum;
    /**
     * 对比说明
     * @example "与上周期相比"
     */
    comparedTo?: string;
}

/** 统计周期 */
export interface PeriodVo {
    /**
     * 开始时间戳
     * @format int64
     */
    start?: number;
    /**
     * 结束时间戳
     * @format int64
     */
    end?: number;
}

/** 核心统计指标 */
export interface StatsVo {
    /** API总调用 */
    totalApiCalls?: MetricVo;
    /** 活跃用户数 */
    activeUsers?: MetricVo;
    /** Token消耗 */
    tokenConsumption?: MetricVo;
    /** 平均响应时间 */
    avgResponseTime?: MetricVo;
}

/** 成功率统计 */
export interface SuccessRateVo {
    /**
     * 成功率百分比
     * @format double
     */
    value?: number;
    /**
     * 总数
     * @format int64
     */
    total?: number;
    /**
     * 成功数
     * @format int64
     */
    successful?: number;
    /**
     * 失败数
     * @format int64
     */
    failed?: number;
}

/** The API response result of supporting international message. */
export type ModelDistributionResult = ApiLocaleResult & {
    /** Actual response data or error details. */
    data?: ModelDistributionVo;
};

/** 分布项 */
export interface DistributionItemVo {
    /**
     * 模型ID
     * @format int64
     */
    modelId?: number;
    /**
     * 模型名称
     * @example "GPT-4"
     */
    modelName?: string;
    /**
     * 调用次数
     * @format int64
     */
    calls?: number;
    /**
     * 占比百分比
     * @format double
     */
    percentage?: number;
    /**
     * Token数
     * @format int64
     */
    tokens?: number;
    /**
     * 费用
     * @format int64
     */
    cost?: number;
    /**
     * 平均响应时间(毫秒)
     * @format double
     */
    avgResponseTime?: number;
    /** 图表颜色 */
    color?: string;
}

/** 模型使用分布 */
export interface ModelDistributionVo {
    /** 分布项列表 */
    items?: DistributionItemVo[];
    /** 汇总统计 */
    total?: TotalVo;
}

/** 总计 */
export interface TotalVo {
    /**
     * 模型总数
     * @format int32
     */
    models?: number;
    /**
     * 总调用次数
     * @format int64
     */
    calls?: number;
    /**
     * 总Token数
     * @format int64
     */
    tokens?: number;
    /**
     * 总费用
     * @format int64
     */
    cost?: number;
}

/** The API response result of supporting international message. */
export type ErrorAnalysisResult = ApiLocaleResult & {
    /** Actual response data or error details. */
    data?: ErrorAnalysisVo;
};

/** 错误分析 */
export interface ErrorAnalysisVo {
    /** 按状态码统计 */
    byStatusCode?: ErrorByStatusCodeVo[];
    /** 按接口统计错误 */
    byEndpoint?: ErrorByEndpointVo[];
    /** 错误趋势 */
    errorTrend?: ErrorTrendItemVo[];
    /** 汇总统计 */
    summary?: SummaryVo;
}

/** 按接口统计错误 */
export interface ErrorByEndpointVo {
    /** 接口路径 */
    endpoint?: string;
    /**
     * 错误次数
     * @format int64
     */
    errors?: number;
    /**
     * 错误率
     * @format double
     */
    errorRate?: number;
    /**
     * 最常见错误码
     * @format int32
     */
    topErrorCode?: number;
}

/** 按状态码统计 */
export interface ErrorByStatusCodeVo {
    /**
     * HTTP状态码
     * @format int32
     * @example 429
     */
    statusCode?: number;
    /**
     * 错误名称
     * @example "Rate Limit"
     */
    name?: string;
    /**
     * 错误次数
     * @format int64
     */
    count?: number;
    /**
     * 占比(显示)
     * @example "45%"
     */
    percentage?: string;
    /**
     * 占比(数值)
     * @format double
     */
    percentageValue?: number;
    /** 趋势 */
    trend?: MetricTrendEnum;
    /**
     * 变化
     * @example "+12%"
     */
    change?: string;
}

/** 错误趋势数据点 */
export interface ErrorTrendItemVo {
    /**
     * 时间戳
     * @format int64
     */
    datetime?: number;
    /** 日期显示 */
    date?: string;
    /**
     * 总错误数
     * @format int32
     */
    total?: number;
    /**
     * 4xx错误数
     * @format int32
     */
    code4xx?: number;
    /**
     * 5xx错误数
     * @format int32
     */
    code5xx?: number;
}

/** The API response result of supporting international message. */
export type AppDistributionResult = ApiLocaleResult & {
    /** Actual response data or error details. */
    data?: AppDistributionVo;
    /**
     * Server processing timestamp (date-time string).
     * @format int64
     */
    timestamp?: number;
    /** Extensible map for extra response information. */
    extensions?: Record<string, object>;
};

/** 应用使用分布 */
export interface AppDistributionVo {
    /** 分布项列表 */
    items?: DistributionItemVo[];
    /** 汇总统计 */
    total?: TotalVo;
}

/** API调用趋势 */
export interface ApiCallsTrendVo {
    /** 趋势数据点列表 */
    items?: TrendItemVo[];
    /** 汇总统计 */
    summary?: SummaryVo;
}

/** The API response result of supporting international message. */
export type ApiCallsTrendResult = ApiLocaleResult & {
    /** Actual response data or error details. */
    data?: ApiCallsTrendVo;
};

export interface ActivityDetailVo {
    /** @format int64 */
    id?: number;
    /** @format int64 */
    userId?: number;
    userName?: string;
    userAvatar?: string;
    /** @format int64 */
    targetId?: number;
    targetType?: string;
    targetName?: string;
    /** @format date-time */
    activityDate?: string;
    description?: string;
    detail?: string;
}

/** The API response result of supporting international message. */
export type ActivityDetailResult = ApiLocaleResult & {
    /** Actual response data or error details. */
    data?: PageActivityDetailVo;
};

export interface PageActivityDetailVo {
    /**
     * Total number
     * @format int64
     * @example 10
     */
    total?: number;
    /** Page data */
    list?: ActivityDetailVo[];
}

/** 批量删除数据数据集数据参数 */
export interface DatasetDataBatchDeleteDto {
    /** 数据名称（文件名或表名） */
    names?: string[];
}

/** 创建接口集请求参数 */
export interface ApiCollectionCreateDto {
    /** 接口集名称 */
    name: string;
    /** 接口集描述 */
    description?: string;
    /**
     * 可见性：PRIVATE-私有，TEAM-团队，PUBLIC-公开
     * @example "PRIVATE"
     */
    visibility?: VisibilityEnum;
    /** 服务器配置，遵循OpenAPI Server Object规范 */
    server?: OpenAPIV3_1.ServerObject;
    /** 安全配置，遵循OpenAPI Security Scheme Object规范 */
    security?: OpenAPIV3_1.SecuritySchemeObject;
}


/** 接口集详情 */
export interface ApiCollectionDetailVo extends TenantAuditingVo {
    /**
     * 接口集ID
     * @format int64
     */
    id?: number;
    /** 名称 */
    name?: string;
    /** 描述 */
    description?: string;
    /** 来源 */
    source?: ApiCollectionSourceEnum;
    /** 来源图标 */
    sourceIcon?: string;
    /** 可见性 */
    visibility?: VisibilityEnum;
    /** 是否配置了服务器 */
    hasServerConfig?: boolean;
    /** 服务器配置 */
    server?: OpenAPIV3_1.ServerObject;
    /** 是否配置了安全认证 */
    hasSecurityConfig?: boolean;
    /** 安全认证配置 */
    security?: OpenAPIV3_1.SecuritySchemeObject;
    /**
     * 端点总数
     * @format int64
     */
    endpointsCount?: number;
    /**
     * 已启用的接口数
     * @format int64
     */
    enabledEndpointsCount?: number;
}

/** The API response result of supporting international message. */
export type ApiCollectionDetailResult = ApiLocaleResult & {
    /** Actual response data or error details. */
    data?: ApiCollectionDetailVo;
};

/** 创建接口端点请求参数 */
export interface ApiEndpointCreateDto {
    /** 端点名称 */
    name: string;
    /** HTTP方法：GET、POST、PUT、DELETE、PATCH等 */
    method: HttpMethodEnum;
    /**
     * 接口路径，不包含查询参数
     * @example "/v1/chat/completions"
     */
    path: string;
    /** 端点描述 */
    description?: string;
    /** 操作标识符，用于OpenAPI规范解析的唯一标识 */
    operationId?: string;
    /** 标签列表，用于分类和筛选 */
    tags?: string[];
    /** 请求参数列表，遵循OpenAPI Parameter Object规范 */
    parameters?: OpenAPIV3_1.ParameterObject[];
    /** 请求体配置，遵循OpenAPI Request Body Object规范 */
    requestBody?: OpenAPIV3_1.RequestBodyObject;
    /** 响应配置映射，键为HTTP状态码，值为响应对象，遵循OpenAPI Response Object规范 */
    responses?: OpenAPIV3_1.ResponsesObject;
}

/** 测试接口端点请求参数 */
export interface ApiEndpointTestDto {
    /**
     * HTTP方法：GET、POST、PUT、DELETE、PATCH等
     * @example "GET"
     */
    method: HttpMethodEnum;
    /** 服务器配置，包含API连接和部署信息，遵循OpenAPI Server Object规范 */
    server: OpenAPIV3_1.ServerObject;
    /**
     * 接口路径，不包含查询参数，用于资源标识
     * @example "/comm/api/v1/country/{id}"
     */
    endpoint?: string;
    /**
     * 请求超时时间（毫秒），范围：1-300000
     * @format int32
     * @example 30000
     */
    timeout?: number;
    /** 请求参数列表，遵循OpenAPI Parameter Object规范 */
    parameters?: OpenAPIV3_1.ParameterObject[];
    /** 请求体配置，遵循OpenAPI Request Body Object规范 */
    requestBody?: OpenAPIV3_1.RequestBodyObject;
}

/** 接口端点测试结果 */
export interface ApiEndpointTestVo {
    /** 是否成功 */
    success?: boolean;
    /**
     * 状态码
     * @format int32
     */
    statusCode?: number;
    /**
     * 响应时间（毫秒）
     * @format int64
     */
    responseTime?: number;
    /** 响应头 */
    responseHeaders?: Record<string, string>;
    /** 响应体 */
    responseBody?: string;
    /** 错误信息 */
    error?: string;
}

/** The API response result of supporting international message. */
export type ApiEndpointTestResult = ApiLocaleResult & {
    /** Actual response data or error details. */
    data?: ApiEndpointTestVo;
};

/** 导入接口集请求参数 */
export interface ApiCollectionImportDto {
    /**
     * 上传的文件
     * @format binary
     */
    file: File;
    /** 文件类型 */
    type: ApiCollectionImportTypeEnum;
    /** 自定义名称（不填则使用文件中的名称） */
    name?: string;
    /** 可见性 */
    visibility?: VisibilityEnum;
    /** 导入策略 */
    importStrategy?: ImportStrategyDto;
}

/** 导入策略 */
export interface ImportStrategyDto {
    /**
     * 冲突处理策略：OVERWRITE-覆盖现有接口，IGNORE-跳过重复接口，MERGE-合并配置
     * @example "IGNORE"
     */
    conflictStrategy?: ConflictStrategyEnum;
    /**
     * 是否导入安全配置
     * @example true
     */
    importSecurity?: boolean;
    /**
     * 是否导入服务器配置
     * @example true
     */
    importServers?: boolean;
    /**
     * 是否导入标签
     * @example true
     */
    importTags?: boolean;
    /**
     * 默认启用所有接口
     * @example false
     */
    enableByDefault?: boolean;
}

/** 接口集导入结果 */
export interface ApiCollectionImportVo {
    /**
     * 接口集ID
     * @format int64
     */
    collectionId?: number;
    /** 名称 */
    name?: string;
    /** 来源 */
    source?: ApiCollectionSourceEnum;
    /** 导入统计 */
    importStats?: ImportStats;
    /** 导入详情 */
    importDetails?: ImportDetail[];
}

/** The API response result of supporting international message. */
export type ApiLocaleResultApiCollectionImportVo = ApiLocaleResult & {
    /** Actual response data or error details. */
    data?: ApiCollectionImportVo;
};

/** 导入详情 */
export interface ImportDetail {
    /** 端点 */
    endpoint?: string;
    /** 状态 */
    status?: ImportStatusEnum;
    /** 原因 */
    reason?: string;
}

/** 导入统计 */
export interface ImportStats {
    /**
     * 总端点数
     * @format int64
     */
    totalEndpoints?: number;
    /**
     * 成功导入
     * @format int64
     */
    importedEndpoints?: number;
    /**
     * 跳过（冲突）
     * @format int64
     */
    skippedEndpoints?: number;
    /**
     * 错误数
     * @format int64
     */
    errors?: number;
}

/** 更新接口集请求参数 */
export interface ApiCollectionUpdateDto {
    /** 接口集名称 */
    name?: string;
    /** 接口集描述 */
    description?: string;
    /** 可见性：PRIVATE-私有，TEAM-团队，PUBLIC-公开 */
    visibility?: VisibilityEnum;
    /** 服务器配置，遵循OpenAPI Server Object规范 */
    server?: OpenAPIV3_1.ServerObject;
    /** 安全配置，遵循OpenAPI Security Scheme Object规范 */
    security?: OpenAPIV3_1.SecuritySchemeObject;
}


/** 接口集列表项 */
export interface ApiCollectionListVo extends TenantAuditingVo {
    /**
     * 接口集ID
     * @format int64
     */
    id?: number;
    /** 名称 */
    name?: string;
    /** 描述 */
    description?: string;
    /** 来源 */
    source?: ApiCollectionSourceEnum;
    /** 来源图标 */
    sourceIcon?: string;
    /**
     * 端点总数
     * @format int64
     */
    endpointsCount?: number;
    /**
     * 已启用的接口数
     * @format int64
     */
    enabledEndpointsCount?: number;
    /** 可见性 */
    visibility?: VisibilityEnum;
    /** 是否配置了服务器 */
    hasServerConfig?: boolean;
    /** 是否配置了安全认证 */
    hasSecurityConfig?: boolean;
}

/** The API response result of supporting international message. */
export type ApiCollectionListResult = ApiLocaleResult & {
    /** Actual response data or error details. */
    data?: PageApiCollectionListVo;
};

export interface PageApiCollectionListVo {
    /**
     * Total number
     * @format int64
     * @example 10
     */
    total?: number;
    /** Page data */
    list?: ApiCollectionListVo[];
}

/** The API response result of supporting international message. */
export type ResultApiEndpointVo = ApiLocaleResult & {
    /** Actual response data or error details. */
    data?: PageResultApiEndpointVo;
};

/** 更新接口端点请求参数 */
export interface ApiEndpointUpdateDto {
    /** 端点名称 */
    name: string;
    /** 端点描述 */
    description?: string;
    /** 标签列表，用于分类和筛选 */
    tags?: string[];
    /** 请求参数列表，遵循OpenAPI Parameter Object规范 */
    parameters?: OpenAPIV3_1.ParameterObject[];
    /** 请求体配置，遵循OpenAPI Request Body Object规范 */
    requestBody?: OpenAPIV3_1.RequestBodyObject;
    /** 响应配置映射，键为HTTP状态码，值为响应对象，遵循OpenAPI Response Object规范 */
    responses?: OpenAPIV3_1.ResponsesObject;
}

/** 接口端点详情 */
export interface ApiEndpointVo extends TenantAuditingVo {
    /**
     * 端点ID
     * @format int64
     */
    id?: number;
    /**
     * 接口集ID
     * @format int64
     */
    collectionId?: number;
    /** 端点名称 */
    name?: string;
    /** HTTP方法 */
    method?: HttpMethodEnum;
    /** 路径 */
    path?: string;
    /** 操作标识符，用于OpenAPI规范解析的唯一标识 */
    operationId?: string;
    /** 描述 */
    description?: string;
    /** 标签 */
    tags?: string[];
    /** 是否启用 */
    enabled?: boolean;
}

/** The API response result of supporting international message. */
export type ApiEndpointResult = ApiLocaleResult & {
    /** Actual response data or error details. */
    data?: ApiEndpointVo;
};

export interface PageResultApiEndpointVo {
    /**
     * Total number
     * @format int64
     * @example 10
     */
    total?: number;
    /** Page data */
    list?: ApiEndpointVo[];
}

/** 接口端点详情 */
export interface ApiEndpointDetailVo extends TenantAuditingVo {
    /**
     * 端点ID
     * @format int64
     */
    id?: number;
    /**
     * 接口集ID
     * @format int64
     */
    collectionId?: number;
    /** 端点名称 */
    name?: string;
    /** HTTP方法 */
    method?: HttpMethodEnum;
    /** 路径 */
    path?: string;
    /** 描述 */
    description?: string;
    /** 标签 */
    tags?: string[];
    /** 是否启用 */
    enabled?: boolean;
    /** 操作标识符，用于OpenAPI规范解析的唯一标识 */
    operationId?: string;
    /** 请求参数列表，遵循OpenAPI Parameter Object规范 */
    parameters?: OpenAPIV3_1.ParameterObject[];
    /** 请求体配置，遵循OpenAPI Request Body Object规范 */
    requestBody?: OpenAPIV3_1.RequestBodyObject;
    /** 响应配置映射，键为HTTP状态码，值为响应对象，遵循OpenAPI Response Object规范 */
    responses?: OpenAPIV3_1.ResponsesObject;
}

/** The API response result of supporting international message. */
export type ApiEndpointDetailResult = ApiLocaleResult & {
    /** Actual response data or error details. */
    data?: ApiEndpointDetailVo;
};

/** 向量存储源统计信息 */
export interface ApiCollectionStatisticsVo {
    /** 总体统计 */
    overview?: ApiCollectionOverview;
    /** 近一月趋势 */
    lastMonthGrowthTrend?: ApiCollectionOverview;
    /** 使用率排行 */
    topStores?: ApiCollectionTopStore[];
    /** 性能趋势 */
    performanceTrend?: ApiCollectionPerformanceTrend[];
}

/**
 * 总体统计
 */
export interface ApiCollectionOverview {
    /**
     * 接口集总数
     */
    apiCollectionCount: number;
    /**
     * 接口总数
     */
    apiTotalCount: number;
    /**
     * 已启用接口总数
     */
    enabledApiCount: number;
    /**
     * 总调用次数
     */
    totalCallCount: number;
    /**
     * 今日调用次数
     */
    todayCallCount: number;
}

/**
 * 使用率排行
 */
export interface ApiCollectionTopStore {
    /**
     * 端点ID
     */
    id: number;
    /**
     * 端点名称
     */
    name: string;
    /**
     * 请求方式
     */
    type: HttpMethodEnum;
    /**
     * 调用次数
     */
    callCount: number;
    /**
     * 平均响应时间（毫秒）
     */
    avgResponseTime: number;
}

/**
 * 性能趋势
 */
export interface ApiCollectionPerformanceTrend {
    /**
     * 时间戳
     */
    timestamp: number;
    /**
     * 日期
     */
    date: string;
    /**
     * 总调用次数
     */
    totalCalls: number;
    /**
     * 平均响应时间（毫秒）
     */
    avgResponseTime: number;
    /**
     * 错误数
     */
    errors: number;
    /**
     * 错误率（百分比）
     */
    errorRate: number;
}

/** The API response result of supporting international message. */
export type ApiCollectionStatisticsResult = ApiLocaleResult & {
    /** Actual response data or error details. */
    data?: ApiCollectionStatisticsVo;
};

/** 接口项 */
export interface EndpointItemVo {
    /**
     * 接口路径
     * @example "/v1/chat/completions"
     */
    endpoint?: string;
    /**
     * HTTP方法
     * @example "POST"
     */
    method?: string;
    /**
     * 调用次数
     * @format int64
     */
    calls?: number;
    /**
     * 平均响应时间(显示)
     * @example "1.2s"
     */
    avgTime?: string;
    /**
     * 平均响应时间(毫秒)
     * @format int32
     */
    avgTimeMs?: number;
    /**
     * 成功率(显示)
     * @example "98.5%"
     */
    successRate?: string;
    /**
     * 成功率(数值)
     * @format double
     */
    successRateValue?: number;
    /**
     * 总Token数
     * @format int64
     */
    totalTokens?: number;
    /**
     * 错误次数
     * @format int64
     */
    errors?: number;
}

/** Top接口统计 */
export interface TopEndpointsVo {
    /** 接口列表 */
    items?: EndpointItemVo[];
}

/** 向量存储配置：不同类型(VectorStoreType)的向量库需要的字段各不相同，具体见字段说明。 */
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

/** The API response result of supporting international message. */
export type VectorStoreResult = ApiLocaleResult & {
    /** Actual response data or error details. */
    data?: VectorStoreVo;
};

/** 向量存储源详情 */
export interface VectorStoreVo extends TenantAuditingVo {
    /**
     * 存储源ID
     * @format int64
     */
    id?: number;
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


/** The API response result of supporting international message. */
export type PageResultVectorStoreResult = ApiLocaleResult & {
    /** Actual response data or error details. */
    data?: PageResultVectorStoreVo;
};

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
export type VectorStoreStatisticsResult = ApiLocaleResult & {
    /** Actual response data or error details. */
    data?: VectorStoreStatisticsVo;
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
    id?: number;
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

/** 排序字段 */
export enum VectorStoreListParamsOrderByEnum {
    Id = "id",
    Name = "name",
    CreatedDate = "createdDate",
    Type = "type",
    Status = "status",
}

/** 排序字段 */
export enum ApiCollectionListParamsOrderByEnum {
    Id = "id",
    Name = "name",
    CreatedDate = "createdDate",
    Source = "source",
    Visibility = "visibility",
}

/** 排序字段 */
export enum ApiEndpointListParamsOrderByEnum {
    Id = "id",
    Name = "name",
    Method = "method",
    CreatedDate = "createdDate",
}

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

/**
 * 排序字段
 * @example "activityDate"
 */
export enum ActivityListOrderByEnum {
    Id = "id",
    ActivityDate = "activityDate",
}

/** 排序字段 */
export enum GetWorkflowListOrderByEnum {
    Id = "id",
    CreatedDate = "createdDate",
    Name = "name",
    Type = "type",
    Status = "status",
}

/** 排序字段 */
export enum GetResourceSharingListOrderByEnum {
    Id = "id",
    Type = "type",
    Permission = "permission",
    SharedWith = "sharedWith",
    CreatedDate = "createdDate",
}

/** 排序字段 */
export enum GetPromptListParamsOrderByEnum {
    Id = "id",
    CreatedDate = "createdDate",
    Name = "name",
    Size = "size",
}

/** 排序字段 */
export enum GetPluginListOrderByEnum {
    Id = "id",
    CreatedDate = "createdDate",
    Name = "name",
    Category = "category",
    Status = "status",
    Type = "type",
    InstallCount = "installCount",
    UsageCount = "usageCount",
    ReviewCount = "reviewCount",
    Rating = "rating",
    MinRating = "minRating",
}

/** 排序字段 */
export enum GetModelListParamsOrderByEnum {
    Id = "id",
    CreatedDate = "createdDate",
    Name = "name",
    Type = "type",
    Provider = "provider",
    Status = "status",
}

/**
 * 排序字段
 * @example "modifiedDate"
 */
export enum GetKnowledgeBaseListOrderByEnum {
    CreatedDate = "createdDate",
    ModifiedDate = "modifiedDate",
    DocumentsCount = "documentsCount",
    Name = "name",
}

/** 排序字段 */
export enum GetDocumentListOrderByEnum {
    Id = "id",
    CreatedDate = "createdDate",
    Name = "name",
    Size = "size",
}

/**
 * 排序字段
 * @example "modifiedDate"
 */
export enum GetDatasetListOrderByEnum {
    Name = "name",
    Type = "type",
    Status = "status",
    CreatedDate = "createdDate",
    ModifiedDate = "modifiedDate",
}

/**
 * 排序字段
 * @example "modifiedDate"
 */
export enum GetDatasetDataListOrderByEnum {
    Name = "name",
    Type = "type",
    Size = "size",
    CreatedDate = "createdDate",
    ModifiedDate = "modifiedDate",
}

