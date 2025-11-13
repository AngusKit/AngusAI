/**
 * 导入设置对话框组件
 */

import { Upload } from 'lucide-react';
import { ChangeEvent, useRef } from 'react';
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useLanguage } from '@/components/ui/LanguageProvider';
import { FILE_UPLOAD_CONFIG } from '../constants';
import type { ConflictStrategy } from '../types';

interface ImportSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  conflictStrategy: ConflictStrategy;
  onConflictStrategyChange: (strategy: ConflictStrategy) => void;
  onFileSelect: (file: File) => void;
  onImport: (file: File) => Promise<void>;
  selectedFileName?: string;
  fileInputRef?: React.RefObject<HTMLInputElement>;
}

export function ImportSettingsDialog({
  open,
  onOpenChange,
  conflictStrategy,
  onConflictStrategyChange,
  onFileSelect,
  onImport,
  selectedFileName,
  fileInputRef: externalFileInputRef,
}: ImportSettingsDialogProps) {
  const { t, language } = useLanguage();
  const internalFileInputRef = useRef<HTMLInputElement | null>(null);
  const fileInputRef = externalFileInputRef || internalFileInputRef;

  const handleFileInputChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    if (file.size > FILE_UPLOAD_CONFIG.MAX_SIZE_MB * 1024 * 1024) {
      // File size validation would be handled here
      return;
    }

    onFileSelect(file);
  };

  const handleFileSelectClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  const handleImportClick = async () => {
    const file = fileInputRef.current?.files?.[0];
    if (file) {
      await onImport(file);
    }
  };

  return (
    <>
      {!externalFileInputRef && (
        <input
          ref={internalFileInputRef}
          type='file'
          accept={FILE_UPLOAD_CONFIG.ACCEPTED_TYPES}
          className='hidden'
          onChange={handleFileInputChange}
        />
      )}
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className='dark:bg-gray-800'>
          <DialogHeader>
            <DialogTitle className='dark:text-white'>{language === 'zh-CN' ? '选择导入策略和文件' : 'Select import strategy and file'}</DialogTitle>
            <DialogDescription>{language === 'zh-CN' ? '选择导入策略和文件' : 'Select import strategy and file'}</DialogDescription>
          </DialogHeader>

          <div className='space-y-4'>
            <div>
              <Label>{language === 'zh-CN' ? '重复处理策略' : 'Duplicate Handling Strategy'}</Label>
              <RadioGroup
                value={conflictStrategy}
                onValueChange={(value: string) => onConflictStrategyChange(value as ConflictStrategy)}
                className='mt-3 space-y-3'
              >
                <div className='flex items-start space-x-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors'>
                  <RadioGroupItem value='overwrite' id='overwrite' className='mt-0.5' />
                  <div className='flex-1'>
                    <Label htmlFor='overwrite' className='cursor-pointer'>
                      {language === 'zh-CN' ? '覆盖重复' : 'Overwrite Duplicates'}
                    </Label>
                    <p className='text-sm text-gray-500 dark:text-gray-400 mt-1'>
                      {language === 'zh-CN'
                        ? '如果导入的接口已存在，将使用新数据覆盖原有数据'
                        : 'If an imported API already exists, it will be replaced with new data'}
                    </p>
                  </div>
                </div>

                <div className='flex items-start space-x-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors'>
                  <RadioGroupItem value='ignore' id='ignore' className='mt-0.5' />
                  <div className='flex-1'>
                    <Label htmlFor='ignore' className='cursor-pointer'>
                      {language === 'zh-CN' ? '忽略重复' : 'Ignore Duplicates'}
                    </Label>
                    <p className='text-sm text-gray-500 dark:text-gray-400 mt-1'>
                      {language === 'zh-CN'
                        ? '如果导入的接口已存在，将跳过该接口，保留原有数据'
                        : 'If an imported API already exists, it will be skipped'}
                    </p>
                  </div>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label>{language === 'zh-CN' ? '选择文件' : 'Select File'}</Label>
              <div
                onClick={handleFileSelectClick}
                className='mt-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-blue-500 dark:hover:border-blue-500 transition-colors cursor-pointer'
              >
                <Upload className='w-8 h-8 mx-auto mb-2 text-gray-400' />
                <p className='text-sm text-gray-600 dark:text-gray-400'>
                  {language === 'zh-CN' ? '点击选择文件或拖拽文件到此处' : 'Click to select file or drag and drop'}
                </p>
                <p className='text-xs text-gray-500 dark:text-gray-500 mt-1'>
                  {language === 'zh-CN' ? '支持 JSON、YAML 格式，最大20MB' : 'Support JSON, YAML formats, Max size: 20MB'}
                </p>
                {selectedFileName && (
                  <p className='text-xs text-blue-600 dark:text-blue-400 mt-2'>{selectedFileName}</p>
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant='outline' onClick={() => onOpenChange(false)} className='dark:bg-gray-700 dark:border-gray-600'>
              {t('common.actions.cancel')}
            </Button>
            <Button onClick={handleImportClick} disabled={!selectedFileName && !fileInputRef.current?.files?.[0]}>
              {language === 'zh-CN' ? '开始导入' : 'Start Import'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

