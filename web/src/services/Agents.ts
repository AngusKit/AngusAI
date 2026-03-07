import { ApiLocaleResult, AI, PageQuery } from '@xcan-angus/infra';
import {
  AgentCreateDto,
  AgentDetailResult,
  AgentListResult,
  AgentUpdateDto,
} from './AgentsTypes.ts';
import http, { ContentType, HttpClient, QueryParamsType, RequestParams } from './HttpClient.ts';
import type { AgentStatusEnum } from './AgentsTypes.ts';

export class Agents<SecurityDataType = unknown> {
  http: HttpClient<SecurityDataType>;

  constructor(http: HttpClient<SecurityDataType>) {
    this.http = http;
  }

  getAgentList = (
    query?: PageQuery & {
      keyword?: string;
      status?: AgentStatusEnum;
      interactionMode?: string;
      bindable?: boolean;
    },
    params: RequestParams = {}
  ) =>
    this.http.request<AgentListResult>({
      path: `${AI}/agents`,
      method: 'GET',
      query: query as unknown as QueryParamsType,
      secure: true,
      ...params,
    });

  getAgentDetail = (id: string, params: RequestParams = {}) =>
    this.http.request<AgentDetailResult>({
      path: `${AI}/agents/${id}`,
      method: 'GET',
      secure: true,
      ...params,
    });

  createAgent = (data: AgentCreateDto, params: RequestParams = {}) =>
    this.http.request<AgentDetailResult>({
      path: `${AI}/agents`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });

  updateAgent = (id: string, data: AgentUpdateDto, params: RequestParams = {}) =>
    this.http.request<AgentDetailResult>({
      path: `${AI}/agents/${id}`,
      method: 'PATCH',
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });

  deleteAgent = (id: string, force?: boolean, params: RequestParams = {}) =>
    this.http.request<ApiLocaleResult>({
      path: `${AI}/agents/${id}`,
      method: 'DELETE',
      query: force ? { force: 'true' } : undefined,
      secure: true,
      ...params,
    });

  updateAgentStatus = (id: string, status: AgentStatusEnum, params: RequestParams = {}) =>
    this.http.request<AgentDetailResult>({
      path: `${AI}/agents/${id}/status`,
      method: 'PUT',
      query: { status },
      secure: true,
      ...params,
    });
}

export default new Agents(http);
