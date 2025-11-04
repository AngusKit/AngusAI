import { PageQuery, ApiLocaleResult } from '@xcan-angus/infra';
import {
  ApiLocaleResultDatasetDetailVo,
  ApiLocaleResultDatasetStatisticsVo,
  ApiLocaleResultDatasourceConnectionTestVo,
  ApiLocaleResultDatasourceTableDataPreviewVo,
  ApiLocaleResultListSyncDataVo,
  ApiLocaleResultPageResultDatasetDataListVo,
  ApiLocaleResultPageResultDatasetListVo,
  DatasetCreateDto,
  DatasetDataBatchDeleteDto,
  DatasetUpdateDto,
  DatasourceConnectionTestDto,
  DataSourceUpdateDto,
  GetDatasetDataListOrderByEnum,
  GetDatasetDataListParamsStatusEnum,
  GetDatasetDataListParamsTypeEnum,
  GetDatasetListOrderByEnum,
  GetDatasetListParamsTypeEnum,
  GetDatasetListParamsVisibilityEnum,
  ModifyDatasetVisibilityParamsVisibilityEnum,
} from "./data-contracts.ts";
import { ContentType, HttpClient, RequestParams } from "./http-client.ts";

export class Datasets<SecurityDataType = unknown> {
  http: HttpClient<SecurityDataType>;

  constructor(http: HttpClient<SecurityDataType>) {
    this.http = http;
  }

  /**
   * @description 修改数据集可见性
   *
   * @tags Dataset
   * @name ModifyDatasetVisibility
   * @summary 修改数据集可见性
   * @request PUT:/api/v1/datasets/{id}/visibility
   * @secure
   */
  modifyDatasetVisibility = (
    id: number,
    query: {
      /** 可见性 */
      visibility: ModifyDatasetVisibilityParamsVisibilityEnum;
    },
    params: RequestParams = {},
  ) =>
    this.http.request<ApiLocaleResultDatasetDetailVo, ApiLocaleResult>({
      path: `/api/v1/datasets/${id}/visibility`,
      method: "PUT",
      query: query,
      secure: true,
      ...params,
    });
  /**
   * @description 修改数据源配置
   *
   * @tags Dataset
   * @name ModifyDataSource
   * @summary 修改数据源
   * @request PUT:/api/v1/datasets/{id}/datasource
   * @secure
   */
  modifyDataSource = (
    id: number,
    data: DataSourceUpdateDto,
    params: RequestParams = {},
  ) =>
    this.http.request<ApiLocaleResult, ApiLocaleResult>({
      path: `/api/v1/datasets/${id}/datasource`,
      method: "PUT",
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description 删除数据源配置
   *
   * @tags Dataset
   * @name DeleteDataSource
   * @summary 删除数据源
   * @request DELETE:/api/v1/datasets/{id}/datasource
   * @secure
   */
  deleteDataSource = (id: number, params: RequestParams = {}) =>
    this.http.request<ApiLocaleResult, ApiLocaleResult>({
      path: `/api/v1/datasets/${id}/datasource`,
      method: "DELETE",
      secure: true,
      ...params,
    });
  /**
   * @description 获取当前用户的数据集列表
   *
   * @tags Dataset
   * @name GetDatasetList
   * @summary 获取数据集列表
   * @request GET:/api/v1/datasets
   * @secure
   */
  getDatasetList = (
    query?: PageQuery & {
      /**
       * 数据集ID
       * @format int64
       */
      id?: number;
      /** 数据集名称 */
      name?: string;
      /** 数据集类型 */
      type?: GetDatasetListParamsTypeEnum;
      /** 可见性 */
      visibility?: GetDatasetListParamsVisibilityEnum;
      /** 标签筛选 */
      tags?: string;
      /**
       * 排序字段
       * @example "modifiedDate"
       */
      orderBy?: GetDatasetListOrderByEnum;
    },
    params: RequestParams = {},
  ) =>
    this.http.request<ApiLocaleResultPageResultDatasetListVo, ApiLocaleResult>({
      path: `/api/v1/datasets`,
      method: "GET",
      query: query,
      secure: true,
      ...params,
    });
  /**
   * @description 创建新数据集
   *
   * @tags Dataset
   * @name CreateDataset
   * @summary 创建数据集
   * @request POST:/api/v1/datasets
   * @secure
   */
  createDataset = (data: DatasetCreateDto, params: RequestParams = {}) =>
    this.http.request<ApiLocaleResult, ApiLocaleResult>({
      path: `/api/v1/datasets`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description 上传数据文件到指定数据集
   *
   * @tags Dataset
   * @name UploadDatasetFiles
   * @summary 上传数据集文件
   * @request POST:/api/v1/datasets/{id}/data/upload
   * @secure
   */
  uploadDatasetFiles = (
    id: number,
    query: {
      /** 文件列表 */
      files: File[];
    },
    params: RequestParams = {},
  ) =>
    this.http.request<ApiLocaleResult, ApiLocaleResult>({
      path: `/api/v1/datasets/${id}/data/upload`,
      method: "POST",
      query: query,
      secure: true,
      ...params,
    });
  /**
   * @description 手动触发同步文件数据到数据库或同步表信息
   *
   * @tags Dataset
   * @name SyncDatasetData
   * @summary 同步数据集数据
   * @request POST:/api/v1/datasets/{id}/data/sync
   * @secure
   */
  syncDatasetData = (
    id: number,
    query?: {
      /** 同步文件或表名 */
      names?: string[];
    },
    params: RequestParams = {},
  ) =>
    this.http.request<ApiLocaleResultListSyncDataVo, ApiLocaleResult>({
      path: `/api/v1/datasets/${id}/data/sync`,
      method: "POST",
      query: query,
      secure: true,
      ...params,
    });
  /**
   * @description 测试数据源连接是否可用
   *
   * @tags Dataset
   * @name TestDataSourceConnection
   * @summary 测试数据源连接
   * @request POST:/api/v1/datasets/datasource/test
   * @secure
   */
  testDataSourceConnection = (
    data: DatasourceConnectionTestDto,
    params: RequestParams = {},
  ) =>
    this.http.request<
      ApiLocaleResultDatasourceConnectionTestVo,
      ApiLocaleResult
    >({
      path: `/api/v1/datasets/datasource/test`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description 获取指定数据集的详细信息
   *
   * @tags Dataset
   * @name GetDatasetDetail
   * @summary 获取数据集详情
   * @request GET:/api/v1/datasets/{id}
   * @secure
   */
  getDatasetDetail = (id: number, params: RequestParams = {}) =>
    this.http.request<ApiLocaleResultDatasetDetailVo, ApiLocaleResult>({
      path: `/api/v1/datasets/${id}`,
      method: "GET",
      secure: true,
      ...params,
    });
  /**
   * @description 删除指定数据集
   *
   * @tags Dataset
   * @name DeleteDataset
   * @summary 删除数据集
   * @request DELETE:/api/v1/datasets/{id}
   * @secure
   */
  deleteDataset = (id: number, params: RequestParams = {}) =>
    this.http.request<ApiLocaleResult, ApiLocaleResult>({
      path: `/api/v1/datasets/${id}`,
      method: "DELETE",
      secure: true,
      ...params,
    });
  /**
   * @description 更新数据集基本信息
   *
   * @tags Dataset
   * @name UpdateDataset
   * @summary 更新数据集
   * @request PATCH:/api/v1/datasets/{id}
   * @secure
   */
  updateDataset = (
    id: number,
    data: DatasetUpdateDto,
    params: RequestParams = {},
  ) =>
    this.http.request<ApiLocaleResultDatasetDetailVo, ApiLocaleResult>({
      path: `/api/v1/datasets/${id}`,
      method: "PATCH",
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description 预览数据集数据源数据
   *
   * @tags Dataset
   * @name PreviewDatasourceData
   * @summary 数据源数据预览
   * @request GET:/api/v1/datasets/{id}/datasource/preview
   * @secure
   */
  previewDatasourceData = (
    id: number,
    query: {
      /** 预览表名称 */
      tableName: string;
      /**
       * 页码
       * @format int32
       * @default 1
       */
      pageNo?: number;
      /**
       * 每页数量
       * @format int32
       * @default 10
       */
      pageSize?: number;
    },
    params: RequestParams = {},
  ) =>
    this.http.request<
      ApiLocaleResultDatasourceTableDataPreviewVo,
      ApiLocaleResult
    >({
      path: `/api/v1/datasets/${id}/datasource/preview`,
      method: "GET",
      query: query,
      secure: true,
      ...params,
    });
  /**
   * @description 获取数据集数据列表
   *
   * @tags Dataset
   * @name GetDatasetDataList
   * @summary 获取数据集数据列表
   * @request GET:/api/v1/datasets/{id}/data
   * @secure
   */
  getDatasetDataList = (
    id: number,
    query?: PageQuery & {
      /** 数据名称（文件名或表名） */
      name?: string;
      /** 数据类型筛选 */
      type?: GetDatasetDataListParamsTypeEnum;
      /** 数据处理状态筛选 */
      status?: GetDatasetDataListParamsStatusEnum;
      /**
       * 数据大小
       * @format int64
       */
      dataSize?: number;
      /**
       * 排序字段
       * @example "modifiedDate"
       */
      orderBy?: GetDatasetDataListOrderByEnum;
    },
    params: RequestParams = {},
  ) =>
    this.http.request<
      ApiLocaleResultPageResultDatasetDataListVo,
      ApiLocaleResult
    >({
      path: `/api/v1/datasets/${id}/data`,
      method: "GET",
      query: query,
      secure: true,
      ...params,
    });
  /**
   * @description 获取数据集模块的统计数据
   *
   * @tags Dataset
   * @name GetDatasetStatistics
   * @summary 获取数据集统计
   * @request GET:/api/v1/datasets/statistics
   * @secure
   */
  getDatasetStatistics = (
    query?: {
      /**
       * 数据集ID
       * @format int64
       */
      id?: number;
    },
    params: RequestParams = {},
  ) =>
    this.http.request<ApiLocaleResultDatasetStatisticsVo, ApiLocaleResult>({
      path: `/api/v1/datasets/statistics`,
      method: "GET",
      query: query,
      secure: true,
      ...params,
    });
  /**
   * @description 批量删除文件或表
   *
   * @tags Dataset
   * @name BatchDeleteData
   * @summary 批量删除数据
   * @request DELETE:/api/v1/datasets/{id}/data/batch-delete
   * @secure
   */
  batchDeleteData = (
    id: number,
    data: DatasetDataBatchDeleteDto,
    params: RequestParams = {},
  ) =>
    this.http.request<void, ApiLocaleResult>({
      path: `/api/v1/datasets/${id}/data/batch-delete`,
      method: "DELETE",
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
}
