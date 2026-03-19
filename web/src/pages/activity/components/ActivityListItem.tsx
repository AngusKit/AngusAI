import { Clock, ChevronRight, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import type { ActivityDetailVo } from '@/services/ActivityTypes';
import {
  getActionIcon,
  getActionLabel,
  getActionColor,
  getTargetIcon,
  getTargetLabel,
  getTargetColor,
  getStatusBadge,
} from '../utils';

interface ActivityListItemProps {
  /** 活动记录 */
  activity: ActivityDetailVo;
  /** 当前语言 */
  language: string;
  /** 点击查看详情回调 */
  onClick: (activity: ActivityDetailVo) => void;
}

/** 单条活动记录展示（列表项） */
export function ActivityListItem({ activity, language, onClick }: ActivityListItemProps) {
  const ActionIcon = getActionIcon(activity.actionType ?? '');
  const resourceType = activity.resourceType ?? '';
  const resourceName = activity.resourceName ?? '';
  const TargetIcon = getTargetIcon(resourceType);

  return (
    <div
      className='p-6 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer'
      onClick={() => onClick(activity)}
    >
      <div className='flex items-start gap-4'>
        {/* 用户头像 */}
        <Avatar className='w-10 h-10 flex-shrink-0'>
          <AvatarFallback className='bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'>
            {activity.userAvatar ?? activity.userAvatarFallback ?? '--'}
          </AvatarFallback>
        </Avatar>

        {/* 活动内容 */}
        <div className='flex-1 min-w-0'>
          <div className='flex items-start justify-between gap-4 mb-2'>
            <div className='flex items-center gap-2 flex-wrap'>
              <span className='dark:text-white'>{activity.userName || '--'}</span>
              <ActionIcon className={`w-4 h-4 ${getActionColor(activity.actionType ?? '')}`} />
              <span className='text-sm text-gray-600 dark:text-gray-400'>
                {getActionLabel(activity.actionType ?? '')}
              </span>
              <TargetIcon className={`w-4 h-4 ${getTargetColor(resourceType)}`} />
              <Badge variant='secondary' className='dark:bg-gray-800 dark:text-gray-300'>
                {getTargetLabel(resourceType)}
              </Badge>
              {activity.status && getStatusBadge(activity.status, language)}
            </div>
            <div className='flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 flex-shrink-0'>
              <Clock className='w-4 h-4' />
              {activity.activityDate || '--'}
            </div>
          </div>

          <p className='text-sm text-gray-600 dark:text-gray-400 mb-1'>
            {activity.description || '--'}
          </p>

          <div className='flex items-center gap-2 text-sm'>
            <span className='text-gray-500 dark:text-gray-500'>
              {language === 'zh-CN' ? '目标：' : 'Target:'}
            </span>
            <span className='dark:text-white'>{resourceName || '--'}</span>
          </div>
        </div>

        <ChevronRight className='w-5 h-5 text-gray-400 dark:text-gray-600 flex-shrink-0' />
      </div>
    </div>
  );
}
