/**
 * 工作流列表页数据与状态管理 Hook
 */
import { useCallback, useEffect, useState } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import { toast } from 'sonner';
import Workflows from '@/services/Workflows';
import {
  WorkflowListVo,
  WorkflowStatisticsVo,
  GetWorkflowListOrderByEnum,
} from '@/services/WorkflowsTypes';
import { WorkflowStatusEnum } from '@/enums/enums';
import { ITEMS_PER_PAGE, SEARCH_DEBOUNCE_MS } from '../constants';
import { mapWorkflowVoToItem } from '../utils';

// 导出类型供外部使用
export type { WorkflowDisplayItem } from '../utils';
export { getStatsFromStatistics } from '../utils';

/**
 * 工作流列表 Hook
 * - 管理搜索、筛选、分页状态
 * - 加载工作流列表与统计数据
 */
export function useWorkflowList() {
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, SEARCH_DEBOUNCE_MS);
  const [statusFilter, setStatusFilter] = useState<WorkflowStatusEnum | 'all'>('all');
  const [sortBy, setSortBy] = useState<GetWorkflowListOrderByEnum>(GetWorkflowListOrderByEnum.CreatedDate);
  const [currentPage, setCurrentPage] = useState(1);
  const [workflows, setWorkflows] = useState<import('../utils').WorkflowDisplayItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [statistics, setStatistics] = useState<WorkflowStatisticsVo | null>(null);
  const [statsLoading, setStatsLoading] = useState(false);

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  /** 加载工作流列表 */
  const loadWorkflows = useCallback(async () => {
    setLoading(true);
    try {
      const res = await Workflows.getWorkflowList({
        keyword: debouncedSearch.trim() || undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        pageNo: currentPage,
        pageSize: ITEMS_PER_PAGE,
        orderBy: sortBy,
      });
      const data = (res as { data?: { list?: WorkflowListVo[]; total?: number } }).data;
      const list = data?.list ?? [];
      const total = data?.total ?? 0;
      setWorkflows(list.map(mapWorkflowVoToItem));
      setTotalCount(total);
    } catch (e: unknown) {
      console.error('加载工作流列表失败:', e);
      toast.error((e as { message?: string })?.message ?? '加载工作流列表失败');
      setWorkflows([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, statusFilter, currentPage, sortBy]);

  /** 加载统计数据 */
  const loadStatistics = useCallback(async () => {
    setStatsLoading(true);
    try {
      const res = await Workflows.getWorkflowStatistics();
      const data = (res as { data?: WorkflowStatisticsVo }).data;
      setStatistics(data ?? null);
    } catch (e: unknown) {
      console.error('加载工作流统计失败:', e);
      setStatistics(null);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  // 搜索或筛选变化时重新加载列表
  useEffect(() => {
    loadWorkflows();
  }, [loadWorkflows]);

  // 挂载时加载统计
  useEffect(() => {
    loadStatistics();
  }, [loadStatistics]);

  // 搜索/筛选变化时重置到第一页
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, statusFilter]);

  return {
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    sortBy,
    setSortBy,
    currentPage,
    setCurrentPage,
    workflows,
    totalPages,
    totalCount,
    loading,
    statistics,
    statsLoading,
    loadWorkflows,
    loadStatistics,
  };
}
