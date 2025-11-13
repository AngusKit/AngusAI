import { DatasetListVo } from '@/services/DatasetsTypes';
import {DatasetDataListVo} from '@/services/DatasetsDataTypes.ts';
import { getEnumDescription } from '@/enums/utils';
import { DatasetTypeEnum, DatasetDataTypeEnum, DatasetDataStatusEnum, VisibilityEnum, EnabledStatusEnum } from '@/enums/enums';
import { DATA_TYPE_ICON_MAP, DATA_STATUS_COLOR_MAP, DATA_TYPE_COLOR_MAP } from './constants';
import { DATASET_STATUS_COLORS } from '@/utils/PagesUtils';

/** 数据集项接口 */
export interface DatasetItem {
  id: string;
  name: string;
  description: string;
  icon: string;
  iconBg: string;
  type: string; 
  dataCount: string;
  size: string;
  status: string; 
  statusColor: string;
  enabled: boolean;
  visibility?: VisibilityEnum;
  modifiedDate: string;
  createdDate: string;
  creator: string;
  tags?: string[];
}

/** 数据文件项接口 */
export interface DataFileItem {
  id: string;
  name: string;
  type: DatasetDataTypeEnum;
  typeDisplay: string;
  typeColor: string;
  typeIcon: string;
  size: string;
  status: string;
  statusColor: string;
  modifiedDate: string;
  recordCount: string;
  filePath?: string;
}

/** 数据库表项接口 */
export interface DatabaseTable {
  id: string;
  tableName: string;
  rowCount: string;
  size: string;
  modifiedDate: string;
  description?: string;
}

/**
 * 将 DatasetListVo 转换为 DatasetItem
 */
export function convertDatasetVoToItem(vo: DatasetListVo): DatasetItem {

  const dataCount = vo.dataStatistics?.totalFilesOrTables ? String(vo.dataStatistics.totalFilesOrTables) : '0';
  const size = vo.dataStatistics?.totalRecordsSize || '0 条'; // TODO  国际化漏了
  const createdDate = vo.createdDate || '';
  const modifiedDate = vo.modifiedDate || '';
  const creator = vo.creator ? vo.creator : '';

  return {
    id: vo.id ? vo.id : '',
    name: vo.name || '',
    description: vo.description || '',
    icon: vo.icon || '📊',
    iconBg: vo.iconBg || 'bg-blue-50 dark:bg-blue-900/20',
    type: vo.type || DatasetTypeEnum.FILE,
    dataCount,
    size,
    status: vo.enabled
      ? getEnumDescription(EnabledStatusEnum, EnabledStatusEnum.ENABLED)
      : getEnumDescription(EnabledStatusEnum, EnabledStatusEnum.DISABLED),
    statusColor: vo.enabled
      ? DATASET_STATUS_COLORS[EnabledStatusEnum.ENABLED]
      : DATASET_STATUS_COLORS[EnabledStatusEnum.DISABLED],
    enabled: vo.enabled || false,
    visibility: vo.visibility || VisibilityEnum.PRIVATE,  
    modifiedDate,
    createdDate,
    creator,
    tags: vo.tags || [],
  };
}

/**
 * 将 DatasetDataListVo 转换为 DataFileItem
 */
export function convertDataListVoToFile(vo: DatasetDataListVo): DataFileItem {
  const typeEnum = vo.type || DatasetDataTypeEnum.CSV;
  const typeDisplay = getEnumDescription(DatasetDataTypeEnum, typeEnum);
  const status = vo.status || DatasetDataStatusEnum.PENDING;

  return {
    id: vo.id ? String(vo.id) : '',
    name: vo.name || '',
    type: typeEnum,
    typeDisplay,
    typeColor: DATA_TYPE_COLOR_MAP[typeEnum],
    typeIcon: DATA_TYPE_ICON_MAP[typeEnum] || '📄',
    size: vo.dataSize || '0 MB',
    status: getEnumDescription(DatasetDataStatusEnum, status),
    statusColor: DATA_STATUS_COLOR_MAP[status] || DATA_STATUS_COLOR_MAP[DatasetDataStatusEnum.PENDING],
    modifiedDate: vo.createdDate || '',
    recordCount: vo.dataCount ? vo.dataCount.toLocaleString() : '0',
    filePath: vo.filePath,
  };
}

/**
 * 将 DatasetDataListVo 转换为 DatabaseTable
 */
export function convertDataListVoToTable(vo: DatasetDataListVo): DatabaseTable {
  return {
    id: vo.id ? String(vo.id) : '',
    tableName: vo.name || '',
    rowCount: vo.dataCount ? vo.dataCount.toLocaleString() : '0',
    size: vo.dataSize || '0 MB',
    modifiedDate: vo.modifiedDate || '',
    description: vo.name || '',
  };
}

/**
 * 生成 JDBC URL
 */
export function generateJdbcUrl(
  dbType: string,
  host: string,
  port: string,
  database: string,
  jdbcUrlTemplate: string
): string {
  if (!host || !port || !database) return '';
  return jdbcUrlTemplate.replace('{host}', host).replace('{port}', port).replace('{database}', database);
}
