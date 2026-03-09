/**
 * 工作流网格视图
 * 卡片式展示工作流列表
 */
import { Workflow as WorkflowIcon, Play, Edit, Trash2, MoreHorizontal, Copy } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { WorkflowStatusEnum } from '@/enums/enums';
import type { WorkflowDisplayItem } from '../utils';

/** 工作流操作处理器 */
export interface WorkflowActions {
  onStart: (w: WorkflowDisplayItem) => void;
  onStop: (w: WorkflowDisplayItem) => void;
  onDesign: (w: WorkflowDisplayItem) => void;
  onNavigate: (w: WorkflowDisplayItem) => void;
  onAction: (action: string, w: WorkflowDisplayItem) => void;
}

interface WorkflowGridViewProps {
  workflows: WorkflowDisplayItem[];
  loading: boolean;
  actions: WorkflowActions;
}

export function WorkflowGridView({ workflows, loading, actions }: WorkflowGridViewProps) {
  const displayList = loading ? [] : workflows;

  return (
    <>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4'>
        {displayList.map(w => (
          <Card
            key={w.id}
            className='p-5 dark:bg-gray-800 dark:border-gray-700 hover:shadow-lg transition-all'
          >
            {/* 操作按钮区 */}
            <div className='flex items-start justify-between mb-4'>
              <div className='flex items-center gap-3'>
                <button
                  className='p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors'
                  onClick={e => {
                    e.stopPropagation();
                    w.status === WorkflowStatusEnum.RUNNING ? actions.onStop(w) : actions.onStart(w);
                  }}
                  title={w.status === WorkflowStatusEnum.RUNNING ? '停止' : '运行'}
                >
                  <Play className='w-4 h-4 text-green-600 dark:text-green-400' />
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
            <div className='flex items-start gap-3 mb-3'>
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
                <Badge className={`text-xs ${w.statusColor} border-0`}>{w.statusDisplay}</Badge>
              </div>
            </div>

            <p className='text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2'>{w.description}</p>

            <div className='flex items-center justify-between text-sm text-gray-500 dark:text-gray-400'>
              <span>{w.calls}</span>
              <span>{w.successRate}</span>
            </div>
          </Card>
        ))}
      </div>

      {loading && <div className='text-center py-12 text-gray-500 dark:text-gray-400'>加载中...</div>}
      {!loading && workflows.length === 0 && (
        <div className='text-center py-12 text-gray-500 dark:text-gray-400'>暂无工作流，点击「新建工作流」创建</div>
      )}
    </>
  );
}
