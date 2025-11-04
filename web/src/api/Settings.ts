import { PageQuery, ApiLocaleResult } from '@xcan-angus/infra';
import {
  ApiKeyCreateDto,
  ApiKeyRevokeDto,
  ApiKeyDetailResult,
  ListApiKeyResult,
} from "./DataContracts.ts";
import { ContentType, HttpClient, RequestParams } from "./HttpClient.ts";

export class Settings<SecurityDataType = unknown> {
  http: HttpClient<SecurityDataType>;

  constructor(http: HttpClient<SecurityDataType>) {
    this.http = http;
  }

  /**
   * @description 获取API密钥列表
   *
   * @tags API Keys
   * @name ListApiKeys
   * @summary 获取API密钥列表
   * @request GET:/api/v1/settings/api-keys
   * @secure
   */
  listApiKeys = (params: RequestParams = {}) =>
    this.http.request<ListApiKeyResult, ApiLocaleResult>({
      path: `/api/v1/settings/api-keys`,
      method: "GET",
      secure: true,
      ...params,
    });
  /**
   * @description 创建新的API密钥，支持设置权限、资源授权、速率限制等
   *
   * @tags API Keys
   * @name CreateApiKey
   * @summary 创建API密钥
   * @request POST:/api/v1/settings/api-keys
   * @secure
   */
  createApiKey = (data: ApiKeyCreateDto, params: RequestParams = {}) =>
    this.http.request<ApiLocaleResult, ApiLocaleResult>({
      path: `/api/v1/settings/api-keys`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description 吊销API密钥，密钥将被禁用且无法再次启用
   *
   * @tags API Keys
   * @name RevokeApiKey
   * @summary 吊销API密钥
   * @request POST:/api/v1/settings/api-keys/{id}/revoke
   * @secure
   */
  revokeApiKey = (
    id: number,
    data: ApiKeyRevokeDto,
    params: RequestParams = {},
  ) =>
    this.http.request<ApiLocaleResult, ApiLocaleResult>({
      path: `/api/v1/settings/api-keys/${id}/revoke`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description 获取指定API密钥的详细信息
   *
   * @tags API Keys
   * @name GetApiKeyDetail
   * @summary 获取API密钥详情
   * @request GET:/api/v1/settings/api-keys/{id}
   * @secure
   */
  getApiKeyDetail = (id: number, params: RequestParams = {}) =>
    this.http.request<ApiKeyDetailResult, ApiLocaleResult>({
      path: `/api/v1/settings/api-keys/${id}`,
      method: "GET",
      secure: true,
      ...params,
    });
  /**
   * @description 删除指定的API密钥，删除后密钥将失效且无法恢复
   *
   * @tags API Keys
   * @name DeleteApiKey
   * @summary 删除API密钥
   * @request DELETE:/api/v1/settings/api-keys/{id}
   * @secure
   */
  deleteApiKey = (id: number, params: RequestParams = {}) =>
    this.http.request<ApiLocaleResult, ApiLocaleResult>({
      path: `/api/v1/settings/api-keys/${id}`,
      method: "DELETE",
      secure: true,
      ...params,
    });
}
