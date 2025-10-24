import {
  BookOpen,
  Code,
  Copy,
  Edit,
  FolderPlus,
  MessageSquare,
  Plus,
  Search,
  Sparkles,
  Star,
  Trash2,
  TrendingUp,
  X,
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { copyToClipboard } from '../../lib/clipboard';

interface Prompt {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: { label: string; color: string }[];
  isFavorite: boolean;
  usageCount: number;
}

interface Category {
  id: string;
  name: string;
  icon: any;
  color: string;
}

interface PromptLibraryProps {
  onClose: () => void;
  onSelectPrompt: (content: string) => void;
}

const TAG_COLORS = [
  {
    name: '蓝色',
    value: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  },
  {
    name: '紫色',
    value:
      'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  },
  {
    name: '绿色',
    value:
      'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  },
  {
    name: '橙色',
    value:
      'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  },
  {
    name: '红色',
    value: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  },
  {
    name: '粉色',
    value: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400',
  },
  {
    name: '青色',
    value: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400',
  },
  {
    name: '黄色',
    value:
      'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  },
  {
    name: '靛青',
    value:
      'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
  },
  {
    name: '紫罗兰',
    value:
      'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400',
  },
];

export function PromptLibrary({ onClose, onSelectPrompt }: PromptLibraryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categories, setCategories] = useState<Category[]>([
    {
      id: 'all',
      name: '全部',
      icon: Sparkles,
      color: 'text-gray-700 dark:text-gray-300',
    },
    {
      id: 'favorites',
      name: '收藏',
      icon: Star,
      color: 'text-yellow-600 dark:text-yellow-500',
    },
    {
      id: 'coding',
      name: '编程开发',
      icon: Code,
      color: 'text-blue-600 dark:text-blue-400',
    },
    {
      id: 'writing',
      name: '写作',
      icon: BookOpen,
      color: 'text-green-600 dark:text-green-400',
    },
    {
      id: 'marketing',
      name: '营销',
      icon: TrendingUp,
      color: 'text-purple-600 dark:text-purple-400',
    },
    {
      id: 'productivity',
      name: '生产力',
      icon: MessageSquare,
      color: 'text-orange-600 dark:text-orange-400',
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
    },
  ]);

  // 对话框状态
  const [showPromptDialog, setShowPromptDialog] = useState(false);
  const [showCategoryDialog, setShowCategoryDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState<Prompt | null>(null);
  const [deletingPrompt, setDeletingPrompt] = useState<Prompt | null>(null);

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
    toast.success('已更新收藏状态');
  };

  const copyPrompt = async (content: string) => {
    const success = await copyToClipboard(content);
    if (success) {
      toast.success('已复制到剪贴板');
    } else {
      toast.error('复制失败');
    }
  };

  const usePrompt = (prompt: Prompt) => {
    setPrompts(prev =>
      prev.map(p =>
        p.id === prompt.id ? { ...p, usageCount: p.usageCount + 1 } : p
      )
    );
    onSelectPrompt(prompt.content);
    toast.success('已插入提示词');
  };

  const duplicatePrompt = (prompt: Prompt) => {
    const newPrompt: Prompt = {
      ...prompt,
      id: Date.now().toString(),
      title: `${prompt.title} (副本)`,
      usageCount: 0,
    };
    setPrompts(prev => [newPrompt, ...prev]);
    toast.success('已复制提示词');
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
      toast.error('请填写标题和内容');
      return;
    }

    if (editingPrompt) {
      // 编辑
      setPrompts(prev =>
        prev.map(p => (p.id === editingPrompt.id ? { ...p, ...promptForm } : p))
      );
      toast.success('提示词已更新');
    } else {
      // 新建
      const newPrompt: Prompt = {
        id: Date.now().toString(),
        ...promptForm,
        isFavorite: false,
        usageCount: 0,
      };
      setPrompts(prev => [newPrompt, ...prev]);
      toast.success('提示词已创建');
    }

    setShowPromptDialog(false);
  };

  const handleDeletePrompt = () => {
    if (deletingPrompt) {
      setPrompts(prev => prev.filter(p => p.id !== deletingPrompt.id));
      toast.success('提示词已删除');
      setShowDeleteDialog(false);
      setDeletingPrompt(null);
    }
  };

  const addTag = () => {
    if (!newTagLabel.trim()) {
      toast.error('请输入标签名称');
      return;
    }
    if (promptForm.tags.length >= 5) {
      toast.error('最多添加5个标签');
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
      toast.error('请输入分类名称');
      return;
    }
    const newCategory: Category = {
      id: `custom-${Date.now()}`,
      name: categoryForm.name,
      icon: BookOpen,
      color: categoryForm.color,
    };
    setCategories(prev => [...prev, newCategory]);
    toast.success('分类已创建');
    setShowCategoryDialog(false);
    setCategoryForm({
      name: '',
      icon: 'BookOpen',
      color: 'text-blue-600 dark:text-blue-400',
    });
  };

  return (
    <>
      <Dialog open onOpenChange={onClose}>
        <DialogContent className='sm:max-w-[1124px] max-w-[calc(100%-2rem)] h-[80vh] p-0 dark:bg-gray-800'>
          <DialogHeader className='px-6 py-4 border-b dark:border-gray-700'>
            <DialogTitle className='flex items-center gap-2 dark:text-white'>
              <Sparkles className='w-5 h-5 text-blue-500' />
              提示词库
            </DialogTitle>
            <DialogDescription className='sr-only'>
              浏览和使用预设的提示词模板
            </DialogDescription>
            <div className='flex items-center gap-2 mt-4'>
              <div className='w-[300px] relative'>
                <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400' />
                <Input
                  placeholder='搜索提示词...'
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className='pl-10 dark:bg-gray-750 dark:border-gray-600'
                />
              </div>
              <div className='flex-1'></div>
              <Button
                onClick={() => setShowCategoryDialog(true)}
                variant='outline'
                className='gap-2'
              >
                <FolderPlus className='w-4 h-4' />
                新建分组
              </Button>
              <Button onClick={openCreateDialog} className='gap-2'>
                <Plus className='w-4 h-4' />
                新建提示词
              </Button>
            </div>
          </DialogHeader>

          <div className='flex flex-1 overflow-hidden'>
            {/* Categories Sidebar */}
            <div className='w-64 border-r dark:border-gray-700 p-4'>
              <ScrollArea className='h-full'>
                <div className='space-y-1'>
                  {categories.map(category => {
                    const Icon = category.icon;
                    const count = getCategoryCount(category.id);
                    return (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={cn(
                          'w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors',
                          selectedCategory === category.id
                            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                            : 'hover:bg-gray-100 dark:hover:bg-gray-750 text-gray-700 dark:text-gray-300'
                        )}
                      >
                        <div className='flex items-center gap-2'>
                          <Icon className={cn('w-4 h-4', category.color)} />
                          <span className='text-sm'>{category.name}</span>
                        </div>
                        <Badge variant='secondary' className='text-xs'>
                          {count}
                        </Badge>
                      </button>
                    );
                  })}
                </div>
              </ScrollArea>
            </div>

            {/* Prompts List */}
            <div className='flex-1 overflow-hidden'>
              <ScrollArea className='h-full'>
                <div className='p-6 space-y-4'>
                  {filteredPrompts.length === 0 ? (
                    <div className='text-center py-20'>
                      <Sparkles className='w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-gray-600' />
                      <p className='text-gray-500 dark:text-gray-400'>
                        {searchQuery
                          ? '未找到相关提示词'
                          : '该分类下暂无提示词'}
                      </p>
                    </div>
                  ) : (
                    filteredPrompts.map(prompt => (
                      <div
                        key={prompt.id}
                        className='p-4 bg-white dark:bg-gray-750 border border-gray-200 dark:border-gray-600 rounded-lg hover:shadow-md transition-shadow group'
                      >
                        <div className='flex items-start justify-between mb-3'>
                          <div className='flex-1'>
                            <div className='flex items-center gap-2 mb-2'>
                              <h3 className='dark:text-white'>
                                {prompt.title}
                              </h3>
                              <Badge variant='outline' className='text-xs'>
                                使用 {prompt.usageCount} 次
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
                            使用此提示词
                          </Button>
                          <Button
                            variant='outline'
                            size='sm'
                            onClick={() => copyPrompt(prompt.content)}
                            className='gap-2'
                          >
                            <Copy className='w-3 h-3' />
                            复制
                          </Button>
                          <Button
                            variant='outline'
                            size='sm'
                            onClick={() => duplicatePrompt(prompt)}
                            className='gap-2'
                          >
                            <Copy className='w-3 h-3' />
                            副本
                          </Button>
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
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* 新建/编辑提示词对话框 */}
      <Dialog open={showPromptDialog} onOpenChange={setShowPromptDialog}>
        <DialogContent className='max-w-2xl dark:bg-gray-800'>
          <DialogHeader>
            <DialogTitle className='dark:text-white'>
              {editingPrompt ? '编辑提示词' : '新建提示词'}
            </DialogTitle>
            <DialogDescription>
              {editingPrompt ? '修改提示词信息' : '创建一个新的提示词模板'}
            </DialogDescription>
          </DialogHeader>

          <div className='space-y-4'>
            <div>
              <Label htmlFor='title'>标题</Label>
              <Input
                id='title'
                value={promptForm.title}
                onChange={e =>
                  setPromptForm(prev => ({ ...prev, title: e.target.value }))
                }
                placeholder='输入提示词标题...'
                className='dark:bg-gray-750 dark:border-gray-600'
              />
            </div>

            <div>
              <Label htmlFor='content'>内容</Label>
              <Textarea
                id='content'
                value={promptForm.content}
                onChange={e =>
                  setPromptForm(prev => ({ ...prev, content: e.target.value }))
                }
                placeholder='输入提示词内容...'
                className='min-h-[200px] dark:bg-gray-750 dark:border-gray-600'
              />
            </div>

            <div>
              <Label htmlFor='category'>分类</Label>
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
                        {cat.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>标签</Label>
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
                      <X className='w-3 h-3' />
                    </button>
                  </span>
                ))}
              </div>
              <div className='flex gap-2'>
                <Input
                  value={newTagLabel}
                  onChange={e => setNewTagLabel(e.target.value)}
                  placeholder='标签名称'
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
                          {color.name}
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
              取消
            </Button>
            <Button onClick={handleSavePrompt}>
              {editingPrompt ? '保存' : '创建'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 新建分组对话框 */}
      <Dialog open={showCategoryDialog} onOpenChange={setShowCategoryDialog}>
        <DialogContent className='dark:bg-gray-800'>
          <DialogHeader>
            <DialogTitle className='dark:text-white'>新建分组</DialogTitle>
            <DialogDescription>创建一个新的提示词分组</DialogDescription>
          </DialogHeader>

          <div className='space-y-4'>
            <div>
              <Label htmlFor='categoryName'>分组名称</Label>
              <Input
                id='categoryName'
                value={categoryForm.name}
                onChange={e =>
                  setCategoryForm(prev => ({ ...prev, name: e.target.value }))
                }
                placeholder='输入分组名称...'
                className='dark:bg-gray-750 dark:border-gray-600'
              />
            </div>

            <div>
              <Label htmlFor='categoryColor'>颜色</Label>
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
                      蓝色
                    </div>
                  </SelectItem>
                  <SelectItem value='text-green-600 dark:text-green-400'>
                    <div className='flex items-center gap-2'>
                      <div className='w-3 h-3 rounded bg-green-500' />
                      绿色
                    </div>
                  </SelectItem>
                  <SelectItem value='text-purple-600 dark:text-purple-400'>
                    <div className='flex items-center gap-2'>
                      <div className='w-3 h-3 rounded bg-purple-500' />
                      紫色
                    </div>
                  </SelectItem>
                  <SelectItem value='text-orange-600 dark:text-orange-400'>
                    <div className='flex items-center gap-2'>
                      <div className='w-3 h-3 rounded bg-orange-500' />
                      橙色
                    </div>
                  </SelectItem>
                  <SelectItem value='text-red-600 dark:text-red-400'>
                    <div className='flex items-center gap-2'>
                      <div className='w-3 h-3 rounded bg-red-500' />
                      红色
                    </div>
                  </SelectItem>
                  <SelectItem value='text-pink-600 dark:text-pink-400'>
                    <div className='flex items-center gap-2'>
                      <div className='w-3 h-3 rounded bg-pink-500' />
                      粉色
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
              取消
            </Button>
            <Button onClick={handleCreateCategory}>创建</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 删除确认对话框 */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className='dark:bg-gray-800'>
          <AlertDialogHeader>
            <AlertDialogTitle className='dark:text-white'>
              确认删除
            </AlertDialogTitle>
            <AlertDialogDescription className='dark:text-gray-400'>
              确定要删除提示词 "{deletingPrompt?.title}" 吗？此操作无法撤销。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeletingPrompt(null)}>
              取消
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeletePrompt}
              className='bg-red-600 hover:bg-red-700'
            >
              删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
