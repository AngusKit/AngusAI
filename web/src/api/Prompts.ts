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
  ApiLocaleResultPageResultPromptListVo,
  ApiLocaleResultPromptDetailVo,
  ApiResultObject,
  GetPromptListParamsFilters0OpEnum,
  GetPromptListParamsFilters1OpEnum,
  GetPromptListParamsInfoScopeEnum,
  GetPromptListParamsOrderByEnum,
  GetPromptListParamsOrderSortEnum,
  PromptCreateDto,
  PromptUpdateDto,
} from "./data-contracts.ts";
import { ContentType, HttpClient, RequestParams } from "./http-client.ts";

export class Prompts<SecurityDataType = unknown> {
  http: HttpClient<SecurityDataType>;

  constructor(http: HttpClient<SecurityDataType>) {
    this.http = http;
  }

  /**
   * @description 获取当前用户的提示词列表，支持分页、搜索和筛选
   *
   * @tags Prompt
   * @name GetPromptList
   * @summary 获取提示词列表
   * @request GET:/api/v1/prompts
   * @secure
   */
  getPromptList = (
    query?: {
      /** 提示词标题 */
      title?: string;
      /**
       * 分类ID
       * @format int64
       */
      categoryId?: number;
      /** 是否收藏 */
      isFavorite?: boolean;
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
      orderBy?: GetPromptListParamsOrderByEnum;
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
      orderSort?: GetPromptListParamsOrderSortEnum;
      /** Scope of information to query (BASIC or DETAIL). Interface performance optimization parameters, only valid for some interfaces */
      infoScope?: GetPromptListParamsInfoScopeEnum;
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
      "filters[0].op"?: GetPromptListParamsFilters0OpEnum;
      /** Customize the filter value */
      "filters[0].value"?: any;
      /** Customize the filter parameter name. Note: The parameter name must be a whitelist parameter */
      "filters[1].key"?: string;
      /** Customize the filter condition (EQUAL, NOT_EQUAL, GREATER_THAN, etc.) */
      "filters[1].op"?: GetPromptListParamsFilters1OpEnum;
      /** Customize the filter value */
      "filters[1].value"?: any;
    },
    params: RequestParams = {},
  ) =>
    this.http.request<ApiLocaleResultPageResultPromptListVo, ApiResultObject>({
      path: `/api/v1/prompts`,
      method: "GET",
      query: query,
      secure: true,
      ...params,
    });
  /**
   * @description 创建新提示词
   *
   * @tags Prompt
   * @name CreatePrompt
   * @summary 创建提示词
   * @request POST:/api/v1/prompts
   * @secure
   */
  createPrompt = (data: PromptCreateDto, params: RequestParams = {}) =>
    this.http.request<ApiResultObject, ApiResultObject>({
      path: `/api/v1/prompts`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description 标记提示词使用，增加使用计数
   *
   * @tags Prompt
   * @name UsePrompt
   * @summary 使用提示词
   * @request POST:/api/v1/prompts/{id}/use
   * @secure
   */
  usePrompt = (id: number, params: RequestParams = {}) =>
    this.http.request<ApiLocaleResultPromptDetailVo, ApiResultObject>({
      path: `/api/v1/prompts/${id}/use`,
      method: "POST",
      secure: true,
      ...params,
    });
  /**
   * @description 收藏或取消收藏提示词
   *
   * @tags Prompt
   * @name ToggleFavoritePrompt
   * @summary 收藏/取消收藏
   * @request POST:/api/v1/prompts/{id}/favorite
   * @secure
   */
  toggleFavoritePrompt = (
    id: number,
    query: {
      /** 是否收藏 */
      isFavorite: boolean;
    },
    params: RequestParams = {},
  ) =>
    this.http.request<ApiLocaleResultPromptDetailVo, ApiResultObject>({
      path: `/api/v1/prompts/${id}/favorite`,
      method: "POST",
      query: query,
      secure: true,
      ...params,
    });
  /**
   * @description 复制提示词（创建副本）
   *
   * @tags Prompt
   * @name DuplicatePrompt
   * @summary 复制提示词
   * @request POST:/api/v1/prompts/{id}/duplicate
   * @secure
   */
  duplicatePrompt = (
    id: number,
    query?: {
      /** 新标题 */
      title?: string;
    },
    params: RequestParams = {},
  ) =>
    this.http.request<ApiResultObject, ApiResultObject>({
      path: `/api/v1/prompts/${id}/duplicate`,
      method: "POST",
      query: query,
      secure: true,
      ...params,
    });
  /**
   * @description 获取指定提示词的详细信息
   *
   * @tags Prompt
   * @name GetPromptDetail
   * @summary 获取提示词详情
   * @request GET:/api/v1/prompts/{id}
   * @secure
   */
  getPromptDetail = (id: number, params: RequestParams = {}) =>
    this.http.request<ApiLocaleResultPromptDetailVo, ApiResultObject>({
      path: `/api/v1/prompts/${id}`,
      method: "GET",
      secure: true,
      ...params,
    });
  /**
   * @description 删除指定提示词
   *
   * @tags Prompt
   * @name DeletePrompt
   * @summary 删除提示词
   * @request DELETE:/api/v1/prompts/{id}
   * @secure
   */
  deletePrompt = (id: number, params: RequestParams = {}) =>
    this.http.request<ApiResultObject, ApiResultObject>({
      path: `/api/v1/prompts/${id}`,
      method: "DELETE",
      secure: true,
      ...params,
    });
  /**
   * @description 更新提示词基本信息
   *
   * @tags Prompt
   * @name UpdatePrompt
   * @summary 更新提示词
   * @request PATCH:/api/v1/prompts/{id}
   * @secure
   */
  updatePrompt = (
    id: number,
    data: PromptUpdateDto,
    params: RequestParams = {},
  ) =>
    this.http.request<ApiLocaleResultPromptDetailVo, ApiResultObject>({
      path: `/api/v1/prompts/${id}`,
      method: "PATCH",
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
}
