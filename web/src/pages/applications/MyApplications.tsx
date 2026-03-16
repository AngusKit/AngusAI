import {
  Plus,
  Filter,
  Grid3x3,
  List,
  MoreVertical,
  Star,
  MessageSquare,
  FileText,
  Search,
  X,
  PlayCircle,
  PauseCircle,
  Rocket,
  Settings,
  Edit,
  Copy,
  Share2,
  Trash2,
  Zap,
  Clock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { useLanguage } from '@/components/LanguageProvider';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { ShareApplicationDialog } from './components/ShareApplicationDialog';
import { ApplicationStatusEnum } from '@/enums/enums';
import { getEnumDescription } from '@/enums/utils';
import { useApplicationList, type ApplicationListItem } from './hooks';
import { getStatusBadgeColor, getTagColor } from './utils';

/**
 * 应用列表主页面：展示所有应用，支持筛选、分页、操作
 */
export function MyApplications() {
  const { t } = useLanguage();
  const {
    viewMode,
    setViewMode,
    activeTab,
    searchQuery,
    currentPage,
    setCurrentPage,
    shareDialogOpen,
    setShareDialogOpen,
    selectedApp,
    applications,
    isLoading,
    totalPages,
    getCategoryCount,
    handleTabChange,
    handleSearchChange,
    handleAppClick,
    handleStarToggle,
    handleStatusChange,
    handleEdit,
    handleSettings,
    handleShare,
    handleMoreAction,
    navigate,
  } = useApplicationList();

  return (
    <div className="space-y-6">
      {/* 标题区域 */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-800 rounded-xl p-6 border border-blue-100 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-blue-500 dark:bg-blue-600 rounded-lg flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">{t('myApps.title')}</h1>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 ml-13">{t('myApps.subtitle')}</p>
      </div>

      {/* Tab 分类 */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <div className="flex gap-4 overflow-x-auto">
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
        </div>
      </div>

      {/* 搜索与操作栏 */}
      <div className="flex items-center justify-between gap-3">
        <div className="relative w-[390px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
          <Input
            type="text"
            placeholder="搜索应用名称、描述或标签..."
            value={searchQuery}
            onChange={e => handleSearchChange(e.target.value)}
            className="pl-10 pr-10 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 focus-visible:border-blue-500 focus-visible:ring-blue-500/50"
          />
          {searchQuery && (
            <button
              onClick={() => handleSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300">
                <Filter className="w-4 h-4 mr-2" />
                筛选
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="dark:bg-gray-800 dark:border-gray-700">
              <DropdownMenuItem className="dark:text-gray-300">最近创建</DropdownMenuItem>
              <DropdownMenuItem className="dark:text-gray-300">最多访问</DropdownMenuItem>
              <DropdownMenuItem className="dark:text-gray-300">按名称排序</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="flex items-center gap-1 border border-gray-200 dark:border-gray-700 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded ${
                viewMode === 'grid'
                  ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <Grid3x3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded ${
                viewMode === 'list'
                  ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
          <Button size="sm" className="bg-blue-500 hover:bg-blue-600 text-white" onClick={() => navigate('/apps/create')}>
            <Plus className="w-4 h-4 mr-2" />
            新建应用
          </Button>
        </div>
      </div>

      {/* 应用列表：网格或列表视图 */}
      <div
        className={
          viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2.5' : 'space-y-3 mt-2.5'
        }
      >
        {isLoading ? (
          viewMode === 'grid' ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3">
                    <Skeleton className="w-12 h-12 rounded-xl dark:bg-gray-700" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-5 w-24 dark:bg-gray-700" />
                      <Skeleton className="h-4 w-16 dark:bg-gray-700" />
                    </div>
                  </div>
                </div>
                <Skeleton className="h-4 w-full mb-2 dark:bg-gray-700" />
                <Skeleton className="h-4 w-3/4 mb-4 dark:bg-gray-700" />
                <div className="flex gap-2 mb-4">
                  <Skeleton className="h-6 w-14 rounded-md dark:bg-gray-700" />
                  <Skeleton className="h-6 w-14 rounded-md dark:bg-gray-700" />
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
                  <Skeleton className="h-4 w-16 dark:bg-gray-700" />
                  <Skeleton className="h-8 w-20 dark:bg-gray-700" />
                </div>
              </div>
            ))
          ) : (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                <div className="flex items-center gap-4">
                  <Skeleton className="w-10 h-10 rounded-lg dark:bg-gray-700 shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-32 dark:bg-gray-700" />
                    <Skeleton className="h-3 w-full dark:bg-gray-700" />
                  </div>
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-6 w-16 dark:bg-gray-700" />
                    <Skeleton className="h-5 w-12 dark:bg-gray-700" />
                    <Skeleton className="h-8 w-20 dark:bg-gray-700" />
                  </div>
                </div>
              </div>
            ))
          )
        ) : (
          <>
            {applications.map(app => (
          <ApplicationCard
            key={app.id}
            app={app}
            viewMode={viewMode}
            onAppClick={handleAppClick}
            onStarToggle={handleStarToggle}
            onStatusChange={handleStatusChange}
            onEdit={handleEdit}
            onSettings={handleSettings}
            onShare={handleShare}
            onMoreAction={handleMoreAction}
            onNavigateChat={() => {
              navigate('/chat');
              toast.success(`正在打开 ${app.name} 对话...`);
            }}
            getStatusBadgeColor={getStatusBadgeColor}
          />
            ))}
          </>
        )}
      </div>

      {/* 分页 */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center mt-6">
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
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {/* 空状态 */}
      {!isLoading && applications.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            {searchQuery ? (
              <Search className="w-8 h-8 text-gray-400 dark:text-gray-600" />
            ) : (
              <Zap className="w-8 h-8 text-gray-400 dark:text-gray-600" />
            )}
          </div>
          <h3 className="text-gray-900 dark:text-white mb-2">{searchQuery ? '未找到相关应用' : '暂无应用'}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            {searchQuery ? `没有找到包含"${searchQuery}"的应用` : '开始创建您的第一个AI应用'}
          </p>
          {!searchQuery && (
            <Button className="bg-blue-500 hover:bg-blue-600 text-white" onClick={() => navigate('/apps/create')}>
              <Plus className="w-4 h-4 mr-2" />
              创建应用
            </Button>
          )}
        </div>
      )}

      {/* 分享弹窗 */}
      <ShareApplicationDialog open={shareDialogOpen} onOpenChange={setShareDialogOpen} application={selectedApp} />
    </div>
  );
}

/** 应用卡片（网格/列表通用，提取以简化主组件） */
function ApplicationCard({
  app,
  viewMode,
  onAppClick,
  onStarToggle,
  onStatusChange,
  onEdit,
  onSettings,
  onShare,
  onMoreAction,
  onNavigateChat,
  getStatusBadgeColor,
}: {
  app: ApplicationListItem;
  viewMode: 'grid' | 'list';
  onAppClick: (app: ApplicationListItem) => void;
  onStarToggle: (e: React.MouseEvent, appId: string) => void;
  onStatusChange: (appId: string, newStatus: ApplicationStatusEnum) => void;
  onEdit: (app: ApplicationListItem) => void;
  onSettings: (app: ApplicationListItem) => void;
  onShare: (app: ApplicationListItem) => void;
  onMoreAction: (action: string, appId: string, appName: string) => void;
  onNavigateChat: () => void;
  getStatusBadgeColor: (status: ApplicationStatusEnum) => string;
}) {
  if (viewMode === 'list') {
    return (
      <div
        onClick={() => onAppClick(app)}
        className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md dark:hover:shadow-gray-900/50 transition-shadow cursor-pointer group"
      >
        <div className="flex items-center gap-6">
          <div className="w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0 text-2xl">
            {app.icon}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {app.name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1 mt-0.5">{app.description}</p>
            <div className="flex items-center gap-4 mt-2 flex-wrap">
              <div className="flex flex-wrap gap-1.5">
                {app.tags.slice(0, 3).map((tag, index) => (
                  <span key={index} className={`text-xs px-2 py-0.5 rounded-md border ${getTagColor(tag, index)}`}>
                    {tag}
                  </span>
                ))}
                {app.tags.length > 3 && (
                  <span className="text-xs px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 border-0">
                    +{app.tags.length - 3}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                <Clock className="w-3.5 h-3.5 shrink-0" />
                <span>{app.visits || '暂无数据'}</span>
              </div>
              <Badge className={`text-xs ${getStatusBadgeColor(app.status)}`}>
                {getEnumDescription(ApplicationStatusEnum, app.status)}
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Button size="sm" variant="outline" onClick={e => (e.stopPropagation(), onNavigateChat())} className="gap-2 h-8">
              <MessageSquare className="w-3.5 h-3.5" />
              进入对话
            </Button>
            <button
              onClick={e => onStarToggle(e, app.id)}
              className={`p-1.5 rounded transition-colors ${
                app.isStarred ? 'text-yellow-500 hover:text-yellow-600' : 'text-gray-400 hover:text-yellow-500 dark:text-gray-500 dark:hover:text-yellow-500'
              }`}
            >
              <Star className={`w-4 h-4 ${app.isStarred ? 'fill-current' : ''}`} />
            </button>
            <AppDropdownMenu
              app={app}
              onStatusChange={onStatusChange}
              onSettings={onSettings}
              onEdit={onEdit}
              onShare={onShare}
              onMoreAction={onMoreAction}
            />
          </div>
        </div>
      </div>
    );
  }

  // 网格视图
  return (
    <div
      onClick={() => onAppClick(app)}
      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md dark:hover:shadow-gray-900/50 transition-shadow cursor-pointer group flex flex-col h-full"
    >
      <div className="flex-1 min-h-0">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-3xl">
              {app.icon}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {app.name}
              </h3>
              <Badge className={`text-xs ${getStatusBadgeColor(app.status)}`}>
                {getEnumDescription(ApplicationStatusEnum, app.status)}
              </Badge>
            </div>
          </div>
          <AppDropdownMenu
            app={app}
            onStatusChange={onStatusChange}
            onSettings={onSettings}
            onEdit={onEdit}
            onShare={onShare}
            onMoreAction={onMoreAction}
          />
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">{app.description}</p>
        <div className="flex flex-wrap gap-2">
          {app.tags.map((tag, index) => (
            <span key={index} className={`text-xs px-2 py-1 rounded-md border ${getTagColor(tag, index)}`}>
              {tag}
            </span>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-between mt-4 pt-3 mt-auto shrink-0 border-t border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
          <Clock className="w-4 h-4" />
          <span>{app.visits || '暂无数据'}</span>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" onClick={e => (e.stopPropagation(), onNavigateChat())} className="gap-2 h-8">
            <MessageSquare className="w-3.5 h-3.5" />
            进入对话
          </Button>
          <button
            onClick={e => onStarToggle(e, app.id)}
            className={`p-1 rounded transition-colors ${
              app.isStarred ? 'text-yellow-500 hover:text-yellow-600' : 'text-gray-400 hover:text-yellow-500 dark:text-gray-500 dark:hover:text-yellow-500'
            }`}
          >
            <Star className={`w-4 h-4 ${app.isStarred ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>
    </div>
  );
}

/** 应用卡片更多操作下拉菜单 */
function AppDropdownMenu({
  app,
  onStatusChange,
  onSettings,
  onEdit,
  onShare,
  onMoreAction,
}: {
  app: ApplicationListItem;
  onStatusChange: (appId: string, newStatus: ApplicationStatusEnum) => void;
  onSettings: (app: ApplicationListItem) => void;
  onEdit: (app: ApplicationListItem) => void;
  onShare: (app: ApplicationListItem) => void;
  onMoreAction: (action: string, appId: string, appName: string) => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          onClick={e => e.stopPropagation()}
          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors opacity-0 group-hover:opacity-100"
        >
          <MoreVertical className="w-4 h-4 text-gray-600 dark:text-gray-400" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="dark:bg-gray-800 dark:border-gray-700">
        {app.status === ApplicationStatusEnum.DRAFT && (
          <>
            <DropdownMenuItem
              onClick={e => {
                e.stopPropagation();
                onStatusChange(app.id, ApplicationStatusEnum.PUBLISHED);
              }}
              className="dark:text-gray-300"
            >
              <Rocket className="w-4 h-4 mr-2" />
              发布应用
            </DropdownMenuItem>
            <DropdownMenuSeparator className="dark:bg-gray-700" />
          </>
        )}
        {app.status === ApplicationStatusEnum.PUBLISHED && (
          <>
            <DropdownMenuItem
              onClick={e => {
                e.stopPropagation();
                onStatusChange(app.id, ApplicationStatusEnum.PAUSED);
              }}
              className="dark:text-gray-300"
            >
              <PauseCircle className="w-4 h-4 mr-2" />
              暂停应用
            </DropdownMenuItem>
            <DropdownMenuSeparator className="dark:bg-gray-700" />
          </>
        )}
        {app.status === ApplicationStatusEnum.PAUSED && (
          <>
            <DropdownMenuItem
              onClick={e => {
                e.stopPropagation();
                onStatusChange(app.id, ApplicationStatusEnum.PUBLISHED);
              }}
              className="dark:text-gray-300"
            >
              <PlayCircle className="w-4 h-4 mr-2" />
              恢复发布
            </DropdownMenuItem>
            <DropdownMenuSeparator className="dark:bg-gray-700" />
          </>
        )}
        <DropdownMenuItem onClick={e => (e.stopPropagation(), onSettings(app))} className="dark:text-gray-300">
          <Settings className="w-4 h-4 mr-2" />
          设置应用
        </DropdownMenuItem>
        <DropdownMenuItem onClick={e => (e.stopPropagation(), onEdit(app))} className="dark:text-gray-300">
          <Edit className="w-4 h-4 mr-2" />
          编辑应用
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={e => (e.stopPropagation(), onMoreAction('复制', app.id, app.name))}
          className="dark:text-gray-300"
        >
          <Copy className="w-4 h-4 mr-2" />
          复制应用
        </DropdownMenuItem>
        <DropdownMenuItem onClick={e => (e.stopPropagation(), onShare(app))} className="dark:text-gray-300">
          <Share2 className="w-4 h-4 mr-2" />
          分享应用
        </DropdownMenuItem>
        <DropdownMenuSeparator className="dark:bg-gray-700" />
        <DropdownMenuItem
          onClick={e => (e.stopPropagation(), onMoreAction('删除', app.id, app.name))}
          className="text-red-600 dark:text-red-400"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          删除应用
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
