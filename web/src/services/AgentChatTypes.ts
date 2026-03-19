import { ApiLocaleResult } from '@xcan-angus/infra';
import type { SessionConfig } from '@/services/SessionTypes';

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

// ============ 流式 SSE Chunk（与后端 OpenAIChatCompletionChunk 对应） ============

/** 流式增量消息（delta），每 token 对应一段 content */
export interface ChatCompletionDelta {
  /** 角色（首块可能携带） */
  role?: string;
  /** 增量内容 */
  content?: string;
}

/** 流式 Chunk 中的生成选项 */
export interface ChatCompletionChunkChoice {
  /** 生成选项索引，通常为 0 */
  index?: number;
  /** 增量消息，包含当前 token 对应的增量内容 */
  delta?: ChatCompletionDelta;
  /** 结束原因：流进行中为 null；流结束时为 stop/length/tool_calls/content_filter 等 */
  finish_reason?: string | null;
}

/** OpenAI Chat Completions 流式 Chunk（SSE 每 token 推送的数据结构，与后端 OpenAIChatCompletionChunk 对应） */
export interface OpenAIChatCompletionChunk {
  /** 唯一标识，流式场景常用固定值 chatcmpl-stream */
  id?: string;
  /** 会话 ID，无会话模式时首块携带，供前端建立关联 */
  session_id?: string;
  /** 助手消息 DB ID，首块携带，供前端停止生成和轮询使用；后端 long 序列化为 string 避免精度丢失 */
  message_id?: string;
  /** 对象类型，流式固定为 chat.completion.chunk */
  object?: string;
  /** 创建时间（Unix 秒） */
  created?: number;
  /** 使用的模型名称 */
  model?: string;
  /** 生成选项列表，流式时每块通常仅一个元素 */
  choices?: ChatCompletionChunkChoice[];
}

/** @deprecated 使用 OpenAIChatCompletionChunk */
export type ChatCompletionChunk = OpenAIChatCompletionChunk;
