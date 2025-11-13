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
import { useLanguage } from '@/components/ui/LanguageProvider';

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

export const useVectorStoreManagement = (): UseVectorStoreManagementReturn => {
  const { language, t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, SEARCH_DEBOUNCE_MS);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState<number>(PAGINATION_CONFIG.DEFAULT_PAGE);
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
      toast.error(error?.message || t('vector.messages.loadStatisticsFailed'));
    } finally {
      setStatisticsLoading(false);
    }
  }, [t]);

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
      toast.error(error?.message || t('vector.messages.loadStoresFailed'));
    } finally {
      setVectorStoresLoading(false);
    }
  }, [normalizeVectorStoreItem, currentPage, debouncedSearchQuery, itemsPerPage, language, t]);

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
        toast.error(error?.message || t('vector.messages.loadDetailFailed'));
      }
      return store;
    },
    [normalizeVectorStoreItem, t]
  );

  const statsCards = useMemo(() => {
    const overview = statistics?.overview;

    return [
      {
        key: 'totalStores',
        label: t('vector.stats.totalStores'),
        value: formatNumber(overview?.totalStores, language),
        subtext: t('vector.stats.totalStoresSubtext'),
        icon: Database,
        iconBg: 'bg-blue-500',
      },
      {
        key: 'connectedStores',
        label: t('vector.stats.connectedStores'),
        value: formatNumber(overview?.connectedStores, language),
        subtext: t('vector.stats.connectedStoresSubtext'),
        icon: CheckCircle2,
        iconBg: 'bg-green-500',
      },
      {
        key: 'totalVectors',
        label: t('vector.stats.totalVectors'),
        value: formatVectorCount(overview?.totalVectors, language),
        subtext: t('vector.stats.totalVectorsSubtext'),
        icon: Activity,
        iconBg: 'bg-purple-500',
      },
      {
        key: 'todayQueries',
        label: t('vector.stats.todayQueries'),
        value: formatNumber(overview?.todayQueries, language),
        subtext: t('vector.stats.todayQueriesSubtext'),
        icon: Zap,
        iconBg: 'bg-orange-500',
      },
    ];
  }, [language, statistics, t]);

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

