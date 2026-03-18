import { PageQuery, AI } from '@xcan-angus/infra';
import {
  BatchDeleteSessionsResult,
  PageSessionListResult,
  SessionBatchDeleteDto,
  SessionCreateDto,
  SessionDetailResult,
  SessionFindDto,
  SessionStarDto,
  SessionSwitchAgentDto,
  SessionSwitchAppDto,
  SessionSwitchModelDto,
  SessionUpdateDto,
} from './SessionTypes.ts';
import http, { ContentType, HttpClient, QueryParamsType, RequestParams } from './HttpClient.ts';

/**
 * 会话 API 服务（对应后端 SessionRest）
 * 会话列表、创建、更新、删除、切换应用/智能体/模型、收藏等
 */
export class Session<SecurityDataType = unknown> {
  http: HttpClient<SecurityDataType>;

  constructor(http: HttpClient<SecurityDataType>) {
    this.http = http;
  }

  /**
   * @description 获取用户的对话会话列表，支持分页、搜索和筛选
   *
   * @tags 对话会话
   * @name GetSessionList
   * @summary 获取会话列表
   * @request GET:/api/v1/chat/sessions
   * @secure
   */
  getSessionList = (
    query?: SessionFindDto | (PageQuery & { title?: string; appId?: string; agentId?: string; isArchived?: boolean; isStarred?: boolean; isPinned?: boolean }),
    params: RequestParams = {}
  ) =>
    this.http.request<PageSessionListResult>({
      path: `${AI}/chat/sessions`,
      method: 'GET',
      query: query as unknown as QueryParamsType,
      secure: true,
      ...params,
    });

  /**
   * @description 创建新的对话会话
   *
   * @tags 对话会话
   * @name CreateSession
   * @summary 创建会话
   * @request POST:/api/v1/chat/sessions
   * @secure
   */
  createSession = (data: SessionCreateDto, params: RequestParams = {}) =>
    this.http.request<SessionDetailResult>({
      path: `${AI}/chat/sessions`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });

  /**
   * @description 批量删除会话
   *
   * @tags 对话会话
   * @name BatchDeleteSessions
   * @summary 批量删除会话
   * @request POST:/api/v1/chat/sessions/batch-delete
   * @secure
   */
  batchDeleteSessions = (data: SessionBatchDeleteDto, params: RequestParams = {}) =>
    this.http.request<BatchDeleteSessionsResult>({
      path: `${AI}/chat/sessions/batch-delete`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });

  /**
   * @description 切换会话使用的AI模型
   *
   * @tags 对话会话
   * @name SwitchModel
   * @summary 切换模型
   * @request PATCH:/api/v1/chat/sessions/{sessionId}/switch-model
   * @secure
   */
  switchModel = (sessionId: string, data: SessionSwitchModelDto, params: RequestParams = {}) =>
    this.http.request<SessionDetailResult>({
      path: `${AI}/chat/sessions/${sessionId}/switch-model`,
      method: 'PATCH',
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });

  /**
   * @description 切换会话使用的智能体（需验证智能体已绑定到当前应用）
   *
   * @tags 对话会话
   * @name SwitchAgent
   * @summary 切换智能体
   * @request PATCH:/api/v1/chat/sessions/{sessionId}/switch-agent
   * @secure
   */
  switchAgent = (sessionId: string, data: SessionSwitchAgentDto, params: RequestParams = {}) =>
    this.http.request<SessionDetailResult>({
      path: `${AI}/chat/sessions/${sessionId}/switch-agent`,
      method: 'PATCH',
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });

  /**
   * @description 切换会话使用的应用
   *
   * @tags 对话会话
   * @name SwitchApp
   * @summary 切换应用
   * @request PATCH:/api/v1/chat/sessions/{sessionId}/switch-app
   * @secure
   */
  switchApp = (sessionId: string, data: SessionSwitchAppDto, params: RequestParams = {}) =>
    this.http.request<SessionDetailResult>({
      path: `${AI}/chat/sessions/${sessionId}/switch-app`,
      method: 'PATCH',
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });

  /**
   * @description 收藏或取消收藏会话（前端显示为星标）
   *
   * @tags 对话会话
   * @name StarSession
   * @summary 收藏/取消收藏会话
   * @request PATCH:/api/v1/chat/sessions/{sessionId}/star
   * @secure
   */
  starSession = (sessionId: string, data: SessionStarDto, params: RequestParams = {}) =>
    this.http.request<SessionDetailResult>({
      path: `${AI}/chat/sessions/${sessionId}/star`,
      method: 'PATCH',
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });

  /**
   * @description 获取指定会话的详细信息
   *
   * @tags 对话会话
   * @name GetSessionDetail
   * @summary 获取会话详情
   * @request GET:/api/v1/chat/sessions/{id}
   * @secure
   */
  getSessionDetail = (id: string, params: RequestParams = {}) =>
    this.http.request<SessionDetailResult>({
      path: `${AI}/chat/sessions/${id}`,
      method: 'GET',
      secure: true,
      ...params,
    });

  /**
   * @description 删除指定会话
   *
   * @tags 对话会话
   * @name DeleteSession
   * @summary 删除会话
   * @request DELETE:/api/v1/chat/sessions/{id}
   * @secure
   */
  deleteSession = (id: string, params: RequestParams = {}) =>
    this.http.request<void>({
      path: `${AI}/chat/sessions/${id}`,
      method: 'DELETE',
      secure: true,
      ...params,
    });

  /**
   * @description 更新会话基本信息
   *
   * @tags 对话会话
   * @name UpdateSession
   * @summary 更新会话
   * @request PATCH:/api/v1/chat/sessions/{id}
   * @secure
   */
  updateSession = (id: string, data: SessionUpdateDto, params: RequestParams = {}) =>
    this.http.request<SessionDetailResult>({
      path: `${AI}/chat/sessions/${id}`,
      method: 'PATCH',
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });

  /**
   * @description 导出会话内容
   *
   * @tags 对话会话
   * @name ExportSession
   * @summary 导出会话
   * @request GET:/api/v1/chat/sessions/{sessionId}/export
   * @secure
   */
  exportSession = (
    sessionId: string,
    query?: {
      /**
       * 导出格式
       * @default "json"
       */
      format?: string;
    },
    params: RequestParams = {}
  ) =>
    this.http.request<void>({
      path: `${AI}/chat/sessions/${sessionId}/export`,
      method: 'GET',
      query: query,
      secure: true,
      ...params,
    });
}

export default new Session(http);
