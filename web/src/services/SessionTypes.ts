import { ApiLocaleResult, PageQuery, TenantAuditingVo } from '@xcan-angus/infra';
import { MessageRoleEnum } from '@/enums/enums.ts';

/** 会话/对话配置（合并原 AgentChatConfig 与 SessionConfig） */
export interface SessionConfig {
  /**
   * 温度参数，范围 0-2，用于控制生成文本的随机性，越大越随机。
   * @format double
   * @example 0.5
   */
  temperature?: number;
  /**
   * 最大令牌数（max tokens），控制生成文本的最大长度。若为空则使用模型默认值。
   * @format int32
   * @example 1024
   */
  maxTokens?: number;
  /**
   * Top-p (nucleus sampling) 参数，范围 0-1，用于采样时截断概率分布。
   * @format double
   * @example 0.9
   */
  topP?: number;
  /**
   * 频率惩罚（frequency penalty），范围 0-2，用于降低重复词语的概率。
   * @format double
   * @example 0
   */
  frequencyPenalty?: number;
  /**
   * 存在惩罚（presence penalty），范围 0-2，用于鼓励模型引入新话题。
   * @format double
   * @example 0
   */
  presencePenalty?: number;
  /** 系统提示词（system prompt），用于设定对话的系统角色或上下文，最大长度 60000 字符。 */
  systemPrompt?: string;
  /** 模型请求超时（毫秒），请求级，优先级高于模型配置 */
  timeoutMs?: number;
}

/** 创建会话请求参数 */
export interface SessionCreateDto {
  /**
   * 会话标题
   * @example "新对话"
   */
  title?: string;
  /** 关联的应用ID */
  appId: string;
  /** 使用的模型ID */
  modelId?: string;
  /** 使用的智能体ID，不传时使用应用默认智能体 */
  agentId?: string;
  /** 会话配置 */
  config?: SessionConfig;
}

/** 最后一条消息 */
export interface LastMessage {
  /** 消息角色 */
  role?: MessageRoleEnum;
  /** 消息摘要 */
  content?: string;
  /**
   * 消息时间
   * @format date-time
   */
  datetime?: string;
}

/** 会话详情视图 */
export interface SessionDetailVo extends TenantAuditingVo {
  /** 会话实体ID */
  id?: string;
  /** 会话ID(UUID)，对话/消息 API 使用此标识 */
  sessionId?: string;
  /** 会话标题 */
  title?: string;
  /** 关联的应用ID */
  appId?: string;
  /** 应用名称 */
  appName?: string;
  /** 使用的智能体ID */
  agentId?: string;
  /** 使用的智能体名称 */
  agentName?: string;
  /** 使用的模型ID */
  modelId?: string;
  /** 模型名称 */
  modelName?: string;
  /** 消息总数 */
  messageCount?: number;
  /** 是否收藏 */
  isStarred?: boolean;
  /** 是否归档 */
  isArchived?: boolean;
  /** 是否置顶 */
  isPinned?: boolean;
  /** 会话配置 */
  config?: SessionConfig;
  /** 最后一条消息 */
  lastMessage?: LastMessage;
}

/** The API response result of supporting international message. */
export type SessionDetailResult = ApiLocaleResult & {
  /** Actual response data or error details. */
  data?: SessionDetailVo;
};

/** 查询会话请求参数（与后端 SessionFindDto 一致） */
export interface SessionFindDto extends PageQuery {
  /** 会话标题（搜索） */
  title?: string;
  /** 筛选指定应用 */
  appId?: string;
  /** 筛选使用的模型 */
  modelId?: string;
  /** 筛选使用的智能体 */
  agentId?: string;
  /** 是否已归档 */
  isArchived?: boolean;
  /** 是否已收藏（星标） */
  isStarred?: boolean;
  /** 是否已置顶 */
  isPinned?: boolean;
}

/** 批量删除会话请求参数 */
export interface SessionBatchDeleteDto {
  /**
   * 会话ID(UUID)列表
   * @uniqueItems true
   */
  sessionIds: string[];
}

/** 批量删除会话结果 */
export type BatchDeleteSessionsResult = ApiLocaleResult & {
  data?: number;
};

/** 切换模型请求 */
export interface SessionSwitchModelDto {
  /** 新模型ID */
  modelId: string;
}

/** 切换智能体请求 */
export interface SessionSwitchAgentDto {
  /** 新智能体ID */
  agentId: string;
}

/** 切换应用请求 */
export interface SessionSwitchAppDto {
  /** 新应用ID */
  appId: string;
}

/** 收藏会话请求 */
export interface SessionStarDto {
  /** 是否收藏 */
  isStarred: boolean;
}

/** 更新会话请求 */
export interface SessionUpdateDto {
  /** 会话标题 */
  title?: string;
  /** 会话配置 */
  config?: SessionConfig;
}

/** 会话列表视图 */
export interface SessionListVo extends TenantAuditingVo {
  /** 会话实体ID */
  id?: string;
  /** 会话ID(UUID)，对话/消息 API 使用此标识 */
  sessionId?: string;
  /** 会话标题 */
  title?: string;
  /** 关联的应用ID */
  appId?: string;
  /** 应用名称 */
  appName?: string;
  /** 使用的智能体ID */
  agentId?: string;
  /** 使用的智能体名称 */
  agentName?: string;
  /** 使用的模型ID */
  modelId?: string;
  /** 模型名称 */
  modelName?: string;
  /** 消息总数 */
  messageCount?: number;
  /** 是否收藏 */
  isStarred?: boolean;
  /** 是否归档 */
  isArchived?: boolean;
  /** 是否置顶 */
  isPinned?: boolean;
  /** 会话配置 */
  config?: SessionConfig;
  /** 最后一条消息 */
  lastMessage?: LastMessage;
}

export interface PageSessionListVo {
  /**
   * Total number
   * @format int64
   * @example 10
   */
  total?: number;
  /** Page data */
  list?: SessionListVo[];
}

/** The API response result of supporting international message. */
export type PageSessionListResult = ApiLocaleResult & {
  /** Actual response data or error details. */
  data?: PageSessionListVo;
};
