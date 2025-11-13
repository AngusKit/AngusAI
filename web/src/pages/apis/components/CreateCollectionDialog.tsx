/**
 * 创建接口集对话框组件
 */

import { Shield, Eye, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/components/ui/LanguageProvider';
import { ApiCollectionSourceEnum, VisibilityEnum } from '@/enums/enums';
import type { CollectionFormData } from '../types';
import { getEnumDescription } from '@/enums/utils';

interface CreateCollectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: CollectionFormData;
  onFormDataChange: (data: Partial<CollectionFormData>) => void;
  onSubmit: () => Promise<boolean>;
  onReset: () => void;
}

export function CreateCollectionDialog({
  open,
  onOpenChange,
  formData,
  onFormDataChange,
  onSubmit,
  onReset,
}: CreateCollectionDialogProps) {
  const { t, language } = useLanguage();

  const handleCancel = () => {
    onOpenChange(false);
    onReset();
  };

  const handleSubmit = async () => {
    const success = await onSubmit();
    if (success) {
      onOpenChange(false);
    }
  };

  const updateField = (field: keyof CollectionFormData, value: string | ApiCollectionSourceEnum | VisibilityEnum) => {
    onFormDataChange({ [field]: value });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='dark:bg-gray-800'>
        <DialogHeader>
          <DialogTitle className='dark:text-white'>{language === 'zh-CN' ? '新建接口集' : 'New API Collection'}</DialogTitle>
          <DialogDescription>{language === 'zh-CN'
                ? '创建一个新的接口集来管理相关的API'
                : 'Create a new collection to manage related APIs'}</DialogDescription>
        </DialogHeader>

        <div className='space-y-4'>
          <div>
            <Label htmlFor='name'>{language === 'zh-CN' ? '接口集名称' : 'Collection Name'}</Label>
            <Input
              id='name'
              value={formData.name}
              onChange={e => updateField('name', e.target.value)}
              placeholder={language === 'zh-CN' ? '输入接口集名称...' : 'Enter collection name...'}
              className='dark:bg-gray-750 dark:border-gray-600'
            />
          </div>

          <div>
            <Label htmlFor='description'>{t('common.labels.description')}</Label>
            <Textarea
              id='description'
              value={formData.description}
              onChange={e => updateField('description', e.target.value)}
              placeholder={language === 'zh-CN' ? '输入接口集描述...' : 'Enter collection description...'}
              className='dark:bg-gray-750 dark:border-gray-600 min-h-[100px]'
            />
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div>
              <Label>{language === 'zh-CN' ? '规范类型' : 'Specification Type'}</Label>
              <Select
                value={formData.source}
                onValueChange={(value: string) => updateField('source', value as ApiCollectionSourceEnum)}>
                <SelectTrigger className='dark:bg-gray-750 dark:border-gray-600'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className='dark:bg-gray-800 dark:border-gray-700'>
                  <SelectItem value={ApiCollectionSourceEnum.OPENAPI}>OpenAPI 3.0</SelectItem>
                  <SelectItem value={ApiCollectionSourceEnum.SWAGGER}>Swagger 2.0</SelectItem>
                  <SelectItem value={ApiCollectionSourceEnum.POSTMAN}>Postman Collection</SelectItem>
                  <SelectItem value='manual'>{language === 'zh-CN' ? '手动创建' : 'Manual'}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>{language === 'zh-CN' ? '可见性' : 'Visibility'}</Label>
              <Select
                value={formData.visibility}
                onValueChange={(value: string) => updateField('visibility', value as VisibilityEnum)}>
                <SelectTrigger className='dark:bg-gray-750 dark:border-gray-600'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className='dark:bg-gray-800 dark:border-gray-700'>
                  <SelectItem value={VisibilityEnum.PRIVATE}>
                    <div className='flex items-center gap-2'>
                      <Shield className='w-4 h-4' />
                      {getEnumDescription(VisibilityEnum, VisibilityEnum.PRIVATE)}
                    </div>
                  </SelectItem>
                  <SelectItem value={VisibilityEnum.TEAM}>
                    <div className='flex items-center gap-2'>
                      <Eye className='w-4 h-4' />
                      {getEnumDescription(VisibilityEnum, VisibilityEnum.TEAM)}
                    </div>
                  </SelectItem>
                  <SelectItem value={VisibilityEnum.PUBLIC}>
                    <div className='flex items-center gap-2'>
                      <Globe className='w-4 h-4' />
                      {getEnumDescription(VisibilityEnum, VisibilityEnum.PUBLIC)}
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant='outline' onClick={handleCancel} className='dark:bg-gray-700 dark:border-gray-600'>
            {t('common.actions.cancel')}
          </Button>
          <Button onClick={handleSubmit} className='dark:bg-blue-600 dark:hover:bg-blue-700'>
            {t('common.actions.create')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

