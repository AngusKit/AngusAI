/**
 * 向量存储管理业务逻辑 Hook
 */

import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { useDebounce } from '@/hooks/useDebounce';
import VectorStoresService from '@/services/VectorStores';
import { ConnectionStatusEnum, VectorStoreTypeEnum } from '@/enums/enums';
import type { VectorStoreVo, VectorStoreStatisticsVo } from '@/services/VectorStoresTypes';
import { PAGINATION_CONFIG, SEARCH_DEBOUNCE_MS } from '../constants';
import {
  formatNumber,
  formatVectorCount,
  formatDateTime,
  getVectorStoreTypeInfo,
  getVectorStoreStatusInfo,
  buildEndpointFromConfig,
} from '../utils';
import type { VectorStoreItem, VectorStoreStatus } from '../types';
import { Database, CheckCircle2, Activity, Zap } from 'lucide-react';

interface UseVectorStoreManagementReturn {
  // State
  vectorStores: VectorStoreItem[];
  vectorStoresLoading: boolean;
  vectorStoresTotal: number;
  statistics: VectorStoreStatisticsVo | null;
  statisticsLoading: boolean;
  currentPage: number;
  searchQuery: string;
  viewMode: 'grid' | 'list';
  
  // Actions
  setCurrentPage: (page: number) => void;
  setSearchQuery: (query: string) => void;
  setViewMode: (mode: 'grid' | 'list') => void;
  
  // Methods
  loadVectorStores: () => Promise<void>;
  loadStatistics: () => Promise<void>;
  ensureVectorStoreDetail: (store: VectorStoreItem) => Promise<VectorStoreItem>;
  
  // Computed
  statsCards: Array<{
    key: string;
    label: string;
    value: string;
    subtext: string;
    icon: any;
    iconBg: string;
  }>;
  shouldShowPagination: boolean;
}

export const useVectorStoreManagement = (language: string): UseVectorStoreManagementReturn => {
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, SEARCH_DEBOUNCE_MS);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(PAGINATION_CONFIG.DEFAULT_PAGE);
  const itemsPerPage = PAGINATION_CONFIG.DEFAULT_PAGE_SIZE;

  const [vectorStores, setVectorStores] = useState<VectorStoreItem[]>([]);
  const [vectorStoresLoading, setVectorStoresLoading] = useState(false);
  const [vectorStoresTotal, setVectorStoresTotal] = useState(0);
  const [statistics, setStatistics] = useState<VectorStoreStatisticsVo | null>(null);
  const [statisticsLoading, setStatisticsLoading] = useState(false);

  const normalizeVectorStoreItem = useCallback(
    (store?: VectorStoreVo): VectorStoreItem | null => {
      if (!store?.id) {
        return null;
      }
      const type = store.type ?? VectorStoreTypeEnum.PINECONE;
      const config = store.config;
      const endpoint = buildEndpointFromConfig(config);
      const dimension = config?.dimension;

      return {
        id: String(store.id),
        name: store.name ?? String(store.id),
        type,
        description: store.description ?? '--',
        endpoint,
        status: store.status ?? ConnectionStatusEnum.DISCONNECTED,
        enabled: Boolean(store.enabled),
        dimension: dimension ?? undefined,
        indexCount: store.indexCount ?? undefined,
        createdTime: formatDateTime((store as any)?.createdDate, language),
        lastSync: formatDateTime((store as any)?.updatedDate, language),
        config,
      };
    },
    [language]
  );

  const loadStatistics = useCallback(async () => {
    setStatisticsLoading(true);
    try {
      const response = await VectorStoresService.vectorStoreGetStatistics();
      const responseData = (response as any)?.data as VectorStoreStatisticsVo | undefined;
      setStatistics(responseData ?? null);
    } catch (error: any) {
      console.error('Failed to load vector store statistics:', error);
      toast.error(
        error?.message || (language === 'zh-CN' ? '获取向量存储统计失败' : 'Failed to load vector store statistics')
      );
    } finally {
      setStatisticsLoading(false);
    }
  }, [language]);

  const loadVectorStores = useCallback(async () => {
    setVectorStoresLoading(true);
    try {
      const response = await VectorStoresService.vectorStoreList({
        keyword: debouncedSearchQuery.trim() || undefined,
        pageNo: currentPage,
        pageSize: itemsPerPage,
      });

      const responseData = (response as any).data;
      let listData: VectorStoreVo[] | undefined;
      if (responseData) {
        listData = responseData.list;
      }

      setVectorStoresTotal(responseData?.total ?? listData?.length ?? 0);

      const mapped = listData?.map(item => normalizeVectorStoreItem(item)).filter(Boolean) as VectorStoreItem[] | undefined;

      setVectorStores(mapped ?? []);
    } catch (error: any) {
      console.error('Failed to load vector stores:', error);
      toast.error(
        error?.message || (language === 'zh-CN' ? '加载向量存储列表失败' : 'Failed to load vector store list')
      );
    } finally {
      setVectorStoresLoading(false);
    }
  }, [normalizeVectorStoreItem, currentPage, debouncedSearchQuery, itemsPerPage, language]);

  const ensureVectorStoreDetail = useCallback(
    async (store: VectorStoreItem): Promise<VectorStoreItem> => {
      if (store.config && store.config.dimension) {
        return store;
      }
      try {
        const response = await VectorStoresService.vectorStoreGetDetail(store.id);
        const detail = (response as any)?.data as VectorStoreVo | undefined;
        if (detail) {
          const normalized = normalizeVectorStoreItem(detail);
          if (normalized) {
            setVectorStores(prev => prev.map(item => (item.id === normalized.id ? normalized : item)));
            return normalized;
          }
        }
      } catch (error: any) {
        console.error('Failed to load vector store detail:', error);
        toast.error(
          error?.message || (language === 'zh-CN' ? '获取向量存储详情失败' : 'Failed to load vector store detail')
        );
      }
      return store;
    },
    [normalizeVectorStoreItem, language]
  );

  const statsCards = useMemo(() => {
    const overview = statistics?.overview;

    return [
      {
        key: 'totalStores',
        label: language === 'zh-CN' ? '存储源总数' : 'Total Sources',
        value: formatNumber(overview?.totalStores, language),
        subtext: language === 'zh-CN' ? '已配置向量数据库' : 'Configured databases',
        icon: Database,
        iconBg: 'bg-blue-500',
      },
      {
        key: 'connectedStores',
        label: language === 'zh-CN' ? '已连接' : 'Connected',
        value: formatNumber(overview?.connectedStores, language),
        subtext: language === 'zh-CN' ? '正常运行中' : 'Currently active',
        icon: CheckCircle2,
        iconBg: 'bg-green-500',
      },
      {
        key: 'totalVectors',
        label: language === 'zh-CN' ? '向量总数' : 'Total Vectors',
        value: formatVectorCount(overview?.totalVectors, language),
        subtext: language === 'zh-CN' ? '跨所有存储源' : 'Across all sources',
        icon: Activity,
        iconBg: 'bg-purple-500',
      },
      {
        key: 'todayQueries',
        label: language === 'zh-CN' ? '今日查询' : 'Today Queries',
        value: formatNumber(overview?.todayQueries, language),
        subtext: language === 'zh-CN' ? '今日累计查询次数' : 'Queries today',
        icon: Zap,
        iconBg: 'bg-orange-500',
      },
    ];
  }, [language, statistics]);

  const shouldShowPagination = useMemo(() => {
    return vectorStoresTotal > itemsPerPage;
  }, [vectorStoresTotal, itemsPerPage]);

  useEffect(() => {
    loadStatistics();
  }, [loadStatistics]);

  useEffect(() => {
    loadVectorStores();
  }, [loadVectorStores]);

  useEffect(() => {
    setCurrentPage(prev => (prev === 1 ? prev : 1));
  }, [debouncedSearchQuery]);

  return {
    vectorStores,
    vectorStoresLoading,
    vectorStoresTotal,
    statistics,
    statisticsLoading,
    currentPage,
    searchQuery,
    viewMode,
    setCurrentPage,
    setSearchQuery,
    setViewMode,
    loadVectorStores,
    loadStatistics,
    ensureVectorStoreDetail,
    statsCards,
    shouldShowPagination,
  };
};

