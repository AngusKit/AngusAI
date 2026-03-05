import { ApiLocaleResult, TenantAuditingVo } from '@xcan-angus/infra';
import {
  EnabledStatusEnum,
  GenderEnum,
  UserStatusEnum,
  UserSourceEnum,
} from '@/enums/enums';

/** 启用状态更新请求参数 - 与 AngusGM EnabledStatusUpdateDto 保持一致 */
export interface EnabledStatusUpdateDto {
  /** 状态：ENABLED-启用, DISABLED-禁用 */
  status: EnabledStatusEnum;
}

/** 创建用户请求参数 - 与 AngusGM UserCreateDto 保持一致 */
export interface UserCreateDto {
  username: string;
  name: string;
  email: string;
  phone?: string;
  password: string;
  avatar?: string;
  gender?: GenderEnum;
  landline?: string;
  jobTitle?: string;
  address?: string;
  departmentId?: string;
  roleIds?: string[];
  status?: UserStatusEnum;
}

/** 更新用户请求参数 - 与 AngusGM UserUpdateDto 保持一致 */
export interface UserUpdateDto {
  username: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  gender?: GenderEnum;
  landline?: string;
  jobTitle?: string;
  address?: string;
  departmentId?: string;
}

/** 部分更新用户请求参数 - 与 AngusGM UserPatchDto 保持一致 */
export interface UserPatchDto {
  username?: string;
  name?: string;
  email?: string;
  phone?: string;
  avatar?: string;
  gender?: GenderEnum;
  landline?: string;
  jobTitle?: string;
  address?: string;
  departmentId?: string;
}

/** 修改密码请求参数 */
export interface ChangePasswordDto {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

/** 检查用户密码请求参数 */
export interface CheckPasswordDto {
  password: string;
}

/** 锁定/解锁用户请求参数 */
export interface UserLockDto {
  locked: boolean;
  reason?: string;
}

/** 用户查询参数 - 与 AngusGM UserFindDto 保持一致 */
export interface UserFindDto {
  page?: number;
  size?: number;
  orderBy?: string;
  id?: string;
  name?: string;
  email?: string;
  phone?: string;
  status?: UserStatusEnum;
  roleId?: string;
  departmentId?: string;
  groupId?: string;
  locked?: boolean;
  online?: boolean;
  appCode?: string;
}

/** 角色信息 */
export interface RoleInfo {
  id?: string;
  name?: string;
  code?: string;
  appId?: string;
  appName?: string;
}

/** 部门信息 */
export interface DepartmentInfo {
  id?: string;
  name?: string;
  code?: string;
  description?: string;
  status?: EnabledStatusEnum;
  parentId?: string;
}

/** 用户组信息 */
export interface GroupInfo {
  id?: string;
  name?: string;
  code?: string;
}

/** 登录历史 */
export interface LoginHistoryVo {
  loginDate?: string;
  ipAddress?: string;
  userAgent?: string;
}

/** 用户详情 - 扩展 UserDetailVo，AngusAI MemberDetailVo 额外包含 shareCount、shareAccessCount */
export interface MemberDetailVo extends TenantAuditingVo {
  id?: string;
  username?: string;
  name?: string;
  email?: string;
  emailVerified?: boolean;
  phone?: string;
  phoneVerified?: boolean;
  avatar?: string;
  gender?: GenderEnum;
  landline?: string;
  jobTitle?: string;
  address?: string;
  location?: string;
  bio?: string;
  website?: string;
  github?: string;
  twitter?: string;
  linkedin?: string;
  departmentId?: string;
  department?: string;
  status?: UserStatusEnum;
  sysAdmin?: boolean;
  locked?: boolean;
  source?: UserSourceEnum;
  ldapId?: string;
  lastLogin?: string;
  online?: boolean;
  onlineDate?: string;
  offlineDate?: string;
  roles?: RoleInfo[];
  departments?: DepartmentInfo[];
  groups?: GroupInfo[];
  loginHistories?: LoginHistoryVo[];
  /** 共享资源数 - AngusAI 扩展 */
  shareCount?: number;
  /** 访问共享资源数 - AngusAI 扩展 */
  shareAccessCount?: number;
}

/** 用户列表项 - 扩展 UserListVo，AngusAI MemberListVo 额外包含 shareCount、shareAccessCount */
export interface MemberListVo extends TenantAuditingVo {
  id?: string;
  username?: string;
  name?: string;
  email?: string;
  emailVerified?: boolean;
  phone?: string;
  phoneVerified?: boolean;
  avatar?: string;
  gender?: GenderEnum;
  landline?: string;
  jobTitle?: string;
  address?: string;
  location?: string;
  bio?: string;
  website?: string;
  github?: string;
  twitter?: string;
  linkedin?: string;
  departmentId?: string;
  department?: string;
  status?: UserStatusEnum;
  sysAdmin?: boolean;
  locked?: boolean;
  source?: UserSourceEnum;
  ldapId?: string;
  lastLogin?: string;
  online?: boolean;
  onlineDate?: string;
  offlineDate?: string;
  roles?: RoleInfo[];
  departments?: DepartmentInfo[];
  groups?: GroupInfo[];
  /** 共享资源数 - AngusAI 扩展 */
  shareCount?: number;
  /** 访问共享资源数 - AngusAI 扩展 */
  shareAccessCount?: number;
}

/** 分页结果 */
export interface PageResultMemberListVo {
  total?: number;
  list?: MemberListVo[];
}

/** 用户统计数据 */
export interface UserStatsVo {
  totalUsers?: number;
  totalUsersChange?: number;
  activeUsers?: number;
  activeUsersGrowthRate?: number;
  disabledUsers?: number;
  pendingUsers?: number;
  onlineUsers?: number;
  adminUsers?: number;
  adminUsersChange?: number;
  newUsersThisMonth?: number;
  newUsersGrowthRate?: number;
  departmentDistribution?: UserStatsVoDepartmentDistributionVo[];
  growthTrend?: UserStatsVoUserGrowthTrendVo[];
  pendingInvites?: number;
  activeRate7Days?: number;
}

export interface UserStatsVoDepartmentDistributionVo {
  departmentName?: string;
  userCount?: number;
  percentage?: number;
}

export interface UserStatsVoUserGrowthTrendVo {
  month?: string;
  totalCount?: number;
}

/** API 响应类型 */
export type MemberDetailVoResult = ApiLocaleResult & {
  data?: MemberDetailVo;
};

export type PageResultMemberListVoResult = ApiLocaleResult & {
  data?: PageResultMemberListVo;
};

export type UserStatsVoResult = ApiLocaleResult & {
  data?: UserStatsVo;
};

export type UserDetailVoResult = ApiLocaleResult & {
  data?: MemberDetailVo;
};

export type UserStatusUpdateVoResult = ApiLocaleResult & {
  data?: { status?: EnabledStatusEnum };
};

export type UserLockVoResult = ApiLocaleResult & {
  data?: { locked?: boolean };
};
