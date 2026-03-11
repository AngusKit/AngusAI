import { useCallback, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import Agents from '@/services/Agents';
import type { AgentListVo, AgentResourceInfoVo } from '@/services/AgentsTypes';
import { AgentStatusEnum } from '@/enums/enums';
import { useDebounce } from '@/hooks/useDebounce';
import { AGENT_ITEMS_PER_PAGE } from '../constants';

/** 智能体列表项（前端展示用） */
export interface AgentListItem {
  id: string;
  name: string;
  description: string;
  status: string;
  statusEnum?: AgentStatusEnum;
  interactionMode?: string;
  defaultModel?: AgentResourceInfoVo;
  modelName?: string;
}

/**
 * 智能体列表页 Hook：加载列表、状态切换、删除（模型名称由后端 defaultModel 返回）
 */
export function useAgentList() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const [statusFilter, setStatusFilter] = useState<'all' | AgentStatusEnum>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [agents, setAgents] = useState<AgentListItem[]>([]);
  const [agentsLoading, setAgentsLoading] = useState(false);
  const [agentsTotal, setAgentsTotal] = useState(0);

  /** 加载智能体列表 */
  const loadAgents = useCallback(async () => {
    setAgentsLoading(true);
    try {
      const res = await Agents.getAgentList({
        keyword: debouncedSearchQuery.trim() || undefined,
        status: statusFilter === 'all' ? undefined : statusFilter,
        pageNo: currentPage,
        pageSize: AGENT_ITEMS_PER_PAGE,
      });
      const data = (res as any)?.data;
      const list: AgentListVo[] = data?.list ?? [];
      setAgentsTotal(data?.total ?? 0);
      setAgents(
        list.map(item => ({
          id: String(item.id ?? ''),
          name: item.name ?? '--',
          description: item.description ?? '--',
          status: item.status ?? 'INACTIVE',
          statusEnum: item.status as AgentStatusEnum | undefined,
          interactionMode: item.interactionMode,
          defaultModel: item.defaultModel,
          modelName: item.defaultModel?.name,
        }))
      );
    } catch (error: any) {
      toast.error(error?.message || '加载智能体列表失败');
      setAgents([]);
      setAgentsTotal(0);
    } finally {
      setAgentsLoading(false);
    }
  }, [debouncedSearchQuery, statusFilter, currentPage]);

  useEffect(() => {
    loadAgents();
  }, [loadAgents]);

  /** 切换智能体发布/离线状态 */
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

  /** 删除智能体 */
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

  /** 搜索变更并重置页码 */
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  /** 状态筛选变更并重置页码 */
  const handleStatusFilterChange = (v: 'all' | AgentStatusEnum) => {
    setStatusFilter(v);
    setCurrentPage(1);
  };

  return {
    searchQuery,
    statusFilter,
    viewMode,
    setViewMode,
    currentPage,
    setCurrentPage,
    agents,
    agentsLoading,
    agentsTotal,
    loadAgents,
    handleToggleStatus,
    handleDelete,
    handleSearchChange,
    handleStatusFilterChange,
    navigate,
    itemsPerPage: AGENT_ITEMS_PER_PAGE,
  };
}
