/**
 * 知识库表单验证工具函数
 */

import { CONFIG_CONSTANTS } from './constants';
import { toast } from 'sonner';

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * 验证知识库名称 TODO 国际化
 */
export const validateKnowledgeBaseName = (name: string): ValidationResult => {
  const trimmedName = name.trim();
  if (!trimmedName) {
    return { isValid: false, error: '请输入知识库名称' };
  }
  return { isValid: true };
};

/**
 * 验证知识库描述 TODO 国际化
 */
export const validateDescription = (description: string): ValidationResult => {
  const trimmedDescription = description.trim();
  if (!trimmedDescription) {
    return { isValid: false, error: '请输入知识库描述' };
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
      error: `分段大小必须在${MIN}-${MAX}之间`,
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
      error: `分段重叠必须在${MIN}-${MAX}之间`,
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
    toast.error(`标签长度不能超过${CONFIG_CONSTANTS.TAG.MAX_LENGTH}个字符`);
    return { isValid: false };
  }

  if (existingTags.length >= CONFIG_CONSTANTS.TAG.MAX_COUNT) {
    toast.error(`最多只能添加${CONFIG_CONSTANTS.TAG.MAX_COUNT}个标签`);
    return { isValid: false };
  }

  if (existingTags.includes(trimmedTag)) {
    toast.error('标签已存在');
    return { isValid: false };
  }

  return { isValid: true };
};

/**
 * 验证第一步表单（基本信息）TODO 需要替换
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
 * 验证第二步表单（配置处理） TODO
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
