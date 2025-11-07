import { ApiLocaleResult, AI } from '@xcan-angus/infra';
import { ListPromptCategoryResult, PromptCategoryCreateDto, PromptCategoryResult, PromptCategoryUpdateDto, } from './PromptsTypes.ts';
import http, { ContentType, HttpClient, RequestParams } from './HttpClient.ts';

export class PromptCategories<SecurityDataType = unknown> {
  http: HttpClient<SecurityDataType>;

  constructor(http: HttpClient<SecurityDataType>) {
    this.http = http;
  }

  /**
   * @description 创建新的提示词分类
   *
   * @tags Prompt Category
   * @name CreatePromptCategory
   * @summary 创建分类
   * @request POST:/api/v1/prompt-categories
   * @secure
   */
  createPromptCategory = (data: PromptCategoryCreateDto, params: RequestParams = {}) =>
    this.http.request<ApiLocaleResult, ApiLocaleResult>({
      path: `${AI}/prompt-categories`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description 获取指定分类的详细信息
   *
   * @tags Prompt Category
   * @name GetPromptCategoryDetail
   * @summary 获取分类详情
   * @request GET:/api/v1/prompt-categories/{id}
   * @secure
   */
  getPromptCategoryDetail = (id: number, params: RequestParams = {}) =>
    this.http.request<PromptCategoryResult, ApiLocaleResult>({
      path: `${AI}/prompt-categories/${id}`,
      method: 'GET',
      secure: true,
      ...params,
    });
  /**
   * @description 删除指定提示词分类
   *
   * @tags Prompt Category
   * @name DeletePromptCategory
   * @summary 删除分类
   * @request DELETE:/api/v1/prompt-categories/{id}
   * @secure
   */
  deletePromptCategory = (id: number, params: RequestParams = {}) =>
    this.http.request<ApiLocaleResult, ApiLocaleResult>({
      path: `${AI}/prompt-categories/${id}`,
      method: 'DELETE',
      secure: true,
      ...params,
    });
  /**
   * @description 更新提示词分类信息
   *
   * @tags Prompt Category
   * @name UpdatePromptCategory
   * @summary 更新分类
   * @request PATCH:/api/v1/prompt-categories/{id}
   * @secure
   */
  updatePromptCategory = (id: number, data: PromptCategoryUpdateDto, params: RequestParams = {}) =>
    this.http.request<PromptCategoryResult, ApiLocaleResult>({
      path: `${AI}/prompt-categories/${id}`,
      method: 'PATCH',
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description 调整分类在同级中的显示顺序
   *
   * @tags Prompt Category
   * @name UpdatePromptCategoryOrder
   * @summary 调整分类顺序
   * @request PATCH:/api/v1/prompt-categories/{id}/order
   * @secure
   */
  updatePromptCategoryOrder = (
    id: number,
    query: {
      /**
       * 新位置（从0开始）
       * @format int32
       */
      position: number;
    },
    params: RequestParams = {}
  ) =>
    this.http.request<PromptCategoryResult, ApiLocaleResult>({
      path: `${AI}/prompt-categories/${id}/order`,
      method: 'PATCH',
      query: query,
      secure: true,
      ...params,
    });
  /**
   * @description 获取完整的分类树结构
   *
   * @tags Prompt Category
   * @name GetPromptCategoryTree
   * @summary 获取分类树
   * @request GET:/api/v1/prompt-categories/tree
   * @secure
   */
  getPromptCategoryTree = (params: RequestParams = {}) =>
    this.http.request<ListPromptCategoryResult, ApiLocaleResult>({
      path: `${AI}/prompt-categories/tree`,
      method: 'GET',
      secure: true,
      ...params,
    });
  /**
   * @description 批量删除多个提示词分类
   *
   * @tags Prompt Category
   * @name BatchDeletePromptCategories
   * @summary 批量删除分类
   * @request DELETE:/api/v1/prompt-categories/batch
   * @secure
   */
  batchDeletePromptCategories = (
    query: {
      /** 分类ID数组 */
      ids: number[];
    },
    params: RequestParams = {}
  ) =>
    this.http.request<ApiLocaleResult, ApiLocaleResult>({
      path: `${AI}/prompt-categories/batch`,
      method: 'DELETE',
      query: query,
      secure: true,
      ...params,
    });
}

export default new PromptCategories(http);
