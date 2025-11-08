import { ApiLocaleResult, TenantAuditingVo } from '@xcan-angus/infra';
import { VisibilityEnum } from '@/enums/enums.ts';

/** 知识库统计信息 */
export interface KnowledgeBaseStatsVo {
  /**
   * 总文档数
   * @format int32
   * @example 15
   */
  totalDocuments?: number;
  /**
   * 已启用文档数
   * @format int32
   * @example 12
   */
  activeDocuments?: number;
  /**
   * 总分段数
   * @format int32
   * @example 120
   */
  totalChunks?: number;
  /**
   * 平均分段大小
   * @format int32
   * @example 512
   */
  avgChunkSize?: number;
}

/** 知识库详情视图对象 */
export interface KnowledgeBaseDetailVo extends TenantAuditingVo {
  /**
   * 知识库ID
   * @format int64
   * @example 1
   */
  id?: number;
  /**
   * 知识库名称
   * @example "产品文档库"
   */
  name?: string;
  /**
   * 图标
   * @example "📚"
   */
  icon?: string;
  /**
   * 背景色
   * @example "bg-blue-100"
   */
  iconBg?: string;
  /**
   * 描述
   * @example "存储产品相关文档和资料"
   */
  description?: string;
  /**
   * 文档数量
   * @format int32
   * @example 15
   */
  documentsCount?: number;
  /**
   * 总大小
   * @example 2.5
   */
  totalSize?: string;
  /**
   * 是否启用
   * @example true
   */
  enabled?: boolean;
  /**
   * 标签
   * @example ["产品","文档"]
   */
  tags?: string[];
  /**
   * 可见性
   * @example "PRIVATE"
   */
  visibility?: VisibilityEnum;
  /** 统计信息 */
  stats?: KnowledgeBaseStatsVo;
  /** 配置信息 */
  config?: KnowledgeBaseConfig;
}

/** The API response result of supporting international message. */
export type KnowledgeBaseDetailResult = ApiLocaleResult & {
  /** Actual response data or error details. */
  data?: KnowledgeBaseDetailVo;
};

/** 知识库启用状态切换请求参数 */
export interface KnowledgeBaseToggleDto {
  /**
   * 启用状态
   * @example true
   */
  enabled: boolean;
}

/** 创建知识库请求参数 */
export interface KnowledgeBaseCreateDto {
  /**
   * 知识库名称
   * @example "产品文档库"
   */
  name: string;
  /**
   * 图标
   * @example "📚"
   */
  icon: string;
  /**
   * 背景色
   * @example "bg-blue-100"
   */
  iconBg: string;
  /**
   * 描述
   * @example "存储产品相关文档和资料"
   */
  description: string;
  /**
   * 可见性
   * @example "PRIVATE"
   */
  visibility: VisibilityEnum;
  /**
   * 标签
   * @example ["产品","文档"]
   */
  tags?: string[];
  /** 配置信息 */
  config?: KnowledgeBaseConfig;
}

/** 知识库配置 */
export interface KnowledgeBaseConfig {
  /**
   * 分段大小
   * @format int32
   * @example 512
   */
  chunkSize: number;
  /**
   * 分段重叠
   * @format int32
   * @example 50
   */
  chunkOverlap: number;
  /**
   * 向量化模型ID，不指定时使用默认模型
   */
  embeddingModelId: number;
}

/** 更新知识库请求参数 */
export interface KnowledgeBaseUpdateDto {
  /**
   * 知识库名称
   * @example "产品文档库"
   */
  name?: string;
  /**
   * 图标
   * @example "📚"
   */
  icon?: string;
  /**
   * 背景色
   * @example "bg-blue-100"
   */
  iconBg?: string;
  /**
   * 描述
   * @example "存储产品相关文档和资料"
   */
  description?: string;
  /**
   * 可见性
   * @example "PRIVATE"
   */
  visibility?: VisibilityEnum;
  /**
   * 标签
   * @example ["产品","文档"]
   */
  tags?: string[];
  /** 配置信息 */
  config?: KnowledgeBaseConfig;
}

/** 知识库列表视图对象 */
export interface KnowledgeBaseListVo extends TenantAuditingVo {
  /**
   * 知识库ID
   * @format int64
   * @example 1
   */
  id?: number;
  /**
   * 知识库名称
   * @example "产品文档库"
   */
  name?: string;
  /**
   * 图标
   * @example "📚"
   */
  icon?: string;
  /**
   * 背景色
   * @example "bg-blue-100"
   */
  iconBg?: string;
  /**
   * 描述
   * @example "存储产品相关文档和资料"
   */
  description?: string;
  /**
   * 文档数量
   * @format int32
   * @example 15
   */
  documentsCount?: number;
  /**
   * 总大小
   * @example 2.5
   */
  totalSize?: string;
  /**
   * 是否启用
   * @example true
   */
  enabled?: boolean;
  /**
   * 标签
   * @example ["产品","文档"]
   */
  tags?: string[];
  /**
   * 可见性
   * @example "PRIVATE"
   */
  visibility?: VisibilityEnum;
}

export interface PageKnowledgeBaseListVo {
  /**
   * Total number
   * @format int64
   * @example 10
   */
  total?: number;
  /** Page data */
  list?: KnowledgeBaseListVo[];
}

/** The API response result of supporting international message. */
export type PageResultKnowledgeBaseListResult = ApiLocaleResult & {
  /** Actual response data or error details. */
  data?: PageKnowledgeBaseListVo;
};

/** 排序字段 */
export enum GetKnowledgeBaseListOrderByEnum {
  CreatedDate = 'createdDate',
  ModifiedDate = 'modifiedDate',
  Name = 'name',
  DocumentsCount = 'documentsCount',
  TotalSize = 'totalSize',
}

/** 知识库统计概览 */
export interface KnowledgeBaseStatisticsOverview {
  /**
   * 总知识库数
   * @format int64
   */
  totalKnowledgeBases?: number;
  /**
   * 活跃（被引用）知识库数
   * @format int64
   */
  activeKnowledgeBases?: number;
  /**
   * 总文件数
   * @format int64
   */
  totalFiles?: number;
  /**
   * 活跃（被引用）文件数
   * @format int64
   */
  activeFiles?: number;
  /**
   * 总分段数
   * @format int32
   * @example 120
   */
  totalChunks?: number;
  /**
   * 平均分段大小
   * @format int32
   * @example 512
   */
  avgChunkSize?: number;
  /**
   * 总查询次数
   * @format int64
   */
  totalQueryCount?: number;
  /**
   * 今日查询次数
   * @format int64
   */
  todayQueryCount?: number;
  /**
   * 已使用存储空间大小
   */
  usedStoreSize?: string;
  /**
   * 授权的存储空间大小，自定义数据源返回空
   */
  totalStoreSize?: string;
  /**
   * 已使用存储空间占比，自定义数据源返回空
   */
  usedStoreRate?: string;
}

/** 使用率排行 */
export interface KnowledgeBaseTopKnowledgeBase {
  /**
   * 知识库ID
   * @format int64
   */
  id?: number;
  /**
   * 知识库名称
   */
  name?: string;
  /**
   * 查询次数
   * @format int64
   */
  queryCount?: number;
  /**
   * 文件数
   * @format int64
   */
  fileCount?: number;
  /**
   * 分段数
   * @format int64
   */
  chunkCount?: number;
}

/** 查询趋势 */
export interface KnowledgeBaseQueryTrend {
  /**
   * 时间戳
   * @format int64
   */
  timestamp?: number;
  /**
   * 日期
   */
  date?: string;
  /**
   * 总查询次数
   * @format int64
   */
  totalQueries?: number;
  /**
   * 平均响应时间（毫秒）
   * @format int64
   */
  avgResponseTime?: number;
  /**
   * 错误数
   * @format int64
   */
  errors?: number;
  /**
   * 错误率（百分比）
   * @format double
   */
  errorRate?: number;
}

/** 知识库统计响应 */
export interface KnowledgeBaseStatisticsVo {
  /** 总体统计 */
  overview?: KnowledgeBaseStatisticsOverview;
  /** 近一月趋势 */
  lastMonthGrowthTrend?: KnowledgeBaseStatisticsOverview;
  /** 使用率排行 */
  topKnowledgeBases?: KnowledgeBaseTopKnowledgeBase[];
  /** 查询趋势 */
  queryTrend?: KnowledgeBaseQueryTrend[];
}

/** The API response result of supporting international message. */
export type KnowledgeBaseStatisticsResult = ApiLocaleResult & {
  /** Actual response data or error details. */
  data?: KnowledgeBaseStatisticsVo;
};
