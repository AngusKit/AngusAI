/**
 * 模型管理相关类型定义
 */

import { type ElementType } from 'react';
import { ModelTypeEnum, ModelProviderEnum, ModelStatusEnum } from '@/enums/enums';
import type { ModelDetailVo } from '@/services/ModelsTypes';

export interface ModelListItem {
  id: string;
  name: string;
  description: string;
  type: string;
  typeEnum?: ModelTypeEnum;
  icon: ElementType;
  iconBg: string;
  iconColor: string;
  provider: string;
  providerEnum?: ModelProviderEnum;
  status: string;
  statusEnum?: ModelStatusEnum;
  statusColor: string;
  performance: {
    latency: string;
    throughput: string;
    accuracy: string;
  };
  resources: {
    cpu: string;
    memory: string;
    gpu: string;
  };
  calls: string;
  cost: string;
  tokens?: string;
  maxTokens?: string;
  deployed: string;
  detail?: ModelDetailVo;
}

export interface ModelFormData {
  name: string;
  description: string;
  type: ModelTypeEnum;
  provider: string;
  apiKey: string;
  endpoint: string;
  maxTokens: string;
  temperature: string;
}

