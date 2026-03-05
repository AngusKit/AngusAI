import { Activity, FileText, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { getEnumDescription } from '@/enums/utils';
import { ActivityTargetTypeEnum, ActivityActionTypeEnum } from '@/enums/enums';
import { actionTypeMeta, targetTypeMeta } from './constants';

/**
 * 生成活动记录的唯一 ID（用于前端兜底）
 */
export const generateActivityId = (): string =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

/** 根据操作类型获取图标组件 */
export function getActionIcon(actionType: string) {
  const meta = actionTypeMeta[actionType as ActivityActionTypeEnum];
  return meta?.icon ?? Activity;
}

/** 根据操作类型获取国际化文案 */
export function getActionLabel(actionType: string): string {
  return getEnumDescription(ActivityActionTypeEnum, actionType as ActivityActionTypeEnum) || actionType;
}

/** 根据操作类型获取颜色类名 */
export function getActionColor(actionType: string): string {
  return actionTypeMeta[actionType as ActivityActionTypeEnum]?.color ?? 'text-gray-500';
}

/** 根据目标类型获取图标组件 */
export function getTargetIcon(targetType: string) {
  const meta = targetTypeMeta[targetType as ActivityTargetTypeEnum];
  return meta?.icon ?? FileText;
}

/** 根据目标类型获取国际化文案 */
export function getTargetLabel(targetType: string): string {
  return getEnumDescription(ActivityTargetTypeEnum, targetType as ActivityTargetTypeEnum) || targetType;
}

/** 根据目标类型获取颜色类名 */
export function getTargetColor(targetType: string): string {
  return targetTypeMeta[targetType as ActivityTargetTypeEnum]?.color ?? 'text-gray-500';
}

/** 根据状态生成 Badge 展示用的 React 节点（含图标与文案） */
export function getStatusBadge(
  status: string | undefined,
  language: 'zh-CN' | string
): React.ReactNode {
  if (!status || status === 'success') {
    return (
      <Badge className='bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-0'>
        <CheckCircle className='w-3 h-3 mr-1' />
        {language === 'zh-CN' ? '成功' : 'Success'}
      </Badge>
    );
  }
  if (status === 'failed') {
    return (
      <Badge className='bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-0'>
        <XCircle className='w-3 h-3 mr-1' />
        {language === 'zh-CN' ? '失败' : 'Failed'}
      </Badge>
    );
  }
  if (status === 'warning') {
    return (
      <Badge className='bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border-0'>
        <AlertCircle className='w-3 h-3 mr-1' />
        {language === 'zh-CN' ? '警告' : 'Warning'}
      </Badge>
    );
  }
  return null;
}
