/**
 * 工作流网格视图
 * 卡片式展示工作流列表
 */
import { useState } from 'react';
import { Workflow as WorkflowIcon, Play, Square, Pencil, Edit, Trash2, MoreHorizontal, Copy, Eye } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { VisibilityEnum, WorkflowStatusEnum } from '@/enums/enums';
import { enumToMessages } from '@/enums/utils';
import type { WorkflowDisplayItem } from '../utils';
import { WorkflowListEmpty } from './WorkflowListEmpty';

const VISIBILITY_OPTIONS = enumToMessages(VisibilityEnum);

/** 工作流操作处理器 */
export interface WorkflowActions {
  onStart: (w: WorkflowDisplayItem) => void;
  onStop: (w: WorkflowDisplayItem) => void;
  onDesign: (w: WorkflowDisplayItem) => void;
  onNavigate: (w: WorkflowDisplayItem) => void;
  onEditInfo: (w: WorkflowDisplayItem) => void;
  onModifyVisibility: (w: WorkflowDisplayItem, visibility: import('@/enums/enums').VisibilityEnum) => void;
  onClone: (w: WorkflowDisplayItem) => void;
  onAction: (action: string, w: WorkflowDisplayItem, extra?: unknown) => void;
}

interface WorkflowGridViewProps {
  workflows: WorkflowDisplayItem[];
  loading: boolean;
  actions: WorkflowActions;
  /** 是否有搜索/筛选条件（用于空状态文案） */
  hasFilter?: boolean;
  searchQuery?: string;
  onCreateClick?: () => void;
}

export function WorkflowGridView({ workflows, loading, actions, hasFilter = false, searchQuery, onCreateClick }: WorkflowGridViewProps) {
  const displayList = loading ? [] : workflows;
  const [visibilityDialogWorkflow, setVisibilityDialogWorkflow] = useState<WorkflowDisplayItem | null>(null);

  return (
    <>
      {loading ? (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4'>
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className='p-5 dark:bg-gray-800 dark:border-gray-700'>
              <div className='flex items-start justify-between mb-4'>
                <div className='flex items-center gap-3'>
                  <Skeleton className='w-10 h-10 rounded-lg dark:bg-gray-700' />
                  <Skeleton className='w-10 h-10 rounded-lg dark:bg-gray-700' />
                </div>
                <Skeleton className='w-10 h-10 rounded-lg dark:bg-gray-700' />
              </div>
              <div className='flex items-start gap-3 mb-3'>
                <Skeleton className='w-12 h-12 rounded-lg dark:bg-gray-700 shrink-0' />
                <div className='flex-1 space-y-2'>
                  <Skeleton className='h-4 w-28 dark:bg-gray-700' />
                  <Skeleton className='h-5 w-16 rounded dark:bg-gray-700' />
                </div>
              </div>
              <Skeleton className='h-4 w-full mb-2 dark:bg-gray-700' />
              <Skeleton className='h-4 w-3/4 mb-4 dark:bg-gray-700' />
              <div className='flex items-center justify-between'>
                <Skeleton className='h-4 w-12 dark:bg-gray-700' />
                <Skeleton className='h-4 w-16 dark:bg-gray-700' />
              </div>
            </Card>
          ))}
        </div>
      ) : displayList.length > 0 ? (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4'>
          {displayList.map(w => (
          <Card
            key={w.id}
            className='p-5 dark:bg-gray-800 dark:border-gray-700 hover:shadow-lg transition-all flex flex-col h-full'
          >
            <div className='flex-1 min-h-0'>
            {/* 操作按钮区 */}
            <div className='flex items-start justify-between mb-3'>
              <div className='flex items-center gap-3'>
                <button
                  className='p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors'
                  onClick={e => {
                    e.stopPropagation();
                    w.status === WorkflowStatusEnum.RUNNING ? actions.onStop(w) : actions.onStart(w);
                  }}
                  title={w.status === WorkflowStatusEnum.RUNNING ? '停止' : '运行'}
                >
                  {w.status === WorkflowStatusEnum.RUNNING ? (
                    <Square className='w-4 h-4 text-red-600 dark:text-red-400 fill-current' />
                  ) : (
                    <Play className='w-4 h-4 text-green-600 dark:text-green-400' />
                  )}
                </button>
                <button
                  className='p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors'
                  onClick={e => {
                    e.stopPropagation();
                    actions.onDesign(w);
                  }}
                  title='设计工作流'
                >
                  <Edit className='w-4 h-4 text-blue-600 dark:text-blue-400' />
                </button>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className='p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors'>
                    <MoreHorizontal className='w-4 h-4 text-gray-600 dark:text-gray-400' />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end' className='dark:bg-gray-800 dark:border-gray-700'>
                  <DropdownMenuItem
                    onClick={e => {
                      e.stopPropagation();
                      actions.onEditInfo(w);
                    }}
                    className='dark:text-gray-300'
                  >
                    <Pencil className='w-4 h-4 mr-2' />
                    编辑工作流
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={e => {
                      e.stopPropagation();
                      setVisibilityDialogWorkflow(w);
                    }}
                    className='dark:text-gray-300'
                  >
                    <Eye className='w-4 h-4 mr-2' />
                    修改可见性
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={e => {
                      e.stopPropagation();
                      actions.onAction('复制', w);
                    }}
                    className='dark:text-gray-300'
                  >
                    <Copy className='w-4 h-4 mr-2' />
                    复制工作流
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={e => {
                      e.stopPropagation();
                      actions.onAction('删除', w);
                    }}
                    className='text-red-600 dark:text-red-400'
                  >
                    <Trash2 className='w-4 h-4 mr-2' />
                    删除工作流
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* 工作流信息 */}
            <div className='flex items-start gap-3 mb-6'>
              <div
                className={`${w.iconBg} w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0`}
              >
                <WorkflowIcon className={`w-6 h-6 ${w.iconColor}`} />
              </div>
              <div className='flex-1'>
                <h3
                  className='mb-1 text-blue-600 dark:text-blue-400 cursor-pointer'
                  onClick={e => {
                    e.stopPropagation();
                    actions.onNavigate(w);
                  }}
                >
                  {w.name}
                </h3>
                <div className='flex items-center gap-2 flex-wrap'>
                  <Badge className={`text-xs ${w.statusColor} border-0`}>{w.statusDisplay}</Badge>
                  {w.visibilityDisplay && (
                    <span className='text-xs text-gray-500 dark:text-gray-400'>{w.visibilityDisplay}</span>
                  )}
                </div>
              </div>
            </div>

            <p className='text-sm text-gray-600 dark:text-gray-400 line-clamp-2 '>{w.description}</p>
            </div>

            <div className='flex items-center justify-between pt-3 mt-auto shrink-0 border-t border-gray-100 dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400'>
              <span>{w.calls}</span>
              <div className='flex items-center gap-3'>
                <span>{w.successRate}</span>
              </div>
            </div>
          </Card>
          ))}
        </div>
      ) : null}

      {!loading && workflows.length === 0 && (
        <div style={{ marginTop: 100 }}>
          <WorkflowListEmpty
          hasFilter={hasFilter}
          searchQuery={searchQuery}
          onCreateClick={onCreateClick ?? (() => {})}
        />
        </div>
      )}

      <Dialog open={!!visibilityDialogWorkflow} onOpenChange={open => !open && setVisibilityDialogWorkflow(null)}>
        <DialogContent className='!max-w-sm dark:bg-gray-800 dark:border-gray-700'>
          <DialogHeader>
            <DialogTitle>修改可见性</DialogTitle>
          </DialogHeader>
          <div className='grid gap-2 py-2'>
            {VISIBILITY_OPTIONS.map(({ value, message }) => (
              <button
                key={value}
                type='button'
                className='flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-600 px-4 py-3 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-gray-200 transition-colors'
                onClick={() => {
                  if (visibilityDialogWorkflow) {
                    actions.onModifyVisibility(visibilityDialogWorkflow, value);
                    setVisibilityDialogWorkflow(null);
                  }
                }}
              >
                {message}
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
