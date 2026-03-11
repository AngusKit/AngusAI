import type { LucideIcon } from 'lucide-react';
import { Zap, Database, Workflow, FileText, Eye, Edit, Shield } from 'lucide-react';
import { ResourceTypeEnum, MemberPermissionEnum } from '@/enums/enums.ts';
import { getEnumDescription } from '@/enums/utils.ts';

/** 资源类型对应的展示文本 */
export function mapResourceTypeToDisplay(type?: ResourceTypeEnum): string {
  if (!type) return '';
  return getEnumDescription(ResourceTypeEnum, type);
}

/** 根据资源类型获取图标组件 */
export function getResourceIcon(type?: ResourceTypeEnum): LucideIcon {
  if (type === ResourceTypeEnum.APPLICATION) return Zap;
  if (type === ResourceTypeEnum.KNOWLEDGE) return Database;
  if (type === ResourceTypeEnum.WORKFLOW) return Workflow;
  if (type === ResourceTypeEnum.MODEL) return Zap;
  if (type === ResourceTypeEnum.DATASET) return FileText;
  return FileText;
}

/** 获取资源图标背景样式类名 */
export function getResourceIconBg(type?: ResourceTypeEnum): string {
  if (type === ResourceTypeEnum.APPLICATION) return 'bg-blue-100 dark:bg-blue-900/30';
  if (type === ResourceTypeEnum.KNOWLEDGE) return 'bg-purple-100 dark:bg-purple-900/30';
  if (type === ResourceTypeEnum.WORKFLOW) return 'bg-green-100 dark:bg-green-900/30';
  if (type === ResourceTypeEnum.MODEL) return 'bg-orange-100 dark:bg-orange-900/30';
  if (type === ResourceTypeEnum.DATASET) return 'bg-pink-100 dark:bg-pink-900/30';
  return 'bg-gray-100 dark:bg-gray-900/30';
}

/** 获取资源图标颜色样式类名 */
export function getResourceIconColor(type?: ResourceTypeEnum): string {
  if (type === ResourceTypeEnum.APPLICATION) return 'text-blue-600 dark:text-blue-400';
  if (type === ResourceTypeEnum.KNOWLEDGE) return 'text-purple-600 dark:text-purple-400';
  if (type === ResourceTypeEnum.WORKFLOW) return 'text-green-600 dark:text-green-400';
  if (type === ResourceTypeEnum.MODEL) return 'text-orange-600 dark:text-orange-400';
  if (type === ResourceTypeEnum.DATASET) return 'text-pink-600 dark:text-pink-400';
  return 'text-gray-600 dark:text-gray-400';
}

/** 相对时间格式化（如：3天前、2小时前） */
export function formatDate(date?: string): string {
  if (!date) return '';
  try {
    const d = new Date(date);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));

    if (days > 0) return `${days}天前`;
    if (hours > 0) return `${hours}小时前`;
    if (minutes > 0) return `${minutes}分钟前`;
    return '刚刚';
  } catch {
    return date;
  }
}

/** 权限徽章配置（标签、颜色、图标） */
export function getPermissionBadge(permission: MemberPermissionEnum) {
  const badges = {
    [MemberPermissionEnum.VIEW]: {
      label: '查看',
      color: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400',
      icon: Eye,
    },
    [MemberPermissionEnum.EDIT]: {
      label: '编辑',
      color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      icon: Edit,
    },
    [MemberPermissionEnum.MANAGE]: {
      label: '管理',
      color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
      icon: Shield,
    },
  };
  return badges[permission] || badges[MemberPermissionEnum.VIEW];
}
