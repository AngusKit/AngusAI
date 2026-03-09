/**
 * 智能体模块工具函数
 */
import { AGENT_STATUS_CONFIG } from './constants';

/** 智能体状态 Badge 的样式类名 */
export function getAgentStatusColor(status?: string): string {
  return AGENT_STATUS_CONFIG[status ?? '']?.color ?? AGENT_STATUS_CONFIG.INACTIVE?.color ?? 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400';
}
