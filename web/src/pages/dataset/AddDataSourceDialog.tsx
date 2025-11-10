import { Database } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useEffect } from 'react';
import { toast } from 'sonner';
import Datasets from '@/services/Datasets';
import { useDataSourceForm } from './hooks/useDataSourceForm';
import { DataSourceFormContent } from './components/DataSourceFormContent';

interface AddDataSourceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  datasetName?: string;
  datasetId?: string;
  onSuccess?: () => void;
}

export function AddDataSourceDialog({
  open,
  onOpenChange,
  datasetName,
  datasetId,
  onSuccess,
}: AddDataSourceDialogProps) {
  const {
    formState,
    connectionStatus,
    isTestingConnection,
    updateField,
    changeDbType,
    toggleCustomUrl,
    resetForm,
    validateForm,
    getJdbcUrl,
    testConnection,
    getSubmitData,
  } = useDataSourceForm();

  // 关闭对话框时重置表单
  useEffect(() => {
    if (!open) {
      resetForm();
    }
  }, [open, resetForm]);

  const handleTestConnection = async () => {
    await testConnection(datasetId);
  };

  const handleSubmit = async () => {
    if (!validateForm() || connectionStatus !== 'success') {
      toast.error('请先测试连接，确保连接成功后再添加');
      return;
    }

    if (!datasetId) {
      toast.error('数据集ID不存在');
      return;
    }

    try {
      const updateDto = getSubmitData();
      await Datasets.modifyDataSource(datasetId, updateDto);
      toast.success(`数据源 "${updateDto.name}" 添加成功`);
      onOpenChange(false);
      onSuccess?.();
      resetForm();
    } catch (error: any) {
      console.error('添加数据源失败:', error);
      toast.error(error?.message || '添加数据源失败');
    }
  };

  const canSubmit = () => {
    if (formState.useCustomUrl) {
      return formState.jdbcUrl !== '' && formState.dbUser !== '';
    }
    return formState.dbHost !== '' && formState.dbPort !== '' && formState.dbName !== '' && formState.dbUser !== '';
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
          <DataSourceFormContent
            formState={formState}
            connectionStatus={connectionStatus}
            isTestingConnection={isTestingConnection}
            onFieldChange={updateField}
            onDbTypeChange={changeDbType}
            onToggleCustomUrl={toggleCustomUrl}
            onTestConnection={handleTestConnection}
            getJdbcUrl={getJdbcUrl}
            canSubmit={canSubmit}
          />
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
