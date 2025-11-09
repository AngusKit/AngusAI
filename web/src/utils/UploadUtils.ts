import { toast } from 'sonner';

/**
 * 上传文件状态接口
 */
export interface UploadFile {
  id: string;
  file: File;
  name: string;
  size: number;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
}

/**
 * 文件验证配置
 */
export interface FileValidationConfig {
  maxSize: number; // 字节
  allowedTypes?: string[]; // MIME类型
  allowedExtensions?: string[]; // 文件扩展名（如 .pdf, .csv）
  errorMessages?: {
    sizeExceeded?: string;
    formatNotSupported?: string;
  };
}

/**
 * 上传配置
 */
export interface UploadConfig {
  /** 上传API函数 */
  uploadApi: (id: string, file: File, params?: any) => Promise<any>;
  /** 资源ID（知识库ID或数据集ID） */
  resourceId: string | null;
  /** 资源名称（用于错误提示） */
  resourceName: string;
  /** 上传成功后的回调 */
  onSuccess?: (fileName: string) => void;
  /** 上传失败后的回调 */
  onError?: (fileName: string, error: any) => void;
}

/**
 * 验证文件是否符合要求
 */
export function validateFile(
  file: File,
  config: FileValidationConfig,
  customErrorMessages?: { sizeExceeded?: string; formatNotSupported?: string }
): { valid: boolean; error?: string } {
  const { maxSize, allowedTypes, allowedExtensions } = config;

  // 替换错误消息中的占位符
  const replacePlaceholders = (message: string, fileName: string) => {
    return message.replace(/{fileName}/g, fileName).replace(/{file}/g, `"${fileName}"`);
  };

  const errorMessages = {
    sizeExceeded: replacePlaceholders(
      customErrorMessages?.sizeExceeded || config.errorMessages?.sizeExceeded || `文件 "${file.name}" 超过大小限制`,
      file.name
    ),
    formatNotSupported: replacePlaceholders(
      customErrorMessages?.formatNotSupported ||
        config.errorMessages?.formatNotSupported ||
        `文件 "${file.name}" 格式不支持`,
      file.name
    ),
  };

  // 检查文件大小
  if (file.size > maxSize) {
    return {
      valid: false,
      error: errorMessages.sizeExceeded,
    };
  }

  // 检查文件类型或扩展名
  if (allowedTypes || allowedExtensions) {
    const fileName = file.name.toLowerCase();
    const hasValidExtension = allowedExtensions?.some(ext => fileName.endsWith(ext.toLowerCase()));
    const hasValidType = allowedTypes?.includes(file.type);

    if (!hasValidExtension && !hasValidType) {
      return {
        valid: false,
        error: errorMessages.formatNotSupported,
      };
    }
  }

  return { valid: true };
}

/**
 * 处理文件选择的结果
 */
export interface ProcessFilesResult {
  /** 有效的文件列表 */
  validFiles: UploadFile[];
  /** 被过滤的文件数量 */
  filteredCount: number;
  /** 被过滤的文件名称列表（用于提示） */
  filteredFiles: string[];
}

/**
 * 处理文件选择，验证并转换为UploadFile数组
 * @param files 文件列表
 * @param config 验证配置
 * @param customErrorMessages 自定义错误消息
 * @param silent 是否静默处理（不显示每个文件的错误提示，适用于文件夹上传）
 * @returns 处理结果
 */
export function processFiles(
  files: FileList | File[],
  config: FileValidationConfig,
  customErrorMessages?: { sizeExceeded?: string; formatNotSupported?: string },
  silent: boolean = false
): ProcessFilesResult {
  const fileArray = Array.from(files);
  const filteredFiles: string[] = [];
  let filteredCount = 0;

  const validFiles: UploadFile[] = fileArray
    .filter(file => {
      const validation = validateFile(file, config, customErrorMessages);
      if (!validation.valid) {
        filteredCount++;
        if (validation.error) {
          filteredFiles.push(file.name);
          // 只有在非静默模式下才显示每个文件的错误
          if (!silent) {
            toast.error(validation.error);
          }
        }
        return false;
      }
      return true;
    })
    .map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      name: file.name,
      size: file.size,
      progress: 0,
      status: 'pending' as const,
    }));

  return {
    validFiles,
    filteredCount,
    filteredFiles,
  };
}

/**
 * 上传文件（带进度模拟）
 */
export async function uploadFileWithProgress(
  uploadFile: UploadFile,
  config: UploadConfig,
  updateFileCallback: (fileId: string, updates: Partial<UploadFile>) => void,
  progressIntervalRef: React.MutableRefObject<Map<string, NodeJS.Timeout>>
): Promise<void> {
  const { uploadApi, resourceId, resourceName, onSuccess, onError } = config;

  if (!resourceId) {
    toast.error(`请先选择${resourceName}`);
    return;
  }

  // 更新状态为上传中
  updateFileCallback(uploadFile.id, {
    status: 'uploading',
    progress: 0,
  });

  // 模拟进度更新
  let progress = 0;
  const progressInterval = setInterval(() => {
    progress = Math.min(progress + Math.random() * 15, 90); // 最多到90%，等待实际上传完成
    updateFileCallback(uploadFile.id, { progress });
  }, 200);
  progressIntervalRef.current.set(uploadFile.id, progressInterval);

  try {
    // 创建FormData
    const formData = new FormData();
    formData.append('file', uploadFile.file);

    // 调用上传API
    await uploadApi(resourceId, uploadFile.file, {
      body: formData,
      type: undefined as any,
    } as any);

    // 清理进度定时器
    const currentInterval = progressIntervalRef.current.get(uploadFile.id);
    if (currentInterval) {
      clearInterval(currentInterval);
      progressIntervalRef.current.delete(uploadFile.id);
    }

    // 更新状态为成功
    updateFileCallback(uploadFile.id, {
      progress: 100,
      status: 'success',
    });

    toast.success(`文件 "${uploadFile.name}" 上传成功`);

    // 调用成功回调
    if (onSuccess) {
      onSuccess(uploadFile.name);
    }
  } catch (error: any) {
    // 清理进度定时器
    const currentInterval = progressIntervalRef.current.get(uploadFile.id);
    if (currentInterval) {
      clearInterval(currentInterval);
      progressIntervalRef.current.delete(uploadFile.id);
    }

    // 更新状态为错误
    const errorMessage = error?.data?.message || error?.message || '上传失败';
    updateFileCallback(uploadFile.id, {
      status: 'error',
      error: errorMessage,
    });

    toast.error(`文件 "${uploadFile.name}" 上传失败: ${errorMessage}`);

    // 调用错误回调
    if (onError) {
      onError(uploadFile.name, error);
    }
  }
}

/**
 * 拖拽事件处理
 */
export function createDragHandlers(setIsDragging: (dragging: boolean) => void, handleFiles: (files: FileList) => void) {
  return {
    handleDragOver: (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(true);
    },
    handleDragLeave: (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
    },
    handleDrop: (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const files = e.dataTransfer.files;
      if (files.length > 0) {
        handleFiles(files);
      }
    },
  };
}

/**
 * 清理所有上传定时器
 */
export function clearAllUploadIntervals(uploadIntervalsRef: React.MutableRefObject<Map<string, NodeJS.Timeout>>): void {
  uploadIntervalsRef.current.forEach(interval => clearInterval(interval));
  uploadIntervalsRef.current.clear();
}

/**
 * 移除单个文件的上传定时器
 */
export function clearUploadInterval(
  fileId: string,
  uploadIntervalsRef: React.MutableRefObject<Map<string, NodeJS.Timeout>>
): void {
  const interval = uploadIntervalsRef.current.get(fileId);
  if (interval) {
    clearInterval(interval);
    uploadIntervalsRef.current.delete(fileId);
  }
}
