/**
 * 模型管理业务逻辑 Hook
 */

import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { useDebounce } from '@/hooks/useDebounce';
import ModelsService from '@/services/Models';
import { ModelDetailVo, ModelListVo, ModelStatisticsVo, ModelUpdateDto, ModelCreateDto } from '@/services/ModelsTypes';
import { ModelProviderEnum, ModelStatusEnum, ModelTypeEnum } from '@/enums/enums';
import { Database, Activity, TrendingUp, Zap } from 'lucide-react';
import { PAGINATION_CONFIG, SEARCH_DEBOUNCE_MS, DEFAULT_FORM_DATA } from '../constants';
import {
  formatNumber,
  formatCurrency,
  formatLatency,
  formatThroughput,
  formatAccuracy,
  formatDate,
  getModelTypeConfig,
  getModelStatusConfig,
  resolveSortOrderBy,
} from '../utils';
import type { SortOption } from '../utils';
import { ModelListItem, ModelFormData } from '../types';
import { enumToMessages, getEnumDescription, isEnumValue } from '@/enums/utils';
import { useLanguage } from '@/components/LanguageProvider.tsx';

export type { SortOption } from '../utils';

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
  addModelDialogOpen: boolean;
  detailsDialogOpen: boolean;
  editDialogOpen: boolean;
  selectedModel: ModelListItem | null;
  formData: ModelFormData;
  editFormData: ModelFormData;
  providerOptions: Array<{ value: string; label: string }>;

  // Actions
  setCurrentPage: (page: number) => void;
  setSearchQuery: (query: string) => void;
  setTypeFilter: (filter: 'all' | ModelTypeEnum) => void;
  setStatusFilter: (filter: 'all' | ModelStatusEnum) => void;
  setSortBy: (sort: SortOption) => void;
  setViewMode: (mode: 'grid' | 'list') => void;
  setAddModelDialogOpen: (open: boolean) => void;
  setDetailsDialogOpen: (open: boolean) => void;
  setEditDialogOpen: (open: boolean) => void;
  setSelectedModel: (model: ModelListItem | null) => void;

  // Methods
  loadModels: () => Promise<void>;
  loadStatistics: () => Promise<void>;
  handleToggleStatus: (model: ModelListItem) => Promise<void>;
  handleViewDetails: (model: ModelListItem) => Promise<void>;
  handleOpenEdit: (model: ModelListItem) => Promise<void>;
  handleSaveEdit: () => Promise<void>;
  handleDeleteModel: (model: ModelListItem) => Promise<void>;
  handleAddModel: () => Promise<void>;
  handleFormDataChange: (data: Partial<ModelFormData>) => void;
  handleEditFormDataChange: (data: Partial<ModelFormData>) => void;
  resetForm: () => void;
  resetEditForm: () => void;
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
  modelTypeOptions: Array<{ value: string; label: string; icon: any }>;
}

export const useModelManagement = (): UseModelManagementReturn => {
  const { language, t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, SEARCH_DEBOUNCE_MS);
  const [typeFilter, setTypeFilter] = useState<'all' | ModelTypeEnum>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | ModelStatusEnum>('all');
  const [sortBy, setSortBy] = useState<SortOption>('default');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState<number>(PAGINATION_CONFIG.DEFAULT_PAGE);
  const itemsPerPage = PAGINATION_CONFIG.DEFAULT_PAGE_SIZE;

  const [models, setModels] = useState<ModelListItem[]>([]);
  const [modelsLoading, setModelsLoading] = useState(false);
  const [modelsTotal, setModelsTotal] = useState(0);
  const [stats, setStats] = useState<ModelStatisticsVo | null>(null);

  const [addModelDialogOpen, setAddModelDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState<ModelListItem | null>(null);

  const [formData, setFormData] = useState<ModelFormData>({ ...DEFAULT_FORM_DATA });
  const [editFormData, setEditFormData] = useState<ModelFormData>({ ...DEFAULT_FORM_DATA });

  const [providerOptions, setProviderOptions] = useState<Array<{ value: string; label: string }>>(
    () => enumToMessages(ModelProviderEnum).map(({ value, message }) => ({ value, label: message }))
  );

  const loadSupportedProviders = useCallback(async () => {
    try {
      const response = await ModelsService.getSupportedProviders();
      const providers = (response as any)?.data as string[] | undefined;
      if (providers && Array.isArray(providers) && providers.length > 0) {
        setProviderOptions(
          providers.map((p: string) => ({
            value: p,
            label: isEnumValue(ModelProviderEnum, p)
              ? getEnumDescription(ModelProviderEnum, p)
              : String(p).toLowerCase(),
          }))
        );
      }
    } catch {
      // 接口失败时保持使用枚举 fallback
    }
  }, []);

  useEffect(() => {
    loadSupportedProviders();
  }, [loadSupportedProviders]);

  const modelTypeOptions = useMemo(
    () =>
      enumToMessages(ModelTypeEnum).map(({ value, message }) => ({
        value,
        label: message,
        icon: getModelTypeConfig(value).icon,
      })),
    []
  );

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
        cost: detailStats?.totalCostDisplay ?? (detailStats?.totalCost !== undefined ? formatCurrency(detailStats.totalCost, language) : '--'),
        tokens: tokens !== undefined ? formatNumber(tokens) : undefined,
        maxTokens:
          detail?.config?.maxTokens !== undefined && detail.config.maxTokens != null
            ? String(detail.config.maxTokens)
            : undefined,
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
      toast.error(error?.message || t('models.messages.loadStatisticsFailed'));
    }
  }, [t]);

  const loadModels = useCallback(async () => {
    setModelsLoading(true);
    try {
      const response = await ModelsService.getModelList({
        keyword: debouncedSearchQuery.trim() || undefined,
        pageNo: currentPage,
        pageSize: itemsPerPage,
        type: typeFilter === 'all' ? undefined : typeFilter,
        status: statusFilter === 'all' ? undefined : statusFilter,
        orderBy: resolveSortOrderBy(sortBy),
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
      toast.error(error?.message || t('models.messages.loadModelsFailed'));
    } finally {
      setModelsLoading(false);
    }
  }, [
    buildModelListItem,
    currentPage,
    debouncedSearchQuery,
    itemsPerPage,
    sortBy,
    statusFilter,
    typeFilter,
    language,
    t,
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

      const newStatus = model.statusEnum === ModelStatusEnum.ACTIVE ? ModelStatusEnum.DISABLED : ModelStatusEnum.ACTIVE;
      try {
        await ModelsService.updateModelStatus(model.id, { status: newStatus });
        toast.success(newStatus === ModelStatusEnum.ACTIVE ? t('models.messages.modelActivated', { name: model.name }) : t('models.messages.modelDisabled', { name: model.name }));
        const statusConfig = getModelStatusConfig(newStatus);
        setModels(prev =>
          prev.map(item =>
            item.id === model.id ? { ...item, statusEnum: newStatus, status: statusConfig.label, statusColor: statusConfig.color } : item
          )
        );
        setSelectedModel(prev =>
          prev && prev.id === model.id ? { ...prev, statusEnum: newStatus, status: statusConfig.label, statusColor: statusConfig.color } : prev
        );
      } catch (error: any) {
        console.error('Failed to toggle model status:', error);
        toast.error(error?.message || t('models.messages.updateStatusFailed'));
      }
    },
    [t]
  );

  const handleViewDetails = useCallback(
    async (model: ModelListItem) => {
      setSelectedModel(model);
      setDetailsDialogOpen(true);

      if (model.detail) {
        return;
      }

      try {
        const detail = await fetchModelDetail(model.id);
        if (detail) {
          setModels(prev => prev.map(item => (item.id === model.id ? { ...item, detail } : item)));
          setSelectedModel(prev => (prev && prev.id === model.id ? { ...prev, detail } : prev));
        }
      } catch (error: any) {
        toast.error(error?.message || t('models.messages.getDetailFailed'));
      }
    },
    [fetchModelDetail, t]
  );

  const handleOpenEdit = useCallback(
    async (model: ModelListItem) => {
      setSelectedModel(model);
      let detail = model.detail;

      if (!detail) {
        try {
          detail = await fetchModelDetail(model.id);
          if (detail) {
            setModels(prev => prev.map(item => (item.id === model.id ? { ...item, detail } : item)));
            setSelectedModel(prev => (prev && prev.id === model.id ? { ...prev, detail } : prev));
          }
        } catch (error: any) {
          toast.error(error?.message || t('models.messages.getDetailFailed'));
          return;
        }
      }
      const providerValue = detail?.provider ?? model.providerEnum ?? ModelProviderEnum.OTHER;

      setEditFormData({
        name: detail?.name ?? model.name ?? '',
        description: detail?.description ?? model.description ?? '',
        type: detail?.type ?? model.typeEnum ?? ModelTypeEnum.CHAT,
        provider: providerValue,
        apiKey: detail?.config?.apiKey ?? '',
        endpoint: detail?.config?.baseUrl ?? '',
        maxTokens: detail?.config?.maxTokens !== undefined ? String(detail.config.maxTokens) : '',
        temperature: detail?.config?.temperature !== undefined ? String(detail.config.temperature) : '0.7',
        inputPricePerMillionTokens:
          detail?.config?.inputPricePerMillionTokens != null ? String(detail.config.inputPricePerMillionTokens) : '',
        outputPricePerMillionTokens:
          detail?.config?.outputPricePerMillionTokens != null ? String(detail.config.outputPricePerMillionTokens) : '',
      });
      setEditDialogOpen(true);
    },
    [fetchModelDetail]
  );

  const handleSaveEdit = useCallback(async () => {
    if (!selectedModel) {
      toast.error(t('models.messages.noModelSelected'));
      return;
    }

    if (!editFormData.name.trim() || !editFormData.provider || !editFormData.type) {
      toast.error(t('models.validation.requiredFields'));
      return;
    }

    const parsedMaxTokens = editFormData.maxTokens ? parseInt(editFormData.maxTokens, 10) : undefined;
    const maxTokens = Number.isFinite(parsedMaxTokens ?? 0) ? parsedMaxTokens : undefined;
    const parsedTemperature = editFormData.temperature ? parseFloat(editFormData.temperature) : undefined;
    const temperature = Number.isFinite(parsedTemperature ?? 0) ? parsedTemperature : undefined;
    const parsedInputPrice = editFormData.inputPricePerMillionTokens ? parseFloat(editFormData.inputPricePerMillionTokens) : undefined;
    const inputPricePerMillionTokens = Number.isFinite(parsedInputPrice ?? 0) ? parsedInputPrice : undefined;
    const parsedOutputPrice = editFormData.outputPricePerMillionTokens ? parseFloat(editFormData.outputPricePerMillionTokens) : undefined;
    const outputPricePerMillionTokens = Number.isFinite(parsedOutputPrice ?? 0) ? parsedOutputPrice : undefined;

    const payload: ModelUpdateDto = {
      name: editFormData.name.trim(),
      description: editFormData.description.trim() || undefined,
      provider: editFormData.provider as ModelProviderEnum,
      type: editFormData.type,
      baseUrl: editFormData.endpoint.trim() || undefined,
      apiKey: editFormData.apiKey.trim() || undefined,
      maxTokens,
      temperature,
      inputPricePerMillionTokens,
      outputPricePerMillionTokens,
    };

    try {
      await ModelsService.updateModel(selectedModel.id, payload);
      toast.success(t('models.messages.updateSuccess', { name: editFormData.name }));
      setEditDialogOpen(false);
      await loadModels();
      await loadStatistics();
    } catch (error: any) {
      console.error('Failed to update model:', error);
      toast.error(error?.message || t('models.messages.updateFailed'));
    }
  }, [editFormData, loadModels, loadStatistics, selectedModel, t]);

  const handleDeleteModel = useCallback(
    async (model: ModelListItem) => {
      if (!model.id) {
        return;
      }
      try {
        await ModelsService.deleteModel(model.id);
        toast.success(t('models.messages.deleteSuccess', { name: model.name }));
        await loadModels();
        await loadStatistics();
      } catch (error: any) {
        console.error('Failed to delete model:', error);
        toast.error(error?.message || t('models.messages.deleteFailed'));
      }
    },
    [loadModels, loadStatistics, t]
  );

  const handleAddModel = useCallback(async () => {
    if (!formData.name.trim() || !formData.provider) {
      toast.error(t('models.validation.requiredFields'));
      return;
    }

    const parsedMaxTokens = formData.maxTokens ? parseInt(formData.maxTokens, 10) : undefined;
    const maxTokens = Number.isFinite(parsedMaxTokens ?? 0) ? parsedMaxTokens : undefined;
    const parsedTemperature = formData.temperature ? parseFloat(formData.temperature) : undefined;
    const temperature = Number.isFinite(parsedTemperature ?? 0) ? parsedTemperature : undefined;
    const parsedInputPrice = formData.inputPricePerMillionTokens ? parseFloat(formData.inputPricePerMillionTokens) : undefined;
    const inputPricePerMillionTokens = Number.isFinite(parsedInputPrice ?? 0) ? parsedInputPrice : undefined;
    const parsedOutputPrice = formData.outputPricePerMillionTokens ? parseFloat(formData.outputPricePerMillionTokens) : undefined;
    const outputPricePerMillionTokens = Number.isFinite(parsedOutputPrice ?? 0) ? parsedOutputPrice : undefined;

    const payload: ModelCreateDto = {
      name: formData.name.trim(),
      description: formData.description.trim() || formData.name.trim(),
      type: formData.type,
      provider: formData.provider as ModelProviderEnum,
      baseUrl: formData.endpoint.trim() || undefined,
      apiKey: formData.apiKey.trim() || undefined,
      maxTokens,
      temperature,
      inputPricePerMillionTokens,
      outputPricePerMillionTokens,
    };

    try {
      await ModelsService.createModel(payload);
      toast.success(t('models.messages.createSuccess', { name: formData.name }));
      setAddModelDialogOpen(false);
      setFormData({ ...DEFAULT_FORM_DATA });
      setCurrentPage(PAGINATION_CONFIG.DEFAULT_PAGE);
      await loadModels();
      await loadStatistics();
    } catch (error: any) {
      console.error('Failed to add model:', error);
      toast.error(error?.message || t('models.messages.createFailed'));
    }
  }, [formData, loadModels, loadStatistics, t]);

  const handleFormDataChange = useCallback((data: Partial<ModelFormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  }, []);

  const handleEditFormDataChange = useCallback((data: Partial<ModelFormData>) => {
    setEditFormData(prev => ({ ...prev, ...data }));
  }, []);

  const resetForm = useCallback(() => {
    setFormData({ ...DEFAULT_FORM_DATA });
  }, []);

  const resetEditForm = useCallback(() => {
    setEditFormData({ ...DEFAULT_FORM_DATA });
  }, []);

  const statsCards = useMemo(() => {
    const today = stats?.todayGrowthTrend;
    const lastMonth = stats?.lastMonthGrowthTrend;
    const averageLatencySec = stats?.averageLatencySec;

    const totalModelsValue = formatNumber(stats?.totalModels);
    const totalCostValue = stats?.totalCost !== undefined ? formatCurrency(stats?.totalCost, language) : '--';
    const totalCallsValue = formatNumber(stats?.totalCalls);
    const latencyValue = averageLatencySec !== undefined && averageLatencySec !== null ? `${averageLatencySec.toFixed(2)}s` : '--';

    return [
      {
        key: 'totalModels',
        label: t('models.stats.totalModels'),
        value: totalModelsValue,
        subtext:
          today?.addedModels !== undefined
            ? t('models.stats.addedToday', { value: formatNumber(today.addedModels) })
            : t('models.stats.noDailyData'),
        icon: Database,
        iconBg: 'bg-blue-500',
        trend: lastMonth?.addedModels !== undefined ? `+${formatNumber(lastMonth.addedModels)}` : undefined,
        trendUp: (lastMonth?.addedModels ?? 0) >= 0,
      },
      {
        key: 'totalCost',
        label: t('models.stats.totalCost'),
        value: totalCostValue,
        subtext:
          today?.addedCost !== undefined || today?.addedCostDisplay
            ? t('models.stats.addedToday', {
                value: today?.addedCostDisplay ?? formatCurrency(today?.addedCost, language) ?? '0',
              })
            : t('models.stats.noDailyData'),
        icon: Activity,
        iconBg: 'bg-green-500',
        trend: lastMonth?.addedCostDisplay ?? (lastMonth?.addedCost !== undefined ? `+${formatCurrency(lastMonth.addedCost, language)}` : undefined),
        trendUp: (lastMonth?.addedCost ?? 0) >= 0,
      },
      {
        key: 'totalCalls',
        label: t('models.stats.totalCalls'),
        value: totalCallsValue,
        subtext:
          today?.addedCalls !== undefined
            ? t('models.stats.addedToday', { value: formatNumber(today.addedCalls) })
            : t('models.stats.noDailyData'),
        icon: TrendingUp,
        iconBg: 'bg-orange-500',
        trend: lastMonth?.addedCalls !== undefined ? `+${formatNumber(lastMonth.addedCalls)}` : undefined,
        trendUp: (lastMonth?.addedCalls ?? 0) >= 0,
      },
      {
        key: 'latency',
        label: t('models.stats.avgLatency'),
        value: latencyValue,
        subtext:
          today?.latencyDecreaseFromYesterdayMs !== undefined
            ? t('models.stats.improvedVsYesterday', { value: today.latencyDecreaseFromYesterdayMs })
            : t('models.stats.noData'),
        icon: Zap,
        iconBg: 'bg-purple-500',
        trend:
          today?.latencyDecreaseFromYesterdayMs !== undefined
            ? `-${today.latencyDecreaseFromYesterdayMs}ms`
            : undefined,
        trendUp: true,
      },
    ];
  }, [language, stats, t]);

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
    addModelDialogOpen,
    detailsDialogOpen,
    editDialogOpen,
    selectedModel,
    formData,
    editFormData,
    providerOptions,
    setCurrentPage,
    setSearchQuery,
    setTypeFilter,
    setStatusFilter,
    setSortBy,
    setViewMode,
    setAddModelDialogOpen,
    setDetailsDialogOpen,
    setEditDialogOpen,
    setSelectedModel,
    loadModels,
    loadStatistics,
    handleToggleStatus,
    handleViewDetails,
    handleOpenEdit,
    handleSaveEdit,
    handleDeleteModel,
    handleAddModel,
    handleFormDataChange,
    handleEditFormDataChange,
    resetForm,
    resetEditForm,
    fetchModelDetail,
    statsCards,
    shouldShowPagination,
    modelTypeOptions,
  };
};

