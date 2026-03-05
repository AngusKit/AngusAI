import { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '@/components/LanguageProvider.tsx';
import { appContext } from '@xcan-angus/infra';
import { Users, Search, UserPlus, Mail, MoreHorizontal, Trash2, Clock, CheckCircle, XCircle, AlertCircle, Send, PauseCircle, PlayCircle, UserX, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button.tsx';
import { Card } from '@/components/ui/card.tsx';
import { Badge } from '@/components/ui/badge.tsx';
import { Input } from '@/components/ui/input.tsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.tsx';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog.tsx';
import { Label } from '@/components/ui/label.tsx';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu.tsx';
import { Avatar, AvatarFallback } from '@/components/ui/avatar.tsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.tsx';
import { XcanPagination } from '@/components/ui/pagination.tsx';
import { toast } from 'sonner';
import MemberService from '@/services/Member';
import MemberInvitationService from '@/services/MemberInvitation';
import RoleService from '@/services/Role';
import type { MemberListVo, UserStatsVo } from '@/services/MemberTypes';
import type { RoleListVo } from '@/services/RoleTypes';
import type { UserInviteVo } from '@/services/MemberInvitationTypes';
import { UserStatusEnum } from '@/enums/enums';
import { EnabledStatusEnum } from '@/enums/enums';
import { InviteTypeEnum } from '@/enums/enums';
import { InviteStatusEnum } from '@/enums/enums';
import { useDebounce } from '@/hooks/useDebounce';
import { formatRelativeTimeShort, formatDateShort, getInitials } from '@/utils/FormatUtils';
import { RemoveMemberDialog } from './components/RemoveMemberDialog';
import { DEFAULT_PAGE_SIZE } from '@/Constants';

/** 页面展示用的成员状态：active-活跃, inactive-不活跃, pending-待确认 */
type DisplayStatus = 'active' | 'inactive' | 'pending';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatar: string;
  /** 角色名称列表（来自 RoleInfo[].name） */
  roleNames: string;
  /** 是否租户管理员/所有者，不可移除 */
  sysAdmin?: boolean;
  status: DisplayStatus;
  joinedDate: string;
  lastActive: string;
  resourcesShared: number;
  resourcesAccessed: number;
}

interface PendingInvitation {
  id: string;
  email: string;
  /** 角色名称（来自 roleName） */
  roleName: string;
  invitedBy: string;
  invitedDate: string;
  expiresDate: string;
}

/** 从 MemberListVo.roles 提取角色名称列表 */
function getRoleNames(vo: MemberListVo): string {
  const names = (vo.roles ?? []).map(r => r.name).filter(Boolean);
  return names.join('、') || '-';
}

/** 从 UserStatusEnum 映射到页面展示状态 */
function mapStatusToDisplay(status?: string): DisplayStatus {
  if (status === UserStatusEnum.ACTIVE) return 'active';
  if (status === UserStatusEnum.DISABLED) return 'inactive';
  if (status === UserStatusEnum.PENDING) return 'pending';
  return 'active';
}

export function TeamMembers() {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRoleId, setInviteRoleId] = useState<string>('__none__');
  const [inviteRoles, setInviteRoles] = useState<RoleListVo[]>([]);
  const [inviteMessage, setInviteMessage] = useState('');
  const [inviteSending, setInviteSending] = useState(false);

  const [removeDialogOpen, setRemoveDialogOpen] = useState(false);
  const [removeMemberId, setRemoveMemberId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [currentInvitePage, setCurrentInvitePage] = useState(1);

  const [members, setMembers] = useState<TeamMember[]>([]);
  const [membersTotal, setMembersTotal] = useState(0);
  const [membersLoading, setMembersLoading] = useState(true);

  const [pendingInvitations, setPendingInvitations] = useState<PendingInvitation[]>([]);
  const [invitationsTotal, setInvitationsTotal] = useState(0);
  const [invitationsLoading, setInvitationsLoading] = useState(true);

  const [stats, setStats] = useState<UserStatsVo | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  const debouncedSearch = useDebounce(searchQuery, 400);

  /** 加载成员列表 */
  const loadMembers = useCallback(async () => {
    setMembersLoading(true);
    try {
      const statusParam =
        statusFilter === 'active' ? UserStatusEnum.ACTIVE :
        statusFilter === 'inactive' ? UserStatusEnum.DISABLED : undefined;
      const response = await MemberService.list({
        pageNo: currentPage,
        pageSize: DEFAULT_PAGE_SIZE,
        keyword: debouncedSearch?.trim() || undefined,
        fullTextSearch: true,
        status: statusParam,
      });
      const data = (response as { data?: { total?: number; list?: MemberListVo[] } })?.data;
      if (data?.list) {
        setMembers(
          data.list.map((vo: MemberListVo): TeamMember => ({
            id: String(vo.id ?? ''),
            name: vo.name ?? vo.username ?? '',
            email: vo.email ?? '',
            avatar: getInitials(vo.name, vo.email),
            roleNames: getRoleNames(vo),
            sysAdmin: vo.sysAdmin,
            status: mapStatusToDisplay(vo.status),
            joinedDate: formatDateShort(vo.createdDate),
            lastActive: formatRelativeTimeShort(vo.lastLogin),
            resourcesShared: vo.shareCount ?? 0,
            resourcesAccessed: vo.shareAccessCount ?? 0,
          }))
        );
        setMembersTotal(data.total ?? 0);
      }
    } catch (err) {
      toast.error((err as Error)?.message ?? '加载成员列表失败');
      setMembers([]);
      setMembersTotal(0);
    } finally {
      setMembersLoading(false);
    }
  }, [currentPage, debouncedSearch, statusFilter]);

  /** 加载待处理邀请 */
  const loadInvitations = useCallback(async () => {
    setInvitationsLoading(true);
    try {
      const response = await MemberInvitationService.listInvites({
        pageNo: currentInvitePage,
        pageSize: DEFAULT_PAGE_SIZE,
        status: InviteStatusEnum.PENDING,
      });
      const data = (response as { data?: { total?: number; list?: UserInviteVo[] } })?.data;
      if (data?.list) {
        setPendingInvitations(
          data.list.map((vo: UserInviteVo): PendingInvitation => ({
            id: String(vo.id ?? ''),
            email: vo.email ?? '',
            roleName: vo.roleName ?? '-',
            invitedBy: vo.inviterName ?? '',
            invitedDate: formatDateShort(vo.inviteDate),
            expiresDate: formatDateShort(vo.expiryDate),
          }))
        );
        setInvitationsTotal(data.total ?? 0);
      }
    } catch (err) {
      toast.error((err as Error)?.message ?? '加载邀请列表失败');
      setPendingInvitations([]);
      setInvitationsTotal(0);
    } finally {
      setInvitationsLoading(false);
    }
  }, [currentInvitePage]);

  /** 打开邀请弹窗时加载当前应用的角色列表 */
  useEffect(() => {
    if (!inviteDialogOpen) return;
    const accessApp = appContext.getContext?.()?.accessApp as { id?: number | string } | undefined;
    const appId = accessApp?.id != null ? Number(accessApp.id) : undefined;
    if (appId == null) {
      setInviteRoles([]);
      setInviteRoleId('__none__');
      return;
    }
    RoleService.getRoleList({ appId, status: EnabledStatusEnum.ENABLED })
      .then(res => {
        const list = (res as { data?: { list?: RoleListVo[] } })?.data?.list ?? [];
        setInviteRoles(list);
        setInviteRoleId('__none__');
      })
      .catch(() => setInviteRoles([]));
  }, [inviteDialogOpen]);

  /** 加载统计数据 */
  const loadStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const response = await MemberService.getStats();
      const data = (response as { data?: UserStatsVo })?.data;
      if (data) setStats(data);
    } catch {
      setStats(null);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMembers();
  }, [loadMembers]);

  useEffect(() => {
    loadInvitations();
  }, [loadInvitations]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  const statusBadges: Record<string, { label: string; color: string; icon: typeof CheckCircle }> = {
    active: { label: '活跃', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', icon: CheckCircle },
    inactive: { label: '不活跃', color: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400', icon: Clock },
    pending: { label: '待确认', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400', icon: AlertCircle },
  };
  const getStatusBadge = (status: string) =>
    (statusBadges[status] ?? statusBadges.active) as { label: string; color: string; icon: typeof CheckCircle };

  const handleInviteMember = async () => {
    if (!inviteEmail?.trim()) {
      toast.error('请输入邮箱地址');
      return;
    }
    const email = inviteEmail.trim();
    const accessApp = appContext.getContext?.()?.accessApp as { id?: number | string } | undefined;
    const appId = accessApp?.id != null ? String(accessApp.id) : undefined;
    setInviteSending(true);
    try {
      const response =       await MemberInvitationService.inviteUser({
        emails: [email],
        inviteType: InviteTypeEnum.EMAIL,
        appId,
        roleId: inviteRoleId && inviteRoleId !== '__none__' ? inviteRoleId : undefined,
        message: inviteMessage || undefined,
        expireDays: 7,
      });
      if ((response as { code?: string }).code === 'S') {
        toast.success(`邀请已发送至 ${email}`);
        setInviteDialogOpen(false);
        setInviteEmail('');
        setInviteRoleId('__none__');
        setInviteMessage('');
        loadInvitations();
        loadStats();
      } else {
        toast.error((response as { message?: string }).message ?? '发送邀请失败');
      }
    } catch (err) {
      toast.error((err as Error)?.message ?? '发送邀请失败');
    } finally {
      setInviteSending(false);
    }
  };

  const handleOpenRemoveDialog = (member: TeamMember) => {
    if (member.sysAdmin) {
      toast.error('无法移除所有者');
      return;
    }
    setRemoveMemberId(member.id);
    setRemoveDialogOpen(true);
  };

  const handleConfirmRemove = async () => {
    if (!removeMemberId) return;
    const member = members.find(m => m.id === removeMemberId);
    setDeleting(true);
    try {
      await MemberService.deleteUser(removeMemberId);
      toast.success(`已移除成员: ${member?.name ?? ''}`);
      setRemoveDialogOpen(false);
      setRemoveMemberId(null);
      loadMembers();
      loadStats();
    } catch (err) {
      toast.error((err as Error)?.message ?? '移除成员失败');
    } finally {
      setDeleting(false);
    }
  };

  const handlePauseMember = async (member: TeamMember) => {
    if (member.sysAdmin) {
      toast.error('无法暂停所有者');
      return;
    }
    try {
      await MemberService.updateUserStatus(member.id, { status: EnabledStatusEnum.DISABLED });
      toast.success(`已暂停成员: ${member.name}`);
      loadMembers();
      loadStats();
    } catch (err) {
      toast.error((err as Error)?.message ?? '暂停成员失败');
    }
  };

  const handleResumeMember = async (member: TeamMember) => {
    try {
      await MemberService.updateUserStatus(member.id, { status: EnabledStatusEnum.ENABLED });
      toast.success(`已恢复成员: ${member.name}`);
      loadMembers();
      loadStats();
    } catch (err) {
      toast.error((err as Error)?.message ?? '恢复成员失败');
    }
  };

  const handleCancelInvitation = async (invitation: PendingInvitation) => {
    try {
      await MemberInvitationService.cancelInvite(invitation.id);
      toast.success('已取消邀请');
      loadInvitations();
      loadStats();
    } catch (err) {
      toast.error((err as Error)?.message ?? '取消邀请失败');
    }
  };

  const handleResendInvitation = async (invitation: PendingInvitation) => {
    try {
      await MemberInvitationService.resendInvite(invitation.id);
      toast.success(`已重新发送邀请至 ${invitation.email}`);
      loadInvitations();
    } catch (err) {
      toast.error((err as Error)?.message ?? '重新发送失败');
    }
  };

  const inactiveCount = members.filter(m => m.status === 'inactive').length;
  const activeRate = stats?.activeRate7Days != null ? `${Math.round(stats.activeRate7Days)}%` : '-';

  const statsCards = [
    { label: '团队成员', value: statsLoading ? '-' : (stats?.totalUsers ?? membersTotal), subtext: '活跃成员', icon: Users, color: 'text-blue-600' },
    { label: '待处理邀请', value: statsLoading ? '-' : (stats?.pendingInvites ?? invitationsTotal), subtext: '等待接受', icon: Mail, color: 'text-orange-600' },
    { label: '禁用', value: statsLoading ? '-' : (stats?.disabledUsers ?? inactiveCount), subtext: '已暂停成员', icon: UserX, color: 'text-gray-600' },
    { label: '活跃率', value: activeRate, subtext: '过去7天', icon: CheckCircle, color: 'text-green-600' },
  ];

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-2xl mb-1 dark:text-white'>{t('team.members.title')}</h1>
        <p className='text-sm text-gray-600 dark:text-gray-400'>{t('team.members.subtitle')}</p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className='p-5 dark:bg-gray-800 dark:border-gray-700'>
              <div className='flex items-start justify-between'>
                <div className={`p-2 rounded-lg bg-gray-100 dark:bg-gray-700 ${stat.color}`}>
                  <Icon className='w-5 h-5' />
                </div>
              </div>
              <div className='text-base text-gray-600 dark:text-gray-400'>{stat.label}</div>
              <div className='text-3xl dark:text-white'>{stat.value}</div>
              <div className='text-xs text-gray-500 dark:text-gray-400'>{stat.subtext}</div>
            </Card>
          );
        })}
      </div>

      <Tabs defaultValue='members' className='w-full'>
        <TabsList className='dark:bg-gray-800'>
          <TabsTrigger value='members'>全部成员</TabsTrigger>
          <TabsTrigger value='pending'>待处理邀请 ({invitationsTotal})</TabsTrigger>
        </TabsList>

        <TabsContent value='members' className='space-y-4 mt-0'>
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
              <Select value={statusFilter} onValueChange={v => { setStatusFilter(v); setCurrentPage(1); }}>
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

          <Card className='dark:bg-gray-800 dark:border-gray-700'>
            {membersLoading ? (
              <div className='p-12 flex items-center justify-center'>
                <Loader2 className='w-8 h-8 animate-spin text-gray-400' />
              </div>
            ) : members.length === 0 ? (
              <div className='p-12 text-center'>
                <Users className='w-12 h-12 text-gray-400 mx-auto mb-4' />
                <h3 className='text-lg mb-2 dark:text-white'>未找到成员</h3>
                <p className='text-sm text-gray-600 dark:text-gray-400'>尝试调整搜索条件或筛选器</p>
              </div>
            ) : (
              <>
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
                      {members.map(member => {
                        const statusBadge = getStatusBadge(member.status);
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
                            <td className='px-6 py-4 text-sm dark:text-gray-300'>
                              {member.roleNames}
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
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <button className='p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded'>
                                    <MoreHorizontal className='w-4 h-4 text-gray-600 dark:text-gray-400' />
                                  </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align='end' className='dark:bg-gray-800 dark:border-gray-700'>
                                  {!member.sysAdmin && (
                                    <>
                                      {member.status === 'active' ? (
                                        <DropdownMenuItem onClick={() => handlePauseMember(member)} className='dark:text-gray-300'>
                                          <PauseCircle className='w-4 h-4 mr-2' />
                                          暂停成员
                                        </DropdownMenuItem>
                                      ) : (
                                        <DropdownMenuItem onClick={() => handleResumeMember(member)} className='dark:text-gray-300'>
                                          <PlayCircle className='w-4 h-4 mr-2' />
                                          恢复成员
                                        </DropdownMenuItem>
                                      )}
                                      <DropdownMenuItem onClick={() => handleOpenRemoveDialog(member)} className='text-red-600 dark:text-red-400'>
                                        <Trash2 className='w-4 h-4 mr-2' />
                                        移除成员
                                      </DropdownMenuItem>
                                    </>
                                  )}
                                  {member.sysAdmin && (
                                    <DropdownMenuItem disabled className='dark:text-gray-500'>
                                      所有者无法编辑
                                    </DropdownMenuItem>
                                  )}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                {membersTotal > DEFAULT_PAGE_SIZE && (
                  <div className='flex items-center justify-center px-6 py-4 border-t border-gray-200 dark:border-gray-700'>
                    <XcanPagination
                      pageSize={DEFAULT_PAGE_SIZE}
                      pageNo={currentPage}
                      total={membersTotal}
                      onChange={({ pageNo }) => setCurrentPage(pageNo)}
                    />
                  </div>
                )}
              </>
            )}
          </Card>
        </TabsContent>

        <TabsContent value='pending' className='space-y-4 mt-0'>
          <Card className='dark:bg-gray-800 dark:border-gray-700'>
            {invitationsLoading ? (
              <div className='p-12 flex items-center justify-center'>
                <Loader2 className='w-8 h-8 animate-spin text-gray-400' />
              </div>
            ) : pendingInvitations.length === 0 ? (
              <div className='p-12 text-center'>
                <Mail className='w-12 h-12 text-gray-400 mx-auto mb-4' />
                <h3 className='text-lg mb-2 dark:text-white'>无待处理邀请</h3>
                <p className='text-sm text-gray-600 dark:text-gray-400'>所有邀请已被接受或过期</p>
              </div>
            ) : (
              <>
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
                      {pendingInvitations.map(invitation => (
                          <tr key={invitation.id} className='hover:bg-gray-50 dark:hover:bg-gray-900'>
                            <td className='px-6 py-4 text-sm dark:text-white'>{invitation.email}</td>
                            <td className='px-6 py-4 text-sm dark:text-gray-300'>
                              {invitation.roleName}
                            </td>
                            <td className='px-6 py-4 text-sm text-gray-600 dark:text-gray-400'>{invitation.invitedBy}</td>
                            <td className='px-6 py-4 text-sm text-gray-600 dark:text-gray-400'>{invitation.invitedDate}</td>
                            <td className='px-6 py-4 text-sm text-gray-600 dark:text-gray-400'>{invitation.expiresDate}</td>
                            <td className='px-6 py-4'>
                              <div className='flex items-center gap-2'>
                                <button
                                  onClick={() => handleResendInvitation(invitation)}
                                  className='p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded'
                                  title='重新发送'
                                >
                                  <Send className='w-4 h-4 text-blue-500' />
                                </button>
                                <button
                                  onClick={() => handleCancelInvitation(invitation)}
                                  className='p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded'
                                  title='取消邀请'
                                >
                                  <XCircle className='w-4 h-4 text-red-500' />
                                </button>
                              </div>
                            </td>
                          </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {invitationsTotal > DEFAULT_PAGE_SIZE && (
                  <div className='flex items-center justify-center px-6 py-4 border-t border-gray-200 dark:border-gray-700'>
                    <XcanPagination
                      pageSize={DEFAULT_PAGE_SIZE}
                      pageNo={currentInvitePage}
                      total={invitationsTotal}
                      onChange={({ pageNo }) => setCurrentInvitePage(pageNo)}
                    />
                  </div>
                )}
              </>
            )}
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
        <DialogContent className='dark:bg-gray-800 dark:border-gray-700 sm:max-w-[500px]'>
          <DialogHeader>
            <DialogTitle className='dark:text-white'>邀请团队成员</DialogTitle>
            <DialogDescription className='dark:text-gray-400'>通过邮箱邀请新成员加入团队</DialogDescription>
          </DialogHeader>
          <div className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='invite-email' className='dark:text-gray-300'>邮箱地址 *</Label>
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
              <Label htmlFor='invite-role' className='dark:text-gray-300'>分配角色（可选）</Label>
              <Select value={inviteRoleId} onValueChange={setInviteRoleId}>
                <SelectTrigger className='dark:bg-gray-700 dark:border-gray-600'>
                  <SelectValue placeholder='不指定角色' />
                </SelectTrigger>
                <SelectContent className='dark:bg-gray-800 dark:border-gray-700'>
                  <SelectItem value='__none__'>不指定角色</SelectItem>
                  {inviteRoles.filter(r => r?.id).map(r => (
                    <SelectItem key={r.id!} value={r.id!}>
                      {r.name ?? r.code ?? '-'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className='space-y-2'>
              <Label htmlFor='invite-message' className='dark:text-gray-300'>邀请消息（可选）</Label>
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
            <Button variant='outline' onClick={() => setInviteDialogOpen(false)} className='dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300'>
              取消
            </Button>
            <Button onClick={handleInviteMember} disabled={inviteSending} className='bg-blue-500 hover:bg-blue-600'>
              {inviteSending ? <Loader2 className='w-4 h-4 mr-2 animate-spin' /> : <Send className='w-4 h-4 mr-2' />}
              发送邀请
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <RemoveMemberDialog
        open={removeDialogOpen}
        onOpenChange={setRemoveDialogOpen}
        memberId={removeMemberId}
        memberName={members.find(m => m.id === removeMemberId)?.name ?? ''}
        deleting={deleting}
        onConfirm={handleConfirmRemove}
      />
    </div>
  );
}
