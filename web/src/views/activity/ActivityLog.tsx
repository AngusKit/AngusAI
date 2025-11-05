import { useState } from 'react';
import { useLanguage } from '@/ui/LanguageProvider';
import { 
  Activity, 
  Search, 
  Filter, 
  Calendar,
  User,
  FileText,
  Database,
  Workflow,
  Brain,
  Settings,
  Trash2,
  Edit,
  Plus,
  Eye,
  Share2,
  Upload,
  Download,
  Clock,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  XCircle,
  Info
} from 'lucide-react';
import { Button } from '@/ui/button';
import { Card } from '@/ui/card';
import { Badge } from '@/ui/badge';
import { Input } from '@/ui/input';
import { Label } from '@/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/ui/select';
import { Avatar, AvatarFallback } from '@/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/ui/tabs';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/ui/pagination';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/ui/dialog';
import { ScrollArea } from '@/ui/scroll-area';
import { toast } from 'sonner';

interface ActivityRecord {
  id: number;
  userId: number;
  userName: string;
  userAvatar?: string;
  targetId: number;
  targetType: string;
  targetName: string;
  activityDate: string;
  description: string;
  detail?: string;
  actionType: string;
  status?: 'success' | 'failed' | 'warning';
}

// 目标类型映射
const targetTypeMap: Record<string, { label: string; icon: any; color: string }> = {
  APPLICATION: { label: '应用', icon: Brain, color: 'text-blue-500' },
  WORKFLOW: { label: '工作流', icon: Workflow, color: 'text-purple-500' },
  KNOWLEDGE_BASE: { label: '知识库', icon: Database, color: 'text-green-500' },
  DATASET: { label: '数据集', icon: FileText, color: 'text-orange-500' },
  MODEL: { label: '模型', icon: Settings, color: 'text-indigo-500' },
  TEAM_MEMBER: { label: '团队成员', icon: User, color: 'text-pink-500' },
  API_KEY: { label: 'API密钥', icon: Settings, color: 'text-red-500' },
  PROMPT: { label: '提示词', icon: FileText, color: 'text-cyan-500' },
};

// 操作类型映射
const actionTypeMap: Record<string, { label: string; icon: any; color: string }> = {
  CREATE: { label: '创建', icon: Plus, color: 'text-green-500' },
  UPDATE: { label: '更新', icon: Edit, color: 'text-blue-500' },
  DELETE: { label: '删除', icon: Trash2, color: 'text-red-500' },
  VIEW: { label: '查看', icon: Eye, color: 'text-gray-500' },
  SHARE: { label: '分享', icon: Share2, color: 'text-purple-500' },
  EXPORT: { label: '导出', icon: Download, color: 'text-indigo-500' },
  IMPORT: { label: '导入', icon: Upload, color: 'text-orange-500' },
  EXECUTE: { label: '执行', icon: Activity, color: 'text-cyan-500' },
};

export function ActivityLog() {
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState('all');
  const [selectedTargetType, setSelectedTargetType] = useState('all');
  const [selectedActionType, setSelectedActionType] = useState('all');
  const [dateRange, setDateRange] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedActivity, setSelectedActivity] = useState<ActivityRecord | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  const [retentionDays, setRetentionDays] = useState(90); // 默认保存90天
  const [tempRetentionDays, setTempRetentionDays] = useState(90);
  const itemsPerPage = 20;

  // 模拟数据
  const [activities] = useState<ActivityRecord[]>([
    {
      id: 1,
      userId: 1,
      userName: '张伟',
      userAvatar: 'ZW',
      targetId: 101,
      targetType: 'APPLICATION',
      targetName: '智能客服助手',
      activityDate: '2024-11-03 10:30:25',
      description: '创建了应用',
      detail: '创建了新应用"智能客服助手"，配置了GPT-4模型和知识库连接',
      actionType: 'CREATE',
      status: 'success',
    },
    {
      id: 2,
      userId: 2,
      userName: '李娜',
      userAvatar: 'LN',
      targetId: 102,
      targetType: 'WORKFLOW',
      targetName: '订单处理流程',
      activityDate: '2024-11-03 10:15:42',
      description: '更新了工作流配置',
      detail: '修改了工作流节点配置，添加了邮件通知功能',
      actionType: 'UPDATE',
      status: 'success',
    },
    {
      id: 3,
      userId: 3,
      userName: '王芳',
      userAvatar: 'WF',
      targetId: 103,
      targetType: 'KNOWLEDGE_BASE',
      targetName: '产品手册库',
      activityDate: '2024-11-03 09:45:18',
      description: '导入了文档',
      detail: '批量导入了25个PDF文档，总大小120MB',
      actionType: 'IMPORT',
      status: 'success',
    },
    {
      id: 4,
      userId: 1,
      userName: '张伟',
      userAvatar: 'ZW',
      targetId: 104,
      targetType: 'DATASET',
      targetName: '客户反馈数据',
      activityDate: '2024-11-03 09:30:55',
      description: '删除了数据集',
      detail: '删除了过期的客户反馈数据集',
      actionType: 'DELETE',
      status: 'success',
    },
    {
      id: 5,
      userId: 4,
      userName: '赵强',
      userAvatar: 'ZQ',
      targetId: 105,
      targetType: 'APPLICATION',
      targetName: '文档摘要生成器',
      activityDate: '2024-11-03 09:20:33',
      description: '分享了应用',
      detail: '将应用分享给团队成员李娜、王芳',
      actionType: 'SHARE',
      status: 'success',
    },
    {
      id: 6,
      userId: 2,
      userName: '李娜',
      userAvatar: 'LN',
      targetId: 106,
      targetType: 'WORKFLOW',
      targetName: '数据处理流程',
      activityDate: '2024-11-03 08:55:12',
      description: '执行了工作流',
      detail: '成功处理了500条数据记录',
      actionType: 'EXECUTE',
      status: 'success',
    },
    {
      id: 7,
      userId: 5,
      userName: '孙丽',
      userAvatar: 'SL',
      targetId: 107,
      targetType: 'MODEL',
      targetName: 'GPT-4 配置',
      activityDate: '2024-11-03 08:30:44',
      description: '更新了模型配置',
      detail: '修改了模型参数：temperature=0.7, max_tokens=2000',
      actionType: 'UPDATE',
      status: 'success',
    },
    {
      id: 8,
      userId: 3,
      userName: '王芳',
      userAvatar: 'WF',
      targetId: 108,
      targetType: 'TEAM_MEMBER',
      targetName: '新成员：周杰',
      activityDate: '2024-11-02 17:45:22',
      description: '邀请了团队成员',
      detail: '邀请周杰加入团队，角色：成员',
      actionType: 'CREATE',
      status: 'success',
    },
    {
      id: 9,
      userId: 1,
      userName: '张伟',
      userAvatar: 'ZW',
      targetId: 109,
      targetType: 'API_KEY',
      targetName: 'Production API Key',
      activityDate: '2024-11-02 16:20:18',
      description: '创建了API密钥',
      detail: '创建了新的生产环境API密钥，有效期90天',
      actionType: 'CREATE',
      status: 'success',
    },
    {
      id: 10,
      userId: 4,
      userName: '赵强',
      userAvatar: 'ZQ',
      targetId: 110,
      targetType: 'KNOWLEDGE_BASE',
      targetName: '技术文档库',
      activityDate: '2024-11-02 15:55:33',
      description: '查看了知识库',
      detail: '浏览了知识库内容，检索了15个文档',
      actionType: 'VIEW',
      status: 'success',
    },
    {
      id: 11,
      userId: 2,
      userName: '李娜',
      userAvatar: 'LN',
      targetId: 111,
      targetType: 'DATASET',
      targetName: '销售数据2024',
      activityDate: '2024-11-02 14:30:25',
      description: '导出了数据集',
      detail: '导出Excel格式，包含10000条记录',
      actionType: 'EXPORT',
      status: 'success',
    },
    {
      id: 12,
      userId: 5,
      userName: '孙丽',
      userAvatar: 'SL',
      targetId: 112,
      targetType: 'WORKFLOW',
      targetName: '审批流程',
      activityDate: '2024-11-02 13:15:47',
      description: '执行工作流失败',
      detail: '工作流执行失败：连接超时',
      actionType: 'EXECUTE',
      status: 'failed',
    },
  ]);

  // 筛选活动记录
  const filteredActivities = activities.filter(activity => {
    const matchesSearch = 
      activity.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.targetName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesUser = selectedUser === 'all' || activity.userId.toString() === selectedUser;
    const matchesTargetType = selectedTargetType === 'all' || activity.targetType === selectedTargetType;
    const matchesActionType = selectedActionType === 'all' || activity.actionType === selectedActionType;
    
    return matchesSearch && matchesUser && matchesTargetType && matchesActionType;
  });

  // 分页
  const totalPages = Math.ceil(filteredActivities.length / itemsPerPage);
  const paginatedActivities = filteredActivities.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
    toast.success(`活动记录保留期限已设置为 ${tempRetentionDays} 天`);
  };

  const getActionIcon = (actionType: string) => {
    const action = actionTypeMap[actionType];
    if (!action) return Activity;
    return action.icon;
  };

  const getActionLabel = (actionType: string) => {
    return actionTypeMap[actionType]?.label || actionType;
  };

  const getActionColor = (actionType: string) => {
    return actionTypeMap[actionType]?.color || 'text-gray-500';
  };

  const getTargetIcon = (targetType: string) => {
    const target = targetTypeMap[targetType];
    if (!target) return FileText;
    return target.icon;
  };

  const getTargetLabel = (targetType: string) => {
    return targetTypeMap[targetType]?.label || targetType;
  };

  const getTargetColor = (targetType: string) => {
    return targetTypeMap[targetType]?.color || 'text-gray-500';
  };

  const getStatusBadge = (status?: string) => {
    if (!status || status === 'success') {
      return (
        <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-0">
          <CheckCircle className="w-3 h-3 mr-1" />
          成功
        </Badge>
      );
    }
    if (status === 'failed') {
      return (
        <Badge className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-0">
          <XCircle className="w-3 h-3 mr-1" />
          失败
        </Badge>
      );
    }
    if (status === 'warning') {
      return (
        <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border-0">
          <AlertCircle className="w-3 h-3 mr-1" />
          警告
        </Badge>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl dark:text-white mb-1">活动记录</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              查看团队成员的所有操作活动记录 · 当前保留 {retentionDays} 天记录
            </p>
          </div>
          <Button
            onClick={handleOpenSettings}
            variant="outline"
            className="dark:bg-gray-900 dark:border-gray-700 dark:text-white"
          >
            <Settings className="w-4 h-4 mr-2" />
            记录设置
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6 dark:bg-gray-900 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">今日活动</p>
              <p className="text-2xl dark:text-white">156</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <Activity className="w-6 h-6 text-blue-500" />
            </div>
          </div>
        </Card>

        <Card className="p-6 dark:bg-gray-900 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">活跃用户</p>
              <p className="text-2xl dark:text-white">8</p>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
              <User className="w-6 h-6 text-green-500" />
            </div>
          </div>
        </Card>

        <Card className="p-6 dark:bg-gray-900 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">操作成功率</p>
              <p className="text-2xl dark:text-white">98.5%</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-purple-500" />
            </div>
          </div>
        </Card>

        <Card className="p-6 dark:bg-gray-900 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">总记录数</p>
              <p className="text-2xl dark:text-white">12,456</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-orange-500" />
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-6 dark:bg-gray-900 dark:border-gray-800">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索用户、目标或操作..."
                className="pl-10 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              />
            </div>
          </div>

          {/* User Filter */}
          <div>
            <Select value={selectedUser} onValueChange={setSelectedUser}>
              <SelectTrigger className="dark:bg-gray-800 dark:border-gray-700 dark:text-white">
                <SelectValue placeholder="所有用户" />
              </SelectTrigger>
              <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                <SelectItem value="all" className="dark:text-white">所有用户</SelectItem>
                <SelectItem value="1" className="dark:text-white">张伟</SelectItem>
                <SelectItem value="2" className="dark:text-white">李娜</SelectItem>
                <SelectItem value="3" className="dark:text-white">王芳</SelectItem>
                <SelectItem value="4" className="dark:text-white">赵强</SelectItem>
                <SelectItem value="5" className="dark:text-white">孙丽</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Target Type Filter */}
          <div>
            <Select value={selectedTargetType} onValueChange={setSelectedTargetType}>
              <SelectTrigger className="dark:bg-gray-800 dark:border-gray-700 dark:text-white">
                <SelectValue placeholder="所有类型" />
              </SelectTrigger>
              <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                <SelectItem value="all" className="dark:text-white">所有类型</SelectItem>
                <SelectItem value="APPLICATION" className="dark:text-white">应用</SelectItem>
                <SelectItem value="WORKFLOW" className="dark:text-white">工作流</SelectItem>
                <SelectItem value="KNOWLEDGE_BASE" className="dark:text-white">知识库</SelectItem>
                <SelectItem value="DATASET" className="dark:text-white">数据集</SelectItem>
                <SelectItem value="MODEL" className="dark:text-white">模型</SelectItem>
                <SelectItem value="TEAM_MEMBER" className="dark:text-white">团队成员</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Action Type Filter */}
          <div>
            <Select value={selectedActionType} onValueChange={setSelectedActionType}>
              <SelectTrigger className="dark:bg-gray-800 dark:border-gray-700 dark:text-white">
                <SelectValue placeholder="所有操作" />
              </SelectTrigger>
              <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                <SelectItem value="all" className="dark:text-white">所有操作</SelectItem>
                <SelectItem value="CREATE" className="dark:text-white">创建</SelectItem>
                <SelectItem value="UPDATE" className="dark:text-white">更新</SelectItem>
                <SelectItem value="DELETE" className="dark:text-white">删除</SelectItem>
                <SelectItem value="VIEW" className="dark:text-white">查看</SelectItem>
                <SelectItem value="SHARE" className="dark:text-white">分享</SelectItem>
                <SelectItem value="EXPORT" className="dark:text-white">导出</SelectItem>
                <SelectItem value="IMPORT" className="dark:text-white">导入</SelectItem>
                <SelectItem value="EXECUTE" className="dark:text-white">执行</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            找到 <span className="dark:text-white">{filteredActivities.length}</span> 条记录
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSearchQuery('');
              setSelectedUser('all');
              setSelectedTargetType('all');
              setSelectedActionType('all');
              setDateRange('all');
            }}
            className="dark:text-gray-400 dark:hover:text-white"
          >
            清除筛选
          </Button>
        </div>
      </Card>

      {/* Activity List */}
      <Card className="dark:bg-gray-900 dark:border-gray-800">
        <ScrollArea className="h-[600px]">
          <div className="divide-y divide-gray-200 dark:divide-gray-800">
            {paginatedActivities.map((activity) => {
              const ActionIcon = getActionIcon(activity.actionType);
              const TargetIcon = getTargetIcon(activity.targetType);
              
              return (
                <div
                  key={activity.id}
                  className="p-6 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
                  onClick={() => handleViewDetail(activity)}
                >
                  <div className="flex items-start gap-4">
                    {/* User Avatar */}
                    <Avatar className="w-10 h-10 flex-shrink-0">
                      <AvatarFallback className="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                        {activity.userAvatar}
                      </AvatarFallback>
                    </Avatar>

                    {/* Activity Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="dark:text-white">{activity.userName}</span>
                          <ActionIcon className={`w-4 h-4 ${getActionColor(activity.actionType)}`} />
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {getActionLabel(activity.actionType)}
                          </span>
                          <TargetIcon className={`w-4 h-4 ${getTargetColor(activity.targetType)}`} />
                          <Badge variant="secondary" className="dark:bg-gray-800 dark:text-gray-300">
                            {getTargetLabel(activity.targetType)}
                          </Badge>
                          {activity.status && getStatusBadge(activity.status)}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 flex-shrink-0">
                          <Clock className="w-4 h-4" />
                          {activity.activityDate}
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                        {activity.description}
                      </p>
                      
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-gray-500 dark:text-gray-500">目标：</span>
                        <span className="dark:text-white">{activity.targetName}</span>
                      </div>
                      
                      {activity.detail && (
                        <div className="mt-2 flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400">
                          <Info className="w-4 h-4" />
                          <span>点击查看详细信息</span>
                        </div>
                      )}
                    </div>

                    <ChevronRight className="w-5 h-5 text-gray-400 dark:text-gray-600 flex-shrink-0" />
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-800">
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
                        className="cursor-pointer"
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
        <DialogContent className="max-w-2xl dark:bg-gray-900 dark:border-gray-700">
          <DialogHeader>
            <DialogTitle className="dark:text-white">活动详情</DialogTitle>
            <DialogDescription className="dark:text-gray-400">
              查看活动记录的完整信息
            </DialogDescription>
          </DialogHeader>
          
          {selectedActivity && (
            <div className="space-y-6">
              {/* User Info */}
              <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <Avatar className="w-12 h-12">
                  <AvatarFallback className="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                    {selectedActivity.userAvatar}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="dark:text-white">{selectedActivity.userName}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    用户ID: {selectedActivity.userId}
                  </p>
                </div>
              </div>

              {/* Activity Info */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-gray-600 dark:text-gray-400">操作类型</Label>
                    <div className="flex items-center gap-2 mt-1">
                      {(() => {
                        const ActionIcon = getActionIcon(selectedActivity.actionType);
                        return <ActionIcon className={`w-4 h-4 ${getActionColor(selectedActivity.actionType)}`} />;
                      })()}
                      <span className="dark:text-white">{getActionLabel(selectedActivity.actionType)}</span>
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-sm text-gray-600 dark:text-gray-400">目标类型</Label>
                    <div className="flex items-center gap-2 mt-1">
                      {(() => {
                        const TargetIcon = getTargetIcon(selectedActivity.targetType);
                        return <TargetIcon className={`w-4 h-4 ${getTargetColor(selectedActivity.targetType)}`} />;
                      })()}
                      <span className="dark:text-white">{getTargetLabel(selectedActivity.targetType)}</span>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm text-gray-600 dark:text-gray-400">目标名称</Label>
                    <p className="dark:text-white mt-1">{selectedActivity.targetName}</p>
                  </div>

                  <div>
                    <Label className="text-sm text-gray-600 dark:text-gray-400">目标ID</Label>
                    <p className="dark:text-white mt-1">{selectedActivity.targetId}</p>
                  </div>

                  <div>
                    <Label className="text-sm text-gray-600 dark:text-gray-400">活动时间</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="dark:text-white">{selectedActivity.activityDate}</span>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm text-gray-600 dark:text-gray-400">状态</Label>
                    <div className="mt-1">{getStatusBadge(selectedActivity.status)}</div>
                  </div>
                </div>

                <div>
                  <Label className="text-sm text-gray-600 dark:text-gray-400">描述</Label>
                  <p className="dark:text-white mt-1">{selectedActivity.description}</p>
                </div>

                {selectedActivity.detail && (
                  <div>
                    <Label className="text-sm text-gray-600 dark:text-gray-400">详细信息</Label>
                    <div className="mt-2 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <p className="text-sm dark:text-gray-300">{selectedActivity.detail}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDetailDialog(false)}
              className="dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            >
              关闭
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Settings Dialog */}
      <Dialog open={showSettingsDialog} onOpenChange={setShowSettingsDialog}>
        <DialogContent className="dark:bg-gray-900 dark:border-gray-800 sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="dark:text-white">活动记录设置</DialogTitle>
            <DialogDescription className="dark:text-gray-400">
              配置活动记录的保留时间，超过保留期限的记录将被自动清理
            </DialogDescription>
          </DialogHeader>

          <div className="py-6">
            <div className="space-y-4">
              <div>
                <Label className="dark:text-white">记录保留天数</Label>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 mb-3">
                  设置活动记录的保留期限，建议保留30-180天
                </p>
                <Select
                  value={tempRetentionDays.toString()}
                  onValueChange={(value) => setTempRetentionDays(parseInt(value))}
                >
                  <SelectTrigger className="dark:bg-gray-800 dark:border-gray-700 dark:text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                    <SelectItem value="7" className="dark:text-white">7 天</SelectItem>
                    <SelectItem value="15" className="dark:text-white">15 天</SelectItem>
                    <SelectItem value="30" className="dark:text-white">30 天</SelectItem>
                    <SelectItem value="60" className="dark:text-white">60 天</SelectItem>
                    <SelectItem value="90" className="dark:text-white">90 天（推荐）</SelectItem>
                    <SelectItem value="180" className="dark:text-white">180 天</SelectItem>
                    <SelectItem value="365" className="dark:text-white">365 天</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <div className="flex gap-3">
                  <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm dark:text-white mb-1">说明</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      • 系统将定期清理超过保留期限的活动记录<br />
                      • 较长的保留期限有助于审计和追踪历史操作<br />
                      • 较短的保留期限可以节省存储空间
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowSettingsDialog(false)}
              className="dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            >
              取消
            </Button>
            <Button
              onClick={handleSaveSettings}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              保存设置
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
