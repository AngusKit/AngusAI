import { CheckCircle, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { DataSourceFormState, ConnectionStatus } from '../hooks/useDataSourceForm';
import { DATABASE_CONFIGS, DATABASES_REQUIRING_SCHEMA, DatabaseType } from '../constants';

interface DataSourceFormContentProps {
  formState: DataSourceFormState;
  connectionStatus: ConnectionStatus;
  isTestingConnection: boolean;
  onFieldChange: <K extends keyof DataSourceFormState>(field: K, value: DataSourceFormState[K]) => void;
  onDbTypeChange: (dbType: DatabaseType) => void;
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
  const { dbType, dbHost, dbPort, dbName, dbSchema, dbUser, dbPassword, jdbcUrl, connectionName, useCustomUrl, showPassword } = formState;
  const config = DATABASE_CONFIGS[dbType];
  const requiresSchema = DATABASES_REQUIRING_SCHEMA.includes(dbType);

  return (
    <div className='space-y-5'>
      {/* 连接名称 */}
      <div>
        <Label className='text-sm mb-2 block dark:text-gray-300'>
          连接名称 <span className='text-gray-400'>(可选)</span>
        </Label>
        <Input
          value={connectionName}
          onChange={e => onFieldChange('connectionName', e.target.value)}
          placeholder='例如: 生产环境MySQL'
          className='dark:bg-gray-800 dark:border-gray-700 dark:text-white'
        />
      </div>

      {/* 数据库类型选择 */}
      <div>
        <Label className='text-sm mb-2 block dark:text-gray-300'>数据库类型</Label>
        <div className='grid grid-cols-2 md:grid-cols-3 gap-3'>
          {(Object.keys(DATABASE_CONFIGS) as DatabaseType[]).map(type => {
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
                    <div className='dark:text-white mb-0.5'>{dbConfig.name}</div>
                    <div className='text-xs text-gray-500 dark:text-gray-400'>{dbConfig.description}</div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* JDBC配置方式切换 */}
      <div className='flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg'>
        <input
          type='checkbox'
          id='useCustomUrl'
          checked={useCustomUrl}
          onChange={e => onToggleCustomUrl(e.target.checked)}
          className='w-4 h-4 text-blue-600 rounded'
        />
        <Label htmlFor='useCustomUrl' className='text-sm dark:text-gray-300 cursor-pointer'>
          使用自定义 JDBC URL
        </Label>
      </div>

      {!useCustomUrl ? (
        <>
          {/* 基本连接参数 */}
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <Label className='text-sm mb-2 block dark:text-gray-300'>
                主机地址 <span className='text-red-500'>*</span>
              </Label>
              <Input
                value={dbHost}
                onChange={e => onFieldChange('dbHost', e.target.value)}
                placeholder='localhost 或 192.168.1.100'
                className='dark:bg-gray-800 dark:border-gray-700 dark:text-white'
              />
            </div>

            <div>
              <Label className='text-sm mb-2 block dark:text-gray-300'>
                端口 <span className='text-red-500'>*</span>
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
                数据库名 <span className='text-red-500'>*</span>
              </Label>
              <Input
                value={dbName}
                onChange={e => onFieldChange('dbName', e.target.value)}
                placeholder={dbType === 'oracle' ? 'SID 或 Service Name' : 'database_name'}
                className='dark:bg-gray-800 dark:border-gray-700 dark:text-white'
              />
            </div>

            {requiresSchema && (
              <div>
                <Label className='text-sm mb-2 block dark:text-gray-300'>
                  Schema <span className='text-gray-400'>(可选)</span>
                </Label>
                <Input
                  value={dbSchema}
                  onChange={e => onFieldChange('dbSchema', e.target.value)}
                  placeholder={dbType === 'postgresql' ? 'public' : 'dbo'}
                  className='dark:bg-gray-800 dark:border-gray-700 dark:text-white'
                />
              </div>
            )}
          </div>

          {/* 生成的JDBC URL预览 */}
          {dbHost && dbPort && dbName && (
            <div>
              <Label className='text-sm mb-2 block dark:text-gray-300'>生成的 JDBC URL</Label>
              <div className='p-3 bg-gray-100 dark:bg-gray-800 rounded-lg'>
                <code className='text-xs text-gray-700 dark:text-gray-300 break-all'>{getJdbcUrl()}</code>
              </div>
            </div>
          )}
        </>
      ) : (
        /* 自定义JDBC URL */
        <div>
          <Label className='text-sm mb-2 block dark:text-gray-300'>
            JDBC URL <span className='text-red-500'>*</span>
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

      {/* 认证信息 */}
      <div className='border-t border-gray-200 dark:border-gray-700 pt-5'>
        <h3 className='text-sm dark:text-gray-300 mb-4'>认证信息</h3>
        <div className='grid grid-cols-2 gap-4'>
          <div>
            <Label className='text-sm mb-2 block dark:text-gray-300'>
              用户名 <span className='text-red-500'>*</span>
            </Label>
            <Input
              value={dbUser}
              onChange={e => onFieldChange('dbUser', e.target.value)}
              placeholder='username'
              autoComplete='off'
              className='dark:bg-gray-800 dark:border-gray-700 dark:text-white'
            />
          </div>

          <div>
            <Label className='text-sm mb-2 block dark:text-gray-300'>
              密码 <span className='text-red-500'>*</span>
            </Label>
            <div className='relative'>
              <Input
                type={showPassword ? 'text' : 'password'}
                value={dbPassword}
                onChange={e => onFieldChange('dbPassword', e.target.value)}
                placeholder='password'
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
              测试连接中...
            </>
          ) : connectionStatus === 'success' ? (
            <>
              <CheckCircle className='w-4 h-4 mr-2 text-green-500' />
              连接成功
            </>
          ) : connectionStatus === 'error' ? (
            <>
              <AlertCircle className='w-4 h-4 mr-2 text-red-500' />
              连接失败
            </>
          ) : (
            '测试连接'
          )}
        </Button>

        {connectionStatus === 'success' && (
          <div className='mt-3 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg'>
            <div className='flex items-center gap-2 text-sm text-green-700 dark:text-green-400'>
              <CheckCircle className='w-4 h-4' />
              数据库连接成功！可以开始添加数据源。
            </div>
          </div>
        )}

        {connectionStatus === 'error' && (
          <div className='mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg'>
            <div className='text-sm text-red-700 dark:text-red-400'>
              <div className='flex items-center gap-2 mb-1'>
                <AlertCircle className='w-4 h-4' />
                连接失败，请检查：
              </div>
              <ul className='ml-6 mt-2 space-y-1 text-xs list-disc'>
                <li>数据库主机地址和端口是否正确</li>
                <li>用户名和密码是否正确</li>
                <li>数据库名称是否存在</li>
                <li>网络连接是否正常</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

