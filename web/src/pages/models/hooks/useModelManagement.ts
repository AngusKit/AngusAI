/**
 * 模型管理业务逻辑 Hook
 */

import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { useDebounce } from '@/hooks/useDebounce';
import ModelsService from '@/services/Models';
import { GetModelListParamsOrderByEnum, ModelDetailVo, ModelListVo, ModelStatisticsVo } from '@/services/ModelsTypes';
import { ModelProviderEnum, ModelStatusEnum, ModelTypeEnum } from '@/enums/enums';
import { Database, Activity, TrendingUp, Zap } from 'lucide-react';
import { PAGINATION_CONFIG, SEARCH_DEBOUNCE_MS } from '../constants';
import {
  formatNumber,
  formatCurrency,
  formatLatency,
  formatThroughput,
  formatAccuracy,
  formatDate,
  getModelTypeConfig,
  getModelStatusConfig,
} from '../utils';
import { ModelListItem } from '../types.ts';
import { getEnumDescription } from '@/enums/utils';

export type SortOption = 'default' | 'name' | 'provider' | 'status' | 'createdDate';

interface UseModelManagementReturn {
  // State
  models: ModelListItem[];
  modelsLoading: boolean;
  modelsTotal: number;
  stats: ModelStatisticsVo | null;
  currentPage: number;
  searchQuery: string;
  typeFilter: 'all' | ModelTypeEnum;
  statusFilter: 'all' | ModelStatusEnum;
  sortBy: SortOption;
  viewMode: 'grid' | 'list';
  
  // Actions
  setCurrentPage: (page: number) => void;
  setSearchQuery: (query: string) => void;
  setTypeFilter: (filter: 'all' | ModelTypeEnum) => void;
  setStatusFilter: (filter: 'all' | ModelStatusEnum) => void;
  setSortBy: (sort: SortOption) => void;
  setViewMode: (mode: 'grid' | 'list') => void;
  
  // Methods
  loadModels: () => Promise<void>;
  loadStatistics: () => Promise<void>;
  handleToggleStatus: (model: ModelListItem) => Promise<void>;
  fetchModelDetail: (modelId: string) => Promise<ModelDetailVo | undefined>;
  
  // Computed
  statsCards: Array<{
    key: string;
    label: string;
    value: string;
    subtext: string;
    icon: any;
    iconBg: string;
    trend?: string;
    trendUp: boolean;
  }>;
  shouldShowPagination: boolean;
}

export const useModelManagement = (language: string): UseModelManagementReturn => {
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, SEARCH_DEBOUNCE_MS);
  const [typeFilter, setTypeFilter] = useState<'all' | ModelTypeEnum>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | ModelStatusEnum>('all');
  const [sortBy, setSortBy] = useState<SortOption>('default');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(PAGINATION_CONFIG.DEFAULT_PAGE);
  const itemsPerPage = PAGINATION_CONFIG.DEFAULT_PAGE_SIZE;

  const [models, setModels] = useState<ModelListItem[]>([]);
  const [modelsLoading, setModelsLoading] = useState(false);
  const [modelsTotal, setModelsTotal] = useState(0);
  const [stats, setStats] = useState<ModelStatisticsVo | null>(null);


  const resolveOrderBy = useCallback((value: SortOption): GetModelListParamsOrderByEnum | undefined => {
    switch (value) {
      case 'name':
        return GetModelListParamsOrderByEnum.Name;
      case 'provider':
        return GetModelListParamsOrderByEnum.Provider;
      case 'status':
        return GetModelListParamsOrderByEnum.Status;
      case 'createdDate':
        return GetModelListParamsOrderByEnum.CreatedDate;
      default:
        return undefined;
    }
  }, []);

  const buildModelListItem = useCallback(
    (item: ModelListVo, detail?: ModelDetailVo): ModelListItem | null => {
      const id = item.id !== undefined && item.id !== null ? String(item.id) : '';
      if (!id) {
        return null;
      }

      const typeConfig = getModelTypeConfig(item.type);
      const statusConfig = getModelStatusConfig(item.status);
      const providerLabel = getEnumDescription(ModelProviderEnum, item.provider ?? detail?.provider ?? '');
      const detailStats = detail?.stats;
      const performance = detail?.performance;
      const tokens = detailStats?.totalTokensConsumed ?? detailStats?.totalTokens;
      const createdDate = detail?.createdDate ?? item.createdDate;
      const deployed = formatDate(createdDate, language);

      return {
        id,
        name: item.name ?? detail?.name ?? '--',
        description: item.description ?? detail?.description ?? '--',
        type: typeConfig.label,
        typeEnum: item.type as ModelTypeEnum | undefined,
        icon: typeConfig.icon,
        iconBg: typeConfig.iconBg,
        iconColor: typeConfig.iconColor,
        provider: providerLabel,
        providerEnum: item.provider as ModelProviderEnum | undefined,
        version: item.version ?? detail?.version ?? '--',
        status: statusConfig.label,
        statusEnum: item.status as ModelStatusEnum | undefined,
        statusColor: statusConfig.color,
        performance: {
          latency: formatLatency(performance),
          throughput: formatThroughput(performance),
          accuracy: formatAccuracy(performance),
        },
        resources: {
          cpu: '--',
          memory: '--',
          gpu: '--',
        },
        calls: formatNumber(detailStats?.totalCalls),
        cost: detailStats?.totalCost !== undefined ? formatCurrency(detailStats.totalCost, language) : '--',
        tokens: tokens !== undefined ? formatNumber(tokens) : undefined,
        deployed,
        detail,
      };
    },
    [language]
  );

  const loadStatistics = useCallback(async () => {
    try {
      const response = await ModelsService.getModelStatistics();
      const responseData = (response as any)?.data;
      setStats(responseData ?? null);
    } catch (error: any) {
      console.error('Failed to load model statistics:', error);
      toast.error(error?.message || (language === 'zh-CN' ? '获取模型统计失败' : 'Failed to load statistics'));
    }
  }, [language]);

  const loadModels = useCallback(async () => {
    setModelsLoading(true);
    try {
      const response = await ModelsService.getModelList({
        keyword: debouncedSearchQuery.trim() || undefined,
        pageNo: currentPage,
        pageSize: itemsPerPage,
        type: typeFilter === 'all' ? undefined : typeFilter,
        status: statusFilter === 'all' ? undefined : statusFilter,
        orderBy: resolveOrderBy(sortBy),
      });

      const responseData = (response as any).data;
      let listData: ModelListVo[] | undefined;
      if (responseData) {
        listData = responseData.list;
      }

      setModelsTotal(responseData?.total ?? listData?.length ?? 0);

      const normalized = await Promise.all(
        (listData ?? []).map(async item => {
          const itemId = item.id !== undefined && item.id !== null ? String(item.id) : '';
          let detail: ModelDetailVo | undefined;
          if (itemId) {
            try {
              const detailResponse = await ModelsService.getModelDetail(itemId);
              detail = (detailResponse as any)?.data;
            } catch (detailError) {
              console.error('Failed to load model detail:', detailError);
            }
          }
          return buildModelListItem(item, detail);
        })
      );

      setModels(normalized.filter(Boolean) as ModelListItem[]);
    } catch (error: any) {
      console.error('Failed to load models:', error);
      toast.error(error?.message || (language === 'zh-CN' ? '加载模型列表失败' : 'Failed to load models'));
    } finally {
      setModelsLoading(false);
    }
  }, [
    buildModelListItem,
    currentPage,
    debouncedSearchQuery,
    itemsPerPage,
    resolveOrderBy,
    sortBy,
    statusFilter,
    typeFilter,
    language,
  ]);

  const fetchModelDetail = useCallback(async (modelId: string) => {
    try {
      const response = await ModelsService.getModelDetail(modelId);
      return (response as any)?.data as ModelDetailVo | undefined;
    } catch (error: any) {
      console.error('Failed to fetch model detail:', error);
      throw error;
    }
  }, []);

  const handleToggleStatus = useCallback(
    async (model: ModelListItem) => {
      if (!model.id || !model.statusEnum) {
        return;
      }

      try {
        if (model.statusEnum === ModelStatusEnum.RUNNING) {
          await ModelsService.stopModel(model.id, { graceful: true });
          toast.success(
            language === 'zh-CN' ? `${model.name} 已停止` : `${model.name} stopped`
          );
        } else {
          await ModelsService.startModel(model.id);
          toast.success(
            language === 'zh-CN' ? `${model.name} 已启动` : `${model.name} started`
          );
        }
        await loadModels();
        await loadStatistics();
      } catch (error: any) {
        console.error('Failed to toggle model status:', error);
        toast.error(error?.message || (language === 'zh-CN' ? '更新模型状态失败' : 'Failed to update status'));
      }
    },
    [loadModels, loadStatistics, language]
  );

  const statsCards = useMemo(() => {
    const today = stats?.todayGrowthTrend;
    const lastMonth = stats?.lastMonthGrowthTrend;
    const averageLatency = stats?.averageLatencyMs;

    const totalModelsValue = formatNumber(stats?.totalModels);
    const totalCostValue = stats?.totalCost !== undefined ? formatCurrency(stats?.totalCost, language) : '--';
    const totalCallsValue = formatNumber(stats?.totalCalls);
    const latencyValue = averageLatency !== undefined && averageLatency !== null ? `${averageLatency}ms` : '--';

    return [
      {
        key: 'totalModels',
        label: language === 'zh-CN' ? '模型总数' : 'Total Models',
        value: totalModelsValue,
        subtext:
          today?.addedModels !== undefined
            ? language === 'zh-CN'
              ? `今日新增 ${formatNumber(today.addedModels)}`
              : `Added today ${formatNumber(today.addedModels)}`
            : language === 'zh-CN'
              ? '暂无今日数据'
              : 'No daily data',
        icon: Database,
        iconBg: 'bg-blue-500',
        trend: lastMonth?.addedModels !== undefined ? `+${formatNumber(lastMonth.addedModels)}` : undefined,
        trendUp: (lastMonth?.addedModels ?? 0) >= 0,
      },
      {
        key: 'totalCost',
        label: language === 'zh-CN' ? '总成本' : 'Total Cost',
        value: totalCostValue,
        subtext:
          today?.addedCost !== undefined
            ? language === 'zh-CN'
              ? `今日新增 ${formatCurrency(today.addedCost, language)}`
              : `Added today ${formatCurrency(today.addedCost, language)}`
            : language === 'zh-CN'
              ? '暂无今日数据'
              : 'No daily data',
        icon: Activity,
        iconBg: 'bg-green-500',
        trend: lastMonth?.addedCost !== undefined ? `+${formatCurrency(lastMonth.addedCost, language)}` : undefined,
        trendUp: (lastMonth?.addedCost ?? 0) >= 0,
      },
      {
        key: 'totalCalls',
        label: language === 'zh-CN' ? '总调用次数' : 'Total Calls',
        value: totalCallsValue,
        subtext:
          today?.addedCalls !== undefined
            ? language === 'zh-CN'
              ? `今日新增 ${formatNumber(today.addedCalls)}`
              : `Added today ${formatNumber(today.addedCalls)}`
            : language === 'zh-CN'
              ? '暂无今日数据'
              : 'No daily data',
        icon: TrendingUp,
        iconBg: 'bg-orange-500',
        trend: lastMonth?.addedCalls !== undefined ? `+${formatNumber(lastMonth.addedCalls)}` : undefined,
        trendUp: (lastMonth?.addedCalls ?? 0) >= 0,
      },
      {
        key: 'latency',
        label: language === 'zh-CN' ? '平均延迟' : 'Avg Latency',
        value: latencyValue,
        subtext:
          today?.latencyDecreaseFromYesterdayMs !== undefined
            ? language === 'zh-CN'
              ? `较昨日改善 ${today.latencyDecreaseFromYesterdayMs}ms`
              : `Improved ${today.latencyDecreaseFromYesterdayMs}ms vs yesterday`
            : language === 'zh-CN'
              ? '暂无数据'
              : 'No data',
        icon: Zap,
        iconBg: 'bg-purple-500',
        trend:
          today?.latencyDecreaseFromYesterdayMs !== undefined
            ? `-${today.latencyDecreaseFromYesterdayMs}ms`
            : undefined,
        trendUp: true,
      },
    ];
  }, [language, stats]);

  const shouldShowPagination = useMemo(() => {
    return modelsTotal > itemsPerPage;
  }, [modelsTotal, itemsPerPage]);

  useEffect(() => {
    loadStatistics();
  }, [loadStatistics]);

  useEffect(() => {
    loadModels();
  }, [loadModels]);

  return {
    models,
    modelsLoading,
    modelsTotal,
    stats,
    currentPage,
    searchQuery,
    typeFilter,
    statusFilter,
    sortBy,
    viewMode,
    setCurrentPage,
    setSearchQuery,
    setTypeFilter,
    setStatusFilter,
    setSortBy,
    setViewMode,
    loadModels,
    loadStatistics,
    handleToggleStatus,
    fetchModelDetail,
    statsCards,
    shouldShowPagination,
  };
};

