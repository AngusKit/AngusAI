import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLanguage } from '@/components/LanguageProvider';
import { useDebounce } from '@/hooks/useDebounce';
import { toast } from 'sonner';
import { Activity, User, FileText, CheckCircle } from 'lucide-react';
import ActivityService from '@/services/Activity';
import {
  ActivityDetailVo,
  ActivityListOrderByEnum,
  ActivityStatisticsVo,
  SimpleStatisticsDto,
} from '@/services/ActivityTypes';
import { generateActivityId } from '../utils';

const ITEMS_PER_PAGE = 20;

/** 从描述/详情文本中推断操作类型 */
function inferActionType(record: ActivityDetailVo): string {
  const candidates = `${record.description ?? ''}${record.detail ?? ''}`;
  if (/创建|create/i.test(candidates)) return 'CREATE';
  if (/更新|修改|update/i.test(candidates)) return 'UPDATE';
  if (/删除|remove|delete/i.test(candidates)) return 'DELETE';
  if (/分享|share/i.test(candidates)) return 'SHARE';
  if (/导出|export/i.test(candidates)) return 'EXPORT';
  if (/导入|import/i.test(candidates)) return 'IMPORT';
  if (/执行|run|execute/i.test(candidates)) return 'EXECUTE';
  if (/查看|浏览|view/i.test(candidates)) return 'VIEW';
  return 'UNKNOWN';
}

/** 从接口状态或描述/详情文本推断状态（返回小写便于 UI 展示） */
function inferStatus(record: ActivityDetailVo): string {
  if (record.status) {
    const s = String(record.status).toLowerCase();
    if (s === 'failed') return 'failed';
    if (s === 'warning') return 'warning';
    return 'success';
  }
  const candidates = `${record.description ?? ''}${record.detail ?? ''}`;
  if (/失败|fail|error/i.test(candidates)) return 'failed';
  if (/警告|warning/i.test(candidates)) return 'warning';
  return 'success';
}

/** 将接口数据映射为 ActivityDetailVo（补全推断字段与兼容旧字段） */
function mapToActivityDetailVo(item: ActivityDetailVo): ActivityDetailVo {
  const actionType = item.actionType ?? inferActionType(item);
  const status = inferStatus(item);
  const avatarFallback = item.userAvatar ?? item.userAvatarFallback ?? (item.userName ? item.userName.slice(0, 2).toUpperCase() : 'NA');
  return {
    ...item,
    id: item.id ? String(item.id) : generateActivityId(),
    userId: item.userId ? String(item.userId) : undefined,
    userName: item.userName ?? '',
    userAvatar: item.userAvatar ?? avatarFallback,
    userAvatarFallback: item.userAvatarFallback ?? avatarFallback,
    resourceId: item.resourceId ? String(item.resourceId) : undefined,
    resourceType: item.resourceType ?? undefined,
    resourceName: item.resourceName ?? undefined,
    activityDate: item.activityDate ?? '',
    description: item.description ?? '',
    actionType,
    status,
  };
}

/** 获取统计默认日期范围（最近30天） */
function getDefaultStatDateRange(): SimpleStatisticsDto {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - 30);
  return {
    startDate: start.toISOString().slice(0, 10),
    endDate: end.toISOString().slice(0, 10),
  };
}

/**
 * 活动记录页面的数据与状态管理 Hook
 * 负责：加载活动列表、统计数据、筛选、分页、日期范围切换
 */
export function useActivityLog() {
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const [selectedTargetType, setSelectedTargetType] = useState('all');
  const [selectedActionType, setSelectedActionType] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedActivity, setSelectedActivity] = useState<ActivityDetailVo | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [activities, setActivities] = useState<ActivityDetailVo[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false);
  const [statistics, setStatistics] = useState<ActivityStatisticsVo | null>(null);
  const [statisticsLoading, setStatisticsLoading] = useState(false);
  const [statDateRange, setStatDateRange] = useState<SimpleStatisticsDto>(getDefaultStatDateRange);

  /** 加载活动列表 */
  const loadActivities = useCallback(async () => {
    setLoading(true);
    try {
      const response = await ActivityService.activityList({
        keyword: debouncedSearchQuery.trim() || undefined,
        pageNo: currentPage,
        pageSize: ITEMS_PER_PAGE,
        resourceType: selectedTargetType !== 'all' ? selectedTargetType : undefined,
        detail: selectedActionType !== 'all' ? selectedActionType : undefined,
        orderBy: ActivityListOrderByEnum.ActivityDate,
      });
      const responseData = (response as any).data;
      const listData = responseData?.list;
      setTotalRecords(responseData?.total ?? listData?.length ?? 0);
      const mapped = listData?.map(mapToActivityDetailVo) ?? [];
      setActivities(mapped);
    } catch (error: any) {
      console.error('加载活动记录失败:', error);
      toast.error(error?.message || (language === 'zh-CN' ? '加载活动记录失败' : 'Failed to load activity logs'));
    } finally {
      setLoading(false);
    }
  }, [
    currentPage,
    debouncedSearchQuery,
    language,
    selectedActionType,
    selectedTargetType,
  ]);

  /** 筛选或搜索变化时重置到第一页 */
  useEffect(() => {
    setCurrentPage(prev => (prev === 1 ? prev : 1));
  }, [selectedTargetType, selectedActionType]);

  useEffect(() => {
    setCurrentPage(prev => (prev === 1 ? prev : 1));
  }, [debouncedSearchQuery]);

  useEffect(() => {
    loadActivities();
  }, [loadActivities]);

  /** 加载统计数据 */
  const loadStatistics = useCallback(async () => {
    setStatisticsLoading(true);
    try {
      const response = await ActivityService.getActivityStatistics(statDateRange);
      const data = (response as any)?.data;
      setStatistics(data ?? null);
    } catch (error: any) {
      console.error('加载统计失败:', error);
      toast.error(error?.message || (language === 'zh-CN' ? '加载统计失败' : 'Failed to load statistics'));
    } finally {
      setStatisticsLoading(false);
    }
  }, [statDateRange, language]);

  useEffect(() => {
    loadStatistics();
  }, [loadStatistics]);

  /** 切换统计日期范围（今日/最近7天/最近30天） */
  const handleStatDateRangeChange = useCallback((preset: 'today' | 'week' | 'month') => {
    const end = new Date();
    const start = new Date();
    if (preset === 'today') {
      start.setHours(0, 0, 0, 0);
    } else if (preset === 'week') {
      start.setDate(start.getDate() - 7);
    } else {
      start.setDate(start.getDate() - 30);
    }
    setStatDateRange({
      startDate: start.toISOString().slice(0, 10),
      endDate: end.toISOString().slice(0, 10),
    });
  }, []);

  /** 客户端二次筛选（如按推断的操作类型） */
  const filteredActivities = useMemo(() => {
    if (selectedActionType === 'all') return activities;
    return activities.filter(a => a.actionType === selectedActionType);
  }, [activities, selectedActionType]);

  /** 总页数（服务端已分页） */
  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(totalRecords / ITEMS_PER_PAGE)),
    [totalRecords]
  );

  /** 统计卡片配置（含今日活动、活跃用户、成功率、总活动数） */
  const statsCards = useMemo(() => {
    const overview = statistics?.overview;
    const todayActivities = overview?.todayActivities ?? 0;
    const activeUsers = overview?.activeUsers ?? 0;
    const rawRate = overview?.successRate;
    const successRate =
      rawRate != null && !Number.isNaN(Number(rawRate))
        ? `${Number(rawRate).toFixed(1)}%`
        : '--';
    const totalActivities = overview?.totalActivities ?? 0;
    const isLoading = statisticsLoading;

    return [
      {
        key: 'todayActivities',
        label: language === 'zh-CN' ? '今日活动' : 'Activities Today',
        value: isLoading ? '--' : todayActivities.toLocaleString(),
        icon: Activity,
        iconBg: 'bg-blue-500',
      },
      {
        key: 'activeUsers',
        label: language === 'zh-CN' ? '活跃用户' : 'Active Users',
        value: isLoading ? '--' : activeUsers.toLocaleString(),
        icon: User,
        iconBg: 'bg-green-500',
      },
      {
        key: 'successRate',
        label: language === 'zh-CN' ? '操作成功率' : 'Success Rate',
        value: isLoading ? '--' : successRate,
        icon: CheckCircle,
        iconBg: 'bg-purple-500',
      },
      {
        key: 'totalActivities',
        label: language === 'zh-CN' ? '总活动数' : 'Total Activities',
        value: isLoading ? '--' : totalActivities.toLocaleString(),
        icon: FileText,
        iconBg: 'bg-orange-500',
      },
    ];
  }, [statistics, language, statisticsLoading]);

  /** 清除所有筛选条件 */
  const clearFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedTargetType('all');
    setSelectedActionType('all');
  }, []);

  return {
    language,
    searchQuery,
    setSearchQuery,
    selectedTargetType,
    setSelectedTargetType,
    selectedActionType,
    setSelectedActionType,
    currentPage,
    setCurrentPage,
    selectedActivity,
    setSelectedActivity,
    showDetailDialog,
    setShowDetailDialog,
    loading,
    filteredActivities,
    totalPages,
    statsCards,
    handleStatDateRangeChange,
    loadActivities,
    clearFilters,
  };
}
