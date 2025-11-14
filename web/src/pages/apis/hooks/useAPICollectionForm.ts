/**
 * API Collection 表单管理 Hook
 */

import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { useLanguage } from '@/components/ui/LanguageProvider';
import ApiCollectionsService from '@/services/ApiCollections';
import { DEFAULT_COLLECTION_FORM_DATA, DEFAULT_SERVER_CONFIG, DEFAULT_SECURITY_CONFIG } from '../constants';
import type { CollectionFormData, ServerConfig, SecurityConfig } from '../types';

interface UseAPICollectionFormReturn {
  formData: CollectionFormData;
  setFormData: React.Dispatch<React.SetStateAction<CollectionFormData>>;
  resetForm: () => void;
  handleCreateCollection: () => Promise<boolean>;
}

export const useAPICollectionForm = (
  onSuccess?: () => Promise<void>
): UseAPICollectionFormReturn => {
  const { language, t } = useLanguage();
  const [formData, setFormData] = useState<CollectionFormData>(DEFAULT_COLLECTION_FORM_DATA);

  const resetForm = useCallback(() => {
    setFormData(DEFAULT_COLLECTION_FORM_DATA);
  }, []);

  const handleCreateCollection = useCallback(async (): Promise<boolean> => {
    if (!formData.name.trim()) {
      toast.error(t('apis.validation.nameRequired'));
      return false;
    }

    try {
      await ApiCollectionsService.apiCollectionCreate({
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        visibility: formData.visibility,
        source: formData.source,
      });

      toast.success(t('apis.messages.createSuccess'));
      resetForm();
      if (onSuccess) {
        await onSuccess();
      }
      return true;
    } catch (error: any) {
      console.error('Failed to create API collection:', error);
      toast.error(error?.message || t('apis.messages.createFailed'));
      return false;
    }
  }, [formData, resetForm, onSuccess, t]);

  return {
    formData,
    setFormData,
    resetForm,
    handleCreateCollection,
  };
};

