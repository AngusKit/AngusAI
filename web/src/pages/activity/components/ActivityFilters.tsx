import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { getEnumDescription } from '@/enums/utils';
import { ActivityTargetTypeEnum, ActivityActionTypeEnum } from '@/enums/enums';
import { orderedActionTypes } from '../constants';

interface ActivityFiltersProps {
  /** 当前语言 */
  language: string;
  /** 搜索关键词 */
  searchQuery: string;
  /** 搜索关键词变更回调 */
  onSearchChange: (value: string) => void;
  /** 选中的目标类型 */
  selectedTargetType: string;
  /** 目标类型变更回调 */
  onTargetTypeChange: (value: string) => void;
  /** 选中的操作类型 */
  selectedActionType: string;
  /** 操作类型变更回调 */
  onActionTypeChange: (value: string) => void;
}

/** 活动筛选区域：搜索框、目标类型、操作类型 */
export function ActivityFilters({
  language,
  searchQuery,
  onSearchChange,
  selectedTargetType,
  onTargetTypeChange,
  selectedActionType,
  onActionTypeChange,
}: ActivityFiltersProps) {
  return (
    <Card className='p-6 dark:bg-gray-900 dark:border-gray-800'>
      <div className='flex gap-2'>
        {/* 搜索框 */}
        <div className='flex-1'>
          <div className='md:col-span-2 w-[390px]'>
            <div className='relative'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4' />
              <Input
                value={searchQuery}
                onChange={e => onSearchChange(e.target.value)}
                placeholder={
                  language === 'zh-CN'
                    ? '搜索用户、目标或操作...'
                    : 'Search users, targets, or actions...'
                }
                className='pl-10 dark:bg-gray-800 dark:border-gray-700 dark:text-white'
              />
            </div>
          </div>
        </div>

        {/* 目标类型筛选 */}
        <div>
          <Select value={selectedTargetType} onValueChange={onTargetTypeChange}>
            <SelectTrigger className='dark:bg-gray-800 dark:border-gray-700 dark:text-white'>
              <SelectValue placeholder={language === 'zh-CN' ? '所有类型' : 'All Types'} />
            </SelectTrigger>
            <SelectContent className='dark:bg-gray-800 dark:border-gray-700'>
              <SelectItem value='all' className='dark:text-white'>
                {language === 'zh-CN' ? '所有类型' : 'All Types'}
              </SelectItem>
              {Object.values(ActivityTargetTypeEnum).map(key => (
                <SelectItem key={key} value={key} className='dark:text-white'>
                  {getEnumDescription(ActivityTargetTypeEnum, key)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 操作类型筛选 */}
        <div>
          <Select value={selectedActionType} onValueChange={onActionTypeChange}>
            <SelectTrigger className='dark:bg-gray-800 dark:border-gray-700 dark:text-white'>
              <SelectValue placeholder={language === 'zh-CN' ? '所有操作' : 'All Actions'} />
            </SelectTrigger>
            <SelectContent className='dark:bg-gray-800 dark:border-gray-700'>
              <SelectItem value='all' className='dark:text-white'>
                {language === 'zh-CN' ? '所有操作' : 'All Actions'}
              </SelectItem>
              <SelectItem value={ActivityActionTypeEnum.UNKNOWN} className='dark:text-white'>
                {getEnumDescription(ActivityActionTypeEnum, ActivityActionTypeEnum.UNKNOWN)}
              </SelectItem>
              {orderedActionTypes.map(key => (
                <SelectItem key={key} value={key} className='dark:text-white'>
                  {getEnumDescription(ActivityActionTypeEnum, key)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </Card>
  );
}
