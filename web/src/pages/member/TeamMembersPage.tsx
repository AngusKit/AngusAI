/**
 * 团队成员页面
 * 管理团队成员列表、邀请记录，支持邀请、暂停、恢复、移除等操作
 */
import { useLanguage } from '@/components/LanguageProvider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTeamMembers } from './hooks/useTeamMembers';
import { TeamMembersHeader } from './components/TeamMembersHeader';
import { TeamMembersStatsCards } from './components/TeamMembersStatsCards';
import { MemberTableFilters } from './components/MemberTableFilters';
import { MemberTable } from './components/MemberTable';
import { PendingInvitationTable } from './components/PendingInvitationTable';
import { InviteMemberDialog } from './components/InviteMemberDialog';
import { RemoveMemberDialog } from './components/RemoveMemberDialog';

export function TeamMembersPage() {
  const { t } = useLanguage();
  const {
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    currentPage,
    setCurrentPage,
    currentInvitePage,
    setCurrentInvitePage,
    members,
    membersTotal,
    membersLoading,
    pendingInvitations,
    invitationsTotal,
    invitationsLoading,
    statsCards,
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
    handleInviteMember,
    handleOpenRemoveDialog,
    handleConfirmRemove,
    handlePauseMember,
    handleResumeMember,
    handleCancelInvitation,
    handleResendInvitation,
  } = useTeamMembers();

  /** 状态筛选变更时重置到第一页 */
  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  return (
    <div className='space-y-6'>
      {/* 头部 */}
      <TeamMembersHeader
        title={t('team.members.title')}
        subtitle={t('team.members.subtitle')}
      />

      {/* 统计卡片 */}
      <TeamMembersStatsCards cards={statsCards} />

      {/* Tab：全部成员 / 邀请记录 */}
      <Tabs defaultValue='members' className='w-full'>
        <TabsList className='dark:bg-gray-800'>
          <TabsTrigger value='members'>全部成员</TabsTrigger>
          <TabsTrigger value='pending'>邀请记录</TabsTrigger>
        </TabsList>

        <TabsContent value='members' className='space-y-4 mt-0'>
          <MemberTableFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            statusFilter={statusFilter}
            onStatusFilterChange={handleStatusFilterChange}
            onInviteClick={() => setInviteDialogOpen(true)}
          />
          <MemberTable
            loading={membersLoading}
            members={members}
            total={membersTotal}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            onPause={handlePauseMember}
            onResume={handleResumeMember}
            onRemove={handleOpenRemoveDialog}
          />
        </TabsContent>

        <TabsContent value='pending' className='space-y-4 mt-0'>
          <PendingInvitationTable
            loading={invitationsLoading}
            invitations={pendingInvitations}
            total={invitationsTotal}
            currentPage={currentInvitePage}
            onPageChange={setCurrentInvitePage}
            onResend={handleResendInvitation}
            onCancel={handleCancelInvitation}
          />
        </TabsContent>
      </Tabs>

      {/* 邀请成员弹窗 */}
      <InviteMemberDialog
        open={inviteDialogOpen}
        onOpenChange={setInviteDialogOpen}
        inviteEmail={inviteEmail}
        onEmailChange={setInviteEmail}
        inviteRoleId={inviteRoleId}
        onRoleIdChange={setInviteRoleId}
        inviteRoles={inviteRoles}
        sending={inviteSending}
        onInvite={handleInviteMember}
      />

      {/* 移除成员确认弹窗 */}
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
