import { AI, ApiLocaleResult, PageQuery } from '@xcan-angus/infra';
import { GetModelListParamsOrderByEnum, ModelConfigDefinition, ModelCreateDto, ModelDetailResult, ModelStatisticsResult, ModelSupportedProvidersResult, ModelTestDto, ModelUpdateDto, ModelUpdateStatusDto, PageResultModelListResult, } from './ModelsTypes.ts';
import http, { ContentType, HttpClient, QueryParamsType, RequestParams } from './HttpClient.ts';
import { ModelProviderEnum, ModelStatusEnum, ModelTypeEnum } from '@/enums/enums.ts';

export class Models<SecurityDataType = unknown> {
  http: HttpClient<SecurityDataType>;

  constructor(http: HttpClient<SecurityDataType>) {
    this.http = http;
  }

  /**
   * @description 更新模型的详细配置
   *
   * @tags Model
   * @name UpdateModelConfig
   * @summary 更新模型配置
   * @request PUT:/api/v1/models/{id}/config
   * @secure
   */
  updateModelConfig = (id: string, data: ModelConfigDefinition, params: RequestParams = {}) =>
    this.http.request<ModelDetailResult>({
      path: `${AI}/models/${id}/config`,
      method: 'PUT',
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description 修改模型状态（激活/禁用）
   *
   * @tags Model
   * @name UpdateModelStatus
   * @summary 修改模型状态
   * @request PUT:/api/v1/models/{id}/status
   * @secure
   */
  updateModelStatus = (id: string, data: ModelUpdateStatusDto, params: RequestParams = {}) =>
    this.http.request<ModelDetailResult>({
      path: `${AI}/models/${id}/status`,
      method: 'PUT',
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description 获取当前用户的模型列表，支持分页、搜索和筛选
   *
   * @tags Model
   * @name GetModelList
   * @summary 获取模型列表
   * @request GET:/api/v1/models
   * @secure
   */
  getModelList = (
    query?: PageQuery & {
      /**
       * 模型ID
       * @format int64
       */
      id?: string;
      /**
       * 模型名称
       * @example "GPT-4"
       */
      name?: string;
      /** 模型类型 */
      type?: ModelTypeEnum;
      /** 模型提供商 */
      provider?: ModelProviderEnum;
      /** 状态筛选 */
      status?: ModelStatusEnum;
      /** 排序字段 */
      orderBy?: GetModelListParamsOrderByEnum;
    },
    params: RequestParams = {}
  ) =>
    this.http.request<PageResultModelListResult>({
      path: `${AI}/models`,
      method: 'GET',
      query: query as unknown as QueryParamsType,
      secure: true,
      ...params,
    });
  /**
   * @description 添加新模型
   *
   * @tags Model
   * @name CreateModel
   * @summary 添加模型
   * @request POST:/api/v1/models
   * @secure
   */
  createModel = (data: ModelCreateDto, params: RequestParams = {}) =>
    this.http.request<ApiLocaleResult>({
      path: `${AI}/models`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description 测试模型连接和配置
   *
   * @tags Model
   * @name TestModel
   * @summary 测试模型连接
   * @request POST:/api/v1/models/{id}/test
   * @secure
   */
  testModel = (id: string, data: ModelTestDto, params: RequestParams = {}) =>
    this.http.request<ModelDetailResult>({
      path: `${AI}/models/${id}/test`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description 获取指定模型的详细信息
   *
   * @tags Model
   * @name GetModelDetail
   * @summary 获取模型详情
   * @request GET:/api/v1/models/{id}
   * @secure
   */
  getModelDetail = (id: string, params: RequestParams = {}) =>
    this.http.request<ModelDetailResult>({
      path: `${AI}/models/${id}`,
      method: 'GET',
      secure: true,
      ...params,
    });
  /**
   * @description 删除指定模型
   *
   * @tags Model
   * @name DeleteModel
   * @summary 删除模型
   * @request DELETE:/api/v1/models/{id}
   * @secure
   */
  deleteModel = (id: string, params: RequestParams = {}) =>
    this.http.request<ApiLocaleResult>({
      path: `${AI}/models/${id}`,
      method: 'DELETE',
      secure: true,
      ...params,
    });
  /**
   * @description 更新模型配置
   *
   * @tags Model
   * @name UpdateModel
   * @summary 更新模型
   * @request PATCH:/api/v1/models/{id}
   * @secure
   */
  updateModel = (id: string, data: ModelUpdateDto, params: RequestParams = {}) =>
    this.http.request<ModelDetailResult>({
      path: `${AI}/models/${id}`,
      method: 'PUT',
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description 获取当前运行时支持的模型提供者列表（基于 ModelProvidersConfiguration 中已注册的 ModelFactory）
   *
   * @tags Model
   * @name GetSupportedProviders
   * @summary 查询支持的模型提供者
   * @request GET:/api/v1/models/providers
   * @secure
   */
  getSupportedProviders = (params: RequestParams = {}) =>
    this.http.request<ModelSupportedProvidersResult>({
      path: `${AI}/models/providers`,
      method: 'GET',
      secure: true,
      ...params,
    });
  /**
   * @description 获取模型调用统计数据
   *
   * @tags Model
   * @name GetModelStatistics
   * @summary 获取模型调用统计
   * @request GET:/api/v1/models/stats
   * @secure
   */
  getModelStatistics = (
    query?: {
      /**
       * 统计开始日期，可选，格式: yyyy-MM-dd 或 yyyy-MM-dd HH:mm:ss
       * @example "2024-11-01"
       */
      startDate?: string;
      /**
       * 统计结束日期，可选，格式: yyyy-MM-dd 或 yyyy-MM-dd HH:mm:ss
       * @example "2024-11-30"
       */
      endDate?: string;
    },
    params: RequestParams = {}
  ) =>
    this.http.request<ModelStatisticsResult>({
      path: `${AI}/models/stats`,
      method: 'GET',
      query: query,
      secure: true,
      ...params,
    });
}

export default new Models(http);
