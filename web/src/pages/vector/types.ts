/**
 * 向量存储相关类型定义
 */

import { ConnectionStatusEnum, VectorStoreTypeEnum } from '@/enums/enums';
import type { VectorStoreVo } from '@/services/VectorStoresTypes';

export type VectorStoreStatus = ConnectionStatusEnum | 'TESTING';

export interface VectorStoreItem {
  id: string;
  name: string;
  type: VectorStoreTypeEnum;
  description: string;
  endpoint?: string;
  status: VectorStoreStatus;
  enabled: boolean;
  dimension?: number;
  indexCount?: number;
  createdTime: string;
  lastSync: string;
  config?: VectorStoreVo['config'];
}

export interface VectorStoreFormData {
  name: string;
  type: '' | VectorStoreTypeEnum;
  description: string;
  endpoint: string;
  apiKey: string;
  dimension: string;
  database: string;
  collection: string;
  username: string;
  password: string;
}

export interface VectorStoreTypeInfo {
  value: string;
  label: string;
  icon: string;
}

export interface VectorStoreStatusInfo {
  label: string;
  badgeClass: string;
}

