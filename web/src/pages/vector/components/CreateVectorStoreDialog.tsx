/**
 * 创建向量存储对话框组件
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
import { ScrollArea } from '@/components/ui/scroll-area';
import { useLanguage } from '@/components/LanguageProvider.tsx';
import { VectorStoreFormFields } from './VectorStoreFormFields';
import type { VectorStoreFormData } from '../types';

interface CreateVectorStoreDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: VectorStoreFormData;
  onFormDataChange: (data: Partial<VectorStoreFormData>) => void;
  onSubmit: () => Promise<void>;
  onReset: () => void;
}

export function CreateVectorStoreDialog({
  open,
  onOpenChange,
  formData,
  onFormDataChange,
  onSubmit,
  onReset,
}: CreateVectorStoreDialogProps) {
  const { t } = useLanguage();

  const handleCancel = () => {
    onOpenChange(false);
    onReset();
  };

  const handleSubmit = async () => {
    await onSubmit();
  };

  const isFormValid =
    formData.name.trim() && formData.type && formData.endpoint.trim() && formData.dimension.trim();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-2xl dark:bg-gray-800'>
        <DialogHeader>
          <DialogTitle className='dark:text-white'>
            {t('vector.createDialog.title')}
          </DialogTitle>
          <DialogDescription>
            {t('vector.createDialog.description')}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className='max-h-[500px] pr-4'>
          <VectorStoreFormFields
            formData={formData}
            onFormDataChange={onFormDataChange}
            isEdit={false}
          />
        </ScrollArea>

        <DialogFooter>
          <Button variant='outline' onClick={handleCancel}>
            {t('common.actions.cancel')}
          </Button>
          <Button onClick={handleSubmit} disabled={!isFormValid}>
            {t('common.actions.create')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

