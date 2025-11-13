/**
 * API Collection 工具函数
 */

import { FileJson, Code2, Globe, Book, Shield, Eye } from 'lucide-react';
import type { ElementType } from 'react';
import { ApiCollectionSourceEnum, VisibilityEnum } from '@/enums/enums';
import { HTTP_METHOD_COLORS } from './constants';
import type { CollectionListItem, EndpointItem } from './types';
import type { ApiCollectionListVo, ApiEndpointVo } from '@/services/ApiCollectionsTypes';

/**
 * 格式化数字
 */
export const formatNumber = (value?: number | null, locale: string = 'en-US'): string => {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return '--';
  }
  return Number(value).toLocaleString(locale === 'zh-CN' ? 'zh-CN' : 'en-US');
};

/**
 * 获取 HTTP 方法颜色
 */
export const getMethodColor = (method?: string): string => {
  const normalized = method?.toUpperCase() ?? '';
  return HTTP_METHOD_COLORS[normalized as keyof typeof HTTP_METHOD_COLORS] || HTTP_METHOD_COLORS.DEFAULT;
};

/**
 * 获取来源图标
 */
export const getSourceIcon = (source?: ApiCollectionSourceEnum | string): ElementType => {
  const normalized = (source || '').toString().toUpperCase();
  switch (normalized) {
    case ApiCollectionSourceEnum.OPENAPI:
      return FileJson;
    case ApiCollectionSourceEnum.SWAGGER:
      return Code2;
    case ApiCollectionSourceEnum.POSTMAN:
      return Globe;
    default:
      return Book;
  }
};

/**
 * 获取可见性图标
 */
export const getVisibilityIcon = (visibility?: VisibilityEnum | string): ElementType => {
  const normalized = (visibility || '').toString().toUpperCase();
  switch (normalized) {
    case VisibilityEnum.PRIVATE:
      return Shield;
    case VisibilityEnum.TEAM:
      return Eye;
    case VisibilityEnum.PUBLIC:
      return Globe;
    default:
      return Shield;
  }
};

/**
 * 获取可见性标签
 */
export const getVisibilityLabel = (visibility?: VisibilityEnum | string, language: string = 'en-US'): string => {
  const normalized = (visibility || '').toString().toUpperCase();
  const labels: Record<string, { zh: string; en: string }> = {
    [VisibilityEnum.PRIVATE]: { zh: '私有', en: 'Private' },
    [VisibilityEnum.TEAM]: { zh: '团队', en: 'Team' },
    [VisibilityEnum.PUBLIC]: { zh: '公开', en: 'Public' },
  };
  const label = labels[normalized];
  return label ? (language === 'zh-CN' ? label.zh : label.en) : (visibility || '-');
};

/**
 * 映射集合列表
 */
export const mapCollections = (items?: ApiCollectionListVo[]): CollectionListItem[] => {
  if (!Array.isArray(items)) {
    return [];
  }
  return items
    .map(item => {
      const id = item.id !== undefined && item.id !== null ? String(item.id) : '';
      if (!id) {
        return null;
      }
      return {
        ...item,
        id,
        enabledEndpointsCount: item.enabledEndpointsCount ?? 0,
      };
    })
    .filter(Boolean) as CollectionListItem[];
};

/**
 * 映射端点列表
 */
export const mapEndpoints = (items?: ApiEndpointVo[]): EndpointItem[] => {
  if (!Array.isArray(items)) {
    return [];
  }
  return items
    .map(item => {
      const id = item.id !== undefined && item.id !== null ? String(item.id) : '';
      if (!id) {
        return null;
      }
      const modifiedDate = (item as any)?.modifiedDate;
      return {
        ...item,
        id,
        lastUsedDate: modifiedDate ? new Date(modifiedDate) : undefined,
      };
    })
    .filter(Boolean) as EndpointItem[];
};

/**
 * 构建趋势数据
 */
export const buildTrend = (current?: number, prev?: number): { text: string; up: boolean } | undefined => {
  if (typeof current !== 'number' || typeof prev !== 'number') {
    return undefined;
  }
  const diff = current - prev;
  if (diff === 0) {
    return { text: '0', up: true };
  }
  return { text: `${diff > 0 ? '+' : ''}${diff.toLocaleString()}`, up: diff >= 0 };
};

