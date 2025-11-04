/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

import {
  ApiLocaleResultApplicationDetailVo,
  ApiLocaleResultApplicationStatisticsVo,
  ApiResultObject,
  ApplicationConfig,
  ApplicationCreateDto,
  ApplicationDuplicateDto,
  ApplicationShareDto,
  ApplicationUpdateDto,
  GetApplicationListParamsCategoryEnum,
  GetApplicationListParamsFilters0OpEnum,
  GetApplicationListParamsFilters1OpEnum,
  GetApplicationListParamsInfoScopeEnum,
  GetApplicationListParamsOrderByEnum,
  GetApplicationListParamsOrderSortEnum,
  GetApplicationListParamsStatusEnum,
  ModifyApplicationStatusParamsStatusEnum,
} from "./data-contracts.ts";
import { ContentType, HttpClient, RequestParams } from "./http-client.ts";

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
      status: ModifyApplicationStatusParamsStatusEnum;
    },
    params: RequestParams = {},
  ) =>
    this.http.request<ApiLocaleResultApplicationDetailVo, ApiResultObject>({
      path: `/api/v1/applications/${id}/status`,
      method: "PUT",
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
  updateApplicationConfig = (
    id: number,
    data: ApplicationConfig,
    params: RequestParams = {},
  ) =>
    this.http.request<ApiLocaleResultApplicationDetailVo, ApiResultObject>({
      path: `/api/v1/applications/${id}/config`,
      method: "PUT",
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
    query?: {
      /** 分类筛选 */
      category?: GetApplicationListParamsCategoryEnum;
      /** 状态筛选 */
      status?: GetApplicationListParamsStatusEnum;
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
      orderBy?: GetApplicationListParamsOrderByEnum;
      /**
       * Page number for paginated data (default: 1)
       * @format int32
       * @min 1
       * @max 100000
       */
      pageNo?: number;
      /**
       * Number of items per page (default: 10)
       * @format int32
       * @min 1
       * @max 2000
       */
      pageSize?: number;
      /** Specifies the direction of the sorting (ascending or descending) */
      orderSort?: GetApplicationListParamsOrderSortEnum;
      /** Scope of information to query (BASIC or DETAIL). Interface performance optimization parameters, only valid for some interfaces */
      infoScope?: GetApplicationListParamsInfoScopeEnum;
      /** Whether to use full-text search (default: false, uses DB index search if false) */
      fullTextSearch?: boolean;
      /** Search keyword */
      keyword?: string;
      /**
       * Tenant ID to which this belongs
       * @format int64
       * @example 1
       */
      tenantId?: number;
      /**
       * ID of the creator
       * @format int64
       * @example 1
       */
      createdBy?: number;
      /**
       * Creation date
       * @format date-time
       * @example "2024-10-12 00:00:00"
       */
      createdDate?: string;
      /**
       * ID of the last modifier
       * @format int64
       * @example 1
       */
      modifiedBy?: number;
      /**
       * Last modification date
       * @format date-time
       * @example "2024-10-12 00:00:00"
       */
      lastModifiedDate?: string;
      /** Customize the filter parameter name. Note: The parameter name must be a whitelist parameter */
      "filters[0].key"?: string;
      /** Customize the filter condition (EQUAL, NOT_EQUAL, GREATER_THAN, etc.) */
      "filters[0].op"?: GetApplicationListParamsFilters0OpEnum;
      /** Customize the filter value */
      "filters[0].value"?: any;
      /** Customize the filter parameter name. Note: The parameter name must be a whitelist parameter */
      "filters[1].key"?: string;
      /** Customize the filter condition (EQUAL, NOT_EQUAL, GREATER_THAN, etc.) */
      "filters[1].op"?: GetApplicationListParamsFilters1OpEnum;
      /** Customize the filter value */
      "filters[1].value"?: any;
    },
    params: RequestParams = {},
  ) =>
    this.http.request<ApiResultObject, ApiResultObject>({
      path: `/api/v1/applications`,
      method: "GET",
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
  createApplication = (
    data: ApplicationCreateDto,
    params: RequestParams = {},
  ) =>
    this.http.request<ApiResultObject, ApiResultObject>({
      path: `/api/v1/applications`,
      method: "POST",
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
  shareApplication = (
    id: number,
    data: ApplicationShareDto,
    params: RequestParams = {},
  ) =>
    this.http.request<ApiLocaleResultApplicationDetailVo, ApiResultObject>({
      path: `/api/v1/applications/${id}/share`,
      method: "POST",
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
  duplicateApplication = (
    id: number,
    data: ApplicationDuplicateDto,
    params: RequestParams = {},
  ) =>
    this.http.request<ApiResultObject, ApiResultObject>({
      path: `/api/v1/applications/${id}/duplicate`,
      method: "POST",
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
    this.http.request<ApiResultObject, ApiResultObject>({
      path: `/api/v1/applications/${id}`,
      method: "GET",
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
    this.http.request<ApiResultObject, ApiResultObject>({
      path: `/api/v1/applications/${id}`,
      method: "DELETE",
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
  updateApplication = (
    id: number,
    data: ApplicationUpdateDto,
    params: RequestParams = {},
  ) =>
    this.http.request<ApiLocaleResultApplicationDetailVo, ApiResultObject>({
      path: `/api/v1/applications/${id}`,
      method: "PATCH",
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
    params: RequestParams = {},
  ) =>
    this.http.request<ApiLocaleResultApplicationStatisticsVo, ApiResultObject>({
      path: `/api/v1/applications/${id}/statistics`,
      method: "GET",
      query: query,
      secure: true,
      ...params,
    });
}
