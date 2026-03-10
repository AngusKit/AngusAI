import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, } from '@/components/ui/alert-dialog.tsx';
import { useLanguage } from '@/components/LanguageProvider.tsx';

interface Category {
  id: string;
  name: string;
  nameEn?: string;
}

interface DeleteCategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  deletingCategory: Category | null;
  onConfirm: () => void;
}

export function DeleteCategoryDialog({ open, onOpenChange, deletingCategory, onConfirm }: DeleteCategoryDialogProps) {
  const { t, language } = useLanguage();
  const categoryDisplayName =
    language === 'zh-CN' ? deletingCategory?.name : deletingCategory?.nameEn || deletingCategory?.name;
  const confirmText = t('prompts.deleteCategoryConfirm', { name: categoryDisplayName || '' });

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className='dark:bg-gray-800'>
        <AlertDialogHeader>
          <AlertDialogTitle className='dark:text-white'>{t('prompts.deleteCategory')}</AlertDialogTitle>
          <AlertDialogDescription>{confirmText}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => onOpenChange(false)}>{t('common.actions.cancel')}</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className='bg-red-600 hover:bg-red-700'>
            {t('common.actions.delete')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
