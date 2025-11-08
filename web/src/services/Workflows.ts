import { ApiLocaleResult, PageQuery, AI } from '@xcan-angus/infra';
import { ExecutionDetailResult, ExecutionLogResult, GetWorkflowListOrderByEnum, WorkflowConfigUpdateDto, WorkflowCreateDto, WorkflowDetailResult, WorkflowExecuteDto, WorkflowListResult, WorkflowStatisticsResult, WorkflowUpdateDto, } from './WorkflowsTypes.ts';
import http, { ContentType, HttpClient, RequestParams } from './HttpClient.ts';
import { VisibilityEnum, WorkflowStatusEnum, WorkflowTypeEnum } from '@/enums/enums.ts';

export class Workflows<SecurityDataType = unknown> {
  http: HttpClient<SecurityDataType>;

  constructor(http: HttpClient<SecurityDataType>) {
    this.http = http;
  }

  /**
   * @description 修改工作流可见性
   *
   * @tags Workflow
   * @name ModifyWorkflowVisibility
   * @summary 修改工作流可见性
   * @request PUT:/api/v1/workflows/{id}/visibility
   * @secure
   */
  modifyWorkflowVisibility = (
    id: string,
    query: {
      /** 可见性 */
      visibility: VisibilityEnum;
    },
    params: RequestParams = {}
  ) =>
    this.http.request<WorkflowDetailResult, ApiLocaleResult>({
      path: `${AI}/workflows/${id}/visibility`,
      method: 'PUT',
      query: query,
      secure: true,
      ...params,
    });
  /**
   * @description 更新工作流的节点和配置
   *
   * @tags Workflow
   * @name UpdateWorkflowConfig
   * @summary 更新工作流配置
   * @request PUT:/api/v1/workflows/{id}/config
   * @secure
   */
  updateWorkflowConfig = (id: string, data: WorkflowConfigUpdateDto, params: RequestParams = {}) =>
    this.http.request<WorkflowDetailResult, ApiLocaleResult>({
      path: `${AI}/workflows/${id}/config`,
      method: 'PUT',
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description 获取当前用户的工作流列表，支持分页、搜索和筛选
   *
   * @tags Workflow
   * @name GetWorkflowList
   * @summary 获取工作流列表
   * @request GET:/api/v1/workflows
   * @secure
   */
  getWorkflowList = (
    query?: PageQuery & {
      /**
       * 工作流名称
       * @example "用户注册流程"
       */
      name?: string;
      /**
       * 背景色
       * @example "bg-blue-500"
       */
      iconBg?: string;
      /** 工作流类型 */
      type?: WorkflowTypeEnum;
      /** 工作流状态 */
      status?: WorkflowStatusEnum;
      /** 排序字段 */
      orderBy?: GetWorkflowListOrderByEnum;
    },
    params: RequestParams = {}
  ) =>
    this.http.request<WorkflowListResult, ApiLocaleResult>({
      path: `${AI}/workflows`,
      method: 'GET',
      query: query,
      secure: true,
      ...params,
    });
  /**
   * @description 创建新工作流
   *
   * @tags Workflow
   * @name CreateWorkflow
   * @summary 创建工作流
   * @request POST:/api/v1/workflows
   * @secure
   */
  createWorkflow = (data: WorkflowCreateDto, params: RequestParams = {}) =>
    this.http.request<ApiLocaleResult, ApiLocaleResult>({
      path: `${AI}/workflows`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description 停止工作流运行
   *
   * @tags Workflow
   * @name StopWorkflow
   * @summary 停止工作流运行
   * @request POST:/api/v1/workflows/{id}/stop
   * @secure
   */
  stopWorkflow = (id: string, params: RequestParams = {}) =>
    this.http.request<WorkflowDetailResult, ApiLocaleResult>({
      path: `${AI}/workflows/${id}/stop`,
      method: 'POST',
      secure: true,
      ...params,
    });
  /**
   * @description 运行工作流
   *
   * @tags Workflow
   * @name StartWorkflow
   * @summary 运行工作流
   * @request POST:/api/v1/workflows/{id}/start
   * @secure
   */
  startWorkflow = (id: string, params: RequestParams = {}) =>
    this.http.request<WorkflowDetailResult, ApiLocaleResult>({
      path: `${AI}/workflows/${id}/start`,
      method: 'POST',
      secure: true,
      ...params,
    });
  /**
   * @description 手动执行或调试工作流
   *
   * @tags Workflow
   * @name ExecuteWorkflow
   * @summary 执行工作流
   * @request POST:/api/v1/workflows/{id}/execute
   * @secure
   */
  executeWorkflow = (id: string, data: WorkflowExecuteDto, params: RequestParams = {}) =>
    this.http.request<ApiLocaleResult, ApiLocaleResult>({
      path: `${AI}/workflows/${id}/execute`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description 获取指定工作流的详细信息
   *
   * @tags Workflow
   * @name GetWorkflowDetail
   * @summary 获取工作流详情
   * @request GET:/api/v1/workflows/{id}
   * @secure
   */
  getWorkflowDetail = (id: string, params: RequestParams = {}) =>
    this.http.request<WorkflowDetailResult, ApiLocaleResult>({
      path: `${AI}/workflows/${id}`,
      method: 'GET',
      secure: true,
      ...params,
    });
  /**
   * @description 删除指定工作流
   *
   * @tags Workflow
   * @name DeleteWorkflow
   * @summary 删除工作流
   * @request DELETE:/api/v1/workflows/{id}
   * @secure
   */
  deleteWorkflow = (id: string, params: RequestParams = {}) =>
    this.http.request<ApiLocaleResult, ApiLocaleResult>({
      path: `${AI}/workflows/${id}`,
      method: 'DELETE',
      secure: true,
      ...params,
    });
  /**
   * @description 更新工作流基本信息
   *
   * @tags Workflow
   * @name UpdateWorkflow
   * @summary 更新工作流
   * @request PATCH:/api/v1/workflows/{id}
   * @secure
   */
  updateWorkflow = (id: string, data: WorkflowUpdateDto, params: RequestParams = {}) =>
    this.http.request<WorkflowDetailResult, ApiLocaleResult>({
      path: `${AI}/workflows/${id}`,
      method: 'PATCH',
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description 获取工作流模块的总体统计数据
   *
   * @tags Workflow
   * @name GetWorkflowStatistics
   * @summary 获取工作流统计
   * @request GET:/api/v1/workflows/statistics
   * @secure
   */
  getWorkflowStatistics = (
    query?: {
      /** 统计周期 */
      period?: string;
    },
    params: RequestParams = {}
  ) =>
    this.http.request<WorkflowStatisticsResult, ApiLocaleResult>({
      path: `${AI}/workflows/statistics`,
      method: 'GET',
      query: query,
      secure: true,
      ...params,
    });
  /**
   * @description 获取特定执行的详细信息
   *
   * @tags Workflow
   * @name GetExecutionDetail
   * @summary 获取执行详情
   * @request GET:/api/v1/workflows/executions/{executionId}
   * @secure
   */
  getExecutionDetail = (executionId: string, params: RequestParams = {}) =>
    this.http.request<ExecutionDetailResult, ApiLocaleResult>({
      path: `${AI}/workflows/executions/${executionId}`,
      method: 'GET',
      secure: true,
      ...params,
    });
  /**
   * @description 获取工作流执行日志
   *
   * @tags Workflow
   * @name GetExecutionLogs
   * @summary 获取执行日志
   * @request GET:/api/v1/workflows/execution-logs
   * @secure
   */
  getExecutionLogs = (
    query?: PageQuery & {
      /**
       * 工作流ID
       * @format int64
       */
      workflowId?: string;
      /** 工作流名称 */
      workflowName?: string;
      /** 状态筛选 */
      status?: string;
    },
    params: RequestParams = {}
  ) =>
    this.http.request<ExecutionLogResult, ApiLocaleResult>({
      path: `${AI}/workflows/execution-logs`,
      method: 'GET',
      query: query,
      secure: true,
      ...params,
    });
}

export default new Workflows(http);
