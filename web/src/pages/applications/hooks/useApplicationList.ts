import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { refreshResourcesBadge } from '@/hooks/useResourcesBadge';
import Applications from '@/services/Applications';
import type { ApplicationCountVo, ApplicationListVo } from '@/services/ApplicationsTypes';
import { ApplicationStatusEnum } from '@/enums/enums';
import { useDebounce } from '@/hooks/useDebounce';
import { ITEMS_PER_PAGE } from '../constants';

/** 应用列表项（前端展示用） */
export interface ApplicationListItem {
  id: string;
  name: string;
  description: string;
  /** 应用图标 emoji，空时默认 🤖 */
  icon: string;
  status: ApplicationStatusEnum;
  isStarred: boolean;
  tags: string[];
  visits: string;
  agentIds?: string[];
  defaultAgentId?: string;
}

/**
 * 应用列表页 Hook：加载、筛选、分页、操作
 */
export function useApplicationList() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const [currentPage, setCurrentPage] = useState(1);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState<ApplicationListItem | null>(null);
  const [applications, setApplications] = useState<ApplicationListItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [counts, setCounts] = useState<ApplicationCountVo>({
    total: 0,
    draft: 0,
    published: 0,
    paused: 0,
    starred: 0,
  });

  /** 加载Tab统计数量（getApplicationCounts） */
  const loadCounts = async () => {
    try {
      const response = await Applications.getApplicationCounts();
      const data = (response as { data?: ApplicationCountVo })?.data;
      if (data) {
        setCounts({
          total: data.total ?? 0,
          draft: data.draft ?? 0,
          published: data.published ?? 0,
          paused: data.paused ?? 0,
          starred: data.starred ?? 0,
        });
      }
    } catch {
      // 静默失败，Tab 数量保持为 0
    }
  };

  /** 加载应用列表 */
  const loadApplications = async () => {
    setIsLoading(true);
    try {
      const queryParams: Record<string, unknown> = {
        keyword: debouncedSearchQuery.trim() || undefined,
        pageNo: currentPage,
        pageSize: ITEMS_PER_PAGE,
      };
      if (activeTab === 'published') queryParams.status = ApplicationStatusEnum.PUBLISHED;
      else if (activeTab === 'paused') queryParams.status = ApplicationStatusEnum.PAUSED;
      else if (activeTab === 'draft') queryParams.status = ApplicationStatusEnum.DRAFT;
      else if (activeTab === 'starred') queryParams.starred = true;

      const response = await Applications.getApplicationList(queryParams);
      const responseData = (response as any).data;
      let listData: ApplicationListVo[] | undefined;

      if (responseData) {
        if (responseData.list) {
          listData = responseData.list;
          setTotalCount(responseData.total || 0);
          setTotalPages(Math.ceil((responseData.total || 0) / ITEMS_PER_PAGE));
        } else if (Array.isArray(responseData)) {
          listData = responseData;
          setTotalCount(responseData.length);
          setTotalPages(Math.ceil(responseData.length / ITEMS_PER_PAGE));
        }
      }

      if (Array.isArray(listData)) {
        const mappedList: ApplicationListItem[] = listData.map((app: ApplicationListVo) => ({
          id: app.id ?? '',
          name: app.name ?? '',
          description: app.description ?? '',
          icon: app.icon && /[\u{1F300}-\u{1F9FF}\u2600-\u26FF\u2700-\u27BF]/u.test(app.icon) ? app.icon : '🤖',
          status: (app.status as ApplicationStatusEnum) ?? ApplicationStatusEnum.DRAFT,
          isStarred: app.isStarred ?? false,
          tags: app.tags ?? [],
          visits: `${app.stats?.totalApiCalls ?? 0} 次调用`,
          agentIds: app.agents?.map(a => (a.id != null ? String(a.id) : undefined)).filter((id): id is string => !!id) ?? [],
          defaultAgentId: app.defaultAgent?.id != null ? String(app.defaultAgent.id) : undefined,
        }));
        setApplications(mappedList);
      } else {
        setApplications([]);
        setTotalCount(0);
        setTotalPages(1);
      }
    } catch (error: any) {
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

  useEffect(() => {
    loadCounts();
  }, []);

  /** 根据分类获取数量（来自 getApplicationCounts 接口） */
  const getCategoryCount = (category: string) => {
    if (category === 'all') return counts.total ?? 0;
    if (category === 'published') return counts.published ?? 0;
    if (category === 'paused') return counts.paused ?? 0;
    if (category === 'draft') return counts.draft ?? 0;
    if (category === 'starred') return counts.starred ?? 0;
    return 0;
  };

  /** 切换 Tab 并重置页码 */
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  /** 搜索变化 */
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  /** 星标筛选后的列表（客户端筛选） */
  const filteredApps = applications.filter(app => {
    if (activeTab === 'starred' && !app.isStarred) return false;
    return true;
  });

  /** 点击应用卡片进入详情 */
  const handleAppClick = (app: ApplicationListItem) => navigate(`/apps/${app.id}`);

  /** 切换星标（调用后端 star 接口） */
  const handleStarToggle = async (e: React.MouseEvent, appId: string) => {
    e.stopPropagation();
    const app = applications.find(a => a.id === appId);
    const newStarred = !(app?.isStarred ?? false);
    try {
      await Applications.starApplication(appId, { isStarred: newStarred });
      setApplications(prev =>
        prev.map(a => (a.id === appId ? { ...a, isStarred: newStarred } : a))
      );
      await loadCounts();
      toast.success(newStarred ? '已添加星标' : '已取消星标');
    } catch (error: any) {
      toast.error(error?.data?.message || error?.message || '操作失败');
    }
  };

  /** 修改应用状态（发布/暂停） */
  const handleStatusChange = async (appId: string, newStatus: ApplicationStatusEnum) => {
    try {
      await Applications.modifyApplicationStatus(appId, { status: newStatus });
      setApplications(prev =>
        prev.map(app => (app.id === appId ? { ...app, status: newStatus } : app))
      );
      const app = applications.find(a => a.id === appId);
      let msg = '';
      if (newStatus === ApplicationStatusEnum.PUBLISHED) msg = `${app?.name} 已发布`;
      else if (newStatus === ApplicationStatusEnum.PAUSED) msg = `${app?.name} 已暂停`;
      toast.success(msg);
      await Promise.all([loadApplications(), loadCounts()]);
    } catch (error: any) {
      toast.error(error?.data?.message || error?.message || '修改状态失败');
    }
  };

  /** 编辑 */
  const handleEdit = (app: ApplicationListItem) => navigate(`/apps/${app.id}/edit`);
  /** 设置 */
  const handleSettings = (app: ApplicationListItem) => navigate(`/apps/${app.id}/settings`);
  /** 分享 */
  const handleShare = (app: ApplicationListItem) => {
    setSelectedApp(app);
    setShareDialogOpen(true);
  };

  /** 更多操作：复制、删除 */
  const handleMoreAction = async (action: string, appId: string, appName: string) => {
    if (action === '复制') {
      try {
        await Applications.duplicateApplication(appId, { name: `${appName} 副本` });
        toast.success(`${appName} 已复制`);
        await Promise.all([loadApplications(), loadCounts()]);
      } catch (error: any) {
        toast.error(error?.data?.message || error?.message || '复制应用失败');
      }
    } else if (action === '删除') {
      try {
        await Applications.deleteApplication(appId);
        toast.success(`${appName} 已删除`);
        refreshResourcesBadge();
        // 延迟刷新，避免下拉关闭时 mouseup 落在卡片上触发导航
        await new Promise(resolve => setTimeout(resolve, 100));
        await Promise.all([loadApplications(), loadCounts()]);
      } catch (error: any) {
        toast.error(error?.data?.message || error?.message || '删除应用失败');
      }
    }
  };

  return {
    viewMode,
    setViewMode,
    activeTab,
    searchQuery,
    currentPage,
    setCurrentPage,
    shareDialogOpen,
    setShareDialogOpen,
    selectedApp,
    setSelectedApp,
    applications: filteredApps,
    isLoading,
    totalPages,
    totalCount,
    loadApplications,
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
  };
}
