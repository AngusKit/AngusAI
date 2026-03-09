import { Workflow as WorkflowIcon, Plus, Play, Edit, Trash2, MoreHorizontal, Copy, Search, X, Filter, Grid3x3, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { useState } from 'react';
import { toast } from 'sonner';
import { CreateWorkflowDialog } from './components/CreateWorkflowDialog.tsx';
import { useNavigate } from 'react-router-dom';
import { useWorkflowList, getStatsFromStatistics, type WorkflowDisplayItem } from './hooks/useWorkflowList';
import Workflows from '@/services/Workflows';
import { WorkflowStatusEnum } from '@/enums/enums';

export function Workflow() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const {
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    currentPage,
    setCurrentPage,
    workflows,
    totalPages,
    loading,
    statistics,
    statsLoading,
    loadWorkflows,
  } = useWorkflowList();

  const statsDisplay = getStatsFromStatistics(statistics);
  const stats = [
    {
      label: '工作流总数',
      value: statsLoading ? '--' : statsDisplay.totalWorkflows,
      subtext: '全部工作流',
      icon: WorkflowIcon,
      iconBg: 'bg-blue-500',
    },
    {
      label: '运行中',
      value: statsLoading ? '--' : statsDisplay.runningWorkflows,
      subtext: '正在运行的工作流',
      icon: Play,
      iconBg: 'bg-green-500',
    },
    {
      label: '今日调用',
      value: statsLoading ? '--' : statsDisplay.todayCalls,
      subtext: '累计调用次数',
      icon: WorkflowIcon,
      iconBg: 'bg-orange-500',
    },
    {
      label: '成功率',
      value: statsLoading ? '--' : statsDisplay.successRate,
      subtext: '执行成功率',
      icon: WorkflowIcon,
      iconBg: 'bg-purple-500',
    },
  ];

  const handleDesignWorkflow = (w: WorkflowDisplayItem) => {
    navigate(
      `/workflow-design?workflowId=${w.id}&workflowName=${encodeURIComponent(w.name)}&workflowStatus=${w.statusDisplay}`
    );
  };

  const handleStartWorkflow = async (w: WorkflowDisplayItem) => {
    try {
      await Workflows.startWorkflow(w.id);
      toast.success(`工作流已启动: ${w.name}`);
      loadWorkflows();
    } catch (e: unknown) {
      toast.error((e as { message?: string })?.message ?? '启动失败');
    }
  };

  const handleStopWorkflow = async (w: WorkflowDisplayItem) => {
    try {
      await Workflows.stopWorkflow(w.id);
      toast.success(`工作流已停止: ${w.name}`);
      loadWorkflows();
    } catch (e: unknown) {
      toast.error((e as { message?: string })?.message ?? '停止失败');
    }
  };

  const handleDeleteWorkflow = async (w: WorkflowDisplayItem) => {
    try {
      await Workflows.deleteWorkflow(w.id);
      toast.success(`工作流已删除: ${w.name}`);
      loadWorkflows();
    } catch (e: unknown) {
      toast.error((e as { message?: string })?.message ?? '删除失败');
    }
  };

  const handleAction = (action: string, w: WorkflowDisplayItem) => {
    if (action === '编辑') {
      navigate(`/workflow/${w.id}`);
    } else if (action === '删除') {
      handleDeleteWorkflow(w);
    } else {
      toast.info(`${action}功能敬请期待`);
    }
  };

  const handleCreateSuccess = () => {
    loadWorkflows();
    setCreateDialogOpen(false);
  };

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-2xl mb-1 dark:text-white'>工作流</h1>
        <p className='text-sm text-gray-600 dark:text-gray-400'>自动化AI任务流程管理</p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className='px-5 pt-5 pb-3 dark:bg-gray-800 dark:border-gray-700'>
              <div className='flex items-start justify-between mb-1.5'>
                <div className={`${stat.iconBg} w-10 h-10 rounded-lg flex items-center justify-center`}>
                  <Icon className='w-5 h-5 text-white' />
                </div>
              </div>
              <div className='text-base font-semibold text-gray-600 dark:text-gray-400 mb-0.5'>{stat.label}</div>
              <div className='text-3xl dark:text-white mb-0.5'>{stat.value}</div>
              <div className='text-xs text-gray-500 dark:text-gray-400'>{stat.subtext}</div>
            </Card>
          );
        })}
      </div>

      <div>
        <div className='flex items-center justify-between gap-3 mb-4'>
          <div className='relative w-[390px]'>
            <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500' />
            <Input
              type='text'
              placeholder='搜索工作流名称或描述...'
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className='pl-10 pr-10 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 focus-visible:border-blue-500 focus-visible:ring-blue-500/50'
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors'
              >
                <X className='w-4 h-4' />
              </button>
            )}
          </div>

          <div className='flex items-center gap-3'>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='outline' size='sm' className='dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300'>
                  <Filter className='w-4 h-4 mr-2' />
                  筛选
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end' className='dark:bg-gray-800 dark:border-gray-700'>
                <DropdownMenuItem
                  className='dark:text-gray-300'
                  onClick={() => setStatusFilter('all')}
                >
                  全部
                </DropdownMenuItem>
                <DropdownMenuItem
                  className='dark:text-gray-300'
                  onClick={() => setStatusFilter(WorkflowStatusEnum.RUNNING)}
                >
                  运行中
                </DropdownMenuItem>
                <DropdownMenuItem
                  className='dark:text-gray-300'
                  onClick={() => setStatusFilter(WorkflowStatusEnum.STOPPED)}
                >
                  已停止
                </DropdownMenuItem>
                <DropdownMenuItem
                  className='dark:text-gray-300'
                  onClick={() => setStatusFilter(WorkflowStatusEnum.DRAFT)}
                >
                  草稿
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <div className='flex items-center gap-1 border border-gray-200 dark:border-gray-700 rounded-lg p-1'>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded ${
                  viewMode === 'grid'
                    ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Grid3x3 className='w-4 h-4' />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded ${
                  viewMode === 'table'
                    ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <List className='w-4 h-4' />
              </button>
            </div>

            <Button size='sm' className='bg-blue-500 hover:bg-blue-600 text-white' onClick={() => setCreateDialogOpen(true)}>
              <Plus className='w-4 h-4 mr-2' />
              新建工作流
            </Button>
          </div>
        </div>

        {viewMode === 'grid' && (
          <>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4'>
              {(loading ? [] : workflows).map(w => (
                <Card key={w.id} className='p-5 dark:bg-gray-800 dark:border-gray-700 hover:shadow-lg transition-all'>
                  <div className='flex items-start justify-between mb-4'>
                    <div className='flex items-center gap-3'>
                      <button
                        className='p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors'
                        onClick={e => {
                          e.stopPropagation();
                          if (w.status === WorkflowStatusEnum.RUNNING) {
                            handleStopWorkflow(w);
                          } else {
                            handleStartWorkflow(w);
                          }
                        }}
                        title={w.status === WorkflowStatusEnum.RUNNING ? '停止' : '运行'}
                      >
                        <Play className='w-4 h-4 text-green-600 dark:text-green-400' />
                      </button>
                      <button
                        className='p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors'
                        onClick={e => {
                          e.stopPropagation();
                          handleDesignWorkflow(w);
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
                            handleAction('复制', w);
                          }}
                          className='dark:text-gray-300'
                        >
                          <Copy className='w-4 h-4 mr-2' />
                          复制工作流
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={e => {
                            e.stopPropagation();
                            handleAction('删除', w);
                          }}
                          className='text-red-600 dark:text-red-400'
                        >
                          <Trash2 className='w-4 h-4 mr-2' />
                          删除工作流
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className='flex items-start gap-3 mb-3'>
                    <div className={`${w.iconBg} w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <WorkflowIcon className={`w-6 h-6 ${w.iconColor}`} />
                    </div>
                    <div className='flex-1'>
                      <h3
                        className='mb-1 text-blue-600 dark:text-blue-400 cursor-pointer'
                        onClick={e => {
                          e.stopPropagation();
                          navigate(`/workflow/${w.id}`);
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

            {loading && (
              <div className='text-center py-12 text-gray-500 dark:text-gray-400'>加载中...</div>
            )}

            {!loading && workflows.length === 0 && (
              <div className='text-center py-12 text-gray-500 dark:text-gray-400'>暂无工作流，点击「新建工作流」创建</div>
            )}

            {totalPages > 1 && (
              <div className='flex justify-center mb-6'>
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                      />
                    </PaginationItem>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={() => setCurrentPage(page)}
                          isActive={page === currentPage}
                          className='cursor-pointer'
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        )}

        {viewMode === 'table' && (
          <>
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
                    {(loading ? [] : workflows).map(w => (
                      <tr
                        key={w.id}
                        className='hover:bg-gray-50 dark:hover:bg-gray-900 cursor-pointer'
                        onClick={() => navigate(`/workflow/${w.id}`)}
                      >
                        <td className='px-6 py-4'>
                          <div className='flex items-center gap-3'>
                            <div className={`${w.iconBg} w-10 h-10 rounded-lg flex items-center justify-center`}>
                              <WorkflowIcon className={`w-5 h-5 ${w.iconColor}`} />
                            </div>
                            <div>
                              <div
                                className='text-sm text-blue-600 dark:text-blue-400 mb-1 cursor-pointer'
                                onClick={e => {
                                  e.stopPropagation();
                                  navigate(`/workflow/${w.id}`);
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
                                w.status === WorkflowStatusEnum.RUNNING ? handleStopWorkflow(w) : handleStartWorkflow(w)
                              }
                            >
                              <Play className='w-4 h-4 text-green-500' />
                            </button>
                            <button
                              className='p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded'
                              onClick={() => handleDesignWorkflow(w)}
                              title='设计工作流'
                            >
                              <Edit className='w-4 h-4 text-blue-600 dark:text-blue-400' />
                            </button>
                            <button
                              className='p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded'
                              onClick={() => handleAction('删除', w)}
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

            {loading && (
              <div className='text-center py-6 text-gray-500 dark:text-gray-400'>加载中...</div>
            )}

            {totalPages > 1 && (
              <div className='flex justify-center mb-6'>
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                      />
                    </PaginationItem>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={() => setCurrentPage(page)}
                          isActive={page === currentPage}
                          className='cursor-pointer'
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        )}
      </div>

      <CreateWorkflowDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSuccess={handleCreateSuccess}
      />
    </div>
  );
}
