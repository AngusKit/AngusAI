/**
 * 修改可见性弹窗
 * 在弹窗中展示 PRIVATE / TEAM / PUBLIC 选项
 */
import { Eye, Lock, Users, Globe } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { VisibilityEnum } from '@/enums/enums';
import { getEnumDescription } from '@/enums/utils';
import type { WorkflowDisplayItem } from '../utils';

const VISIBILITY_OPTIONS: { value: VisibilityEnum; icon: typeof Lock }[] = [
  { value: VisibilityEnum.PRIVATE, icon: Lock },
  { value: VisibilityEnum.TEAM, icon: Users },
  { value: VisibilityEnum.PUBLIC, icon: Globe },
];

interface WorkflowVisibilityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workflow: WorkflowDisplayItem | null;
  onSelect: (w: WorkflowDisplayItem, visibility: VisibilityEnum) => void;
}

export function WorkflowVisibilityDialog({
  open,
  onOpenChange,
  workflow,
  onSelect,
}: WorkflowVisibilityDialogProps) {
  if (!workflow) return null;

  const handleSelect = (visibility: VisibilityEnum) => {
    onSelect(workflow, visibility);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-md dark:bg-gray-800 dark:border-gray-700'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <Eye className='w-5 h-5' />
            修改可见性
          </DialogTitle>
        </DialogHeader>
        <p className='text-sm text-gray-600 dark:text-gray-400 mb-4'>
          选择工作流「{workflow.name}」的可见范围
        </p>
        <div className='space-y-2'>
          {VISIBILITY_OPTIONS.map(({ value, icon: Icon }) => (
            <button
              key={value}
              className='w-full flex items-center gap-3 px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left'
              onClick={() => handleSelect(value)}
            >
              <Icon className='w-4 h-4 text-gray-500 dark:text-gray-400 shrink-0' />
              <span className='text-sm font-medium'>{getEnumDescription(VisibilityEnum, value)}</span>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
