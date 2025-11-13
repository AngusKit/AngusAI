import { useEffect, useState } from 'react';
import { Plus, Upload, Search, Filter, Code2, FileJson, Globe, Settings, Trash2, Play, ExternalLink, ChevronRight, Tag, Clock, Server, Shield, Eye, X, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { useLanguage } from '@/components/ui/LanguageProvider';
import { cn } from '@/components/ui/utils';

import { HttpMethodEnum, ApiCollectionImportTypeEnum } from '@/enums/enums';
import { useAPICollectionManagement } from './hooks/useAPICollectionManagement';
import { useAPICollectionForm } from './hooks/useAPICollectionForm';
import { useAPICollectionImport } from './hooks/useAPICollectionImport';
import { CreateCollectionDialog } from './components/CreateCollectionDialog';
import { ImportDialog } from './components/ImportDialog';
import { ImportSettingsDialog } from './components/ImportSettingsDialog';
import { getMethodColor, getSourceIcon, getVisibilityIcon, getVisibilityLabel } from './utils';
import type { EndpointItem } from './types';


export function APICollection() {
  const { language, t } = useLanguage();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [showEndpointDialog, setShowEndpointDialog] = useState(false);
  const [selectedEndpoint, setSelectedEndpoint] = useState<EndpointItem | null>(null);
  const [showOpenAPIPreview, setShowOpenAPIPreview] = useState(false);
  const [showImportSettingsDialog, setShowImportSettingsDialog] = useState(false);

  // 使用 hooks 管理状态
  const management = useAPICollectionManagement();
  const {
    searchQuery,
    setSearchQuery,
    endpointSearchQuery,
    setEndpointSearchQuery,
    collections,
    collectionsTotal,
    collectionsPage,
    selectedCollectionId,
    setSelectedCollectionId,
    selectedCollectionItem,
    collectionDetail,
    endpoints,
    filteredAndSortedEndpoints,
    stats,
    statisticsLoading,
    handleSort,
    toggleEndpointStatus,
    loadCollections,
  } = management;

  const form = useAPICollectionForm(async () => {
    // Hook 内部已经处理了防抖，这里直接使用 searchQuery
    await loadCollections(collectionsPage, management.searchQuery);
  });
  const { formData, setFormData, resetForm, handleCreateCollection, serverConfig, setServerConfig, securityConfig, setSecurityConfig } = form;

  // 自定义认证参数管理（临时保留在主组件中，后续可提取到 SecurityConfigForm 组件）
  const [customAuthParams, setCustomAuthParams] = useState<Array<{ id: string; name: string; value: string; location: 'header' | 'query' | 'cookie' }>>([
    { id: '1', name: '', value: '', location: 'header' },
  ]);

  const addCustomAuthParam = () => {
    const newParam = {
      id: Date.now().toString(),
      name: '',
      value: '',
      location: 'header' as const,
    };
    setCustomAuthParams([...customAuthParams, newParam]);
  };

  const removeCustomAuthParam = (id: string) => {
    setCustomAuthParams(customAuthParams.filter(param => param.id !== id));
  };

  const updateCustomAuthParam = (id: string, field: 'name' | 'value' | 'location', value: string) => {
    setCustomAuthParams(
      customAuthParams.map(param =>
        param.id === id
          ? {
              ...param,
              [field]: value,
            }
          : param
      )
    );
  };

  const importHook = useAPICollectionImport(formData.visibility, async () => {
    // Hook 内部已经处理了防抖，这里直接使用 searchQuery
    await loadCollections(collectionsPage, management.searchQuery);
  });
  const {
    importConflictStrategy,
    setImportConflictStrategy,
    selectedImportFileName,
    setSelectedImportFileName,
    fileInputRef,
    handleImport,
    handleFileInputChange,
    handleImportWithStrategy,
    resetImport,
  } = importHook;

  const getSortLabel = () => {
    const labels = {
      name: t('apis.sort.name'),
      method: t('apis.sort.method'),
      lastUsed: t('apis.sort.lastUsed'),
    };
    const orderLabel = management.sortOrder === 'asc' ? t('apis.sort.ascending') : t('apis.sort.descending');
    return `${labels[management.sortBy]} (${orderLabel})`;
  };

  // 注意：搜索过滤已在 API 调用中处理，这里直接使用 collections
  // filteredCollections 已移除，因为 loadCollections 已经使用 keyword 参数进行服务端搜索

  useEffect(() => {
    if (!selectedEndpoint) {
      return;
    }
    const updated = endpoints.find(endpoint => endpoint.id === selectedEndpoint.id);
    if (updated) {
      setSelectedEndpoint(updated);
    }
  }, [endpoints, selectedEndpoint]);

  // OpenAPI 规范预览示例
  const generateOpenAPISpec = () => {
    const selectedCol = (management.collectionDetail as any) ?? (selectedCollectionItem as any) ?? {};

    const securitySchemes: any = {};
    const security: any[] = [];
    const configuredSecurity = management.collectionDetail?.security ?? form.buildSecurityScheme();

    if (configuredSecurity) {
      securitySchemes.PrimaryAuth = configuredSecurity;
      security.push({ PrimaryAuth: [] });
    }

    const serverObject =
      (management.collectionDetail?.server as any) ??
      (selectedCol?.server as any) ??
      form.buildServerObject() ??
      (form.serverConfig.url
        ? {
            url: form.serverConfig.url,
            description: form.serverConfig.description || t('apis.serverConfig.productionServer'),
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
          tags: endpoint.tags || [],
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
      components: Object.keys(securitySchemes).length > 0 ? { securitySchemes } : undefined,
      paths,
    };
  };

  const handleImportClick = (type: ApiCollectionImportTypeEnum) => {
    handleImport(type);
    setShowImportDialog(false);
  };


  const handleImportWithStrategyWrapper = async (file: File) => {
    const success = await handleImportWithStrategy(file);
    if (success) {
      setShowImportSettingsDialog(false);
      setShowImportDialog(false);
      resetImport();
    }
  };

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
            ? '用于大模型基于API接口集成外部系统，支持OpenAPI、Swagger、Postman等规范'
            : 'For LLM integration with external APIs, support OpenAPI, Swagger, Postman, etc.'}
        </p>
      </div>

      {/* Stats Cards */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
        {stats.map(stat => {
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
                    {stat.trend.text}
                  </span>
                )}
              </div>
              <div className='text-base font-semibold text-gray-600 dark:text-gray-400 mb-0.5'>{stat.label}</div>
              <div className='text-3xl dark:text-white mb-0.5'>{statisticsLoading ? '--' : stat.value}</div>
              <div className='text-xs text-gray-500 dark:text-gray-400'>{stat.subtext}</div>
            </Card>
          );
        })}
      </div>

      {/* Search and Actions */}
      <div className='flex items-center justify-between gap-3'>
        <div className='relative w-[390px]'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400' />
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
              <X className='w-4 h-4' />
            </button>
          )}
        </div>
        <div className='flex items-center gap-3'>
          <Button
            onClick={() => setShowImportDialog(true)}
            variant='outline'
            className='gap-2 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-750'
          >
            <Upload className='w-4 h-4' />
            {language === 'zh-CN' ? '导入' : 'Import'}
          </Button>
          <Button onClick={() => setShowCreateDialog(true)} className='gap-2 dark:bg-blue-600 dark:hover:bg-blue-700'>
            <Plus className='w-4 h-4' />
            {language === 'zh-CN' ? '新建接口集' : 'New Collection'}
          </Button>
        </div>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* Collections List */}
        <div className='lg:col-span-1'>
          <div className='bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg'>
            <div className='p-4 border-b border-gray-200 dark:border-gray-700'>
              <h2 className='dark:text-white'>{language === 'zh-CN' ? '接口集列表' : 'Collections'}</h2>
              <p className='text-sm text-gray-500 dark:text-gray-400 mt-1'>
                {collectionsTotal.toLocaleString()} {language === 'zh-CN' ? '个接口集' : 'collections'}
              </p>
            </div>
            <ScrollArea className='h-[600px]'>
              <div className='p-2 space-y-2'>
                {collections.map(collection => (
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
                        {(() => {
                          const SourceIcon = getSourceIcon(collection.source);
                          return <SourceIcon className='w-4 h-4' />;
                        })()}
                        <h3 className='text-sm dark:text-white'>{collection.name}</h3>
                      </div>
                      <div className='flex items-center gap-1'>
                        <Badge variant='secondary' className='text-xs gap-1'>
                          {(() => {
                            const VisibilityIcon = getVisibilityIcon(collection.visibility);
                            return <VisibilityIcon className='w-3 h-3' />;
                          })()}
                          {getVisibilityLabel(collection.visibility, language)}
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
                        {collection.endpointsCount?.toLocaleString() ?? '0'}{' '}
                        {language === 'zh-CN' ? '已启用' : 'enabled'}
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
            <div className='bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg'>
              <Tabs defaultValue='endpoints' className='w-full'>
                <div className='border-b border-gray-200 dark:border-gray-700 px-4'>
                  <TabsList className='bg-transparent'>
                    <TabsTrigger value='endpoints' className='gap-2'>
                      <Code2 className='w-4 h-4' />
                      {language === 'zh-CN' ? '接口列表' : 'Endpoints'}
                    </TabsTrigger>
                    <TabsTrigger value='servers' className='gap-2'>
                      <Server className='w-4 h-4' />
                      {language === 'zh-CN' ? '服务配置' : 'Servers'}
                    </TabsTrigger>
                    <TabsTrigger value='security' className='gap-2'>
                      <Shield className='w-4 h-4' />
                      {language === 'zh-CN' ? '安全配置' : 'Security'}
                    </TabsTrigger>
                    <TabsTrigger value='settings' className='gap-2'>
                      <Settings className='w-4 h-4' />
                      {language === 'zh-CN' ? '设置' : 'Settings'}
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value='endpoints' className='p-0 m-0'>
                  {filteredAndSortedEndpoints.length === 0 ? (
                    <div className='h-[600px] flex items-center justify-center'>
                      <div className='w-full max-w-2xl px-6'>
                        <div className='text-center mb-8'>
                          <Code2 className='w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600' />
                          <h3 className='text-xl font-semibold dark:text-white mb-2'>
                            {language === 'zh-CN' ? '导入接口规范' : 'Import API Specification'}
                          </h3>
                          <p className='text-sm text-gray-500 dark:text-gray-400'>
                            {language === 'zh-CN'
                              ? '支持 OpenAPI、Swagger、Postman 等多种规范格式，最大支持20MB'
                              : 'Supports multiple specification formats such as OpenAPI, Swagger, and Postman, with a maximum support of 20MB.'}
                          </p>
                        </div>
                        <div className='grid grid-cols-2 gap-4'>
                          <button
                            onClick={() => handleImport(ApiCollectionImportTypeEnum.OPENAPI)}
                            className='p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-500 dark:hover:border-blue-500 transition-colors group'
                          >
                            <FileJson className='w-8 h-8 mx-auto mb-2 text-gray-400 group-hover:text-blue-500' />
                            <div className='text-sm dark:text-white'>OpenAPI 3.0</div>
                            <div className='text-xs text-gray-500 dark:text-gray-400 mt-1'>JSON / YAML</div>
                          </button>

                          <button
                            onClick={() => handleImport(ApiCollectionImportTypeEnum.SWAGGER)}
                            className='p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-500 dark:hover:border-blue-500 transition-colors group'
                          >
                            <Code2 className='w-8 h-8 mx-auto mb-2 text-gray-400 group-hover:text-blue-500' />
                            <div className='text-sm dark:text-white'>Swagger 2.0</div>
                            <div className='text-xs text-gray-500 dark:text-gray-400 mt-1'>JSON / YAML</div>
                          </button>

                          <button
                            onClick={() => handleImport(ApiCollectionImportTypeEnum.POSTMAN)}
                            className='p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-500 dark:hover:border-blue-500 transition-colors group'
                          >
                            <Globe className='w-8 h-8 mx-auto mb-2 text-gray-400 group-hover:text-blue-500' />
                            <div className='text-sm dark:text-white'>Postman</div>
                            <div className='text-xs text-gray-500 dark:text-gray-400 mt-1'>Collection JSON</div>
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className='p-4 border-b border-gray-200 dark:border-gray-700'>
                        <div className='flex items-center gap-3'>
                          <div className='relative flex-1'>
                            <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400' />
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
                                <X className='w-4 h-4' />
                              </button>
                            )}
                          </div>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant='outline' size='sm' className='dark:bg-gray-800 dark:border-gray-700'>
                                <Filter className='w-4 h-4 mr-2' />
                                {language === 'zh-CN' ? '筛选' : 'Filter'}
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align='end' className='dark:bg-gray-800 dark:border-gray-700'>
                              <DropdownMenuItem onClick={() => handleSort('name')} className='dark:text-gray-300'>
                                {language === 'zh-CN' ? '按名称排序' : 'Sort by Name'}
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleSort('method')} className='dark:text-gray-300'>
                                {language === 'zh-CN' ? '按方法排序' : 'Sort by Method'}
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleSort('lastUsed')} className='dark:text-gray-300'>
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
                            <FileJson className='w-4 h-4' />
                            {language === 'zh-CN' ? 'OpenAPI' : 'OpenAPI'}
                          </Button>
                        </div>

                        {(management.sortBy !== 'name' || management.sortOrder !== 'asc') && (
                          <div className='mt-2 text-xs text-gray-500 dark:text-gray-400'>
                            {t('apis.sort.currentSort')}: {getSortLabel()}
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
                                <Badge className={cn('text-xs px-2', getMethodColor(endpoint.method))}>
                                  {endpoint.method}
                                </Badge>
                                <code className='text-sm text-gray-700 dark:text-gray-300 font-mono'>
                                  {endpoint.path}
                                </code>
                              </div>
                              <h3 className='dark:text-white mb-1'>{endpoint.name}</h3>
                              <p className='text-sm text-gray-600 dark:text-gray-400'>{endpoint.description}</p>
                            </div>
                            <div className='flex items-center gap-2 ml-4'>
                              <Switch
                                checked={endpoint.enabled}
                                onCheckedChange={() => toggleEndpointStatus(endpoint.id, endpoint.enabled)}
                              />
                              <span className='text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap'>
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
                              {(endpoint.tags || []).map((tag, index) => (
                                <span
                                  key={index}
                                  className='inline-flex items-center gap-1 text-xs px-2 py-1 rounded-md bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                                >
                                  <Tag className='w-3 h-3' />
                                  {tag}
                                </span>
                              ))}
                              {endpoint.lastUsedDate && (
                                <span className='inline-flex items-center gap-1 text-xs px-2 py-1 text-gray-500 dark:text-gray-400'>
                                  <Clock className='w-3 h-3' />
                                  {endpoint.lastUsedDate.toLocaleDateString()}
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
                                <ExternalLink className='w-4 h-4' />
                              </Button>
                              <Button
                                variant='ghost'
                                size='icon'
                                className='h-8 w-8'
                                onClick={() => toast.success(language === 'zh-CN' ? '测试接口...' : 'Testing API...')}
                              >
                                <Play className='w-4 h-4' />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                        </div>
                      </ScrollArea>
                    </>
                  )}
                </TabsContent>

                <TabsContent value='servers' className='p-6'>
                  <div className='space-y-6'>
                    <div className='p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg'>
                      <div className='flex items-start gap-3'>
                        <Server className='w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5' />
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

                    <Button className='w-full'>{language === 'zh-CN' ? '保存服务配置' : 'Save Server Config'}</Button>
                  </div>
                </TabsContent>

                <TabsContent value='security' className='p-6'>
                  <ScrollArea className='h-[550px]'>
                    <div className='space-y-6 pr-4'>
                      <div className='p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg'>
                        <div className='flex items-start gap-3'>
                          <Shield className='w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5' />
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
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className='dark:bg-gray-800 dark:border-gray-700'>
                            <SelectItem value='apiKey'>API Key</SelectItem>
                            <SelectItem value='httpBasic'>HTTP Basic Authentication</SelectItem>
                            <SelectItem value='bearer'>Bearer Token</SelectItem>
                            <SelectItem value='oauth2Password'>OAuth 2.0 (Password)</SelectItem>
                            <SelectItem value='oauth2Client'>OAuth 2.0 (Client Credentials)</SelectItem>
                            <SelectItem value='custom'>{language === 'zh-CN' ? '自定义' : 'Custom'}</SelectItem>
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
                                <SelectValue />
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
                              <Plus className='w-4 h-4' />
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
                                      <X className='w-4 h-4' />
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
                                    <SelectTrigger className='dark:bg-gray-750 dark:border-gray-600 mt-1'>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className='dark:bg-gray-800 dark:border-gray-700'>
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
                        value={collectionDetail?.name}
                        className='mt-2 dark:bg-gray-750 dark:border-gray-600'
                      />
                    </div>

                    <div>
                      <Label>{language === 'zh-CN' ? '描述' : 'Description'}</Label>
                      <Textarea
                        value={collectionDetail?.description}
                        className='mt-2 min-h-[100px] dark:bg-gray-750 dark:border-gray-600'
                      />
                    </div>

                    <div>
                      <Label>{language === 'zh-CN' ? '可见性' : 'Visibility'}</Label>
                      <Select value={collectionDetail?.visibility}>
                        <SelectTrigger className='dark:bg-gray-750 dark:border-gray-600 mt-2'>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className='dark:bg-gray-800 dark:border-gray-700'>
                          <SelectItem value='private'>
                            <div className='flex items-center gap-2'>
                              <Shield className='w-4 h-4' />
                              {language === 'zh-CN' ? '私有' : 'Private'}
                            </div>
                          </SelectItem>
                          <SelectItem value='team'>
                            <div className='flex items-center gap-2'>
                              <Eye className='w-4 h-4' />
                              {language === 'zh-CN' ? '团队可见' : 'Team'}
                            </div>
                          </SelectItem>
                          <SelectItem value='public'>
                            <div className='flex items-center gap-2'>
                              <Globe className='w-4 h-4' />
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
                        <Upload className='w-4 h-4' />
                        {language === 'zh-CN' ? '导入接口规范' : 'Import API Specification'}
                      </Button>
                    </div>

                    <div className='flex gap-3'>
                      <Button variant='outline' className='flex-1 gap-2'>
                        <Download className='w-4 h-4' />
                        {language === 'zh-CN' ? '导出' : 'Export'}
                      </Button>
                      <Button variant='outline' className='flex-1 gap-2 text-red-600 hover:text-red-700'>
                        <Trash2 className='w-4 h-4' />
                        {language === 'zh-CN' ? '删除' : 'Delete'}
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          ) : (
            <div className='bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg h-[660px] flex items-center justify-center'>
              <div className='text-center'>
                <Code2 className='w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-gray-600' />
                <p className='text-gray-500 dark:text-gray-400'>
                  {language === 'zh-CN' ? '选择一个接口集查看详情' : 'Select a collection to view details'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create Collection Dialog */}
      <CreateCollectionDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        formData={formData}
        onFormDataChange={data => setFormData(prev => ({ ...prev, ...data }))}
        onSubmit={handleCreateCollection}
        onReset={resetForm}
      />

      {/* Import Dialog */}
      <ImportDialog open={showImportDialog} onOpenChange={setShowImportDialog} onImport={handleImportClick} />

      {/* Import Settings Dialog */}
      <ImportSettingsDialog
        open={showImportSettingsDialog}
        onOpenChange={setShowImportSettingsDialog}
        conflictStrategy={importConflictStrategy}
        onConflictStrategyChange={setImportConflictStrategy}
        onFileSelect={file => {
          setSelectedImportFileName(file.name);
          importHook.setStrategyFile(file);
        }}
        onImport={handleImportWithStrategyWrapper}
        selectedFileName={selectedImportFileName}
        fileInputRef={fileInputRef}
      />

      {/* OpenAPI Preview Dialog */}
      <Dialog open={showOpenAPIPreview} onOpenChange={setShowOpenAPIPreview}>
        <DialogContent className='max-w-[1200px] dark:bg-gray-800'>
          <DialogHeader>
            <DialogTitle className='dark:text-white flex items-center gap-2'>
              <FileJson className='w-5 h-5' />
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
                const blob = new Blob([JSON.stringify(generateOpenAPISpec(), null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'openapi.json';
                a.click();
                toast.success(language === 'zh-CN' ? '已下载' : 'Downloaded');
              }}
            >
              <Download className='w-4 h-4 mr-2' />
              {language === 'zh-CN' ? '下载' : 'Download'}
            </Button>
            <Button onClick={() => setShowOpenAPIPreview(false)}>{language === 'zh-CN' ? '关闭' : 'Close'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Endpoint Details Dialog */}
      <Dialog open={showEndpointDialog} onOpenChange={setShowEndpointDialog}>
        <DialogContent className='max-w-3xl dark:bg-gray-800'>
          <DialogHeader>
            <DialogTitle className='dark:text-white flex items-center gap-2'>
              <Badge className={cn('text-xs px-2', selectedEndpoint && getMethodColor(selectedEndpoint.method || ''))}>
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
              <TabsTrigger value='response'>{language === 'zh-CN' ? '响应' : 'Response'}</TabsTrigger>
              <TabsTrigger value='test'>{language === 'zh-CN' ? '测试' : 'Test'}</TabsTrigger>
            </TabsList>

            <TabsContent value='details' className='space-y-4 mt-4'>
              <div>
                <Label>{language === 'zh-CN' ? '描述' : 'Description'}</Label>
                <p className='text-sm text-gray-600 dark:text-gray-400 mt-2'>{selectedEndpoint?.description}</p>
              </div>
              <div>
                <Label>{t('apis.endpointDialog.category')}</Label>
                <p className='text-sm text-gray-600 dark:text-gray-400 mt-2'>-</p>
              </div>
              <div>
                <Label>{t('apis.endpointDialog.tags')}</Label>
                <div className='flex flex-wrap gap-2 mt-2'>
                  {(selectedEndpoint?.tags || []).map((tag, index) => (
                    <Badge key={index} variant='secondary'>
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <Label>{language === 'zh-CN' ? '状态' : 'Status'}</Label>
                <div className='flex items-center gap-2 mt-2'>
                  <Switch checked={selectedEndpoint?.enabled} />
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
                  <Play className='w-4 h-4' />
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
