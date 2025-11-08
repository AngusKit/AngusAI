import { ApiLocaleResult, TenantAuditingVo } from '@xcan-angus/infra';
import { IndustryEnum, TeamScaleEnum } from '@/enums/enums.ts';

export interface TeamSettingsVo extends TenantAuditingVo {
  /**
   * 团队ID
   * @format int64
   */
  id?: string;
  /** 团队头像 */
  teamAvatar?: string;
  /** 团队名称 */
  teamName?: string;
  /** 团队邮箱 */
  teamEmail?: string;
  /** 团队描述 */
  teamDescription?: string;
  /** 团队规模 */
  teamScale?: TeamScaleEnum;
  /** 所在行业 */
  industry?: IndustryEnum;
}

/** The API response result of supporting international message. */
export type TeamSettingsResult = ApiLocaleResult & {
  /** Actual response data or error details. */
  data?: TeamSettingsVo;
};

/** 团队设置更新请求参数 */
export interface TeamSettingsDto {
  /** 团队头像 */
  teamAvatar?: string;
  /** 团队名称 */
  teamName?: string;
  /** 团队邮箱 */
  teamEmail?: string;
  /** 团队描述 */
  teamDescription?: string;
  /** 团队规模 */
  teamScale?: TeamScaleEnum;
  /** 所在行业 */
  industry?: IndustryEnum;
}
