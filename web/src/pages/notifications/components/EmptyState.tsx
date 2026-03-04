import { Bell } from 'lucide-react';
import { useLanguage } from '@/components/LanguageProvider.tsx';

/**
 * 空状态组件
 * 当没有通知时显示
 */
export function EmptyState () {
  const { t } = useLanguage();
  return (
    <div className='text-center'>
      <Bell className='size-12 text-gray-400 dark:text-gray-500 mx-auto mb-3'/>
      <p className='text-gray-500 dark:text-gray-400'>{t('notifications.noMessages')}</p>
    </div>
  );
}
