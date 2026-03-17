import { ApiLocaleResult, TenantAuditingVo } from '@xcan-angus/infra';
import { ModelProviderEnum, ModelStatusEnum, ModelTypeEnum } from '@/enums/enums.ts';
import type { ModelConfigDefinition } from './ApplicationsTypes.ts';

export type { ModelConfigDefinition } from './ApplicationsTypes.ts';

/** 近一月增长趋势 */
export interface LastMonthGrowthTrend {
  /**
   * 本月新增模型数量
   * @format int64
   */
  addedModels?: number;
  /**
   * 本月新增成本（美元）
   * @format double
   */
  addedCost?: number;
  /** 本月新增成本展示，如 $12.34 */
  addedCostDisplay?: string;
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

/** 今天增长趋势 */
export interface TodayGrowthTrend {
  /**
   * 今日新增模型数量
   * @format int64
   */
  addedModels?: number;
  /**
   * 今日新增成本（美元）
   * @format double
   */
  addedCost?: number;
  /** 今日新增成本展示，如 $12.34 */
  addedCostDisplay?: string;
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
   * 激活的模型数
   * @format int64
   */
  activeModels?: number;
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
   * 总成本（美元）
   * @format double
   */
  totalCost?: number;
  /** 总成本展示，如 $12.34，后端已格式化 */
  totalCostDisplay?: string;
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

/** 模型详情响应 */
export interface ModelDetailVo extends TenantAuditingVo {
  /**
   * 模型ID
   * @format int64
   */
  id?: string;
  /** 模型名称 */
  name?: string;
  /** 模型描述 */
  description?: string;
  /** 模型类型 */
  type?: ModelTypeEnum;
  /** 模型提供商 */
  provider?: ModelProviderEnum;
  /** 模型状态 */
  status?: ModelStatusEnum;
  /** 配置信息 */
  config?: ModelConfigDefinition;
  /** 模型访问限制 */
  accessLimit?: ModelAccessLimit;
  /** 统计数据 */
  stats?: ModelStats;
  /** 性能指标 */
  performance?: ModelPerformance;
}

/** The API response result of supporting international message. */
export type ModelDetailResult = ApiLocaleResult & {
  /** Actual response data or error details. */
  data?: ModelDetailVo;
};

/** 支持的模型提供者列表响应 — 返回当前运行时已注册的 ModelProvider 枚举值 */
export type ModelSupportedProvidersResult = ApiLocaleResult & {
  /** 支持的模型提供者枚举值列表，如 OPEN_AI、ANTHROPIC、OLLAMA、GEMINI、QWEN、ZHIPU、DEEPSEEK 等 */
  data?: ModelProviderEnum[];
};

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
   * API Base URL（用于自托管或代理）
   * @example "https://api.openai.com/v1"
   */
  baseUrl?: string;
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
  /**
   * 每百万Tokens输入价格（美元）
   * @format double
   */
  inputPricePerMillionTokens?: number;
  /**
   * 每百万Tokens输出价格（美元）
   * @format double
   */
  outputPricePerMillionTokens?: number;
}

/** 测试模型请求参数 */
export interface ModelTestDto {
  /**
   * 测试提示词
   * @example "你好，请介绍一下自己"
   */
  testPrompt: string;
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
   * API Base URL（用于自托管或代理）
   * @example "https://api.openai.com/v1"
   */
  baseUrl?: string;
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
  /**
   * 每百万Tokens输入价格（美元）
   * @format double
   */
  inputPricePerMillionTokens?: number;
  /**
   * 每百万Tokens输出价格（美元）
   * @format double
   */
  outputPricePerMillionTokens?: number;
}

/** 修改模型状态请求参数 */
export interface ModelUpdateStatusDto {
  /** 模型状态：ACTIVE-激活，DISABLED-禁用 */
  status: ModelStatusEnum;
}

/** 模型列表项响应 */
export interface ModelListVo extends TenantAuditingVo {
  /**
   * 模型ID
   * @format int64
   */
  id?: string;
  /** 模型名称 */
  name?: string;
  /** 模型描述 */
  description?: string;
  /** 模型类型 */
  type?: ModelTypeEnum;
  /** 模型提供商 */
  provider?: ModelProviderEnum;
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
export type PageResultModelListResult = ApiLocaleResult & {
  /** Actual response data or error details. */
  data?: PageModelListVo;
};

/** 模型统计响应（全局） */
export interface ModelStatisticsVo {
  /**
   * 总模型数
   * @format int64
   */
  totalModels?: number;
  /**
   * 激活的模型数
   * @format int64
   */
  activeModels?: number;
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
   * 总成本（美元）
   * @format double
   */
  totalCost?: number;
  /** 总成本展示，如 $12.34，后端已格式化 */
  totalCostDisplay?: string;
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
export type ModelStatisticsResult = ApiLocaleResult & {
  /** Actual response data or error details. */
  data?: ModelStatisticsVo;
};

/** 排序字段 */
export enum GetModelListParamsOrderByEnum {
  Id = 'id',
  Name = 'name',
  Type = 'type',
  Provider = 'provider',
  Status = 'status',
  CreatedDate = 'createdDate',
}
