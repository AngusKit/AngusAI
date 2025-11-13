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
  serverConfig: ServerConfig;
  setServerConfig: React.Dispatch<React.SetStateAction<ServerConfig>>;
  securityConfig: SecurityConfig;
  setSecurityConfig: React.Dispatch<React.SetStateAction<SecurityConfig>>;
  resetForm: () => void;
  buildServerObject: () => any;
  buildSecurityScheme: () => any;
  handleCreateCollection: () => Promise<boolean>;
}

export const useAPICollectionForm = (
  onSuccess?: () => Promise<void>
): UseAPICollectionFormReturn => {
  const { language, t } = useLanguage();
  const [formData, setFormData] = useState<CollectionFormData>(DEFAULT_COLLECTION_FORM_DATA);
  const [serverConfig, setServerConfig] = useState<ServerConfig>(DEFAULT_SERVER_CONFIG);
  const [securityConfig, setSecurityConfig] = useState<SecurityConfig>(DEFAULT_SECURITY_CONFIG);

  const resetForm = useCallback(() => {
    setFormData(DEFAULT_COLLECTION_FORM_DATA);
    setServerConfig(DEFAULT_SERVER_CONFIG);
    setSecurityConfig(DEFAULT_SECURITY_CONFIG);
  }, []);

  const buildServerObject = useCallback(() => {
    if (!serverConfig.url) {
      return undefined;
    }
    return {
      url: serverConfig.url,
      description: serverConfig.description || undefined,
    };
  }, [serverConfig]);

  const buildSecurityScheme = useCallback(() => {
    switch (securityConfig.type) {
      case 'apiKey':
        if (!securityConfig.apiKeyName) {
          return undefined;
        }
        return {
          type: 'apiKey',
          in: securityConfig.apiKeyIn,
          name: securityConfig.apiKeyName,
        } as any;
      case 'httpBasic':
        return {
          type: 'http',
          scheme: 'basic',
        } as any;
      case 'bearer':
        return {
          type: 'http',
          scheme: 'bearer',
        } as any;
      case 'oauth2Password':
        if (!securityConfig.oauth2TokenUrl) {
          return undefined;
        }
        return {
          type: 'oauth2',
          flows: {
            password: {
              tokenUrl: securityConfig.oauth2TokenUrl,
              scopes: securityConfig.oauth2Scope ? { [securityConfig.oauth2Scope]: securityConfig.oauth2Scope } : {},
            },
          },
        } as any;
      case 'oauth2Client':
        if (!securityConfig.oauth2ClientTokenUrl) {
          return undefined;
        }
        return {
          type: 'oauth2',
          flows: {
            clientCredentials: {
              tokenUrl: securityConfig.oauth2ClientTokenUrl,
              scopes: securityConfig.oauth2ClientScope
                ? { [securityConfig.oauth2ClientScope]: securityConfig.oauth2ClientScope }
                : {},
            },
          },
        } as any;
      default:
        return undefined;
    }
  }, [securityConfig]);

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
        server: buildServerObject(),
        security: buildSecurityScheme(),
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
  }, [formData, buildServerObject, buildSecurityScheme, resetForm, onSuccess, t]);

  return {
    formData,
    setFormData,
    serverConfig,
    setServerConfig,
    securityConfig,
    setSecurityConfig,
    resetForm,
    buildServerObject,
    buildSecurityScheme,
    handleCreateCollection,
  };
};

