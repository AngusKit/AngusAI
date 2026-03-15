import type { SessionConfig } from '@/services/ChatTypes';

/** 默认对话配置 */
export const DEFAULT_CHAT_SETTINGS: SessionConfig = {
  temperature: 0.7,
  maxTokens: 2000,
  topP: 0.9,
  frequencyPenalty: 0,
  presencePenalty: 0,
};

/** 默认值常量（用于 Slider 回退等） */
export const DEFAULT_TEMPERATURE = DEFAULT_CHAT_SETTINGS.temperature ?? 0.7;
export const DEFAULT_MAX_TOKENS = DEFAULT_CHAT_SETTINGS.maxTokens ?? 2000;
export const DEFAULT_TOP_P = DEFAULT_CHAT_SETTINGS.topP ?? 0.9;
export const DEFAULT_FREQUENCY_PENALTY = DEFAULT_CHAT_SETTINGS.frequencyPenalty ?? 0;
export const DEFAULT_PRESENCE_PENALTY = DEFAULT_CHAT_SETTINGS.presencePenalty ?? 0;
