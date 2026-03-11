import { useCallback, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import Agents from '@/services/Agents';
import type { AgentCountVo, AgentListVo, AgentResourceInfoVo } from '@/services/AgentsTypes';
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
  const [activeTab, setActiveTab] = useState<'all' | 'published' | 'inactive'>('all');
  const statusFilter: 'all' | AgentStatusEnum =
    activeTab === 'published' ? AgentStatusEnum.ACTIVE : activeTab === 'inactive' ? AgentStatusEnum.INACTIVE : 'all';
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [agents, setAgents] = useState<AgentListItem[]>([]);
  const [agentsLoading, setAgentsLoading] = useState(false);
  const [agentsTotal, setAgentsTotal] = useState(0);
  const [counts, setCounts] = useState<AgentCountVo>({
    total: 0,
    active: 0,
    inactive: 0,
  });

  /** 加载 Tab 统计数量（getAgentCounts） */
  const loadCounts = useCallback(async () => {
    try {
      const response = await Agents.getAgentCounts();
      const data = (response as { data?: AgentCountVo })?.data;
      if (data) {
        setCounts({
          total: data.total ?? 0,
          active: data.active ?? 0,
          inactive: data.inactive ?? 0,
        });
      }
    } catch {
      // 静默失败，Tab 数量保持为 0
    }
  }, []);

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

  useEffect(() => {
    loadCounts();
  }, [loadCounts]);

  /** 切换智能体发布/离线状态 */
  const handleToggleStatus = async (agent: AgentListItem) => {
    if (!agent.id || !agent.statusEnum) return;
    const newStatus: AgentStatusEnum =
      agent.statusEnum === AgentStatusEnum.ACTIVE ? AgentStatusEnum.INACTIVE : AgentStatusEnum.ACTIVE;
    try {
      await Agents.updateAgentStatus(agent.id, newStatus);
      toast.success(newStatus === AgentStatusEnum.ACTIVE ? '已发布' : '离线');
      loadAgents();
      loadCounts();
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
      loadCounts();
    } catch (error: any) {
      toast.error(error?.message || '删除失败');
    }
  };

  /** 搜索变更并重置页码 */
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  /** Tab 切换 */
  const handleTabChange = (tab: 'all' | 'published' | 'inactive') => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  /** 根据分类获取数量（来自 getAgentCounts 接口） */
  const getCategoryCount = (tab: 'all' | 'published' | 'inactive') => {
    if (tab === 'all') return counts.total ?? 0;
    if (tab === 'published') return counts.active ?? 0;
    if (tab === 'inactive') return counts.inactive ?? 0;
    return 0;
  };

  return {
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
    loadAgents,
    handleToggleStatus,
    handleDelete,
    handleSearchChange,
    navigate,
    itemsPerPage: AGENT_ITEMS_PER_PAGE,
  };
}
