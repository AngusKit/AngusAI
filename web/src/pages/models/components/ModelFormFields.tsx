/**
 * 模型表单字段组件
 */

import { DollarSign, Info, Settings, Sliders } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ModelTypeEnum } from '@/enums/enums';
import { MODEL_TYPE_CONFIG, MODEL_NAME_MAX_LENGTH, MODEL_DESCRIPTION_MAX_LENGTH } from '../constants';
import { enumToMessages } from '@/enums/utils';
import { useLanguage } from '@/components/LanguageProvider.tsx';
import type { ModelFormData } from '../types';

interface ModelFormFieldsProps {
  formData: ModelFormData;
  onFormDataChange: (data: Partial<ModelFormData>) => void;
  providerOptions: Array<{ value: string; label: string }>;
  isEdit?: boolean;
}

export function ModelFormFields({
  formData,
  onFormDataChange,
  providerOptions,
  isEdit = false,
}: ModelFormFieldsProps) {
  const { t } = useLanguage();
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
          {t('models.formFields.basicInfo')}
        </h3>

        <div className='space-y-2'>
          <Label htmlFor={isEdit ? 'edit-model-name' : 'model-name'} className='dark:text-gray-300'>
            {t('models.formFields.modelName')} <span className='text-red-500'>*</span>
          </Label>
          <Input
            id={isEdit ? 'edit-model-name' : 'model-name'}
            placeholder={t('models.formFields.namePlaceholder')}
            value={formData.name}
            onChange={e => updateField('name', e.target.value)}
            maxLength={MODEL_NAME_MAX_LENGTH}
            className='dark:bg-gray-700 dark:border-gray-600'
          />
          <div className='text-xs text-gray-500 dark:text-gray-400 text-right'>
            {formData.name.length}/{MODEL_NAME_MAX_LENGTH}
          </div>
        </div>

        <div className='space-y-2'>
          <Label htmlFor={isEdit ? 'edit-model-description' : 'model-description'} className='dark:text-gray-300'>
            {t('common.labels.description')}
          </Label>
          <Textarea
            id={isEdit ? 'edit-model-description' : 'model-description'}
            placeholder={t('models.formFields.descriptionPlaceholder')}
            value={formData.description}
            onChange={e => updateField('description', e.target.value)}
            maxLength={MODEL_DESCRIPTION_MAX_LENGTH}
            className='dark:bg-gray-700 dark:border-gray-600 min-h-[80px]'
          />
          <div className='text-xs text-gray-500 dark:text-gray-400 text-right'>
            {formData.description.length}/{MODEL_DESCRIPTION_MAX_LENGTH}
          </div>
        </div>

        <div className='grid grid-cols-2 gap-3'>
          <div className='space-y-2'>
            <Label htmlFor={isEdit ? 'edit-model-type' : 'model-type'} className='dark:text-gray-300'>
              {t('models.formFields.modelType')} <span className='text-red-500'>*</span>
            </Label>
            <Select
              value={formData.type}
              onValueChange={value => updateField('type', value as ModelTypeEnum)}
            >
              <SelectTrigger id={isEdit ? 'edit-model-type' : 'model-type'} className='dark:bg-gray-700 dark:border-gray-600'>
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

          <div className='space-y-2'>
            <Label htmlFor={isEdit ? 'edit-model-provider' : 'model-provider'} className='dark:text-gray-300'>
              {t('models.provider')} <span className='text-red-500'>*</span>
            </Label>
            <Select
              value={formData.provider}
              onValueChange={value => updateField('provider', value)}
            >
              <SelectTrigger id={isEdit ? 'edit-model-provider' : 'model-provider'} className='dark:bg-gray-700 dark:border-gray-600'>
                <SelectValue placeholder={t('models.formFields.selectProvider')} />
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
      </div>

      {/* API配置 */}
      <div className='space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700'>
        <h3 className='text-sm dark:text-white flex items-center gap-2'>
          <Settings className='w-4 h-4 text-green-500' />
          {t('models.formFields.apiConfiguration')}
        </h3>

        <div className='space-y-2'>
          <Label htmlFor={isEdit ? 'edit-model-endpoint' : 'model-endpoint'} className='dark:text-gray-300'>
            {t('models.formFields.baseUrl')}
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
            {t('models.formFields.apiKey')}
          </Label>
          <Input
            id={isEdit ? 'edit-model-apikey' : 'model-apikey'}
            type='password'
            placeholder={isEdit ? t('models.formFields.leaveBlankToKeepUnchanged') : 'sk-...'}
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
          {t('models.formFields.modelParameters')}
        </h3>

        <div className='grid grid-cols-2 gap-3'>
          <div className='space-y-2'>
            <Label htmlFor={isEdit ? 'edit-model-maxTokens' : 'model-maxTokens'} className='dark:text-gray-300'>
              {t('models.formFields.maxTokens')}
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
              {t('models.formFields.temperature')}
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

      {/* 成本定价 */}
      <div className='space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700'>
        <h3 className='text-sm dark:text-white flex items-center gap-2'>
          <DollarSign className='w-4 h-4 text-amber-500' />
          {t('models.formFields.pricing')}
        </h3>

        <div className='grid grid-cols-2 gap-3'>
          <div className='space-y-2'>
            <Label htmlFor={isEdit ? 'edit-model-inputPrice' : 'model-inputPrice'} className='dark:text-gray-300'>
              {t('models.formFields.inputPricePerMillionTokens')}
            </Label>
            <Input
              id={isEdit ? 'edit-model-inputPrice' : 'model-inputPrice'}
              type='number'
              step='0.01'
              min='0'
              placeholder='2.5'
              value={formData.inputPricePerMillionTokens}
              onChange={e => updateField('inputPricePerMillionTokens', e.target.value)}
              className='dark:bg-gray-700 dark:border-gray-600'
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor={isEdit ? 'edit-model-outputPrice' : 'model-outputPrice'} className='dark:text-gray-300'>
              {t('models.formFields.outputPricePerMillionTokens')}
            </Label>
            <Input
              id={isEdit ? 'edit-model-outputPrice' : 'model-outputPrice'}
              type='number'
              step='0.01'
              min='0'
              placeholder='10'
              value={formData.outputPricePerMillionTokens}
              onChange={e => updateField('outputPricePerMillionTokens', e.target.value)}
              className='dark:bg-gray-700 dark:border-gray-600'
            />
          </div>
        </div>
      </div>
    </div>
  );
}

