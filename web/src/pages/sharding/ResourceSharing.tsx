import { useState, useEffect } from 'react';
import { useLanguage } from '@/components/LanguageProvider.tsx';
import { Share2, Search, Filter, Workflow, Database, Zap, FileText, Users, Lock, Unlock, Eye, Edit, Trash2, MoreHorizontal, TrendingUp, Clock, Shield, CheckCircle, Globe, UserCheck, Plus, } from 'lucide-react';
import { Button } from '@/components/ui/button.tsx';
import { Card } from '@/components/ui/card.tsx';
import { Badge } from '@/components/ui/badge.tsx';
import { Input } from '@/components/ui/input.tsx';
import { XcanPagination } from '@/components/ui/pagination.tsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.tsx';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, } from '@/components/ui/dialog.tsx';
import { Label } from '@/components/ui/label.tsx';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, } from '@/components/ui/dropdown-menu.tsx';
import { Checkbox } from '@/components/ui/checkbox.tsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.tsx';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, } from '@/components/ui/pagination.tsx';
import { toast } from 'sonner';
import Sharing from '@/services/Sharing.ts';
import { ResourceSharingListVo } from '@/services/SharingTypes.ts';
import { ResourceTypeEnum, MemberPermissionEnum, SharedWithEnum } from '@/enums/enums.ts';
import { useDebounce } from '@/hooks/useDebounce.ts';
import { getEnumDescription } from '@/enums/utils.ts';

interface SharedResource {
  id: string;
  name: string;
  type: ResourceTypeEnum;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  owner: string;
  sharedWith: SharedWithEnum;
  memberCount: number;
  permission: MemberPermissionEnum;
  lastShared: string;
  views: number;
  edits: number;
  createdDate: string;
  enabled?: boolean;
}

interface TeamMember {
  id: number;
  name: string;
  email: string;
  avatar: string;
  selected: boolean;
}

export function ResourceSharing() {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const [typeFilter, setTypeFilter] = useState('all');
  const [permissionFilter, setPermissionFilter] = useState('all');
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState<SharedResource | null>(null);
  const [shareType, setShareType] = useState<SharedWithEnum>(SharedWithEnum.ALL);
  const [sharePermission, setSharePermission] = useState<MemberPermissionEnum>(MemberPermissionEnum.VIEW);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [isLoading, setIsLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  // 共享弹窗状态
  const [selectedResourceType, setSelectedResourceType] = useState<ResourceTypeEnum | ''>('');
  const [selectedResourceId, setSelectedResourceId] = useState('');

  const [resources, setResources] = useState<SharedResource[]>([]);

  // 资源类型映射
  const mapResourceTypeToDisplay = (type?: ResourceTypeEnum): string => {
    if (!type) return '';
    return getEnumDescription(ResourceTypeEnum, type);
  };

  // 获取资源图标
  const getResourceIcon = (type?: ResourceTypeEnum): React.ElementType => {
    if (type === ResourceTypeEnum.APPLICATION) return Zap;
    if (type === ResourceTypeEnum.KNOWLEDGE) return Database;
    if (type === ResourceTypeEnum.WORKFLOW) return Workflow;
    if (type === ResourceTypeEnum.MODEL) return Zap;
    if (type === ResourceTypeEnum.DATASET) return FileText;
    return FileText;
  };

  // 获取资源图标背景色
  const getResourceIconBg = (type?: ResourceTypeEnum): string => {
    if (type === ResourceTypeEnum.APPLICATION) return 'bg-blue-100 dark:bg-blue-900/30';
    if (type === ResourceTypeEnum.KNOWLEDGE) return 'bg-purple-100 dark:bg-purple-900/30';
    if (type === ResourceTypeEnum.WORKFLOW) return 'bg-green-100 dark:bg-green-900/30';
    if (type === ResourceTypeEnum.MODEL) return 'bg-orange-100 dark:bg-orange-900/30';
    if (type === ResourceTypeEnum.DATASET) return 'bg-pink-100 dark:bg-pink-900/30';
    return 'bg-gray-100 dark:bg-gray-900/30';
  };

  // 获取资源图标颜色
  const getResourceIconColor = (type?: ResourceTypeEnum): string => {
    if (type === ResourceTypeEnum.APPLICATION) return 'text-blue-600 dark:text-blue-400';
    if (type === ResourceTypeEnum.KNOWLEDGE) return 'text-purple-600 dark:text-purple-400';
    if (type === ResourceTypeEnum.WORKFLOW) return 'text-green-600 dark:text-green-400';
    if (type === ResourceTypeEnum.MODEL) return 'text-orange-600 dark:text-orange-400';
    if (type === ResourceTypeEnum.DATASET) return 'text-pink-600 dark:text-pink-400';
    return 'text-gray-600 dark:text-gray-400';
  };

  // 格式化日期
  const formatDate = (date?: string): string => {
    if (!date) return '';
    try {
      const d = new Date(date);
      const now = new Date();
      const diff = now.getTime() - d.getTime();
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor(diff / (1000 * 60));

      if (days > 0) return `${days}天前`;
      if (hours > 0) return `${hours}小时前`;
      if (minutes > 0) return `${minutes}分钟前`;
      return '刚刚';
    } catch {
      return date;
    }
  };

  // 加载资源共享列表
  const loadResourceSharingList = async () => {
    setIsLoading(true);
    try {
      const queryParams: any = {
        keyword: debouncedSearchQuery.trim() || undefined,
        pageNo: currentPage,
        pageSize: itemsPerPage,
      };

      // 根据筛选条件设置参数
      if (typeFilter !== 'all') {
        // 将页面类型映射到API类型
        const typeMap: Record<string, ResourceTypeEnum> = {
          '应用': ResourceTypeEnum.APPLICATION,
          '知识库': ResourceTypeEnum.KNOWLEDGE,
          '工作流': ResourceTypeEnum.WORKFLOW,
          '模型': ResourceTypeEnum.MODEL,
          '数据集': ResourceTypeEnum.DATASET,
        };
        queryParams.type = typeMap[typeFilter];
      }

      if (permissionFilter !== 'all') {
        const permissionMap: Record<string, MemberPermissionEnum> = {
          'view': MemberPermissionEnum.VIEW,
          'edit': MemberPermissionEnum.EDIT,
          'manage': MemberPermissionEnum.MANAGE,
        };
        queryParams.permission = permissionMap[permissionFilter];
      }

      const response = await Sharing.getResourceSharingList(queryParams);

      // 处理响应结构
      const responseData = (response as any).data;
      let listData: ResourceSharingListVo[] | undefined;
      if (responseData) {
        listData = responseData.list;
        setTotalCount(responseData.total || 0);
      }

      if (Array.isArray(listData)) {
        const mappedList: SharedResource[] = listData.map((item: ResourceSharingListVo) => ({
          id: item.id || '',
          name: item.resourceName || '',
          type: item.resourceType || ResourceTypeEnum.APPLICATION,
          icon: getResourceIcon(item.resourceType),
          iconBg: getResourceIconBg(item.resourceType),
          iconColor: getResourceIconColor(item.resourceType),
          owner: item.ownerName || '',
          sharedWith: item.sharedWith || SharedWithEnum.ALL,
          memberCount: item.memberCount || 0,
          permission: item.permission || MemberPermissionEnum.VIEW,
          lastShared: formatDate(item.modifiedDate || item.createdDate),
          views: item.views || 0,
          edits: item.edits || 0,
          createdDate: item.createdDate || '',
          enabled: item.enabled,
        }));

        setResources(mappedList);
      } else {
        setResources([]);
        setTotalCount(0);
      }
    } catch (error: any) {
      console.error('Failed to load resource sharing list:', error);
      toast.error(error?.data?.message || error?.message || '加载资源共享列表失败');
      setResources([]);
      setTotalCount(0);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadResourceSharingList();
  }, [currentPage, debouncedSearchQuery, typeFilter, permissionFilter]);

  // 团队成员列表（暂时保留模拟数据，因为API中没有获取团队成员列表的接口）
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    {
      id: 1,
      name: '张伟',
      email: 'zhangwei@example.com',
      avatar: 'ZW',
      selected: false,
    },
    {
      id: 2,
      name: '李娜',
      email: 'lina@example.com',
      avatar: 'LN',
      selected: false,
    },
    {
      id: 3,
      name: '王芳',
      email: 'wangfang@example.com',
      avatar: 'WF',
      selected: false,
    },
    {
      id: 4,
      name: '刘强',
      email: 'liuqiang@example.com',
      avatar: 'LQ',
      selected: false,
    },
    {
      id: 5,
      name: '陈静',
      email: 'chenjing@example.com',
      avatar: 'CJ',
      selected: false,
    },
    {
      id: 6,
      name: '赵磊',
      email: 'zhaolei@example.com',
      avatar: 'ZL',
      selected: false,
    },
  ]);

  // 可共享资源列表（需要从对应的资源接口获取，暂时保留模拟数据）
  const [availableResources, setAvailableResources] = useState<Record<string, Array<{ id: string; name: string; icon: React.ElementType }>>>({
    [ResourceTypeEnum.APPLICATION]: [
      { id: 'app-1', name: '智能客服应用', icon: Zap },
      { id: 'app-2', name: '营销活动应用', icon: Zap },
    ],
    [ResourceTypeEnum.KNOWLEDGE]: [
      { id: 'kb-1', name: '产品知识库', icon: Database },
      { id: 'kb-2', name: '技术文档知识库', icon: Database },
    ],
    [ResourceTypeEnum.WORKFLOW]: [
      { id: 'wf-1', name: '自动化审批流程', icon: Workflow },
      { id: 'wf-2', name: '数据分析工作流', icon: Workflow },
    ],
    [ResourceTypeEnum.MODEL]: [
      { id: 'model-1', name: 'GPT-4 模型', icon: Zap },
      { id: 'model-2', name: '图像识别模型', icon: Zap },
    ],
    [ResourceTypeEnum.DATASET]: [
      { id: 'ds-1', name: '客户数据集', icon: FileText },
      { id: 'ds-2', name: '用户行为数据集', icon: FileText },
    ],
  });

  const getPermissionBadge = (permission: MemberPermissionEnum) => {
    const badges = {
      [MemberPermissionEnum.VIEW]: {
        label: '查看',
        color: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400',
        icon: Eye,
      },
      [MemberPermissionEnum.EDIT]: {
        label: '编辑',
        color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
        icon: Edit,
      },
      [MemberPermissionEnum.MANAGE]: {
        label: '管理',
        color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
        icon: Shield,
      },
    };
    return badges[permission] || badges[MemberPermissionEnum.VIEW];
  };

  // 分页逻辑（现在使用服务端分页）
  const totalPages = Math.ceil(totalCount / itemsPerPage);
  const currentResources = resources;
  const shouldShowPagination = totalCount > itemsPerPage;

  const handleShare = async () => {
    // 验证资源类型
    if (!selectedResourceType) {
      toast.error('请选择资源类型');
      return;
    }

    // 验证资源名称
    if (!selectedResourceId) {
      toast.error('请选择资源');
      return;
    }

    if (shareType === SharedWithEnum.SPECIFIC) {
      const selectedCount = teamMembers.filter(m => m.selected).length;
      if (selectedCount === 0) {
        toast.error('请至少选择一个成员');
        return;
      }
    }

    try {
      const memberIds = shareType === SharedWithEnum.SPECIFIC
        ? teamMembers.filter(m => m.selected).map(m => String(m.id))
        : undefined;

      await Sharing.createResourceSharing({
        resourceId: selectedResourceId,
        resourceType: selectedResourceType as ResourceTypeEnum,
        sharedWith: shareType,
        permission: sharePermission,
        memberIds: memberIds,
      });

      const resourceName = availableResources[selectedResourceType]?.find(
        r => r.id === selectedResourceId
      )?.name;

      toast.success(`已将"${resourceName}"共享成功`);

    // 重置状态
    setShareDialogOpen(false);
    setTeamMembers(teamMembers.map(m => ({ ...m, selected: false })));
    setSelectedResourceType('');
    setSelectedResourceId('');
      setShareType(SharedWithEnum.ALL);
      setSharePermission(MemberPermissionEnum.VIEW);

      // 重新加载列表
      await loadResourceSharingList();
    } catch (error: any) {
      console.error('Failed to create resource sharing:', error);
      toast.error(error?.data?.message || error?.message || '创建资源共享失败');
    }
  };

  const handleRemoveSharing = async (resource: SharedResource) => {
    try {
      await Sharing.deleteResourceSharing(resource.id);
    toast.success(`已停止共享: ${resource.name}`);
      // 重新加载列表
      await loadResourceSharingList();
    } catch (error: any) {
      console.error('Failed to delete resource sharing:', error);
      toast.error(error?.data?.message || error?.message || '停止共享失败');
    }
  };

  const handleChangePermission = async (resource: SharedResource, newPermission: MemberPermissionEnum) => {
    try {
      await Sharing.updateResourceSharing(resource.id, {
        sharedWith: resource.sharedWith,
        permission: newPermission,
        memberIds: resource.sharedWith === SharedWithEnum.SPECIFIC ? [] : undefined, // 如果是特定成员，需要传递成员ID列表
      });
    toast.success(`已更改权限为: ${getPermissionBadge(newPermission).label}`);
      // 重新加载列表
      await loadResourceSharingList();
    } catch (error: any) {
      console.error('Failed to update resource sharing:', error);
      toast.error(error?.data?.message || error?.message || '更新权限失败');
    }
  };

  // 统计数据（从列表数据计算）
  const stats = [
    {
      label: '共享资源',
      value: totalCount,
      subtext: `${resources.filter(r => r.sharedWith === SharedWithEnum.ALL).length} 个全员共享`,
      icon: Share2,
      color: 'text-blue-600',
    },
    {
      label: '总访问量',
      value: resources.reduce((sum, r) => sum + r.views, 0),
      subtext: '过去30天',
      icon: TrendingUp,
      color: 'text-green-600',
    },
    {
      label: '编辑次数',
      value: resources.reduce((sum, r) => sum + r.edits, 0),
      subtext: '过去30天',
      icon: Edit,
      color: 'text-orange-600',
    },
    {
      label: '平均权限',
      value: '编辑',
      subtext: '大多数资源可编辑',
      icon: Shield,
      color: 'text-purple-600',
    },
  ];

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div>
        <h1 className='text-2xl mb-1 dark:text-white'>资源共享</h1>
        <p className='text-sm text-gray-600 dark:text-gray-400'>管理团队资源共享和权限设置</p>
      </div>

      {/* Stats Cards */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className='p-5 dark:bg-gray-800 dark:border-gray-700'>
              <div className='flex items-start justify-between mb-3'>
                <div className={`p-2 rounded-lg bg-gray-100 dark:bg-gray-700 ${stat.color}`}>
                  <Icon className='w-5 h-5' />
                </div>
              </div>
              <div className='text-base text-gray-600 dark:text-gray-400 mb-0.5'>{stat.label}</div>
              <div className='text-3xl dark:text-white mb-0.5'>{stat.value}</div>
              <div className='text-xs text-gray-500 dark:text-gray-400'>{stat.subtext}</div>
            </Card>
          );
        })}
      </div>

      {/* Action Bar */}
      <div className='flex items-center justify-between gap-3'>
        <div className='relative w-[390px]'>
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400' />
          <Input
            placeholder='搜索共享资源...'
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className='pl-9 dark:bg-gray-800 dark:border-gray-700'
          />
        </div>

        <div className='flex items-center gap-3'>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className='w-[140px] dark:bg-gray-800 dark:border-gray-700'>
              <Filter className='w-4 h-4 mr-2' />
              <SelectValue placeholder='资源类型' />
            </SelectTrigger>
            <SelectContent className='dark:bg-gray-800 dark:border-gray-700'>
              <SelectItem value='all'>全部类型</SelectItem>
              <SelectItem value='应用'>应用</SelectItem>
              <SelectItem value='知识库'>知识库</SelectItem>
              <SelectItem value='工作流'>工作流</SelectItem>
              <SelectItem value='模型'>模型</SelectItem>
              <SelectItem value='数据集'>数据集</SelectItem>
            </SelectContent>
          </Select>

          <Select value={permissionFilter} onValueChange={setPermissionFilter}>
            <SelectTrigger className='w-[140px] dark:bg-gray-800 dark:border-gray-700'>
              <SelectValue placeholder='权限筛选' />
            </SelectTrigger>
            <SelectContent className='dark:bg-gray-800 dark:border-gray-700'>
              <SelectItem value='all'>全部权限</SelectItem>
              <SelectItem value='view'>查看</SelectItem>
              <SelectItem value='edit'>编辑</SelectItem>
              <SelectItem value='manage'>管理</SelectItem>
            </SelectContent>
          </Select>

          <Button onClick={() => setShareDialogOpen(true)} className='bg-blue-500 hover:bg-blue-600'>
            <Plus className='w-4 h-4 mr-2' />
            共享资源
          </Button>
        </div>
      </div>

      {/* Resources Table */}
      <Card className='dark:bg-gray-800 dark:border-gray-700'>
        {currentResources.length === 0 ? (
          <div className='p-12 text-center'>
            <Share2 className='w-12 h-12 text-gray-400 mx-auto mb-4' />
            <h3 className='text-lg mb-2 dark:text-white'>未找到共享资源</h3>
            <p className='text-sm text-gray-600 dark:text-gray-400'>尝试调整搜索条件或筛选器</p>
          </div>
        ) : (
          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead className='bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700'>
                <tr>
                  <th className='px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400'>资源名称</th>
                  <th className='px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400'>类型</th>
                  <th className='px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400'>所有者</th>
                  <th className='px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400'>共享范围</th>
                  <th className='px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400'>权限</th>
                  <th className='px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400'>使用统计</th>
                  <th className='px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400'>最后共享</th>
                  <th className='px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400'>操作</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-200 dark:divide-gray-700'>
                {currentResources.map(resource => {
                  const Icon = resource.icon;
                  const permissionBadge = getPermissionBadge(resource.permission);
                  const PermissionIcon = permissionBadge.icon;

                  return (
                    <tr key={resource.id} className='hover:bg-gray-50 dark:hover:bg-gray-900'>
                      <td className='px-6 py-4'>
                        <div className='flex items-center gap-3'>
                          <div className={`${resource.iconBg} w-10 h-10 rounded-lg flex items-center justify-center`}>
                            <Icon className={`w-5 h-5 ${resource.iconColor}`} />
                          </div>
                          <div>
                            <div className='dark:text-white'>{resource.name}</div>
                            <div className='text-xs text-gray-500 dark:text-gray-400'>
                              创建于 {resource.createdDate}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className='px-6 py-4'>
                        <Badge className='text-xs bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400 border-0'>
                          {mapResourceTypeToDisplay(resource.type)}
                        </Badge>
                      </td>
                      <td className='px-6 py-4 text-sm text-gray-600 dark:text-gray-400'>{resource.owner}</td>
                      <td className='px-6 py-4'>
                        <div className='flex items-center gap-2'>
                          {resource.sharedWith === SharedWithEnum.ALL ? (
                            <>
                              <Globe className='w-4 h-4 text-blue-500' />
                              <span className='text-sm text-gray-600 dark:text-gray-400'>
                                全部成员 ({resource.memberCount})
                              </span>
                            </>
                          ) : (
                            <>
                              <UserCheck className='w-4 h-4 text-green-500' />
                              <span className='text-sm text-gray-600 dark:text-gray-400'>
                                {resource.memberCount} 名成员
                              </span>
                            </>
                          )}
                        </div>
                      </td>
                      <td className='px-6 py-4'>
                        <Badge className={`text-xs ${permissionBadge.color} border-0 gap-1`}>
                          <PermissionIcon className='w-3 h-3' />
                          {permissionBadge.label}
                        </Badge>
                      </td>
                      <td className='px-6 py-4'>
                        <div className='text-xs'>
                          <div className='text-gray-600 dark:text-gray-400'>
                            <Eye className='w-3 h-3 inline mr-1' />
                            {resource.views} 次查看
                          </div>
                          <div className='text-gray-600 dark:text-gray-400'>
                            <Edit className='w-3 h-3 inline mr-1' />
                            {resource.edits} 次编辑
                          </div>
                        </div>
                      </td>
                      <td className='px-6 py-4 text-sm text-gray-600 dark:text-gray-400'>{resource.lastShared}</td>
                      <td className='px-6 py-4'>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className='p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded'>
                              <MoreHorizontal className='w-4 h-4 text-gray-600 dark:text-gray-400' />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align='end' className='dark:bg-gray-800 dark:border-gray-700'>
                            <DropdownMenuItem
                              onClick={() => handleChangePermission(resource, MemberPermissionEnum.VIEW)}
                              className='dark:text-gray-300'
                            >
                              <Eye className='w-4 h-4 mr-2' />
                              设为查看权限
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleChangePermission(resource, MemberPermissionEnum.EDIT)}
                              className='dark:text-gray-300'
                            >
                              <Edit className='w-4 h-4 mr-2' />
                              设为编辑权限
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleChangePermission(resource, MemberPermissionEnum.MANAGE)}
                              className='dark:text-gray-300'
                            >
                              <Shield className='w-4 h-4 mr-2' />
                              设为管理权限
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleRemoveSharing(resource)}
                              className='text-red-600 dark:text-red-400'
                            >
                              <Trash2 className='w-4 h-4 mr-2' />
                              停止共享
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {shouldShowPagination && (
          <div className='flex items-center justify-center px-6 py-4 border-t border-gray-200 dark:border-gray-700'>
            <XcanPagination total={totalCount} pageNo={currentPage} pageSize={itemsPerPage} onChange={({pageNo}) => setCurrentPage(pageNo)} />
          </div>
        )}
      </Card>

      {/* Share Resource Dialog */}
      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent className='dark:bg-gray-800 dark:border-gray-700 sm:max-w-[600px] max-h-[80vh] overflow-y-auto'>
          <DialogHeader>
            <DialogTitle className='dark:text-white'>共享资源</DialogTitle>
            <DialogDescription className='dark:text-gray-400'>选择共享范围和权限设置</DialogDescription>
          </DialogHeader>

          <div className='space-y-6'>
            {/* 资源类型选择 */}
            <div className='space-y-2'>
              <Label className='dark:text-gray-300'>资源类型 *</Label>
              <Select
                value={selectedResourceType}
                onValueChange={value => {
                  setSelectedResourceType(value as ResourceTypeEnum);
                  setSelectedResourceId(''); // 重置资源选择
                }}
              >
                <SelectTrigger className='dark:bg-gray-900 dark:border-gray-700 dark:text-white'>
                  <SelectValue placeholder='请选择资源类型' />
                </SelectTrigger>
                <SelectContent className='dark:bg-gray-800 dark:border-gray-700'>
                  <SelectItem value={ResourceTypeEnum.APPLICATION} className='dark:text-white'>
                    <div className='flex items-center gap-2'>
                      <Zap className='w-4 h-4 text-blue-500' />
                      {getEnumDescription(ResourceTypeEnum, ResourceTypeEnum.APPLICATION)}
                    </div>
                  </SelectItem>
                  <SelectItem value={ResourceTypeEnum.KNOWLEDGE} className='dark:text-white'>
                    <div className='flex items-center gap-2'>
                      <Database className='w-4 h-4 text-purple-500' />
                      {getEnumDescription(ResourceTypeEnum, ResourceTypeEnum.KNOWLEDGE)}
                    </div>
                  </SelectItem>
                  <SelectItem value={ResourceTypeEnum.WORKFLOW} className='dark:text-white'>
                    <div className='flex items-center gap-2'>
                      <Workflow className='w-4 h-4 text-green-500' />
                      {getEnumDescription(ResourceTypeEnum, ResourceTypeEnum.WORKFLOW)}
                    </div>
                  </SelectItem>
                  <SelectItem value={ResourceTypeEnum.MODEL} className='dark:text-white'>
                    <div className='flex items-center gap-2'>
                      <Zap className='w-4 h-4 text-orange-500' />
                      {getEnumDescription(ResourceTypeEnum, ResourceTypeEnum.MODEL)}
                    </div>
                  </SelectItem>
                  <SelectItem value={ResourceTypeEnum.DATASET} className='dark:text-white'>
                    <div className='flex items-center gap-2'>
                      <FileText className='w-4 h-4 text-pink-500' />
                      {getEnumDescription(ResourceTypeEnum, ResourceTypeEnum.DATASET)}
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 资源名称选择 */}
            {selectedResourceType && (
              <div className='space-y-2'>
                <Label className='dark:text-gray-300'>资源名称 *</Label>
                <Select value={selectedResourceId} onValueChange={setSelectedResourceId}>
                  <SelectTrigger className='dark:bg-gray-900 dark:border-gray-700 dark:text-white'>
                    <SelectValue placeholder='请选择要共享的资源' />
                  </SelectTrigger>
                  <SelectContent className='dark:bg-gray-800 dark:border-gray-700'>
                    {availableResources[selectedResourceType]?.map(resource => {
                      const Icon = resource.icon;
                      return (
                        <SelectItem key={resource.id} value={resource.id} className='dark:text-white'>
                          <div className='flex items-center gap-2'>
                            <Icon className='w-4 h-4' />
                            {resource.name}
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className='space-y-2'>
              <Label className='dark:text-gray-300'>共享范围 *</Label>
              <div className='grid grid-cols-2 gap-3'>
                <Card
                  className={`p-4 cursor-pointer transition-all ${
                    shareType === SharedWithEnum.ALL
                      ? 'border-blue-500 dark:border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'dark:bg-gray-900 dark:border-gray-700'
                  }`}
                  onClick={() => setShareType(SharedWithEnum.ALL)}
                >
                  <div className='flex items-center gap-3'>
                    <Globe className='w-5 h-5 text-blue-500' />
                    <div>
                      <div className='dark:text-white'>全部成员</div>
                      <div className='text-xs text-gray-500 dark:text-gray-400'>所有团队成员可访问</div>
                    </div>
                  </div>
                </Card>

                <Card
                  className={`p-4 cursor-pointer transition-all ${
                    shareType === SharedWithEnum.SPECIFIC
                      ? 'border-blue-500 dark:border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'dark:bg-gray-900 dark:border-gray-700'
                  }`}
                  onClick={() => setShareType(SharedWithEnum.SPECIFIC)}
                >
                  <div className='flex items-center gap-3'>
                    <UserCheck className='w-5 h-5 text-green-500' />
                    <div>
                      <div className='dark:text-white'>指定成员</div>
                      <div className='text-xs text-gray-500 dark:text-gray-400'>选择特定成员访问</div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>

            {shareType === SharedWithEnum.SPECIFIC && (
              <div className='space-y-2'>
                <Label className='dark:text-gray-300'>选择成员</Label>
                <div className='border border-gray-200 dark:border-gray-700 rounded-lg p-4 max-h-[200px] overflow-y-auto space-y-2'>
                  {teamMembers.map(member => (
                    <div
                      key={member.id}
                      className='flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-900 rounded'
                    >
                      <Checkbox
                        checked={member.selected}
                        onCheckedChange={checked => {
                          setTeamMembers(
                            teamMembers.map(m => (m.id === member.id ? { ...m, selected: checked as boolean } : m))
                          );
                        }}
                      />
                      <div className='flex items-center gap-2 flex-1'>
                        <div className='w-8 h-8 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 flex items-center justify-center text-xs'>
                          {member.avatar}
                        </div>
                        <div>
                          <div className='text-sm dark:text-white'>{member.name}</div>
                          <div className='text-xs text-gray-500 dark:text-gray-400'>{member.email}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className='text-xs text-gray-500 dark:text-gray-400'>
                  已选择 {teamMembers.filter(m => m.selected).length} 名成员
                </div>
              </div>
            )}

            <div className='space-y-2'>
              <Label htmlFor='share-permission' className='dark:text-gray-300'>
                权限设置 *
              </Label>
              <Select
                value={sharePermission}
                onValueChange={(value) => setSharePermission(value as MemberPermissionEnum)}
              >
                <SelectTrigger className='dark:bg-gray-700 dark:border-gray-600'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className='dark:bg-gray-800 dark:border-gray-700'>
                  <SelectItem value={MemberPermissionEnum.VIEW}>
                    <div className='flex items-center gap-2'>
                      <Eye className='w-4 h-4' />
                      <div>
                        <div>查看</div>
                        <div className='text-xs text-gray-500'>仅可查看资源内容</div>
                      </div>
                    </div>
                  </SelectItem>
                  <SelectItem value={MemberPermissionEnum.EDIT}>
                    <div className='flex items-center gap-2'>
                      <Edit className='w-4 h-4' />
                      <div>
                        <div>编辑</div>
                        <div className='text-xs text-gray-500'>可查看和编辑资源</div>
                      </div>
                    </div>
                  </SelectItem>
                  <SelectItem value={MemberPermissionEnum.MANAGE}>
                    <div className='flex items-center gap-2'>
                      <Shield className='w-4 h-4' />
                      <div>
                        <div>管理</div>
                        <div className='text-xs text-gray-500'>完整管理权限</div>
                      </div>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => {
                setShareDialogOpen(false);
                setTeamMembers(teamMembers.map(m => ({ ...m, selected: false })));
                setSelectedResourceType('');
                setSelectedResourceId('');
                setShareType(SharedWithEnum.ALL);
                setSharePermission(MemberPermissionEnum.VIEW);
              }}
              className='dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300'
            >
              取消
            </Button>
            <Button onClick={handleShare} className='bg-blue-500 hover:bg-blue-600'>
              <Share2 className='w-4 h-4 mr-2' />
              确认共享
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
