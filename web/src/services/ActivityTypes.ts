import { ApiLocaleResult } from '@xcan-angus/infra';

/** Activity详情 */
export interface ActivityDetailVo {
  /** @format int64 */
  id?: string;
  /** @format int64 */
  userId?: string;
  userName?: string;
  userAvatar?: string;
  /** @format int64 */
  targetId?: string;
  targetType?: string;
  targetName?: string;
  /** @format date-time */
  activityDate?: string;
  description?: string;
  detail?: string;
}

/** 分页Activity详情 */
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

/** The API response result of supporting international message. */
export type ActivityDetailResult = ApiLocaleResult & {
  /** Actual response data or error details. */
  data?: PageActivityDetailVo;
};

/**
 * 排序字段
 * @example "activityDate"
 */
export enum ActivityListOrderByEnum {
  Id = 'id',
  ActivityDate = 'activityDate',
}

/** 活动统计查询参数 */
export interface SimpleStatisticsDto {
  /** 统计开始日期，格式: yyyy-MM-dd 或 yyyy-MM-dd HH:mm:ss */
  startDate?: string;
  /** 统计结束日期，格式: yyyy-MM-dd 或 yyyy-MM-dd HH:mm:ss */
  endDate?: string;
}

/** 活动统计概览 */
export interface ActivityStatisticsOverview {
  /** 总活动数 */
  totalActivities?: number;
  /** 今日活动数 */
  todayActivities?: number;
  /** 活跃用户数 */
  activeUsers?: number;
  /** 成功率（百分比，如 92.5） */
  successRate?: number;
}

/** 操作类型分布 */
export interface ActionTypeDistribution {
  actionType?: string;
  actionTypeLabel?: string;
  count?: number;
  percentage?: number;
}

/** 资源类型分布 */
export interface ResourceTypeDistribution {
  resourceType?: string;
  resourceTypeLabel?: string;
  count?: number;
  percentage?: number;
}

/** 状态分布 */
export interface StatusDistribution {
  success?: number;
  failed?: number;
  warning?: number;
}

/** 活跃用户 Top 项 */
export interface TopUser {
  /** @format int64 */
  userId?: number;
  userName?: string;
  userAvatar?: string;
  activityCount?: number;
  /** 最后活动时间，格式: yyyy-MM-dd HH:mm:ss */
  lastActivityDate?: string;
}

/** 时间趋势 */
export interface TimeTrend {
  /** @format int64 */
  timestamp?: number;
  /** 日期，按天或小时格式 */
  date?: string;
  count?: number;
  successCount?: number;
  failedCount?: number;
}

/** 热门资源 Top 项 */
export interface TopResource {
  /** @format int64 */
  resourceId?: number;
  resourceType?: string;
  resourceName?: string;
  operationCount?: number;
  lastOperationDate?: string;
}

/** 活动统计数据 */
export interface ActivityStatisticsVo {
  overview?: ActivityStatisticsOverview;
  actionTypeDistribution?: ActionTypeDistribution[];
  resourceTypeDistribution?: ResourceTypeDistribution[];
  statusDistribution?: StatusDistribution;
  topActiveUsers?: TopUser[];
  timeTrend?: TimeTrend[];
  topResources?: TopResource[];
}

/** 活动统计 API 响应 */
export type ActivityStatisticsResult = ApiLocaleResult & {
  data?: ActivityStatisticsVo;
};
