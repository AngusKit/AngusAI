import { ApiLocaleResult, PageQuery, AI } from '@xcan-angus/infra';
import { DatasetCreateDto, DatasetDetailResult, DatasetStatisticsResult, DatasetToggleDto, DatasetUpdateDto, DatasourceConnectionTestDto, DatasourceConnectionTestResult, DatasourceTableDataPreviewResult, DataSourceUpdateDto, GetDatasetListOrderByEnum, PageDatasetListResult, } from './DatasetsTypes.ts';
import http, { ContentType, HttpClient, RequestParams } from './HttpClient.ts';
import { DatasetTypeEnum, VisibilityEnum } from '@/enums/enums.ts';
import { KnowledgeBaseDetailResult } from '@/services/KnowledgeBasesTypes.ts';

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
    id: string,
    query: {
      /** 可见性 */
      visibility: VisibilityEnum;
    },
    params: RequestParams = {}
  ) =>
    this.http.request<DatasetDetailResult, ApiLocaleResult>({
      path: `${AI}/datasets/${id}/visibility`,
      method: 'PUT',
      query: query,
      secure: true,
      ...params,
    });
  /**
   * @description 切换数据集的启用状态
   *
   * @tags KnowledgeBase
   * @name toggleDatasetStatus
   * @summary 切换数据集状态
   * @request PUT:/api/v1/datasets/{id}/toggle
   * @secure
   */
  toggleDatasetStatus = (id: string, data: DatasetToggleDto, params: RequestParams = {}) =>
    this.http.request<KnowledgeBaseDetailResult, ApiLocaleResult>({
      path: `${AI}/datasets/${id}/toggle`,
      method: 'PUT',
      body: data,
      secure: true,
      type: ContentType.Json,
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
  modifyDataSource = (id: string, data: DataSourceUpdateDto, params: RequestParams = {}) =>
    this.http.request<ApiLocaleResult, ApiLocaleResult>({
      path: `${AI}/datasets/${id}/datasource`,
      method: 'PUT',
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
  deleteDataSource = (id: string, params: RequestParams = {}) =>
    this.http.request<ApiLocaleResult, ApiLocaleResult>({
      path: `${AI}/datasets/${id}/datasource`,
      method: 'DELETE',
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
      id?: string;
      /** 数据集名称 */
      name?: string;
      /** 数据集类型 */
      type?: DatasetTypeEnum;
      /** 可见性 */
      visibility?: VisibilityEnum;
      /** 标签筛选 */
      tags?: string;
      /**
       * 排序字段
       * @example "modifiedDate"
       */
      orderBy?: GetDatasetListOrderByEnum;
    },
    params: RequestParams = {}
  ) =>
    this.http.request<PageDatasetListResult, ApiLocaleResult>({
      path: `${AI}/datasets`,
      method: 'GET',
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
      path: `${AI}/datasets`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
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
  testDataSourceConnection = (data: DatasourceConnectionTestDto, params: RequestParams = {}) =>
    this.http.request<DatasourceConnectionTestResult, ApiLocaleResult>({
      path: `${AI}/datasets/datasource/test`,
      method: 'POST',
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
  getDatasetDetail = (id: string, params: RequestParams = {}) =>
    this.http.request<DatasetDetailResult, ApiLocaleResult>({
      path: `${AI}/datasets/${id}`,
      method: 'GET',
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
  deleteDataset = (id: string, params: RequestParams = {}) =>
    this.http.request<ApiLocaleResult, ApiLocaleResult>({
      path: `${AI}/datasets/${id}`,
      method: 'DELETE',
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
  updateDataset = (id: string, data: DatasetUpdateDto, params: RequestParams = {}) =>
    this.http.request<DatasetDetailResult, ApiLocaleResult>({
      path: `${AI}/datasets/${id}`,
      method: 'PATCH',
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
    id: string,
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
    params: RequestParams = {}
  ) =>
    this.http.request<DatasourceTableDataPreviewResult, ApiLocaleResult>({
      path: `${AI}/datasets/${id}/datasource/preview`,
      method: 'GET',
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
    params: RequestParams = {}
  ) =>
    this.http.request<DatasetStatisticsResult, ApiLocaleResult>({
      path: `${AI}/datasets/statistics`,
      method: 'GET',
      query: query,
      secure: true,
      ...params,
    });
}

export default new Datasets(http);
