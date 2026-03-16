/**
 * 工作流表格视图
 * 表格式展示工作流列表
 */
import { useState } from 'react';
import { Workflow as WorkflowIcon, Play, Square, Edit, Trash2, MoreHorizontal, Copy, Pencil, Eye } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { VisibilityEnum, WorkflowStatusEnum } from '@/enums/enums';
import { enumToMessages } from '@/enums/utils';
import type { WorkflowDisplayItem } from '../utils';
import type { WorkflowActions } from './WorkflowGridView';
import { WorkflowListEmpty } from './WorkflowListEmpty';

const VISIBILITY_OPTIONS = enumToMessages(VisibilityEnum);

/** 表格列宽：名称列最多 45% */
const TABLE_COL_LAYOUT = '45% 1fr 1fr 1fr 1fr auto';

interface WorkflowTableViewProps {
  workflows: WorkflowDisplayItem[];
  loading: boolean;
  actions: WorkflowActions;
  hasFilter?: boolean;
  searchQuery?: string;
  onCreateClick?: () => void;
}

export function WorkflowTableView({
  workflows,
  loading,
  actions,
  hasFilter = false,
  searchQuery,
  onCreateClick,
}: WorkflowTableViewProps) {
  const displayList = loading ? [] : workflows;
  const [visibilityDialogWorkflow, setVisibilityDialogWorkflow] = useState<WorkflowDisplayItem | null>(null);

  return (
    <>
      <style>{`.workflow-table-fixed col:first-child { width: 45% !important; min-width: 45% !important; }
.workflow-table-fixed th:first-child,
.workflow-table-fixed td:first-child { width: 45% !important; min-width: 45% !important; box-sizing: border-box; }`}</style>
      {loading ? (
        <Card className='dark:bg-gray-800 dark:border-gray-700 mb-4'>
          <div className='overflow-x-auto w-full'>
            <table className='workflow-table-fixed w-full min-w-full table-fixed' style={{ tableLayout: 'fixed' }}>
              <colgroup>
                <col style={{ width: '45%' }} />
                <col style={{ width: '10%' }} />
                <col style={{ width: '10%' }} />
                <col style={{ width: '12%' }} />
                <col style={{ width: '12%' }} />
                <col style={{ width: '11%' }} />
              </colgroup>
              <thead className='bg-gray-50 dark:bg-gray-900'>
                <tr>
                  <th className='px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400' />
                  <th className='px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400' />
                  <th className='px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400' />
                  <th className='px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400' />
                  <th className='px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400' />
                  <th className='px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400' />
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-200 dark:divide-gray-700'>
                {Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className='border-b border-gray-200 dark:border-gray-700'>
                    <td className='px-6 py-4'>
                      <div className='flex items-center gap-3'>
                        <Skeleton className='w-10 h-10 rounded-lg dark:bg-gray-700 shrink-0' />
                        <div className='space-y-2'>
                          <Skeleton className='h-4 w-32 dark:bg-gray-700' />
                          <Skeleton className='h-3 w-48 dark:bg-gray-700' />
                        </div>
                      </div>
                    </td>
                    <td className='px-6 py-4'>
                      <Skeleton className='h-5 w-14 rounded dark:bg-gray-700' />
                    </td>
                    <td className='px-6 py-4'>
                      <Skeleton className='h-4 w-12 dark:bg-gray-700' />
                    </td>
                    <td className='px-6 py-4'>
                      <Skeleton className='h-4 w-10 dark:bg-gray-700' />
                    </td>
                    <td className='px-6 py-4'>
                      <Skeleton className='h-4 w-12 dark:bg-gray-700' />
                    </td>
                    <td className='px-6 py-4'>
                      <div className='flex gap-2'>
                        <Skeleton className='w-8 h-8 rounded dark:bg-gray-700' />
                        <Skeleton className='w-8 h-8 rounded dark:bg-gray-700' />
                        <Skeleton className='w-8 h-8 rounded dark:bg-gray-700' />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      ) : displayList.length > 0 ? (
        <Card className='dark:bg-gray-800 dark:border-gray-700 mb-4'>
          <div className='overflow-x-auto w-full'>
            <table className='workflow-table-fixed w-full min-w-full table-fixed' style={{ tableLayout: 'fixed' }}>
              <colgroup>
                <col style={{ width: '45%' }} />
                <col />
                <col />
                <col />
                <col />
                <col />
              </colgroup>
              <thead className='bg-gray-50 dark:bg-gray-900'>
                <tr>
                  <th style={{ width: '45%' }} className='px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400'>工作流名称</th>
                  <th className='px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400'>状态</th>
                  <th className='px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400'>可见性</th>
                  <th className='px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400'>今日调用</th>
                  <th className='px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400'>成功率</th>
                  <th className='px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400'>操作</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-200 dark:divide-gray-700'>
                {displayList.map(w => (
                  <tr
                    key={w.id}
                    className='hover:bg-gray-50 dark:hover:bg-gray-900 cursor-pointer'
                    onClick={() => actions.onNavigate(w)}
                  >
                    <td className='px-6 py-4' style={{ width: '45%' }}>
                      <div className='flex items-center gap-3 min-w-0'>
                        <div
                          className={`${w.iconBg} w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0`}
                        >
                          <WorkflowIcon className={`w-5 h-5 ${w.iconColor}`} />
                        </div>
                        <div className='min-w-0 flex-1 overflow-hidden'>
                          <div
                            className='text-sm text-blue-600 dark:text-blue-400 mb-1 cursor-pointer truncate'
                            onClick={e => {
                              e.stopPropagation();
                              actions.onNavigate(w);
                            }}
                          >
                            {w.name}
                          </div>
                          <div className='text-xs text-gray-500 dark:text-gray-400'>{w.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className='px-6 py-4'>
                      <Badge className={`text-xs ${w.statusColor} border-0`}>{w.statusDisplay}</Badge>
                    </td>
                    <td className='px-6 py-4 text-sm text-gray-600 dark:text-gray-400'>
                      {w.visibilityDisplay ?? '--'}
                    </td>
                    <td className='px-6 py-4 text-sm text-gray-600 dark:text-gray-400'>{w.calls}</td>
                    <td className='px-6 py-4 text-sm text-gray-600 dark:text-gray-400'>{w.successRate}</td>
                    <td className='px-6 py-4' onClick={e => e.stopPropagation()}>
                      <div className='flex items-center gap-2'>
                        <button
                          className='p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded'
                          onClick={() =>
                            w.status === WorkflowStatusEnum.RUNNING ? actions.onStop(w) : actions.onStart(w)
                          }
                          title={w.status === WorkflowStatusEnum.RUNNING ? '停止' : '运行'}
                        >
                          {w.status === WorkflowStatusEnum.RUNNING ? (
                            <Square className='w-4 h-4 text-red-600 dark:text-red-400 fill-current' />
                          ) : (
                            <Play className='w-4 h-4 text-green-500' />
                          )}
                        </button>
                        <button
                          className='p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded'
                          onClick={() => actions.onDesign(w)}
                          title='设计工作流'
                        >
                          <Edit className='w-4 h-4 text-blue-600 dark:text-blue-400' />
                        </button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className='p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded'>
                              <MoreHorizontal className='w-4 h-4 text-gray-600 dark:text-gray-400' />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align='end' className='dark:bg-gray-800 dark:border-gray-700'>
                            <DropdownMenuItem onClick={() => actions.onEditInfo(w)} className='dark:text-gray-300'>
                              <Pencil className='w-4 h-4 mr-2' />
                              编辑工作流
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => setVisibilityDialogWorkflow(w)}
                              className='dark:text-gray-300'
                            >
                              <Eye className='w-4 h-4 mr-2' />
                              修改可见性
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => actions.onAction('复制', w)}
                              className='dark:text-gray-300'
                            >
                              <Copy className='w-4 h-4 mr-2' />
                              复制工作流
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => actions.onAction('删除', w)}
                              className='text-red-600 dark:text-red-400'
                            >
                              <Trash2 className='w-4 h-4 mr-2' />
                              删除工作流
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
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
                    actions.onModifyVisibility(visibilityDialogWorkflow, value as VisibilityEnum);
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
