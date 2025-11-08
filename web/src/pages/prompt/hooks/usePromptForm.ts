/**
 * 提示词表单管理 Hook
 */

import { useState, useEffect } from 'react';
import { PromptFormData, PromptTag, Category } from '../types';
import { DEFAULT_VALUES } from '../constants';
import { isAvailableCategory } from '../utils';

const INITIAL_FORM_DATA: PromptFormData = {
  title: '',
  content: '',
  category: '',
  tags: [],
};

interface UsePromptFormProps {
  editingPrompt: { title: string; content: string; category: string; tags: PromptTag[] } | null;
  categories: Category[];
  defaultCategoryId?: string;
  isDialogOpen: boolean;
}

export const usePromptForm = ({
  editingPrompt,
  categories,
  defaultCategoryId,
  isDialogOpen,
}: UsePromptFormProps) => {
  const [formData, setFormData] = useState<PromptFormData>(INITIAL_FORM_DATA);
  const [newTagLabel, setNewTagLabel] = useState('');
  const [newTagColor, setNewTagColor] = useState<string>(DEFAULT_VALUES.TAG_COLOR);

  // 当对话框打开或编辑的提示词变化时，初始化表单
  useEffect(() => {
    if (isDialogOpen) {
      if (editingPrompt) {
        setFormData({
          title: editingPrompt.title,
          content: editingPrompt.content,
          category: editingPrompt.category,
          tags: [...editingPrompt.tags],
        });
      } else {
        // 获取可用的分组列表（过滤掉系统分组、all 和 favorites）
        const availableCategories = categories.filter(isAvailableCategory);
        // 验证 defaultCategoryId 是否在可用分组列表中
        const isValidDefaultCategory =
          defaultCategoryId && availableCategories.some(cat => cat.id === defaultCategoryId);
        // 如果有有效的 defaultCategoryId 则使用它，否则使用第一个可用分组
        const firstAvailableCategory = availableCategories.length > 0 ? availableCategories[0] : null;
        const initialCategoryId = isValidDefaultCategory
          ? defaultCategoryId
          : firstAvailableCategory?.id || '';

        setFormData({
          title: '',
          content: '',
          category: initialCategoryId,
          tags: [],
        });
      }
      setNewTagLabel('');
      setNewTagColor(DEFAULT_VALUES.TAG_COLOR);
    }
  }, [isDialogOpen, editingPrompt, defaultCategoryId, categories]);

  const updateFormField = <K extends keyof PromptFormData>(field: K, value: PromptFormData[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addTag = (tagLabel: string, tagColor: string) => {
    setFormData(prev => ({
      ...prev,
      tags: [...prev.tags, { label: tagLabel.trim(), color: tagColor }],
    }));
    setNewTagLabel('');
    setNewTagColor(DEFAULT_VALUES.TAG_COLOR);
  };

  const removeTag = (index: number) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index),
    }));
  };

  const resetForm = () => {
    setFormData(INITIAL_FORM_DATA);
    setNewTagLabel('');
    setNewTagColor(DEFAULT_VALUES.TAG_COLOR);
  };

  return {
    formData,
    newTagLabel,
    newTagColor,
    setNewTagLabel,
    setNewTagColor,
    updateFormField,
    addTag,
    removeTag,
    resetForm,
  };
};

