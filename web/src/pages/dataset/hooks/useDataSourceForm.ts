import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { DatasourceConnectionTestDto, DataSourceUpdateDto, DatasourceConfigVo } from '@/services/DatasetsTypes';
import Datasets from '@/services/Datasets';
import {
  DatabaseType,
  DATABASE_CONFIGS,
  DATABASE_TYPE_TO_ENUM_MAP,
  ENUM_TO_DATABASE_TYPE_MAP,
} from '../constants';
import { generateJdbcUrl } from '../utils';
import { useLanguage } from '@/components/ui/LanguageProvider';

/** 连接状态 */
export type ConnectionStatus = 'idle' | 'success' | 'error';

/** 数据源表单状态 */
export interface DataSourceFormState {
  dbType: DatabaseType;
  dbHost: string;
  dbPort: string;
  dbName: string;
  dbSchema: string;
  dbUser: string;
  dbPassword: string;
  jdbcUrl: string;
  connectionName: string;
  useCustomUrl: boolean;
  showPassword: boolean;
}

/** 初始表单状态 */
const INITIAL_FORM_STATE: DataSourceFormState = {
  dbType: 'mysql',
  dbHost: '',
  dbPort: '3306',
  dbName: '',
  dbSchema: '',
  dbUser: '',
  dbPassword: '',
  jdbcUrl: '',
  connectionName: '',
  useCustomUrl: false,
  showPassword: false,
};

/**
 * 数据源表单管理 Hook
 */
export function useDataSourceForm() {
  const [formState, setFormState] = useState<DataSourceFormState>(INITIAL_FORM_STATE);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('idle');
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useLanguage();

  /** 更新表单字段 */
  const updateField = useCallback(<K extends keyof DataSourceFormState>(field: K, value: DataSourceFormState[K]) => {
    setFormState(prev => ({ ...prev, [field]: value }));
  }, []);

  /** 切换数据库类型 */
  const changeDbType = useCallback((dbType: DatabaseType) => {
    setFormState(prev => ({
      ...prev,
      dbType,
      dbPort: DATABASE_CONFIGS[dbType].defaultPort,
      jdbcUrl: prev.useCustomUrl ? prev.jdbcUrl : '',
    }));
  }, []);

  /** 切换自定义URL模式 */
  const toggleCustomUrl = useCallback((useCustomUrl: boolean) => {
    setFormState(prev => ({
      ...prev,
      useCustomUrl,
      jdbcUrl: useCustomUrl ? prev.jdbcUrl : '',
    }));
  }, []);

  /** 重置表单 */
  const resetForm = useCallback(() => {
    setFormState(INITIAL_FORM_STATE);
    setConnectionStatus('idle');
  }, []);

  /** 从配置加载表单数据 */
  const loadFromConfig = useCallback((config: DatasourceConfigVo) => {
    if (config.name !== undefined) {
      setFormState(prev => ({ ...prev, connectionName: config.name ?? '' }));
    }
    if (config.databaseType && ENUM_TO_DATABASE_TYPE_MAP[config.databaseType]) {
      const dbType = ENUM_TO_DATABASE_TYPE_MAP[config.databaseType];
      setFormState(prev => ({
        ...prev,
        dbType,
        dbPort: config.port ? String(config.port) : DATABASE_CONFIGS[dbType].defaultPort,
      }));
    }

    if (config.jdbcUrl) {
      setFormState(prev => ({
        ...prev,
        jdbcUrl: config.jdbcUrl!,
        useCustomUrl: true,
      }));
    } else {
      setFormState(prev => ({
        ...prev,
        useCustomUrl: false,
        dbHost: config.host || '',
        dbPort: config.port ? String(config.port) : prev.dbPort,
        dbName: config.database || '',
      }));
    }

    if (config.username) {
      setFormState(prev => ({ ...prev, dbUser: config.username! }));
    }
    if (config.password) {
      setFormState(prev => ({ ...prev, dbPassword: config.password! }));
    }
  }, []);

  /** 验证表单 */
  const validateForm = useCallback((): boolean => {
    if (formState.useCustomUrl) {
      if (!formState.jdbcUrl || !formState.dbUser) {
        toast.error(t('dataset.datasource.form.validationIncomplete'));
        return false;
      }
    } else {
      if (!formState.dbHost || !formState.dbPort || !formState.dbName || !formState.dbUser) {
        toast.error(t('dataset.datasource.form.validationIncomplete'));
        return false;
      }
    }
    return true;
  }, [formState]);

  /** 生成JDBC URL */
  const getJdbcUrl = useCallback((): string => {
    if (formState.useCustomUrl) {
      return formState.jdbcUrl;
    }
    const config = DATABASE_CONFIGS[formState.dbType];
    return generateJdbcUrl(formState.dbType, formState.dbHost, formState.dbPort, formState.dbName, config.jdbcUrlTemplate);
  }, [formState]);

  /** 测试连接 */
  const testConnection = useCallback(async (datasetId?: string) => {
    if (!validateForm()) {
      return false;
    }

    setIsTestingConnection(true);
    setConnectionStatus('idle');

    try {
      const finalJdbcUrl = getJdbcUrl();

      const testDto: DatasourceConnectionTestDto = {
        datasetId: datasetId || undefined,
        databaseType: DATABASE_TYPE_TO_ENUM_MAP[formState.dbType],
        database: formState.dbName || undefined,
        jdbcUrl: finalJdbcUrl || undefined,
        host: formState.dbHost || undefined,
        port: formState.dbPort ? Number(formState.dbPort) : undefined,
        username: formState.dbUser || undefined,
        password: formState.dbPassword || undefined,
      };

      const response = await Datasets.testDataSourceConnection(testDto);
      const responseData = (response as any).data;

      if (responseData?.success) {
        setConnectionStatus('success');
        toast.success(responseData?.message || t('dataset.toasts.datasourceTestSuccess'));
        return true;
      } else {
        setConnectionStatus('error');
        toast.error(responseData?.message || t('dataset.toasts.datasourceTestFailed'));
        return false;
      }
    } catch (error: any) {
      console.error('Failed to test datasource connection:', error);
      setConnectionStatus('error');
      toast.error(error?.message || t('dataset.toasts.datasourceTestFailed'));
      return false;
    } finally {
      setIsTestingConnection(false);
    }
  }, [formState, validateForm, getJdbcUrl]);

  /** 获取提交数据 */
  const getSubmitData = useCallback((): DataSourceUpdateDto => {
    const finalJdbcUrl = getJdbcUrl();
    const config = DATABASE_CONFIGS[formState.dbType];
    const sourceName =
      formState.connectionName || `${t(config.nameKey)} - ${formState.dbName || t('dataset.datasource.form.unnamed')}`;

    return {
      name: sourceName,
      databaseType: DATABASE_TYPE_TO_ENUM_MAP[formState.dbType],
      database: formState.dbName || undefined,
      jdbcUrl: finalJdbcUrl || undefined,
      host: formState.dbHost || undefined,
      port: formState.dbPort ? Number(formState.dbPort) : undefined,
      username: formState.dbUser || undefined,
      password: formState.dbPassword || undefined,
    };
  }, [formState, getJdbcUrl]);

  return {
    formState,
    connectionStatus,
    isTestingConnection,
    isLoading,
    setIsLoading,
    updateField,
    changeDbType,
    toggleCustomUrl,
    resetForm,
    loadFromConfig,
    validateForm,
    getJdbcUrl,
    testConnection,
    getSubmitData,
  };
}

