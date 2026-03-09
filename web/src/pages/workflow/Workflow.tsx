import { Workflow as WorkflowIcon, Plus, Play, Edit, Trash2, MoreHorizontal, Copy, ChevronDown, Search, X, Filter, Grid3x3, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, } from '@/components/ui/pagination';
import { useState } from 'react';
import { useLanguage } from '@/components/LanguageProvider.tsx';
import { toast } from 'sonner';
import { CreateWorkflowDialog } from './CreateWorkflowDialog';
import { useNavigate } from 'react-router-dom';

interface WorkflowItem {
  id: number;
  name: string;
  description: string;
  icon: any;
  iconBg: string;
  iconColor: string;
  status: '运行中' | '已停止';
  statusColor: string;
  calls: string;
  successRate: string;
}

export function Workflow() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSort] = useState('default');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  // 分页状态
  const [workflowPage, setWorkflowPage] = useState(1);
  const workflowsPerPage = 6;

  const handleDesignWorkflow = (workflow: { id: number; name: string; status: '运行中' | '已停止' }) => {
    navigate(`/workflow-design?workflowId=${workflow.id}&workflowName=${workflow.name}&workflowStatus=${workflow.status}`);
  };

  // 统计数据
  const stats = [
    {
      label: '工作流总数',
      value: '12',
      subtext: '较上月增加 2个',
      icon: WorkflowIcon,
      iconBg: 'bg-blue-500',
      trend: '+8%',
      trendUp: true,
    },
    {
      label: '运行中',
      value: '5',
      subtext: '正在运行的工作流',
      icon: Play,
      iconBg: 'bg-green-500',
      trend: '+6%',
      trendUp: true,
    },
    {
      label: '今日调用',
      value: '1,248',
      subtext: '累计调用数 302 次',
      icon: WorkflowIcon,
      iconBg: 'bg-orange-500',
      trend: '+22%',
      trendUp: true,
    },
    {
      label: '成功率',
      value: '98.5%',
      subtext: '失败 19 次',
      icon: WorkflowIcon,
      iconBg: 'bg-purple-500',
      trend: '+2%',
      trendUp: true,
    },
  ];

  // 工作流列表
  const workflows: WorkflowItem[] = [
    {
      id: 1,
      name: '客户服务自动化',
      description: '自动处理客户咨询请求并提供相应的解答',
      icon: WorkflowIcon,
      iconBg: 'bg-blue-50 dark:bg-blue-900/20',
      iconColor: 'text-blue-500',
      status: '运行中',
      statusColor: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      calls: '今日运行：156 次',
      successRate: '成功率：99.2%',
    },
    {
      id: 2,
      name: '内容生成流程链',
      description: '自动化内容生成流程，从构思到完稿',
      icon: WorkflowIcon,
      iconBg: 'bg-green-50 dark:bg-green-900/20',
      iconColor: 'text-green-500',
      status: '运行中',
      statusColor: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      calls: '今日运行：89 次',
      successRate: '成功率：97.8%',
    },
    {
      id: 3,
      name: '数据分析评估',
      description: '自动化数据采集分析与可视化展现流程',
      icon: WorkflowIcon,
      iconBg: 'bg-orange-50 dark:bg-orange-900/20',
      iconColor: 'text-orange-500',
      status: '已停止',
      statusColor: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400',
      calls: '今日运行：0 次',
      successRate: '成功率：96.5%',
    },
    {
      id: 4,
      name: '邮件营销自动化',
      description: '自动化邮件营销活动，包括内容生成和发送',
      icon: WorkflowIcon,
      iconBg: 'bg-purple-50 dark:bg-purple-900/20',
      iconColor: 'text-purple-500',
      status: '运行中',
      statusColor: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      calls: '今日运行：234 次',
      successRate: '成功率：98.5%',
    },
    {
      id: 5,
      name: '智能文档处理',
      description: '自动化文档分类、提取和归档处理流程',
      icon: WorkflowIcon,
      iconBg: 'bg-pink-50 dark:bg-pink-900/20',
      iconColor: 'text-pink-500',
      status: '运行中',
      statusColor: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      calls: '今日运行：127 次',
      successRate: '成功率：97.2%',
    },
    {
      id: 6,
      name: '社交媒体发布',
      description: '多平台社交媒体内容自动生成和发布',
      icon: WorkflowIcon,
      iconBg: 'bg-indigo-50 dark:bg-indigo-900/20',
      iconColor: 'text-indigo-500',
      status: '已停止',
      statusColor: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400',
      calls: '今日运行：0 次',
      successRate: '成功率：95.8%',
    },
    {
      id: 7,
      name: '订单处理流程',
      description: '自动化订单确认、处理和通知流程',
      icon: WorkflowIcon,
      iconBg: 'bg-yellow-50 dark:bg-yellow-900/20',
      iconColor: 'text-yellow-600',
      status: '运行中',
      statusColor: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      calls: '今日运行：412 次',
      successRate: '成功率：99.5%',
    },
    {
      id: 8,
      name: '知识库维护',
      description: '自动化知识库内容更新和优化流程',
      icon: WorkflowIcon,
      iconBg: 'bg-teal-50 dark:bg-teal-900/20',
      iconColor: 'text-teal-500',
      status: '运行中',
      statusColor: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      calls: '今日运行：78 次',
      successRate: '成功率：96.9%',
    },
  ];

  const handleAction = (action: string, workflow: WorkflowItem) => {
    if (action === '编辑') {
      navigate(`/workflow/${workflow.id}`);
    } else {
      toast.success(`${action}: ${workflow.name}`);
    }
  };

  // 分页计算
  const totalWorkflowPages = Math.ceil(workflows.length / workflowsPerPage);
  const paginatedWorkflows = workflows.slice((workflowPage - 1) * workflowsPerPage, workflowPage * workflowsPerPage);

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div>
        <h1 className='text-2xl mb-1 dark:text-white'>工作流</h1>
        <p className='text-sm text-gray-600 dark:text-gray-400'>自动化AI任务流程管理</p>
      </div>

      {/* Stats Cards */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className='px-5 pt-5 pb-3 dark:bg-gray-800 dark:border-gray-700'>
              <div className='flex items-start justify-between mb-1.5'>
                <div className={`${stat.iconBg} w-10 h-10 rounded-lg flex items-center justify-center`}>
                  <Icon className='w-5 h-5 text-white' />
                </div>
                {stat.trend && (
                  <span
                    className={`text-sm ${stat.trendUp ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}
                  >
                    {stat.trend}
                  </span>
                )}
              </div>
              <div className='text-base font-semibold text-gray-600 dark:text-gray-400 mb-0.5'>{stat.label}</div>
              <div className='text-3xl dark:text-white mb-0.5'>{stat.value}</div>
              <div className='text-xs text-gray-500 dark:text-gray-400'>{stat.subtext}</div>
            </Card>
          );
        })}
      </div>

      {/* Workflow List Section */}
      <div>
        {/* Action Buttons and Search - 与数据集一致 */}
        <div className='flex items-center justify-between gap-3 mb-4'>
          {/* Search Bar - 左侧390px */}
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

          {/* Action Buttons - 右侧 */}
          <div className='flex items-center gap-3'>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant='outline'
                  size='sm'
                  className='dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300'
                >
                  <Filter className='w-4 h-4 mr-2' />
                  筛选
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end' className='dark:bg-gray-800 dark:border-gray-700'>
                <DropdownMenuItem className='dark:text-gray-300'>全部</DropdownMenuItem>
                <DropdownMenuItem className='dark:text-gray-300'>运行中</DropdownMenuItem>
                <DropdownMenuItem className='dark:text-gray-300'>已停止</DropdownMenuItem>
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

            <Button
              size='sm'
              className='bg-blue-500 hover:bg-blue-600 text-white'
              onClick={() => setCreateDialogOpen(true)}
            >
              <Plus className='w-4 h-4 mr-2' />
              新建工作流
            </Button>
          </div>
        </div>

        {/* Grid View */}
        {viewMode === 'grid' && (
          <>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4'>
              {paginatedWorkflows.map(workflow => {
                const Icon = workflow.icon;
                return (
                  <Card
                    key={workflow.id}
                    className='p-5 dark:bg-gray-800 dark:border-gray-700 hover:shadow-lg transition-all'
                  >
                    <div className='flex items-start justify-between mb-4'>
                      <div className='flex items-center gap-3'>
                        <button
                          className='p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors'
                          onClick={e => {
                            e.stopPropagation();
                            toast.success(`运行工作流: ${workflow.name}`);
                          }}
                          title='运行工作流'
                        >
                          <Play className='w-4 h-4 text-green-600 dark:text-green-400' />
                        </button>
                        <button
                          className='p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors'
                          onClick={e => {
                            e.stopPropagation();
                            handleDesignWorkflow({
                              id: workflow.id,
                              name: workflow.name,
                              status: workflow.status,
                            });
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
                              handleAction('复制', workflow);
                            }}
                            className='dark:text-gray-300'
                          >
                            <Copy className='w-4 h-4 mr-2' />
                            复制工作流
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={e => {
                              e.stopPropagation();
                              handleAction('删除', workflow);
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
                      <div
                        className={`${workflow.iconBg} w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0`}
                      >
                        <Icon className={`w-6 h-6 ${workflow.iconColor}`} />
                      </div>
                      <div className='flex-1'>
                        <h3
                          className='mb-1 text-blue-600 dark:text-blue-400 cursor-pointer'
                          onClick={e => {
                            e.stopPropagation();
                            navigate(`/workflow/${workflow.id}`);
                          }}
                        >
                          {workflow.name}
                        </h3>
                        <Badge className={`text-xs ${workflow.statusColor} border-0`}>{workflow.status}</Badge>
                      </div>
                    </div>

                    <p className='text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2'>{workflow.description}</p>

                    <div className='flex items-center justify-between text-sm text-gray-500 dark:text-gray-400'>
                      <span>{workflow.calls}</span>
                      <span>{workflow.successRate}</span>
                    </div>
                  </Card>
                );
              })}
            </div>

            {/* Pagination for Grid View */}
            {totalWorkflowPages > 1 && (
              <div className='flex justify-center mb-6'>
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => setWorkflowPage(prev => Math.max(1, prev - 1))}
                        className={workflowPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                      />
                    </PaginationItem>
                    {Array.from({ length: totalWorkflowPages }, (_, i) => i + 1).map(page => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={() => setWorkflowPage(page)}
                          isActive={page === workflowPage}
                          className='cursor-pointer'
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext
                        onClick={() => setWorkflowPage(prev => Math.min(totalWorkflowPages, prev + 1))}
                        className={
                          workflowPage === totalWorkflowPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        )}

        {/* Table View */}
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
                    {paginatedWorkflows.map(workflow => {
                      const Icon = workflow.icon;
                      return (
                        <tr
                          key={workflow.id}
                          className='hover:bg-gray-50 dark:hover:bg-gray-900 cursor-pointer'
                          onClick={() => navigate(`/workflow/${workflow.id}`)}
                        >
                          <td className='px-6 py-4'>
                            <div className='flex items-center gap-3'>
                              <div
                                className={`${workflow.iconBg} w-10 h-10 rounded-lg flex items-center justify-center`}
                              >
                                <Icon className={`w-5 h-5 ${workflow.iconColor}`} />
                              </div>
                              <div>
                                <div
                                  className='text-sm text-blue-600 dark:text-blue-400 mb-1 cursor-pointer'
                                  onClick={e => {
                                    e.stopPropagation();
                                    navigate(`/workflow/${workflow.id}`);
                                  }}
                                >
                                  {workflow.name}
                                </div>
                                <div className='text-xs text-gray-500 dark:text-gray-400'>{workflow.description}</div>
                              </div>
                            </div>
                          </td>
                          <td className='px-6 py-4'>
                            <Badge className={`text-xs ${workflow.statusColor} border-0`}>{workflow.status}</Badge>
                          </td>
                          <td className='px-6 py-4 text-sm text-gray-600 dark:text-gray-400'>{workflow.calls}</td>
                          <td className='px-6 py-4 text-sm text-gray-600 dark:text-gray-400'>{workflow.successRate}</td>
                          <td className='px-6 py-4' onClick={e => e.stopPropagation()}>
                            <div className='flex items-center gap-2'>
                              <button
                                className='p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded'
                                onClick={e => {
                                  e.stopPropagation();
                                  toast.success(`启动工作流: ${workflow.name}`);
                                }}
                              >
                                <Play className='w-4 h-4 text-green-500' />
                              </button>
                              <button
                                className='p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded'
                                onClick={e => {
                                  e.stopPropagation();
                                  handleDesignWorkflow({
                                    id: workflow.id,
                                    name: workflow.name,
                                    status: workflow.status,
                                  });
                                }}
                                title='设计工作流'
                              >
                                <Edit className='w-4 h-4 text-blue-600 dark:text-blue-400' />
                              </button>
                              <button
                                className='p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded'
                                onClick={e => {
                                  e.stopPropagation();
                                  handleAction('删除', workflow);
                                }}
                              >
                                <Trash2 className='w-4 h-4 text-red-500' />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Pagination for Table View */}
            {totalWorkflowPages > 1 && (
              <div className='flex justify-center mb-6'>
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => setWorkflowPage(prev => Math.max(1, prev - 1))}
                        className={workflowPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                      />
                    </PaginationItem>
                    {Array.from({ length: totalWorkflowPages }, (_, i) => i + 1).map(page => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={() => setWorkflowPage(page)}
                          isActive={page === workflowPage}
                          className='cursor-pointer'
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext
                        onClick={() => setWorkflowPage(prev => Math.min(totalWorkflowPages, prev + 1))}
                        className={
                          workflowPage === totalWorkflowPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        )}
      </div>

      {/* Create Workflow Dialog */}
      <CreateWorkflowDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} />
    </div>
  );
}
