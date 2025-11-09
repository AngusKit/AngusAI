import { ApiLocaleResult, TenantAuditingVo } from '@xcan-angus/infra';
import { DatasetTypeEnum, DatasourceTypeEnum, VisibilityEnum } from '@/enums/enums.ts';

/** 数据集数据统计响应 */
export interface DatasetDataStatisticsVo {
  /**
   * 总文件或表数
   * @format int64
   */
  totalFilesOrTables?: number;
  /**
   * 总记录数
   * @format int64
   */
  totalRecords?: number;
  /** 记录总大小 */
  totalRecordsSize?: string;
  /** 已使用存储空间大小 */
  usedStoreSize?: string;
}

/** 数据集启用状态切换请求参数 */
export interface DatasetToggleDto {
  /**
   * 启用状态
   * @example true
   */
  enabled: boolean;
}

/** 数据集详情响应 */
export interface DatasetDetailVo extends TenantAuditingVo {
  /**
   * 数据集ID
   * @format int64
   */
  id?: string;
  /** 数据集名称 */
  name?: string;
  /** 数据集描述 */
  description?: string;
  /** 数据集类型 */
  type?: DatasetTypeEnum;
  /**
   * 是否启用
   */
  enabled?: boolean;
  /** 可见性 */
  visibility?: VisibilityEnum;
  /** 图标emoji */
  icon?: string;
  /** 背景色 */
  iconBg?: string;
  /** 标签 */
  tags?: string[];
  /** 数据源配置信息 */
  datasourceConfig?: DatasourceConfigVo;
  /** 统计信息 */
  dataStatistics?: DatasetDataStatisticsVo;
}

/** The API response result of supporting international message. */
export type DatasetDetailResult = ApiLocaleResult & {
  /** Actual response data or error details. */
  data?: DatasetDetailVo;
};

/** 数据源详情响应 */
export interface DatasourceConfigVo {
  /** 数据源名称 */
  name?: string;
  /** 数据库类型 */
  databaseType?: DatasourceTypeEnum;
  /** 数据库 */
  database?: string;
  /** 数据库Jdbc URL */
  jdbcUrl?: string;
  /** 数据库主机名或IP */
  host?: string;
  /**
   * 数据库端口
   * @format int32
   */
  port?: number;
  /** 数据库用户名 */
  username?: string;
  /** 数据库密码 */
  password?: string;
}

/** 添加数据源请求参数 */
export interface DataSourceUpdateDto {
  /**
   * 数据源名称
   * @example "MySQL数据库"
   */
  name: string;
  /**
   * 数据源类型
   * @example "database"
   */
  databaseType: DatasourceTypeEnum;
  /** 数据库 */
  database?: string;
  /** 数据库Jdbc URL */
  jdbcUrl?: string;
  /** 数据库主机名或IP */
  host?: string;
  /**
   * 数据库端口
   * @format int32
   */
  port?: number;
  /** 数据库用户名 */
  username?: string;
  /** 数据库密码 */
  password?: string;
}

/** 创建数据集请求参数 */
export interface DatasetCreateDto {
  /**
   * 数据集名称
   * @example "用户行为数据"
   */
  name: string;
  /**
   * 数据集描述
   * @example "用户行为分析数据集"
   */
  description: string;
  /** 数据类型 */
  type: DatasetTypeEnum;
  /** 可见性 */
  visibility: VisibilityEnum;
  /**
   * 图标emoji
   * @example "📊"
   */
  icon?: string;
  /**
   * 背景色
   * @example "bg-blue-500"
   */
  iconBg?: string;
  /** 标签，最多5个 */
  tags?: string[];
}

/** 更新数据集请求参数 */
export interface DatasetUpdateDto {
  /**
   * 数据集名称
   * @example "用户行为数据"
   */
  name?: string;
  /**
   * 数据集描述
   * @example "用户行为分析数据集"
   */
  description?: string;
  /**
   * 图标emoji
   * @example "📊"
   */
  icon?: string;
  /**
   * 背景色
   * @example "bg-blue-500"
   */
  iconBg?: string;
  /** 可见性 */
  visibility?: VisibilityEnum;
  /** 标签，最多5个 */
  tags?: string[];
}

/** 测试数据源连接请求参数 */
export interface DatasourceConnectionTestDto {
  /**
   * 已保存数据集ID
   * @format int64
   */
  datasetId?: string;
  /** 数据源类型 */
  databaseType?: DatasourceTypeEnum;
  /** 数据库 */
  database?: string;
  /** 数据库Jdbc URL */
  jdbcUrl?: string;
  /** 数据库主机名或IP */
  host?: string;
  /**
   * 数据库端口
   * @format int32
   */
  port?: number;
  /** 数据库用户名 */
  username?: string;
  /** 数据库密码 */
  password?: string;
}

/** 连接测试响应 */
export interface DatasourceConnectionTestVo {
  /** 状态 */
  success?: boolean;
  /** 消息 */
  message?: string;
  /** 详细信息 */
  details?: string;
}

/** The API response result of supporting international message. */
export type DatasourceConnectionTestResult = ApiLocaleResult & {
  /** Actual response data or error details. */
  data?: DatasourceConnectionTestVo;
};

/** 数据集列表项响应 */
export interface DatasetListVo extends TenantAuditingVo {
  /**
   * 数据集ID
   * @format int64
   */
  id?: string;
  /** 数据集名称 */
  name?: string;
  /** 数据集描述 */
  description?: string;
  /** 数据集类型 */
  type?: DatasetTypeEnum;
  /**
   * 是否启用
   */
  enabled?: boolean;
  /** 可见性 */
  visibility?: VisibilityEnum;
  /** 图标emoji */
  icon?: string;
  /** 背景色 */
  iconBg?: string;
  /** 标签 */
  tags?: string[];
  /** 数据源配置信息 */
  datasourceConfig?: DatasourceConfigVo;
  /** 统计信息 */
  dataStatistics?: DatasetDataStatisticsVo;
}

export interface PageResultDatasetListVo {
  /**
   * Total number
   * @format int64
   * @example 10
   */
  total?: number;
  /** Page data */
  list?: DatasetListVo[];
}

/** The API response result of supporting international message. */
export type PageDatasetListResult = ApiLocaleResult & {
  /** Actual response data or error details. */
  data?: PageResultDatasetListVo;
};

/** 表数据预览响应 */
export interface DatasourceTableDataPreviewVo {
  /** 是否成功 */
  success?: boolean;
  /** 消息 */
  message?: string;
  /** 详细信息 */
  details?: string;
  /** 列名列表 */
  columns?: string[];
  /** 数据行列表 */
  data?: Record<string, object>[];
  /**
   * 总记录数
   * @format int64
   */
  total?: number;
}

/** The API response result of supporting international message. */
export type DatasourceTableDataPreviewResult = ApiLocaleResult & {
  /** Actual response data or error details. */
  data?: DatasourceTableDataPreviewVo;
};

/** 数据集统计总体统计 */
export interface DatasetStatisticsOverview {
  /**
   * 总数据集数
   * @format int64
   */
  totalDatasets?: number;
  /**
   * 活跃（被引用）数据集数
   * @format int64
   */
  activeDatasets?: number;
  /**
   * 总文件或表数
   * @format int64
   */
  totalFilesOrTables?: number;
  /**
   * 活跃（被引用）文件或表数
   * @format int64
   */
  activeFilesOrTables?: number;
  /**
   * 总记录数
   * @format int64
   */
  totalRecords?: number;
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
export interface DatasetTopDataset {
  /**
   * 数据集ID
   * @format int64
   */
  id?: string;
  /**
   * 数据集名称
   */
  name?: string;
  /**
   * 查询次数
   * @format int64
   */
  queryCount?: number;
  /**
   * 文件或表数
   * @format int64
   */
  fileOrTableCount?: number;
  /**
   * 记录数
   * @format int64
   */
  recordCount?: number;
}

/** 查询趋势 */
export interface DatasetQueryTrend {
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
   */
  errorRate?: number;
}

/** 数据集统计响应 */
export interface DatasetStatisticsVo {
  /** 总体统计 */
  overview?: DatasetStatisticsOverview;
  /** 近一月趋势 */
  lastMonthGrowthTrend?: DatasetStatisticsOverview;
  /** 使用率排行 */
  topDatasets?: DatasetTopDataset[];
  /** 查询趋势 */
  queryTrend?: DatasetQueryTrend[];
}

/** The API response result of supporting international message. */
export type DatasetStatisticsResult = ApiLocaleResult & {
  /** Actual response data or error details. */
  data?: DatasetStatisticsVo;
};

/** 排序字段 */
export enum GetDatasetListOrderByEnum {
  Name = 'name',
  Type = 'type',
  CreatedDate = 'createdDate',
  ModifiedDate = 'modifiedDate',
}
