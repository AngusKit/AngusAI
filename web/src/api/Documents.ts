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
  ApiLocaleResultKnowledgeBaseDocListVo,
  ApiLocaleResultKnowledgeBaseDocStatusVo,
  ApiLocaleResultListKnowledgeBaseDocSearchResultVo,
  ApiLocaleResultPageResultKnowledgeBaseDocListVo,
  ApiResultObject,
  GetDocumentListParamsFilters0OpEnum,
  GetDocumentListParamsFilters1OpEnum,
  GetDocumentListParamsInfoScopeEnum,
  GetDocumentListParamsOrderByEnum,
  GetDocumentListParamsOrderSortEnum,
  GetDocumentListParamsStatusEnum,
  GetDocumentListParamsTypeEnum,
  KnowledgeBaseDocBatchDeleteDto,
  KnowledgeBaseDocSearchDto,
  KnowledgeBaseDocToggleDto,
} from "./data-contracts.ts";
import { ContentType, HttpClient, RequestParams } from "./http-client.ts";

export class Documents<SecurityDataType = unknown> {
  http: HttpClient<SecurityDataType>;

  constructor(http: HttpClient<SecurityDataType>) {
    this.http = http;
  }

  /**
   * @description 切换文档的启用状态
   *
   * @tags KnowledgeBaseDoc
   * @name ToggleDocument
   * @summary 切换文档状态
   * @request PUT:/api/v1/documents/{documentId}/knowledge-bases/{knowledgeBaseId}/toggle
   * @secure
   */
  toggleDocument = (
    documentId: number,
    knowledgeBaseId: number,
    data: KnowledgeBaseDocToggleDto,
    params: RequestParams = {},
  ) =>
    this.http.request<ApiLocaleResultKnowledgeBaseDocListVo, ApiResultObject>({
      path: `/api/v1/documents/${documentId}/knowledge-bases/${knowledgeBaseId}/toggle`,
      method: "PUT",
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description 重新处理失败的文档
   *
   * @tags KnowledgeBaseDoc
   * @name ReprocessDocument
   * @summary 重新处理文档
   * @request POST:/api/v1/documents/{documentId}/knowledge-bases/{knowledgeBaseId}/reprocess
   * @secure
   */
  reprocessDocument = (
    documentId: number,
    knowledgeBaseId: number,
    params: RequestParams = {},
  ) =>
    this.http.request<ApiLocaleResultKnowledgeBaseDocStatusVo, ApiResultObject>(
      {
        path: `/api/v1/documents/${documentId}/knowledge-bases/${knowledgeBaseId}/reprocess`,
        method: "POST",
        secure: true,
        ...params,
      },
    );
  /**
   * @description 获取知识库的文档列表
   *
   * @tags KnowledgeBaseDoc
   * @name GetDocumentList
   * @summary 获取文档列表
   * @request GET:/api/v1/documents/knowledge-bases/{knowledgeBaseId}
   * @secure
   */
  getDocumentList = (
    knowledgeBaseId: number,
    query?: {
      /** 文档类型筛选 */
      type?: GetDocumentListParamsTypeEnum;
      /** 状态筛选 */
      status?: GetDocumentListParamsStatusEnum;
      /** 启用状态筛选 */
      enabled?: boolean;
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
      orderBy?: GetDocumentListParamsOrderByEnum;
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
      orderSort?: GetDocumentListParamsOrderSortEnum;
      /** Scope of information to query (BASIC or DETAIL). Interface performance optimization parameters, only valid for some interfaces */
      infoScope?: GetDocumentListParamsInfoScopeEnum;
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
      "filters[0].op"?: GetDocumentListParamsFilters0OpEnum;
      /** Customize the filter value */
      "filters[0].value"?: any;
      /** Customize the filter parameter name. Note: The parameter name must be a whitelist parameter */
      "filters[1].key"?: string;
      /** Customize the filter condition (EQUAL, NOT_EQUAL, GREATER_THAN, etc.) */
      "filters[1].op"?: GetDocumentListParamsFilters1OpEnum;
      /** Customize the filter value */
      "filters[1].value"?: any;
    },
    params: RequestParams = {},
  ) =>
    this.http.request<
      ApiLocaleResultPageResultKnowledgeBaseDocListVo,
      ApiResultObject
    >({
      path: `/api/v1/documents/knowledge-bases/${knowledgeBaseId}`,
      method: "GET",
      query: query,
      secure: true,
      ...params,
    });
  /**
   * @description 上传文档到知识库
   *
   * @tags KnowledgeBaseDoc
   * @name UploadDocuments
   * @summary 上传文档
   * @request POST:/api/v1/documents/knowledge-bases/{knowledgeBaseId}
   * @secure
   */
  uploadDocuments = (
    knowledgeBaseId: number,
    query: {
      /** 文件列表 */
      files: File[];
    },
    params: RequestParams = {},
  ) =>
    this.http.request<ApiResultObject, ApiResultObject>({
      path: `/api/v1/documents/knowledge-bases/${knowledgeBaseId}`,
      method: "POST",
      query: query,
      secure: true,
      ...params,
    });
  /**
   * @description 在知识库中检索相关内容
   *
   * @tags KnowledgeBaseDoc
   * @name SearchDocuments
   * @summary 搜索文档
   * @request POST:/api/v1/documents/knowledge-bases/{knowledgeBaseId}/search
   * @secure
   */
  searchDocuments = (
    knowledgeBaseId: number,
    data: KnowledgeBaseDocSearchDto,
    params: RequestParams = {},
  ) =>
    this.http.request<
      ApiLocaleResultListKnowledgeBaseDocSearchResultVo,
      ApiResultObject
    >({
      path: `/api/v1/documents/knowledge-bases/${knowledgeBaseId}/search`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description 批量删除文档
   *
   * @tags KnowledgeBaseDoc
   * @name BatchDeleteDocuments
   * @summary 批量删除文档
   * @request POST:/api/v1/documents/knowledge-bases/{knowledgeBaseId}/batch-delete
   * @secure
   */
  batchDeleteDocuments = (
    knowledgeBaseId: number,
    data: KnowledgeBaseDocBatchDeleteDto,
    params: RequestParams = {},
  ) =>
    this.http.request<void, ApiResultObject>({
      path: `/api/v1/documents/knowledge-bases/${knowledgeBaseId}/batch-delete`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description 删除指定文档
   *
   * @tags KnowledgeBaseDoc
   * @name DeleteDocument
   * @summary 删除文档
   * @request DELETE:/api/v1/documents/{documentId}/knowledge-bases/{knowledgeBaseId}
   * @secure
   */
  deleteDocument = (
    documentId: number,
    knowledgeBaseId: number,
    params: RequestParams = {},
  ) =>
    this.http.request<ApiResultObject, ApiResultObject>({
      path: `/api/v1/documents/${documentId}/knowledge-bases/${knowledgeBaseId}`,
      method: "DELETE",
      secure: true,
      ...params,
    });
}
