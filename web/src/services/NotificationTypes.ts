import type {
  NotificationPriorityEnum,
  NotificationTypeEnum
} from '@/enums/enums';

import { HttpApiResult } from './HttpApiResult.ts';

export type NotificationDetailVoResult = HttpApiResult & {
  data?: NotificationDetailVo;
};

/** 通知详情 */
export interface NotificationDetailVo {
  /**
   * 通知ID
   * @format int64
   */
  id?: string;
  /** 通知类型：SUCCESS, WARNING, INFO */
  type?: NotificationTypeEnum;
  /** 通知标题 */
  title?: string;
  /** 通知描述 */
  description?: string;
  /** 分类 */
  category?: string;
  /** 是否已读 */
  isRead?: boolean;
  /** 是否星标 */
  isStarred?: boolean;
  /** 是否归档 */
  isArchived?: boolean;
  /** 优先级：HIGH, MEDIUM, LOW */
  priority?: NotificationPriorityEnum;
  /**
   * 通知时间
   * @format date-time
   */
  timestamp?: string;
}

/** 创建通知请求参数 */
export interface NotificationCreateDto {
  /** 通知类型：SUCCESS, WARNING, INFO */
  type: NotificationTypeEnum;
  /** 通知标题 */
  title: string;
  /** 通知描述 */
  description: string;
  /** 分类 */
  category: string;
  /** 优先级：HIGH, MEDIUM, LOW */
  priority: NotificationPriorityEnum;
  /**
   * 目标用户ID列表，为空则发送给所有用户
   * @format int64
   */
  targetUserIds?: string[];
}

/** 更新通知请求参数 */
export interface NotificationUpdateDto {
  /** 通知标题 */
  title: string;
  /** 通知描述 */
  description: string;
  /** 分类 */
  category: string;
  /** 优先级：HIGH, MEDIUM, LOW */
  priority: NotificationPriorityEnum;
}

/** 更新通知已读状态请求参数 */
export interface NotificationReadStatusDto {
  /**
   * 通知ID列表
   * @format int64
   */
  notificationIds: string[];
  /** 是否已读：true-已读, false-未读 */
  isRead: boolean;
}

/** 更新通知星标状态请求参数 */
export interface NotificationStarStatusDto {
  /**
   * 通知ID列表
   * @format int64
   */
  notificationIds: string[];
  /** 是否星标：true-星标, false-取消星标 */
  isStarred: boolean;
}

/** 归档通知请求参数 */
export interface NotificationArchiveDto {
  /**
   * 通知ID列表
   * @format int64
   */
  notificationIds: string[];
}

/** 删除通知请求参数 */
export interface NotificationDeleteDto {
  /**
   * 通知ID列表
   * @format int64
   */
  notificationIds: string[];
}

/** 批量操作结果 */
export interface BatchOperationResultVo {
  /**
   * 成功数量
   * @format int32
   */
  successCount?: string;
  /**
   * 失败数量
   * @format int32
   */
  failedCount?: string;
}

/** The API response result of supporting international message. */
export type BatchOperationResultVoResult = HttpApiResult & {
  /** Actual response data or error details. */
  data?: BatchOperationResultVo;
};

/** 通知统计数据 */
export interface NotificationStatisticsVo {
  /**
   * 总数
   * @format int64
   */
  total?: string;
  /**
   * 未读数
   * @format int64
   */
  unread?: string;
  /**
   * 星标数
   * @format int64
   */
  starred?: string;
  /**
   * 归档数
   * @format int64
   */
  archived?: string;
  /**
   * 今日新增
   * @format int64
   */
  todayNew?: string;
  /**
   * 相比昨日新增
   * @format int64
   */
  comparedYesterday?: string;
  /** 按类型统计 */
  byType?: Record<string, string>;
  /** 按优先级统计 */
  byPriority?: Record<string, string>;
  /** 按分类统计 */
  byCategory?: Record<string, string>;
}

/** The API response result of supporting international message. */
export type NotificationStatisticsVoResult = HttpApiResult & {
  /** Actual response data or error details. */
  data?: NotificationStatisticsVo;
};

export interface PageResultNotificationDetailVo {
  /**
   * Total number
   * @format int64
   * @example 10
   */
  total?: string;
  /** Page data */
  list?: NotificationDetailVo[];
}

/** The API response result of supporting international message. */
export type PageResultNotificationDetailVoResult = HttpApiResult & {
  /** Actual response data or error details. */
  data?: PageResultNotificationDetailVo;
};
