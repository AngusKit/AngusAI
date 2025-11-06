import {
  ApiLocaleResultConnectionTestVo,
  ApiLocaleResultPageResultVectorStoreVo,
  ApiLocaleResultVectorStoreStatisticsVo,
  ApiLocaleResultVectorStoreVo,
  ApiResultObject,
  ConnectionTestDto,
  VectorStoreCreateDto,
  VectorStoreListParamsFilters0OpEnum,
  VectorStoreListParamsFilters1OpEnum,
  VectorStoreListParamsInfoScopeEnum,
  VectorStoreListParamsOrderByEnum,
  VectorStoreListParamsOrderSortEnum,
  VectorStoreListParamsStatusEnum,
  VectorStoreListParamsTypeEnum,
  VectorStoreUpdateDto,
} from "./DataContracts";
import { ContentType, HttpClient, RequestParams } from "./HttpClient";

export class VectorStores<SecurityDataType = unknown> {
  http: HttpClient<SecurityDataType>;

  constructor(http: HttpClient<SecurityDataType>) {
    this.http = http;
  }

  /**
   * @description 分页查询向量存储源列表，支持关键词搜索、类型筛选、状态筛选等
   *
   * @tags VectorStore
   * @name VectorStoreList
   * @summary 获取存储源列表
   * @request GET:/api/v1/vector-stores
   * @secure
   */
  vectorStoreList = (
    query?: {
      /** 数据库类型筛选 */
      type?: VectorStoreListParamsTypeEnum;
      /** 状态筛选 */
      status?: VectorStoreListParamsStatusEnum;
      /** 启用状态筛选 */
      enabled?: boolean;
      /** 排序字段 */
      orderBy?: VectorStoreListParamsOrderByEnum;
      /**
       * Page number for paginated data (default: 1)
       * @format int32
       * @min 1
       * @max 100000
       */
      pageNo?: number;
      /**
       * Number of items per page (default: 10)
       * @format int32
       * @min 1
       * @max 2000
       */
      pageSize?: number;
      /** Specifies the direction of the sorting (ascending or descending) */
      orderSort?: VectorStoreListParamsOrderSortEnum;
      /** Scope of information to query (BASIC or DETAIL). Interface performance optimization parameters, only valid for some interfaces */
      infoScope?: VectorStoreListParamsInfoScopeEnum;
      /** Whether to use full-text search (default: false, uses DB index search if false) */
      fullTextSearch?: boolean;
      /** Search keyword */
      keyword?: string;
      /**
       * Tenant ID to which this belongs
       * @format int64
       * @example 1
       */
      tenantId?: number;
      /**
       * ID of the creator
       * @format int64
       * @example 1
       */
      createdBy?: number;
      /**
       * Creation date
       * @format date-time
       * @example "2024-10-12 00:00:00"
       */
      createdDate?: string;
      /**
       * ID of the last modifier
       * @format int64
       * @example 1
       */
      modifiedBy?: number;
      /**
       * Last modification date
       * @format date-time
       * @example "2024-10-12 00:00:00"
       */
      modifiedDate?: string;
      /** Customize the filter parameter name. Note: The parameter name must be a whitelist parameter */
      "filters[0].key"?: string;
      /** Customize the filter condition (EQUAL, NOT_EQUAL, GREATER_THAN, etc.) */
      "filters[0].op"?: VectorStoreListParamsFilters0OpEnum;
      /** Customize the filter value */
      "filters[0].value"?: any;
      /** Customize the filter parameter name. Note: The parameter name must be a whitelist parameter */
      "filters[1].key"?: string;
      /** Customize the filter condition (EQUAL, NOT_EQUAL, GREATER_THAN, etc.) */
      "filters[1].op"?: VectorStoreListParamsFilters1OpEnum;
      /** Customize the filter value */
      "filters[1].value"?: any;
    },
    params: RequestParams = {},
  ) =>
    this.http.request<ApiLocaleResultPageResultVectorStoreVo, ApiResultObject>({
      path: `/api/v1/vector-stores`,
      method: "GET",
      query: query,
      secure: true,
      ...params,
    });
  /**
   * @description 创建新的向量存储源配置
   *
   * @tags VectorStore
   * @name VectorStoreCreate
   * @summary 创建存储源
   * @request POST:/api/v1/vector-stores
   * @secure
   */
  vectorStoreCreate = (
    data: VectorStoreCreateDto,
    params: RequestParams = {},
  ) =>
    this.http.request<ApiResultObject, ApiResultObject>({
      path: `/api/v1/vector-stores`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description 测试向量存储源的连接状态
   *
   * @tags VectorStore
   * @name VectorStoreTestConnection
   * @summary 连接测试
   * @request POST:/api/v1/vector-stores/test
   * @secure
   */
  vectorStoreTestConnection = (
    query: {
      /**
       * 存储源ID
       * @format int64
       */
      id: number;
    },
    data: ConnectionTestDto,
    params: RequestParams = {},
  ) =>
    this.http.request<ApiLocaleResultConnectionTestVo, ApiResultObject>({
      path: `/api/v1/vector-stores/test`,
      method: "POST",
      query: query,
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description 根据ID获取向量存储源的详细信息
   *
   * @tags VectorStore
   * @name VectorStoreGetDetail
   * @summary 获取存储源详情
   * @request GET:/api/v1/vector-stores/{id}
   * @secure
   */
  vectorStoreGetDetail = (id: number, params: RequestParams = {}) =>
    this.http.request<ApiLocaleResultVectorStoreVo, ApiResultObject>({
      path: `/api/v1/vector-stores/${id}`,
      method: "GET",
      secure: true,
      ...params,
    });
  /**
   * @description 删除向量存储源配置，如果被引用需要force=true才能删除
   *
   * @tags VectorStore
   * @name VectorStoreDelete
   * @summary 删除存储源
   * @request DELETE:/api/v1/vector-stores/{id}
   * @secure
   */
  vectorStoreDelete = (
    id: number,
    query?: {
      /** 强制删除（即使被引用） */
      force?: boolean;
    },
    params: RequestParams = {},
  ) =>
    this.http.request<ApiResultObject, ApiResultObject>({
      path: `/api/v1/vector-stores/${id}`,
      method: "DELETE",
      query: query,
      secure: true,
      ...params,
    });
  /**
   * @description 更新向量存储源配置，更新endpoint或config后状态会重置为disconnected
   *
   * @tags VectorStore
   * @name VectorStoreUpdate
   * @summary 更新存储源
   * @request PATCH:/api/v1/vector-stores/{id}
   * @secure
   */
  vectorStoreUpdate = (
    id: number,
    data: VectorStoreUpdateDto,
    params: RequestParams = {},
  ) =>
    this.http.request<ApiLocaleResultVectorStoreVo, ApiResultObject>({
      path: `/api/v1/vector-stores/${id}`,
      method: "PATCH",
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description 启用或禁用存储源
   *
   * @tags VectorStore
   * @name VectorStoreToggleEnabled
   * @summary 切换启用状态
   * @request PATCH:/api/v1/vector-stores/{id}/toggle
   * @secure
   */
  vectorStoreToggleEnabled = (
    id: number,
    query: {
      /** 目标状态 */
      enabled: boolean;
    },
    params: RequestParams = {},
  ) =>
    this.http.request<ApiLocaleResultVectorStoreVo, ApiResultObject>({
      path: `/api/v1/vector-stores/${id}/toggle`,
      method: "PATCH",
      query: query,
      secure: true,
      ...params,
    });
  /**
   * @description 获取向量存储源的统计数据，包括总体统计、类型分布、使用率排行、性能趋势等
   *
   * @tags VectorStore
   * @name VectorStoreGetStatistics
   * @summary 获取统计信息
   * @request GET:/api/v1/vector-stores/statistics
   * @secure
   */
  vectorStoreGetStatistics = (
    query?: {
      /**
       * 统计开始日期，可选，格式: yyyy-MM-dd 或 yyyy-MM-dd HH:mm:ss
       * @example "2024-11-01"
       */
      startDate?: string;
      /**
       * 统计结束日期，可选，格式: yyyy-MM-dd 或 yyyy-MM-dd HH:mm:ss
       * @example "2024-11-30"
       */
      endDate?: string;
    },
    params: RequestParams = {},
  ) =>
    this.http.request<ApiLocaleResultVectorStoreStatisticsVo, ApiResultObject>({
      path: `/api/v1/vector-stores/statistics`,
      method: "GET",
      query: query,
      secure: true,
      ...params,
    });
}
