import { ApiLocaleResult, PageResult, TenantAuditingVo } from '@xcan-angus/infra';

/** 智能体状态 */
export type AgentStatusEnum = 'ACTIVE' | 'INACTIVE';

/** 智能体详情 */
export interface AgentDetailVo extends TenantAuditingVo {
  id?: number;
  name?: string;
  description?: string;
  status?: AgentStatusEnum;
  interactionMode?: string;
  reasoningStrategy?: string;
  autonomyLevel?: string;
  modelId?: number;
  systemPrompt?: string;
  welcomeMessage?: string;
  suggestedQuestions?: string[];
  knowledgeBaseIds?: number[];
  toolIds?: string[];
  workflowId?: number;
  skillIds?: string[];
  datasetIds?: number[];
  apiCollectionIds?: number[];
  memoryStrategy?: string;
  memoryWindowSize?: number;
  memoryMaxTokens?: number;
  inputGuardrailIds?: string[];
  outputGuardrailIds?: string[];
  variables?: Record<string, string>;
}

/** 智能体列表项 */
export interface AgentListVo {
  id?: number;
  name?: string;
  description?: string;
  status?: AgentStatusEnum;
  modelId?: number;
  interactionMode?: string;
}

/** 智能体详情结果 */
export type AgentDetailResult = ApiLocaleResult & {
  data?: AgentDetailVo;
};

/** 智能体列表结果 */
export type AgentListResult = ApiLocaleResult & {
  data?: PageResult<AgentListVo>;
};

/** 创建智能体请求 */
export interface AgentCreateDto {
  name: string;
  description?: string;
  interactionMode?: string;
  reasoningStrategy?: string;
  autonomyLevel?: string;
  modelId: number;
  systemPrompt?: string;
  welcomeMessage?: string;
  suggestedQuestions?: string[];
  resources?: AgentResourcesDto;
  memory?: AgentMemoryDto;
  guardrails?: AgentGuardrailsDto;
  variables?: Record<string, string>;
}

/** 更新智能体请求 */
export interface AgentUpdateDto {
  name?: string;
  description?: string;
  interactionMode?: string;
  reasoningStrategy?: string;
  autonomyLevel?: string;
  modelId?: number;
  systemPrompt?: string;
  welcomeMessage?: string;
  suggestedQuestions?: string[];
  resources?: AgentResourcesDto;
  memory?: AgentMemoryDto;
  guardrails?: AgentGuardrailsDto;
  variables?: Record<string, string>;
}

/** 关联资源 */
export interface AgentResourcesDto {
  knowledgeBaseIds?: number[];
  toolIds?: string[];
  workflowId?: number;
  skillIds?: string[];
  datasetIds?: number[];
  apiCollectionIds?: number[];
}

/** 记忆配置 */
export interface AgentMemoryDto {
  strategy?: string;
  windowSize?: number;
  maxTokens?: number;
  summaryPrompt?: string;
}

/** 护栏配置 */
export interface AgentGuardrailsDto {
  inputGuardrailIds?: string[];
  outputGuardrailIds?: string[];
}
