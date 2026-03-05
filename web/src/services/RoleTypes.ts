import { TenantAuditingVo } from '@xcan-angus/infra';

import { ApplicationMenuTypeEnum, EnabledStatusEnum, RoleEffectEnum } from '@/enums/enums';
import { HttpApiResult } from './HttpApiResult';
import { UserInfo } from './CommonTypes';

export type RoleDetailVoResult = HttpApiResult & {
  data?: RoleDetailVo;
};

/** 角色详情 */
export interface RoleDetailVo extends TenantAuditingVo {
  /**
   * ID
   * @format int64
   */
  id?: string;
  /** 角色名称 */
  name?: string;
  /** 角色编码 */
  code?: string;
  /** 描述 */
  description?: string;
  /** 是否系统角色 */
  isSystem?: boolean;
  /** 是否默认角色 */
  isDefault?: boolean;
  /** 角色状态 */
  status?: EnabledStatusEnum;
  /**
   * 应用ID
   * @format int64
   */
  appId?: number;
  /** 应用名称 */
  appName?: string;
  /**
   * 用户数量
   * @format int64
   */
  userCount?: number;
  /** 权限列表 */
  permissions?: PermissionInfo[];
  /** 关联用户列表 */
  users?: UserInfo[];
  /** 创建者姓名 */
  creator?: string;
  /** 最后修改人 */
  modifier?: string;
}

/** 权限信息 */
export interface PermissionInfo {
  /**
   * 父菜单ID，授权应用功能时必须
   * @format int64
   */
  parentMenuId?: number;
  /**
   * 菜单ID，授权应用功能时必须
   * @format int64
   */
  menuId?: string;
  /** 菜单名称 */
  menuName?: string;
  /** 资源标识 */
  resource?: string;
  /** 资源名称 */
  resourceName?: string;
  /** 操作列表 */
  actions?: string[];
}

/** 权限项 */
export interface RolePermissionDto {
  /**
   * 菜单ID，授权应用功能时必须
   * @format int64
   */
  menuId?: string;
  /**
   * 资源标识
   * @minLength 0
   * @maxLength 80
   */
  resource: string;
  /**
   * 操作列表
   * @maxItems 100
   * @minItems 1
   */
  actions: string[];
}

/** 更新角色请求参数 */
export interface RoleUpdateDto {
  /**
   * 角色名称
   * @minLength 0
   * @maxLength 100
   */
  name: string;
  /**
   * 角色编码
   * @minLength 0
   * @maxLength 80
   */
  code: string;
  /**
   * 描述
   * @minLength 0
   * @maxLength 800
   */
  description?: string;
  /** 是否设为默认角色，默认false。注意：应用默认角色针对所有用户自动生效 */
  isDefault?: boolean;
  /** 角色效果，默认允许，ALLOW：允许，DENY：拒绝 */
  effect?: RoleEffectEnum;
  /**
   * 权限列表
   * @maxItems 100
   * @minItems 0
   */
  permissions?: RolePermissionDto[];
}

/** The API response result of supporting international message. */
export type PageResultRoleListVoResult = HttpApiResult & {
  /** Actual response data or error details. */
  data?: PageResultRoleListVo;
};

export interface PageResultRoleListVo {
  /**
   * Total number
   * @format int64
   * @example 10
   */
  total?: number;
  /** Page data */
  list?: RoleListVo[];
}

/** 角色列表项 */
export interface RoleListVo extends TenantAuditingVo {
  /**
   * ID
   * @format int64
   */
  id?: string;
  /** 角色名称 */
  name?: string;
  /** 角色编码 */
  code?: string;
  /** 描述 */
  description?: string;
  /** 角色状态 */
  status?: EnabledStatusEnum;
  /** 是否系统角色 */
  isSystem?: boolean;
  /** 是否默认角色 */
  isDefault?: boolean;
  /**
   * 用户数量
   * @format int64
   */
  userCount?: number;
  /**
   * 应用ID
   * @format int64
   */
  appId?: number;
  /** 应用名称 */
  appName?: string;
  /** 创建者姓名 */
  creator?: string;
  /** 最后修改人 */
  modifier?: string;
}

/** The API response result of supporting international message. */
export type RolePermissionVoResult = HttpApiResult & {
  /** Actual response data or error details. */
  data?: RolePermissionVo;
};

/** 角色权限配置 */
export interface RolePermissionVo {
  /**
   * 角色ID
   * @format int64
   */
  roleId?: string;
  /** 角色名称 */
  roleName?: string;
  /** 权限列表 */
  permissions?: PermissionInfo[];
  /**
   * 修改时间
   * @format date-time
   */
  modifiedDate?: string;
}

/** 更新角色权限请求参数 */
export interface RolePermissionUpdateDto {
  /** 权限列表 */
  permissions?: RolePermissionDto[];
}

/** The API response result of supporting international message. */
export type RoleDefaultVoResult = HttpApiResult & {
  /** Actual response data or error details. */
  data?: RoleDefaultVo;
};

/** 设置默认角色响应 */
export interface RoleDefaultVo {
  /**
   * 角色ID
   * @format int64
   */
  id?: string;
  /** 角色名称 */
  name?: string;
  /** 是否默认角色 */
  isDefault?: boolean;
  /**
   * 修改时间
   * @format date-time
   */
  modifiedDate?: string;
}

/** 设置默认角色请求参数 */
export interface RoleDefaultDto {
  /** 是否设为默认角色 */
  isDefault?: boolean;
}

/** The API response result of supporting international message. */
export type AuthorizableApplicationMenuVoListResult = HttpApiResult & {
  /** Actual response data or error details. */
  data?: AuthorizableApplicationMenuVo[];
};

/** 可授权应用菜单（包含授权状态） */
export interface AuthorizableApplicationMenuVo extends ApplicationMenuVo {
  /** 是否已授权给角色 */
  authorized?: boolean;
  /** 子菜单列表 */
  children?: AuthorizableApplicationMenuVo[];
}

/** 应用菜单 */
export interface ApplicationMenuVo extends TenantAuditingVo {
  /**
   * 菜单ID
   * @format int64
   */
  id?: string;
  /**
   * 应用ID
   * @format int64
   */
  applicationId?: string;
  /** 菜单名称 */
  name?: string;
  /** 页面实际展示的简化名称，不设置时默认成名称 */
  showName?: string;
  /** 菜单编码 */
  code?: string;
  /** 菜单图标 */
  icon?: string;
  /** 菜单路径 */
  path?: string;
  /**
   * 父菜单ID
   * @format int64
   */
  parentId?: string;
  /**
   * 排序顺序
   * @format int32
   */
  sortOrder?: number;
  /** 有效状态，默认启用 */
  status?: EnabledStatusEnum;
  /** 菜单类型 */
  type?: ApplicationMenuTypeEnum;
  /** 是否授权控制，默认开启即授权后访问 */
  requiresAuth?: boolean;
  /** 权限信息 */
  permission?: PermissionInfo;
  /** 子菜单列表 */
  children?: ApplicationMenuVo[];
}