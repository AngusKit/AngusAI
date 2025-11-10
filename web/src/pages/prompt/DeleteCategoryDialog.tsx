import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, } from '@/components/ui/alert-dialog';
import { useLanguage } from '@/components/ui/LanguageProvider';

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

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className='dark:bg-gray-800'>
        <AlertDialogHeader>
          <AlertDialogTitle className='dark:text-white'>
            {language === 'zh-CN' ? '删除分类' : 'Delete Category'}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {language === 'zh-CN'
              ? `确定要删除"${deletingCategory?.name}"分类吗？该分类下的提示词将被移动到"编程开发"分类。此操作无法撤销。`
              : `Are you sure you want to delete the "${deletingCategory?.nameEn || deletingCategory?.name}" category? Prompts in this category will be moved to "Coding" category. This action cannot be undone.`}
          </AlertDialogDescription>
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
