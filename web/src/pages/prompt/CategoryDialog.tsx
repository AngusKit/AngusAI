import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { useLanguage } from '@/components/ui/LanguageProvider';
import { cn } from '@/components/ui/utils';
import PromptCategories from '../../services/PromptCategories';
import { Category } from './types';
import { AVAILABLE_ICONS, CATEGORY_COLORS, DEFAULT_VALUES } from './constants';
import { useCategoryForm } from './hooks/useCategoryForm';
import { validateCategoryName } from './utils';

interface CategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingCategory: Category | null;
  onSuccess: () => void;
  buildCategoryTree: (parentId: string | undefined, level: number, excludeId?: string) => Category[];
  getCategoryPath: (categoryId: string) => string[];
}

export function CategoryDialog({
  open,
  onOpenChange,
  editingCategory,
  onSuccess,
  buildCategoryTree,
  getCategoryPath,
}: CategoryDialogProps) {
  const { t, language } = useLanguage();
  const { formData, updateFormField, resetForm } = useCategoryForm({
    editingCategory,
    isDialogOpen: open,
  });

  const handleSave = async () => {
    const validation = validateCategoryName(formData.name);
    if (!validation.isValid) {
      toast.error(language === 'zh-CN' ? validation.error : 'Please enter category name');
      return;
    }

    try {
      // 找到图标名称
      const iconName = AVAILABLE_ICONS.find(icon => icon.component === formData.icon)?.name || 'BookOpen';
      const parentId = formData.parentId === DEFAULT_VALUES.PARENT_CATEGORY_NONE ? undefined : formData.parentId;

      if (editingCategory) {
        await PromptCategories.updatePromptCategory(editingCategory.id, {
          name: formData.name,
          icon: iconName,
          color: formData.color,
          parentId,
        });
        toast.success(language === 'zh-CN' ? '分类已更新' : 'Category updated');
      } else {
        await PromptCategories.createPromptCategory({
          name: formData.name,
          icon: iconName,
          color: formData.color,
          parentId,
        });
        toast.success(language === 'zh-CN' ? '分类已创建' : 'Category created');
      }

      onSuccess();
      onOpenChange(false);
      resetForm();
    } catch (error: any) {
      console.error('保存分类失败:', error);
      toast.error(error?.message || (language === 'zh-CN' ? '保存分类失败' : 'Failed to save category'));
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
    resetForm();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='dark:bg-gray-800'>
        <DialogHeader>
          <DialogTitle className='dark:text-white'>
            {editingCategory ? (language === 'zh-CN' ? '编辑分组' : 'Edit Category') : t('prompts.newCategory')}
          </DialogTitle>
          <DialogDescription>
            {editingCategory
              ? language === 'zh-CN'
                ? '修改提示词分组信息'
                : 'Edit prompt category information'
              : language === 'zh-CN'
                ? '创建一个新的提示词分组'
                : 'Create a new prompt category'}
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-4'>
          <div>
            <Label htmlFor='categoryName' className='mb-1'>{t('prompts.categoryName')}</Label>
            <Input
              id='categoryName'
              value={formData.name}
              onChange={e => updateFormField('name', e.target.value)}
              placeholder={language === 'zh-CN' ? '输入分组名称...' : 'Enter category name...'}
              className='dark:bg-gray-900 dark:border-gray-700'
            />
          </div>

          <div>
            <Label htmlFor='parentCategory' className='mb-1'>
              {language === 'zh-CN' ? '父分组（可选）' : 'Parent Category (Optional)'}
            </Label>
            <Select
              value={formData.parentId || DEFAULT_VALUES.PARENT_CATEGORY_NONE}
              onValueChange={value => updateFormField('parentId', value === DEFAULT_VALUES.PARENT_CATEGORY_NONE ? DEFAULT_VALUES.PARENT_CATEGORY_NONE : value)}
            >
              <SelectTrigger className='dark:bg-gray-900 dark:border-gray-700'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className='dark:bg-gray-800 dark:border-gray-700 max-h-[300px]'>
                <SelectItem value={DEFAULT_VALUES.PARENT_CATEGORY_NONE}>
                  {language === 'zh-CN' ? '无（作为顶层分组）' : 'None (Top-level category)'}
                </SelectItem>
                {buildCategoryTree(undefined, 0, editingCategory?.id).map(cat => {
                  const path = getCategoryPath(cat.id);
                  const level = path.length - 1;
                  return (
                    <SelectItem key={cat.id} value={cat.id}>
                      <div className='flex items-center gap-2'>
                        {level > 0 && (
                          <div className='flex items-center gap-1'>
                            {Array.from({ length: level }).map((_, i) => (
                              <div key={i} className='w-1.5 h-1.5 rounded-full bg-gray-400 dark:bg-gray-500' />
                            ))}
                          </div>
                        )}
                        <span>{cat.name}</span>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div>
              <Label htmlFor='categoryIcon' className='mb-1'>{language === 'zh-CN' ? '图标' : 'Icon'}</Label>
              <Select
                value={AVAILABLE_ICONS.find(icon => icon.component === formData.icon)?.name || 'BookOpen'}
                onValueChange={value => {
                  const selectedIcon = AVAILABLE_ICONS.find(icon => icon.name === value);
                  if (selectedIcon) {
                    updateFormField('icon', selectedIcon.component);
                  }
                }}
              >
                <SelectTrigger className='dark:bg-gray-900 dark:border-gray-700'>
                  <SelectValue placeholder={language === 'zh-CN' ? '选择图标' : 'Select icon'} />
                </SelectTrigger>
                <SelectContent className='dark:bg-gray-800 dark:border-gray-700 max-h-[300px]'>
                  <ScrollArea className='h-[250px]'>
                    <div className='grid grid-cols-2 gap-1 p-2'>
                      {AVAILABLE_ICONS.map(icon => {
                        const IconComponent = icon.component;
                        return (
                          <SelectItem key={icon.name} value={icon.name} className='cursor-pointer'>
                            <div className='flex items-center gap-2'>
                              <IconComponent className='w-4 h-4' />
                              <span>{icon.label}</span>
                            </div>
                          </SelectItem>
                        );
                      })}
                    </div>
                  </ScrollArea>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor='categoryColor' className='mb-1'>{language === 'zh-CN' ? '颜色' : 'Color'}</Label>
              <Select
                value={formData.color}
                onValueChange={value => updateFormField('color', value)}
              >
                <SelectTrigger className='dark:bg-gray-900 dark:border-gray-700'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className='dark:bg-gray-800 dark:border-gray-700'>
                  {CATEGORY_COLORS.map(color => (
                    <SelectItem key={color.value} value={color.value}>
                      <div className='flex items-center gap-2'>
                        <div className={cn('w-3 h-3 rounded', color.colorClass)} />
                        {language === 'zh-CN' ? color.label : color.labelEn}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant='outline' onClick={handleCancel}>
            {t('common.cancel')}
          </Button>
          <Button onClick={handleSave}>{editingCategory ? t('common.save') : t('common.create')}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

