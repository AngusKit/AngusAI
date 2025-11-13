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
import { useLanguage } from '@/components/ui/LanguageProvider';
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
      <DialogTrigger asChild>
        <Button className='bg-blue-500 hover:bg-blue-600'>
          <Plus className='w-4 h-4 mr-2' />
          {language === 'zh-CN' ? '添加模型' : 'Add Model'}
        </Button>
      </DialogTrigger>
      <DialogContent className='dark:bg-gray-800 dark:border-gray-700 sm:max-w-[600px] max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='dark:text-white'>
            {language === 'zh-CN' ? '添加新模型' : 'Add New Model'}
          </DialogTitle>
          <DialogDescription className='dark:text-gray-400'>
            {language === 'zh-CN' ? '配置并添加一个新的AI模型到您的工作空间' : 'Configure and add a new AI model to your workspace'}
          </DialogDescription>
        </DialogHeader>

        <ModelFormFields
          formData={formData}
          onFormDataChange={onFormDataChange}
          language={language}
          providerOptions={providerOptions}
          isEdit={false}
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
            {language === 'zh-CN' ? '添加模型' : 'Add Model'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

