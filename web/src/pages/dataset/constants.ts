import { DatasourceTypeEnum, DatasetDataTypeEnum, DatasetDataStatusEnum, VisibilityEnum } from '@/enums/enums';

/** 数据库类型 */
export type DatabaseType = 'mysql' | 'postgresql' | 'sqlserver' | 'oracle' | 'db2' | 'dm'; // TODO 使用枚举代替

/** 数据集类型显示映射 */
export const DATASET_TYPE_DISPLAY_MAP: Record<string, '文件' | '数据源'> = {
  FILE: '文件',
  DATASOURCE: '数据源', // TODO 使用枚举代替
};

/** 可见性显示映射 */ // TODO 使用枚举代替
export const VISIBILITY_DISPLAY_MAP: Record<VisibilityEnum, string> = {
  [VisibilityEnum.PRIVATE]: 'private',
  [VisibilityEnum.TEAM]: 'team',
  [VisibilityEnum.PUBLIC]: 'public',
};

/** 数据集状态颜色 */ // TODO 启用禁用全局保持一份
export const DATASET_STATUS_COLORS = {
  enabled: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  disabled: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400',
} as const;

/** 数据库类型到枚举的映射 */ // TODO 使用枚举代替
export const DATABASE_TYPE_TO_ENUM_MAP: Record<DatabaseType, DatasourceTypeEnum> = {
  mysql: DatasourceTypeEnum.MySQL,
  postgresql: DatasourceTypeEnum.PostgreSQL,
  sqlserver: DatasourceTypeEnum.SQLServer,
  oracle: DatasourceTypeEnum.Oracle,
  db2: DatasourceTypeEnum.DB2,
  dm: DatasourceTypeEnum.DM,
};

/** 枚举到数据库类型的反向映射 */  // TODO 使用枚举代替
export const ENUM_TO_DATABASE_TYPE_MAP: Record<DatasourceTypeEnum, DatabaseType> = {
  [DatasourceTypeEnum.MySQL]: 'mysql',
  [DatasourceTypeEnum.PostgreSQL]: 'postgresql',
  [DatasourceTypeEnum.SQLServer]: 'sqlserver',
  [DatasourceTypeEnum.Oracle]: 'oracle',
  [DatasourceTypeEnum.DB2]: 'db2',
  [DatasourceTypeEnum.DM]: 'dm',
};

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
export const DATABASE_CONFIGS: Record<DatabaseType, DatabaseConfig> = {
  mysql: {
    name: 'MySQL',
    defaultPort: '3306',
    icon: '🐬',
    color: 'bg-blue-500',
    jdbcUrlTemplate: 'jdbc:mysql://{host}:{port}/{database}?useSSL=false&serverTimezone=UTC',
    description: 'MySQL 5.7+ / MariaDB',
    nameKey: 'dataset.datasource.databases.mysql.name',
    descriptionKey: 'dataset.datasource.databases.mysql.description',
  },
  postgresql: {
    name: 'PostgreSQL',
    defaultPort: '5432',
    icon: '🐘',
    color: 'bg-indigo-500',
    jdbcUrlTemplate: 'jdbc:postgresql://{host}:{port}/{database}',
    description: 'PostgreSQL 9.6+',
    nameKey: 'dataset.datasource.databases.postgresql.name',
    descriptionKey: 'dataset.datasource.databases.postgresql.description',
  },
  sqlserver: {
    name: 'SQL Server',
    defaultPort: '1433',
    icon: '🔷',
    color: 'bg-red-500',
    jdbcUrlTemplate: 'jdbc:sqlserver://{host}:{port};databaseName={database}',
    description: 'Microsoft SQL Server 2012+',
    nameKey: 'dataset.datasource.databases.sqlserver.name',
    descriptionKey: 'dataset.datasource.databases.sqlserver.description',
  },
  oracle: {
    name: 'Oracle',
    defaultPort: '1521',
    icon: '🔴',
    color: 'bg-orange-500',
    jdbcUrlTemplate: 'jdbc:oracle:thin:@{host}:{port}:{database}',
    description: 'Oracle Database 11g+',
    nameKey: 'dataset.datasource.databases.oracle.name',
    descriptionKey: 'dataset.datasource.databases.oracle.description',
  },
  db2: {
    name: 'DB2',
    defaultPort: '50000',
    icon: '💾',
    color: 'bg-purple-500',
    jdbcUrlTemplate: 'jdbc:db2://{host}:{port}/{database}',
    description: 'IBM DB2 10.5+',
    nameKey: 'dataset.datasource.databases.db2.name',
    descriptionKey: 'dataset.datasource.databases.db2.description',
  },
  dm: {
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

/** 需要Schema的数据库类型 */ // TODO 使用枚举代替
export const DATABASES_REQUIRING_SCHEMA: DatabaseType[] = ['postgresql', 'sqlserver', 'oracle', 'db2', 'dm'];

/** 数据类型显示映射 */ // TODO 使用枚举代替
export const DATA_TYPE_DISPLAY_MAP: Record<DatasetDataTypeEnum, string> = {
  [DatasetDataTypeEnum.CSV]: 'CSV',
  [DatasetDataTypeEnum.JSON]: 'JSON',
  [DatasetDataTypeEnum.EXCEL]: 'Excel',
  [DatasetDataTypeEnum.XML]: 'XML',
  [DatasetDataTypeEnum.TABLE]: 'Table',
};

/** 数据类型图标映射 */ // TODO 使用枚举代替
export const DATA_TYPE_ICON_MAP: Record<DatasetDataTypeEnum, string> = {
  [DatasetDataTypeEnum.CSV]: '📊',
  [DatasetDataTypeEnum.JSON]: '📝',
  [DatasetDataTypeEnum.EXCEL]: '📈',
  [DatasetDataTypeEnum.XML]: '📄',
  [DatasetDataTypeEnum.TABLE]: '📋',
};

/** 数据状态显示映射 */ // TODO 使用枚举代替
export const DATA_STATUS_DISPLAY_MAP: Record<DatasetDataStatusEnum, string> = {
  [DatasetDataStatusEnum.PENDING]: '待处理',
  [DatasetDataStatusEnum.PROCESSING]: '处理中',
  [DatasetDataStatusEnum.COMPLETED]: '已处理',
  [DatasetDataStatusEnum.FAILED]: '处理失败',
};

/** 数据状态颜色映射 */ // TODO 使用枚举代替
export const DATA_STATUS_COLOR_MAP: Record<string, string> = {
  已处理: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  处理中: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  待处理: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400',
  处理失败: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

/** 数据类型颜色映射 */
export const DATA_TYPE_COLOR_MAP: Record<DatasetDataTypeEnum, string> = {
  [DatasetDataTypeEnum.CSV]: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  [DatasetDataTypeEnum.JSON]: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  [DatasetDataTypeEnum.EXCEL]: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  [DatasetDataTypeEnum.XML]: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
  [DatasetDataTypeEnum.TABLE]: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
};

/** 可见性选项映射 */ // TODO 使用枚举代替
export const VISIBILITY_OPTIONS_MAP: Record<string, VisibilityEnum> = {
  private: VisibilityEnum.PRIVATE,
  team: VisibilityEnum.TEAM,
  public: VisibilityEnum.PUBLIC,
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
