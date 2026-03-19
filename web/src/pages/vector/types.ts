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
  /** 连接地址：HTTP 为完整 URL，DB 为 host:port 或 JDBC URL */
  endpoint: string;
  apiKey: string;
  dimension: string;
  database: string;
  collection: string;
  username: string;
  password: string;
  /** PGVECTOR/MARIADB: JDBC URL，可选替代 host+port+database */
  url?: string;
  /** Qdrant: 是否启用 TLS */
  useTls?: boolean;
  /** Milvus: 认证 token（extra.token） */
  token?: string;
  /** Milvus: 数据库名（extra.databaseName） */
  databaseName?: string;
  /** Weaviate: 协议 http/https（extra.scheme） */
  scheme?: string;
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

