import { Search, Star, Copy, Plus, Trash2, Edit, Sparkles, BookOpen, Shield, FolderPlus, Eye } from 'lucide-react';
import { XcanPagination } from '@/components/ui/pagination';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useState, useEffect, useCallback } from 'react';
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
import { Prompt, Category } from './types';
import { ICON_MAP, SYSTEM_CATEGORY_IDS, LIMITS } from './constants';
import { getTagColorByIndex, buildCategoryTree, getCategoryPath, getTopLevelCategories, getChildCategories, getCategoryDisplayName, getDefaultCategoryId, } from './utils';
import { useDebounce } from '@/hooks/useDebounce';

// 递归渲染分类树组件（支持多级分组）
interface CategoryItemProps {
  category: Category;
  selectedCategoryId: string;
  categories: Category[];
  level: number;
  getCategoryCount: (categoryId: string) => number | undefined;
  getCategoryDisplayName: (cat: Category, language: string) => string;
  language: string;
  onSelect: (categoryId: string) => void;
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
}

function CategoryItem({
  category,
  selectedCategoryId,
  categories,
  level,
  getCategoryCount,
  getCategoryDisplayName,
  language,
  onSelect,
  onEdit,
  onDelete,
}: CategoryItemProps) {
  const Icon = category.icon || BookOpen;
  const count = getCategoryCount(category.id);
  const childCategories = getChildCategories(categories, category.id);
  const isSelected = selectedCategoryId === category.id;

  // 根据层级设置缩进：level 0 无缩进，level 1 缩进 16px，level 2+ 缩进 32px
  const indentClass = level === 0 ? '' : level === 1 ? 'ml-4' : 'ml-8';
  const paddingClass = level === 0 ? 'py-2' : 'py-1.5';

  return (
    <div>
      {/* 当前分类 */}
      <div
        className={cn(
          'group w-full flex items-center gap-2 px-3 rounded-lg transition-colors',
          paddingClass,
          indentClass,
          isSelected ? 'bg-blue-50 dark:bg-blue-900/20' : 'hover:bg-gray-100 dark:hover:bg-gray-750'
        )}
      >
        <button onClick={() => onSelect(category.id)} className='flex items-center gap-2 text-left min-w-0'>
          <Icon className={cn('w-4 h-4 shrink-0', category.color, isSelected && 'text-blue-600 dark:text-blue-400')} />
          <span
            className={cn(
              'text-sm truncate max-w-[100px] block',
              isSelected
                ? 'text-blue-600 dark:text-blue-400'
                : level === 0
                  ? 'text-gray-700 dark:text-gray-300'
                  : 'text-gray-600 dark:text-gray-400'
            )}
            title={getCategoryDisplayName(category, language)}
          >
            {getCategoryDisplayName(category, language)}
          </span>
        </button>
        <div className='flex items-center gap-1 shrink-0 ml-auto'>
          {!category.isSystem && (
            <>
              <Button
                variant='ghost'
                size='icon'
                className='h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity'
                onClick={e => {
                  e.stopPropagation();
                  onEdit(category);
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
                  onDelete(category);
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
      </div>

      {/* 递归渲染子分类 */}
      {childCategories.length > 0 && (
        <div className='mt-1 space-y-1'>
          {childCategories.map(childCategory => (
            <CategoryItem
              key={childCategory.id}
              category={childCategory}
              selectedCategoryId={selectedCategoryId}
              categories={categories}
              level={level + 1}
              getCategoryCount={getCategoryCount}
              getCategoryDisplayName={getCategoryDisplayName}
              language={language}
              onSelect={onSelect}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function PromptLibraryPage() {
  const { t, language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, LIMITS.SEARCH_DEBOUNCE_MS);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(SYSTEM_CATEGORY_IDS.ALL);
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
  const [isLoadingPrompts, setIsLoadingPrompts] = useState(false);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
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
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState<Prompt | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingPrompt, setDeletingPrompt] = useState<Prompt | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);
  const [viewingPrompt, setViewingPrompt] = useState<Prompt | null>(null);

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
        color: getTagColorByIndex(index),
      })),
      isFavorite: vo.isFavorite || false,
      usageCount: vo.stats?.totalUses || 0,
      isSystem: vo.isSystem,
    };
  }, []);

  // 加载分类树
  const loadCategories = useCallback(async () => {
    setIsLoadingCategories(true);
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
      setIsLoadingCategories(false);
    }
  }, [convertCategoryVoToCategory, language]);

  // 加载提示词列表
  const loadPrompts = useCallback(async () => {
    setIsLoadingPrompts(true);
    try {
      const query: any = {
        pageNo: pageParam.pageNo,
        pageSize: pageParam.pageSize,
      };

      // 根据选中的分类设置筛选条件
      if (selectedCategoryId === SYSTEM_CATEGORY_IDS.FAVORITES) {
        query.isFavorite = true;
      } else if (selectedCategoryId && selectedCategoryId !== SYSTEM_CATEGORY_IDS.ALL) {
        query.categoryId = selectedCategoryId;
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
      setIsLoadingPrompts(false);
    }
  }, [
    selectedCategoryId,
    debouncedSearchQuery,
    convertPromptVoToPrompt,
    language,
    pageParam.pageNo,
    pageParam.pageSize,
  ]);

  const handlePageChange = (page: { pageSize: number; pageNo: number }) => {
    setPageParam(pre => ({ ...pre, ...page }));
  };

  // 初始化加载数据
  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  useEffect(() => {
    loadPrompts();
  }, [loadPrompts]);

  const getCategoryCount = (categoryId: string) => {
    if (categoryId === SYSTEM_CATEGORY_IDS.ALL) {
      return totalCount;
    }

    if (categoryId === SYSTEM_CATEGORY_IDS.FAVORITES) {
      return favoriteCount;
    }
    return undefined;
  };

  // 构建分类树（用于CategoryDialog）
  const buildCategoryTreeForDialog = useCallback(
    (parentId: string | undefined, _level: number = 0, excludeId?: string): Category[] => {
      return buildCategoryTree(categories, parentId, excludeId);
    },
    [categories]
  );

  // 获取分类路径（用于CategoryDialog）
  const getCategoryPathForDialog = useCallback(
    (categoryId: string): string[] => {
      return getCategoryPath(categories, categoryId);
    },
    [categories]
  );

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
    if (!content || content.trim() === '') {
      toast.error(language === 'zh-CN' ? '内容为空，无法复制' : 'Content is empty, cannot copy');
      return;
    }

    try {
      const success = await copyToClipboard(content);
      if (success) {
        toast.success(language === 'zh-CN' ? '已复制到剪贴板' : 'Copied to clipboard');
      } else {
        toast.error(language === 'zh-CN' ? '复制失败，请手动复制' : 'Copy failed, please copy manually');
      }
    } catch (error) {
      console.error('复制错误:', error);
      toast.error(language === 'zh-CN' ? '复制失败，请手动复制' : 'Copy failed, please copy manually');
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

  // 递归收集所有子分类ID（包括多级子分类）
  const collectAllChildCategoryIds = useCallback((parentId: string, allCategories: Category[]): string[] => {
    const childIds: string[] = [];
    const children = allCategories.filter(c => c.parentId === parentId);

    for (const child of children) {
      childIds.push(child.id);
      // 递归获取子分类的子分类
      const grandChildren = collectAllChildCategoryIds(child.id, allCategories);
      childIds.push(...grandChildren);
    }

    return childIds;
  }, []);

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
      // 递归获取所有子分类ID（包括三级分组）
      const allChildIds = collectAllChildCategoryIds(deletingCategory.id, categories);
      const allCategoryIds = [deletingCategory.id, ...allChildIds];

      // 批量删除分类及其所有子分类
      await PromptCategories.batchDeletePromptCategories({ ids: allCategoryIds });

      // 如果当前选中的是被删除的分类或其子分类，切换到"全部"
      if (allCategoryIds.includes(selectedCategoryId)) {
        setSelectedCategoryId(SYSTEM_CATEGORY_IDS.ALL);
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

  const getCategoryDisplayNameForDialog = useCallback(
    (cat: Category) => getCategoryDisplayName(cat, language),
    [language]
  );

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
          <div className='bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 overflow-y-auto h-full pb-4 scrollbar-hide'>
            {isLoadingCategories ? (
              <div className='text-center py-8'>
                <p className='text-sm text-gray-500 dark:text-gray-400'>
                  {language === 'zh-CN' ? '加载中...' : 'Loading...'}
                </p>
              </div>
            ) : (
              <div className='space-y-1'>
                {getTopLevelCategories(categories).map(category => (
                  <CategoryItem
                    key={category.id}
                    category={category}
                    selectedCategoryId={selectedCategoryId}
                    categories={categories}
                    level={0}
                    getCategoryCount={getCategoryCount}
                    getCategoryDisplayName={getCategoryDisplayName}
                    language={language}
                    onSelect={categoryId => {
                      setSelectedCategoryId(categoryId);
                      setPageParam(pre => ({ ...pre, pageNo: 1 }));
                    }}
                    onEdit={category => {
                      setEditingCategory(category);
                      setShowCategoryDialog(true);
                    }}
                    onDelete={category => {
                      setDeletingCategory(category);
                      setShowDeleteCategoryDialog(true);
                    }}
                  />
                ))}
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
              <Button
                onClick={() => {
                  setEditingCategory(null);
                  setShowCategoryDialog(true);
                }}
                variant='outline'
                className='gap-2'
              >
                <FolderPlus className='w-4 h-4' />
                {t('prompts.newCategory')}
              </Button>
              <Button onClick={openCreateDialog} className='bg-blue-500 hover:bg-blue-600 gap-2'>
                <Plus className='w-4 h-4' />
                {t('prompts.newPrompt')}
              </Button>
            </div>
          </div>

          <ScrollArea className='h-[calc(100vh-280px)]'>
            <div className='space-y-4'>
              {isLoadingPrompts ? (
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
                      {/* 查看按钮 - 所有提示词都可以查看 */}
                      <Button
                        variant='ghost'
                        size='icon'
                        className='h-8 w-8'
                        onClick={() => {
                          setViewingPrompt(prompt);
                          setShowViewDialog(true);
                        }}
                      >
                        <Eye className='w-4 h-4' />
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

          {pageParam.total > pageParam.pageSize && <XcanPagination {...pageParam} onChange={handlePageChange} />}
        </div>
      </div>

      {/* 新建/编辑提示词对话框 */}
      <PromptDialog
        open={showPromptDialog}
        onOpenChange={setShowPromptDialog}
        editingPrompt={editingPrompt}
        categories={categories}
        defaultCategoryId={getDefaultCategoryId(categories, selectedCategoryId)}
        onSuccess={loadPrompts}
        getCategoryName={getCategoryDisplayNameForDialog}
      />

      {/* 新建/编辑分组对话框 */}
      <CategoryDialog
        open={showCategoryDialog}
        onOpenChange={setShowCategoryDialog}
        editingCategory={editingCategory}
        onSuccess={loadCategories}
        buildCategoryTree={buildCategoryTreeForDialog}
        getCategoryPath={getCategoryPathForDialog}
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

      {/* 查看提示词对话框 */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className='max-w-[792px] dark:bg-gray-800 dark:border-gray-700'>
          <DialogHeader>
            <DialogTitle className='dark:text-white'>提示词详情</DialogTitle>
            <DialogDescription className='dark:text-gray-400'>查看提示词的详细信息</DialogDescription>
          </DialogHeader>
          {viewingPrompt && (
            <div className='space-y-4'>
              <div className='flex items-center gap-3 pb-4 border-b border-gray-200 dark:border-gray-700'>
                <div className='w-16 h-16 rounded-lg flex items-center justify-center bg-blue-100 dark:bg-blue-900/30'>
                  <Sparkles className='w-8 h-8 text-blue-600 dark:text-blue-400' />
                </div>
                <div className='flex-1'>
                  <div className='flex items-center gap-2'>
                    <h3 className='text-xl dark:text-white'>{viewingPrompt.title}</h3>
                    {viewingPrompt.isSystem && (
                      <Badge variant='secondary' className='text-xs gap-1'>
                        <Shield className='w-3 h-3' />
                        {language === 'zh-CN' ? '系统' : 'System'}
                      </Badge>
                    )}
                    <Badge
                      variant='secondary'
                      className={
                        viewingPrompt.isFavorite
                          ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                          : ''
                      }
                    >
                      <Star className={cn('w-3 h-3', viewingPrompt.isFavorite && 'fill-yellow-400')} />
                    </Badge>
                  </div>
                  <div className='flex items-center gap-2 mt-1'>
                    <Badge variant='outline' className='text-xs'>
                      {language === 'zh-CN' ? '使用' : ''} {viewingPrompt.usageCount}{' '}
                      {language === 'zh-CN' ? '次' : 'uses'}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className='space-y-3'>
                <div>
                  <label className='text-sm text-gray-600 dark:text-gray-400'>分类</label>
                  <p className='text-sm dark:text-white mt-1'>
                    {(() => {
                      const category = categories.find(c => c.id === viewingPrompt.category);
                      return category ? getCategoryDisplayName(category, language) : '-';
                    })()}
                  </p>
                </div>

                {viewingPrompt.tags && viewingPrompt.tags.length > 0 && (
                  <div>
                    <label className='text-sm text-gray-600 dark:text-gray-400'>标签</label>
                    <div className='flex flex-wrap gap-2 mt-2'>
                      {viewingPrompt.tags.map((tag, index) => (
                        <Badge key={index} variant='secondary' className={cn('text-xs', tag.color)}>
                          {tag.label}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <div className='flex items-center justify-between mb-2'>
                    <label className='text-sm text-gray-600 dark:text-gray-400'>内容</label>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => {
                        if (viewingPrompt?.content) {
                          copyPrompt(viewingPrompt.content);
                        }
                      }}
                      className='gap-2'
                    >
                      <Copy className='w-3 h-3' />
                      {t('common.copy')}
                    </Button>
                  </div>
                  <div className='mt-2 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600'>
                    <p className='text-sm dark:text-gray-300 whitespace-pre-wrap break-words'>
                      {viewingPrompt.content}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
