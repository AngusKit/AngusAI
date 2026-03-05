import { Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ActivityListEmptyProps {
  /** 当前语言 */
  language: string;
  /** 是否正在加载 */
  loading: boolean;
  /** 是否有筛选条件（用于展示不同提示） */
  hasFilters: boolean;
  /** 清除筛选回调 */
  onClearFilters?: () => void;
}

/** 活动列表空状态/加载状态展示（需置于 Card 内使用） */
export function ActivityListEmpty({
  language,
  loading,
  hasFilters,
  onClearFilters,
}: ActivityListEmptyProps) {
  return (
    <div className='h-[400px] flex flex-col items-center justify-center px-6'>
        {loading ? (
          <>
            <div className='w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4'>
              <Activity className='w-8 h-8 text-gray-400 dark:text-gray-500 animate-pulse' />
            </div>
            <p className='text-gray-500 dark:text-gray-400'>
              {language === 'zh-CN' ? '加载中...' : 'Loading...'}
            </p>
          </>
        ) : (
          <>
            <div className='w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4'>
              <Activity className='w-8 h-8 text-gray-400 dark:text-gray-500' />
            </div>
            <p className='text-base text-gray-600 dark:text-gray-300 mb-2'>
              {language === 'zh-CN' ? '暂无活动记录' : 'No activity records yet'}
            </p>
            <p className='text-sm text-gray-500 dark:text-gray-400 text-center max-w-sm'>
              {hasFilters
                ? language === 'zh-CN'
                  ? '未找到符合筛选条件的记录，尝试调整筛选条件'
                  : 'No matching records. Try adjusting your filters.'
                : language === 'zh-CN'
                  ? '团队成员的操作将在这里显示'
                  : 'Team member activities will appear here'}
            </p>
            {hasFilters && onClearFilters && (
              <Button
                variant='outline'
                size='sm'
                className='mt-4 dark:bg-gray-800 dark:border-gray-700 dark:text-white'
                onClick={onClearFilters}
              >
                {language === 'zh-CN' ? '清除筛选' : 'Clear Filters'}
              </Button>
            )}
          </>
        )}
    </div>
  );
}
