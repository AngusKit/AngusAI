/**
 * API Collection 管理 Hook
 */

import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { toast } from 'sonner';
import { useLanguage } from '@/components/LanguageProvider.tsx';
import { useDebounce } from '@/hooks/useDebounce';
import ApiCollectionsService from '@/services/ApiCollections';
import { ApiCollectionDetailVo, ApiCollectionStatisticsVo, ApiEndpointListParamsOrderByEnum } from '@/services/ApiCollectionsTypes';
import { PAGINATION_CONFIG, SEARCH_DEBOUNCE_MS } from '../constants';
import { mapCollections, mapEndpoints, formatNumber, buildTrend } from '../utils';
import { STATS_CARDS_CONFIG } from '../constants';
import type { CollectionListItem, EndpointItem, SortField, SortOrder } from '../types';


interface UseAPICollectionManagementReturn {
  // State
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  endpointSearchQuery: string;
  setEndpointSearchQuery: (query: string) => void;
  selectedCollectionId: string | null;
  setSelectedCollectionId: (id: string | null) => void;
  collections: CollectionListItem[];
  collectionsLoading: boolean;
  collectionsTotal: number;
  collectionsPage: number;
  setCollectionsPage: (page: number) => void;
  collectionDetail: ApiCollectionDetailVo | null;
  detailLoading: boolean;
  statistics: ApiCollectionStatisticsVo | null;
  statisticsLoading: boolean;
  endpoints: EndpointItem[];
  endpointTotal: number;
  endpointPage: number;
  setEndpointPage: (page: number) => void;
  endpointsLoading: boolean;
  sortBy: SortField;
  setSortBy: (field: SortField) => void;
  sortOrder: SortOrder;
  setSortOrder: (order: SortOrder) => void;
  selectedCollectionItem: CollectionListItem | null;
  filteredAndSortedEndpoints: EndpointItem[];
  stats: Array<{
    key: string;
    label: string;
    value: string;
    subtext: string;
    trend?: { text: string; up: boolean };
    trendUp: boolean;
    icon: any;
    iconBg: string;
  }>;
  // Actions
  loadStatistics: () => Promise<void>;
  loadCollections: (pageNo: number, keyword: string) => Promise<void>;
  loadCollectionDetail: (collectionId: string) => Promise<void>;
  loadEndpoints: (collectionId: string, pageNo: number, keyword: string) => Promise<void>;
  toggleEndpointStatus: (endpointId: string, currentlyEnabled?: boolean) => Promise<void>;
  handleSort: (field: SortField) => void;
}

export const useAPICollectionManagement = (): UseAPICollectionManagementReturn => {
  const { language, t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [endpointSearchQuery, setEndpointSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, SEARCH_DEBOUNCE_MS);
  const debouncedEndpointSearchQuery = useDebounce(endpointSearchQuery, SEARCH_DEBOUNCE_MS);
  const [selectedCollectionId, setSelectedCollectionId] = useState<string | null>(null);
  const selectedCollectionIdRef = useRef<string | null>(null);
  selectedCollectionIdRef.current = selectedCollectionId;
  const [collections, setCollections] = useState<CollectionListItem[]>([]);
  const [collectionsLoading, setCollectionsLoading] = useState(false);
  const [collectionsTotal, setCollectionsTotal] = useState(0);
  const [collectionsPage, setCollectionsPage] = useState<number>(PAGINATION_CONFIG.DEFAULT_PAGE);
  const [collectionDetail, setCollectionDetail] = useState<ApiCollectionDetailVo | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [statistics, setStatistics] = useState<ApiCollectionStatisticsVo | null>(null);
  const [statisticsLoading, setStatisticsLoading] = useState(false);
  const [endpoints, setEndpoints] = useState<EndpointItem[]>([]);
  const [endpointTotal, setEndpointTotal] = useState(0);
  const [endpointPage, setEndpointPage] = useState<number>(PAGINATION_CONFIG.DEFAULT_PAGE);
  const [endpointsLoading, setEndpointsLoading] = useState(false);
  const [sortBy, setSortBy] = useState<SortField>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  const loadStatistics = useCallback(async () => {
    setStatisticsLoading(true);
    try {
      const response = await ApiCollectionsService.apiCollectionGetStatistics();
      const responseData = (response as any)?.data as ApiCollectionStatisticsVo | undefined;
      setStatistics(responseData ?? null);
    } catch (error: any) {
      console.error('Failed to load API collection statistics:', error);
      // toast.error(error?.message || t('apis.messages.loadStatisticsFailed'));
    } finally {
      setStatisticsLoading(false);
    }
  }, [t]);

  const loadCollections = useCallback(
    async (pageNo: number, keywordValue: string) => {
      setCollectionsLoading(true);
      try {
        const response = await ApiCollectionsService.apiCollectionList({
          keyword: keywordValue.trim() || undefined,
          pageNo,
          pageSize: PAGINATION_CONFIG.COLLECTIONS_PAGE_SIZE,
        });

        const responseData = (response as any).data;
        const listData = responseData?.list;
        const mappedList = mapCollections(listData);
        setCollections(mappedList);
        setCollectionsTotal(responseData?.total ?? mappedList.length);

        if (mappedList.length === 0) {
          setSelectedCollectionId(null);
          setCollectionDetail(null);
          setEndpoints([]);
          setEndpointTotal(0);
        } else if (!selectedCollectionIdRef.current || !mappedList.some(item => item.id === selectedCollectionIdRef.current!)) {
          const firstId = mappedList[0]?.id;
          if (firstId) {
            setSelectedCollectionId(firstId);
            setEndpointPage(PAGINATION_CONFIG.DEFAULT_PAGE);
          }
        }
      } catch (error: any) {
        console.error('Failed to load API collections:', error);
        // toast.error(error?.message || t('apis.messages.loadCollectionsFailed'));
      } finally {
        setCollectionsLoading(false);
      }
    },
    [t]
  );

  const loadCollectionDetail = useCallback(
    async (collectionId: string) => {
      setDetailLoading(true);
      try {
        const response = await ApiCollectionsService.apiCollectionGetDetail(collectionId);
        const responseData: ApiCollectionDetailVo | undefined = (response as any).data;
        setCollectionDetail(responseData ?? null);
      } catch (error: any) {
        console.error('Failed to load API collection detail:', error);
        // toast.error(error?.message || t('apis.messages.loadDetailFailed'));
      } finally {
        setDetailLoading(false);
      }
    },
    [t]
  );

  const getEndpointOrderBy = useCallback(() => {
    switch (sortBy) {
      case 'name':
        return ApiEndpointListParamsOrderByEnum.Name;
      case 'method':
        return ApiEndpointListParamsOrderByEnum.Method;
      case 'lastUsed':
      default:
        return ApiEndpointListParamsOrderByEnum.CreatedDate;
    }
  }, [sortBy]);

  const loadEndpoints = useCallback(
    async (collectionId: string, pageNo: number, keywordValue: string) => {
      setEndpointsLoading(true);
      try {
        const response = await ApiCollectionsService.apiEndpointList(collectionId, {
          pageNo,
          pageSize: PAGINATION_CONFIG.ENDPOINTS_PAGE_SIZE,
          name: keywordValue.trim() || undefined,
          orderBy: getEndpointOrderBy(),
        });

        const responseData = (response as any).data;
        const listData = responseData?.list;
        const mappedList = mapEndpoints(listData);
        setEndpoints(mappedList);
        setEndpointTotal(responseData?.total ?? mappedList.length);
      } catch (error: any) {
        console.error('Failed to load API endpoints:', error);
        // toast.error(error?.message || t('apis.messages.loadEndpointsFailed'));
      } finally {
        setEndpointsLoading(false);
      }
    },
    [getEndpointOrderBy, t]
  );

  const toggleEndpointStatus = useCallback(
    async (endpointId: string, currentlyEnabled?: boolean) => {
      if (!selectedCollectionId) {
        return;
      }
      try {
        await ApiCollectionsService.apiEndpointToggle(selectedCollectionId, endpointId, {
          enabled: !currentlyEnabled,
        });
        toast.success(
          currentlyEnabled ? t('apis.messages.endpointDisabled') : t('apis.messages.endpointEnabled')
        );
        await loadEndpoints(selectedCollectionId, endpointPage, debouncedEndpointSearchQuery);
      } catch (error: any) {
        console.error('Failed to toggle endpoint status:', error);
        toast.error(error?.message || t('apis.messages.toggleEndpointFailed'));
      }
    },
    [selectedCollectionId, endpointPage, debouncedEndpointSearchQuery, loadEndpoints, t]
  );

  const selectedCollectionItem = useMemo(
    () => (selectedCollectionId ? collections.find(item => item.id === selectedCollectionId) ?? null : null),
    [collections, selectedCollectionId]
  );

  const filteredAndSortedEndpoints = useMemo(() => {
    const keyword = debouncedEndpointSearchQuery.trim().toLowerCase();
    const filtered = keyword
      ? endpoints.filter(endpoint => {
          const name = endpoint.name?.toLowerCase() ?? '';
          const path = endpoint.path?.toLowerCase() ?? '';
          const description = endpoint.description?.toLowerCase() ?? '';
          return name.includes(keyword) || path.includes(keyword) || description.includes(keyword);
        })
      : endpoints;

    const sorted = [...filtered].sort((a, b) => {
      let comparison = 0;

      if (sortBy === 'name') {
        comparison = (a.name ?? '').localeCompare(b.name ?? '');
      } else if (sortBy === 'method') {
        comparison = (a.method ?? '').localeCompare(b.method ?? '');
      } else if (sortBy === 'lastUsed') {
        const aTime = a.lastUsedDate?.getTime() ?? 0;
        const bTime = b.lastUsedDate?.getTime() ?? 0;
        comparison = aTime - bTime;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });
    return sorted;
  }, [debouncedEndpointSearchQuery, endpoints, sortBy, sortOrder]);

  const stats = useMemo(() => {
    const overview = statistics?.overview;
    const previous = statistics?.lastMonthGrowthTrend;

    const collectionsTrend = buildTrend(overview?.apiCollectionCount, previous?.apiCollectionCount);
    const totalApisTrend = buildTrend(overview?.apiTotalCount, previous?.apiTotalCount);
    const enabledApisTrend = buildTrend(overview?.enabledApiCount, previous?.enabledApiCount);
    const todayCallsTrend = buildTrend(overview?.todayCallCount, previous?.todayCallCount);

    const statDataArray = [
      {
        key: 'collections',
        label: t('apis.stats.totalCollections'),
        value: formatNumber(overview?.apiCollectionCount, language),
        subtext: t('apis.stats.totalCollectionsSubtext'),
        trend: collectionsTrend,
      },
      {
        key: 'totalApis',
        label: t('apis.stats.totalApis'),
        value: formatNumber(overview?.apiTotalCount, language),
        subtext: t('apis.stats.totalApisSubtext'),
        trend: totalApisTrend,
      },
      {
        key: 'enabledApis',
        label: t('apis.stats.enabledApis'),
        value: formatNumber(overview?.enabledApiCount, language),
        subtext: t('apis.stats.enabledApisSubtext'),
        trend: enabledApisTrend,
      },
      {
        key: 'todayCalls',
        label: t('apis.stats.todayCalls'),
        value: formatNumber(overview?.todayCallCount, language),
        subtext: t('apis.stats.todayCallsSubtext'),
        trend: todayCallsTrend,
      },
    ];

    return STATS_CARDS_CONFIG.map((config, index) => {
      const statData = statDataArray[index];
      if (!statData) {
        return {
          ...config,
          label: '',
          value: '--',
          subtext: '',
          trendUp: true,
        };
      }

      return {
        ...config,
        ...statData,
        trendUp: statData.trend?.up ?? true,
      };
    });
  }, [language, statistics, t]);

  const handleSort = useCallback(
    (field: SortField) => {
      if (sortBy === field) {
        setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
      } else {
        setSortBy(field);
        setSortOrder('asc');
      }
      setEndpointPage(PAGINATION_CONFIG.DEFAULT_PAGE);
    },
    [sortBy]
  );

  // Effects
  useEffect(() => {
    loadStatistics();
  }, [loadStatistics]);

  useEffect(() => {
    loadCollections(collectionsPage, debouncedSearchQuery);
  }, [collectionsPage, debouncedSearchQuery, loadCollections]);

  useEffect(() => {
    if (!selectedCollectionId) {
      return;
    }
    loadCollectionDetail(selectedCollectionId);
  }, [selectedCollectionId, loadCollectionDetail]);

  useEffect(() => {
    if (!selectedCollectionId) {
      return;
    }
    loadEndpoints(selectedCollectionId, endpointPage, debouncedEndpointSearchQuery);
  }, [selectedCollectionId, endpointPage, debouncedEndpointSearchQuery, loadEndpoints]);

  useEffect(() => {
    setCollectionsPage(PAGINATION_CONFIG.DEFAULT_PAGE);
  }, [debouncedSearchQuery]);

  useEffect(() => {
    setEndpointPage(PAGINATION_CONFIG.DEFAULT_PAGE);
  }, [selectedCollectionId, debouncedEndpointSearchQuery]);

  return {
    // State
    searchQuery,
    setSearchQuery,
    endpointSearchQuery,
    setEndpointSearchQuery,
    selectedCollectionId,
    setSelectedCollectionId,
    collections,
    collectionsLoading,
    collectionsTotal,
    collectionsPage,
    setCollectionsPage,
    collectionDetail,
    detailLoading,
    statistics,
    statisticsLoading,
    endpoints,
    endpointTotal,
    endpointPage,
    setEndpointPage,
    endpointsLoading,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    selectedCollectionItem,
    filteredAndSortedEndpoints,
    stats,
    // Actions
    loadStatistics,
    loadCollections,
    loadCollectionDetail,
    loadEndpoints,
    toggleEndpointStatus,
    handleSort,
  };
};

