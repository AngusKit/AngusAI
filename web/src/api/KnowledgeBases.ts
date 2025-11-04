import { PageQuery, ApiLocaleResult } from '@xcan-angus/infra';
import {
  KnowledgeBaseDetailResult,
  PageResultKnowledgeBaseListResult,
  GetKnowledgeBaseListOrderByEnum,
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
    this.http.request<KnowledgeBaseDetailResult, ApiLocaleResult>({
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
    this.http.request<KnowledgeBaseDetailResult, ApiLocaleResult>({
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
    query?: PageQuery & {
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
       * 排序字段
       * @example "modifiedDate"
       */
      orderBy?: GetKnowledgeBaseListOrderByEnum;
    },
    params: RequestParams = {},
  ) =>
    this.http.request<
      PageResultKnowledgeBaseListResult,
      ApiLocaleResult
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
    this.http.request<ApiLocaleResult, ApiLocaleResult>({
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
    this.http.request<KnowledgeBaseDetailResult, ApiLocaleResult>({
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
    this.http.request<ApiLocaleResult, ApiLocaleResult>({
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
    this.http.request<KnowledgeBaseDetailResult, ApiLocaleResult>({
      path: `/api/v1/knowledge-bases/${id}`,
      method: "PATCH",
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
}
