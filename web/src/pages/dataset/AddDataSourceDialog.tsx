import { Database, CheckCircle, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { toast } from 'sonner';

interface AddDataSourceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  datasetName?: string;
}

type DatabaseType = 'mysql' | 'postgresql' | 'sqlserver' | 'oracle';

export function AddDataSourceDialog({ open, onOpenChange, datasetName }: AddDataSourceDialogProps) {
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [showPassword, setShowPassword] = useState(false);

  // JDBC连接参数
  const [dbType, setDbType] = useState<DatabaseType>('mysql');
  const [dbHost, setDbHost] = useState('');
  const [dbPort, setDbPort] = useState('3306');
  const [dbName, setDbName] = useState('');
  const [dbSchema, setDbSchema] = useState(''); // Schema (for PostgreSQL/SQL Server/Oracle)
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
    setIsTestingConnection(true);
    setConnectionStatus('idle');

    // 模拟测试连接
    setTimeout(() => {
      const success = Math.random() > 0.3; // 70%成功率
      setConnectionStatus(success ? 'success' : 'error');
      setIsTestingConnection(false);

      if (success) {
        toast.success('连接测试成功');
      } else {
        toast.error('连接测试失败，请检查配置参数');
      }
    }, 2000);
  };

  const handleSubmit = () => {
    const finalJdbcUrl = useCustomUrl ? jdbcUrl : generateJdbcUrl();
    const sourceName = connectionName || `${databaseConfigs[dbType].name} - ${dbName}`;

    toast.success(`数据源 "${sourceName}" 添加成功`);
    onOpenChange(false);
    resetForm();
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
      <DialogContent className='max-w-3xl max-h-[90vh] overflow-hidden p-0 dark:bg-gray-900 dark:border-gray-700'>
        <DialogHeader className='px-6 py-4 border-b border-gray-200 dark:border-gray-700'>
          <DialogTitle className='flex items-center gap-3 text-xl dark:text-white'>
            <Database className='w-6 h-6 text-blue-500' />
            添加关系型数据库数据源
          </DialogTitle>
          <DialogDescription className='text-sm text-gray-500 dark:text-gray-400 mt-1'>
            {datasetName ? `为数据集 "${datasetName}" 配置数据库连接` : '配置关系型数据库连接参数 (JDBC)'}
          </DialogDescription>
        </DialogHeader>

        <div className='px-6 py-4 overflow-y-auto max-h-[calc(90vh-180px)]'>
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
              <div className='grid grid-cols-2 gap-3'>
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

                  {(dbType === 'postgresql' || dbType === 'sqlserver' || dbType === 'oracle') && (
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
            disabled={!canSubmit() || connectionStatus !== 'success'}
            className='bg-blue-500 hover:bg-blue-600 text-white'
          >
            <Database className='w-4 h-4 mr-2' />
            添加数据源
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
