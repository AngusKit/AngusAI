import {
  Activity,
  User,
  FileText,
  Database,
  Workflow,
  Brain,
  Settings,
  Trash2,
  Edit,
  Plus,
  Eye,
  Share2,
  Upload,
  Download,
  Info,
} from 'lucide-react';
import { ActivityTargetTypeEnum, ActivityActionTypeEnum } from '@/enums/enums';

/** 目标类型对应图标与颜色配置（文案通过枚举国际化获取） */
export const targetTypeMeta: Partial<Record<ActivityTargetTypeEnum, { icon: any; color: string }>> = {
  [ActivityTargetTypeEnum.APPLICATION]: { icon: Brain, color: 'text-blue-500' },
  [ActivityTargetTypeEnum.WORKFLOW]: { icon: Workflow, color: 'text-purple-500' },
  [ActivityTargetTypeEnum.KNOWLEDGE_BASE]: { icon: Database, color: 'text-green-500' },
  [ActivityTargetTypeEnum.DATASET]: { icon: FileText, color: 'text-orange-500' },
  [ActivityTargetTypeEnum.MODEL]: { icon: Settings, color: 'text-indigo-500' },
  [ActivityTargetTypeEnum.TEAM_MEMBER]: { icon: User, color: 'text-pink-500' },
  [ActivityTargetTypeEnum.API_KEY]: { icon: Settings, color: 'text-red-500' },
  [ActivityTargetTypeEnum.PROMPT]: { icon: FileText, color: 'text-cyan-500' },
};

/** 操作类型对应图标与颜色配置（文案通过枚举国际化获取） */
export const actionTypeMeta: Partial<Record<ActivityActionTypeEnum, { icon: any; color: string }>> = {
  [ActivityActionTypeEnum.CREATE]: { icon: Plus, color: 'text-green-500' },
  [ActivityActionTypeEnum.UPDATE]: { icon: Edit, color: 'text-blue-500' },
  [ActivityActionTypeEnum.DELETE]: { icon: Trash2, color: 'text-red-500' },
  [ActivityActionTypeEnum.VIEW]: { icon: Eye, color: 'text-gray-500' },
  [ActivityActionTypeEnum.SHARE]: { icon: Share2, color: 'text-purple-500' },
  [ActivityActionTypeEnum.EXPORT]: { icon: Download, color: 'text-indigo-500' },
  [ActivityActionTypeEnum.IMPORT]: { icon: Upload, color: 'text-orange-500' },
  [ActivityActionTypeEnum.EXECUTE]: { icon: Activity, color: 'text-cyan-500' },
  [ActivityActionTypeEnum.UNKNOWN]: { icon: Info, color: 'text-gray-500' },
};

/** 操作类型筛选项的显示顺序（不含 UNKNOWN） */
export const orderedActionTypes: ActivityActionTypeEnum[] = [
  ActivityActionTypeEnum.CREATE,
  ActivityActionTypeEnum.UPDATE,
  ActivityActionTypeEnum.DELETE,
  ActivityActionTypeEnum.VIEW,
  ActivityActionTypeEnum.SHARE,
  ActivityActionTypeEnum.EXPORT,
  ActivityActionTypeEnum.IMPORT,
  ActivityActionTypeEnum.EXECUTE,
];
