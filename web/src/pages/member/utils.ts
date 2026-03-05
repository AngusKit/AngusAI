import type { MemberListVo } from '@/services/MemberTypes';
import { UserStatusEnum } from '@/enums/enums';
import type { DisplayStatus } from './types';
import { STATUS_BADGES } from './constants';

/** 从 MemberListVo.roles 提取角色名称列表（顿号分隔） */
export function getRoleNames(vo: MemberListVo): string {
  const names = (vo.roles ?? []).map(r => r.name).filter(Boolean);
  return names.join('、') || '-';
}

/** 将 UserStatusEnum 映射到页面展示状态 */
export function mapStatusToDisplay(status?: string): DisplayStatus {
  if (status === UserStatusEnum.ACTIVE) return 'active';
  if (status === UserStatusEnum.DISABLED) return 'inactive';
  if (status === UserStatusEnum.PENDING) return 'pending';
  return 'active';
}

/** 根据状态获取对应的 Badge 配置（图标、文案、颜色） */
export function getStatusBadge(status: string) {
  return STATUS_BADGES[status] ?? STATUS_BADGES.active;
}
