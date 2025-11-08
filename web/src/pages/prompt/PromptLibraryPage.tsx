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
  Shield,
  Home,
  Settings,
  User,
  FileText,
  Image,
  Video,
  Music,
  Calendar,
  Clock,
  Mail,
  Phone,
  MapPin,
  Globe,
  Link,
  Download,
  Upload,
  Share2,
  Heart,
  ThumbsUp,
  ThumbsDown,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Key,
  Bell,
  AlertCircle,
  Info,
  CheckCircle,
  XCircle,
  Zap,
  Rocket,
  Database,
  Server,
  Cloud,
  Wifi,
  Battery,
  Camera,
  Mic,
  Headphones,
  Gamepad,
  ShoppingCart,
  CreditCard,
  Wallet,
  Gift,
  Award,
  Trophy,
  Target,
  Flag,
  Compass,
} from 'lucide-react';
import { XcanPagination } from '@/components/ui/pagination';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'sonner';
import { cn } from '@/components/ui/utils';
import { useLanguage } from '@/components/ui/LanguageProvider';
import { copyToClipboard } from '../../lib/clipboard';
import Prompts from '../../services/Prompts';
import PromptCategories from '../../services/PromptCategories';
import { PromptListVo, PromptCategoryVo } from '../../services/PromptsTypes';
import { PromptDialog } from './PromptDialog';
import { CategoryDialog } from './CategoryDialog';
import { DeletePromptDialog } from './DeletePromptDialog';
import { DeleteCategoryDialog } from './DeleteCategoryDialog';

interface Prompt {
  id: string;
  title: string;
  content: string;
  category: string;
  categoryId?: string;
  tags: { label: string; color: string }[];
  isFavorite: boolean;
  usageCount: number;
  isSystem?: boolean;
}

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

// 图标名称到组件的映射
const ICON_MAP: Record<string, any> = {
  Sparkles,
  Star,
  BookOpen,
  Code,
  MessageSquare,
  TrendingUp,
  FolderPlus,
  Shield,
  Home,
  Settings,
  User,
  FileText,
  Image,
  Video,
  Music,
  Calendar,
  Clock,
  Mail,
  Phone,
  MapPin,
  Globe,
  Link,
  Download,
  Upload,
  Share2,
  Heart,
  ThumbsUp,
  ThumbsDown,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Key,
  Bell,
  AlertCircle,
  Info,
  CheckCircle,
  XCircle,
  Zap,
  Rocket,
  Database,
  Server,
  Cloud,
  Wifi,
  Battery,
  Camera,
  Mic,
  Headphones,
  Gamepad,
  ShoppingCart,
  CreditCard,
  Wallet,
  Gift,
  Award,
  Trophy,
  Target,
  Flag,
  Compass,
};

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


// 获取标签颜色（根据标签名称循环分配）
const getTagColor = (index: number): string => {
  if (TAG_COLORS.length === 0) return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
  const color = TAG_COLORS[index % TAG_COLORS.length];
  return color?.value || TAG_COLORS[0]?.value || 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
};

export function PromptLibraryPage() {
  const { t, language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
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
  ]);
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [favoriteCount, setFavoriteCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  const [pageParam, setPageParam] = useState({
    pageSize: 10,
    pageNo: 1,
    total: 0,
  });

  // 对话框状态
  const [showPromptDialog, setShowPromptDialog] = useState(false);
  const [showCategoryDialog, setShowCategoryDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showDeleteCategoryDialog, setShowDeleteCategoryDialog] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState<Prompt | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingPrompt, setDeletingPrompt] = useState<Prompt | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);

  // 将API返回的分类转换为页面使用的格式
  const convertCategoryVoToCategory = useCallback((vo: PromptCategoryVo): Category => {
    const iconName = vo.icon || 'BookOpen';
    const IconComponent = ICON_MAP[iconName] || BookOpen;
    return {
      id: String(vo.id || ''),
      name: vo.name || '',
      nameEn: vo.name || '', // API没有提供英文名称，使用中文名称
      icon: IconComponent,
      color: vo.color || 'text-blue-600 dark:text-blue-400',
      isSystem: vo.isSystem,
      parentId: vo.parentId ? String(vo.parentId) : undefined,
      promptCount: vo.promptCount,
    };
  }, []);

  // 将API返回的提示词转换为页面使用的格式
  const convertPromptVoToPrompt = useCallback((vo: PromptListVo): Prompt => {
    return {
      id: vo.id || '',
      title: vo.title || '',
      content: vo.content || '',
      category: vo.categoryId ? String(vo.categoryId) : '',
      categoryId: vo.categoryId,
      tags: (vo.tags || []).map((tag, index) => ({
        label: tag,
        color: getTagColor(index),
      })),
      isFavorite: vo.isFavorite || false,
      usageCount: vo.stats?.totalUses || 0,
      isSystem: vo.isSystem,
    };
  }, []);

  // 加载分类树
  const loadCategories = useCallback(async () => {
    setCategoriesLoading(true);
    try {
      const response = await PromptCategories.getPromptCategoryTree();
      if (response.data && Array.isArray(response.data)) {
        // 扁平化处理children
        const flattenCategories: Category[] = [];
        const processCategory = (cat: PromptCategoryVo) => {
          const converted = convertCategoryVoToCategory(cat);
          flattenCategories.push(converted);
          if (cat.children && cat.children.length > 0) {
            cat.children.forEach(processCategory);
          }
        };
        const { totalPrompts = 0, totalFavorites = 0 } = response.extensions || {};
        setFavoriteCount(Number(totalFavorites));
        setTotalCount(Number(totalPrompts));
        response.data.forEach(processCategory);
        setCategories(prev => {
          const allCategory = prev.find(c => c.id === 'all');
          const favoritesCategory = prev.find(c => c.id === 'favorites');
          const result: Category[] = [];
          if (allCategory) result.push(allCategory);
          if (favoritesCategory) result.push(favoritesCategory);
          result.push(...flattenCategories);
          return result;
        });
      }
    } catch (error: any) {
      console.error('加载分类失败:', error);
      toast.error(error?.message || (language === 'zh-CN' ? '加载分类失败' : 'Failed to load categories'));
    } finally {
      setCategoriesLoading(false);
    }
  }, [convertCategoryVoToCategory, language]);

  // 加载提示词列表
  const loadPrompts = useCallback(async () => {
    setLoading(true);
    try {
      const query: any = {
        pageNo: pageParam.pageNo,
        pageSize: pageParam.pageSize, // 加载所有数据
      };

      // 根据选中的分类设置筛选条件
      if (selectedCategory === 'favorites') {
        query.isFavorite = true;
      } else if (selectedCategory !== 'all') {
        query.categoryId = selectedCategory;
      }

      // 搜索条件
      if (debouncedSearchQuery.trim()) {
        query.keyword = debouncedSearchQuery.trim();
      }

      const response = await Prompts.getPromptList(query);
      console.log('API响应数据:', response); // 调试日志

      const { data } = response || {};
      const list = data?.list || [];
      const total = Number(data?.total) || 0;

      setPageParam(pre => ({
        ...pre,
        total,
      }));

      if (list && Array.isArray(list)) {
        const convertedPrompts = list.map(convertPromptVoToPrompt);
        setPrompts(convertedPrompts);
      } else {
        setPrompts([]);
      }
    } catch (error: any) {
      console.error('加载提示词失败:', error);
      toast.error(error?.message || (language === 'zh-CN' ? '加载提示词失败' : 'Failed to load prompts'));
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, debouncedSearchQuery, convertPromptVoToPrompt, language, pageParam.pageNo, pageParam.pageSize]);

  const handlePageChange = (page: { pageSize: number; pageNo: number }) => {
    setPageParam(pre => ({ ...pre, ...page }));
  };

  // 搜索防抖处理
  useEffect(() => {
    // 清除之前的定时器
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // 设置新的定时器
    searchTimeoutRef.current = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300); // 300ms 防抖延迟

    // 清理函数
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery]);

  // 初始化加载数据
  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  useEffect(() => {
    loadPrompts();
  }, [loadPrompts]);


  const getCategoryCount = (categoryId: string) => {
    if (categoryId === 'all') {
      return totalCount;
    }

    if (categoryId === 'favorites') {
      return favoriteCount;
    }
    return undefined;
  };

  // 获取顶层分类（无父分类的分类）
  const getTopLevelCategories = () => {
    return categories.filter(c => !c.parentId);
  };

  // 获取某个分类的子分类
  const getChildCategories = (parentId: string) => {
    return categories.filter(c => c.parentId === parentId);
  };

  // 构建多级树形结构的分类选项（递归）
  const buildCategoryTree = (parentId: string | undefined, level: number = 0, excludeId?: string): Category[] => {
    const result: Category[] = [];
    const children = categories.filter(
      c => c.parentId === parentId && c.id !== 'all' && c.id !== 'favorites' && c.id !== excludeId
    );

    for (const category of children) {
      result.push(category);
      // 递归获取子分类
      const subCategories = buildCategoryTree(category.id, level + 1, excludeId);
      result.push(...subCategories);
    }

    return result;
  };

  const toggleFavorite = async (id: string) => {
    const prompt = prompts.find(p => p.id === id);
    if (!prompt) return;

    const newFavoriteStatus = !prompt.isFavorite;
    try {
      await Prompts.toggleFavoritePrompt(id, { isFavorite: newFavoriteStatus });
      setPrompts(prev => prev.map(p => (p.id === id ? { ...p, isFavorite: newFavoriteStatus } : p)));
      toast.success(language === 'zh-CN' ? '已更新收藏状态' : 'Favorite status updated');
    } catch (error: any) {
      // console.error('更新收藏状态失败:', error);
      // toast.error(error?.message || (language === 'zh-CN' ? '更新收藏状态失败' : 'Failed to update favorite status'));
    }
  };

  const copyPrompt = async (content: string) => {
    const success = await copyToClipboard(content);
    if (success) {
      toast.success(language === 'zh-CN' ? '已复制到剪贴板' : 'Copied to clipboard');
    } else {
      toast.error(language === 'zh-CN' ? '复制失败' : 'Copy failed');
    }
  };

  const usePrompt = async (prompt: Prompt) => {
    try {
      await Prompts.usePrompt(prompt.id);
      // 重新加载提示词以获取最新的使用次数
      await loadPrompts();
      copyPrompt(prompt.content);
      toast.success(language === 'zh-CN' ? '提示词已复制' : 'Prompt copied');
    } catch (error: any) {
      console.error('使用提示词失败:', error);
      // 即使API调用失败，也复制内容
      copyPrompt(prompt.content);
      toast.error(error?.message || (language === 'zh-CN' ? '使用提示词失败' : 'Failed to use prompt'));
    }
  };

  const duplicatePrompt = async (prompt: Prompt) => {
    try {
      await Prompts.duplicatePrompt(prompt.id, {
        title: `${prompt.title} ${language === 'zh-CN' ? '(副本)' : '(Copy)'}`,
      });
      await loadPrompts(); // 重新加载列表
      toast.success(language === 'zh-CN' ? '已复制提示词' : 'Prompt duplicated');
    } catch (error: any) {
      console.error('复制提示词失败:', error);
      toast.error(error?.message || (language === 'zh-CN' ? '复制提示词失败' : 'Failed to duplicate prompt'));
    }
  };

  const openCreateDialog = () => {
    setEditingPrompt(null);
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
    setShowPromptDialog(true);
  };

  const handleDeletePrompt = async () => {
    if (!deletingPrompt) return;

    // 检查是否为系统模板
    if (deletingPrompt.isSystem) {
      toast.error(language === 'zh-CN' ? '系统模板不可删除' : 'System templates cannot be deleted');
      setShowDeleteDialog(false);
      setDeletingPrompt(null);
      return;
    }

    try {
      await Prompts.deletePrompt(deletingPrompt.id);
      await loadPrompts(); // 重新加载列表
      toast.success(language === 'zh-CN' ? '提示词已删除' : 'Prompt deleted');
      setShowDeleteDialog(false);
      setDeletingPrompt(null);
    } catch (error: any) {
      console.error('删除提示词失败:', error);
      toast.error(error?.message || (language === 'zh-CN' ? '删除提示词失败' : 'Failed to delete prompt'));
    }
  };

  // 获取分类的层级路径（用于显示）
  const getCategoryPath = (categoryId: string): string[] => {
    const path: string[] = [];
    let currentId: string | undefined = categoryId;

    while (currentId) {
      const category = categories.find(c => c.id === currentId);
      if (category) {
        path.unshift(category.name);
        currentId = category.parentId;
      } else {
        break;
      }
    }

    return path;
  };

  const handleDeleteCategory = async () => {
    if (!deletingCategory) return;

    // 检查是否为系统分类
    if (deletingCategory.isSystem) {
      toast.error(language === 'zh-CN' ? '系统分类不可删除' : 'System categories cannot be deleted');
      setShowDeleteCategoryDialog(false);
      setDeletingCategory(null);
      return;
    }

    try {
      // 获取所有子分类
      const childCategories = categories.filter(c => c.parentId === deletingCategory.id);
      const allCategoryIds = [deletingCategory.id, ...childCategories.map(c => c.id)];

      // 批量删除分类及其所有子分类
      await PromptCategories.batchDeletePromptCategories({ ids: allCategoryIds });

      // 如果当前选中的是被删除的分类，切换到"全部"
      if (selectedCategory === deletingCategory.id) {
        setSelectedCategory('all');
      }

      await loadCategories(); // 重新加载分类树
      await loadPrompts(); // 重新加载提示词列表
      toast.success(language === 'zh-CN' ? '分类已删除' : 'Category deleted');
      setShowDeleteCategoryDialog(false);
      setDeletingCategory(null);
    } catch (error: any) {
      console.error('删除分类失败:', error);
      toast.error(error?.message || (language === 'zh-CN' ? '删除分类失败' : 'Failed to delete category'));
    }
  };

  const getCategoryName = (cat: Category) => (language === 'zh-CN' ? cat.name : cat.nameEn);

  return (
    <div className='space-y-6 h-[calc(100vh-102px)] flex flex-col'>
      {/* Header */}
      <div>
        <h1 className='text-2xl mb-1 dark:text-white'>{t('prompts.title')}</h1>
        <p className='text-sm text-gray-600 dark:text-gray-400'>
          {language === 'zh-CN' ? '管理和使用您的提示词模板' : 'Manage and use your prompt templates'}
        </p>
      </div>

      <div className='flex gap-6 flex-1 min-h-[200px]'>
        {/* Categories Sidebar */}
        <div className='w-[296px] shrink-0 h-full'>
          <div className='bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 overflow-y-auto h-full pb-4'>
            {categoriesLoading ? (
              <div className='text-center py-8'>
                <p className='text-sm text-gray-500 dark:text-gray-400'>
                  {language === 'zh-CN' ? '加载中...' : 'Loading...'}
                </p>
              </div>
            ) : (
              <div className='space-y-1'>
                {getTopLevelCategories().map(category => {
                  const Icon = category.icon;
                  const count = getCategoryCount(category.id);
                  const childCategories = getChildCategories(category.id);

                  return (
                    <div key={category.id}>
                      {/* 父分类 */}
                      <div
                        className={cn(
                          'group w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors',
                          selectedCategory === category.id
                            ? 'bg-blue-50 dark:bg-blue-900/20'
                            : 'hover:bg-gray-100 dark:hover:bg-gray-750'
                        )}
                      >
                        <button
                          onClick={() => {
                            (setSelectedCategory(category.id), setPageParam(pre => ({ ...pre, pageNo: 1 })));
                          }}
                          className='flex-1 flex items-center justify-between'
                        >
                          <div className='flex items-center gap-2'>
                            <Icon
                              className={cn(
                                'w-4 h-4',
                                category.color,
                                selectedCategory === category.id && 'text-blue-600 dark:text-blue-400'
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
                          <div className='flex items-center gap-1'>
                            {!category.isSystem && (
                              <>
                                <Button
                                  variant='ghost'
                                  size='icon'
                                  className='h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity'
                                  onClick={e => {
                                    e.stopPropagation();
                                    setEditingCategory(category);
                                    setShowCategoryDialog(true);
                                  }}
                                >
                                  <Edit className='w-3 h-3 text-blue-600' />
                                </Button>
                                <Button
                                  variant='ghost'
                                  size='icon'
                                  className='h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity'
                                  onClick={e => {
                                    e.stopPropagation();
                                    setDeletingCategory(category);
                                    setShowDeleteCategoryDialog(true);
                                  }}
                                >
                                  <Trash2 className='w-3 h-3 text-red-600' />
                                </Button>
                              </>
                            )}
                            <Badge variant='secondary' className='text-xs'>
                              {category.promptCount || count}
                            </Badge>
                          </div>
                        </button>
                      </div>

                      {/* 子分类 */}
                      {childCategories.length > 0 && (
                        <div className='ml-4 mt-1 space-y-1'>
                          {childCategories.map(childCategory => {
                            const childCount = getCategoryCount(childCategory.id);
                            const ChildIcon = childCategory.icon || BookOpen;

                            return (
                              <div
                                key={childCategory.id}
                                className={cn(
                                  'group w-full flex items-center justify-between px-3 py-1.5 rounded-lg transition-colors',
                                  selectedCategory === childCategory.id
                                    ? 'bg-blue-50 dark:bg-blue-900/20'
                                    : 'hover:bg-gray-100 dark:hover:bg-gray-750'
                                )}
                              >
                                <button
                                  onClick={() => setSelectedCategory(childCategory.id)}
                                  className='flex-1 flex items-center justify-between'
                                >
                                  <div className='flex items-center gap-2'>
                                    <ChildIcon
                                      className={cn(
                                        'w-4 h-4',
                                        childCategory.color,
                                        selectedCategory === childCategory.id && 'text-blue-600 dark:text-blue-400'
                                      )}
                                    />
                                    <span
                                      className={cn(
                                        'text-sm',
                                        selectedCategory === childCategory.id
                                          ? 'text-blue-600 dark:text-blue-400'
                                          : 'text-gray-600 dark:text-gray-400'
                                      )}
                                    >
                                      {getCategoryName(childCategory)}
                                    </span>
                                  </div>
                                  <div className='flex items-center gap-1'>
                                    {!childCategory.isSystem && (
                                      <>
                                        <Button
                                          variant='ghost'
                                          size='icon'
                                          className='h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity'
                                          onClick={e => {
                                            e.stopPropagation();
                                            setEditingCategory(childCategory);
                                            setShowCategoryDialog(true);
                                          }}
                                        >
                                          <Edit className='w-3 h-3 text-blue-600' />
                                        </Button>
                                        <Button
                                          variant='ghost'
                                          size='icon'
                                          className='h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity'
                                          onClick={e => {
                                            e.stopPropagation();
                                            setDeletingCategory(childCategory);
                                            setShowDeleteCategoryDialog(true);
                                          }}
                                        >
                                          <Trash2 className='w-3 h-3 text-red-600' />
                                        </Button>
                                      </>
                                    )}
                                    <Badge variant='secondary' className='text-xs'>
                                      {childCategory.promptCount || childCount}
                                    </Badge>
                                  </div>
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Prompts List */}
        <div className='flex-1 space-y-4'>
          {/* Search and Actions */}
          <div className='flex items-center justify-between gap-3'>
            <div className='relative w-[300px]'>
              <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400' />
              <Input
                placeholder={t('prompts.search')}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className='pl-10 dark:bg-gray-800 dark:border-gray-700'
              />
            </div>
            <div className='flex gap-3 shrink-0'>
              <Button onClick={() => {
                setEditingCategory(null);
                setShowCategoryDialog(true);
              }} variant='outline' className='gap-2'>
                <FolderPlus className='w-4 h-4' />
                {t('prompts.newCategory')}
              </Button>
              <Button onClick={openCreateDialog} className='gap-2'>
                <Plus className='w-4 h-4' />
                {t('prompts.newPrompt')}
              </Button>
            </div>
          </div>

          <ScrollArea className='h-[calc(100vh-280px)]'>
            <div className='space-y-4'>
              {loading ? (
                <div className='text-center py-20 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg'>
                  <Sparkles className='w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-gray-600 animate-pulse' />
                  <p className='text-gray-500 dark:text-gray-400'>
                    {language === 'zh-CN' ? '加载中...' : 'Loading...'}
                  </p>
                </div>
              ) : prompts.length === 0 ? (
                <div className='text-center py-20 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg'>
                  <Sparkles className='w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-gray-600' />
                  <p className='text-gray-500 dark:text-gray-400'>
                    {debouncedSearchQuery ? t('prompts.noResults') : t('prompts.noPrompts')}
                  </p>
                </div>
              ) : (
                prompts.map(prompt => (
                  <div
                    key={prompt.id}
                    className='p-5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow'
                  >
                    <div className='flex items-start justify-between mb-3'>
                      <div className='flex-1'>
                        <div className='flex items-center gap-2 mb-2'>
                          <h3 className='dark:text-white'>{prompt.title}</h3>
                          {prompt.isSystem && (
                            <Badge variant='secondary' className='text-xs gap-1'>
                              <Shield className='w-3 h-3' />
                              {language === 'zh-CN' ? '系统' : 'System'}
                            </Badge>
                          )}
                          <Badge variant='outline' className='text-xs'>
                            {language === 'zh-CN' ? '使用' : ''} {prompt.usageCount}{' '}
                            {language === 'zh-CN' ? '次' : 'uses'}
                          </Badge>
                        </div>
                        <div className='flex flex-wrap gap-1.5'>
                          {prompt.tags.map((tag, index) => (
                            <span key={index} className={cn('text-xs px-2 py-1 rounded-md', tag.color)}>
                              {tag.label}
                            </span>
                          ))}
                        </div>
                      </div>
                      <Button variant='ghost' size='icon' onClick={() => toggleFavorite(prompt.id)}>
                        <Star className={cn('w-4 h-4', prompt.isFavorite && 'fill-yellow-400 text-yellow-400')} />
                      </Button>
                    </div>

                    <p className='text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3 whitespace-pre-wrap'>
                      {prompt.content}
                    </p>

                    <div className='flex items-center gap-2'>
                      <Button size='sm' onClick={() => usePrompt(prompt)} className='min-w-[120px]'>
                        {t('prompts.use')}
                      </Button>
                      <Button variant='outline' size='sm' onClick={() => copyPrompt(prompt.content)} className='gap-2'>
                        <Copy className='w-3 h-3' />
                        {t('common.copy')}
                      </Button>
                      {!prompt.isSystem && (
                        <Button variant='outline' size='sm' onClick={() => duplicatePrompt(prompt)} className='gap-2'>
                          <Copy className='w-3 h-3' />
                          {language === 'zh-CN' ? '副本' : 'Duplicate'}
                        </Button>
                      )}
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

          {pageParam.total > pageParam.pageSize && <XcanPagination {...pageParam} onChange={handlePageChange} />}
        </div>
      </div>

      {/* 新建/编辑提示词对话框 */}
      <PromptDialog
        open={showPromptDialog}
        onOpenChange={setShowPromptDialog}
        editingPrompt={editingPrompt}
        categories={categories}
        defaultCategoryId={
          selectedCategory === 'all' || selectedCategory === 'favorites'
            ? categories.find(c => c.id !== 'all' && c.id !== 'favorites')?.id
            : selectedCategory
        }
        onSuccess={loadPrompts}
        getCategoryName={getCategoryName}
      />

      {/* 新建/编辑分组对话框 */}
      <CategoryDialog
        open={showCategoryDialog}
        onOpenChange={setShowCategoryDialog}
        editingCategory={editingCategory}
        onSuccess={loadCategories}
        buildCategoryTree={buildCategoryTree}
        getCategoryPath={getCategoryPath}
      />

      {/* 删除提示词确认对话框 */}
      <DeletePromptDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        deletingPrompt={deletingPrompt}
        onConfirm={handleDeletePrompt}
      />

      {/* 删除分类确认对话框 */}
      <DeleteCategoryDialog
        open={showDeleteCategoryDialog}
        onOpenChange={setShowDeleteCategoryDialog}
        deletingCategory={deletingCategory}
        onConfirm={handleDeleteCategory}
      />
    </div>
  );
}
