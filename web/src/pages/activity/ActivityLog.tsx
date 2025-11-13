import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLanguage } from '@/components/ui/LanguageProvider';
import { Activity, Search, User, FileText, Database, Workflow, Brain, Settings, Trash2, Edit, Plus, Eye, Share2, Upload, Download, Clock, ChevronRight, AlertCircle, CheckCircle, XCircle, Info, } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, } from '@/components/ui/pagination';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { useDebounce } from '@/hooks/useDebounce';
import ActivityService from '@/services/Activity';
import { ActivityDetailVo, ActivityListOrderByEnum } from '@/services/ActivityTypes';

interface ActivityRecord {
  id: string;
  userId?: string;
  userName: string;
  userAvatar: string;
  targetId?: string;
  targetType: string;
  targetName: string;
  activityDate: string;
  description: string;
  detail?: string;
  actionType: string;
  status: 'success' | 'failed' | 'warning';
}

// 目标类型映射
type TargetTypeKey =
  | 'APPLICATION'
  | 'WORKFLOW'
  | 'KNOWLEDGE_BASE'
  | 'DATASET'
  | 'MODEL'
  | 'TEAM_MEMBER'
  | 'API_KEY'
  | 'PROMPT';

const targetTypeMap: Record<TargetTypeKey, { labelZh: string; labelEn: string; icon: any; color: string }> = {
  APPLICATION: { labelZh: '应用', labelEn: 'Application', icon: Brain, color: 'text-blue-500' },
  WORKFLOW: { labelZh: '工作流', labelEn: 'Workflow', icon: Workflow, color: 'text-purple-500' },
  KNOWLEDGE_BASE: { labelZh: '知识库', labelEn: 'Knowledge Base', icon: Database, color: 'text-green-500' },
  DATASET: { labelZh: '数据集', labelEn: 'Dataset', icon: FileText, color: 'text-orange-500' },
  MODEL: { labelZh: '模型', labelEn: 'Model', icon: Settings, color: 'text-indigo-500' },
  TEAM_MEMBER: { labelZh: '团队成员', labelEn: 'Team Member', icon: User, color: 'text-pink-500' },
  API_KEY: { labelZh: 'API密钥', labelEn: 'API Key', icon: Settings, color: 'text-red-500' },
  PROMPT: { labelZh: '提示词', labelEn: 'Prompt', icon: FileText, color: 'text-cyan-500' },
};

type ActionTypeKey = 'CREATE' | 'UPDATE' | 'DELETE' | 'VIEW' | 'SHARE' | 'EXPORT' | 'IMPORT' | 'EXECUTE' | 'UNKNOWN';

const actionTypeMap: Record<ActionTypeKey, { labelZh: string; labelEn: string; icon: any; color: string }> = {
  CREATE: { labelZh: '创建', labelEn: 'Create', icon: Plus, color: 'text-green-500' },
  UPDATE: { labelZh: '更新', labelEn: 'Update', icon: Edit, color: 'text-blue-500' },
  DELETE: { labelZh: '删除', labelEn: 'Delete', icon: Trash2, color: 'text-red-500' },
  VIEW: { labelZh: '查看', labelEn: 'View', icon: Eye, color: 'text-gray-500' },
  SHARE: { labelZh: '分享', labelEn: 'Share', icon: Share2, color: 'text-purple-500' },
  EXPORT: { labelZh: '导出', labelEn: 'Export', icon: Download, color: 'text-indigo-500' },
  IMPORT: { labelZh: '导入', labelEn: 'Import', icon: Upload, color: 'text-orange-500' },
  EXECUTE: { labelZh: '执行', labelEn: 'Execute', icon: Activity, color: 'text-cyan-500' },
  UNKNOWN: { labelZh: '其他', labelEn: 'Other', icon: Info, color: 'text-gray-500' },
};

const orderedActionTypes: ActionTypeKey[] = [
  'CREATE',
  'UPDATE',
  'DELETE',
  'VIEW',
  'SHARE',
  'EXPORT',
  'IMPORT',
  'EXECUTE',
];

const generateActivityId = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

export function ActivityLog() {
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const [selectedUser, setSelectedUser] = useState('all');
  const [selectedTargetType, setSelectedTargetType] = useState('all');
  const [selectedActionType, setSelectedActionType] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedActivity, setSelectedActivity] = useState<ActivityRecord | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  const [retentionDays, setRetentionDays] = useState(90); // 默认保存90天
  const [tempRetentionDays, setTempRetentionDays] = useState(90);
  const itemsPerPage = 20;
  const [activities, setActivities] = useState<ActivityRecord[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [availableUsers, setAvailableUsers] = useState<{ value: string; label: string }[]>([]);
  const [loading, setLoading] = useState(false);

  const inferActionType = useCallback((record: ActivityDetailVo): string => {
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
  }, []);

  const inferStatus = useCallback((record: ActivityDetailVo): ActivityRecord['status'] => {
    const candidates = `${record.description ?? ''}${record.detail ?? ''}`;
    if (/失败|fail|error/i.test(candidates)) {
      return 'failed';
    }
    if (/警告|warning/i.test(candidates)) {
      return 'warning';
    }
    return 'success';
  }, []);

  const loadActivities = useCallback(async () => {
    setLoading(true);
    try {
      const response = await ActivityService.activityList({
        keyword: debouncedSearchQuery.trim() || undefined,
        pageNo: currentPage,
        pageSize: itemsPerPage,
        userId: selectedUser !== 'all' ? selectedUser : undefined,
        resourceType: selectedTargetType !== 'all' ? selectedTargetType : undefined,
        detail: selectedActionType !== 'all' ? selectedActionType : undefined,
        orderBy: ActivityListOrderByEnum.ActivityDate,
      });

      const responseData = (response as any).data;
      let listData: ActivityDetailVo[] | undefined;
      if (responseData) {
        listData = responseData.list;
      }

      setTotalRecords(responseData?.total ?? listData?.length ?? 0);

      const mapped =
        listData?.map(item => {
          const actionType = inferActionType(item);
          const status = inferStatus(item);
          const avatarFallback = item.userAvatar ?? (item.userName ? item.userName.slice(0, 2).toUpperCase() : 'NA');
          return {
            id: item.id ? String(item.id) : generateActivityId(),
            userId: item.userId ? String(item.userId) : undefined,
            userName: item.userName ?? '',
            userAvatar: avatarFallback,
            targetId: item.targetId ? String(item.targetId) : undefined,
            targetType: item.targetType ?? '',
            targetName: item.targetName ?? '',
            activityDate: item.activityDate ?? '',
            description: item.description ?? '',
            detail: item.detail ?? '',
            actionType,
            status,
          };
        }) ?? [];

      setActivities(mapped);

      const userOptions = Array.from(
        new Map(
          mapped
            .filter(item => item.userId && item.userName)
            .map(item => [item.userId!, { value: item.userId!, label: item.userName! }])
        ).values()
      );
      setAvailableUsers(userOptions);
      if (selectedUser !== 'all' && userOptions.every(option => option.value !== selectedUser)) {
        setSelectedUser('all');
      }
    } catch (error: any) {
      console.error('Failed to load activity logs:', error);
      toast.error(error?.message || (language === 'zh-CN' ? '加载活动记录失败' : 'Failed to load activity logs'));
    } finally {
      setLoading(false);
    }
  }, [
    currentPage,
    debouncedSearchQuery,
    inferActionType,
    inferStatus,
    itemsPerPage,
    language,
    selectedActionType,
    selectedTargetType,
    selectedUser,
  ]);

  useEffect(() => {
    setCurrentPage(prev => (prev === 1 ? prev : 1));
  }, [selectedUser, selectedTargetType, selectedActionType]);

  useEffect(() => {
    setCurrentPage(prev => (prev === 1 ? prev : 1));
  }, [debouncedSearchQuery]);

  useEffect(() => {
    loadActivities();
  }, [loadActivities]);

  // 客户端补充筛选（例如动作类型推断）
  const filteredActivities = useMemo(() => {
    if (selectedActionType === 'all') {
      return activities;
    }
    return activities.filter(activity => activity.actionType === selectedActionType);
  }, [activities, selectedActionType]);

  // 分页信息（后端已分页，totalRecords 来源于服务端）
  const totalPages = useMemo(() => Math.max(1, Math.ceil(totalRecords / itemsPerPage)), [itemsPerPage, totalRecords]);
  const paginatedActivities = filteredActivities;

  const statsCards = useMemo(() => {
    const today = new Date();
    const todayISO = today.toISOString().slice(0, 10);
    const todayCount = activities.filter(activity => {
      if (!activity.activityDate) return false;
      try {
        return new Date(activity.activityDate).toISOString().slice(0, 10) === todayISO;
      } catch {
        return false;
      }
    }).length;

    const uniqueUsers = new Set(
      activities.filter(activity => activity.userId).map(activity => activity.userId as string)
    ).size;

    const successCount = activities.filter(activity => activity.status !== 'failed').length;
    const successRate = activities.length > 0 ? `${((successCount / activities.length) * 100).toFixed(1)}%` : '--';

    return [
      {
        key: 'todayActivities',
        label: language === 'zh-CN' ? '今日活动' : 'Activities Today',
        value: loading ? '--' : todayCount.toString(),
        icon: Activity,
        iconBg: 'bg-blue-500',
      },
      {
        key: 'activeUsers',
        label: language === 'zh-CN' ? '活跃用户' : 'Active Users',
        value: loading ? '--' : uniqueUsers.toString(),
        icon: User,
        iconBg: 'bg-green-500',
      },
      {
        key: 'successRate',
        label: language === 'zh-CN' ? '操作成功率' : 'Success Rate',
        value: loading ? '--' : successRate,
        icon: CheckCircle,
        iconBg: 'bg-purple-500',
      },
      {
        key: 'totalRecords',
        label: language === 'zh-CN' ? '总记录数' : 'Total Records',
        value: loading ? '--' : totalRecords.toLocaleString(),
        icon: FileText,
        iconBg: 'bg-orange-500',
      },
    ];
  }, [activities, language, loading, totalRecords]);

  const handleViewDetail = (activity: ActivityRecord) => {
    setSelectedActivity(activity);
    setShowDetailDialog(true);
  };

  const handleOpenSettings = () => {
    setTempRetentionDays(retentionDays);
    setShowSettingsDialog(true);
  };

  const handleSaveSettings = () => {
    setRetentionDays(tempRetentionDays);
    setShowSettingsDialog(false);
    toast.success(
      language === 'zh-CN'
        ? `活动记录保留期限已设置为 ${tempRetentionDays} 天`
        : `Retention period set to ${tempRetentionDays} days`
    );
  };

  const getActionIcon = (actionType: string) => {
    const action = actionTypeMap[actionType as ActionTypeKey];
    if (!action) return Activity;
    return action.icon;
  };

  const getActionLabel = (actionType: string) => {
    const action = actionTypeMap[actionType as ActionTypeKey];
    if (!action) {
      return actionType;
    }
    return language === 'zh-CN' ? action.labelZh : action.labelEn;
  };

  const getActionColor = (actionType: string) => {
    return actionTypeMap[actionType as ActionTypeKey]?.color || 'text-gray-500';
  };

  const getTargetIcon = (targetType: string) => {
    const target = targetTypeMap[targetType as TargetTypeKey];
    if (!target) return FileText;
    return target.icon;
  };

  const getTargetLabel = (targetType: string) => {
    const target = targetTypeMap[targetType as TargetTypeKey];
    if (!target) {
      return targetType;
    }
    return language === 'zh-CN' ? target.labelZh : target.labelEn;
  };

  const getTargetColor = (targetType: string) => {
    return targetTypeMap[targetType as TargetTypeKey]?.color || 'text-gray-500';
  };

  const getStatusBadge = (status?: string) => {
    if (!status || status === 'success') {
      return (
        <Badge className='bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-0'>
          <CheckCircle className='w-3 h-3 mr-1' />
          {language === 'zh-CN' ? '成功' : 'Success'}
        </Badge>
      );
    }
    if (status === 'failed') {
      return (
        <Badge className='bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-0'>
          <XCircle className='w-3 h-3 mr-1' />
          {language === 'zh-CN' ? '失败' : 'Failed'}
        </Badge>
      );
    }
    if (status === 'warning') {
      return (
        <Badge className='bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border-0'>
          <AlertCircle className='w-3 h-3 mr-1' />
          {language === 'zh-CN' ? '警告' : 'Warning'}
        </Badge>
      );
    }
    return null;
  };

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-2xl dark:text-white mb-1'>{language === 'zh-CN' ? '活动记录' : 'Activity Log'}</h1>
            <p className='text-sm text-gray-600 dark:text-gray-400'>
              {language === 'zh-CN'
                ? `查看团队成员的所有操作活动记录 · 当前保留 ${retentionDays} 天记录`
                : `Review all team activity. Currently retaining ${retentionDays} days of history.`}
            </p>
          </div>
          <Button
            onClick={handleOpenSettings}
            variant='outline'
            className='dark:bg-gray-900 dark:border-gray-700 dark:text-white'
          >
            <Settings className='w-4 h-4 mr-2' />
            {language === 'zh-CN' ? '记录设置' : 'Log Settings'}
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
        {statsCards.map(card => {
          const Icon = card.icon;
          return (
            <Card key={card.key} className='p-6 dark:bg-gray-900 dark:border-gray-800'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm text-gray-600 dark:text-gray-400 mb-1'>{card.label}</p>
                  <p className='text-2xl dark:text-white'>{card.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${card.iconBg}`}>
                  <Icon className='w-6 h-6 text-white' />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Filters */}
      <Card className='p-6 dark:bg-gray-900 dark:border-gray-800'>
        <div className='flex gap-2'>
          {/* Search */}
          <div className='flex-1'>
            <div className='md:col-span-2 w-[300px]'>
              <div className='relative'>
                <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4' />
                <Input
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder={language === 'zh-CN' ? '搜索用户、目标或操作...' : 'Search users, targets, or actions...'}
                  className='pl-10 dark:bg-gray-800 dark:border-gray-700 dark:text-white'
                />
              </div>
            </div>
          </div>

          {/* User Filter */}
          <div>
            <Select value={selectedUser} onValueChange={value => setSelectedUser(value)}>
              <SelectTrigger className='dark:bg-gray-800 dark:border-gray-700 dark:text-white'>
                <SelectValue placeholder={language === 'zh-CN' ? '所有用户' : 'All Users'} />
              </SelectTrigger>
              <SelectContent className='dark:bg-gray-800 dark:border-gray-700'>
                <SelectItem value='all' className='dark:text-white'>
                  所有用户
                </SelectItem>
                {availableUsers.length === 0 ? (
                  <SelectItem value='__none__' disabled className='dark:text-gray-400'>
                    {language === 'zh-CN' ? '暂无数据' : 'No options'}
                  </SelectItem>
                ) : (
                  availableUsers.map(user => (
                    <SelectItem key={user.value} value={user.value} className='dark:text-white'>
                      {user.label || user.value}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Target Type Filter */}
          <div>
            <Select value={selectedTargetType} onValueChange={setSelectedTargetType}>
              <SelectTrigger className='dark:bg-gray-800 dark:border-gray-700 dark:text-white'>
                <SelectValue placeholder={language === 'zh-CN' ? '所有类型' : 'All Types'} />
              </SelectTrigger>
              <SelectContent className='dark:bg-gray-800 dark:border-gray-700'>
                <SelectItem value='all' className='dark:text-white'>
                  {language === 'zh-CN' ? '所有类型' : 'All Types'}
                </SelectItem>
                {Object.entries(targetTypeMap).map(([key, meta]) => (
                  <SelectItem key={key} value={key} className='dark:text-white'>
                    {language === 'zh-CN' ? meta.labelZh : meta.labelEn}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Action Type Filter */}
          <div>
            <Select value={selectedActionType} onValueChange={setSelectedActionType}>
              <SelectTrigger className='dark:bg-gray-800 dark:border-gray-700 dark:text-white'>
                <SelectValue placeholder={language === 'zh-CN' ? '所有操作' : 'All Actions'} />
              </SelectTrigger>
              <SelectContent className='dark:bg-gray-800 dark:border-gray-700'>
                <SelectItem value='all' className='dark:text-white'>
                  {language === 'zh-CN' ? '所有操作' : 'All Actions'}
                </SelectItem>
                <SelectItem value='UNKNOWN' className='dark:text-white'>
                  {language === 'zh-CN' ? actionTypeMap.UNKNOWN.labelZh : actionTypeMap.UNKNOWN.labelEn}
                </SelectItem>
                {orderedActionTypes.map(key => (
                  <SelectItem key={key} value={key} className='dark:text-white'>
                    {language === 'zh-CN' ? actionTypeMap[key].labelZh : actionTypeMap[key].labelEn}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className='flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700'>
          <p className='text-sm text-gray-600 dark:text-gray-400'>
            {language === 'zh-CN' ? '找到 ' : 'Found '}
            <span className='dark:text-white'>
              {selectedActionType === 'all' ? totalRecords : filteredActivities.length}
            </span>
            {language === 'zh-CN' ? ' 条记录' : ' records'}
          </p>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => {
              setSearchQuery('');
              setSelectedUser('all');
              setSelectedTargetType('all');
              setSelectedActionType('all');
            }}
            className='dark:text-gray-400 dark:hover:text-white'
          >
            {language === 'zh-CN' ? '清除筛选' : 'Clear Filters'}
          </Button>
        </div>
      </Card>

      {/* Activity List */}
      <Card className='dark:bg-gray-900 dark:border-gray-800'>
        <ScrollArea className='h-[600px]'>
          <div className='divide-y divide-gray-200 dark:divide-gray-800'>
            {paginatedActivities.map(activity => {
              const ActionIcon = getActionIcon(activity.actionType);
              const TargetIcon = getTargetIcon(activity.targetType);

              return (
                <div
                  key={activity.id}
                  className='p-6 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer'
                  onClick={() => handleViewDetail(activity)}
                >
                  <div className='flex items-start gap-4'>
                    {/* User Avatar */}
                    <Avatar className='w-10 h-10 flex-shrink-0'>
                      <AvatarFallback className='bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'>
                        {activity.userAvatar}
                      </AvatarFallback>
                    </Avatar>

                    {/* Activity Content */}
                    <div className='flex-1 min-w-0'>
                      <div className='flex items-start justify-between gap-4 mb-2'>
                        <div className='flex items-center gap-2 flex-wrap'>
                          <span className='dark:text-white'>{activity.userName || '--'}</span>
                          <ActionIcon className={`w-4 h-4 ${getActionColor(activity.actionType)}`} />
                          <span className='text-sm text-gray-600 dark:text-gray-400'>
                            {getActionLabel(activity.actionType)}
                          </span>
                          <TargetIcon className={`w-4 h-4 ${getTargetColor(activity.targetType)}`} />
                          <Badge variant='secondary' className='dark:bg-gray-800 dark:text-gray-300'>
                            {getTargetLabel(activity.targetType)}
                          </Badge>
                          {activity.status && getStatusBadge(activity.status)}
                        </div>
                        <div className='flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 flex-shrink-0'>
                          <Clock className='w-4 h-4' />
                          {activity.activityDate || '--'}
                        </div>
                      </div>

                      <p className='text-sm text-gray-600 dark:text-gray-400 mb-1'>{activity.description || '--'}</p>

                      <div className='flex items-center gap-2 text-sm'>
                        <span className='text-gray-500 dark:text-gray-500'>
                          {language === 'zh-CN' ? '目标：' : 'Target:'}
                        </span>
                        <span className='dark:text-white'>{activity.targetName || '--'}</span>
                      </div>

                      {activity.detail && (
                        <div className='mt-2 flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400'>
                          <Info className='w-4 h-4' />
                          <span>{language === 'zh-CN' ? '点击查看详细信息' : 'Click to view more details'}</span>
                        </div>
                      )}
                    </div>

                    <ChevronRight className='w-5 h-5 text-gray-400 dark:text-gray-600 flex-shrink-0' />
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className='p-4 border-t border-gray-200 dark:border-gray-800'>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNumber;
                  if (totalPages <= 5) {
                    pageNumber = i + 1;
                  } else if (currentPage <= 3) {
                    pageNumber = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNumber = totalPages - 4 + i;
                  } else {
                    pageNumber = currentPage - 2 + i;
                  }

                  return (
                    <PaginationItem key={pageNumber}>
                      <PaginationLink
                        onClick={() => setCurrentPage(pageNumber)}
                        isActive={currentPage === pageNumber}
                        className='cursor-pointer'
                      >
                        {pageNumber}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}
                <PaginationItem>
                  <PaginationNext
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </Card>

      {/* Detail Dialog */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className='max-w-2xl dark:bg-gray-900 dark:border-gray-700'>
          <DialogHeader>
            <DialogTitle className='dark:text-white'>
              {language === 'zh-CN' ? '活动详情' : 'Activity Details'}
            </DialogTitle>
            <DialogDescription className='dark:text-gray-400'>
              {language === 'zh-CN'
                ? '查看活动记录的完整信息'
                : 'Review the complete information of this activity entry'}
            </DialogDescription>
          </DialogHeader>

          {selectedActivity && (
            <div className='space-y-6'>
              {/* User Info */}
              <div className='flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg'>
                <Avatar className='w-12 h-12'>
                  <AvatarFallback className='bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'>
                    {selectedActivity.userAvatar}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className='dark:text-white'>{selectedActivity.userName || '--'}</p>
                  <p className='text-sm text-gray-600 dark:text-gray-400'>
                    {language === 'zh-CN' ? '用户ID' : 'User ID'}: {selectedActivity.userId ?? '--'}
                  </p>
                </div>
              </div>

              {/* Activity Info */}
              <div className='space-y-4'>
                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <Label className='text-sm text-gray-600 dark:text-gray-400'>
                      {language === 'zh-CN' ? '操作类型' : 'Action Type'}
                    </Label>
                    <div className='flex items-center gap-2 mt-1'>
                      {(() => {
                        const ActionIcon = getActionIcon(selectedActivity.actionType);
                        return <ActionIcon className={`w-4 h-4 ${getActionColor(selectedActivity.actionType)}`} />;
                      })()}
                      <span className='dark:text-white'>{getActionLabel(selectedActivity.actionType)}</span>
                    </div>
                  </div>

                  <div>
                    <Label className='text-sm text-gray-600 dark:text-gray-400'>
                      {language === 'zh-CN' ? '目标类型' : 'Target Type'}
                    </Label>
                    <div className='flex items-center gap-2 mt-1'>
                      {(() => {
                        const TargetIcon = getTargetIcon(selectedActivity.targetType);
                        return <TargetIcon className={`w-4 h-4 ${getTargetColor(selectedActivity.targetType)}`} />;
                      })()}
                      <span className='dark:text-white'>{getTargetLabel(selectedActivity.targetType)}</span>
                    </div>
                  </div>

                  <div>
                    <Label className='text-sm text-gray-600 dark:text-gray-400'>
                      {language === 'zh-CN' ? '目标名称' : 'Target Name'}
                    </Label>
                    <p className='dark:text-white mt-1'>{selectedActivity.targetName || '--'}</p>
                  </div>

                  <div>
                    <Label className='text-sm text-gray-600 dark:text-gray-400'>
                      {language === 'zh-CN' ? '目标ID' : 'Target ID'}
                    </Label>
                    <p className='dark:text-white mt-1'>{selectedActivity.targetId ?? '--'}</p>
                  </div>

                  <div>
                    <Label className='text-sm text-gray-600 dark:text-gray-400'>
                      {language === 'zh-CN' ? '活动时间' : 'Activity Time'}
                    </Label>
                    <div className='flex items-center gap-2 mt-1'>
                      <Clock className='w-4 h-4 text-gray-400' />
                      <span className='dark:text-white'>{selectedActivity.activityDate || '--'}</span>
                    </div>
                  </div>

                  <div>
                    <Label className='text-sm text-gray-600 dark:text-gray-400'>
                      {language === 'zh-CN' ? '状态' : 'Status'}
                    </Label>
                    <div className='mt-1'>{getStatusBadge(selectedActivity.status)}</div>
                  </div>
                </div>

                <div>
                  <Label className='text-sm text-gray-600 dark:text-gray-400'>
                    {language === 'zh-CN' ? '描述' : 'Description'}
                  </Label>
                  <p className='dark:text-white mt-1'>{selectedActivity.description || '--'}</p>
                </div>

                {selectedActivity.detail && (
                  <div>
                    <Label className='text-sm text-gray-600 dark:text-gray-400'>
                      {language === 'zh-CN' ? '详细信息' : 'Details'}
                    </Label>
                    <div className='mt-2 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg'>
                      <p className='text-sm dark:text-gray-300'>{selectedActivity.detail}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => setShowDetailDialog(false)}
              className='dark:bg-gray-800 dark:border-gray-700 dark:text-white'
            >
              {language === 'zh-CN' ? '关闭' : 'Close'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Settings Dialog */}
      <Dialog open={showSettingsDialog} onOpenChange={setShowSettingsDialog}>
        <DialogContent className='dark:bg-gray-900 dark:border-gray-800 sm:max-w-[500px]'>
          <DialogHeader>
            <DialogTitle className='dark:text-white'>
              {language === 'zh-CN' ? '活动记录设置' : 'Activity Log Settings'}
            </DialogTitle>
            <DialogDescription className='dark:text-gray-400'>
              {language === 'zh-CN'
                ? '配置活动记录的保留时间，超过保留期限的记录将被自动清理'
                : 'Configure how long activity logs are retained before automatic cleanup.'}
            </DialogDescription>
          </DialogHeader>

          <div className='py-6'>
            <div className='space-y-4'>
              <div>
                <Label className='dark:text-white'>{language === 'zh-CN' ? '记录保留天数' : 'Retention Days'}</Label>
                <p className='text-sm text-gray-600 dark:text-gray-400 mt-1 mb-3'>
                  {language === 'zh-CN'
                    ? '设置活动记录的保留期限，建议保留30-180天'
                    : 'Set the retention window for activity logs (recommended 30-180 days).'}
                </p>
                <Select
                  value={tempRetentionDays.toString()}
                  onValueChange={value => setTempRetentionDays(parseInt(value))}
                >
                  <SelectTrigger className='dark:bg-gray-800 dark:border-gray-700 dark:text-white'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className='dark:bg-gray-800 dark:border-gray-700'>
                    <SelectItem value='7' className='dark:text-white'>
                      {language === 'zh-CN' ? '7 天' : '7 days'}
                    </SelectItem>
                    <SelectItem value='15' className='dark:text-white'>
                      {language === 'zh-CN' ? '15 天' : '15 days'}
                    </SelectItem>
                    <SelectItem value='30' className='dark:text-white'>
                      {language === 'zh-CN' ? '30 天' : '30 days'}
                    </SelectItem>
                    <SelectItem value='60' className='dark:text-white'>
                      {language === 'zh-CN' ? '60 天' : '60 days'}
                    </SelectItem>
                    <SelectItem value='90' className='dark:text-white'>
                      {language === 'zh-CN' ? '90 天（推荐）' : '90 days (recommended)'}
                    </SelectItem>
                    <SelectItem value='180' className='dark:text-white'>
                      {language === 'zh-CN' ? '180 天' : '180 days'}
                    </SelectItem>
                    <SelectItem value='365' className='dark:text-white'>
                      {language === 'zh-CN' ? '365 天' : '365 days'}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className='p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg'>
                <div className='flex gap-3'>
                  <Info className='w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5' />
                  <div>
                    <p className='text-sm dark:text-white mb-1'>{language === 'zh-CN' ? '说明' : 'Notes'}</p>
                    <p className='text-sm text-gray-600 dark:text-gray-400'>
                      {language === 'zh-CN' ? (
                        <>
                          • 系统将定期清理超过保留期限的活动记录
                          <br />
                          • 较长的保留期限有助于审计和追踪历史操作
                          <br />• 较短的保留期限可以节省存储空间
                        </>
                      ) : (
                        <>
                          • Logs older than the retention window will be purged automatically
                          <br />
                          • Longer retention supports audits and compliance reviews
                          <br />• Shorter retention saves storage and improves performance
                        </>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => setShowSettingsDialog(false)}
              className='dark:bg-gray-800 dark:border-gray-700 dark:text-white'
            >
              {language === 'zh-CN' ? '取消' : 'Cancel'}
            </Button>
            <Button onClick={handleSaveSettings} className='bg-blue-500 hover:bg-blue-600 text-white'>
              {language === 'zh-CN' ? '保存设置' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
