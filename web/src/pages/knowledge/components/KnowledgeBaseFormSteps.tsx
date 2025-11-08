/**
 * 知识库表单步骤组件
 */

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { ICON_OPTIONS, VECTOR_STORES, CONFIG_CONSTANTS } from '../constants';
import { getTagColor } from '@/utils';
import type { KnowledgeBaseFormData } from '../hooks/useKnowledgeBaseForm';

interface BasicInfoStepProps {
  formData: KnowledgeBaseFormData;
  tagInput: string;
  onFieldChange: <K extends keyof KnowledgeBaseFormData>(
    field: K,
    value: KnowledgeBaseFormData[K]
  ) => void;
  onTagInputChange: (value: string) => void;
  onTagInputKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onRemoveTag: (tag: string) => void;
}

/**
 * 基本信息步骤组件
 */
export function BasicInfoStep({
  formData,
  tagInput,
  onFieldChange,
  onTagInputChange,
  onTagInputKeyDown,
  onRemoveTag,
}: BasicInfoStepProps) {
  return (
    <div className='py-6'>
      {/* 名称和可见性在同一行 */}
      <div className='grid grid-cols-2 gap-6'>
        <div>
          <Label className='text-sm mb-2 block dark:text-gray-300'>知识库名称</Label>
          <Input
            value={formData.name}
            onChange={e => onFieldChange('name', e.target.value)}
            placeholder='请输入知识库名称'
            className='dark:bg-gray-900 dark:border-gray-700 dark:text-white'
          />
        </div>

        <div>
          <Label className='text-sm mb-2 block dark:text-gray-300'>可见性</Label>
          <Select value={formData.visibility} onValueChange={value => onFieldChange('visibility', value as any)}>
            <SelectTrigger className='dark:bg-gray-900 dark:border-gray-700 dark:text-white'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className='dark:bg-gray-800 dark:border-gray-700'>
              <SelectItem value='private' className='dark:text-white'>
                私有
              </SelectItem>
              <SelectItem value='team' className='dark:text-white'>
                团队可见
              </SelectItem>
              <SelectItem value='public' className='dark:text-white'>
                公开
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* 描述 */}
      <div className='mt-5'>
        <Label className='text-sm mb-2 block dark:text-gray-300'>描述</Label>
        <Textarea
          value={formData.description}
          onChange={e => onFieldChange('description', e.target.value)}
          placeholder='请输入知识库描述'
          rows={3}
          className='dark:bg-gray-900 dark:border-gray-700 dark:text-white resize-none'
        />
      </div>

      {/* 标签 */}
      <div className='mt-5'>
        <Label className='text-sm mb-2 block dark:text-gray-300'>
          标签 <span className='text-gray-400'>({formData.tags.length}/{CONFIG_CONSTANTS.TAG.MAX_COUNT})</span>
        </Label>
        <Input
          value={tagInput}
          onChange={e => onTagInputChange(e.target.value)}
          onKeyDown={onTagInputKeyDown}
          placeholder='输入标签后按回车，最多5个，每个不超过10字符'
          className='dark:bg-gray-900 dark:border-gray-700 dark:text-white'
          disabled={formData.tags.length >= CONFIG_CONSTANTS.TAG.MAX_COUNT}
          maxLength={CONFIG_CONSTANTS.TAG.MAX_LENGTH}
        />
        {formData.tags.length > 0 && (
          <div className='flex flex-wrap gap-2 mt-2'>
            {formData.tags.map(tag => (
              <Badge key={tag} className={`border-0 ${getTagColor(tag)}`}>
                {tag}
                <button
                  onClick={() => onRemoveTag(tag)}
                  className='ml-1 hover:opacity-70 transition-opacity'
                >
                  ×
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* 图标 - 超过两排时可滚动 */}
      <div className='mt-5'>
        <Label className='text-sm mb-2 block dark:text-gray-300'>图标</Label>
        <div className='max-h-[140px] overflow-y-auto pr-2 border border-gray-200 dark:border-gray-700 rounded-lg p-2'>
          <div className='grid grid-cols-8 gap-2'>
            {ICON_OPTIONS.map((option, index) => (
              <button
                key={index}
                onClick={() => onFieldChange('selectedIconIndex', index)}
                className={`${option.bg} w-12 h-12 rounded-lg flex items-center justify-center text-xl transition-all ${
                  formData.selectedIconIndex === index
                    ? 'ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-gray-900'
                    : 'hover:scale-105'
                }`}
                title={option.label}
              >
                {option.emoji}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

interface ConfigurationStepProps {
  formData: KnowledgeBaseFormData;
  onFieldChange: <K extends keyof KnowledgeBaseFormData>(
    field: K,
    value: KnowledgeBaseFormData[K]
  ) => void;
}

/**
 * 配置处理步骤组件
 */
export function ConfigurationStep({ formData, onFieldChange }: ConfigurationStepProps) {
  // 确保 chunkSize 和 chunkOverlap 始终是有效的数组
  const safeChunkSize = Array.isArray(formData.chunkSize) && formData.chunkSize.length > 0
    ? formData.chunkSize
    : [CONFIG_CONSTANTS.CHUNK_SIZE.DEFAULT];
  const safeChunkOverlap = Array.isArray(formData.chunkOverlap) && formData.chunkOverlap.length > 0
    ? formData.chunkOverlap
    : [CONFIG_CONSTANTS.CHUNK_OVERLAP.DEFAULT];
  const currentChunkSize = safeChunkSize[0];
  const currentChunkOverlap = safeChunkOverlap[0];

  return (
    <div className='py-6'>
      <div className='space-y-6'>
        {/* 向量存储源 */}
        <div>
          <Label className='text-sm mb-3 block dark:text-gray-300'>向量存储源</Label>
          <Select value={formData.vectorStoreId} onValueChange={value => onFieldChange('vectorStoreId', value)}>
            <SelectTrigger className='dark:bg-gray-900 dark:border-gray-700 dark:text-white'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className='dark:bg-gray-800 dark:border-gray-700'>
              {VECTOR_STORES.map(store => (
                <SelectItem key={store.id} value={store.id} className='dark:text-white'>
                  <div className='flex items-center gap-2'>
                    <span>{store.icon}</span>
                    <span>{store.name}</span>
                    <span className='text-xs text-gray-500 dark:text-gray-400'>({store.type})</span>
                    {store.status === 'connected' ? (
                      <Badge
                        variant='outline'
                        className='text-xs border-green-500 text-green-600 dark:text-green-400 ml-2'
                      >
                        已连接
                      </Badge>
                    ) : (
                      <Badge
                        variant='outline'
                        className='text-xs border-gray-400 text-gray-500 dark:text-gray-400 ml-2'
                      >
                        未连接
                      </Badge>
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className='text-xs text-gray-500 dark:text-gray-400 mt-2'>选择用于存储向量数据的存储源</p>
        </div>

        {/* 分段大小 */}
        <div>
          <div className='flex items-center justify-between mb-3'>
            <Label className='text-sm dark:text-gray-300'>分段大小</Label>
            <span className='text-sm dark:text-white'>{currentChunkSize}</span>
          </div>
          <Slider
            value={safeChunkSize}
            onValueChange={value => onFieldChange('chunkSize', value)}
            min={CONFIG_CONSTANTS.CHUNK_SIZE.MIN}
            max={CONFIG_CONSTANTS.CHUNK_SIZE.MAX}
            step={1}
            className='w-full'
          />
          <p className='text-xs text-gray-500 dark:text-gray-400 mt-2'>
            控制文本分块的大小，范围：{CONFIG_CONSTANTS.CHUNK_SIZE.MIN}-{CONFIG_CONSTANTS.CHUNK_SIZE.MAX} 字符
          </p>
        </div>

        {/* 分段重叠 */}
        <div>
          <div className='flex items-center justify-between mb-3'>
            <Label className='text-sm dark:text-gray-300'>分段重叠</Label>
            <span className='text-sm dark:text-white'>{currentChunkOverlap}</span>
          </div>
          <Slider
            value={safeChunkOverlap}
            onValueChange={value => onFieldChange('chunkOverlap', value)}
            min={CONFIG_CONSTANTS.CHUNK_OVERLAP.MIN}
            max={CONFIG_CONSTANTS.CHUNK_OVERLAP.MAX}
            step={1}
            className='w-full'
          />
          <p className='text-xs text-gray-500 dark:text-gray-400 mt-2'>
            控制相邻文本块的重叠字符数，范围：{CONFIG_CONSTANTS.CHUNK_OVERLAP.MIN}-{CONFIG_CONSTANTS.CHUNK_OVERLAP.MAX} 字符
          </p>
        </div>

        {/* 向量化模型 */}
        <div>
          <Label className='text-sm mb-3 block dark:text-gray-300'>向量化模型（可选）</Label>
          <Select
            value={formData.embeddingModelId?.toString() || 'default'}
            onValueChange={value => onFieldChange('embeddingModelId', value === 'default' ? undefined : Number(value))}
          >
            <SelectTrigger className='dark:bg-gray-900 dark:border-gray-700 dark:text-white'>
              <SelectValue placeholder='不指定时使用默认模型' />
            </SelectTrigger>
            <SelectContent className='dark:bg-gray-800 dark:border-gray-700'>
              <SelectItem value='default' className='dark:text-white'>
                使用默认模型
              </SelectItem>
              {/* 注意：这里需要根据实际的模型ID列表来填充，目前使用示例ID */}
              <SelectItem value='1' className='dark:text-white'>
                text-embedding-ada-002
              </SelectItem>
              <SelectItem value='2' className='dark:text-white'>
                text-embedding-3-small
              </SelectItem>
              <SelectItem value='3' className='dark:text-white'>
                text-embedding-3-large
              </SelectItem>
              <SelectItem value='4' className='dark:text-white'>
                m3e-base
              </SelectItem>
              <SelectItem value='5' className='dark:text-white'>
                m3e-large
              </SelectItem>
            </SelectContent>
          </Select>
          <p className='text-xs text-gray-500 dark:text-gray-400 mt-2'>
            选择用于文本向量化的模型，不指定时使用默认模型
          </p>
        </div>
      </div>
    </div>
  );
}

