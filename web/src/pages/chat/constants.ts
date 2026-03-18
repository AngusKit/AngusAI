import type { SessionConfig } from '@/services/SessionTypes';

/** 默认对话配置 */
export const DEFAULT_CHAT_SETTINGS: SessionConfig = {
  temperature: 0.7,
  maxTokens: 2000,
  topP: 0.9,
  frequencyPenalty: 0,
  presencePenalty: 0,
};

/** 默认会话名称（创建会话时的初始标题） */
export const DEFAULT_SESSION_TITLE = '新对话';

/** 会话标题最大字符数（按字截取，单词需完整） */
export const SESSION_TITLE_MAX_LENGTH = 100;

/**
 * 将文本截取为会话标题：按字截取，单词完整，不超过 maxLen 字符
 */
export function truncateForTitle(text: string, maxLen = SESSION_TITLE_MAX_LENGTH): string {
  const s = String(text ?? '').replace(/\s+/g, ' ').trim();
  if (!s) return '';
  if (s.length <= maxLen) return s;
  const cut = s.slice(0, maxLen);
  const lastSpace = cut.lastIndexOf(' ');
  return lastSpace > 0 ? cut.slice(0, lastSpace).trim() : cut;
}

/** 最大同时进行的对话数（多个 session 可并发流式生成） */
export const MAX_CONCURRENT_CHATS = 3;

/** 默认值常量（用于 Slider 回退等） */
export const DEFAULT_TEMPERATURE = DEFAULT_CHAT_SETTINGS.temperature ?? 0.7;
export const DEFAULT_MAX_TOKENS = DEFAULT_CHAT_SETTINGS.maxTokens ?? 2000;
export const DEFAULT_TOP_P = DEFAULT_CHAT_SETTINGS.topP ?? 0.9;
export const DEFAULT_FREQUENCY_PENALTY = DEFAULT_CHAT_SETTINGS.frequencyPenalty ?? 0;
export const DEFAULT_PRESENCE_PENALTY = DEFAULT_CHAT_SETTINGS.presencePenalty ?? 0;
