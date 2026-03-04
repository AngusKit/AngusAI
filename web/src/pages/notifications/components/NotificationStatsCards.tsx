import { Bell, Star, Circle, TrendingUp, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card.tsx';
import { useLanguage } from '@/components/ui/LanguageProvider.tsx';
import { NotificationStatisticsVo } from '@/services/NotificationTypes.ts';
import { safeParseInt } from '@/utils/FormatUtils.ts';

interface NotificationStatsCardsProps {
  stats: NotificationStatisticsVo;
  statsLoading: boolean;
}

export function NotificationStatsCards ({
  stats,
  statsLoading
}: NotificationStatsCardsProps) {
  const { t } = useLanguage();
  return (
    <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
      <Card className='dark:bg-gray-800 dark:border-gray-700'>
        <CardContent className='pt-6'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm text-gray-600 dark:text-gray-400'>{t('notifications.totalMessages')}</p>
              <p className='text-3xl mt-1 text-gray-900 dark:text-white'>
                {statsLoading ? <Loader2 className='size-6 animate-spin'/> : safeParseInt(stats.total, 0)}
              </p>
              <p className='text-sm text-gray-500 dark:text-gray-400 mt-1'>{t('notifications.allMessagesDesc')}</p>
            </div>
            <div className='size-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center'>
              <Bell className='size-6 text-blue-600'/>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className='dark:bg-gray-800 dark:border-gray-700'>
        <CardContent className='pt-6'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm text-gray-600 dark:text-gray-400'>{t('notifications.unreadMessages')}</p>
              <p className='text-3xl mt-1 text-gray-900 dark:text-white'>
                {statsLoading ? <Loader2 className='size-6 animate-spin'/> : safeParseInt(stats.unread, 0)}
              </p>
              <p className='text-sm text-gray-500 dark:text-gray-400 mt-1'>{t('notifications.unreadMessagesDesc')}</p>
            </div>
            <div className='size-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center'>
              <Circle className='size-6 text-orange-600'/>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className='dark:bg-gray-800 dark:border-gray-700'>
        <CardContent className='pt-6'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm text-gray-600 dark:text-gray-400'>{t('notifications.starredMessages')}</p>
              <p className='text-3xl mt-1 text-gray-900 dark:text-white'>
                {statsLoading ? <Loader2 className='size-6 animate-spin'/> : safeParseInt(stats.starred, 0)}
              </p>
              <p className='text-sm text-gray-500 dark:text-gray-400 mt-1'>{t('notifications.starredMessagesDesc')}</p>
            </div>
            <div className='size-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center'>
              <Star className='size-6 text-yellow-600'/>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className='dark:bg-gray-800 dark:border-gray-700'>
        <CardContent className='pt-6'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm text-gray-600 dark:text-gray-400'>{t('notifications.todayNew')}</p>
              <p className='text-3xl mt-1 text-gray-900 dark:text-white'>
                {statsLoading ? <Loader2 className='size-6 animate-spin'/> : safeParseInt(stats.todayNew, 0)}
              </p>
              <p className='text-sm text-green-600 mt-1 flex items-center gap-1'>
                <TrendingUp className='size-3'/>+
                {safeParseInt(stats.comparedYesterday, 0)} {t('notifications.comparedYesterday')}
              </p>
            </div>
            <div className='size-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center'>
              <TrendingUp className='size-6 text-green-600'/>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
