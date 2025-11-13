import { ApiLocaleResult, TenantAuditingVo } from '@xcan-angus/infra';
import { OpenAPIV3_1 } from '@/types/openapi-types';
import { ApiCollectionImportTypeEnum, ApiCollectionSourceEnum, ConflictStrategyEnum, HttpMethodEnum, VisibilityEnum, } from '@/enums/enums.ts';

/** 创建接口集请求参数 */
export interface ApiCollectionCreateDto {
  /** 接口集名称 */
  name: string;
  /** 接口集描述 */
  description?: string;
  /**
   * 可见性：PRIVATE-私有，TEAM-团队，PUBLIC-公开
   * @example "PRIVATE"
   */
  visibility?: VisibilityEnum;
  /** 服务器配置，遵循OpenAPI Server Object规范 */
  server?: OpenAPIV3_1.ServerObject;
  /** 安全配置，遵循OpenAPI Security Scheme Object规范 */
  security?: OpenAPIV3_1.SecuritySchemeObject;
}

/** 接口集详情 */
export interface ApiCollectionDetailVo extends TenantAuditingVo {
  /**
   * 接口集ID
   * @format int64
   */
  id?: string;
  /** 名称 */
  name?: string;
  /** 描述 */
  description?: string;
  /** 来源 */
  source?: ApiCollectionSourceEnum;
  /** 来源图标 */
  sourceIcon?: string;
  /** 可见性 */
  visibility?: VisibilityEnum;
  /** 是否配置了服务器 */
  hasServerConfig?: boolean;
  /** 服务器配置 */
  server?: OpenAPIV3_1.ServerObject;
  /** 是否配置了安全认证 */
  hasSecurityConfig?: boolean;
  /** 安全认证配置 */
  security?: OpenAPIV3_1.SecuritySchemeObject;
  /**
   * 端点总数
   * @format int64
   */
  endpointsCount?: number;
  /**
   * 已启用的接口数
   * @format int64
   */
  enabledEndpointsCount?: number;
}

/** The API response result of supporting international message. */
export type ApiCollectionDetailResult = ApiLocaleResult & {
  /** Actual response data or error details. */
  data?: ApiCollectionDetailVo;
};

/** 创建接口端点请求参数 */
export interface ApiEndpointCreateDto {
  /** 端点名称 */
  name: string;
  /** HTTP方法：GET、POST、PUT、DELETE、PATCH等 */
  method: HttpMethodEnum;
  /**
   * 接口路径，不包含查询参数
   * @example "/v1/chat/completions"
   */
  path: string;
  /** 端点描述 */
  description?: string;
  /** 操作标识符，用于OpenAPI规范解析的唯一标识 */
  operationId?: string;
  /** 标签列表，用于分类和筛选 */
  tags?: string[];
  /** 请求参数列表，遵循OpenAPI Parameter Object规范 */
  parameters?: OpenAPIV3_1.ParameterObject[];
  /** 请求体配置，遵循OpenAPI Request Body Object规范 */
  requestBody?: OpenAPIV3_1.RequestBodyObject;
  /** 响应配置映射，键为HTTP状态码，值为响应对象，遵循OpenAPI Response Object规范 */
  responses?: OpenAPIV3_1.ResponsesObject;
}

/** 测试接口端点请求参数 */
export interface ApiEndpointTestDto {
  /**
   * HTTP方法：GET、POST、PUT、DELETE、PATCH等
   * @example "GET"
   */
  method: HttpMethodEnum;
  /** 服务器配置，包含API连接和部署信息，遵循OpenAPI Server Object规范 */
  server: OpenAPIV3_1.ServerObject;
  /**
   * 接口路径，不包含查询参数，用于资源标识
   * @example "/comm/api/v1/country/{id}"
   */
  endpoint?: string;
  /**
   * 请求超时时间（毫秒），范围：1-300000
   * @format int32
   * @example 30000
   */
  timeout?: number;
  /** 请求参数列表，遵循OpenAPI Parameter Object规范 */
  parameters?: OpenAPIV3_1.ParameterObject[];
  /** 请求体配置，遵循OpenAPI Request Body Object规范 */
  requestBody?: OpenAPIV3_1.RequestBodyObject;
}

/** 接口端点测试结果 */
export interface ApiEndpointTestVo {
  /** 是否成功 */
  success?: boolean;
  /**
   * 状态码
   * @format int32
   */
  statusCode?: number;
  /**
   * 响应时间（毫秒）
   * @format int64
   */
  responseTime?: number;
  /** 响应头 */
  responseHeaders?: Record<string, string>;
  /** 响应体 */
  responseBody?: string;
  /** 错误信息 */
  error?: string;
}

/** The API response result of supporting international message. */
export type ApiEndpointTestResult = ApiLocaleResult & {
  /** Actual response data or error details. */
  data?: ApiEndpointTestVo;
};

/** 导入接口集请求参数 */
export interface ApiCollectionImportDto {
  /**
   * 上传的接口内容，和接口文件必须指定其中一个，大小不超过20MB
   */
  content: string;
  /**
   * 上传接口文件，和接口内容必须指定其中一个，大小不超过20MB
   * @format binary
   */
  file: File;
  /** 文件类型 */
  type: ApiCollectionImportTypeEnum;
  /** 自定义名称（不填则使用文件中的名称） */
  name?: string;
  /** 可见性 */
  visibility?: VisibilityEnum;
  /** 导入策略 */
  importStrategy?: ImportStrategyDto;
}

/** 导入策略 */
export interface ImportStrategyDto {
  /**
   * 冲突处理策略：OVERWRITE-覆盖现有接口，IGNORE-跳过重复接口，MERGE-合并配置
   * @example "IGNORE"
   */
  conflictStrategy?: ConflictStrategyEnum;
  // /**
  //  * 是否导入安全配置
  //  * @example true
  //  */
  // importSecurity?: boolean;
  // /**
  //  * 是否导入服务器配置
  //  * @example true
  //  */
  // importServers?: boolean;
  // /**
  //  * 是否导入标签
  //  * @example true
  //  */
  // importTags?: boolean;
  /**
   * 默认启用所有接口
   * @example false
   */
  enableByDefault?: boolean;
}

/** 更新接口集请求参数 */
export interface ApiCollectionUpdateDto {
  /** 接口集名称 */
  name?: string;
  /** 接口集描述 */
  description?: string;
  /** 可见性：PRIVATE-私有，TEAM-团队，PUBLIC-公开 */
  visibility?: VisibilityEnum;
  /** 服务器配置，遵循OpenAPI Server Object规范 */
  server?: OpenAPIV3_1.ServerObject;
  /** 安全配置，遵循OpenAPI Security Scheme Object规范 */
  security?: OpenAPIV3_1.SecuritySchemeObject;
}

/** 接口集列表项 */
export interface ApiCollectionListVo extends TenantAuditingVo {
  /**
   * 接口集ID
   * @format int64
   */
  id?: string;
  /** 名称 */
  name?: string;
  /** 描述 */
  description?: string;
  /** 来源 */
  source?: ApiCollectionSourceEnum;
  /** 来源图标 */
  sourceIcon?: string;
  /**
   * 端点总数
   * @format int64
   */
  endpointsCount?: number;
  /**
   * 已启用的接口数
   * @format int64
   */
  enabledEndpointsCount?: number;
  /** 可见性 */
  visibility?: VisibilityEnum;
  /** 是否配置了服务器 */
  hasServerConfig?: boolean;
  /** 是否配置了安全认证 */
  hasSecurityConfig?: boolean;
}

export interface PageApiCollectionListVo {
  /**
   * Total number
   * @format int64
   * @example 10
   */
  total?: number;
  /** Page data */
  list?: ApiCollectionListVo[];
}

/** The API response result of supporting international message. */
export type ApiCollectionListResult = ApiLocaleResult & {
  /** Actual response data or error details. */
  data?: PageApiCollectionListVo;
};

/** 更新接口端点请求参数 */
export interface ApiEndpointUpdateDto {
  /** 端点名称 */
  name: string;
  /** 端点描述 */
  description?: string;
  /** 标签列表，用于分类和筛选 */
  tags?: string[];
  /** 请求参数列表，遵循OpenAPI Parameter Object规范 */
  parameters?: OpenAPIV3_1.ParameterObject[];
  /** 请求体配置，遵循OpenAPI Request Body Object规范 */
  requestBody?: OpenAPIV3_1.RequestBodyObject;
  /** 响应配置映射，键为HTTP状态码，值为响应对象，遵循OpenAPI Response Object规范 */
  responses?: OpenAPIV3_1.ResponsesObject;
}

/** 接口端点详情 */
export interface ApiEndpointVo extends TenantAuditingVo {
  /**
   * 端点ID
   * @format int64
   */
  id?: string;
  /**
   * 接口集ID
   * @format int64
   */
  collectionId?: string;
  /** 端点名称 */
  name?: string;
  /** HTTP方法 */
  method?: HttpMethodEnum;
  /** 路径 */
  path?: string;
  /** 操作标识符，用于OpenAPI规范解析的唯一标识 */
  operationId?: string;
  /** 描述 */
  description?: string;
  /** 标签 */
  tags?: string[];
  /** 是否启用 */
  enabled?: boolean;
}

/** The API response result of supporting international message. */
export type ApiEndpointResult = ApiLocaleResult & {
  /** Actual response data or error details. */
  data?: ApiEndpointVo;
};

export interface PageResultApiEndpointVo {
  /**
   * Total number
   * @format int64
   * @example 10
   */
  total?: number;
  /** Page data */
  list?: ApiEndpointVo[];
}

/** The API response result of supporting international message. */
export type ResultApiEndpointVo = ApiLocaleResult & {
  /** Actual response data or error details. */
  data?: PageResultApiEndpointVo;
};

/** 接口端点详情 */
export interface ApiEndpointDetailVo extends TenantAuditingVo {
  /**
   * 端点ID
   * @format int64
   */
  id?: string;
  /**
   * 接口集ID
   * @format int64
   */
  collectionId?: string;
  /** 端点名称 */
  name?: string;
  /** HTTP方法 */
  method?: HttpMethodEnum;
  /** 路径 */
  path?: string;
  /** 描述 */
  description?: string;
  /** 标签 */
  tags?: string[];
  /** 是否启用 */
  enabled?: boolean;
  /** 操作标识符，用于OpenAPI规范解析的唯一标识 */
  operationId?: string;
  /** 请求参数列表，遵循OpenAPI Parameter Object规范 */
  parameters?: OpenAPIV3_1.ParameterObject[];
  /** 请求体配置，遵循OpenAPI Request Body Object规范 */
  requestBody?: OpenAPIV3_1.RequestBodyObject;
  /** 响应配置映射，键为HTTP状态码，值为响应对象，遵循OpenAPI Response Object规范 */
  responses?: OpenAPIV3_1.ResponsesObject;
}

/** The API response result of supporting international message. */
export type ApiEndpointDetailResult = ApiLocaleResult & {
  /** Actual response data or error details. */
  data?: ApiEndpointDetailVo;
};

/**
 * 总体统计
 */
export interface ApiCollectionOverview {
  /**
   * 接口集总数
   */
  apiCollectionCount: number;
  /**
   * 接口总数
   */
  apiTotalCount: number;
  /**
   * 已启用接口总数
   */
  enabledApiCount: number;
  /**
   * 总调用次数
   */
  totalCallCount: number;
  /**
   * 今日调用次数
   */
  todayCallCount: number;
}

/**
 * 使用率排行
 */
export interface ApiCollectionTopStore {
  /**
   * 端点ID
   */
  id: string;
  /**
   * 端点名称
   */
  name: string;
  /**
   * 请求方式
   */
  type: HttpMethodEnum;
  /**
   * 调用次数
   */
  callCount: number;
  /**
   * 平均响应时间（毫秒）
   */
  avgResponseTime: number;
}

/**
 * 性能趋势
 */
export interface ApiCollectionPerformanceTrend {
  /**
   * 时间戳
   */
  timestamp: number;
  /**
   * 日期
   */
  date: string;
  /**
   * 总调用次数
   */
  totalCalls: number;
  /**
   * 平均响应时间（毫秒）
   */
  avgResponseTime: number;
  /**
   * 错误数
   */
  errors: number;
  /**
   * 错误率（百分比）
   */
  errorRate: number;
}

/** 向量存储源统计信息 */
export interface ApiCollectionStatisticsVo {
  /** 总体统计 */
  overview?: ApiCollectionOverview;
  /** 近一月趋势 */
  lastMonthGrowthTrend?: ApiCollectionOverview;
  /** 使用率排行 */
  topStores?: ApiCollectionTopStore[];
  /** 性能趋势 */
  performanceTrend?: ApiCollectionPerformanceTrend[];
}

/** The API response result of supporting international message. */
export type ApiCollectionStatisticsResult = ApiLocaleResult & {
  /** Actual response data or error details. */
  data?: ApiCollectionStatisticsVo;
};

/** 排序字段 */
export enum ApiCollectionListParamsOrderByEnum {
  Id = 'id',
  Name = 'name',
  CreatedDate = 'createdDate',
  Source = 'source',
  Visibility = 'visibility',
}

/** 排序字段 */
export enum ApiEndpointListParamsOrderByEnum {
  Id = 'id',
  Name = 'name',
  Method = 'method',
  CreatedDate = 'createdDate',
}
