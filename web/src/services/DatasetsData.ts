import { ApiLocaleResult, PageQuery } from '@xcan-angus/infra';
import { DatasetDataBatchDeleteDto, ListSyncDataResult, PageDatasetDataListResult, GetDatasetDataListOrderByEnum, } from './DatasetsDataTypes.ts';
import http, { ContentType, HttpClient, RequestParams } from './HttpClient.ts';
import { DatasetDataStatusEnum, DatasetDataTypeEnum } from '@/enums/enums.ts';
import { AI } from '@xcan-angus/infra';

export class DatasetsData<SecurityDataType = unknown> {
  http: HttpClient<SecurityDataType>;

  constructor(http: HttpClient<SecurityDataType>) {
    this.http = http;
  }

  /**
   * @description 上传数据文件到指定数据集
   *
   * @tags Dataset
   * @name uploadDatasetFile
   * @summary 上传数据集文件
   * @request POST:/api/v1/datasets/{id}/data/upload
   * @secure
   */
  uploadDatasetFile = (
    id: string,
    query: {
      /** 文件列表 */
      file: File;
    },
    params: RequestParams = {}
  ) =>
    this.http.request<ApiLocaleResult, ApiLocaleResult>({
      path: `${AI}/datasets/${id}/data/upload`,
      method: 'POST',
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
    id: string,
    query?: {
      /** 同步文件或表名 */
      dataIds?: string[];
    },
    params: RequestParams = {}
  ) =>
    this.http.request<ListSyncDataResult, ApiLocaleResult>({
      path: `${AI}/datasets/${id}/data/sync`,
      method: 'POST',
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
    id: string,
    query?: PageQuery & {
      /** 数据名称（文件名或表名） */
      name?: string;
      /** 数据类型筛选 */
      type?: DatasetDataTypeEnum;
      /** 数据处理状态筛选 */
      status?: DatasetDataStatusEnum;
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
    params: RequestParams = {}
  ) =>
    this.http.request<PageDatasetDataListResult, ApiLocaleResult>({
      path: `${AI}/datasets/${id}/data`,
      method: 'GET',
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
    id: string,
    query?: {
      /** 同步文件或表名 */
      dataIds?: string[];
    },
    params: RequestParams = {}
  ) =>
    this.http.request<void, ApiLocaleResult>({
      path: `${AI}/datasets/${id}/data/batch-delete`,
      method: 'DELETE',
      query: query,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
}

export default new DatasetsData(http);
