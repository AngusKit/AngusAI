/**
 * 编辑模型对话框组件
 */

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useLanguage } from '@/components/LanguageProvider.tsx';
import { ModelFormFields } from './ModelFormFields';
import type { ModelFormData } from '../types';

interface EditModelDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: ModelFormData;
  onFormDataChange: (data: Partial<ModelFormData>) => void;
  onSubmit: () => Promise<void>;
  onReset: () => void;
  providerOptions: Array<{ value: string; label: string }>;
}

export function EditModelDialog({
  open,
  onOpenChange,
  formData,
  onFormDataChange,
  onSubmit,
  onReset,
  providerOptions,
}: EditModelDialogProps) {
  const { t } = useLanguage();

  const handleCancel = () => {
    onOpenChange(false);
    onReset();
  };

  const handleSubmit = async () => {
    await onSubmit();
  };

  const isFormValid = formData.name.trim() && formData.provider;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='dark:bg-gray-800 dark:border-gray-700 sm:max-w-[600px] max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='dark:text-white'>
            {t('models.editDialog.title')}
          </DialogTitle>
          <DialogDescription className='dark:text-gray-400'>
            {t('models.editDialog.description')}
          </DialogDescription>
        </DialogHeader>

        <ModelFormFields
          formData={formData}
          onFormDataChange={onFormDataChange}
          providerOptions={providerOptions}
          isEdit={true}
        />

        <DialogFooter>
          <Button
            variant='outline'
            onClick={handleCancel}
            className='dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300'
          >
            {t('common.actions.cancel')}
          </Button>
          <Button onClick={handleSubmit} disabled={!isFormValid} className='bg-blue-500 hover:bg-blue-600'>
            {t('models.editDialog.saveButton')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

