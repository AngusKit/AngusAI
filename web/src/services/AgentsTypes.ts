import { ApiLocaleResult, TenantAuditingVo } from '@xcan-angus/infra';
import type {
  AgentStatusEnum,
  InteractionModeEnum,
  ReasoningStrategyEnum,
  AutonomyLevelEnum,
  MemoryStrategyEnum,
} from '@/enums/enums';

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
  interactionMode?: InteractionModeEnum;
  /** 推理策略 */
  reasoningStrategy?: ReasoningStrategyEnum;
  /** 自治等级 */
  autonomyLevel?: AutonomyLevelEnum;
  /** 默认模型ID（可选，后端可能返回 null） */
  defaultModelId?: string | null;
  /** 系统提示词 */
  systemPrompt?: string;
  /** 欢迎消息 */
  welcomeMessage?: string;
  /** 建议问题列表 */
  suggestedQuestions?: string[];
  /** 工具ID列表 */
  toolIds?: string[];
  /** 技能ID列表 */
  skillIds?: string[];
  /** 记忆策略 */
  memoryStrategy?: MemoryStrategyEnum;
  /** 记忆窗口大小 */
  memoryWindowSize?: number;
  /** 记忆最大Token数 */
  memoryMaxTokens?: number;
  /** 摘要提示词（后端字段 memorySummaryPrompt） */
  memorySummaryPrompt?: string;
  /** 输入护栏ID列表 */
  inputGuardrailIds?: string[];
  /** 输出护栏ID列表 */
  outputGuardrailIds?: string[];
  /** 变量注入 */
  variables?: Record<string, string>;
  /** 关联资源（含ID和名称，由后端返回） */
  resources?: AgentResourcesVo;
}

/** 资源信息（id+name） */
export interface AgentResourceInfoVo {
  id?: number;
  name?: string;
}

/** 智能体关联资源 */
export interface AgentResourcesVo {
  knowledgeBases?: AgentResourceInfoVo[];
  datasets?: AgentResourceInfoVo[];
  workflow?: AgentResourceInfoVo;
  apiCollections?: AgentResourceInfoVo[];
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
  interactionMode?: InteractionModeEnum;
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
  interactionMode?: InteractionModeEnum;
  /** 推理策略，默认 FUNCTION_CALLING */
  reasoningStrategy?: ReasoningStrategyEnum;
  /** 自治等级，默认 ASSISTANT */
  autonomyLevel?: AutonomyLevelEnum;
  /** 默认模型ID（可选，后端可接受 null） */
  defaultModelId?: string | null;
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
  interactionMode?: InteractionModeEnum;
  /** 推理策略 */
  reasoningStrategy?: ReasoningStrategyEnum;
  /** 自治等级 */
  autonomyLevel?: AutonomyLevelEnum;
  /** 默认模型ID（可选） */
  defaultModelId?: string | null;
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
  /** 工具ID列表，最多20个（后期实现） */
  toolIds?: string[];
  /** 工作流ID */
  workflowId?: string;
  /** 技能ID列表，最多20个（后期实现） */
  skillIds?: string[];
  /** 数据集ID列表，最多5个 */
  datasetIds?: string[];
  /** 接口集ID列表，最多5个 */
  apiCollectionIds?: string[];
}

/** 记忆配置 */
export interface AgentMemoryDto {
  /** 策略，默认 TOKEN_WINDOW */
  strategy?: MemoryStrategyEnum;
  /** 窗口大小，默认20 */
  windowSize?: number;
  /** 最大Token数，默认8000 */
  maxTokens?: number;
  /** 摘要提示词，最大 2000 字符 */
  summaryPrompt?: string;
}

/** 护栏配置 */
export interface AgentGuardrailsDto {
  /** 输入护栏ID列表 */
  inputGuardrailIds?: string[];
  /** 输出护栏ID列表 */
  outputGuardrailIds?: string[];
}
