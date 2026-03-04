import { CheckCircle, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { DataSourceFormState } from '../hooks/useDataSourceForm';
import { DATABASE_CONFIGS, DATABASES_REQUIRING_SCHEMA } from '../constants';
import { useLanguage } from '@/components/LanguageProvider.tsx';
import { DatasourceConnectionStatusEnum, DatasourceTypeEnum } from '@/enums/enums';

interface DataSourceFormContentProps {
  formState: DataSourceFormState;
  connectionStatus: DatasourceConnectionStatusEnum;
  isTestingConnection: boolean;
  onFieldChange: <K extends keyof DataSourceFormState>(field: K, value: DataSourceFormState[K]) => void;
  onDbTypeChange: (dbType: DatasourceTypeEnum) => void;
  onToggleCustomUrl: (useCustomUrl: boolean) => void;
  onTestConnection: () => void;
  getJdbcUrl: () => string;
  canSubmit: () => boolean;
}

export function DataSourceFormContent({
  formState,
  connectionStatus,
  isTestingConnection,
  onFieldChange,
  onDbTypeChange,
  onToggleCustomUrl,
  onTestConnection,
  getJdbcUrl,
  canSubmit,
}: DataSourceFormContentProps) {
  const { t } = useLanguage();
  const {
    dbType,
    dbHost,
    dbPort,
    dbName,
    dbSchema,
    dbUser,
    dbPassword,
    jdbcUrl,
    connectionName,
    useCustomUrl,
    showPassword,
  } = formState;
  const config = DATABASE_CONFIGS[dbType];
  const requiresSchema = DATABASES_REQUIRING_SCHEMA.includes(dbType);

  return (
    <div className='space-y-5'>
      {/* Connection Name */}
      <div>
        <Label className='text-sm mb-2 block dark:text-gray-300'>
          {t('dataset.datasource.form.connectionNameLabel')}{' '}
          <span className='text-gray-400'>{t('common.labels.optional')}</span>
        </Label>
        <Input
          value={connectionName}
          onChange={e => onFieldChange('connectionName', e.target.value)}
          placeholder={t('dataset.datasource.form.connectionNamePlaceholder')}
          className='dark:bg-gray-800 dark:border-gray-700 dark:text-white'
        />
      </div>

      {/* Database Type Selection */}
      <div>
        <Label className='text-sm mb-2 block dark:text-gray-300'>{t('dataset.datasource.form.dbTypeLabel')}</Label>
        <div className='grid grid-cols-2 md:grid-cols-3 gap-3'>
          {(Object.keys(DATABASE_CONFIGS) as DatasourceTypeEnum[]).map(type => {
            const dbConfig = DATABASE_CONFIGS[type];
            return (
              <button
                key={type}
                onClick={() => onDbTypeChange(type)}
                className={`p-4 rounded-lg border-2 text-left transition-all ${
                  dbType === type
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <div className='flex items-center gap-3'>
                  <div className={`${dbConfig.color} w-12 h-12 rounded-lg flex items-center justify-center text-2xl`}>
                    {dbConfig.icon}
                  </div>
                  <div>
                    <div className='dark:text-white mb-0.5'>{t(dbConfig.nameKey)}</div>
                    <div className='text-xs text-gray-500 dark:text-gray-400'>{t(dbConfig.descriptionKey)}</div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* JDBC Mode Toggle */}
      <div className='flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg'>
        <input
          type='checkbox'
          id='useCustomUrl'
          checked={useCustomUrl}
          onChange={e => onToggleCustomUrl(e.target.checked)}
          className='w-4 h-4 text-blue-600 rounded'
        />
        <Label htmlFor='useCustomUrl' className='text-sm dark:text-gray-300 cursor-pointer'>
          {t('dataset.datasource.form.useCustomUrl')}
        </Label>
      </div>

      {!useCustomUrl ? (
        <>
          {/* Base Connection Parameters */}
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <Label className='text-sm mb-2 block dark:text-gray-300'>
                {t('dataset.datasource.form.hostLabel')} <span className='text-red-500'>*</span>
              </Label>
              <Input
                value={dbHost}
                onChange={e => onFieldChange('dbHost', e.target.value)}
                placeholder={t('dataset.datasource.form.hostPlaceholder')}
                className='dark:bg-gray-800 dark:border-gray-700 dark:text-white'
              />
            </div>

            <div>
              <Label className='text-sm mb-2 block dark:text-gray-300'>
                {t('dataset.datasource.form.portLabel')} <span className='text-red-500'>*</span>
              </Label>
              <Input
                value={dbPort}
                onChange={e => onFieldChange('dbPort', e.target.value)}
                placeholder={config.defaultPort}
                className='dark:bg-gray-800 dark:border-gray-700 dark:text-white'
              />
            </div>

            <div>
              <Label className='text-sm mb-2 block dark:text-gray-300'>
                {t('dataset.datasource.form.databaseLabel')} <span className='text-red-500'>*</span>
              </Label>
              <Input
                value={dbName}
                onChange={e => onFieldChange('dbName', e.target.value)}
                placeholder={
                  dbType === DatasourceTypeEnum.Oracle
                    ? t('dataset.datasource.form.databasePlaceholderOracle')
                    : t('dataset.datasource.form.databasePlaceholder')
                }
                className='dark:bg-gray-800 dark:border-gray-700 dark:text-white'
              />
            </div>

            {requiresSchema && (
              <div>
                <Label className='text-sm mb-2 block dark:text-gray-300'>
                  {t('dataset.datasource.form.schemaLabel')}{' '}
                  <span className='text-gray-400'>{t('common.labels.optional')}</span>
                </Label>
                <Input
                  value={dbSchema}
                  onChange={e => onFieldChange('dbSchema', e.target.value)}
                  placeholder={
                    dbType === DatasourceTypeEnum.PostgreSQL
                      ? t('dataset.datasource.form.schemaPlaceholderPostgres')
                      : t('dataset.datasource.form.schemaPlaceholderDefault')
                  }
                  className='dark:bg-gray-800 dark:border-gray-700 dark:text-white'
                />
              </div>
            )}
          </div>

          {/* Generated JDBC preview */}
          {dbHost && dbPort && dbName && (
            <div>
              <Label className='text-sm mb-2 block dark:text-gray-300'>
                {t('dataset.datasource.form.generatedJdbcLabel')}
              </Label>
              <div className='p-3 bg-gray-100 dark:bg-gray-800 rounded-lg'>
                <code className='text-xs text-gray-700 dark:text-gray-300 break-all'>{getJdbcUrl()}</code>
              </div>
            </div>
          )}
        </>
      ) : (
        /* Custom JDBC URL */
        <div>
          <Label className='text-sm mb-2 block dark:text-gray-300'>
            {t('dataset.datasource.form.customJdbcLabel')} <span className='text-red-500'>*</span>
          </Label>
          <Textarea
            value={jdbcUrl}
            onChange={e => onFieldChange('jdbcUrl', e.target.value)}
            placeholder={config.jdbcUrlTemplate
              .replace('{host}', 'localhost')
              .replace('{port}', config.defaultPort)
              .replace('{database}', 'mydb')}
            rows={3}
            className='dark:bg-gray-800 dark:border-gray-700 dark:text-white font-mono text-sm'
          />
        </div>
      )}

      {/* Authentication */}
      <div className='border-t border-gray-200 dark:border-gray-700 pt-5'>
        <h3 className='text-sm dark:text-gray-300 mb-4'>{t('dataset.datasource.form.authSectionTitle')}</h3>
        <div className='grid grid-cols-2 gap-4'>
          <div>
            <Label className='text-sm mb-2 block dark:text-gray-300'>
              {t('dataset.datasource.form.usernameLabel')} <span className='text-red-500'>*</span>
            </Label>
            <Input
              value={dbUser}
              onChange={e => onFieldChange('dbUser', e.target.value)}
              placeholder={t('dataset.datasource.form.usernamePlaceholder')}
              autoComplete='off'
              className='dark:bg-gray-800 dark:border-gray-700 dark:text-white'
            />
          </div>

          <div>
            <Label className='text-sm mb-2 block dark:text-gray-300'>
              {t('dataset.datasource.form.passwordLabel')} <span className='text-red-500'>*</span>
            </Label>
            <div className='relative'>
              <Input
                type={showPassword ? 'text' : 'password'}
                value={dbPassword}
                onChange={e => onFieldChange('dbPassword', e.target.value)}
                placeholder={t('dataset.datasource.form.passwordPlaceholder')}
                autoComplete='new-password'
                className='dark:bg-gray-800 dark:border-gray-700 dark:text-white pr-10'
              />
              <button
                type='button'
                onClick={() => onFieldChange('showPassword', !showPassword)}
                className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
              >
                {showPassword ? <EyeOff className='w-4 h-4' /> : <Eye className='w-4 h-4' />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 连接测试 */}
      <div className='border-t border-gray-200 dark:border-gray-700 pt-5'>
        <Button
          onClick={onTestConnection}
          disabled={!canSubmit() || isTestingConnection}
          variant='outline'
          className='w-full dark:bg-gray-800 dark:border-gray-700'
        >
          {isTestingConnection ? (
            <>
              <div className='w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mr-2' />
              {t('dataset.datasource.form.testConnection.testing')}
            </>
          ) : connectionStatus === DatasourceConnectionStatusEnum.SUCCESS ? (
            <>
              <CheckCircle className='w-4 h-4 mr-2 text-green-500' />
              {t('dataset.datasource.form.testConnection.success')}
            </>
          ) : connectionStatus === DatasourceConnectionStatusEnum.ERROR ? (
            <>
              <AlertCircle className='w-4 h-4 mr-2 text-red-500' />
              {t('dataset.datasource.form.testConnection.failed')}
            </>
          ) : (
            t('dataset.datasource.form.testConnection.default')
          )}
        </Button>

        {connectionStatus === DatasourceConnectionStatusEnum.SUCCESS && (
          <div className='mt-3 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg'>
            <div className='flex items-center gap-2 text-sm text-green-700 dark:text-green-400'>
              <CheckCircle className='w-4 h-4' />
              {t('dataset.datasource.form.connectionSuccess')}
            </div>
          </div>
        )}

        {connectionStatus === DatasourceConnectionStatusEnum.ERROR && (
          <div className='mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg'>
            <div className='text-sm text-red-700 dark:text-red-400'>
              <div className='flex items-center gap-2 mb-1'>
                <AlertCircle className='w-4 h-4' />
                {t('dataset.datasource.form.connectionFailed.title')}
              </div>
              <ul className='ml-6 mt-2 space-y-1 text-xs list-disc'>
                <li>{t('dataset.datasource.form.connectionFailed.hostPort')}</li>
                <li>{t('dataset.datasource.form.connectionFailed.credentials')}</li>
                <li>{t('dataset.datasource.form.connectionFailed.database')}</li>
                <li>{t('dataset.datasource.form.connectionFailed.network')}</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
