import { ApiLocaleResult } from '@xcan-angus/infra';
import type { SessionConfig } from '@/services/ChatTypes';

/** OpenAI 格式消息：role + content */
export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
  name?: string;
}

/**
 * 智能体对话请求（严格遵循 OpenAI 消息格式）
 *
 * - messages: 完整消息历史，每次请求携带（与 OpenAI Chat Completions 一致）
 * - 会话管理二选一：sessionId（已有会话）或 appId（新建会话）
 */
export interface AgentChatRequestDto {
  /** 应用ID；新建会话时必填，与 sessionId 二选一 */
  appId?: number | string;
  /** 使用的模型ID；新建会话时可选 */
  modelId?: number | string;
  /** 使用的智能体ID；新建会话时可选 */
  agentId?: number | string;
  /** 会话ID(UUID)；已有会话时必填，与 appId 二选一 */
  sessionId?: string;
  /** 消息列表（OpenAI 格式），必须包含至少一条 user 消息 */
  messages: ChatMessage[];
  /** 对话配置覆盖，可选 */
  config?: SessionConfig;
}

/** 智能体对话响应 */
export interface AgentChatResponseVo {
  /** 智能体ID */
  agentId?: string;
  /** 会话ID */
  sessionId?: string;
  /** 智能体回复内容 */
  reply?: string;
  /** 响应耗时（毫秒） */
  latencyMs?: number;
}

/** 智能体对话结果 */
export type AgentChatResult = ApiLocaleResult & {
  data?: AgentChatResponseVo;
};
