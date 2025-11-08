/**
 * 分类表单管理 Hook
 */

import { useState, useEffect } from 'react';
import { LucideIcon } from 'lucide-react';
import { CategoryFormData } from '../types';
import { DEFAULT_VALUES } from '../constants';

const INITIAL_FORM_DATA: CategoryFormData = {
  name: '',
  icon: DEFAULT_VALUES.CATEGORY_ICON,
  color: DEFAULT_VALUES.CATEGORY_COLOR,
  parentId: DEFAULT_VALUES.PARENT_CATEGORY_NONE,
};

interface UseCategoryFormProps {
  editingCategory: { name: string; icon: LucideIcon; color: string; parentId?: string } | null;
  isDialogOpen: boolean;
}

export const useCategoryForm = ({ editingCategory, isDialogOpen }: UseCategoryFormProps) => {
  const [formData, setFormData] = useState<CategoryFormData>(INITIAL_FORM_DATA);

  // 当对话框打开或编辑的分类变化时，初始化表单
  useEffect(() => {
    if (isDialogOpen) {
      if (editingCategory) {
        setFormData({
          name: editingCategory.name,
          icon: editingCategory.icon,
          color: editingCategory.color,
          parentId: editingCategory.parentId || DEFAULT_VALUES.PARENT_CATEGORY_NONE,
        });
      } else {
        setFormData(INITIAL_FORM_DATA);
      }
    }
  }, [isDialogOpen, editingCategory]);

  const updateFormField = <K extends keyof CategoryFormData>(field: K, value: CategoryFormData[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData(INITIAL_FORM_DATA);
  };

  return {
    formData,
    updateFormField,
    resetForm,
  };
};
