/**
 * 创建模型对话框组件
 */

import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useLanguage } from '@/components/LanguageProvider.tsx';
import { ModelFormFields } from './ModelFormFields';
import type { ModelFormData } from '../types';

interface CreateModelDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: ModelFormData;
  onFormDataChange: (data: Partial<ModelFormData>) => void;
  onSubmit: () => Promise<void>;
  onReset: () => void;
  providerOptions: Array<{ value: string; label: string }>;
}

export function CreateModelDialog({
  open,
  onOpenChange,
  formData,
  onFormDataChange,
  onSubmit,
  onReset,
  providerOptions,
}: CreateModelDialogProps) {
  const { t } = useLanguage();

  const handleCancel = () => {
    onOpenChange(false);
    onReset();
  };

  const handleSubmit = async () => {
    await onSubmit();
  };

  const isFormValid = formData.name.trim() && formData.provider && formData.version.trim();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className='bg-blue-500 hover:bg-blue-600'>
          <Plus className='w-4 h-4 mr-2' />
          {t('models.addModel')}
        </Button>
      </DialogTrigger>
      <DialogContent className='dark:bg-gray-800 dark:border-gray-700 sm:max-w-[600px] max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='dark:text-white'>
            {t('models.createDialog.title')}
          </DialogTitle>
          <DialogDescription className='dark:text-gray-400'>
            {t('models.createDialog.description')}
          </DialogDescription>
        </DialogHeader>

        <ModelFormFields
          formData={formData}
          onFormDataChange={onFormDataChange}
          providerOptions={providerOptions}
          isEdit={false}
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
            {t('models.addModel')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

