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
  ApiLocaleResultListPluginReviewVo,
  ApiLocaleResultPageResultPluginListVo,
  ApiLocaleResultPluginDetailVo,
  ApiLocaleResultPluginStatisticsVo,
  ApiResultObject,
  GetPluginListParamsCategoryEnum,
  GetPluginListParamsFilters0OpEnum,
  GetPluginListParamsFilters1OpEnum,
  GetPluginListParamsInfoScopeEnum,
  GetPluginListParamsOrderByEnum,
  GetPluginListParamsOrderSortEnum,
  GetPluginListParamsStatusEnum,
  GetPluginListParamsTypeEnum,
  GetPluginStatisticsParamsPeriodEnum,
  ModifyPluginStatusParamsStatusEnum,
  PluginCreateDto,
  PluginReviewCreateDto,
  PluginUpdateDto,
  PluginVerifyDto,
} from "./data-contracts.ts";
import { ContentType, HttpClient, RequestParams } from "./http-client.ts";

export class Plugins<SecurityDataType = unknown> {
  http: HttpClient<SecurityDataType>;

  constructor(http: HttpClient<SecurityDataType>) {
    this.http = http;
  }

  /**
   * @description 修改插件状态
   *
   * @tags Plugin
   * @name ModifyPluginStatus
   * @summary 修改插件状态
   * @request PUT:/api/v1/plugins/{id}/status
   * @secure
   */
  modifyPluginStatus = (
    id: number,
    query: {
      /** 插件状态 */
      status: ModifyPluginStatusParamsStatusEnum;
    },
    params: RequestParams = {},
  ) =>
    this.http.request<ApiLocaleResultPluginDetailVo, ApiResultObject>({
      path: `/api/v1/plugins/${id}/status`,
      method: "PUT",
      query: query,
      secure: true,
      ...params,
    });
  /**
   * @description 获取插件列表，支持分页、搜索和筛选
   *
   * @tags Plugin
   * @name GetPluginList
   * @summary 获取插件列表
   * @request GET:/api/v1/plugins
   * @secure
   */
  getPluginList = (
    query?: {
      /**
       * 插件ID
       * @format int64
       */
      id?: number;
      /** 插件名称 */
      name?: string;
      /** 分类筛选 */
      category?: GetPluginListParamsCategoryEnum;
      /** 状态筛选 */
      status?: GetPluginListParamsStatusEnum;
      /** 类型筛选 */
      type?: GetPluginListParamsTypeEnum;
      /** 是否公开 */
      isPublic?: boolean;
      /** 是否系统插件 */
      isSystem?: boolean;
      /** 是否已验证 */
      isVerified?: boolean;
      /** 是否收藏 */
      isFavorite?: boolean;
      /** 标签筛选 */
      tags?: string[];
      /**
       * 安装次数
       * @format int64
       */
      installCount?: number;
      /**
       * 使用次数
       * @format int64
       */
      usageCount?: number;
      /**
       * 评价数量
       * @format int64
       */
      reviewCount?: number;
      /**
       * 评分
       * @format double
       */
      rating?: number;
      /**
       * 最小评分
       * @format double
       */
      minRating?: number;
      /**
       * 所属租户ID
       * @format int64
       * @example 1
       */
      tenantId?: number;
      /**
       * 创建人ID
       * @format int64
       * @example 1
       */
      createdBy?: number;
      /**
       * 创建时间
       * @format date-time
       * @example "2024-10-12 00:00:00"
       */
      createdDate?: string;
      /** 排序字段 */
      orderBy?: GetPluginListParamsOrderByEnum;
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
      orderSort?: GetPluginListParamsOrderSortEnum;
      /** Scope of information to query (BASIC or DETAIL). Interface performance optimization parameters, only valid for some interfaces */
      infoScope?: GetPluginListParamsInfoScopeEnum;
      /** Whether to use full-text search (default: false, uses DB index search if false) */
      fullTextSearch?: boolean;
      /** Search keyword */
      keyword?: string;
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
      "filters[0].op"?: GetPluginListParamsFilters0OpEnum;
      /** Customize the filter value */
      "filters[0].value"?: any;
      /** Customize the filter parameter name. Note: The parameter name must be a whitelist parameter */
      "filters[1].key"?: string;
      /** Customize the filter condition (EQUAL, NOT_EQUAL, GREATER_THAN, etc.) */
      "filters[1].op"?: GetPluginListParamsFilters1OpEnum;
      /** Customize the filter value */
      "filters[1].value"?: any;
    },
    params: RequestParams = {},
  ) =>
    this.http.request<ApiLocaleResultPageResultPluginListVo, ApiResultObject>({
      path: `/api/v1/plugins`,
      method: "GET",
      query: query,
      secure: true,
      ...params,
    });
  /**
   * @description 创建新插件
   *
   * @tags Plugin
   * @name CreatePlugin
   * @summary 创建插件
   * @request POST:/api/v1/plugins
   * @secure
   */
  createPlugin = (data: PluginCreateDto, params: RequestParams = {}) =>
    this.http.request<ApiResultObject, ApiResultObject>({
      path: `/api/v1/plugins`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.FormData,
      ...params,
    });
  /**
   * @description 查询指定插件的所有评级记录（不分页）
   *
   * @tags PluginReview
   * @name ListPluginReviews
   * @summary 查询插件评级记录
   * @request GET:/api/v1/plugins/{pluginId}/reviews
   * @secure
   */
  listPluginReviews = (pluginId: number, params: RequestParams = {}) =>
    this.http.request<ApiLocaleResultListPluginReviewVo, ApiResultObject>({
      path: `/api/v1/plugins/${pluginId}/reviews`,
      method: "GET",
      secure: true,
      ...params,
    });
  /**
   * @description 为指定插件提交评级记录
   *
   * @tags PluginReview
   * @name CreatePluginReview
   * @summary 提交插件评级
   * @request POST:/api/v1/plugins/{pluginId}/reviews
   * @secure
   */
  createPluginReview = (
    pluginId: number,
    data: PluginReviewCreateDto,
    params: RequestParams = {},
  ) =>
    this.http.request<ApiResultObject, ApiResultObject>({
      path: `/api/v1/plugins/${pluginId}/reviews`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description 标记插件使用，增加使用计数
   *
   * @tags Plugin
   * @name UsePlugin
   * @summary 使用插件
   * @request POST:/api/v1/plugins/{id}/use
   * @secure
   */
  usePlugin = (id: number, params: RequestParams = {}) =>
    this.http.request<ApiLocaleResultPluginDetailVo, ApiResultObject>({
      path: `/api/v1/plugins/${id}/use`,
      method: "POST",
      secure: true,
      ...params,
    });
  /**
   * @description 卸载指定插件（只删除运行时，保留安装包）
   *
   * @tags Plugin
   * @name UninstallPlugin
   * @summary 卸载插件
   * @request POST:/api/v1/plugins/{id}/uninstall
   * @secure
   */
  uninstallPlugin = (id: number, params: RequestParams = {}) =>
    this.http.request<ApiResultObject, ApiResultObject>({
      path: `/api/v1/plugins/${id}/uninstall`,
      method: "POST",
      secure: true,
      ...params,
    });
  /**
   * @description 发布插件到插件市场
   *
   * @tags Plugin
   * @name PublishPlugin
   * @summary 发布插件
   * @request POST:/api/v1/plugins/{id}/publish
   * @secure
   */
  publishPlugin = (id: number, params: RequestParams = {}) =>
    this.http.request<ApiLocaleResultPluginDetailVo, ApiResultObject>({
      path: `/api/v1/plugins/${id}/publish`,
      method: "POST",
      secure: true,
      ...params,
    });
  /**
   * @description 安装指定插件
   *
   * @tags Plugin
   * @name InstallPlugin
   * @summary 安装插件
   * @request POST:/api/v1/plugins/{id}/install
   * @secure
   */
  installPlugin = (id: number, params: RequestParams = {}) =>
    this.http.request<ApiLocaleResultPluginDetailVo, ApiResultObject>({
      path: `/api/v1/plugins/${id}/install`,
      method: "POST",
      secure: true,
      ...params,
    });
  /**
   * @description 管理员验证插件（需要管理员权限）
   *
   * @tags Plugin
   * @name VerifyPlugin
   * @summary 验证插件有效性
   * @request POST:/api/v1/plugins/verify
   * @secure
   */
  verifyPlugin = (data: PluginVerifyDto, params: RequestParams = {}) =>
    this.http.request<ApiLocaleResultPluginDetailVo, ApiResultObject>({
      path: `/api/v1/plugins/verify`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.FormData,
      ...params,
    });
  /**
   * @description 获取指定插件的详细信息
   *
   * @tags Plugin
   * @name GetPluginDetail
   * @summary 获取插件详情
   * @request GET:/api/v1/plugins/{id}
   * @secure
   */
  getPluginDetail = (id: number, params: RequestParams = {}) =>
    this.http.request<ApiLocaleResultPluginDetailVo, ApiResultObject>({
      path: `/api/v1/plugins/${id}`,
      method: "GET",
      secure: true,
      ...params,
    });
  /**
   * @description 删除指定插件（先卸载插件，再删除所有插件信息）
   *
   * @tags Plugin
   * @name DeletePlugin
   * @summary 删除插件
   * @request DELETE:/api/v1/plugins/{id}
   * @secure
   */
  deletePlugin = (id: number, params: RequestParams = {}) =>
    this.http.request<ApiResultObject, ApiResultObject>({
      path: `/api/v1/plugins/${id}`,
      method: "DELETE",
      secure: true,
      ...params,
    });
  /**
   * @description 更新插件的基本信息
   *
   * @tags Plugin
   * @name UpdatePlugin
   * @summary 更新插件基本信息
   * @request PATCH:/api/v1/plugins/{id}
   * @secure
   */
  updatePlugin = (
    id: number,
    data: PluginUpdateDto,
    params: RequestParams = {},
  ) =>
    this.http.request<ApiLocaleResultPluginDetailVo, ApiResultObject>({
      path: `/api/v1/plugins/${id}`,
      method: "PATCH",
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description 获取插件的详细统计数据
   *
   * @tags Plugin
   * @name GetPluginStatistics
   * @summary 获取插件统计
   * @request GET:/api/v1/plugins/statistics
   * @secure
   */
  getPluginStatistics = (
    query?: {
      /** 统计周期 */
      period?: GetPluginStatisticsParamsPeriodEnum;
    },
    params: RequestParams = {},
  ) =>
    this.http.request<ApiLocaleResultPluginStatisticsVo, ApiResultObject>({
      path: `/api/v1/plugins/statistics`,
      method: "GET",
      query: query,
      secure: true,
      ...params,
    });
}
