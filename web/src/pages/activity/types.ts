/**
 * 活动记录数据结构
 */
export interface ActivityRecord {
  id: string;
  userId?: string;
  userName: string;
  userAvatar: string;
  targetId?: string;
  targetType: string;
  targetName: string;
  activityDate: string;
  description: string;
  detail?: string;
  actionType: string;
  status: 'success' | 'failed' | 'warning';
}
