import { CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { LucideIcon } from 'lucide-react';
import { Users, Mail, UserX } from 'lucide-react';

/** 成员状态对应的展示配置（图标、文案、颜色） */
export const STATUS_BADGES: Record<string, { label: string; color: string; icon: LucideIcon }> = {
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

/** 统计卡片配置项 */
export interface StatsCardConfig {
  label: string;
  subtext: string;
  icon: LucideIcon;
  color: string;
}

export const STATS_CARD_CONFIGS: StatsCardConfig[] = [
  { label: '团队成员', subtext: '活跃成员', icon: Users, color: 'text-blue-600' },
  { label: '待处理邀请', subtext: '等待接受', icon: Mail, color: 'text-orange-600' },
  { label: '禁用', subtext: '已暂停成员', icon: UserX, color: 'text-gray-600' },
  { label: '活跃率', subtext: '过去7天', icon: CheckCircle, color: 'text-green-600' },
];
