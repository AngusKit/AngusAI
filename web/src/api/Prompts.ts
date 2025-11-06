import { ApiLocaleResult, PageQuery } from '@xcan-angus/infra';
import { GetPromptListParamsOrderByEnum, PagePromptListResult, PromptCreateDto, PromptDetailResult, PromptUpdateDto, } from './PromptsTypes.ts';
import http, { ContentType, HttpClient, RequestParams } from './HttpClient.ts';

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
    query?: PageQuery & {
      /** 提示词标题 */
      title?: string;
      /**
       * 分类ID
       * @format int64
       */
      categoryId?: number;
      /** 是否收藏 */
      isFavorite?: boolean;
      /** 排序字段 */
      orderBy?: GetPromptListParamsOrderByEnum;
    },
    params: RequestParams = {}
  ) =>
    this.http.request<PagePromptListResult, ApiLocaleResult>({
      path: `/api/v1/prompts`,
      method: 'GET',
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
    this.http.request<ApiLocaleResult, ApiLocaleResult>({
      path: `/api/v1/prompts`,
      method: 'POST',
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
    this.http.request<PromptDetailResult, ApiLocaleResult>({
      path: `/api/v1/prompts/${id}/use`,
      method: 'POST',
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
    params: RequestParams = {}
  ) =>
    this.http.request<PromptDetailResult, ApiLocaleResult>({
      path: `/api/v1/prompts/${id}/favorite`,
      method: 'POST',
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
    params: RequestParams = {}
  ) =>
    this.http.request<ApiLocaleResult, ApiLocaleResult>({
      path: `/api/v1/prompts/${id}/duplicate`,
      method: 'POST',
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
    this.http.request<PromptDetailResult, ApiLocaleResult>({
      path: `/api/v1/prompts/${id}`,
      method: 'GET',
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
    this.http.request<ApiLocaleResult, ApiLocaleResult>({
      path: `/api/v1/prompts/${id}`,
      method: 'DELETE',
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
  updatePrompt = (id: number, data: PromptUpdateDto, params: RequestParams = {}) =>
    this.http.request<PromptDetailResult, ApiLocaleResult>({
      path: `/api/v1/prompts/${id}`,
      method: 'PATCH',
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
}

export default new Prompts(http);
