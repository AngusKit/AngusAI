/**
 * 工作流模块常量定义
 */
import { Workflow as WorkflowIcon, Play } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { WorkflowStatusEnum } from '@/enums/enums';

/** 每页条数 */
export const ITEMS_PER_PAGE = 6;

/** 搜索防抖延迟（毫秒） */
export const SEARCH_DEBOUNCE_MS = 500;

/** 状态枚举到展示文案的映射 */
export const STATUS_DISPLAY_MAP: Record<WorkflowStatusEnum, string> = {
  [WorkflowStatusEnum.DRAFT]: '草稿',
  [WorkflowStatusEnum.RUNNING]: '运行中',
  [WorkflowStatusEnum.STOPPED]: '已停止',
};

/** 状态对应的 Badge 样式类名 */
export const STATUS_COLOR_MAP: Record<WorkflowStatusEnum, string> = {
  [WorkflowStatusEnum.DRAFT]: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400',
  [WorkflowStatusEnum.RUNNING]: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  [WorkflowStatusEnum.STOPPED]: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400',
};

/** 图标背景色到卡片样式的映射 */
export const ICON_BG_MAP: Record<string, { bg: string; color: string }> = {
  'bg-blue-500': { bg: 'bg-blue-50 dark:bg-blue-900/20', color: 'text-blue-500' },
  'bg-green-500': { bg: 'bg-green-50 dark:bg-green-900/20', color: 'text-green-500' },
  'bg-orange-500': { bg: 'bg-orange-50 dark:bg-orange-900/20', color: 'text-orange-500' },
  'bg-purple-500': { bg: 'bg-purple-50 dark:bg-purple-900/20', color: 'text-purple-500' },
  'bg-pink-500': { bg: 'bg-pink-50 dark:bg-pink-900/20', color: 'text-pink-500' },
  'bg-indigo-500': { bg: 'bg-indigo-50 dark:bg-indigo-900/20', color: 'text-indigo-500' },
  'bg-yellow-500': { bg: 'bg-yellow-50 dark:bg-yellow-900/20', color: 'text-yellow-600' },
  'bg-teal-500': { bg: 'bg-teal-50 dark:bg-teal-900/20', color: 'text-teal-500' },
};

/** 顶部统计卡片配置 */
export interface StatsCardConfig {
  label: string;
  subtext: string;
  icon: LucideIcon;
  iconBg: string;
}

/** 统计卡片默认配置（value 由数据动态填充） */
export const STATS_CARDS_CONFIG: StatsCardConfig[] = [
  { label: '工作流总数', subtext: '全部工作流', icon: WorkflowIcon, iconBg: 'bg-blue-500' },
  { label: '运行中', subtext: '正在运行的工作流', icon: Play, iconBg: 'bg-green-500' },
  { label: '今日调用', subtext: '累计调用次数', icon: WorkflowIcon, iconBg: 'bg-orange-500' },
  { label: '成功率', subtext: '执行成功率', icon: WorkflowIcon, iconBg: 'bg-purple-500' },
];
