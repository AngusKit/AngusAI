/**
 * 监控页面组件共享类型
 * 优先使用 API 类型，此处仅补充 UI 展示需要的适配类型
 */

import type { SessionListVo } from '@/services/SessionTypes';
import type { MessageVo } from '@/services/MessageTypes';

/** 会话展示：基于 SessionListVo */
export type MonitorSession = SessionListVo;

/** 消息展示：基于 MessageVo，补充展示用字段 */
export type MonitorMessage = MessageVo & {
  messageId?: string;
  sessionTitle?: string;
  userName?: string;
  creator?: string;
};

/** 反馈展示：从 MessageVo（有 feedbackType）映射，用于反馈管理 Tab */
export interface MonitorFeedback {
  id: string;
  messageId: string;
  sessionId?: string;
  sessionTitle?: string;
  feedbackType: 'like' | 'dislike';
  feedbackComment?: string;
  userName?: string;
  appId?: string;
  appName?: string;
  agentId?: string;
  agentName?: string;
  modelId?: string;
  modelName?: string;
  messageContent?: string;
  createdAt?: string;
}

/** 下拉选项（应用、智能体、模型、用户等） */
export interface SelectOption {
  id: string | number;
  name: string;
}


export interface ThroughputStats {
  current: number;
  min: number;
  max: number;
  average: number;
}

export interface DualStats {
  active: number;
  total: number;
}

export interface FeedbackStats {
  like: number;
  dislike: number;
  total: number;
}

export interface OverviewStats {
  throughput: ThroughputStats;
  sessions: DualStats;
  messages: DualStats;
  users: DualStats;
  feedback: FeedbackStats;
  applications: DualStats;
  agents: DualStats;
  models: DualStats;
}