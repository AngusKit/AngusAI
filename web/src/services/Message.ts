import { AI } from '@xcan-angus/infra';
import {
  AttachmentUploadResult,
  ChatStatisticsResult,
  ClearMessagesResult,
  MessageFeedbackDto,
  MessageFindDto,
  MessageResult,
  PageMessageResult,
  VoiceToTextResult,
} from './MessageTypes.ts';
import http, { ContentType, HttpClient, QueryParamsType, RequestParams } from './HttpClient.ts';

/**
 * 消息 API 服务（对应后端 MessageRest）
 * 消息列表、清空、反馈、停止生成、附件、语音转文字、统计等
 */
export class Message<SecurityDataType = unknown> {
  http: HttpClient<SecurityDataType>;

  constructor(http: HttpClient<SecurityDataType>) {
    this.http = http;
  }

  /**
   * @description 获取消息列表，支持分页、搜索和筛选（按会话、角色、流式状态、反馈类型等）
   *
   * @tags 对话消息
   * @name GetMessageList
   * @summary 获取消息列表
   * @request GET:/api/v1/chat/messages
   * @secure
   */
  getMessageList = (
    query?: MessageFindDto,
    params: RequestParams = {}
  ) =>
    this.http.request<PageMessageResult>({
      path: `${AI}/chat/messages`,
      method: 'GET',
      query: query as unknown as QueryParamsType,
      secure: true,
      ...params,
    });

  /**
   * @description 清空指定会话的所有消息
   *
   * @tags 对话消息
   * @name ClearMessages
   * @summary 清空当前对话
   * @request DELETE:/api/v1/chat/messages?sessionId=
   * @secure
   */
  clearMessages = (sessionId: string, params: RequestParams = {}) =>
    this.http.request<ClearMessagesResult>({
      path: `${AI}/chat/messages`,
      method: 'DELETE',
      query: { sessionId },
      secure: true,
      ...params,
    });

  /**
   * @description 删除消息的反馈（清空 feedbackType、feedbackComment）
   *
   * @tags 对话消息
   * @name DeleteFeedback
   * @summary 删除反馈
   * @request DELETE:/api/v1/chat/messages/{messageId}/feedback
   * @secure
   */
  deleteFeedback = (messageId: string | number, params: RequestParams = {}) =>
    this.http.request<void>({
      path: `${AI}/chat/messages/${messageId}/feedback`,
      method: 'DELETE',
      secure: true,
      ...params,
    });

  /**
   * @description 根据消息ID删除单条消息
   *
   * @tags 对话消息
   * @name DeleteMessage
   * @summary 删除消息
   * @request DELETE:/api/v1/chat/messages/{messageId}
   * @secure
   */
  deleteMessage = (messageId: string | number, params: RequestParams = {}) =>
    this.http.request<void>({
      path: `${AI}/chat/messages/${messageId}`,
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
   * @request POST:/api/v1/chat/messages/{messageId}/feedback
   * @secure
   */
  feedbackMessage = (messageId: string, data: MessageFeedbackDto, params: RequestParams = {}) =>
    this.http.request<MessageResult>({
      path: `${AI}/chat/messages/${messageId}/feedback`,
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
   * @request POST:/api/v1/chat/messages/stop?messageId=
   * @secure
   */
  stopGeneration = (messageId: string | number, params: RequestParams = {}) =>
    this.http.request<MessageResult>({
      path: `${AI}/chat/messages/stop`,
      method: 'POST',
      query: { messageId },
      secure: true,
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
      path: `${AI}/chat/messages/voice-to-text`,
      method: 'POST',
      body: formData,
      secure: true,
      type: ContentType.FormData,
      ...params,
    });
  };

  /**
   * @description 上传消息附件
   *
   * @tags 对话消息
   * @name UploadAttachment
   * @summary 上传附件
   * @request POST:/api/v1/chat/messages/attachments
   * @secure
   */
  uploadAttachment = (
    file: File,
    messageId?: string | number,
    params: RequestParams = {}
  ) => {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.request<AttachmentUploadResult>({
      path: `${AI}/chat/messages/attachments`,
      method: 'POST',
      query: messageId != null ? { messageId } : undefined,
      body: formData,
      secure: true,
      type: ContentType.FormData,
      ...params,
    });
  };

  /**
   * @description 删除附件
   *
   * @tags 对话消息
   * @name DeleteAttachment
   * @summary 删除附件
   * @request DELETE:/api/v1/chat/messages/attachments/{id}
   * @secure
   */
  deleteAttachment = (id: string, params: RequestParams = {}) =>
    this.http.request<void>({
      path: `${AI}/chat/messages/attachments/${id}`,
      method: 'DELETE',
      secure: true,
      ...params,
    });

  /**
   * @description 获取对话模块统计数据
   *
   * @tags 对话消息
   * @name GetChatStatistics
   * @summary 获取对话统计
   * @request GET:/api/v1/chat/messages/stats
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
      path: `${AI}/chat/messages/stats`,
      method: 'GET',
      query: query,
      secure: true,
      ...params,
    });
}

export default new Message(http);
