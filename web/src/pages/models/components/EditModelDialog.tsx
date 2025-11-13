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
import { useLanguage } from '@/components/ui/LanguageProvider';
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
  const { language } = useLanguage();

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
      <DialogContent className='dark:bg-gray-800 dark:border-gray-700 sm:max-w-[600px] max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='dark:text-white'>
            {language === 'zh-CN' ? '编辑模型配置' : 'Edit Model Configuration'}
          </DialogTitle>
          <DialogDescription className='dark:text-gray-400'>
            {language === 'zh-CN' ? '修改模型的配置信息' : 'Modify model configuration'}
          </DialogDescription>
        </DialogHeader>

        <ModelFormFields
          formData={formData}
          onFormDataChange={onFormDataChange}
          language={language}
          providerOptions={providerOptions}
          isEdit={true}
        />

        <DialogFooter>
          <Button
            variant='outline'
            onClick={handleCancel}
            className='dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300'
          >
            {language === 'zh-CN' ? '取消' : 'Cancel'}
          </Button>
          <Button onClick={handleSubmit} disabled={!isFormValid} className='bg-blue-500 hover:bg-blue-600'>
            {language === 'zh-CN' ? '保存修改' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

