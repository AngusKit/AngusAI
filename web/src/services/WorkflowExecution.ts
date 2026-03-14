import { ApiLocaleResult, PageQuery, AI } from '@xcan-angus/infra';
import {
  ExecutionDetailResult,
  ExecutionLogResult,
  WorkflowExecuteDto,
  WorkflowExecuteResultResult,
} from './WorkflowExecutionTypes.ts';
import http, { ContentType, HttpClient, QueryParamsType, RequestParams } from './HttpClient.ts';

export class WorkflowExecution<SecurityDataType = unknown> {
  http: HttpClient<SecurityDataType>;

  constructor(http: HttpClient<SecurityDataType>) {
    this.http = http;
  }

  /**
   * @description 手动执行或调试工作流
   *
   * @tags WorkflowExecution
   * @name ExecuteWorkflow
   * @summary 执行工作流
   * @request POST:/api/v1/workflows/{id}/execute
   * @secure
   */
  executeWorkflow = (id: string, data: WorkflowExecuteDto, params: RequestParams = {}) =>
    this.http.request<WorkflowExecuteResultResult>({
      path: `${AI}/workflows/${id}/execute`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });

  /**
   * @description 获取工作流执行日志
   *
   * @tags WorkflowExecution
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
    this.http.request<ExecutionLogResult>({
      path: `${AI}/workflows/execution-logs`,
      method: 'GET',
      query: query as unknown as QueryParamsType,
      secure: true,
      ...params,
    });

  /**
   * @description 获取特定执行的详细信息
   *
   * @tags WorkflowExecution
   * @name GetExecutionDetail
   * @summary 获取执行详情
   * @request GET:/api/v1/workflows/executions/{executionId}
   * @secure
   */
  getExecutionDetail = (executionId: string, params: RequestParams = {}) =>
    this.http.request<ExecutionDetailResult>({
      path: `${AI}/workflows/executions/${executionId}`,
      method: 'GET',
      secure: true,
      ...params,
    });
}

export default new WorkflowExecution(http);
