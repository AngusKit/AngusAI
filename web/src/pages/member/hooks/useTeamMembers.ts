import { useState, useEffect, useCallback } from 'react';
import { appContext } from '@xcan-angus/infra';
import { toast } from 'sonner';
import MemberService from '@/services/Member';
import MemberInvitationService from '@/services/MemberInvitation';
import RoleService from '@/services/Role';
import type { MemberListVo, UserStatsVo } from '@/services/MemberTypes';
import type { RoleListVo } from '@/services/RoleTypes';
import type { UserInviteVo } from '@/services/MemberInvitationTypes';
import { UserStatusEnum } from '@/enums/enums';
import { EnabledStatusEnum, InviteTypeEnum } from '@/enums/enums';
import { useDebounce } from '@/hooks/useDebounce';
import { formatRelativeTimeShort, formatDateShort, getInitials } from '@/utils/FormatUtils';
import { DEFAULT_PAGE_SIZE, ANGUS_AI_APP_CODE } from '@/Constants';
import type { TeamMember, PendingInvitation } from '../types';
import { getRoleNames, mapStatusToDisplay } from '../utils';
import { STATS_CARD_CONFIGS } from '../constants';

/**
 * 团队成员页面的数据与状态管理 Hook
 * 负责：成员列表、邀请列表、统计数据加载，以及邀请/移除/暂停/恢复等操作
 */
export function useTeamMembers() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRoleId, setInviteRoleId] = useState<string>('__none__');
  const [inviteRoles, setInviteRoles] = useState<RoleListVo[]>([]);
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
        appCode: ANGUS_AI_APP_CODE,
        keyword: debouncedSearch?.trim() || undefined,
        fullTextSearch: true,
        status: statusParam,
      });
      const data = (response as { data?: { total?: number; list?: MemberListVo[] } })?.data;
      const list = data?.list ?? [];
      setMembers(
        list.map((vo: MemberListVo): TeamMember => ({
          id: String(vo.id ?? ''),
          name: vo.name ?? vo.username ?? '',
          email: vo.email ?? '',
          avatarUrl: vo.avatar?.trim() || undefined,
          avatarFallback: getInitials(vo.name, vo.email),
          roleNames: getRoleNames(vo),
          sysAdmin: vo.sysAdmin,
          status: mapStatusToDisplay(vo.status),
          joinedDate: formatDateShort(vo.createdDate),
          lastActive: formatRelativeTimeShort(vo.lastLogin),
          resourcesShared: vo.shareCount ?? 0,
          resourcesAccessed: vo.shareAccessCount ?? 0,
        }))
      );
      setMembersTotal(data?.total ?? 0);
    } catch (err) {
      toast.error((err as Error)?.message ?? '加载成员列表失败');
      setMembers([]);
      setMembersTotal(0);
    } finally {
      setMembersLoading(false);
    }
  }, [currentPage, debouncedSearch, statusFilter]);

  /** 加载邀请列表 */
  const loadInvitations = useCallback(async () => {
    setInvitationsLoading(true);
    try {
      const accessApp = appContext.getContext?.()?.accessApp as { id?: number | string } | undefined;
      const appId = accessApp?.id != null ? String(accessApp.id) : undefined;
      const response = await MemberInvitationService.listInvites({
        pageNo: currentInvitePage,
        pageSize: DEFAULT_PAGE_SIZE,
        appId,
      });
      const data = (response as { data?: { total?: number; list?: UserInviteVo[] } })?.data;
      const list = data?.list ?? [];
      setPendingInvitations(
        list.map((vo: UserInviteVo): PendingInvitation => ({
          id: String(vo.id ?? ''),
          email: vo.email ?? '',
          roleName: vo.roleName ?? '-',
          invitedBy: vo.inviterName ?? '',
          invitedDate: formatDateShort(vo.inviteDate),
          expiresDate: formatDateShort(vo.expiryDate),
        }))
      );
      setInvitationsTotal(data?.total ?? 0);
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
      const response = await MemberService.getStats({ appCode: ANGUS_AI_APP_CODE });
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

  /** 发送邀请 */
  const handleInviteMember = useCallback(async () => {
    if (!inviteEmail?.trim()) {
      toast.error('请输入邮箱地址');
      return;
    }
    const email = inviteEmail.trim();
    const accessApp = appContext.getContext?.()?.accessApp as { id?: number | string } | undefined;
    const appId = accessApp?.id != null ? String(accessApp.id) : undefined;
    setInviteSending(true);
    try {
      const response = await MemberInvitationService.inviteUser({
        emails: [email],
        inviteType: InviteTypeEnum.EMAIL,
        appId,
        roleId: inviteRoleId && inviteRoleId !== '__none__' ? inviteRoleId : undefined,
        expireDays: 7,
      });
      if ((response as { code?: string }).code === 'S') {
        toast.success(`邀请已发送至 ${email}`);
        setInviteDialogOpen(false);
        setInviteEmail('');
        setInviteRoleId('__none__');
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
  }, [inviteEmail, inviteRoleId, loadInvitations, loadStats]);

  /** 打开移除成员弹窗 */
  const handleOpenRemoveDialog = useCallback((member: TeamMember) => {
    if (member.sysAdmin) {
      toast.error('无法移除所有者');
      return;
    }
    setRemoveMemberId(member.id);
    setRemoveDialogOpen(true);
  }, []);

  /** 确认移除成员 */
  const handleConfirmRemove = useCallback(async () => {
    if (!removeMemberId) return;
    setDeleting(true);
    try {
      await MemberService.deleteUser(removeMemberId);
      const member = members.find(m => m.id === removeMemberId);
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
  }, [removeMemberId, members, loadMembers, loadStats]);

  /** 暂停成员 */
  const handlePauseMember = useCallback(async (member: TeamMember) => {
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
  }, [loadMembers, loadStats]);

  /** 恢复成员 */
  const handleResumeMember = useCallback(async (member: TeamMember) => {
    try {
      await MemberService.updateUserStatus(member.id, { status: EnabledStatusEnum.ENABLED });
      toast.success(`已恢复成员: ${member.name}`);
      loadMembers();
      loadStats();
    } catch (err) {
      toast.error((err as Error)?.message ?? '恢复成员失败');
    }
  }, [loadMembers, loadStats]);

  /** 取消邀请 */
  const handleCancelInvitation = useCallback(async (invitation: PendingInvitation) => {
    try {
      await MemberInvitationService.cancelInvite(invitation.id);
      toast.success('已取消邀请');
      loadInvitations();
      loadStats();
    } catch (err) {
      toast.error((err as Error)?.message ?? '取消邀请失败');
    }
  }, [loadInvitations, loadStats]);

  /** 重新发送邀请 */
  const handleResendInvitation = useCallback(async (invitation: PendingInvitation) => {
    try {
      await MemberInvitationService.resendInvite(invitation.id);
      toast.success(`已重新发送邀请至 ${invitation.email}`);
      loadInvitations();
    } catch (err) {
      toast.error((err as Error)?.message ?? '重新发送失败');
    }
  }, [loadInvitations]);

  /** 统计卡片数据（合并配置与动态数值） */
  const inactiveCount = members.filter(m => m.status === 'inactive').length;
  const activeRate = stats?.activeRate7Days != null ? `${Math.round(stats.activeRate7Days)}%` : '-';
  const statsValues = [
    statsLoading ? '-' : (stats?.totalUsers ?? membersTotal),
    statsLoading ? '-' : (stats?.pendingInvites ?? invitationsTotal),
    statsLoading ? '-' : (stats?.disabledUsers ?? inactiveCount),
    activeRate,
  ];
  const statsCards = STATS_CARD_CONFIGS.map((config, i) => ({
    ...config,
    value: statsValues[i],
  }));

  return {
    // 筛选与分页
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    currentPage,
    setCurrentPage,
    currentInvitePage,
    setCurrentInvitePage,
    // 成员数据
    members,
    membersTotal,
    membersLoading,
    loadMembers,
    // 邀请数据
    pendingInvitations,
    invitationsTotal,
    invitationsLoading,
    // 统计
    statsCards,
    // 弹窗
    inviteDialogOpen,
    setInviteDialogOpen,
    inviteEmail,
    setInviteEmail,
    inviteRoleId,
    setInviteRoleId,
    inviteRoles,
    inviteSending,
    removeDialogOpen,
    setRemoveDialogOpen,
    removeMemberId,
    setRemoveMemberId,
    deleting,
    // 操作
    handleInviteMember,
    handleOpenRemoveDialog,
    handleConfirmRemove,
    handlePauseMember,
    handleResumeMember,
    handleCancelInvitation,
    handleResendInvitation,
  };
}
