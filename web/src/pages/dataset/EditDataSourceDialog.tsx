import { Database } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useEffect } from 'react';
import { toast } from 'sonner';
import Datasets from '@/services/Datasets';
import { useDataSourceForm } from './hooks/useDataSourceForm';
import { DataSourceFormContent } from './components/DataSourceFormContent';
import { useLanguage } from '@/components/ui/LanguageProvider';

interface EditDataSourceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  datasetName?: string;
  datasetId?: string;
  onSuccess?: () => void;
}

export function EditDataSourceDialog({
  open,
  onOpenChange,
  datasetName,
  datasetId,
  onSuccess,
}: EditDataSourceDialogProps) {
  const { t } = useLanguage();
  const {
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
  } = useDataSourceForm();

  // 加载数据源配置
  useEffect(() => {
    if (open && datasetId) {
      loadDataSourceConfig();
    } else if (!open) {
      resetForm();
    }
  }, [open, datasetId, resetForm]);

  const loadDataSourceConfig = async () => {
    if (!datasetId) return;

    setIsLoading(true);
    try {
      const response = await Datasets.getDatasetDetail(datasetId);
      const responseData = (response as any).data;

      if (responseData?.datasourceConfig) {
        loadFromConfig(responseData.datasourceConfig);
      } else {
        resetForm();
      }
    } catch (error: any) {
      console.error('Failed to load data source config:', error);
      toast.error(error?.message || t('dataset.editDialog.loadFailed'));
      resetForm();
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestConnection = async () => {
    await testConnection(datasetId);
  };

  const handleSubmit = async () => {
    if (!validateForm() || connectionStatus !== 'success') {
      toast.error(t('dataset.editDialog.testConnectionRequired'));
      return;
    }

    if (!datasetId) {
      toast.error(t('dataset.editDialog.datasetIdMissing'));
      return;
    }

    try {
      const updateDto = getSubmitData();
      await Datasets.modifyDataSource(datasetId, updateDto);
      toast.success(
        t('dataset.editDialog.updateSuccess', {
          name: updateDto.name,
        })
      );
      onOpenChange(false);
      onSuccess?.();
    } catch (error: any) {
      console.error('Failed to update data source:', error);
      toast.error(error?.message || t('dataset.editDialog.updateFailed'));
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
      <DialogContent 
        className='max-h-[90vh] overflow-hidden p-0 dark:bg-gray-900 dark:border-gray-700'
        style={{ width: '600px', maxWidth: '600px' }}
      >
        <DialogHeader className='px-6 py-4 border-b border-gray-200 dark:border-gray-700'>
          <DialogTitle className='flex items-center gap-3 text-xl dark:text-white'>
            <Database className='w-6 h-6 text-blue-500' />
            {t('dataset.editDialog.title')}
          </DialogTitle>
          <DialogDescription className='text-sm text-gray-500 dark:text-gray-400 mt-1'>
            {datasetName
              ? t('dataset.editDialog.descriptionWithName', { name: datasetName })
              : t('dataset.editDialog.descriptionGeneric')}
          </DialogDescription>
        </DialogHeader>

        <div className='px-6 py-4 overflow-y-auto max-h-[calc(90vh-180px)]'>
          {isLoading ? (
            <div className='flex items-center justify-center py-12'>
              <div className='w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin' />
              <span className='ml-3 text-sm text-gray-600 dark:text-gray-400'>
                {t('dataset.editDialog.loadingConfig')}
              </span>
            </div>
          ) : (
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
            {t('common.actions.cancel')}
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!canSubmit() || connectionStatus !== 'success' || isLoading}
            className='bg-blue-500 hover:bg-blue-600 text-white'
          >
            <Database className='w-4 h-4 mr-2' />
            {t('dataset.editDialog.saveButton')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

