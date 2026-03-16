import { ApiLocaleResult, TenantAuditingVo } from '@xcan-angus/infra';
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

/** 消息附件 */
export interface MessageAttachment {
  /** 附件ID */
  id?: string;
  name?: string;
  type?: string;
  /** 文件大小（字节） */
  size?: number;
  url?: string;
}

/** 消息使用统计 */
export interface MessageUsage {
  /** @format int32 */
  promptTokens?: number;
  /** @format int32 */
  completionTokens?: number;
  /** @format int32 */
  totalTokens?: number;
  cost?: number;
}

/** 消息视图 */
export interface MessageVo {
  /** 消息ID */
  id?: string;
  /**
   * 会话ID(UUID)
   */
  sessionId?: string;
  /** 消息角色 */
  role?: MessageRoleEnum;
  /** 消息内容 */
  content?: string;
  /** 附件列表 */
  attachments?: MessageAttachment[];
  /** 使用统计（仅AI消息） */
  usage?: MessageUsage;
  /**
   * 消息时间
   * @format date-time
   */
  datetime?: string;
  /** 是否正在流式生成 */
  isStreaming?: boolean;
  /** 反馈类型：like或dislike */
  feedbackType?: string;
  /** 反馈说明（点踩时可填） */
  feedbackComment?: string;
}

/** The API response result of supporting international message. */
export type MessageResult = ApiLocaleResult & {
  /** Actual response data or error details. */
  data?: MessageVo;
};

/** 发送消息请求 */
export interface MessageSendDto {
  /** 消息内容 */
  content: string;
  /** 附件列表 */
  attachments?: MessageAttachment[];
  /** 覆盖会话配置 */
  overrideConfig?: SessionConfig;
  /**
   * 应用的提示词ID，用于统计分析
   * @format int64
   */
  promptId?: string;
}

/** 消息反馈请求 */
export interface MessageFeedbackDto {
  /** 反馈类型：like或dislike */
  feedbackType: string;
  /** 反馈说明 */
  comment?: string;
}

/** SSE发射器 */
export interface SseEmitter {
  /** Event data */
  data?: string;
}

/** 批量删除会话请求参数 */
export interface SessionBatchDeleteDto {
  /**
   * 会话ID(UUID)列表
   * @uniqueItems true
   */
  sessionIds: string[];
}

/** 查询消息请求参数 */
export interface MessageFindDto {
  /** 页码，默认 1 */
  pageNo?: number;
  /** 每页大小，默认 20 */
  pageSize?: number;
  /** 获取指定消息之前的消息 */
  beforeId?: string;
  /** 获取指定消息之后的消息 */
  afterId?: string;
}

/** 附件上传响应 */
export interface AttachmentUploadVo {
  /** 附件ID */
  id?: string;
  /** 文件名 */
  name?: string;
  /** MIME类型 */
  type?: string;
  /** 文件大小 */
  size?: number;
  /** 访问URL */
  url?: string;
  /** 上传时间 */
  uploadedAt?: number;
}

/** 附件上传结果 */
export type AttachmentUploadResult = ApiLocaleResult & {
  data?: AttachmentUploadVo;
};

/** 语音转文字结果 */
export type VoiceToTextResult = ApiLocaleResult & {
  data?: string;
};

/** 清空消息结果 */
export type ClearMessagesResult = ApiLocaleResult & {
  data?: number;
};

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

export interface PageMessageVo {
  /**
   * Total number
   * @format int64
   * @example 10
   */
  total?: number;
  /** Page data */
  list?: MessageVo[];
}

/** The API response result of supporting international message. */
export type PageMessageResult = ApiLocaleResult & {
  /** Actual response data or error details. */
  data?: PageMessageVo;
};

/** 对话统计数据 */
export interface ChatStatisticsVo {
  /**
   * 总会话数
   * @format int64
   */
  totalSessions?: number;
  /**
   * 总消息数
   * @format int64
   */
  totalMessages?: number;
  /**
   * 总Token数
   * @format int64
   */
  totalTokens?: number;
  /**
   * 总成本
   * @format double
   */
  totalCost?: number;
}

/** The API response result of supporting international message. */
export type ChatStatisticsResult = ApiLocaleResult & {
  /** Actual response data or error details. */
  data?: ChatStatisticsVo;
};
