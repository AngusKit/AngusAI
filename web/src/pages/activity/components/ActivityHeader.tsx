import { Button } from '@/components/ui/button';

interface ActivityHeaderProps {
  /** 当前语言 */
  language: string;
  /** 切换统计日期范围的回调 */
  onStatDateRangeChange: (preset: 'today' | 'week' | 'month') => void;
}

/** 活动记录页头部：标题、描述、日期范围快捷按钮 */
export function ActivityHeader({ language, onStatDateRangeChange }: ActivityHeaderProps) {
  return (
    <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
      <div>
        <h1 className='text-2xl dark:text-white mb-1'>
          {language === 'zh-CN' ? '活动记录' : 'Activity Log'}
        </h1>
        <p className='text-sm text-gray-600 dark:text-gray-400'>
          {language === 'zh-CN'
            ? '查看团队成员的所有操作活动记录'
            : 'Review all team activity'}
        </p>
      </div>
      <div className='flex gap-2'>
        <Button
          variant='outline'
          size='sm'
          onClick={() => onStatDateRangeChange('today')}
          className='dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700'
        >
          {language === 'zh-CN' ? '今日' : 'Today'}
        </Button>
        <Button
          variant='outline'
          size='sm'
          onClick={() => onStatDateRangeChange('week')}
          className='dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700'
        >
          {language === 'zh-CN' ? '最近7天' : 'Last 7 days'}
        </Button>
        <Button
          variant='outline'
          size='sm'
          onClick={() => onStatDateRangeChange('month')}
          className='dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700'
        >
          {language === 'zh-CN' ? '最近30天' : 'Last 30 days'}
        </Button>
      </div>
    </div>
  );
}
