/**
 * 模型管理工具函数
 */

import type { ModelDetailVo } from '@/services/ModelsTypes';
import { GetModelListParamsOrderByEnum } from '@/services/ModelsTypes';
import {
  MODEL_TYPE_CONFIG,
  DEFAULT_MODEL_TYPE_CONFIG,
  MODEL_STATUS_CONFIG,
  DEFAULT_MODEL_STATUS_CONFIG,
} from './constants';
import { ModelTypeEnum, ModelStatusEnum } from '@/enums/enums';

/**
 * 格式化数字，处理 null/undefined/NaN
 */
export const formatNumber = (value?: number | null): string => {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return '--';
  }
  return Number(value).toLocaleString();
};

/**
 * 格式化货币，根据语言环境
 */
export const formatCurrency = (value?: number | null, language: string = 'zh-CN'): string => {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return '--';
  }
  try {
    return new Intl.NumberFormat(language === 'zh-CN' ? 'zh-CN' : 'en-US', {
      style: 'currency',
      currency: language === 'zh-CN' ? 'CNY' : 'USD',
      maximumFractionDigits: 2,
    }).format(value);
  } catch {
    return Number(value).toFixed(2);
  }
};

/**
 * 格式化延迟时间
 */
export const formatLatency = (performance?: ModelDetailVo['performance']): string => {
  if (!performance) {
    return '--';
  }
  if (performance.latency) {
    return performance.latency;
  }
  if (performance.latencyMs !== undefined && performance.latencyMs !== null) {
    return `${performance.latencyMs}ms`;
  }
  return '--';
};

/**
 * 格式化吞吐量
 */
export const formatThroughput = (performance?: ModelDetailVo['performance']): string => {
  if (!performance) {
    return '--';
  }
  if (performance.throughput) {
    return performance.throughput;
  }
  if (performance.throughputRaw !== undefined && performance.throughputRaw !== null) {
    return `${performance.throughputRaw} req/s`;
  }
  return '--';
};

/**
 * 格式化准确率
 */
export const formatAccuracy = (performance?: ModelDetailVo['performance']): string => {
  if (!performance) {
    return '--';
  }
  if (performance.accuracy) {
    return performance.accuracy;
  }
  if (performance.accuracyPercent !== undefined && performance.accuracyPercent !== null) {
    return `${performance.accuracyPercent.toFixed(1)}%`;
  }
  return '--';
};

/**
 * 根据模型类型获取配置
 */
export const getModelTypeConfig = (type?: ModelTypeEnum | string) => {
  if (!type || !(type in MODEL_TYPE_CONFIG)) {
    return DEFAULT_MODEL_TYPE_CONFIG;
  }
  return MODEL_TYPE_CONFIG[type as ModelTypeEnum];
};

/**
 * 根据模型状态获取配置
 */
export const getModelStatusConfig = (status?: ModelStatusEnum | string) => {
  if (!status || !(status in MODEL_STATUS_CONFIG)) {
    return DEFAULT_MODEL_STATUS_CONFIG;
  }
  return MODEL_STATUS_CONFIG[status as ModelStatusEnum];
};

/**
 * 格式化日期为本地化字符串
 */
export const formatDate = (dateString?: string | null, language: string = 'zh-CN'): string => {
  if (!dateString) {
    return '--';
  }
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    return '--';
  }
  return date.toLocaleDateString(language === 'zh-CN' ? 'zh-CN' : 'en-US');
};

/**
 * 解析数字字符串，返回有效的数字或 undefined
 */
export const parseNumber = (value: string): number | undefined => {
  if (!value.trim()) {
    return undefined;
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};

/**
 * 创建提供商标签映射
 */
export const createProviderLabelMap = (providerOptions: Array<{ value: string; label: string }>): Map<string, string> => {
  const map = new Map<string, string>();
  providerOptions.forEach(option => {
    map.set(option.value, option.label);
  });
  return map;
};

/** 排序选项类型 */
export type SortOption = 'default' | 'name' | 'provider' | 'status' | 'createdDate';

/**
 * 解析排序选项为 API 排序枚举
 */
export const resolveSortOrderBy = (
  value: SortOption
): GetModelListParamsOrderByEnum | undefined => {
  switch (value) {
    case 'name':
      return GetModelListParamsOrderByEnum.Name;
    case 'provider':
      return GetModelListParamsOrderByEnum.Provider;
    case 'status':
      return GetModelListParamsOrderByEnum.Status;
    case 'createdDate':
      return GetModelListParamsOrderByEnum.CreatedDate;
    default:
      return undefined;
  }
};

