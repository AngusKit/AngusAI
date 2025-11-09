import { ApiLocaleResult, TenantAuditingVo } from '@xcan-angus/infra';
import { DatasetDataStatusEnum, DatasetDataTypeEnum, SyncDataStatusEnum } from '@/enums/enums.ts';

/** 数据集数据列表项响应 */
export interface DatasetDataListVo extends TenantAuditingVo {
  /**
   * 数据ID
   * @format int64
   */
  id?: string;
  /** 数据集数据名称 */
  name?: string;
  /** 数据类型 */
  type?: DatasetDataTypeEnum;
  /** 状态 */
  status?: DatasetDataStatusEnum;
  /**
   * 数据记录数
   * @format int64
   */
  dataCount?: number;
  /** 数据大小 */
  dataSize?: string;
}

/** 同步结果响应 */
export interface SyncDataVo {
  /** 同步文件名或表名 */
  name?: string;
  /** 同步状态 */
  status?: SyncDataStatusEnum;
  /** 失败原因 */
  failedReason?: string;
}

/** The API response result of supporting international message. */
export type ListSyncDataResult = ApiLocaleResult & {
  /** Actual response data or error details. */
  data?: SyncDataVo[];
};

/** 批量删除数据数据集数据参数 */
export interface DatasetDataBatchDeleteDto {
  /** 数据名称（文件名或表名） */
  names?: string[];
}

export interface PageDatasetDataListVo {
  /**
   * Total number
   * @format int64
   * @example 10
   */
  total?: number;
  /** Page data */
  list?: DatasetDataListVo[];
}

/** The API response result of supporting international message. */
export type PageDatasetDataListResult = ApiLocaleResult & {
  /** Actual response data or error details. */
  data?: PageDatasetDataListVo;
};

/**
 * 排序字段
 * @example "modifiedDate"
 */
export enum GetDatasetDataListOrderByEnum {
  Name = 'name',
  Type = 'type',
  Size = 'size',
  CreatedDate = 'createdDate',
  ModifiedDate = 'modifiedDate',
}
