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
import { useLanguage } from '@/components/LanguageProvider.tsx';
import { cn } from '@/components/ui/utils';
import { copyToClipboard } from '@/lib/clipboard';
import ApiSettingService from '@/services/ApiSetting';
import { API_EXTENSION_KEYS } from '@/types/openapi-types';

import { ApiCollectionImportTypeEnum } from '@/enums/enums';
import { useAPICollectionManagement } from './hooks/useAPICollectionManagement';
import { useAPICollectionForm } from './hooks/useAPICollectionForm';
import { useAPICollectionImport } from './hooks/useAPICollectionImport';
import { CreateCollectionDialog } from './components/CreateCollectionDialog';
import { ImportDialog } from './components/ImportDialog';
import { ImportSettingsDialog } from './components/ImportSettingsDialog';
import { getMethodColor, getSourceIcon, getVisibilityIcon, getVisibilityLabel } from './utils';
import type { EndpointItem } from './types';
import type { OpenAPIV3_1 } from 'openapi-types';


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
  const { formData, setFormData, resetForm, handleCreateCollection } = form;

  const importHook = useAPICollectionImport(async () => {
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
      name: t('common.labels.name'),
      method: t('apis.sort.method'),
      lastUsed: t('apis.sort.lastUsed'),
    };
    const orderLabel = management.sortOrder === 'asc'
    ? t('apis.sort.ascending')
    : t('apis.sort.descending');
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

    // 处理所有安全配置
    securityConfigs.forEach((config, configIndex) => {
      if (config.type === 'apiKey') {
        const schemeName = `ApiKeyAuth${configIndex + 1}`;
        securitySchemes[schemeName] = {
          type: 'apiKey',
          in: config.apiKeyIn,
          name: config.apiKeyName || 'X-API-Key',
        };
        security.push({ [schemeName]: [] });
      } else if (config.type === 'httpBasic') {
        const schemeName = `BasicAuth${configIndex + 1}`;
        securitySchemes[schemeName] = {
          type: 'http',
          scheme: 'basic',
        };
        security.push({ [schemeName]: [] });
      } else if (config.type === 'bearer') {
        const schemeName = `BearerAuth${configIndex + 1}`;
        securitySchemes[schemeName] = {
          type: 'http',
          scheme: 'bearer',
        };
        security.push({ [schemeName]: [] });
      } else if (config.type === 'oauth2Password') {
        const schemeName = `OAuth2Password${configIndex + 1}`;
        securitySchemes[schemeName] = {
          type: 'oauth2',
          flows: {
            password: {
              tokenUrl: config.oauth2TokenUrl,
              scopes: config.oauth2Scope ? { [config.oauth2Scope]: config.oauth2Scope } : {},
            },
          },
        };
        security.push({ [schemeName]: [] });
      } else if (config.type === 'oauth2Client') {
        const schemeName = `OAuth2ClientCredentials${configIndex + 1}`;
        securitySchemes[schemeName] = {
          type: 'oauth2',
          flows: {
            clientCredentials: {
              tokenUrl: config.oauth2ClientTokenUrl,
              scopes: config.oauth2ClientScope ? { [config.oauth2ClientScope]: config.oauth2ClientScope } : {},
            },
          },
        };
        security.push({ [schemeName]: [] });
      } else if (config.type === 'custom') {
        config.customParams.forEach((param, index) => {
          if (param.name) {
            const schemeName = `CustomAuth${configIndex + 1}_${index + 1}`;
            securitySchemes[schemeName] = {
              type: 'apiKey',
              in: param.location,
              name: param.name,
            };
            security.push({ [schemeName]: [] });
          }
        });
      }
    });

    return {
      openapi: '3.0.0',
      info: {
        title: selectedCol?.name || 'API Collection',
        description: selectedCol?.description || '',
        version: '1.0.0',
      },
      servers: servers.length > 0
        ? servers.map(s => ({ url: s.url, description: s.description }))
        : [{ url: 'https://api.example.com', description: 'Default server' }],
      security,
      components: {
        securitySchemes,
      },
      paths: endpoints.reduce((acc, endpoint) => {
        if (!endpoint.path || !endpoint.method) {
          return acc;
        }
        acc[endpoint.path] = {
          [endpoint.method.toLowerCase()]: {
            summary: endpoint.name,
            description: endpoint.description,
            tags: endpoint.tags,
            responses: {
              '200': {
                description: 'Successful response',
              },
            },
          },
        };
        return acc;
      }, {} as any),
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

  // 服务器配置
  interface ServerConfig {
    id?: string;
    url: string;
    description?: string;
    enabled: boolean;
  }


  const [servers, setServers] = useState<ServerConfig[]>([]);

  useEffect(() => {
    setServers((collectionDetail?.servers || []).map(server => ({
      id: server.id?.toString(),
      url: server.url,
      description: server.description || '',
      enabled: (server.enabled as unknown as boolean) || false
    })));
  }, [collectionDetail?.servers]);

  const [editingServer, setEditingServer] = useState<ServerConfig | null>(null);
  const [serverFormData, setServerFormData] = useState({
    url: '',
    description: '',
  });

  const handleAddServer = async () => {
    if (servers.length >= 10) {
      toast.error(t('apis.validation.maxServers'));
      return;
    }

    if (!serverFormData.url.trim()) {
      toast.error(t('apis.validation.serverUrlRequired'));
      return;
    }

    const newServer: ServerConfig = {
      id: Date.now().toString(),
      url: serverFormData.url,
      description: serverFormData.description,
      enabled: false,
    };
    try {
      await ApiSettingService.apiServersUpdate(selectedCollectionId as string, [...servers, newServer] as OpenAPIV3_1.ServerObject[]);
      setServers([...servers, newServer]);
      setServerFormData({ url: '', description: '' });
      toast.success(t('apis.messages.serverAdded'));
    } catch {}

  };

  const handleUpdateServer = async () => {
    if (!editingServer) return;

    if (!serverFormData.url.trim()) {
      toast.error(t('apis.validation.serverUrlRequired'));
      return;
    }

    const newServers = servers.map(s =>
      s.id === editingServer.id
        ? { ...s, url: serverFormData.url, description: serverFormData.description }
        : s
    )
    try {
      await ApiSettingService.apiServersUpdate(selectedCollectionId as string, [...newServers] as OpenAPIV3_1.ServerObject[]);
      setServers([...newServers]);
      setEditingServer(null);
      setServerFormData({ url: '', description: '' });
      toast.success(t('apis.messages.serverUpdated'));
    } catch {}
  };

  const handleEditServer = (server: ServerConfig) => {
    setEditingServer(server);
    setServerFormData({
      url: server.url,
      description: server.description || '',
    });
  };

  const handleCancelEdit = () => {
    setEditingServer(null);
    setServerFormData({ url: '', description: '' });
  };

  const handleToggleServer = async (serverId: string) => {

    const newServers = servers.map(s => ({
      ...s,
      enabled: s.id === serverId ? !s.enabled : false, // 只能同时启用一个
    }));
    try {
      await ApiSettingService.apiServersUpdate(selectedCollectionId as string, [...newServers] as OpenAPIV3_1.ServerObject[]);
      setServers(newServers);
    } catch {}
  };

  const handleDeleteServer = async (serverId: string) => {
    const newServers = servers.filter(s => s.id !== serverId);
    try {
      await ApiSettingService.apiServersUpdate(selectedCollectionId as string, [...newServers] as OpenAPIV3_1.ServerObject[]);
      setServers(newServers);
      toast.success(t('apis.messages.serverDeleted'));
    } catch {}
  };

  interface CustomAuthParam {
    id: string;
    name: string;
    value: string;
    location: 'header' | 'query' | 'cookie';
  }

  // 安全配置
  interface SecurityConfigItem {
    id: string;
    name: string;
    type: 'apiKey' | 'httpBasic' | 'bearer' | 'oauth2Password' | 'oauth2Client' | 'custom';
    apiKeyName: string;
    apiKeyValue: string;
    apiKeyIn: 'header' | 'query' | 'cookie';
    basicUsername: string;
    basicPassword: string;
    bearerToken: string;
    oauth2TokenUrl: string;
    oauth2Username: string;
    oauth2Password: string;
    oauth2ClientId: string;
    oauth2ClientSecret: string;
    oauth2Scope: string;
    oauth2ClientTokenUrl: string;
    oauth2ClientCredentialsId: string;
    oauth2ClientCredentialsSecret: string;
    oauth2ClientScope: string;
    customParams: CustomAuthParam[];
  }

  const [securityConfigs, setSecurityConfigs] = useState<SecurityConfigItem[]>([
    {
      id: '1',
      name: 'Production API Key',
      type: 'apiKey',
      apiKeyName: 'X-API-Key',
      apiKeyValue: '••••••••••••',
      apiKeyIn: 'header',
      basicUsername: '',
      basicPassword: '',
      bearerToken: '',
      oauth2TokenUrl: '',
      oauth2Username: '',
      oauth2Password: '',
      oauth2ClientId: '',
      oauth2ClientSecret: '',
      oauth2Scope: '',
      oauth2ClientTokenUrl: '',
      oauth2ClientCredentialsId: '',
      oauth2ClientCredentialsSecret: '',
      oauth2ClientScope: '',
      customParams: [],
    },
  ]);

  const [editingSecurity, setEditingSecurity] = useState<SecurityConfigItem | null>(null);
  const [securityFormData, setSecurityFormData] = useState({
    name: '',
    type: 'apiKey' as 'apiKey' | 'httpBasic' | 'bearer' | 'oauth2Password' | 'oauth2Client' | 'custom',
    apiKeyName: '',
    apiKeyValue: '',
    apiKeyIn: 'header' as 'header' | 'query' | 'cookie',
    basicUsername: '',
    basicPassword: '',
    bearerToken: '',
    oauth2TokenUrl: '',
    oauth2Username: '',
    oauth2Password: '',
    oauth2ClientId: '',
    oauth2ClientSecret: '',
    oauth2Scope: '',
    oauth2ClientTokenUrl: '',
    oauth2ClientCredentialsId: '',
    oauth2ClientCredentialsSecret: '',
    oauth2ClientScope: '',
  });

  // 自定义认证参数
  const [customAuthParams, setCustomAuthParams] = useState<CustomAuthParam[]>([
    { id: '1', name: '', value: '', location: 'header' },
  ]);


  const getSecurityConfigs = (securities: SecurityConfigItem[]): Record<string, OpenAPIV3_1.SecuritySchemeObject> => {
    return securities.reduce((acc, security) => {
      if (security.type === 'httpBasic') {
        acc[security.name] = {
          type: 'http',
          scheme: 'basic',
          [API_EXTENSION_KEYS.valueKey]: `${security.basicUsername}:${security.basicPassword}`,
        };
      }
      if (security.type === 'bearer') {
        acc[security.name] = {
          type: 'http',
          scheme: 'bearer',
          [API_EXTENSION_KEYS.valueKey]: security.bearerToken,
        };
      }
      if (security.type === 'oauth2Password') {
        acc[security.name] = {
          type: 'oauth2',
          flows: {
            password: {
              tokenUrl: security.oauth2TokenUrl,
              [API_EXTENSION_KEYS.oAuth2ClientIdKey]: security.oauth2ClientId,
              [API_EXTENSION_KEYS.oAuth2ClientSecretKey]: security.oauth2ClientSecret,
              [API_EXTENSION_KEYS.oAuth2UsernameKey]: security.oauth2Username,
              [API_EXTENSION_KEYS.oAuth2PasswordKey]: security.oauth2Password,
              scopes: {
                [security.oauth2Scope]: security.oauth2Scope,
              },
            },
          },
        };
      }
      if (security.type === 'oauth2Client') {
        acc[security.name] = {
          type: 'oauth2',
          flows: {
            clientCredentials: {
              tokenUrl: security.oauth2ClientTokenUrl,
              [API_EXTENSION_KEYS.oAuth2ClientIdKey]: security.oauth2ClientCredentialsId,
              [API_EXTENSION_KEYS.oAuth2ClientSecretKey]: security.oauth2ClientCredentialsSecret,
              scopes: {
                [security.oauth2ClientScope]: security.oauth2ClientScope,
              },
            },
          },
        };
      }
      if (security.type === 'custom') {
        const [firstParam] = security.customParams;
        acc[security.name] = {
          type: 'apiKey',
          name: firstParam?.name || '',
          in: firstParam?.location as 'header' | 'query' | 'cookie',
          [API_EXTENSION_KEYS.valueKey]: firstParam?.value,
          [API_EXTENSION_KEYS.securityApiKeyPrefix]: (security.customParams || []).map(i => ({name: i.name, [API_EXTENSION_KEYS.valueKey]: i.value, in: i.location})),
        };
      }
      if (security.type === 'apiKey') {
        acc[security.name] = {
          type: 'apiKey',
          name: security.apiKeyName,
          in: security.apiKeyIn,
          [API_EXTENSION_KEYS.valueKey]: security.apiKeyValue,
        };
      }
      return acc;
    }, {} as Record<string, OpenAPIV3_1.SecuritySchemeObject>);
  };

  useEffect(() => {
    setSecurityConfigs(Object.keys(collectionDetail?.securities || {}).map(key => {
      const security = collectionDetail?.securities?.[key];
      if (security?.type === 'http') {
        if (security.scheme === 'basic') {
          const [username, password] = security?.extensions?.[API_EXTENSION_KEYS.valueKey]?.split(':') || [];
          return {
            id: key,
            name: key,
            type: 'httpBasic',
            basicUsername: username,
            basicPassword: password,
          } as SecurityConfigItem;
        }
        if (security.scheme === 'bearer') {
          return {
            id: key,
            name: key,
            type: 'bearer',
            bearerToken: security?.extensions?.[API_EXTENSION_KEYS.valueKey],
          } as SecurityConfigItem;
        }
      }
      if (security?.type === 'oauth2') {
        if (security?.flows?.password) {
          return {
            id: key,
            name: key,
            type: 'oauth2Password',
            oauth2TokenUrl: security.flows.password.tokenUrl || '',
            oauth2ClientSecret: security.flows.password?.extensions?.[API_EXTENSION_KEYS.oAuth2ClientSecretKey] || '',
            oauth2ClientId: security.flows.password?.extensions?.[API_EXTENSION_KEYS.oAuth2ClientIdKey] || '',
            oauth2Username: security.flows.password?.extensions?.[API_EXTENSION_KEYS.oAuth2UsernameKey] || '',
            oauth2Password: security.flows.password?.extensions?.[API_EXTENSION_KEYS.oAuth2PasswordKey] || '',
            oauth2Scope: Object.keys(security.flows.password.scopes || {}).join(','),
          } as SecurityConfigItem;
        }
        if (security?.flows?.clientCredentials) {
          return {
            id: key,
            name: key,
            type: 'oauth2Client',
            oauth2ClientTokenUrl: security.flows.clientCredentials.tokenUrl || '',
            oauth2ClientCredentialsId: security.flows.clientCredentials?.extensions?.[API_EXTENSION_KEYS.oAuth2ClientIdKey] || '',
            oauth2ClientCredentialsSecret: security.flows.clientCredentials?.extensions?.[API_EXTENSION_KEYS.oAuth2ClientSecretKey] || '',
            oauth2ClientScope: Object.keys(security.flows.clientCredentials.scopes || {}).join(','),
          } as SecurityConfigItem;
        }
      }
      if (security?.type === 'apiKey') {
        if (!security?.extensions?.[API_EXTENSION_KEYS.securityApiKeyPrefix]?.length) {
          return {
            id: key,
            name: key,
            type: 'apiKey',
            apiKeyName: security.name || '',
            apiKeyValue: security?.extensions?.[API_EXTENSION_KEYS.valueKey] || '',
            apiKeyIn: security.in || 'header',
          } as SecurityConfigItem;
        }
        return {
          id: key,
          name: key,
          type: 'custom',
          customParams: (security?.extensions?.[API_EXTENSION_KEYS.securityApiKeyPrefix] || []).map((i: any) => ({
            id: i.name,
            name: i.name,
            value: i[API_EXTENSION_KEYS.valueKey],
            location: i.in as 'header' | 'query' | 'cookie',
          })),
        } as SecurityConfigItem;
      }
      return security
    }) as SecurityConfigItem[]);
  }, [collectionDetail?.securities]);

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
    setCustomAuthParams(customAuthParams.map(param =>
      param.id === id ? { ...param, [field]: value } : param
    ));
  };

  const handleAddSecurity = async () => {
    if (securityConfigs.length >= 10) {
      toast.error(t('apis.validation.maxSecurity'));
      return;
    }

    if (!securityFormData.name.trim()) {
      toast.error(t('apis.validation.configNameRequired'));
      return;
    }

    const newSecurity: SecurityConfigItem = {
      id: Date.now().toString(),
      name: securityFormData.name,
      type: securityFormData.type,
      apiKeyName: securityFormData.apiKeyName,
      apiKeyValue: securityFormData.apiKeyValue,
      apiKeyIn: securityFormData.apiKeyIn,
      basicUsername: securityFormData.basicUsername,
      basicPassword: securityFormData.basicPassword,
      bearerToken: securityFormData.bearerToken,
      oauth2TokenUrl: securityFormData.oauth2TokenUrl,
      oauth2Username: securityFormData.oauth2Username,
      oauth2Password: securityFormData.oauth2Password,
      oauth2ClientId: securityFormData.oauth2ClientId,
      oauth2ClientSecret: securityFormData.oauth2ClientSecret,
      oauth2Scope: securityFormData.oauth2Scope,
      oauth2ClientTokenUrl: securityFormData.oauth2ClientTokenUrl,
      oauth2ClientCredentialsId: securityFormData.oauth2ClientCredentialsId,
      oauth2ClientCredentialsSecret: securityFormData.oauth2ClientCredentialsSecret,
      oauth2ClientScope: securityFormData.oauth2ClientScope,
      customParams: [...customAuthParams],
    };

    try {
      await ApiSettingService.apiSecuritiesUpdate(selectedCollectionId as string, getSecurityConfigs([...securityConfigs, newSecurity]) as any);
      setSecurityConfigs([...securityConfigs, newSecurity]);
      resetSecurityForm();
      toast.success(t('apis.messages.securityAdded'));
    } catch {}
  };

  const handleUpdateSecurity = async () => {
    if (!editingSecurity) return;

    if (!securityFormData.name.trim()) {
      toast.error(t('apis.validation.configNameRequired'));
      return;
    }

    const newSecurityConfigs = securityConfigs.map(s =>
      s.id === editingSecurity.id
        ? {
            ...s,
            name: securityFormData.name,
            type: securityFormData.type,
          }
        : s
    ) as SecurityConfigItem[];

    try {
      await ApiSettingService.apiSecuritiesUpdate(selectedCollectionId as string, getSecurityConfigs(newSecurityConfigs) as any);
      setSecurityConfigs(newSecurityConfigs);
      setEditingSecurity(null);
      resetSecurityForm();
      toast.success(t('apis.messages.securityUpdated'));
    } catch {}

  };

  const handleEditSecurity = (security: SecurityConfigItem) => {
    setEditingSecurity(security);
    setSecurityFormData({
      name: security.name,
      type: security.type,
      apiKeyName: security.apiKeyName,
      apiKeyValue: security.apiKeyValue,
      apiKeyIn: security.apiKeyIn,
      basicUsername: security.basicUsername,
      basicPassword: security.basicPassword,
      bearerToken: security.bearerToken,
      oauth2TokenUrl: security.oauth2TokenUrl,
      oauth2Username: security.oauth2Username,
      oauth2Password: security.oauth2Password,
      oauth2ClientId: security.oauth2ClientId,
      oauth2ClientSecret: security.oauth2ClientSecret,
      oauth2Scope: security.oauth2Scope,
      oauth2ClientTokenUrl: security.oauth2ClientTokenUrl,
      oauth2ClientCredentialsId: security.oauth2ClientCredentialsId,
      oauth2ClientCredentialsSecret: security.oauth2ClientCredentialsSecret,
      oauth2ClientScope: security.oauth2ClientScope,
    });
    setCustomAuthParams(security.customParams.length > 0 ? [...security.customParams] : [{ id: '1', name: '', value: '', location: 'header' }]);
  };

  const handleCancelSecurityEdit = () => {
    setEditingSecurity(null);
    resetSecurityForm();
  };

  const handleDeleteSecurity = async (securityId: string) => {

    const newSecurityConfigs = securityConfigs.filter(s => s.id !== securityId);
    try {
      await ApiSettingService.apiSecuritiesUpdate(selectedCollectionId as string, getSecurityConfigs(newSecurityConfigs) as any);
      setSecurityConfigs(newSecurityConfigs);
      toast.success(t('apis.messages.securityDeleted'));
    } catch {}

  };

  const resetSecurityForm = () => {
    setSecurityFormData({
      name: '',
      type: 'apiKey',
      apiKeyName: '',
      apiKeyValue: '',
      apiKeyIn: 'header',
      basicUsername: '',
      basicPassword: '',
      bearerToken: '',
      oauth2TokenUrl: '',
      oauth2Username: '',
      oauth2Password: '',
      oauth2ClientId: '',
      oauth2ClientSecret: '',
      oauth2Scope: '',
      oauth2ClientTokenUrl: '',
      oauth2ClientCredentialsId: '',
      oauth2ClientCredentialsSecret: '',
      oauth2ClientScope: '',
    });
    setCustomAuthParams([{ id: '1', name: '', value: '', location: 'header' }]);
  };

  const getSecurityTypeLabel = (type: string) => {
    const labels = {
      apiKey: 'API Key',
      httpBasic: 'HTTP Basic',
      bearer: 'Bearer Token',
      oauth2Password: 'OAuth 2.0 (Password)',
      oauth2Client: 'OAuth 2.0 (Client)',
      custom: t('apis.security.customAuth'),
    };
    return labels[type as keyof typeof labels] || type;
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
          {t('apis.title')}
        </h1>
        <p className='text-sm text-gray-600 dark:text-gray-400'>
          {t('apis.subtitle')}
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
            placeholder={t('apis.searchPlaceholder')}
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
            {t('apis.import')}
          </Button>
          <Button onClick={() => setShowCreateDialog(true)} className='gap-2 dark:bg-blue-600 dark:hover:bg-blue-700'>
            <Plus className='w-4 h-4' />
            {t('apis.newCollection')}
          </Button>
        </div>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* Collections List */}
        <div className='lg:col-span-1'>
          <div className='bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg'>
            <div className='p-4 border-b border-gray-200 dark:border-gray-700'>
              <h2 className='dark:text-white'>{t('apis.collections')}</h2>
              <p className='text-sm text-gray-500 dark:text-gray-400 mt-1'>
                {collectionsTotal.toLocaleString()} {t('apis.collectionCount')}
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
                        {collection.endpointsCount} {t('apis.apisCount')}
                      </span>
                      <Badge variant='secondary' className='text-xs'>
                        {(collection.enabledEndpointsCount ?? 0).toLocaleString()}/
                        {collection.endpointsCount?.toLocaleString() ?? '0'}{' '}
                        {t('apis.enabled')}
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
                      {t('apis.tabs.endpoints')}
                    </TabsTrigger>
                    <TabsTrigger value='servers' className='gap-2'>
                      <Server className='w-4 h-4' />
                      {t('apis.tabs.servers')}
                    </TabsTrigger>
                    <TabsTrigger value='security' className='gap-2'>
                      <Shield className='w-4 h-4' />
                      {t('apis.tabs.security')}
                    </TabsTrigger>
                    <TabsTrigger value='settings' className='gap-2'>
                      <Settings className='w-4 h-4' />
                      {t('apis.tabs.settings')}
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
                            {t('apis.endpoints.emptyTitle')}
                          </h3>
                          <p className='text-sm text-gray-500 dark:text-gray-400'>
                            {t('apis.endpoints.emptyDescription')}
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
                              placeholder={t('apis.endpoints.searchPlaceholder')}
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
                                {t('apis.endpoints.filter')}
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align='end' className='dark:bg-gray-800 dark:border-gray-700'>
                              <DropdownMenuItem onClick={() => handleSort('name')} className='dark:text-gray-300'>
                                {t('apis.endpoints.sortByName')}
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleSort('method')} className='dark:text-gray-300'>
                                {t('apis.endpoints.sortByMethod')}
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleSort('lastUsed')} className='dark:text-gray-300'>
                                {t('apis.endpoints.sortByLastUsed')}
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
                            OpenAPI
                          </Button>
                        </div>

                        {(management.sortBy !== 'name' || management.sortOrder !== 'asc') && (
                          <div className='mt-2 text-xs text-gray-500 dark:text-gray-400'>
                            {t('apis.endpoints.currentSort')}: {getSortLabel()}
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
                                {endpoint.enabled ? t('apis.endpoints.enabled') : t('apis.endpoints.disabled')}
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
                                onClick={() => toast.success(t('apis.endpoints.testing'))}
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

                <TabsContent value="servers" className="p-0 m-0">
                  <ScrollArea className="h-[600px]">
                    <div className="p-6 space-y-6">
                      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                        <div className="flex items-start gap-3">
                          <Server className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                          <div className="flex-1">
                            <h3 className="text-sm dark:text-white mb-1">
                              {t('apis.servers.title')}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {t('apis.servers.description')}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* 表单区域 */}
                      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-sm dark:text-white">
                            {editingServer ? t('apis.servers.editServer') : t('apis.servers.addServer')}
                          </h4>
                          {servers.length >= 10 && !editingServer && (
                            <Badge variant="secondary" className="text-xs">
                              {t('apis.servers.maxLimit')}
                            </Badge>
                          )}
                        </div>

                        <div>
                          <Label>{t('apis.servers.serverUrl')} *</Label>
                          <Input
                            value={serverFormData.url}
                            onChange={e => setServerFormData(prev => ({ ...prev, url: e.target.value }))}
                            placeholder={t('apis.servers.serverUrlPlaceholder')}
                            className="mt-2 dark:bg-gray-750 dark:border-gray-600"
                          />
                        </div>

                        <div>
                          <Label>{t('apis.servers.serverDescription')}</Label>
                          <Input
                            value={serverFormData.description}
                            onChange={e => setServerFormData(prev => ({ ...prev, description: e.target.value }))}
                            placeholder={t('apis.servers.serverDescriptionPlaceholder')}
                            className="mt-2 dark:bg-gray-750 dark:border-gray-600"
                          />
                        </div>

                        <div className="flex gap-2">
                          {editingServer ? (
                            <>
                              <Button onClick={handleUpdateServer} className="flex-1">
                                {t('apis.servers.updateServer')}
                              </Button>
                              <Button onClick={handleCancelEdit} variant="outline" className="flex-1 dark:bg-gray-800 dark:border-gray-700">
                                {t('common.actions.cancel')}
                              </Button>
                            </>
                          ) : (
                            <Button
                              onClick={handleAddServer}
                              className="w-full"
                              disabled={servers.length >= 10}
                            >
                              <Plus className="w-4 h-4 mr-2" />
                              {t('apis.servers.addServer')}
                            </Button>
                          )}
                        </div>
                      </div>

                      {/* 已配置服务器列表 */}
                      {servers.length > 0 && (
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="text-sm dark:text-white">
                              {t('apis.servers.configuredServers')}
                            </h4>
                            <Badge variant="secondary" className="text-xs">
                              {servers.length}/10
                            </Badge>
                          </div>
                          <div className="space-y-3">
                            {servers.map((server) => (
                              <div
                                key={server.id}
                                className={cn(
                                  'border rounded-lg p-4 transition-all',
                                  server.enabled
                                    ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                                    : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                                )}
                              >
                                <div className="flex items-start justify-between gap-3">
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-2">
                                      <code className="text-sm text-gray-900 dark:text-white font-mono break-all">
                                        {server.url}
                                      </code>
                                      {server.enabled && (
                                        <Badge className="bg-green-500 hover:bg-green-600 text-xs">
                                          {t('apis.servers.enabled')}
                                        </Badge>
                                      )}
                                    </div>
                                    {server.description && (
                                      <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {server.description}
                                      </p>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-2 shrink-0">
                                    <Switch
                                      checked={server.enabled}
                                      onCheckedChange={() => server.id && handleToggleServer(server.id)}
                                    />
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleEditServer(server)}
                                      className="dark:hover:bg-gray-700"
                                    >
                                      <Settings className="w-4 h-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => server.id && handleDeleteServer(server.id)}
                                      className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="security" className="p-0 m-0">
                  <ScrollArea className="h-[600px]">
                    <div className="p-6 space-y-6">
                      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                        <div className="flex items-start gap-3">
                          <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                          <div className="flex-1">
                            <h3 className="text-sm dark:text-white mb-1">
                              {t('apis.security.title')}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {t('apis.security.description')}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* 表单区域 */}
                      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-sm dark:text-white">
                            {editingSecurity ? t('apis.security.editSecurity') : t('apis.security.addSecurity')}
                          </h4>
                          {securityConfigs.length >= 10 && !editingSecurity && (
                            <Badge variant="secondary" className="text-xs">
                              {t('apis.servers.maxLimit')}
                            </Badge>
                          )}
                        </div>

                        <div>
                          <Label>{t('apis.security.configName')} *</Label>
                          <Input
                            value={securityFormData.name}
                            onChange={e => setSecurityFormData(prev => ({ ...prev, name: e.target.value }))}
                            placeholder={t('apis.security.configNamePlaceholder')}
                            className="mt-2 dark:bg-gray-750 dark:border-gray-600"
                          />
                        </div>

                        <div>
                          <Label>{t('apis.security.authType')}</Label>
                          <Select
                            value={securityFormData.type}
                            onValueChange={(value: any) => setSecurityFormData(prev => ({ ...prev, type: value }))}
                          >
                            <SelectTrigger className="dark:bg-gray-750 dark:border-gray-600 mt-2">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                              <SelectItem value="apiKey">API Key</SelectItem>
                              <SelectItem value="httpBasic">HTTP Basic Authentication</SelectItem>
                              <SelectItem value="bearer">Bearer Token</SelectItem>
                              <SelectItem value="oauth2Password">OAuth 2.0 (Password)</SelectItem>
                              <SelectItem value="oauth2Client">OAuth 2.0 (Client Credentials)</SelectItem>
                              <SelectItem value="custom">{t('apis.security.customAuth')}</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* API Key */}
                        {securityFormData.type === 'apiKey' && (
                          <>
                            <div>
                              <Label>{t('apis.security.apiKeyName')}</Label>
                              <Input
                                value={securityFormData.apiKeyName}
                                onChange={e => setSecurityFormData(prev => ({ ...prev, apiKeyName: e.target.value }))}
                                placeholder={t('apis.security.apiKeyNamePlaceholder')}
                                className="mt-2 dark:bg-gray-750 dark:border-gray-600"
                              />
                            </div>

                            <div>
                              <Label>{t('apis.security.apiKeyValue')}</Label>
                              <Input
                                type="password"
                                value={securityFormData.apiKeyValue}
                                onChange={e => setSecurityFormData(prev => ({ ...prev, apiKeyValue: e.target.value }))}
                                placeholder={t('apis.security.apiKeyValuePlaceholder')}
                                className="mt-2 dark:bg-gray-750 dark:border-gray-600"
                              />
                            </div>

                            <div>
                              <Label>{t('apis.security.apiKeyLocation')}</Label>
                              <Select
                                value={securityFormData.apiKeyIn}
                                onValueChange={(value: any) => setSecurityFormData(prev => ({ ...prev, apiKeyIn: value }))}
                              >
                                <SelectTrigger className="dark:bg-gray-750 dark:border-gray-600 mt-2">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                                  <SelectItem value="header">Header</SelectItem>
                                  <SelectItem value="query">Query Parameter</SelectItem>
                                  <SelectItem value="cookie">Cookie</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </>
                        )}

                        {/* HTTP Basic */}
                        {securityFormData.type === 'httpBasic' && (
                          <>
                            <div>
                              <Label>{t('apis.security.username')}</Label>
                              <Input
                                value={securityFormData.basicUsername}
                                onChange={e => setSecurityFormData(prev => ({ ...prev, basicUsername: e.target.value }))}
                                placeholder={t('apis.security.usernamePlaceholder')}
                                className="mt-2 dark:bg-gray-750 dark:border-gray-600"
                              />
                            </div>

                            <div>
                              <Label>{t('common.labels.password')}</Label>
                              <Input
                                type="password"
                                value={securityFormData.basicPassword}
                                onChange={e => setSecurityFormData(prev => ({ ...prev, basicPassword: e.target.value }))}
                                placeholder={t('apis.security.passwordPlaceholder')}
                                className="mt-2 dark:bg-gray-750 dark:border-gray-600"
                              />
                            </div>
                          </>
                        )}

                        {/* Bearer Token */}
                        {securityFormData.type === 'bearer' && (
                          <div>
                            <Label>{t('apis.security.bearerToken')}</Label>
                            <Input
                              type="password"
                              value={securityFormData.bearerToken}
                              onChange={e => setSecurityFormData(prev => ({ ...prev, bearerToken: e.target.value }))}
                              placeholder={t('apis.security.bearerTokenPlaceholder')}
                              className="mt-2 dark:bg-gray-750 dark:border-gray-600"
                            />
                          </div>
                        )}

                        {/* OAuth2 Password */}
                        {securityFormData.type === 'oauth2Password' && (
                          <>
                            <div>
                              <Label>{t('apis.security.tokenUrl')}</Label>
                              <Input
                                value={securityFormData.oauth2TokenUrl}
                                onChange={e => setSecurityFormData(prev => ({ ...prev, oauth2TokenUrl: e.target.value }))}
                                placeholder={t('apis.security.tokenUrlPlaceholder')}
                                className="mt-2 dark:bg-gray-750 dark:border-gray-600"
                              />
                            </div>

                            <div>
                              <Label>{t('apis.security.clientId')}</Label>
                              <Input
                                value={securityFormData.oauth2ClientId}
                                onChange={e => setSecurityFormData(prev => ({ ...prev, oauth2ClientId: e.target.value }))}
                                placeholder={t('apis.security.clientIdPlaceholder')}
                                className="mt-2 dark:bg-gray-750 dark:border-gray-600"
                              />
                            </div>

                            <div>
                              <Label>{t('apis.security.clientSecret')}</Label>
                              <Input
                                type="password"
                                value={securityFormData.oauth2ClientSecret}
                                onChange={e => setSecurityFormData(prev => ({ ...prev, oauth2ClientSecret: e.target.value }))}
                                placeholder={t('apis.security.clientSecretPlaceholder')}
                                className="mt-2 dark:bg-gray-750 dark:border-gray-600"
                              />
                            </div>

                            <div>
                              <Label>{t('apis.security.username')}</Label>
                              <Input
                                value={securityFormData.oauth2Username}
                                onChange={e => setSecurityFormData(prev => ({ ...prev, oauth2Username: e.target.value }))}
                                placeholder={t('apis.security.usernamePlaceholder')}
                                className="mt-2 dark:bg-gray-750 dark:border-gray-600"
                              />
                            </div>

                            <div>
                              <Label>{t('common.labels.password')}</Label>
                              <Input
                                type="password"
                                value={securityFormData.oauth2Password}
                                onChange={e => setSecurityFormData(prev => ({ ...prev, oauth2Password: e.target.value }))}
                                placeholder={t('apis.security.passwordPlaceholder')}
                                className="mt-2 dark:bg-gray-750 dark:border-gray-600"
                              />
                            </div>

                            <div>
                              <Label>{t('apis.security.scope')}</Label>
                              <Input
                                value={securityFormData.oauth2Scope}
                                onChange={e => setSecurityFormData(prev => ({ ...prev, oauth2Scope: e.target.value }))}
                                placeholder={t('apis.security.scopePlaceholder')}
                                className="mt-2 dark:bg-gray-750 dark:border-gray-600"
                              />
                            </div>
                          </>
                        )}

                        {/* OAuth2 Client Credentials */}
                        {securityFormData.type === 'oauth2Client' && (
                          <>
                            <div>
                              <Label>{t('apis.security.tokenUrl')}</Label>
                              <Input
                                value={securityFormData.oauth2ClientTokenUrl}
                                onChange={e => setSecurityFormData(prev => ({ ...prev, oauth2ClientTokenUrl: e.target.value }))}
                                placeholder={t('apis.security.tokenUrlPlaceholder')}
                                className="mt-2 dark:bg-gray-750 dark:border-gray-600"
                              />
                            </div>

                            <div>
                              <Label>{t('apis.security.clientId')}</Label>
                              <Input
                                value={securityFormData.oauth2ClientCredentialsId}
                                onChange={e => setSecurityFormData(prev => ({ ...prev, oauth2ClientCredentialsId: e.target.value }))}
                                placeholder={t('apis.security.clientIdPlaceholder')}
                                className="mt-2 dark:bg-gray-750 dark:border-gray-600"
                              />
                            </div>

                            <div>
                              <Label>{t('apis.security.clientSecret')}</Label>
                              <Input
                                type="password"
                                value={securityFormData.oauth2ClientCredentialsSecret}
                                onChange={e => setSecurityFormData(prev => ({ ...prev, oauth2ClientCredentialsSecret: e.target.value }))}
                                placeholder={t('apis.security.clientSecretPlaceholder')}
                                className="mt-2 dark:bg-gray-750 dark:border-gray-600"
                              />
                            </div>

                            <div>
                              <Label>{t('apis.security.scope')}</Label>
                              <Input
                                value={securityFormData.oauth2ClientScope}
                                onChange={e => setSecurityFormData(prev => ({ ...prev, oauth2ClientScope: e.target.value }))}
                                placeholder={t('apis.security.scopePlaceholder')}
                                className="mt-2 dark:bg-gray-750 dark:border-gray-600"
                              />
                            </div>
                          </>
                        )}

                        {/* Custom */}
                        {securityFormData.type === 'custom' && (
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <Label>{t('apis.security.customAuthParams')}</Label>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={addCustomAuthParam}
                                className="gap-2 dark:bg-gray-800 dark:border-gray-700"
                              >
                                <Plus className="w-4 h-4" />
                                {t('apis.security.addParameter')}
                              </Button>
                            </div>

                            <div className="space-y-4">
                              {customAuthParams.map((param, index) => (
                                <div key={param.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg space-y-3">
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                      {t('apis.security.parameter')} {index + 1}
                                    </span>
                                    {customAuthParams.length > 1 && (
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => removeCustomAuthParam(param.id)}
                                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                                      >
                                        <X className="w-4 h-4" />
                                      </Button>
                                    )}
                                  </div>

                                  <div>
                                    <Label className="text-xs">{t('apis.security.parameterName')}</Label>
                                    <Input
                                      value={param.name}
                                      onChange={e => updateCustomAuthParam(param.id, 'name', e.target.value)}
                                      placeholder={t('apis.security.parameterNamePlaceholder')}
                                      className="mt-1 dark:bg-gray-750 dark:border-gray-600"
                                    />
                                  </div>

                                  <div>
                                    <Label className="text-xs">{t('apis.security.parameterValue')}</Label>
                                    <Input
                                      type="password"
                                      value={param.value}
                                      onChange={e => updateCustomAuthParam(param.id, 'value', e.target.value)}
                                      placeholder={t('apis.security.parameterValuePlaceholder')}
                                      className="mt-1 dark:bg-gray-750 dark:border-gray-600"
                                    />
                                  </div>

                                  <div>
                                    <Label className="text-xs">{t('apis.security.parameterLocation')}</Label>
                                    <Select
                                      value={param.location}
                                      onValueChange={(value: any) => updateCustomAuthParam(param.id, 'location', value)}
                                    >
                                      <SelectTrigger className="dark:bg-gray-750 dark:border-gray-600 mt-1">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                                        <SelectItem value="header">Header</SelectItem>
                                        <SelectItem value="query">Query Parameter</SelectItem>
                                        <SelectItem value="cookie">Cookie</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="flex gap-2">
                          {editingSecurity ? (
                            <>
                              <Button onClick={handleUpdateSecurity} className="flex-1">
                                {t('apis.security.updateConfig')}
                              </Button>
                              <Button onClick={handleCancelSecurityEdit} variant="outline" className="flex-1 dark:bg-gray-800 dark:border-gray-700">
                                {t('common.actions.cancel')}
                              </Button>
                            </>
                          ) : (
                            <Button
                              onClick={handleAddSecurity}
                              className="w-full"
                              disabled={securityConfigs.length >= 10}
                            >
                              <Plus className="w-4 h-4 mr-2" />
                              {t('apis.security.addSecurity')}
                            </Button>
                          )}
                        </div>
                      </div>

                      {/* 已配置安全列表 */}
                      {securityConfigs.length > 0 && (
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="text-sm dark:text-white">
                              {t('apis.security.configuredSecurity')}
                            </h4>
                            <Badge variant="secondary" className="text-xs">
                              {securityConfigs.length}/10
                            </Badge>
                          </div>
                          <div className="space-y-3">
                            {securityConfigs.map((security) => (
                              <div
                                key={security.id}
                                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
                                <div className="flex items-start justify-between gap-3">
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-2">
                                      <h5 className="text-sm dark:text-white">
                                        {security.name}
                                      </h5>
                                      <Badge variant="secondary" className="text-xs">
                                        {getSecurityTypeLabel(security.type)}
                                      </Badge>
                                    </div>
                                    <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
                                      {security.type === 'apiKey' && (
                                        <>
                                          <p>{t('apis.security.keyName')}: {security.apiKeyName}</p>
                                          <p>{t('apis.security.location')}: {security.apiKeyIn}</p>
                                        </>
                                      )}
                                      {security.type === 'httpBasic' && (
                                        <p>{t('apis.security.username')}: {security.basicUsername}</p>
                                      )}
                                      {security.type === 'bearer' && (
                                        <p>Bearer Token {t('apis.security.configured')}</p>
                                      )}
                                      {security.type === 'oauth2Password' && (
                                        <>
                                          <p>Token URL: {security.oauth2TokenUrl}</p>
                                          <p>Client ID: {security.oauth2ClientId}</p>
                                        </>
                                      )}
                                      {security.type === 'oauth2Client' && (
                                        <>
                                          <p>Token URL: {security.oauth2ClientTokenUrl}</p>
                                          <p>Client ID: {security.oauth2ClientCredentialsId}</p>
                                        </>
                                      )}
                                      {security.type === 'custom' && (
                                        <p>{security.customParams.length} {t('apis.security.customParameters')}</p>
                                      )}
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2 shrink-0">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleEditSecurity(security)}
                                      className="dark:hover:bg-gray-700"
                                    >
                                      <Settings className="w-4 h-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleDeleteSecurity(security.id)}
                                      className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </TabsContent>

                <TabsContent value='settings' className='p-6'>
                  <div className='space-y-6'>
                    <div>
                      <Label>{t('apis.settings.collectionName')}</Label>
                      <Input
                        value={collectionDetail?.name}
                        readOnly
                        className='mt-2 dark:bg-gray-750 dark:border-gray-600'
                      />
                    </div>

                    <div>
                      <Label>{t('common.labels.description')}</Label>
                      <Textarea
                        value={collectionDetail?.description}
                        readOnly
                        className='mt-2 min-h-[100px] dark:bg-gray-750 dark:border-gray-600'
                      />
                    </div>

                    <div>
                      <Label>{t('apis.settings.visibility')}</Label>
                      <Select value={collectionDetail?.visibility}>
                        <SelectTrigger className='dark:bg-gray-750 dark:border-gray-600 mt-2'>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className='dark:bg-gray-800 dark:border-gray-700'>
                          <SelectItem value='private'>
                            <div className='flex items-center gap-2'>
                              <Shield className='w-4 h-4' />
                              {t('apis.settings.private')}
                            </div>
                          </SelectItem>
                          <SelectItem value='team'>
                            <div className='flex items-center gap-2'>
                              <Eye className='w-4 h-4' />
                              {t('apis.settings.team')}
                            </div>
                          </SelectItem>
                          <SelectItem value='public'>
                            <div className='flex items-center gap-2'>
                              <Globe className='w-4 h-4' />
                              {t('apis.settings.public')}
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
                        {t('apis.settings.importSpec')}
                      </Button>
                    </div>

                    <div className='flex gap-3'>
                      <Button variant='outline' className='flex-1 gap-2'>
                        <Download className='w-4 h-4' />
                        {t('apis.settings.export')}
                      </Button>
                      <Button variant='outline' className='flex-1 gap-2 text-red-600 hover:text-red-700'>
                        <Trash2 className='w-4 h-4' />
                        {t('common.actions.delete')}
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
                  {t('apis.selectCollection')}
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
      <Dialog open={showOpenAPIPreview} onOpenChange={setShowOpenAPIPreview} modal={false}>
        <DialogContent className='max-w-[1200px] dark:bg-gray-800'>
          <DialogHeader>
            <DialogTitle className='dark:text-white flex items-center gap-2'>
              <FileJson className='w-5 h-5' />
              {t('apis.openAPIPreview.title')}
            </DialogTitle>
            <DialogDescription>
              {t('apis.openAPIPreview.description')}
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
              onClick={async () => {
                const success = await copyToClipboard(JSON.stringify(generateOpenAPISpec(), null, 2));
                if (success) {
                  toast.success(t('apis.openAPIPreview.copied'));
                } else {
                  toast.error(t('apis.openAPIPreview.copyFailed'));
                }
              }}
            >
              {t('apis.openAPIPreview.copy')}
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
                toast.success(t('apis.openAPIPreview.downloaded'));
              }}
            >
              <Download className='w-4 h-4 mr-2' />
              {t('apis.openAPIPreview.download')}
            </Button>
            <Button onClick={() => setShowOpenAPIPreview(false)}>{t('apis.openAPIPreview.close')}</Button>
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
              <TabsTrigger value='details'>{t('apis.endpointDialog.details')}</TabsTrigger>
              <TabsTrigger value='request'>{t('apis.endpointDialog.request')}</TabsTrigger>
              <TabsTrigger value='response'>{t('apis.endpointDialog.response')}</TabsTrigger>
              <TabsTrigger value='test'>{t('apis.endpointDialog.test')}</TabsTrigger>
            </TabsList>

            <TabsContent value='details' className='space-y-4 mt-4'>
              <div>
                <Label>{t('common.labels.description')}</Label>
                <p className='text-sm text-gray-600 dark:text-gray-400 mt-2'>{selectedEndpoint?.description}</p>
              </div>
              <div>
                <Label>{t('apis.endpointDialog.category')}</Label>
                <p className='text-sm text-gray-600 dark:text-gray-400 mt-2'>-</p>
              </div>
              <div>
                <Label>{t('common.labels.tags')}</Label>
                <div className='flex flex-wrap gap-2 mt-2'>
                  {(selectedEndpoint?.tags || []).map((tag, index) => (
                    <Badge key={index} variant='secondary'>
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <Label>{t('apis.endpointDialog.status')}</Label>
                <div className='flex items-center gap-2 mt-2'>
                  <Switch checked={selectedEndpoint?.enabled} />
                  <span className='text-sm text-gray-600 dark:text-gray-400'>
                    {selectedEndpoint?.enabled ? t('apis.endpoints.enabled') : t('apis.endpoints.disabled')}
                  </span>
                </div>
              </div>
            </TabsContent>

            <TabsContent value='request' className='mt-4'>
              <div className='p-4 bg-gray-50 dark:bg-gray-750 rounded-lg'>
                <code className='text-sm text-gray-700 dark:text-gray-300'>
                  {t('apis.endpointDialog.requestParams')}
                </code>
              </div>
            </TabsContent>

            <TabsContent value='response' className='mt-4'>
              <div className='p-4 bg-gray-50 dark:bg-gray-750 rounded-lg'>
                <code className='text-sm text-gray-700 dark:text-gray-300'>
                  {t('apis.endpointDialog.responseExample')}
                </code>
              </div>
            </TabsContent>

            <TabsContent value='test' className='mt-4'>
              <div className='space-y-4'>
                <Button className='w-full gap-2'>
                  <Play className='w-4 h-4' />
                  {t('apis.endpointDialog.sendTestRequest')}
                </Button>
                <div className='p-4 bg-gray-50 dark:bg-gray-750 rounded-lg'>
                  <code className='text-sm text-gray-700 dark:text-gray-300'>
                    {t('apis.endpointDialog.testResult')}
                  </code>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button variant='outline' onClick={() => setShowEndpointDialog(false)}>
              {t('apis.endpointDialog.close')}
            </Button>
            <Button>{t('apis.endpointDialog.save')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
