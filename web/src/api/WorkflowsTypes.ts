import { ApiLocaleResult, TenantAuditingVo } from '@xcan-angus/infra';
import { WorkflowStatusEnum, WorkflowTypeEnum } from '@/enums/enums.ts';

/** 执行统计 */
export interface ExecutionStats {
  /** @format int64 */
  totalExecutions?: number;
  /** @format int64 */
  successfulExecutions?: number;
  /** @format int64 */
  failedExecutions?: number;
  /** @format double */
  avgExecutionTime?: number;
  /** @format int64 */
  lastExecutionTime?: number;
  lastExecutionStatus?: string;
}

/** 工作流详情响应 */
export interface WorkflowDetailVo extends TenantAuditingVo {
  /**
   * 工作流ID
   * @format int64
   */
  id?: number;
  /** 工作流名称 */
  name?: string;
  /** 工作流描述 */
  description?: string;
  /** 图标emoji */
  icon?: string;
  /** 背景色 */
  iconBg?: string;
  /** 工作流类型 */
  type?: WorkflowTypeEnum;
  /** 工作流状态 */
  status?: WorkflowStatusEnum;
  /** 是否启用 */
  enabled?: boolean;
  /** 版本号 */
  version?: string;
  /** 工作流配置 */
  config?: object;
  /** 统计数据 */
  executionStats?: ExecutionStats;
}

/** The API response result of supporting international message. */
export type WorkflowDetailResult = ApiLocaleResult & {
  /** Actual response data or error details. */
  data?: WorkflowDetailVo;
};

/** 更新工作流配置请求参数 */
export interface WorkflowConfigUpdateDto {
  /** 节点列表 */
  nodes: object[];
  /** 连线列表 */
  edges: object[];
  /** 变量定义 */
  variables?: object[];
  /** 运行配置 */
  config?: object;
}

/** 创建工作流请求参数 */
export interface WorkflowCreateDto {
  /**
   * 工作流名称
   * @example "用户注册流程"
   */
  name: string;
  /**
   * 工作流描述
   * @example "处理用户注册的完整流程"
   */
  description: string;
  /**
   * 图标emoji
   * @example "🔄"
   */
  icon?: string;
  /**
   * 背景色
   * @example "bg-blue-500"
   */
  iconBg?: string;
  /** 工作流类型 */
  type: WorkflowTypeEnum;
  /** 初始配置 */
  config?: object;
}

/** 执行工作流请求参数 */
export interface WorkflowExecuteDto {
  /** 输入变量 */
  inputs?: object;
  /**
   * 执行模式
   * @example "async"
   */
  mode?: string;
}

/** 更新工作流请求参数 */
export interface WorkflowUpdateDto {
  /**
   * 工作流名称
   * @example "用户注册流程"
   */
  name?: string;
  /**
   * 工作流描述
   * @example "处理用户注册的完整流程"
   */
  description?: string;
  /**
   * 图标emoji
   * @example "🔄"
   */
  icon?: string;
  /**
   * 背景色
   * @example "bg-blue-500"
   */
  iconBg?: string;
  /** 工作流类型 */
  type?: WorkflowTypeEnum;
}

/** 工作流列表项响应 */
export interface WorkflowListVo extends TenantAuditingVo {
  /**
   * 工作流ID
   * @format int64
   */
  id?: number;
  /** 工作流名称 */
  name?: string;
  /** 工作流描述 */
  description?: string;
  /** 图标emoji */
  icon?: string;
  /** 背景色 */
  iconBg?: string;
  /** 工作流类型 */
  type?: WorkflowTypeEnum;
  /** 工作流状态 */
  status?: WorkflowStatusEnum;
  /** 是否启用 */
  enabled?: boolean;
  /**
   * 节点数量
   * @format int32
   */
  nodesCount?: number;
  /** 版本号 */
  version?: string;
  /** 统计信息 */
  stats?: object;
}

export interface PageWorkflowListVo {
  /**
   * Total number
   * @format int64
   * @example 10
   */
  total?: number;
  /** Page data */
  list?: WorkflowListVo[];
}

/** The API response result of supporting international message. */
export type WorkflowListResult = ApiLocaleResult & {
  /** Actual response data or error details. */
  data?: PageWorkflowListVo;
};

/** 工作流统计响应 */
export interface WorkflowStatisticsVo {
  /** 总工作流数 */
  totalWorkflows?: object;
  /** 运行中的工作流数 */
  runningWorkflows?: object;
  /** 今日调用次数 */
  todayCalls?: object;
  /** 成功率 */
  successRate?: object;
}

/** The API response result of supporting international message. */
export type WorkflowStatisticsResult = ApiLocaleResult & {
  /** Actual response data or error details. */
  data?: WorkflowStatisticsVo;
};

/** 执行详情响应 */
export interface ExecutionDetailVo {
  /** 执行ID */
  executionId?: string;
  /**
   * 工作流ID
   * @format int64
   */
  workflowId?: number;
  /** 工作流名称 */
  workflowName?: string;
  /** 执行状态 */
  status?: string;
  /**
   * 开始时间
   * @format int64
   */
  startedAt?: number;
  /**
   * 完成时间
   * @format int64
   */
  completedAt?: number;
  /**
   * 执行时间（毫秒）
   * @format int64
   */
  executionTime?: number;
  /** 输入参数 */
  inputs?: object;
  /** 输出结果 */
  outputs?: object;
  /** 节点执行详情 */
  nodeExecutions?: object;
  /** 错误信息 */
  error?: object;
}

/** The API response result of supporting international message. */
export type ExecutionDetailResult = ApiLocaleResult & {
  /** Actual response data or error details. */
  data?: ExecutionDetailVo;
};

/** 执行日志响应 */
export interface ExecutionLogVo {
  /**
   * 日志ID
   * @format int64
   */
  id?: number;
  /** 执行ID */
  executionId?: string;
  /**
   * 工作流ID
   * @format int64
   */
  workflowId?: number;
  /** 工作流名称 */
  workflowName?: string;
  /** 活动描述 */
  activity?: string;
  /** 执行状态 */
  status?: string;
  /** 状态颜色 */
  statusColor?: string;
  /** 操作人 */
  operator?: string;
  /**
   * 执行时间（毫秒）
   * @format int64
   */
  executionTime?: number;
  /**
   * 创建时间
   * @format date-time
   */
  createdDate?: string;
}

export interface PageExecutionLogVo {
  /**
   * Total number
   * @format int64
   * @example 10
   */
  total?: number;
  /** Page data */
  list?: ExecutionLogVo[];
}

/** The API response result of supporting international message. */
export type ExecutionLogResult = ApiLocaleResult & {
  /** Actual response data or error details. */
  data?: PageExecutionLogVo;
};

/** 排序字段 */
export enum GetWorkflowListOrderByEnum {
  Id = 'id',
  CreatedDate = 'createdDate',
  Name = 'name',
  Type = 'type',
  Status = 'status',
}
