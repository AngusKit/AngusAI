/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

import {
  ApiLocaleResultExecutionDetailVo,
  ApiLocaleResultPageResultExecutionLogVo,
  ApiLocaleResultPageResultWorkflowListVo,
  ApiLocaleResultWorkflowDetailVo,
  ApiLocaleResultWorkflowStatisticsVo,
  ApiResultObject,
  GetExecutionLogsParamsFilters0OpEnum,
  GetExecutionLogsParamsFilters1OpEnum,
  GetExecutionLogsParamsInfoScopeEnum,
  GetExecutionLogsParamsOrderSortEnum,
  GetWorkflowListParamsFilters0OpEnum,
  GetWorkflowListParamsFilters1OpEnum,
  GetWorkflowListParamsInfoScopeEnum,
  GetWorkflowListParamsOrderByEnum,
  GetWorkflowListParamsOrderSortEnum,
  GetWorkflowListParamsStatusEnum,
  GetWorkflowListParamsTypeEnum,
  ModifyWorkflowVisibilityParamsVisibilityEnum,
  WorkflowConfigUpdateDto,
  WorkflowCreateDto,
  WorkflowExecuteDto,
  WorkflowUpdateDto,
} from "./data-contracts.ts";
import { ContentType, HttpClient, RequestParams } from "./http-client.ts";

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
    id: number,
    query: {
      /** 可见性 */
      visibility: ModifyWorkflowVisibilityParamsVisibilityEnum;
    },
    params: RequestParams = {},
  ) =>
    this.http.request<ApiLocaleResultWorkflowDetailVo, ApiResultObject>({
      path: `/api/v1/workflows/${id}/visibility`,
      method: "PUT",
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
  updateWorkflowConfig = (
    id: number,
    data: WorkflowConfigUpdateDto,
    params: RequestParams = {},
  ) =>
    this.http.request<ApiLocaleResultWorkflowDetailVo, ApiResultObject>({
      path: `/api/v1/workflows/${id}/config`,
      method: "PUT",
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
    query?: {
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
      type?: GetWorkflowListParamsTypeEnum;
      /** 工作流状态 */
      status?: GetWorkflowListParamsStatusEnum;
      /**
       * 所属租户ID
       * @format int64
       * @example 1
       */
      tenantId?: number;
      /**
       * 创建人ID
       * @format int64
       * @example 1
       */
      createdBy?: number;
      /**
       * 创建时间
       * @format date-time
       * @example "2024-10-12 00:00:00"
       */
      createdDate?: string;
      /** 排序字段 */
      orderBy?: GetWorkflowListParamsOrderByEnum;
      /**
       * Page number for paginated data (default: 1)
       * @format int32
       * @min 1
       * @max 100000
       */
      pageNo?: number;
      /**
       * Number of items per page (default: 10)
       * @format int32
       * @min 1
       * @max 2000
       */
      pageSize?: number;
      /** Specifies the direction of the sorting (ascending or descending) */
      orderSort?: GetWorkflowListParamsOrderSortEnum;
      /** Scope of information to query (BASIC or DETAIL). Interface performance optimization parameters, only valid for some interfaces */
      infoScope?: GetWorkflowListParamsInfoScopeEnum;
      /** Whether to use full-text search (default: false, uses DB index search if false) */
      fullTextSearch?: boolean;
      /** Search keyword */
      keyword?: string;
      /**
       * ID of the last modifier
       * @format int64
       * @example 1
       */
      modifiedBy?: number;
      /**
       * Last modification date
       * @format date-time
       * @example "2024-10-12 00:00:00"
       */
      lastModifiedDate?: string;
      /** Customize the filter parameter name. Note: The parameter name must be a whitelist parameter */
      "filters[0].key"?: string;
      /** Customize the filter condition (EQUAL, NOT_EQUAL, GREATER_THAN, etc.) */
      "filters[0].op"?: GetWorkflowListParamsFilters0OpEnum;
      /** Customize the filter value */
      "filters[0].value"?: any;
      /** Customize the filter parameter name. Note: The parameter name must be a whitelist parameter */
      "filters[1].key"?: string;
      /** Customize the filter condition (EQUAL, NOT_EQUAL, GREATER_THAN, etc.) */
      "filters[1].op"?: GetWorkflowListParamsFilters1OpEnum;
      /** Customize the filter value */
      "filters[1].value"?: any;
    },
    params: RequestParams = {},
  ) =>
    this.http.request<ApiLocaleResultPageResultWorkflowListVo, ApiResultObject>(
      {
        path: `/api/v1/workflows`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      },
    );
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
    this.http.request<ApiResultObject, ApiResultObject>({
      path: `/api/v1/workflows`,
      method: "POST",
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
  stopWorkflow = (id: number, params: RequestParams = {}) =>
    this.http.request<ApiLocaleResultWorkflowDetailVo, ApiResultObject>({
      path: `/api/v1/workflows/${id}/stop`,
      method: "POST",
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
  startWorkflow = (id: number, params: RequestParams = {}) =>
    this.http.request<ApiLocaleResultWorkflowDetailVo, ApiResultObject>({
      path: `/api/v1/workflows/${id}/start`,
      method: "POST",
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
  executeWorkflow = (
    id: number,
    data: WorkflowExecuteDto,
    params: RequestParams = {},
  ) =>
    this.http.request<ApiResultObject, ApiResultObject>({
      path: `/api/v1/workflows/${id}/execute`,
      method: "POST",
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
  getWorkflowDetail = (id: number, params: RequestParams = {}) =>
    this.http.request<ApiLocaleResultWorkflowDetailVo, ApiResultObject>({
      path: `/api/v1/workflows/${id}`,
      method: "GET",
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
  deleteWorkflow = (id: number, params: RequestParams = {}) =>
    this.http.request<ApiResultObject, ApiResultObject>({
      path: `/api/v1/workflows/${id}`,
      method: "DELETE",
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
  updateWorkflow = (
    id: number,
    data: WorkflowUpdateDto,
    params: RequestParams = {},
  ) =>
    this.http.request<ApiLocaleResultWorkflowDetailVo, ApiResultObject>({
      path: `/api/v1/workflows/${id}`,
      method: "PATCH",
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
    params: RequestParams = {},
  ) =>
    this.http.request<ApiLocaleResultWorkflowStatisticsVo, ApiResultObject>({
      path: `/api/v1/workflows/statistics`,
      method: "GET",
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
    this.http.request<ApiLocaleResultExecutionDetailVo, ApiResultObject>({
      path: `/api/v1/workflows/executions/${executionId}`,
      method: "GET",
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
    query?: {
      /**
       * 工作流ID
       * @format int64
       */
      workflowId?: number;
      /** 工作流名称 */
      workflowName?: string;
      /** 状态筛选 */
      status?: string;
      /**
       * Page number for paginated data (default: 1)
       * @format int32
       * @min 1
       * @max 100000
       */
      pageNo?: number;
      /**
       * Number of items per page (default: 10)
       * @format int32
       * @min 1
       * @max 2000
       */
      pageSize?: number;
      /** Field name to sort the data by */
      orderBy?: string;
      /** Specifies the direction of the sorting (ascending or descending) */
      orderSort?: GetExecutionLogsParamsOrderSortEnum;
      /** Scope of information to query (BASIC or DETAIL). Interface performance optimization parameters, only valid for some interfaces */
      infoScope?: GetExecutionLogsParamsInfoScopeEnum;
      /** Whether to use full-text search (default: false, uses DB index search if false) */
      fullTextSearch?: boolean;
      /** Search keyword */
      keyword?: string;
      /**
       * Tenant ID to which this belongs
       * @format int64
       * @example 1
       */
      tenantId?: number;
      /**
       * ID of the creator
       * @format int64
       * @example 1
       */
      createdBy?: number;
      /**
       * Creation date
       * @format date-time
       * @example "2024-10-12 00:00:00"
       */
      createdDate?: string;
      /**
       * ID of the last modifier
       * @format int64
       * @example 1
       */
      modifiedBy?: number;
      /**
       * Last modification date
       * @format date-time
       * @example "2024-10-12 00:00:00"
       */
      lastModifiedDate?: string;
      /** Customize the filter parameter name. Note: The parameter name must be a whitelist parameter */
      "filters[0].key"?: string;
      /** Customize the filter condition (EQUAL, NOT_EQUAL, GREATER_THAN, etc.) */
      "filters[0].op"?: GetExecutionLogsParamsFilters0OpEnum;
      /** Customize the filter value */
      "filters[0].value"?: any;
      /** Customize the filter parameter name. Note: The parameter name must be a whitelist parameter */
      "filters[1].key"?: string;
      /** Customize the filter condition (EQUAL, NOT_EQUAL, GREATER_THAN, etc.) */
      "filters[1].op"?: GetExecutionLogsParamsFilters1OpEnum;
      /** Customize the filter value */
      "filters[1].value"?: any;
    },
    params: RequestParams = {},
  ) =>
    this.http.request<ApiLocaleResultPageResultExecutionLogVo, ApiResultObject>(
      {
        path: `/api/v1/workflows/execution-logs`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      },
    );
}
