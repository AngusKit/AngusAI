import { useState } from 'react';
import { useLanguage } from '@/components/ui/LanguageProvider';
import { Users, Search, UserPlus, Mail, MoreHorizontal, Shield, Eye, Edit, Trash2, Crown, User, Clock, CheckCircle, XCircle, AlertCircle, Copy, Send, } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, XcanPagination } from '@/components/ui/pagination';
import { toast } from 'sonner';

interface TeamMember {
  id: number;
  name: string;
  email: string;
  avatar: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  status: 'active' | 'inactive' | 'pending';
  joinedDate: string;
  lastActive: string;
  resourcesShared: number;
  resourcesAccessed: number;
}

interface PendingInvitation {
  id: number;
  email: string;
  role: 'admin' | 'member' | 'viewer';
  invitedBy: string;
  invitedDate: string;
  expiresDate: string;
}

export function TeamMembers() {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [memberDetailsOpen, setMemberDetailsOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('member');
  const [inviteMessage, setInviteMessage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [currentInvitePage, setCurrentInvitePage] = useState(1);
  const itemsPerPage = 6;

  const [members, setMembers] = useState<TeamMember[]>([
    {
      id: 1,
      name: '张伟',
      email: 'zhangwei@example.com',
      avatar: 'ZW',
      role: 'owner',
      status: 'active',
      joinedDate: '2024-01-15',
      lastActive: '2分钟前',
      resourcesShared: 28,
      resourcesAccessed: 156,
    },
    {
      id: 2,
      name: '李娜',
      email: 'lina@example.com',
      avatar: 'LN',
      role: 'admin',
      status: 'active',
      joinedDate: '2024-02-20',
      lastActive: '10分钟前',
      resourcesShared: 15,
      resourcesAccessed: 89,
    },
    {
      id: 3,
      name: '王芳',
      email: 'wangfang@example.com',
      avatar: 'WF',
      role: 'member',
      status: 'active',
      joinedDate: '2024-03-10',
      lastActive: '1小时前',
      resourcesShared: 8,
      resourcesAccessed: 42,
    },
    {
      id: 4,
      name: '刘强',
      email: 'liuqiang@example.com',
      avatar: 'LQ',
      role: 'member',
      status: 'active',
      joinedDate: '2024-03-15',
      lastActive: '3小时前',
      resourcesShared: 5,
      resourcesAccessed: 31,
    },
    {
      id: 5,
      name: '陈静',
      email: 'chenjing@example.com',
      avatar: 'CJ',
      role: 'viewer',
      status: 'active',
      joinedDate: '2024-04-01',
      lastActive: '5小时前',
      resourcesShared: 0,
      resourcesAccessed: 18,
    },
    {
      id: 6,
      name: '赵磊',
      email: 'zhaolei@example.com',
      avatar: 'ZL',
      role: 'member',
      status: 'inactive',
      joinedDate: '2024-02-28',
      lastActive: '7天前',
      resourcesShared: 3,
      resourcesAccessed: 12,
    },
    {
      id: 7,
      name: '孙明',
      email: 'sunming@example.com',
      avatar: 'SM',
      role: 'member',
      status: 'active',
      joinedDate: '2024-03-25',
      lastActive: '30分钟前',
      resourcesShared: 12,
      resourcesAccessed: 67,
    },
    {
      id: 8,
      name: '周洋',
      email: 'zhouyang@example.com',
      avatar: 'ZY',
      role: 'admin',
      status: 'active',
      joinedDate: '2024-02-10',
      lastActive: '15分钟前',
      resourcesShared: 22,
      resourcesAccessed: 134,
    },
    {
      id: 9,
      name: '吴秀英',
      email: 'wuxiuying@example.com',
      avatar: 'WX',
      role: 'member',
      status: 'active',
      joinedDate: '2024-04-05',
      lastActive: '2小时前',
      resourcesShared: 6,
      resourcesAccessed: 28,
    },
    {
      id: 10,
      name: '郑杰',
      email: 'zhengjie@example.com',
      avatar: 'ZJ',
      role: 'viewer',
      status: 'active',
      joinedDate: '2024-04-15',
      lastActive: '4小时前',
      resourcesShared: 0,
      resourcesAccessed: 9,
    },
  ]);

  const [pendingInvitations, setPendingInvitations] = useState<PendingInvitation[]>([
    {
      id: 1,
      email: 'newmember@example.com',
      role: 'member',
      invitedBy: '张伟',
      invitedDate: '2024-04-10',
      expiresDate: '2024-04-17',
    },
    {
      id: 2,
      email: 'developer@example.com',
      role: 'admin',
      invitedBy: '李娜',
      invitedDate: '2024-04-12',
      expiresDate: '2024-04-19',
    },
    {
      id: 3,
      email: 'designer@example.com',
      role: 'member',
      invitedBy: '张伟',
      invitedDate: '2024-04-14',
      expiresDate: '2024-04-21',
    },
    {
      id: 4,
      email: 'analyst@example.com',
      role: 'viewer',
      invitedBy: '李娜',
      invitedDate: '2024-04-15',
      expiresDate: '2024-04-22',
    },
    {
      id: 5,
      email: 'manager@example.com',
      role: 'admin',
      invitedBy: '张伟',
      invitedDate: '2024-04-16',
      expiresDate: '2024-04-23',
    },
    {
      id: 6,
      email: 'engineer@example.com',
      role: 'member',
      invitedBy: '周洋',
      invitedDate: '2024-04-17',
      expiresDate: '2024-04-24',
    },
    {
      id: 7,
      email: 'consultant@example.com',
      role: 'viewer',
      invitedBy: '李娜',
      invitedDate: '2024-04-18',
      expiresDate: '2024-04-25',
    },
  ]);

  const getRoleBadge = (role: string) => {
    const badges = {
      owner: {
        label: '所有者',
        color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
        icon: Crown,
      },
      admin: {
        label: '管理员',
        color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
        icon: Shield,
      },
      member: {
        label: '成员',
        color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
        icon: User,
      },
      viewer: {
        label: '访客',
        color: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400',
        icon: Eye,
      },
    };
    return badges[role as keyof typeof badges];
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      active: {
        label: '活跃',
        color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
        icon: CheckCircle,
      },
      inactive: {
        label: '不活跃',
        color: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400',
        icon: Clock,
      },
      pending: {
        label: '待确认',
        color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
        icon: AlertCircle,
      },
    };
    return badges[status as keyof typeof badges];
  };

  const filteredMembers = members.filter(member => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || member.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || member.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  // 分页逻辑 - 成员列表
  const totalPages = Math.ceil(filteredMembers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentMembers = filteredMembers.slice(startIndex, endIndex);
  const shouldShowPagination = filteredMembers.length > itemsPerPage;

  // 分页逻辑 - 邀请列表
  const totalInvitePages = Math.ceil(pendingInvitations.length / itemsPerPage);
  const inviteStartIndex = (currentInvitePage - 1) * itemsPerPage;
  const inviteEndIndex = inviteStartIndex + itemsPerPage;
  const currentInvitations = pendingInvitations.slice(inviteStartIndex, inviteEndIndex);
  const shouldShowInvitePagination = pendingInvitations.length > itemsPerPage;

  const handleInviteMember = () => {
    if (!inviteEmail) {
      toast.error('请输入邮箱地址');
      return;
    }
    toast.success(`邀请已发送至 ${inviteEmail}`);
    setPendingInvitations([
      ...pendingInvitations,
      {
        id: Date.now(),
        email: inviteEmail,
        role: inviteRole as 'admin' | 'member' | 'viewer',
        invitedBy: '张伟',
        invitedDate: new Date().toISOString().split('T')[0],
        expiresDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      },
    ]);
    setInviteDialogOpen(false);
    setInviteEmail('');
    setInviteMessage('');
  };

  const handleRemoveMember = (member: TeamMember) => {
    if (member.role === 'owner') {
      toast.error('无法移除所有者');
      return;
    }
    setMembers(members.filter(m => m.id !== member.id));
    toast.success(`已移除成员: ${member.name}`);
  };

  const handleChangeRole = (member: TeamMember, newRole: string) => {
    if (member.role === 'owner') {
      toast.error('无法更改所有者角色');
      return;
    }
    setMembers(members.map(m => (m.id === member.id ? { ...m, role: newRole as any } : m)));
    toast.success(`已将 ${member.name} 的角色更改为 ${getRoleBadge(newRole).label}`);
  };

  const handleCancelInvitation = (id: number) => {
    setPendingInvitations(pendingInvitations.filter(inv => inv.id !== id));
    toast.success('已取消邀请');
  };

  const handleResendInvitation = (email: string) => {
    toast.success(`已重新发送邀请至 ${email}`);
  };

  const stats = [
    {
      label: '团队成员',
      value: members.length,
      subtext: '活跃成员',
      icon: Users,
      color: 'text-blue-600',
    },
    {
      label: '待处理邀请',
      value: pendingInvitations.length,
      subtext: '等待接受',
      icon: Mail,
      color: 'text-orange-600',
    },
    {
      label: '管理员',
      value: members.filter(m => m.role === 'admin' || m.role === 'owner').length,
      subtext: '拥有管理权限',
      icon: Shield,
      color: 'text-purple-600',
    },
    {
      label: '活跃率',
      value: '87%',
      subtext: '过去7天',
      icon: CheckCircle,
      color: 'text-green-600',
    },
  ];

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div>
        <h1 className='text-2xl mb-1 dark:text-white'>{t('team.members.title')}</h1>
        <p className='text-sm text-gray-600 dark:text-gray-400'>{t('team.members.subtitle')}</p>
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

      {/* Tabs */}
      <Tabs defaultValue='members' className='w-full'>
        <TabsList className='dark:bg-gray-800'>
          <TabsTrigger value='members'>全部成员</TabsTrigger>
          <TabsTrigger value='pending'>待处理邀请 ({pendingInvitations.length})</TabsTrigger>
        </TabsList>

        <TabsContent value='members' className='space-y-4 mt-0'>
          {/* Action Bar */}
          <div className='flex items-center justify-between gap-3'>
            <div className='relative w-[390px]'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400' />
              <Input
                placeholder='搜索成员姓名或邮箱...'
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className='pl-9 dark:bg-gray-800 dark:border-gray-700'
              />
            </div>

            <div className='flex items-center gap-3'>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className='w-[140px] dark:bg-gray-800 dark:border-gray-700'>
                  <SelectValue placeholder='角色筛选' />
                </SelectTrigger>
                <SelectContent className='dark:bg-gray-800 dark:border-gray-700'>
                  <SelectItem value='all'>全部角色</SelectItem>
                  <SelectItem value='owner'>所有者</SelectItem>
                  <SelectItem value='admin'>管理员</SelectItem>
                  <SelectItem value='member'>成员</SelectItem>
                  <SelectItem value='viewer'>访客</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className='w-[140px] dark:bg-gray-800 dark:border-gray-700'>
                  <SelectValue placeholder='状态筛选' />
                </SelectTrigger>
                <SelectContent className='dark:bg-gray-800 dark:border-gray-700'>
                  <SelectItem value='all'>全部状态</SelectItem>
                  <SelectItem value='active'>活跃</SelectItem>
                  <SelectItem value='inactive'>不活跃</SelectItem>
                </SelectContent>
              </Select>

              <Button onClick={() => setInviteDialogOpen(true)} className='bg-blue-500 hover:bg-blue-600'>
                <UserPlus className='w-4 h-4 mr-2' />
                邀请成员
              </Button>
            </div>
          </div>

          {/* Members Table */}
          <Card className='dark:bg-gray-800 dark:border-gray-700'>
            {currentMembers.length === 0 ? (
              <div className='p-12 text-center'>
                <Users className='w-12 h-12 text-gray-400 mx-auto mb-4' />
                <h3 className='text-lg mb-2 dark:text-white'>未找到成员</h3>
                <p className='text-sm text-gray-600 dark:text-gray-400'>尝试调整搜索条件或筛选器</p>
              </div>
            ) : (
              <div className='overflow-x-auto'>
                <table className='w-full'>
                  <thead className='bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700'>
                    <tr>
                      <th className='px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400'>成员</th>
                      <th className='px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400'>角色</th>
                      <th className='px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400'>状态</th>
                      <th className='px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400'>资源统计</th>
                      <th className='px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400'>最后活跃</th>
                      <th className='px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400'>加入时间</th>
                      <th className='px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400'>操作</th>
                    </tr>
                  </thead>
                  <tbody className='divide-y divide-gray-200 dark:divide-gray-700'>
                    {currentMembers.map(member => {
                      const roleBadge = getRoleBadge(member.role);
                      const statusBadge = getStatusBadge(member.status);
                      const RoleIcon = roleBadge.icon;
                      const StatusIcon = statusBadge.icon;

                      return (
                        <tr key={member.id} className='hover:bg-gray-50 dark:hover:bg-gray-900'>
                          <td className='px-6 py-4'>
                            <div className='flex items-center gap-3'>
                              <Avatar>
                                <AvatarFallback className='bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'>
                                  {member.avatar}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className='dark:text-white'>{member.name}</div>
                                <div className='text-xs text-gray-500 dark:text-gray-400'>{member.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className='px-6 py-4'>
                            <Badge className={`text-xs ${roleBadge.color} border-0 gap-1`}>
                              <RoleIcon className='w-3 h-3' />
                              {roleBadge.label}
                            </Badge>
                          </td>
                          <td className='px-6 py-4'>
                            <Badge className={`text-xs ${statusBadge.color} border-0 gap-1`}>
                              <StatusIcon className='w-3 h-3' />
                              {statusBadge.label}
                            </Badge>
                          </td>
                          <td className='px-6 py-4 text-sm dark:text-gray-300'>
                            <div className='text-xs'>
                              <div>共享: {member.resourcesShared}</div>
                              <div className='text-gray-500 dark:text-gray-400'>访问: {member.resourcesAccessed}</div>
                            </div>
                          </td>
                          <td className='px-6 py-4 text-sm text-gray-600 dark:text-gray-400'>{member.lastActive}</td>
                          <td className='px-6 py-4 text-sm text-gray-600 dark:text-gray-400'>{member.joinedDate}</td>
                          <td className='px-6 py-4'>
                            <div className='flex items-center gap-2'>
                              <button
                                onClick={() => {
                                  setSelectedMember(member);
                                  setMemberDetailsOpen(true);
                                }}
                                className='p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded'
                              >
                                <Eye className='w-4 h-4 text-blue-500' />
                              </button>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <button className='p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded'>
                                    <MoreHorizontal className='w-4 h-4 text-gray-600 dark:text-gray-400' />
                                  </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align='end' className='dark:bg-gray-800 dark:border-gray-700'>
                                  {member.role !== 'owner' && (
                                    <>
                                      <DropdownMenuItem
                                        onClick={() => handleChangeRole(member, 'admin')}
                                        className='dark:text-gray-300'
                                      >
                                        <Shield className='w-4 h-4 mr-2' />
                                        设为管理员
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        onClick={() => handleChangeRole(member, 'member')}
                                        className='dark:text-gray-300'
                                      >
                                        <User className='w-4 h-4 mr-2' />
                                        设为成员
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        onClick={() => handleChangeRole(member, 'viewer')}
                                        className='dark:text-gray-300'
                                      >
                                        <Eye className='w-4 h-4 mr-2' />
                                        设为访客
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        onClick={() => handleRemoveMember(member)}
                                        className='text-red-600 dark:text-red-400'
                                      >
                                        <Trash2 className='w-4 h-4 mr-2' />
                                        移除成员
                                      </DropdownMenuItem>
                                    </>
                                  )}
                                  {member.role === 'owner' && (
                                    <DropdownMenuItem disabled className='dark:text-gray-500'>
                                      所有者无法编辑
                                    </DropdownMenuItem>
                                  )}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* Members Pagination */}
            {shouldShowPagination && (
              <div className='flex items-center justify-center px-6 py-4 border-t border-gray-200 dark:border-gray-700'>
                <XcanPagination 
                  pageSize={itemsPerPage}
                  pageNo={currentPage}
                  total={filteredMembers.length}
                  onChange={({pageNo}) => setCurrentPage(pageNo)}
                />
              </div>
            )}
          </Card>
        </TabsContent>

        <TabsContent value='pending' className='space-y-4 mt-0'>
          <Card className='dark:bg-gray-800 dark:border-gray-700'>
            {currentInvitations.length === 0 ? (
              <div className='p-12 text-center'>
                <Mail className='w-12 h-12 text-gray-400 mx-auto mb-4' />
                <h3 className='text-lg mb-2 dark:text-white'>无待处理邀请</h3>
                <p className='text-sm text-gray-600 dark:text-gray-400'>所有邀请已被接受或过期</p>
              </div>
            ) : (
              <div className='overflow-x-auto'>
                <table className='w-full'>
                  <thead className='bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700'>
                    <tr>
                      <th className='px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400'>邮箱</th>
                      <th className='px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400'>角色</th>
                      <th className='px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400'>邀请人</th>
                      <th className='px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400'>邀请日期</th>
                      <th className='px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400'>过期日期</th>
                      <th className='px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400'>操作</th>
                    </tr>
                  </thead>
                  <tbody className='divide-y divide-gray-200 dark:divide-gray-700'>
                    {currentInvitations.map(invitation => {
                      const roleBadge = getRoleBadge(invitation.role);
                      const RoleIcon = roleBadge.icon;

                      return (
                        <tr key={invitation.id} className='hover:bg-gray-50 dark:hover:bg-gray-900'>
                          <td className='px-6 py-4 text-sm dark:text-white'>{invitation.email}</td>
                          <td className='px-6 py-4'>
                            <Badge className={`text-xs ${roleBadge.color} border-0 gap-1`}>
                              <RoleIcon className='w-3 h-3' />
                              {roleBadge.label}
                            </Badge>
                          </td>
                          <td className='px-6 py-4 text-sm text-gray-600 dark:text-gray-400'>{invitation.invitedBy}</td>
                          <td className='px-6 py-4 text-sm text-gray-600 dark:text-gray-400'>
                            {invitation.invitedDate}
                          </td>
                          <td className='px-6 py-4 text-sm text-gray-600 dark:text-gray-400'>
                            {invitation.expiresDate}
                          </td>
                          <td className='px-6 py-4'>
                            <div className='flex items-center gap-2'>
                              <button
                                onClick={() => handleResendInvitation(invitation.email)}
                                className='p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded'
                                title='重新发送'
                              >
                                <Send className='w-4 h-4 text-blue-500' />
                              </button>
                              <button
                                onClick={() => handleCancelInvitation(invitation.id)}
                                className='p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded'
                                title='取消邀请'
                              >
                                <XCircle className='w-4 h-4 text-red-500' />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* Invitations Pagination */}
            {shouldShowInvitePagination && (
              <div className='flex items-center justify-center px-6 py-4 border-t border-gray-200 dark:border-gray-700'>
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => setCurrentInvitePage(prev => Math.max(1, prev - 1))}
                        className={currentInvitePage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                      >
                        上一页
                      </PaginationPrevious>
                    </PaginationItem>
                    {Array.from({ length: totalInvitePages }, (_, i) => i + 1).map(page => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={() => setCurrentInvitePage(page)}
                          isActive={currentInvitePage === page}
                          className='cursor-pointer'
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext
                        onClick={() => setCurrentInvitePage(prev => Math.min(totalInvitePages, prev + 1))}
                        className={
                          currentInvitePage === totalInvitePages ? 'pointer-events-none opacity-50' : 'cursor-pointer'
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
        </TabsContent>
      </Tabs>

      {/* Invite Member Dialog */}
      <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
        <DialogContent className='dark:bg-gray-800 dark:border-gray-700 sm:max-w-[500px]'>
          <DialogHeader>
            <DialogTitle className='dark:text-white'>邀请团队成员</DialogTitle>
            <DialogDescription className='dark:text-gray-400'>通过邮箱邀请新成员加入团队</DialogDescription>
          </DialogHeader>

          <div className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='invite-email' className='dark:text-gray-300'>
                邮箱地址 *
              </Label>
              <Input
                id='invite-email'
                type='email'
                placeholder='member@example.com'
                value={inviteEmail}
                onChange={e => setInviteEmail(e.target.value)}
                className='dark:bg-gray-700 dark:border-gray-600'
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='invite-role' className='dark:text-gray-300'>
                分配角色 *
              </Label>
              <Select value={inviteRole} onValueChange={setInviteRole}>
                <SelectTrigger className='dark:bg-gray-700 dark:border-gray-600'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className='dark:bg-gray-800 dark:border-gray-700'>
                  <SelectItem value='admin'>管理员 - 完整管理权限</SelectItem>
                  <SelectItem value='member'>成员 - 创建和编辑权限</SelectItem>
                  <SelectItem value='viewer'>访客 - 仅查看权限</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='invite-message' className='dark:text-gray-300'>
                邀请消息（可选）
              </Label>
              <Input
                id='invite-message'
                placeholder='欢迎加入我们的团队...'
                value={inviteMessage}
                onChange={e => setInviteMessage(e.target.value)}
                className='dark:bg-gray-700 dark:border-gray-600'
              />
            </div>

            <div className='p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800'>
              <div className='flex gap-2'>
                <AlertCircle className='w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5' />
                <div className='text-xs text-blue-600 dark:text-blue-400'>
                  邀请链接将在7天后过期，受邀者需要在过期前接受邀请。
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => setInviteDialogOpen(false)}
              className='dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300'
            >
              取消
            </Button>
            <Button onClick={handleInviteMember} className='bg-blue-500 hover:bg-blue-600'>
              <Send className='w-4 h-4 mr-2' />
              发送邀请
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Member Details Dialog */}
      <Dialog open={memberDetailsOpen} onOpenChange={setMemberDetailsOpen}>
        <DialogContent className='dark:bg-gray-800 dark:border-gray-700 sm:max-w-[600px]'>
          <DialogHeader>
            <DialogTitle className='dark:text-white'>成员详情</DialogTitle>
          </DialogHeader>

          {selectedMember && (
            <div className='space-y-6'>
              <div className='flex items-center gap-4'>
                <Avatar className='w-16 h-16'>
                  <AvatarFallback className='bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 text-xl'>
                    {selectedMember.avatar}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className='text-lg dark:text-white'>{selectedMember.name}</h3>
                  <p className='text-sm text-gray-600 dark:text-gray-400'>{selectedMember.email}</p>
                </div>
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <div className='space-y-1'>
                  <div className='text-xs text-gray-500 dark:text-gray-400'>角色</div>
                  <Badge className={`text-xs ${getRoleBadge(selectedMember.role).color} border-0`}>
                    {getRoleBadge(selectedMember.role).label}
                  </Badge>
                </div>
                <div className='space-y-1'>
                  <div className='text-xs text-gray-500 dark:text-gray-400'>状态</div>
                  <Badge className={`text-xs ${getStatusBadge(selectedMember.status).color} border-0`}>
                    {getStatusBadge(selectedMember.status).label}
                  </Badge>
                </div>
                <div className='space-y-1'>
                  <div className='text-xs text-gray-500 dark:text-gray-400'>加入时间</div>
                  <div className='text-sm dark:text-white'>{selectedMember.joinedDate}</div>
                </div>
                <div className='space-y-1'>
                  <div className='text-xs text-gray-500 dark:text-gray-400'>最后活跃</div>
                  <div className='text-sm dark:text-white'>{selectedMember.lastActive}</div>
                </div>
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <Card className='p-4 dark:bg-gray-900 dark:border-gray-700'>
                  <div className='text-xs text-gray-500 dark:text-gray-400 mb-1'>共享资源</div>
                  <div className='text-2xl dark:text-white'>{selectedMember.resourcesShared}</div>
                </Card>
                <Card className='p-4 dark:bg-gray-900 dark:border-gray-700'>
                  <div className='text-xs text-gray-500 dark:text-gray-400 mb-1'>访问资源</div>
                  <div className='text-2xl dark:text-white'>{selectedMember.resourcesAccessed}</div>
                </Card>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => setMemberDetailsOpen(false)}
              className='dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300'
            >
              关闭
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
