import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { useLanguage } from '@/components/ui/LanguageProvider';
import { useDebounce } from '@/hooks/useDebounce';
import { safeParseInt } from '@/utils/FormatUtils';
import NotificationService from '@/services/Notification';
import {
  NotificationDetailVo,
  NotificationStatisticsVo,
  PageResultNotificationDetailVoResult,
  PageResultNotificationDetailVo
} from '@/services/NotificationTypes';
import {
  NotificationTypeEnum,
  NotificationPriorityEnum,
  NotificationCategoryEnum
} from '@/enums/enums';
import {
  ITEMS_PER_PAGE,
  SEARCH_DEBOUNCE_DELAY
} from '../notificationConstants';

/**
 * 通知数据管理 Hook
 * 负责通知列表的获取、筛选、操作等功能
 */
export function useNotificationsData () {
  const { t } = useLanguage();

  // 筛选条件状态
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<
    NotificationCategoryEnum | 'all'
  >('all');
  const [selectedType, setSelectedType] = useState<
    NotificationTypeEnum | 'all'
  >('all');
  const [selectedPriority, setSelectedPriority] = useState<
    NotificationPriorityEnum | 'all'
  >('all');
  const [isReadFilter, setIsReadFilter] = useState<boolean | undefined>(
    undefined
  );
  const [isStarredFilter, setIsStarredFilter] = useState<boolean | undefined>(
    undefined
  );
  const [isArchivedFilter, setIsArchivedFilter] = useState<boolean | undefined>(
    undefined
  );

  // 分页状态
  const [currentPage, setCurrentPage] = useState(1);

  // 数据状态
  const [notifications, setNotifications] = useState<NotificationDetailVo[]>(
    []
  );
  const [stats, setStats] = useState<NotificationStatisticsVo>({
    total: '0',
    unread: '0',
    starred: '0',
    archived: '0',
    todayNew: '0',
    comparedYesterday: '0'
  });

  // 加载状态
  const [loading, setLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(false);
  const [total, setTotal] = useState(0);

  // 防抖搜索关键词
  const debouncedSearchTerm = useDebounce(searchTerm, SEARCH_DEBOUNCE_DELAY);

  /**
   * 构建查询参数
   */
  const buildQuery = useCallback(
    (pageNo: number, pageSize: number) => {
      const query: Parameters<typeof NotificationService.listNotifications>[0] =
        {
          pageNo,
          pageSize
        };

      // 搜索关键词
      if (debouncedSearchTerm.trim()) {
        query.keyword = debouncedSearchTerm.trim();
      }

      // 根据分类设置筛选条件
      if (selectedCategory === NotificationCategoryEnum.UNREAD) {
        // 未读消息：isRead = false
        query.isRead = false;
        query.isArchived = false;
      } else if (selectedCategory === NotificationCategoryEnum.STARRED) {
        // 星标消息：isStarred = true
        query.isStarred = true;
        query.isArchived = false;
      } else if (selectedCategory === NotificationCategoryEnum.ARCHIVED) {
        // 已归档：isArchived = true
        query.isArchived = true;
      } else {
        // 全部消息：默认不显示已归档的
        query.isArchived = false;
      }

      // 类型筛选
      if (selectedType !== 'all') {
        query.type = selectedType;
      }

      // 优先级筛选
      if (selectedPriority !== 'all') {
        query.priority = selectedPriority;
      }

      return query;
    },
    [debouncedSearchTerm, selectedCategory, selectedType, selectedPriority]
  );

  /**
   * 获取通知列表
   */
  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const query = buildQuery(currentPage, ITEMS_PER_PAGE);
      const response = (await NotificationService.listNotifications(
        query
      )) as PageResultNotificationDetailVoResult;

      // 处理响应结构，使用正确的类型
      const responseData: PageResultNotificationDetailVo | undefined =
        response.data;
      if (responseData) {
        setNotifications(responseData.list || []);
        const totalValue = responseData.total;
        setTotal(safeParseInt(totalValue, 0));
      } else {
        setNotifications([]);
        setTotal(0);
      }
    } catch (error: any) {
      toast.error(
        (error as Error)?.message || t('notifications.fetchNotificationsFailed')
      );
      setNotifications([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [currentPage, buildQuery, t]);

  /**
   * 获取统计数据
   * 使用统计接口 getNotificationStatistics 获取 total、unread、starred、archived、todayNew、comparedYesterday
   */
  const fetchStatistics = useCallback(async () => {
    setStatsLoading(true);
    try {
      const response = await NotificationService.getNotificationStatistics();
      const data = response?.data as NotificationStatisticsVo | undefined;
      if (data && response?.code === 'S') {
        setStats({
          total: data.total ?? '0',
          unread: data.unread ?? '0',
          starred: data.starred ?? '0',
          archived: data.archived ?? '0',
          todayNew: data.todayNew ?? '0',
          comparedYesterday: data.comparedYesterday ?? '0'
        });
      }
    } catch (error: any) {
    } finally {
      setStatsLoading(false);
    }
  }, []);

  /**
   * 标记已读/未读
   */
  const handleToggleRead = useCallback(
    async (id: string) => {
      const notification = notifications.find(n => n.id === id);
      if (!notification) return;

      try {
        await NotificationService.updateReadStatus({
          notificationIds: [id],
          isRead: !notification.isRead
        });

        // 更新本地状态
        setNotifications(prev =>
          prev.map(n => (n.id === id ? { ...n, isRead: !n.isRead } : n))
        );

        toast.success(notification.isRead ? t('notifications.markedAsUnread') : t('notifications.markedAsRead'));

        // 刷新统计数据
        fetchStatistics();
      } catch (error: any) {
        toast.error(
          (error as Error)?.message || t('common.messages.updateFailed')
        );
      }
    },
    [notifications, t, fetchStatistics]
  );

  /**
   * 切换星标状态
   */
  const handleToggleStar = useCallback(
    async (id: string) => {
      const notification = notifications.find(n => n.id === id);
      if (!notification) return;

      try {
        await NotificationService.updateStarredStatus({
          notificationIds: [id],
          isStarred: !notification.isStarred
        });

        // 更新本地状态
        setNotifications(prev =>
          prev.map(n => (n.id === id ? { ...n, isStarred: !n.isStarred } : n))
        );

        toast.success(notification.isStarred ? t('notifications.starRemoved') : t('notifications.starAdded'));

        // 刷新统计数据
        fetchStatistics();
      } catch (error: any) {
        toast.error(
          (error as Error)?.message || t('common.messages.updateFailed')
        );
      }
    },
    [notifications, t, fetchStatistics]
  );

  /**
   * 归档通知
   */
  const handleArchive = useCallback(
    async (id: string) => {
      try {
        await NotificationService.archiveNotification({
          notificationIds: [id]
        });

        // 更新本地状态
        setNotifications(prev =>
          prev.map(n => (n.id === id ? { ...n, isArchived: true } : n))
        );

        toast.success(t('notifications.archived'));

        // 刷新列表和统计数据
        fetchNotifications();
        fetchStatistics();
      } catch (error: any) {
        toast.error(
          (error as Error)?.message || t('notifications.archiveFailed')
        );
      }
    },
    [t, fetchNotifications, fetchStatistics]
  );

  /**
   * 删除通知
   */
  const handleDelete = useCallback(
    async (id: string) => {
      try {
        await NotificationService.deleteNotification({
          notificationIds: [id]
        });

        // 更新本地状态
        setNotifications(prev => prev.filter(n => n.id !== id));

        toast.success(t('notifications.deleted'));

        // 刷新统计数据
        fetchStatistics();

        // 如果当前页没有数据了，回到上一页
        if (notifications.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        } else {
          fetchNotifications();
        }
      } catch (error: any) {
        toast.error(
          (error as Error)?.message || t('common.messages.deleteFailed')
        );
      }
    },
    [
      notifications.length,
      currentPage,
      t,
      fetchNotifications,
      fetchStatistics
    ]
  );

  /**
   * 全部标记为已读
   */
  const handleMarkAllRead = useCallback(async () => {
    try {
      await NotificationService.markAllAsRead();

      toast.success(t('notifications.allMarkedAsRead'));

      // 刷新列表和统计数据
      fetchNotifications();
      fetchStatistics();
    } catch (error: any) {
      toast.error(
        (error as Error)?.message || t('notifications.operationFailed')
      );
    }
  }, [t, fetchNotifications, fetchStatistics]);

  /**
   * 刷新数据
   */
  const handleRefresh = useCallback(() => {
    fetchNotifications();
    fetchStatistics();
    toast.success(t('notifications.refreshed'));
  }, [t, fetchNotifications, fetchStatistics]);

  /**
   * 切换分类
   */
  const handleCategoryChange = useCallback(
    (category: NotificationCategoryEnum | 'all') => {
      setSelectedCategory(category);
      // 重置筛选条件
      if (category === 'all') {
        setIsArchivedFilter(undefined);
        setIsReadFilter(undefined);
        setIsStarredFilter(undefined);
      } else if (category === NotificationCategoryEnum.UNREAD) {
        setIsArchivedFilter(false);
        setIsReadFilter(false);
        setIsStarredFilter(undefined);
      } else if (category === NotificationCategoryEnum.STARRED) {
        setIsArchivedFilter(false);
        setIsReadFilter(undefined);
        setIsStarredFilter(true);
      } else if (category === NotificationCategoryEnum.ARCHIVED) {
        setIsArchivedFilter(true);
        setIsReadFilter(undefined);
        setIsStarredFilter(undefined);
      }
    },
    []
  );

  // 监听筛选条件变化，重置页码
  useEffect(() => {
    setCurrentPage(1);
  }, [
    selectedCategory,
    selectedType,
    selectedPriority,
    isReadFilter,
    isStarredFilter,
    isArchivedFilter,
    debouncedSearchTerm
  ]);

  // 获取通知列表
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // 获取统计数据（当筛选条件改变时更新，但不包括分类切换）
  // 注意：统计查询不受分类影响，切换分类时不需要刷新统计，避免不必要的请求和loading效果
  useEffect(() => {
    fetchStatistics();
  }, [fetchStatistics]);

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  return {
    // 状态
    searchTerm,
    setSearchTerm,
    selectedCategory,
    selectedType,
    setSelectedType,
    selectedPriority,
    setSelectedPriority,
    currentPage,
    setCurrentPage,
    notifications,
    stats,
    loading,
    statsLoading,
    total,
    totalPages,

    // 操作方法
    handleToggleRead,
    handleToggleStar,
    handleArchive,
    handleDelete,
    handleMarkAllRead,
    handleRefresh,
    handleCategoryChange
  };
}
