import { ApiLocaleResult, TenantAuditingVo } from '@xcan-angus/infra';

/** 智能体状态：ACTIVE=已发布，INACTIVE=下线 */
export type AgentStatusEnum = 'ACTIVE' | 'INACTIVE';

/** 智能体详情 */
export interface AgentDetailVo extends TenantAuditingVo {
  /** 智能体ID */
  id?: string;
  /** 名称 */
  name?: string;
  /** 描述 */
  description?: string;
  /** 状态 */
  status?: AgentStatusEnum;
  /** 交互模式 */
  interactionMode?: string;
  /** 推理策略 */
  reasoningStrategy?: string;
  /** 自治等级 */
  autonomyLevel?: string;
  /** 模型ID */
  modelId?: string;
  /** 系统提示词 */
  systemPrompt?: string;
  /** 欢迎消息 */
  welcomeMessage?: string;
  /** 建议问题列表 */
  suggestedQuestions?: string[];
  /** 知识库ID列表 */
  knowledgeBaseIds?: string[];
  /** 工具ID列表 */
  toolIds?: string[];
  /** 工作流ID */
  workflowId?: string;
  /** 技能ID列表 */
  skillIds?: string[];
  /** 数据集ID列表 */
  datasetIds?: string[];
  /** 接口集ID列表 */
  apiCollectionIds?: string[];
  /** 记忆策略 */
  memoryStrategy?: string;
  /** 记忆窗口大小 */
  memoryWindowSize?: number;
  /** 记忆最大Token数 */
  memoryMaxTokens?: number;
  /** 输入护栏ID列表 */
  inputGuardrailIds?: string[];
  /** 输出护栏ID列表 */
  outputGuardrailIds?: string[];
  /** 变量注入 */
  variables?: Record<string, string>;
}

/** 智能体列表项 */
export interface AgentListVo {
  /** 智能体ID */
  id?: string;
  /** 名称 */
  name?: string;
  /** 描述 */
  description?: string;
  /** 状态 */
  status?: AgentStatusEnum;
  /** 模型ID */
  modelId?: string;
  /** 交互模式 */
  interactionMode?: string;
}

/** 智能体详情结果 */
export type AgentDetailResult = ApiLocaleResult & {
  /** 智能体详情 */
  data?: AgentDetailVo;
};

/** 智能体分页结果 */
export interface PageResultAgentListVo {
  /** 总数 */
  total?: number;
  /** 列表 */
  list?: AgentListVo[];
}

/** 智能体列表结果 */
export type AgentListResult = ApiLocaleResult & {
  /** 分页列表数据 */
  data?: PageResultAgentListVo;
};

/** 创建智能体请求 */
export interface AgentCreateDto {
  /** 智能体名称（必填） */
  name: string;
  /** 描述 */
  description?: string;
  /** 交互模式，默认 CHATBOT */
  interactionMode?: string;
  /** 推理策略，默认 FUNCTION_CALLING */
  reasoningStrategy?: string;
  /** 自治等级，默认 ASSISTANT */
  autonomyLevel?: string;
  /** 默认模型ID（必填） */
  defaultModelId: number;
  /** 系统提示词 */
  systemPrompt?: string;
  /** 欢迎消息 */
  welcomeMessage?: string;
  /** 建议问题列表 */
  suggestedQuestions?: string[];
  /** 关联资源 */
  resources?: AgentResourcesDto;
  /** 记忆配置 */
  memory?: AgentMemoryDto;
  /** 护栏配置 */
  guardrails?: AgentGuardrailsDto;
  /** 变量注入 */
  variables?: Record<string, string>;
}

/** 更新智能体请求 */
export interface AgentUpdateDto {
  /** 智能体名称（必填） */
  name?: string;
  /** 描述 */
  description?: string;
  /** 交互模式 */
  interactionMode?: string;
  /** 推理策略 */
  reasoningStrategy?: string;
  /** 自治等级 */
  autonomyLevel?: string;
  /** 默认模型ID（必填） */
  defaultModelId?: number;
  /** 系统提示词 */
  systemPrompt?: string;
  /** 欢迎消息 */
  welcomeMessage?: string;
  /** 建议问题列表 */
  suggestedQuestions?: string[];
  /** 关联资源 */
  resources?: AgentResourcesDto;
  /** 记忆配置 */
  memory?: AgentMemoryDto;
  /** 护栏配置 */
  guardrails?: AgentGuardrailsDto;
  /** 变量注入 */
  variables?: Record<string, string>;
}

/** 关联资源 */
export interface AgentResourcesDto {
  /** 知识库ID列表，最多5个 */
  knowledgeBaseIds?: string[];
  /** 工具ID列表，最多20个 */
  toolIds?: string[];
  /** 工作流ID */
  workflowId?: string;
  /** 技能ID列表，最多20个 */
  skillIds?: string[];
  /** 数据集ID列表，最多5个 */
  datasetIds?: string[];
  /** 接口集ID列表，最多5个 */
  apiCollectionIds?: string[];
}

/** 记忆配置 */
export interface AgentMemoryDto {
  /** 策略，默认 TOKEN_WINDOW */
  strategy?: string;
  /** 窗口大小，默认20 */
  windowSize?: number;
  /** 最大Token数，默认8000 */
  maxTokens?: number;
  /** 摘要提示词 */
  summaryPrompt?: string;
}

/** 护栏配置 */
export interface AgentGuardrailsDto {
  /** 输入护栏ID列表 */
  inputGuardrailIds?: string[];
  /** 输出护栏ID列表 */
  outputGuardrailIds?: string[];
}
