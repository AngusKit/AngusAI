import { Star, Archive, Trash2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/components/LanguageProvider.tsx';
import { NotificationDetailVo } from '@/services/NotificationTypes';
import {
  getTypeIcon,
  getTypeColor,
  getStatusBadge,
  formatTimestamp,
  getPriorityText
} from '../utils';

interface NotificationItemProps {
  /** 通知对象 */
  notification: NotificationDetailVo;
  /** 是否正在加载 */
  loading: boolean;
  /** 标记已读/未读回调 */
  onToggleRead: (id: string) => void;
  /** 切换星标回调 */
  onToggleStar: (id: string) => void;
  /** 归档回调 */
  onArchive: (id: string) => void;
  /** 删除回调 */
  onDelete: (id: string) => void;
}

/**
 * 单个通知项组件
 * 显示通知的详细信息并提供操作按钮
 */
export function NotificationItem ({
  notification,
  loading,
  onToggleRead,
  onToggleStar,
  onArchive,
  onDelete
}: NotificationItemProps) {
  const { t } = useLanguage();
  return (
    <div
      className={`border rounded-lg p-4 transition-colors ${
        notification.isRead
          ? 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
          : 'border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-900/10'
      }`}
    >
      <div className='flex items-start gap-3'>
        {/* 类型图标 */}
        <div
          className={`size-10 rounded-lg flex items-center justify-center flex-shrink-0 ${getTypeColor(notification.type)}`}
        >
          {getTypeIcon(notification.type)}
        </div>

        {/* 内容 */}
        <div className='flex-1 min-w-0'>
          <div className='flex items-start justify-between gap-4 mb-2'>
            <div className='flex-1'>
              <h3 className='text-gray-900 dark:text-white mb-1'>
                {notification.title || t('notifications.noTitle')}
              </h3>
              <p className='text-sm text-gray-600 dark:text-gray-400 mb-2'>
                {notification.description || t('notifications.noDescription')}
              </p>
            </div>
            {getStatusBadge(notification, t)}
          </div>

          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-3 text-sm'>
              {notification.isStarred && (
                <span className='flex items-center gap-1 text-yellow-600'>
                  <Star className='size-3 fill-yellow-600'/>
                  {t('notifications.starredRecommendation')}
                </span>
              )}
              <span className='text-gray-500 dark:text-gray-400'>
                {notification.category || t('interfaceManagement.untagged')}
              </span>
              {notification.priority && (
                <Badge variant='outline' className='text-xs'>
                  {getPriorityText(notification.priority)}
                </Badge>
              )}
            </div>

            <div className='flex items-center gap-2'>
              <Button
                variant='ghost'
                size='sm'
                onClick={() => onToggleRead(notification.id || '')}
                className='h-8'
                disabled={loading}
              >
                <Check className='size-4 mr-1'/>
                {notification.isRead ? t('notifications.markAsUnread') : t('notifications.markAsRead')}
              </Button>
              <Button
                variant='ghost'
                size='sm'
                onClick={() => onToggleStar(notification.id || '')}
                className='h-8'
                disabled={loading}
              >
                <Star
                  className={`size-4 mr-1 ${notification.isStarred ? 'fill-yellow-600 text-yellow-600' : ''}`}
                />
                {notification.isStarred ? t('notifications.removeStar') : t('notifications.addStar')}
              </Button>
              {!notification.isArchived && (
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={() => onArchive(notification.id || '')}
                  className='h-8'
                  disabled={loading}
                >
                  <Archive className='size-4 mr-1'/>
                  {t('notifications.archive')}
                </Button>
              )}
              <Button
                variant='ghost'
                size='sm'
                onClick={() => onDelete(notification.id || '')}
                className='h-8 text-red-600 hover:text-red-700'
                disabled={loading}
              >
                <Trash2 className='size-4 mr-1'/>
                {t('common.actions.delete')}
              </Button>
              <span className='text-sm text-gray-500 dark:text-gray-400 ml-2'>
                {formatTimestamp(notification.timestamp)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
