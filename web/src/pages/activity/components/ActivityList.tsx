import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { ActivityDetailVo } from '@/services/ActivityTypes';
import { ActivityListItem } from './ActivityListItem';
import { ActivityListEmpty } from './ActivityListEmpty';
import { ActivityPagination } from './ActivityPagination';

interface ActivityListProps {
  /** 当前语言 */
  language: string;
  /** 是否正在加载 */
  loading: boolean;
  /** 活动列表数据 */
  activities: ActivityDetailVo[];
  /** 是否有筛选条件 */
  hasFilters: boolean;
  /** 总页数 */
  totalPages: number;
  /** 当前页码 */
  currentPage: number;
  /** 清除筛选回调 */
  onClearFilters: () => void;
  /** 查看详情回调 */
  onViewDetail: (activity: ActivityDetailVo) => void;
  /** 页码变更回调 */
  onPageChange: (page: number) => void;
}

/** 活动列表主体：空状态/列表/分页 */
export function ActivityList({
  language,
  loading,
  activities,
  hasFilters,
  totalPages,
  currentPage,
  onClearFilters,
  onViewDetail,
  onPageChange,
}: ActivityListProps) {
  const isEmpty = loading || activities.length === 0;

  return (
    <Card className='dark:bg-gray-900 dark:border-gray-800'>
      {isEmpty ? (
        <ActivityListEmpty
          language={language}
          loading={loading && activities.length === 0}
          hasFilters={hasFilters}
          onClearFilters={onClearFilters}
        />
      ) : (
        <>
          <ScrollArea className='h-[600px]'>
            <div className='divide-y divide-gray-200 dark:divide-gray-800'>
              {activities.map((activity, index) => (
                <ActivityListItem
                  key={activity.id ?? `activity-${index}`}
                  activity={activity}
                  language={language}
                  onClick={onViewDetail}
                />
              ))}
            </div>
          </ScrollArea>
          <ActivityPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </>
      )}
    </Card>
  );
}
