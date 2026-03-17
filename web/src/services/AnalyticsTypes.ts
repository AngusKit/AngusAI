import { ApiLocaleResult } from '@xcan-angus/infra';
import { MetricTrendEnum } from '@/enums/enums.ts';

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
export type TopEndpointsResult = ApiLocaleResult & {
  /** Actual response data or error details. */
  data?: TopEndpointsVo;
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
   * 总费用，单位：美分
   * @format int64
   */
  totalCost?: number;
  /**
   * 总费用展示，后端已格式化，如 $125.80，前端直接展示
   */
  costDisplay?: string;
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
  /** 平均响应时间(秒)，用于响应时间分析 */
  avgTime?: number;
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
   * 费用，单位：美分
   * @format int64
   */
  cost?: number;
  /**
   * 费用展示，后端已格式化，如 $125.80，前端直接展示
   */
  costDisplay?: string;
}

/** The API response result of supporting international message. */
export type TokenUsageTrendResult = ApiLocaleResult & {
  /** Actual response data or error details. */
  data?: TokenUsageTrendVo;
};

/** 响应时间分析 */
export interface ResponseTimeAnalysisVo {
  /** 趋势数据点列表 */
  items?: TrendItemVo[];
  /** 汇总统计 */
  summary?: SummaryVo;
}

/** The API response result of supporting international message. */
export type ResponseTimeAnalysisResult = ApiLocaleResult & {
  /** Actual response data or error details. */
  data?: ResponseTimeAnalysisVo;
};

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

/** 分布项 */
export interface DistributionItemVo {
  /**
   * 应用ID（应用分布）
   * @format int64
   */
  appId?: string;
  /**
   * 应用名称（应用分布）
   */
  appName?: string;
  /**
   * 模型ID
   * @format int64
   */
  modelId?: string;
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
   * 费用，单位：美分
   * @format int64
   */
  cost?: number;
  /**
   * 费用展示，后端已格式化，如 $125.80，前端直接展示
   */
  costDisplay?: string;
  /**
   * 平均响应时间(毫秒)
   * @format double
   */
  avgResponseTime?: number;
}

/** 模型使用分布 */
export interface ModelDistributionVo {
  /** 分布项列表 */
  items?: DistributionItemVo[];
  /** 汇总统计 */
  total?: TotalVo;
}

/** The API response result of supporting international message. */
export type ModelDistributionResult = ApiLocaleResult & {
  /** Actual response data or error details. */
  data?: ModelDistributionVo;
};

/** 总计 */
export interface TotalVo {
  /**
   * 应用总数（应用分布）
   * @format int32
   */
  apps?: number;
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
   * 总费用，单位：美分
   * @format int64
   */
  cost?: number;
  /**
   * 总费用展示，后端已格式化，如 $125.80，前端直接展示
   */
  costDisplay?: string;
}

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

/** The API response result of supporting international message. */
export type ErrorAnalysisResult = ApiLocaleResult & {
  /** Actual response data or error details. */
  data?: ErrorAnalysisVo;
};

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

/** 应用使用分布 */
export interface AppDistributionVo {
  /** 分布项列表 */
  items?: DistributionItemVo[];
  /** 汇总统计 */
  total?: TotalVo;
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

/** 关键资源badge统计 */
export interface ResourcesBadgeVo {
  /** 对话Session数 */
  sessionCount?: number;
  /** 我的应用数 */
  applicationCount?: number;
  /** 未读通知数 */
  notificationCount?: number;
}

/** The API response result of supporting international message. */
export type ResourcesBadgeResult = ApiLocaleResult & {
  /** Actual response data or error details. */
  data?: ResourcesBadgeVo;
};
