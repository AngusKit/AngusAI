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
  ApiLocaleResultKnowledgeBaseDetailVo,
  ApiLocaleResultPageResultKnowledgeBaseListVo,
  ApiResultObject,
  GetKnowledgeBaseListParamsFilters0OpEnum,
  GetKnowledgeBaseListParamsFilters1OpEnum,
  GetKnowledgeBaseListParamsInfoScopeEnum,
  GetKnowledgeBaseListParamsOrderByEnum,
  GetKnowledgeBaseListParamsOrderSortEnum,
  GetKnowledgeBaseListParamsVisibilityEnum,
  KnowledgeBaseCreateDto,
  KnowledgeBaseToggleDto,
  KnowledgeBaseUpdateDto,
  ModifyKnowledgeBaseVisibilityParamsVisibilityEnum,
} from "./data-contracts.ts";
import { ContentType, HttpClient, RequestParams } from "./http-client.ts";

export class KnowledgeBases<SecurityDataType = unknown> {
  http: HttpClient<SecurityDataType>;

  constructor(http: HttpClient<SecurityDataType>) {
    this.http = http;
  }

  /**
   * @description 修改知识库可见性
   *
   * @tags KnowledgeBase
   * @name ModifyKnowledgeBaseVisibility
   * @summary 修改知识库可见性
   * @request PUT:/api/v1/knowledge-bases/{id}/visibility
   * @secure
   */
  modifyKnowledgeBaseVisibility = (
    id: number,
    query: {
      /** 可见性 */
      visibility: ModifyKnowledgeBaseVisibilityParamsVisibilityEnum;
    },
    params: RequestParams = {},
  ) =>
    this.http.request<ApiLocaleResultKnowledgeBaseDetailVo, ApiResultObject>({
      path: `/api/v1/knowledge-bases/${id}/visibility`,
      method: "PUT",
      query: query,
      secure: true,
      ...params,
    });
  /**
   * @description 切换知识库的启用状态
   *
   * @tags KnowledgeBase
   * @name ToggleKnowledgeStatus
   * @summary 切换知识库状态
   * @request PUT:/api/v1/knowledge-bases/{id}/toggle
   * @secure
   */
  toggleKnowledgeStatus = (
    id: number,
    data: KnowledgeBaseToggleDto,
    params: RequestParams = {},
  ) =>
    this.http.request<ApiLocaleResultKnowledgeBaseDetailVo, ApiResultObject>({
      path: `/api/v1/knowledge-bases/${id}/toggle`,
      method: "PUT",
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description 获取当前用户的知识库列表，支持分页、搜索和筛选
   *
   * @tags KnowledgeBase
   * @name GetKnowledgeBaseList
   * @summary 获取知识库列表
   * @request GET:/api/v1/knowledge-bases
   * @secure
   */
  getKnowledgeBaseList = (
    query?: {
      /**
       * 知识库名称
       * @example "产品文档库"
       */
      name?: string;
      /**
       * 标签筛选
       * @example ["产品","文档"]
       */
      tags?: string[];
      /**
       * 可见性筛选
       * @example "PRIVATE"
       */
      visibility?: GetKnowledgeBaseListParamsVisibilityEnum;
      /**
       * 启用状态筛选
       * @example true
       */
      enabled?: boolean;
      /**
       * 文档数
       * @format int64
       * @example 10
       */
      documentsCount?: number;
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
      /**
       * 最后修改人ID
       * @format int64
       * @example 1
       */
      modifiedBy?: number;
      /**
       * 最后修改时间
       * @format date-time
       * @example "2024-10-12 00:00:00"
       */
      modifiedDate?: string;
      /**
       * 排序字段
       * @example "modifiedDate"
       */
      orderBy?: GetKnowledgeBaseListParamsOrderByEnum;
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
      orderSort?: GetKnowledgeBaseListParamsOrderSortEnum;
      /** Scope of information to query (BASIC or DETAIL). Interface performance optimization parameters, only valid for some interfaces */
      infoScope?: GetKnowledgeBaseListParamsInfoScopeEnum;
      /** Whether to use full-text search (default: false, uses DB index search if false) */
      fullTextSearch?: boolean;
      /** Search keyword */
      keyword?: string;
      /**
       * Last modification date
       * @format date-time
       * @example "2024-10-12 00:00:00"
       */
      lastModifiedDate?: string;
      /** Customize the filter parameter name. Note: The parameter name must be a whitelist parameter */
      "filters[0].key"?: string;
      /** Customize the filter condition (EQUAL, NOT_EQUAL, GREATER_THAN, etc.) */
      "filters[0].op"?: GetKnowledgeBaseListParamsFilters0OpEnum;
      /** Customize the filter value */
      "filters[0].value"?: any;
      /** Customize the filter parameter name. Note: The parameter name must be a whitelist parameter */
      "filters[1].key"?: string;
      /** Customize the filter condition (EQUAL, NOT_EQUAL, GREATER_THAN, etc.) */
      "filters[1].op"?: GetKnowledgeBaseListParamsFilters1OpEnum;
      /** Customize the filter value */
      "filters[1].value"?: any;
    },
    params: RequestParams = {},
  ) =>
    this.http.request<
      ApiLocaleResultPageResultKnowledgeBaseListVo,
      ApiResultObject
    >({
      path: `/api/v1/knowledge-bases`,
      method: "GET",
      query: query,
      secure: true,
      ...params,
    });
  /**
   * @description 创建新知识库
   *
   * @tags KnowledgeBase
   * @name CreateKnowledgeBase
   * @summary 创建知识库
   * @request POST:/api/v1/knowledge-bases
   * @secure
   */
  createKnowledgeBase = (
    data: KnowledgeBaseCreateDto,
    params: RequestParams = {},
  ) =>
    this.http.request<ApiResultObject, ApiResultObject>({
      path: `/api/v1/knowledge-bases`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description 获取指定知识库的详细信息
   *
   * @tags KnowledgeBase
   * @name GetKnowledgeBaseDetail
   * @summary 获取知识库详情
   * @request GET:/api/v1/knowledge-bases/{id}
   * @secure
   */
  getKnowledgeBaseDetail = (id: number, params: RequestParams = {}) =>
    this.http.request<ApiLocaleResultKnowledgeBaseDetailVo, ApiResultObject>({
      path: `/api/v1/knowledge-bases/${id}`,
      method: "GET",
      secure: true,
      ...params,
    });
  /**
   * @description 删除指定知识库
   *
   * @tags KnowledgeBase
   * @name DeleteKnowledgeBase
   * @summary 删除知识库
   * @request DELETE:/api/v1/knowledge-bases/{id}
   * @secure
   */
  deleteKnowledgeBase = (id: number, params: RequestParams = {}) =>
    this.http.request<ApiResultObject, ApiResultObject>({
      path: `/api/v1/knowledge-bases/${id}`,
      method: "DELETE",
      secure: true,
      ...params,
    });
  /**
   * @description 更新知识库信息
   *
   * @tags KnowledgeBase
   * @name ToggleKnowledge
   * @summary 更新知识库
   * @request PATCH:/api/v1/knowledge-bases/{id}
   * @secure
   */
  toggleKnowledge = (
    id: number,
    data: KnowledgeBaseUpdateDto,
    params: RequestParams = {},
  ) =>
    this.http.request<ApiLocaleResultKnowledgeBaseDetailVo, ApiResultObject>({
      path: `/api/v1/knowledge-bases/${id}`,
      method: "PATCH",
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
}
