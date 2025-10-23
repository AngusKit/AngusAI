import { useState, useEffect } from 'react';
import { useLanguage } from '../layout/LanguageProvider';
import {
  Package,
  Search,
  Filter,
  Download,
  Star,
  TrendingUp,
  Clock,
  Grid3x3,
  List,
  Eye,
  CheckCircle,
  ChevronRight,
  Zap,
  Shield,
  Code,
  Palette,
  MessageSquare,
  FileText,
  BarChart3,
  Image as ImageIcon,
  Music,
  Video,
  Upload,
  Edit,
  X,
  User,
  Calendar,
  ThumbsUp,
  ThumbsDown,
  Plus,
  Minus,
  Activity,
  AlertCircle,
  AlertTriangle,
  FileCode2,
  Archive,
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Separator } from '../ui/separator';
import { Switch } from '../ui/switch';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '../ui/pagination';
import { toast } from 'sonner';

interface Plugin {
  id: number;
  name: string;
  description: string;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  category: string;
  version: string;
  downloads: string;
  rating: number;
  reviews: number;
  price: string;
  installed: boolean;
  enabled: boolean;
  author: string;
  tags: string[];
  fullDescription?: string;
  features?: string[];
  changelog?: string;
  uploadDate?: string;
  pluginFiles?: {
    executable: string;
    yaml: string;
  };
  healthStatus?: {
    status: 'healthy' | 'warning' | 'error';
    lastCheck: string;
    message: string;
  };
  apiStats?: {
    totalCalls: number;
    successRate: number;
    avgResponseTime: number;
    last24Hours: number;
  };
}

interface Review {
  id: number;
  user: string;
  avatar: string;
  rating: number;
  date: string;
  content: string;
  helpful: number;
}

export function PluginMarket() {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedPlugin, setSelectedPlugin] = useState<Plugin | null>(null);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingPlugin, setEditingPlugin] = useState<Plugin | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [userReviewText, setUserReviewText] = useState('');
  const [userHasReviewed, setUserHasReviewed] = useState(false);
  const [userReview, setUserReview] = useState<{
    rating: number;
    content: string;
  } | null>(null);
  const itemsPerPage = 6;

  // 表单状态
  const [formTags, setFormTags] = useState<string[]>([]);
  const [formFeatures, setFormFeatures] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [newFeature, setNewFeature] = useState('');
  const [pluginFileName, setPluginFileName] = useState('');
  const [pluginFileError, setPluginFileError] = useState('');

  // 当搜索、过滤或排序改变时重置页码
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, categoryFilter, sortBy]);

  // 统计数据
  const stats = [
    {
      label: '可用插件',
      value: '256',
      subtext: '较上月新增 12个',
      icon: Package,
      iconBg: 'bg-blue-500',
      trend: '+5%',
      trendUp: true,
    },
    {
      label: '已安装',
      value: '18',
      subtext: '累计安装 256 次',
      icon: CheckCircle,
      iconBg: 'bg-green-500',
      trend: '+3',
      trendUp: true,
    },
    {
      label: '本月下载',
      value: '3,248',
      subtext: '累计下载 52,301 次',
      icon: Download,
      iconBg: 'bg-orange-500',
      trend: '+18%',
      trendUp: true,
    },
    {
      label: '平均评分',
      value: '4.7',
      subtext: '基于 1,024 条评价',
      icon: Star,
      iconBg: 'bg-purple-500',
      trend: '+0.2',
      trendUp: true,
    },
  ];

  // 插件列表
  const [plugins, setPlugins] = useState<Plugin[]>([
    {
      id: 1,
      name: '智能客服助手',
      description: '基于AI的智能客服解决方案，支持多轮对话和情感分析',
      icon: MessageSquare,
      iconBg: 'bg-blue-50 dark:bg-blue-900/20',
      iconColor: 'text-blue-500',
      category: '客户服务',
      version: 'v2.1.0',
      downloads: '15.2K',
      rating: 4.8,
      reviews: 342,
      price: '¥299/月',
      installed: true,
      enabled: true,
      author: 'AngusAI Team',
      tags: ['AI', '客服', '自动化'],
      fullDescription:
        '智能客服助手是一款基于先进AI技术的客服解决方案，能够自动处理客户咨询、提供24/7全天候服务，并通过情感分析提供个性化响应。',
      features: [
        '多轮对话支持',
        '情感分析',
        '自动学习',
        '多渠道接入',
        '实时监控',
      ],
      changelog: '2.1.0: 新增情感分析功能\n2.0.0: 重构对话引擎',
      uploadDate: '2024-01-15',
    },
    {
      id: 2,
      name: '数据可视化工具',
      description: '强大的数据可视化插件，支持多种图表类型和实时数据更新',
      icon: BarChart3,
      iconBg: 'bg-green-50 dark:bg-green-900/20',
      iconColor: 'text-green-500',
      category: '数据分析',
      version: 'v3.0.2',
      downloads: '22.8K',
      rating: 4.9,
      reviews: 487,
      price: '免费',
      installed: true,
      enabled: false,
      author: 'DataViz Inc',
      tags: ['数据', '可视化', '图表'],
      fullDescription:
        '提供丰富的数据可视化组件，支持柱状图、折线图、饼图等多种图表类型，实时数据更新，交互式探索。',
      features: ['20+图表类型', '实时数据', '交互式', '导出功能', '主题定制'],
      uploadDate: '2024-01-10',
      pluginFiles: {
        executable: 'dataviz-tool-v3.0.2.tar.gz',
        yaml: 'manifest.yaml',
      },
      healthStatus: {
        status: 'healthy',
        lastCheck: '2024-01-28 14:25',
        message: '运行稳定',
      },
      apiStats: {
        totalCalls: 22800,
        successRate: 99.5,
        avgResponseTime: 98,
        last24Hours: 487,
      },
    },
    {
      id: 3,
      name: '安全扫描器',
      description: '自动检测应用安全漏洞，提供修复建议和安全报告',
      icon: Shield,
      iconBg: 'bg-red-50 dark:bg-red-900/20',
      iconColor: 'text-red-500',
      category: '安全工具',
      version: 'v1.5.1',
      downloads: '8.6K',
      rating: 4.6,
      reviews: 215,
      price: '¥199/月',
      installed: false,
      enabled: false,
      author: 'SecureApp',
      tags: ['安全', '扫描', '检测'],
      fullDescription:
        '全面的安全扫描工具，能够检测常见的安全漏洞，提供详细的安全报告和修复建议。',
      features: ['漏洞检测', '安全报告', '修复建议', '定期扫描', '合规检查'],
      uploadDate: '2024-01-18',
      pluginFiles: {
        executable: 'security-scanner-v1.5.1.zip',
        yaml: 'config.yaml',
      },
      healthStatus: {
        status: 'warning',
        lastCheck: '2024-01-28 14:20',
        message: '检测到轻微延迟，建议升级',
      },
      apiStats: {
        totalCalls: 8600,
        successRate: 98.2,
        avgResponseTime: 215,
        last24Hours: 156,
      },
    },
    {
      id: 4,
      name: '代码生成器',
      description: 'AI驱动的代码生成工具，支持多种编程语言',
      icon: Code,
      iconBg: 'bg-purple-50 dark:bg-purple-900/20',
      iconColor: 'text-purple-500',
      category: '开发工具',
      version: 'v1.8.3',
      downloads: '12.4K',
      rating: 4.5,
      reviews: 189,
      price: '¥149/月',
      installed: false,
      enabled: false,
      author: 'CodeGen Team',
      tags: ['代码', '开发', 'AI'],
      fullDescription:
        'AI驱动的智能代码生成工具，支持Python、JavaScript、Java等多种语言，提高开发效率。',
      features: [
        '多语言支持',
        'AI辅助',
        '代码优化',
        '单元测试生成',
        '文档生成',
      ],
      uploadDate: '2024-01-20',
    },
    {
      id: 5,
      name: '图像处理专家',
      description: 'AI驱动的图像编辑和优化工具',
      icon: ImageIcon,
      iconBg: 'bg-pink-50 dark:bg-pink-900/20',
      iconColor: 'text-pink-500',
      category: '图像处理',
      version: 'v2.3.0',
      downloads: '9.1K',
      rating: 4.7,
      reviews: 298,
      price: '¥79/月',
      installed: false,
      enabled: false,
      author: 'ImageAI',
      tags: ['图像', 'AI', '设计'],
      fullDescription:
        'AI驱动的图像处理工具，支��智能抠图、风格迁移、图像增强等功能。',
      features: ['智能抠图', '风格迁移', '图像增强', '批量处理', '格式转换'],
      uploadDate: '2024-01-22',
    },
    {
      id: 6,
      name: '文档智能分析',
      description: '自动提取和分析文档内容，生成摘要和洞察',
      icon: FileText,
      iconBg: 'bg-indigo-50 dark:bg-indigo-900/20',
      iconColor: 'text-indigo-500',
      category: 'AI工具',
      version: 'v1.9.0',
      downloads: '7.4K',
      rating: 4.6,
      reviews: 156,
      price: '免费',
      installed: true,
      enabled: false,
      author: 'DocAI',
      tags: ['文档', 'AI', '分析'],
      fullDescription:
        '智能文档分析工具，自动提取关键信息，生成摘要，提供数据洞察。',
      features: ['智能提取', '自动摘要', '多格式支持', 'OCR识别', '数据导出'],
      uploadDate: '2024-01-12',
    },
    {
      id: 7,
      name: '语音转文字',
      description: '高精度语音识别，支持多语言实时转录',
      icon: Music,
      iconBg: 'bg-teal-50 dark:bg-teal-900/20',
      iconColor: 'text-teal-500',
      category: 'AI工具',
      version: 'v2.0.5',
      downloads: '18.3K',
      rating: 4.8,
      reviews: 421,
      price: '¥129/月',
      installed: false,
      enabled: false,
      author: 'SpeechTech',
      tags: ['语音', 'AI', '转录'],
      fullDescription: '高精度语音识别服务，支持30+语言，实时转录，自动标点。',
      features: ['高精度识别', '多语言', '实时转录', '说话人分离', '自动标点'],
      uploadDate: '2024-01-08',
    },
    {
      id: 8,
      name: '视频剪辑助手',
      description: 'AI辅助视频剪辑，自动识别精彩片段',
      icon: Video,
      iconBg: 'bg-orange-50 dark:bg-orange-900/20',
      iconColor: 'text-orange-500',
      category: '图像处理',
      version: 'v1.6.2',
      downloads: '11.7K',
      rating: 4.7,
      reviews: 267,
      price: '¥189/月',
      installed: false,
      enabled: false,
      author: 'VideoAI',
      tags: ['视频', 'AI', '剪辑'],
      fullDescription:
        'AI驱动的视频剪辑工具，自动识别精彩片段，智能配乐，一键生成短视频。',
      features: ['智能剪辑', '自动配乐', '字幕生成', '特效添加', '批量处理'],
      uploadDate: '2024-01-25',
    },
  ]);

  // 评论数据
  const reviews: Review[] = selectedPlugin
    ? [
        {
          id: 1,
          user: '张三',
          avatar: '👨',
          rating: 5,
          date: '2024-01-20',
          content: '非常好用的插件，功能强大，界面友好，强烈推荐！',
          helpful: 24,
        },
        {
          id: 2,
          user: '李四',
          avatar: '👩',
          rating: 4,
          date: '2024-01-18',
          content: '整体不错，但是在某些场景下性能有待优化。',
          helpful: 12,
        },
        {
          id: 3,
          user: '王五',
          avatar: '🧑',
          rating: 5,
          date: '2024-01-15',
          content: '解决了我们团队的痛点问题，客服响应也很及时。',
          helpful: 18,
        },
      ]
    : [];

  const categories = [
    { value: 'all', label: '全部分类' },
    { value: 'ai', label: 'AI工具' },
    { value: 'data', label: '数据分析' },
    { value: 'service', label: '客户服务' },
    { value: 'dev', label: '开发工具' },
    { value: 'image', label: '图像处理' },
    { value: 'security', label: '安全工具' },
  ];

  const handleInstall = (plugin: Plugin) => {
    setPlugins(
      plugins.map(p =>
        p.id === plugin.id
          ? { ...p, installed: !p.installed, enabled: !p.installed }
          : p
      )
    );

    if (plugin.installed) {
      toast.success(`已卸载 ${plugin.name}`);
    } else {
      toast.success(`正在安装 ${plugin.name}...`);
    }
  };

  const handleToggleEnabled = (plugin: Plugin) => {
    setPlugins(
      plugins.map(p => (p.id === plugin.id ? { ...p, enabled: !p.enabled } : p))
    );

    toast.success(`${plugin.name} 已${plugin.enabled ? '禁用' : '启用'}`);
  };

  const validatePluginFile = (fileName: string): boolean => {
    const allowedExtensions = ['.zip', '.tar.gz', '.tgz', '.tar'];
    const hasValidExtension = allowedExtensions.some(ext =>
      fileName.toLowerCase().endsWith(ext)
    );

    if (!hasValidExtension) {
      setPluginFileError(
        `不支持的文件格式。支持的格式：${allowedExtensions.join(', ')}`
      );
      return false;
    }

    setPluginFileError('');
    return true;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (validatePluginFile(file.name)) {
        setPluginFileName(file.name);
      } else {
        e.target.value = '';
        setPluginFileName('');
      }
    }
  };

  const handleUploadPlugin = () => {
    const nameInput = document.getElementById(
      'plugin-name'
    ) as HTMLInputElement;

    if (!nameInput?.value?.trim()) {
      toast.error('请输入插件名称');
      return;
    }

    if (!pluginFileName) {
      toast.error('请上传插件文件');
      return;
    }

    toast.success('插件上传成功！');
    setUploadDialogOpen(false);
    setFormTags([]);
    setFormFeatures([]);
    setPluginFileName('');
    setPluginFileError('');
  };

  const handleEditPlugin = () => {
    const nameInput = document.getElementById('edit-name') as HTMLInputElement;

    if (!nameInput?.value?.trim()) {
      toast.error('请输入插件名称');
      return;
    }

    toast.success('插件更新成功！');
    setEditDialogOpen(false);
    setEditingPlugin(null);
    setFormTags([]);
    setFormFeatures([]);
    setPluginFileName('');
    setPluginFileError('');
  };

  const handleViewDetails = (plugin: Plugin) => {
    setSelectedPlugin(plugin);
    setUserRating(0);
    setUserReviewText('');
    // 检查是否已经评价过
    // 这里可以根据实际情况从后端获取，现在模拟一个已评价的状态
    setUserHasReviewed(false);
    setUserReview(null);
  };

  const handleOpenEdit = (plugin: Plugin) => {
    setEditingPlugin(plugin);
    setFormTags(plugin.tags || []);
    setFormFeatures(plugin.features || []);
    setEditDialogOpen(true);
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formTags.includes(newTag.trim())) {
      setFormTags([...formTags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormTags(formTags.filter(t => t !== tag));
  };

  const handleAddFeature = () => {
    if (newFeature.trim() && !formFeatures.includes(newFeature.trim())) {
      setFormFeatures([...formFeatures, newFeature.trim()]);
      setNewFeature('');
    }
  };

  const handleRemoveFeature = (feature: string) => {
    setFormFeatures(formFeatures.filter(f => f !== feature));
  };

  const handleSubmitRating = () => {
    if (userRating > 0 && userReviewText.trim()) {
      toast.success(`感谢您的 ${userRating} 星评价！`);
      // 保存用户评价
      setUserReview({
        rating: userRating,
        content: userReviewText.trim(),
      });
      setUserHasReviewed(true);
      setUserRating(0);
      setUserReviewText('');
    } else if (userRating === 0) {
      toast.error('请先选择评分');
    } else if (!userReviewText.trim()) {
      toast.error('请填写评价内容');
    }
  };

  const handleEditReview = () => {
    if (userReview) {
      setUserRating(userReview.rating);
      setUserReviewText(userReview.content);
      setUserHasReviewed(false);
    }
  };

  const getFilteredPlugins = (tab: string) => {
    let filtered = plugins;

    // Tab过滤
    if (tab === 'installed') {
      filtered = plugins.filter(p => p.installed);
    } else if (tab === 'popular') {
      filtered = [...plugins].sort((a, b) => b.rating - a.rating);
    } else if (tab === 'new') {
      filtered = [...plugins].sort(
        (a, b) =>
          new Date(b.uploadDate || '').getTime() -
          new Date(a.uploadDate || '').getTime()
      );
    }

    // 搜索过滤
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        p =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.author.toLowerCase().includes(query) ||
          p.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // 分类过滤
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(p => p.category === categoryFilter);
    }

    // 排序
    if (sortBy === 'popular') {
      filtered = [...filtered].sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'newest') {
      filtered = [...filtered].sort(
        (a, b) =>
          new Date(b.uploadDate || '').getTime() -
          new Date(a.uploadDate || '').getTime()
      );
    } else if (sortBy === 'rating') {
      filtered = [...filtered].sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'downloads') {
      filtered = [...filtered].sort((a, b) => {
        const aDownloads = parseInt(a.downloads.replace(/[^0-9]/g, ''));
        const bDownloads = parseInt(b.downloads.replace(/[^0-9]/g, ''));
        return bDownloads - aDownloads;
      });
    }

    return filtered;
  };

  const getPaginatedPlugins = (pluginList: Plugin[]) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return pluginList.slice(startIndex, endIndex);
  };

  const getTotalPages = (pluginList: Plugin[]) => {
    return Math.ceil(pluginList.length / itemsPerPage);
  };

  const renderPluginCard = (plugin: Plugin) => {
    const Icon = plugin.icon;
    return (
      <Card
        key={plugin.id}
        className={`p-4 dark:bg-gray-800 dark:border-gray-700 hover:shadow-lg transition-shadow cursor-pointer ${
          selectedPlugin?.id === plugin.id ? 'ring-2 ring-blue-500' : ''
        }`}
        onClick={() => handleViewDetails(plugin)}
      >
        <div className='flex items-start gap-3 mb-3'>
          <div
            className={`${plugin.iconBg} w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0`}
          >
            <Icon className={`w-6 h-6 ${plugin.iconColor}`} />
          </div>
          <div className='flex-1 min-w-0'>
            <div className='flex items-center justify-between gap-2 mb-0.5'>
              <div className='flex items-center gap-2 min-w-0 flex-1'>
                <h3 className='dark:text-white truncate'>{plugin.name}</h3>
                {plugin.installed && (
                  <Badge
                    className={`${plugin.enabled ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400'} border-0 text-xs whitespace-nowrap`}
                  >
                    {plugin.enabled ? '已启用' : '已禁用'}
                  </Badge>
                )}
              </div>
              {plugin.installed && (
                <Badge className='bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-0 text-xs whitespace-nowrap'>
                  已安装
                </Badge>
              )}
            </div>
            <p className='text-xs text-gray-500 dark:text-gray-400'>
              by {plugin.author}
            </p>
          </div>
        </div>

        <p className='text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2'>
          {plugin.description}
        </p>

        <div className='flex flex-wrap gap-1 mb-3'>
          {plugin.tags.map(tag => (
            <Badge
              key={tag}
              variant='secondary'
              className='text-xs dark:bg-gray-700 dark:text-gray-300'
            >
              {tag}
            </Badge>
          ))}
        </div>

        <div className='flex items-center justify-between mb-3 text-xs text-gray-500 dark:text-gray-400'>
          <div className='flex items-center gap-1'>
            <Star className='w-3 h-3 fill-yellow-400 text-yellow-400' />
            <span>{plugin.rating}</span>
            <span>({plugin.reviews})</span>
          </div>
          <div className='flex items-center gap-1'>
            <Download className='w-3 h-3' />
            <span>{plugin.downloads}</span>
          </div>
          <span>{plugin.version}</span>
        </div>

        <div className='flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700'>
          <span className='text-sm font-semibold text-gray-900 dark:text-white'>
            {plugin.price}
          </span>
          <div className='flex items-center gap-2'>
            <Button
              size='sm'
              variant={plugin.installed ? 'outline' : 'default'}
              onClick={e => {
                e.stopPropagation();
                handleInstall(plugin);
              }}
              className={
                plugin.installed
                  ? 'dark:bg-gray-700 dark:border-gray-600'
                  : 'bg-blue-500 hover:bg-blue-600'
              }
            >
              {plugin.installed ? '卸载' : '安装'}
            </Button>
            {plugin.installed && (
              <Button
                size='sm'
                variant='ghost'
                onClick={e => {
                  e.stopPropagation();
                  handleOpenEdit(plugin);
                }}
              >
                <Edit className='w-4 h-4' />
              </Button>
            )}
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div>
        <h1 className='text-2xl mb-1 dark:text-white'>插件市场</h1>
        <p className='text-sm text-gray-600 dark:text-gray-400'>
          发现和安装强大的插件，扩展应用功能
        </p>
      </div>

      {/* Stats Cards */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
        {stats.map(stat => {
          const Icon = stat.icon;
          return (
            <Card
              key={stat.label}
              className='px-5 pt-5 pb-3 dark:bg-gray-800 dark:border-gray-700'
            >
              <div className='flex items-start justify-between mb-1.5'>
                <div
                  className={`${stat.iconBg} w-10 h-10 rounded-lg flex items-center justify-center`}
                >
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
              <div className='text-base font-semibold text-gray-600 dark:text-gray-400 mb-0.5'>
                {stat.label}
              </div>
              <div className='text-3xl dark:text-white mb-0.5'>
                {stat.value}
              </div>
              <div className='text-xs text-gray-500 dark:text-gray-400 text-right'>
                {stat.subtext}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Tabs */}
      <Tabs
        defaultValue='all'
        className='w-full'
        onValueChange={() => setCurrentPage(1)}
      >
        <TabsList className='dark:bg-gray-800'>
          <TabsTrigger value='all'>全部插件</TabsTrigger>
          <TabsTrigger value='installed'>已安装</TabsTrigger>
          <TabsTrigger value='popular'>热门推荐</TabsTrigger>
          <TabsTrigger value='new'>最新上架</TabsTrigger>
        </TabsList>

        <TabsContent value='all' className='space-y-4 mt-0'>
          {/* Search and Filter Bar */}
          <div className='flex items-center justify-between gap-3'>
            {/* Search Bar */}
            <div className='relative w-[390px]'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400' />
              <Input
                placeholder='搜索插件...'
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className='pl-9 dark:bg-gray-800 dark:border-gray-700'
              />
            </div>

            {/* Right Side Filters */}
            <div className='flex items-center gap-2'>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className='w-[140px] dark:bg-gray-800 dark:border-gray-700'>
                  <Filter className='w-4 h-4 mr-2' />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className='dark:bg-gray-800 dark:border-gray-700'>
                  {categories.map(cat => (
                    <SelectItem
                      key={cat.value}
                      value={cat.value}
                      className='dark:text-gray-300'
                    >
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className='w-[140px] dark:bg-gray-800 dark:border-gray-700'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className='dark:bg-gray-800 dark:border-gray-700'>
                  <SelectItem value='popular' className='dark:text-gray-300'>
                    最受欢迎
                  </SelectItem>
                  <SelectItem value='newest' className='dark:text-gray-300'>
                    最新上架
                  </SelectItem>
                  <SelectItem value='rating' className='dark:text-gray-300'>
                    评分最高
                  </SelectItem>
                  <SelectItem value='downloads' className='dark:text-gray-300'>
                    下载最多
                  </SelectItem>
                </SelectContent>
              </Select>

              {/* View Mode Toggle */}
              <div className='flex items-center border border-gray-300 dark:border-gray-700 rounded-lg'>
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

              {/* Upload Plugin Button */}
              <Dialog
                open={uploadDialogOpen}
                onOpenChange={open => {
                  setUploadDialogOpen(open);
                  if (!open) {
                    setFormTags([]);
                    setFormFeatures([]);
                    setPluginFileName('');
                    setPluginFileError('');
                  }
                }}
              >
                <DialogTrigger asChild>
                  <Button
                    variant='default'
                    size='sm'
                    className='bg-blue-500 hover:bg-blue-600'
                  >
                    <Upload className='w-4 h-4 mr-2' />
                    上传插件
                  </Button>
                </DialogTrigger>
                <DialogContent className='dark:bg-gray-800 dark:border-gray-700 sm:max-w-[1100px] max-h-[90vh] overflow-y-auto'>
                  <DialogHeader>
                    <DialogTitle className='dark:text-white'>
                      上传新插件
                    </DialogTitle>
                    <DialogDescription className='dark:text-gray-400'>
                      填写插件信息并上传文件。标记 * 为必填项。
                    </DialogDescription>
                  </DialogHeader>
                  <div className='space-y-4 py-4'>
                    <div className='space-y-2'>
                      <Label
                        htmlFor='plugin-name'
                        className='dark:text-gray-300'
                      >
                        插件名称 <span className='text-red-500'>*</span>
                      </Label>
                      <Input
                        id='plugin-name'
                        placeholder='输入插件名称'
                        className='dark:bg-gray-900 dark:border-gray-700'
                        required
                      />
                    </div>

                    <div className='space-y-2'>
                      <Label
                        htmlFor='plugin-file'
                        className='dark:text-gray-300'
                      >
                        插件文件 <span className='text-red-500'>*</span>
                      </Label>
                      <Input
                        id='plugin-file'
                        type='file'
                        accept='.zip,.tar.gz,.tgz,.tar'
                        onChange={handleFileChange}
                        className='dark:bg-gray-900 dark:border-gray-700'
                        required
                      />
                      {pluginFileError && (
                        <div className='flex items-center gap-2 text-sm text-red-500'>
                          <AlertCircle className='w-4 h-4' />
                          <span>{pluginFileError}</span>
                        </div>
                      )}
                      {pluginFileName && !pluginFileError && (
                        <div className='flex items-center gap-2 text-sm text-green-600 dark:text-green-400'>
                          <CheckCircle className='w-4 h-4' />
                          <span>已选择: {pluginFileName}</span>
                        </div>
                      )}
                      <p className='text-xs text-gray-500 dark:text-gray-400'>
                        支持格式：.zip, .tar.gz, .tgz, .tar
                      </p>
                    </div>
                    <div className='space-y-2'>
                      <Label
                        htmlFor='plugin-author'
                        className='dark:text-gray-300'
                      >
                        作者（可选）
                      </Label>
                      <Input
                        id='plugin-author'
                        placeholder='输入作者名称'
                        className='dark:bg-gray-900 dark:border-gray-700'
                      />
                    </div>
                    <div className='space-y-2'>
                      <Label
                        htmlFor='plugin-desc'
                        className='dark:text-gray-300'
                      >
                        简短描述（可选）
                      </Label>
                      <Textarea
                        id='plugin-desc'
                        placeholder='输入简短描述（将显示在卡片上）'
                        className='dark:bg-gray-900 dark:border-gray-700'
                        rows={2}
                      />
                    </div>
                    <div className='space-y-2'>
                      <Label
                        htmlFor='plugin-full-desc'
                        className='dark:text-gray-300'
                      >
                        完整描述（可选）
                      </Label>
                      <Textarea
                        id='plugin-full-desc'
                        placeholder='输入完整的插件介绍'
                        className='dark:bg-gray-900 dark:border-gray-700'
                        rows={4}
                      />
                    </div>
                    <div className='grid grid-cols-2 gap-4'>
                      <div className='space-y-2'>
                        <Label
                          htmlFor='plugin-category'
                          className='dark:text-gray-300'
                        >
                          分类（可选）
                        </Label>
                        <Select>
                          <SelectTrigger className='dark:bg-gray-900 dark:border-gray-700'>
                            <SelectValue placeholder='选择分类' />
                          </SelectTrigger>
                          <SelectContent className='dark:bg-gray-800 dark:border-gray-700'>
                            {categories
                              .filter(c => c.value !== 'all')
                              .map(cat => (
                                <SelectItem
                                  key={cat.value}
                                  value={cat.value}
                                  className='dark:text-gray-300'
                                >
                                  {cat.label}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className='space-y-2'>
                        <Label
                          htmlFor='plugin-version'
                          className='dark:text-gray-300'
                        >
                          版本号（可选）
                        </Label>
                        <Input
                          id='plugin-version'
                          placeholder='例如：v1.0.0'
                          className='dark:bg-gray-900 dark:border-gray-700'
                        />
                      </div>
                    </div>
                    <div className='space-y-2'>
                      <Label
                        htmlFor='plugin-price'
                        className='dark:text-gray-300'
                      >
                        价格（可选）
                      </Label>
                      <Input
                        id='plugin-price'
                        placeholder='例如：¥99/月 或 免费'
                        className='dark:bg-gray-900 dark:border-gray-700'
                      />
                    </div>

                    {/* Tags */}
                    <div className='space-y-2'>
                      <Label className='dark:text-gray-300'>标签（可选）</Label>
                      <div className='flex gap-2'>
                        <Input
                          placeholder='添加标签'
                          value={newTag}
                          onChange={e => setNewTag(e.target.value)}
                          onKeyPress={e =>
                            e.key === 'Enter' &&
                            (e.preventDefault(), handleAddTag())
                          }
                          className='dark:bg-gray-900 dark:border-gray-700'
                        />
                        <Button type='button' onClick={handleAddTag} size='sm'>
                          <Plus className='w-4 h-4' />
                        </Button>
                      </div>
                      <div className='flex flex-wrap gap-2 mt-2'>
                        {formTags.map(tag => (
                          <Badge
                            key={tag}
                            variant='secondary'
                            className='dark:bg-gray-700 dark:text-gray-300'
                          >
                            {tag}
                            <button
                              onClick={() => handleRemoveTag(tag)}
                              className='ml-1 hover:text-red-500'
                            >
                              <X className='w-3 h-3' />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Features */}
                    <div className='space-y-2'>
                      <Label className='dark:text-gray-300'>
                        主要功能（可选）
                      </Label>
                      <div className='flex gap-2'>
                        <Input
                          placeholder='添加功能'
                          value={newFeature}
                          onChange={e => setNewFeature(e.target.value)}
                          onKeyPress={e =>
                            e.key === 'Enter' &&
                            (e.preventDefault(), handleAddFeature())
                          }
                          className='dark:bg-gray-900 dark:border-gray-700'
                        />
                        <Button
                          type='button'
                          onClick={handleAddFeature}
                          size='sm'
                        >
                          <Plus className='w-4 h-4' />
                        </Button>
                      </div>
                      <ul className='space-y-1 mt-2'>
                        {formFeatures.map(feature => (
                          <li
                            key={feature}
                            className='flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900 p-2 rounded'
                          >
                            <div className='flex items-center gap-2'>
                              <CheckCircle className='w-4 h-4 text-green-500 flex-shrink-0' />
                              <span>{feature}</span>
                            </div>
                            <button
                              onClick={() => handleRemoveFeature(feature)}
                              className='hover:text-red-500'
                            >
                              <X className='w-4 h-4' />
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className='space-y-2'>
                      <Label
                        htmlFor='plugin-changelog'
                        className='dark:text-gray-300'
                      >
                        更新日志（可选）
                      </Label>
                      <Textarea
                        id='plugin-changelog'
                        placeholder='输入版本更新说明'
                        className='dark:bg-gray-900 dark:border-gray-700'
                        rows={3}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant='outline'
                      onClick={() => setUploadDialogOpen(false)}
                      className='dark:bg-gray-700 dark:border-gray-600'
                    >
                      取消
                    </Button>
                    <Button
                      onClick={handleUploadPlugin}
                      className='bg-blue-500 hover:bg-blue-600'
                    >
                      上传插件
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Grid View */}
          {viewMode === 'grid' && (
            <>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                {getPaginatedPlugins(getFilteredPlugins('all')).map(plugin =>
                  renderPluginCard(plugin)
                )}
              </div>

              {/* Pagination */}
              {getTotalPages(getFilteredPlugins('all')) > 1 && (
                <div className='flex items-center justify-center mt-4'>
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() =>
                            setCurrentPage(prev => Math.max(1, prev - 1))
                          }
                          className={
                            currentPage === 1
                              ? 'pointer-events-none opacity-50'
                              : 'cursor-pointer'
                          }
                        >
                          上一页
                        </PaginationPrevious>
                      </PaginationItem>
                      {Array.from(
                        { length: getTotalPages(getFilteredPlugins('all')) },
                        (_, i) => i + 1
                      ).map(page => (
                        <PaginationItem key={page}>
                          <PaginationLink
                            onClick={() => setCurrentPage(page)}
                            isActive={currentPage === page}
                            className='cursor-pointer'
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      <PaginationItem>
                        <PaginationNext
                          onClick={() =>
                            setCurrentPage(prev =>
                              Math.min(
                                getTotalPages(getFilteredPlugins('all')),
                                prev + 1
                              )
                            )
                          }
                          className={
                            currentPage ===
                            getTotalPages(getFilteredPlugins('all'))
                              ? 'pointer-events-none opacity-50'
                              : 'cursor-pointer'
                          }
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

          {/* List View */}
          {viewMode === 'list' && (
            <>
              <Card className='dark:bg-gray-800 dark:border-gray-700'>
                <div className='overflow-x-auto'>
                  <table className='w-full'>
                    <thead className='bg-gray-50 dark:bg-gray-900'>
                      <tr>
                        <th className='px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400'>
                          插件
                        </th>
                        <th className='px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400'>
                          分类
                        </th>
                        <th className='px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400'>
                          评分
                        </th>
                        <th className='px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400'>
                          下载量
                        </th>
                        <th className='px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400'>
                          价格
                        </th>
                        <th className='px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400'>
                          状态
                        </th>
                        <th className='px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400'>
                          操作
                        </th>
                      </tr>
                    </thead>
                    <tbody className='divide-y divide-gray-200 dark:divide-gray-700'>
                      {getPaginatedPlugins(getFilteredPlugins('all')).map(
                        plugin => {
                          const Icon = plugin.icon;
                          return (
                            <tr
                              key={plugin.id}
                              className={`hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer ${
                                selectedPlugin?.id === plugin.id
                                  ? 'bg-blue-50 dark:bg-blue-900/20'
                                  : ''
                              }`}
                              onClick={() => handleViewDetails(plugin)}
                            >
                              <td className='px-6 py-4'>
                                <div className='flex items-center gap-3'>
                                  <div
                                    className={`${plugin.iconBg} w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0`}
                                  >
                                    <Icon
                                      className={`w-5 h-5 ${plugin.iconColor}`}
                                    />
                                  </div>
                                  <div className='flex items-center gap-2'>
                                    <div>
                                      <div className='dark:text-white'>
                                        {plugin.name}
                                      </div>
                                      <div className='text-xs text-gray-500 dark:text-gray-400'>
                                        by {plugin.author}
                                      </div>
                                    </div>
                                    {plugin.installed && (
                                      <Badge className='bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-0 text-xs'>
                                        已安装
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              </td>
                              <td className='px-6 py-4'>
                                <Badge
                                  variant='secondary'
                                  className='dark:bg-gray-700 dark:text-gray-300'
                                >
                                  {plugin.category}
                                </Badge>
                              </td>
                              <td className='px-6 py-4'>
                                <div className='flex items-center gap-1 text-sm dark:text-gray-300'>
                                  <Star className='w-4 h-4 fill-yellow-400 text-yellow-400' />
                                  <span>{plugin.rating}</span>
                                  <span className='text-gray-400'>
                                    ({plugin.reviews})
                                  </span>
                                </div>
                              </td>
                              <td className='px-6 py-4 text-sm text-gray-600 dark:text-gray-400'>
                                {plugin.downloads}
                              </td>
                              <td className='px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white'>
                                {plugin.price}
                              </td>
                              <td className='px-6 py-4'>
                                <div className='flex items-center gap-2'>
                                  {plugin.installed && (
                                    <>
                                      <Switch
                                        checked={plugin.enabled}
                                        onCheckedChange={e => {
                                          e.stopPropagation();
                                          handleToggleEnabled(plugin);
                                        }}
                                        onClick={e => e.stopPropagation()}
                                      />
                                      <span className='text-xs text-gray-600 dark:text-gray-400'>
                                        {plugin.enabled ? '已启用' : '已禁用'}
                                      </span>
                                    </>
                                  )}
                                </div>
                              </td>
                              <td className='px-6 py-4'>
                                <div className='flex items-center gap-2'>
                                  <Button
                                    size='sm'
                                    variant={
                                      plugin.installed ? 'outline' : 'default'
                                    }
                                    onClick={e => {
                                      e.stopPropagation();
                                      handleInstall(plugin);
                                    }}
                                    className={
                                      plugin.installed
                                        ? 'dark:bg-gray-700 dark:border-gray-600'
                                        : 'bg-blue-500 hover:bg-blue-600'
                                    }
                                  >
                                    {plugin.installed ? '卸载' : '安装'}
                                  </Button>
                                  {plugin.installed && (
                                    <Button
                                      size='sm'
                                      variant='ghost'
                                      onClick={e => {
                                        e.stopPropagation();
                                        handleOpenEdit(plugin);
                                      }}
                                    >
                                      <Edit className='w-4 h-4' />
                                    </Button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        }
                      )}
                    </tbody>
                  </table>
                </div>
              </Card>

              {/* Pagination */}
              {getTotalPages(getFilteredPlugins('all')) > 1 && (
                <div className='flex items-center justify-center mt-4'>
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() =>
                            setCurrentPage(prev => Math.max(1, prev - 1))
                          }
                          className={
                            currentPage === 1
                              ? 'pointer-events-none opacity-50'
                              : 'cursor-pointer'
                          }
                        >
                          上一页
                        </PaginationPrevious>
                      </PaginationItem>
                      {Array.from(
                        { length: getTotalPages(getFilteredPlugins('all')) },
                        (_, i) => i + 1
                      ).map(page => (
                        <PaginationItem key={page}>
                          <PaginationLink
                            onClick={() => setCurrentPage(page)}
                            isActive={currentPage === page}
                            className='cursor-pointer'
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      <PaginationItem>
                        <PaginationNext
                          onClick={() =>
                            setCurrentPage(prev =>
                              Math.min(
                                getTotalPages(getFilteredPlugins('all')),
                                prev + 1
                              )
                            )
                          }
                          className={
                            currentPage ===
                            getTotalPages(getFilteredPlugins('all'))
                              ? 'pointer-events-none opacity-50'
                              : 'cursor-pointer'
                          }
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
        </TabsContent>

        <TabsContent value='installed' className='mt-0'>
          <div className='space-y-4'>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
              {getPaginatedPlugins(getFilteredPlugins('installed')).map(
                plugin => renderPluginCard(plugin)
              )}
            </div>

            {getTotalPages(getFilteredPlugins('installed')) > 1 && (
              <div className='flex items-center justify-center mt-4'>
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() =>
                          setCurrentPage(prev => Math.max(1, prev - 1))
                        }
                        className={
                          currentPage === 1
                            ? 'pointer-events-none opacity-50'
                            : 'cursor-pointer'
                        }
                      >
                        上一页
                      </PaginationPrevious>
                    </PaginationItem>
                    {Array.from(
                      {
                        length: getTotalPages(getFilteredPlugins('installed')),
                      },
                      (_, i) => i + 1
                    ).map(page => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={() => setCurrentPage(page)}
                          isActive={currentPage === page}
                          className='cursor-pointer'
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext
                        onClick={() =>
                          setCurrentPage(prev =>
                            Math.min(
                              getTotalPages(getFilteredPlugins('installed')),
                              prev + 1
                            )
                          )
                        }
                        className={
                          currentPage ===
                          getTotalPages(getFilteredPlugins('installed'))
                            ? 'pointer-events-none opacity-50'
                            : 'cursor-pointer'
                        }
                      >
                        下一页
                      </PaginationNext>
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value='popular' className='mt-0'>
          <div className='space-y-4'>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
              {getPaginatedPlugins(getFilteredPlugins('popular')).map(plugin =>
                renderPluginCard(plugin)
              )}
            </div>

            {getTotalPages(getFilteredPlugins('popular')) > 1 && (
              <div className='flex items-center justify-center mt-4'>
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() =>
                          setCurrentPage(prev => Math.max(1, prev - 1))
                        }
                        className={
                          currentPage === 1
                            ? 'pointer-events-none opacity-50'
                            : 'cursor-pointer'
                        }
                      >
                        上一页
                      </PaginationPrevious>
                    </PaginationItem>
                    {Array.from(
                      { length: getTotalPages(getFilteredPlugins('popular')) },
                      (_, i) => i + 1
                    ).map(page => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={() => setCurrentPage(page)}
                          isActive={currentPage === page}
                          className='cursor-pointer'
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext
                        onClick={() =>
                          setCurrentPage(prev =>
                            Math.min(
                              getTotalPages(getFilteredPlugins('popular')),
                              prev + 1
                            )
                          )
                        }
                        className={
                          currentPage ===
                          getTotalPages(getFilteredPlugins('popular'))
                            ? 'pointer-events-none opacity-50'
                            : 'cursor-pointer'
                        }
                      >
                        下一页
                      </PaginationNext>
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value='new' className='mt-0'>
          <div className='space-y-4'>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
              {getPaginatedPlugins(getFilteredPlugins('new')).map(plugin =>
                renderPluginCard(plugin)
              )}
            </div>

            {getTotalPages(getFilteredPlugins('new')) > 1 && (
              <div className='flex items-center justify-center mt-4'>
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() =>
                          setCurrentPage(prev => Math.max(1, prev - 1))
                        }
                        className={
                          currentPage === 1
                            ? 'pointer-events-none opacity-50'
                            : 'cursor-pointer'
                        }
                      >
                        上一页
                      </PaginationPrevious>
                    </PaginationItem>
                    {Array.from(
                      { length: getTotalPages(getFilteredPlugins('new')) },
                      (_, i) => i + 1
                    ).map(page => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={() => setCurrentPage(page)}
                          isActive={currentPage === page}
                          className='cursor-pointer'
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext
                        onClick={() =>
                          setCurrentPage(prev =>
                            Math.min(
                              getTotalPages(getFilteredPlugins('new')),
                              prev + 1
                            )
                          )
                        }
                        className={
                          currentPage ===
                          getTotalPages(getFilteredPlugins('new'))
                            ? 'pointer-events-none opacity-50'
                            : 'cursor-pointer'
                        }
                      >
                        下一页
                      </PaginationNext>
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Edit Dialog */}
      <Dialog
        open={editDialogOpen}
        onOpenChange={open => {
          setEditDialogOpen(open);
          if (!open) {
            setEditingPlugin(null);
            setFormTags([]);
            setFormFeatures([]);
          }
        }}
      >
        <DialogContent className='dark:bg-gray-800 dark:border-gray-700 sm:max-w-[1100px] max-h-[90vh] overflow-y-auto'>
          <DialogHeader>
            <DialogTitle className='dark:text-white'>编辑插件</DialogTitle>
            <DialogDescription className='dark:text-gray-400'>
              修改插件配置和设置。标记 * 为必填项。
            </DialogDescription>
          </DialogHeader>
          <div className='space-y-4 py-4'>
            <div className='space-y-2'>
              <Label htmlFor='edit-name' className='dark:text-gray-300'>
                插件名称 <span className='text-red-500'>*</span>
              </Label>
              <Input
                id='edit-name'
                defaultValue={editingPlugin?.name}
                className='dark:bg-gray-900 dark:border-gray-700'
                required
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='edit-plugin-file' className='dark:text-gray-300'>
                插件文件（可选，留空则不修改）
              </Label>
              <Input
                id='edit-plugin-file'
                type='file'
                accept='.zip,.tar.gz,.tgz,.tar'
                onChange={handleFileChange}
                className='dark:bg-gray-900 dark:border-gray-700'
              />
              {pluginFileError && (
                <div className='flex items-center gap-2 text-sm text-red-500'>
                  <AlertCircle className='w-4 h-4' />
                  <span>{pluginFileError}</span>
                </div>
              )}
              {pluginFileName && !pluginFileError && (
                <div className='flex items-center gap-2 text-sm text-green-600 dark:text-green-400'>
                  <CheckCircle className='w-4 h-4' />
                  <span>已选择新文件: {pluginFileName}</span>
                </div>
              )}
              {editingPlugin?.pluginFiles && !pluginFileName && (
                <div className='text-sm text-gray-500 dark:text-gray-400'>
                  当前文件: {editingPlugin.pluginFiles.executable}
                </div>
              )}
              <p className='text-xs text-gray-500 dark:text-gray-400'>
                支持格式：.zip, .tar.gz, .tgz, .tar
              </p>
            </div>
            <div className='space-y-2'>
              <Label htmlFor='edit-author' className='dark:text-gray-300'>
                作者
              </Label>
              <Input
                id='edit-author'
                defaultValue={editingPlugin?.author}
                className='dark:bg-gray-900 dark:border-gray-700'
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='edit-desc' className='dark:text-gray-300'>
                简短描述
              </Label>
              <Textarea
                id='edit-desc'
                defaultValue={editingPlugin?.description}
                className='dark:bg-gray-900 dark:border-gray-700'
                rows={2}
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='edit-full-desc' className='dark:text-gray-300'>
                完整描述
              </Label>
              <Textarea
                id='edit-full-desc'
                defaultValue={editingPlugin?.fullDescription}
                className='dark:bg-gray-900 dark:border-gray-700'
                rows={4}
              />
            </div>
            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='edit-version' className='dark:text-gray-300'>
                  版本号
                </Label>
                <Input
                  id='edit-version'
                  defaultValue={editingPlugin?.version}
                  className='dark:bg-gray-900 dark:border-gray-700'
                />
              </div>
              <div className='space-y-2'>
                <Label className='dark:text-gray-300'>状态</Label>
                <Select
                  defaultValue={editingPlugin?.enabled ? 'active' : 'inactive'}
                >
                  <SelectTrigger className='dark:bg-gray-900 dark:border-gray-700'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className='dark:bg-gray-800 dark:border-gray-700'>
                    <SelectItem value='active' className='dark:text-gray-300'>
                      启用
                    </SelectItem>
                    <SelectItem value='inactive' className='dark:text-gray-300'>
                      禁用
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='edit-category' className='dark:text-gray-300'>
                  分类
                </Label>
                <Select defaultValue={editingPlugin?.category}>
                  <SelectTrigger className='dark:bg-gray-900 dark:border-gray-700'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className='dark:bg-gray-800 dark:border-gray-700'>
                    {categories
                      .filter(c => c.value !== 'all')
                      .map(cat => (
                        <SelectItem
                          key={cat.value}
                          value={cat.label}
                          className='dark:text-gray-300'
                        >
                          {cat.label}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <div className='space-y-2'>
                <Label htmlFor='edit-price' className='dark:text-gray-300'>
                  价格
                </Label>
                <Input
                  id='edit-price'
                  defaultValue={editingPlugin?.price}
                  className='dark:bg-gray-900 dark:border-gray-700'
                />
              </div>
            </div>

            {/* Tags */}
            <div className='space-y-2'>
              <Label className='dark:text-gray-300'>标签</Label>
              <div className='flex gap-2'>
                <Input
                  placeholder='添加标签'
                  value={newTag}
                  onChange={e => setNewTag(e.target.value)}
                  onKeyPress={e =>
                    e.key === 'Enter' && (e.preventDefault(), handleAddTag())
                  }
                  className='dark:bg-gray-900 dark:border-gray-700'
                />
                <Button type='button' onClick={handleAddTag} size='sm'>
                  <Plus className='w-4 h-4' />
                </Button>
              </div>
              <div className='flex flex-wrap gap-2 mt-2'>
                {formTags.map(tag => (
                  <Badge
                    key={tag}
                    variant='secondary'
                    className='dark:bg-gray-700 dark:text-gray-300'
                  >
                    {tag}
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className='ml-1 hover:text-red-500'
                    >
                      <X className='w-3 h-3' />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            {/* Features */}
            <div className='space-y-2'>
              <Label className='dark:text-gray-300'>主要功能</Label>
              <div className='flex gap-2'>
                <Input
                  placeholder='添加功能'
                  value={newFeature}
                  onChange={e => setNewFeature(e.target.value)}
                  onKeyPress={e =>
                    e.key === 'Enter' &&
                    (e.preventDefault(), handleAddFeature())
                  }
                  className='dark:bg-gray-900 dark:border-gray-700'
                />
                <Button type='button' onClick={handleAddFeature} size='sm'>
                  <Plus className='w-4 h-4' />
                </Button>
              </div>
              <ul className='space-y-1 mt-2'>
                {formFeatures.map(feature => (
                  <li
                    key={feature}
                    className='flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900 p-2 rounded'
                  >
                    <div className='flex items-center gap-2'>
                      <CheckCircle className='w-4 h-4 text-green-500 flex-shrink-0' />
                      <span>{feature}</span>
                    </div>
                    <button
                      onClick={() => handleRemoveFeature(feature)}
                      className='hover:text-red-500'
                    >
                      <X className='w-4 h-4' />
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='edit-changelog' className='dark:text-gray-300'>
                更新日志
              </Label>
              <Textarea
                id='edit-changelog'
                defaultValue={editingPlugin?.changelog}
                className='dark:bg-gray-900 dark:border-gray-700'
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => setEditDialogOpen(false)}
              className='dark:bg-gray-700 dark:border-gray-600'
            >
              取消
            </Button>
            <Button
              onClick={handleEditPlugin}
              className='bg-blue-500 hover:bg-blue-600'
            >
              保存修改
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Plugin Details Section */}
      {selectedPlugin && (
        <Card className='dark:bg-gray-800 dark:border-gray-700 p-6'>
          <div className='flex items-start justify-between mb-4'>
            <div className='flex items-start gap-4'>
              <div
                className={`${selectedPlugin.iconBg} w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0`}
              >
                {(() => {
                  const Icon = selectedPlugin.icon;
                  return (
                    <Icon className={`w-8 h-8 ${selectedPlugin.iconColor}`} />
                  );
                })()}
              </div>
              <div>
                <h2 className='text-2xl mb-1 dark:text-white'>
                  {selectedPlugin.name}
                </h2>
                <p className='text-sm text-gray-500 dark:text-gray-400 mb-2'>
                  by {selectedPlugin.author} • {selectedPlugin.version}
                </p>
                <div className='flex items-center gap-4 text-sm'>
                  <div className='flex items-center gap-1'>
                    <Star className='w-4 h-4 fill-yellow-400 text-yellow-400' />
                    <span className='dark:text-gray-300'>
                      {selectedPlugin.rating}
                    </span>
                    <span className='text-gray-400'>
                      ({selectedPlugin.reviews} 评价)
                    </span>
                  </div>
                  <div className='flex items-center gap-1 text-gray-500 dark:text-gray-400'>
                    <Download className='w-4 h-4' />
                    <span>{selectedPlugin.downloads} 下载</span>
                  </div>
                  <div className='flex items-center gap-1 text-gray-500 dark:text-gray-400'>
                    <Calendar className='w-4 h-4' />
                    <span>上传于 {selectedPlugin.uploadDate}</span>
                  </div>
                </div>
              </div>
            </div>
            <Button
              variant='ghost'
              size='sm'
              onClick={() => setSelectedPlugin(null)}
              className='text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            >
              <X className='w-5 h-5' />
            </Button>
          </div>

          <Separator className='my-4 dark:bg-gray-700' />

          {/* Description */}
          <div className='mb-6'>
            <h3 className='mb-2 dark:text-white'>插件介绍</h3>
            <p className='text-sm text-gray-600 dark:text-gray-400'>
              {selectedPlugin.fullDescription || selectedPlugin.description}
            </p>
          </div>

          {/* Features */}
          {selectedPlugin.features && (
            <div className='mb-6'>
              <h3 className='mb-2 dark:text-white'>主要功能</h3>
              <ul className='grid grid-cols-1 md:grid-cols-2 gap-2'>
                {selectedPlugin.features.map((feature, index) => (
                  <li
                    key={index}
                    className='flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400'
                  >
                    <CheckCircle className='w-4 h-4 text-green-500 flex-shrink-0' />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Tags */}
          <div className='mb-6'>
            <h3 className='mb-2 dark:text-white'>标签</h3>
            <div className='flex flex-wrap gap-2'>
              {selectedPlugin.tags.map(tag => (
                <Badge
                  key={tag}
                  variant='secondary'
                  className='dark:bg-gray-700 dark:text-gray-300'
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          <Separator className='my-4 dark:bg-gray-700' />

          {/* Plugin Files Preview */}
          {selectedPlugin.pluginFiles && (
            <div className='mb-6'>
              <h3 className='mb-3 dark:text-white'>插件文件</h3>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                <Card className='p-4 dark:bg-gray-900 dark:border-gray-700'>
                  <div className='flex items-start gap-3'>
                    <div className='bg-blue-100 dark:bg-blue-900/30 w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0'>
                      <Archive className='w-5 h-5 text-blue-600 dark:text-blue-400' />
                    </div>
                    <div className='flex-1 min-w-0'>
                      <div className='text-sm font-medium text-gray-900 dark:text-white mb-1'>
                        可执行包
                      </div>
                      <div className='text-xs text-gray-500 dark:text-gray-400 truncate'>
                        {selectedPlugin.pluginFiles.executable}
                      </div>
                      <Button
                        size='sm'
                        variant='link'
                        className='h-auto p-0 mt-1 text-blue-500 hover:text-blue-600'
                      >
                        <Download className='w-3 h-3 mr-1' />
                        下载
                      </Button>
                    </div>
                  </div>
                </Card>
                <Card className='p-4 dark:bg-gray-900 dark:border-gray-700'>
                  <div className='flex items-start gap-3'>
                    <div className='bg-purple-100 dark:bg-purple-900/30 w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0'>
                      <FileCode2 className='w-5 h-5 text-purple-600 dark:text-purple-400' />
                    </div>
                    <div className='flex-1 min-w-0'>
                      <div className='text-sm font-medium text-gray-900 dark:text-white mb-1'>
                        YAML配置
                      </div>
                      <div className='text-xs text-gray-500 dark:text-gray-400 truncate'>
                        {selectedPlugin.pluginFiles.yaml}
                      </div>
                      <Button
                        size='sm'
                        variant='link'
                        className='h-auto p-0 mt-1 text-blue-500 hover:text-blue-600'
                      >
                        <Eye className='w-3 h-3 mr-1' />
                        查看
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          )}

          {/* Health Status & API Analytics */}
          {(selectedPlugin.healthStatus || selectedPlugin.apiStats) && (
            <>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-6'>
                {/* Health Status */}
                {selectedPlugin.healthStatus && (
                  <Card className='p-4 dark:bg-gray-900 dark:border-gray-700'>
                    <div className='flex items-start justify-between mb-3'>
                      <h3 className='dark:text-white'>健康状态</h3>
                      <div
                        className={`flex items-center gap-1 text-sm px-2 py-1 rounded ${
                          selectedPlugin.healthStatus.status === 'healthy'
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                            : selectedPlugin.healthStatus.status === 'warning'
                              ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                              : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                        }`}
                      >
                        {selectedPlugin.healthStatus.status === 'healthy' && (
                          <CheckCircle className='w-3 h-3' />
                        )}
                        {selectedPlugin.healthStatus.status === 'warning' && (
                          <AlertTriangle className='w-3 h-3' />
                        )}
                        {selectedPlugin.healthStatus.status === 'error' && (
                          <AlertCircle className='w-3 h-3' />
                        )}
                        <span className='capitalize'>
                          {selectedPlugin.healthStatus.status === 'healthy'
                            ? '正常'
                            : selectedPlugin.healthStatus.status === 'warning'
                              ? '警告'
                              : '错误'}
                        </span>
                      </div>
                    </div>
                    <div className='space-y-2'>
                      <div className='flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400'>
                        <Activity className='w-4 h-4' />
                        <span>{selectedPlugin.healthStatus.message}</span>
                      </div>
                      <div className='flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500'>
                        <Clock className='w-3 h-3' />
                        <span>
                          最后检查: {selectedPlugin.healthStatus.lastCheck}
                        </span>
                      </div>
                    </div>
                  </Card>
                )}

                {/* API Call Statistics */}
                {selectedPlugin.apiStats && (
                  <Card className='p-4 dark:bg-gray-900 dark:border-gray-700'>
                    <h3 className='mb-3 dark:text-white'>调用分析</h3>
                    <div className='space-y-3'>
                      <div className='flex items-center justify-between'>
                        <span className='text-sm text-gray-600 dark:text-gray-400'>
                          总调用次数
                        </span>
                        <span className='text-sm font-medium dark:text-white'>
                          {selectedPlugin.apiStats.totalCalls.toLocaleString()}
                        </span>
                      </div>
                      <div className='flex items-center justify-between'>
                        <span className='text-sm text-gray-600 dark:text-gray-400'>
                          成功率
                        </span>
                        <div className='flex items-center gap-2'>
                          <div className='w-20 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden'>
                            <div
                              className='h-full bg-green-500'
                              style={{
                                width: `${selectedPlugin.apiStats.successRate}%`,
                              }}
                            />
                          </div>
                          <span className='text-sm font-medium text-green-600 dark:text-green-400'>
                            {selectedPlugin.apiStats.successRate}%
                          </span>
                        </div>
                      </div>
                      <div className='flex items-center justify-between'>
                        <span className='text-sm text-gray-600 dark:text-gray-400'>
                          平均响应时间
                        </span>
                        <span className='text-sm font-medium dark:text-white'>
                          {selectedPlugin.apiStats.avgResponseTime}ms
                        </span>
                      </div>
                      <div className='flex items-center justify-between'>
                        <span className='text-sm text-gray-600 dark:text-gray-400'>
                          24小时调用
                        </span>
                        <span className='text-sm font-medium text-blue-600 dark:text-blue-400'>
                          {selectedPlugin.apiStats.last24Hours}
                        </span>
                      </div>
                    </div>
                  </Card>
                )}
              </div>
            </>
          )}

          <Separator className='my-4 dark:bg-gray-700' />

          {/* User Rating Section */}
          <div className='mb-6'>
            <h3 className='mb-3 dark:text-white'>为这个插件评分</h3>

            {!userHasReviewed ? (
              <div className='space-y-4'>
                <div className='flex items-center gap-4'>
                  <div className='flex items-center gap-1'>
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        onClick={() => setUserRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className='transition-transform hover:scale-110'
                      >
                        <Star
                          className={`w-8 h-8 cursor-pointer ${
                            star <= (hoverRating || userRating)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300 dark:text-gray-600'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  <span className='text-sm text-gray-600 dark:text-gray-400'>
                    {userRating > 0 ? `${userRating} 星` : '点击星星评分'}
                  </span>
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='review-text' className='dark:text-gray-300'>
                    评价内容
                  </Label>
                  <Textarea
                    id='review-text'
                    placeholder='分享您使用这个插件的体验...'
                    value={userReviewText}
                    onChange={e => setUserReviewText(e.target.value)}
                    className='dark:bg-gray-900 dark:border-gray-700'
                    rows={4}
                  />
                </div>

                <Button
                  size='sm'
                  onClick={handleSubmitRating}
                  className='bg-blue-500 hover:bg-blue-600'
                  disabled={userRating === 0 || !userReviewText.trim()}
                >
                  提交评价
                </Button>
              </div>
            ) : (
              <div className='border border-green-200 dark:border-green-900/30 bg-green-50 dark:bg-green-900/10 rounded-lg p-4'>
                <div className='flex items-start justify-between mb-3'>
                  <div>
                    <div className='flex items-center gap-2 mb-2'>
                      <span className='text-green-700 dark:text-green-400'>
                        您已评价
                      </span>
                      <div className='flex items-center'>
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < (userReview?.rating || 0)
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300 dark:text-gray-600'
                            }`}
                          />
                        ))}
                      </div>
                      <span className='text-sm text-gray-600 dark:text-gray-400'>
                        {userReview?.rating} 星
                      </span>
                    </div>
                    <p className='text-sm text-gray-600 dark:text-gray-400'>
                      {userReview?.content}
                    </p>
                  </div>
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={handleEditReview}
                    className='text-blue-500 hover:text-blue-600'
                  >
                    <Edit className='w-4 h-4 mr-1' />
                    编辑
                  </Button>
                </div>
              </div>
            )}
          </div>

          <Separator className='my-4 dark:bg-gray-700' />

          {/* Reviews */}
          <div>
            <h3 className='mb-4 dark:text-white'>
              用户评价 ({reviews.length})
            </h3>
            <div className='space-y-4'>
              {reviews.map(review => (
                <div
                  key={review.id}
                  className='border border-gray-200 dark:border-gray-700 rounded-lg p-4'
                >
                  <div className='flex items-start justify-between mb-2'>
                    <div className='flex items-center gap-3'>
                      <div className='w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xl'>
                        {review.avatar}
                      </div>
                      <div>
                        <div className='dark:text-white'>{review.user}</div>
                        <div className='flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400'>
                          <div className='flex items-center'>
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3 h-3 ${
                                  i < review.rating
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-300 dark:text-gray-600'
                                }`}
                              />
                            ))}
                          </div>
                          <span>•</span>
                          <span>{review.date}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className='text-sm text-gray-600 dark:text-gray-400 mb-3'>
                    {review.content}
                  </p>
                  <div className='flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400'>
                    <button className='flex items-center gap-1 hover:text-blue-500'>
                      <ThumbsUp className='w-3 h-3' />
                      <span>有用 ({review.helpful})</span>
                    </button>
                    <button className='flex items-center gap-1 hover:text-blue-500'>
                      <ThumbsDown className='w-3 h-3' />
                      <span>无用</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
