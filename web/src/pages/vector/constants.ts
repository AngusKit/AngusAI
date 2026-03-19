/**
 * 向量存储相关常量
 */

import { VectorStoreTypeEnum } from '@/enums/enums';
import { getEnumDescription, enumToMessages } from '@/enums/utils';


const getEnumIcon = (value: VectorStoreTypeEnum) => {
  switch (value) {
    case VectorStoreTypeEnum.PGVECTOR:
      return '🐘';
    case VectorStoreTypeEnum.MILVUS:
      return '🦅';
    case VectorStoreTypeEnum.QDRANT:
      return '⚡';
    case VectorStoreTypeEnum.CHROMA:
      return '🎨';
    case VectorStoreTypeEnum.ELASTICSEARCH:
      return '🔍';
    case VectorStoreTypeEnum.WEAVIATE:
      return '🕸️';
    case VectorStoreTypeEnum.MARIADB:
      return '🗄️';
  }
};


/**
 * 向量存储类型配置列表
 */

export const VECTOR_STORE_TYPES = enumToMessages(VectorStoreTypeEnum).map(({value, message}) => ({
  value,
  label: message,
  icon: getEnumIcon(value as VectorStoreTypeEnum),
}));


/**
 * 默认向量存储类型配置（用于未知类型）
 */
export const DEFAULT_VECTOR_STORE_TYPE_CONFIG = {
  value: 'UNKNOWN',
  label: getEnumDescription(VectorStoreTypeEnum, 'unknown'),
  icon: '📦',
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
 * 默认向量维度
 */
export const DEFAULT_DIMENSION = '1536';

/**
 * 连接测试超时时间（秒）
 */
export const CONNECTION_TEST_TIMEOUT = 30;

/**
 * 表单默认值
 */
export const DEFAULT_FORM_DATA = {
  name: '',
  type: '' as '' | VectorStoreTypeEnum,
  description: '',
  endpoint: '',
  apiKey: '',
  dimension: DEFAULT_DIMENSION,
  database: '',
  collection: '',
  username: '',
  password: '',
  url: '',
  useTls: false,
  token: '',
  databaseName: '',
  scheme: 'http',
} as const;

