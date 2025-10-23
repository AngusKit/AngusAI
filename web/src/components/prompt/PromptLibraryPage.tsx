import {
  Search,
  Star,
  Copy,
  Plus,
  Trash2,
  Edit,
  Sparkles,
  BookOpen,
  Code,
  MessageSquare,
  TrendingUp,
  FolderPlus,
  Check,
  Shield,
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../ui/dialog';
import { ScrollArea } from '../ui/scroll-area';
import { Badge } from '../ui/badge';
import { Label } from '../ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';
import { useState } from 'react';
import { toast } from 'sonner';
import { cn } from '../ui/utils';
import { useLanguage } from '../layout/LanguageProvider';
import { copyToClipboard } from '../../lib/clipboard';

interface Prompt {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: { label: string; color: string }[];
  isFavorite: boolean;
  usageCount: number;
  isSystem?: boolean; // 是否为系统模板
}

interface Category {
  id: string;
  name: string;
  nameEn: string;
  icon: any;
  color: string;
  isSystem?: boolean; // 是否为系统分类
}

const TAG_COLORS = [
  {
    name: '蓝色',
    nameEn: 'Blue',
    value: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  },
  {
    name: '紫色',
    nameEn: 'Purple',
    value:
      'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  },
  {
    name: '绿色',
    nameEn: 'Green',
    value:
      'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  },
  {
    name: '橙色',
    nameEn: 'Orange',
    value:
      'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
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
    value:
      'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  },
  {
    name: '靛青',
    nameEn: 'Indigo',
    value:
      'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
  },
  {
    name: '紫罗兰',
    nameEn: 'Violet',
    value:
      'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400',
  },
];

export function PromptLibraryPage() {
  const { t, language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categories, setCategories] = useState<Category[]>([
    {
      id: 'all',
      name: '全部',
      nameEn: 'All',
      icon: Sparkles,
      color: 'text-gray-700 dark:text-gray-300',
      isSystem: true,
    },
    {
      id: 'favorites',
      name: '收藏',
      nameEn: 'Favorites',
      icon: Star,
      color: 'text-yellow-600 dark:text-yellow-500',
      isSystem: true,
    },
    {
      id: 'coding',
      name: '编程开发',
      nameEn: 'Coding',
      icon: Code,
      color: 'text-blue-600 dark:text-blue-400',
      isSystem: true,
    },
    {
      id: 'writing',
      name: '写作',
      nameEn: 'Writing',
      icon: BookOpen,
      color: 'text-green-600 dark:text-green-400',
      isSystem: true,
    },
    {
      id: 'marketing',
      name: '营销',
      nameEn: 'Marketing',
      icon: TrendingUp,
      color: 'text-purple-600 dark:text-purple-400',
      isSystem: true,
    },
    {
      id: 'productivity',
      name: '生产力',
      nameEn: 'Productivity',
      icon: MessageSquare,
      color: 'text-orange-600 dark:text-orange-400',
      isSystem: true,
    },
    {
      id: 'custom-1',
      name: '我的自定义分类',
      nameEn: 'My Custom Category',
      icon: BookOpen,
      color: 'text-pink-600 dark:text-pink-400',
      isSystem: false,
    },
  ]);

  const [prompts, setPrompts] = useState<Prompt[]>([
    {
      id: '1',
      title: '代码审查助手',
      content:
        '请帮我审查以下代码，指出潜在的问题、性能优化点和最佳实践建议：\n\n[粘贴代码]',
      category: 'coding',
      tags: [
        {
          label: '代码',
          color:
            'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
        },
        {
          label: '审查',
          color:
            'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
        },
        {
          label: '优化',
          color:
            'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
        },
      ],
      isFavorite: true,
      usageCount: 156,
      isSystem: true,
    },
    {
      id: '2',
      title: '文章摘要生成',
      content:
        '请为以下文章生成一个简洁的摘要，突出关键要点（不超过150字）：\n\n[粘贴文章]',
      category: 'writing',
      tags: [
        {
          label: '写作',
          color:
            'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
        },
        {
          label: '摘要',
          color:
            'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400',
        },
        {
          label: '总结',
          color:
            'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
        },
      ],
      isFavorite: false,
      usageCount: 89,
      isSystem: true,
    },
    {
      id: '3',
      title: 'SQL 查询优化',
      content:
        '请帮我优化以下 SQL 查询，提升查询性能，并解释优化原理：\n\n[粘贴SQL]',
      category: 'coding',
      tags: [
        {
          label: 'SQL',
          color:
            'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
        },
        {
          label: '数据库',
          color:
            'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
        },
        {
          label: '优化',
          color:
            'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
        },
      ],
      isFavorite: true,
      usageCount: 203,
      isSystem: true,
    },
    {
      id: '4',
      title: '营销文案创作',
      content:
        '请为 [产品名称] 创作一段吸引人的营销文案，要求：\n- 突出产品核心卖点\n- 语言简洁有力\n- 包含行动号召\n\n产品信息：[填写产品信息]',
      category: 'marketing',
      tags: [
        {
          label: '营销',
          color:
            'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
        },
        {
          label: '文案',
          color:
            'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400',
        },
        {
          label: '创意',
          color:
            'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
        },
      ],
      isFavorite: false,
      usageCount: 124,
      isSystem: true,
    },
    {
      id: '5',
      title: 'Bug 分析助手',
      content:
        '我遇到了一个问题，以下是错误信息和相关代码：\n\n错误信息：[粘贴错误]\n\n相关代码：[粘贴代码]\n\n请帮我分析问题原因并提供解决方案。',
      category: 'coding',
      tags: [
        {
          label: '调试',
          color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
        },
        {
          label: 'Bug',
          color:
            'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
        },
        {
          label: '问题解决',
          color:
            'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
        },
      ],
      isFavorite: true,
      usageCount: 267,
      isSystem: true,
    },
    {
      id: '6',
      title: '会议纪要整理',
      content:
        '请根据以下会议记录，整理成结构化的会议纪要，包括：\n- 会议主题\n- 关键讨论点\n- 决策事项\n- 行动项和负责人\n\n会议记录：[粘贴记录]',
      category: 'productivity',
      tags: [
        {
          label: '会议',
          color:
            'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
        },
        {
          label: '纪要',
          color:
            'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400',
        },
        {
          label: '整理',
          color:
            'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
        },
      ],
      isFavorite: false,
      usageCount: 78,
      isSystem: true,
    },
    {
      id: '7',
      title: '我的自定义提示词',
      content:
        '这是一个用户创建的自定义提示词示例。用户可以自由编辑和删除此类提示词。',
      category: 'productivity',
      tags: [
        {
          label: '自定义',
          color:
            'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
        },
      ],
      isFavorite: false,
      usageCount: 5,
      isSystem: false,
    },
  ]);

  // 对话框状态
  const [showPromptDialog, setShowPromptDialog] = useState(false);
  const [showCategoryDialog, setShowCategoryDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showDeleteCategoryDialog, setShowDeleteCategoryDialog] =
    useState(false);
  const [editingPrompt, setEditingPrompt] = useState<Prompt | null>(null);
  const [deletingPrompt, setDeletingPrompt] = useState<Prompt | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(
    null
  );

  // 表单状态
  const [promptForm, setPromptForm] = useState({
    title: '',
    content: '',
    category: 'coding',
    tags: [] as { label: string; color: string }[],
  });
  const [newTagLabel, setNewTagLabel] = useState('');
  const [newTagColor, setNewTagColor] = useState(TAG_COLORS[0].value);

  const [categoryForm, setCategoryForm] = useState({
    name: '',
    nameEn: '',
    icon: 'BookOpen',
    color: 'text-blue-600 dark:text-blue-400',
  });

  const filteredPrompts = prompts.filter(prompt => {
    const matchesSearch =
      prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prompt.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prompt.tags.some(tag =>
        tag.label.toLowerCase().includes(searchQuery.toLowerCase())
      );
    const matchesCategory =
      selectedCategory === 'all' ||
      (selectedCategory === 'favorites' && prompt.isFavorite) ||
      prompt.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryCount = (categoryId: string) => {
    if (categoryId === 'all') return prompts.length;
    if (categoryId === 'favorites')
      return prompts.filter(p => p.isFavorite).length;
    return prompts.filter(p => p.category === categoryId).length;
  };

  const toggleFavorite = (id: string) => {
    setPrompts(prev =>
      prev.map(p => (p.id === id ? { ...p, isFavorite: !p.isFavorite } : p))
    );
    toast.success(
      language === 'zh-CN' ? '已更新收藏状态' : 'Favorite status updated'
    );
  };

  const copyPrompt = async (content: string) => {
    const success = await copyToClipboard(content);
    if (success) {
      toast.success(
        language === 'zh-CN' ? '已复制到剪贴板' : 'Copied to clipboard'
      );
    } else {
      toast.error(language === 'zh-CN' ? '复制失败' : 'Copy failed');
    }
  };

  const usePrompt = (prompt: Prompt) => {
    setPrompts(prev =>
      prev.map(p =>
        p.id === prompt.id ? { ...p, usageCount: p.usageCount + 1 } : p
      )
    );
    copyPrompt(prompt.content);
    toast.success(language === 'zh-CN' ? '提示词已复制' : 'Prompt copied');
  };

  const duplicatePrompt = (prompt: Prompt) => {
    const newPrompt: Prompt = {
      ...prompt,
      id: Date.now().toString(),
      title: `${prompt.title} ${language === 'zh-CN' ? '(副本)' : '(Copy)'}`,
      usageCount: 0,
      isSystem: false, // 复制的提示词不是系统模板
    };
    setPrompts(prev => [newPrompt, ...prev]);
    toast.success(language === 'zh-CN' ? '已复制提示词' : 'Prompt duplicated');
  };

  const openCreateDialog = () => {
    setEditingPrompt(null);
    setPromptForm({
      title: '',
      content: '',
      category:
        selectedCategory === 'all' || selectedCategory === 'favorites'
          ? 'coding'
          : selectedCategory,
      tags: [],
    });
    setShowPromptDialog(true);
  };

  const openEditDialog = (prompt: Prompt) => {
    // 检查是否为系统模板
    if (prompt.isSystem) {
      toast.error(
        language === 'zh-CN'
          ? '系统模板不可编辑，可以复制后修改'
          : 'System templates cannot be edited, please duplicate and modify'
      );
      return;
    }
    setEditingPrompt(prompt);
    setPromptForm({
      title: prompt.title,
      content: prompt.content,
      category: prompt.category,
      tags: [...prompt.tags],
    });
    setShowPromptDialog(true);
  };

  const handleSavePrompt = () => {
    if (!promptForm.title.trim() || !promptForm.content.trim()) {
      toast.error(
        language === 'zh-CN'
          ? '请填写标题和内容'
          : 'Please fill in title and content'
      );
      return;
    }

    if (editingPrompt) {
      // 编辑
      setPrompts(prev =>
        prev.map(p => (p.id === editingPrompt.id ? { ...p, ...promptForm } : p))
      );
      toast.success(language === 'zh-CN' ? '提示词已更新' : 'Prompt updated');
    } else {
      // 新建
      const newPrompt: Prompt = {
        id: Date.now().toString(),
        ...promptForm,
        isFavorite: false,
        usageCount: 0,
        isSystem: false, // 用户创建的提示词不是系统模板
      };
      setPrompts(prev => [newPrompt, ...prev]);
      toast.success(language === 'zh-CN' ? '提示词已创建' : 'Prompt created');
    }

    setShowPromptDialog(false);
  };

  const handleDeletePrompt = () => {
    if (deletingPrompt) {
      // 检查是否为系统模板
      if (deletingPrompt.isSystem) {
        toast.error(
          language === 'zh-CN'
            ? '系统模板不可删除'
            : 'System templates cannot be deleted'
        );
        setShowDeleteDialog(false);
        setDeletingPrompt(null);
        return;
      }
      setPrompts(prev => prev.filter(p => p.id !== deletingPrompt.id));
      toast.success(language === 'zh-CN' ? '提示词已删除' : 'Prompt deleted');
      setShowDeleteDialog(false);
      setDeletingPrompt(null);
    }
  };

  const addTag = () => {
    if (!newTagLabel.trim()) {
      toast.error(
        language === 'zh-CN' ? '请输入标签名称' : 'Please enter tag name'
      );
      return;
    }
    if (promptForm.tags.length >= 5) {
      toast.error(
        language === 'zh-CN' ? '最多添加5个标签' : 'Maximum 5 tags allowed'
      );
      return;
    }
    setPromptForm(prev => ({
      ...prev,
      tags: [...prev.tags, { label: newTagLabel.trim(), color: newTagColor }],
    }));
    setNewTagLabel('');
    setNewTagColor(TAG_COLORS[0].value);
  };

  const removeTag = (index: number) => {
    setPromptForm(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index),
    }));
  };

  const handleCreateCategory = () => {
    if (!categoryForm.name.trim()) {
      toast.error(
        language === 'zh-CN' ? '请输入分类名称' : 'Please enter category name'
      );
      return;
    }
    const newCategory: Category = {
      id: `custom-${Date.now()}`,
      name: categoryForm.name,
      nameEn: categoryForm.nameEn || categoryForm.name,
      icon: BookOpen,
      color: categoryForm.color,
      isSystem: false, // 用户创建的分类不是系统分类
    };
    setCategories(prev => [...prev, newCategory]);
    toast.success(language === 'zh-CN' ? '分类已创建' : 'Category created');
    setShowCategoryDialog(false);
    setCategoryForm({
      name: '',
      nameEn: '',
      icon: 'BookOpen',
      color: 'text-blue-600 dark:text-blue-400',
    });
  };

  const handleDeleteCategory = () => {
    if (deletingCategory) {
      // 检查是否为系统分类
      if (deletingCategory.isSystem) {
        toast.error(
          language === 'zh-CN'
            ? '系统分类不可删除'
            : 'System categories cannot be deleted'
        );
        setShowDeleteCategoryDialog(false);
        setDeletingCategory(null);
        return;
      }

      // 检查分类下是否有提示词
      const promptsInCategory = prompts.filter(
        p => p.category === deletingCategory.id
      );
      if (promptsInCategory.length > 0) {
        // 将该分类下的提示词移动到"编程开发"分类
        setPrompts(prev =>
          prev.map(p =>
            p.category === deletingCategory.id
              ? { ...p, category: 'coding' }
              : p
          )
        );
      }

      // 删除分类
      setCategories(prev => prev.filter(c => c.id !== deletingCategory.id));

      // 如果当前选中的是被删除的分类，切换到"全部"
      if (selectedCategory === deletingCategory.id) {
        setSelectedCategory('all');
      }

      toast.success(language === 'zh-CN' ? '分类已删除' : 'Category deleted');
      setShowDeleteCategoryDialog(false);
      setDeletingCategory(null);
    }
  };

  const getCategoryName = (cat: Category) =>
    language === 'zh-CN' ? cat.name : cat.nameEn;
  const getTagColorName = (color: (typeof TAG_COLORS)[0]) =>
    language === 'zh-CN' ? color.name : color.nameEn;

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='dark:text-white mb-1'>{t('prompts.title')}</h1>
          <p className='text-sm text-gray-600 dark:text-gray-400'>
            {language === 'zh-CN'
              ? '管理和使用您的提示词模板'
              : 'Manage and use your prompt templates'}
          </p>
        </div>
        <div className='flex gap-3'>
          <Button
            onClick={() => setShowCategoryDialog(true)}
            variant='outline'
            className='gap-2'
          >
            <FolderPlus className='w-4 h-4' />
            {t('prompts.newCategory')}
          </Button>
          <Button onClick={openCreateDialog} className='gap-2'>
            <Plus className='w-4 h-4' />
            {t('prompts.newPrompt')}
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className='relative w-full max-w-md'>
        <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400' />
        <Input
          placeholder={t('prompts.search')}
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className='pl-10 dark:bg-gray-800 dark:border-gray-700'
        />
      </div>

      <div className='flex gap-6'>
        {/* Categories Sidebar */}
        <div className='w-64 shrink-0'>
          <div className='bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4'>
            <div className='space-y-1'>
              {categories.map(category => {
                const Icon = category.icon;
                const count = getCategoryCount(category.id);
                return (
                  <div
                    key={category.id}
                    className={cn(
                      'group w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors',
                      selectedCategory === category.id
                        ? 'bg-blue-50 dark:bg-blue-900/20'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-750'
                    )}
                  >
                    <button
                      onClick={() => setSelectedCategory(category.id)}
                      className='flex-1 flex items-center justify-between'
                    >
                      <div className='flex items-center gap-2'>
                        <Icon
                          className={cn(
                            'w-4 h-4',
                            category.color,
                            selectedCategory === category.id &&
                              'text-blue-600 dark:text-blue-400'
                          )}
                        />
                        <span
                          className={cn(
                            'text-sm',
                            selectedCategory === category.id
                              ? 'text-blue-600 dark:text-blue-400'
                              : 'text-gray-700 dark:text-gray-300'
                          )}
                        >
                          {getCategoryName(category)}
                        </span>
                      </div>
                      <Badge variant='secondary' className='text-xs'>
                        {count}
                      </Badge>
                    </button>
                    {!category.isSystem && (
                      <Button
                        variant='ghost'
                        size='icon'
                        className='h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity ml-1'
                        onClick={e => {
                          e.stopPropagation();
                          setDeletingCategory(category);
                          setShowDeleteCategoryDialog(true);
                        }}
                      >
                        <Trash2 className='w-3 h-3 text-red-600' />
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Prompts List */}
        <div className='flex-1'>
          <ScrollArea className='h-[calc(100vh-280px)]'>
            <div className='space-y-4'>
              {filteredPrompts.length === 0 ? (
                <div className='text-center py-20 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg'>
                  <Sparkles className='w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-gray-600' />
                  <p className='text-gray-500 dark:text-gray-400'>
                    {searchQuery
                      ? t('prompts.noResults')
                      : t('prompts.noPrompts')}
                  </p>
                </div>
              ) : (
                filteredPrompts.map(prompt => (
                  <div
                    key={prompt.id}
                    className='p-5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow'
                  >
                    <div className='flex items-start justify-between mb-3'>
                      <div className='flex-1'>
                        <div className='flex items-center gap-2 mb-2'>
                          <h3 className='dark:text-white'>{prompt.title}</h3>
                          {prompt.isSystem && (
                            <Badge
                              variant='secondary'
                              className='text-xs gap-1'
                            >
                              <Shield className='w-3 h-3' />
                              {language === 'zh-CN' ? '系统' : 'System'}
                            </Badge>
                          )}
                          <Badge variant='outline' className='text-xs'>
                            {language === 'zh-CN' ? '使用' : ''}{' '}
                            {prompt.usageCount}{' '}
                            {language === 'zh-CN' ? '次' : 'uses'}
                          </Badge>
                        </div>
                        <div className='flex flex-wrap gap-1.5'>
                          {prompt.tags.map((tag, index) => (
                            <span
                              key={index}
                              className={cn(
                                'text-xs px-2 py-1 rounded-md',
                                tag.color
                              )}
                            >
                              {tag.label}
                            </span>
                          ))}
                        </div>
                      </div>
                      <Button
                        variant='ghost'
                        size='icon'
                        onClick={() => toggleFavorite(prompt.id)}
                      >
                        <Star
                          className={cn(
                            'w-4 h-4',
                            prompt.isFavorite &&
                              'fill-yellow-400 text-yellow-400'
                          )}
                        />
                      </Button>
                    </div>

                    <p className='text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3 whitespace-pre-wrap'>
                      {prompt.content}
                    </p>

                    <div className='flex items-center gap-2'>
                      <Button
                        size='sm'
                        onClick={() => usePrompt(prompt)}
                        className='min-w-[120px]'
                      >
                        {t('prompts.use')}
                      </Button>
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() => copyPrompt(prompt.content)}
                        className='gap-2'
                      >
                        <Copy className='w-3 h-3' />
                        {t('common.copy')}
                      </Button>
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() => duplicatePrompt(prompt)}
                        className='gap-2'
                      >
                        <Copy className='w-3 h-3' />
                        {language === 'zh-CN' ? '副本' : 'Duplicate'}
                      </Button>
                      {/* 只显示非系统模板的编辑和删除按钮 */}
                      {!prompt.isSystem && (
                        <>
                          <Button
                            variant='ghost'
                            size='icon'
                            className='h-8 w-8'
                            onClick={() => openEditDialog(prompt)}
                          >
                            <Edit className='w-4 h-4' />
                          </Button>
                          <Button
                            variant='ghost'
                            size='icon'
                            className='h-8 w-8 text-red-600'
                            onClick={() => {
                              setDeletingPrompt(prompt);
                              setShowDeleteDialog(true);
                            }}
                          >
                            <Trash2 className='w-4 h-4' />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* 新建/编辑提示词对话框 */}
      <Dialog open={showPromptDialog} onOpenChange={setShowPromptDialog}>
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
                onChange={e =>
                  setPromptForm(prev => ({ ...prev, title: e.target.value }))
                }
                placeholder={
                  language === 'zh-CN'
                    ? '输入提示词标题...'
                    : 'Enter prompt title...'
                }
                className='dark:bg-gray-750 dark:border-gray-600'
              />
            </div>

            <div>
              <Label htmlFor='content'>{t('prompts.promptContent')}</Label>
              <Textarea
                id='content'
                value={promptForm.content}
                onChange={e =>
                  setPromptForm(prev => ({ ...prev, content: e.target.value }))
                }
                placeholder={
                  language === 'zh-CN'
                    ? '输入提示词内容...'
                    : 'Enter prompt content...'
                }
                className='min-h-[200px] dark:bg-gray-750 dark:border-gray-600'
              />
            </div>

            <div>
              <Label htmlFor='category'>{t('prompts.category')}</Label>
              <Select
                value={promptForm.category}
                onValueChange={value =>
                  setPromptForm(prev => ({ ...prev, category: value }))
                }
              >
                <SelectTrigger className='dark:bg-gray-750 dark:border-gray-600'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className='dark:bg-gray-800 dark:border-gray-700'>
                  {categories
                    .filter(cat => cat.id !== 'all' && cat.id !== 'favorites')
                    .map(cat => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {getCategoryName(cat)}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>{t('prompts.tags')}</Label>
              <div className='flex flex-wrap gap-2 mb-2'>
                {promptForm.tags.map((tag, index) => (
                  <span
                    key={index}
                    className={cn(
                      'text-xs px-2 py-1 rounded-md flex items-center gap-1',
                      tag.color
                    )}
                  >
                    {tag.label}
                    <button
                      onClick={() => removeTag(index)}
                      className='hover:bg-black/10 dark:hover:bg-white/10 rounded'
                    >
                      <span className='sr-only'>Remove tag</span>
                      <svg
                        className='w-3 h-3'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M6 18L18 6M6 6l12 12'
                        />
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
                  className='flex-1 dark:bg-gray-750 dark:border-gray-600'
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                />
                <Select value={newTagColor} onValueChange={setNewTagColor}>
                  <SelectTrigger className='w-32 dark:bg-gray-750 dark:border-gray-600'>
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
            <Button
              variant='outline'
              onClick={() => setShowPromptDialog(false)}
            >
              {t('common.cancel')}
            </Button>
            <Button onClick={handleSavePrompt}>
              {editingPrompt ? t('common.save') : t('common.create')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 新建分组对话框 */}
      <Dialog open={showCategoryDialog} onOpenChange={setShowCategoryDialog}>
        <DialogContent className='dark:bg-gray-800'>
          <DialogHeader>
            <DialogTitle className='dark:text-white'>
              {t('prompts.newCategory')}
            </DialogTitle>
            <DialogDescription>
              {language === 'zh-CN'
                ? '创建一个新的提示词分组'
                : 'Create a new prompt category'}
            </DialogDescription>
          </DialogHeader>

          <div className='space-y-4'>
            <div>
              <Label htmlFor='categoryName'>{t('prompts.categoryName')}</Label>
              <Input
                id='categoryName'
                value={categoryForm.name}
                onChange={e =>
                  setCategoryForm(prev => ({ ...prev, name: e.target.value }))
                }
                placeholder={
                  language === 'zh-CN'
                    ? '输入中文分组名称...'
                    : 'Enter category name...'
                }
                className='dark:bg-gray-750 dark:border-gray-600'
              />
            </div>

            {language === 'zh-CN' && (
              <div>
                <Label htmlFor='categoryNameEn'>
                  {language === 'zh-CN'
                    ? '英文名称（可选）'
                    : 'English Name (Optional)'}
                </Label>
                <Input
                  id='categoryNameEn'
                  value={categoryForm.nameEn}
                  onChange={e =>
                    setCategoryForm(prev => ({
                      ...prev,
                      nameEn: e.target.value,
                    }))
                  }
                  placeholder='Enter English name...'
                  className='dark:bg-gray-750 dark:border-gray-600'
                />
              </div>
            )}

            <div>
              <Label htmlFor='categoryColor'>
                {language === 'zh-CN' ? '颜色' : 'Color'}
              </Label>
              <Select
                value={categoryForm.color}
                onValueChange={value =>
                  setCategoryForm(prev => ({ ...prev, color: value }))
                }
              >
                <SelectTrigger className='dark:bg-gray-750 dark:border-gray-600'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className='dark:bg-gray-800 dark:border-gray-700'>
                  <SelectItem value='text-blue-600 dark:text-blue-400'>
                    <div className='flex items-center gap-2'>
                      <div className='w-3 h-3 rounded bg-blue-500' />
                      {language === 'zh-CN' ? '蓝色' : 'Blue'}
                    </div>
                  </SelectItem>
                  <SelectItem value='text-green-600 dark:text-green-400'>
                    <div className='flex items-center gap-2'>
                      <div className='w-3 h-3 rounded bg-green-500' />
                      {language === 'zh-CN' ? '绿色' : 'Green'}
                    </div>
                  </SelectItem>
                  <SelectItem value='text-purple-600 dark:text-purple-400'>
                    <div className='flex items-center gap-2'>
                      <div className='w-3 h-3 rounded bg-purple-500' />
                      {language === 'zh-CN' ? '紫色' : 'Purple'}
                    </div>
                  </SelectItem>
                  <SelectItem value='text-orange-600 dark:text-orange-400'>
                    <div className='flex items-center gap-2'>
                      <div className='w-3 h-3 rounded bg-orange-500' />
                      {language === 'zh-CN' ? '橙色' : 'Orange'}
                    </div>
                  </SelectItem>
                  <SelectItem value='text-red-600 dark:text-red-400'>
                    <div className='flex items-center gap-2'>
                      <div className='w-3 h-3 rounded bg-red-500' />
                      {language === 'zh-CN' ? '红色' : 'Red'}
                    </div>
                  </SelectItem>
                  <SelectItem value='text-pink-600 dark:text-pink-400'>
                    <div className='flex items-center gap-2'>
                      <div className='w-3 h-3 rounded bg-pink-500' />
                      {language === 'zh-CN' ? '粉色' : 'Pink'}
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => setShowCategoryDialog(false)}
            >
              {t('common.cancel')}
            </Button>
            <Button onClick={handleCreateCategory}>{t('common.create')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 删除提示词确认对话框 */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className='dark:bg-gray-800'>
          <AlertDialogHeader>
            <AlertDialogTitle className='dark:text-white'>
              {t('prompts.deletePrompt')}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t('prompts.confirmDelete')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowDeleteDialog(false)}>
              {t('common.cancel')}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeletePrompt}
              className='bg-red-600 hover:bg-red-700'
            >
              {t('common.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* 删除分类确认对话框 */}
      <AlertDialog
        open={showDeleteCategoryDialog}
        onOpenChange={setShowDeleteCategoryDialog}
      >
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
            <AlertDialogCancel
              onClick={() => setShowDeleteCategoryDialog(false)}
            >
              {t('common.cancel')}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteCategory}
              className='bg-red-600 hover:bg-red-700'
            >
              {t('common.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
