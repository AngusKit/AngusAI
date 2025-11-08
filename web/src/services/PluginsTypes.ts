import { ApiLocaleResult, TenantAuditingVo } from '@xcan-angus/infra';
import { PluginCategoryEnum, PluginStatusEnum, PluginTypeEnum } from '@/enums/enums.ts';
import { LastMonthGrowthTrend } from './ModelsTypes.ts';

/** 插件详情 */
export interface PluginDetailVo extends TenantAuditingVo {
  /**
   * 插件ID
   * @format int64
   */
  id?: string;
  /** 插件名称 */
  name?: string;
  /** 插件图标 */
  icon?: string;
  /** 插件描述 */
  description?: string;
  /** 作者 */
  author?: string;
  /** 版本号 */
  version?: string;
  /** 插件分类 */
  category?: PluginCategoryEnum;
  /** 插件状态 */
  status?: PluginStatusEnum;
  /** 插件类型 */
  type?: PluginTypeEnum;
  /** 标签列表 */
  tags?: string[];
  /**
   * 安装次数
   * @format int64
   */
  installCount?: number;
  /**
   * 使用次数
   * @format int64
   */
  usageCount?: number;
  /**
   * 评分
   * @format double
   */
  rating?: number;
  /**
   * 评价数量
   * @format int64
   */
  reviewCount?: number;
  /** 是否收藏 */
  isFavorite?: boolean;
  /** 是否系统插件 */
  isSystem?: boolean;
  /** 是否公开 */
  isPublic?: boolean;
  /** 是否已验证 */
  isVerified?: boolean;
  /** 最小系统版本要求 */
  minVersion?: string;
  /** 主页URL */
  homepageUrl?: string;
  /** 文档URL */
  documentationUrl?: string;
  /** 源码仓库URL */
  repositoryUrl?: string;
  /** 支持URL */
  supportUrl?: string;
  /** 许可证 */
  license?: string;
  /**
   * 价格
   * @format double
   */
  price?: number;
  /** 货币单位 */
  currency?: string;
  /**
   * 发布时间
   * @format date-time
   */
  publishedDate?: string;
  /** 统计数据 */
  stats?: PluginStatsVo;
}

/** The API response result of supporting international message. */
export type PluginDetailResult = ApiLocaleResult & {
  /** Actual response data or error details. */
  data?: PluginDetailVo;
};

/** 插件统计数据 */
export interface PluginStatsVo {
  /**
   * 总安装数
   * @format int64
   */
  totalInstalls?: number;
  /**
   * 总使用数
   * @format int64
   */
  totalUsages?: number;
  /**
   * 活跃用户数
   * @format int64
   */
  activeUsers?: number;
  /**
   * 评价总数
   * @format int64
   */
  totalReviews?: number;
}

/** 创建插件请求参数 */
export interface PluginCreateDto {
  /**
   * 插件名称
   * @example "天气查询插件"
   */
  name: string;
  /**
   * 插件图标
   * @example "🌤️"
   */
  icon?: string;
  /**
   * 插件描述
   * @example "提供实时天气查询功能"
   */
  description?: string;
  /**
   * 作者
   * @example "XCan"
   */
  author?: string;
  /**
   * 版本号
   * @example "1.0.0"
   */
  version: string;
  /** 插件分类 */
  category: PluginCategoryEnum;
  /** 插件类型 */
  type: PluginTypeEnum;
  /** 标签列表 */
  tags?: string[];
  /**
   * 是否公开
   * @example false
   */
  isPublic?: boolean;
  /**
   * 最小系统版本要求
   * @example "1.0.0"
   */
  minVersion?: string;
  /** 主页URL */
  homepageUrl?: string;
  /** 文档URL */
  documentationUrl?: string;
  /** 源码仓库URL */
  repositoryUrl?: string;
  /** 支持URL */
  supportUrl?: string;
  /**
   * 许可证
   * @example "MIT"
   */
  license?: string;
  /**
   * 插件规范文件，最大支持200MB
   * @format binary
   */
  file: File;
  /**
   * 价格（0表示免费）
   * @format double
   * @example 0
   */
  price?: number;
  /**
   * 货币单位
   * @example "CNY"
   */
  currency?: string;
}

/** 创建插件评级请求体 */
export interface PluginReviewCreateDto {
  /**
   * 评分星级（1-5）
   * @format int32
   */
  rating: number;
  /** 评价内容（最长200字符） */
  content?: string;
}

/** 插件评级记录 */
export interface PluginReviewVo {
  /** @format int64 */
  id?: string;
  /** @format int64 */
  pluginId?: string;
  /** @format int32 */
  rating?: number;
  content?: string;
  /**
   * 创建者ID
   * @format int64
   */
  createdBy?: string;
  /** 创建者姓名 */
  creator?: string;
  /**
   * 创建时间
   * @format date-time
   */
  createdDate?: string;
}

/** 创建插件请求参数 */
export interface PluginVerifyDto {
  /**
   * 插件名称
   * @example "天气查询插件"
   */
  name: string;
  /**
   * 版本号
   * @example "1.0.0"
   */
  version: string;
  /** 插件分类 */
  category: PluginCategoryEnum;
  /** 插件类型 */
  type: PluginTypeEnum;
  /**
   * 插件规范文件，最大支持200MB
   * @format binary
   */
  file: File;
}

/** 更新插件请求参数 */
export interface PluginUpdateDto {
  /** 插件名称 */
  name?: string;
  /** 插件图标 */
  icon?: string;
  /** 插件描述 */
  description?: string;
  /** 作者 */
  author?: string;
  /** 版本号 */
  version?: string;
  /** 插件分类 */
  category?: PluginCategoryEnum;
  /** 插件状态 */
  status?: PluginStatusEnum;
  /** 插件类型 */
  type?: PluginTypeEnum;
  /** 标签列表 */
  tags?: string[];
  /** 是否公开 */
  isPublic?: boolean;
  /** 最小系统版本要求 */
  minVersion?: string;
  /** 主页URL */
  homepageUrl?: string;
  /** 文档URL */
  documentationUrl?: string;
  /** 源码仓库URL */
  repositoryUrl?: string;
  /** 支持URL */
  supportUrl?: string;
  /** 许可证 */
  license?: string;
  /**
   * 插件规范文件，最大支持200MB
   * @format binary
   */
  file?: File;
  /**
   * 价格
   * @format double
   */
  price?: number;
  /** 货币单位 */
  currency?: string;
}

/** 插件列表项 */
export interface PluginListVo extends TenantAuditingVo {
  /**
   * 插件ID
   * @format int64
   */
  id?: string;
  /** 插件名称 */
  name?: string;
  /** 插件图标 */
  icon?: string;
  /** 插件描述 */
  description?: string;
  /** 作者 */
  author?: string;
  /** 版本号 */
  version?: string;
  /** 插件分类 */
  category?: PluginCategoryEnum;
  /** 插件状态 */
  status?: PluginStatusEnum;
  /** 插件类型 */
  type?: PluginTypeEnum;
  /** 标签列表 */
  tags?: string[];
  /**
   * 安装次数
   * @format int64
   */
  installCount?: number;
  /**
   * 使用次数
   * @format int64
   */
  usageCount?: number;
  /**
   * 评分
   * @format double
   */
  rating?: number;
  /**
   * 评价数量
   * @format int64
   */
  reviewCount?: number;
  /** 是否收藏 */
  isFavorite?: boolean;
  /** 是否系统插件 */
  isSystem?: boolean;
  /** 是否公开 */
  isPublic?: boolean;
  /** 是否已验证 */
  isVerified?: boolean;
  /**
   * 价格
   * @format double
   */
  price?: number;
  /** 货币单位 */
  currency?: string;
  /**
   * 发布时间
   * @format date-time
   */
  publishedDate?: string;
}

export interface PageResultPluginListVo {
  /**
   * Total number
   * @format int64
   * @example 10
   */
  total?: number;
  /** Page data */
  list?: PluginListVo[];
}

/** The API response result of supporting international message. */
export type PageResultPluginListResult = ApiLocaleResult & {
  /** Actual response data or error details. */
  data?: PageResultPluginListVo;
};

/** The API response result of supporting international message. */
export type ListPluginReviewResult = ApiLocaleResult & {
  /** Actual response data or error details. */
  data?: PluginReviewVo[];
};

/** 分类统计 */
export interface CategoryStats {
  /** 分类 */
  category?: PluginCategoryEnum;
  /**
   * 插件数量
   * @format int64
   */
  count?: number;
  /**
   * 安装数量
   * @format int64
   */
  installCount?: number;
}

/** 热门插件 */
export interface TrendingPlugin {
  /**
   * 插件ID
   * @format int64
   */
  id?: string;
  /** 插件名称 */
  name?: string;
  /** 插件图标 */
  icon?: string;
  /**
   * 安装次数
   * @format int64
   */
  installCount?: number;
  /**
   * 评分
   * @format double
   */
  rating?: number;
}

/** 插件统计数据 */
export interface PluginStatisticsVo {
  /**
   * 总插件数
   * @format int64
   */
  totalPlugins?: number;
  /**
   * 总可用插件数
   * @format int64
   */
  totalAvailablePlugins?: number;
  /**
   * 我的插件数
   * @format int64
   */
  myPlugins?: number;
  /**
   * 已安装插件数
   * @format int64
   */
  installedPlugins?: number;
  /**
   * 总下载插件数
   * @format int64
   */
  downloadPlugins?: number;
  /**
   * 总访问插件数
   * @format int64
   */
  visitsPlugins?: number;
  /**
   * 公开插件数
   * @format int64
   */
  publicPlugins?: number;
  /**
   * 总安装数
   * @format int64
   */
  totalInstalls?: number;
  /**
   * 总使用数
   * @format int64
   */
  totalUsages?: number;
  /**
   * 总评级数
   * @format int64
   */
  totalRatings?: number;
  /** 分类统计 */
  categoryStats?: CategoryStats[];
  /** 近一月趋势 */
  lastMonthGrowthTrend?: LastMonthGrowthTrend;
  /** 热门插件 */
  trendingPlugins?: TrendingPlugin[];
}

/** The API response result of supporting international message. */
export type PluginStatisticsResult = ApiLocaleResult & {
  /** Actual response data or error details. */
  data?: PluginStatisticsVo;
};

/** 排序字段 */
export enum GetPluginListOrderByEnum {
  Id = 'id',
  Name = 'name',
  Category = 'category',
  Status = 'status',
  Type = 'type',
  InstallCount = 'installCount',
  UsageCount = 'usageCount',
  Rating = 'rating',
  ReviewCount = 'reviewCount',
  CreatedDate = 'createdDate',
  PublishedDate = 'publishedDate',
}
