import { Search, Check, RefreshCw } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Input } from '@/components/ui/input.tsx';
import { useLanguage } from '@/components/ui/LanguageProvider.tsx';
import { NotificationDetailVo } from '@/services/NotificationTypes.ts';
import { LoadingState } from './LoadingState.tsx';
import { EmptyState } from './EmptyState.tsx';
import { NotificationItem } from './NotificationItem.tsx';
import { NotificationPagination } from './NotificationPagination.tsx';
import { ITEMS_PER_PAGE } from '../notificationConstants.ts';

interface NotificationListProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  notifications: NotificationDetailVo[];
  loading: boolean;
  totalPages: number;
  currentPage: number;
  total: number;
  onToggleRead: (id: string) => void;
  onToggleStar: (id: string) => void;
  onArchive: (id: string) => void;
  onDelete: (id: string) => void;
  onMarkAllRead: () => void;
  onRefresh: () => void;
  onPageChange: (page: number) => void;
}

export function NotificationList ({
  searchTerm,
  onSearchChange,
  notifications,
  loading,
  totalPages,
  currentPage,
  total,
  onToggleRead,
  onToggleStar,
  onArchive,
  onDelete,
  onMarkAllRead,
  onRefresh,
  onPageChange
}: NotificationListProps) {
  const { t } = useLanguage();
  return (
    <Card className='dark:bg-gray-800 dark:border-gray-700'>
      <CardContent className='pt-6'>
        <div className='flex items-center gap-3 mb-4'>
          <div className='flex-1'>
            <div className='relative'>
              <Search className='absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 dark:text-gray-500'/>
              <Input
                placeholder={t('notifications.searchPlaceholder')}
                value={searchTerm}
                onChange={e => onSearchChange(e.target.value)}
                className='pl-10 dark:bg-gray-900 dark:border-gray-700'
              />
            </div>
          </div>
          <Button
            variant='outline'
            size='sm'
            onClick={onMarkAllRead}
            disabled={loading}
          >
            <Check className='size-4 mr-2'/>
            {t('notifications.markAllRead')}
          </Button>
          <Button
            variant='outline'
            size='sm'
            onClick={onRefresh}
            disabled={loading}
          >
            <RefreshCw className={`size-4 mr-2 ${loading ? 'animate-spin' : ''}`}/>
            {t('common.refresh')}
          </Button>
        </div>

        {loading && notifications.length === 0 ? (
          <LoadingState/>
        ) : (
          <div className='space-y-3'>
            {notifications.map(notification => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                loading={loading}
                onToggleRead={onToggleRead}
                onToggleStar={onToggleStar}
                onArchive={onArchive}
                onDelete={onDelete}
              />
            ))}
          </div>
        )}

        {!loading && notifications.length === 0 && <EmptyState/>}

        {totalPages > 1 && (
          <div className="mt-4">
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <NotificationPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={onPageChange}
                totalItems={total}
                pageSize={ITEMS_PER_PAGE}
              />
            </Card>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
