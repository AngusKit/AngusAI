import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useLanguage } from '@/components/ui/LanguageProvider';

interface Prompt {
  id: string;
  title: string;
  isSystem?: boolean;
}

interface DeletePromptDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  deletingPrompt: Prompt | null;
  onConfirm: () => void;
}

export function DeletePromptDialog({ open, onOpenChange, deletingPrompt, onConfirm }: DeletePromptDialogProps) {
  const { t } = useLanguage();

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className='dark:bg-gray-800'>
        <AlertDialogHeader>
          <AlertDialogTitle className='dark:text-white'>{t('prompts.deletePrompt')}</AlertDialogTitle>
          <AlertDialogDescription>{t('prompts.confirmDelete')}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => onOpenChange(false)}>{t('common.cancel')}</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className='bg-red-600 hover:bg-red-700'>
            {t('common.delete')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

