/**
 * 向量存储表单字段组件
 */

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { VECTOR_STORE_TYPES } from '../constants';
import { useLanguage } from '@/components/LanguageProvider.tsx';
import type { VectorStoreFormData } from '../types';

interface VectorStoreFormFieldsProps {
  formData: VectorStoreFormData;
  onFormDataChange: (data: Partial<VectorStoreFormData>) => void;
  isEdit?: boolean;
}

export function VectorStoreFormFields({
  formData,
  onFormDataChange,
  isEdit = false,
}: VectorStoreFormFieldsProps) {
  const { t } = useLanguage();
  const updateField = (field: keyof VectorStoreFormData, value: string) => {
    onFormDataChange({ [field]: value });
  };

  return (
    <div className='space-y-4'>
      {!isEdit && (
        <div className='grid grid-cols-2 gap-4'>
          <div className='space-y-2'>
            <Label className='dark:text-gray-200'>{t('common.labels.name')}</Label>
            <Input
              placeholder={t('vector.formFields.storeNamePlaceholder')}
              value={formData.name}
              onChange={e => updateField('name', e.target.value)}
              className='dark:bg-gray-750 dark:border-gray-600'
            />
          </div>

          <div className='space-y-2'>
            <Label className='dark:text-gray-200'>{t('common.labels.type')}</Label>
            <Select
              value={formData.type}
              onValueChange={value => updateField('type', value)}
            >
              <SelectTrigger className='dark:bg-gray-750 dark:border-gray-600'>
                <SelectValue placeholder={t('vector.formFields.selectDatabaseType')} />
              </SelectTrigger>
              <SelectContent className='dark:bg-gray-800 dark:border-gray-700'>
                {VECTOR_STORE_TYPES.map(type => (
                  <SelectItem key={type.value} value={type.value} className='dark:text-gray-300'>
                    {type.icon} {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {isEdit && (
        <div className='space-y-2'>
          <Label className='dark:text-gray-200'>{t('common.labels.name')}</Label>
          <Input
            value={formData.name}
            onChange={e => updateField('name', e.target.value)}
            className='dark:bg-gray-750 dark:border-gray-600'
          />
        </div>
      )}

      <div className='space-y-2'>
        <Label className='dark:text-gray-200'>{t('common.labels.description')}</Label>
        <Textarea
          placeholder={t('vector.formFields.descriptionPlaceholder')}
          value={formData.description}
          onChange={e => updateField('description', e.target.value)}
          className='dark:bg-gray-750 dark:border-gray-600'
          rows={2}
        />
      </div>

      <div className='space-y-2'>
        <Label className='dark:text-gray-200'>{t('vector.formFields.endpoint')}</Label>
        <Input
          placeholder='https://...'
          value={formData.endpoint}
          onChange={e => updateField('endpoint', e.target.value)}
          className='dark:bg-gray-750 dark:border-gray-600'
        />
      </div>

      <div className='grid grid-cols-2 gap-4'>
        <div className='space-y-2'>
          <Label className='dark:text-gray-200'>{t('vector.formFields.apiKey')}</Label>
          <Input
            type='password'
            placeholder='sk-...'
            value={formData.apiKey}
            onChange={e => updateField('apiKey', e.target.value)}
            className='dark:bg-gray-750 dark:border-gray-600'
          />
        </div>

        <div className='space-y-2'>
          <Label className='dark:text-gray-200'>{t('vector.formFields.dimension')}</Label>
          <Input
            type='number'
            placeholder='1536'
            value={formData.dimension}
            onChange={e => updateField('dimension', e.target.value)}
            className='dark:bg-gray-750 dark:border-gray-600'
          />
        </div>
      </div>

      <div className='grid grid-cols-2 gap-4'>
        <div className='space-y-2'>
          <Label className='dark:text-gray-200'>{t('vector.formFields.database')}</Label>
          <Input
            placeholder={t('vector.formFields.databaseNamePlaceholder')}
            value={formData.database}
            onChange={e => updateField('database', e.target.value)}
            className='dark:bg-gray-750 dark:border-gray-600'
          />
        </div>

        <div className='space-y-2'>
          <Label className='dark:text-gray-200'>
            {t('vector.formFields.collection')}
          </Label>
          <Input
            placeholder={t('vector.formFields.collectionNamePlaceholder')}
            value={formData.collection}
            onChange={e => updateField('collection', e.target.value)}
            className='dark:bg-gray-750 dark:border-gray-600'
          />
        </div>
      </div>

      {!isEdit && (
        <div className='grid grid-cols-2 gap-4'>
          <div className='space-y-2'>
            <Label className='dark:text-gray-200'>{t('vector.formFields.username')}</Label>
            <Input
              placeholder={t('vector.formFields.usernamePlaceholder')}
              value={formData.username}
              onChange={e => updateField('username', e.target.value)}
              className='dark:bg-gray-750 dark:border-gray-600'
            />
          </div>

          <div className='space-y-2'>
            <Label className='dark:text-gray-200'>{t('common.labels.password')}</Label>
            <Input
              type='password'
              placeholder={t('vector.formFields.passwordPlaceholder')}
              value={formData.password}
              onChange={e => updateField('password', e.target.value)}
              className='dark:bg-gray-750 dark:border-gray-600'
            />
          </div>
        </div>
      )}
    </div>
  );
}

