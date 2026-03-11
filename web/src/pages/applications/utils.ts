import type { LucideIcon } from 'lucide-react';
import { ApplicationStatusEnum } from '@/enums/enums';
import { FileText, PauseCircle, PlayCircle } from 'lucide-react';

/** 标签配色表：保证同一应用中最多 5 个标签背景色各不相同，深色模式下不使用白色字体 */
const TAG_COLORS = [
  'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400 border-blue-200 dark:border-blue-800',
  'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400 border-green-200 dark:border-green-800',
  'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400 border-purple-200 dark:border-purple-800',
  'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-400 border-rose-200 dark:border-rose-800',
  'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-400 border-cyan-200 dark:border-cyan-800',
] as const;

/**
 * 按索引取色，保证同一应用中最多 5 个标签背景色各不相同
 * @param _tag 标签文字（未使用，预留扩展）
 * @param index 标签索引
 */
export function getTagColor(_tag: string, index: number): string {
  return TAG_COLORS[index % TAG_COLORS.length] ?? TAG_COLORS[0];
}

/** 应用状态对应的 Badge 样式类名 */
export function getStatusBadgeColor(status: ApplicationStatusEnum): string {
  switch (status) {
    case ApplicationStatusEnum.PUBLISHED:
      return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
    case ApplicationStatusEnum.PAUSED:
      return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400';
    case ApplicationStatusEnum.DRAFT:
      return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
    default:
      return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400';
  }
}

/** 应用状态对应的图标组件 */
export function getStatusIcon(status: ApplicationStatusEnum): LucideIcon {
  switch (status) {
    case ApplicationStatusEnum.PUBLISHED:
      return PlayCircle;
    case ApplicationStatusEnum.PAUSED:
      return PauseCircle;
    case ApplicationStatusEnum.DRAFT:
      return FileText;
    default:
      return FileText;
  }
}
