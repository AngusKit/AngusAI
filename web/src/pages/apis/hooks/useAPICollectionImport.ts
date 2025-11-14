/**
 * API Collection 导入管理 Hook
 */

import { useState, useRef, useCallback, ChangeEvent } from 'react';
import { toast } from 'sonner';
import { useLanguage } from '@/components/ui/LanguageProvider';
import ApiCollectionsService from '@/services/ApiCollections';
import { ApiCollectionImportTypeEnum, ConflictStrategyEnum } from '@/enums/enums';
import { FILE_UPLOAD_CONFIG } from '../constants';
import type { ConflictStrategy, ImportMode } from '../types';

interface UseAPICollectionImportReturn {
  // State
  selectedImportType: ApiCollectionImportTypeEnum;
  setSelectedImportType: (type: ApiCollectionImportTypeEnum) => void;
  importMode: ImportMode;
  setImportMode: (mode: ImportMode) => void;
  importConflictStrategy: ConflictStrategy;
  setImportConflictStrategy: (strategy: ConflictStrategy) => void;
  selectedImportFileName: string;
  setSelectedImportFileName: (name: string) => void;
  strategyFile: File | null;
  setStrategyFile: (file: File | null) => void;
  isImporting: boolean;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  // Actions
  handleImport: (type: ApiCollectionImportTypeEnum) => void;
  handleFileInputChange: (event: ChangeEvent<HTMLInputElement>) => Promise<void>;
  handleImportWithStrategy: (file?: File) => Promise<boolean>;
  resetImport: () => void;
}

export const useAPICollectionImport = (
  onSuccess?: () => Promise<void>
): UseAPICollectionImportReturn => {
  const { t } = useLanguage();
  const [selectedImportType, setSelectedImportType] = useState<ApiCollectionImportTypeEnum>(
    ApiCollectionImportTypeEnum.OPENAPI
  );
  const [importMode, setImportMode] = useState<ImportMode>('quick');
  const [importConflictStrategy, setImportConflictStrategy] = useState<ConflictStrategy>('ignore');
  const [selectedImportFileName, setSelectedImportFileName] = useState('');
  const [strategyFile, setStrategyFile] = useState<File | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleImport = useCallback(
    (type: ApiCollectionImportTypeEnum) => {
      setImportMode('quick');
      setSelectedImportType(type);
      setStrategyFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
        fileInputRef.current.click();
      }
    },
    []
  );

  const handleFileInputChange = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) {
        return;
      }

      // Validate file size
      if (file.size > FILE_UPLOAD_CONFIG.MAX_SIZE_MB * 1024 * 1024) {
        toast.error(t('apis.validation.fileSizeExceeded'));
        return;
      }

      setSelectedImportFileName(file.name);

      if (importMode === 'quick') {
        await handleImportWithStrategy(file);
      } else {
        setStrategyFile(file);
        toast.success(t('apis.messages.fileSelected'));
      }
    },
    [importMode, t]
  );

  const handleImportWithStrategy = useCallback(
    async (file?: File): Promise<boolean> => {
      const targetFile = file || strategyFile;
      if (!targetFile) {
        toast.error(t('apis.validation.fileRequired'));
        return false;
      }

      setIsImporting(true);
      try {
        await ApiCollectionsService.apiCollectionImport({
          file: targetFile,
          type: selectedImportType,
          conflictStrategy:
            importConflictStrategy === 'overwrite' ? ConflictStrategyEnum.OVERWRITE : ConflictStrategyEnum.IGNORE,
          enableByDefault: true,
        });
        toast.success(t('apis.messages.importSuccess'));
        setSelectedImportFileName('');
        setStrategyFile(null);
        if (onSuccess) {
          await onSuccess();
        }
        return true;
      } catch (error: any) {
        console.error('Failed to import API collection:', error);
        toast.error(error?.message || t('apis.messages.importFailed'));
        return false;
      } finally {
        setIsImporting(false);
      }
    },
    [selectedImportType, importConflictStrategy, strategyFile, onSuccess, t]
  );

  const resetImport = useCallback(() => {
    setSelectedImportType(ApiCollectionImportTypeEnum.OPENAPI);
    setImportMode('quick');
    setImportConflictStrategy('ignore');
    setSelectedImportFileName('');
    setStrategyFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  return {
    selectedImportType,
    setSelectedImportType,
    importMode,
    setImportMode,
    importConflictStrategy,
    setImportConflictStrategy,
    selectedImportFileName,
    setSelectedImportFileName,
    strategyFile,
    setStrategyFile,
    isImporting,
    fileInputRef,
    handleImport,
    handleFileInputChange,
    handleImportWithStrategy,
    resetImport,
  };
};

