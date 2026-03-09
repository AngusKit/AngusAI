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

const ITEMS_PER_PAGE = 6;

/** 状态枚举到展示文案的映射 */
const statusDisplayMap: Record<WorkflowStatusEnum, string> = {
  [WorkflowStatusEnum.DRAFT]: '草稿',
  [WorkflowStatusEnum.RUNNING]: '运行中',
  [WorkflowStatusEnum.STOPPED]: '已停止',
};

/** 状态对应的样式 */
const statusColorMap: Record<WorkflowStatusEnum, string> = {
  [WorkflowStatusEnum.DRAFT]: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400',
  [WorkflowStatusEnum.RUNNING]: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  [WorkflowStatusEnum.STOPPED]: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400',
};

export interface WorkflowDisplayItem {
  id: string;
  name: string;
  description: string;
  iconBg: string;
  iconColor: string;
  status: WorkflowStatusEnum | string;
  statusDisplay: string;
  statusColor: string;
  calls: string;
  successRate: string;
}

const ICON_BG_MAP: Record<string, { bg: string; color: string }> = {
  'bg-blue-500': { bg: 'bg-blue-50 dark:bg-blue-900/20', color: 'text-blue-500' },
  'bg-green-500': { bg: 'bg-green-50 dark:bg-green-900/20', color: 'text-green-500' },
  'bg-orange-500': { bg: 'bg-orange-50 dark:bg-orange-900/20', color: 'text-orange-500' },
  'bg-purple-500': { bg: 'bg-purple-50 dark:bg-purple-900/20', color: 'text-purple-500' },
  'bg-pink-500': { bg: 'bg-pink-50 dark:bg-pink-900/20', color: 'text-pink-500' },
  'bg-indigo-500': { bg: 'bg-indigo-50 dark:bg-indigo-900/20', color: 'text-indigo-500' },
  'bg-yellow-500': { bg: 'bg-yellow-50 dark:bg-yellow-900/20', color: 'text-yellow-600' },
  'bg-teal-500': { bg: 'bg-teal-50 dark:bg-teal-900/20', color: 'text-teal-500' },
};

function mapWorkflowVoToItem(vo: WorkflowListVo): WorkflowDisplayItem {
  const status = (vo.status ?? WorkflowStatusEnum.DRAFT) as WorkflowStatusEnum;
  const stats = vo.stats as Record<string, unknown> | undefined;
  const todayCalls = stats?.todayCalls != null ? Number(stats.todayCalls) : 0;
  const successRateVal = stats?.successRate != null ? Number(stats.successRate) : null;
  const iconStyle = ICON_BG_MAP[vo.iconBg ?? ''] ?? ICON_BG_MAP['bg-blue-500'];

  return {
    id: vo.id ?? '',
    name: vo.name ?? '',
    description: vo.description ?? '',
    iconBg: iconStyle.bg,
    iconColor: iconStyle.color,
    status,
    statusDisplay: statusDisplayMap[status] ?? status,
    statusColor: statusColorMap[status] ?? statusColorMap[WorkflowStatusEnum.DRAFT],
    calls: `今日运行：${todayCalls} 次`,
    successRate: successRateVal != null ? `成功率：${successRateVal.toFixed(1)}%` : '--',
  };
}

export function useWorkflowList() {
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 500);
  const [statusFilter, setStatusFilter] = useState<WorkflowStatusEnum | 'all'>('all');
  const [sortBy, setSortBy] = useState<GetWorkflowListOrderByEnum>(GetWorkflowListOrderByEnum.CreatedDate);
  const [currentPage, setCurrentPage] = useState(1);
  const [workflows, setWorkflows] = useState<WorkflowDisplayItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [statistics, setStatistics] = useState<WorkflowStatisticsVo | null>(null);
  const [statsLoading, setStatsLoading] = useState(false);

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

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
      console.error('Failed to load workflow list:', e);
      toast.error((e as { message?: string })?.message ?? '加载工作流列表失败');
      setWorkflows([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, statusFilter, currentPage, sortBy]);

  const loadStatistics = useCallback(async () => {
    setStatsLoading(true);
    try {
      const res = await Workflows.getWorkflowStatistics({ period: 'month' });
      const data = (res as { data?: WorkflowStatisticsVo }).data;
      setStatistics(data ?? null);
    } catch (e: unknown) {
      console.error('Failed to load workflow statistics:', e);
      setStatistics(null);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadWorkflows();
  }, [loadWorkflows]);

  useEffect(() => {
    loadStatistics();
  }, [loadStatistics]);

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

export function getStatsFromStatistics(stats: WorkflowStatisticsVo | null): {
  totalWorkflows: string;
  runningWorkflows: string;
  todayCalls: string;
  successRate: string;
} {
  if (!stats) {
    return {
      totalWorkflows: '--',
      runningWorkflows: '--',
      todayCalls: '--',
      successRate: '--',
    };
  }
  const total = stats.totalWorkflows ?? 0;
  const running = stats.runningWorkflows ?? 0;
  const today = stats.todayCalls ?? 0;
  const rate = stats.successRate ?? 0;
  return {
    totalWorkflows: String(total),
    runningWorkflows: String(running),
    todayCalls: today.toLocaleString(),
    successRate: rate ? `${rate.toFixed(1)}%` : '--',
  };
}
