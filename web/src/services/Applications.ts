import { ApiLocaleResult, PageQuery, AI } from '@xcan-angus/infra';
import { ApplicationConfig, ApplicationCreateDto, ApplicationDetailResult, ApplicationDuplicateDto, ApplicationShareDto, ApplicationStatisticsResult, ApplicationUpdateDto, GetApplicationListOrderByEnum, } from './ApplicationsTypes.ts';
import http, { ContentType, HttpClient, RequestParams } from './HttpClient.ts';
import { ApplicationCategoryEnum, ApplicationStatusEnum } from '@/enums/enums.ts';

export class Applications<SecurityDataType = unknown> {
  http: HttpClient<SecurityDataType>;

  constructor(http: HttpClient<SecurityDataType>) {
    this.http = http;
  }

  /**
   * @description 修改应用状态
   *
   * @tags Application
   * @name ModifyApplicationStatus
   * @summary 修改应用状态
   * @request PUT:/api/v1/applications/{id}/status
   * @secure
   */
  modifyApplicationStatus = (
    id: number,
    query: {
      /** 应用状态 */
      status: ApplicationStatusEnum;
    },
    params: RequestParams = {}
  ) =>
    this.http.request<ApplicationDetailResult, ApiLocaleResult>({
      path: `${AI}/applications/${id}/status`,
      method: 'PUT',
      query: query,
      secure: true,
      ...params,
    });
  /**
   * @description 更新应用的详细配置
   *
   * @tags Application
   * @name UpdateApplicationConfig
   * @summary 更新应用配置
   * @request PUT:/api/v1/applications/{id}/config
   * @secure
   */
  updateApplicationConfig = (id: number, data: ApplicationConfig, params: RequestParams = {}) =>
    this.http.request<ApplicationDetailResult, ApiLocaleResult>({
      path: `${AI}/applications/${id}/config`,
      method: 'PUT',
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description 获取当前用户的应用列表，支持分页、搜索和筛选
   *
   * @tags Application
   * @name GetApplicationList
   * @summary 获取应用列表
   * @request GET:/api/v1/applications
   * @secure
   */
  getApplicationList = (
    query?: PageQuery & {
      /** 分类筛选 */
      category?: ApplicationCategoryEnum;
      /** 状态筛选 */
      status?: ApplicationStatusEnum;
      /** 是否公开访问 */
      publicAccess?: boolean;
      /** 是否启用嵌入 */
      embedEnabled?: boolean;
      /** 是否启用API */
      apiEnabled?: boolean;
      /** 是否模板 */
      isTemplate?: boolean;
      /**
       * 排序字段
       * @example "modifiedDate"
       */
      orderBy?: GetApplicationListOrderByEnum;
    },
    params: RequestParams = {}
  ) =>
    this.http.request<ApiLocaleResult, ApiLocaleResult>({
      path: `${AI}/applications`,
      method: 'GET',
      query: query,
      secure: true,
      ...params,
    });
  /**
   * @description 创建新应用
   *
   * @tags Application
   * @name CreateApplication
   * @summary 创建应用
   * @request POST:/api/v1/applications
   * @secure
   */
  createApplication = (data: ApplicationCreateDto, params: RequestParams = {}) =>
    this.http.request<ApiLocaleResult, ApiLocaleResult>({
      path: `${AI}/applications`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description 生成应用分享链接或邀请码
   *
   * @tags Application
   * @name ShareApplication
   * @summary 分享应用
   * @request POST:/api/v1/applications/{id}/share
   * @secure
   */
  shareApplication = (id: number, data: ApplicationShareDto, params: RequestParams = {}) =>
    this.http.request<ApplicationDetailResult, ApiLocaleResult>({
      path: `${AI}/applications/${id}/share`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description 复制应用，包含所有配置
   *
   * @tags Application
   * @name DuplicateApplication
   * @summary 复制应用
   * @request POST:/api/v1/applications/{id}/duplicate
   * @secure
   */
  duplicateApplication = (id: number, data: ApplicationDuplicateDto, params: RequestParams = {}) =>
    this.http.request<ApiLocaleResult, ApiLocaleResult>({
      path: `${AI}/applications/${id}/duplicate`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description 获取指定应用的详细信息
   *
   * @tags Application
   * @name GetApplicationDetail
   * @summary 获取应用详情
   * @request GET:/api/v1/applications/{id}
   * @secure
   */
  getApplicationDetail = (id: number, params: RequestParams = {}) =>
    this.http.request<ApiLocaleResult, ApiLocaleResult>({
      path: `${AI}/applications/${id}`,
      method: 'GET',
      secure: true,
      ...params,
    });
  /**
   * @description 删除指定应用
   *
   * @tags Application
   * @name DeleteApplication
   * @summary 删除应用
   * @request DELETE:/api/v1/applications/{id}
   * @secure
   */
  deleteApplication = (id: number, params: RequestParams = {}) =>
    this.http.request<ApiLocaleResult, ApiLocaleResult>({
      path: `${AI}/applications/${id}`,
      method: 'DELETE',
      secure: true,
      ...params,
    });
  /**
   * @description 更新应用的基本信息
   *
   * @tags Application
   * @name UpdateApplication
   * @summary 更新应用基本信息
   * @request PATCH:/api/v1/applications/{id}
   * @secure
   */
  updateApplication = (id: number, data: ApplicationUpdateDto, params: RequestParams = {}) =>
    this.http.request<ApplicationDetailResult, ApiLocaleResult>({
      path: `${AI}/applications/${id}`,
      method: 'PATCH',
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description 获取应用的详细统计数据
   *
   * @tags Application
   * @name GetApplicationStatistics
   * @summary 获取应用统计
   * @request GET:/api/v1/applications/{id}/statistics
   * @secure
   */
  getApplicationStatistics = (
    id: number,
    query?: {
      /** 开始日期 */
      startDate?: string;
      /** 结束日期 */
      endDate?: string;
      /** 统计周期 */
      period?: string;
    },
    params: RequestParams = {}
  ) =>
    this.http.request<ApplicationStatisticsResult, ApiLocaleResult>({
      path: `${AI}/applications/${id}/statistics`,
      method: 'GET',
      query: query,
      secure: true,
      ...params,
    });
}

export default new Applications(http);
