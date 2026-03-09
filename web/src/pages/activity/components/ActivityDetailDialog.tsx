import { Clock } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import type { ActivityDetailVo } from '@/services/ActivityTypes';
import {
  getActionIcon,
  getActionLabel,
  getActionColor,
  getTargetIcon,
  getTargetLabel,
  getTargetColor,
  getStatusBadge,
} from '../utils';

interface ActivityDetailDialogProps {
  /** 是否显示弹窗 */
  open: boolean;
  /** 关闭弹窗回调 */
  onOpenChange: (open: boolean) => void;
  /** 选中的活动记录 */
  selectedActivity: ActivityDetailVo | null;
  /** 当前语言 */
  language: string;
}

/** 活动详情弹窗：展示单条记录的完整信息 */
export function ActivityDetailDialog({
  open,
  onOpenChange,
  selectedActivity,
  language,
}: ActivityDetailDialogProps) {
  if (!selectedActivity) return null;

  const resourceType = selectedActivity.resourceType ?? '';
  const resourceName = selectedActivity.resourceName ?? '';
  const resourceId = selectedActivity.resourceId;
  const ActionIcon = getActionIcon(selectedActivity.actionType ?? '');
  const TargetIcon = getTargetIcon(resourceType);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-2xl dark:bg-gray-900 dark:border-gray-700'>
        <DialogHeader>
          <DialogTitle className='dark:text-white'>
            {language === 'zh-CN' ? '活动详情' : 'Activity Details'}
          </DialogTitle>
          <DialogDescription className='dark:text-gray-400'>
            {language === 'zh-CN'
              ? '查看活动记录的完整信息'
              : 'Review the complete information of this activity entry'}
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-6'>
          {/* 用户信息 */}
          <div className='flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg'>
            <Avatar className='w-12 h-12'>
              <AvatarFallback className='bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'>
                {selectedActivity.userAvatar ?? selectedActivity.userAvatarFallback ?? '--'}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className='dark:text-white'>{selectedActivity.userName || '--'}</p>
              <p className='text-sm text-gray-600 dark:text-gray-400'>
                {language === 'zh-CN' ? '用户ID' : 'User ID'}: {selectedActivity.userId ?? '--'}
              </p>
            </div>
          </div>

          {/* 活动详情字段 */}
          <div className='space-y-4'>
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <Label className='text-sm text-gray-600 dark:text-gray-400'>
                  {language === 'zh-CN' ? '操作类型' : 'Action Type'}
                </Label>
                <div className='flex items-center gap-2 mt-1'>
                  <ActionIcon
                    className={`w-4 h-4 ${getActionColor(selectedActivity.actionType ?? '')}`}
                  />
                  <span className='dark:text-white'>
                    {getActionLabel(selectedActivity.actionType ?? '')}
                  </span>
                </div>
              </div>

              <div>
                <Label className='text-sm text-gray-600 dark:text-gray-400'>
                  {language === 'zh-CN' ? '目标类型' : 'Target Type'}
                </Label>
                <div className='flex items-center gap-2 mt-1'>
                  <TargetIcon
                    className={`w-4 h-4 ${getTargetColor(resourceType)}`}
                  />
                  <span className='dark:text-white'>
                    {getTargetLabel(resourceType)}
                  </span>
                </div>
              </div>

              <div>
                <Label className='text-sm text-gray-600 dark:text-gray-400'>
                  {language === 'zh-CN' ? '目标名称' : 'Target Name'}
                </Label>
                <p className='dark:text-white mt-1'>{resourceName || '--'}</p>
              </div>

              <div>
                <Label className='text-sm text-gray-600 dark:text-gray-400'>
                  {language === 'zh-CN' ? '目标ID' : 'Target ID'}
                </Label>
                <p className='dark:text-white mt-1'>{resourceId ?? '--'}</p>
              </div>

              <div>
                <Label className='text-sm text-gray-600 dark:text-gray-400'>
                  {language === 'zh-CN' ? '活动时间' : 'Activity Time'}
                </Label>
                <div className='flex items-center gap-2 mt-1'>
                  <Clock className='w-4 h-4 text-gray-400' />
                  <span className='dark:text-white'>
                    {selectedActivity.activityDate || '--'}
                  </span>
                </div>
              </div>

              <div>
                <Label className='text-sm text-gray-600 dark:text-gray-400'>
                  {language === 'zh-CN' ? '状态' : 'Status'}
                </Label>
                <div className='mt-1'>
                  {getStatusBadge(selectedActivity.status, language)}
                </div>
              </div>
            </div>

            <div>
              <Label className='text-sm text-gray-600 dark:text-gray-400'>
                {language === 'zh-CN' ? '描述' : 'Description'}
              </Label>
              <p className='dark:text-white mt-1'>
                {selectedActivity.description || '--'}
              </p>
            </div>

            {selectedActivity.detail && (
              <div>
                <Label className='text-sm text-gray-600 dark:text-gray-400'>
                  {language === 'zh-CN' ? '详细信息' : 'Details'}
                </Label>
                <div className='mt-2 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg'>
                  <p className='text-sm dark:text-gray-300'>{selectedActivity.detail}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button
            variant='outline'
            onClick={() => onOpenChange(false)}
            className='dark:bg-gray-800 dark:border-gray-700 dark:text-white'
          >
            {language === 'zh-CN' ? '关闭' : 'Close'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
