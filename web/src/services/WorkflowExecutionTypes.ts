import { ApiLocaleResult } from '@xcan-angus/infra';

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

/** 工作流执行结果响应 */
export interface WorkflowExecuteResultVo {
  /** 执行ID */
  executionId?: string;
  /** 执行状态 */
  status?: string;
  /** 执行结果 */
  result?: object;
  /**
   * 执行时间（毫秒）
   * @format int64
   */
  executionTime?: number;
  /** 开始时间 */
  startedAt?: string;
  /** 完成时间 */
  completedAt?: string;
}

/** The API response result of supporting international message. */
export type WorkflowExecuteResultResult = ApiLocaleResult & {
  data?: WorkflowExecuteResultVo;
};

/** 执行详情响应 */
export interface ExecutionDetailVo {
  /** 执行ID */
  executionId?: string;
  /**
   * 工作流ID
   * @format int64
   */
  workflowId?: string;
  /** 工作流名称 */
  workflowName?: string;
  /** 执行状态 */
  status?: string;
  /** 开始时间 */
  startedAt?: string;
  /** 完成时间 */
  completedAt?: string;
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
  data?: ExecutionDetailVo;
};

/** 执行日志响应 */
export interface ExecutionLogVo {
  /**
   * 日志ID
   * @format int64
   */
  id?: string;
  /** 执行ID */
  executionId?: string;
  /**
   * 工作流ID
   * @format int64
   */
  workflowId?: string;
  /** 工作流名称 */
  workflowName?: string;
  /** 活动描述 */
  activity?: string;
  /** 执行状态 */
  status?: string;
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
  /** 输入参数 */
  inputs?: object;
  /** 输出结果 */
  outputs?: object;
  /** 错误信息 */
  error?: string;
  /** 节点执行详情 */
  nodeExecutions?: object;
}

export interface PageExecutionLogVo {
  /**
   * Total number
   * @format int64
   */
  total?: number;
  /** Page data */
  list?: ExecutionLogVo[];
}

/** The API response result of supporting international message. */
export type ExecutionLogResult = ApiLocaleResult & {
  data?: PageExecutionLogVo;
};
