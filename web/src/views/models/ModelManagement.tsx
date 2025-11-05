import { useState } from 'react';
import { useLanguage } from '@/ui/LanguageProvider';
import { 
  Database, 
  Search, 
  Filter, 
  Plus,
  Star, 
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
  Upload,
  Cpu,
  Zap,
  Brain,
  MessageSquare,
  FileText,
  Image as ImageIcon,
  Code,
  Globe,
  Video,
  X,
  Info,
  Sliders
} from 'lucide-react';
import { Button } from '@/ui/button';
import { Card } from '@/ui/card';
import { Badge } from '@/ui/badge';
import { Input } from '@/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/ui/dialog';
import { Label } from '@/ui/label';
import { Textarea } from '@/ui/textarea';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/ui/pagination';
import { toast } from 'sonner';

interface Model {
  id: number;
  name: string;
  description: string;
  type: string;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  provider: string;
  version: string;
  status: '运行中' | '已停止' | '部署中';
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
}

export function ModelManagement() {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('default');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [addModelDialogOpen, setAddModelDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState<Model | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  
  // 添加模型表单状态
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'language',
    provider: '',
    version: '',
    apiKey: '',
    endpoint: '',
    maxTokens: '',
    temperature: '0.7',
  });

  // 编辑模型表单状态
  const [editFormData, setEditFormData] = useState({
    name: '',
    description: '',
    type: 'language',
    provider: '',
    version: '',
    apiKey: '',
    endpoint: '',
    maxTokens: '',
    temperature: '0.7',
  });

  // 统计数据
  const stats = [
    {
      label: '模型总数',
      value: '24',
      subtext: '较上月新增 3个',
      icon: Database,
      iconBg: 'bg-blue-500',
      trend: '+14%',
      trendUp: true,
    },
    {
      label: '今日成本',
      value: '¥3,240',
      subtext: '累计成本 ¥48,650',
      icon: Activity,
      iconBg: 'bg-green-500',
      trend: '+12%',
      trendUp: true,
    },
    {
      label: '今日调用',
      value: '45.2K',
      subtext: '累计调用 1.2M 次',
      icon: TrendingUp,
      iconBg: 'bg-orange-500',
      trend: '+28%',
      trendUp: true,
    },
    {
      label: '今日平均延迟',
      value: '128ms',
      subtext: '较昨日降低 15ms',
      icon: Zap,
      iconBg: 'bg-purple-500',
      trend: '-10%',
      trendUp: true,
    },
  ];

  // 模型列表
  const [models, setModels] = useState<Model[]>([
    {
      id: 1,
      name: 'GPT-4 Turbo',
      description: '最先进的大语言模型，支持复杂对话和内容生成',
      type: '语言模型',
      icon: Brain,
      iconBg: 'bg-blue-50 dark:bg-blue-900/20',
      iconColor: 'text-blue-500',
      provider: 'OpenAI',
      version: 'gpt-4-turbo-2024-04',
      status: '运行中',
      statusColor: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      performance: {
        latency: '245ms',
        throughput: '850 req/s',
        accuracy: '98.5%',
      },
      resources: {
        cpu: '45%',
        memory: '12.5 GB',
        gpu: '2x A100',
      },
      calls: '18.5K',
      cost: '¥2,450',
      tokens: '8.9M',
      deployed: '2024-01-15',
    },
    {
      id: 2,
      name: 'Claude 3 Opus',
      description: 'Anthropic最新的高性能AI助手模型',
      type: '语言模型',
      icon: MessageSquare,
      iconBg: 'bg-purple-50 dark:bg-purple-900/20',
      iconColor: 'text-purple-500',
      provider: 'Anthropic',
      version: 'claude-3-opus',
      status: '运行中',
      statusColor: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      performance: {
        latency: '198ms',
        throughput: '920 req/s',
        accuracy: '99.1%',
      },
      resources: {
        cpu: '38%',
        memory: '10.2 GB',
        gpu: '2x A100',
      },
      calls: '12.3K',
      cost: '¥1,890',
      tokens: '3.2M',
      deployed: '2024-01-20',
    },
    {
      id: 3,
      name: 'DALL-E 3',
      description: '强大的文本到图像生成模型',
      type: '图像生成',
      icon: ImageIcon,
      iconBg: 'bg-pink-50 dark:bg-pink-900/20',
      iconColor: 'text-pink-500',
      provider: 'OpenAI',
      version: 'dall-e-3',
      status: '运行中',
      statusColor: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      performance: {
        latency: '8.5s',
        throughput: '45 img/min',
        accuracy: '97.2%',
      },
      resources: {
        cpu: '52%',
        memory: '16.8 GB',
        gpu: '4x A100',
      },
      calls: '3.2K',
      cost: '¥1,250',
      tokens: '1.8M',
      deployed: '2024-01-10',
    },
    {
      id: 4,
      name: 'CodeLlama 70B',
      description: '专业的代码生成和理解模型',
      type: '代码模型',
      icon: Code,
      iconBg: 'bg-orange-50 dark:bg-orange-900/20',
      iconColor: 'text-orange-500',
      provider: 'Meta',
      version: 'codellama-70b',
      status: '已停止',
      statusColor: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400',
      performance: {
        latency: '312ms',
        throughput: '650 req/s',
        accuracy: '96.8%',
      },
      resources: {
        cpu: '0%',
        memory: '0 GB',
        gpu: '-',
      },
      calls: '5.6K',
      cost: '¥780',
      tokens: '4.5M',
      deployed: '2024-01-05',
    },
    {
      id: 5,
      name: 'Whisper Large v3',
      description: '高精度语音识别和转录模型',
      type: '语音模型',
      icon: Globe,
      iconBg: 'bg-green-50 dark:bg-green-900/20',
      iconColor: 'text-green-500',
      provider: 'OpenAI',
      version: 'whisper-large-v3',
      status: '运行中',
      statusColor: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      performance: {
        latency: '1.2s',
        throughput: '120 audio/min',
        accuracy: '98.9%',
      },
      resources: {
        cpu: '28%',
        memory: '8.5 GB',
        gpu: '1x A100',
      },
      calls: '2.8K',
      cost: '¥560',
      tokens: '890K',
      deployed: '2024-01-18',
    },
    {
      id: 6,
      name: 'Embedding Ada v2',
      description: '文本嵌入和语义搜索模型',
      type: '嵌入模型',
      icon: FileText,
      iconBg: 'bg-indigo-50 dark:bg-indigo-900/20',
      iconColor: 'text-indigo-500',
      provider: 'OpenAI',
      version: 'text-embedding-ada-002',
      status: '运行中',
      statusColor: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      performance: {
        latency: '45ms',
        throughput: '2500 req/s',
        accuracy: '95.4%',
      },
      resources: {
        cpu: '22%',
        memory: '4.2 GB',
        gpu: '1x T4',
      },
      calls: '28.9K',
      cost: '¥320',
      tokens: '15.2M',
      deployed: '2024-01-12',
    },
    {
      id: 7,
      name: 'Gemini Pro Vision',
      description: '多模态理解和生成模型',
      type: '多模态',
      icon: Brain,
      iconBg: 'bg-teal-50 dark:bg-teal-900/20',
      iconColor: 'text-teal-500',
      provider: 'Google',
      version: 'gemini-pro-vision',
      status: '部署中',
      statusColor: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      performance: {
        latency: '-',
        throughput: '-',
        accuracy: '-',
      },
      resources: {
        cpu: '15%',
        memory: '6.0 GB',
        gpu: 'Deploying...',
      },
      calls: '0',
      cost: '¥0',
      tokens: '0',
      deployed: '2024-01-22',
    },
    {
      id: 8,
      name: 'LLaMA 2 13B',
      description: '开源的高性能语言模型',
      type: '语言模型',
      icon: MessageSquare,
      iconBg: 'bg-yellow-50 dark:bg-yellow-900/20',
      iconColor: 'text-yellow-600',
      provider: 'Meta',
      version: 'llama-2-13b-chat',
      status: '运行中',
      statusColor: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      performance: {
        latency: '168ms',
        throughput: '1100 req/s',
        accuracy: '96.2%',
      },
      resources: {
        cpu: '35%',
        memory: '9.8 GB',
        gpu: '1x A100',
      },
      calls: '8.7K',
      cost: '¥450',
      tokens: '6.8M',
      deployed: '2024-01-08',
    },
    {
      id: 9,
      name: 'Stable Diffusion XL',
      description: '高质量图像生成和编辑模型',
      type: '图像生成',
      icon: ImageIcon,
      iconBg: 'bg-red-50 dark:bg-red-900/20',
      iconColor: 'text-red-500',
      provider: 'Stability AI',
      version: 'sdxl-1.0',
      status: '运行中',
      statusColor: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      performance: {
        latency: '6.2s',
        throughput: '52 img/min',
        accuracy: '96.5%',
      },
      resources: {
        cpu: '48%',
        memory: '14.5 GB',
        gpu: '2x A100',
      },
      calls: '4.5K',
      cost: '¥890',
      tokens: '2.1M',
      deployed: '2024-01-14',
    },
    {
      id: 10,
      name: 'Runway Gen-2',
      description: '先进的文本到视频生成模型',
      type: '视频生成',
      icon: Video,
      iconBg: 'bg-violet-50 dark:bg-violet-900/20',
      iconColor: 'text-violet-500',
      provider: 'Runway',
      version: 'gen-2',
      status: '运行中',
      statusColor: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      performance: {
        latency: '45s',
        throughput: '12 video/hour',
        accuracy: '94.8%',
      },
      resources: {
        cpu: '65%',
        memory: '24.0 GB',
        gpu: '4x A100',
      },
      calls: '1.2K',
      cost: '¥1,680',
      tokens: '520K',
      deployed: '2024-01-16',
    },
    {
      id: 11,
      name: 'Pika Labs v1.0',
      description: '高质量视频编辑和生成AI模型',
      type: '视频生成',
      icon: Video,
      iconBg: 'bg-cyan-50 dark:bg-cyan-900/20',
      iconColor: 'text-cyan-500',
      provider: 'Pika Labs',
      version: 'v1.0',
      status: '运行中',
      statusColor: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      performance: {
        latency: '38s',
        throughput: '15 video/hour',
        accuracy: '95.2%',
      },
      resources: {
        cpu: '58%',
        memory: '20.5 GB',
        gpu: '3x A100',
      },
      calls: '890',
      cost: '¥1,250',
      tokens: '380K',
      deployed: '2024-01-19',
    },
  ]);

  // 过滤和排序模型
  const filteredAndSortedModels = models
    .filter((model) => {
      // 搜索过滤
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = 
        model.name.toLowerCase().includes(searchLower) ||
        model.description.toLowerCase().includes(searchLower) ||
        model.provider.toLowerCase().includes(searchLower) ||
        model.type.toLowerCase().includes(searchLower);

      // 类型过滤
      const matchesType = typeFilter === 'all' || 
        (typeFilter === 'language' && model.type === '语言模型') ||
        (typeFilter === 'image' && model.type === '图像生成') ||
        (typeFilter === 'video' && model.type === '视频生成') ||
        (typeFilter === 'code' && model.type === '代码模型') ||
        (typeFilter === 'audio' && model.type === '语音模型') ||
        (typeFilter === 'embedding' && model.type === '嵌入模型') ||
        (typeFilter === 'multimodal' && model.type === '多模态');

      // 状态过滤
      const matchesStatus = statusFilter === 'all' ||
        (statusFilter === 'running' && model.status === '运行中') ||
        (statusFilter === 'stopped' && model.status === '已停止') ||
        (statusFilter === 'deploying' && model.status === '部署中');

      return matchesSearch && matchesType && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'calls':
          return parseInt(b.calls.replace(/[K,]/g, '')) - parseInt(a.calls.replace(/[K,]/g, ''));
        case 'cost':
          return parseInt(b.cost.replace(/[¥,]/g, '')) - parseInt(a.cost.replace(/[¥,]/g, ''));
        default:
          return 0;
      }
    });

  // 分页逻辑
  const totalPages = Math.ceil(filteredAndSortedModels.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentModels = filteredAndSortedModels.slice(startIndex, endIndex);
  const shouldShowPagination = filteredAndSortedModels.length > itemsPerPage;

  // 当筛选条件改变时重置到第一页
  const resetToFirstPage = () => {
    setCurrentPage(1);
  };

  const handleToggleStatus = (model: Model) => {
    setModels(models.map(m => {
      if (m.id === model.id) {
        const newStatus = m.status === '运行中' ? '已停止' : '运行中';
        const newStatusColor = newStatus === '运行中' 
          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
          : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400';
        
        toast.success(`${m.name} 已${newStatus === '运行中' ? '启动' : '停止'}`);
        
        return {
          ...m,
          status: newStatus,
          statusColor: newStatusColor,
          resources: newStatus === '已停止' 
            ? { cpu: '0%', memory: '0 GB', gpu: '-' }
            : m.resources,
        };
      }
      return m;
    }));
  };

  const handleViewDetails = (model: Model) => {
    setSelectedModel(model);
    setDetailsDialogOpen(true);
  };

  const handleOpenEdit = (model: Model) => {
    setSelectedModel(model);
    
    // 将提供商名称映射到枚举值
    const getProviderValue = (providerName: string) => {
      const mapping: Record<string, string> = {
        'OpenAI': 'OPENAI',
        'Anthropic': 'ANTHROPIC',
        'Google': 'GOOGLE_VERTEXAI',
        'Cohere': 'OCI_GENAI',
        'Stability AI': 'STABILITY',
        'ElevenLabs': 'CUSTOM',
        'Deepgram': 'CUSTOM',
        'Runway': 'CUSTOM',
        'Pika Labs': 'CUSTOM',
      };
      return mapping[providerName] || 'CUSTOM';
    };
    
    setEditFormData({
      name: model.name,
      description: model.description,
      type: model.type === '语言模型' ? 'language' : 
            model.type === '图像生成' ? 'image' :
            model.type === '视频生成' ? 'video' :
            model.type === '代码模型' ? 'code' :
            model.type === '语音模型' ? 'audio' :
            model.type === '嵌入模型' ? 'embedding' : 'multimodal',
      provider: getProviderValue(model.provider),
      version: model.version,
      apiKey: '',
      endpoint: '',
      maxTokens: '',
      temperature: '0.7',
    });
    setEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (!editFormData.name || !editFormData.provider || !editFormData.version) {
      toast.error('请填写必填字段');
      return;
    }

    // 将枚举值转换为显示名称
    const getProviderLabel = (value: string) => {
      const provider = providerOptions.find(p => p.value === value);
      return provider ? provider.label : value;
    };

    setModels(models.map(m => {
      if (m.id === selectedModel?.id) {
        return {
          ...m,
          name: editFormData.name,
          description: editFormData.description,
          provider: getProviderLabel(editFormData.provider),
          version: editFormData.version,
        };
      }
      return m;
    }));

    toast.success(`模型 "${editFormData.name}" 配置已更新`);
    setEditDialogOpen(false);
  };

  const handleDeleteModel = (model: Model) => {
    setModels(models.filter(m => m.id !== model.id));
    toast.success(`模型 "${model.name}" 已删除`);
  };

  const handleAddModel = () => {
    if (!formData.name || !formData.provider || !formData.version) {
      toast.error('请填写必填字段');
      return;
    }
    
    toast.success(`模型 "${formData.name}" 已成功添加！`);
    setAddModelDialogOpen(false);
    
    // 重置表单
    setFormData({
      name: '',
      description: '',
      type: 'language',
      provider: '',
      version: '',
      apiKey: '',
      endpoint: '',
      maxTokens: '',
      temperature: '0.7',
    });
  };

  const modelTypeOptions = [
    { value: 'language', label: '语言模型', icon: Brain },
    { value: 'image', label: '图像生成', icon: ImageIcon },
    { value: 'video', label: '视频生成', icon: Video },
    { value: 'code', label: '代码模型', icon: Code },
    { value: 'audio', label: '语音模型', icon: Globe },
    { value: 'embedding', label: '嵌入模型', icon: FileText },
    { value: 'multimodal', label: '多模态', icon: Brain },
  ];

  const providerOptions = [
    // 主要提供商
    { value: 'OPENAI', label: 'OpenAI', category: '主要提供商' },
    { value: 'ANTHROPIC', label: 'Anthropic Claude', category: '主要提供商' },
    { value: 'AZURE_OPENAI', label: 'Azure OpenAI', category: '主要提供商' },
    { value: 'GOOGLE_VERTEXAI', label: 'Google VertexAI Gemini', category: '主要提供商' },
    { value: 'AMAZON_BEDROCK', label: 'Amazon Bedrock', category: '主要提供商' },
    
    // 开源和本地模型
    { value: 'OLLAMA', label: 'Ollama', category: '开源和本地模型' },
    { value: 'HUGGINGFACE', label: 'HuggingFace', category: '开源和本地模型' },
    { value: 'ONNX_TRANSFORMERS', label: 'ONNX Transformers', category: '开源和本地模型' },
    { value: 'POSTGRESML', label: 'PostgresML', category: '开源和本地模型' },
    
    // 专业AI公司
    { value: 'MISTRAL_AI', label: 'Mistral AI', category: '专业AI公司' },
    { value: 'DEEPSEEK', label: 'DeepSeek', category: '专业AI公司' },
    { value: 'MOONSHOT_AI', label: 'Moonshot AI', category: '专业AI公司' },
    { value: 'ZHIPU_AI', label: '智谱AI', category: '专业AI公司' },
    { value: 'MINIMAX', label: 'MiniMax', category: '专业AI公司' },
    
    // 云服务提供商
    { value: 'GROQ', label: 'Groq', category: '云服务提供商' },
    { value: 'NVIDIA', label: 'NVIDIA', category: '云服务提供商' },
    { value: 'OCI_GENAI', label: 'OCI GenAI/Cohere', category: '云服务提供商' },
    { value: 'PERPLEXITY', label: 'Perplexity', category: '云服务提供商' },
    { value: 'QIANFAN', label: '千帆', category: '云服务提供商' },
    { value: 'STABILITY', label: 'Stability AI', category: '云服务提供商' },
    
    // 其他
    { value: 'LOCAL', label: '本地部署', category: '其他' },
    { value: 'CUSTOM', label: '自定义', category: '其他' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl mb-1 dark:text-white">模型管理</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          管理和监控AI模型的部署和性能
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="px-5 pt-5 pb-3 dark:bg-gray-800 dark:border-gray-700">
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

      {/* Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="dark:bg-gray-800">
          <TabsTrigger value="all">全部模型</TabsTrigger>
          <TabsTrigger value="language">语言模型</TabsTrigger>
          <TabsTrigger value="image">图像模型</TabsTrigger>
          <TabsTrigger value="video">视频模型</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4 mt-0">
          {/* Action Bar */}
          <div className="flex items-center justify-between gap-3">
            {/* Search Bar */}
            <div className="relative w-[390px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="搜索模型..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-9 dark:bg-gray-800 dark:border-gray-700"
              />
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-2">
              <Select value={typeFilter} onValueChange={(value) => {
                setTypeFilter(value);
                setCurrentPage(1);
              }}>
                <SelectTrigger className="w-[140px] dark:bg-gray-800 dark:border-gray-700">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="类型筛选" />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                  <SelectItem value="all" className="dark:text-gray-300">全部类型</SelectItem>
                  <SelectItem value="language" className="dark:text-gray-300">语言模型</SelectItem>
                  <SelectItem value="image" className="dark:text-gray-300">图像生成</SelectItem>
                  <SelectItem value="video" className="dark:text-gray-300">视频生成</SelectItem>
                  <SelectItem value="code" className="dark:text-gray-300">代码模型</SelectItem>
                  <SelectItem value="audio" className="dark:text-gray-300">语音模型</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={(value) => {
                setStatusFilter(value);
                setCurrentPage(1);
              }}>
                <SelectTrigger className="w-[140px] dark:bg-gray-800 dark:border-gray-700">
                  <SelectValue placeholder="状态筛选" />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                  <SelectItem value="all" className="dark:text-gray-300">全部状态</SelectItem>
                  <SelectItem value="running" className="dark:text-gray-300">运行中</SelectItem>
                  <SelectItem value="stopped" className="dark:text-gray-300">已停止</SelectItem>
                  <SelectItem value="deploying" className="dark:text-gray-300">部署中</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={(value) => {
                setSortBy(value);
                setCurrentPage(1);
              }}>
                <SelectTrigger className="w-[140px] dark:bg-gray-800 dark:border-gray-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                  <SelectItem value="default" className="dark:text-gray-300">默认排序</SelectItem>
                  <SelectItem value="name" className="dark:text-gray-300">名称</SelectItem>
                  <SelectItem value="calls" className="dark:text-gray-300">调用次数</SelectItem>
                  <SelectItem value="cost" className="dark:text-gray-300">成本</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex items-center gap-1 border border-gray-200 dark:border-gray-700 rounded-lg p-1">
                <Button
                  variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="h-8 w-8 p-0"
                >
                  <Grid3x3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="h-8 w-8 p-0"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>

              <Dialog open={addModelDialogOpen} onOpenChange={setAddModelDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-500 hover:bg-blue-600">
                    <Plus className="w-4 h-4 mr-2" />
                    添加模型
                  </Button>
                </DialogTrigger>
                <DialogContent className="dark:bg-gray-800 dark:border-gray-700 sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="dark:text-white">添加新模型</DialogTitle>
                    <DialogDescription className="dark:text-gray-400">
                      配置并添加一个新的AI模型到您的工作空间
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-4 py-4">
                    {/* 基本信息 */}
                    <div className="space-y-3">
                      <h3 className="text-sm dark:text-white flex items-center gap-2">
                        <Info className="w-4 h-4 text-blue-500" />
                        基本信息
                      </h3>
                      
                      <div className="space-y-2">
                        <Label htmlFor="model-name" className="dark:text-gray-300">
                          模型名称 <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="model-name"
                          placeholder="例如: GPT-4 Turbo"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="dark:bg-gray-700 dark:border-gray-600"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="model-description" className="dark:text-gray-300">
                          描述
                        </Label>
                        <Textarea
                          id="model-description"
                          placeholder="简要描述这个模型的功能和用途..."
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          className="dark:bg-gray-700 dark:border-gray-600 min-h-[80px]"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label htmlFor="model-type" className="dark:text-gray-300">
                            模型类型 <span className="text-red-500">*</span>
                          </Label>
                          <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                            <SelectTrigger id="model-type" className="dark:bg-gray-700 dark:border-gray-600">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                              {modelTypeOptions.map((option) => {
                                const Icon = option.icon;
                                return (
                                  <SelectItem key={option.value} value={option.value} className="dark:text-gray-300">
                                    <div className="flex items-center gap-2">
                                      <Icon className="w-4 h-4" />
                                      {option.label}
                                    </div>
                                  </SelectItem>
                                );
                              })}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="model-provider" className="dark:text-gray-300">
                            提供商 <span className="text-red-500">*</span>
                          </Label>
                          <Select value={formData.provider} onValueChange={(value) => setFormData({ ...formData, provider: value })}>
                            <SelectTrigger id="model-provider" className="dark:bg-gray-700 dark:border-gray-600">
                              <SelectValue placeholder="选择提供商" />
                            </SelectTrigger>
                            <SelectContent className="dark:bg-gray-800 dark:border-gray-700 max-h-[300px]">
                              {providerOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value} className="dark:text-gray-300">
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="model-version" className="dark:text-gray-300">
                          版本 <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="model-version"
                          placeholder="例如: gpt-4-turbo-2024-04"
                          value={formData.version}
                          onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                          className="dark:bg-gray-700 dark:border-gray-600"
                        />
                      </div>
                    </div>

                    {/* API配置 */}
                    <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <h3 className="text-sm dark:text-white flex items-center gap-2">
                        <Settings className="w-4 h-4 text-green-500" />
                        API配置
                      </h3>
                      
                      <div className="space-y-2">
                        <Label htmlFor="model-endpoint" className="dark:text-gray-300">
                          API端点
                        </Label>
                        <Input
                          id="model-endpoint"
                          placeholder="https://api.example.com/v1"
                          value={formData.endpoint}
                          onChange={(e) => setFormData({ ...formData, endpoint: e.target.value })}
                          className="dark:bg-gray-700 dark:border-gray-600"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="model-apikey" className="dark:text-gray-300">
                          API密钥
                        </Label>
                        <Input
                          id="model-apikey"
                          type="password"
                          placeholder="sk-..."
                          value={formData.apiKey}
                          onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                          className="dark:bg-gray-700 dark:border-gray-600"
                        />
                      </div>
                    </div>

                    {/* 模型参数 */}
                    <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <h3 className="text-sm dark:text-white flex items-center gap-2">
                        <Sliders className="w-4 h-4 text-purple-500" />
                        模型参数
                      </h3>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label htmlFor="model-maxTokens" className="dark:text-gray-300">
                            最大Tokens
                          </Label>
                          <Input
                            id="model-maxTokens"
                            type="number"
                            placeholder="4096"
                            value={formData.maxTokens}
                            onChange={(e) => setFormData({ ...formData, maxTokens: e.target.value })}
                            className="dark:bg-gray-700 dark:border-gray-600"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="model-temperature" className="dark:text-gray-300">
                            Temperature
                          </Label>
                          <Input
                            id="model-temperature"
                            type="number"
                            step="0.1"
                            min="0"
                            max="2"
                            placeholder="0.7"
                            value={formData.temperature}
                            onChange={(e) => setFormData({ ...formData, temperature: e.target.value })}
                            className="dark:bg-gray-700 dark:border-gray-600"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setAddModelDialogOpen(false)}
                      className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                    >
                      取消
                    </Button>
                    <Button
                      onClick={handleAddModel}
                      className="bg-blue-500 hover:bg-blue-600"
                    >
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
              {filteredAndSortedModels.length === 0 ? (
                <Card className="p-12 text-center dark:bg-gray-800 dark:border-gray-700 col-span-full">
                  <Database className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg mb-2 dark:text-white">未找到模型</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    尝试调整搜索条件或筛选器
                  </p>
                </Card>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {currentModels.map((model) => {
                      const Icon = model.icon;
                      return (
                        <Card key={model.id} className="p-5 dark:bg-gray-800 dark:border-gray-700 hover:shadow-lg transition-shadow">
                          <div className="flex items-start justify-between mb-4">
                            <button 
                              onClick={() => handleToggleStatus(model)}
                              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                              disabled={model.status === '部署中'}
                            >
                              {model.status === '运行中' ? (
                                <Pause className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                              ) : (
                                <Play className="w-4 h-4 text-green-600 dark:text-green-400" />
                              )}
                            </button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                                  <MoreHorizontal className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                </button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="dark:bg-gray-800 dark:border-gray-700">
                                <DropdownMenuItem onClick={() => handleViewDetails(model)} className="dark:text-gray-300">
                                  <Eye className="w-4 h-4 mr-2" />
                                  查看详情
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleOpenEdit(model)} className="dark:text-gray-300">
                                  <Edit className="w-4 h-4 mr-2" />
                                  编辑配置
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleDeleteModel(model)} className="text-red-600 dark:text-red-400">
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  删除
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>

                              <div className="flex items-start gap-3 mb-3">
                            <div className={`${model.iconBg} w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0`}>
                              <Icon className={`w-6 h-6 ${model.iconColor}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="mb-1 dark:text-white">{model.name}</h3>
                              <Badge className={`text-xs ${model.statusColor} border-0`}>
                                {model.status}
                              </Badge>
                            </div>
                          </div>

                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                            {model.description}
                          </p>

                          <div className="space-y-2 mb-4 text-xs">
                            <div className="flex items-center justify-between">
                              <span className="text-gray-500 dark:text-gray-400">提供商</span>
                              <span className="dark:text-white">{model.provider}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-500 dark:text-gray-400">版本</span>
                              <span className="dark:text-white">{model.version}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-500 dark:text-gray-400">延迟</span>
                              <span className="dark:text-white">{model.performance.latency}</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700 text-sm">
                            <div>
                              <div className="text-gray-500 dark:text-gray-400 text-xs">今日调用</div>
                              <div className="dark:text-white">{model.calls}</div>
                            </div>
                            <div className="text-right">
                              <div className="text-gray-500 dark:text-gray-400 text-xs">今日成本</div>
                              <div className="dark:text-white">{model.cost}</div>
                            </div>
                          </div>
                        </Card>
                      );
                    })}
                  </div>

                  {/* Grid View Pagination */}
                  {shouldShowPagination && (
                    <div className="flex items-center justify-center mt-6">
                      <Pagination>
                        <PaginationContent>
                          <PaginationItem>
                            <PaginationPrevious 
                              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                              className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                            >
                              上一页
                            </PaginationPrevious>
                          </PaginationItem>
                          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <PaginationItem key={page}>
                              <PaginationLink
                                onClick={() => setCurrentPage(page)}
                                isActive={currentPage === page}
                                className="cursor-pointer"
                              >
                                {page}
                              </PaginationLink>
                            </PaginationItem>
                          ))}
                          <PaginationItem>
                            <PaginationNext 
                              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                              className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                            >
                              下一页
                            </PaginationNext>
                          </PaginationItem>
                        </PaginationContent>
                      </Pagination>
                    </div>
                  )}
                </>
              )}
            </>
          )}

          {/* List View */}
          {viewMode === 'list' && (
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              {filteredAndSortedModels.length === 0 ? (
                <div className="p-12 text-center">
                  <Database className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg mb-2 dark:text-white">未找到模型</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    尝试调整搜索条件或筛选器
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-900">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400">模型</th>
                        <th className="px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400">类型</th>
                        <th className="px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400">状态</th>
                        <th className="px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400">性能</th>
                        <th className="px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400">调用/成本</th>
                        <th className="px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400">操作</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {currentModels.map((model) => {
                      const Icon = model.icon;
                      return (
                        <tr key={model.id} className="hover:bg-gray-50 dark:hover:bg-gray-900">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className={`${model.iconBg} w-10 h-10 rounded-lg flex items-center justify-center`}>
                                <Icon className={`w-5 h-5 ${model.iconColor}`} />
                              </div>
                              <div>
                                <div className="dark:text-white">{model.name}</div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">{model.provider} · {model.version}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{model.type}</td>
                          <td className="px-6 py-4">
                            <Badge className={`text-xs ${model.statusColor} border-0`}>
                              {model.status}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                            <div>{model.performance.latency}</div>
                            <div className="text-xs">{model.performance.accuracy}</div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                            <div>{model.calls}</div>
                            <div className="text-xs dark:text-white">{model.cost}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <button 
                                onClick={() => handleToggleStatus(model)}
                                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                                disabled={model.status === '部署中'}
                              >
                                {model.status === '运行中' ? (
                                  <Pause className="w-4 h-4 text-orange-500" />
                                ) : (
                                  <Play className="w-4 h-4 text-green-500" />
                                )}
                              </button>
                              <button 
                                onClick={() => handleViewDetails(model)}
                                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                              >
                                <Eye className="w-4 h-4 text-blue-500" />
                              </button>
                              <button 
                                onClick={() => handleOpenEdit(model)}
                                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                              >
                                <Edit className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                              </button>
                              <button 
                                onClick={() => handleDeleteModel(model)}
                                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                              >
                                <Trash2 className="w-4 h-4 text-red-500" />
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

              {/* Table View Pagination */}
              {shouldShowPagination && filteredAndSortedModels.length > 0 && (
                <div className="flex items-center justify-center px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                          className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                        >
                          上一页
                        </PaginationPrevious>
                      </PaginationItem>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <PaginationItem key={page}>
                          <PaginationLink
                            onClick={() => setCurrentPage(page)}
                            isActive={currentPage === page}
                            className="cursor-pointer"
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      <PaginationItem>
                        <PaginationNext 
                          onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                          className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                        >
                          下一页
                        </PaginationNext>
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </Card>
          )}
        </TabsContent>

        <TabsContent value="running" className="mt-0">
          <Card className="p-8 text-center dark:bg-gray-800 dark:border-gray-700">
            <Activity className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg mb-2 dark:text-white">运行中的模型</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              当前有 16 个模型正在运行
            </p>
          </Card>
        </TabsContent>

        <TabsContent value="language" className="mt-0">
          <Card className="p-8 text-center dark:bg-gray-800 dark:border-gray-700">
            <Brain className="w-12 h-12 text-blue-500 mx-auto mb-4" />
            <h3 className="text-lg mb-2 dark:text-white">语言模型</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              查看所有语言理解和生成模型
            </p>
          </Card>
        </TabsContent>

        <TabsContent value="image" className="mt-0">
          <Card className="p-8 text-center dark:bg-gray-800 dark:border-gray-700">
            <ImageIcon className="w-12 h-12 text-pink-500 mx-auto mb-4" />
            <h3 className="text-lg mb-2 dark:text-white">图像模型</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              查看所有图像生成和处理模型
            </p>
          </Card>
        </TabsContent>

        <TabsContent value="video" className="mt-0">
          <Card className="p-8 text-center dark:bg-gray-800 dark:border-gray-700">
            <Video className="w-12 h-12 text-violet-500 mx-auto mb-4" />
            <h3 className="text-lg mb-2 dark:text-white">视频模型</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              查看所有视频生成和处理模型
            </p>
          </Card>
        </TabsContent>
      </Tabs>

      {/* 查看详情对话框 */}
      <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
        <DialogContent className="dark:bg-gray-800 dark:border-gray-700 sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="dark:text-white">模型详情</DialogTitle>
            <DialogDescription className="dark:text-gray-400">
              查看模型的详细信息和性能指标
            </DialogDescription>
          </DialogHeader>

          {selectedModel && (
            <div className="space-y-6 py-4">
              {/* 基本信息 */}
              <div className="flex items-start gap-4">
                <div className={`${selectedModel.iconBg} w-16 h-16 rounded-lg flex items-center justify-center flex-shrink-0`}>
                  {selectedModel.icon && <selectedModel.icon className={`w-8 h-8 ${selectedModel.iconColor}`} />}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl mb-1 dark:text-white">{selectedModel.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {selectedModel.description}
                  </p>
                  <Badge className={`text-xs ${selectedModel.statusColor} border-0`}>
                    {selectedModel.status}
                  </Badge>
                </div>
              </div>

              {/* 模型信息 */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="text-xs text-gray-500 dark:text-gray-400">提供商</div>
                  <div className="dark:text-white">{selectedModel.provider}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-xs text-gray-500 dark:text-gray-400">版本</div>
                  <div className="dark:text-white">{selectedModel.version}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-xs text-gray-500 dark:text-gray-400">类型</div>
                  <div className="dark:text-white">{selectedModel.type}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-xs text-gray-500 dark:text-gray-400">部署时间</div>
                  <div className="dark:text-white">{selectedModel.deployed}</div>
                </div>
              </div>

              {/* 性能指标 */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <h4 className="text-sm mb-3 dark:text-white">性能指标</h4>
                <div className="grid grid-cols-3 gap-4">
                  <Card className="p-4 dark:bg-gray-900 dark:border-gray-700">
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">延迟</div>
                    <div className="text-lg dark:text-white">{selectedModel.performance.latency}</div>
                  </Card>
                  <Card className="p-4 dark:bg-gray-900 dark:border-gray-700">
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">吞吐量</div>
                    <div className="text-lg dark:text-white">{selectedModel.performance.throughput}</div>
                  </Card>
                  <Card className="p-4 dark:bg-gray-900 dark:border-gray-700">
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">准确率</div>
                    <div className="text-lg dark:text-white">{selectedModel.performance.accuracy}</div>
                  </Card>
                </div>
              </div>

              {/* 使用统计 */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <h4 className="text-sm mb-3 dark:text-white">使用统计</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <div className="text-xs text-gray-500 dark:text-gray-400">累计调用次数</div>
                    <div className="text-xl dark:text-white">{selectedModel.calls}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs text-gray-500 dark:text-gray-400">累计成本</div>
                    <div className="text-xl dark:text-white">{selectedModel.cost}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs text-gray-500 dark:text-gray-400">累计使用Tokens</div>
                    <div className="text-xl dark:text-white">{selectedModel.tokens || '2.5M'}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDetailsDialogOpen(false)}
              className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
            >
              关闭
            </Button>
            <Button
              onClick={() => {
                setDetailsDialogOpen(false);
                selectedModel && handleOpenEdit(selectedModel);
              }}
              className="bg-blue-500 hover:bg-blue-600"
            >
              编辑配置
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 编辑配置对话框 */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="dark:bg-gray-800 dark:border-gray-700 sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="dark:text-white">编辑模型配置</DialogTitle>
            <DialogDescription className="dark:text-gray-400">
              修改模型的配置信息
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* 基本信息 */}
            <div className="space-y-3">
              <h3 className="text-sm dark:text-white flex items-center gap-2">
                <Info className="w-4 h-4 text-blue-500" />
                基本信息
              </h3>
              
              <div className="space-y-2">
                <Label htmlFor="edit-model-name" className="dark:text-gray-300">
                  模型名称 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="edit-model-name"
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  className="dark:bg-gray-700 dark:border-gray-600"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-model-description" className="dark:text-gray-300">
                  描述
                </Label>
                <Textarea
                  id="edit-model-description"
                  value={editFormData.description}
                  onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                  className="dark:bg-gray-700 dark:border-gray-600 min-h-[80px]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="edit-model-provider" className="dark:text-gray-300">
                    提供商 <span className="text-red-500">*</span>
                  </Label>
                  <Select value={editFormData.provider} onValueChange={(value) => setEditFormData({ ...editFormData, provider: value })}>
                    <SelectTrigger id="edit-model-provider" className="dark:bg-gray-700 dark:border-gray-600">
                      <SelectValue placeholder="选择提供商" />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-gray-800 dark:border-gray-700 max-h-[300px]">
                      {providerOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value} className="dark:text-gray-300">
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-model-version" className="dark:text-gray-300">
                    版本 <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="edit-model-version"
                    value={editFormData.version}
                    onChange={(e) => setEditFormData({ ...editFormData, version: e.target.value })}
                    className="dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>
              </div>
            </div>

            {/* API配置 */}
            <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-sm dark:text-white flex items-center gap-2">
                <Settings className="w-4 h-4 text-green-500" />
                API配置
              </h3>
              
              <div className="space-y-2">
                <Label htmlFor="edit-model-endpoint" className="dark:text-gray-300">
                  API端点
                </Label>
                <Input
                  id="edit-model-endpoint"
                  placeholder="https://api.example.com/v1"
                  value={editFormData.endpoint}
                  onChange={(e) => setEditFormData({ ...editFormData, endpoint: e.target.value })}
                  className="dark:bg-gray-700 dark:border-gray-600"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-model-apikey" className="dark:text-gray-300">
                  API密钥
                </Label>
                <Input
                  id="edit-model-apikey"
                  type="password"
                  placeholder="留空则不修改"
                  value={editFormData.apiKey}
                  onChange={(e) => setEditFormData({ ...editFormData, apiKey: e.target.value })}
                  className="dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
            </div>

            {/* 模型参数 */}
            <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-sm dark:text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-purple-500" />
                模型参数
              </h3>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="edit-model-maxTokens" className="dark:text-gray-300">
                    最大Tokens
                  </Label>
                  <Input
                    id="edit-model-maxTokens"
                    type="number"
                    placeholder="4096"
                    value={editFormData.maxTokens}
                    onChange={(e) => setEditFormData({ ...editFormData, maxTokens: e.target.value })}
                    className="dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-model-temperature" className="dark:text-gray-300">
                    Temperature
                  </Label>
                  <Input
                    id="edit-model-temperature"
                    type="number"
                    step="0.1"
                    min="0"
                    max="2"
                    value={editFormData.temperature}
                    onChange={(e) => setEditFormData({ ...editFormData, temperature: e.target.value })}
                    className="dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditDialogOpen(false)}
              className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
            >
              取消
            </Button>
            <Button
              onClick={handleSaveEdit}
              className="bg-blue-500 hover:bg-blue-600"
            >
              保存修改
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
