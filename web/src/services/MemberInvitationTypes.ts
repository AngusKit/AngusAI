import { ApiLocaleResult } from '@xcan-angus/infra';
import { InviteStatusEnum, InviteTypeEnum } from '@/enums/enums';

/** 邀请用户请求参数 - 与 AngusGM UserInviteDto 保持一致 */
export interface UserInviteDto {
  /** 邮箱列表，邮件邀请时必须填写，支持批量邀请多个邮箱，最多 200 个 */
  emails?: string[];
  /** 邀请方式：LINK-链接邀请, EMAIL-邮件邀请 */
  inviteType: InviteTypeEnum;
  /** 邀请应用ID */
  appId?: string;
  /** 角色ID */
  roleId?: string;
  /** 部门ID */
  departmentId?: string;
  /** 邀请消息 */
  message?: string;
  /** 过期天数，默认 7 */
  expireDays?: number;
}

/** 查询邀请列表请求参数 - 与 AngusGM UserInviteFindDto 保持一致 */
export interface UserInviteFindDto {
  /** 邀请应用ID */
  appId?: string;
  /** 邀请邮箱 */
  email?: string;
  /** 邀请方式 */
  inviteType?: InviteTypeEnum;
  /** 状态筛选 */
  status?: InviteStatusEnum;
}

/** 用户邀请响应 - 与 AngusGM UserInviteVo 保持一致 */
export interface UserInviteVo {
  id?: string;
  email?: string;
  inviteType?: InviteTypeEnum;
  appId?: string;
  appName?: string;
  roleId?: string;
  roleName?: string;
  departmentId?: string;
  departmentName?: string;
  message?: string;
  invitedBy?: string;
  inviterName?: string;
  inviteDate?: string;
  expiryDate?: string;
  status?: InviteStatusEnum;
  inviteCode?: string;
  inviteUrl?: string;
  tenantId?: string;
  tenantName?: string;
}

/** 重新发送邀请响应 */
export interface UserInviteResendVo {
  id?: string;
  resentTime?: string;
}

/** 分页结果 */
export interface PageResultUserInviteVo {
  total?: number;
  list?: UserInviteVo[];
}

/** API 响应类型 */
export type PageResultUserInviteVoResult = ApiLocaleResult & {
  data?: PageResultUserInviteVo;
};

export type UserInviteListVoResult = ApiLocaleResult & {
  data?: UserInviteVo[];
};

export type UserInviteResendVoResult = ApiLocaleResult & {
  data?: UserInviteResendVo;
};
