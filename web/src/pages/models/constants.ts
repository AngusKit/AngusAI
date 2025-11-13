/**
 * 模型管理相关常量
 */

import { Brain, Image as ImageIcon, FileText, Cpu, Activity } from 'lucide-react';
import { ModelTypeEnum, ModelStatusEnum, ModelProviderEnum } from '@/enums/enums';
import { getEnumDescription } from '@/enums/utils'

/**
 * 模型类型配置映射
 */
export const MODEL_TYPE_CONFIG = {
  [ModelTypeEnum.CHAT]: {
    label: getEnumDescription(ModelTypeEnum, ModelTypeEnum.CHAT),
    icon: Brain,
    iconBg: 'bg-blue-50 dark:bg-blue-900/20',
    iconColor: 'text-blue-500',
  },
  [ModelTypeEnum.IMAGE]: {
    label: getEnumDescription(ModelTypeEnum, ModelTypeEnum.IMAGE),
    icon: ImageIcon,
    iconBg: 'bg-pink-50 dark:bg-pink-900/20',
    iconColor: 'text-pink-500',
  },
  [ModelTypeEnum.AUDIO]: {
    label: getEnumDescription(ModelTypeEnum, ModelTypeEnum.AUDIO),
    icon: FileText,
    iconBg: 'bg-green-50 dark:bg-green-900/20',
    iconColor: 'text-green-500',
  },
  [ModelTypeEnum.EMBEDDING]: {
    label: getEnumDescription(ModelTypeEnum, ModelTypeEnum.EMBEDDING),
    icon: Cpu,
    iconBg: 'bg-indigo-50 dark:bg-indigo-900/20',
    iconColor: 'text-indigo-500',
  },
  [ModelTypeEnum.MODERATION]: {
    label: getEnumDescription(ModelTypeEnum, ModelTypeEnum.MODERATION),
    icon: Activity,
    iconBg: 'bg-orange-50 dark:bg-orange-900/20',
    iconColor: 'text-orange-500',
  },
} as const;

/**
 * 默认模型类型配置（用于未知类型）
 */
export const DEFAULT_MODEL_TYPE_CONFIG = {
  label: getEnumDescription(ModelTypeEnum, 'unknown'),
  icon: Cpu,
  iconBg: 'bg-gray-100 dark:bg-gray-800',
  iconColor: 'text-gray-500',
} as const;

/**
 * 模型状态配置映射
 */
export const MODEL_STATUS_CONFIG = {
  [ModelStatusEnum.RUNNING]: {
    label: getEnumDescription(ModelStatusEnum, ModelStatusEnum.RUNNING),
    color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  },
  [ModelStatusEnum.STOPPED]: {
    label: getEnumDescription(ModelStatusEnum, ModelStatusEnum.STOPPED),
    color: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
  },
  [ModelStatusEnum.ERROR]: {
    label: getEnumDescription(ModelStatusEnum, ModelStatusEnum.ERROR),
    color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  },
} as const;

/**
 * 默认模型状态配置（用于未知状态）
 */
export const DEFAULT_MODEL_STATUS_CONFIG = {
  label: getEnumDescription(ModelStatusEnum, 'unknown'),
  color: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
} as const;

/**
 * 分页配置
 */
export const PAGINATION_CONFIG = {
  DEFAULT_PAGE_SIZE: 6,
  DEFAULT_PAGE: 1,
} as const;

/**
 * 搜索防抖延迟（毫秒）
 */
export const SEARCH_DEBOUNCE_MS = 500;

/**
 * 表单默认值
 */
export const DEFAULT_FORM_DATA = {
  name: '',
  description: '',
  type: ModelTypeEnum.CHAT,
  provider: '',
  version: '',
  apiKey: '',
  endpoint: '',
  maxTokens: '',
  temperature: '0.7',
} as const;

