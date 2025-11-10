import { Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { cn } from '@/components/ui/utils';
import { useLanguage } from '@/components/ui/LanguageProvider';
import Prompts from '../../services/Prompts';
import { Category, Prompt } from './types';
import { TAG_COLORS } from './constants';
import { usePromptForm } from './hooks/usePromptForm';
import { validatePromptForm, validateTag, isAvailableCategory } from './utils';

interface PromptDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingPrompt: Prompt | null;
  categories: Category[];
  defaultCategoryId?: string;
  onSuccess: () => void;
  getCategoryName: (cat: Category) => string;
}

export function PromptDialog({
  open,
  onOpenChange,
  editingPrompt,
  categories,
  defaultCategoryId,
  onSuccess,
  getCategoryName,
}: PromptDialogProps) {
  const { t, language } = useLanguage();
  const {
    formData,
    newTagLabel,
    newTagColor,
    setNewTagLabel,
    setNewTagColor,
    updateFormField,
    addTag: addTagToForm,
    removeTag,
  } = usePromptForm({
    editingPrompt,
    categories,
    defaultCategoryId,
    isDialogOpen: open,
  });

  const getTagColorDisplayName = (color: (typeof TAG_COLORS)[number]) =>
    language === 'zh-CN' ? color.name : color.nameEn;

  const handleAddTag = () => {
    const validation = validateTag(newTagLabel, formData.tags, language);
    if (!validation.isValid) {
      toast.error(validation.error);
      return;
    }
    addTagToForm(newTagLabel, newTagColor);
  };

  const handleSave = async () => {
    const validation = validatePromptForm(formData, language);
    if (!validation.isValid) {
      toast.error(validation.error);
      return;
    }

    try {
      if (editingPrompt) {
        await Prompts.updatePrompt(editingPrompt.id, {
          title: formData.title,
          content: formData.content,
          categoryId: formData.category,
          tags: formData.tags.map(t => t.label),
        });
        toast.success(language === 'zh-CN' ? '提示词已更新' : 'Prompt updated');
      } else {
        await Prompts.createPrompt({
          title: formData.title,
          content: formData.content,
          categoryId: formData.category,
          tags: formData.tags.map(t => t.label),
        });
        toast.success(language === 'zh-CN' ? '提示词已创建' : 'Prompt created');
      }
      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      console.error('保存提示词失败:', error);
      toast.error(error?.message || (language === 'zh-CN' ? '保存提示词失败' : 'Failed to save prompt'));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-2xl dark:bg-gray-800'>
        <DialogHeader>
          <DialogTitle className='dark:text-white'>
            {editingPrompt ? t('prompts.editPrompt') : t('prompts.newPrompt')}
          </DialogTitle>
          <DialogDescription>
            {editingPrompt
              ? language === 'zh-CN'
                ? '修改提示词信息'
                : 'Edit prompt information'
              : language === 'zh-CN'
                ? '创建一个新的提示词模板'
                : 'Create a new prompt template'}
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-4'>
          <div>
            <Label htmlFor='title' className='mb-1'>
              {t('prompts.promptTitle')}
            </Label>
            <Input
              id='title'
              value={formData.title}
              onChange={e => updateFormField('title', e.target.value)}
              placeholder={language === 'zh-CN' ? '输入提示词标题...' : 'Enter prompt title...'}
              className='dark:bg-gray-900 dark:border-gray-700'
            />
          </div>

          <div>
            <Label htmlFor='content' className='mb-1'>
              {t('prompts.promptContent')}
            </Label>
            <Textarea
              id='content'
              value={formData.content}
              onChange={e => updateFormField('content', e.target.value)}
              placeholder={language === 'zh-CN' ? '输入提示词内容...' : 'Enter prompt content...'}
              className='min-h-[200px] dark:bg-gray-900 dark:border-gray-700'
            />
          </div>

          <div>
            <Label htmlFor='category' className='mb-1'>
              {t('prompts.category')}
            </Label>
            <Select value={formData.category} onValueChange={value => updateFormField('category', value)}>
              <SelectTrigger className='dark:bg-gray-900 dark:border-gray-700'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className='dark:bg-gray-800 dark:border-gray-700'>
                {categories.filter(isAvailableCategory).map(cat => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {getCategoryName(cat)}
                  </SelectItem>
                ))}
                {categories.filter(isAvailableCategory).length === 0 && (
                  <SelectItem value={undefined} disabled>
                    {language === 'zh-CN' ? '暂无分类' : 'No categories'}
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className='mb-1'>{t('prompts.tags')}</Label>
            <div className='flex flex-wrap gap-2 mb-2'>
              {formData.tags.map((tag, index) => (
                <span key={index} className={cn('text-xs px-2 py-1 rounded-md flex items-center gap-1', tag.color)}>
                  {tag.label}
                  <button
                    onClick={() => removeTag(index)}
                    className='hover:bg-black/10 dark:hover:bg-white/10 rounded'
                    aria-label='Remove tag'
                  >
                    <X className='w-3 h-3' />
                  </button>
                </span>
              ))}
            </div>
            <div className='flex gap-2'>
              <Input
                value={newTagLabel}
                onChange={e => setNewTagLabel(e.target.value)}
                placeholder={t('prompts.tagName')}
                className='flex-1 dark:bg-gray-900 dark:border-gray-700'
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
              />
              <Select value={newTagColor} onValueChange={setNewTagColor}>
                <SelectTrigger className='w-32 dark:bg-gray-900 dark:border-gray-700'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className='dark:bg-gray-800 dark:border-gray-700'>
                  {TAG_COLORS.map(color => (
                    <SelectItem key={color.value} value={color.value}>
                      <div className='flex items-center gap-2'>
                        <div className={cn('w-3 h-3 rounded', color.value)} />
                        {getTagColorDisplayName(color)}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={handleAddTag} variant='outline'>
                <Plus className='w-4 h-4' />
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant='outline' onClick={() => onOpenChange(false)}>
            {t('common.actions.cancel')}
          </Button>
          <Button onClick={handleSave}>{editingPrompt ? t('common.actions.save') : t('common.actions.create')}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
