import {ChangeEvent, useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  Plus,
  Upload,
  Download,
  Search,
  Filter,
  Code2,
  FileJson,
  Globe,
  Settings,
  Trash2,
  Play,
  Book,
  ExternalLink,
  ChevronRight,
  Tag,
  Clock,
  Server,
  Shield,
  Eye,
  X,
  Database,
  Activity,
  Zap,
} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Badge} from '@/components/ui/badge';
import {Card} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {Label} from '@/components/ui/label';
import {Textarea} from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';
import {ScrollArea} from '@/components/ui/scroll-area';
import {Switch} from '@/components/ui/switch';
import {RadioGroup, RadioGroupItem} from '@/components/ui/radio-group';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {toast} from 'sonner';
import {useLanguage} from '@/components/ui/LanguageProvider';
import {cn} from '@/components/ui/utils';
import {useDebounce} from '@/hooks/useDebounce';
import ApiCollectionsService from '@/services/ApiCollections';
import {
  ApiCollectionDetailVo,
  ApiCollectionListParamsOrderByEnum,
  ApiCollectionListVo,
  ApiCollectionStatisticsVo,
  ApiEndpointListParamsOrderByEnum,
  ApiEndpointVo,
} from '@/services/ApiCollectionsTypes';
import {
  ApiCollectionImportTypeEnum,
  ApiCollectionSourceEnum,
  ConflictStrategyEnum,
  HttpMethodEnum,
  VisibilityEnum,
} from '@/enums/enums';
import {XcanPagination} from '@/components/ui/pagination';

type CollectionListItem = ApiCollectionListVo & {
  id: string;
  enabledEndpointsCount?: number;
};

type EndpointItem = ApiEndpointVo & {
  id: string;
  lastUsedDate?: Date;
};

interface CustomAuthParam {
  id: string;
  name: string;
  value: string;
  location: 'header' | 'query' | 'cookie';
}

export function APICollection() {
  const {language} = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [endpointSearchQuery, setEndpointSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const debouncedEndpointSearchQuery = useDebounce(endpointSearchQuery, 500);
  const [selectedCollectionId, setSelectedCollectionId] = useState<string | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [showEndpointDialog, setShowEndpointDialog] = useState(false);
  const [selectedEndpoint, setSelectedEndpoint] = useState<EndpointItem | null>(null);
  const [showOpenAPIPreview, setShowOpenAPIPreview] = useState(false);
  const [showImportSettingsDialog, setShowImportSettingsDialog] = useState(false);
  const [importConflictStrategy, setImportConflictStrategy] = useState<'overwrite' | 'ignore'>('ignore');
  const [sortBy, setSortBy] = useState<'name' | 'method' | 'lastUsed'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const collectionsPageSize = 12;
  const endpointsPageSize = 10;
  const [collections, setCollections] = useState<CollectionListItem[]>([]);
  const [collectionsLoading, setCollectionsLoading] = useState(false);
  const [collectionsTotal, setCollectionsTotal] = useState(0);
  const [collectionsPage, setCollectionsPage] = useState(1);
  const [collectionDetail, setCollectionDetail] = useState<ApiCollectionDetailVo | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [statistics, setStatistics] = useState<ApiCollectionStatisticsVo | null>(null);
  const [statisticsLoading, setStatisticsLoading] = useState(false);
  const [endpoints, setEndpoints] = useState<EndpointItem[]>([]);
  const [endpointTotal, setEndpointTotal] = useState(0);
  const [endpointPage, setEndpointPage] = useState(1);
  const [endpointsLoading, setEndpointsLoading] = useState(false);
  const [isCreatingCollection, setIsCreatingCollection] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [selectedImportType, setSelectedImportType] = useState<ApiCollectionImportTypeEnum>(
    ApiCollectionImportTypeEnum.OPENAPI
  );
  const [selectedImportFileName, setSelectedImportFileName] = useState('');
  const [importMode, setImportMode] = useState<'quick' | 'settings'>('quick');
  const [strategyFile, setStrategyFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    source: ApiCollectionSourceEnum.OPENAPI,
    visibility: VisibilityEnum.PRIVATE,
  });

  // 服务器配置
  const [serverConfig, setServerConfig] = useState({
    url: '',
    description: '',
  });

  // 安全配置
  const [securityConfig, setSecurityConfig] = useState({
    type: 'apiKey' as 'apiKey' | 'httpBasic' | 'bearer' | 'oauth2Password' | 'oauth2Client' | 'custom',
    // API Key
    apiKeyName: '',
    apiKeyValue: '',
    apiKeyIn: 'header' as 'header' | 'query' | 'cookie',
    // HTTP Basic
    basicUsername: '',
    basicPassword: '',
    // Bearer Token
    bearerToken: '',
    // OAuth2 Password
    oauth2TokenUrl: '',
    oauth2Username: '',
    oauth2Password: '',
    oauth2ClientId: '',
    oauth2ClientSecret: '',
    oauth2Scope: '',
    // OAuth2 Client Credentials
    oauth2ClientTokenUrl: '',
    oauth2ClientCredentialsId: '',
    oauth2ClientCredentialsSecret: '',
    oauth2ClientScope: '',
  });

  // 自定义认证参数
  const [customAuthParams, setCustomAuthParams] = useState<CustomAuthParam[]>([
    {id: '1', name: '', value: '', location: 'header'},
  ]);

  const addCustomAuthParam = () => {
    const newParam: CustomAuthParam = {
      id: Date.now().toString(),
      name: '',
      value: '',
      location: 'header',
    };
    setCustomAuthParams([...customAuthParams, newParam]);
  };

  const removeCustomAuthParam = (id: string) => {
    setCustomAuthParams(customAuthParams.filter(param => param.id !== id));
  };

  const updateCustomAuthParam = (id: string, field: keyof CustomAuthParam, value: string) => {
    setCustomAuthParams(customAuthParams.map(param => (param.id === id ? {
      ...param,
      [field]: value
    } : param)));
  };

  const mapCollections = useCallback((items?: ApiCollectionListVo[]): CollectionListItem[] => {
    if (!Array.isArray(items)) {
      return [];
    }
    return items
      .map(item => {
        const id = item.id !== undefined && item.id !== null ? String(item.id) : '';
        if (!id) {
          return null;
        }
        return {
          ...item,
          id,
          enabledEndpointsCount: item.enabledEndpointsCount ?? 0,
        };
      })
      .filter(Boolean) as CollectionListItem[];
  }, []);

  const mapEndpoints = useCallback((items?: ApiEndpointVo[]): EndpointItem[] => {
    if (!Array.isArray(items)) {
      return [];
    }
    return items
      .map(item => {
        const id = item.id !== undefined && item.id !== null ? String(item.id) : '';
        if (!id) {
          return null;
        }
        const modifiedDate = (item as any)?.modifiedDate;
        return {
          ...item,
          id,
          lastUsedDate: modifiedDate ? new Date(modifiedDate) : undefined,
        };
      })
      .filter(Boolean) as EndpointItem[];
  }, []);

  const loadStatistics = useCallback(async () => {
    setStatisticsLoading(true);
    try {
      const response = await ApiCollectionsService.apiCollectionGetStatistics();
      const responseData = (response as any).data;
      if (responseData) {
        setStatistics(responseData);
      }
    } catch (error) {
      console.error('Failed to load API collection statistics:', error);
    } finally {
      setStatisticsLoading(false);
    }
  }, []);

  const loadCollections = useCallback(
    async (pageNo: number, keywordValue: string) => {
      setCollectionsLoading(true);
      try {
        const response = await ApiCollectionsService.apiCollectionList({
          keyword: keywordValue.trim() || undefined,
          pageNo,
          pageSize: collectionsPageSize,
        });

        const responseData = (response as any).data;
        const listData: ApiCollectionListVo[] | undefined = responseData?.list;
        const mappedList = mapCollections(listData);
        setCollections(mappedList);
        setCollectionsTotal(responseData?.total ?? mappedList.length);

        if (mappedList.length === 0) {
          setSelectedCollectionId(null);
          setCollectionDetail(null);
          setEndpoints([]);
          setEndpointTotal(0);
        } else if (!selectedCollectionId || !mappedList.some(item => item.id === selectedCollectionId)) {
          setSelectedCollectionId(mappedList[0].id);
          setEndpointPage(1);
        }
      } catch (error: any) {
        console.error('Failed to load API collections:', error);
        toast.error(error?.message || (language === 'zh-CN' ? '加载接口集失败' : 'Failed to load API collections'));
      } finally {
        setCollectionsLoading(false);
      }
    },
    [collectionsPageSize, language, mapCollections, selectedCollectionId]
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
        toast.error(error?.message || (language === 'zh-CN' ? '加载接口集详情失败' : 'Failed to load collection detail'));
      } finally {
        setDetailLoading(false);
      }
    },
    [language]
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
          pageSize: endpointsPageSize,
          name: keywordValue.trim() || undefined,
          orderBy: getEndpointOrderBy(),
        });

        const responseData = (response as any).data;
        const listData: ApiEndpointVo[] | undefined = responseData?.list;
        const mappedList = mapEndpoints(listData);
        setEndpoints(mappedList);
        setEndpointTotal(responseData?.total ?? mappedList.length);
      } catch (error: any) {
        console.error('Failed to load API endpoints:', error);
        toast.error(error?.message || (language === 'zh-CN' ? '加载接口列表失败' : 'Failed to load endpoints'));
      } finally {
        setEndpointsLoading(false);
      }
    },
    [endpointsPageSize, getEndpointOrderBy, language, mapEndpoints]
  );

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
    setCollectionsPage(prev => (prev === 1 ? prev : 1));
  }, [debouncedSearchQuery]);

  useEffect(() => {
    setEndpointPage(prev => (prev === 1 ? prev : 1));
  }, [selectedCollectionId, debouncedEndpointSearchQuery]);

  useEffect(() => {
    if (!selectedEndpoint) {
      return;
    }
    const updated = endpoints.find(endpoint => endpoint.id === selectedEndpoint.id);
    if (updated) {
      setSelectedEndpoint(updated);
    }
  }, [endpoints, selectedEndpoint]);

  const getMethodColor = (method: string) => {
    const normalized = method?.toUpperCase() ?? '';
    const colors = {
      GET: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      POST: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      PUT: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
      DELETE: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
      PATCH: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    };
    return colors[normalized as keyof typeof colors] || 'bg-gray-100 text-gray-700';
  };

  const getSourceIcon = (source?: ApiCollectionSourceEnum | string) => {
    const normalized = (source || '').toString().toUpperCase();
    switch (normalized) {
      case ApiCollectionSourceEnum.OPENAPI:
        return <FileJson className='w-4 h-4'/>;
      case ApiCollectionSourceEnum.SWAGGER:
        return <Code2 className='w-4 h-4'/>;
      case ApiCollectionSourceEnum.POSTMAN:
        return <Globe className='w-4 h-4'/>;
      default:
        return <Book className='w-4 h-4'/>;
    }
  };

  const getVisibilityIcon = (visibility?: VisibilityEnum | string) => {
    const normalized = (visibility || '').toString().toUpperCase();
    switch (normalized) {
      case VisibilityEnum.PRIVATE:
        return <Shield className='w-3 h-3'/>;
      case VisibilityEnum.TEAM:
        return <Eye className='w-3 h-3'/>;
      case VisibilityEnum.PUBLIC:
        return <Globe className='w-3 h-3'/>;
      default:
        return <Shield className='w-3 h-3'/>;
    }
  };

  const getVisibilityLabel = (visibility?: VisibilityEnum | string) => {
    const normalized = (visibility || '').toString().toUpperCase();
    const labels = {
      [VisibilityEnum.PRIVATE]: language === 'zh-CN' ? '私有' : 'Private',
      [VisibilityEnum.TEAM]: language === 'zh-CN' ? '团队' : 'Team',
      [VisibilityEnum.PUBLIC]: language === 'zh-CN' ? '公开' : 'Public',
    };
    return labels[normalized as VisibilityEnum] || visibility || '-';
  };

  const getSortLabel = () => {
    const labels = {
      name: language === 'zh-CN' ? '名称' : 'Name',
      method: language === 'zh-CN' ? '方法' : 'Method',
      lastUsed: language === 'zh-CN' ? '最后使用' : 'Last Used',
    };
    const orderLabel =
      sortOrder === 'asc'
        ? language === 'zh-CN'
          ? '升序'
          : 'Ascending'
        : language === 'zh-CN'
          ? '降序'
          : 'Descending';
    return `${labels[sortBy]} (${orderLabel})`;
  };

  const selectedCollectionItem = useMemo(
    () => (selectedCollectionId ? collections.find(item => item.id === selectedCollectionId) ?? null : null),
    [collections, selectedCollectionId]
  );

  const stats = useMemo(() => {
    const overview = statistics?.overview;
    const previous = statistics?.lastMonthGrowthTrend;
    const formatNumber = (value?: number) => (typeof value === 'number' ? value.toLocaleString() : '0');
    const buildTrend = (current?: number, prev?: number) => {
      if (typeof current !== 'number' || typeof prev !== 'number') {
        return undefined;
      }
      const diff = current - prev;
      if (diff === 0) {
        return {text: '0', up: true};
      }
      return {text: `${diff > 0 ? '+' : ''}${diff.toLocaleString()}`, up: diff >= 0};
    };

    const statsConfig = [
      {
        key: 'collections',
        labelZh: '接口集数量',
        labelEn: 'Collections',
        value: overview?.apiCollectionCount,
        subtextZh: '全部接口集',
        subtextEn: 'Total collections',
        trend: buildTrend(overview?.apiCollectionCount, previous?.apiCollectionCount),
        icon: Database,
        iconBg: 'bg-blue-500',
      },
      {
        key: 'totalApis',
        labelZh: '接口总数',
        labelEn: 'Total APIs',
        value: overview?.apiTotalCount,
        subtextZh: '跨所有接口集',
        subtextEn: 'Across all collections',
        trend: buildTrend(overview?.apiTotalCount, previous?.apiTotalCount),
        icon: Code2,
        iconBg: 'bg-green-500',
      },
      {
        key: 'enabledApis',
        labelZh: '已启用接口',
        labelEn: 'Enabled APIs',
        value: overview?.enabledApiCount,
        subtextZh: '正在使用中',
        subtextEn: 'Currently active',
        trend: buildTrend(overview?.enabledApiCount, previous?.enabledApiCount),
        icon: Zap,
        iconBg: 'bg-orange-500',
      },
      {
        key: 'todayCalls',
        labelZh: '今日调用',
        labelEn: 'Today Calls',
        value: overview?.todayCallCount,
        subtextZh: '相较昨日变化',
        subtextEn: 'Change vs yesterday',
        trend: buildTrend(overview?.todayCallCount, previous?.todayCallCount),
        icon: Activity,
        iconBg: 'bg-purple-500',
      },
    ];

    return statsConfig.map(item => ({
      label: language === 'zh-CN' ? item.labelZh : item.labelEn,
      value: formatNumber(item.value),
      subtext: language === 'zh-CN' ? item.subtextZh : item.subtextEn,
      icon: item.icon,
      iconBg: item.iconBg,
      trend: item.trend?.text,
      trendUp: item.trend?.up ?? true,
    }));
  }, [language, statistics]);

  const buildServerObject = () => {
    if (!serverConfig.url) {
      return undefined;
    }
    return {
      url: serverConfig.url,
      description: serverConfig.description || undefined,
    };
  };

  const buildSecurityScheme = () => {
    switch (securityConfig.type) {
      case 'apiKey':
        if (!securityConfig.apiKeyName) {
          return undefined;
        }
        return {
          type: 'apiKey',
          in: securityConfig.apiKeyIn,
          name: securityConfig.apiKeyName,
        } as any;
      case 'httpBasic':
        return {
          type: 'http',
          scheme: 'basic',
        } as any;
      case 'bearer':
        return {
          type: 'http',
          scheme: 'bearer',
        } as any;
      case 'oauth2Password':
        if (!securityConfig.oauth2TokenUrl) {
          return undefined;
        }
        return {
          type: 'oauth2',
          flows: {
            password: {
              tokenUrl: securityConfig.oauth2TokenUrl,
              scopes: securityConfig.oauth2Scope ? {[securityConfig.oauth2Scope]: securityConfig.oauth2Scope} : {},
            },
          },
        } as any;
      case 'oauth2Client':
        if (!securityConfig.oauth2ClientTokenUrl) {
          return undefined;
        }
        return {
          type: 'oauth2',
          flows: {
            clientCredentials: {
              tokenUrl: securityConfig.oauth2ClientTokenUrl,
              scopes: securityConfig.oauth2ClientScope
                ? {[securityConfig.oauth2ClientScope]: securityConfig.oauth2ClientScope}
                : {},
            },
          },
        } as any;
      default:
        return undefined;
    }
  };

  const handleCreateCollection = async () => {
    if (!formData.name.trim()) {
      toast.error(language === 'zh-CN' ? '请输入接口集名称' : 'Please enter collection name');
      return;
    }

    setIsCreatingCollection(true);
    try {
      await ApiCollectionsService.apiCollectionCreate({
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
      visibility: formData.visibility,
        server: buildServerObject(),
        security: buildSecurityScheme(),
      });

      toast.success(language === 'zh-CN' ? '接口集创建成功' : 'API collection created successfully');
    setShowCreateDialog(false);
    setFormData({
      name: '',
      description: '',
        source: ApiCollectionSourceEnum.OPENAPI,
        visibility: VisibilityEnum.PRIVATE,
      });
      setServerConfig({
        url: '',
        description: '',
      });
      setStrategyFile(null);
      await loadCollections(collectionsPage, debouncedSearchQuery);
    } catch (error: any) {
      console.error('Failed to create API collection:', error);
      toast.error(error?.message || (language === 'zh-CN' ? '创建接口集失败' : 'Failed to create collection'));
    } finally {
      setIsCreatingCollection(false);
    }
  };

  const handleImport = (type: ApiCollectionImportTypeEnum) => {
    setImportMode('quick');
    setSelectedImportType(type);
    setStrategyFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  const handleSettingsImportClick = () => {
    setImportMode('settings');
    if (!selectedImportType) {
      setSelectedImportType(ApiCollectionImportTypeEnum.OPENAPI);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  const handleFileInputChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    setSelectedImportFileName(file.name);

    if (importMode === 'quick') {
      await handleImportWithStrategy(file);
    } else {
      setStrategyFile(file);
      toast.success(language === 'zh-CN' ? '文件已选择，点击开始导入' : 'File selected, click Start Import');
    }
  };

  const handleImportWithStrategy = async (file?: File) => {
    if (!file) {
      toast.error(language === 'zh-CN' ? '请选择要导入的文件' : 'Please choose a file to import');
      return;
    }
    setIsImporting(true);
    try {
      await ApiCollectionsService.apiCollectionImport({
        file,
        type: selectedImportType,
        name: file.name,
        visibility: formData.visibility,
        importStrategy: {
          conflictStrategy:
            importConflictStrategy === 'overwrite' ? ConflictStrategyEnum.OVERWRITE : ConflictStrategyEnum.IGNORE,
          importSecurity: true,
          importServers: true,
          importTags: true,
          enableByDefault: true,
        },
      });
      toast.success(language === 'zh-CN' ? '接口集导入成功' : 'API collection imported successfully');
      setShowImportSettingsDialog(false);
    setShowImportDialog(false);
      setSelectedImportFileName('');
      setStrategyFile(null);
      loadCollections(collectionsPage, debouncedSearchQuery);
    } catch (error: any) {
      console.error('Failed to import API collection:', error);
      toast.error(error?.message || (language === 'zh-CN' ? '导入接口集失败' : 'Failed to import collection'));
    } finally {
      setIsImporting(false);
    }
  };

  const toggleEndpointStatus = async (endpointId: string, currentlyEnabled?: boolean) => {
    if (!selectedCollectionId) {
      return;
    }
    try {
      await ApiCollectionsService.apiEndpointToggle(selectedCollectionId, endpointId, {
        enabled: !currentlyEnabled,
      });
    toast.success(
      language === 'zh-CN'
          ? `接口已${currentlyEnabled ? '禁用' : '启用'}`
          : `Endpoint ${currentlyEnabled ? 'disabled' : 'enabled'}`
      );
      await loadEndpoints(selectedCollectionId, endpointPage, debouncedEndpointSearchQuery);
    } catch (error: any) {
      console.error('Failed to toggle endpoint status:', error);
      toast.error(error?.message || (language === 'zh-CN' ? '更新接口状态失败' : 'Failed to update endpoint status'));
    }
  };

  const filteredCollections = useMemo(() => {
    const keyword = debouncedSearchQuery.trim().toLowerCase();
    if (!keyword) {
      return collections;
    }
    return collections.filter(col => {
      const name = col.name?.toLowerCase() ?? '';
      const description = col.description?.toLowerCase() ?? '';
      return name.includes(keyword) || description.includes(keyword);
    });
  }, [collections, debouncedSearchQuery]);

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

  const handleSort = (field: 'name' | 'method' | 'lastUsed') => {
    if (sortBy === field) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
    setEndpointPage(1);
  };

  // OpenAPI 规范预览示例
  const generateOpenAPISpec = () => {
    const selectedCol = (collectionDetail as any) ?? (selectedCollectionItem as any) ?? {};

    const securitySchemes: any = {};
    const security: any[] = [];
    const configuredSecurity = collectionDetail?.security ?? buildSecurityScheme();

    if (configuredSecurity) {
      securitySchemes.PrimaryAuth = configuredSecurity;
      security.push({PrimaryAuth: []});
    } else if (securityConfig.type === 'custom') {
      customAuthParams.forEach((param, index) => {
        if (param.name) {
          const schemeKey = `CustomAuth${index + 1}`;
          securitySchemes[schemeKey] = {
            type: 'apiKey',
            in: param.location,
            name: param.name,
          };
          security.push({[schemeKey]: []});
        }
      });
    }

    const serverObject =
      (collectionDetail?.server as any) ??
      (selectedCol?.server as any) ??
      buildServerObject() ??
      (serverConfig.url
        ? {
          url: serverConfig.url,
          description:
            serverConfig.description || (language === 'zh-CN' ? '生产环境服务器' : 'Production server'),
        }
        : undefined);

    const sourceEndpoints = filteredAndSortedEndpoints.length > 0 ? filteredAndSortedEndpoints : endpoints;

    const paths = sourceEndpoints.reduce((acc, endpoint) => {
      const pathKey = endpoint.path || '/';
      const methodKey = (endpoint.method || HttpMethodEnum.GET).toLowerCase();
      acc[pathKey] = {
        ...(acc[pathKey] || {}),
        [methodKey]: {
          summary: endpoint.name || '',
          description: endpoint.description || '',
            tags: endpoint.tags,
            responses: {
              '200': {
                description: 'Successful response',
              },
            },
          },
        };
        return acc;
    }, {} as any);

    return {
      openapi: '3.0.0',
      info: {
        title: selectedCol?.name || 'API Collection',
        description: selectedCol?.description || '',
        version: '1.0.0',
      },
      servers: serverObject ? [serverObject] : [],
      security,
      components: Object.keys(securitySchemes).length > 0 ? {securitySchemes} : undefined,
      paths,
    };
  };

  // 统计数据
  // const stats = [
  //   {
  //     label: language === 'zh-CN' ? '接口集数量' : 'Collections',
  //     value: collections.length.toString(),
  //     subtext: language === 'zh-CN' ? '全部接口集' : 'Total collections',
  //     icon: Database,
  //     iconBg: 'bg-blue-500',
  //     trend: '+2',
  //     trendUp: true,
  //   },
  //   {
  //     label: language === 'zh-CN' ? '接口总数' : 'Total APIs',
  //     value: collections.reduce((sum, col) => sum + col.endpointsCount, 0).toString(),
  //     subtext: language === 'zh-CN' ? '跨所有接口集' : 'Across all collections',
  //     icon: Code2,
  //     iconBg: 'bg-green-500',
  //     trend: '+15',
  //     trendUp: true,
  //   },
  //   {
  //     label: language === 'zh-CN' ? '已启用接口' : 'Enabled APIs',
  //     value: collections.reduce((sum, col) => sum + col.enabled, 0).toString(),
  //     subtext: language === 'zh-CN' ? '正在使用中' : 'Currently active',
  //     icon: Zap,
  //     iconBg: 'bg-orange-500',
  //     trend: '+8',
  //     trendUp: true,
  //   },
  //   {
  //     label: language === 'zh-CN' ? '今日调用' : 'Today Calls',
  //     value: '1,247',
  //     subtext: language === 'zh-CN' ? '相较昨日增长 18%' : 'Up 18% from yesterday',
  //     icon: Activity,
  //     iconBg: 'bg-purple-500',
  //     trend: '+18%',
  //     trendUp: true,
  //   },
  // ];

  return (
    <div className='space-y-6'>
      <input
        ref={fileInputRef}
        type='file'
        accept='.json,.yaml,.yml'
        className='hidden'
        onChange={handleFileInputChange}
      />
      {/* Header */}
      <div>
        <h1 className='text-2xl mb-1 dark:text-white'>
          {language === 'zh-CN' ? '接口集管理' : 'API Collection Management'}
        </h1>
        <p className='text-sm text-gray-600 dark:text-gray-400'>
          {language === 'zh-CN'
            ? '用于大模型集成外部API接口，支持OpenAPI、Swagger、Postman等规范'
            : 'For LLM integration with external APIs, support OpenAPI, Swagger, Postman, etc.'}
        </p>
      </div>

      {/* Stats Cards */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className='px-5 pt-5 pb-3 dark:bg-gray-800 dark:border-gray-700'>
              <div className='flex items-start justify-between mb-1.5'>
                <div
                  className={`${stat.iconBg} w-10 h-10 rounded-lg flex items-center justify-center`}>
                  <Icon className='w-5 h-5 text-white'/>
                </div>
                {stat.trend && (
                  <span
                    className={`text-sm ${stat.trendUp ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}
                  >
                    {stat.trend}
                  </span>
                )}
              </div>
              <div
                className='text-base font-semibold text-gray-600 dark:text-gray-400 mb-0.5'>{stat.label}</div>
              <div className='text-3xl dark:text-white mb-0.5'>{stat.value}</div>
              <div className='text-xs text-gray-500 dark:text-gray-400'>{stat.subtext}</div>
            </Card>
          );
        })}
      </div>

      {/* Search and Actions */}
      <div className='flex items-center justify-between gap-3'>
        <div className='relative w-[390px]'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400'/>
          <Input
            placeholder={language === 'zh-CN' ? '搜索接口集...' : 'Search collections...'}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className='pl-10 pr-10 dark:bg-gray-800 dark:border-gray-700'
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors'
            >
              <X className='w-4 h-4'/>
            </button>
          )}
        </div>
        <div className='flex items-center gap-3'>
          <Button
            onClick={() => setShowImportDialog(true)}
            variant='outline'
            className='gap-2 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-750'
          >
            <Upload className='w-4 h-4'/>
            {language === 'zh-CN' ? '导入' : 'Import'}
          </Button>
          <Button onClick={() => setShowCreateDialog(true)}
                  className='gap-2 dark:bg-blue-600 dark:hover:bg-blue-700'>
            <Plus className='w-4 h-4'/>
            {language === 'zh-CN' ? '新建接口集' : 'New Collection'}
          </Button>
        </div>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* Collections List */}
        <div className='lg:col-span-1'>
          <div
            className='bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg'>
            <div className='p-4 border-b border-gray-200 dark:border-gray-700'>
              <h2
                className='dark:text-white'>{language === 'zh-CN' ? '接口集列表' : 'Collections'}</h2>
              <p className='text-sm text-gray-500 dark:text-gray-400 mt-1'>
                {collectionsTotal.toLocaleString()} {language === 'zh-CN' ? '个接口集' : 'collections'}
              </p>
            </div>
            <ScrollArea className='h-[600px]'>
              <div className='p-2 space-y-2'>
                {filteredCollections.map(collection => (
                  <button
                    key={collection.id}
                    onClick={() => setSelectedCollectionId(collection.id)}
                    className={cn(
                      'w-full p-4 rounded-lg border transition-all text-left',
                      selectedCollectionId === collection.id
                        ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                        : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    )}
                  >
                    <div className='flex items-start justify-between mb-2'>
                      <div className='flex items-center gap-2'>
                        {getSourceIcon(collection.source)}
                        <h3 className='text-sm dark:text-white'>{collection.name}</h3>
                      </div>
                      <div className='flex items-center gap-1'>
                        <Badge variant='secondary' className='text-xs gap-1'>
                          {getVisibilityIcon(collection.visibility)}
                          {getVisibilityLabel(collection.visibility)}
                        </Badge>
                        <ChevronRight
                          className={cn(
                            'w-4 h-4 transition-transform',
                            selectedCollectionId === collection.id && 'text-blue-600 dark:text-blue-400'
                          )}
                        />
                      </div>
                    </div>
                    <p className='text-xs text-gray-600 dark:text-gray-400 mb-3 line-clamp-2'>
                      {collection.description}
                    </p>
                    <div className='flex items-center justify-between text-xs'>
                      <span className='text-gray-500 dark:text-gray-400'>
                        {collection.endpointsCount} {language === 'zh-CN' ? '个接口' : 'APIs'}
                      </span>
                      <Badge variant='secondary' className='text-xs'>
                        {(collection.enabledEndpointsCount ?? 0).toLocaleString()}/
                        {collection.endpointsCount?.toLocaleString() ?? '0'} {language === 'zh-CN' ? '已启用' : 'enabled'}
                      </Badge>
                    </div>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>

        {/* API Endpoints Details */}
        <div className='lg:col-span-2'>
          {selectedCollectionItem ? (
            <div
              className='bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg'>
              <Tabs defaultValue='endpoints' className='w-full'>
                <div className='border-b border-gray-200 dark:border-gray-700 px-4'>
                  <TabsList className='bg-transparent'>
                    <TabsTrigger value='endpoints' className='gap-2'>
                      <Code2 className='w-4 h-4'/>
                      {language === 'zh-CN' ? '接口列表' : 'Endpoints'}
                    </TabsTrigger>
                    <TabsTrigger value='servers' className='gap-2'>
                      <Server className='w-4 h-4'/>
                      {language === 'zh-CN' ? '服务配置' : 'Servers'}
                    </TabsTrigger>
                    <TabsTrigger value='security' className='gap-2'>
                      <Shield className='w-4 h-4'/>
                      {language === 'zh-CN' ? '安全配置' : 'Security'}
                    </TabsTrigger>
                    <TabsTrigger value='settings' className='gap-2'>
                      <Settings className='w-4 h-4'/>
                      {language === 'zh-CN' ? '设置' : 'Settings'}
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value='endpoints' className='p-0 m-0'>
                  <div className='p-4 border-b border-gray-200 dark:border-gray-700'>
                    <div className='flex items-center gap-3'>
                      <div className='relative flex-1'>
                        <Search
                          className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400'/>
                        <Input
                          placeholder={language === 'zh-CN' ? '搜索接口...' : 'Search endpoints...'}
                          value={endpointSearchQuery}
                          onChange={e => setEndpointSearchQuery(e.target.value)}
                          className='pl-10 pr-10 dark:bg-gray-800 dark:border-gray-700'
                        />
                        {endpointSearchQuery && (
                          <button
                            onClick={() => setEndpointSearchQuery('')}
                            className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors'
                          >
                            <X className='w-4 h-4'/>
                          </button>
                        )}
                      </div>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant='outline' size='sm'
                                  className='dark:bg-gray-800 dark:border-gray-700'>
                            <Filter className='w-4 h-4 mr-2'/>
                            {language === 'zh-CN' ? '筛选' : 'Filter'}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align='end'
                                             className='dark:bg-gray-800 dark:border-gray-700'>
                          <DropdownMenuItem onClick={() => handleSort('name')}
                                            className='dark:text-gray-300'>
                            {language === 'zh-CN' ? '按名称排序' : 'Sort by Name'}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleSort('method')}
                                            className='dark:text-gray-300'>
                            {language === 'zh-CN' ? '按方法排序' : 'Sort by Method'}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleSort('lastUsed')}
                                            className='dark:text-gray-300'>
                            {language === 'zh-CN' ? '按最后使用排序' : 'Sort by Last Used'}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>

                      <Button
                        variant='outline'
                        size='sm'
                        className='gap-2 dark:bg-gray-800 dark:border-gray-700'
                        onClick={() => setShowOpenAPIPreview(true)}
                      >
                        <FileJson className='w-4 h-4'/>
                        {language === 'zh-CN' ? 'OpenAPI' : 'OpenAPI'}
                      </Button>
                    </div>

                    {(sortBy !== 'name' || sortOrder !== 'asc') && (
                      <div className='mt-2 text-xs text-gray-500 dark:text-gray-400'>
                        {language === 'zh-CN' ? '当前排序：' : 'Current sort: '}
                        {getSortLabel()}
                      </div>
                    )}
                  </div>

                  <ScrollArea className='h-[520px]'>
                    <div className='p-4 space-y-3'>
                      {filteredAndSortedEndpoints.map(endpoint => (
                        <div
                          key={endpoint.id}
                          className='p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow'
                        >
                          <div className='flex items-start justify-between mb-3'>
                            <div className='flex-1'>
                              <div className='flex items-center gap-2 mb-2'>
                                <Badge
                                  className={cn('text-xs px-2', getMethodColor(endpoint.method))}>
                                  {endpoint.method}
                                </Badge>
                                <code
                                  className='text-sm text-gray-700 dark:text-gray-300 font-mono'>
                                  {endpoint.path}
                                </code>
                              </div>
                              <h3 className='dark:text-white mb-1'>{endpoint.name}</h3>
                              <p
                                className='text-sm text-gray-600 dark:text-gray-400'>{endpoint.description}</p>
                            </div>
                            <div className='flex items-center gap-2 ml-4'>
                              <Switch
                                checked={endpoint.enabled}
                                onCheckedChange={() => toggleEndpointStatus(endpoint.id)}
                              />
                              <span
                                className='text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap'>
                                {endpoint.enabled
                                  ? language === 'zh-CN'
                                    ? '已启用'
                                    : 'Enabled'
                                  : language === 'zh-CN'
                                    ? '已禁用'
                                    : 'Disabled'}
                              </span>
                            </div>
                          </div>

                          <div className='flex items-center justify-between'>
                            <div className='flex flex-wrap gap-1.5'>
                              {endpoint.tags.map((tag, index) => (
                                <span
                                  key={index}
                                  className='inline-flex items-center gap-1 text-xs px-2 py-1 rounded-md bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                                >
                                  <Tag className='w-3 h-3'/>
                                  {tag}
                                </span>
                              ))}
                              {endpoint.lastUsed && (
                                <span
                                  className='inline-flex items-center gap-1 text-xs px-2 py-1 text-gray-500 dark:text-gray-400'>
                                  <Clock className='w-3 h-3'/>
                                  {endpoint.lastUsed.toLocaleDateString()}
                                </span>
                              )}
                            </div>
                            <div className='flex items-center gap-1'>
                              <Button
                                variant='ghost'
                                size='icon'
                                className='h-8 w-8'
                                onClick={() => {
                                  setSelectedEndpoint(endpoint);
                                  setShowEndpointDialog(true);
                                }}
                              >
                                <ExternalLink className='w-4 h-4'/>
                              </Button>
                              <Button
                                variant='ghost'
                                size='icon'
                                className='h-8 w-8'
                                onClick={() => toast.success(language === 'zh-CN' ? '测试接口...' : 'Testing API...')}
                              >
                                <Play className='w-4 h-4'/>
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </TabsContent>

                <TabsContent value='servers' className='p-6'>
                  <div className='space-y-6'>
                    <div
                      className='p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg'>
                      <div className='flex items-start gap-3'>
                        <Server className='w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5'/>
                        <div>
                          <h3 className='text-sm dark:text-white mb-1'>
                            {language === 'zh-CN' ? '服务器配置' : 'Server Configuration'}
                          </h3>
                          <p className='text-sm text-gray-600 dark:text-gray-400'>
                            {language === 'zh-CN'
                              ? '配置API服务器地址，对应OpenAPI Servers Schema规范'
                              : 'Configure API server addresses, corresponding to OpenAPI Servers Schema'}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label>{language === 'zh-CN' ? '服务器URL' : 'Server URL'}</Label>
                      <Input
                        value={serverConfig.url}
                        onChange={e =>
                          setServerConfig(prev => ({
                            ...prev,
                            url: e.target.value,
                          }))
                        }
                        placeholder='https://api.example.com'
                        className='mt-2 dark:bg-gray-750 dark:border-gray-600'
                      />
                    </div>

                    <div>
                      <Label>{language === 'zh-CN' ? '服务器描述' : 'Server Description'}</Label>
                      <Input
                        value={serverConfig.description}
                        onChange={e =>
                          setServerConfig(prev => ({
                            ...prev,
                            description: e.target.value,
                          }))
                        }
                        placeholder={language === 'zh-CN' ? '生产环境服务器' : 'Production server'}
                        className='mt-2 dark:bg-gray-750 dark:border-gray-600'
                      />
                    </div>

                    <Button
                      className='w-full'>{language === 'zh-CN' ? '保存服务配置' : 'Save Server Config'}</Button>
                  </div>
                </TabsContent>

                <TabsContent value='security' className='p-6'>
                  <ScrollArea className='h-[550px]'>
                    <div className='space-y-6 pr-4'>
                      <div
                        className='p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg'>
                        <div className='flex items-start gap-3'>
                          <Shield className='w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5'/>
                          <div>
                            <h3 className='text-sm dark:text-white mb-1'>
                              {language === 'zh-CN' ? '安全配置' : 'Security Configuration'}
                            </h3>
                            <p className='text-sm text-gray-600 dark:text-gray-400'>
                              {language === 'zh-CN'
                                ? '配置API认证方式，对应OpenAPI Security Schema规范'
                                : 'Configure API authentication, corresponding to OpenAPI Security Schema'}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <Label>{language === 'zh-CN' ? '认证类型' : 'Authentication Type'}</Label>
                        <Select
                          value={securityConfig.type}
                          onValueChange={(value: any) =>
                            setSecurityConfig(prev => ({
                              ...prev,
                              type: value,
                            }))
                          }
                        >
                          <SelectTrigger className='dark:bg-gray-750 dark:border-gray-600 mt-2'>
                            <SelectValue/>
                          </SelectTrigger>
                          <SelectContent className='dark:bg-gray-800 dark:border-gray-700'>
                            <SelectItem value='apiKey'>API Key</SelectItem>
                            <SelectItem value='httpBasic'>HTTP Basic Authentication</SelectItem>
                            <SelectItem value='bearer'>Bearer Token</SelectItem>
                            <SelectItem value='oauth2Password'>OAuth 2.0 (Password)</SelectItem>
                            <SelectItem value='oauth2Client'>OAuth 2.0 (Client
                              Credentials)</SelectItem>
                            <SelectItem
                              value='custom'>{language === 'zh-CN' ? '自定义' : 'Custom'}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* API Key */}
                      {securityConfig.type === 'apiKey' && (
                        <>
                          <div>
                            <Label>{language === 'zh-CN' ? 'API Key 名称' : 'API Key Name'}</Label>
                            <Input
                              value={securityConfig.apiKeyName}
                              onChange={e =>
                                setSecurityConfig(prev => ({
                                  ...prev,
                                  apiKeyName: e.target.value,
                                }))
                              }
                              placeholder='X-API-Key'
                              className='mt-2 dark:bg-gray-750 dark:border-gray-600'
                            />
                          </div>

                          <div>
                            <Label>{language === 'zh-CN' ? 'API Key 值' : 'API Key Value'}</Label>
                            <Input
                              type='password'
                              value={securityConfig.apiKeyValue}
                              onChange={e =>
                                setSecurityConfig(prev => ({
                                  ...prev,
                                  apiKeyValue: e.target.value,
                                }))
                              }
                              placeholder={language === 'zh-CN' ? '输入API Key...' : 'Enter API Key...'}
                              className='mt-2 dark:bg-gray-750 dark:border-gray-600'
                            />
                          </div>

                          <div>
                            <Label>{language === 'zh-CN' ? 'API Key 位置' : 'API Key Location'}</Label>
                            <Select
                              value={securityConfig.apiKeyIn}
                              onValueChange={(value: any) =>
                                setSecurityConfig(prev => ({
                                  ...prev,
                                  apiKeyIn: value,
                                }))
                              }
                            >
                              <SelectTrigger className='dark:bg-gray-750 dark:border-gray-600 mt-2'>
                                <SelectValue/>
                              </SelectTrigger>
                              <SelectContent className='dark:bg-gray-800 dark:border-gray-700'>
                                <SelectItem value='header'>Header</SelectItem>
                                <SelectItem value='query'>Query Parameter</SelectItem>
                                <SelectItem value='cookie'>Cookie</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </>
                      )}

                      {/* HTTP Basic */}
                      {securityConfig.type === 'httpBasic' && (
                        <>
                          <div>
                            <Label>{language === 'zh-CN' ? '用户名' : 'Username'}</Label>
                            <Input
                              value={securityConfig.basicUsername}
                              onChange={e =>
                                setSecurityConfig(prev => ({
                                  ...prev,
                                  basicUsername: e.target.value,
                                }))
                              }
                              placeholder={language === 'zh-CN' ? '输入用户名...' : 'Enter username...'}
                              className='mt-2 dark:bg-gray-750 dark:border-gray-600'
                            />
                          </div>

                          <div>
                            <Label>{language === 'zh-CN' ? '密码' : 'Password'}</Label>
                            <Input
                              type='password'
                              value={securityConfig.basicPassword}
                              onChange={e =>
                                setSecurityConfig(prev => ({
                                  ...prev,
                                  basicPassword: e.target.value,
                                }))
                              }
                              placeholder={language === 'zh-CN' ? '输入密码...' : 'Enter password...'}
                              className='mt-2 dark:bg-gray-750 dark:border-gray-600'
                            />
                          </div>
                        </>
                      )}

                      {/* Bearer Token */}
                      {securityConfig.type === 'bearer' && (
                        <div>
                          <Label>{language === 'zh-CN' ? 'Bearer Token' : 'Bearer Token'}</Label>
                          <Input
                            type='password'
                            value={securityConfig.bearerToken}
                            onChange={e =>
                              setSecurityConfig(prev => ({
                                ...prev,
                                bearerToken: e.target.value,
                              }))
                            }
                            placeholder={language === 'zh-CN' ? '输入Bearer Token...' : 'Enter Bearer Token...'}
                            className='mt-2 dark:bg-gray-750 dark:border-gray-600'
                          />
                        </div>
                      )}

                      {/* OAuth2 Password */}
                      {securityConfig.type === 'oauth2Password' && (
                        <>
                          <div>
                            <Label>{language === 'zh-CN' ? 'Token URL' : 'Token URL'}</Label>
                            <Input
                              value={securityConfig.oauth2TokenUrl}
                              onChange={e =>
                                setSecurityConfig(prev => ({
                                  ...prev,
                                  oauth2TokenUrl: e.target.value,
                                }))
                              }
                              placeholder='https://oauth.example.com/token'
                              className='mt-2 dark:bg-gray-750 dark:border-gray-600'
                            />
                          </div>

                          <div>
                            <Label>{language === 'zh-CN' ? 'Client ID' : 'Client ID'}</Label>
                            <Input
                              value={securityConfig.oauth2ClientId}
                              onChange={e =>
                                setSecurityConfig(prev => ({
                                  ...prev,
                                  oauth2ClientId: e.target.value,
                                }))
                              }
                              placeholder={language === 'zh-CN' ? '输入Client ID...' : 'Enter Client ID...'}
                              className='mt-2 dark:bg-gray-750 dark:border-gray-600'
                            />
                          </div>

                          <div>
                            <Label>{language === 'zh-CN' ? 'Client Secret' : 'Client Secret'}</Label>
                            <Input
                              type='password'
                              value={securityConfig.oauth2ClientSecret}
                              onChange={e =>
                                setSecurityConfig(prev => ({
                                  ...prev,
                                  oauth2ClientSecret: e.target.value,
                                }))
                              }
                              placeholder={language === 'zh-CN' ? '输入Client Secret...' : 'Enter Client Secret...'}
                              className='mt-2 dark:bg-gray-750 dark:border-gray-600'
                            />
                          </div>

                          <div>
                            <Label>{language === 'zh-CN' ? '用户名' : 'Username'}</Label>
                            <Input
                              value={securityConfig.oauth2Username}
                              onChange={e =>
                                setSecurityConfig(prev => ({
                                  ...prev,
                                  oauth2Username: e.target.value,
                                }))
                              }
                              placeholder={language === 'zh-CN' ? '输入用户名...' : 'Enter username...'}
                              className='mt-2 dark:bg-gray-750 dark:border-gray-600'
                            />
                          </div>

                          <div>
                            <Label>{language === 'zh-CN' ? '密码' : 'Password'}</Label>
                            <Input
                              type='password'
                              value={securityConfig.oauth2Password}
                              onChange={e =>
                                setSecurityConfig(prev => ({
                                  ...prev,
                                  oauth2Password: e.target.value,
                                }))
                              }
                              placeholder={language === 'zh-CN' ? '输入密码...' : 'Enter password...'}
                              className='mt-2 dark:bg-gray-750 dark:border-gray-600'
                            />
                          </div>

                          <div>
                            <Label>{language === 'zh-CN' ? 'Scope（可选）' : 'Scope (Optional)'}</Label>
                            <Input
                              value={securityConfig.oauth2Scope}
                              onChange={e =>
                                setSecurityConfig(prev => ({
                                  ...prev,
                                  oauth2Scope: e.target.value,
                                }))
                              }
                              placeholder='read write'
                              className='mt-2 dark:bg-gray-750 dark:border-gray-600'
                            />
                          </div>
                        </>
                      )}

                      {/* OAuth2 Client Credentials */}
                      {securityConfig.type === 'oauth2Client' && (
                        <>
                          <div>
                            <Label>{language === 'zh-CN' ? 'Token URL' : 'Token URL'}</Label>
                            <Input
                              value={securityConfig.oauth2ClientTokenUrl}
                              onChange={e =>
                                setSecurityConfig(prev => ({
                                  ...prev,
                                  oauth2ClientTokenUrl: e.target.value,
                                }))
                              }
                              placeholder='https://oauth.example.com/token'
                              className='mt-2 dark:bg-gray-750 dark:border-gray-600'
                            />
                          </div>

                          <div>
                            <Label>{language === 'zh-CN' ? 'Client ID' : 'Client ID'}</Label>
                            <Input
                              value={securityConfig.oauth2ClientCredentialsId}
                              onChange={e =>
                                setSecurityConfig(prev => ({
                                  ...prev,
                                  oauth2ClientCredentialsId: e.target.value,
                                }))
                              }
                              placeholder={language === 'zh-CN' ? '输入Client ID...' : 'Enter Client ID...'}
                              className='mt-2 dark:bg-gray-750 dark:border-gray-600'
                            />
                          </div>

                          <div>
                            <Label>{language === 'zh-CN' ? 'Client Secret' : 'Client Secret'}</Label>
                            <Input
                              type='password'
                              value={securityConfig.oauth2ClientCredentialsSecret}
                              onChange={e =>
                                setSecurityConfig(prev => ({
                                  ...prev,
                                  oauth2ClientCredentialsSecret: e.target.value,
                                }))
                              }
                              placeholder={language === 'zh-CN' ? '输入Client Secret...' : 'Enter Client Secret...'}
                              className='mt-2 dark:bg-gray-750 dark:border-gray-600'
                            />
                          </div>

                          <div>
                            <Label>{language === 'zh-CN' ? 'Scope（可选）' : 'Scope (Optional)'}</Label>
                            <Input
                              value={securityConfig.oauth2ClientScope}
                              onChange={e =>
                                setSecurityConfig(prev => ({
                                  ...prev,
                                  oauth2ClientScope: e.target.value,
                                }))
                              }
                              placeholder='read write'
                              className='mt-2 dark:bg-gray-750 dark:border-gray-600'
                            />
                          </div>
                        </>
                      )}

                      {/* Custom */}
                      {securityConfig.type === 'custom' && (
                        <div className='space-y-4'>
                          <div className='flex items-center justify-between'>
                            <Label>{language === 'zh-CN' ? '自定义认证参数' : 'Custom Auth Parameters'}</Label>
                            <Button
                              type='button'
                              variant='outline'
                              size='sm'
                              onClick={addCustomAuthParam}
                              className='gap-2'
                            >
                              <Plus className='w-4 h-4'/>
                              {language === 'zh-CN' ? '添加参数' : 'Add Parameter'}
                            </Button>
                          </div>

                          <div className='space-y-4'>
                            {customAuthParams.map((param, index) => (
                              <div
                                key={param.id}
                                className='p-4 border border-gray-200 dark:border-gray-700 rounded-lg space-y-3'
                              >
                                <div className='flex items-center justify-between mb-2'>
                                  <span className='text-sm text-gray-600 dark:text-gray-400'>
                                    {language === 'zh-CN' ? '参数' : 'Parameter'} {index + 1}
                                  </span>
                                  {customAuthParams.length > 1 && (
                                    <Button
                                      type='button'
                                      variant='ghost'
                                      size='sm'
                                      onClick={() => removeCustomAuthParam(param.id)}
                                      className='h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20'
                                    >
                                      <X className='w-4 h-4'/>
                                    </Button>
                                  )}
                                </div>

                                <div>
                                  <Label className='text-xs'>
                                    {language === 'zh-CN' ? '参数名' : 'Parameter Name'}
                                  </Label>
                                  <Input
                                    value={param.name}
                                    onChange={e => updateCustomAuthParam(param.id, 'name', e.target.value)}
                                    placeholder='X-Custom-Auth'
                                    className='mt-1 dark:bg-gray-750 dark:border-gray-600'
                                  />
                                </div>

                                <div>
                                  <Label className='text-xs'>
                                    {language === 'zh-CN' ? '参数值' : 'Parameter Value'}
                                  </Label>
                                  <Input
                                    type='password'
                                    value={param.value}
                                    onChange={e => updateCustomAuthParam(param.id, 'value', e.target.value)}
                                    placeholder={language === 'zh-CN' ? '输入参数值...' : 'Enter parameter value...'}
                                    className='mt-1 dark:bg-gray-750 dark:border-gray-600'
                                  />
                                </div>

                                <div>
                                  <Label className='text-xs'>
                                    {language === 'zh-CN' ? '参数配置' : 'Parameter Location'}
                                  </Label>
                                  <Select
                                    value={param.location}
                                    onValueChange={(value: any) => updateCustomAuthParam(param.id, 'location', value)}
                                  >
                                    <SelectTrigger
                                      className='dark:bg-gray-750 dark:border-gray-600 mt-1'>
                                      <SelectValue/>
                                    </SelectTrigger>
                                    <SelectContent
                                      className='dark:bg-gray-800 dark:border-gray-700'>
                                      <SelectItem value='header'>Header</SelectItem>
                                      <SelectItem value='query'>Query Parameter</SelectItem>
                                      <SelectItem value='cookie'>Cookie</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <Button className='w-full'>
                        {language === 'zh-CN' ? '保存安全配置' : 'Save Security Config'}
                      </Button>
                    </div>
                  </ScrollArea>
                </TabsContent>

                <TabsContent value='settings' className='p-6'>
                  <div className='space-y-6'>
                    <div>
                      <Label>{language === 'zh-CN' ? '接口集名称' : 'Collection Name'}</Label>
                      <Input
                        defaultValue={collections.find(c => c.id === selectedCollection)?.name}
                        className='mt-2 dark:bg-gray-750 dark:border-gray-600'
                      />
                    </div>

                    <div>
                      <Label>{language === 'zh-CN' ? '描述' : 'Description'}</Label>
                      <Textarea
                        defaultValue={collections.find(c => c.id === selectedCollection)?.description}
                        className='mt-2 min-h-[100px] dark:bg-gray-750 dark:border-gray-600'
                      />
                    </div>

                    <div>
                      <Label>{language === 'zh-CN' ? '可见性' : 'Visibility'}</Label>
                      <Select
                        defaultValue={collections.find(c => c.id === selectedCollection)?.visibility}>
                        <SelectTrigger className='dark:bg-gray-750 dark:border-gray-600 mt-2'>
                          <SelectValue/>
                        </SelectTrigger>
                        <SelectContent className='dark:bg-gray-800 dark:border-gray-700'>
                          <SelectItem value='private'>
                            <div className='flex items-center gap-2'>
                              <Shield className='w-4 h-4'/>
                              {language === 'zh-CN' ? '私有' : 'Private'}
                            </div>
                          </SelectItem>
                          <SelectItem value='team'>
                            <div className='flex items-center gap-2'>
                              <Eye className='w-4 h-4'/>
                              {language === 'zh-CN' ? '团队可见' : 'Team'}
                            </div>
                          </SelectItem>
                          <SelectItem value='public'>
                            <div className='flex items-center gap-2'>
                              <Globe className='w-4 h-4'/>
                              {language === 'zh-CN' ? '公开' : 'Public'}
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className='pt-4 border-t border-gray-200 dark:border-gray-700'>
                      <Button
                        variant='outline'
                        className='w-full gap-2 mb-3'
                        onClick={() => setShowImportSettingsDialog(true)}
                      >
                        <Upload className='w-4 h-4'/>
                        {language === 'zh-CN' ? '导入接口规范' : 'Import API Specification'}
                      </Button>
                    </div>

                    <div className='flex gap-3'>
                      <Button variant='outline' className='flex-1 gap-2'>
                        <Download className='w-4 h-4'/>
                        {language === 'zh-CN' ? '导出' : 'Export'}
                      </Button>
                      <Button variant='outline'
                              className='flex-1 gap-2 text-red-600 hover:text-red-700'>
                        <Trash2 className='w-4 h-4'/>
                        {language === 'zh-CN' ? '删除' : 'Delete'}
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          ) : (
            <div
              className='bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg h-[660px] flex items-center justify-center'>
              <div className='text-center'>
                <Code2 className='w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-gray-600'/>
                <p className='text-gray-500 dark:text-gray-400'>
                  {language === 'zh-CN' ? '选择一个接口集查看详情' : 'Select a collection to view details'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create Collection Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className='dark:bg-gray-800'>
          <DialogHeader>
            <DialogTitle className='dark:text-white'>
              {language === 'zh-CN' ? '新建接口集' : 'New API Collection'}
            </DialogTitle>
            <DialogDescription>
              {language === 'zh-CN'
                ? '创建一个新的接口集来管理相关的API'
                : 'Create a new collection to manage related APIs'}
            </DialogDescription>
          </DialogHeader>

          <div className='space-y-4'>
            <div>
              <Label
                htmlFor='name'>{language === 'zh-CN' ? '接口集名称' : 'Collection Name'}</Label>
              <Input
                id='name'
                value={formData.name}
                onChange={e => setFormData(prev => ({...prev, name: e.target.value}))}
                placeholder={language === 'zh-CN' ? '输入接口集名称...' : 'Enter collection name...'}
                className='dark:bg-gray-750 dark:border-gray-600'
              />
            </div>

            <div>
              <Label htmlFor='description'>{language === 'zh-CN' ? '描述' : 'Description'}</Label>
              <Textarea
                id='description'
                value={formData.description}
                onChange={e =>
                  setFormData(prev => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder={language === 'zh-CN' ? '输入接口集描述...' : 'Enter collection description...'}
                className='dark:bg-gray-750 dark:border-gray-600 min-h-[100px]'
              />
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div>
                <Label>{language === 'zh-CN' ? '规范类型' : 'Specification Type'}</Label>
                <Select
                  value={formData.source}
                  onValueChange={(value: any) => setFormData(prev => ({...prev, source: value}))}
                >
                  <SelectTrigger className='dark:bg-gray-750 dark:border-gray-600'>
                    <SelectValue/>
                  </SelectTrigger>
                  <SelectContent className='dark:bg-gray-800 dark:border-gray-700'>
                    <SelectItem value='openapi'>OpenAPI 3.0</SelectItem>
                    <SelectItem value='swagger'>Swagger 2.0</SelectItem>
                    <SelectItem value='postman'>Postman Collection</SelectItem>
                    <SelectItem
                      value='manual'>{language === 'zh-CN' ? '手动创建' : 'Manual'}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>{language === 'zh-CN' ? '可见性' : 'Visibility'}</Label>
                <Select
                  value={formData.visibility}
                  onValueChange={(value: any) => setFormData(prev => ({
                    ...prev,
                    visibility: value
                  }))}
                >
                  <SelectTrigger className='dark:bg-gray-750 dark:border-gray-600'>
                    <SelectValue/>
                  </SelectTrigger>
                  <SelectContent className='dark:bg-gray-800 dark:border-gray-700'>
                    <SelectItem value='private'>
                      <div className='flex items-center gap-2'>
                        <Shield className='w-4 h-4'/>
                        {language === 'zh-CN' ? '私有' : 'Private'}
                      </div>
                    </SelectItem>
                    <SelectItem value='team'>
                      <div className='flex items-center gap-2'>
                        <Eye className='w-4 h-4'/>
                        {language === 'zh-CN' ? '团队可见' : 'Team'}
                      </div>
                    </SelectItem>
                    <SelectItem value='public'>
                      <div className='flex items-center gap-2'>
                        <Globe className='w-4 h-4'/>
                        {language === 'zh-CN' ? '公开' : 'Public'}
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant='outline' onClick={() => setShowCreateDialog(false)}>
              {language === 'zh-CN' ? '取消' : 'Cancel'}
            </Button>
            <Button
              onClick={handleCreateCollection}>{language === 'zh-CN' ? '创建' : 'Create'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Import Dialog */}
      <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
        <DialogContent className='dark:bg-gray-800'>
          <DialogHeader>
            <DialogTitle className='dark:text-white'>
              {language === 'zh-CN' ? '导入接口规范' : 'Import API Specification'}
            </DialogTitle>
            <DialogDescription>
              {language === 'zh-CN'
                ? '支持 OpenAPI、Swagger、Postman 等多种规范格式'
                : 'Support OpenAPI, Swagger, Postman and more'}
            </DialogDescription>
          </DialogHeader>

          <div className='space-y-4'>
            <div className='grid grid-cols-2 gap-3'>
              <button
                onClick={() => handleImport(ApiCollectionImportTypeEnum.OPENAPI)}
                className='p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-500 dark:hover:border-blue-500 transition-colors group'
              >
                <FileJson className='w-8 h-8 mx-auto mb-2 text-gray-400 group-hover:text-blue-500'/>
                <div className='text-sm dark:text-white'>OpenAPI 3.0</div>
                <div className='text-xs text-gray-500 dark:text-gray-400 mt-1'>JSON / YAML</div>
              </button>

              <button
                onClick={() => handleImport(ApiCollectionImportTypeEnum.SWAGGER)}
                className='p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-500 dark:hover:border-blue-500 transition-colors group'
              >
                <Code2 className='w-8 h-8 mx-auto mb-2 text-gray-400 group-hover:text-blue-500'/>
                <div className='text-sm dark:text-white'>Swagger 2.0</div>
                <div className='text-xs text-gray-500 dark:text-gray-400 mt-1'>JSON / YAML</div>
              </button>

              <button
                onClick={() => handleImport(ApiCollectionImportTypeEnum.POSTMAN)}
                className='p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-500 dark:hover:border-blue-500 transition-colors group'
              >
                <Globe className='w-8 h-8 mx-auto mb-2 text-gray-400 group-hover:text-blue-500'/>
                <div className='text-sm dark:text-white'>Postman</div>
                <div className='text-xs text-gray-500 dark:text-gray-400 mt-1'>Collection JSON</div>
              </button>

              <button
                onClick={() => handleImport('URL')}
                className='p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-500 dark:hover:border-blue-500 transition-colors group'
              >
                <ExternalLink
                  className='w-8 h-8 mx-auto mb-2 text-gray-400 group-hover:text-blue-500'/>
                <div
                  className='text-sm dark:text-white'>{language === 'zh-CN' ? '从URL导入' : 'Import from URL'}</div>
                <div className='text-xs text-gray-500 dark:text-gray-400 mt-1'>API Schema URL</div>
              </button>
            </div>
          </div>

          <DialogFooter>
            <Button variant='outline' onClick={() => setShowImportDialog(false)}>
              {language === 'zh-CN' ? '取消' : 'Cancel'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Import Settings Dialog */}
      <Dialog open={showImportSettingsDialog} onOpenChange={setShowImportSettingsDialog}>
        <DialogContent className='dark:bg-gray-800'>
          <DialogHeader>
            <DialogTitle className='dark:text-white'>
              {language === 'zh-CN' ? '导入接口规范' : 'Import API Specification'}
            </DialogTitle>
            <DialogDescription>
              {language === 'zh-CN' ? '选择导入策略和文件' : 'Select import strategy and file'}
            </DialogDescription>
          </DialogHeader>

          <div className='space-y-4'>
            <div>
              <Label>{language === 'zh-CN' ? '重复处理策略' : 'Duplicate Handling Strategy'}</Label>
              <RadioGroup
                value={importConflictStrategy}
                onValueChange={(value: any) => setImportConflictStrategy(value)}
                className='mt-3 space-y-3'
              >
                <div
                  className='flex items-start space-x-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors'>
                  <RadioGroupItem value='overwrite' id='overwrite' className='mt-0.5'/>
                  <div className='flex-1'>
                    <Label htmlFor='overwrite' className='cursor-pointer'>
                      {language === 'zh-CN' ? '覆盖重复' : 'Overwrite Duplicates'}
                    </Label>
                    <p className='text-sm text-gray-500 dark:text-gray-400 mt-1'>
                      {language === 'zh-CN'
                        ? '如果导入的接口已存在，将使用新数据覆盖原有数据'
                        : 'If an imported API already exists, it will be replaced with new data'}
                    </p>
                  </div>
                </div>

                <div
                  className='flex items-start space-x-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors'>
                  <RadioGroupItem value='ignore' id='ignore' className='mt-0.5'/>
                  <div className='flex-1'>
                    <Label htmlFor='ignore' className='cursor-pointer'>
                      {language === 'zh-CN' ? '忽略重复' : 'Ignore Duplicates'}
                    </Label>
                    <p className='text-sm text-gray-500 dark:text-gray-400 mt-1'>
                      {language === 'zh-CN'
                        ? '如果导入的接口已存在，将跳过该接口，保留原有数据'
                        : 'If an imported API already exists, it will be skipped'}
                    </p>
                  </div>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label>{language === 'zh-CN' ? '选择文件' : 'Select File'}</Label>
              <div
                className='mt-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-blue-500 dark:hover:border-blue-500 transition-colors cursor-pointer'>
                <Upload className='w-8 h-8 mx-auto mb-2 text-gray-400'/>
                <p className='text-sm text-gray-600 dark:text-gray-400'>
                  {language === 'zh-CN' ? '点击选择文件或拖拽文件到此处' : 'Click to select file or drag and drop'}
                </p>
                <p className='text-xs text-gray-500 dark:text-gray-500 mt-1'>
                  {language === 'zh-CN' ? '支持 JSON、YAML 格式' : 'Support JSON, YAML formats'}
                </p>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant='outline' onClick={() => setShowImportSettingsDialog(false)}>
              {language === 'zh-CN' ? '取消' : 'Cancel'}
            </Button>
            <Button
              onClick={handleImportWithStrategy}>{language === 'zh-CN' ? '开始导入' : 'Start Import'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* OpenAPI Preview Dialog */}
      <Dialog open={showOpenAPIPreview} onOpenChange={setShowOpenAPIPreview}>
        <DialogContent className='max-w-[1200px] dark:bg-gray-800'>
          <DialogHeader>
            <DialogTitle className='dark:text-white flex items-center gap-2'>
              <FileJson className='w-5 h-5'/>
              {language === 'zh-CN' ? 'OpenAPI 规范预览' : 'OpenAPI Specification Preview'}
            </DialogTitle>
            <DialogDescription>
              {language === 'zh-CN'
                ? '查看当前接口集的OpenAPI规范脚本'
                : 'View OpenAPI specification for current collection'}
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className='h-[500px]'>
            <pre className='p-4 bg-gray-50 dark:bg-gray-750 rounded-lg overflow-x-auto'>
              <code className='text-sm text-gray-700 dark:text-gray-300'>
                {JSON.stringify(generateOpenAPISpec(), null, 2)}
              </code>
            </pre>
          </ScrollArea>

          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => {
                navigator.clipboard.writeText(JSON.stringify(generateOpenAPISpec(), null, 2));
                toast.success(language === 'zh-CN' ? '已复制到剪贴板' : 'Copied to clipboard');
              }}
            >
              {language === 'zh-CN' ? '复制' : 'Copy'}
            </Button>
            <Button
              variant='outline'
              onClick={() => {
                const blob = new Blob([JSON.stringify(generateOpenAPISpec(), null, 2)], {type: 'application/json'});
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'openapi.json';
                a.click();
                toast.success(language === 'zh-CN' ? '已下载' : 'Downloaded');
              }}
            >
              <Download className='w-4 h-4 mr-2'/>
              {language === 'zh-CN' ? '下载' : 'Download'}
            </Button>
            <Button
              onClick={() => setShowOpenAPIPreview(false)}>{language === 'zh-CN' ? '关闭' : 'Close'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Endpoint Details Dialog */}
      <Dialog open={showEndpointDialog} onOpenChange={setShowEndpointDialog}>
        <DialogContent className='max-w-3xl dark:bg-gray-800'>
          <DialogHeader>
            <DialogTitle className='dark:text-white flex items-center gap-2'>
              <Badge
                className={cn('text-xs px-2', selectedEndpoint && getMethodColor(selectedEndpoint.method))}>
                {selectedEndpoint?.method}
              </Badge>
              {selectedEndpoint?.name}
            </DialogTitle>
            <DialogDescription>
              <code className='text-xs'>{selectedEndpoint?.path}</code>
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue='details' className='w-full'>
            <TabsList>
              <TabsTrigger value='details'>{language === 'zh-CN' ? '详情' : 'Details'}</TabsTrigger>
              <TabsTrigger value='request'>{language === 'zh-CN' ? '请求' : 'Request'}</TabsTrigger>
              <TabsTrigger
                value='response'>{language === 'zh-CN' ? '响应' : 'Response'}</TabsTrigger>
              <TabsTrigger value='test'>{language === 'zh-CN' ? '测试' : 'Test'}</TabsTrigger>
            </TabsList>

            <TabsContent value='details' className='space-y-4 mt-4'>
              <div>
                <Label>{language === 'zh-CN' ? '描述' : 'Description'}</Label>
                <p
                  className='text-sm text-gray-600 dark:text-gray-400 mt-2'>{selectedEndpoint?.description}</p>
              </div>
              <div>
                <Label>{language === 'zh-CN' ? '分类' : 'Category'}</Label>
                <p
                  className='text-sm text-gray-600 dark:text-gray-400 mt-2'>{selectedEndpoint?.category}</p>
              </div>
              <div>
                <Label>{language === 'zh-CN' ? '标签' : 'Tags'}</Label>
                <div className='flex flex-wrap gap-2 mt-2'>
                  {selectedEndpoint?.tags.map((tag, index) => (
                    <Badge key={index} variant='secondary'>
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <Label>{language === 'zh-CN' ? '状态' : 'Status'}</Label>
                <div className='flex items-center gap-2 mt-2'>
                  <Switch checked={selectedEndpoint?.enabled}/>
                  <span className='text-sm text-gray-600 dark:text-gray-400'>
                    {selectedEndpoint?.enabled
                      ? language === 'zh-CN'
                        ? '已启用'
                        : 'Enabled'
                      : language === 'zh-CN'
                        ? '已禁用'
                        : 'Disabled'}
                  </span>
                </div>
              </div>
            </TabsContent>

            <TabsContent value='request' className='mt-4'>
              <div className='p-4 bg-gray-50 dark:bg-gray-750 rounded-lg'>
                <code className='text-sm text-gray-700 dark:text-gray-300'>
                  {language === 'zh-CN' ? '请求参数配置...' : 'Request parameters configuration...'}
                </code>
              </div>
            </TabsContent>

            <TabsContent value='response' className='mt-4'>
              <div className='p-4 bg-gray-50 dark:bg-gray-750 rounded-lg'>
                <code className='text-sm text-gray-700 dark:text-gray-300'>
                  {language === 'zh-CN' ? '响应数据示例...' : 'Response data example...'}
                </code>
              </div>
            </TabsContent>

            <TabsContent value='test' className='mt-4'>
              <div className='space-y-4'>
                <Button className='w-full gap-2'>
                  <Play className='w-4 h-4'/>
                  {language === 'zh-CN' ? '发送测试请求' : 'Send Test Request'}
                </Button>
                <div className='p-4 bg-gray-50 dark:bg-gray-750 rounded-lg'>
                  <code className='text-sm text-gray-700 dark:text-gray-300'>
                    {language === 'zh-CN' ? '测试结果将显示在这里...' : 'Test results will be displayed here...'}
                  </code>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button variant='outline' onClick={() => setShowEndpointDialog(false)}>
              {language === 'zh-CN' ? '关闭' : 'Close'}
            </Button>
            <Button>{language === 'zh-CN' ? '保存' : 'Save'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
