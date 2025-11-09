import { Database, CheckCircle, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import Datasets from '@/services/Datasets';
import { DatasourceConnectionTestDto, DataSourceUpdateDto, DatasourceConfigVo } from '@/services/DatasetsTypes';
import { DatasourceTypeEnum } from '@/enums/enums';

interface EditDataSourceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  datasetName?: string;
  datasetId?: string;
  onSuccess?: () => void;
}

type DatabaseType = 'mysql' | 'postgresql' | 'sqlserver' | 'oracle' | 'db2' | 'dm';

// 数据库类型映射
const databaseTypeMap: Record<DatabaseType, DatasourceTypeEnum> = {
  mysql: DatasourceTypeEnum.MySQL,
  postgresql: DatasourceTypeEnum.PostgreSQL,
  sqlserver: DatasourceTypeEnum.SQLServer,
  oracle: DatasourceTypeEnum.Oracle,
  db2: DatasourceTypeEnum.DB2,
  dm: DatasourceTypeEnum.DM,
};

// 反向映射：从 DatasourceTypeEnum 到 DatabaseType
const enumToDatabaseTypeMap: Record<DatasourceTypeEnum, DatabaseType> = {
  [DatasourceTypeEnum.MySQL]: 'mysql',
  [DatasourceTypeEnum.PostgreSQL]: 'postgresql',
  [DatasourceTypeEnum.SQLServer]: 'sqlserver',
  [DatasourceTypeEnum.Oracle]: 'oracle',
  [DatasourceTypeEnum.DB2]: 'db2',
  [DatasourceTypeEnum.DM]: 'dm',
};

export function EditDataSourceDialog({
  open,
  onOpenChange,
  datasetName,
  datasetId,
  onSuccess,
}: EditDataSourceDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [showPassword, setShowPassword] = useState(false);

  // JDBC连接参数
  const [dbType, setDbType] = useState<DatabaseType>('mysql');
  const [dbHost, setDbHost] = useState('');
  const [dbPort, setDbPort] = useState('3306');
  const [dbName, setDbName] = useState('');
  const [dbSchema, setDbSchema] = useState(''); // Schema (for PostgreSQL/SQL Server/Oracle/DB2/DM)
  const [dbUser, setDbUser] = useState('');
  const [dbPassword, setDbPassword] = useState('');
  const [jdbcUrl, setJdbcUrl] = useState('');
  const [connectionName, setConnectionName] = useState('');
  const [useCustomUrl, setUseCustomUrl] = useState(false);

  // 数据库配置
  const databaseConfigs = {
    mysql: {
      name: 'MySQL',
      defaultPort: '3306',
      icon: '🐬',
      color: 'bg-blue-500',
      jdbcUrlTemplate: 'jdbc:mysql://{host}:{port}/{database}?useSSL=false&serverTimezone=UTC',
      description: 'MySQL 5.7+ / MariaDB',
    },
    postgresql: {
      name: 'PostgreSQL',
      defaultPort: '5432',
      icon: '🐘',
      color: 'bg-indigo-500',
      jdbcUrlTemplate: 'jdbc:postgresql://{host}:{port}/{database}',
      description: 'PostgreSQL 9.6+',
    },
    sqlserver: {
      name: 'SQL Server',
      defaultPort: '1433',
      icon: '🔷',
      color: 'bg-red-500',
      jdbcUrlTemplate: 'jdbc:sqlserver://{host}:{port};databaseName={database}',
      description: 'Microsoft SQL Server 2012+',
    },
    oracle: {
      name: 'Oracle',
      defaultPort: '1521',
      icon: '🔴',
      color: 'bg-orange-500',
      jdbcUrlTemplate: 'jdbc:oracle:thin:@{host}:{port}:{database}',
      description: 'Oracle Database 11g+',
    },
    db2: {
      name: 'DB2',
      defaultPort: '50000',
      icon: '💾',
      color: 'bg-purple-500',
      jdbcUrlTemplate: 'jdbc:db2://{host}:{port}/{database}',
      description: 'IBM DB2 10.5+',
    },
    dm: {
      name: '达梦',
      defaultPort: '5236',
      icon: '🗄️',
      color: 'bg-cyan-500',
      jdbcUrlTemplate: 'jdbc:dm://{host}:{port}/{database}',
      description: 'DM Database 8.0+',
    },
  };

  // 加载数据源配置
  useEffect(() => {
    if (open && datasetId) {
      loadDataSourceConfig();
    } else if (!open) {
      // 关闭时重置表单
      resetForm();
    }
  }, [open, datasetId]);

  const loadDataSourceConfig = async () => {
    if (!datasetId) return;

    setIsLoading(true);
    try {
      const response = await Datasets.getDatasetDetail(datasetId);
      const responseData = (response as any).data;

      if (responseData?.datasourceConfig) {
        const config: DatasourceConfigVo = responseData.datasourceConfig;
        
        // 回显配置信息
        if (config.name) {
          setConnectionName(config.name);
        }

        // 设置数据库类型
        if (config.databaseType && enumToDatabaseTypeMap[config.databaseType]) {
          const dbTypeValue = enumToDatabaseTypeMap[config.databaseType];
          setDbType(dbTypeValue);
          setDbPort(config.port ? String(config.port) : databaseConfigs[dbTypeValue].defaultPort);
        }

        // 设置连接信息
        if (config.jdbcUrl) {
          setJdbcUrl(config.jdbcUrl);
          setUseCustomUrl(true);
        } else {
          setUseCustomUrl(false);
          if (config.host) setDbHost(config.host);
          if (config.port) setDbPort(String(config.port));
          if (config.database) setDbName(config.database);
        }

        if (config.username) setDbUser(config.username);
        if (config.password) setDbPassword(config.password);
      } else {
        // 如果没有配置，重置表单
        resetForm();
      }
    } catch (error: any) {
      console.error('加载数据源配置失败:', error);
      toast.error(error?.message || '加载数据源配置失败');
      resetForm();
    } finally {
      setIsLoading(false);
    }
  };

  // 生成JDBC URL
  const generateJdbcUrl = () => {
    if (!dbHost || !dbPort || !dbName) return '';

    const template = databaseConfigs[dbType].jdbcUrlTemplate;
    return template.replace('{host}', dbHost).replace('{port}', dbPort).replace('{database}', dbName);
  };

  // 当数据库类型改变时，更新默认端口
  const handleDbTypeChange = (value: DatabaseType) => {
    setDbType(value);
    setDbPort(databaseConfigs[value].defaultPort);
    if (!useCustomUrl) {
      setJdbcUrl('');
    }
  };

  // 测试连接
  const handleTestConnection = async () => {
    if (!canSubmit()) {
      toast.error('请填写完整的连接信息');
      return;
    }

    setIsTestingConnection(true);
    setConnectionStatus('idle');

    try {
      const finalJdbcUrl = useCustomUrl ? jdbcUrl : generateJdbcUrl();

      const testDto: DatasourceConnectionTestDto = {
        datasetId: datasetId || undefined,
        databaseType: databaseTypeMap[dbType],
        database: dbName || undefined,
        jdbcUrl: finalJdbcUrl || undefined,
        host: dbHost || undefined,
        port: dbPort ? Number(dbPort) : undefined,
        username: dbUser || undefined,
        password: dbPassword || undefined,
      };

      const response = await Datasets.testDataSourceConnection(testDto);
      const responseData = (response as any).data;

      if (responseData?.success) {
        setConnectionStatus('success');
        toast.success(responseData?.message || '连接测试成功');
      } else {
        setConnectionStatus('error');
        toast.error(responseData?.message || '连接测试失败，请检查配置参数');
      }
    } catch (error: any) {
      console.error('测试连接失败:', error);
      setConnectionStatus('error');
      toast.error(error?.message || '连接测试失败，请检查配置参数');
    } finally {
      setIsTestingConnection(false);
    }
  };

  const handleSubmit = async () => {
    if (!canSubmit() || connectionStatus !== 'success') {
      toast.error('请先测试连接，确保连接成功后再保存');
      return;
    }

    if (!datasetId) {
      toast.error('数据集ID不存在');
      return;
    }

    try {
      const finalJdbcUrl = useCustomUrl ? jdbcUrl : generateJdbcUrl();
      const sourceName = connectionName || `${databaseConfigs[dbType].name} - ${dbName}`;

      const updateDto: DataSourceUpdateDto = {
        name: sourceName,
        databaseType: databaseTypeMap[dbType],
        database: dbName || undefined,
        jdbcUrl: finalJdbcUrl || undefined,
        host: dbHost || undefined,
        port: dbPort ? Number(dbPort) : undefined,
        username: dbUser || undefined,
        password: dbPassword || undefined,
      };

      await Datasets.modifyDataSource(datasetId, updateDto);
      toast.success(`数据源 "${sourceName}" 更新成功`);
      onOpenChange(false);
      onSuccess?.();
    } catch (error: any) {
      console.error('更新数据源失败:', error);
      toast.error(error?.message || '更新数据源失败');
    }
  };

  const resetForm = () => {
    setConnectionStatus('idle');
    setDbType('mysql');
    setDbHost('');
    setDbPort('3306');
    setDbName('');
    setDbSchema('');
    setDbUser('');
    setDbPassword('');
    setJdbcUrl('');
    setConnectionName('');
    setUseCustomUrl(false);
    setShowPassword(false);
  };

  const canSubmit = () => {
    if (useCustomUrl) {
      return jdbcUrl !== '' && dbUser !== '';
    }
    return dbHost !== '' && dbPort !== '' && dbName !== '' && dbUser !== '';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className='max-h-[90vh] overflow-hidden p-0 dark:bg-gray-900 dark:border-gray-700'
        style={{ width: '600px', maxWidth: '600px' }}
      >
        <DialogHeader className='px-6 py-4 border-b border-gray-200 dark:border-gray-700'>
          <DialogTitle className='flex items-center gap-3 text-xl dark:text-white'>
            <Database className='w-6 h-6 text-blue-500' />
            编辑数据源
          </DialogTitle>
          <DialogDescription className='text-sm text-gray-500 dark:text-gray-400 mt-1'>
            {datasetName ? `编辑数据集 "${datasetName}" 的数据库连接配置` : '编辑关系型数据库连接参数 (JDBC)'}
          </DialogDescription>
        </DialogHeader>

        <div className='px-6 py-4 overflow-y-auto max-h-[calc(90vh-180px)]'>
          {isLoading ? (
            <div className='flex items-center justify-center py-12'>
              <div className='w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin' />
              <span className='ml-3 text-sm text-gray-600 dark:text-gray-400'>加载数据源配置中...</span>
            </div>
          ) : (
            <div className='space-y-5'>
              {/* 连接名称 */}
              <div>
                <Label className='text-sm mb-2 block dark:text-gray-300'>
                  连接名称 <span className='text-gray-400'>(可选)</span>
                </Label>
                <Input
                  value={connectionName}
                  onChange={e => setConnectionName(e.target.value)}
                  placeholder='例如: 生产环境MySQL'
                  className='dark:bg-gray-800 dark:border-gray-700 dark:text-white'
                />
              </div>

              {/* 数据库类型选择 */}
              <div>
                <Label className='text-sm mb-2 block dark:text-gray-300'>数据库类型</Label>
                <div className='grid grid-cols-2 md:grid-cols-3 gap-3'>
                  {(Object.keys(databaseConfigs) as DatabaseType[]).map(type => {
                    const config = databaseConfigs[type];
                    return (
                      <button
                        key={type}
                        onClick={() => handleDbTypeChange(type)}
                        className={`p-4 rounded-lg border-2 text-left transition-all ${
                          dbType === type
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                        }`}
                      >
                        <div className='flex items-center gap-3'>
                          <div
                            className={`${config.color} w-12 h-12 rounded-lg flex items-center justify-center text-2xl`}
                          >
                            {config.icon}
                          </div>
                          <div>
                            <div className='dark:text-white mb-0.5'>{config.name}</div>
                            <div className='text-xs text-gray-500 dark:text-gray-400'>{config.description}</div>
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
                  onChange={e => setUseCustomUrl(e.target.checked)}
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
                        onChange={e => setDbHost(e.target.value)}
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
                        onChange={e => setDbPort(e.target.value)}
                        placeholder={databaseConfigs[dbType].defaultPort}
                        className='dark:bg-gray-800 dark:border-gray-700 dark:text-white'
                      />
                    </div>

                    <div>
                      <Label className='text-sm mb-2 block dark:text-gray-300'>
                        数据库名 <span className='text-red-500'>*</span>
                      </Label>
                      <Input
                        value={dbName}
                        onChange={e => setDbName(e.target.value)}
                        placeholder={dbType === 'oracle' ? 'SID 或 Service Name' : 'database_name'}
                        className='dark:bg-gray-800 dark:border-gray-700 dark:text-white'
                      />
                    </div>

                    {(dbType === 'postgresql' || dbType === 'sqlserver' || dbType === 'oracle' || dbType === 'db2' || dbType === 'dm') && (
                      <div>
                        <Label className='text-sm mb-2 block dark:text-gray-300'>
                          Schema <span className='text-gray-400'>(可选)</span>
                        </Label>
                        <Input
                          value={dbSchema}
                          onChange={e => setDbSchema(e.target.value)}
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
                        <code className='text-xs text-gray-700 dark:text-gray-300 break-all'>{generateJdbcUrl()}</code>
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
                    onChange={e => setJdbcUrl(e.target.value)}
                    placeholder={databaseConfigs[dbType].jdbcUrlTemplate
                      .replace('{host}', 'localhost')
                      .replace('{port}', databaseConfigs[dbType].defaultPort)
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
                      onChange={e => setDbUser(e.target.value)}
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
                        onChange={e => setDbPassword(e.target.value)}
                        placeholder='password'
                        autoComplete='new-password'
                        className='dark:bg-gray-800 dark:border-gray-700 dark:text-white pr-10'
                      />
                      <button
                        type='button'
                        onClick={() => setShowPassword(!showPassword)}
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
                  onClick={handleTestConnection}
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
                      数据库连接成功！可以保存配置。
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
          )}
        </div>

        {/* 底部按钮 */}
        <div className='px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-end gap-3'>
          <Button
            variant='outline'
            onClick={() => {
              onOpenChange(false);
              resetForm();
            }}
            className='dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300'
          >
            取消
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!canSubmit() || connectionStatus !== 'success' || isLoading}
            className='bg-blue-500 hover:bg-blue-600 text-white'
          >
            <Database className='w-4 h-4 mr-2' />
            保存配置
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

