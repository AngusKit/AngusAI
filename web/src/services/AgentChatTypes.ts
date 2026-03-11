import { ApiLocaleResult } from '@xcan-angus/infra';

/** 智能体对话配置（可选覆盖参数），未设置的字段使用下游默认 */
export interface AgentChatConfig {
  /** 温度参数 0-2，控制随机性 */
  temperature?: number;
  /** 最大令牌数 */
  maxTokens?: number;
  /** Top-p 采样 0-1 */
  topP?: number;
  /** 频率惩罚 0-2 */
  frequencyPenalty?: number;
  /** 存在惩罚 0-2 */
  presencePenalty?: number;
  /** 系统提示词覆盖 */
  systemPrompt?: string;
  /** 模型请求超时（毫秒），请求级 */
  timeoutMs?: number;
}

/** 智能体对话请求 */
export interface AgentChatRequestDto {
  /** 智能体ID */
  agentId: string;
  /** 会话ID(UUID)，用于多轮对话记忆与 Session/Message 关联，不传则由业务层初始化 */
  sessionId?: string;
  /** 用户消息 */
  message: string;
  /** 超时时间（毫秒），不传则使用默认值。流式对话默认 120000ms，同步对话默认 60000ms */
  timeoutMs?: number;
  /** 对话配置覆盖，可选；优先级高于会话与智能体配置 */
  config?: AgentChatConfig;
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
