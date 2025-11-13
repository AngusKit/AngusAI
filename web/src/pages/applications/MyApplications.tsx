import { Plus, Filter, Grid3x3, List, MoreVertical, Star, Clock, MessageSquare, FileText, Database, Code, Zap, Globe, Bot, Sparkles, Search, X, PlayCircle, PauseCircle, Rocket, Image, Book, Mic, Video, Mail, ShoppingCart, BarChart3, } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, } from '@/components/ui/pagination';
import { useState, useEffect } from 'react';
import { useLanguage } from '@/components/ui/LanguageProvider';
import { toast } from 'sonner';
import { EditApplicationDialog } from './EditApplicationDialog';
import { ShareApplicationDialog } from './ShareApplicationDialog';
import Applications from '@/services/Applications';
import { ApplicationDetailVo } from '@/services/ApplicationsTypes';
import { ApplicationStatusEnum, ApplicationCategoryEnum } from '@/enums/enums';
import { useDebounce } from '@/hooks/useDebounce';
import { getEnumDescription } from '@/enums/utils';

type ViewMode = 'grid' | 'list';
type AppStatus = '草稿' | '已发布' | '已暂停';

interface Tag {
  label: string;
  color: string;
}

interface Application {
  id: string;
  name: string;
  description: string;
  icon: any;
  iconBgColor: string;
  status: ApplicationStatusEnum;
  isStarred: boolean;
  tags: Tag[];
  visits: string;
  category: string;
}

export function MyApplications({
  onCreateNew,
  onNavigate,
}: {
  onCreateNew?: () => void;
  onNavigate?: (page: string) => void;
}) {
  const { t } = useLanguage();
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // 状态映射：API状态 -> 页面显示状态
  const mapStatusToDisplay = (status?: ApplicationStatusEnum): string => {
    return getEnumDescription(ApplicationStatusEnum, status || ApplicationStatusEnum.DRAFT);
  };

  // 状态映射：页面显示状态 -> API状态
  const mapDisplayToStatus = (status: ApplicationStatusEnum): ApplicationStatusEnum => {
    if (status === '已发布') return ApplicationStatusEnum.PUBLISHED;
    if (status === '已暂停') return ApplicationStatusEnum.PAUSED;
    return ApplicationStatusEnum.DRAFT;
  };

  // 分类映射：API分类 -> 页面分类
  const mapCategoryToDisplay = (category?: ApplicationCategoryEnum): string => {
    if (category === ApplicationCategoryEnum.CHATBOT) return 'chatbot';
    if (category === ApplicationCategoryEnum.KNOWLEDGE_BASE) return 'knowledge';
    if (category === ApplicationCategoryEnum.WORKFLOW) return 'text-generation';
    return 'other';
  };

  // 图标映射：根据分类或名称返回图标
  const getIconForApplication = (category?: ApplicationCategoryEnum, name?: string): any => {
    if (category === ApplicationCategoryEnum.CHATBOT) return MessageSquare;
    if (category === ApplicationCategoryEnum.KNOWLEDGE_BASE) return Database;
    if (category === ApplicationCategoryEnum.WORKFLOW) return Zap;
    return Bot;
  };

  // 图标背景色映射
  const getIconBgColor = (category?: ApplicationCategoryEnum): string => {
    if (category === ApplicationCategoryEnum.CHATBOT) return 'bg-purple-500';
    if (category === ApplicationCategoryEnum.KNOWLEDGE_BASE) return 'bg-green-500';
    if (category === ApplicationCategoryEnum.WORKFLOW) return 'bg-yellow-500';
    return 'bg-blue-500';
  };

  // 加载应用列表
  const loadApplications = async () => {
    setIsLoading(true);
    try {
      const queryParams: any = {
        keyword: debouncedSearchQuery.trim() || undefined,
        pageNo: currentPage,
        pageSize: itemsPerPage,
      };

      // 根据activeTab设置筛选条件
      if (activeTab === 'published') {
        queryParams.status = ApplicationStatusEnum.PUBLISHED;
      } else if (activeTab === 'paused') {
        queryParams.status = ApplicationStatusEnum.PAUSED;
      } else if (activeTab === 'draft') {
        queryParams.status = ApplicationStatusEnum.DRAFT;
      } else if (activeTab === 'chatbot') {
        queryParams.category = ApplicationCategoryEnum.CHATBOT;
      } else if (activeTab === 'text-generation') {
        queryParams.category = ApplicationCategoryEnum.WORKFLOW;
      } else if (activeTab === 'knowledge') {
        queryParams.category = ApplicationCategoryEnum.KNOWLEDGE_BASE;
      }

      const response = await Applications.getApplicationList(queryParams);

      // 处理响应结构
      const responseData = (response as any).data;
      let listData: ApplicationDetailVo[] | undefined;
      if (responseData) {
        // 如果responseData有list属性，说明是分页结果
        if (responseData.list) {
          listData = responseData.list;
          setTotalCount(responseData.total || 0);
          setTotalPages(Math.ceil((responseData.total || 0) / itemsPerPage));
        } else if (Array.isArray(responseData)) {
          // 如果直接是数组
          listData = responseData;
          setTotalCount(responseData.length);
          setTotalPages(Math.ceil(responseData.length / itemsPerPage));
        }
      }

      if (Array.isArray(listData)) {
        const mappedList: Application[] = listData.map((app: ApplicationDetailVo) => ({
          id: app.id || '',
          name: app.name || '',
          description: app.description || '',
          icon: getIconForApplication(app.category, app.name),
          iconBgColor: getIconBgColor(app.category),
          status: mapStatusToDisplay(app.status),
          isStarred: false, // API中没有星标字段，默认为false
          tags: [], // API中没有标签字段，需要从其他地方获取或留空
          visits: '0 次调用', // API中没有调用次数字段，需要从统计接口获取
          category: mapCategoryToDisplay(app.category),
        }));

        setApplications(mappedList);
      } else {
        setApplications([]);
        setTotalCount(0);
        setTotalPages(1);
      }
    } catch (error: any) {
      console.error('Failed to load application list:', error);
      toast.error(error?.data?.message || error?.message || '加载应用列表失败');
      setApplications([]);
      setTotalCount(0);
      setTotalPages(1);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, [currentPage, debouncedSearchQuery, activeTab]);

  // 获取分类数量（从API数据计算）
  const getCategoryCount = (category: string) => {
    if (category === 'all') return totalCount;
    if (category === 'published') {
      return applications.filter(app => app.status === '已发布').length;
    }
    if (category === 'paused') {
      return applications.filter(app => app.status === '已暂停').length;
    }
    if (category === 'draft') {
      return applications.filter(app => app.status === '草稿').length;
    }
    if (category === 'starred') {
      return applications.filter(app => app.isStarred).length;
    }
    if (category === 'chatbot') {
      return applications.filter(app => app.category === 'chatbot').length;
    }
    if (category === 'text-generation') {
      return applications.filter(app => app.category === 'text-generation').length;
    }
    if (category === 'knowledge') {
      return applications.filter(app => app.category === 'knowledge').length;
    }
    return 0;
  };

  // 当筛选条件改变时重置页码
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleAppClick = (appName: string) => {
    toast.success(`打开应用: ${appName}`);
  };

  const handleStarToggle = async (e: React.MouseEvent, appId: string) => {
    e.stopPropagation();
    // API中没有星标功能，这里只是本地状态更新
    setApplications(prev => prev.map(app => (app.id === appId ? { ...app, isStarred: !app.isStarred } : app)));
    const app = applications.find(a => a.id === appId);
    toast.success(app?.isStarred ? '已取消星标' : '已添加星标');
  };

  const handleStatusChange = async (appId: string, newStatus: ApplicationStatusEnum) => {
    try {
      const statusEnum = newStatus;
      await Applications.modifyApplicationStatus(appId, { status: statusEnum });
      
      // 更新本地状态
      setApplications(prev => prev.map(app => (app.id === appId ? { ...app, status: newStatus } : app)));
      
      const app = applications.find(a => a.id === appId);
      let message = '';
      if (newStatus === ApplicationStatusEnum.PUBLISHED) {
        message = `${app?.name} 已发布`;
      } else if (newStatus === ApplicationStatusEnum.PAUSED) {
        message = `${app?.name} 已暂停`;
      }
      toast.success(message);
      
      // 重新加载列表以获取最新数据
      await loadApplications();
    } catch (error: any) {
      console.error('Failed to change application status:', error);
      toast.error(error?.data?.message || error?.message || '修改状态失败');
    }
  };

  const handleEdit = (app: Application) => {
    setSelectedApp(app);
    setEditDialogOpen(true);
  };

  const handleShare = (app: Application) => {
    setSelectedApp(app);
    setShareDialogOpen(true);
  };

  const handleSettings = (app: Application) => {
    setSelectedApp(app);
    onNavigate?.('individual-app-settings');
  };

  const handleSaveEdit = async (updatedData: Partial<Application>) => {
    if (!selectedApp) return;
    
    try {
      // 构建更新数据
      const updateDto: any = {};
      if (updatedData.name !== undefined) updateDto.name = updatedData.name;
      if (updatedData.description !== undefined) updateDto.description = updatedData.description;
      if (updatedData.category !== undefined) {
        // 将页面分类映射回API分类
        if (updatedData.category === 'chatbot') {
          updateDto.category = ApplicationCategoryEnum.CHATBOT;
        } else if (updatedData.category === 'knowledge') {
          updateDto.category = ApplicationCategoryEnum.KNOWLEDGE_BASE;
        } else if (updatedData.category === 'text-generation') {
          updateDto.category = ApplicationCategoryEnum.WORKFLOW;
        }
      }

      await Applications.updateApplication(selectedApp.id, updateDto);
      
      // 更新本地状态
      setApplications(prev => prev.map(app => (app.id === selectedApp.id ? { ...app, ...updatedData } : app)));
      
      toast.success('应用已更新');
      setEditDialogOpen(false);
      
      // 重新加载列表
      await loadApplications();
    } catch (error: any) {
      console.error('Failed to update application:', error);
      toast.error(error?.data?.message || error?.message || '更新应用失败');
    }
  };

  const handleMoreAction = async (action: string, appId: string, appName: string) => {
    if (action === '复制') {
      try {
        await Applications.duplicateApplication(appId, { name: `${appName} 副本` });
        toast.success(`${appName} 已复制`);
        // 重新加载列表
        await loadApplications();
      } catch (error: any) {
        console.error('Failed to duplicate application:', error);
        toast.error(error?.data?.message || error?.message || '复制应用失败');
      }
    } else if (action === '删除') {
      try {
        await Applications.deleteApplication(appId);
        toast.success(`${appName} 已删除`);
        // 重新加载列表
        await loadApplications();
      } catch (error: any) {
        console.error('Failed to delete application:', error);
        toast.error(error?.data?.message || error?.message || '删除应用失败');
      }
    }
  };

  // 过滤应用（现在主要用于客户端筛选，因为大部分筛选在服务端完成）
  const filteredApps = applications.filter(app => {
    // 星标筛选在客户端完成
    if (activeTab === 'starred' && !app.isStarred) return false;
    return true;
  });

  // 分页计算（现在使用服务端分页）
  const displayApps = filteredApps;


  const getStatusBadgeColor = (status: ApplicationStatusEnum) => {
    switch (status) {
      case ApplicationStatusEnum.PUBLISHED:
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case ApplicationStatusEnum.PAUSED:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400';
      case ApplicationStatusEnum.DRAFT:
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400';
    }
  };

  const getStatusIcon = (status: ApplicationStatusEnum) => {
    switch (status) {
      case ApplicationStatusEnum.PUBLISHED:
        return PlayCircle;
      case ApplicationStatusEnum.PAUSED:
        return PauseCircle;
      case ApplicationStatusEnum.DRAFT:
        return FileText;
      default:
        return FileText;
    }
  };

  return (
    <div className='space-y-6'>
      {/* Header Section - 美化的标题区域 */}
      <div className='bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-800 rounded-xl p-6 border border-blue-100 dark:border-gray-700'>
        <div className='flex items-center gap-3 mb-2'>
          <div className='w-10 h-10 bg-blue-500 dark:bg-blue-600 rounded-lg flex items-center justify-center shrink-0'>
            <FileText className='w-5 h-5 text-white' />
          </div>
          <h1 className='text-3xl font-extrabold text-gray-900 dark:text-white'>{t('myApps.title')}</h1>
        </div>
        <p className='text-sm text-gray-600 dark:text-gray-400 ml-13'>{t('myApps.subtitle')}</p>
      </div>

      {/* Tabs */}
      <div className='border-b border-gray-200 dark:border-gray-700'>
        <div className='flex gap-4 overflow-x-auto'>
          <button
            onClick={() => handleTabChange('all')}
            className={`pb-3 px-1 border-b-2 text-sm whitespace-nowrap transition-colors ${
              activeTab === 'all'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
            }`}
          >
            {t('myApps.allApps')} ({getCategoryCount('all')})
          </button>
          <button
            onClick={() => handleTabChange('published')}
            className={`pb-3 px-1 border-b-2 text-sm whitespace-nowrap transition-colors ${
              activeTab === 'published'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
            }`}
          >
            已发布 ({getCategoryCount('published')})
          </button>
          <button
            onClick={() => handleTabChange('paused')}
            className={`pb-3 px-1 border-b-2 text-sm whitespace-nowrap transition-colors ${
              activeTab === 'paused'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
            }`}
          >
            已暂停 ({getCategoryCount('paused')})
          </button>
          <button
            onClick={() => handleTabChange('draft')}
            className={`pb-3 px-1 border-b-2 text-sm whitespace-nowrap transition-colors ${
              activeTab === 'draft'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
            }`}
          >
            草稿 ({getCategoryCount('draft')})
          </button>
          <button
            onClick={() => handleTabChange('starred')}
            className={`pb-3 px-1 border-b-2 text-sm whitespace-nowrap transition-colors ${
              activeTab === 'starred'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
            }`}
          >
            星标 ({getCategoryCount('starred')})
          </button>
          <button
            onClick={() => handleTabChange('chatbot')}
            className={`pb-3 px-1 border-b-2 text-sm whitespace-nowrap transition-colors ${
              activeTab === 'chatbot'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
            }`}
          >
            聊天助手 ({getCategoryCount('chatbot')})
          </button>
          <button
            onClick={() => handleTabChange('text-generation')}
            className={`pb-3 px-1 border-b-2 text-sm whitespace-nowrap transition-colors ${
              activeTab === 'text-generation'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
            }`}
          >
            文本生成 ({getCategoryCount('text-generation')})
          </button>
          <button
            onClick={() => handleTabChange('knowledge')}
            className={`pb-3 px-1 border-b-2 text-sm whitespace-nowrap transition-colors ${
              activeTab === 'knowledge'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
            }`}
          >
            知识问答 ({getCategoryCount('knowledge')})
          </button>
        </div>
      </div>

      {/* Action Buttons and Search - 放在列表正上方 */}
      <div className='flex items-center justify-between gap-3'>
        {/* Search Bar - 左侧390px */}
        <div className='relative w-[390px]'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500' />
          <Input
            type='text'
            placeholder='搜索应用名称、描述或标签...'
            value={searchQuery}
            onChange={e => handleSearchChange(e.target.value)}
            className='pl-10 pr-10 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 focus-visible:border-blue-500 focus-visible:ring-blue-500/50'
          />
          {searchQuery && (
            <button
              onClick={() => handleSearchChange('')}
              className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors'
            >
              <X className='w-4 h-4' />
            </button>
          )}
        </div>

        {/* Action Buttons - 右侧 */}
        <div className='flex items-center gap-3'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='outline' size='sm' className='dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300'>
                <Filter className='w-4 h-4 mr-2' />
                筛选
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='dark:bg-gray-800 dark:border-gray-700'>
              <DropdownMenuItem className='dark:text-gray-300'>最近创建</DropdownMenuItem>
              <DropdownMenuItem className='dark:text-gray-300'>最多访问</DropdownMenuItem>
              <DropdownMenuItem className='dark:text-gray-300'>按名称排序</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className='flex items-center gap-1 border border-gray-200 dark:border-gray-700 rounded-lg p-1'>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded ${
                viewMode === 'grid'
                  ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <Grid3x3 className='w-4 h-4' />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded ${
                viewMode === 'list'
                  ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <List className='w-4 h-4' />
            </button>
          </div>

          <Button size='sm' className='bg-blue-500 hover:bg-blue-600 text-white' onClick={onCreateNew}>
            <Plus className='w-4 h-4 mr-2' />
            新建应用
          </Button>
        </div>
      </div>

      {/* Applications Grid - 添加10px顶部间距 */}
      <div
        className={
          viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2.5' : 'space-y-3 mt-2.5'
        }
      >
        {displayApps.map(app => {
          const StatusIcon = getStatusIcon(app.status);
          const Icon = app.icon;

          if (viewMode === 'list') {
            // List View - 紧凑的横向布局
            return (
              <div
                key={app.id}
                onClick={() => handleAppClick(app.name)}
                className='bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 hover:shadow-md dark:hover:shadow-gray-900/50 transition-shadow cursor-pointer group'
              >
                <div className='flex items-center gap-4'>
                  {/* 左侧：图标和基本信息 */}
                  <div
                    className={`${app.iconBgColor} w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0`}
                  >
                    <Icon className='w-5 h-5 text-white' />
                  </div>

                  <div className='flex-1 min-w-0'>
                    <h3 className='dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors'>
                      {app.name}
                    </h3>
                    <p className='text-sm text-gray-600 dark:text-gray-400 line-clamp-1'>{app.description}</p>
                  </div>

                  {/* 右侧：标签、调用次数、操作 */}
                  <div className='flex items-center gap-4'>
                    {/* 标签 */}
                    <div className='flex flex-wrap gap-1.5'>
                      {app.tags.slice(0, 2).map((tag, index) => (
                        <span key={index} className={`text-xs px-2 py-1 rounded-md ${tag.color} border-0`}>
                          {tag.label}
                        </span>
                      ))}
                      {app.tags.length > 2 && (
                        <span className='text-xs px-2 py-1 rounded-md bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 border-0'>
                          +{app.tags.length - 2}
                        </span>
                      )}
                    </div>

                    {/* 调用次数 */}
                    <div className='flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 min-w-[80px]'>
                      <Clock className='w-4 h-4' />
                      <span>{app.visits || '暂无数据'}</span>
                    </div>

                    {/* 状态标签 */}
                    <Badge className={`text-xs ${getStatusBadgeColor(app.status as ApplicationStatusEnum)}`}>{getEnumDescription(ApplicationStatusEnum, app.status)}</Badge>

                    {/* 进入对话按钮、收藏和菜单 */}
                    <div className='flex items-center gap-2'>
                      <Button
                        size='sm'
                        variant='outline'
                        onClick={e => {
                          e.stopPropagation();
                          onNavigate?.('chat');
                          toast.success(`正在打开 ${app.name} 对话...`);
                        }}
                        className='gap-2 h-8'
                      >
                        <MessageSquare className='w-3.5 h-3.5' />
                        进入对话
                      </Button>
                      <button
                        onClick={e => handleStarToggle(e, app.id as string)}
                        className={`p-1 rounded transition-colors ${
                          app.isStarred
                            ? 'text-yellow-500 hover:text-yellow-600'
                            : 'text-gray-400 hover:text-yellow-500 dark:text-gray-500 dark:hover:text-yellow-500'
                        }`}
                      >
                        <Star className={`w-4 h-4 ${app.isStarred ? 'fill-current' : ''}`} />
                      </button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button
                            onClick={e => e.stopPropagation()}
                            className='p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors opacity-0 group-hover:opacity-100'
                          >
                            <MoreVertical className='w-4 h-4 text-gray-600 dark:text-gray-400' />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align='end' className='dark:bg-gray-800 dark:border-gray-700'>
                          {app.status === ApplicationStatusEnum.DRAFT && (
                            <>
                              <DropdownMenuItem
                                onClick={e => {
                                  e.stopPropagation();
                                  handleStatusChange(app.id as string, ApplicationStatusEnum.PUBLISHED);
                                }}
                                className='dark:text-gray-300'
                              >
                                <Rocket className='w-4 h-4 mr-2' />
                                发布应用
                              </DropdownMenuItem>
                              <DropdownMenuSeparator className='dark:bg-gray-700' />
                            </>
                          )}
                          {app.status === ApplicationStatusEnum.PUBLISHED && (
                            <>
                              <DropdownMenuItem
                                onClick={e => {
                                  e.stopPropagation();
                                  handleStatusChange(app.id as string, ApplicationStatusEnum.PAUSED);
                                }}
                                className='dark:text-gray-300'
                              >
                                <PauseCircle className='w-4 h-4 mr-2' />
                                暂停应用
                              </DropdownMenuItem>
                              <DropdownMenuSeparator className='dark:bg-gray-700' />
                            </>
                          )}
                          {app.status === ApplicationStatusEnum.PAUSED && (
                            <>
                              <DropdownMenuItem
                                onClick={e => {
                                  e.stopPropagation();
                                  handleStatusChange(app.id as string, ApplicationStatusEnum.PUBLISHED);
                                }}
                                className='dark:text-gray-300'
                              >
                                <PlayCircle className='w-4 h-4 mr-2' />
                                恢复发布
                              </DropdownMenuItem>
                              <DropdownMenuSeparator className='dark:bg-gray-700' />
                            </>
                          )}
                          <DropdownMenuItem
                            onClick={e => {
                              e.stopPropagation();
                              handleSettings(app);
                            }}
                            className='dark:text-gray-300'
                          >
                            设置
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={e => {
                              e.stopPropagation();
                              handleEdit(app);
                            }}
                            className='dark:text-gray-300'
                          >
                            编辑
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={e => {
                              e.stopPropagation();
                              handleMoreAction('复制', app.id as string, app.name);
                            }}
                            className='dark:text-gray-300'
                          >
                            复制
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={e => {
                              e.stopPropagation();
                              handleShare(app);
                            }}
                            className='dark:text-gray-300'
                          >
                            分享
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className='dark:bg-gray-700' />
                          <DropdownMenuItem
                            onClick={() => handleMoreAction('删除', app.id as string, app.name)}
                            className='text-red-600 dark:text-red-400'
                          >
                            删除
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              </div>
            );
          }

          // Grid View - 原有的卡片布局
          return (
            <div
              key={app.id}
              onClick={() => handleAppClick(app.name)}
              className='bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md dark:hover:shadow-gray-900/50 transition-shadow cursor-pointer group'
            >
              {/* Header */}
              <div className='flex items-start justify-between mb-4'>
                <div className='flex items-start gap-3'>
                  <div
                    className={`${app.iconBgColor} w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0`}
                  >
                    <Icon className='w-6 h-6 text-white' />
                  </div>
                  <div className='flex-1 min-w-0'>
                    <h3 className='dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors'>
                      {app.name}
                    </h3>
                    <Badge className={`text-xs ${getStatusBadgeColor(app.status as ApplicationStatusEnum)}`}>{getEnumDescription(ApplicationStatusEnum, app.status)}</Badge>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      onClick={e => e.stopPropagation()}
                      className='p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors opacity-0 group-hover:opacity-100'
                    >
                      <MoreVertical className='w-4 h-4 text-gray-600 dark:text-gray-400' />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align='end' className='dark:bg-gray-800 dark:border-gray-700'>
                    {app.status === ApplicationStatusEnum.DRAFT && (
                      <>
                        <DropdownMenuItem
                          onClick={e => {
                            e.stopPropagation();
                            handleStatusChange(app.id, ApplicationStatusEnum.PUBLISHED);
                          }}
                          className='dark:text-gray-300'
                        >
                          <Rocket className='w-4 h-4 mr-2' />
                          发布应用
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className='dark:bg-gray-700' />
                      </>
                    )}
                    {app.status === ApplicationStatusEnum.PUBLISHED && (
                      <>
                        <DropdownMenuItem
                          onClick={e => {
                            e.stopPropagation();
                            handleStatusChange(app.id, ApplicationStatusEnum.PAUSED);
                          }}
                          className='dark:text-gray-300'
                        >
                          <PauseCircle className='w-4 h-4 mr-2' />
                          暂停应用
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className='dark:bg-gray-700' />
                      </>
                    )}
                    {app.status === ApplicationStatusEnum.PAUSED && (
                      <>
                        <DropdownMenuItem
                          onClick={e => {
                            e.stopPropagation();
                            handleStatusChange(app.id, ApplicationStatusEnum.PUBLISHED);
                          }}
                          className='dark:text-gray-300'
                        >
                          <PlayCircle className='w-4 h-4 mr-2' />
                          恢复发布
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className='dark:bg-gray-700' />
                      </>
                    )}
                    <DropdownMenuItem
                      onClick={e => {
                        e.stopPropagation();
                        handleSettings(app);
                      }}
                      className='dark:text-gray-300'
                    >
                      设置
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={e => {
                        e.stopPropagation();
                        handleEdit(app);
                      }}
                      className='dark:text-gray-300'
                    >
                      编辑
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={e => {
                        e.stopPropagation();
                        handleMoreAction('复制', app.id as string, app.name);
                      }}
                      className='dark:text-gray-300'
                    >
                      复制
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={e => {
                        e.stopPropagation();
                        handleShare(app);
                      }}
                      className='dark:text-gray-300'
                    >
                      分享
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className='dark:bg-gray-700' />
                    <DropdownMenuItem
                      onClick={() => handleMoreAction('删除', app.id as string, app.name)}
                      className='text-red-600 dark:text-red-400'
                    >
                      删除
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Description */}
              <p className='text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2'>{app.description}</p>

              {/* Tags */}
              <div className='flex flex-wrap gap-2 mb-4'>
                {app.tags.map((tag, index) => (
                  <span key={index} className={`text-xs px-2 py-1 rounded-md ${tag.color}`}>
                    {tag.label}
                  </span>
                ))}
              </div>

              {/* Footer */}
              <div className='flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700'>
                <div className='flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400'>
                  <Clock className='w-4 h-4' />
                  <span>{app.visits || '暂无数据'}</span>
                </div>
                <div className='flex items-center gap-2'>
                  <Button
                    size='sm'
                    variant='outline'
                    onClick={e => {
                      e.stopPropagation();
                      onNavigate?.('chat');
                      toast.success(`正在打开 ${app.name} 对话...`);
                    }}
                    className='gap-2 h-8'
                  >
                    <MessageSquare className='w-3.5 h-3.5' />
                    进入对话
                  </Button>
                  <button
                    onClick={e => handleStarToggle(e, app.id)}
                    className={`p-1 rounded transition-colors ${
                      app.isStarred
                        ? 'text-yellow-500 hover:text-yellow-600'
                        : 'text-gray-400 hover:text-yellow-500 dark:text-gray-500 dark:hover:text-yellow-500'
                    }`}
                  >
                    <Star className={`w-4 h-4 ${app.isStarred ? 'fill-current' : ''}`} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className='flex items-center justify-center mt-6'>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
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
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && displayApps.length === 0 && (
        <div className='text-center py-12'>
          <div className='w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4'>
            {searchQuery ? (
              <Search className='w-8 h-8 text-gray-400 dark:text-gray-600' />
            ) : (
              <Zap className='w-8 h-8 text-gray-400 dark:text-gray-600' />
            )}
          </div>
          <h3 className='text-gray-900 dark:text-white mb-2'>{searchQuery ? '未找到相关应用' : '暂无应用'}</h3>
          <p className='text-sm text-gray-600 dark:text-gray-400 mb-4'>
            {searchQuery ? `没有找到包含"${searchQuery}"的应用` : '开始创建您的第一个AI应用'}
          </p>
          {!searchQuery && (
            <Button className='bg-blue-500 hover:bg-blue-600 text-white' onClick={onCreateNew}>
              <Plus className='w-4 h-4 mr-2' />
              创建应用
            </Button>
          )}
        </div>
      )}

      {/* 编辑对话框 */}
      <EditApplicationDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        application={selectedApp}
        onSave={handleSaveEdit}
      />

      {/* 分享对话框 */}
      <ShareApplicationDialog open={shareDialogOpen} onOpenChange={setShareDialogOpen} application={selectedApp} />
    </div>
  );
}
