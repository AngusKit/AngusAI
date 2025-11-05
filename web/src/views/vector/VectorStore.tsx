import { useState } from 'react';
import { Database, Plus, Search, X, Settings, Trash2, Play, CheckCircle2, XCircle, Activity, Server, Zap, Globe, Grid3x3, List, Eye, Edit } from 'lucide-react';
import { Button } from '@/ui/button';
import { Input } from '@/ui/input';
import { Badge } from '@/ui/badge';
import { Card } from '@/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/ui/dialog';
import { Label } from '@/ui/label';
import { Textarea } from '@/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/ui/select';
import { Switch } from '@/ui/switch';
import { ScrollArea } from '@/ui/scroll-area';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/ui/dropdown-menu';
import { toast } from 'sonner';
import { useLanguage } from '@/ui/LanguageProvider';

interface VectorStoreConfig {
  id: number;
  name: string;
  type: string;
  description: string;
  endpoint: string;
  status: 'connected' | 'disconnected' | 'testing';
  enabled: boolean;
  dimension: number;
  indexCount: number;
  createdTime: string;
  lastSync: string;
  config: Record<string, string>;
}

const vectorStoreTypes = [
  { value: 'AZURE_AI_SERVICE', label: 'Azure AI Service', icon: '☁️' },
  { value: 'AZURE_COSMOS_DB', label: 'Azure Cosmos DB', icon: '🌐' },
  { value: 'APACHE_CASSANDRA', label: 'Apache Cassandra Vector Store', icon: '📊' },
  { value: 'CHROMA', label: 'Chroma', icon: '🎨' },
  { value: 'COUCHBASE', label: 'Couchbase', icon: '🛋️' },
  { value: 'ELASTICSEARCH', label: 'Elasticsearch', icon: '🔍' },
  { value: 'GEMFIRE', label: 'GemFire', icon: '💎' },
  { value: 'MARIADB', label: 'MariaDB Vector Store', icon: '🗄️' },
  { value: 'MILVUS', label: 'Milvus', icon: '🦅' },
  { value: 'MONGODB_ATLAS', label: 'MongoDB Atlas', icon: '🍃' },
  { value: 'NEO4J', label: 'Neo4j', icon: '🔗' },
  { value: 'OPENSEARCH', label: 'OpenSearch', icon: '🔎' },
  { value: 'ORACLE', label: 'Oracle', icon: '🏛️' },
  { value: 'PGVECTOR', label: 'PGvector', icon: '🐘' },
  { value: 'PINECONE', label: 'Pinecone', icon: '🌲' },
  { value: 'QDRANT', label: 'Qdrant', icon: '⚡' },
  { value: 'REDIS', label: 'Redis', icon: '🔴' },
  { value: 'SAP_HANA', label: 'SAP Hana', icon: '💼' },
  { value: 'TYPESENSE', label: 'Typesense', icon: '⚙️' },
  { value: 'WEAVIATE', label: 'Weaviate', icon: '🕸️' },
];

export function VectorStore() {
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingStore, setEditingStore] = useState<VectorStoreConfig | null>(null);
  const [testingConnection, setTestingConnection] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // 表单状态
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    description: '',
    endpoint: '',
    apiKey: '',
    dimension: '1536',
    database: '',
    collection: '',
    username: '',
    password: '',
  });

  const [vectorStores, setVectorStores] = useState<VectorStoreConfig[]>([
    {
      id: 1,
      name: 'Production Pinecone',
      type: 'PINECONE',
      description: '生产环境向量存储',
      endpoint: 'https://prod-index.pinecone.io',
      status: 'connected',
      enabled: true,
      dimension: 1536,
      indexCount: 125000,
      createdTime: '2024-01-15 10:30',
      lastSync: '2024-10-31 08:45',
      config: {
        apiKey: '*********************',
        environment: 'us-east-1',
        index: 'production',
      },
    },
    {
      id: 2,
      name: 'Dev Chroma DB',
      type: 'CHROMA',
      description: '开发测试环境',
      endpoint: 'http://localhost:8000',
      status: 'connected',
      enabled: true,
      dimension: 768,
      indexCount: 5000,
      createdTime: '2024-02-20 14:20',
      lastSync: '2024-10-31 07:30',
      config: {
        collection: 'dev_vectors',
      },
    },
    {
      id: 3,
      name: 'Azure OpenSearch',
      type: 'OPENSEARCH',
      description: 'Azure托管向量搜索',
      endpoint: 'https://search-vectors.azure.com',
      status: 'disconnected',
      enabled: false,
      dimension: 1536,
      indexCount: 0,
      createdTime: '2024-03-10 09:15',
      lastSync: '2024-10-25 12:00',
      config: {
        username: 'admin',
        password: '*********************',
        index: 'vectors',
      },
    },
    {
      id: 4,
      name: 'Qdrant Cluster',
      type: 'QDRANT',
      description: '高性能向量检索集群',
      endpoint: 'https://qdrant.example.com:6333',
      status: 'connected',
      enabled: true,
      dimension: 1536,
      indexCount: 85000,
      createdTime: '2024-04-05 16:45',
      lastSync: '2024-10-31 09:00',
      config: {
        apiKey: '*********************',
        collection: 'embeddings',
      },
    },
    {
      id: 5,
      name: 'MongoDB Atlas Vector',
      type: 'MONGODB_ATLAS',
      description: 'MongoDB向量搜索索引',
      endpoint: 'mongodb+srv://cluster.mongodb.net',
      status: 'connected',
      enabled: true,
      dimension: 1536,
      indexCount: 42000,
      createdTime: '2024-05-12 11:20',
      lastSync: '2024-10-31 08:15',
      config: {
        username: 'vectordb',
        password: '*********************',
        database: 'vectors',
        collection: 'embeddings',
      },
    },
    {
      id: 6,
      name: 'PGvector Local',
      type: 'PGVECTOR',
      description: 'PostgreSQL向量扩展',
      endpoint: 'postgresql://localhost:5432/vectordb',
      status: 'testing',
      enabled: false,
      dimension: 768,
      indexCount: 1500,
      createdTime: '2024-06-08 13:50',
      lastSync: '2024-10-30 18:00',
      config: {
        username: 'postgres',
        password: '*********************',
        database: 'vectordb',
        table: 'vectors',
      },
    },
  ]);

  // 统计数据
  const stats = [
    {
      label: language === 'zh-CN' ? '存储源总数' : 'Total Sources',
      value: vectorStores.length.toString(),
      subtext: language === 'zh-CN' ? '已配置向量数据库' : 'Configured databases',
      icon: Database,
      iconBg: 'bg-blue-500',
      trend: '+2',
      trendUp: true,
    },
    {
      label: language === 'zh-CN' ? '已连接' : 'Connected',
      value: vectorStores.filter(s => s.status === 'connected').length.toString(),
      subtext: language === 'zh-CN' ? '正常运行中' : 'Currently active',
      icon: CheckCircle2,
      iconBg: 'bg-green-500',
      trend: '+1',
      trendUp: true,
    },
    {
      label: language === 'zh-CN' ? '向量总数' : 'Total Vectors',
      value: (vectorStores.reduce((sum, s) => sum + s.indexCount, 0) / 1000).toFixed(1) + 'K',
      subtext: language === 'zh-CN' ? '跨所有存储源' : 'Across all sources',
      icon: Activity,
      iconBg: 'bg-purple-500',
      trend: '+12K',
      trendUp: true,
    },
    {
      label: language === 'zh-CN' ? '今日查询' : 'Today Queries',
      value: '8,542',
      subtext: language === 'zh-CN' ? '相较昨日增长 23%' : 'Up 23% from yesterday',
      icon: Zap,
      iconBg: 'bg-orange-500',
      trend: '+23%',
      trendUp: true,
    },
  ];

  const handleToggleStore = (id: number) => {
    setVectorStores(prev =>
      prev.map(store =>
        store.id === id ? { ...store, enabled: !store.enabled } : store
      )
    );
  };

  const handleTestConnection = async (id: number) => {
    setTestingConnection(true);
    const store = vectorStores.find(s => s.id === id);
    
    // 模拟连接测试
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setVectorStores(prev =>
      prev.map(s =>
        s.id === id ? { ...s, status: 'connected' as const } : s
      )
    );
    
    setTestingConnection(false);
    toast.success(language === 'zh-CN' ? `${store?.name} 连接成功` : `${store?.name} connected successfully`);
  };

  const handleCreateStore = () => {
    const newStore: VectorStoreConfig = {
      id: vectorStores.length + 1,
      name: formData.name,
      type: formData.type,
      description: formData.description,
      endpoint: formData.endpoint,
      status: 'disconnected',
      enabled: false,
      dimension: parseInt(formData.dimension),
      indexCount: 0,
      createdTime: new Date().toLocaleString('zh-CN'),
      lastSync: '-',
      config: {
        apiKey: formData.apiKey,
        database: formData.database,
        collection: formData.collection,
        username: formData.username,
        password: formData.password,
      },
    };

    setVectorStores([...vectorStores, newStore]);
    setShowCreateDialog(false);
    resetForm();
    toast.success(language === 'zh-CN' ? '向量存储源创建成功' : 'Vector store created successfully');
  };

  const handleEditStore = () => {
    if (!editingStore) return;

    setVectorStores(prev =>
      prev.map(store =>
        store.id === editingStore.id
          ? {
              ...store,
              name: formData.name,
              description: formData.description,
              endpoint: formData.endpoint,
              dimension: parseInt(formData.dimension),
              config: {
                ...store.config,
                apiKey: formData.apiKey,
                database: formData.database,
                collection: formData.collection,
                username: formData.username,
                password: formData.password,
              },
            }
          : store
      )
    );

    setShowEditDialog(false);
    setEditingStore(null);
    resetForm();
    toast.success(language === 'zh-CN' ? '向量存储源更新成功' : 'Vector store updated successfully');
  };

  const handleDeleteStore = (id: number) => {
    const store = vectorStores.find(s => s.id === id);
    setVectorStores(prev => prev.filter(s => s.id !== id));
    toast.success(language === 'zh-CN' ? `已删除 ${store?.name}` : `Deleted ${store?.name}`);
  };

  const openEditDialog = (store: VectorStoreConfig) => {
    setEditingStore(store);
    setFormData({
      name: store.name,
      type: store.type,
      description: store.description,
      endpoint: store.endpoint,
      apiKey: store.config.apiKey || '',
      dimension: store.dimension.toString(),
      database: store.config.database || '',
      collection: store.config.collection || '',
      username: store.config.username || '',
      password: store.config.password || '',
    });
    setShowEditDialog(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      type: '',
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

  const getTypeInfo = (type: string) => {
    return vectorStoreTypes.find(t => t.value === type) || { value: type, label: type, icon: '📦' };
  };

  const filteredStores = vectorStores.filter(store => {
    const searchLower = searchQuery.toLowerCase();
    return (
      store.name.toLowerCase().includes(searchLower) ||
      store.description.toLowerCase().includes(searchLower) ||
      getTypeInfo(store.type).label.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl mb-1 dark:text-white">
          {language === 'zh-CN' ? '向量存储源' : 'Vector Store'}
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {language === 'zh-CN'
            ? '管理向量数据库连接，用于AI应用的向量检索和语义搜索'
            : 'Manage vector database connections for AI applications, vector retrieval and semantic search'}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="px-5 pt-5 pb-3 dark:bg-gray-800 dark:border-gray-700">
              <div className="flex items-start justify-between mb-1.5">
                <div className={`${stat.iconBg} w-10 h-10 rounded-lg flex items-center justify-center`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                {stat.trend && (
                  <span className={`text-sm ${stat.trendUp ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {stat.trend}
                  </span>
                )}
              </div>
              <div className="text-base font-semibold text-gray-600 dark:text-gray-400 mb-0.5">{stat.label}</div>
              <div className="text-3xl dark:text-white mb-0.5">{stat.value}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">{stat.subtext}</div>
            </Card>
          );
        })}
      </div>

      {/* Search and Actions */}
      <div className="flex items-center justify-between gap-3">
        <div className="relative w-[390px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
          <Input
            placeholder={language === 'zh-CN' ? '搜索向量存储源...' : 'Search vector stores...'}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-10 pr-10 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        
        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-gray-700 shadow-sm'
                  : 'hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
              title={language === 'zh-CN' ? '卡片视图' : 'Grid View'}
            >
              <Grid3x3 className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded transition-colors ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-gray-700 shadow-sm'
                  : 'hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
              title={language === 'zh-CN' ? '列表视图' : 'List View'}
            >
              <List className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </button>
          </div>

          <Button onClick={() => setShowCreateDialog(true)} className="gap-2 dark:bg-blue-600 dark:hover:bg-blue-700">
            <Plus className="w-4 h-4" />
            {language === 'zh-CN' ? '添加存储源' : 'Add Store'}
          </Button>
        </div>
      </div>

      {/* Vector Stores Content */}
      {filteredStores.length === 0 ? (
        <div className="text-center py-12">
          <Database className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-3" />
          <p className="text-gray-600 dark:text-gray-400">
            {language === 'zh-CN' ? '未找到匹配的存储源' : 'No matching stores found'}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
            {searchQuery
              ? language === 'zh-CN' ? '尝试使用其他搜索词' : 'Try different search terms'
              : language === 'zh-CN' ? '点击上方按钮添加新的向量存储源' : 'Click the button above to add a new vector store'}
          </p>
        </div>
      ) : (
        <>
          {/* Grid View */}
          {viewMode === 'grid' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredStores.map(store => {
                const typeInfo = getTypeInfo(store.type);
                return (
                  <Card key={store.id} className="p-5 dark:bg-gray-800 dark:border-gray-700 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg flex items-center justify-center text-2xl">
                          {typeInfo.icon}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="dark:text-white">{store.name}</h3>
                            <Switch
                              checked={store.enabled}
                              onCheckedChange={() => handleToggleStore(store.id)}
                              onClick={(e) => e.stopPropagation()}
                            />
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{store.description}</p>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Settings className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="dark:bg-gray-800 dark:border-gray-700">
                          <DropdownMenuItem onClick={() => openEditDialog(store)} className="dark:text-gray-300">
                            <Edit className="w-4 h-4 mr-2" />
                            {language === 'zh-CN' ? '编辑' : 'Edit'}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleTestConnection(store.id)}
                            disabled={testingConnection}
                            className="dark:text-gray-300"
                          >
                            <Play className="w-4 h-4 mr-2" />
                            {language === 'zh-CN' ? '测试连接' : 'Test Connection'}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteStore(store.id)}
                            className="text-red-600 dark:text-red-400"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            {language === 'zh-CN' ? '删除' : 'Delete'}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="dark:border-gray-600 dark:text-gray-300">
                          {typeInfo.label}
                        </Badge>
                        <Badge
                          className={
                            store.status === 'connected'
                              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                              : store.status === 'testing'
                              ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                              : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                          }
                        >
                          {store.status === 'connected'
                            ? language === 'zh-CN' ? '已连接' : 'Connected'
                            : store.status === 'testing'
                            ? language === 'zh-CN' ? '测试中' : 'Testing'
                            : language === 'zh-CN' ? '未连接' : 'Disconnected'}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-gray-500 dark:text-gray-400 mb-1">
                            {language === 'zh-CN' ? '端点' : 'Endpoint'}
                          </div>
                          <div className="text-gray-700 dark:text-gray-300 truncate">{store.endpoint}</div>
                        </div>
                        <div>
                          <div className="text-gray-500 dark:text-gray-400 mb-1">
                            {language === 'zh-CN' ? '维度' : 'Dimension'}
                          </div>
                          <div className="text-gray-700 dark:text-gray-300">{store.dimension}</div>
                        </div>
                        <div>
                          <div className="text-gray-500 dark:text-gray-400 mb-1">
                            {language === 'zh-CN' ? '向量数' : 'Vectors'}
                          </div>
                          <div className="text-gray-700 dark:text-gray-300">{store.indexCount.toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="text-gray-500 dark:text-gray-400 mb-1">
                            {language === 'zh-CN' ? '最后同步' : 'Last Sync'}
                          </div>
                          <div className="text-gray-700 dark:text-gray-300">{store.lastSync}</div>
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
            <Card className="dark:bg-gray-800 dark:border-gray-700 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full table-fixed">
                  <colgroup>
                    <col style={{ width: '28%' }} />
                    <col style={{ width: '12%' }} />
                    <col style={{ width: '14%' }} />
                    <col style={{ width: '20%' }} />
                    <col style={{ width: '8%' }} />
                    <col style={{ width: '10%' }} />
                    <col style={{ width: '8%' }} />
                  </colgroup>
                  <thead className="bg-gray-50 dark:bg-gray-900">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs text-gray-600 dark:text-gray-400">
                        {language === 'zh-CN' ? '存储源' : 'Store'}
                      </th>
                      <th className="px-4 py-3 text-left text-xs text-gray-600 dark:text-gray-400">
                        {language === 'zh-CN' ? '类型' : 'Type'}
                      </th>
                      <th className="px-4 py-3 text-left text-xs text-gray-600 dark:text-gray-400">
                        {language === 'zh-CN' ? '状态' : 'Status'}
                      </th>
                      <th className="px-4 py-3 text-left text-xs text-gray-600 dark:text-gray-400">
                        {language === 'zh-CN' ? '端点' : 'Endpoint'}
                      </th>
                      <th className="px-4 py-3 text-left text-xs text-gray-600 dark:text-gray-400">
                        {language === 'zh-CN' ? '维度' : 'Dim'}
                      </th>
                      <th className="px-4 py-3 text-left text-xs text-gray-600 dark:text-gray-400">
                        {language === 'zh-CN' ? '向量数' : 'Vectors'}
                      </th>
                      <th className="px-4 py-3 text-center text-xs text-gray-600 dark:text-gray-400">
                        {language === 'zh-CN' ? '操作' : 'Actions'}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredStores.map(store => {
                      const typeInfo = getTypeInfo(store.type);
                      return (
                        <tr key={store.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2 min-w-0">
                              <div className="w-8 h-8 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg flex items-center justify-center text-lg flex-shrink-0">
                                {typeInfo.icon}
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="dark:text-white text-sm truncate">{store.name}</div>
                                <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{store.description}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-xs text-gray-600 dark:text-gray-400">
                            <div className="truncate">{typeInfo.label}</div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex flex-col gap-1.5">
                              <Badge
                                className={
                                  store.status === 'connected'
                                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-0 text-xs w-fit'
                                    : store.status === 'testing'
                                    ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border-0 text-xs w-fit'
                                    : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-0 text-xs w-fit'
                                }
                              >
                                {store.status === 'connected'
                                  ? language === 'zh-CN' ? '已连接' : 'Connected'
                                  : store.status === 'testing'
                                  ? language === 'zh-CN' ? '测试中' : 'Testing'
                                  : language === 'zh-CN' ? '未连接' : 'Disconnected'}
                              </Badge>
                              <Switch
                                checked={store.enabled}
                                onCheckedChange={() => handleToggleStore(store.id)}
                                onClick={(e) => e.stopPropagation()}
                                className="scale-75 origin-left"
                              />
                            </div>
                          </td>
                          <td className="px-4 py-3 text-xs text-gray-600 dark:text-gray-400">
                            <div className="truncate" title={store.endpoint}>{store.endpoint}</div>
                          </td>
                          <td className="px-4 py-3 text-xs text-gray-600 dark:text-gray-400">
                            {store.dimension}
                          </td>
                          <td className="px-4 py-3 text-xs text-gray-600 dark:text-gray-400">
                            {(store.indexCount / 1000).toFixed(1)}K
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-center gap-1">
                              <button
                                onClick={() => handleTestConnection(store.id)}
                                disabled={testingConnection}
                                className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                                title={language === 'zh-CN' ? '测试连接' : 'Test Connection'}
                              >
                                <Play className="w-3.5 h-3.5 text-green-500" />
                              </button>
                              <button
                                onClick={() => openEditDialog(store)}
                                className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                                title={language === 'zh-CN' ? '编辑' : 'Edit'}
                              >
                                <Edit className="w-3.5 h-3.5 text-gray-600 dark:text-gray-400" />
                              </button>
                              <button
                                onClick={() => handleDeleteStore(store.id)}
                                className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                                title={language === 'zh-CN' ? '删除' : 'Delete'}
                              >
                                <Trash2 className="w-3.5 h-3.5 text-red-500" />
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
        </>
      )}

      {/* Create Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl dark:bg-gray-800">
          <DialogHeader>
            <DialogTitle className="dark:text-white">
              {language === 'zh-CN' ? '添加向量存储源' : 'Add Vector Store'}
            </DialogTitle>
            <DialogDescription>
              {language === 'zh-CN' ? '配置新的向量数据库连接' : 'Configure a new vector database connection'}
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="max-h-[500px] pr-4">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="dark:text-gray-200">{language === 'zh-CN' ? '名称' : 'Name'}</Label>
                  <Input
                    placeholder={language === 'zh-CN' ? '输入存储源名称' : 'Enter store name'}
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="dark:bg-gray-750 dark:border-gray-600"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="dark:text-gray-200">{language === 'zh-CN' ? '类型' : 'Type'}</Label>
                  <Select value={formData.type} onValueChange={value => setFormData({ ...formData, type: value })}>
                    <SelectTrigger className="dark:bg-gray-750 dark:border-gray-600">
                      <SelectValue placeholder={language === 'zh-CN' ? '选择数据库类型' : 'Select database type'} />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                      {vectorStoreTypes.map(type => (
                        <SelectItem key={type.value} value={type.value} className="dark:text-gray-300">
                          {type.icon} {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="dark:text-gray-200">{language === 'zh-CN' ? '描述' : 'Description'}</Label>
                <Textarea
                  placeholder={language === 'zh-CN' ? '输入描述信息' : 'Enter description'}
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="dark:bg-gray-750 dark:border-gray-600"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label className="dark:text-gray-200">{language === 'zh-CN' ? '端点地址' : 'Endpoint'}</Label>
                <Input
                  placeholder="https://..."
                  value={formData.endpoint}
                  onChange={e => setFormData({ ...formData, endpoint: e.target.value })}
                  className="dark:bg-gray-750 dark:border-gray-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="dark:text-gray-200">{language === 'zh-CN' ? 'API密钥' : 'API Key'}</Label>
                  <Input
                    type="password"
                    placeholder="sk-..."
                    value={formData.apiKey}
                    onChange={e => setFormData({ ...formData, apiKey: e.target.value })}
                    className="dark:bg-gray-750 dark:border-gray-600"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="dark:text-gray-200">{language === 'zh-CN' ? '向量维度' : 'Dimension'}</Label>
                  <Input
                    type="number"
                    placeholder="1536"
                    value={formData.dimension}
                    onChange={e => setFormData({ ...formData, dimension: e.target.value })}
                    className="dark:bg-gray-750 dark:border-gray-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="dark:text-gray-200">{language === 'zh-CN' ? '数据库' : 'Database'}</Label>
                  <Input
                    placeholder={language === 'zh-CN' ? '数据库名称' : 'Database name'}
                    value={formData.database}
                    onChange={e => setFormData({ ...formData, database: e.target.value })}
                    className="dark:bg-gray-750 dark:border-gray-600"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="dark:text-gray-200">{language === 'zh-CN' ? '集合/索引' : 'Collection/Index'}</Label>
                  <Input
                    placeholder={language === 'zh-CN' ? '集合名称' : 'Collection name'}
                    value={formData.collection}
                    onChange={e => setFormData({ ...formData, collection: e.target.value })}
                    className="dark:bg-gray-750 dark:border-gray-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="dark:text-gray-200">{language === 'zh-CN' ? '用户名' : 'Username'}</Label>
                  <Input
                    placeholder={language === 'zh-CN' ? '用户名(可选)' : 'Username (optional)'}
                    value={formData.username}
                    onChange={e => setFormData({ ...formData, username: e.target.value })}
                    className="dark:bg-gray-750 dark:border-gray-600"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="dark:text-gray-200">{language === 'zh-CN' ? '密码' : 'Password'}</Label>
                  <Input
                    type="password"
                    placeholder={language === 'zh-CN' ? '密码(可选)' : 'Password (optional)'}
                    value={formData.password}
                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                    className="dark:bg-gray-750 dark:border-gray-600"
                  />
                </div>
              </div>
            </div>
          </ScrollArea>

          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowCreateDialog(false); resetForm(); }}>
              {language === 'zh-CN' ? '取消' : 'Cancel'}
            </Button>
            <Button onClick={handleCreateStore} disabled={!formData.name || !formData.type || !formData.endpoint}>
              {language === 'zh-CN' ? '创建' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl dark:bg-gray-800">
          <DialogHeader>
            <DialogTitle className="dark:text-white">
              {language === 'zh-CN' ? '编辑向量存储源' : 'Edit Vector Store'}
            </DialogTitle>
            <DialogDescription>
              {language === 'zh-CN' ? '修改向量数据库配置' : 'Modify vector database configuration'}
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="max-h-[500px] pr-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="dark:text-gray-200">{language === 'zh-CN' ? '名称' : 'Name'}</Label>
                <Input
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="dark:bg-gray-750 dark:border-gray-600"
                />
              </div>

              <div className="space-y-2">
                <Label className="dark:text-gray-200">{language === 'zh-CN' ? '描述' : 'Description'}</Label>
                <Textarea
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="dark:bg-gray-750 dark:border-gray-600"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label className="dark:text-gray-200">{language === 'zh-CN' ? '端点地址' : 'Endpoint'}</Label>
                <Input
                  value={formData.endpoint}
                  onChange={e => setFormData({ ...formData, endpoint: e.target.value })}
                  className="dark:bg-gray-750 dark:border-gray-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="dark:text-gray-200">{language === 'zh-CN' ? 'API密钥' : 'API Key'}</Label>
                  <Input
                    type="password"
                    value={formData.apiKey}
                    onChange={e => setFormData({ ...formData, apiKey: e.target.value })}
                    className="dark:bg-gray-750 dark:border-gray-600"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="dark:text-gray-200">{language === 'zh-CN' ? '向量维度' : 'Dimension'}</Label>
                  <Input
                    type="number"
                    value={formData.dimension}
                    onChange={e => setFormData({ ...formData, dimension: e.target.value })}
                    className="dark:bg-gray-750 dark:border-gray-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="dark:text-gray-200">{language === 'zh-CN' ? '数据库' : 'Database'}</Label>
                  <Input
                    value={formData.database}
                    onChange={e => setFormData({ ...formData, database: e.target.value })}
                    className="dark:bg-gray-750 dark:border-gray-600"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="dark:text-gray-200">{language === 'zh-CN' ? '集合/索引' : 'Collection/Index'}</Label>
                  <Input
                    value={formData.collection}
                    onChange={e => setFormData({ ...formData, collection: e.target.value })}
                    className="dark:bg-gray-750 dark:border-gray-600"
                  />
                </div>
              </div>
            </div>
          </ScrollArea>

          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowEditDialog(false); setEditingStore(null); resetForm(); }}>
              {language === 'zh-CN' ? '取消' : 'Cancel'}
            </Button>
            <Button onClick={handleEditStore}>
              {language === 'zh-CN' ? '保存' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
