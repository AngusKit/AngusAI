import { ApiLocaleResult, TenantAuditingVo } from '@xcan-angus/infra';
import { VisibilityEnum, WorkflowStatusEnum, WorkflowTypeEnum } from '@/enums/enums.ts';

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
  /** 最后执行时间 @format date-time */
  lastExecutionTime?: string;
  lastExecutionStatus?: string;
}

/** 工作流详情响应 */
export interface WorkflowDetailVo extends TenantAuditingVo {
  /**
   * 工作流ID
   * @format int64
   */
  id?: string;
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
  /** 可见性 */
  visibility?: VisibilityEnum;
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
  id?: string;
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
  /** 可见性 */
  visibility?: VisibilityEnum;
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
  totalWorkflows?: number;
  /** 运行中的工作流数 */
  runningWorkflows?: number;
  /** 今日调用次数 */
  todayCalls?: number;
  /** 成功率（0-100） */
  successRate?: number;
}

/** The API response result of supporting international message. */
export type WorkflowStatisticsResult = ApiLocaleResult & {
  /** Actual response data or error details. */
  data?: WorkflowStatisticsVo;
};

/** 排序字段 */
export enum GetWorkflowListOrderByEnum {
  Id = 'id',
  CreatedDate = 'createdDate',
  Name = 'name',
  Type = 'type',
  Status = 'status',
}
