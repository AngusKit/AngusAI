/**
 * 工作流列表空状态占位
 * 区分「无数据」与「无搜索结果」场景
 */
import { Workflow as WorkflowIcon, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface WorkflowListEmptyProps {
  /** 是否有搜索/筛选条件 */
  hasFilter: boolean;
  /** 搜索关键词（有筛选时展示） */
  searchQuery?: string;
  /** 点击新建回调 */
  onCreateClick: () => void;
}

export function WorkflowListEmpty({ hasFilter, searchQuery, onCreateClick }: WorkflowListEmptyProps) {
  return (
    <div className='flex flex-col items-center justify-center py-16 px-4'>
      <div className='w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4'>
        {hasFilter ? (
          <Search className='w-8 h-8 text-gray-400 dark:text-gray-600' />
        ) : (
          <WorkflowIcon className='w-8 h-8 text-gray-400 dark:text-gray-600' />
        )}
      </div>
      <h3 className='text-lg font-medium text-gray-900 dark:text-white mb-2'>
        {hasFilter ? '未找到匹配的工作流' : '暂无工作流'}
      </h3>
      <p className='text-sm text-gray-600 dark:text-gray-400 mb-6 max-w-sm text-center'>
        {hasFilter
          ? searchQuery
            ? `没有找到包含「${searchQuery}」的工作流，尝试调整搜索或筛选条件`
            : '当前筛选条件下暂无数据，尝试调整筛选条件'
          : '创建工作流，将 AI 任务流程自动化'}
      </p>
    </div>
  );
}
