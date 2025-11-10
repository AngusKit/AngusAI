import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { VisibilityEnum } from '@/enums/enums';
import { VISIBILITY_OPTIONS_MAP, FORM_VALIDATION } from '../constants';
import { ICON_OPTIONS } from '@/utils';

/** 数据集表单数据类型 */
export type DatasetFormDataType = 'table' | 'datasource';

/** 数据集表单状态 */
export interface DatasetFormState {
  datasetName: string;
  description: string;
  dataType: DatasetFormDataType;
  visibility: string;
  selectedIcon: number;
  tags: string[];
  tagInput: string;
}

/** 初始表单状态 */
const INITIAL_FORM_STATE: DatasetFormState = {
  datasetName: '',
  description: '',
  dataType: 'table',
  visibility: 'private',
  selectedIcon: 0,
  tags: [],
  tagInput: '',
};

/**
 * 数据集表单管理 Hook
 */
export function useDatasetForm(initialState?: Partial<DatasetFormState>) {
  const [formState, setFormState] = useState<DatasetFormState>({
    ...INITIAL_FORM_STATE,
    ...initialState,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  /** 更新表单字段 */
  const updateField = useCallback(<K extends keyof DatasetFormState>(field: K, value: DatasetFormState[K]) => {
    setFormState(prev => ({ ...prev, [field]: value }));
  }, []);

  /** 重置表单 */
  const resetForm = useCallback(() => {
    setFormState({ ...INITIAL_FORM_STATE, ...initialState });
  }, [initialState]);

  /** 添加标签 */
  const addTag = useCallback((tag: string) => {
    const newTag = tag.trim();

    if (!newTag) return false;

    if (newTag.length > FORM_VALIDATION.TAG_MAX_LENGTH) {
      toast.error('标签长度不能超过10个字符');
      return false;
    }

    if (formState.tags.length >= FORM_VALIDATION.TAG_MAX_COUNT) {
      toast.error('最多只能添加5个标签');
      return false;
    }

    if (formState.tags.includes(newTag)) {
      toast.error('标签已存在');
      return false;
    }

    setFormState(prev => ({
      ...prev,
      tags: [...prev.tags, newTag],
      tagInput: '',
    }));
    return true;
  }, [formState.tags]);

  /** 移除标签 */
  const removeTag = useCallback((tagToRemove: string) => {
    setFormState(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove),
    }));
  }, []);

  /** 处理标签输入 */
  const handleTagInput = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(formState.tagInput);
    }
  }, [formState.tagInput, addTag]);

  /** 验证表单 */
  const validateForm = useCallback((): boolean => {
    if (!formState.datasetName.trim()) {
      toast.error('请输入数据集名称');
      return false;
    }
    if (!formState.description.trim()) {
      toast.error('请输入描述');
      return false;
    }
    return true;
  }, [formState]);

  /** 获取表单数据用于提交 */
  const getFormData = useCallback(() => {
    return {
      name: formState.datasetName.trim(),
      description: formState.description.trim(),
      visibility: VISIBILITY_OPTIONS_MAP[formState.visibility] || VisibilityEnum.PRIVATE,
      icon: ICON_OPTIONS[formState.selectedIcon]?.emoji,
      iconBg: ICON_OPTIONS[formState.selectedIcon]?.bg,
      tags: formState.tags.length > 0 ? formState.tags : undefined,
    };
  }, [formState]);

  return {
    formState,
    isSubmitting,
    setIsSubmitting,
    updateField,
    resetForm,
    addTag,
    removeTag,
    handleTagInput,
    validateForm,
    getFormData,
  };
}

