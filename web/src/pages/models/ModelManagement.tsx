import { useCallback, useEffect, useMemo, useState, type ElementType } from 'react';
import { useLanguage } from '@/components/ui/LanguageProvider';
import {
  Database,
  Search,
  Filter,
  Plus,
  TrendingUp,
  Activity,
  Grid3x3,
  List,
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
  Play,
  Pause,
  Settings,
  Cpu,
  Zap,
  Brain,
  FileText,
  Image as ImageIcon,
  Video,
  Info,
  Sliders,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, } from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, XcanPagination} from '@/components/ui/pagination';
import { toast } from 'sonner';
import { useDebounce } from '@/hooks/useDebounce';
import ModelsService from '@/services/Models';
import {
  GetModelListParamsOrderByEnum,
  ModelDetailVo,
  ModelListVo,
  ModelStatisticsVo,
  ModelUpdateDto,
  ModelCreateDto,
} from '@/services/ModelsTypes';
import { ModelProviderEnum, ModelStatusEnum, ModelTypeEnum } from '@/enums/enums';

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
      return {
        labelZh: '对话模型',
        labelEn: 'Chat',
        icon: Brain,
        iconBg: 'bg-blue-50 dark:bg-blue-900/20',
        iconColor: 'text-blue-500',
      };
    case ModelTypeEnum.IMAGE:
      return {
        labelZh: '图像模型',
        labelEn: 'Image',
        icon: ImageIcon,
        iconBg: 'bg-pink-50 dark:bg-pink-900/20',
        iconColor: 'text-pink-500',
      };
    case ModelTypeEnum.AUDIO:
      return {
        labelZh: '语音模型',
        labelEn: 'Audio',
        icon: FileText,
        iconBg: 'bg-green-50 dark:bg-green-900/20',
        iconColor: 'text-green-500',
      };
    case ModelTypeEnum.EMBEDDING:
      return {
        labelZh: '嵌入模型',
        labelEn: 'Embedding',
        icon: Cpu,
        iconBg: 'bg-indigo-50 dark:bg-indigo-900/20',
        iconColor: 'text-indigo-500',
      };
    case ModelTypeEnum.MODERATION:
      return {
        labelZh: '审核模型',
        labelEn: 'Moderation',
        icon: Activity,
        iconBg: 'bg-orange-50 dark:bg-orange-900/20',
        iconColor: 'text-orange-500',
      };
    default:
      return {
        labelZh: '其他模型',
        labelEn: 'Other',
        icon: Cpu,
        iconBg: 'bg-gray-100 dark:bg-gray-800',
        iconColor: 'text-gray-500',
      };
  }
};

const mapStatusToConfig = (status?: ModelStatusEnum | string) => {
  switch (status) {
    case ModelStatusEnum.RUNNING:
      return {
        labelZh: '运行中',
        labelEn: 'Running',
        color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      };
    case ModelStatusEnum.STOPPED:
      return {
        labelZh: '已停止',
        labelEn: 'Stopped',
        color: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
      };
    case ModelStatusEnum.ERROR:
      return {
        labelZh: '异常',
        labelEn: 'Error',
        color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
      };
    default:
      return {
        labelZh: '未知',
        labelEn: 'Unknown',
        color: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
      };
  }
};

export function ModelManagement() {
  const { language } = useLanguage();
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

  const providerOptions = useMemo(
    () => [
      { value: ModelProviderEnum.OPENAI, label: 'OpenAI', category: '主要提供商' },
      { value: ModelProviderEnum.ANTHROPIC, label: 'Anthropic Claude', category: '主要提供商' },
      { value: ModelProviderEnum.AZURE_OPENAI, label: 'Azure OpenAI', category: '主要提供商' },
      { value: ModelProviderEnum.GOOGLE_VERTEXAI, label: 'Google VertexAI Gemini', category: '主要提供商' },
      { value: ModelProviderEnum.AMAZON_BEDROCK, label: 'Amazon Bedrock', category: '主要提供商' },
      { value: ModelProviderEnum.OLLAMA, label: 'Ollama', category: '开源和本地模型' },
      { value: ModelProviderEnum.HUGGINGFACE, label: 'HuggingFace', category: '开源和本地模型' },
      { value: ModelProviderEnum.ONNX_TRANSFORMERS, label: 'ONNX Transformers', category: '开源和本地模型' },
      { value: ModelProviderEnum.POSTGRESML, label: 'PostgresML', category: '开源和本地模型' },
      { value: ModelProviderEnum.MISTRAL_AI, label: 'Mistral AI', category: '专业AI公司' },
      { value: ModelProviderEnum.DEEPSEEK, label: 'DeepSeek', category: '专业AI公司' },
      { value: ModelProviderEnum.MOONSHOT_AI, label: 'Moonshot AI', category: '专业AI公司' },
      { value: ModelProviderEnum.ZHIPU_AI, label: '智谱AI', category: '专业AI公司' },
      { value: ModelProviderEnum.MINIMAX, label: 'MiniMax', category: '专业AI公司' },
      { value: ModelProviderEnum.GROQ, label: 'Groq', category: '云服务提供商' },
      { value: ModelProviderEnum.NVIDIA, label: 'NVIDIA', category: '云服务提供商' },
      { value: ModelProviderEnum.OCI_GENAI, label: 'OCI GenAI/Cohere', category: '云服务提供商' },
      { value: ModelProviderEnum.PERPLEXITY, label: 'Perplexity', category: '云服务提供商' },
      { value: ModelProviderEnum.QIANFAN, label: '千帆', category: '云服务提供商' },
      { value: ModelProviderEnum.STABILITY, label: 'Stability AI', category: '云服务提供商' },
      { value: ModelProviderEnum.LOCAL, label: '本地部署', category: '其他' },
      { value: ModelProviderEnum.CUSTOM, label: '自定义', category: '其他' },
    ],
    []
  );

  const providerLabelMap = useMemo(() => {
    const map = new Map<string, string>();
    providerOptions.forEach(option => {
      map.set(option.value, option.label);
    });
    return map;
  }, [providerOptions]);

  const modelTypeOptions = useMemo(
    () => [
      { value: ModelTypeEnum.CHAT, labelZh: '对话模型', labelEn: 'Chat', icon: Brain },
      { value: ModelTypeEnum.IMAGE, labelZh: '图像模型', labelEn: 'Image', icon: ImageIcon },
      { value: ModelTypeEnum.AUDIO, labelZh: '语音模型', labelEn: 'Audio', icon: FileText },
      { value: ModelTypeEnum.EMBEDDING, labelZh: '嵌入模型', labelEn: 'Embedding', icon: Cpu },
      { value: ModelTypeEnum.MODERATION, labelZh: '审核模型', labelEn: 'Moderation', icon: Activity },
    ],
    []
  );

  const resolveOrderBy = useCallback(
    (value: SortOption): GetModelListParamsOrderByEnum | undefined => {
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
    },
    []
  );

  const statsCards = useMemo(() => {
    const today = stats?.todayGrowthTrend;
    const lastMonth = stats?.lastMonthGrowthTrend;
    const averageLatency = stats?.averageLatencyMs;

    const totalModelsValue = formatNumber(stats?.totalModels);
    const totalCostValue = stats?.totalCost !== undefined ? formatCurrency(stats?.totalCost, language) : '--';
    const totalCallsValue = formatNumber(stats?.totalCalls);
    const latencyValue =
      averageLatency !== undefined && averageLatency !== null ? `${averageLatency}ms` : '--';

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
        trend:
          lastMonth?.addedModels !== undefined
            ? `+${formatNumber(lastMonth.addedModels)}`
            : undefined,
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
        trend:
          lastMonth?.addedCost !== undefined
            ? `+${formatCurrency(lastMonth.addedCost, language)}`
            : undefined,
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
        trend:
          lastMonth?.addedCalls !== undefined
            ? `+${formatNumber(lastMonth.addedCalls)}`
            : undefined,
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

  const buildModelItem = useCallback(
    (item: ModelListVo, detail?: ModelDetailVo): ModelListItem | null => {
      const id = item.id !== undefined && item.id !== null ? String(item.id) : '';
      if (!id) {
        return null;
      }

      const typeConfig = mapTypeToConfig(item.type);
      const statusConfig = mapStatusToConfig(item.status);
      const providerLabel =
        providerLabelMap.get((item.provider ?? detail?.provider) ?? '') ??
        item.provider ??
        detail?.provider ??
        '--';
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
        type: language === 'zh-CN' ? typeConfig.labelZh : typeConfig.labelEn,
        typeEnum: item.type as ModelTypeEnum | undefined,
        icon: typeConfig.icon,
        iconBg: typeConfig.iconBg,
        iconColor: typeConfig.iconColor,
        provider: providerLabel,
        providerEnum: item.provider as ModelProviderEnum | undefined,
        version: item.version ?? detail?.version ?? '--',
        status: language === 'zh-CN' ? statusConfig.labelZh : statusConfig.labelEn,
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
        cost:
          detailStats?.totalCost !== undefined
            ? formatCurrency(detailStats.totalCost, language)
            : '--',
        tokens: tokens !== undefined ? formatNumber(tokens) : undefined,
        deployed,
        detail,
      };
    },
    [language, providerLabelMap]
  );

  const loadStatistics = useCallback(async () => {
    try {
      const response = await ModelsService.getModelStatistics();
      const responseData = (response as any)?.data;
      setStats(responseData ?? null);
    } catch (error: any) {
      console.error('Failed to load model statistics:', error);
      toast.error(error?.message || '获取模型统计失败');
    }
  }, []);

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
      toast.error(error?.message || '加载模型列表失败');
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
          toast.success(`${model.name} 已停止`);
        } else {
          await ModelsService.startModel(model.id);
          toast.success(`${model.name} 已启动`);
        }
        await loadModels();
        await loadStatistics();
      } catch (error: any) {
        console.error('Failed to toggle model status:', error);
        toast.error(error?.message || '更新模型状态失败');
      }
    },
    [loadModels, loadStatistics]
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
          setModels(prev =>
            prev.map(item => (item.id === model.id ? {...item, detail} : item))
          );
          setSelectedModel(prev => (prev && prev.id === model.id ? {...prev, detail} : prev));
        }
      } catch (error: any) {
        toast.error(error?.message || '获取模型详情失败');
      }
    },
    [fetchModelDetail]
  );

  const handleOpenEdit = useCallback(
    async (model: ModelListItem) => {
    setSelectedModel(model);
      let detail = model.detail;

      if (!detail) {
        try {
          detail = await fetchModelDetail(model.id);
          if (detail) {
            setModels(prev =>
              prev.map(item => (item.id === model.id ? {...item, detail} : item))
            );
            setSelectedModel(prev => (prev && prev.id === model.id ? {...prev, detail} : prev));
          }
        } catch (error: any) {
          toast.error(error?.message || '获取模型详情失败');
          return;
        }
      }
      debugger;

      const providerValue =
        detail?.provider?.value ?? model.providerEnum ?? ModelProviderEnum.CUSTOM;

    setEditFormData({
        name: detail?.name ?? model.name ?? '',
        description: detail?.description ?? model.description ?? '',
        type: detail?.type ?? model.typeEnum ?? ModelTypeEnum.CHAT,
        provider: providerValue,
        version: detail?.version ?? model.version ?? '',
        apiKey: detail?.config?.apiKey ?? '',
        endpoint: detail?.config?.apiEndpoint ?? '',
        maxTokens:
          detail?.config?.maxTokens !== undefined
            ? String(detail.config.maxTokens)
            : '',
        temperature:
          detail?.config?.temperature !== undefined
            ? String(detail.config.temperature)
            : '0.7',
    });
    setEditDialogOpen(true);
    },
    [fetchModelDetail]
  );

  const handleSaveEdit = useCallback(async () => {
    if (!selectedModel) {
      toast.error('未选择模型');
      return;
    }

    if (!editFormData.name.trim() || !editFormData.provider || !editFormData.version.trim()) {
      toast.error('请填写必填字段');
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
    toast.success(`模型 "${editFormData.name}" 配置已更新`);
    setEditDialogOpen(false);
      await loadModels();
      await loadStatistics();
    } catch (error: any) {
      console.error('Failed to update model:', error);
      toast.error(error?.message || '更新模型失败');
    }
  }, [editFormData, loadModels, loadStatistics, selectedModel]);

  const handleDeleteModel = useCallback(
    async (model: ModelListItem) => {
      if (!model.id) {
        return;
      }
      try {
        await ModelsService.deleteModel(model.id);
    toast.success(`模型 "${model.name}" 已删除`);
        await loadModels();
        await loadStatistics();
      } catch (error: any) {
        console.error('Failed to delete model:', error);
        toast.error(error?.message || '删除模型失败');
      }
    },
    [loadModels, loadStatistics]
  );

  const handleAddModel = useCallback(async () => {
    if (!formData.name.trim() || !formData.provider || !formData.version.trim()) {
      toast.error('请填写必填字段');
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
    toast.success(`模型 "${formData.name}" 已成功添加！`);
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
      toast.error(error?.message || '添加模型失败');
    }
  }, [formData, loadModels, loadStatistics]);

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div>
        <h1 className='text-2xl mb-1 dark:text-white'>模型管理</h1>
        <p className='text-sm text-gray-600 dark:text-gray-400'>管理和监控AI模型的部署和性能</p>
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

      {/* Tabs */}
      <Tabs defaultValue='all' className='w-full'>
        <TabsList className='dark:bg-gray-800'>
          <TabsTrigger value='all'>全部模型</TabsTrigger>
          {/* <TabsTrigger value='language'>语言模型</TabsTrigger>
          <TabsTrigger value='image'>图像模型</TabsTrigger>
          <TabsTrigger value='video'>视频模型</TabsTrigger> */}
        </TabsList>

        <TabsContent value='all' className='space-y-4 mt-0'>
          {/* Action Bar */}
          <div className='flex items-center justify-between gap-3'>
            {/* Search Bar */}
            <div className='relative w-[390px]'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400' />
              <Input
                placeholder='搜索模型...'
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
                  <SelectValue placeholder='类型筛选' />
                </SelectTrigger>
                <SelectContent className='dark:bg-gray-800 dark:border-gray-700'>
                  <SelectItem value='all' className='dark:text-gray-300'>
                    {language === 'zh-CN' ? '全部类型' : 'All Types'}
                  </SelectItem>
                  {modelTypeOptions.map(option => {
                    const Icon = option.icon;
                    return (
                      <SelectItem key={option.value} value={option.value} className='dark:text-gray-300'>
                        <div className='flex items-center gap-2'>
                          <Icon className='w-4 h-4' />
                          {language === 'zh-CN' ? option.labelZh : option.labelEn}
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
                  <SelectValue placeholder='状态筛选' />
                </SelectTrigger>
                <SelectContent className='dark:bg-gray-800 dark:border-gray-700'>
                  <SelectItem value='all' className='dark:text-gray-300'>
                    {language === 'zh-CN' ? '全部状态' : 'All Statuses'}
                  </SelectItem>
                  <SelectItem value={ModelStatusEnum.RUNNING} className='dark:text-gray-300'>
                    {language === 'zh-CN' ? '运行中' : 'Running'}
                  </SelectItem>
                  <SelectItem value={ModelStatusEnum.STOPPED} className='dark:text-gray-300'>
                    {language === 'zh-CN' ? '已停止' : 'Stopped'}
                  </SelectItem>
                  <SelectItem value={ModelStatusEnum.ERROR} className='dark:text-gray-300'>
                    {language === 'zh-CN' ? '异常' : 'Error'}
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
                    {language === 'zh-CN' ? '默认排序' : 'Default'}
                  </SelectItem>
                  <SelectItem value='name' className='dark:text-gray-300'>
                    {language === 'zh-CN' ? '名称' : 'Name'}
                  </SelectItem>
                  <SelectItem value='provider' className='dark:text-gray-300'>
                    {language === 'zh-CN' ? '提供商' : 'Provider'}
                  </SelectItem>
                  <SelectItem value='status' className='dark:text-gray-300'>
                    {language === 'zh-CN' ? '状态' : 'Status'}
                  </SelectItem>
                  <SelectItem value='createdDate' className='dark:text-gray-300'>
                    {language === 'zh-CN' ? '创建时间' : 'Created'}
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

              <Dialog open={addModelDialogOpen} onOpenChange={setAddModelDialogOpen}>
                <DialogTrigger asChild>
                  <Button className='bg-blue-500 hover:bg-blue-600'>
                    <Plus className='w-4 h-4 mr-2' />
                    添加模型
                  </Button>
                </DialogTrigger>
                <DialogContent className='dark:bg-gray-800 dark:border-gray-700 sm:max-w-[600px] max-h-[90vh] overflow-y-auto'>
                  <DialogHeader>
                    <DialogTitle className='dark:text-white'>添加新模型</DialogTitle>
                    <DialogDescription className='dark:text-gray-400'>
                      配置并添加一个新的AI模型到您的工作空间
                    </DialogDescription>
                  </DialogHeader>

                  <div className='space-y-4 py-4'>
                    {/* 基本信息 */}
                    <div className='space-y-3'>
                      <h3 className='text-sm dark:text-white flex items-center gap-2'>
                        <Info className='w-4 h-4 text-blue-500' />
                        基本信息
                      </h3>

                      <div className='space-y-2'>
                        <Label htmlFor='model-name' className='dark:text-gray-300'>
                          模型名称 <span className='text-red-500'>*</span>
                        </Label>
                        <Input
                          id='model-name'
                          placeholder='例如: GPT-4 Turbo'
                          value={formData.name}
                          onChange={e => setFormData({ ...formData, name: e.target.value })}
                          className='dark:bg-gray-700 dark:border-gray-600'
                        />
                      </div>

                      <div className='space-y-2'>
                        <Label htmlFor='model-description' className='dark:text-gray-300'>
                          描述
                        </Label>
                        <Textarea
                          id='model-description'
                          placeholder='简要描述这个模型的功能和用途...'
                          value={formData.description}
                          onChange={e =>
                            setFormData({
                              ...formData,
                              description: e.target.value,
                            })
                          }
                          className='dark:bg-gray-700 dark:border-gray-600 min-h-[80px]'
                        />
                      </div>

                      <div className='grid grid-cols-2 gap-3'>
                        <div className='space-y-2'>
                          <Label htmlFor='model-type' className='dark:text-gray-300'>
                            模型类型 <span className='text-red-500'>*</span>
                          </Label>
                          <Select
                            value={formData.type}
                            onValueChange={value =>
                              setFormData({ ...formData, type: value as ModelTypeEnum })
                            }
                          >
                            <SelectTrigger id='model-type' className='dark:bg-gray-700 dark:border-gray-600'>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className='dark:bg-gray-800 dark:border-gray-700'>
                              {modelTypeOptions.map(option => {
                                const Icon = option.icon;
                                return (
                                  <SelectItem key={option.value} value={option.value} className='dark:text-gray-300'>
                                    <div className='flex items-center gap-2'>
                                      <Icon className='w-4 h-4' />
                                      {language === 'zh-CN' ? option.labelZh : option.labelEn}
                                    </div>
                                  </SelectItem>
                                );
                              })}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className='space-y-2'>
                          <Label htmlFor='model-provider' className='dark:text-gray-300'>
                            提供商 <span className='text-red-500'>*</span>
                          </Label>
                          <Select
                            value={formData.provider}
                            onValueChange={value =>
                              setFormData({ ...formData, provider: value })
                            }
                          >
                            <SelectTrigger id='model-provider' className='dark:bg-gray-700 dark:border-gray-600'>
                              <SelectValue placeholder='选择提供商' />
                            </SelectTrigger>
                            <SelectContent className='dark:bg-gray-800 dark:border-gray-700 max-h-[300px]'>
                              {providerOptions.map(option => (
                                <SelectItem key={option.value} value={option.value} className='dark:text-gray-300'>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className='space-y-2'>
                        <Label htmlFor='model-version' className='dark:text-gray-300'>
                          版本 <span className='text-red-500'>*</span>
                        </Label>
                        <Input
                          id='model-version'
                          placeholder='例如: gpt-4-turbo-2024-04'
                          value={formData.version}
                          onChange={e =>
                            setFormData({
                              ...formData,
                              version: e.target.value,
                            })
                          }
                          className='dark:bg-gray-700 dark:border-gray-600'
                        />
                      </div>
                    </div>

                    {/* API配置 */}
                    <div className='space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700'>
                      <h3 className='text-sm dark:text-white flex items-center gap-2'>
                        <Settings className='w-4 h-4 text-green-500' />
                        API配置
                      </h3>

                      <div className='space-y-2'>
                        <Label htmlFor='model-endpoint' className='dark:text-gray-300'>
                          API端点
                        </Label>
                        <Input
                          id='model-endpoint'
                          placeholder='https://api.example.com/v1'
                          value={formData.endpoint}
                          onChange={e =>
                            setFormData({
                              ...formData,
                              endpoint: e.target.value,
                            })
                          }
                          className='dark:bg-gray-700 dark:border-gray-600'
                        />
                      </div>

                      <div className='space-y-2'>
                        <Label htmlFor='model-apikey' className='dark:text-gray-300'>
                          API密钥
                        </Label>
                        <Input
                          id='model-apikey'
                          type='password'
                          placeholder='sk-...'
                          value={formData.apiKey}
                          onChange={e => setFormData({ ...formData, apiKey: e.target.value })}
                          className='dark:bg-gray-700 dark:border-gray-600'
                        />
                      </div>
                    </div>

                    {/* 模型参数 */}
                    <div className='space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700'>
                      <h3 className='text-sm dark:text-white flex items-center gap-2'>
                        <Sliders className='w-4 h-4 text-purple-500' />
                        模型参数
                      </h3>

                      <div className='grid grid-cols-2 gap-3'>
                        <div className='space-y-2'>
                          <Label htmlFor='model-maxTokens' className='dark:text-gray-300'>
                            最大Tokens
                          </Label>
                          <Input
                            id='model-maxTokens'
                            type='number'
                            placeholder='4096'
                            value={formData.maxTokens}
                            onChange={e =>
                              setFormData({
                                ...formData,
                                maxTokens: e.target.value,
                              })
                            }
                            className='dark:bg-gray-700 dark:border-gray-600'
                          />
                        </div>

                        <div className='space-y-2'>
                          <Label htmlFor='model-temperature' className='dark:text-gray-300'>
                            Temperature
                          </Label>
                          <Input
                            id='model-temperature'
                            type='number'
                            step='0.1'
                            min='0'
                            max='2'
                            placeholder='0.7'
                            value={formData.temperature}
                            onChange={e =>
                              setFormData({
                                ...formData,
                                temperature: e.target.value,
                              })
                            }
                            className='dark:bg-gray-700 dark:border-gray-600'
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <DialogFooter>
                    <Button
                      variant='outline'
                      onClick={() => setAddModelDialogOpen(false)}
                      className='dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300'
                    >
                      取消
                    </Button>
                    <Button onClick={handleAddModel} className='bg-blue-500 hover:bg-blue-600'>
                      添加模型
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Grid View */}
          {viewMode === 'grid' && (
            <>
              {modelsLoading ? (
                <Card className='p-12 text-center dark:bg-gray-800 dark:border-gray-700 col-span-full'>
                  <Database className='w-12 h-12 text-gray-400 mx-auto mb-4' />
                  <h3 className='text-lg mb-2 dark:text-white'>
                    {language === 'zh-CN' ? '正在加载模型...' : 'Loading models...'}
                  </h3>
                </Card>
              ) : models.length === 0 ? (
                <Card className='p-12 text-center dark:bg-gray-800 dark:border-gray-700 col-span-full'>
                  <Database className='w-12 h-12 text-gray-400 mx-auto mb-4' />
                  <h3 className='text-lg mb-2 dark:text-white'>
                    {language === 'zh-CN' ? '未找到模型' : 'No models found'}
                  </h3>
                  <p className='text-sm text-gray-600 dark:text-gray-400'>
                    {language === 'zh-CN' ? '尝试调整搜索条件或筛选器' : 'Try adjusting search or filters'}
                  </p>
                </Card>
              ) : (
                <>
                  <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                    {models.map(model => {
                      const Icon = model.icon;
                      const toggleDisabled =
                        !model.statusEnum || model.statusEnum === ModelStatusEnum.ERROR;
                      return (
                        <Card
                          key={model.id}
                          className='p-5 dark:bg-gray-800 dark:border-gray-700 hover:shadow-lg transition-shadow'
                        >
                          <div className='flex items-start justify-between mb-4'>
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
                                  查看详情
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleOpenEdit(model)} className='dark:text-gray-300'>
                                  <Edit className='w-4 h-4 mr-2' />
                                  编辑配置
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleDeleteModel(model)}
                                  className='text-red-600 dark:text-red-400'
                                >
                                  <Trash2 className='w-4 h-4 mr-2' />
                                  删除
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
                              <span className='text-gray-500 dark:text-gray-400'>提供商</span>
                              <span className='dark:text-white'>{model.provider?.message}</span>
                            </div>
                            <div className='flex items-center justify-between'>
                              <span className='text-gray-500 dark:text-gray-400'>版本</span>
                              <span className='dark:text-white'>{model.version}</span>
                            </div>
                            <div className='flex items-center justify-between'>
                              <span className='text-gray-500 dark:text-gray-400'>延迟</span>
                              <span className='dark:text-white'>{model.performance.latency}</span>
                            </div>
                          </div>

                          <div className='flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700 text-sm'>
                            <div>
                              <div className='text-gray-500 dark:text-gray-400 text-xs'>今日调用</div>
                              <div className='dark:text-white'>{model.calls}</div>
                            </div>
                            <div className='text-right'>
                              <div className='text-gray-500 dark:text-gray-400 text-xs'>今日成本</div>
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
                    {language === 'zh-CN' ? '正在加载模型...' : 'Loading models...'}
                  </h3>
                </div>
              ) : models.length === 0 ? (
                <div className='p-12 text-center'>
                  <Database className='w-12 h-12 text-gray-400 mx-auto mb-4' />
                  <h3 className='text-lg mb-2 dark:text-white'>
                    {language === 'zh-CN' ? '未找到模型' : 'No models found'}
                  </h3>
                  <p className='text-sm text-gray-600 dark:text-gray-400'>
                    {language === 'zh-CN' ? '尝试调整搜索条件或筛选器' : 'Try adjusting search or filters'}
                  </p>
                </div>
              ) : (
                <div className='overflow-x-auto'>
                  <table className='w-full'>
                    <thead className='bg-gray-50 dark:bg-gray-900'>
                      <tr>
                        <th className='px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400'>模型</th>
                        <th className='px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400'>类型</th>
                        <th className='px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400'>状态</th>
                        <th className='px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400'>性能</th>
                        <th className='px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400'>调用/成本</th>
                        <th className='px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400'>操作</th>
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
                                    {model.provider?.message} · {model.version}
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
                                    !model.statusEnum ||
                                    model.statusEnum === ModelStatusEnum.ERROR ||
                                    modelsLoading
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
            <XcanPagination pageSize={itemsPerPage} pageNo={currentPage} total={modelsTotal} onChange={({pageNo}) => {
              setCurrentPage(pageNo);
            }} />
          )}
        </TabsContent>

        <TabsContent value='running' className='mt-0'>
          <Card className='p-8 text-center dark:bg-gray-800 dark:border-gray-700'>
            <Activity className='w-12 h-12 text-green-500 mx-auto mb-4' />
            <h3 className='text-lg mb-2 dark:text-white'>运行中的模型</h3>
            <p className='text-sm text-gray-600 dark:text-gray-400 mb-4'>当前有 16 个模型正在运行</p>
          </Card>
        </TabsContent>

        <TabsContent value='language' className='mt-0'>
          <Card className='p-8 text-center dark:bg-gray-800 dark:border-gray-700'>
            <Brain className='w-12 h-12 text-blue-500 mx-auto mb-4' />
            <h3 className='text-lg mb-2 dark:text-white'>语言模型</h3>
            <p className='text-sm text-gray-600 dark:text-gray-400 mb-4'>查看所有语言理解和生成模型</p>
          </Card>
        </TabsContent>

        <TabsContent value='image' className='mt-0'>
          <Card className='p-8 text-center dark:bg-gray-800 dark:border-gray-700'>
            <ImageIcon className='w-12 h-12 text-pink-500 mx-auto mb-4' />
            <h3 className='text-lg mb-2 dark:text-white'>图像模型</h3>
            <p className='text-sm text-gray-600 dark:text-gray-400 mb-4'>查看所有图像生成和处理模型</p>
          </Card>
        </TabsContent>

        <TabsContent value='video' className='mt-0'>
          <Card className='p-8 text-center dark:bg-gray-800 dark:border-gray-700'>
            <Video className='w-12 h-12 text-violet-500 mx-auto mb-4' />
            <h3 className='text-lg mb-2 dark:text-white'>视频模型</h3>
            <p className='text-sm text-gray-600 dark:text-gray-400 mb-4'>查看所有视频生成和处理模型</p>
          </Card>
        </TabsContent>
      </Tabs>

      {/* 查看详情对话框 */}
      <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
        <DialogContent className='dark:bg-gray-800 dark:border-gray-700 sm:max-w-[700px] max-h-[90vh] overflow-y-auto'>
          <DialogHeader>
            <DialogTitle className='dark:text-white'>模型详情</DialogTitle>
            <DialogDescription className='dark:text-gray-400'>查看模型的详细信息和性能指标</DialogDescription>
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
                  <div className='text-xs text-gray-500 dark:text-gray-400'>提供商</div>
                  <div className='dark:text-white'>{selectedModel.provider?.message}</div>
                </div>
                <div className='space-y-1'>
                  <div className='text-xs text-gray-500 dark:text-gray-400'>版本</div>
                  <div className='dark:text-white'>{selectedModel.version}</div>
                </div>
                <div className='space-y-1'>
                  <div className='text-xs text-gray-500 dark:text-gray-400'>类型</div>
                  <div className='dark:text-white'>{selectedModel.type}</div>
                </div>
                <div className='space-y-1'>
                  <div className='text-xs text-gray-500 dark:text-gray-400'>添加时间</div>
                  <div className='dark:text-white'>{selectedModel.deployed}</div>
                </div>
              </div>

              {/* 性能指标 */}
              <div className='pt-4 border-t border-gray-200 dark:border-gray-700'>
                <h4 className='text-sm mb-3 dark:text-white'>性能指标</h4>
                <div className='grid grid-cols-3 gap-4'>
                  <Card className='p-4 dark:bg-gray-900 dark:border-gray-700'>
                    <div className='text-xs text-gray-500 dark:text-gray-400 mb-1'>延迟</div>
                    <div className='text-lg dark:text-white'>{selectedModel.performance.latency}</div>
                  </Card>
                  <Card className='p-4 dark:bg-gray-900 dark:border-gray-700'>
                    <div className='text-xs text-gray-500 dark:text-gray-400 mb-1'>吞吐量</div>
                    <div className='text-lg dark:text-white'>{selectedModel.performance.throughput}</div>
                  </Card>
                  <Card className='p-4 dark:bg-gray-900 dark:border-gray-700'>
                    <div className='text-xs text-gray-500 dark:text-gray-400 mb-1'>准确率</div>
                    <div className='text-lg dark:text-white'>{selectedModel.performance.accuracy}</div>
                  </Card>
                </div>
              </div>

              {/* 使用统计 */}
              <div className='pt-4 border-t border-gray-200 dark:border-gray-700'>
                <h4 className='text-sm mb-3 dark:text-white'>使用统计</h4>
                <div className='grid grid-cols-3 gap-4'>
                  <div className='space-y-1'>
                    <div className='text-xs text-gray-500 dark:text-gray-400'>累计调用次数</div>
                    <div className='text-xl dark:text-white'>{selectedModel.calls}</div>
                  </div>
                  <div className='space-y-1'>
                    <div className='text-xs text-gray-500 dark:text-gray-400'>累计成本</div>
                    <div className='text-xl dark:text-white'>{selectedModel.cost}</div>
                  </div>
                  <div className='space-y-1'>
                    <div className='text-xs text-gray-500 dark:text-gray-400'>累计使用Tokens</div>
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
              关闭
            </Button>
            <Button
              onClick={() => {
                setDetailsDialogOpen(false);
                selectedModel && handleOpenEdit(selectedModel);
              }}
              className='bg-blue-500 hover:bg-blue-600'
            >
              编辑配置
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 编辑配置对话框 */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className='dark:bg-gray-800 dark:border-gray-700 sm:max-w-[600px] max-h-[90vh] overflow-y-auto'>
          <DialogHeader>
            <DialogTitle className='dark:text-white'>编辑模型配置</DialogTitle>
            <DialogDescription className='dark:text-gray-400'>修改模型的配置信息</DialogDescription>
          </DialogHeader>

          <div className='space-y-4 py-4'>
            {/* 基本信息 */}
            <div className='space-y-3'>
              <h3 className='text-sm dark:text-white flex items-center gap-2'>
                <Info className='w-4 h-4 text-blue-500' />
                基本信息
              </h3>

              <div className='space-y-2'>
                <Label htmlFor='edit-model-name' className='dark:text-gray-300'>
                  模型名称 <span className='text-red-500'>*</span>
                </Label>
                <Input
                  id='edit-model-name'
                  value={editFormData.name}
                  onChange={e => setEditFormData({ ...editFormData, name: e.target.value })}
                  className='dark:bg-gray-700 dark:border-gray-600'
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='edit-model-description' className='dark:text-gray-300'>
                  描述
                </Label>
                <Textarea
                  id='edit-model-description'
                  value={editFormData.description}
                  onChange={e =>
                    setEditFormData({
                      ...editFormData,
                      description: e.target.value,
                    })
                  }
                  className='dark:bg-gray-700 dark:border-gray-600 min-h-[80px]'
                />
              </div>

              <div className='grid grid-cols-2 gap-3'>
                <div className='space-y-2'>
                  <Label htmlFor='edit-model-provider' className='dark:text-gray-300'>
                    提供商 <span className='text-red-500'>*</span>
                  </Label>
                  <Select
                    value={editFormData.provider}
                    onValueChange={value => setEditFormData({ ...editFormData, provider: value })}
                  >
                    <SelectTrigger id='edit-model-provider' className='dark:bg-gray-700 dark:border-gray-600'>
                      <SelectValue placeholder='选择提供商' />
                    </SelectTrigger>
                    <SelectContent className='dark:bg-gray-800 dark:border-gray-700 max-h-[300px]'>
                      {providerOptions.map(option => (
                        <SelectItem key={option.value} value={option.value} className='dark:text-gray-300'>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='edit-model-version' className='dark:text-gray-300'>
                    版本 <span className='text-red-500'>*</span>
                  </Label>
                  <Input
                    id='edit-model-version'
                    value={editFormData.version}
                    onChange={e =>
                      setEditFormData({
                        ...editFormData,
                        version: e.target.value,
                      })
                    }
                    className='dark:bg-gray-700 dark:border-gray-600'
                  />
                </div>
              </div>
            </div>

            {/* API配置 */}
            <div className='space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700'>
              <h3 className='text-sm dark:text-white flex items-center gap-2'>
                <Settings className='w-4 h-4 text-green-500' />
                API配置
              </h3>

              <div className='space-y-2'>
                <Label htmlFor='edit-model-endpoint' className='dark:text-gray-300'>
                  API端点
                </Label>
                <Input
                  id='edit-model-endpoint'
                  placeholder='https://api.example.com/v1'
                  value={editFormData.endpoint}
                  onChange={e =>
                    setEditFormData({
                      ...editFormData,
                      endpoint: e.target.value,
                    })
                  }
                  className='dark:bg-gray-700 dark:border-gray-600'
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='edit-model-apikey' className='dark:text-gray-300'>
                  API密钥
                </Label>
                <Input
                  id='edit-model-apikey'
                  type='password'
                  placeholder='留空则不修改'
                  value={editFormData.apiKey}
                  onChange={e => setEditFormData({ ...editFormData, apiKey: e.target.value })}
                  className='dark:bg-gray-700 dark:border-gray-600'
                />
              </div>
            </div>

            {/* 模型参数 */}
            <div className='space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700'>
              <h3 className='text-sm dark:text-white flex items-center gap-2'>
                <Sliders className='w-4 h-4 text-purple-500' />
                模型参数
              </h3>

              <div className='grid grid-cols-2 gap-3'>
                <div className='space-y-2'>
                  <Label htmlFor='edit-model-maxTokens' className='dark:text-gray-300'>
                    最大Tokens
                  </Label>
                  <Input
                    id='edit-model-maxTokens'
                    type='number'
                    placeholder='4096'
                    value={editFormData.maxTokens}
                    onChange={e =>
                      setEditFormData({
                        ...editFormData,
                        maxTokens: e.target.value,
                      })
                    }
                    className='dark:bg-gray-700 dark:border-gray-600'
                  />
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='edit-model-temperature' className='dark:text-gray-300'>
                    Temperature
                  </Label>
                  <Input
                    id='edit-model-temperature'
                    type='number'
                    step='0.1'
                    min='0'
                    max='2'
                    value={editFormData.temperature}
                    onChange={e =>
                      setEditFormData({
                        ...editFormData,
                        temperature: e.target.value,
                      })
                    }
                    className='dark:bg-gray-700 dark:border-gray-600'
                  />
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => setEditDialogOpen(false)}
              className='dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300'
            >
              取消
            </Button>
            <Button onClick={handleSaveEdit} className='bg-blue-500 hover:bg-blue-600'>
              保存修改
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
