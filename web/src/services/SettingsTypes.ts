import { ApiLocaleResult, TenantAuditingVo } from '@xcan-angus/infra';
import { ApiKeyPermissionsEnum, ApiKeyStatusEnum, ResourceTypeEnum } from '@/enums/enums.ts';

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
  ids?: string[];
}

/** 授权资源 */
export interface AuthorizedResourceVo {
  /** 资源类型 */
  type?: ResourceTypeEnum;
  /** 资源ID列表 */
  ids?: string[];
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

/** API密钥详情 */
export interface ApiKeyDetailVo extends TenantAuditingVo {
  /**
   * 密钥ID
   * @format int64
   */
  id?: string;
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

/** 创建API密钥请求参数 */
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

/** 撤销API密钥请求 */
export interface ApiKeyRevokeDto {
  /**
   * 撤销原因
   * @example "密钥泄露"
   */
  reason?: string;
}

/** API密钥列表项 */
export interface ApiKeyListVo extends TenantAuditingVo {
  /**
   * 密钥ID
   * @format int64
   */
  id?: string;
  /** 密钥名称 */
  name?: string;
  /** 密钥前缀 */
  keyPrefix?: string;
  /** 部分可见密钥 */
  keyVisible?: string;
  /** 状态 */
  status?: ApiKeyStatusEnum;
  /** 状态颜色 */
  statusColor?: string;
  /** 权限列表 */
  permissions?: ApiKeyPermissionsEnum[];
  /**
   * 使用次数
   * @format int64
   */
  usageCount?: number;
  /**
   * 最后使用时间
   * @format date-time
   */
  lastUsedAt?: string;
  /**
   * 过期时间
   * @format date-time
   */
  expiresAt?: string;
}

/** The API response result of supporting international message. */
export type ListApiKeyResult = ApiLocaleResult & {
  /** Actual response data or error details. */
  data?: ApiKeyListVo[];
};
