import { PageQuery, AI } from '@xcan-angus/infra';
import {
  AttachmentUploadResult,
  BatchDeleteSessionsResult,
  ChatStatisticsResult,
  ClearMessagesResult,
  MessageFeedbackDto,
  MessageResult,
  PageMessageResult,
  PageSessionListResult,
  SessionBatchDeleteDto,
  SessionCreateDto,
  SessionDetailResult,
  SessionStarDto,
  SessionSwitchAppDto,
  SessionSwitchModelDto,
  SessionUpdateDto,
  VoiceToTextResult,
} from './ChatTypes.ts';
import http, { ContentType, HttpClient, QueryParamsType, RequestParams } from './HttpClient.ts';

export class Chat<SecurityDataType = unknown> {
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
    query?: PageQuery & {
      /** 会话标题（搜索） */
      title?: string;
      /**
       * 筛选指定应用
       * @format int64
       */
      appId?: number;
      /**
       * 筛选使用的智能体
       * @format int64
       */
      agentId?: number;
      /** 是否已归档 */
      isArchived?: boolean;
      /** 是否已收藏（星标） */
      isStarred?: boolean;
      /** 是否已置顶 */
      isPinned?: boolean;
    },
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
   * @description 停止当前正在生成的消息
   *
   * @tags 对话消息
   * @name StopGeneration
   * @summary 停止生成
   * @request POST:/api/v1/chat/sessions/{sessionId}/stop
   * @secure
   */
  stopGeneration = (sessionId: string, params: RequestParams = {}) =>
    this.http.request<MessageResult>({
      path: `${AI}/chat/sessions/${sessionId}/stop`,
      method: 'POST',
      secure: true,
      ...params,
    });
  /**
   * @description 获取会话的消息历史
   *
   * @tags 对话消息
   * @name GetMessageHistory
   * @summary 获取消息历史
   * @request GET:/api/v1/chat/sessions/{sessionId}/messages
   * @secure
   */
  getMessageHistory = (
    sessionId: string,
    query?: {
      /** 页码，默认 1 */
      pageNo?: number;
      /** 每页大小，默认 20 */
      pageSize?: number;
      /** 获取指定消息之前的消息 */
      beforeId?: string;
      /** 获取指定消息之后的消息 */
      afterId?: string;
    },
    params: RequestParams = {}
  ) =>
    this.http.request<PageMessageResult>({
      path: `${AI}/chat/sessions/${sessionId}/messages`,
      method: 'GET',
      query: query,
      secure: true,
      ...params,
    });
  /**
   * @description 清空指定会话的所有消息
   *
   * @tags 对话消息
   * @name ClearMessages
   * @summary 清空当前对话
   * @request DELETE:/api/v1/chat/sessions/{sessionId}/messages
   * @secure
   */
  clearMessages = (sessionId: string, params: RequestParams = {}) =>
    this.http.request<ClearMessagesResult>({
      path: `${AI}/chat/sessions/${sessionId}/messages`,
      method: 'DELETE',
      secure: true,
      ...params,
    });
  /**
   * @description 对AI消息进行反馈（点赞/点踩）
   *
   * @tags 对话消息
   * @name FeedbackMessage
   * @summary 消息反馈
   * @request POST:/api/v1/chat/sessions/{sessionId}/messages/{messageId}/feedback
   * @secure
   */
  feedbackMessage = (sessionId: string, messageId: string, data: MessageFeedbackDto, params: RequestParams = {}) =>
    this.http.request<MessageResult>({
      path: `${AI}/chat/sessions/${sessionId}/messages/${messageId}/feedback`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description 语音转文字
   *
   * @tags 对话消息
   * @name VoiceToText
   * @summary 语音输入
   * @request POST:/api/v1/chat/sessions/voice-to-text
   * @secure
   */
  voiceToText = (
    data: FormData | { audio: File; language?: string },
    params: RequestParams = {}
  ) => {
    const formData = data instanceof FormData
      ? data
      : (() => {
          const fd = new FormData();
          fd.append('audio', data.audio);
          if (data.language) fd.append('language', data.language);
          return fd;
        })();
    return this.http.request<VoiceToTextResult>({
      path: `${AI}/chat/sessions/voice-to-text`,
      method: 'POST',
      body: formData,
      secure: true,
      type: ContentType.FormData,
      ...params,
    });
  };
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
   * @description 上传消息附件
   *
   * @tags 对话消息
   * @name UploadAttachment
   * @summary 上传附件
   * @request POST:/api/v1/chat/sessions/attachments
   * @secure
   */
  uploadAttachment = (
    file: File,
    sessionId?: string,
    params: RequestParams = {}
  ) => {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.request<AttachmentUploadResult>({
      path: `${AI}/chat/sessions/attachments`,
      method: 'POST',
      query: sessionId ? { sessionId } : undefined,
      body: formData,
      secure: true,
      type: ContentType.FormData,
      ...params,
    });
  };
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
  /**
   * @description 获取对话模块统计数据
   *
   * @tags 对话消息
   * @name GetChatStatistics
   * @summary 获取对话统计
   * @request GET:/api/v1/chat/sessions/stats
   * @secure
   */
  getChatStatistics = (
    query?: {
      /**
       * 统计周期
       * @default "month"
       */
      period?: string;
    },
    params: RequestParams = {}
  ) =>
    this.http.request<ChatStatisticsResult>({
      path: `${AI}/chat/sessions/stats`,
      method: 'GET',
      query: query,
      secure: true,
      ...params,
    });
  /**
   * @description 删除附件
   *
   * @tags 对话消息
   * @name DeleteAttachment
   * @summary 删除附件
   * @request DELETE:/api/v1/chat/sessions/attachments/{id}
   * @secure
   */
  deleteAttachment = (id: string, params: RequestParams = {}) =>
    this.http.request<void>({
      path: `${AI}/chat/sessions/attachments/${id}`,
      method: 'DELETE',
      secure: true,
      ...params,
    });
}

export default new Chat(http);
