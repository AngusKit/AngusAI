/**
 * 工作流表格视图
 * 表格式展示工作流列表
 */
import { Workflow as WorkflowIcon, Play, Edit, Trash2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { WorkflowStatusEnum } from '@/enums/enums';
import type { WorkflowDisplayItem } from '../utils';
import type { WorkflowActions } from './WorkflowGridView';
import { WorkflowListEmpty } from './WorkflowListEmpty';

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

  return (
    <>
      {loading ? (
        <Card className='dark:bg-gray-800 dark:border-gray-700 mb-4'>
          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead className='bg-gray-50 dark:bg-gray-900'>
                <tr>
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
          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead className='bg-gray-50 dark:bg-gray-900'>
                <tr>
                  <th className='px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400'>工作流名称</th>
                  <th className='px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400'>状态</th>
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
                    <td className='px-6 py-4'>
                      <div className='flex items-center gap-3'>
                        <div
                          className={`${w.iconBg} w-10 h-10 rounded-lg flex items-center justify-center`}
                        >
                          <WorkflowIcon className={`w-5 h-5 ${w.iconColor}`} />
                        </div>
                        <div>
                          <div
                            className='text-sm text-blue-600 dark:text-blue-400 mb-1 cursor-pointer'
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
                    <td className='px-6 py-4 text-sm text-gray-600 dark:text-gray-400'>{w.calls}</td>
                    <td className='px-6 py-4 text-sm text-gray-600 dark:text-gray-400'>{w.successRate}</td>
                    <td className='px-6 py-4' onClick={e => e.stopPropagation()}>
                      <div className='flex items-center gap-2'>
                        <button
                          className='p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded'
                          onClick={() =>
                            w.status === WorkflowStatusEnum.RUNNING ? actions.onStop(w) : actions.onStart(w)
                          }
                        >
                          <Play className='w-4 h-4 text-green-500' />
                        </button>
                        <button
                          className='p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded'
                          onClick={() => actions.onDesign(w)}
                          title='设计工作流'
                        >
                          <Edit className='w-4 h-4 text-blue-600 dark:text-blue-400' />
                        </button>
                        <button
                          className='p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded'
                          onClick={() => actions.onAction('删除', w)}
                        >
                          <Trash2 className='w-4 h-4 text-red-500' />
                        </button>
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
    </>
  );
}
