/**
 * 知识库表单验证工具函数
 */

import { CONFIG_CONSTANTS } from './constants';
import { toast } from 'sonner';
import { constantTranslation as t } from '@/lib/i18n';
import type { KnowledgeBaseFormData } from './hooks/useKnowledgeBaseForm';

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * 验证知识库名称
 */
export const validateKnowledgeBaseName = (name: string): ValidationResult => {
  const trimmedName = name.trim();
  if (!trimmedName) {
    return { isValid: false, error: t('knowledge.validation.nameRequired') };
  }
  return { isValid: true };
};

/**
 * 验证知识库描述
 */
export const validateDescription = (description: string): ValidationResult => {
  const trimmedDescription = description.trim();
  if (!trimmedDescription) {
    return { isValid: false, error: t('knowledge.validation.descriptionRequired') };
  }
  return { isValid: true };
};

/**
 * 验证分段大小
 */
export const validateChunkSize = (chunkSize: number): ValidationResult => {
  const { MIN, MAX } = CONFIG_CONSTANTS.CHUNK_SIZE;
  if (!chunkSize || chunkSize < MIN || chunkSize > MAX) {
    return {
      isValid: false,
      error: t('knowledge.validation.chunkSizeRange', { min: MIN, max: MAX }),
    };
  }
  return { isValid: true };
};

/**
 * 验证分段重叠
 */
export const validateChunkOverlap = (chunkOverlap: number): ValidationResult => {
  const { MIN, MAX } = CONFIG_CONSTANTS.CHUNK_OVERLAP;
  if (chunkOverlap === undefined || chunkOverlap < MIN || chunkOverlap > MAX) {
    return {
      isValid: false,
      error: t('knowledge.validation.chunkOverlapRange', { min: MIN, max: MAX }),
    };
  }
  return { isValid: true };
};

/**
 * 验证标签
 */
export const validateTag = (tag: string, existingTags: string[]): ValidationResult => {
  const trimmedTag = tag.trim();
  if (!trimmedTag) {
    return { isValid: false };
  }

  if (trimmedTag.length > CONFIG_CONSTANTS.TAG.MAX_LENGTH) {
    toast.error(t('knowledge.validation.tagMaxLength', { maxLength: CONFIG_CONSTANTS.TAG.MAX_LENGTH }));
    return { isValid: false };
  }

  if (existingTags.length >= CONFIG_CONSTANTS.TAG.MAX_COUNT) {
    toast.error(t('knowledge.validation.tagMaxCount', { maxCount: CONFIG_CONSTANTS.TAG.MAX_COUNT }));
    return { isValid: false };
  }

  if (existingTags.includes(trimmedTag)) {
    toast.error(t('knowledge.validation.tagDuplicate'));
    return { isValid: false };
  }

  return { isValid: true };
};

/**
 * 验证第一步表单（基本信息）
 */
export const validateBasicInfoStep = (name: string, description: string): ValidationResult => {
  const nameValidation = validateKnowledgeBaseName(name);
  if (!nameValidation.isValid) {
    toast.error(nameValidation.error);
    return nameValidation;
  }

  const descValidation = validateDescription(description);
  if (!descValidation.isValid) {
    toast.error(descValidation.error);
    return descValidation;
  }

  return { isValid: true };
};

/**
 * 验证第二步表单（配置处理）
 */
export const validateConfigurationStep = (chunkSize: number, chunkOverlap: number): ValidationResult => {
  const chunkSizeValidation = validateChunkSize(chunkSize);
  if (!chunkSizeValidation.isValid) {
    toast.error(chunkSizeValidation.error);
    return chunkSizeValidation;
  }

  const chunkOverlapValidation = validateChunkOverlap(chunkOverlap);
  if (!chunkOverlapValidation.isValid) {
    toast.error(chunkOverlapValidation.error);
    return chunkOverlapValidation;
  }

  return { isValid: true };
};

 /**
  * 验证（基本信息）
  */
 export const validateBasicInfo = (formData: KnowledgeBaseFormData) => {
  if (!formData.name.trim()) {
    toast.error(t('knowledge.validation.nameRequired'));
    return false;
  }
  if (!formData.description.trim()) {
    toast.error(t('knowledge.validation.descriptionRequired'));
    return false;
  }
  return true;
};


 /**
  * 验证（配置处理）
  */
 export const validateConfiguration = (formData: KnowledgeBaseFormData) => {
  const chunkSize = formData.chunkSize[0] ?? CONFIG_CONSTANTS.CHUNK_SIZE.DEFAULT;
  const chunkOverlap = formData.chunkOverlap[0] ?? CONFIG_CONSTANTS.CHUNK_OVERLAP.DEFAULT;
  const { MIN: chunkSizeMin, MAX: chunkSizeMax } = CONFIG_CONSTANTS.CHUNK_SIZE;
  if (!chunkSize || chunkSize < chunkSizeMin || chunkSize > chunkSizeMax) {
    toast.error(
      t('knowledge.validation.chunkSizeRange', {
        min: chunkSizeMin,
        max: chunkSizeMax,
      })
    );
    return false;
  }

  const { MIN: overlapMin, MAX: overlapMax } = CONFIG_CONSTANTS.CHUNK_OVERLAP;
  if (chunkOverlap === undefined || chunkOverlap < overlapMin || chunkOverlap > overlapMax) {
    toast.error(
      t('knowledge.validation.chunkOverlapRange', {
        min: overlapMin,
        max: overlapMax,
      })
    );
    return false;
  }

  return true;
};