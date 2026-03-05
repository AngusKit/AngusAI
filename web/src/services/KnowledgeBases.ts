import { ApiLocaleResult, PageQuery, AI } from '@xcan-angus/infra';
import { GetKnowledgeBaseListOrderByEnum, KnowledgeBaseCreateDto, KnowledgeBaseDetailResult, KnowledgeBaseStatisticsResult, KnowledgeBaseToggleDto, KnowledgeBaseUpdateDto, PageResultKnowledgeBaseListResult, } from './KnowledgeBasesTypes.ts';
import http, { ContentType, HttpClient, QueryParamsType, RequestParams } from './HttpClient.ts';
import { VisibilityEnum } from '@/enums/enums.ts';

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
    id: string,
    query: {
      /** 可见性 */
      visibility: VisibilityEnum;
    },
    params: RequestParams = {}
  ) =>
    this.http.request<KnowledgeBaseDetailResult>({
      path: `${AI}/knowledge-bases/${id}/visibility`,
      method: 'PUT',
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
  toggleKnowledgeStatus = (id: string, data: KnowledgeBaseToggleDto, params: RequestParams = {}) =>
    this.http.request<KnowledgeBaseDetailResult>({
      path: `${AI}/knowledge-bases/${id}/toggle`,
      method: 'PUT',
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
      visibility?: VisibilityEnum;
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
    params: RequestParams = {}
  ) =>
    this.http.request<PageResultKnowledgeBaseListResult>({
      path: `${AI}/knowledge-bases`,
      method: 'GET',
      query: query as unknown as QueryParamsType,
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
  createKnowledgeBase = (data: KnowledgeBaseCreateDto, params: RequestParams = {}) =>
    this.http.request<ApiLocaleResult>({
      path: `${AI}/knowledge-bases`,
      method: 'POST',
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
  getKnowledgeBaseDetail = (id: string, params: RequestParams = {}) =>
    this.http.request<KnowledgeBaseDetailResult>({
      path: `${AI}/knowledge-bases/${id}`,
      method: 'GET',
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
  deleteKnowledgeBase = (id: string, params: RequestParams = {}) =>
    this.http.request<ApiLocaleResult>({
      path: `${AI}/knowledge-bases/${id}`,
      method: 'DELETE',
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
  toggleKnowledge = (id: string, data: KnowledgeBaseUpdateDto, params: RequestParams = {}) =>
    this.http.request<KnowledgeBaseDetailResult>({
      path: `${AI}/knowledge-bases/${id}`,
      method: 'PATCH',
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description 获取知识库的统计数据，包括总体统计、使用率排行、性能趋势等
   *
   * @tags KnowledgeBase
   * @name GetKnowledgeBaseStatistics
   * @summary 获取统计信息
   * @request GET:/api/v1/knowledge-bases/stats
   * @secure
   */
  getKnowledgeBaseStatistics = (
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
    this.http.request<KnowledgeBaseStatisticsResult>({
      path: `${AI}/knowledge-bases/stats`,
      method: 'GET',
      query: query,
      secure: true,
      ...params,
    });
}

export default new KnowledgeBases(http);
