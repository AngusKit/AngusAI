import { PageQuery, ApiLocaleResult } from '@xcan-angus/infra';
import {
  ApiLocaleResultChatStatisticsVo,
  ApiLocaleResultMessageVo,
  ApiLocaleResultPageResultMessageVo,
  ApiLocaleResultPageResultSessionListVo,
  ApiLocaleResultSessionDetailVo,
  MessageFeedbackDto,
  MessageSendDto,
  SessionBatchDeleteDto,
  SessionCreateDto,
  SessionStarDto,
  SessionSwitchAppDto,
  SessionSwitchModelDto,
  SessionUpdateDto,
  SseEmitter,
} from "./data-contracts.ts";
import { ContentType, HttpClient, RequestParams } from "./http-client.ts";

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
      /**
       * 筛选指定应用
       * @format int64
       */
      appId?: number;
      /**
       * 筛选使用的模型
       * @format int64
       */
      modelId?: number;
      /** 是否已归档 */
      isArchived?: boolean;
      /** 是否已收藏（星标） */
      isStarred?: boolean;
      /** 是否已置顶 */
      isPinned?: boolean;
    },
    params: RequestParams = {},
  ) =>
    this.http.request<ApiLocaleResultPageResultSessionListVo, ApiLocaleResult>({
      path: `/api/v1/chat/sessions`,
      method: "GET",
      query: query,
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
    this.http.request<ApiLocaleResult, ApiLocaleResult>({
      path: `/api/v1/chat/sessions`,
      method: "POST",
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
  stopGeneration = (sessionId: number, params: RequestParams = {}) =>
    this.http.request<ApiLocaleResultMessageVo, ApiLocaleResult>({
      path: `/api/v1/chat/sessions/${sessionId}/stop`,
      method: "POST",
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
    sessionId: number,
    query?: {
      /**
       * 页码
       * @format int32
       * @example 1
       */
      pageNo?: number;
      /**
       * 每页大小
       * @format int32
       * @example 20
       */
      pageSize?: number;
      /**
       * 获取指定消息之前的消息
       * @format int64
       */
      beforeId?: number;
      /**
       * 获取指定消息之后的消息
       * @format int64
       */
      afterId?: number;
    },
    params: RequestParams = {},
  ) =>
    this.http.request<ApiLocaleResultPageResultMessageVo, ApiLocaleResult>({
      path: `/api/v1/chat/sessions/${sessionId}/messages`,
      method: "GET",
      query: query,
      secure: true,
      ...params,
    });
  /**
   * @description 发送消息并获取AI响应
   *
   * @tags 对话消息
   * @name SendMessage
   * @summary 发送消息
   * @request POST:/api/v1/chat/sessions/{sessionId}/messages
   * @secure
   */
  sendMessage = (
    sessionId: number,
    data: MessageSendDto,
    params: RequestParams = {},
  ) =>
    this.http.request<ApiLocaleResult, ApiLocaleResult>({
      path: `/api/v1/chat/sessions/${sessionId}/messages`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
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
  clearMessages = (sessionId: number, params: RequestParams = {}) =>
    this.http.request<ApiLocaleResult, ApiLocaleResult>({
      path: `/api/v1/chat/sessions/${sessionId}/messages`,
      method: "DELETE",
      secure: true,
      ...params,
    });
  /**
   * @description 重新生成AI响应
   *
   * @tags 对话消息
   * @name RegenerateMessage
   * @summary 重新生成
   * @request POST:/api/v1/chat/sessions/{sessionId}/messages/{messageId}/regenerate
   * @secure
   */
  regenerateMessage = (
    sessionId: number,
    messageId: number,
    params: RequestParams = {},
  ) =>
    this.http.request<ApiLocaleResult, ApiLocaleResult>({
      path: `/api/v1/chat/sessions/${sessionId}/messages/${messageId}/regenerate`,
      method: "POST",
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
  feedbackMessage = (
    sessionId: number,
    messageId: number,
    data: MessageFeedbackDto,
    params: RequestParams = {},
  ) =>
    this.http.request<ApiLocaleResultMessageVo, ApiLocaleResult>({
      path: `/api/v1/chat/sessions/${sessionId}/messages/${messageId}/feedback`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description 发送消息并获取流式AI响应（Server-Sent Events）
   *
   * @tags 对话消息
   * @name SendMessageStream
   * @summary 发送消息（流式）
   * @request POST:/api/v1/chat/sessions/{sessionId}/messages/stream
   * @secure
   */
  sendMessageStream = (
    sessionId: number,
    data: MessageSendDto,
    params: RequestParams = {},
  ) =>
    this.http.request<SseEmitter, ApiLocaleResult>({
      path: `/api/v1/chat/sessions/${sessionId}/messages/stream`,
      method: "POST",
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
    data: {
      /**
       * 音频文件
       * @format binary
       */
      audio: File;
    },
    query?: {
      /** 语言代码 */
      language?: string;
    },
    params: RequestParams = {},
  ) =>
    this.http.request<ApiLocaleResult, ApiLocaleResult>({
      path: `/api/v1/chat/sessions/voice-to-text`,
      method: "POST",
      query: query,
      body: data,
      secure: true,
      type: ContentType.FormData,
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
  batchDeleteSessions = (
    data: SessionBatchDeleteDto,
    params: RequestParams = {},
  ) =>
    this.http.request<ApiLocaleResult, ApiLocaleResult>({
      path: `/api/v1/chat/sessions/batch-delete`,
      method: "POST",
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
    data: {
      /**
       * 文件
       * @format binary
       */
      file: File;
    },
    query?: {
      /**
       * 关联会话ID
       * @format int64
       */
      sessionId?: number;
    },
    params: RequestParams = {},
  ) =>
    this.http.request<ApiLocaleResult, ApiLocaleResult>({
      path: `/api/v1/chat/sessions/attachments`,
      method: "POST",
      query: query,
      body: data,
      secure: true,
      type: ContentType.FormData,
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
  switchModel = (
    sessionId: number,
    data: SessionSwitchModelDto,
    params: RequestParams = {},
  ) =>
    this.http.request<ApiLocaleResultSessionDetailVo, ApiLocaleResult>({
      path: `/api/v1/chat/sessions/${sessionId}/switch-model`,
      method: "PATCH",
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
  switchApp = (
    sessionId: number,
    data: SessionSwitchAppDto,
    params: RequestParams = {},
  ) =>
    this.http.request<ApiLocaleResultSessionDetailVo, ApiLocaleResult>({
      path: `/api/v1/chat/sessions/${sessionId}/switch-app`,
      method: "PATCH",
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
  starSession = (
    sessionId: number,
    data: SessionStarDto,
    params: RequestParams = {},
  ) =>
    this.http.request<ApiLocaleResultSessionDetailVo, ApiLocaleResult>({
      path: `/api/v1/chat/sessions/${sessionId}/star`,
      method: "PATCH",
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
  getSessionDetail = (id: number, params: RequestParams = {}) =>
    this.http.request<ApiLocaleResultSessionDetailVo, ApiLocaleResult>({
      path: `/api/v1/chat/sessions/${id}`,
      method: "GET",
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
  deleteSession = (id: number, params: RequestParams = {}) =>
    this.http.request<ApiLocaleResult, ApiLocaleResult>({
      path: `/api/v1/chat/sessions/${id}`,
      method: "DELETE",
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
  updateSession = (
    id: number,
    data: SessionUpdateDto,
    params: RequestParams = {},
  ) =>
    this.http.request<ApiLocaleResultSessionDetailVo, ApiLocaleResult>({
      path: `/api/v1/chat/sessions/${id}`,
      method: "PATCH",
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
    sessionId: number,
    query?: {
      /**
       * 导出格式
       * @default "json"
       */
      format?: string;
    },
    params: RequestParams = {},
  ) =>
    this.http.request<void, ApiLocaleResult>({
      path: `/api/v1/chat/sessions/${sessionId}/export`,
      method: "GET",
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
   * @request GET:/api/v1/chat/sessions/statistics
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
    params: RequestParams = {},
  ) =>
    this.http.request<ApiLocaleResultChatStatisticsVo, ApiLocaleResult>({
      path: `/api/v1/chat/sessions/statistics`,
      method: "GET",
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
  deleteAttachment = (id: number, params: RequestParams = {}) =>
    this.http.request<ApiLocaleResult, ApiLocaleResult>({
      path: `/api/v1/chat/sessions/attachments/${id}`,
      method: "DELETE",
      secure: true,
      ...params,
    });
}
