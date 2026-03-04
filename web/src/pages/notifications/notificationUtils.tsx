import { NotificationTypeEnum, NotificationPriorityEnum } from '@/enums/enums';
import { CheckCircle2, AlertCircle, Info, Circle } from 'lucide-react';
import { NotificationDetailVo } from '@/services/NotificationTypes';
import { Badge } from '@/components/ui/badge';
import { getEnumDescription } from '@/enums/utils';

/**
 * 获取通知类型的图标
 * @param type 通知类型
 * @returns 对应的图标组件
 */
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

/**
 * 获取通知类型的背景颜色类名
 * @param type 通知类型
 * @returns 对应的背景颜色类名
 */
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

/**
 * 获取通知状态徽章
 * @param notification 通知对象
 * @param t 翻译函数
 * @returns 状态徽章组件
 */
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
        {t('systemMonitoring.warning')}
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

/**
 * 格式化时间戳
 * @param timestamp 时间戳字符串
 * @returns 格式化后的时间字符串
 */
export const formatTimestamp = (timestamp?: string) => {
  if (!timestamp) return '';
  try {
    const date = new Date(timestamp);
    return date.toLocaleString(undefined, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  } catch {
    return timestamp;
  }
};

/**
 * 获取优先级显示文本
 * @param priority 优先级枚举值
 * @param t 翻译函数
 * @returns 优先级显示文本
 */
export const getPriorityText = (priority?: NotificationPriorityEnum) => {
  if (!priority) return '';
  return getEnumDescription(NotificationPriorityEnum, priority as NotificationPriorityEnum);
  // switch (priority) {
  //   case NotificationPriorityEnum.HIGH:

  //     return t('notifications.highPriority');
  //   case NotificationPriorityEnum.MEDIUM:
  //     return t('notifications.mediumPriority');
  //   case NotificationPriorityEnum.LOW:
  //     return t('notifications.lowPriority');
  //   default:
  //     return '';
  // }
};
