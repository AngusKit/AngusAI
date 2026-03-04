import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { useLanguage } from '@/components/ui/LanguageProvider.tsx';
import { useDebounce } from '@/hooks/useDebounce.ts';
import { safeParseInt } from '@/utils/FormatUtils.ts';
import NotificationService from '@/services/Notification.ts';
import {
  NotificationDetailVo,
  NotificationStatisticsVo,
  PageResultNotificationDetailVoResult,
  PageResultNotificationDetailVo
} from '@/services/NotificationTypes.ts';
import {
  NotificationTypeEnum,
  NotificationPriorityEnum,
  NotificationCategoryEnum
} from '@/enums/enums.ts';
import { ITEMS_PER_PAGE, SEARCH_DEBOUNCE_DELAY } from '../notificationConstants.ts';

export function useNotificationsData () {
  const { t } = useLanguage();

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

  const [currentPage, setCurrentPage] = useState(1);
  const [notifications, setNotifications] = useState<NotificationDetailVo[]>([]);
  const [stats, setStats] = useState<NotificationStatisticsVo>({
    total: '0',
    unread: '0',
    starred: '0',
    archived: '0',
    todayNew: '0',
    comparedYesterday: '0'
  });
  const [loading, setLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(false);
  const [total, setTotal] = useState(0);

  const debouncedSearchTerm = useDebounce(searchTerm, SEARCH_DEBOUNCE_DELAY);

  const buildQuery = useCallback(
    (pageNo: number, pageSize: number) => {
      const query: Parameters<typeof NotificationService.listNotifications>[0] = {
        pageNo,
        pageSize
      };
      if (debouncedSearchTerm.trim()) {
        query.keyword = debouncedSearchTerm.trim();
      }
      if (selectedCategory === NotificationCategoryEnum.UNREAD) {
        query.isRead = false;
        query.isArchived = false;
      } else if (selectedCategory === NotificationCategoryEnum.STARRED) {
        query.isStarred = true;
        query.isArchived = false;
      } else if (selectedCategory === NotificationCategoryEnum.ARCHIVED) {
        query.isArchived = true;
      } else {
        query.isArchived = false;
      }
      if (selectedType !== 'all') query.type = selectedType;
      if (selectedPriority !== 'all') query.priority = selectedPriority;
      return query;
    },
    [debouncedSearchTerm, selectedCategory, selectedType, selectedPriority]
  );

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const query = buildQuery(currentPage, ITEMS_PER_PAGE);
      const response = (await NotificationService.listNotifications(query)) as PageResultNotificationDetailVoResult;
      const responseData: PageResultNotificationDetailVo | undefined = response.data;
      if (responseData) {
        setNotifications(responseData.list || []);
        setTotal(safeParseInt(responseData.total, 0));
      } else {
        setNotifications([]);
        setTotal(0);
      }
    } catch (error: unknown) {
      toast.error((error as Error)?.message || t('notifications.fetchNotificationsFailed'));
      setNotifications([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [currentPage, buildQuery, t]);

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
    } catch {
      /* ignore */
    } finally {
      setStatsLoading(false);
    }
  }, []);

  const handleToggleRead = useCallback(
    async (id: string) => {
      const notification = notifications.find(n => n.id === id);
      if (!notification) return;
      try {
        await NotificationService.updateReadStatus({
          notificationIds: [id],
          isRead: !notification.isRead
        });
        setNotifications(prev =>
          prev.map(n => (n.id === id ? { ...n, isRead: !n.isRead } : n))
        );
        toast.success(notification.isRead ? t('notifications.markedAsUnread') : t('notifications.markedAsRead'));
        fetchStatistics();
      } catch (error: unknown) {
        toast.error((error as Error)?.message || t('common.messages.updateFailed'));
      }
    },
    [notifications, t, fetchStatistics]
  );

  const handleToggleStar = useCallback(
    async (id: string) => {
      const notification = notifications.find(n => n.id === id);
      if (!notification) return;
      try {
        await NotificationService.updateStarredStatus({
          notificationIds: [id],
          isStarred: !notification.isStarred
        });
        setNotifications(prev =>
          prev.map(n => (n.id === id ? { ...n, isStarred: !n.isStarred } : n))
        );
        toast.success(notification.isStarred ? t('notifications.starRemoved') : t('notifications.starAdded'));
        fetchStatistics();
      } catch (error: unknown) {
        toast.error((error as Error)?.message || t('common.messages.updateFailed'));
      }
    },
    [notifications, t, fetchStatistics]
  );

  const handleArchive = useCallback(
    async (id: string) => {
      try {
        await NotificationService.archiveNotification({ notificationIds: [id] });
        setNotifications(prev =>
          prev.map(n => (n.id === id ? { ...n, isArchived: true } : n))
        );
        toast.success(t('notifications.archived'));
        fetchNotifications();
        fetchStatistics();
      } catch (error: unknown) {
        toast.error((error as Error)?.message || t('notifications.archiveFailed'));
      }
    },
    [t, fetchNotifications, fetchStatistics]
  );

  const handleDelete = useCallback(
    async (id: string) => {
      try {
        await NotificationService.deleteNotification({ notificationIds: [id] });
        setNotifications(prev => prev.filter(n => n.id !== id));
        toast.success(t('notifications.deleted'));
        fetchStatistics();
        if (notifications.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        } else {
          fetchNotifications();
        }
      } catch (error: unknown) {
        toast.error((error as Error)?.message || t('common.messages.deleteFailed'));
      }
    },
    [notifications.length, currentPage, t, fetchNotifications, fetchStatistics]
  );

  const handleMarkAllRead = useCallback(async () => {
    try {
      await NotificationService.markAllAsRead();
      toast.success(t('notifications.allMarkedAsRead'));
      fetchNotifications();
      fetchStatistics();
    } catch (error: unknown) {
      toast.error((error as Error)?.message || t('notifications.operationFailed'));
    }
  }, [t, fetchNotifications, fetchStatistics]);

  const handleRefresh = useCallback(() => {
    fetchNotifications();
    fetchStatistics();
    toast.success(t('notifications.refreshed'));
  }, [t, fetchNotifications, fetchStatistics]);

  const handleCategoryChange = useCallback(
    (category: NotificationCategoryEnum | 'all') => {
      setSelectedCategory(category);
    },
    []
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, selectedType, selectedPriority, debouncedSearchTerm]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  useEffect(() => {
    fetchStatistics();
  }, [fetchStatistics]);

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  return {
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
    handleToggleRead,
    handleToggleStar,
    handleArchive,
    handleDelete,
    handleMarkAllRead,
    handleRefresh,
    handleCategoryChange
  };
}
