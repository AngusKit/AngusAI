import { AI } from '@xcan-angus/infra';
import type { AgentChatRequestDto, AgentChatResult } from './AgentChatTypes.ts';
import http, { ContentType, HttpClient, RequestParams } from './HttpClient.ts';

export class AgentChat<SecurityDataType = unknown> {
  http: HttpClient<SecurityDataType>;

  constructor(http: HttpClient<SecurityDataType>) {
    this.http = http;
  }

  /**
   * @description 与指定智能体进行同步对话
   *
   * @tags AgentChat
   * @name AgentChat
   * @summary 同步对话
   * @request POST:/api/v1/agents/chat
   * @secure
   */
  chat = (data: AgentChatRequestDto, params: RequestParams = {}) =>
    this.http.request<AgentChatResult>({
      path: `${AI}/agents/chat`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });

  /**
   * @description 与指定智能体进行流式对话，返回 SSE 事件流
   *
   * @tags AgentChat
   * @name AgentChatStream
   * @summary 流式对话
   * @request POST:/api/v1/agents/chat/stream
   * @secure
   */
  chatStream = (data: AgentChatRequestDto, params: RequestParams & { format?: 'stream' } = {}) =>
    this.http.request<unknown>({
      path: `${AI}/agents/chat/stream`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'stream',
      ...params,
    });
}

export default new AgentChat(http);
