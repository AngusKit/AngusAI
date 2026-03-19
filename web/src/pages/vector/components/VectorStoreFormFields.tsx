/**
 * 向量存储表单字段组件 — 按存储源类型渲染对应配置项
 */

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { VECTOR_STORE_TYPES } from '../constants';
import { useLanguage } from '@/components/LanguageProvider';
import { VectorStoreTypeEnum } from '@/enums/enums';
import type { VectorStoreFormData } from '../types';

interface VectorStoreFormFieldsProps {
  formData: VectorStoreFormData;
  onFormDataChange: (data: Partial<VectorStoreFormData>) => void;
  isEdit?: boolean;
}

const updateField = (
  onFormDataChange: (data: Partial<VectorStoreFormData>) => void,
  field: keyof VectorStoreFormData,
  value: string | number | boolean
) => onFormDataChange({ [field]: value });

export function VectorStoreFormFields({
  formData,
  onFormDataChange,
  isEdit = false,
}: VectorStoreFormFieldsProps) {
  const { t } = useLanguage();
  const u = (k: keyof VectorStoreFormData, v: string | number | boolean) =>
    updateField(onFormDataChange, k, v);
  const type = formData.type as VectorStoreTypeEnum;

  const needsDbAuth =
    type === VectorStoreTypeEnum.PGVECTOR || type === VectorStoreTypeEnum.MARIADB;
  const needsCollection =
    type === VectorStoreTypeEnum.MILVUS ||
    type === VectorStoreTypeEnum.QDRANT ||
    type === VectorStoreTypeEnum.CHROMA ||
    type === VectorStoreTypeEnum.ELASTICSEARCH ||
    type === VectorStoreTypeEnum.WEAVIATE;

  return (
    <div className='space-y-4'>
      {/* 名称 + 类型（创建时） */}
      {!isEdit && (
        <div className='grid grid-cols-2 gap-4'>
          <div className='space-y-2'>
            <Label className='dark:text-gray-200'>{t('common.labels.name')}</Label>
            <Input
              placeholder={t('vector.formFields.storeNamePlaceholder')}
              value={formData.name}
              onChange={e => u('name', e.target.value)}
              className='dark:bg-gray-750 dark:border-gray-600'
            />
          </div>
          <div className='space-y-2'>
            <Label className='dark:text-gray-200'>{t('common.labels.type')}</Label>
            <Select value={formData.type} onValueChange={v => u('type', v)}>
              <SelectTrigger className='dark:bg-gray-750 dark:border-gray-600'>
                <SelectValue placeholder={t('vector.formFields.selectDatabaseType')} />
              </SelectTrigger>
              <SelectContent className='dark:bg-gray-800 dark:border-gray-700'>
                {VECTOR_STORE_TYPES.map(tp => (
                  <SelectItem key={tp.value} value={tp.value} className='dark:text-gray-300'>
                    {tp.icon} {tp.label}
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
            onChange={e => u('name', e.target.value)}
            className='dark:bg-gray-750 dark:border-gray-600'
          />
        </div>
      )}

      <div className='space-y-2'>
        <Label className='dark:text-gray-200'>{t('common.labels.description')}</Label>
        <Textarea
          placeholder={t('vector.formFields.descriptionPlaceholder')}
          value={formData.description}
          onChange={e => u('description', e.target.value)}
          className='dark:bg-gray-750 dark:border-gray-600'
          rows={2}
        />
      </div>

      {/* 连接地址：所有类型通用 */}
      <div className='space-y-2'>
        <Label className='dark:text-gray-200'>
          {t('vector.formFields.endpoint')}
          {needsDbAuth ? ' / JDBC URL' : ''}
        </Label>
        <Input
          placeholder={
            needsDbAuth
              ? 'localhost:5432 或 jdbc:postgresql://localhost:5432/postgres'
              : 'http://localhost:8000'
          }
          value={(formData.url ?? formData.endpoint) || ''}
          onChange={e => {
            const v = e.target.value;
            if (needsDbAuth && v.startsWith('jdbc:')) {
              u('url', v);
              u('endpoint', '');
            } else {
              u('endpoint', v);
              u('url', '');
            }
          }}
          className='dark:bg-gray-750 dark:border-gray-600'
        />
      </div>

      {/* PGVECTOR / MARIADB: database, username, password */}
      {needsDbAuth && (
        <div className='grid grid-cols-2 gap-4'>
          <div className='space-y-2'>
            <Label className='dark:text-gray-200'>{t('vector.formFields.database')} *</Label>
            <Input
              placeholder={t('vector.formFields.databaseNamePlaceholder')}
              value={formData.database}
              onChange={e => u('database', e.target.value)}
              className='dark:bg-gray-750 dark:border-gray-600'
            />
          </div>
          <div className='space-y-2'>
            <Label className='dark:text-gray-200'>{t('vector.formFields.collection')}</Label>
            <Input
              placeholder={t('vector.formFields.collectionNamePlaceholder')}
              value={formData.collection}
              onChange={e => u('collection', e.target.value)}
              className='dark:bg-gray-750 dark:border-gray-600'
            />
          </div>
        </div>
      )}

      {needsDbAuth && (
        <div className='grid grid-cols-2 gap-4'>
          <div className='space-y-2'>
            <Label className='dark:text-gray-200'>{t('vector.formFields.username')} *</Label>
            <Input
              placeholder={t('vector.formFields.usernamePlaceholder')}
              value={formData.username}
              onChange={e => u('username', e.target.value)}
              className='dark:bg-gray-750 dark:border-gray-600'
            />
          </div>
          <div className='space-y-2'>
            <Label className='dark:text-gray-200'>{t('common.labels.password')} *</Label>
            <Input
              type='password'
              placeholder={t('vector.formFields.passwordPlaceholder')}
              value={formData.password}
              onChange={e => u('password', e.target.value)}
              className='dark:bg-gray-750 dark:border-gray-600'
            />
          </div>
        </div>
      )}

      {/* 非 DB 类型：collection、dimension、apiKey 等 */}
      {type && !needsDbAuth && (
        <div className='grid grid-cols-2 gap-4'>
          {needsCollection && (
            <div className='space-y-2'>
              <Label className='dark:text-gray-200'>
                {t('vector.formFields.collection')}
                {type === VectorStoreTypeEnum.MILVUS ? ' *' : ''}
              </Label>
              <Input
                placeholder={t('vector.formFields.collectionNamePlaceholder')}
                value={formData.collection}
                onChange={e => u('collection', e.target.value)}
                className='dark:bg-gray-750 dark:border-gray-600'
              />
            </div>
          )}
          <div className='space-y-2'>
            <Label className='dark:text-gray-200'>{t('vector.formFields.dimension')} *</Label>
            <Input
              type='number'
              placeholder='1536'
              value={formData.dimension}
              onChange={e => u('dimension', e.target.value)}
              className='dark:bg-gray-750 dark:border-gray-600'
            />
          </div>
        </div>
      )}

      {/* 需要 dimension 的 DB 类型 */}
      {needsDbAuth && (
        <div className='space-y-2'>
          <Label className='dark:text-gray-200'>{t('vector.formFields.dimension')} *</Label>
          <Input
            type='number'
            placeholder='1536'
            value={formData.dimension}
            onChange={e => u('dimension', e.target.value)}
            className='dark:bg-gray-750 dark:border-gray-600'
          />
        </div>
      )}

      {/* ELASTICSEARCH / WEAVIATE: apiKey 或 username+password */}
      {(type === VectorStoreTypeEnum.ELASTICSEARCH || type === VectorStoreTypeEnum.WEAVIATE) && (
        <div className='grid grid-cols-2 gap-4'>
          <div className='space-y-2'>
            <Label className='dark:text-gray-200'>{t('vector.formFields.apiKey')}</Label>
            <Input
              type='password'
              placeholder='API Key (optional)'
              value={formData.apiKey}
              onChange={e => u('apiKey', e.target.value)}
              className='dark:bg-gray-750 dark:border-gray-600'
            />
          </div>
          {type === VectorStoreTypeEnum.WEAVIATE && (
            <div className='space-y-2'>
              <Label className='dark:text-gray-200'>Scheme</Label>
              <Select
                value={formData.scheme ?? 'http'}
                onValueChange={v => u('scheme', v)}
              >
                <SelectTrigger className='dark:bg-gray-750 dark:border-gray-600'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className='dark:bg-gray-800 dark:border-gray-700'>
                  <SelectItem value='http'>http</SelectItem>
                  <SelectItem value='https'>https</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      )}

      {/* ELASTICSEARCH: Basic Auth 备选 */}
      {type === VectorStoreTypeEnum.ELASTICSEARCH && (
        <div className='grid grid-cols-2 gap-4'>
          <div className='space-y-2'>
            <Label className='dark:text-gray-200'>{t('vector.formFields.username')}</Label>
            <Input
              placeholder={t('vector.formFields.usernamePlaceholder')}
              value={formData.username}
              onChange={e => u('username', e.target.value)}
              className='dark:bg-gray-750 dark:border-gray-600'
            />
          </div>
          <div className='space-y-2'>
            <Label className='dark:text-gray-200'>{t('common.labels.password')}</Label>
            <Input
              type='password'
              placeholder={t('vector.formFields.passwordPlaceholder')}
              value={formData.password}
              onChange={e => u('password', e.target.value)}
              className='dark:bg-gray-750 dark:border-gray-600'
            />
          </div>
        </div>
      )}

      {/* MILVUS: token, databaseName */}
      {type === VectorStoreTypeEnum.MILVUS && (
        <div className='grid grid-cols-2 gap-4'>
          <div className='space-y-2'>
            <Label className='dark:text-gray-200'>Token</Label>
            <Input
              type='password'
              placeholder='Auth token (optional)'
              value={formData.token ?? ''}
              onChange={e => u('token', e.target.value)}
              className='dark:bg-gray-750 dark:border-gray-600'
            />
          </div>
          <div className='space-y-2'>
            <Label className='dark:text-gray-200'>Database Name</Label>
            <Input
              placeholder='Database (optional)'
              value={formData.databaseName ?? ''}
              onChange={e => u('databaseName', e.target.value)}
              className='dark:bg-gray-750 dark:border-gray-600'
            />
          </div>
        </div>
      )}

      {/* QDRANT: apiKey, useTls */}
      {type === VectorStoreTypeEnum.QDRANT && (
        <div className='grid grid-cols-2 gap-4'>
          <div className='space-y-2'>
            <Label className='dark:text-gray-200'>{t('vector.formFields.apiKey')}</Label>
            <Input
              type='password'
              placeholder='API Key (optional)'
              value={formData.apiKey}
              onChange={e => u('apiKey', e.target.value)}
              className='dark:bg-gray-750 dark:border-gray-600'
            />
          </div>
          <div className='flex items-center gap-2 pt-8'>
            <Switch
              checked={formData.useTls ?? false}
              onCheckedChange={v => u('useTls', v)}
            />
            <Label className='dark:text-gray-200'>Use TLS</Label>
          </div>
        </div>
      )}

    </div>
  );
}
