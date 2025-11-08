/**
 * 提示词库相关类型定义
 */

import { LucideIcon } from 'lucide-react';

// 提示词标签
export interface PromptTag {
  label: string;
  color: string;
}

// 提示词
export interface Prompt {
  id: string;
  title: string;
  content: string;
  category: string;
  categoryId?: string;
  tags: PromptTag[];
  isFavorite: boolean;
  usageCount: number;
  isSystem?: boolean;
}

// 分类
export interface Category {
  id: string;
  name: string;
  nameEn: string;
  icon: LucideIcon;
  color: string;
  isSystem?: boolean;
  parentId?: string;
  promptCount?: number;
}

// 分类表单数据
export interface CategoryFormData {
  name: string;
  icon: LucideIcon;
  color: string;
  parentId: string;
}

// 提示词表单数据
export interface PromptFormData {
  title: string;
  content: string;
  category: string;
  tags: PromptTag[];
}

