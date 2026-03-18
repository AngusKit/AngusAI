import { ApiLocaleResult, PageQuery } from '@xcan-angus/infra';
import { MessageRoleEnum } from '@/enums/enums.ts';

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
  /**
   * 会话名称
   */
  sessionName?: string;
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

/** 消息反馈请求 */
export interface MessageFeedbackDto {
  /** 反馈类型：like或dislike */
  feedbackType: string;
  /** 反馈说明 */
  comment?: string;
}

/** 查询消息请求参数（与后端 MessageFindDto 一致） */
export interface MessageFindDto extends PageQuery {
  /** 消息ID */
  id?: number;
  /** 会话ID(UUID) */
  sessionId?: string;
  /** 所属会话实体 ID */
  sessionEntityId?: string;
  /** 筛选指定应用 */
  appId?: string;
  /** 筛选使用的模型 */
  modelId?: string;
  /** 筛选使用的智能体 */
  agentId?: string;
  /** 消息角色 */
  role?: MessageRoleEnum;
  /** 是否正在流式生成 */
  isStreaming?: boolean;
  /** 反馈类型：like或dislike */
  feedbackType?: string;
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

/** 清空消息结果 */
export type ClearMessagesResult = ApiLocaleResult & {
  data?: number;
};

/** 语音转文字结果 */
export type VoiceToTextResult = ApiLocaleResult & {
  data?: string;
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
