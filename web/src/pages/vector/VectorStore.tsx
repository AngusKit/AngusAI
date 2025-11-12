import { useCallback, useEffect, useMemo, useState } from 'react';
import { Database, Plus, Search, X, Settings, Trash2, Play, CheckCircle2, Activity, Zap, Grid3x3, List, Edit, } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, } from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { useLanguage } from '@/components/ui/LanguageProvider';
import { useDebounce } from '@/hooks/useDebounce';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, XcanPagination, } from '@/components/ui/pagination';
import VectorStoresService from '@/services/VectorStores';
import { ConnectionStatusEnum, VectorStoreTypeEnum } from '@/enums/enums';
import { VectorStoreVo, VectorStoreStatisticsVo, VectorStoreCreateDto, VectorStoreUpdateDto, } from '@/services/VectorStoresTypes';

type VectorStoreStatus = ConnectionStatusEnum | 'TESTING';

type VectorStoreItem = {
  id: string;
  name: string;
  type: VectorStoreTypeEnum;
  description: string;
  endpoint?: string;
  status: VectorStoreStatus;
  enabled: boolean;
  dimension?: number;
  indexCount?: number;
  createdTime: string;
  lastSync: string;
  config?: VectorStoreVo['config'];
};

const vectorStoreTypes = [
  { value: VectorStoreTypeEnum.AZURE_AI_SERVICE, label: 'Azure AI Service', icon: '☁️' },
  { value: VectorStoreTypeEnum.AZURE_COSMOS_DB, label: 'Azure Cosmos DB', icon: '🌐' },
  { value: VectorStoreTypeEnum.APACHE_CASSANDRA, label: 'Apache Cassandra Vector Store', icon: '📊' },
  { value: VectorStoreTypeEnum.CHROMA, label: 'Chroma', icon: '🎨' },
  { value: VectorStoreTypeEnum.COUCHBASE, label: 'Couchbase', icon: '🛋️' },
  { value: VectorStoreTypeEnum.ELASTICSEARCH, label: 'Elasticsearch', icon: '🔍' },
  { value: VectorStoreTypeEnum.GEMFIRE, label: 'GemFire', icon: '💎' },
  { value: VectorStoreTypeEnum.MARIADB, label: 'MariaDB Vector Store', icon: '🗄️' },
  { value: VectorStoreTypeEnum.MILVUS, label: 'Milvus', icon: '🦅' },
  { value: VectorStoreTypeEnum.MONGODB_ATLAS, label: 'MongoDB Atlas', icon: '🍃' },
  { value: VectorStoreTypeEnum.NEO4J, label: 'Neo4j', icon: '🔗' },
  { value: VectorStoreTypeEnum.OPENSEARCH, label: 'OpenSearch', icon: '🔎' },
  { value: VectorStoreTypeEnum.ORACLE, label: 'Oracle', icon: '🏛️' },
  { value: VectorStoreTypeEnum.PGVECTOR, label: 'PGvector', icon: '🐘' },
  { value: VectorStoreTypeEnum.PINECONE, label: 'Pinecone', icon: '🌲' },
  { value: VectorStoreTypeEnum.QDRANT, label: 'Qdrant', icon: '⚡' },
  { value: VectorStoreTypeEnum.REDIS, label: 'Redis', icon: '🔴' },
  { value: VectorStoreTypeEnum.SAP_HANA, label: 'SAP Hana', icon: '💼' },
  { value: VectorStoreTypeEnum.TYPESENSE, label: 'Typesense', icon: '⚙️' },
  { value: VectorStoreTypeEnum.WEAVIATE, label: 'Weaviate', icon: '🕸️' },
] as const;

export function VectorStore() {
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingStore, setEditingStore] = useState<VectorStoreItem | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const [vectorStores, setVectorStores] = useState<VectorStoreItem[]>([]);
  const [vectorStoresLoading, setVectorStoresLoading] = useState(false);
  const [vectorStoresTotal, setVectorStoresTotal] = useState(0);
  const [statistics, setStatistics] = useState<VectorStoreStatisticsVo | null>(null);
  const [statisticsLoading, setStatisticsLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [testingConnectionId, setTestingConnectionId] = useState<string | null>(null);

  // 表单状态
  const [formData, setFormData] = useState({
    name: '',
    type: '' as '' | VectorStoreTypeEnum,
    description: '',
    endpoint: '',
    apiKey: '',
    dimension: '1536',
    database: '',
    collection: '',
    username: '',
    password: '',
  });

  const formatNumber = (value?: number | null) => {
    if (value === null || value === undefined || Number.isNaN(value)) {
      return '--';
    }
    return Number(value).toLocaleString(language === 'zh-CN' ? 'zh-CN' : 'en-US');
  };

  const formatVectorCount = (value?: number | null) => {
    if (value === null || value === undefined || Number.isNaN(value)) {
      return '--';
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    return formatNumber(value);
  };

  const formatDateTime = useCallback(
    (value?: string | number | Date | null) => {
      if (!value) {
        return '--';
      }
      const date = new Date(value);
      if (Number.isNaN(date.getTime())) {
        return '--';
      }
      return date.toLocaleString(language === 'zh-CN' ? 'zh-CN' : 'en-US');
    },
    [language]
  );

  const getTypeInfo = useCallback((type?: VectorStoreTypeEnum | string) => {
    if (!type) {
      return { value: 'UNKNOWN', label: 'Unknown', icon: '📦' };
    }
    return (
      vectorStoreTypes.find(t => t.value === type) ?? {
        value: type,
        label: type,
        icon: '📦',
      }
    );
  }, []);

  const getStatusInfo = useCallback(
    (status: VectorStoreStatus): { label: string; badgeClass: string } => {
      switch (status) {
        case ConnectionStatusEnum.CONNECTED:
          return {
            label: language === 'zh-CN' ? '已连接' : 'Connected',
            badgeClass: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-0 text-xs w-fit',
          };
        case 'TESTING':
          return {
            label: language === 'zh-CN' ? '测试中' : 'Testing',
            badgeClass:
              'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border-0 text-xs w-fit',
          };
        case ConnectionStatusEnum.DISCONNECTED:
        default:
          return {
            label: language === 'zh-CN' ? '未连接' : 'Disconnected',
            badgeClass: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-0 text-xs w-fit',
          };
      }
    },
    [language]
  );

  const statsCards = useMemo(() => {
    const overview = statistics?.overview;

    return [
      {
        key: 'totalStores',
        label: language === 'zh-CN' ? '存储源总数' : 'Total Sources',
        value: formatNumber(overview?.totalStores),
        subtext: language === 'zh-CN' ? '已配置向量数据库' : 'Configured databases',
        icon: Database,
        iconBg: 'bg-blue-500',
      },
      {
        key: 'connectedStores',
        label: language === 'zh-CN' ? '已连接' : 'Connected',
        value: formatNumber(overview?.connectedStores),
        subtext: language === 'zh-CN' ? '正常运行中' : 'Currently active',
        icon: CheckCircle2,
        iconBg: 'bg-green-500',
      },
      {
        key: 'totalVectors',
        label: language === 'zh-CN' ? '向量总数' : 'Total Vectors',
        value: formatVectorCount(overview?.totalVectors),
        subtext: language === 'zh-CN' ? '跨所有存储源' : 'Across all sources',
        icon: Activity,
        iconBg: 'bg-purple-500',
      },
      {
        key: 'todayQueries',
        label: language === 'zh-CN' ? '今日查询' : 'Today Queries',
        value: formatNumber(overview?.todayQueries),
        subtext: language === 'zh-CN' ? '今日累计查询次数' : 'Queries today',
        icon: Zap,
        iconBg: 'bg-orange-500',
      },
    ];
  }, [language, statistics]);

  const buildVectorStoreItem = useCallback(
    (store?: VectorStoreVo): VectorStoreItem | null => {
      if (!store?.id) {
        return null;
      }
      const type = store.type ?? VectorStoreTypeEnum.PINECONE;
      const config = store.config;
      const endpoint =
        config?.endpoint ?? (config?.host ? `${config.host}${config.port ? `:${config.port}` : ''}` : undefined);
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
        createdTime: formatDateTime((store as any)?.createdDate),
        lastSync: formatDateTime((store as any)?.updatedDate),
        config,
      };
    },
    [formatDateTime]
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

      const mapped = listData?.map(item => buildVectorStoreItem(item)).filter(Boolean) as VectorStoreItem[] | undefined;

      setVectorStores(mapped ?? []);
    } catch (error: any) {
      console.error('Failed to load vector stores:', error);
      toast.error(
        error?.message || (language === 'zh-CN' ? '加载向量存储列表失败' : 'Failed to load vector store list')
      );
    } finally {
      setVectorStoresLoading(false);
    }
  }, [buildVectorStoreItem, currentPage, debouncedSearchQuery, itemsPerPage, language]);

  useEffect(() => {
    loadStatistics();
  }, [loadStatistics]);

  useEffect(() => {
    loadVectorStores();
  }, [loadVectorStores]);

  useEffect(() => {
    setCurrentPage(prev => (prev === 1 ? prev : 1));
  }, [debouncedSearchQuery]);

  const shouldShowPagination = vectorStoresTotal > itemsPerPage;

  const ensureVectorStoreDetail = useCallback(
    async (store: VectorStoreItem): Promise<VectorStoreItem> => {
      if (store.config && store.config.dimension) {
        return store;
      }
      try {
        const response = await VectorStoresService.vectorStoreGetDetail(store.id);
        const detail = (response as any)?.data as VectorStoreVo | undefined;
        if (detail) {
          const normalized = buildVectorStoreItem(detail);
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
    [buildVectorStoreItem, language]
  );

  const resetForm = () => {
    setFormData({
      name: '',
      type: '' as '' | VectorStoreTypeEnum,
      description: '',
      endpoint: '',
      apiKey: '',
      dimension: '1536',
      database: '',
      collection: '',
      username: '',
      password: '',
    });
  };

  const parseDimension = () => {
    const dimensionValue = Number.parseInt(formData.dimension, 10);
    if (!Number.isFinite(dimensionValue) || dimensionValue <= 0) {
      toast.error(language === 'zh-CN' ? '请输入有效的向量维度' : 'Please enter a valid dimension');
      return null;
    }
    return dimensionValue;
  };

  const buildConfigFromForm = (type: VectorStoreTypeEnum, dimension: number) => ({
    type,
    endpoint: formData.endpoint.trim() || undefined,
    apiKey: formData.apiKey.trim() || undefined,
    database: formData.database.trim() || undefined,
    collection: formData.collection.trim() || undefined,
    username: formData.username.trim() || undefined,
    password: formData.password.trim() || undefined,
    dimension,
  });

  const handleToggleStore = async (store: VectorStoreItem) => {
    if (togglingId === store.id) {
      return;
    }
    setTogglingId(store.id);
    try {
      await VectorStoresService.vectorStoreToggleEnabled(store.id, { enabled: !store.enabled });
      toast.success(
        language === 'zh-CN'
          ? `${store.name} 已${store.enabled ? '禁用' : '启用'}`
          : `${store.name} ${store.enabled ? 'disabled' : 'enabled'}`
      );
      await Promise.all([loadVectorStores(), loadStatistics()]);
    } catch (error: any) {
      console.error('Failed to toggle vector store:', error);
      toast.error(error?.message || (language === 'zh-CN' ? '更新启用状态失败' : 'Failed to update enabled status'));
    } finally {
      setTogglingId(null);
    }
  };

  const handleTestConnection = async (store: VectorStoreItem) => {
    if (testingConnectionId === store.id) {
      return;
    }
    setTestingConnectionId(store.id);
    setVectorStores(prev => prev.map(item => (item.id === store.id ? { ...item, status: 'TESTING' } : item)));
    try {
      const detailedStore = await ensureVectorStoreDetail(store);
      setVectorStores(prev => prev.map(item => (item.id === store.id ? { ...item, status: 'TESTING' } : item)));
      const response = await VectorStoresService.vectorStoreTestConnection(
        { id: detailedStore.id },
        {
          config: detailedStore.config,
          timeout: 30,
        }
      );
      const result = (response as any)?.data;
      toast.success(
        result?.message ||
          (language === 'zh-CN' ? `${detailedStore.name} 测试连接成功` : `${detailedStore.name} connected successfully`)
      );
      await loadVectorStores();
    } catch (error: any) {
      console.error('Failed to test vector store connection:', error);
      toast.error(error?.message || (language === 'zh-CN' ? '连接测试失败' : 'Connection test failed'));
      setVectorStores(prev =>
        prev.map(item =>
          item.id === store.id
            ? { ...item, status: store.status === 'TESTING' ? ConnectionStatusEnum.DISCONNECTED : store.status }
            : item
        )
      );
    } finally {
      setTestingConnectionId(null);
    }
  };

  const handleCreateStore = async () => {
    if (!formData.name.trim()) {
      toast.error(language === 'zh-CN' ? '请输入名称' : 'Please enter a name');
      return;
    }
    if (!formData.type) {
      toast.error(language === 'zh-CN' ? '请选择类型' : 'Please select a type');
      return;
    }
    const dimensionValue = parseDimension();
    if (!dimensionValue) {
      return;
    }

    const payload: VectorStoreCreateDto = {
      name: formData.name.trim(),
      type: formData.type,
      description: formData.description.trim() || undefined,
      config: buildConfigFromForm(formData.type, dimensionValue),
    };

    setCreating(true);
    try {
      await VectorStoresService.vectorStoreCreate(payload);
      toast.success(language === 'zh-CN' ? '向量存储源创建成功' : 'Vector store created successfully');
      setShowCreateDialog(false);
      resetForm();
      setCurrentPage(1);
      await Promise.all([loadVectorStores(), loadStatistics()]);
    } catch (error: any) {
      console.error('Failed to create vector store:', error);
      toast.error(error?.message || (language === 'zh-CN' ? '创建存储源失败' : 'Failed to create vector store'));
    } finally {
      setCreating(false);
    }
  };

  const handleEditStore = async () => {
    if (!editingStore) {
      return;
    }
    if (!formData.name.trim()) {
      toast.error(language === 'zh-CN' ? '请输入名称' : 'Please enter a name');
      return;
    }

    const dimensionValue = parseDimension();
    if (!dimensionValue) {
      return;
    }

    const payload: VectorStoreUpdateDto = {
      name: formData.name.trim(),
      description: formData.description.trim() || undefined,
      config: buildConfigFromForm(editingStore.type, dimensionValue),
    };

    setUpdating(true);
    try {
      await VectorStoresService.vectorStoreUpdate(editingStore.id, payload);
      toast.success(language === 'zh-CN' ? '向量存储源更新成功' : 'Vector store updated successfully');
      setShowEditDialog(false);
      setEditingStore(null);
      resetForm();
      await Promise.all([loadVectorStores(), loadStatistics()]);
    } catch (error: any) {
      console.error('Failed to update vector store:', error);
      toast.error(error?.message || (language === 'zh-CN' ? '更新存储源失败' : 'Failed to update vector store'));
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteStore = async (store: VectorStoreItem) => {
    if (deletingId === store.id) {
      return;
    }
    setDeletingId(store.id);
    try {
      await VectorStoresService.vectorStoreDelete(store.id);
      toast.success(language === 'zh-CN' ? `已删除 ${store.name}` : `Deleted ${store.name}`);
      await Promise.all([loadVectorStores(), loadStatistics()]);
    } catch (error: any) {
      console.error('Failed to delete vector store:', error);
      toast.error(error?.message || (language === 'zh-CN' ? '删除存储源失败' : 'Failed to delete vector store'));
    } finally {
      setDeletingId(null);
    }
  };

  const openEditDialog = async (store: VectorStoreItem) => {
    const detailedStore = await ensureVectorStoreDetail(store);
    setEditingStore(detailedStore);
    setFormData({
      name: detailedStore.name,
      type: detailedStore.type,
      description: detailedStore.description === '--' ? '' : detailedStore.description,
      endpoint: detailedStore.config?.endpoint ?? '',
      apiKey: detailedStore.config?.apiKey ?? '',
      dimension: detailedStore.config?.dimension ? String(detailedStore.config.dimension) : '1536',
      database: detailedStore.config?.database ?? '',
      collection: detailedStore.config?.collection ?? '',
      username: detailedStore.config?.username ?? '',
      password: detailedStore.config?.password ?? '',
    });
    setShowEditDialog(true);
  };

  const storesToDisplay = vectorStores;

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div>
        <h1 className='text-2xl mb-1 dark:text-white'>{language === 'zh-CN' ? '向量存储源' : 'Vector Store'}</h1>
        <p className='text-sm text-gray-600 dark:text-gray-400'>
          {language === 'zh-CN'
            ? '管理向量数据库连接，用于AI应用的向量检索和语义搜索'
            : 'Manage vector database connections for AI applications, vector retrieval and semantic search'}
        </p>
      </div>

      {/* Stats Cards */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
        {statsCards.map(card => {
          const Icon = card.icon;
          return (
            <Card key={card.key} className='px-5 pt-5 pb-3 dark:bg-gray-800 dark:border-gray-700'>
              <div className='flex items-start justify-between mb-1.5'>
                <div className={`${card.iconBg} w-10 h-10 rounded-lg flex items-center justify-center`}>
                  <Icon className='w-5 h-5 text-white' />
                </div>
              </div>
              <div className='text-base font-semibold text-gray-600 dark:text-gray-400 mb-0.5'>{card.label}</div>
              <div className='text-3xl dark:text-white mb-0.5'>{statisticsLoading ? '--' : card.value}</div>
              <div className='text-xs text-gray-500 dark:text-gray-400'>{card.subtext}</div>
            </Card>
          );
        })}
      </div>

      {/* Search and Actions */}
      <div className='flex items-center justify-between gap-3'>
        <div className='relative w-[390px]'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500' />
          <Input
            placeholder={language === 'zh-CN' ? '搜索向量存储源...' : 'Search vector stores...'}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className='pl-10 pr-10 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100'
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors'
            >
              <X className='w-4 h-4' />
            </button>
          )}
        </div>

        <div className='flex items-center gap-3'>
          {/* View Toggle */}
          <div className='flex items-center gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg'>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded transition-colors ${
                viewMode === 'grid' ? 'bg-white dark:bg-gray-700 shadow-sm' : 'hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
              title={language === 'zh-CN' ? '卡片视图' : 'Grid View'}
            >
              <Grid3x3 className='w-4 h-4 text-gray-600 dark:text-gray-400' />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded transition-colors ${
                viewMode === 'list' ? 'bg-white dark:bg-gray-700 shadow-sm' : 'hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
              title={language === 'zh-CN' ? '列表视图' : 'List View'}
            >
              <List className='w-4 h-4 text-gray-600 dark:text-gray-400' />
            </button>
          </div>

          <Button onClick={() => setShowCreateDialog(true)} className='gap-2 dark:bg-blue-600 dark:hover:bg-blue-700'>
            <Plus className='w-4 h-4' />
            {language === 'zh-CN' ? '添加存储源' : 'Add Store'}
          </Button>
        </div>
      </div>

      {/* Vector Stores Content */}
      {vectorStoresLoading ? (
        <div className='text-center py-12'>
          <Activity className='w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-3 animate-spin' />
          <p className='text-gray-600 dark:text-gray-400'>
            {language === 'zh-CN' ? '正在加载向量存储源...' : 'Loading vector stores...'}
          </p>
        </div>
      ) : storesToDisplay.length === 0 ? (
        <div className='text-center py-12'>
          <Database className='w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-3' />
          <p className='text-gray-600 dark:text-gray-400'>
            {language === 'zh-CN' ? '未找到匹配的存储源' : 'No vector stores found'}
          </p>
          <p className='text-sm text-gray-500 dark:text-gray-500 mt-1'>
            {searchQuery
              ? language === 'zh-CN'
                ? '尝试使用其他搜索词'
                : 'Try different search terms'
              : language === 'zh-CN'
                ? '点击上方按钮添加新的向量存储源'
                : 'Click the button above to add a new vector store'}
          </p>
        </div>
      ) : (
        <>
          {/* Grid View */}
          {viewMode === 'grid' && (
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
              {storesToDisplay.map(store => {
                const typeInfo = getTypeInfo(store.type);
                const statusInfo = getStatusInfo(store.status);
                const isToggling = togglingId === store.id;
                const isTesting = testingConnectionId === store.id;
                const isDeleting = deletingId === store.id;
                return (
                  <Card
                    key={store.id}
                    className='p-5 dark:bg-gray-800 dark:border-gray-700 hover:shadow-md transition-shadow'
                  >
                    <div className='flex items-start justify-between mb-4'>
                      <div className='flex items-center gap-3'>
                        <div className='w-12 h-12 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg flex items-center justify-center text-2xl'>
                          {typeInfo.icon}
                        </div>
                        <div>
                          <div className='flex items-center gap-2 mb-1'>
                            <h3 className='dark:text-white'>{store.name}</h3>
                            <Switch
                              checked={store.enabled}
                              disabled={isToggling}
                              onCheckedChange={() => handleToggleStore(store)}
                              onClick={e => e.stopPropagation()}
                            />
                          </div>
                          <p className='text-sm text-gray-600 dark:text-gray-400'>
                            {store.description === '--' ? '' : store.description}
                          </p>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant='ghost' size='sm' className='h-8 w-8 p-0'>
                            <Settings className='w-4 h-4' />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align='end' className='dark:bg-gray-800 dark:border-gray-700'>
                          <DropdownMenuItem onClick={() => void openEditDialog(store)} className='dark:text-gray-300'>
                            <Edit className='w-4 h-4 mr-2' />
                            {language === 'zh-CN' ? '编辑' : 'Edit'}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleTestConnection(store)}
                            disabled={isTesting}
                            className='dark:text-gray-300'
                          >
                            <Play className='w-4 h-4 mr-2' />
                            {language === 'zh-CN' ? '测试连接' : 'Test Connection'}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteStore(store)}
                            disabled={isDeleting}
                            className='text-red-600 dark:text-red-400'
                          >
                            <Trash2 className='w-4 h-4 mr-2' />
                            {language === 'zh-CN' ? '删除' : 'Delete'}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <div className='space-y-3'>
                      <div className='flex items-center gap-2'>
                        <Badge variant='outline' className='dark:border-gray-600 dark:text-gray-300'>
                          {typeInfo.label}
                        </Badge>
                        <Badge className={statusInfo.badgeClass}>{statusInfo.label}</Badge>
                      </div>

                      <div className='grid grid-cols-2 gap-4 text-sm'>
                        <div>
                          <div className='text-gray-500 dark:text-gray-400 mb-1'>
                            {language === 'zh-CN' ? '端点' : 'Endpoint'}
                          </div>
                          <div className='text-gray-700 dark:text-gray-300 truncate'>{store.endpoint ?? '--'}</div>
                        </div>
                        <div>
                          <div className='text-gray-500 dark:text-gray-400 mb-1'>
                            {language === 'zh-CN' ? '维度' : 'Dimension'}
                          </div>
                          <div className='text-gray-700 dark:text-gray-300'>{store.dimension ?? '--'}</div>
                        </div>
                        <div>
                          <div className='text-gray-500 dark:text-gray-400 mb-1'>
                            {language === 'zh-CN' ? '向量数' : 'Vectors'}
                          </div>
                          <div className='text-gray-700 dark:text-gray-300'>
                            {store.indexCount !== undefined ? formatNumber(store.indexCount) : '--'}
                          </div>
                        </div>
                        <div>
                          <div className='text-gray-500 dark:text-gray-400 mb-1'>
                            {language === 'zh-CN' ? '最后同步' : 'Last Sync'}
                          </div>
                          <div className='text-gray-700 dark:text-gray-300'>{store.lastSync}</div>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}

          {/* List View */}
          {viewMode === 'list' && (
            <Card className='dark:bg-gray-800 dark:border-gray-700 overflow-hidden'>
              <div className='overflow-x-auto'>
                <table className='w-full table-fixed'>
                  <colgroup>
                    <col style={{ width: '28%' }} />
                    <col style={{ width: '12%' }} />
                    <col style={{ width: '14%' }} />
                    <col style={{ width: '20%' }} />
                    <col style={{ width: '8%' }} />
                    <col style={{ width: '10%' }} />
                    <col style={{ width: '8%' }} />
                  </colgroup>
                  <thead className='bg-gray-50 dark:bg-gray-900'>
                    <tr>
                      <th className='px-4 py-3 text-left text-xs text-gray-600 dark:text-gray-400'>
                        {language === 'zh-CN' ? '存储源' : 'Store'}
                      </th>
                      <th className='px-4 py-3 text-left text-xs text-gray-600 dark:text-gray-400'>
                        {language === 'zh-CN' ? '类型' : 'Type'}
                      </th>
                      <th className='px-4 py-3 text-left text-xs text-gray-600 dark:text-gray-400'>
                        {language === 'zh-CN' ? '状态' : 'Status'}
                      </th>
                      <th className='px-4 py-3 text-left text-xs text-gray-600 dark:text-gray-400'>
                        {language === 'zh-CN' ? '端点' : 'Endpoint'}
                      </th>
                      <th className='px-4 py-3 text-left text-xs text-gray-600 dark:text-gray-400'>
                        {language === 'zh-CN' ? '维度' : 'Dim'}
                      </th>
                      <th className='px-4 py-3 text-left text-xs text-gray-600 dark:text-gray-400'>
                        {language === 'zh-CN' ? '向量数' : 'Vectors'}
                      </th>
                      <th className='px-4 py-3 text-center text-xs text-gray-600 dark:text-gray-400'>
                        {language === 'zh-CN' ? '操作' : 'Actions'}
                      </th>
                    </tr>
                  </thead>
                  <tbody className='divide-y divide-gray-200 dark:divide-gray-700'>
                    {storesToDisplay.map(store => {
                      const typeInfo = getTypeInfo(store.type);
                      const statusInfo = getStatusInfo(store.status);
                      const isToggling = togglingId === store.id;
                      const isTesting = testingConnectionId === store.id;
                      const isDeleting = deletingId === store.id;
                      return (
                        <tr key={store.id} className='hover:bg-gray-50 dark:hover:bg-gray-900/50'>
                          <td className='px-4 py-3'>
                            <div className='flex items-center gap-2 min-w-0'>
                              <div className='w-8 h-8 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg flex items-center justify-center text-lg flex-shrink-0'>
                                {typeInfo.icon}
                              </div>
                              <div className='min-w-0 flex-1'>
                                <div className='dark:text-white text-sm truncate'>{store.name}</div>
                                <div className='text-xs text-gray-500 dark:text-gray-400 truncate'>
                                  {store.description === '--' ? '' : store.description}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className='px-4 py-3 text-xs text-gray-600 dark:text-gray-400'>
                            <div className='truncate'>{typeInfo.label}</div>
                          </td>
                          <td className='px-4 py-3'>
                            <div className='flex flex-col gap-1.5'>
                              <Badge className={statusInfo.badgeClass}>{statusInfo.label}</Badge>
                              <Switch
                                checked={store.enabled}
                                disabled={isToggling}
                                onCheckedChange={() => handleToggleStore(store)}
                                onClick={e => e.stopPropagation()}
                                className='scale-75 origin-left'
                              />
                            </div>
                          </td>
                          <td className='px-4 py-3 text-xs text-gray-600 dark:text-gray-400'>
                            <div className='truncate' title={store.endpoint}>
                              {store.endpoint ?? '--'}
                            </div>
                          </td>
                          <td className='px-4 py-3 text-xs text-gray-600 dark:text-gray-400'>
                            {store.dimension ?? '--'}
                          </td>
                          <td className='px-4 py-3 text-xs text-gray-600 dark:text-gray-400'>
                            {store.indexCount !== undefined ? formatVectorCount(store.indexCount) : '--'}
                          </td>
                          <td className='px-4 py-3'>
                            <div className='flex items-center justify-center gap-1'>
                              <button
                                onClick={() => handleTestConnection(store)}
                                disabled={isTesting}
                                className='p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors'
                                title={language === 'zh-CN' ? '测试连接' : 'Test Connection'}
                              >
                                <Play className='w-3.5 h-3.5 text-green-500' />
                              </button>
                              <button
                                onClick={() => void openEditDialog(store)}
                                className='p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors'
                                title={language === 'zh-CN' ? '编辑' : 'Edit'}
                              >
                                <Edit className='w-3.5 h-3.5 text-gray-600 dark:text-gray-400' />
                              </button>
                              <button
                                onClick={() => handleDeleteStore(store)}
                                disabled={isDeleting}
                                className='p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors'
                                title={language === 'zh-CN' ? '删除' : 'Delete'}
                              >
                                <Trash2 className='w-3.5 h-3.5 text-red-500' />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          {shouldShowPagination && (
            <div className='flex items-center justify-center mt-6'>
              <XcanPagination
                pageSize={itemsPerPage}
                pageNo={currentPage}
                total={vectorStoresTotal}
                onChange={({ pageNo }) => {
                  setCurrentPage(pageNo);
                }}
              />
            </div>
          )}
        </>
      )}

      {/* Create Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className='max-w-2xl dark:bg-gray-800'>
          <DialogHeader>
            <DialogTitle className='dark:text-white'>
              {language === 'zh-CN' ? '添加向量存储源' : 'Add Vector Store'}
            </DialogTitle>
            <DialogDescription>
              {language === 'zh-CN' ? '配置新的向量数据库连接' : 'Configure a new vector database connection'}
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className='max-h-[500px] pr-4'>
            <div className='space-y-4'>
              <div className='grid grid-cols-2 gap-4'>
                <div className='space-y-2'>
                  <Label className='dark:text-gray-200'>{language === 'zh-CN' ? '名称' : 'Name'}</Label>
                  <Input
                    placeholder={language === 'zh-CN' ? '输入存储源名称' : 'Enter store name'}
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className='dark:bg-gray-750 dark:border-gray-600'
                  />
                </div>

                <div className='space-y-2'>
                  <Label className='dark:text-gray-200'>{language === 'zh-CN' ? '类型' : 'Type'}</Label>
                  <Select
                    value={formData.type}
                    onValueChange={value => setFormData({ ...formData, type: value as VectorStoreTypeEnum })}
                  >
                    <SelectTrigger className='dark:bg-gray-750 dark:border-gray-600'>
                      <SelectValue placeholder={language === 'zh-CN' ? '选择数据库类型' : 'Select database type'} />
                    </SelectTrigger>
                    <SelectContent className='dark:bg-gray-800 dark:border-gray-700'>
                      {vectorStoreTypes.map(type => (
                        <SelectItem key={type.value} value={type.value} className='dark:text-gray-300'>
                          {type.icon} {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className='space-y-2'>
                <Label className='dark:text-gray-200'>{language === 'zh-CN' ? '描述' : 'Description'}</Label>
                <Textarea
                  placeholder={language === 'zh-CN' ? '输入描述信息' : 'Enter description'}
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className='dark:bg-gray-750 dark:border-gray-600'
                  rows={2}
                />
              </div>

              <div className='space-y-2'>
                <Label className='dark:text-gray-200'>{language === 'zh-CN' ? '端点地址' : 'Endpoint'}</Label>
                <Input
                  placeholder='https://...'
                  value={formData.endpoint}
                  onChange={e => setFormData({ ...formData, endpoint: e.target.value })}
                  className='dark:bg-gray-750 dark:border-gray-600'
                />
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <div className='space-y-2'>
                  <Label className='dark:text-gray-200'>{language === 'zh-CN' ? 'API密钥' : 'API Key'}</Label>
                  <Input
                    type='password'
                    placeholder='sk-...'
                    value={formData.apiKey}
                    onChange={e => setFormData({ ...formData, apiKey: e.target.value })}
                    className='dark:bg-gray-750 dark:border-gray-600'
                  />
                </div>

                <div className='space-y-2'>
                  <Label className='dark:text-gray-200'>{language === 'zh-CN' ? '向量维度' : 'Dimension'}</Label>
                  <Input
                    type='number'
                    placeholder='1536'
                    value={formData.dimension}
                    onChange={e => setFormData({ ...formData, dimension: e.target.value })}
                    className='dark:bg-gray-750 dark:border-gray-600'
                  />
                </div>
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <div className='space-y-2'>
                  <Label className='dark:text-gray-200'>{language === 'zh-CN' ? '数据库' : 'Database'}</Label>
                  <Input
                    placeholder={language === 'zh-CN' ? '数据库名称' : 'Database name'}
                    value={formData.database}
                    onChange={e => setFormData({ ...formData, database: e.target.value })}
                    className='dark:bg-gray-750 dark:border-gray-600'
                  />
                </div>

                <div className='space-y-2'>
                  <Label className='dark:text-gray-200'>
                    {language === 'zh-CN' ? '集合/索引' : 'Collection/Index'}
                  </Label>
                  <Input
                    placeholder={language === 'zh-CN' ? '集合名称' : 'Collection name'}
                    value={formData.collection}
                    onChange={e => setFormData({ ...formData, collection: e.target.value })}
                    className='dark:bg-gray-750 dark:border-gray-600'
                  />
                </div>
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <div className='space-y-2'>
                  <Label className='dark:text-gray-200'>{language === 'zh-CN' ? '用户名' : 'Username'}</Label>
                  <Input
                    placeholder={language === 'zh-CN' ? '用户名(可选)' : 'Username (optional)'}
                    value={formData.username}
                    onChange={e => setFormData({ ...formData, username: e.target.value })}
                    className='dark:bg-gray-750 dark:border-gray-600'
                  />
                </div>

                <div className='space-y-2'>
                  <Label className='dark:text-gray-200'>{language === 'zh-CN' ? '密码' : 'Password'}</Label>
                  <Input
                    type='password'
                    placeholder={language === 'zh-CN' ? '密码(可选)' : 'Password (optional)'}
                    value={formData.password}
                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                    className='dark:bg-gray-750 dark:border-gray-600'
                  />
                </div>
              </div>
            </div>
          </ScrollArea>

          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => {
                setShowCreateDialog(false);
                resetForm();
              }}
            >
              {language === 'zh-CN' ? '取消' : 'Cancel'}
            </Button>
            <Button
              onClick={handleCreateStore}
              disabled={
                creating ||
                !formData.name.trim() ||
                !formData.type ||
                !formData.endpoint.trim() ||
                !formData.dimension.trim()
              }
            >
              {language === 'zh-CN' ? '创建' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className='max-w-2xl dark:bg-gray-800'>
          <DialogHeader>
            <DialogTitle className='dark:text-white'>
              {language === 'zh-CN' ? '编辑向量存储源' : 'Edit Vector Store'}
            </DialogTitle>
            <DialogDescription>
              {language === 'zh-CN' ? '修改向量数据库配置' : 'Modify vector database configuration'}
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className='max-h-[500px] pr-4'>
            <div className='space-y-4'>
              <div className='space-y-2'>
                <Label className='dark:text-gray-200'>{language === 'zh-CN' ? '名称' : 'Name'}</Label>
                <Input
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className='dark:bg-gray-750 dark:border-gray-600'
                />
              </div>

              <div className='space-y-2'>
                <Label className='dark:text-gray-200'>{language === 'zh-CN' ? '描述' : 'Description'}</Label>
                <Textarea
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className='dark:bg-gray-750 dark:border-gray-600'
                  rows={2}
                />
              </div>

              <div className='space-y-2'>
                <Label className='dark:text-gray-200'>{language === 'zh-CN' ? '端点地址' : 'Endpoint'}</Label>
                <Input
                  value={formData.endpoint}
                  onChange={e => setFormData({ ...formData, endpoint: e.target.value })}
                  className='dark:bg-gray-750 dark:border-gray-600'
                />
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <div className='space-y-2'>
                  <Label className='dark:text-gray-200'>{language === 'zh-CN' ? 'API密钥' : 'API Key'}</Label>
                  <Input
                    type='password'
                    value={formData.apiKey}
                    onChange={e => setFormData({ ...formData, apiKey: e.target.value })}
                    className='dark:bg-gray-750 dark:border-gray-600'
                  />
                </div>

                <div className='space-y-2'>
                  <Label className='dark:text-gray-200'>{language === 'zh-CN' ? '向量维度' : 'Dimension'}</Label>
                  <Input
                    type='number'
                    value={formData.dimension}
                    onChange={e => setFormData({ ...formData, dimension: e.target.value })}
                    className='dark:bg-gray-750 dark:border-gray-600'
                  />
                </div>
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <div className='space-y-2'>
                  <Label className='dark:text-gray-200'>{language === 'zh-CN' ? '数据库' : 'Database'}</Label>
                  <Input
                    value={formData.database}
                    onChange={e => setFormData({ ...formData, database: e.target.value })}
                    className='dark:bg-gray-750 dark:border-gray-600'
                  />
                </div>

                <div className='space-y-2'>
                  <Label className='dark:text-gray-200'>
                    {language === 'zh-CN' ? '集合/索引' : 'Collection/Index'}
                  </Label>
                  <Input
                    value={formData.collection}
                    onChange={e => setFormData({ ...formData, collection: e.target.value })}
                    className='dark:bg-gray-750 dark:border-gray-600'
                  />
                </div>
              </div>
            </div>
          </ScrollArea>

          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => {
                setShowEditDialog(false);
                setEditingStore(null);
                resetForm();
              }}
            >
              {language === 'zh-CN' ? '取消' : 'Cancel'}
            </Button>
            <Button onClick={handleEditStore} disabled={updating}>
              {language === 'zh-CN' ? '保存' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
