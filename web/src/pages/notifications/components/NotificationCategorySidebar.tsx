import { Bell, Circle, Star, Archive } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card.tsx';
import { useLanguage } from '@/components/ui/LanguageProvider.tsx';
import { NotificationCategoryEnum } from '@/enums/enums.ts';
import { NotificationStatisticsVo } from '@/services/NotificationTypes.ts';
import { safeParseInt } from '@/utils/FormatUtils.ts';

interface NotificationCategorySidebarProps {
  selectedCategory: NotificationCategoryEnum | 'all';
  stats: NotificationStatisticsVo;
  onCategoryChange: (category: NotificationCategoryEnum | 'all') => void;
}

export function NotificationCategorySidebar ({
  selectedCategory,
  stats,
  onCategoryChange
}: NotificationCategorySidebarProps) {
  const { t } = useLanguage();
  return (
    <Card className='dark:bg-gray-800 dark:border-gray-700'>
      <CardContent className='pt-6'>
        <h3 className='text-sm text-gray-900 dark:text-white mb-3'>{t('notifications.categoryTitle')}</h3>
        <div className='space-y-1'>
          <button
            onClick={() => onCategoryChange('all')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
              selectedCategory === 'all'
                ? 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900'
                : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
            }`}
          >
            <span className='flex items-center gap-2'>
              <Bell className='size-4'/>
              {t('notifications.allMessages')}
            </span>
            <span className='text-sm'>{safeParseInt(stats.total, 0)}</span>
          </button>

          <button
            onClick={() => onCategoryChange(NotificationCategoryEnum.UNREAD)}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
              selectedCategory === NotificationCategoryEnum.UNREAD
                ? 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900'
                : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
            }`}
          >
            <span className='flex items-center gap-2'>
              <Circle className='size-4'/>
              {t('notifications.unreadMessages')}
            </span>
            <span className='text-sm'>{safeParseInt(stats.unread, 0)}</span>
          </button>

          <button
            onClick={() => onCategoryChange(NotificationCategoryEnum.STARRED)}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
              selectedCategory === NotificationCategoryEnum.STARRED
                ? 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900'
                : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
            }`}
          >
            <span className='flex items-center gap-2'>
              <Star className='size-4'/>
              {t('notifications.starredMessages')}
            </span>
            <span className='text-sm'>{safeParseInt(stats.starred, 0)}</span>
          </button>

          <button
            onClick={() => onCategoryChange(NotificationCategoryEnum.ARCHIVED)}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
              selectedCategory === NotificationCategoryEnum.ARCHIVED
                ? 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900'
                : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
            }`}
          >
            <span className='flex items-center gap-2'>
              <Archive className='size-4'/>
              {t('notifications.archived')}
            </span>
            <span className='text-sm'>{safeParseInt(stats.archived, 0)}</span>
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
