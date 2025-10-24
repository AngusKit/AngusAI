import { useState } from 'react';
import { useLanguage } from '../layout/LanguageProvider';
import {
  Database,
  Edit,
  Eye,
  FileText,
  Filter,
  Globe,
  MoreHorizontal,
  Plus,
  Search,
  Share2,
  Shield,
  Trash2,
  TrendingUp,
  UserCheck,
  Workflow,
  Zap,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Label } from '../ui/label';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Checkbox } from '../ui/checkbox';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '../ui/pagination';
import { toast } from 'sonner';

interface SharedResource {
  id: number;
  name: string;
  type: '应用' | '知识库' | '工作流' | '模型' | '数据集';
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  owner: string;
  sharedWith: 'all' | 'specific';
  memberCount: number;
  permission: 'view' | 'edit' | 'manage';
  lastShared: string;
  views: number;
  edits: number;
  createdDate: string;
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
  const [typeFilter, setTypeFilter] = useState('all');
  const [permissionFilter, setPermissionFilter] = useState('all');
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [selectedResource, setSelectedResource] =
    useState<SharedResource | null>(null);
  const [shareType, setShareType] = useState<'all' | 'specific'>('all');
  const [sharePermission, setSharePermission] = useState('view');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const [resources, setResources] = useState<SharedResource[]>([
    {
      id: 1,
      name: '智能客服应用',
      type: '应用',
      icon: Zap,
      iconBg: 'bg-blue-100 dark:bg-blue-900/30',
      iconColor: 'text-blue-600 dark:text-blue-400',
      owner: '张伟',
      sharedWith: 'all',
      memberCount: 12,
      permission: 'edit',
      lastShared: '2小时前',
      views: 156,
      edits: 23,
      createdDate: '2024-03-15',
    },
    {
      id: 2,
      name: '产品知识库',
      type: '知识库',
      icon: Database,
      iconBg: 'bg-purple-100 dark:bg-purple-900/30',
      iconColor: 'text-purple-600 dark:text-purple-400',
      owner: '李娜',
      sharedWith: 'specific',
      memberCount: 5,
      permission: 'view',
      lastShared: '1天前',
      views: 89,
      edits: 0,
      createdDate: '2024-02-20',
    },
    {
      id: 3,
      name: '自动化审批流程',
      type: '工作流',
      icon: Workflow,
      iconBg: 'bg-green-100 dark:bg-green-900/30',
      iconColor: 'text-green-600 dark:text-green-400',
      owner: '王芳',
      sharedWith: 'all',
      memberCount: 12,
      permission: 'manage',
      lastShared: '3天前',
      views: 67,
      edits: 12,
      createdDate: '2024-03-01',
    },
    {
      id: 4,
      name: 'GPT-4 模型',
      type: '模型',
      icon: Zap,
      iconBg: 'bg-orange-100 dark:bg-orange-900/30',
      iconColor: 'text-orange-600 dark:text-orange-400',
      owner: '张伟',
      sharedWith: 'specific',
      memberCount: 8,
      permission: 'view',
      lastShared: '5天前',
      views: 234,
      edits: 0,
      createdDate: '2024-01-10',
    },
    {
      id: 5,
      name: '客户数据集',
      type: '数据集',
      icon: FileText,
      iconBg: 'bg-pink-100 dark:bg-pink-900/30',
      iconColor: 'text-pink-600 dark:text-pink-400',
      owner: '刘强',
      sharedWith: 'specific',
      memberCount: 3,
      permission: 'edit',
      lastShared: '1周前',
      views: 45,
      edits: 8,
      createdDate: '2024-02-15',
    },
    {
      id: 6,
      name: '营销活动应用',
      type: '应用',
      icon: Zap,
      iconBg: 'bg-blue-100 dark:bg-blue-900/30',
      iconColor: 'text-blue-600 dark:text-blue-400',
      owner: '李娜',
      sharedWith: 'all',
      memberCount: 12,
      permission: 'edit',
      lastShared: '2周前',
      views: 78,
      edits: 15,
      createdDate: '2024-01-25',
    },
    {
      id: 7,
      name: '技术文档知识库',
      type: '知识库',
      icon: Database,
      iconBg: 'bg-purple-100 dark:bg-purple-900/30',
      iconColor: 'text-purple-600 dark:text-purple-400',
      owner: '周洋',
      sharedWith: 'specific',
      memberCount: 6,
      permission: 'edit',
      lastShared: '3天前',
      views: 112,
      edits: 18,
      createdDate: '2024-03-05',
    },
    {
      id: 8,
      name: '数据分析工作流',
      type: '工作流',
      icon: Workflow,
      iconBg: 'bg-green-100 dark:bg-green-900/30',
      iconColor: 'text-green-600 dark:text-green-400',
      owner: '孙明',
      sharedWith: 'all',
      memberCount: 12,
      permission: 'view',
      lastShared: '4天前',
      views: 93,
      edits: 0,
      createdDate: '2024-02-28',
    },
    {
      id: 9,
      name: '图像识别模型',
      type: '模型',
      icon: Zap,
      iconBg: 'bg-orange-100 dark:bg-orange-900/30',
      iconColor: 'text-orange-600 dark:text-orange-400',
      owner: '吴秀英',
      sharedWith: 'specific',
      memberCount: 4,
      permission: 'view',
      lastShared: '6天前',
      views: 145,
      edits: 0,
      createdDate: '2024-01-20',
    },
    {
      id: 10,
      name: '用户行为数据集',
      type: '数据集',
      icon: FileText,
      iconBg: 'bg-pink-100 dark:bg-pink-900/30',
      iconColor: 'text-pink-600 dark:text-pink-400',
      owner: '郑杰',
      sharedWith: 'specific',
      memberCount: 7,
      permission: 'manage',
      lastShared: '1天前',
      views: 67,
      edits: 11,
      createdDate: '2024-03-20',
    },
  ]);

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

  const getPermissionBadge = (permission: string) => {
    const badges = {
      view: {
        label: '查看',
        color: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400',
        icon: Eye,
      },
      edit: {
        label: '编辑',
        color:
          'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
        icon: Edit,
      },
      manage: {
        label: '管理',
        color:
          'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
        icon: Shield,
      },
    };
    return badges[permission as keyof typeof badges];
  };

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || resource.type === typeFilter;
    const matchesPermission =
      permissionFilter === 'all' || resource.permission === permissionFilter;
    return matchesSearch && matchesType && matchesPermission;
  });

  // 分页逻辑
  const totalPages = Math.ceil(filteredResources.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentResources = filteredResources.slice(startIndex, endIndex);
  const shouldShowPagination = filteredResources.length > itemsPerPage;

  const handleShare = () => {
    if (shareType === 'specific') {
      const selectedCount = teamMembers.filter(m => m.selected).length;
      if (selectedCount === 0) {
        toast.error('请至少选择一个成员');
        return;
      }
      toast.success(`已与 ${selectedCount} 名成员共享资源`);
    } else {
      toast.success('已与所有团队成员共享资源');
    }
    setShareDialogOpen(false);
    setTeamMembers(teamMembers.map(m => ({ ...m, selected: false })));
  };

  const handleRemoveSharing = (resource: SharedResource) => {
    setResources(resources.filter(r => r.id !== resource.id));
    toast.success(`已停止共享: ${resource.name}`);
  };

  const handleChangePermission = (
    resource: SharedResource,
    newPermission: string
  ) => {
    setResources(
      resources.map(r =>
        r.id === resource.id ? { ...r, permission: newPermission as any } : r
      )
    );
    toast.success(`已更改权限为: ${getPermissionBadge(newPermission).label}`);
  };

  const stats = [
    {
      label: '共享资源',
      value: resources.length,
      subtext: `${resources.filter(r => r.sharedWith === 'all').length} 个全员共享`,
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
        <p className='text-sm text-gray-600 dark:text-gray-400'>
          管理团队资源共享和权限设置
        </p>
      </div>

      {/* Stats Cards */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card
              key={index}
              className='p-5 dark:bg-gray-800 dark:border-gray-700'
            >
              <div className='flex items-start justify-between mb-3'>
                <div
                  className={`p-2 rounded-lg bg-gray-100 dark:bg-gray-700 ${stat.color}`}
                >
                  <Icon className='w-5 h-5' />
                </div>
              </div>
              <div className='text-base text-gray-600 dark:text-gray-400 mb-0.5'>
                {stat.label}
              </div>
              <div className='text-3xl dark:text-white mb-0.5'>
                {stat.value}
              </div>
              <div className='text-xs text-gray-500 dark:text-gray-400'>
                {stat.subtext}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Action Bar */}
      <div className='flex items-center justify-between gap-3'>
        <div className='flex items-center gap-3 flex-1'>
          <div className='relative w-[390px]'>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400' />
            <Input
              placeholder='搜索共享资源...'
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className='pl-9 dark:bg-gray-800 dark:border-gray-700'
            />
          </div>

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
        </div>

        <Button
          onClick={() => setShareDialogOpen(true)}
          className='bg-blue-500 hover:bg-blue-600'
        >
          <Plus className='w-4 h-4 mr-2' />
          共享资源
        </Button>
      </div>

      {/* Resources Table */}
      <Card className='dark:bg-gray-800 dark:border-gray-700'>
        {currentResources.length === 0 ? (
          <div className='p-12 text-center'>
            <Share2 className='w-12 h-12 text-gray-400 mx-auto mb-4' />
            <h3 className='text-lg mb-2 dark:text-white'>未找到共享资源</h3>
            <p className='text-sm text-gray-600 dark:text-gray-400'>
              尝试调整搜索条件或筛选器
            </p>
          </div>
        ) : (
          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead className='bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700'>
                <tr>
                  <th className='px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400'>
                    资源名称
                  </th>
                  <th className='px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400'>
                    类型
                  </th>
                  <th className='px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400'>
                    所有者
                  </th>
                  <th className='px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400'>
                    共享范围
                  </th>
                  <th className='px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400'>
                    权限
                  </th>
                  <th className='px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400'>
                    使用统计
                  </th>
                  <th className='px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400'>
                    最后共享
                  </th>
                  <th className='px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400'>
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-200 dark:divide-gray-700'>
                {currentResources.map(resource => {
                  const Icon = resource.icon;
                  const permissionBadge = getPermissionBadge(
                    resource.permission
                  );
                  const PermissionIcon = permissionBadge.icon;

                  return (
                    <tr
                      key={resource.id}
                      className='hover:bg-gray-50 dark:hover:bg-gray-900'
                    >
                      <td className='px-6 py-4'>
                        <div className='flex items-center gap-3'>
                          <div
                            className={`${resource.iconBg} w-10 h-10 rounded-lg flex items-center justify-center`}
                          >
                            <Icon className={`w-5 h-5 ${resource.iconColor}`} />
                          </div>
                          <div>
                            <div className='dark:text-white'>
                              {resource.name}
                            </div>
                            <div className='text-xs text-gray-500 dark:text-gray-400'>
                              创建于 {resource.createdDate}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className='px-6 py-4'>
                        <Badge className='text-xs bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400 border-0'>
                          {resource.type}
                        </Badge>
                      </td>
                      <td className='px-6 py-4 text-sm text-gray-600 dark:text-gray-400'>
                        {resource.owner}
                      </td>
                      <td className='px-6 py-4'>
                        <div className='flex items-center gap-2'>
                          {resource.sharedWith === 'all' ? (
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
                        <Badge
                          className={`text-xs ${permissionBadge.color} border-0 gap-1`}
                        >
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
                      <td className='px-6 py-4 text-sm text-gray-600 dark:text-gray-400'>
                        {resource.lastShared}
                      </td>
                      <td className='px-6 py-4'>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className='p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded'>
                              <MoreHorizontal className='w-4 h-4 text-gray-600 dark:text-gray-400' />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align='end'
                            className='dark:bg-gray-800 dark:border-gray-700'
                          >
                            <DropdownMenuItem
                              onClick={() =>
                                handleChangePermission(resource, 'view')
                              }
                              className='dark:text-gray-300'
                            >
                              <Eye className='w-4 h-4 mr-2' />
                              设为查看权限
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                handleChangePermission(resource, 'edit')
                              }
                              className='dark:text-gray-300'
                            >
                              <Edit className='w-4 h-4 mr-2' />
                              设为编辑权限
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                handleChangePermission(resource, 'manage')
                              }
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
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  page => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => setCurrentPage(page)}
                        isActive={currentPage === page}
                        className='cursor-pointer'
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  )
                )}
                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      setCurrentPage(prev => Math.min(totalPages, prev + 1))
                    }
                    className={
                      currentPage === totalPages
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
      </Card>

      {/* Share Resource Dialog */}
      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent className='dark:bg-gray-800 dark:border-gray-700 sm:max-w-[600px] max-h-[80vh] overflow-y-auto'>
          <DialogHeader>
            <DialogTitle className='dark:text-white'>共享资源</DialogTitle>
            <DialogDescription className='dark:text-gray-400'>
              选择共享范围和权限设置
            </DialogDescription>
          </DialogHeader>

          <div className='space-y-6'>
            <div className='space-y-2'>
              <Label className='dark:text-gray-300'>共享范围 *</Label>
              <div className='grid grid-cols-2 gap-3'>
                <Card
                  className={`p-4 cursor-pointer transition-all ${
                    shareType === 'all'
                      ? 'border-blue-500 dark:border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'dark:bg-gray-900 dark:border-gray-700'
                  }`}
                  onClick={() => setShareType('all')}
                >
                  <div className='flex items-center gap-3'>
                    <Globe className='w-5 h-5 text-blue-500' />
                    <div>
                      <div className='dark:text-white'>全部成员</div>
                      <div className='text-xs text-gray-500 dark:text-gray-400'>
                        所有团队成员可访问
                      </div>
                    </div>
                  </div>
                </Card>

                <Card
                  className={`p-4 cursor-pointer transition-all ${
                    shareType === 'specific'
                      ? 'border-blue-500 dark:border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'dark:bg-gray-900 dark:border-gray-700'
                  }`}
                  onClick={() => setShareType('specific')}
                >
                  <div className='flex items-center gap-3'>
                    <UserCheck className='w-5 h-5 text-green-500' />
                    <div>
                      <div className='dark:text-white'>指定成员</div>
                      <div className='text-xs text-gray-500 dark:text-gray-400'>
                        选择特定成员访问
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>

            {shareType === 'specific' && (
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
                            teamMembers.map(m =>
                              m.id === member.id
                                ? { ...m, selected: checked as boolean }
                                : m
                            )
                          );
                        }}
                      />
                      <div className='flex items-center gap-2 flex-1'>
                        <div className='w-8 h-8 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 flex items-center justify-center text-xs'>
                          {member.avatar}
                        </div>
                        <div>
                          <div className='text-sm dark:text-white'>
                            {member.name}
                          </div>
                          <div className='text-xs text-gray-500 dark:text-gray-400'>
                            {member.email}
                          </div>
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
                onValueChange={setSharePermission}
              >
                <SelectTrigger className='dark:bg-gray-700 dark:border-gray-600'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className='dark:bg-gray-800 dark:border-gray-700'>
                  <SelectItem value='view'>
                    <div className='flex items-center gap-2'>
                      <Eye className='w-4 h-4' />
                      <div>
                        <div>查看</div>
                        <div className='text-xs text-gray-500'>
                          仅可查看资源内容
                        </div>
                      </div>
                    </div>
                  </SelectItem>
                  <SelectItem value='edit'>
                    <div className='flex items-center gap-2'>
                      <Edit className='w-4 h-4' />
                      <div>
                        <div>编辑</div>
                        <div className='text-xs text-gray-500'>
                          可查看和编辑资源
                        </div>
                      </div>
                    </div>
                  </SelectItem>
                  <SelectItem value='manage'>
                    <div className='flex items-center gap-2'>
                      <Shield className='w-4 h-4' />
                      <div>
                        <div>管理</div>
                        <div className='text-xs text-gray-500'>
                          完整管理权限
                        </div>
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
                setTeamMembers(
                  teamMembers.map(m => ({ ...m, selected: false }))
                );
              }}
              className='dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300'
            >
              取消
            </Button>
            <Button
              onClick={handleShare}
              className='bg-blue-500 hover:bg-blue-600'
            >
              <Share2 className='w-4 h-4 mr-2' />
              确认共享
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
