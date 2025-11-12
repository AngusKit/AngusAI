import { DatasetListVo, DatasourceTableDataPreviewVo } from '@/services/DatasetsTypes';
import {DatasetDataListVo} from '@/services/DatasetsDataTypes.ts';
import { DatasetTypeEnum, DatasetDataTypeEnum, DatasetDataStatusEnum, VisibilityEnum } from '@/enums/enums';
import { DATASET_TYPE_DISPLAY_MAP, VISIBILITY_DISPLAY_MAP, DATA_TYPE_DISPLAY_MAP, DATA_TYPE_ICON_MAP, DATA_STATUS_DISPLAY_MAP, DATA_STATUS_COLOR_MAP, DATA_TYPE_COLOR_MAP, } from './constants';

/** 数据集项接口 */
export interface DatasetItem {
  id: string;
  name: string;
  description: string;
  icon: string;
  iconBg: string;
  type: '文件' | '数据源'; // TODO 使用枚举值代替
  dataCount: string;
  size: string;
  status: '已启用' | '禁用'; // TODO 使用枚举值代替
  statusColor: string;
  enabled: boolean;
  visibility?: string;
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
  status: '已处理' | '处理中' | '待处理'; // TODO 使用枚举值代替
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
  const typeMap: Record<DatasetTypeEnum, '文件' | '数据源'> = { // TODO 使用枚举message代替
    [DatasetTypeEnum.FILE]: '文件',
    [DatasetTypeEnum.DATASOURCE]: '数据源',
  };

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
    type: typeMap[vo.type || DatasetTypeEnum.FILE] || '文件', // TODO 漏了
    dataCount,
    size,
    status: vo.enabled ? '已启用' : '禁用', // TODO 漏了
    statusColor: vo.enabled // TODO 使用全局定义的启用和禁用状态message
      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
      : 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400',
    enabled: vo.enabled || false,
    visibility: vo.visibility ? VISIBILITY_DISPLAY_MAP[vo.visibility] : 'private',
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
  const stringToEnumMap: Record<string, DatasetDataTypeEnum> = {
    CSV: DatasetDataTypeEnum.CSV,
    JSON: DatasetDataTypeEnum.JSON,
    EXCEL: DatasetDataTypeEnum.EXCEL,
    XML: DatasetDataTypeEnum.XML,
    TABLE: DatasetDataTypeEnum.TABLE,
  };

  // TODO 使用枚举message代替
  const statusMap: Record<string, '已处理' | '处理中' | '待处理'> = {
    [DatasetDataStatusEnum.COMPLETED]: '已处理',
    [DatasetDataStatusEnum.PROCESSING]: '处理中',
    [DatasetDataStatusEnum.PENDING]: '待处理',
    [DatasetDataStatusEnum.FAILED]: '待处理', // 失败状态也显示为待处理
  };

  // TODO 使用枚举值代替
  const typeEnum = stringToEnumMap[vo.type || 'CSV'] || DatasetDataTypeEnum.CSV;
  const typeDisplay = DATA_TYPE_DISPLAY_MAP[typeEnum];
  const status = statusMap[vo.status || DatasetDataStatusEnum.PENDING] || '待处理'; // TODO 使用枚举值代替

  return {
    id: vo.id ? String(vo.id) : '',
    name: vo.name || '',
    type: typeEnum,
    typeDisplay,
    typeColor: DATA_TYPE_COLOR_MAP[typeEnum],
    typeIcon: DATA_TYPE_ICON_MAP[typeEnum] || '📄',
    size: vo.dataSize || '0 MB',
    status,
    statusColor: DATA_STATUS_COLOR_MAP[status] || DATA_STATUS_COLOR_MAP['待处理'],
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
