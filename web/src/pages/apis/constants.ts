/**
 * API Collection 相关常量
 */

import { Database, Code2, Zap, Activity } from 'lucide-react';
import { ApiCollectionSourceEnum, VisibilityEnum } from '@/enums/enums';

/**
 * 分页配置
 */
export const PAGINATION_CONFIG = {
  COLLECTIONS_PAGE_SIZE: 12,
  ENDPOINTS_PAGE_SIZE: 10,
  DEFAULT_PAGE: 1,
} as const;

/**
 * 搜索防抖延迟（毫秒）
 */
export const SEARCH_DEBOUNCE_MS = 500;

/**
 * 文件上传配置
 */
export const FILE_UPLOAD_CONFIG = {
  MAX_SIZE_MB: 20,
  ACCEPTED_TYPES: '.json,.yaml,.yml',
} as const;

/**
 * HTTP 方法颜色映射
 */
export const HTTP_METHOD_COLORS = {
  GET: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  POST: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  PUT: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  DELETE: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  PATCH: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  DEFAULT: 'bg-gray-100 text-gray-700',
} as const;

/**
 * 默认表单数据
 */
export const DEFAULT_COLLECTION_FORM_DATA = {
  name: '',
  description: '',
  source: ApiCollectionSourceEnum.OPENAPI,
  visibility: VisibilityEnum.PRIVATE,
} as const;

/**
 * 默认服务器配置
 */
export const DEFAULT_SERVER_CONFIG = {
  url: '',
  description: '',
} as const;

/**
 * 默认安全配置
 */
export const DEFAULT_SECURITY_CONFIG = {
  type: 'apiKey' as const,
  apiKeyName: '',
  apiKeyValue: '',
  apiKeyIn: 'header' as const,
  basicUsername: '',
  basicPassword: '',
  bearerToken: '',
  oauth2TokenUrl: '',
  oauth2Username: '',
  oauth2Password: '',
  oauth2ClientId: '',
  oauth2ClientSecret: '',
  oauth2Scope: '',
  oauth2ClientTokenUrl: '',
  oauth2ClientCredentialsId: '',
  oauth2ClientCredentialsSecret: '',
  oauth2ClientScope: '',
} as const;

/**
 * 统计卡片配置
 */
export const STATS_CARDS_CONFIG = [
  {
    key: 'collections',
    icon: Database,
    iconBg: 'bg-blue-500',
  },
  {
    key: 'totalApis',
    icon: Code2,
    iconBg: 'bg-green-500',
  },
  {
    key: 'enabledApis',
    icon: Zap,
    iconBg: 'bg-orange-500',
  },
  {
    key: 'todayCalls',
    icon: Activity,
    iconBg: 'bg-purple-500',
  },
] as const;

