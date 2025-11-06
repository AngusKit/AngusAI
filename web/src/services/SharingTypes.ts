import { ApiLocaleResult, TenantAuditingVo } from '@xcan-angus/infra';
import { MemberPermissionEnum, ResourceTypeEnum, SharedWithEnum } from '@/enums/enums.ts';

/** 资源共享启用状态切换请求参数 */
export interface ResourceSharingToggleDto {
  /**
   * 启用状态
   * @example true
   */
  enabled: boolean;
}

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

/** The API response result of supporting international message. */
export type ResourceSharingDetailResult = ApiLocaleResult & {
  /** Actual response data or error details. */
  data?: ResourceSharingDetailVo;
};

/** 更新资源共享参数 */
export interface ResourceSharingUpdateDto {
  /** 共享范围 */
  sharedWith: SharedWithEnum;
  /** 权限 */
  permission: MemberPermissionEnum;
  /** 成员ID列表 */
  memberIds?: number[];
}

/** 创建资源共享请求参数 */
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

/** The API response result of supporting international message. */
export type ResourceSharingListResult = ApiLocaleResult & {
  /** Actual response data or error details. */
  data?: PageResourceSharingListVo;
};

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

/** The API response result of supporting international message. */
export type ResourceSharingStatisticsResult = ApiLocaleResult & {
  /** Actual response data or error details. */
  data?: ResourceSharingStatisticsVo;
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
export type ResourceAccessCheckResult = ApiLocaleResult & {
  /** Actual response data or error details. */
  data?: ResourceAccessCheckVo;
};

/** The API response result of supporting international message. */
export type ResourceInfoListSharePermissionResult = ApiLocaleResult & {
  /** Actual response data or error details. */
  data?: Record<string, MemberPermissionEnum[]>;
};

/** 排序字段 */
export enum GetResourceSharingListOrderByEnum {
  Id = 'id',
  Type = 'type',
  CreatedDate = 'createdDate',
  MemberCount = 'memberCount',
  Views = 'views',
}
