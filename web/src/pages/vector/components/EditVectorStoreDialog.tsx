/**
 * 编辑向量存储对话框组件
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
import { useLanguage } from '@/components/ui/LanguageProvider';
import { VectorStoreFormFields } from './VectorStoreFormFields';
import type { VectorStoreFormData } from '../types';

interface EditVectorStoreDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: VectorStoreFormData;
  onFormDataChange: (data: Partial<VectorStoreFormData>) => void;
  onSubmit: () => Promise<void>;
  onReset: () => void;
}

export function EditVectorStoreDialog({
  open,
  onOpenChange,
  formData,
  onFormDataChange,
  onSubmit,
  onReset,
}: EditVectorStoreDialogProps) {
  const { t } = useLanguage();

  const handleCancel = () => {
    onOpenChange(false);
    onReset();
  };

  const handleSubmit = async () => {
    await onSubmit();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-2xl dark:bg-gray-800'>
        <DialogHeader>
          <DialogTitle className='dark:text-white'>
            {t('vector.editDialog.title')}
          </DialogTitle>
          <DialogDescription>
            {t('vector.editDialog.description')}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className='max-h-[500px] pr-4'>
          <VectorStoreFormFields
            formData={formData}
            onFormDataChange={onFormDataChange}
            isEdit={true}
          />
        </ScrollArea>

        <DialogFooter>
          <Button variant='outline' onClick={handleCancel}>
            {t('common.actions.cancel')}
          </Button>
          <Button onClick={handleSubmit}>
            {t('common.actions.save')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

