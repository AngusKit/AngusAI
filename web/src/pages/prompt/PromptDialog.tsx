import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { cn } from '@/components/ui/utils';
import { useLanguage } from '@/components/ui/LanguageProvider';
import Prompts from '../../services/Prompts';

const TAG_COLORS = [
  {
    name: '蓝色',
    nameEn: 'Blue',
    value: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  },
  {
    name: '紫色',
    nameEn: 'Purple',
    value: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  },
  {
    name: '绿色',
    nameEn: 'Green',
    value: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  },
  {
    name: '橙色',
    nameEn: 'Orange',
    value: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  },
  {
    name: '红色',
    nameEn: 'Red',
    value: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  },
  {
    name: '粉色',
    nameEn: 'Pink',
    value: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400',
  },
  {
    name: '青色',
    nameEn: 'Cyan',
    value: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400',
  },
  {
    name: '黄色',
    nameEn: 'Yellow',
    value: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  },
  {
    name: '靛青',
    nameEn: 'Indigo',
    value: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
  },
  {
    name: '紫罗兰',
    nameEn: 'Violet',
    value: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400',
  },
];

interface Category {
  id: string;
  name: string;
  nameEn: string;
  icon: any;
  color: string;
  isSystem?: boolean;
  parentId?: string;
  promptCount?: number;
}

interface Prompt {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: { label: string; color: string }[];
}

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
  const [promptForm, setPromptForm] = useState({
    title: '',
    content: '',
    category: '',
    tags: [] as { label: string; color: string }[],
  });
  const [newTagLabel, setNewTagLabel] = useState('');
  const [newTagColor, setNewTagColor] = useState(
    TAG_COLORS[0]?.value || 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
  );

  // 当对话框打开或编辑的提示词变化时，初始化表单
  useEffect(() => {
    if (open) {
      if (editingPrompt) {
        setPromptForm({
          title: editingPrompt.title,
          content: editingPrompt.content,
          category: editingPrompt.category,
          tags: [...editingPrompt.tags],
        });
      } else {
        setPromptForm({
          title: '',
          content: '',
          category: defaultCategoryId || '',
          tags: [],
        });
      }
      setNewTagLabel('');
      setNewTagColor(TAG_COLORS[0]?.value || 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400');
    }
  }, [open, editingPrompt, defaultCategoryId]);

  const getTagColorName = (color: (typeof TAG_COLORS)[0]) => (language === 'zh-CN' ? color.name : color.nameEn);

  const addTag = () => {
    if (!newTagLabel.trim()) {
      toast.error(language === 'zh-CN' ? '请输入标签名称' : 'Please enter tag name');
      return;
    }
    if (promptForm.tags.length >= 5) {
      toast.error(language === 'zh-CN' ? '最多添加5个标签' : 'Maximum 5 tags allowed');
      return;
    }
    setPromptForm(prev => ({
      ...prev,
      tags: [...prev.tags, { label: newTagLabel.trim(), color: newTagColor }],
    }));
    setNewTagLabel('');
    setNewTagColor(TAG_COLORS[0]?.value || 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400');
  };

  const removeTag = (index: number) => {
    setPromptForm(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index),
    }));
  };

  const handleSave = async () => {
    if (!promptForm.title.trim() || !promptForm.content.trim()) {
      toast.error(language === 'zh-CN' ? '请填写标题和内容' : 'Please fill in title and content');
      return;
    }

    const categoryId = promptForm.category;
    if (!categoryId) {
      toast.error(language === 'zh-CN' ? '请选择分类' : 'Please select a category');
      return;
    }

    try {
      if (editingPrompt) {
        // 编辑
        await Prompts.updatePrompt(editingPrompt.id, {
          title: promptForm.title,
          content: promptForm.content,
          categoryId,
          tags: promptForm.tags.map(t => t.label),
        });
        toast.success(language === 'zh-CN' ? '提示词已更新' : 'Prompt updated');
      } else {
        // 新建
        await Prompts.createPrompt({
          title: promptForm.title,
          content: promptForm.content,
          categoryId,
          tags: promptForm.tags.map(t => t.label),
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
            <Label htmlFor='title'>{t('prompts.promptTitle')}</Label>
            <Input
              id='title'
              value={promptForm.title}
              onChange={e => setPromptForm(prev => ({ ...prev, title: e.target.value }))}
              placeholder={language === 'zh-CN' ? '输入提示词标题...' : 'Enter prompt title...'}
              className='dark:bg-gray-900 dark:border-gray-700'
            />
          </div>

          <div>
            <Label htmlFor='content'>{t('prompts.promptContent')}</Label>
            <Textarea
              id='content'
              value={promptForm.content}
              onChange={e => setPromptForm(prev => ({ ...prev, content: e.target.value }))}
              placeholder={language === 'zh-CN' ? '输入提示词内容...' : 'Enter prompt content...'}
              className='min-h-[200px] dark:bg-gray-900 dark:border-gray-700'
            />
          </div>

          <div>
            <Label htmlFor='category'>{t('prompts.category')}</Label>
            <Select
              value={promptForm.category}
              onValueChange={value => setPromptForm(prev => ({ ...prev, category: value }))}
            >
              <SelectTrigger className='dark:bg-gray-900 dark:border-gray-700'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className='dark:bg-gray-800 dark:border-gray-700'>
                {categories
                  .filter(cat => cat.id !== 'all' && cat.id !== 'favorites' && !cat.isSystem)
                  .map(cat => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {getCategoryName(cat)}
                    </SelectItem>
                  ))}
                {categories.filter(cat => cat.id !== 'all' && cat.id !== 'favorites' && !cat.isSystem).length === 0 && (
                  <SelectItem value='' disabled>
                    {language === 'zh-CN' ? '暂无分类' : 'No categories'}
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>{t('prompts.tags')}</Label>
            <div className='flex flex-wrap gap-2 mb-2'>
              {promptForm.tags.map((tag, index) => (
                <span key={index} className={cn('text-xs px-2 py-1 rounded-md flex items-center gap-1', tag.color)}>
                  {tag.label}
                  <button
                    onClick={() => removeTag(index)}
                    className='hover:bg-black/10 dark:hover:bg-white/10 rounded'
                  >
                    <span className='sr-only'>Remove tag</span>
                    <svg className='w-3 h-3' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                    </svg>
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
                    addTag();
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
                        {getTagColorName(color)}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={addTag} variant='outline'>
                <Plus className='w-4 h-4' />
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant='outline' onClick={() => onOpenChange(false)}>
            {t('common.cancel')}
          </Button>
          <Button onClick={handleSave}>{editingPrompt ? t('common.save') : t('common.create')}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

