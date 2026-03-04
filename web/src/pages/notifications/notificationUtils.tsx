import { NotificationTypeEnum, NotificationPriorityEnum } from '@/enums/enums.ts';
import { CheckCircle2, AlertCircle, Info, Circle } from 'lucide-react';
import { NotificationDetailVo } from '@/services/NotificationTypes.ts';
import { Badge } from '@/components/ui/badge.tsx';
import { getEnumDescription } from '@/enums/utils.ts';

export const getTypeIcon = (type?: NotificationTypeEnum) => {
  switch (type) {
    case NotificationTypeEnum.SUCCESS:
      return <CheckCircle2 className='size-5 text-green-600'/>;
    case NotificationTypeEnum.WARNING:
      return <AlertCircle className='size-5 text-orange-600'/>;
    case NotificationTypeEnum.INFO:
      return <Info className='size-5 text-blue-600'/>;
    default:
      return <Circle className='size-5 text-gray-400'/>;
  }
};

export const getTypeColor = (type?: NotificationTypeEnum) => {
  switch (type) {
    case NotificationTypeEnum.SUCCESS:
      return 'bg-green-100 dark:bg-green-900/30';
    case NotificationTypeEnum.WARNING:
      return 'bg-orange-100 dark:bg-orange-900/30';
    case NotificationTypeEnum.INFO:
      return 'bg-blue-100 dark:bg-blue-900/30';
    default:
      return 'bg-gray-100 dark:bg-gray-800';
  }
};

export const getStatusBadge = (notification: NotificationDetailVo, t: (key: string) => string) => {
  if (notification.type === NotificationTypeEnum.SUCCESS) {
    return (
      <Badge className='bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'>
        {t('common.success')}
      </Badge>
    );
  } else if (notification.type === NotificationTypeEnum.WARNING) {
    return (
      <Badge className='bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400'>
        {t('notifications.warning')}
      </Badge>
    );
  } else {
    return (
      <Badge className='bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'>
        {t('notifications.info')}
      </Badge>
    );
  }
};

export const formatTimestamp = (timestamp?: string) => {
  if (!timestamp) return '';
  try {
    const date = new Date(timestamp);
    const lang = localStorage.getItem('language') || 'zh-CN';
    return date.toLocaleString(lang === 'zh-CN' ? 'zh-CN' : 'en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  } catch {
    return timestamp;
  }
};

export const getPriorityText = (priority?: NotificationPriorityEnum) => {
  if (!priority) return '';
  return getEnumDescription(NotificationPriorityEnum, priority as NotificationPriorityEnum);
};
