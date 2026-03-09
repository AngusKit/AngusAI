import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot, Search, Filter, Grid3x3, List, Edit, Trash2, MoreHorizontal, Play, Pause, Plus, Cpu, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { XcanPagination } from '@/components/ui/pagination';
import { toast } from 'sonner';
import { useDebounce } from '@/hooks/useDebounce';
import Agents from '@/services/Agents';
import Models from '@/services/Models';
import { AgentListVo } from '@/services/AgentsTypes';
import { AgentStatusEnum } from '@/enums/enums';
import { getEnumDescription } from '@/enums/utils';
import { InteractionModeEnum } from '@/enums/enums';

interface AgentListItem {
  id: string;
  name: string;
  description: string;
  status: string;
  statusEnum?: AgentStatusEnum;
  interactionMode?: string;
  modelId?: string;
  modelName?: string;
}

const AGENT_STATUS_CONFIG: Record<string, { color: string }> = {
  ACTIVE: { color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
  INACTIVE: { color: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400' },
};

export function AgentManagement() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const [statusFilter, setStatusFilter] = useState<'all' | AgentStatusEnum>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const [agents, setAgents] = useState<AgentListItem[]>([]);
  const [agentsLoading, setAgentsLoading] = useState(false);
  const [agentsTotal, setAgentsTotal] = useState(0);
  const [modelMap, setModelMap] = useState<Record<string, string>>({});

  const loadModels = useCallback(async () => {
    try {
      const res = await Models.getModelList({ pageNo: 1, pageSize: 500 });
      const list = (res as any)?.data?.list ?? [];
      const map: Record<string, string> = {};
      for (const m of list) {
        if (m?.id && m?.name) map[String(m.id)] = m.name;
      }
      setModelMap(map);
    } catch {
      // ignore
    }
  }, []);

  const loadAgents = useCallback(async () => {
    setAgentsLoading(true);
    try {
      const res = await Agents.getAgentList({
        keyword: debouncedSearchQuery.trim() || undefined,
        status: statusFilter === 'all' ? undefined : statusFilter,
        pageNo: currentPage,
        pageSize: itemsPerPage,
      });
      const data = (res as any)?.data;
      const list: AgentListVo[] = data?.list ?? [];
      setAgentsTotal(data?.total ?? 0);
      setAgents(
        list.map((item) => ({
          id: String(item.id ?? ''),
          name: item.name ?? '--',
          description: item.description ?? '--',
          status: item.status ?? 'INACTIVE',
          statusEnum: item.status as AgentStatusEnum | undefined,
          interactionMode: item.interactionMode,
          modelId: (item as any).modelId ?? (item as any).defaultModelId,
        }))
      );
    } catch (error: any) {
      console.error('Failed to load agents:', error);
      toast.error(error?.message || '加载智能体列表失败');
      setAgents([]);
      setAgentsTotal(0);
    } finally {
      setAgentsLoading(false);
    }
  }, [debouncedSearchQuery, statusFilter, currentPage]);

  useEffect(() => {
    loadModels();
  }, [loadModels]);

  useEffect(() => {
    loadAgents();
  }, [loadAgents]);

  const agentsWithModels = agents.map((a) => ({
    ...a,
    modelName: a.modelId && modelMap[a.modelId] ? modelMap[a.modelId] : undefined,
  }));

  const handleToggleStatus = async (agent: AgentListItem) => {
    if (!agent.id || !agent.statusEnum) return;
    const newStatus: AgentStatusEnum =
      agent.statusEnum === AgentStatusEnum.ACTIVE ? AgentStatusEnum.INACTIVE : AgentStatusEnum.ACTIVE;
    try {
      await Agents.updateAgentStatus(agent.id, newStatus);
      toast.success(newStatus === AgentStatusEnum.ACTIVE ? '已发布' : '离线');
      loadAgents();
    } catch (error: any) {
      toast.error(error?.message || '操作失败');
    }
  };

  const handleDelete = async (agent: AgentListItem) => {
    if (!agent.id) return;
    try {
      await Agents.deleteAgent(agent.id);
      toast.success('智能体已删除');
      loadAgents();
    } catch (error: any) {
      toast.error(error?.message || '删除失败');
    }
  };

  const getStatusConfig = (status?: string) =>
    AGENT_STATUS_CONFIG[status ?? ''] ?? AGENT_STATUS_CONFIG.INACTIVE ?? { color: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400' };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl mb-1 dark:text-white">智能体</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          管理智能体，配置模型与能力
        </p>
      </div>

      <div className="flex items-center justify-between gap-3">
        <div className="relative w-[390px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="搜索智能体..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-9 dark:bg-gray-800 dark:border-gray-700"
          />
        </div>
        <div className="flex items-center gap-2">
          <Select
            value={statusFilter}
            onValueChange={(v) => {
              setStatusFilter(v as 'all' | AgentStatusEnum);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-[140px] dark:bg-gray-800 dark:border-gray-700">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="状态" />
            </SelectTrigger>
            <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
              <SelectItem value="all" className="dark:text-gray-300">
                全部状态
              </SelectItem>
              <SelectItem value={AgentStatusEnum.ACTIVE} className="dark:text-gray-300">
                已发布
              </SelectItem>
              <SelectItem value={AgentStatusEnum.INACTIVE} className="dark:text-gray-300">
                离线
              </SelectItem>
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
          <Button
            onClick={() => navigate('/agents/create')}
            className="bg-blue-500 hover:bg-blue-600"
          >
            <Plus className="w-4 h-4 mr-2" />
            创建智能体
          </Button>
        </div>
      </div>

      {agentsLoading ? (
        <Card className="p-12 text-center dark:bg-gray-800 dark:border-gray-700">
          <Bot className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg mb-2 dark:text-white">加载中...</h3>
        </Card>
      ) : agents.length === 0 ? (
        <Card className="py-16 px-8 text-center dark:bg-gray-800 dark:border-gray-700 border-2 border-dashed border-gray-200 dark:border-gray-600">
          <div className="flex flex-col items-center max-w-md mx-auto">
            <div className="bg-gradient-to-br from-orange-100 to-orange-50 dark:from-orange-900/30 dark:to-orange-800/20 w-20 h-20 rounded-2xl flex items-center justify-center mt-5 mb-6">
              <Bot className="w-20 h-20 text-orange-500 dark:text-orange-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
              暂无智能体
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 leading-relaxed">
              请先创建智能体，配置模型与能力，开启 AI 对话体验
            </p>
          </div>
        </Card>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {agentsWithModels.map((agent) => {
            const statusCfg = getStatusConfig(agent.statusEnum);
            return (
              <Card
                key={agent.id}
                className="p-5 dark:bg-gray-800 dark:border-gray-700 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleStatus(agent);
                    }}
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
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                        <MoreHorizontal className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="dark:bg-gray-800 dark:border-gray-700">
                      <DropdownMenuItem onClick={(e) => { e.stopPropagation(); navigate(`/agents/${agent.id}/edit`); }} className="dark:text-gray-300">
                        <Edit className="w-4 h-4 mr-2" />
                        编辑智能体
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={(e) => { e.stopPropagation(); handleDelete(agent); }}
                        className="text-red-600 dark:text-red-400"
                      >
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
                    <h3
                      className="mb-1 text-blue-600 dark:text-blue-400 cursor-pointer"
                      onClick={(e) => { e.stopPropagation(); navigate(`/agents/${agent.id}`); }}
                    >
                      {agent.name}
                    </h3>
                    <Badge className={`text-xs ${statusCfg?.color ?? 'bg-gray-100 text-gray-700'} border-0`}>
                      {agent.statusEnum === 'ACTIVE' ? '已发布' : '离线'}
                    </Badge>
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
                  {agent.description}
                </p>
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
          })}
        </div>
      ) : (
        <div className="space-y-3">
          {agentsWithModels.map((agent) => {
            const statusCfg = getStatusConfig(agent.statusEnum);
            return (
              <div
                key={agent.id}
                onClick={() => navigate(`/agents/${agent.id}`)}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 hover:shadow-md dark:hover:shadow-gray-900/50 transition-shadow cursor-pointer group"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-gradient-to-br from-orange-500 to-orange-600 w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3
                      className="text-blue-600 dark:text-blue-400 cursor-pointer"
                      onClick={(e) => { e.stopPropagation(); navigate(`/agents/${agent.id}`); }}
                    >
                      {agent.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1">{agent.description}</p>
                  </div>
                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-sm text-gray-500 dark:text-gray-400 min-w-[100px]">
                      {agent.interactionMode
                        ? getEnumDescription(InteractionModeEnum, agent.interactionMode as InteractionModeEnum)
                        : '--'}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 min-w-[80px] truncate" title={agent.modelName}>
                      {agent.modelName ?? '--'}
                    </div>
                    <Badge className={`text-xs ${statusCfg?.color ?? 'bg-gray-100 text-gray-700'} border-0 shrink-0`}>
                      {agent.statusEnum === 'ACTIVE' ? '已发布' : '离线'}
                    </Badge>
                    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => handleToggleStatus(agent)}
                        className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                        disabled={!agent.statusEnum}
                      >
                        {agent.statusEnum === 'ACTIVE' ? (
                          <Pause className="w-4 h-4 text-orange-500" />
                        ) : (
                          <Play className="w-4 h-4 text-green-500" />
                        )}
                      </button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors opacity-0 group-hover:opacity-100">
                            <MoreHorizontal className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="dark:bg-gray-800 dark:border-gray-700">
                          <DropdownMenuItem
                            onClick={(e) => { e.stopPropagation(); navigate(`/agents/${agent.id}/edit`); }}
                            className="dark:text-gray-300"
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            编辑智能体
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(e) => { e.stopPropagation(); handleDelete(agent); }}
                            className="text-red-600 dark:text-red-400"
                          >
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
          })}
        </div>
      )}

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
