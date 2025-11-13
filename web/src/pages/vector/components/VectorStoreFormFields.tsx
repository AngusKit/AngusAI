/**
 * 向量存储表单字段组件
 */

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { VectorStoreTypeEnum } from '@/enums/enums';
import { VECTOR_STORE_TYPES } from '../constants';
import type { VectorStoreFormData } from '../types';

interface VectorStoreFormFieldsProps {
  formData: VectorStoreFormData;
  onFormDataChange: (data: Partial<VectorStoreFormData>) => void;
  language: string;
  isEdit?: boolean;
}

export function VectorStoreFormFields({
  formData,
  onFormDataChange,
  language,
  isEdit = false,
}: VectorStoreFormFieldsProps) {
  const updateField = (field: keyof VectorStoreFormData, value: string) => {
    onFormDataChange({ [field]: value });
  };

  return (
    <div className='space-y-4'>
      {!isEdit && (
        <div className='grid grid-cols-2 gap-4'>
          <div className='space-y-2'>
            <Label className='dark:text-gray-200'>{language === 'zh-CN' ? '名称' : 'Name'}</Label>
            <Input
              placeholder={language === 'zh-CN' ? '输入存储源名称' : 'Enter store name'}
              value={formData.name}
              onChange={e => updateField('name', e.target.value)}
              className='dark:bg-gray-750 dark:border-gray-600'
            />
          </div>

          <div className='space-y-2'>
            <Label className='dark:text-gray-200'>{language === 'zh-CN' ? '类型' : 'Type'}</Label>
            <Select
              value={formData.type}
              onValueChange={value => updateField('type', value)}
            >
              <SelectTrigger className='dark:bg-gray-750 dark:border-gray-600'>
                <SelectValue placeholder={language === 'zh-CN' ? '选择数据库类型' : 'Select database type'} />
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
          <Label className='dark:text-gray-200'>{language === 'zh-CN' ? '名称' : 'Name'}</Label>
          <Input
            value={formData.name}
            onChange={e => updateField('name', e.target.value)}
            className='dark:bg-gray-750 dark:border-gray-600'
          />
        </div>
      )}

      <div className='space-y-2'>
        <Label className='dark:text-gray-200'>{language === 'zh-CN' ? '描述' : 'Description'}</Label>
        <Textarea
          placeholder={language === 'zh-CN' ? '输入描述信息' : 'Enter description'}
          value={formData.description}
          onChange={e => updateField('description', e.target.value)}
          className='dark:bg-gray-750 dark:border-gray-600'
          rows={2}
        />
      </div>

      <div className='space-y-2'>
        <Label className='dark:text-gray-200'>{language === 'zh-CN' ? '端点地址' : 'Endpoint'}</Label>
        <Input
          placeholder='https://...'
          value={formData.endpoint}
          onChange={e => updateField('endpoint', e.target.value)}
          className='dark:bg-gray-750 dark:border-gray-600'
        />
      </div>

      <div className='grid grid-cols-2 gap-4'>
        <div className='space-y-2'>
          <Label className='dark:text-gray-200'>{language === 'zh-CN' ? 'API密钥' : 'API Key'}</Label>
          <Input
            type='password'
            placeholder='sk-...'
            value={formData.apiKey}
            onChange={e => updateField('apiKey', e.target.value)}
            className='dark:bg-gray-750 dark:border-gray-600'
          />
        </div>

        <div className='space-y-2'>
          <Label className='dark:text-gray-200'>{language === 'zh-CN' ? '向量维度' : 'Dimension'}</Label>
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
          <Label className='dark:text-gray-200'>{language === 'zh-CN' ? '数据库' : 'Database'}</Label>
          <Input
            placeholder={language === 'zh-CN' ? '数据库名称' : 'Database name'}
            value={formData.database}
            onChange={e => updateField('database', e.target.value)}
            className='dark:bg-gray-750 dark:border-gray-600'
          />
        </div>

        <div className='space-y-2'>
          <Label className='dark:text-gray-200'>
            {language === 'zh-CN' ? '集合/索引' : 'Collection/Index'}
          </Label>
          <Input
            placeholder={language === 'zh-CN' ? '集合名称' : 'Collection name'}
            value={formData.collection}
            onChange={e => updateField('collection', e.target.value)}
            className='dark:bg-gray-750 dark:border-gray-600'
          />
        </div>
      </div>

      {!isEdit && (
        <div className='grid grid-cols-2 gap-4'>
          <div className='space-y-2'>
            <Label className='dark:text-gray-200'>{language === 'zh-CN' ? '用户名' : 'Username'}</Label>
            <Input
              placeholder={language === 'zh-CN' ? '用户名(可选)' : 'Username (optional)'}
              value={formData.username}
              onChange={e => updateField('username', e.target.value)}
              className='dark:bg-gray-750 dark:border-gray-600'
            />
          </div>

          <div className='space-y-2'>
            <Label className='dark:text-gray-200'>{language === 'zh-CN' ? '密码' : 'Password'}</Label>
            <Input
              type='password'
              placeholder={language === 'zh-CN' ? '密码(可选)' : 'Password (optional)'}
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

