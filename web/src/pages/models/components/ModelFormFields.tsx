/**
 * 模型表单字段组件
 */

import { Info, Settings, Sliders } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ModelTypeEnum } from '@/enums/enums';
import { MODEL_TYPE_CONFIG } from '../constants';
import { enumToMessages } from '@/enums/utils';
import type { ModelFormData } from '../types';

interface ModelFormFieldsProps {
  formData: ModelFormData;
  onFormDataChange: (data: Partial<ModelFormData>) => void;
  language: string;
  providerOptions: Array<{ value: string; label: string }>;
  isEdit?: boolean;
}

export function ModelFormFields({
  formData,
  onFormDataChange,
  language,
  providerOptions,
  isEdit = false,
}: ModelFormFieldsProps) {
  const updateField = (field: keyof ModelFormData, value: string | ModelTypeEnum) => {
    onFormDataChange({ [field]: value });
  };

  const modelTypeOptions = enumToMessages(ModelTypeEnum).map(({ value, message }) => {
    const typeConfig = MODEL_TYPE_CONFIG[value as ModelTypeEnum] || MODEL_TYPE_CONFIG[ModelTypeEnum.CHAT];
    return {
      value,
      label: message,
      icon: typeConfig.icon,
    };
  });

  return (
    <div className='space-y-4 py-4'>
      {/* 基本信息 */}
      <div className='space-y-3'>
        <h3 className='text-sm dark:text-white flex items-center gap-2'>
          <Info className='w-4 h-4 text-blue-500' />
          {language === 'zh-CN' ? '基本信息' : 'Basic Information'}
        </h3>

        <div className='space-y-2'>
          <Label htmlFor={isEdit ? 'edit-model-name' : 'model-name'} className='dark:text-gray-300'>
            {language === 'zh-CN' ? '模型名称' : 'Model Name'} <span className='text-red-500'>*</span>
          </Label>
          <Input
            id={isEdit ? 'edit-model-name' : 'model-name'}
            placeholder={language === 'zh-CN' ? '例如: GPT-4 Turbo' : 'e.g., GPT-4 Turbo'}
            value={formData.name}
            onChange={e => updateField('name', e.target.value)}
            className='dark:bg-gray-700 dark:border-gray-600'
          />
        </div>

        <div className='space-y-2'>
          <Label htmlFor={isEdit ? 'edit-model-description' : 'model-description'} className='dark:text-gray-300'>
            {language === 'zh-CN' ? '描述' : 'Description'}
          </Label>
          <Textarea
            id={isEdit ? 'edit-model-description' : 'model-description'}
            placeholder={language === 'zh-CN' ? '简要描述这个模型的功能和用途...' : 'Brief description of the model...'}
            value={formData.description}
            onChange={e => updateField('description', e.target.value)}
            className='dark:bg-gray-700 dark:border-gray-600 min-h-[80px]'
          />
        </div>

        <div className='grid grid-cols-2 gap-3'>
          {!isEdit && (
            <div className='space-y-2'>
              <Label htmlFor='model-type' className='dark:text-gray-300'>
                {language === 'zh-CN' ? '模型类型' : 'Model Type'} <span className='text-red-500'>*</span>
              </Label>
              <Select
                value={formData.type}
                onValueChange={value => updateField('type', value as ModelTypeEnum)}
              >
                <SelectTrigger id='model-type' className='dark:bg-gray-700 dark:border-gray-600'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className='dark:bg-gray-800 dark:border-gray-700'>
                  {modelTypeOptions.map(option => {
                    const Icon = option.icon;
                    return (
                      <SelectItem key={option.value} value={option.value} className='dark:text-gray-300'>
                        <div className='flex items-center gap-2'>
                          <Icon className='w-4 h-4' />
                          {option.label}
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className='space-y-2'>
            <Label htmlFor={isEdit ? 'edit-model-provider' : 'model-provider'} className='dark:text-gray-300'>
              {language === 'zh-CN' ? '提供商' : 'Provider'} <span className='text-red-500'>*</span>
            </Label>
            <Select
              value={formData.provider}
              onValueChange={value => updateField('provider', value)}
            >
              <SelectTrigger id={isEdit ? 'edit-model-provider' : 'model-provider'} className='dark:bg-gray-700 dark:border-gray-600'>
                <SelectValue placeholder={language === 'zh-CN' ? '选择提供商' : 'Select provider'} />
              </SelectTrigger>
              <SelectContent className='dark:bg-gray-800 dark:border-gray-700 max-h-[300px]'>
                {providerOptions.map(option => (
                  <SelectItem key={option.value} value={option.value} className='dark:text-gray-300'>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className='space-y-2'>
          <Label htmlFor={isEdit ? 'edit-model-version' : 'model-version'} className='dark:text-gray-300'>
            {language === 'zh-CN' ? '版本' : 'Version'} <span className='text-red-500'>*</span>
          </Label>
          <Input
            id={isEdit ? 'edit-model-version' : 'model-version'}
            placeholder={language === 'zh-CN' ? '例如: gpt-4-turbo-2024-04' : 'e.g., gpt-4-turbo-2024-04'}
            value={formData.version}
            onChange={e => updateField('version', e.target.value)}
            className='dark:bg-gray-700 dark:border-gray-600'
          />
        </div>
      </div>

      {/* API配置 */}
      <div className='space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700'>
        <h3 className='text-sm dark:text-white flex items-center gap-2'>
          <Settings className='w-4 h-4 text-green-500' />
          {language === 'zh-CN' ? 'API配置' : 'API Configuration'}
        </h3>

        <div className='space-y-2'>
          <Label htmlFor={isEdit ? 'edit-model-endpoint' : 'model-endpoint'} className='dark:text-gray-300'>
            {language === 'zh-CN' ? 'API端点' : 'API Endpoint'}
          </Label>
          <Input
            id={isEdit ? 'edit-model-endpoint' : 'model-endpoint'}
            placeholder='https://api.example.com/v1'
            value={formData.endpoint}
            onChange={e => updateField('endpoint', e.target.value)}
            className='dark:bg-gray-700 dark:border-gray-600'
          />
        </div>

        <div className='space-y-2'>
          <Label htmlFor={isEdit ? 'edit-model-apikey' : 'model-apikey'} className='dark:text-gray-300'>
            {language === 'zh-CN' ? 'API密钥' : 'API Key'}
          </Label>
          <Input
            id={isEdit ? 'edit-model-apikey' : 'model-apikey'}
            type='password'
            placeholder={isEdit ? (language === 'zh-CN' ? '留空则不修改' : 'Leave blank to keep unchanged') : 'sk-...'}
            value={formData.apiKey}
            onChange={e => updateField('apiKey', e.target.value)}
            className='dark:bg-gray-700 dark:border-gray-600'
          />
        </div>
      </div>

      {/* 模型参数 */}
      <div className='space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700'>
        <h3 className='text-sm dark:text-white flex items-center gap-2'>
          <Sliders className='w-4 h-4 text-purple-500' />
          {language === 'zh-CN' ? '模型参数' : 'Model Parameters'}
        </h3>

        <div className='grid grid-cols-2 gap-3'>
          <div className='space-y-2'>
            <Label htmlFor={isEdit ? 'edit-model-maxTokens' : 'model-maxTokens'} className='dark:text-gray-300'>
              {language === 'zh-CN' ? '最大Tokens' : 'Max Tokens'}
            </Label>
            <Input
              id={isEdit ? 'edit-model-maxTokens' : 'model-maxTokens'}
              type='number'
              placeholder='4096'
              value={formData.maxTokens}
              onChange={e => updateField('maxTokens', e.target.value)}
              className='dark:bg-gray-700 dark:border-gray-600'
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor={isEdit ? 'edit-model-temperature' : 'model-temperature'} className='dark:text-gray-300'>
              Temperature
            </Label>
            <Input
              id={isEdit ? 'edit-model-temperature' : 'model-temperature'}
              type='number'
              step='0.1'
              min='0'
              max='2'
              placeholder='0.7'
              value={formData.temperature}
              onChange={e => updateField('temperature', e.target.value)}
              className='dark:bg-gray-700 dark:border-gray-600'
            />
          </div>
        </div>
      </div>
    </div>
  );
}

