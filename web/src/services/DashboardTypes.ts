import { ApiLocaleResult } from '@xcan-angus/infra';

/* ========== 使用详情（UsageDetails） ========== */

/** 热度应用项（使用频次占比 TOP5） */
export interface HotAppItemVo {
  /**
   * 排名
   * @format int32
   */
  rank?: number;
  /** 应用名称 */
  appName?: string;
  /**
   * 调用次数
   * @format int64
   */
  callCount?: number;
  /**
   * 占比百分比
   * @format double
   */
  percentage?: number;
}

/** API 调用项（使用频次占比 TOP5） */
export interface TopApiItemVo {
  /**
   * 排名
   * @format int32
   */
  rank?: number;
  /** 接口路径 */
  endpoint?: string;
  /** HTTP 方法 */
  method?: string;
  /**
   * 调用次数
   * @format int64
   */
  callCount?: number;
  /**
   * 占比百分比
   * @format double
   */
  percentage?: number;
}

/** 费用成本项（费用占比 TOP5） */
export interface CostModelItemVo {
  /**
   * 排名
   * @format int32
   */
  rank?: number;
  /** 模型名称 */
  modelName?: string;
  /**
   * 费用（单位：分）
   * @format int64
   */
  cost?: number;
  /** 费用展示（如 ¥125.80） */
  costDisplay?: string;
  /**
   * 占比百分比
   * @format double
   */
  percentage?: number;
}

/** 使用详情响应 */
export interface UsageDetailsVo {
  /** 热度应用 TOP5 */
  hotApps?: HotAppItemVo[];
  /** API 调用 TOP5 */
  topApis?: TopApiItemVo[];
  /** 费用成本 TOP5 */
  costModels?: CostModelItemVo[];
}

/** The API response result of supporting international message. */
export type UsageDetailsResult = ApiLocaleResult & {
  /** Actual response data or error details. */
  data?: UsageDetailsVo;
};

/* ========== 统计卡片（StatsCards） ========== */

/** 统计项周期明细 */
export interface StatPeriodDetailsVo {
  /** 本周/当前周数据 */
  thisWeek?: string;
  /** 上周数据 */
  lastWeek?: string;
  /** 本月/当前月数据 */
  thisMonth?: string;
  /** 上月数据 */
  lastMonth?: string;
}

/** 统计项 */
export interface StatItemVo {
  /** 指标类型：totalApps | apiCalls | tokenUsage | activeUsers */
  type?: string;
  /** 指标标签（国际化 key 或显示文本） */
  label?: string;
  /** 主数值 */
  value?: string;
  /** 副标题说明 */
  subtitle?: string;
  /** 趋势变化（如 +12%、-5%） */
  trend?: string;
  /** 趋势方向：true 上升，false 下降 */
  trendUp?: boolean;
  /** 图标背景样式（如 bg-blue-500） */
  iconBg?: string;
  /** 周期明细 */
  details?: StatPeriodDetailsVo;
}

/** 统计概览响应 */
export interface StatsOverviewVo {
  /** 统计项列表 */
  stats?: StatItemVo[];
}

/** The API response result of supporting international message. */
export type StatsOverviewResult = ApiLocaleResult & {
  /** Actual response data or error details. */
  data?: StatsOverviewVo;
};

/* ========== 最近应用（RecentApplications） ========== */

/** 标签项 */
export interface AppTagVo {
  /** 标签文本 */
  label?: string;
  /** 样式类名（如 bg-blue-100 text-blue-700） */
  color?: string;
}

/** 最近应用列表项 */
export interface RecentApplicationItemVo {
  /**
   * 应用 ID
   * @format int64
   */
  id?: string;
  /** 应用图标（可选，前端映射为 Lucide 组件） */
  icon?: string;
  /** 应用名称 */
  name?: string;
  /** 简短描述 */
  description?: string;
  /** 完整描述 */
  fullDescription?: string;
  /** 标签列表 */
  tags?: AppTagVo[];
  /** 使用说明（如 已 1.2K 次调用） */
  usage?: string;
  /** 图标背景样式（如 bg-blue-500） */
  iconBg?: string;
  /**
   * 创建时间
   * @format date-time
   */
  createdAt?: string;
  /** 最后使用时间（相对或绝对，如 2小时前） */
  lastUsed?: string;
  /** 总调用次数展示 */
  totalCalls?: string;
  /** 平均响应时间展示（如 0.8s） */
  avgResponseTime?: string;
}

/** 最近应用列表响应 */
export interface RecentApplicationsVo {
  /** 应用列表 */
  items?: RecentApplicationItemVo[];
}

/** The API response result of supporting international message. */
export type RecentApplicationsResult = ApiLocaleResult & {
  /** Actual response data or error details. */
  data?: RecentApplicationsVo;
};
