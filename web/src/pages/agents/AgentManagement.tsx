import { Bot, Search, Filter, Grid3x3, List, Edit, Trash2, MoreHorizontal, Play, Pause, Plus, Cpu, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { XcanPagination } from '@/components/ui/pagination';
import { AgentStatusEnum } from '@/enums/enums';
import { getEnumDescription } from '@/enums/utils';
import { InteractionModeEnum } from '@/enums/enums';
import { useAgentList } from './hooks';
import { getAgentStatusColor } from './utils';

/**
 * 智能体列表主页面：展示所有智能体，支持搜索、筛选、分页、发布/删除
 */
export function AgentManagement() {
  const {
    searchQuery,
    statusFilter,
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
    handleStatusFilterChange,
    navigate,
    itemsPerPage,
  } = useAgentList();

  return (
    <div className="space-y-6">
      {/* 标题 */}
      <div>
        <h1 className="text-2xl mb-1 dark:text-white">智能体</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">管理智能体，配置模型与能力</p>
      </div>

      {/* 搜索与操作栏 */}
      <div className="flex items-center justify-between gap-3">
        <div className="relative w-[390px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="搜索智能体..."
            value={searchQuery}
            onChange={e => handleSearchChange(e.target.value)}
            className="pl-9 dark:bg-gray-800 dark:border-gray-700"
          />
        </div>
        <div className="flex items-center gap-2">
          <Select value={statusFilter} onValueChange={v => handleStatusFilterChange(v as 'all' | AgentStatusEnum)}>
            <SelectTrigger className="w-[140px] dark:bg-gray-800 dark:border-gray-700">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="状态" />
            </SelectTrigger>
            <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
              <SelectItem value="all" className="dark:text-gray-300">全部状态</SelectItem>
              <SelectItem value={AgentStatusEnum.ACTIVE} className="dark:text-gray-300">已发布</SelectItem>
              <SelectItem value={AgentStatusEnum.INACTIVE} className="dark:text-gray-300">离线</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center gap-1 border border-gray-200 dark:border-gray-700 rounded-lg p-1">
            <Button
              variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="h-8 w-8 p-0"
            >
              <Grid3x3 className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="h-8 w-8 p-0"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
          <Button onClick={() => navigate('/agents/create')} className="bg-blue-500 hover:bg-blue-600">
            <Plus className="w-4 h-4 mr-2" />
            创建智能体
          </Button>
        </div>
      </div>

      {/* 加载中：Skeleton 骨架屏 */}
      {agentsLoading ? (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="p-5 dark:bg-gray-800 dark:border-gray-700">
                <div className="flex items-start justify-between mb-2">
                  <Skeleton className="w-8 h-8 rounded-lg dark:bg-gray-700" />
                  <Skeleton className="w-8 h-8 rounded-lg dark:bg-gray-700" />
                </div>
                <div className="flex items-start gap-3">
                  <Skeleton className="w-12 h-12 rounded-lg dark:bg-gray-700 shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-24 dark:bg-gray-700" />
                    <Skeleton className="h-4 w-16 dark:bg-gray-700" />
                  </div>
                </div>
                <Skeleton className="h-4 w-full mt-3 mb-2 dark:bg-gray-700" />
                <Skeleton className="h-4 w-3/4 mb-3 dark:bg-gray-700" />
                <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
                  <Skeleton className="h-4 w-20 dark:bg-gray-700" />
                  <Skeleton className="h-4 w-16 dark:bg-gray-700" />
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3"
              >
                <div className="flex items-center gap-4">
                  <Skeleton className="w-10 h-10 rounded-lg dark:bg-gray-700 shrink-0" />
                  <div className="flex-1 space-y-2 min-w-0">
                    <Skeleton className="h-4 w-32 dark:bg-gray-700" />
                    <Skeleton className="h-3 w-full dark:bg-gray-700" />
                  </div>
                  <div className="flex items-center gap-4 shrink-0">
                    <Skeleton className="h-4 w-20 dark:bg-gray-700" />
                    <Skeleton className="h-4 w-24 dark:bg-gray-700" />
                    <Skeleton className="h-5 w-14 dark:bg-gray-700" />
                    <Skeleton className="h-8 w-8 rounded dark:bg-gray-700" />
                    <Skeleton className="h-8 w-8 rounded dark:bg-gray-700" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      ) : agents.length === 0 ? (
        /* 空状态 */
        <Card className="py-16 px-8 text-center dark:bg-gray-800 dark:border-gray-700 border-2 border-dashed border-gray-200 dark:border-gray-600">
          <div className="flex flex-col items-center max-w-md mx-auto">
            <div className="bg-gradient-to-br from-orange-100 to-orange-50 dark:from-orange-900/30 dark:to-orange-800/20 w-20 h-20 rounded-2xl flex items-center justify-center mt-5 mb-6">
              <Bot className="w-20 h-20 text-orange-500 dark:text-orange-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">暂无智能体</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 leading-relaxed">
              请先创建智能体，配置模型与能力，开启 AI 对话体验
            </p>
          </div>
        </Card>
      ) : viewMode === 'grid' ? (
        /* 网格视图 */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {agents.map(agent => (
            <AgentCard
              key={agent.id}
              agent={agent}
              variant="grid"
              onToggleStatus={handleToggleStatus}
              onDelete={handleDelete}
              onNavigate={navigate}
              getStatusColor={getAgentStatusColor}
            />
          ))}
        </div>
      ) : (
        /* 列表视图 */
        <div className="space-y-3">
          {agents.map(agent => (
            <AgentCard
              key={agent.id}
              agent={agent}
              variant="list"
              onToggleStatus={handleToggleStatus}
              onDelete={handleDelete}
              onNavigate={navigate}
              getStatusColor={getAgentStatusColor}
            />
          ))}
        </div>
      )}

      {/* 分页 */}
      {agentsTotal > itemsPerPage && (
        <XcanPagination
          pageSize={itemsPerPage}
          pageNo={currentPage}
          total={agentsTotal}
          onChange={({ pageNo }) => setCurrentPage(pageNo)}
        />
      )}
    </div>
  );
}

/** 智能体卡片（网格/列表通用） */
function AgentCard({
  agent,
  variant,
  onToggleStatus,
  onDelete,
  onNavigate,
  getStatusColor,
}: {
  agent: import('./hooks').AgentListItem & { modelName?: string };
  variant: 'grid' | 'list';
  onToggleStatus: (agent: import('./hooks').AgentListItem) => void;
  onDelete: (agent: import('./hooks').AgentListItem) => void;
  onNavigate: (path: string) => void;
  getStatusColor: (status?: string) => string;
}) {
  const statusColor = getStatusColor(agent.statusEnum);

  if (variant === 'list') {
    return (
      <div
        onClick={() => onNavigate(`/agents/${agent.id}`)}
        className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 hover:shadow-md dark:hover:shadow-gray-900/50 transition-shadow cursor-pointer group"
      >
        <div className="flex items-center gap-4">
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-blue-600 dark:text-blue-400 cursor-pointer" onClick={e => (e.stopPropagation(), onNavigate(`/agents/${agent.id}`))}>
              {agent.name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1">{agent.description}</p>
          </div>
          <div className="flex items-center gap-4 shrink-0">
            <div className="text-sm text-gray-500 dark:text-gray-400 min-w-[100px]">
              {agent.interactionMode ? getEnumDescription(InteractionModeEnum, agent.interactionMode as InteractionModeEnum) : '--'}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 min-w-[80px] truncate" title={agent.modelName}>
              {agent.modelName ?? '--'}
            </div>
            <Badge className={`text-xs ${statusColor} border-0 shrink-0`}>
              {agent.statusEnum === 'ACTIVE' ? '已发布' : '离线'}
            </Badge>
            <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
              <button
                onClick={() => onToggleStatus(agent)}
                className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                disabled={!agent.statusEnum}
              >
                {agent.statusEnum === 'ACTIVE' ? <Pause className="w-4 h-4 text-orange-500" /> : <Play className="w-4 h-4 text-green-500" />}
              </button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors opacity-0 group-hover:opacity-100">
                    <MoreHorizontal className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="dark:bg-gray-800 dark:border-gray-700">
                  <DropdownMenuItem onClick={e => (e.stopPropagation(), onNavigate(`/agents/${agent.id}/edit`))} className="dark:text-gray-300">
                    <Edit className="w-4 h-4 mr-2" />
                    编辑智能体
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={e => (e.stopPropagation(), onDelete(agent))} className="text-red-600 dark:text-red-400">
                    <Trash2 className="w-4 h-4 mr-2" />
                    删除智能体
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 网格视图
  return (
    <Card className="p-5 dark:bg-gray-800 dark:border-gray-700 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-2">
        <button
          onClick={e => (e.stopPropagation(), onToggleStatus(agent))}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          disabled={!agent.statusEnum}
        >
          {agent.statusEnum === 'ACTIVE' ? (
            <Pause className="w-4 h-4 text-orange-600 dark:text-orange-400" />
          ) : (
            <Play className="w-4 h-4 text-green-600 dark:text-green-400" />
          )}
        </button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={e => e.stopPropagation()}>
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
              <MoreHorizontal className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="dark:bg-gray-800 dark:border-gray-700">
            <DropdownMenuItem onClick={e => (e.stopPropagation(), onNavigate(`/agents/${agent.id}/edit`))} className="dark:text-gray-300">
              <Edit className="w-4 h-4 mr-2" />
              编辑智能体
            </DropdownMenuItem>
            <DropdownMenuItem onClick={e => (e.stopPropagation(), onDelete(agent))} className="text-red-600 dark:text-red-400">
              <Trash2 className="w-4 h-4 mr-2" />
              删除智能体
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="flex items-start gap-3">
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
          <Bot className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="mb-1 text-blue-600 dark:text-blue-400 cursor-pointer" onClick={() => onNavigate(`/agents/${agent.id}`)}>
            {agent.name}
          </h3>
          <Badge className={`text-xs ${statusColor} border-0`}>
            {agent.statusEnum === 'ACTIVE' ? '已发布' : '离线'}
          </Badge>
        </div>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">{agent.description}</p>
      <div className="border-t border-gray-100 dark:border-gray-700 pt-3">
        <div className="flex flex-wrap gap-2 text-xs text-gray-500 dark:text-gray-400">
          {agent.interactionMode && (
            <span className="flex items-center gap-1">
              <MessageSquare className="w-3.5 h-3.5" />
              {getEnumDescription(InteractionModeEnum, agent.interactionMode as InteractionModeEnum)}
            </span>
          )}
          {agent.modelName && (
            <span className="flex items-center gap-1 ml-auto">
              <Cpu className="w-3.5 h-3.5" />
              {agent.modelName}
            </span>
          )}
        </div>
      </div>
    </Card>
  );
}
