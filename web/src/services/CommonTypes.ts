import type { EnabledStatusEnum } from '@/enums/enums';

/** 启用状态更新请求参数 */
export interface EnabledStatusUpdateDto {
  /**
   * 状态
   * @example "ENABLED"
   */
  status: EnabledStatusEnum;
}

/** 用户信息 */
export interface UserInfo {
  /** @format int64 */
  id?: string;
  username?: string;
  name?: string;
  phone?: string;
  email?: string;
  avatar?: string;
}
