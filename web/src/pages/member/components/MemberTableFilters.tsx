import { Search, UserPlus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface MemberTableFiltersProps {
  /** 搜索关键词 */
  searchQuery: string;
  /** 搜索变更回调 */
  onSearchChange: (value: string) => void;
  /** 状态筛选值 */
  statusFilter: string;
  /** 状态筛选变更回调 */
  onStatusFilterChange: (value: string) => void;
  /** 打开邀请弹窗回调 */
  onInviteClick: () => void;
}

/** 成员列表筛选区：搜索框、状态筛选、邀请按钮 */
export function MemberTableFilters({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  onInviteClick,
}: MemberTableFiltersProps) {
  return (
    <div className='flex items-center justify-between gap-3'>
      <div className='relative w-[390px]'>
        <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400' />
        <Input
          placeholder='搜索成员姓名或邮箱...'
          value={searchQuery}
          onChange={e => onSearchChange(e.target.value)}
          className='pl-9 dark:bg-gray-800 dark:border-gray-700'
        />
      </div>
      <div className='flex items-center gap-3'>
        <Select value={statusFilter} onValueChange={onStatusFilterChange}>
          <SelectTrigger className='w-[140px] dark:bg-gray-800 dark:border-gray-700'>
            <SelectValue placeholder='状态筛选' />
          </SelectTrigger>
          <SelectContent className='dark:bg-gray-800 dark:border-gray-700'>
            <SelectItem value='all'>全部状态</SelectItem>
            <SelectItem value='active'>活跃</SelectItem>
            <SelectItem value='inactive'>不活跃</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={onInviteClick} className='bg-blue-500 hover:bg-blue-600'>
          <UserPlus className='w-4 h-4 mr-2' />
          邀请成员
        </Button>
      </div>
    </div>
  );
}
