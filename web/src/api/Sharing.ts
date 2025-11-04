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
  ApiLocaleResultMapResourceInfoListSharePermission,
  ApiLocaleResultPageResultResourceSharingListVo,
  ApiLocaleResultResourceAccessCheckVo,
  ApiLocaleResultResourceSharingDetailVo,
  ApiLocaleResultResourceSharingStatisticsVo,
  ApiResultObject,
  CheckResourceAccessParamsResourceTypeEnum,
  GetResourcePermissionsParamsResourceTypeEnum,
  GetResourceSharingListParamsFilters0OpEnum,
  GetResourceSharingListParamsFilters1OpEnum,
  GetResourceSharingListParamsInfoScopeEnum,
  GetResourceSharingListParamsOrderByEnum,
  GetResourceSharingListParamsOrderSortEnum,
  GetResourceSharingListParamsPermissionEnum,
  GetResourceSharingListParamsSharedWithEnum,
  GetResourceSharingListParamsTypeEnum,
  GetResourceSharingStatisticsParamsPeriodEnum,
  ResourceSharingCreateDto,
  ResourceSharingToggleDto,
  ResourceSharingUpdateDto,
} from "./data-contracts.ts";
import { ContentType, HttpClient, RequestParams } from "./http-client.ts";

export class Sharing<SecurityDataType = unknown> {
  http: HttpClient<SecurityDataType>;

  constructor(http: HttpClient<SecurityDataType>) {
    this.http = http;
  }

  /**
   * @description 启用或停止资源共享
   *
   * @tags Resource Sharing
   * @name ToggleResourceSharingStatus
   * @summary 切换资源共享状态
   * @request PUT:/api/v1/sharing/{id}/toggle
   * @secure
   */
  toggleResourceSharingStatus = (
    id: number,
    data: ResourceSharingToggleDto,
    params: RequestParams = {},
  ) =>
    this.http.request<ApiLocaleResultResourceSharingDetailVo, ApiResultObject>({
      path: `/api/v1/sharing/${id}/toggle`,
      method: "PUT",
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description 获取资源共享的详细信息
   *
   * @tags Resource Sharing
   * @name GetResourceSharingDetail
   * @summary 获取共享详情
   * @request GET:/api/v1/sharing/resources/{id}
   * @secure
   */
  getResourceSharingDetail = (id: number, params: RequestParams = {}) =>
    this.http.request<ApiLocaleResultResourceSharingDetailVo, ApiResultObject>({
      path: `/api/v1/sharing/resources/${id}`,
      method: "GET",
      secure: true,
      ...params,
    });
  /**
   * @description 更新资源共享配置
   *
   * @tags Resource Sharing
   * @name UpdateResourceSharing
   * @summary 更新共享权限
   * @request PUT:/api/v1/sharing/resources/{id}
   * @secure
   */
  updateResourceSharing = (
    id: number,
    data: ResourceSharingUpdateDto,
    params: RequestParams = {},
  ) =>
    this.http.request<ApiLocaleResultResourceSharingDetailVo, ApiResultObject>({
      path: `/api/v1/sharing/resources/${id}`,
      method: "PUT",
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description 取消资源共享
   *
   * @tags Resource Sharing
   * @name DeleteResourceSharing
   * @summary 取消资源共享
   * @request DELETE:/api/v1/sharing/resources/{id}
   * @secure
   */
  deleteResourceSharing = (id: number, params: RequestParams = {}) =>
    this.http.request<ApiResultObject, ApiResultObject>({
      path: `/api/v1/sharing/resources/${id}`,
      method: "DELETE",
      secure: true,
      ...params,
    });
  /**
   * @description 获取当前用户可访问的共享资源列表
   *
   * @tags Resource Sharing
   * @name GetResourceSharingList
   * @summary 获取共享资源列表
   * @request GET:/api/v1/sharing/resources
   * @secure
   */
  getResourceSharingList = (
    query?: {
      /**
       * 共享ID
       * @format int64
       */
      id?: number;
      /** 资源类型筛选 */
      type?: GetResourceSharingListParamsTypeEnum;
      /** 权限筛选 */
      permission?: GetResourceSharingListParamsPermissionEnum;
      /** 共享范围筛选 */
      sharedWith?: GetResourceSharingListParamsSharedWithEnum;
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
      orderBy?: GetResourceSharingListParamsOrderByEnum;
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
      orderSort?: GetResourceSharingListParamsOrderSortEnum;
      /** Scope of information to query (BASIC or DETAIL). Interface performance optimization parameters, only valid for some interfaces */
      infoScope?: GetResourceSharingListParamsInfoScopeEnum;
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
      "filters[0].op"?: GetResourceSharingListParamsFilters0OpEnum;
      /** Customize the filter value */
      "filters[0].value"?: any;
      /** Customize the filter parameter name. Note: The parameter name must be a whitelist parameter */
      "filters[1].key"?: string;
      /** Customize the filter condition (EQUAL, NOT_EQUAL, GREATER_THAN, etc.) */
      "filters[1].op"?: GetResourceSharingListParamsFilters1OpEnum;
      /** Customize the filter value */
      "filters[1].value"?: any;
    },
    params: RequestParams = {},
  ) =>
    this.http.request<
      ApiLocaleResultPageResultResourceSharingListVo,
      ApiResultObject
    >({
      path: `/api/v1/sharing/resources`,
      method: "GET",
      query: query,
      secure: true,
      ...params,
    });
  /**
   * @description 创建新的资源共享
   *
   * @tags Resource Sharing
   * @name CreateResourceSharing
   * @summary 创建资源共享
   * @request POST:/api/v1/sharing/resources
   * @secure
   */
  createResourceSharing = (
    data: ResourceSharingCreateDto,
    params: RequestParams = {},
  ) =>
    this.http.request<ApiResultObject, ApiResultObject>({
      path: `/api/v1/sharing/resources`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description 获取资源共享的访问统计
   *
   * @tags Resource Sharing
   * @name GetResourceSharingStatistics
   * @summary 获取共享访问统计
   * @request GET:/api/v1/sharing/resources/{id}/statistics
   * @secure
   */
  getResourceSharingStatistics = (
    id: number,
    query?: {
      /** 统计周期 */
      period?: GetResourceSharingStatisticsParamsPeriodEnum;
    },
    params: RequestParams = {},
  ) =>
    this.http.request<
      ApiLocaleResultResourceSharingStatisticsVo,
      ApiResultObject
    >({
      path: `/api/v1/sharing/resources/${id}/statistics`,
      method: "GET",
      query: query,
      secure: true,
      ...params,
    });
  /**
   * @description 检查当前用户对资源的访问权限
   *
   * @tags Resource Sharing
   * @name CheckResourceAccess
   * @summary 检查资源访问权限
   * @request GET:/api/v1/sharing/check-access
   * @secure
   */
  checkResourceAccess = (
    query: {
      /**
       * 资源ID
       * @format int64
       */
      resourceId: number;
      /** 资源类型 */
      resourceType: CheckResourceAccessParamsResourceTypeEnum;
    },
    params: RequestParams = {},
  ) =>
    this.http.request<ApiLocaleResultResourceAccessCheckVo, ApiResultObject>({
      path: `/api/v1/sharing/check-access`,
      method: "GET",
      query: query,
      secure: true,
      ...params,
    });
  /**
   * @description 获取当前用户对资源的访问权限
   *
   * @tags Resource Sharing
   * @name GetResourcePermissions
   * @summary 获取资源访问权限
   * @request GET:/api/v1/sharing/access-permissions
   * @secure
   */
  getResourcePermissions = (
    query: {
      /**
       * 资源ID
       * @format int64
       */
      resourceId: number;
      /** 资源类型 */
      resourceType: GetResourcePermissionsParamsResourceTypeEnum;
    },
    params: RequestParams = {},
  ) =>
    this.http.request<
      ApiLocaleResultMapResourceInfoListSharePermission,
      ApiResultObject
    >({
      path: `/api/v1/sharing/access-permissions`,
      method: "GET",
      query: query,
      secure: true,
      ...params,
    });
}
