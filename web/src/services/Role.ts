import { PageQuery, GM } from '@xcan-angus/infra';

import {
  RoleDefaultDto,
  RolePermissionUpdateDto,
  RoleUpdateDto,
  RoleDetailVoResult,
  PageResultRoleListVoResult,
  RolePermissionVoResult,
  RoleDefaultVoResult,
  AuthorizableApplicationMenuVoListResult
} from './RoleTypes';
import { EnabledStatusEnum } from '@/enums/enums';
import { ContentType, HttpClient, QueryParamsType, RequestParams } from './HttpClient';
import http from '@/services/HttpClient';

export class Role<SecurityDataType = unknown> {
  http: HttpClient<SecurityDataType>;

  constructor (http: HttpClient<SecurityDataType>) {
    this.http = http;
  }

  /**
   * @description 获取指定角色的详细信息
   *
   * @tags Role
   * @name GetRoleDetail
   * @summary 获取角色详情
   * @request GET:/api/v1/roles/{id}
   * @secure
   */
  getRoleDetail = (id: string, params: RequestParams = {}) =>
    this.http.request<RoleDetailVoResult>({
      path: `${GM}/roles/${id}`,
      method: 'GET',
      secure: true,
      ...params
    });

  /**
   * @description 更新角色基本信息
   *
   * @tags Role
   * @name UpdateRole
   * @summary 更新角色
   * @request PUT:/api/v1/roles/{id}
   * @secure
   */
  updateRole = (id: string, data: RoleUpdateDto, params: RequestParams = {}) =>
    this.http.request<RoleDetailVoResult>({
      path: `${GM}/roles/${id}`,
      method: 'PUT',
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params
    });

  /**
   * @description 获取指定角色的权限配置
   *
   * @tags Role
   * @name GetRolePermissions
   * @summary 获取角色权限配置
   * @request GET:/api/v1/roles/{id}/permissions
   * @secure
   */
  getRolePermissions = (id: string, params: RequestParams = {}) =>
    this.http.request<RolePermissionVoResult>({
      path: `${GM}/roles/${id}/permissions`,
      method: 'GET',
      secure: true,
      ...params
    });

  /**
   * @description 更新指定角色的权限配置
   *
   * @tags Role
   * @name UpdateRolePermissions
   * @summary 更新角色权限
   * @request PUT:/api/v1/roles/{id}/permissions
   * @secure
   */
  updateRolePermissions = (
    id: string,
    data: RolePermissionUpdateDto,
    params: RequestParams = {}
  ) =>
    this.http.request<RolePermissionVoResult>({
      path: `${GM}/roles/${id}/permissions`,
      method: 'PUT',
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params
    });

  /**
   * @description 设置指定角色为默认角色
   *
   * @tags Role
   * @name SetDefaultRole
   * @summary 设置默认角色
   * @request PUT:/api/v1/roles/{id}/default
   * @secure
   */
  setDefaultRole = (
    id: string,
    data: RoleDefaultDto,
    params: RequestParams = {}
  ) =>
    this.http.request<RoleDefaultVoResult>({
      path: `${GM}/roles/${id}/default`,
      method: 'PUT',
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params
    });

  /**
   * @description 获取角色列表，支持分页、搜索和筛选
   *
   * @tags Role
   * @name GetRoleList
   * @summary 获取角色列表
   * @request GET:/api/v1/roles
   * @secure
   */
  getRoleList = (
    query?: PageQuery & {
      /**
       * ID
       * @format int64
       */
      id?: string;
      /** 角色名称 */
      name?: string;
      /** 角色编码 */
      code?: string;
      /**
       * 应用ID筛选
       * @format int64
       */
      appId?: number;
      /** 角色状态 */
      status?: EnabledStatusEnum;
      /** 是否系统角色 */
      isSystem?: boolean;
      /** 是否默认角色 */
      isDefault?: boolean;
    },
    params: RequestParams = {}
  ) =>
    this.http.request<PageResultRoleListVoResult>({
      path: `${GM}/roles`,
      method: 'GET',
      query: query as unknown as QueryParamsType,
      secure: true,
      ...params
    });

  /**
   * @description 根据角色ID查询可授权应用菜单树
   *
   * @tags Role
   * @name GetAuthorizableMenus
   * @summary 获取可授权应用菜单树
   * @request GET:/api/v1/roles/{id}/authorizable-menus
   * @secure
   */
  getAuthorizableMenus = (id: string, params: RequestParams = {}) =>
    this.http.request<AuthorizableApplicationMenuVoListResult>({
      path: `${GM}/roles/${id}/authorizable-menus`,
      method: 'GET',
      secure: true,
      ...params
    });
}

export default new Role(http);
