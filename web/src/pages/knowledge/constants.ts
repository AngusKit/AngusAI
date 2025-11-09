/**
 * 知识库相关常量
 */

import { KnowledgeBaseDocStatusEnum, KnowledgeBaseDocTypeEnum } from '@/enums/enums';

// 向量存储源配置
export const VECTOR_STORES = [
  {
    id: '1',
    name: 'Production Pinecone',
    type: 'PINECONE',
    status: 'connected',
    icon: '🌲',
  },
  {
    id: '2',
    name: 'Dev Chroma DB',
    type: 'CHROMA',
    status: 'connected',
    icon: '🎨',
  },
  {
    id: '3',
    name: 'Azure OpenSearch',
    type: 'OPENSEARCH',
    status: 'disconnected',
    icon: '🔎',
  },
  {
    id: '4',
    name: 'Qdrant Cluster',
    type: 'QDRANT',
    status: 'connected',
    icon: '⚡',
  },
  {
    id: '5',
    name: 'MongoDB Atlas Vector',
    type: 'MONGODB_ATLAS',
    status: 'connected',
    icon: '🍃',
  },
] as const;

// 配置参数常量
export const CONFIG_CONSTANTS = {
  CHUNK_SIZE: {
    MIN: 100,
    MAX: 2000,
    DEFAULT: 512,
  },
  CHUNK_OVERLAP: {
    MIN: 0,
    MAX: 200,
    DEFAULT: 50,
  },
  TAG: {
    MAX_LENGTH: 10,
    MAX_COUNT: 5,
  },
} as const;

// 步骤配置
export const FORM_STEPS = [
  { number: 1, title: '基本信息' },
  { number: 2, title: '配置处理' },
] as const;

/**
 * 文档状态映射
 */
export const DOCUMENT_STATUS_MAP: Record<string, { text: string; color: string }> = {
  [KnowledgeBaseDocStatusEnum.PENDING]: {
    text: '待处理',
    color: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400',
  },
  [KnowledgeBaseDocStatusEnum.PROCESSING]: {
    text: '处理中',
    color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  },
  [KnowledgeBaseDocStatusEnum.COMPLETED]: {
    text: '已完成',
    color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  },
  [KnowledgeBaseDocStatusEnum.FAILED]: {
    text: '失败',
    color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  },
};

/**
 * 文档类型映射
 */
export const DOCUMENT_TYPE_MAP: Record<string, { text: string; icon: string; color: string }> = {
  [KnowledgeBaseDocTypeEnum.PDF]: {
    text: 'PDF',
    icon: '📄',
    color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  },
  [KnowledgeBaseDocTypeEnum.DOCX]: {
    text: 'Word',
    icon: '📘',
    color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  },
  [KnowledgeBaseDocTypeEnum.TXT]: {
    text: 'Text',
    icon: '📝',
    color: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400',
  },
  [KnowledgeBaseDocTypeEnum.MD]: {
    text: 'Markdown',
    icon: '📝',
    color: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400',
  },
  [KnowledgeBaseDocTypeEnum.HTML]: {
    text: 'HTML',
    icon: '🌐',
    color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  },
};
