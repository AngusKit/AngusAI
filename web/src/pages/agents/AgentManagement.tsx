import {
  Bot,
  Search,
  Filter,
  Grid3x3,
  List,
  Edit,
  Trash2,
  MoreVertical,
  Play,
  Pause,
  Plus,
  X,
  MessageSquare,
  Cpu,
  PlayCircle,
  PauseCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { AgentStatusEnum } from '@/enums/enums';
import { getEnumDescription } from '@/enums/utils';
import { InteractionModeEnum } from '@/enums/enums';
import { useAgentList } from './hooks';
import { getAgentStatusColor } from './utils';

/**
 * 智能体列表主页面：与应用列表布局一致，支持 Tab、搜索、网格/列表视图、分页
 */
export function AgentManagement() {
  const {
    searchQuery,
    activeTab,
    handleTabChange,
    getCategoryCount,
    viewMode,
    setViewMode,
    currentPage,
    setCurrentPage,
    agents,
    agentsLoading,
    agentsTotal,
    handleToggleStatus,
    handleDelete,
    handleSearchChange,
    navigate,
    itemsPerPage,
  } = useAgentList();

  const totalPages = Math.max(1, Math.ceil(agentsTotal / itemsPerPage));

  return (
    <div className="space-y-6">
      {/* 标题区域：与应用列表一致 */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-800 rounded-xl p-6 border border-blue-100 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-blue-500 dark:bg-blue-600 rounded-lg flex items-center justify-center shrink-0">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">智能体</h1>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 ml-13">管理智能体，配置模型与能力</p>
      </div>

      {/* Tab 分类：与应用列表一致 */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <div className="flex gap-4 overflow-x-auto">
          <button
            onClick={() => handleTabChange('all')}
            className={`pb-3 px-1 border-b-2 text-sm whitespace-nowrap transition-colors ${
              activeTab === 'all'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
            }`}
          >
            全部 ({getCategoryCount('all')})
          </button>
          <button
            onClick={() => handleTabChange('published')}
            className={`pb-3 px-1 border-b-2 text-sm whitespace-nowrap transition-colors ${
              activeTab === 'published'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
            }`}
          >
            已发布 ({getCategoryCount('published')})
          </button>
          <button
            onClick={() => handleTabChange('inactive')}
            className={`pb-3 px-1 border-b-2 text-sm whitespace-nowrap transition-colors ${
              activeTab === 'inactive'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
            }`}
          >
            离线 ({getCategoryCount('inactive')})
          </button>
        </div>
      </div>

      {/* 搜索与操作栏：与应用列表一致 */}
      <div className="flex items-center justify-between gap-3">
        <div className="relative w-[390px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
          <Input
            type="text"
            placeholder="搜索智能体名称、描述..."
            value={searchQuery}
            onChange={e => handleSearchChange(e.target.value)}
            className="pl-10 pr-10 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 focus-visible:border-blue-500 focus-visible:ring-blue-500/50"
          />
          {searchQuery && (
            <button
              onClick={() => handleSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300">
                <Filter className="w-4 h-4 mr-2" />
                筛选
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="dark:bg-gray-800 dark:border-gray-700">
              <DropdownMenuItem className="dark:text-gray-300">最近创建</DropdownMenuItem>
              <DropdownMenuItem className="dark:text-gray-300">按名称排序</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="flex items-center gap-1 border border-gray-200 dark:border-gray-700 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded ${
                viewMode === 'grid'
                  ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <Grid3x3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded ${
                viewMode === 'list'
                  ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
          <Button size="sm" className="bg-blue-500 hover:bg-blue-600 text-white" onClick={() => navigate('/agents/create')}>
            <Plus className="w-4 h-4 mr-2" />
            创建智能体
          </Button>
        </div>
      </div>

      {/* 智能体列表：网格或列表视图 */}
      <div
        className={
          viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2.5' : 'space-y-3 mt-2.5'
        }
      >
        {agentsLoading ? (
          viewMode === 'grid' ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3">
                    <Skeleton className="w-12 h-12 rounded-xl dark:bg-gray-700" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-5 w-24 dark:bg-gray-700" />
                      <Skeleton className="h-4 w-16 dark:bg-gray-700" />
                    </div>
                  </div>
                </div>
                <Skeleton className="h-4 w-full mb-2 dark:bg-gray-700" />
                <Skeleton className="h-4 w-3/4 mb-4 dark:bg-gray-700" />
                <div className="flex gap-2 mb-4">
                  <Skeleton className="h-6 w-14 rounded-md dark:bg-gray-700" />
                  <Skeleton className="h-6 w-14 rounded-md dark:bg-gray-700" />
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
                  <Skeleton className="h-4 w-16 dark:bg-gray-700" />
                  <Skeleton className="h-8 w-20 dark:bg-gray-700" />
                </div>
              </div>
            ))
          ) : (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                <div className="flex items-center gap-4">
                  <Skeleton className="w-10 h-10 rounded-lg dark:bg-gray-700 shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-32 dark:bg-gray-700" />
                    <Skeleton className="h-3 w-full dark:bg-gray-700" />
                  </div>
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-6 w-16 dark:bg-gray-700" />
                    <Skeleton className="h-5 w-12 dark:bg-gray-700" />
                    <Skeleton className="h-8 w-20 dark:bg-gray-700" />
                  </div>
                </div>
              </div>
            ))
          )
        ) : (
          <>
            {agents.map(agent => (
              <AgentCard
                key={agent.id}
                agent={agent}
                viewMode={viewMode}
                onAgentClick={() => navigate(`/agents/${agent.id}`)}
                onToggleStatus={handleToggleStatus}
                onEdit={() => navigate(`/agents/${agent.id}/edit`)}
                onDelete={handleDelete}
                getStatusColor={getAgentStatusColor}
              />
            ))}
          </>
        )}
      </div>

      {/* 分页：与应用列表一致 */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center mt-6">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <PaginationItem key={page}>
                  <PaginationLink
                    onClick={() => setCurrentPage(page)}
                    isActive={currentPage === page}
                    className="cursor-pointer"
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {/* 空状态：与应用列表一致 */}
      {!agentsLoading && agents.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            {searchQuery ? (
              <Search className="w-8 h-8 text-gray-400 dark:text-gray-600" />
            ) : (
              <Bot className="w-8 h-8 text-gray-400 dark:text-gray-600" />
            )}
          </div>
          <h3 className="text-gray-900 dark:text-white mb-2">{searchQuery ? '未找到相关智能体' : '暂无智能体'}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            {searchQuery ? `没有找到包含"${searchQuery}"的智能体` : '开始创建您的第一个智能体'}
          </p>
          {!searchQuery && (
            <Button className="bg-blue-500 hover:bg-blue-600 text-white" onClick={() => navigate('/agents/create')}>
              <Plus className="w-4 h-4 mr-2" />
              创建智能体
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

/** 智能体卡片（网格/列表通用，与应用列表 ApplicationCard 结构一致） */
function AgentCard({
  agent,
  viewMode,
  onAgentClick,
  onToggleStatus,
  onEdit,
  onDelete,
  getStatusColor,
}: {
  agent: import('./hooks').AgentListItem;
  viewMode: 'grid' | 'list';
  onAgentClick: () => void;
  onToggleStatus: (agent: import('./hooks').AgentListItem) => void;
  onEdit: () => void;
  onDelete: (agent: import('./hooks').AgentListItem) => void;
  getStatusColor: (status?: string) => string;
}) {
  const statusColor = getStatusColor(agent.statusEnum);

  if (viewMode === 'list') {
    return (
      <div
        onClick={onAgentClick}
        className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md dark:hover:shadow-gray-900/50 transition-shadow cursor-pointer group"
      >
        <div className="flex items-center gap-6">
          <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {agent.name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1 mt-0.5">{agent.description}</p>
            <div className="flex items-center gap-4 mt-2 flex-wrap">
              {agent.interactionMode && (
                <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                  <MessageSquare className="w-3.5 h-3.5 shrink-0" />
                  <span>{getEnumDescription(InteractionModeEnum, agent.interactionMode as InteractionModeEnum)}</span>
                </div>
              )}
              {agent.modelName && (
                <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                  <Cpu className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate max-w-[120px]" title={agent.modelName}>{agent.modelName}</span>
                </div>
              )}
              <Badge className={`text-xs ${statusColor} border-0`}>
                {agent.statusEnum === AgentStatusEnum.ACTIVE ? '已发布' : '离线'}
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Button
              size="sm"
              variant="outline"
              onClick={e => (e.stopPropagation(), onEdit())}
              className="gap-2 h-8 dark:border-gray-600 dark:hover:bg-gray-700"
            >
              <Edit className="w-3.5 h-3.5" />
              编辑
            </Button>
            <button
              onClick={e => (e.stopPropagation(), onToggleStatus(agent))}
              className="p-1.5 rounded transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
              disabled={!agent.statusEnum}
              title={agent.statusEnum === AgentStatusEnum.ACTIVE ? '下线智能体' : '发布智能体'}
            >
              {agent.statusEnum === AgentStatusEnum.ACTIVE ? (
                <Pause className="w-4 h-4 text-blue-500" />
              ) : (
                <Play className="w-4 h-4 text-green-500" />
              )}
            </button>
            <AgentDropdownMenu agent={agent} onToggleStatus={onToggleStatus} onEdit={onEdit} onDelete={onDelete} />
          </div>
        </div>
      </div>
    );
  }

  // 网格视图
  return (
    <div
      onClick={onAgentClick}
      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md dark:hover:shadow-gray-900/50 transition-shadow cursor-pointer group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {agent.name}
            </h3>
            <Badge className={`text-xs ${statusColor} border-0`}>
              {agent.statusEnum === AgentStatusEnum.ACTIVE ? '已发布' : '离线'}
            </Badge>
          </div>
        </div>
        <AgentDropdownMenu agent={agent} onToggleStatus={onToggleStatus} onEdit={onEdit} onDelete={onDelete} />
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">{agent.description}</p>
      <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400">
        <span className="flex items-center gap-1">
          <MessageSquare className="w-4 h-4 shrink-0" />
          {agent.interactionMode
            ? getEnumDescription(InteractionModeEnum, agent.interactionMode as InteractionModeEnum)
            : '--'}
        </span>
        <span className="flex items-center gap-1 truncate max-w-[160px]" title={agent.modelName}>
          <Cpu className="w-4 h-4 shrink-0" />
          {agent.modelName ?? '未配置模型'}
        </span>
      </div>
    </div>
  );
}

/** 智能体卡片更多操作下拉菜单 */
function AgentDropdownMenu({
  agent,
  onToggleStatus,
  onEdit,
  onDelete,
}: {
  agent: import('./hooks').AgentListItem;
  onToggleStatus: (agent: import('./hooks').AgentListItem) => void;
  onEdit: () => void;
  onDelete: (agent: import('./hooks').AgentListItem) => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          onClick={e => e.stopPropagation()}
          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors opacity-0 group-hover:opacity-100"
        >
          <MoreVertical className="w-4 h-4 text-gray-600 dark:text-gray-400" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="dark:bg-gray-800 dark:border-gray-700">
        {agent.statusEnum === AgentStatusEnum.ACTIVE && (
          <>
            <DropdownMenuItem
              onClick={e => {
                e.stopPropagation();
                onToggleStatus(agent);
              }}
              className="dark:text-gray-300"
            >
              <PauseCircle className="w-4 h-4 mr-2" />
              下线智能体
            </DropdownMenuItem>
            <DropdownMenuSeparator className="dark:bg-gray-700" />
          </>
        )}
        {agent.statusEnum === AgentStatusEnum.INACTIVE && (
          <>
            <DropdownMenuItem
              onClick={e => {
                e.stopPropagation();
                onToggleStatus(agent);
              }}
              className="dark:text-gray-300"
            >
              <PlayCircle className="w-4 h-4 mr-2" />
              发布
            </DropdownMenuItem>
            <DropdownMenuSeparator className="dark:bg-gray-700" />
          </>
        )}
        <DropdownMenuItem onClick={e => (e.stopPropagation(), onEdit())} className="dark:text-gray-300">
          <Edit className="w-4 h-4 mr-2" />
          编辑智能体
        </DropdownMenuItem>
        <DropdownMenuSeparator className="dark:bg-gray-700" />
        <DropdownMenuItem onClick={e => (e.stopPropagation(), onDelete(agent))} className="text-red-600 dark:text-red-400">
          <Trash2 className="w-4 h-4 mr-2" />
          删除智能体
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
