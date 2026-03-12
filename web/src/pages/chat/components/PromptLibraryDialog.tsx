import { Search, Star, Copy, Plus, Trash2, Edit, Sparkles, BookOpen, Shield, FolderPlus, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button.tsx';
import { Input } from '@/components/ui/input.tsx';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog.tsx';
import { ScrollArea } from '@/components/ui/scroll-area.tsx';
import { Badge } from '@/components/ui/badge.tsx';
import { Skeleton } from '@/components/ui/skeleton.tsx';
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { cn } from '@/components/ui/utils.ts';
import { useLanguage } from '@/components/LanguageProvider.tsx';
import { copyToClipboard } from '@/lib/clipboard.ts';
import Prompts from '../../../services/Prompts.ts';
import PromptCategories from '../../../services/PromptCategories.ts';
import { PromptListVo, PromptCategoryVo } from '@/services/PromptsTypes.ts';
import { PromptDialog } from '@/pages/prompt/components/PromptDialog.tsx';
import { CategoryDialog } from '@/pages/prompt/components/CategoryDialog.tsx';
import { DeletePromptDialog } from '@/pages/prompt/components/DeletePromptDialog.tsx';
import { DeleteCategoryDialog } from '@/pages/prompt/components/DeleteCategoryDialog.tsx';
import { Prompt, Category } from '@/pages/prompt/types.ts';
import { ICON_MAP, SYSTEM_CATEGORY_IDS, LIMITS } from '@/pages/prompt/constants.ts';
import {
  getTagColorByIndex,
  buildCategoryTree,
  getCategoryPath,
  getTopLevelCategories,
  getChildCategories,
  getDefaultCategoryId,
} from '@/pages/prompt/utils.ts';
import { useDebounce } from '@/hooks/useDebounce.ts';
import { XcanPagination } from '@/components/ui/pagination.tsx';

interface PromptLibraryDialogProps {
  onClose: () => void;
  onSelectPrompt: (content: string) => void;
}

// 递归渲染分类树（弹窗侧边栏用）
interface CategoryItemProps {
  category: Category;
  selectedCategoryId: string;
  categories: Category[];
  level: number;
  getCategoryCount: (categoryId: string) => number | undefined;
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
  onSelect,
  onEdit,
  onDelete,
}: CategoryItemProps) {
  const Icon = category.icon || BookOpen;
  const count = getCategoryCount(category.id);
  const childCategories = getChildCategories(categories, category.id);
  const isSelected = selectedCategoryId === category.id;
  const indentClass = level === 0 ? '' : level === 1 ? 'pl-8' : 'pl-10';
  const paddingClass = level === 0 ? 'py-2' : 'py-1.5';

  return (
    <div>
      <div
        className={cn(
          'group w-full flex items-center gap-2 px-3 rounded-lg transition-colors',
          paddingClass,
          indentClass,
          isSelected ? 'bg-blue-50 dark:bg-blue-900/20' : 'hover:bg-gray-100 dark:hover:bg-gray-750'
        )}
      >
        <button
          onClick={() => onSelect(category.id)}
          className='flex items-center gap-2 text-left min-w-0 flex-1'
        >
          <Icon
            className={cn(
              'w-4 h-4 shrink-0',
              category.color,
              isSelected && 'text-blue-600 dark:text-blue-400'
            )}
          />
          <span
            className={cn(
              'text-sm truncate max-w-[100px] block',
              isSelected
                ? 'text-blue-600 dark:text-blue-400'
                : level === 0
                  ? 'text-gray-700 dark:text-gray-300'
                  : 'text-gray-600 dark:text-gray-400'
            )}
            title={category.name}
          >
            {category.name}
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
            {category.promptCount ?? count ?? 0}
          </Badge>
        </div>
      </div>
      {childCategories.length > 0 && (
        <div className='mt-1 space-y-1'>
          {childCategories.map(child => (
            <CategoryItem
              key={child.id}
              category={child}
              selectedCategoryId={selectedCategoryId}
              categories={categories}
              level={level + 1}
              getCategoryCount={getCategoryCount}
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

export function PromptLibraryDialog({ onClose, onSelectPrompt }: PromptLibraryDialogProps) {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, LIMITS.SEARCH_DEBOUNCE_MS);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(SYSTEM_CATEGORY_IDS.ALL);
  const [categories, setCategories] = useState<Category[]>([
    { id: 'all', name: t('common.all'), icon: Sparkles, color: 'text-gray-700 dark:text-gray-300', isSystem: true },
    {
      id: 'favorites',
      name: t('common.favorites'),
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
  const [pageParam, setPageParam] = useState({ pageSize: 10, pageNo: 1, total: 0 });

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

  const formatUsageCount = useCallback(
    (count: number) => {
      const parts = [t('prompts.usagePrefix'), String(count), t('prompts.usageSuffix')].filter(
        p => p && p.trim().length > 0
      );
      return parts.join(' ');
    },
    [t]
  );

  const convertCategoryVoToCategory = useCallback((vo: PromptCategoryVo): Category => {
    const iconName = vo.icon || 'BookOpen';
    const IconComponent = ICON_MAP[iconName] || BookOpen;
    return {
      id: String(vo.id || ''),
      name: vo.name || '',
      icon: IconComponent,
      color: vo.color || 'text-blue-600 dark:text-blue-400',
      isSystem: vo.isSystem,
      parentId: vo.parentId ? String(vo.parentId) : undefined,
      promptCount: vo.promptCount,
    };
  }, []);

  const convertPromptVoToPrompt = useCallback((vo: PromptListVo): Prompt => {
    return {
      id: vo.id || '',
      title: vo.title || '',
      content: vo.content || '',
      category: vo.categoryId ? String(vo.categoryId) : '',
      categoryId: vo.categoryId,
      tags: (vo.tags || []).map(tag => ({ label: tag, color: getTagColorByIndex(tag) })),
      isFavorite: vo.isFavorite || false,
      usageCount: vo.stats?.totalUses || 0,
      isSystem: vo.isSystem,
    };
  }, []);

  const loadCategories = useCallback(async () => {
    setIsLoadingCategories(true);
    try {
      const response = await PromptCategories.getPromptCategoryTree();
      if (response.data && Array.isArray(response.data)) {
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
          const allCat = prev.find(c => c.id === 'all');
          const favCat = prev.find(c => c.id === 'favorites');
          return [allCat!, favCat!, ...flattenCategories].filter(Boolean);
        });
      }
    } catch (error: any) {
      console.error('Failed to load categories:', error);
      toast.error(error?.message || t('prompts.loadCategoriesFailed'));
    } finally {
      setIsLoadingCategories(false);
    }
  }, [convertCategoryVoToCategory, t]);

  const loadPrompts = useCallback(async () => {
    setIsLoadingPrompts(true);
    try {
      const query: Record<string, unknown> = {
        pageNo: pageParam.pageNo,
        pageSize: pageParam.pageSize,
      };
      if (selectedCategoryId === SYSTEM_CATEGORY_IDS.FAVORITES) {
        query.isFavorite = true;
      } else if (selectedCategoryId && selectedCategoryId !== SYSTEM_CATEGORY_IDS.ALL) {
        query.categoryId = selectedCategoryId;
      }
      if (debouncedSearchQuery.trim()) {
        query.keyword = debouncedSearchQuery.trim();
      }

      const response = await Prompts.getPromptList(query);
      const { data } = response || {};
      const list = data?.list || [];
      const total = Number(data?.total) || 0;
      setPageParam(prev => ({ ...prev, total }));
      setPrompts(
        Array.isArray(list) ? list.map(convertPromptVoToPrompt) : []
      );
    } catch (error: any) {
      console.error('Failed to load prompts:', error);
      toast.error(error?.message || t('prompts.loadPromptsFailed'));
      setPrompts([]);
    } finally {
      setIsLoadingPrompts(false);
    }
  }, [
    selectedCategoryId,
    debouncedSearchQuery,
    pageParam.pageNo,
    pageParam.pageSize,
    convertPromptVoToPrompt,
    t,
  ]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  useEffect(() => {
    loadPrompts();
  }, [loadPrompts]);

  const handlePageChange = (page: { pageSize: number; pageNo: number }) => {
    setPageParam(prev => ({ ...prev, ...page }));
  };

  const getCategoryCount = (categoryId: string) => {
    if (categoryId === SYSTEM_CATEGORY_IDS.ALL) return totalCount;
    if (categoryId === SYSTEM_CATEGORY_IDS.FAVORITES) return favoriteCount;
    return undefined;
  };

  const buildCategoryTreeForDialog = useCallback(
    (parentId: string | undefined, _level = 0, excludeId?: string) =>
      buildCategoryTree(categories, parentId, excludeId),
    [categories]
  );

  const getCategoryPathForDialog = useCallback(
    (categoryId: string) => getCategoryPath(categories, categoryId),
    [categories]
  );

  const collectAllChildCategoryIds = useCallback((parentId: string, all: Category[]): string[] => {
    const childIds: string[] = [];
    const children = all.filter(c => c.parentId === parentId);
    for (const child of children) {
      childIds.push(child.id);
      childIds.push(...collectAllChildCategoryIds(child.id, all));
    }
    return childIds;
  }, []);

  const toggleFavorite = async (id: string) => {
    const prompt = prompts.find(p => p.id === id);
    if (!prompt) return;
    const newFavoriteStatus = !prompt.isFavorite;
    try {
      await Prompts.toggleFavoritePrompt(id, { isFavorite: newFavoriteStatus });
      setPrompts(prev => prev.map(p => (p.id === id ? { ...p, isFavorite: newFavoriteStatus } : p)));
      toast.success(t('prompts.favoriteUpdated'));
      await loadCategories();
    } catch (error: any) {
      console.error('Failed to update favorite status:', error);
    }
  };

  const copyPrompt = async (content: string) => {
    if (!content?.trim()) {
      toast.error(t('common.messages.copyEmptyError'));
      return;
    }
    try {
      const success = await copyToClipboard(content);
      if (success) toast.success(t('common.messages.copySuccess'));
      else toast.error(t('common.messages.copyFailed'));
    } catch {
      toast.error(t('common.messages.copyFailed'));
    }
  };

  const usePrompt = async (prompt: Prompt) => {
    try {
      await Prompts.usePrompt(prompt.id);
      await loadPrompts();
      onSelectPrompt(prompt.content);
      toast.success(t('prompts.promptInserted') || t('prompts.promptCopied') || '已插入提示词');
      onClose();
    } catch (error: any) {
      onSelectPrompt(prompt.content);
      toast.error(error?.message || t('prompts.usePromptFailed'));
    }
  };

  const duplicatePrompt = async (prompt: Prompt) => {
    const duplicateTitle = [prompt.title, t('prompts.copySuffix')].filter(Boolean).join(' ').trim();
    try {
      await Prompts.duplicatePrompt(prompt.id, { title: duplicateTitle });
      await loadPrompts();
      toast.success(t('prompts.duplicateSuccess'));
    } catch (error: any) {
      toast.error(error?.message || t('prompts.duplicateFailed'));
    }
  };

  const openCreateDialog = () => {
    setEditingPrompt(null);
    setShowPromptDialog(true);
  };

  const openEditDialog = (prompt: Prompt) => {
    if (prompt.isSystem) {
      toast.error(t('prompts.cannotEditSystem'));
      return;
    }
    setEditingPrompt(prompt);
    setShowPromptDialog(true);
  };

  const handleDeletePrompt = async () => {
    if (!deletingPrompt) return;
    if (deletingPrompt.isSystem) {
      toast.error(t('prompts.cannotDeleteSystem'));
      setShowDeleteDialog(false);
      setDeletingPrompt(null);
      return;
    }
    try {
      await Prompts.deletePrompt(deletingPrompt.id);
      await loadPrompts();
      toast.success(t('prompts.promptDeleteSuccess'));
      setShowDeleteDialog(false);
      setDeletingPrompt(null);
    } catch (error: any) {
      toast.error(error?.message || t('prompts.promptDeleteFailed'));
    }
  };

  const handleDeleteCategory = async () => {
    if (!deletingCategory) return;
    if (deletingCategory.isSystem) {
      toast.error(t('prompts.cannotDeleteSystemCategory'));
      setShowDeleteCategoryDialog(false);
      setDeletingCategory(null);
      return;
    }
    try {
      const allChildIds = collectAllChildCategoryIds(deletingCategory.id, categories);
      const ids = [deletingCategory.id, ...allChildIds];
      await PromptCategories.batchDeletePromptCategories({ ids });
      if (ids.includes(selectedCategoryId)) setSelectedCategoryId(SYSTEM_CATEGORY_IDS.ALL);
      await loadCategories();
      await loadPrompts();
      toast.success(t('prompts.categoryDeleted'));
      setShowDeleteCategoryDialog(false);
      setDeletingCategory(null);
    } catch (error: any) {
      toast.error(error?.message || t('prompts.deleteCategoryFailed'));
    }
  };

  const getCategoryDisplayName = (cat: Category) => cat.name;

  return (
    <>
      <Dialog open onOpenChange={open => !open && onClose()}>
        <DialogContent className='sm:max-w-[1124px] max-w-[calc(100%-2rem)] h-[80vh] p-0 dark:bg-gray-800'>
          <DialogHeader className='px-6 py-4 border-b dark:border-gray-700'>
            <DialogTitle className='flex items-center gap-2 dark:text-white'>
              <Sparkles className='w-5 h-5 text-blue-500' />
              {t('prompts.title')}
            </DialogTitle>
            <DialogDescription className='sr-only'>{t('prompts.subtitle')}</DialogDescription>
            <div className='flex items-center gap-2 mt-4'>
              <div className='w-[300px] relative'>
                <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400' />
                <Input
                  placeholder={t('prompts.search')}
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className='pl-10 dark:bg-gray-750 dark:border-gray-600'
                />
              </div>
              <div className='flex-1' />
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
              <Button onClick={openCreateDialog} className='gap-2'>
                <Plus className='w-4 h-4' />
                {t('prompts.newPrompt')}
              </Button>
            </div>
          </DialogHeader>

          <div className='flex flex-1 overflow-hidden'>
            <div className='w-64 border-r dark:border-gray-700 p-4'>
              <ScrollArea className='h-full'>
                {isLoadingCategories ? (
                  <div className='space-y-2'>
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className='flex items-center gap-2 px-3 py-2'>
                        <Skeleton className='w-4 h-4 rounded dark:bg-gray-700' />
                        <Skeleton className='h-4 flex-1 max-w-[120px] dark:bg-gray-700' />
                        <Skeleton className='h-5 w-8 rounded dark:bg-gray-700' />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className='space-y-1'>
                    {getTopLevelCategories(categories).map(cat => (
                      <CategoryItem
                        key={cat.id}
                        category={cat}
                        selectedCategoryId={selectedCategoryId}
                        categories={categories}
                        level={0}
                        getCategoryCount={getCategoryCount}
                        onSelect={id => {
                          setSelectedCategoryId(id);
                          setPageParam(prev => ({ ...prev, pageNo: 1 }));
                        }}
                        onEdit={c => {
                          setEditingCategory(c);
                          setShowCategoryDialog(true);
                        }}
                        onDelete={c => {
                          setDeletingCategory(c);
                          setShowDeleteCategoryDialog(true);
                        }}
                      />
                    ))}
                  </div>
                )}
              </ScrollArea>
            </div>

            <div className='flex-1 overflow-hidden flex flex-col'>
              <ScrollArea className='flex-1'>
                <div className='p-6 space-y-4'>
                  {isLoadingPrompts ? (
                    <>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div
                          key={i}
                          className='p-5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg'
                        >
                          <div className='flex items-start justify-between mb-3'>
                            <div className='flex-1 space-y-2'>
                              <div className='flex items-center gap-2'>
                                <Skeleton className='h-5 w-40 dark:bg-gray-700' />
                                <Skeleton className='h-5 w-14 rounded dark:bg-gray-700' />
                              </div>
                              <div className='flex flex-wrap gap-1.5'>
                                <Skeleton className='h-5 w-12 rounded dark:bg-gray-700' />
                                <Skeleton className='h-5 w-14 rounded dark:bg-gray-700' />
                              </div>
                            </div>
                          </div>
                          <Skeleton className='h-4 w-full mb-2 dark:bg-gray-700' />
                          <Skeleton className='h-4 w-3/4 mb-4 dark:bg-gray-700' />
                          <div className='flex items-center gap-2'>
                            <Skeleton className='h-8 w-24 dark:bg-gray-700' />
                            <Skeleton className='h-8 w-20 dark:bg-gray-700' />
                          </div>
                        </div>
                      ))}
                    </>
                  ) : prompts.length === 0 ? (
                    <div className='text-center py-20'>
                      <Sparkles className='w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-gray-600' />
                      <p className='text-gray-500 dark:text-gray-400'>
                        {debouncedSearchQuery ? t('prompts.noResults') : t('prompts.noPrompts')}
                      </p>
                    </div>
                  ) : (
                    prompts.map(prompt => (
                      <div
                        key={prompt.id}
                        className='p-4 bg-white dark:bg-gray-750 border border-gray-200 dark:border-gray-600 rounded-lg hover:shadow-md transition-shadow'
                      >
                        <div className='flex items-start justify-between mb-3'>
                          <div className='flex-1'>
                            <div className='flex items-center gap-2 mb-2'>
                              <h3 className='dark:text-white'>{prompt.title}</h3>
                              {prompt.isSystem && (
                                <Badge variant='secondary' className='text-xs gap-1'>
                                  <Shield className='w-3 h-3' />
                                  {t('prompts.systemLabel')}
                                </Badge>
                              )}
                              <Badge variant='outline' className='text-xs'>
                                {formatUsageCount(prompt.usageCount)}
                              </Badge>
                            </div>
                            <div className='flex flex-wrap gap-1.5'>
                              {prompt.tags.map((tag, i) => (
                                <span key={i} className={cn('text-xs px-2 py-1 rounded-md', tag.color)}>
                                  {tag.label}
                                </span>
                              ))}
                            </div>
                          </div>
                          <Button variant='ghost' size='icon' onClick={() => toggleFavorite(prompt.id)}>
                            <Star
                              className={cn('w-4 h-4', prompt.isFavorite && 'fill-yellow-400 text-yellow-400')}
                            />
                          </Button>
                        </div>

                        <p className='text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3 whitespace-pre-wrap'>
                          {prompt.content}
                        </p>

                        <div className='flex items-center gap-2'>
                          <Button size='sm' onClick={() => usePrompt(prompt)} className='min-w-[120px]'>
                            {t('prompts.use')}
                          </Button>
                          <Button
                            variant='outline'
                            size='sm'
                            onClick={() => copyPrompt(prompt.content)}
                            className='gap-2'
                          >
                            <Copy className='w-3 h-3' />
                            {t('common.actions.copy')}
                          </Button>
                          {!prompt.isSystem && (
                            <Button
                              variant='outline'
                              size='sm'
                              onClick={() => duplicatePrompt(prompt)}
                              className='gap-2'
                            >
                              <Copy className='w-3 h-3' />
                              {t('prompts.duplicateAction')}
                            </Button>
                          )}
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

              {!isLoadingPrompts && pageParam.total > pageParam.pageSize && (
                <div className='p-4 border-t dark:border-gray-700'>
                  <XcanPagination {...pageParam} onChange={handlePageChange} />
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <PromptDialog
        open={showPromptDialog}
        onOpenChange={setShowPromptDialog}
        editingPrompt={editingPrompt}
        categories={categories}
        defaultCategoryId={getDefaultCategoryId(categories, selectedCategoryId)}
        onSuccess={loadPrompts}
        getCategoryName={getCategoryDisplayName}
      />

      <CategoryDialog
        open={showCategoryDialog}
        onOpenChange={setShowCategoryDialog}
        editingCategory={editingCategory}
        onSuccess={loadCategories}
        buildCategoryTree={buildCategoryTreeForDialog}
        getCategoryPath={getCategoryPathForDialog}
      />

      <DeletePromptDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        deletingPrompt={deletingPrompt}
        onConfirm={handleDeletePrompt}
      />

      <DeleteCategoryDialog
        open={showDeleteCategoryDialog}
        onOpenChange={setShowDeleteCategoryDialog}
        deletingCategory={deletingCategory}
        onConfirm={handleDeleteCategory}
      />

      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className='max-w-[792px] dark:bg-gray-800 dark:border-gray-700'>
          <DialogHeader>
            <DialogTitle className='dark:text-white'>{t('prompts.viewPromptTitle')}</DialogTitle>
            <DialogDescription className='dark:text-gray-400'>
              {t('prompts.viewPromptDescription')}
            </DialogDescription>
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
                        {t('prompts.systemLabel')}
                      </Badge>
                    )}
                  </div>
                  <Badge variant='outline' className='text-xs mt-1'>
                    {formatUsageCount(viewingPrompt.usageCount)}
                  </Badge>
                </div>
              </div>

              <div className='space-y-3'>
                <div>
                  <label className='text-sm text-gray-600 dark:text-gray-400'>{t('prompts.category')}</label>
                  <p className='text-sm dark:text-white mt-1'>
                    {categories.find(c => c.id === viewingPrompt.category)?.name ?? '-'}
                  </p>
                </div>

                {viewingPrompt.tags?.length > 0 && (
                  <div>
                    <label className='text-sm text-gray-600 dark:text-gray-400'>{t('prompts.tags')}</label>
                    <div className='flex flex-wrap gap-2 mt-2'>
                      {viewingPrompt.tags.map((tag, i) => (
                        <Badge key={i} variant='secondary' className={cn('text-xs', tag.color)}>
                          {tag.label}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <div className='flex items-center justify-between mb-2'>
                    <label className='text-sm text-gray-600 dark:text-gray-400'>
                      {t('prompts.promptContent')}
                    </label>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => copyPrompt(viewingPrompt.content)}
                      className='gap-2'
                    >
                      <Copy className='w-3 h-3' />
                      {t('common.actions.copy')}
                    </Button>
                  </div>
                  <div className='p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600'>
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
    </>
  );
}
