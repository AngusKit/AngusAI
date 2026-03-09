import { ApiLocaleResult } from '@xcan-angus/infra';
import {
  ActivityActionTypeEnum,
  ActivityStatusEnum,
  FullResourceTypeEnum,
} from '@/enums/enums';

/** 活动详情 */
export interface ActivityDetailVo {
  /** 活动记录主键ID @format int64 */
  id?: string;
  /** 操作用户ID @format int64 */
  userId?: string;
  /** 操作用户名称 */
  userName?: string;
  /** 操作用户头像URL */
  userAvatar?: string;
  /** 头像占位符，如用户 initials */
  userAvatarFallback?: string;
  /** 操作类型 */
  actionType?: ActivityActionTypeEnum | string;
  /** 活动状态 */
  status?: ActivityStatusEnum | string;
  /** 关联资源ID @format int64 */
  resourceId?: string;
  /** 关联资源类型 */
  resourceType?: FullResourceTypeEnum | string;
  /** 关联资源名称 */
  resourceName?: string;
  /** 活动发生时间 @format date-time */
  activityDate?: string;
  /** 客户端 IP 地址 */
  ipAddress?: string;
  /** 客户端 User-Agent */
  userAgent?: string;
  /** 活动简要描述 */
  description?: string;
  /** 活动详细信息 */
  detail?: string;
}

/** 分页活动详情 */
export interface PageActivityDetailVo {
  /** 总条数 @format int64 @example 10 */
  total?: number;
  /** 当前页数据 */
  list?: ActivityDetailVo[];
}

/** 活动列表 API 响应（支持国际化消息） */
export type ActivityDetailResult = ApiLocaleResult & {
  /** 响应数据或错误详情 */
  data?: PageActivityDetailVo;
};

/** 排序字段 @example "activityDate" */
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
  /** 操作类型 */
  actionType?: string;
  /** 操作类型展示名 */
  actionTypeLabel?: string;
  /** 数量 */
  count?: number;
  /** 占比百分比 */
  percentage?: number;
}

/** 资源类型分布 */
export interface ResourceTypeDistribution {
  /** 资源类型 */
  resourceType?: string;
  /** 资源类型展示名 */
  resourceTypeLabel?: string;
  /** 数量 */
  count?: number;
  /** 占比百分比 */
  percentage?: number;
}

/** 状态分布（成功/失败/警告） */
export interface StatusDistribution {
  /** 成功数 */
  success?: number;
  /** 失败数 */
  failed?: number;
  /** 警告数 */
  warning?: number;
}

/** 活跃用户 Top 项 */
export interface TopUser {
  /** 用户ID @format int64 */
  userId?: number;
  /** 用户名称 */
  userName?: string;
  /** 用户头像 */
  userAvatar?: string;
  /** 活动次数 */
  activityCount?: number;
  /** 最后活动时间，格式: yyyy-MM-dd HH:mm:ss */
  lastActivityDate?: string;
}

/** 时间趋势 */
export interface TimeTrend {
  /** 时间戳 @format int64 */
  timestamp?: number;
  /** 日期，按天或小时格式 */
  date?: string;
  /** 活动数量 */
  count?: number;
  /** 成功数 */
  successCount?: number;
  /** 失败数 */
  failedCount?: number;
}

/** 热门资源 Top 项 */
export interface TopResource {
  /** 资源ID @format int64 */
  resourceId?: number;
  /** 资源类型 */
  resourceType?: string;
  /** 资源名称 */
  resourceName?: string;
  /** 操作次数 */
  operationCount?: number;
  /** 最后操作时间 */
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
