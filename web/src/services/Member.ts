import { ApiLocaleResult, AI, PageQuery } from '@xcan-angus/infra';
import {
  MemberDetailVoResult,
  PageResultMemberListVoResult,
  UserStatsVoResult,
  UserDetailVoResult,
  UserStatusUpdateVoResult,
  UserLockVoResult,
  UserCreateDto,
  UserUpdateDto,
  UserPatchDto,
  UserFindDto,
  EnabledStatusUpdateDto,
  ChangePasswordDto,
  CheckPasswordDto,
  UserLockDto,
} from './MemberTypes';
import httpClient, {
  HttpClient,
  ContentType,
  QueryParamsType,
  RequestParams,
} from './HttpClient';

/**
 * 组织成员管理 - 委托 AngusGM UserRemote 实现
 * 接口与 AngusAI MemberRest.java 保持一致
 */
export class Member<SecurityDataType = unknown> {
  http: HttpClient<SecurityDataType>;

  constructor(http: HttpClient<SecurityDataType>) {
    this.http = http;
  }

  /**
   * 创建用户
   * @request POST:/api/v1/users
   */
  createUser = (data: UserCreateDto, params: RequestParams = {}) =>
    this.http.request<UserDetailVoResult>({
      path: `${AI}/users`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });

  /**
   * 更新用户
   * @request PUT:/api/v1/users/{id}
   */
  updateUser = (id: string, data: UserUpdateDto, params: RequestParams = {}) =>
    this.http.request<UserDetailVoResult>({
      path: `${AI}/users/${id}`,
      method: 'PUT',
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });

  /**
   * 部分更新用户
   * @request PATCH:/api/v1/users/{id}
   */
  patchUser = (id: string, data: UserPatchDto, params: RequestParams = {}) =>
    this.http.request<UserDetailVoResult>({
      path: `${AI}/users/${id}`,
      method: 'PATCH',
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });

  /**
   * 启用/禁用用户
   * @request PUT:/api/v1/users/{id}/status
   */
  updateUserStatus = (
    id: string,
    data: EnabledStatusUpdateDto,
    params: RequestParams = {}
  ) =>
    this.http.request<UserStatusUpdateVoResult>({
      path: `${AI}/users/${id}/status`,
      method: 'PUT',
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });

  /**
   * 锁定/解锁用户
   * @request PUT:/api/v1/users/{id}/lock
   */
  updateUserLock = (id: string, data: UserLockDto, params: RequestParams = {}) =>
    this.http.request<UserLockVoResult>({
      path: `${AI}/users/${id}/lock`,
      method: 'PUT',
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });

  /**
   * 修改当前用户密码
   * @request POST:/api/v1/users/change-password/current
   */
  changeCurrentPassword = (data: ChangePasswordDto, params: RequestParams = {}) =>
    this.http.request<ApiLocaleResult>({
      path: `${AI}/users/change-password/current`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });

  /**
   * 检查用户密码是否正确
   * @request POST:/api/v1/users/{id}/check-password
   */
  checkPassword = (
    id: string,
    data: CheckPasswordDto,
    params: RequestParams = {}
  ) =>
    this.http.request<ApiLocaleResult>({
      path: `${AI}/users/${id}/check-password`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });

  /**
   * 删除用户
   * @request DELETE:/api/v1/users/{id}
   */
  deleteUser = (id: string, params: RequestParams = {}) =>
    this.http.request<void>({
      path: `${AI}/users/${id}`,
      method: 'DELETE',
      secure: true,
      ...params,
    });

  /**
   * 获取用户详情（AngusAI 返回 MemberDetailVo，含 shareCount、shareAccessCount）
   * @request GET:/api/v1/users/{id}
   */
  getDetail = (id: string, params: RequestParams = {}) =>
    this.http.request<MemberDetailVoResult>({
      path: `${AI}/users/${id}`,
      method: 'GET',
      secure: true,
      ...params,
    });

  /**
   * 获取用户列表（AngusAI 返回 PageResult<MemberListVo>）
   * @request GET:/api/v1/users
   */
  list = (query?: PageQuery & UserFindDto, params: RequestParams = {}) =>
    this.http.request<PageResultMemberListVoResult>({
      path: `${AI}/users`,
      method: 'GET',
      query: query as QueryParamsType,
      secure: true,
      ...params,
    });

  /**
   * 获取用户统计数据
   * @request GET:/api/v1/users/stats
   */
  getStats = (
    query?: { appCode?: string },
    params: RequestParams = {}
  ) =>
    this.http.request<UserStatsVoResult>({
      path: `${AI}/users/stats`,
      method: 'GET',
      query: query as QueryParamsType,
      secure: true,
      ...params,
    });
}

export default new Member(httpClient);
