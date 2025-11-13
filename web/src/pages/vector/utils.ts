/**
 * 向量存储工具函数
 */

import { ConnectionStatusEnum, VectorStoreTypeEnum } from '@/enums/enums';
import { VECTOR_STORE_TYPES, DEFAULT_VECTOR_STORE_TYPE_CONFIG } from './constants';
import type { VectorStoreStatus, VectorStoreTypeInfo, VectorStoreStatusInfo } from './types';
import { constantTranslation as t } from '@/lib/i18n';

/**
 * 格式化数字，处理 null/undefined/NaN
 */
export const formatNumber = (value?: number | null, language: string = 'zh-CN'): string => {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return '--';
  }
  return Number(value).toLocaleString(language === 'zh-CN' ? 'zh-CN' : 'en-US');
};

/**
 * 格式化向量数量（支持K单位）
 */
export const formatVectorCount = (value?: number | null, language: string = 'zh-CN'): string => {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return '--';
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  return formatNumber(value, language);
};

/**
 * 格式化日期时间
 */
export const formatDateTime = (value?: string | number | Date | null, language: string = 'zh-CN'): string => {
  if (!value) {
    return '--';
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '--';
  }
  return date.toLocaleString(language === 'zh-CN' ? 'zh-CN' : 'en-US');
};

/**
 * 根据向量存储类型获取配置信息
 */
export const getVectorStoreTypeInfo = (type?: VectorStoreTypeEnum | string): VectorStoreTypeInfo => {
  if (!type) {
    return DEFAULT_VECTOR_STORE_TYPE_CONFIG;
  }
  return (
    VECTOR_STORE_TYPES.find(t => t.value === type) ?? {
      value: type,
      label: type,
      icon: DEFAULT_VECTOR_STORE_TYPE_CONFIG.icon,
    }
  );
};

/**
 * 根据连接状态获取配置信息
 */
export const getVectorStoreStatusInfo = (
  status: VectorStoreStatus,
): VectorStoreStatusInfo => {
  switch (status) {
    case ConnectionStatusEnum.CONNECTED:
      return {
        label: t('common.status.connected'),
        badgeClass: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-0 text-xs w-fit',
      };
    case 'TESTING':
      return {
        label: t('common.status.processing'),
        badgeClass:
          'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border-0 text-xs w-fit',
      };
    case ConnectionStatusEnum.DISCONNECTED:
    default:
      return {
        label: t('common.status.disconnected'),
        badgeClass: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-0 text-xs w-fit',
      };
  }
};

/**
 * 解析向量维度
 */
export const parseDimension = (dimension: string): number | null => {
  const dimensionValue = Number.parseInt(dimension, 10);
  if (!Number.isFinite(dimensionValue) || dimensionValue <= 0) {
    return null;
  }
  return dimensionValue;
};

/**
 * 从配置中构建端点地址
 */
export const buildEndpointFromConfig = (config?: { endpoint?: string; host?: string; port?: number }): string | undefined => {
  if (config?.endpoint) {
    return config.endpoint;
  }
  if (config?.host) {
    return `${config.host}${config.port ? `:${config.port}` : ''}`;
  }
  return undefined;
};

