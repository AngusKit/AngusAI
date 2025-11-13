import { DatasourceTypeEnum, DatasetDataTypeEnum, DatasetDataStatusEnum } from '@/enums/enums';

/** 数据库配置信息 */
export interface DatabaseConfig {
  name: string;
  defaultPort: string;
  icon: string;
  color: string;
  jdbcUrlTemplate: string;
  description: string;
  nameKey: string;
  descriptionKey: string;
}

/** 数据库配置映射 */
export const DATABASE_CONFIGS: Record<DatasourceTypeEnum, DatabaseConfig> = {
  [DatasourceTypeEnum.MySQL]: {
    name: 'MySQL',
    defaultPort: '3306',
    icon: '🐬',
    color: 'bg-blue-500',
    jdbcUrlTemplate: 'jdbc:mysql://{host}:{port}/{database}?useSSL=false&serverTimezone=UTC',
    description: 'MySQL 5.7+ / MariaDB',
    nameKey: 'dataset.datasource.databases.mysql.name',
    descriptionKey: 'dataset.datasource.databases.mysql.description',
  },
  [DatasourceTypeEnum.PostgreSQL]: {
    name: 'PostgreSQL',
    defaultPort: '5432',
    icon: '🐘',
    color: 'bg-indigo-500',
    jdbcUrlTemplate: 'jdbc:postgresql://{host}:{port}/{database}',
    description: 'PostgreSQL 9.6+',
    nameKey: 'dataset.datasource.databases.postgresql.name',
    descriptionKey: 'dataset.datasource.databases.postgresql.description',
  },
  [DatasourceTypeEnum.SQLServer]: {
    name: 'SQL Server',
    defaultPort: '1433',
    icon: '🔷',
    color: 'bg-red-500',
    jdbcUrlTemplate: 'jdbc:sqlserver://{host}:{port};databaseName={database}',
    description: 'Microsoft SQL Server 2012+',
    nameKey: 'dataset.datasource.databases.sqlserver.name',
    descriptionKey: 'dataset.datasource.databases.sqlserver.description',
  },
  [DatasourceTypeEnum.Oracle]: {
    name: 'Oracle',
    defaultPort: '1521',
    icon: '🔴',
    color: 'bg-orange-500',
    jdbcUrlTemplate: 'jdbc:oracle:thin:@{host}:{port}:{database}',
    description: 'Oracle Database 11g+',
    nameKey: 'dataset.datasource.databases.oracle.name',
    descriptionKey: 'dataset.datasource.databases.oracle.description',
  },
  [DatasourceTypeEnum.DB2]: {
    name: 'DB2',
    defaultPort: '50000',
    icon: '💾',
    color: 'bg-purple-500',
    jdbcUrlTemplate: 'jdbc:db2://{host}:{port}/{database}',
    description: 'IBM DB2 10.5+',
    nameKey: 'dataset.datasource.databases.db2.name',
    descriptionKey: 'dataset.datasource.databases.db2.description',
  },
  [DatasourceTypeEnum.DM]: {
    name: '达梦',
    defaultPort: '5236',
    icon: '🗄️',
    color: 'bg-cyan-500',
    jdbcUrlTemplate: 'jdbc:dm://{host}:{port}/{database}',
    description: 'DM Database 8.0+',
    nameKey: 'dataset.datasource.databases.dm.name',
    descriptionKey: 'dataset.datasource.databases.dm.description',
  },
};

/** 需要Schema的数据库类型 */ 
export const DATABASES_REQUIRING_SCHEMA: DatasourceTypeEnum[] = [DatasourceTypeEnum.PostgreSQL, DatasourceTypeEnum.SQLServer, DatasourceTypeEnum.Oracle, DatasourceTypeEnum.DB2, DatasourceTypeEnum.DM];


/** 数据类型图标映射 */
export const DATA_TYPE_ICON_MAP: Record<DatasetDataTypeEnum, string> = {
  [DatasetDataTypeEnum.CSV]: '📊',
  [DatasetDataTypeEnum.JSON]: '📝',
  [DatasetDataTypeEnum.EXCEL]: '📈',
  [DatasetDataTypeEnum.XML]: '📄',
  [DatasetDataTypeEnum.TABLE]: '📋',
};

/** 数据状态颜色映射 */
export const DATA_STATUS_COLOR_MAP: Record<DatasetDataStatusEnum, string> = {
  [DatasetDataStatusEnum.COMPLETED]: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  [DatasetDataStatusEnum.PROCESSING]: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  [DatasetDataStatusEnum.PENDING]: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400',
  [DatasetDataStatusEnum.FAILED]: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

/** 数据类型颜色映射 */
export const DATA_TYPE_COLOR_MAP: Record<DatasetDataTypeEnum, string> = {
  [DatasetDataTypeEnum.CSV]: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  [DatasetDataTypeEnum.JSON]: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  [DatasetDataTypeEnum.EXCEL]: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  [DatasetDataTypeEnum.XML]: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
  [DatasetDataTypeEnum.TABLE]: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
};

/** 表单验证常量 */
export const FORM_VALIDATION = {
  TAG_MAX_LENGTH: 10,
  TAG_MAX_COUNT: 5,
  FILE_MAX_SIZE: 50 * 1024 * 1024, // 50MB
} as const;

/** 分页常量 */
export const PAGINATION = {
  DATASET_ITEMS_PER_PAGE: 6,
  TABLE_PAGE_SIZE: 10,
  DATA_LIST_PAGE_SIZE: 100,
} as const;
