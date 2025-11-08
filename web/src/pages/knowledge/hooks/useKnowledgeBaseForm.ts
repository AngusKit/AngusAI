/**
 * 知识库表单状态管理 Hook
 */

import { useState, useCallback, useEffect } from 'react';
import { CONFIG_CONSTANTS, ICON_OPTIONS } from '../constants';
import { validateTag } from '../utils';
import { toast } from 'sonner';

export interface KnowledgeBaseFormData {
  name: string;
  description: string;
  visibility: 'private' | 'team' | 'public';
  selectedIconIndex: number;
  tags: string[];
  chunkSize: number[];
  chunkOverlap: number[];
  embeddingModelId: number | undefined;
  vectorStoreId: string;
  removeDuplicates: boolean;
  cleanHTML: boolean;
  optimizeTextFormat: boolean;
}

const DEFAULT_FORM_DATA: KnowledgeBaseFormData = {
  name: '',
  description: '',
  visibility: 'private',
  selectedIconIndex: 0,
  tags: [],
  chunkSize: [CONFIG_CONSTANTS.CHUNK_SIZE.DEFAULT],
  chunkOverlap: [CONFIG_CONSTANTS.CHUNK_OVERLAP.DEFAULT],
  embeddingModelId: undefined,
  vectorStoreId: '1',
  removeDuplicates: true,
  cleanHTML: true,
  optimizeTextFormat: true,
};

/**
 * 知识库表单状态管理 Hook
 */
export const useKnowledgeBaseForm = (initialData?: Partial<KnowledgeBaseFormData>) => {
  const [formData, setFormData] = useState<KnowledgeBaseFormData>({
    ...DEFAULT_FORM_DATA,
    ...initialData,
  });
  const [tagInput, setTagInput] = useState('');

  // 当初始数据变化时，更新表单数据
  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({
        ...prev,
        ...initialData,
      }));
    }
  }, [initialData]);

  // 更新表单字段
  const updateField = useCallback(
    <K extends keyof KnowledgeBaseFormData>(field: K, value: KnowledgeBaseFormData[K]) => {
      setFormData(prev => ({ ...prev, [field]: value }));
    },
    []
  );

  // 添加标签
  const addTag = useCallback(
    (tag: string) => {
      const validation = validateTag(tag, formData.tags);
      if (validation.isValid) {
        setFormData(prev => ({
          ...prev,
          tags: [...prev.tags, tag.trim()],
        }));
        setTagInput('');
      }
    },
    [formData.tags]
  );

  // 移除标签
  const removeTag = useCallback((tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove),
    }));
  }, []);

  // 处理标签输入
  const handleTagInputKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' || e.key === ',') {
        e.preventDefault();
        if (tagInput.trim()) {
          addTag(tagInput);
        }
      }
    },
    [tagInput, addTag]
  );

  // 重置表单
  const resetForm = useCallback(() => {
    setFormData(DEFAULT_FORM_DATA);
    setTagInput('');
  }, []);

  // 根据图标emoji查找索引
  const setSelectedIconByEmoji = useCallback(
    (emoji: string) => {
      const iconIndex = ICON_OPTIONS.findIndex(opt => opt.emoji === emoji);
      if (iconIndex !== -1) {
        updateField('selectedIconIndex', iconIndex);
      }
    },
    [updateField]
  );

  return {
    formData,
    tagInput,
    setTagInput,
    updateField,
    addTag,
    removeTag,
    handleTagInputKeyDown,
    resetForm,
    setSelectedIconByEmoji,
  };
};
