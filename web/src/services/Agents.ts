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

  /**
   * @description 分页查询智能体列表，支持关键词、状态、交互模式筛选
   *
   * @tags Agent
   * @name ListAgents
   * @summary 智能体列表
   * @request GET:/api/v1/agents
   * @secure
   */
  getAgentList = (
    query?: PageQuery & {
      /** 关键词（匹配名称、描述） */
      keyword?: string;
      /** 状态筛选 */
      status?: AgentStatusEnum;
      /** 交互模式筛选 */
      interactionMode?: string;
      /** 是否只返回可绑定的智能体 */
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

  /**
   * @description 根据ID获取智能体详情
   *
   * @tags Agent
   * @name GetAgentDetail
   * @summary 获取智能体详情
   * @request GET:/api/v1/agents/{id}
   * @secure
   */
  getAgentDetail = (id: string, params: RequestParams = {}) =>
    this.http.request<AgentDetailResult>({
      path: `${AI}/agents/${id}`,
      method: 'GET',
      secure: true,
      ...params,
    });

  /**
   * @description 创建智能体
   *
   * @tags Agent
   * @name CreateAgent
   * @summary 创建智能体
   * @request POST:/api/v1/agents
   * @secure
   */
  createAgent = (data: AgentCreateDto, params: RequestParams = {}) =>
    this.http.request<AgentDetailResult>({
      path: `${AI}/agents`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });

  /**
   * @description 全量更新智能体
   *
   * @tags Agent
   * @name UpdateAgent
   * @summary 更新智能体
   * @request PUT:/api/v1/agents/{id}
   * @secure
   */
  updateAgent = (id: string, data: AgentUpdateDto, params: RequestParams = {}) =>
    this.http.request<AgentDetailResult>({
      path: `${AI}/agents/${id}`,
      method: 'PUT',
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });

  /**
   * @description 删除智能体
   *
   * @tags Agent
   * @name DeleteAgent
   * @summary 删除智能体
   * @request DELETE:/api/v1/agents/{id}
   * @secure
   */
  deleteAgent = (id: string, params: RequestParams = {}) =>
    this.http.request<ApiLocaleResult>({
      path: `${AI}/agents/${id}`,
      method: 'DELETE',
      secure: true,
      ...params,
    });

  /**
   * @description 发布或下线智能体
   *
   * @tags Agent
   * @name UpdateAgentStatus
   * @summary 发布/下线智能体
   * @request PUT:/api/v1/agents/{id}/status
   * @secure
   */
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
