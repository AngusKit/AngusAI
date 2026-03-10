import {
  Search,
  Check,
  RefreshCw
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/components/LanguageProvider.tsx';
import { NotificationDetailVo } from '@/services/NotificationTypes';
import { LoadingState } from './LoadingState';
import { EmptyState } from './EmptyState';
import { NotificationItem } from './NotificationItem';
import { Pagination } from '@/components/gm/Pagination';
import { ITEMS_PER_PAGE } from '../constants';

interface NotificationListProps {
  /** 搜索关键词 */
  searchTerm: string;
  /** 搜索关键词改变回调 */
  onSearchChange: (value: string) => void;
  /** 通知列表 */
  notifications: NotificationDetailVo[];
  /** 是否正在加载 */
  loading: boolean;
  /** 总页数 */
  totalPages: number;
  /** 当前页码 */
  currentPage: number;
  /** 总数 */
  total: number;
  /** 标记已读/未读回调 */
  onToggleRead: (id: string) => void;
  /** 切换星标回调 */
  onToggleStar: (id: string) => void;
  /** 归档回调 */
  onArchive: (id: string) => void;
  /** 删除回调 */
  onDelete: (id: string) => void;
  /** 全部标记为已读回调 */
  onMarkAllRead: () => void;
  /** 刷新回调 */
  onRefresh: () => void;
  /** 页码改变回调 */
  onPageChange: (page: number) => void;
}

/**
 * 通知列表组件
 * 包含搜索框、操作按钮、通知列表和分页
 */
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
    <Card className='h-full min-h-0 flex flex-col dark:bg-gray-800 dark:border-gray-700'>
      <CardContent className='flex flex-1 flex-col min-h-0 pt-6'>
        {/* 搜索和操作按钮 */}
        <div className='flex shrink-0 items-center gap-3 mb-4'>
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
            <RefreshCw
              className={`size-4 mr-2 ${loading ? 'animate-spin' : ''}`}
            />
            {t('common.refresh')}
          </Button>
        </div>

        {/* 通知列表 / 加载 / 空状态 */}
        {loading && notifications.length === 0
          ? (
            <div className='flex flex-1 min-h-0 items-center justify-center py-8'>
              <LoadingState/>
            </div>
            )
          : notifications.length > 0
            ? (
              <div className='space-y-3 min-h-0'>
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
              )
            : (
              <div className='flex flex-1 min-h-0 items-center justify-center py-8'>
                <EmptyState/>
              </div>
              )}

        {/* 分页 */}
        {totalPages > 1 && (
          <div className="mt-4">
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <Pagination
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
