import { Database } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useEffect } from 'react';
import { toast } from 'sonner';
import Datasets from '@/services/Datasets';
import { useDataSourceForm } from './hooks/useDataSourceForm';
import { DataSourceFormContent } from './components/DataSourceFormContent';
import { useLanguage } from '@/components/LanguageProvider.tsx';
import { DatasourceConnectionStatusEnum } from '@/enums/enums';

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
  const { t } = useLanguage();
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
    if (!validateForm() || connectionStatus !== DatasourceConnectionStatusEnum.SUCCESS) {
      toast.error(t('dataset.addDialog.testConnectionRequired'));
      return;
    }

    if (!datasetId) {
      toast.error(t('dataset.addDialog.datasetIdMissing'));
      return;
    }

    try {
      const updateDto = getSubmitData();
      await Datasets.modifyDataSource(datasetId, updateDto);
      toast.success(t('dataset.addDialog.addSuccess', { name: updateDto.name }));
      onOpenChange(false);
      onSuccess?.();
      resetForm();
    } catch (error: any) {
      console.error('Failed to add datasource:', error);
      toast.error(error?.message || t('dataset.addDialog.addFailed'));
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
            {t('dataset.addDialog.title')}
          </DialogTitle>
          <DialogDescription className='text-sm text-gray-500 dark:text-gray-400 mt-1'>
            {datasetName
              ? t('dataset.addDialog.descriptionWithName', { name: datasetName })
              : t('dataset.addDialog.descriptionGeneric')}
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
            {t('common.actions.cancel')}
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!canSubmit() || connectionStatus !== DatasourceConnectionStatusEnum.SUCCESS}
            className='bg-blue-500 hover:bg-blue-600 text-white'
          >
            <Database className='w-4 h-4 mr-2' />
            {t('dataset.addDialog.addButton')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
