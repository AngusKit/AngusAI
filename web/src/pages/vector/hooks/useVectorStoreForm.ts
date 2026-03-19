/**
 * 向量存储表单管理 Hook
 */

import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import VectorStoresService from '@/services/VectorStores';
import { VectorStoreTypeEnum } from '@/enums/enums';
import type { VectorStoreCreateDto, VectorStoreUpdateDto } from '@/services/VectorStoresTypes';
import { DEFAULT_FORM_DATA, CONNECTION_TEST_TIMEOUT } from '../constants';
import { parseDimension } from '../utils';
import { useLanguage } from '@/components/LanguageProvider.tsx';
import type { VectorStoreFormData, VectorStoreItem } from '../types';

interface UseVectorStoreFormReturn {
  formData: VectorStoreFormData;
  setFormData: React.Dispatch<React.SetStateAction<VectorStoreFormData>>;
  resetForm: () => void;
  validateForm: () => boolean;
  validateDimension: () => number | null;
  createConfigFromFormData: (type: VectorStoreTypeEnum, dimension: number) => VectorStoreCreateDto['config'];
  handleCreateStore: (onSuccess?: () => Promise<void>) => Promise<boolean>;
  handleUpdateStore: (storeId: string, storeType: VectorStoreTypeEnum, onSuccess?: () => Promise<void>) => Promise<boolean>;
  handleTestConnection: (store: VectorStoreItem, onStatusUpdate?: (status: string) => void) => Promise<boolean>;
  populateFormFromStore: (store: VectorStoreItem) => void;
}

export const useVectorStoreForm = (): UseVectorStoreFormReturn => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState<VectorStoreFormData>(DEFAULT_FORM_DATA);

  const resetForm = useCallback(() => {
    setFormData(DEFAULT_FORM_DATA);
  }, []);

  const validateForm = useCallback((): boolean => {
    if (!formData.name.trim()) {
      toast.error(t('vector.validation.nameRequired'));
      return false;
    }
    if (!formData.type) {
      toast.error(t('vector.validation.typeRequired'));
      return false;
    }
    return true;
  }, [formData, t]);

  const validateDimension = useCallback((): number | null => {
    const dimensionValue = parseDimension(formData.dimension);
    if (!dimensionValue) {
      toast.error(t('vector.validation.dimensionRequired'));
      return null;
    }
    return dimensionValue;
  }, [formData.dimension, t]);

  const createConfigFromFormData = useCallback(
    (type: VectorStoreTypeEnum, dimension: number): VectorStoreCreateDto['config'] => {
      const extra: Record<string, unknown> = {};
      if (formData.useTls) extra.useTls = true;
      if (formData.token?.trim()) extra.token = formData.token.trim();
      if (formData.databaseName?.trim()) extra.databaseName = formData.databaseName.trim();
      if (formData.scheme?.trim()) extra.scheme = formData.scheme.trim();

      const base: VectorStoreCreateDto['config'] = {
        type,
        dimension,
        endpoint: formData.endpoint?.trim() || undefined,
        url: formData.url?.trim() || undefined,
        apiKey: formData.apiKey?.trim() || undefined,
        database: formData.database?.trim() || undefined,
        collection: formData.collection?.trim() || undefined,
        username: formData.username?.trim() || undefined,
        password: formData.password?.trim() || undefined,
      };
      if (Object.keys(extra).length > 0) {
        base.extraProperties = extra;
      }
      return base;
    },
    [formData]
  );

  const handleCreateStore = useCallback(
    async (onSuccess?: () => Promise<void>): Promise<boolean> => {
      if (!validateForm()) {
        return false;
      }

      const dimensionValue = validateDimension();
      if (!dimensionValue) {
        return false;
      }

      if (!formData.type) {
        return false;
      }

      const payload: VectorStoreCreateDto = {
        name: formData.name.trim(),
        type: formData.type,
        description: formData.description.trim() || undefined,
        config: createConfigFromFormData(formData.type, dimensionValue),
      };

      try {
        await VectorStoresService.vectorStoreCreate(payload);
        toast.success(t('vector.messages.createSuccess'));
        resetForm();
        if (onSuccess) {
          await onSuccess();
        }
        return true;
      } catch (error: any) {
        console.error('Failed to create vector store:', error);
        toast.error(error?.message || t('vector.messages.createFailed'));
        return false;
      }
    },
    [formData, validateForm, validateDimension, createConfigFromFormData, resetForm, t]
  );

  const handleUpdateStore = useCallback(
    async (storeId: string, storeType: VectorStoreTypeEnum, onSuccess?: () => Promise<void>): Promise<boolean> => {
      if (!formData.name.trim()) {
        toast.error(t('vector.validation.nameRequired'));
        return false;
      }

      const dimensionValue = validateDimension();
      if (!dimensionValue) {
        return false;
      }

      const payload: VectorStoreUpdateDto = {
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        config: createConfigFromFormData(storeType, dimensionValue),
      };

      try {
        await VectorStoresService.vectorStoreUpdate(storeId, payload);
        toast.success(t('vector.messages.updateSuccess'));
        resetForm();
        if (onSuccess) {
          await onSuccess();
        }
        return true;
      } catch (error: any) {
        console.error('Failed to update vector store:', error);
        toast.error(error?.message || t('vector.messages.updateFailed'));
        return false;
      }
    },
    [formData, validateDimension, createConfigFromFormData, resetForm, t]
  );

  const handleTestConnection = useCallback(
    async (
      store: VectorStoreItem,
      onStatusUpdate?: (status: string) => void
    ): Promise<boolean> => {
      try {
        if (onStatusUpdate) {
          onStatusUpdate('TESTING');
        }

        const response = await VectorStoresService.vectorStoreTestConnection(
          { id: store.id },
          {
            config: store.config,
            timeout: CONNECTION_TEST_TIMEOUT,
          }
        );
        const result = (response as any)?.data;
        toast.success(
          result?.message || t('vector.messages.testConnectionSuccess', { name: store.name })
        );
        if (onStatusUpdate) {
          onStatusUpdate('CONNECTED');
        }
        return true;
      } catch (error: any) {
        console.error('Failed to test vector store connection:', error);
        toast.error(error?.message || t('vector.messages.testConnectionFailed'));
        if (onStatusUpdate) {
          onStatusUpdate('DISCONNECTED');
        }
        return false;
      }
    },
    [t]
  );

  const populateFormFromStore = useCallback((store: VectorStoreItem) => {
    const cfg = store.config;
    const extra = (cfg as any)?.extraProperties ?? {};
    const typeRaw = store.type ?? '';
    const typeNormalized = typeRaw ? (String(typeRaw).toUpperCase() as VectorStoreTypeEnum) : ('' as any);
    setFormData({
      ...DEFAULT_FORM_DATA,
      name: store.name ?? '',
      type: typeNormalized,
      description: store.description === '--' ? '' : (store.description ?? ''),
      endpoint: cfg?.endpoint ?? cfg?.url ?? '',
      url: cfg?.url ?? '',
      apiKey: cfg?.apiKey ?? '',
      dimension: cfg?.dimension ? String(cfg.dimension) : DEFAULT_FORM_DATA.dimension,
      database: cfg?.database ?? '',
      collection: cfg?.collection ?? '',
      username: cfg?.username ?? '',
      password: cfg?.password ?? '',
      useTls: !!extra.useTls,
      token: (extra.token as string) ?? '',
      databaseName: (extra.databaseName as string) ?? '',
      scheme: (extra.scheme as string) ?? 'http',
    });
  }, []);

  return {
    formData,
    setFormData,
    resetForm,
    validateForm,
    validateDimension,
    createConfigFromFormData,
    handleCreateStore,
    handleUpdateStore,
    handleTestConnection,
    populateFormFromStore,
  };
};

