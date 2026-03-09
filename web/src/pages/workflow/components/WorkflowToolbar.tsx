/**
 * 工作流工具栏
 * 搜索框、筛选下拉、视图切换（网格/表格）、新建按钮
 */
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Search, X, Filter, Grid3x3, List, Plus } from 'lucide-react';
import { WorkflowStatusEnum } from '@/enums/enums';

interface WorkflowToolbarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (status: 'all' | WorkflowStatusEnum) => void;
  viewMode: 'grid' | 'table';
  onViewModeChange: (mode: 'grid' | 'table') => void;
  onCreateClick: () => void;
}

export function WorkflowToolbar({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  viewMode,
  onViewModeChange,
  onCreateClick,
}: WorkflowToolbarProps) {
  return (
    <div className='flex items-center justify-between gap-3 mb-4'>
      {/* 搜索框 */}
      <div className='relative w-[390px]'>
        <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500' />
        <Input
          type='text'
          placeholder='搜索工作流名称或描述...'
          value={searchQuery}
          onChange={e => onSearchChange(e.target.value)}
          className='pl-10 pr-10 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 focus-visible:border-blue-500 focus-visible:ring-blue-500/50'
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors'
          >
            <X className='w-4 h-4' />
          </button>
        )}
      </div>

      {/* 筛选与操作区 */}
      <div className='flex items-center gap-3'>
        {/* 状态筛选下拉 */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='outline' size='sm' className='dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300'>
              <Filter className='w-4 h-4 mr-2' />
              筛选
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end' className='dark:bg-gray-800 dark:border-gray-700'>
            <DropdownMenuItem className='dark:text-gray-300' onClick={() => onStatusFilterChange('all')}>
              全部
            </DropdownMenuItem>
            <DropdownMenuItem
              className='dark:text-gray-300'
              onClick={() => onStatusFilterChange(WorkflowStatusEnum.RUNNING)}
            >
              运行中
            </DropdownMenuItem>
            <DropdownMenuItem
              className='dark:text-gray-300'
              onClick={() => onStatusFilterChange(WorkflowStatusEnum.STOPPED)}
            >
              已停止
            </DropdownMenuItem>
            <DropdownMenuItem
              className='dark:text-gray-300'
              onClick={() => onStatusFilterChange(WorkflowStatusEnum.DRAFT)}
            >
              草稿
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* 视图切换 */}
        <div className='flex items-center gap-1 border border-gray-200 dark:border-gray-700 rounded-lg p-1'>
          <button
            onClick={() => onViewModeChange('grid')}
            className={`p-1.5 rounded ${
              viewMode === 'grid'
                ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <Grid3x3 className='w-4 h-4' />
          </button>
          <button
            onClick={() => onViewModeChange('table')}
            className={`p-1.5 rounded ${
              viewMode === 'table'
                ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <List className='w-4 h-4' />
          </button>
        </div>

        {/* 新建按钮 */}
        <Button size='sm' className='bg-blue-500 hover:bg-blue-600 text-white' onClick={onCreateClick}>
          <Plus className='w-4 h-4 mr-2' />
          新建工作流
        </Button>
      </div>
    </div>
  );
}
