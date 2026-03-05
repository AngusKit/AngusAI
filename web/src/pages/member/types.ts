/**
 * 页面展示用的成员状态
 * active-活跃, inactive-不活跃, pending-待确认
 */
export type DisplayStatus = 'active' | 'inactive' | 'pending';

/** 团队成员（列表展示用） */
export interface TeamMember {
  id: string;
  name: string;
  email: string;
  /** 头像 URL，为空时用 avatarFallback */
  avatarUrl?: string;
  /** 头像加载失败或无 URL 时展示的首字母 */
  avatarFallback: string;
  /** 角色名称列表（来自 RoleInfo[].name，多个用顿号分隔） */
  roleNames: string;
  /** 是否租户管理员/所有者，不可移除 */
  sysAdmin?: boolean;
  status: DisplayStatus;
  joinedDate: string;
  lastActive: string;
  resourcesShared: number;
  resourcesAccessed: number;
}

/** 待处理邀请（列表展示用） */
export interface PendingInvitation {
  id: string;
  email: string;
  /** 角色名称（来自 roleName） */
  roleName: string;
  invitedBy: string;
  invitedDate: string;
  expiresDate: string;
}
