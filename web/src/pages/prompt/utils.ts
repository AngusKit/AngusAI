/**
 * 提示词库相关工具函数
 */

import { Category, PromptTag } from './types';
import { TAG_COLORS, SYSTEM_CATEGORY_IDS } from './constants';
import { constantTranslation as t } from '@/lib/i18n';

/**
 * 根据索引获取标签颜色（循环分配）
 */
export const getTagColorByIndex = (index: number): string => {
  const color = TAG_COLORS[index % TAG_COLORS.length] ?? TAG_COLORS[0];
  return color?.value ?? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
};

/**
 * 构建分类树（递归）
 * @param categories 所有分类列表
 * @param parentId 父分类ID
 * @param excludeId 要排除的分类ID（用于编辑时避免循环引用）
 */
export const buildCategoryTree = (
  categories: Category[],
  parentId: string | undefined,
  excludeId?: string
): Category[] => {
  const result: Category[] = [];
  const children = categories.filter(
    c =>
      c.parentId === parentId &&
      c.id !== SYSTEM_CATEGORY_IDS.ALL &&
      c.id !== SYSTEM_CATEGORY_IDS.FAVORITES &&
      c.id !== excludeId
  );

  for (const category of children) {
    result.push(category);
    // 递归获取子分类
    const subCategories = buildCategoryTree(categories, category.id, excludeId);
    result.push(...subCategories);
  }

  return result;
};

/**
 * 获取分类的层级路径（用于显示）
 * @param categories 所有分类列表
 * @param categoryId 分类ID
 */
export const getCategoryPath = (categories: Category[], categoryId: string): string[] => {
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

/**
 * 获取顶层分类（无父分类的分类）
 */
export const getTopLevelCategories = (categories: Category[]): Category[] => {
  return categories.filter(c => !c.parentId);
};

/**
 * 获取某个分类的子分类
 */
export const getChildCategories = (categories: Category[], parentId: string): Category[] => {
  return categories.filter(c => c.parentId === parentId);
};

/**
 * 验证分类名称
 */
export const validateCategoryName = (
  name: string,
  t: (key: string, params?: Record<string, string | number>) => string
): { isValid: boolean; error?: string } => {
  if (!name.trim()) {
    return { isValid: false, error: t('prompts.categoryNameRequired') };
  }
  return { isValid: true };
};

/**
 * 验证提示词表单
 */
export const validatePromptForm = (
  formData: { title: string; content: string; category: string },
): { isValid: boolean; error?: string } => {
  if (!formData.title.trim() || !formData.content.trim()) {
    return {
      isValid: false,
      error: t('prompts.validateMessage.titleRequired'),
    };
  }

  if (!formData.category) {
    return {
      isValid: false,
      error: t('prompts.validateMessage.categoryRequired'),
    };
  }

  return { isValid: true };
};

/**
 * 验证标签
 */
export const validateTag = (
  tagLabel: string,
  existingTags: PromptTag[],
): { isValid: boolean; error?: string } => {
  if (!tagLabel.trim()) {
    return {
      isValid: false,
      error: t('prompts.validateMessage.tagRequired'),
    };
  }

  if (existingTags.length >= 5) {
    return {
      isValid: false,
      error: t('prompts.validateMessage.tagMaxCount'),
    };
  }

  return { isValid: true };
};

/**
 * 检查是否为系统分类
 */
export const isSystemCategory = (categoryId: string): boolean => {
  return categoryId === SYSTEM_CATEGORY_IDS.ALL || categoryId === SYSTEM_CATEGORY_IDS.FAVORITES;
};

/**
 * 检查是否为可用分类（非系统分类）
 */
export const isAvailableCategory = (category: Category): boolean => {
  return category.id !== SYSTEM_CATEGORY_IDS.ALL && category.id !== SYSTEM_CATEGORY_IDS.FAVORITES && !category.isSystem;
};

/**
 * 获取默认分类ID（用于新建提示词时）
 */
export const getDefaultCategoryId = (categories: Category[], selectedCategoryId: string): string | undefined => {
  // 如果选中的是 'all' 或 'favorites'，查找第一个可用分组
  if (selectedCategoryId === SYSTEM_CATEGORY_IDS.ALL || selectedCategoryId === SYSTEM_CATEGORY_IDS.FAVORITES) {
    return categories.find(c => isAvailableCategory(c))?.id;
  }
  // 如果选中的是系统分组，也查找第一个可用分组
  const selectedCat = categories.find(c => c.id === selectedCategoryId);
  if (selectedCat?.isSystem) {
    return categories.find(c => isAvailableCategory(c))?.id;
  }
  // 否则使用选中的分类
  return selectedCategoryId;
};
