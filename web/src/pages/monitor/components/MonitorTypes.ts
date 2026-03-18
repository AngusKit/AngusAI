/** 监控页面组件共享类型 */

export interface Session {
  id: number;
  sessionId: string;
  title: string;
  appId: number;
  appName: string;
  agentId: number;
  agentName: string;
  modelId?: number;
  modelName?: string;
  userId: number;
  userName: string;
  messageCount: number;
  isStarred: boolean;
  isArchived: boolean;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: number;
  messageId: string;
  sessionId: string;
  sessionTitle: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  userId: number;
  userName: string;
  appId: number;
  appName: string;
  agentId: number;
  agentName: string;
  modelId?: number;
  modelName?: string;
  feedbackType?: 'like' | 'dislike';
  feedbackComment?: string;
  createdAt: string;
  tokenUsage?: { promptTokens: number; completionTokens: number; totalTokens: number };
}

export interface Feedback {
  id: number;
  messageId: string;
  sessionId: string;
  sessionTitle: string;
  feedbackType: 'like' | 'dislike';
  feedbackComment?: string;
  userId: number;
  userName: string;
  appId: number;
  appName: string;
  agentId: number;
  agentName: string;
  modelId?: number;
  modelName?: string;
  messageContent: string;
  createdAt: string;
}

export interface SelectOption {
  id: number;
  name: string;
}
