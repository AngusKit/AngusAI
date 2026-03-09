/**
 * 智能体模块常量
 */

/** 与后端 Constants 一致的智能体字段长度限制 */
export const AGENT_SYSTEM_PROMPT_MAX_LENGTH = 100_000;
export const AGENT_WELCOME_MESSAGE_MAX_LENGTH = 1000;
export const AGENT_SUMMARY_PROMPT_MAX_LENGTH = 2000;

/** 智能体关联资源数量上限 */
export const AGENT_MAX_KNOWLEDGE_BASE = 5;
export const AGENT_MAX_DATASET = 5;
export const AGENT_MAX_API_COLLECTION = 5;

/** 智能体列表每页条数 */
export const AGENT_ITEMS_PER_PAGE = 8;

/** 智能体状态对应的 Badge 样式 */
export const AGENT_STATUS_CONFIG: Record<string, { color: string }> = {
  ACTIVE: { color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
  INACTIVE: { color: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400' },
};
