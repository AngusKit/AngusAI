/**
 * API Collection 相关类型定义
 */

import type { ApiCollectionListVo, ApiCollectionDetailVo, ApiEndpointVo } from '@/services/ApiCollectionsTypes';
import { ApiCollectionSourceEnum, VisibilityEnum } from '@/enums/enums';

export interface CollectionListItem extends ApiCollectionListVo {
  id: string;
  enabledEndpointsCount?: number;
}

export interface EndpointItem extends ApiEndpointVo {
  id: string;
  lastUsedDate?: Date;
}

export interface CustomAuthParam {
  id: string;
  name: string;
  value: string;
  location: 'header' | 'query' | 'cookie';
}

export interface CollectionFormData {
  name: string;
  description: string;
  source: ApiCollectionSourceEnum;
  visibility: VisibilityEnum;
}

export interface ServerConfig {
  url: string;
  description: string;
}

export interface SecurityConfig {
  type: 'apiKey' | 'httpBasic' | 'bearer' | 'oauth2Password' | 'oauth2Client' | 'custom';
  // API Key
  apiKeyName: string;
  apiKeyValue: string;
  apiKeyIn: 'header' | 'query' | 'cookie';
  // HTTP Basic
  basicUsername: string;
  basicPassword: string;
  // Bearer Token
  bearerToken: string;
  // OAuth2 Password
  oauth2TokenUrl: string;
  oauth2Username: string;
  oauth2Password: string;
  oauth2ClientId: string;
  oauth2ClientSecret: string;
  oauth2Scope: string;
  // OAuth2 Client Credentials
  oauth2ClientTokenUrl: string;
  oauth2ClientCredentialsId: string;
  oauth2ClientCredentialsSecret: string;
  oauth2ClientScope: string;
}

export type SortField = 'name' | 'method' | 'lastUsed';
export type SortOrder = 'asc' | 'desc';
export type ConflictStrategy = 'overwrite' | 'ignore';
export type ImportMode = 'quick' | 'settings';

