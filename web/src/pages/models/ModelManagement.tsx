import { useCallback, useEffect, useMemo, useState, type ElementType } from 'react';
import { useLanguage } from '@/components/ui/LanguageProvider';
import { Database, Search, Filter, TrendingUp, Activity, Grid3x3, List, Eye, Edit, Trash2, MoreHorizontal, Play, Pause, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { XcanPagination } from '@/components/ui/pagination';
import { toast } from 'sonner';
import { useDebounce } from '@/hooks/useDebounce';
import ModelsService from '@/services/Models';
import { GetModelListParamsOrderByEnum, ModelDetailVo, ModelListVo, ModelStatisticsVo, ModelUpdateDto, ModelCreateDto, } from '@/services/ModelsTypes';
import { ModelProviderEnum, ModelStatusEnum, ModelTypeEnum } from '@/enums/enums';
import { enumToMessages, getEnumDescription } from '@/enums/utils';
import { CreateModelDialog } from './components/CreateModelDialog';
import { EditModelDialog } from './components/EditModelDialog';
import { MODEL_TYPE_CONFIG, DEFAULT_MODEL_TYPE_CONFIG, MODEL_STATUS_CONFIG, DEFAULT_MODEL_STATUS_CONFIG } from './constants';

interface ModelListItem {
  id: string;
  name: string;
  description: string;
  type: string;
  typeEnum?: ModelTypeEnum;
  icon: ElementType;
  iconBg: string;
  iconColor: string;
  provider: string;
  providerEnum?: ModelProviderEnum;
  version: string;
  status: string;
  statusEnum?: ModelStatusEnum;
  statusColor: string;
  performance: {
    latency: string;
    throughput: string;
    accuracy: string;
  };
  resources: {
    cpu: string;
    memory: string;
    gpu: string;
  };
  calls: string;
  cost: string;
  tokens?: string;
  deployed: string;
  detail?: ModelDetailVo;
}

type SortOption = 'default' | 'name' | 'provider' | 'status' | 'createdDate';

const formatNumber = (value?: number | null) => {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return '--';
  }
  return Number(value).toLocaleString();
};

const formatCurrency = (value?: number | null, language: string = 'zh-CN') => {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return '--';
  }
  try {
    return new Intl.NumberFormat(language === 'zh-CN' ? 'zh-CN' : 'en-US', {
      style: 'currency',
      currency: language === 'zh-CN' ? 'CNY' : 'USD',
      maximumFractionDigits: 2,
    }).format(value);
  } catch {
    return Number(value).toFixed(2);
  }
};

const formatLatency = (performance?: ModelDetailVo['performance']) => {
  if (!performance) {
    return '--';
  }
  if (performance.latency) {
    return performance.latency;
  }
  if (performance.latencyMs !== undefined && performance.latencyMs !== null) {
    return `${performance.latencyMs}ms`;
  }
  return '--';
};

const formatThroughput = (performance?: ModelDetailVo['performance']) => {
  if (!performance) {
    return '--';
  }
  if (performance.throughput) {
    return performance.throughput;
  }
  if (performance.throughputRaw !== undefined && performance.throughputRaw !== null) {
    return `${performance.throughputRaw} req/s`;
  }
  return '--';
};

const formatAccuracy = (performance?: ModelDetailVo['performance']) => {
  if (!performance) {
    return '--';
  }
  if (performance.accuracy) {
    return performance.accuracy;
  }
  if (performance.accuracyPercent !== undefined && performance.accuracyPercent !== null) {
    return `${performance.accuracyPercent.toFixed(1)}%`;
  }
  return '--';
};

const mapTypeToConfig = (type?: ModelTypeEnum | string) => {
  switch (type) {
    case ModelTypeEnum.CHAT:
      return MODEL_TYPE_CONFIG[ModelTypeEnum.CHAT];
    case ModelTypeEnum.IMAGE:
      return MODEL_TYPE_CONFIG[ModelTypeEnum.IMAGE];
    case ModelTypeEnum.AUDIO:
      return MODEL_TYPE_CONFIG[ModelTypeEnum.AUDIO];
    case ModelTypeEnum.EMBEDDING:
      return MODEL_TYPE_CONFIG[ModelTypeEnum.EMBEDDING];
    case ModelTypeEnum.MODERATION:
      return MODEL_TYPE_CONFIG[ModelTypeEnum.MODERATION];
    default:
      return DEFAULT_MODEL_TYPE_CONFIG;
  }
};

const mapStatusToConfig = (status?: ModelStatusEnum | string) => {
  switch (status) {
    case ModelStatusEnum.RUNNING:
      return MODEL_STATUS_CONFIG[ModelStatusEnum.RUNNING];
    case ModelStatusEnum.STOPPED:
      return MODEL_STATUS_CONFIG[ModelStatusEnum.STOPPED];
    case ModelStatusEnum.ERROR:
      return MODEL_STATUS_CONFIG[ModelStatusEnum.ERROR];
    default:
      return DEFAULT_MODEL_STATUS_CONFIG;
  }
};

export function ModelManagement() {
  const { language, t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const [typeFilter, setTypeFilter] = useState<'all' | ModelTypeEnum>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | ModelStatusEnum>('all');
  const [sortBy, setSortBy] = useState<SortOption>('default');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [addModelDialogOpen, setAddModelDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState<ModelListItem | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const [models, setModels] = useState<ModelListItem[]>([]);
  const [modelsLoading, setModelsLoading] = useState(false);
  const [modelsTotal, setModelsTotal] = useState(0);
  const [stats, setStats] = useState<ModelStatisticsVo | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: ModelTypeEnum.CHAT,
    provider: '',
    version: '',
    apiKey: '',
    endpoint: '',
    maxTokens: '',
    temperature: '0.7',
  });

  const [editFormData, setEditFormData] = useState({
    name: '',
    description: '',
    type: ModelTypeEnum.CHAT,
    provider: '',
    version: '',
    apiKey: '',
    endpoint: '',
    maxTokens: '',
    temperature: '0.7',
  });

  const providerOptions = enumToMessages(ModelProviderEnum).map(({value, message}) => ({
    value,
    label: message,
  }));

  const modelTypeOptions = enumToMessages(ModelTypeEnum).map(({value, message}) => {
    return {
      value,
      label: message,
      icon: mapTypeToConfig(value).icon,
    }
  });

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
          today?.addedCost !== undefined
            ? t('models.stats.addedToday', { value: formatCurrency(today.addedCost, language) })
            : t('models.stats.noDailyData'),
        icon: Activity,
        iconBg: 'bg-green-500',
        trend: lastMonth?.addedCost !== undefined ? `+${formatCurrency(lastMonth.addedCost, language)}` : undefined,
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

  const buildModelItem = useCallback(
    (item: ModelListVo, detail?: ModelDetailVo): ModelListItem | null => {
      const id = item.id !== undefined && item.id !== null ? String(item.id) : '';
      if (!id) {
        return null;
      }

      const typeConfig = mapTypeToConfig(item.type);
      const statusConfig = mapStatusToConfig(item.status);
      const providerLabel = getEnumDescription(ModelProviderEnum, item.provider ?? detail?.provider ?? '');
      const detailStats = detail?.stats;
      const performance = detail?.performance;
      const tokens = detailStats?.totalTokensConsumed ?? detailStats?.totalTokens;
      const createdDate = detail?.createdDate ?? item.createdDate;
      let deployed = '--';
      if (createdDate) {
        const date = new Date(createdDate);
        if (!Number.isNaN(date.getTime())) {
          deployed = date.toLocaleDateString(language === 'zh-CN' ? 'zh-CN' : 'en-US');
        }
      }

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
          return buildModelItem(item, detail);
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
    buildModelItem,
    currentPage,
    debouncedSearchQuery,
    itemsPerPage,
    resolveOrderBy,
    sortBy,
    statusFilter,
    typeFilter,
    t,
  ]);

  useEffect(() => {
    loadStatistics();
  }, [loadStatistics]);

  useEffect(() => {
    loadModels();
  }, [loadModels]);

  const shouldShowPagination = useMemo(() => {
    return modelsTotal > itemsPerPage;
  }, [modelsTotal, itemsPerPage]);

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
          toast.success(t('models.messages.modelStopped', { name: model.name }));
        } else {
          await ModelsService.startModel(model.id);
          toast.success(t('models.messages.modelStarted', { name: model.name }));
        }
        await loadModels();
        await loadStatistics();
      } catch (error: any) {
        console.error('Failed to toggle model status:', error);
        toast.error(error?.message || t('models.messages.updateStatusFailed'));
      }
    },
    [loadModels, loadStatistics, t]
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
      const providerValue = detail?.provider ?? model.providerEnum ?? ModelProviderEnum.CUSTOM;

      setEditFormData({
        name: detail?.name ?? model.name ?? '',
        description: detail?.description ?? model.description ?? '',
        type: detail?.type ?? model.typeEnum ?? ModelTypeEnum.CHAT,
        provider: providerValue,
        version: detail?.version ?? model.version ?? '',
        apiKey: detail?.config?.apiKey ?? '',
        endpoint: detail?.config?.apiEndpoint ?? '',
        maxTokens: detail?.config?.maxTokens !== undefined ? String(detail.config.maxTokens) : '',
        temperature: detail?.config?.temperature !== undefined ? String(detail.config.temperature) : '0.7',
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

    if (!editFormData.name.trim() || !editFormData.provider || !editFormData.version.trim()) {
      toast.error(t('models.validation.requiredFields'));
      return;
    }

    const parsedMaxTokens = editFormData.maxTokens ? parseInt(editFormData.maxTokens, 10) : undefined;
    const maxTokens = Number.isFinite(parsedMaxTokens ?? 0) ? parsedMaxTokens : undefined;
    const parsedTemperature = editFormData.temperature ? parseFloat(editFormData.temperature) : undefined;
    const temperature = Number.isFinite(parsedTemperature ?? 0) ? parsedTemperature : undefined;

    const payload: ModelUpdateDto = {
      name: editFormData.name.trim(),
      description: editFormData.description.trim() || undefined,
      provider: editFormData.provider as ModelProviderEnum,
      version: editFormData.version.trim(),
      type: editFormData.type,
      apiEndpoint: editFormData.endpoint.trim() || undefined,
      apiKey: editFormData.apiKey.trim() || undefined,
      maxTokens,
      temperature,
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
    if (!formData.name.trim() || !formData.provider || !formData.version.trim()) {
      toast.error(t('models.validation.requiredFields'));
      return;
    }

    const parsedMaxTokens = formData.maxTokens ? parseInt(formData.maxTokens, 10) : undefined;
    const maxTokens = Number.isFinite(parsedMaxTokens ?? 0) ? parsedMaxTokens : undefined;
    const parsedTemperature = formData.temperature ? parseFloat(formData.temperature) : undefined;
    const temperature = Number.isFinite(parsedTemperature ?? 0) ? parsedTemperature : undefined;

    const payload: ModelCreateDto = {
      name: formData.name.trim(),
      description: formData.description.trim() || formData.name.trim(),
      type: formData.type,
      provider: formData.provider as ModelProviderEnum,
      version: formData.version.trim(),
      apiEndpoint: formData.endpoint.trim() || undefined,
      apiKey: formData.apiKey.trim() || undefined,
      maxTokens,
      temperature,
    };

    try {
      await ModelsService.createModel(payload);
      toast.success(t('models.messages.createSuccess', { name: formData.name }));
      setAddModelDialogOpen(false);
      setFormData({
        name: '',
        description: '',
        type: ModelTypeEnum.CHAT,
        provider: '',
        version: '',
        apiKey: '',
        endpoint: '',
        maxTokens: '',
        temperature: '0.7',
      });
      setCurrentPage(1);
      await loadModels();
      await loadStatistics();
    } catch (error: any) {
      console.error('Failed to add model:', error);
      toast.error(error?.message || t('models.messages.createFailed'));
    }
  }, [formData, loadModels, loadStatistics, t]);

  const handleFormDataChange = (data: Partial<typeof formData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const handleEditFormDataChange = (data: Partial<typeof editFormData>) => {
    setEditFormData(prev => ({ ...prev, ...data }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      type: ModelTypeEnum.CHAT,
      provider: '',
      version: '',
      apiKey: '',
      endpoint: '',
      maxTokens: '',
      temperature: '0.7',
    });
  };

  const resetEditForm = () => {
    setEditFormData({
      name: '',
      description: '',
      type: ModelTypeEnum.CHAT,
      provider: '',
      version: '',
      apiKey: '',
      endpoint: '',
      maxTokens: '',
      temperature: '0.7',
    });
  };

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div>
        <h1 className='text-2xl mb-1 dark:text-white'>{t('models.title')}</h1>
        <p className='text-sm text-gray-600 dark:text-gray-400'>{t('models.subtitle')}</p>
      </div>

      {/* Stats Cards */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
        {statsCards.map(stat => {
          const Icon = stat.icon;
          return (
            <Card key={stat.key} className='px-5 pt-5 pb-3 dark:bg-gray-800 dark:border-gray-700'>
              <div className='flex items-start justify-between mb-1.5'>
                <div className={`${stat.iconBg} w-10 h-10 rounded-lg flex items-center justify-center`}>
                  <Icon className='w-5 h-5 text-white' />
                </div>
                {stat.trend && (
                  <span
                    className={`text-sm ${stat.trendUp ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}
                  >
                    {stat.trend}
                  </span>
                )}
              </div>
              <div className='text-base font-semibold text-gray-600 dark:text-gray-400 mb-0.5'>{stat.label}</div>
              <div className='text-3xl dark:text-white mb-0.5'>{stat.value}</div>
              <div className='text-xs text-gray-500 dark:text-gray-400'>{stat.subtext}</div>
            </Card>
          );
        })}
      </div>

      {/* Action Bar */}
      <div className='flex items-center justify-between gap-3'>
            {/* Search Bar */}
            <div className='relative w-[390px]'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400' />
              <Input
                placeholder={t('models.searchPlaceholder')}
                value={searchQuery}
                onChange={e => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className='pl-9 dark:bg-gray-800 dark:border-gray-700'
              />
            </div>

            {/* Right Side Actions */}
            <div className='flex items-center gap-2'>
              <Select
                value={typeFilter}
                onValueChange={value => {
                  setTypeFilter(value as 'all' | ModelTypeEnum);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className='w-[140px] dark:bg-gray-800 dark:border-gray-700'>
                  <Filter className='w-4 h-4 mr-2' />
                  <SelectValue placeholder={t('models.filters.typeFilterPlaceholder')} />
                </SelectTrigger>
                <SelectContent className='dark:bg-gray-800 dark:border-gray-700'>
                  <SelectItem value='all' className='dark:text-gray-300'>
                    {t('models.filters.allTypes')}
                  </SelectItem>
                  {modelTypeOptions.map(option => {
                    const Icon = option.icon;
                    return (
                      <SelectItem key={option.value} value={option.value} className='dark:text-gray-300'>
                        <div className='flex items-center gap-2'>
                          <Icon className='w-4 h-4' />
                          {option.label}
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>

              <Select
                value={statusFilter}
                onValueChange={value => {
                  setStatusFilter(value as 'all' | ModelStatusEnum);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className='w-[140px] dark:bg-gray-800 dark:border-gray-700'>
                  <SelectValue placeholder={t('models.filters.statusFilterPlaceholder')} />
                </SelectTrigger>
                <SelectContent className='dark:bg-gray-800 dark:border-gray-700'>
                  <SelectItem value='all' className='dark:text-gray-300'>
                    {t('models.filters.allStatuses')}
                  </SelectItem>
                  <SelectItem value={ModelStatusEnum.RUNNING} className='dark:text-gray-300'>
                    {t('models.filters.running')}
                  </SelectItem>
                  <SelectItem value={ModelStatusEnum.STOPPED} className='dark:text-gray-300'>
                    {t('models.filters.stopped')}
                  </SelectItem>
                  <SelectItem value={ModelStatusEnum.ERROR} className='dark:text-gray-300'>
                    {t('models.filters.error')}
                  </SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={sortBy}
                onValueChange={value => {
                  setSortBy(value as SortOption);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className='w-[140px] dark:bg-gray-800 dark:border-gray-700'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className='dark:bg-gray-800 dark:border-gray-700'>
                  <SelectItem value='default' className='dark:text-gray-300'>
                    {t('models.filters.defaultSort')}
                  </SelectItem>
                  <SelectItem value='name' className='dark:text-gray-300'>
                    {t('common.labels.name')}
                  </SelectItem>
                  <SelectItem value='provider' className='dark:text-gray-300'>
                    {t('models.provider')}
                  </SelectItem>
                  <SelectItem value='status' className='dark:text-gray-300'>
                    {t('models.status')}
                  </SelectItem>
                  <SelectItem value='createdDate' className='dark:text-gray-300'>
                    {t('models.filters.createdDate')}
                  </SelectItem>
                </SelectContent>
              </Select>

              <div className='flex items-center gap-1 border border-gray-200 dark:border-gray-700 rounded-lg p-1'>
                <Button
                  variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                  size='sm'
                  onClick={() => setViewMode('grid')}
                  className='h-8 w-8 p-0'
                >
                  <Grid3x3 className='w-4 h-4' />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                  size='sm'
                  onClick={() => setViewMode('list')}
                  className='h-8 w-8 p-0'
                >
                  <List className='w-4 h-4' />
                </Button>
              </div>

              <CreateModelDialog
                open={addModelDialogOpen}
                onOpenChange={setAddModelDialogOpen}
                formData={formData}
                onFormDataChange={handleFormDataChange}
                onSubmit={handleAddModel}
                onReset={resetForm}
                providerOptions={providerOptions}
              />
            </div>
          </div>

          {/* Grid View */}
          {viewMode === 'grid' && (
            <>
              {modelsLoading ? (
                <Card className='p-12 text-center dark:bg-gray-800 dark:border-gray-700 col-span-full'>
                  <Database className='w-12 h-12 text-gray-400 mx-auto mb-4' />
                  <h3 className='text-lg mb-2 dark:text-white'>
                    {t('models.empty.loadingModels')}
                  </h3>
                </Card>
              ) : models.length === 0 ? (
                <Card className='p-12 text-center dark:bg-gray-800 dark:border-gray-700 col-span-full'>
                  <Database className='w-12 h-12 text-gray-400 mx-auto mb-4' />
                  <h3 className='text-lg mb-2 dark:text-white'>
                    {t('models.empty.noModelsFound')}
                  </h3>
                  <p className='text-sm text-gray-600 dark:text-gray-400'>
                    {t('models.empty.tryAdjustingSearch')}
                  </p>
                </Card>
              ) : (
                <>
                  <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                    {models.map(model => {
                      const Icon = model.icon;
                      const toggleDisabled = !model.statusEnum || model.statusEnum === ModelStatusEnum.ERROR;
                      return (
                        <Card
                          key={model.id}
                          className='p-5 dark:bg-gray-800 dark:border-gray-700 hover:shadow-lg transition-shadow gap-0'
                        >
                          <div className='flex items-start justify-between mb-2'>
                            <button
                              onClick={() => handleToggleStatus(model)}
                              className='p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors'
                              disabled={toggleDisabled || modelsLoading}
                            >
                              {model.statusEnum === ModelStatusEnum.RUNNING ? (
                                <Pause className='w-4 h-4 text-orange-600 dark:text-orange-400' />
                              ) : (
                                <Play className='w-4 h-4 text-green-600 dark:text-green-400' />
                              )}
                            </button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <button className='p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors'>
                                  <MoreHorizontal className='w-4 h-4 text-gray-600 dark:text-gray-400' />
                                </button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align='end' className='dark:bg-gray-800 dark:border-gray-700'>
                                <DropdownMenuItem
                                  onClick={() => handleViewDetails(model)}
                                  className='dark:text-gray-300'
                                >
                                  <Eye className='w-4 h-4 mr-2' />
                                  {t('models.actions.viewDetails')}
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleOpenEdit(model)} className='dark:text-gray-300'>
                                  <Edit className='w-4 h-4 mr-2' />
                                  {t('models.actions.editConfig')}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleDeleteModel(model)}
                                  className='text-red-600 dark:text-red-400'
                                >
                                  <Trash2 className='w-4 h-4 mr-2' />
                                  {t('models.actions.delete')}
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>

                          <div className='flex items-start gap-3 mb-3'>
                            <div
                              className={`${model.iconBg} w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0`}
                            >
                              <Icon className={`w-6 h-6 ${model.iconColor}`} />
                            </div>
                            <div className='flex-1 min-w-0'>
                              <h3 className='mb-1 dark:text-white'>{model.name}</h3>
                              <Badge className={`text-xs ${model.statusColor} border-0`}>{model.status}</Badge>
                            </div>
                          </div>

                          <p className='text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2'>
                            {model.description}
                          </p>

                          <div className='space-y-2 mb-4 text-xs'>
                            <div className='flex items-center justify-between'>
                              <span className='text-gray-500 dark:text-gray-400'>{t('models.table.provider')}</span>
                              <span className='dark:text-white'>{model.provider}</span>
                            </div>
                            <div className='flex items-center justify-between'>
                              <span className='text-gray-500 dark:text-gray-400'>{t('models.table.version')}</span>
                              <span className='dark:text-white'>{model.version}</span>
                            </div>
                            <div className='flex items-center justify-between'>
                              <span className='text-gray-500 dark:text-gray-400'>{t('models.table.latency')}</span>
                              <span className='dark:text-white'>{model.performance.latency}</span>
                            </div>
                          </div>

                          <div className='flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700 text-sm'>
                            <div>
                              <div className='text-gray-500 dark:text-gray-400 text-xs'>{t('models.table.todayCalls')}</div>
                              <div className='dark:text-white'>{model.calls}</div>
                            </div>
                            <div className='text-right'>
                              <div className='text-gray-500 dark:text-gray-400 text-xs'>{t('models.table.todayCost')}</div>
                              <div className='dark:text-white'>{model.cost}</div>
                            </div>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                </>
              )}
            </>
          )}

          {/* List View */}
          {viewMode === 'list' && (
            <Card className='dark:bg-gray-800 dark:border-gray-700'>
              {modelsLoading ? (
                <div className='p-12 text-center'>
                  <Database className='w-12 h-12 text-gray-400 mx-auto mb-4' />
                  <h3 className='text-lg mb-2 dark:text-white'>
                    {t('models.empty.loadingModels')}
                  </h3>
                </div>
              ) : models.length === 0 ? (
                <div className='p-12 text-center'>
                  <Database className='w-12 h-12 text-gray-400 mx-auto mb-4' />
                  <h3 className='text-lg mb-2 dark:text-white'>
                    {t('models.empty.noModelsFound')}
                  </h3>
                  <p className='text-sm text-gray-600 dark:text-gray-400'>
                    {t('models.empty.tryAdjustingSearch')}
                  </p>
                </div>
              ) : (
                <div className='overflow-x-auto'>
                  <table className='w-full'>
                    <thead className='bg-gray-50 dark:bg-gray-900'>
                      <tr>
                        <th className='px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400'>{t('models.table.model')}</th>
                        <th className='px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400'>{t('models.table.type')}</th>
                        <th className='px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400'>{t('models.table.status')}</th>
                        <th className='px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400'>{t('models.table.performance')}</th>
                        <th className='px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400'>{t('models.table.callsCost')}</th>
                        <th className='px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400'>{t('models.table.actions')}</th>
                      </tr>
                    </thead>
                    <tbody className='divide-y divide-gray-200 dark:divide-gray-700'>
                      {models.map(model => {
                        const Icon = model.icon;
                        return (
                          <tr key={model.id} className='hover:bg-gray-50 dark:hover:bg-gray-900'>
                            <td className='px-6 py-4'>
                              <div className='flex items-center gap-3'>
                                <div
                                  className={`${model.iconBg} w-10 h-10 rounded-lg flex items-center justify-center`}
                                >
                                  <Icon className={`w-5 h-5 ${model.iconColor}`} />
                                </div>
                                <div>
                                  <div className='dark:text-white'>{model.name}</div>
                                  <div className='text-xs text-gray-500 dark:text-gray-400'>
                                    {model.provider} · {model.version}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className='px-6 py-4 text-sm text-gray-600 dark:text-gray-400'>{model.type}</td>
                            <td className='px-6 py-4'>
                              <Badge className={`text-xs ${model.statusColor} border-0`}>{model.status}</Badge>
                            </td>
                            <td className='px-6 py-4 text-sm text-gray-600 dark:text-gray-400'>
                              <div>{model.performance.latency}</div>
                              <div className='text-xs'>{model.performance.accuracy}</div>
                            </td>
                            <td className='px-6 py-4 text-sm text-gray-600 dark:text-gray-400'>
                              <div>{model.calls}</div>
                              <div className='text-xs dark:text-white'>{model.cost}</div>
                            </td>
                            <td className='px-6 py-4'>
                              <div className='flex items-center gap-2'>
                                <button
                                  onClick={() => handleToggleStatus(model)}
                                  className='p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded'
                                  disabled={
                                    !model.statusEnum || model.statusEnum === ModelStatusEnum.ERROR || modelsLoading
                                  }
                                >
                                  {model.statusEnum === ModelStatusEnum.RUNNING ? (
                                    <Pause className='w-4 h-4 text-orange-500' />
                                  ) : (
                                    <Play className='w-4 h-4 text-green-500' />
                                  )}
                                </button>
                                <button
                                  onClick={() => handleViewDetails(model)}
                                  className='p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded'
                                >
                                  <Eye className='w-4 h-4 text-blue-500' />
                                </button>
                                <button
                                  onClick={() => handleOpenEdit(model)}
                                  className='p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded'
                                >
                                  <Edit className='w-4 h-4 text-gray-600 dark:text-gray-400' />
                                </button>
                                <button
                                  onClick={() => handleDeleteModel(model)}
                                  className='p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded'
                                >
                                  <Trash2 className='w-4 h-4 text-red-500' />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          )}
          {/* Table View Pagination */}
          {shouldShowPagination && (
            <XcanPagination
              pageSize={itemsPerPage}
              pageNo={currentPage}
              total={modelsTotal}
              onChange={({ pageNo }) => {
                setCurrentPage(pageNo);
              }}
            />
          )}

      {/* 查看详情对话框 */}
      <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
        <DialogContent className='dark:bg-gray-800 dark:border-gray-700 sm:max-w-[700px] max-h-[90vh] overflow-y-auto'>
          <DialogHeader>
            <DialogTitle className='dark:text-white'>{t('models.details.title')}</DialogTitle>
            <DialogDescription className='dark:text-gray-400'>{t('models.details.description')}</DialogDescription>
          </DialogHeader>

          {selectedModel && (
            <div className='space-y-6 py-4'>
              {/* 基本信息 */}
              <div className='flex items-start gap-4'>
                <div
                  className={`${selectedModel.iconBg} w-16 h-16 rounded-lg flex items-center justify-center flex-shrink-0`}
                >
                  {selectedModel.icon && <selectedModel.icon className={`w-8 h-8 ${selectedModel.iconColor}`} />}
                </div>
                <div className='flex-1'>
                  <h3 className='text-xl mb-1 dark:text-white'>{selectedModel.name}</h3>
                  <p className='text-sm text-gray-600 dark:text-gray-400 mb-2'>{selectedModel.description}</p>
                  <Badge className={`text-xs ${selectedModel.statusColor} border-0`}>{selectedModel.status}</Badge>
                </div>
              </div>

              {/* 模型信息 */}
              <div className='grid grid-cols-2 gap-4'>
                <div className='space-y-1'>
                  <div className='text-xs text-gray-500 dark:text-gray-400'>{t('models.table.provider')}</div>
                  <div className='dark:text-white'>{selectedModel.provider}</div>
                </div>
                <div className='space-y-1'>
                  <div className='text-xs text-gray-500 dark:text-gray-400'>{t('models.table.version')}</div>
                  <div className='dark:text-white'>{selectedModel.version}</div>
                </div>
                <div className='space-y-1'>
                  <div className='text-xs text-gray-500 dark:text-gray-400'>{t('models.table.type')}</div>
                  <div className='dark:text-white'>{selectedModel.type}</div>
                </div>
                <div className='space-y-1'>
                  <div className='text-xs text-gray-500 dark:text-gray-400'>{t('models.details.addedAt')}</div>
                  <div className='dark:text-white'>{selectedModel.deployed}</div>
                </div>
              </div>

              {/* 性能指标 */}
              <div className='pt-4 border-t border-gray-200 dark:border-gray-700'>
                <h4 className='text-sm mb-3 dark:text-white'>{t('models.details.performanceMetrics')}</h4>
                <div className='grid grid-cols-3 gap-4'>
                  <Card className='p-4 dark:bg-gray-900 dark:border-gray-700'>
                    <div className='text-xs text-gray-500 dark:text-gray-400 mb-1'>{t('models.table.latency')}</div>
                    <div className='text-lg dark:text-white'>{selectedModel.performance.latency}</div>
                  </Card>
                  <Card className='p-4 dark:bg-gray-900 dark:border-gray-700'>
                    <div className='text-xs text-gray-500 dark:text-gray-400 mb-1'>{t('models.details.throughput')}</div>
                    <div className='text-lg dark:text-white'>{selectedModel.performance.throughput}</div>
                  </Card>
                  <Card className='p-4 dark:bg-gray-900 dark:border-gray-700'>
                    <div className='text-xs text-gray-500 dark:text-gray-400 mb-1'>{t('models.details.accuracy')}</div>
                    <div className='text-lg dark:text-white'>{selectedModel.performance.accuracy}</div>
                  </Card>
                </div>
              </div>

              {/* 使用统计 */}
              <div className='pt-4 border-t border-gray-200 dark:border-gray-700'>
                <h4 className='text-sm mb-3 dark:text-white'>{t('models.details.usageStats')}</h4>
                <div className='grid grid-cols-3 gap-4'>
                  <div className='space-y-1'>
                    <div className='text-xs text-gray-500 dark:text-gray-400'>{t('models.details.totalCalls')}</div>
                    <div className='text-xl dark:text-white'>{selectedModel.calls}</div>
                  </div>
                  <div className='space-y-1'>
                    <div className='text-xs text-gray-500 dark:text-gray-400'>{t('models.details.totalCost')}</div>
                    <div className='text-xl dark:text-white'>{selectedModel.cost}</div>
                  </div>
                  <div className='space-y-1'>
                    <div className='text-xs text-gray-500 dark:text-gray-400'>{t('models.details.totalTokens')}</div>
                    <div className='text-xl dark:text-white'>{selectedModel.tokens || '2.5M'}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => setDetailsDialogOpen(false)}
              className='dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300'
            >
              {t('models.actions.close')}
            </Button>
            <Button
              onClick={() => {
                setDetailsDialogOpen(false);
                selectedModel && handleOpenEdit(selectedModel);
              }}
              className='bg-blue-500 hover:bg-blue-600'
            >
              {t('models.actions.editConfig')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 编辑配置对话框 */}
      <EditModelDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        formData={editFormData}
        onFormDataChange={handleEditFormDataChange}
        onSubmit={handleSaveEdit}
        onReset={resetEditForm}
        providerOptions={providerOptions}
      />
    </div>
  );
}
