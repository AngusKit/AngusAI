/**
 * 模型表单管理 Hook
 */

import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import ModelsService from '@/services/Models';
import { ModelCreateDto, ModelUpdateDto } from '@/services/ModelsTypes';
import { ModelProviderEnum } from '@/enums/enums';
import { DEFAULT_FORM_DATA } from '../constants';
import { parseNumber } from '../utils';
import type { ModelFormData } from '../types';

interface UseModelFormReturn {
  formData: ModelFormData;
  setFormData: React.Dispatch<React.SetStateAction<ModelFormData>>;
  resetForm: () => void;
  validateForm: () => boolean;
  handleCreateModel: () => Promise<boolean>;
  handleUpdateModel: (modelId: string) => Promise<boolean>;
}

export const useModelForm = (
  language: string,
  onSuccess?: () => Promise<void>
): UseModelFormReturn => {
  const [formData, setFormData] = useState<ModelFormData>(DEFAULT_FORM_DATA);

  const resetForm = useCallback(() => {
    setFormData(DEFAULT_FORM_DATA);
  }, []);

  const validateForm = useCallback((): boolean => {
    if (!formData.name.trim() || !formData.provider || !formData.version.trim()) {
      toast.error(language === 'zh-CN' ? '请填写必填字段' : 'Please fill in required fields');
      return false;
    }
    return true;
  }, [formData, language]);

  const handleCreateModel = useCallback(async (): Promise<boolean> => {
    if (!validateForm()) {
      return false;
    }

    const maxTokens = parseNumber(formData.maxTokens);
    const temperature = parseNumber(formData.temperature);

    const payload: ModelCreateDto = {
      name: formData.name.trim(),
      description: formData.description.trim() || formData.name.trim(),
      type: formData.type,
      provider: formData.provider as ModelProviderEnum,
      version: formData.version.trim(),
      apiEndpoint: formData.endpoint.trim() || undefined,
      apiKey: formData.apiKey.trim() || undefined,
      maxTokens,
      temperature,
    };

    try {
      await ModelsService.createModel(payload);
      toast.success(
        language === 'zh-CN' ? `模型 "${formData.name}" 已成功添加！` : `Model "${formData.name}" added successfully!`
      );
      resetForm();
      if (onSuccess) {
        await onSuccess();
      }
      return true;
    } catch (error: any) {
      console.error('Failed to add model:', error);
      toast.error(error?.message || (language === 'zh-CN' ? '添加模型失败' : 'Failed to add model'));
      return false;
    }
  }, [formData, validateForm, language, resetForm, onSuccess]);

  const handleUpdateModel = useCallback(
    async (modelId: string): Promise<boolean> => {
      if (!validateForm()) {
        return false;
      }

      const maxTokens = parseNumber(formData.maxTokens);
      const temperature = parseNumber(formData.temperature);

      const payload: ModelUpdateDto = {
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        provider: formData.provider as ModelProviderEnum,
        version: formData.version.trim(),
        type: formData.type,
        apiEndpoint: formData.endpoint.trim() || undefined,
        apiKey: formData.apiKey.trim() || undefined,
        maxTokens,
        temperature,
      };

      try {
        await ModelsService.updateModel(modelId, payload);
        toast.success(
          language === 'zh-CN' ? `模型 "${formData.name}" 配置已更新` : `Model "${formData.name}" updated successfully`
        );
        if (onSuccess) {
          await onSuccess();
        }
        return true;
      } catch (error: any) {
        console.error('Failed to update model:', error);
        toast.error(error?.message || (language === 'zh-CN' ? '更新模型失败' : 'Failed to update model'));
        return false;
      }
    },
    [formData, validateForm, language, onSuccess]
  );

  return {
    formData,
    setFormData,
    resetForm,
    validateForm,
    handleCreateModel,
    handleUpdateModel,
  };
};

