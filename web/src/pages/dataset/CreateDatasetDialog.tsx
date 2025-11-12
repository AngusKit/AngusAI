import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import Datasets from '@/services/Datasets';
import { DatasetCreateDto } from '@/services/DatasetsTypes';
import { DatasetTypeEnum, VisibilityEnum } from '@/enums/enums';
import { getTagColor, ICON_OPTIONS } from '@/utils';
import { useLanguage } from '@/components/ui/LanguageProvider';

interface CreateDatasetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function CreateDatasetDialog({ open, onOpenChange, onSuccess }: CreateDatasetDialogProps) {
  const { t } = useLanguage();
  const [datasetName, setDatasetName] = useState('');
  const [description, setDescription] = useState('');
  const [dataType, setDataType] = useState<'table' | 'datasource'>('table');
  const [visibility, setVisibility] = useState('private');
  const [selectedIcon, setSelectedIcon] = useState(0);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const MAX_TAGS = 5;
  const MAX_TAG_LENGTH = 10;
  const tagCountText = t('dataset.form.tags.count', {
    current: tags.length,
    max: MAX_TAGS,
  });

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newTag = tagInput.trim();

      if (!newTag) return;

      if (newTag.length > MAX_TAG_LENGTH) {
        toast.error(t('dataset.form.tags.lengthExceeded', { maxLength: MAX_TAG_LENGTH }));
        return;
      }

      if (tags.length >= MAX_TAGS) {
        toast.error(t('dataset.form.tags.countExceeded', { maxCount: MAX_TAGS }));
        return;
      }

      if (tags.includes(newTag)) {
        toast.error(t('dataset.form.tags.duplicate'));
        return;
      }

      setTags([...tags, newTag]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;

    if (!datasetName.trim()) {
      toast.error(t('dataset.createDialog.nameRequired'));
      return;
    }
    if (!description.trim()) {
      toast.error(t('common.placeholders.description'));
      return;
    }

    setIsSubmitting(true);
    try {
      // 映射数据类型：页面上的'text'和'table'都对应FILE类型，'datasource'对应DATASOURCE类型
      const datasetType = dataType === 'datasource' ? DatasetTypeEnum.DATASOURCE : DatasetTypeEnum.FILE;

      // 映射可见性
      const visibilityMap: Record<string, VisibilityEnum> = {
        private: VisibilityEnum.PRIVATE,
        team: VisibilityEnum.TEAM,
        public: VisibilityEnum.PUBLIC,
      };

      const createDto: DatasetCreateDto = {
        name: datasetName.trim(),
        description: description.trim(),
        type: datasetType,
        visibility: visibilityMap[visibility] || VisibilityEnum.PRIVATE,
        icon: ICON_OPTIONS[selectedIcon]?.emoji,
        iconBg: ICON_OPTIONS[selectedIcon]?.bg,
        tags: tags.length > 0 ? tags : undefined,
      };

      await Datasets.createDataset(createDto);
      toast.success(t('dataset.createDialog.createSuccess'));
      onOpenChange(false);
      onSuccess?.();

      // 重置表单
      setDatasetName('');
      setDescription('');
      setVisibility('private');
      setSelectedIcon(0);
      setTags([]);
      setTagInput('');
      setDataType('table');
    } catch (error: any) {
      console.error('Failed to create dataset:', error);
      toast.error(error?.message || t('dataset.createDialog.createFailed'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='w-[760px] !max-w-[90vw] max-h-[85vh] overflow-hidden p-0 dark:bg-gray-900 dark:border-gray-700 flex flex-col'>
        {/* Header */}
        <DialogHeader className='px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0'>
          <DialogTitle className='text-xl dark:text-white'>{t('dataset.createDialog.title')}</DialogTitle>
          <DialogDescription className='text-sm text-gray-500 dark:text-gray-400 mt-1'>
            {t('dataset.createDialog.description')}
          </DialogDescription>
        </DialogHeader>

        {/* Main Content Area */}
        <div className='flex-1 overflow-y-auto px-8 py-6'>
          <div className='grid grid-cols-2 gap-6'>
            <div>
              <Label className='text-sm mb-2 block dark:text-gray-300'>{t('common.labels.name')}</Label>
              <Input
                value={datasetName}
                onChange={e => setDatasetName(e.target.value)}
                placeholder={t('dataset.form.namePlaceholder')}
                className='dark:bg-gray-800 dark:border-gray-700 dark:text-white'
              />
            </div>

            <div>
              <Label className='text-sm mb-2 block dark:text-gray-300'>{t('dataset.form.visibilityLabel')}</Label>
              <Select value={visibility} onValueChange={setVisibility}>
                <SelectTrigger className='dark:bg-gray-800 dark:border-gray-700 dark:text-white'>
                  <SelectValue placeholder={t('dataset.form.visibilityPlaceholder')} />
                </SelectTrigger>
                <SelectContent className='dark:bg-gray-800 dark:border-gray-700'>
                  <SelectItem value='private' className='dark:text-white'>
                    {t('dataset.visibility.private')}
                  </SelectItem>
                  <SelectItem value='team' className='dark:text-white'>
                    {t('dataset.visibility.team')}
                  </SelectItem>
                  <SelectItem value='public' className='dark:text-white'>
                    {t('dataset.visibility.public')}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className='mt-5'>
            <Label className='text-sm mb-2 block dark:text-gray-300'>{t('common.labels.description')}</Label>
            <Textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder={t('dataset.form.descriptionPlaceholder')}
              rows={3}
              className='dark:bg-gray-800 dark:border-gray-700 dark:text-white resize-none'
            />
          </div>

          {/* 标签 */}
          <div className='mt-5'>
            <Label className='text-sm mb-2 block dark:text-gray-300'>
              {t('common.labels.tags')} <span className='text-gray-400'>{tagCountText}</span>
            </Label>
            <Input
              value={tagInput}
              onChange={e => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              placeholder={t('dataset.form.tags.placeholder', {
                maxCount: MAX_TAGS,
                maxLength: MAX_TAG_LENGTH,
              })}
              className='dark:bg-gray-800 dark:border-gray-700 dark:text-white'
              disabled={tags.length >= MAX_TAGS}
              maxLength={MAX_TAG_LENGTH}
            />
            {tags.length > 0 && (
              <div className='flex flex-wrap gap-2 mt-2'>
                {tags.map(tag => (
                  <Badge key={tag} className={`border-0 ${getTagColor(tag)}`}>
                    {tag}
                    <button onClick={() => handleRemoveTag(tag)} className='ml-1 hover:opacity-70 transition-opacity'>
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* 图标 - 超过两排时可滚动 */}
          <div className='mt-5'>
            <Label className='text-sm mb-2 block dark:text-gray-300'>{t('common.labels.icon')}</Label>
            <div className='max-h-[140px] overflow-y-auto pr-2 border border-gray-200 dark:border-gray-700 rounded-lg p-2'>
              <div className='grid grid-cols-8 gap-2'>
                {ICON_OPTIONS.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedIcon(index)}
                    className={`${option.bg} w-12 h-12 rounded-lg flex items-center justify-center text-xl transition-all ${
                      selectedIcon === index
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

          <div className='mt-5'>
            <Label className='text-sm mb-3 block dark:text-gray-300'>
              {t('dataset.editDatasetDialog.dataTypeLabel')}
            </Label>
            <div className='grid grid-cols-2 gap-3'>
              <button
                onClick={() => setDataType('table')}
                className={`p-3 border-2 rounded-lg text-left transition-all ${
                  dataType === 'table'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <div className='flex items-start gap-3'>
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      dataType === 'table' ? 'border-blue-500' : 'border-gray-300 dark:border-gray-600'
                    }`}
                  >
                    {dataType === 'table' && <div className='w-2.5 h-2.5 rounded-full bg-blue-500' />}
                  </div>
                  <div>
                    <div className='dark:text-white mb-0.5'>{t('dataset.editDatasetDialog.dataType.tableTitle')}</div>
                    <div className='text-sm text-gray-500 dark:text-gray-400'>
                      {t('dataset.editDatasetDialog.dataType.tableDescription')}
                    </div>
                  </div>
                </div>
              </button>

              <button
                onClick={() => setDataType('datasource')}
                className={`p-3 border-2 rounded-lg text-left transition-all ${
                  dataType === 'datasource'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <div className='flex items-start gap-3'>
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      dataType === 'datasource' ? 'border-blue-500' : 'border-gray-300 dark:border-gray-600'
                    }`}
                  >
                    {dataType === 'datasource' && <div className='w-2.5 h-2.5 rounded-full bg-blue-500' />}
                  </div>
                  <div>
                    <div className='dark:text-white mb-0.5'>
                      {t('dataset.editDatasetDialog.dataType.datasourceTitle')}
                    </div>
                    <div className='text-sm text-gray-500 dark:text-gray-400'>
                      {t('dataset.editDatasetDialog.dataType.datasourceDescription')}
                    </div>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className='px-8 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-end flex-shrink-0'>
          <div className='flex items-center gap-3'>
            <Button
              variant='outline'
              onClick={() => {
                onOpenChange(false);
                setDatasetName('');
                setDescription('');
                setVisibility('private');
                setSelectedIcon(0);
                setTags([]);
                setTagInput('');
                setDataType('table');
              }}
              className='dark:bg-gray-800 dark:border-gray-700 dark:text-white'
            >
              {t('common.actions.cancel')}
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting} className='bg-blue-500 hover:bg-blue-600 text-white'>
              {isSubmitting ? t('common.messages.creating') : t('common.actions.create')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
