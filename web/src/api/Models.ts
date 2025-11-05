import { PageQuery, ApiLocaleResult } from '@xcan-angus/infra';
import {
  ModelDetailResult,
  ModelStatisticsResult,
  PageResultModelListResult,
  GetModelListParamsOrderByEnum,
  ModelConfig,
  ModelCreateDto,
  ModelTestDto,
  ModelUpdateDto,
} from "./DataContracts.ts";
import http, { ContentType, HttpClient, RequestParams } from "./HttpClient.ts";
import {ModelProviderEnum, ModelStatusEnum, ModelTypeEnum, StatisticsPeriodEnum} from "@/enums/enums.ts";

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
  updateModelConfig = (
    id: number,
    data: ModelConfig,
    params: RequestParams = {},
  ) =>
    this.http.request<ModelDetailResult, ApiLocaleResult>({
      path: `/api/v1/models/${id}/config`,
      method: "PUT",
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
      id?: number;
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
    params: RequestParams = {},
  ) =>
    this.http.request<PageResultModelListResult, ApiLocaleResult>({
      path: `/api/v1/models`,
      method: "GET",
      query: query,
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
    this.http.request<ApiLocaleResult, ApiLocaleResult>({
      path: `/api/v1/models`,
      method: "POST",
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
  testModel = (id: number, data: ModelTestDto, params: RequestParams = {}) =>
    this.http.request<ModelDetailResult, ApiLocaleResult>({
      path: `/api/v1/models/${id}/test`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description 停止模型
   *
   * @tags Model
   * @name StopModel
   * @summary 停止模型
   * @request POST:/api/v1/models/{id}/stop
   * @secure
   */
  stopModel = (
    id: number,
    query?: {
      /**
       * 优雅停止
       * @default true
       */
      graceful?: boolean;
    },
    params: RequestParams = {},
  ) =>
    this.http.request<ModelDetailResult, ApiLocaleResult>({
      path: `/api/v1/models/${id}/stop`,
      method: "POST",
      query: query,
      secure: true,
      ...params,
    });
  /**
   * @description 启动模型
   *
   * @tags Model
   * @name StartModel
   * @summary 启动模型
   * @request POST:/api/v1/models/{id}/start
   * @secure
   */
  startModel = (id: number, params: RequestParams = {}) =>
    this.http.request<ModelDetailResult, ApiLocaleResult>({
      path: `/api/v1/models/${id}/start`,
      method: "POST",
      secure: true,
      ...params,
    });
  /**
   * @description 重启模型（先停止再启动）
   *
   * @tags Model
   * @name RestartModel
   * @summary 重启模型
   * @request POST:/api/v1/models/{id}/restart
   * @secure
   */
  restartModel = (id: number, params: RequestParams = {}) =>
    this.http.request<ModelDetailResult, ApiLocaleResult>({
      path: `/api/v1/models/${id}/restart`,
      method: "POST",
      secure: true,
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
  getModelDetail = (id: number, params: RequestParams = {}) =>
    this.http.request<ModelDetailResult, ApiLocaleResult>({
      path: `/api/v1/models/${id}`,
      method: "GET",
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
  deleteModel = (id: number, params: RequestParams = {}) =>
    this.http.request<ApiLocaleResult, ApiLocaleResult>({
      path: `/api/v1/models/${id}`,
      method: "DELETE",
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
  updateModel = (
    id: number,
    data: ModelUpdateDto,
    params: RequestParams = {},
  ) =>
    this.http.request<ModelDetailResult, ApiLocaleResult>({
      path: `/api/v1/models/${id}`,
      method: "PATCH",
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description 获取模型调用统计数据
   *
   * @tags Model
   * @name GetModelStatistics
   * @summary 获取模型调用统计
   * @request GET:/api/v1/models/statistics
   * @secure
   */
  getModelStatistics = (
    query?: {
      /** 统计周期 */
      period?: StatisticsPeriodEnum;
    },
    params: RequestParams = {},
  ) =>
    this.http.request<ModelStatisticsResult, ApiLocaleResult>({
      path: `/api/v1/models/statistics`,
      method: "GET",
      query: query,
      secure: true,
      ...params,
    });
}

export default new Models(http);
