/**
 * 导入接口规范对话框组件
 */

import { FileJson, Code2, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useLanguage } from '@/components/ui/LanguageProvider';
import { ApiCollectionImportTypeEnum } from '@/enums/enums';

interface ImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (type: ApiCollectionImportTypeEnum) => void;
}

export function ImportDialog({ open, onOpenChange, onImport }: ImportDialogProps) {
  const { t, language } = useLanguage();

  const handleImport = (type: ApiCollectionImportTypeEnum) => {
    onImport(type);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='dark:bg-gray-800'>
        <DialogHeader>
          <DialogTitle className='dark:text-white'>{language === 'zh-CN' ? '导入接口规范' : 'Import API Specification'}</DialogTitle>
          <DialogDescription>{language === 'zh-CN'
                ? '支持 OpenAPI、Swagger、Postman 等多种规范格式，最大支持20MB'
                : 'Supports multiple specification formats such as OpenAPI, Swagger, and Postman, with a maximum support of 20MB.'}</DialogDescription>
        </DialogHeader>

        <div className='space-y-4'>
          <div className='grid grid-cols-2 gap-3'>
            <button
              onClick={() => handleImport(ApiCollectionImportTypeEnum.OPENAPI)}
              className='p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-500 dark:hover:border-blue-500 transition-colors group'
            >
              <FileJson className='w-8 h-8 mx-auto mb-2 text-gray-400 group-hover:text-blue-500' />
              <div className='text-sm dark:text-white'>OpenAPI 3.0</div>
              <div className='text-xs text-gray-500 dark:text-gray-400 mt-1'>JSON / YAML</div>
            </button>

            <button
              onClick={() => handleImport(ApiCollectionImportTypeEnum.SWAGGER)}
              className='p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-500 dark:hover:border-blue-500 transition-colors group'
            >
              <Code2 className='w-8 h-8 mx-auto mb-2 text-gray-400 group-hover:text-blue-500' />
              <div className='text-sm dark:text-white'>Swagger 2.0</div>
              <div className='text-xs text-gray-500 dark:text-gray-400 mt-1'>JSON / YAML</div>
            </button>

            <button
              onClick={() => handleImport(ApiCollectionImportTypeEnum.POSTMAN)}
              className='p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-500 dark:hover:border-blue-500 transition-colors group'
            >
              <Globe className='w-8 h-8 mx-auto mb-2 text-gray-400 group-hover:text-blue-500' />
              <div className='text-sm dark:text-white'>Postman</div>
              <div className='text-xs text-gray-500 dark:text-gray-400 mt-1'>Collection JSON</div>
            </button>
          </div>
        </div>

        <DialogFooter>
          <Button variant='outline' onClick={() => onOpenChange(false)} className='dark:bg-gray-700 dark:border-gray-600'>
            {t('common.actions.cancel')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

