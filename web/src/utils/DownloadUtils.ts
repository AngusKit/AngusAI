/**
 * 文件下载工具函数
 */

/**
 * 下载配置选项
 */
export interface DownloadOptions {
  /** 文件名（可选，如果不提供则从URL中提取） */
  filename?: string;
  /** 下载成功回调 */
  onSuccess?: (filename: string) => void;
  /** 下载失败回调 */
  onError?: (error: Error) => void;
  /** 是否显示提示消息（默认true） */
  showToast?: boolean;
}

/**
 * 正在下载的文件集合（用于防止重复下载）
 */
const downloadingFiles = new Set<string>();

/**
 * 专业的文件下载工具方法
 *
 * 功能特性：
 * 1. 自动处理URL中文编码问题
 * 2. 防止连续点击多次下载（使用Set记录正在下载的文件）
 * 3. 支持跨域文件下载
 * 4. 自动处理文件名编码
 * 5. 完善的错误处理
 *
 * @param url 文件URL地址（支持中文路径）
 * @param options 下载配置选项
 * @returns Promise<void>
 *
 * @example
 * ```typescript
 * // 基本使用
 * await downloadFile('http://example.com/file.pdf');
 *
 * // 自定义文件名
 * await downloadFile('http://example.com/file.pdf', {
 *   filename: '我的文件.pdf',
 *   onSuccess: (name) => console.log(`下载成功: ${name}`)
 * });
 * ```
 */
export async function downloadFile(url: string, options: DownloadOptions = {}): Promise<void> {
  const { filename, onSuccess, onError, showToast = true } = options;

  // 参数验证
  if (!url || typeof url !== 'string') {
    const error = new Error('文件URL不能为空');
    if (showToast) {
      const { toast } = await import('sonner');
      toast.error('文件URL不能为空');
    }
    onError?.(error);
    throw error;
  }

  // 生成下载标识（使用URL和文件名组合）
  const downloadKey = `${url}_${filename || ''}`;

  // 检查是否正在下载
  if (downloadingFiles.has(downloadKey)) {
    if (showToast) {
      const { toast } = await import('sonner');
      toast.warning('文件正在下载中，请勿重复点击');
    }
    return;
  }

  // 标记为正在下载（在开始任何操作之前就标记，防止快速连续点击）
  downloadingFiles.add(downloadKey);

  // 立即显示下载开始提示，让用户知道操作已响应
  let downloadToastId: string | number | undefined;
  if (showToast) {
    const { toast } = await import('sonner');
    downloadToastId = toast.loading('正在准备下载...', {
      description: filename || '文件下载中',
    });
  }

  try {
    // 处理URL编码（确保中文路径正确编码）
    let encodedUrl: string;
    try {
      const urlObj = new URL(url);

      // 检查路径是否已经编码（包含 % 字符）
      const isPathEncoded = urlObj.pathname.includes('%');

      if (!isPathEncoded) {
        // 如果路径未编码，对路径部分进行编码
        const encodedPath = urlObj.pathname
          .split('/')
          .map(segment => {
            // 跳过空段
            if (!segment) return segment;
            // 尝试解码后再编码，确保正确处理
            try {
              const decoded = decodeURIComponent(segment);
              return encodeURIComponent(decoded);
            } catch {
              // 如果解码失败，说明已经是编码的，直接编码
              return encodeURIComponent(segment);
            }
          })
          .join('/');
        urlObj.pathname = encodedPath;
      }

      encodedUrl = urlObj.toString();
    } catch {
      // 如果URL解析失败（可能是相对路径），检查是否已编码
      if (url.includes('%')) {
        // 已经编码，直接使用
        encodedUrl = url;
      } else {
        // 未编码，使用 encodeURI
        encodedUrl = encodeURI(url);
      }
    }

    // 尝试使用 fetch 下载（支持跨域和更好的错误处理）
    let blob: Blob;
    try {
      // 更新提示：开始下载
      if (showToast && downloadToastId) {
        const { toast } = await import('sonner');
        toast.loading('正在下载文件...', {
          id: downloadToastId,
          description: filename || '请稍候，大文件可能需要较长时间',
        });
      }

      const response = await fetch(encodedUrl, {
        method: 'GET',
        credentials: 'include', // 包含认证信息
      });

      if (!response.ok) {
        throw new Error(`下载失败: ${response.status} ${response.statusText}`);
      }

      // 更新提示：正在获取文件数据
      if (showToast && downloadToastId) {
        const { toast } = await import('sonner');
        const contentLength = response.headers.get('content-length');
        const fileSize = contentLength ? ` (${(parseInt(contentLength) / 1024 / 1024).toFixed(2)} MB)` : '';
        toast.loading('正在获取文件数据...', {
          id: downloadToastId,
          description: filename ? `${filename}${fileSize}` : `文件较大，请耐心等待${fileSize}`,
        });
      }

      blob = await response.blob();
    } catch (fetchError: any) {
      // 如果 fetch 失败（可能是跨域问题），使用直接链接方式
      console.warn('Fetch下载失败，使用直接链接方式:', fetchError);

      // 更新提示：使用直接下载方式
      if (showToast && downloadToastId) {
        const { toast } = await import('sonner');
        toast.loading('正在启动下载...', {
          id: downloadToastId,
          description: filename || '文件下载中',
        });
      }

      // 创建隐藏的链接元素
      const link = document.createElement('a');
      link.href = encodedUrl;
      link.download = filename || '';
      link.style.display = 'none';
      link.style.position = 'absolute';
      link.style.left = '-9999px';
      document.body.appendChild(link);
      link.click();

      // 延迟移除链接元素，确保点击事件完成
      setTimeout(() => {
        document.body.removeChild(link);
      }, 100);

      const finalFilename = filename || 'download';

      // 更新提示为成功
      if (showToast && downloadToastId) {
        const { toast } = await import('sonner');
        toast.success('下载已启动', {
          id: downloadToastId,
          description: finalFilename,
        });
      }

      // 延迟移除下载标记，给浏览器时间处理下载（大文件需要更长时间）
      // 对于直接链接方式，浏览器会处理下载，我们需要给足够的时间
      setTimeout(() => {
        downloadingFiles.delete(downloadKey);
      }, 3000); // 增加到3秒，确保浏览器有足够时间开始下载

      onSuccess?.(finalFilename);
      return;
    }

    // 使用 Blob URL 下载
    const blobUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;

    // 处理文件名编码
    let finalFilename = filename;
    if (!finalFilename) {
      // 尝试从URL中提取文件名
      try {
        const urlObj = new URL(encodedUrl);
        const pathname = urlObj.pathname;
        const lastSegment = pathname.split('/').pop() || '';
        // 解码文件名
        finalFilename = decodeURIComponent(lastSegment);
        // 如果解码后包含查询参数，移除
        const queryIndex = finalFilename.indexOf('?');
        if (queryIndex > 0) {
          finalFilename = finalFilename.substring(0, queryIndex);
        }
      } catch {
        finalFilename = 'download';
      }
    }

    // 确保文件名正确编码
    link.download = finalFilename;
    link.style.display = 'none';
    link.style.position = 'absolute';
    link.style.left = '-9999px';

    // 更新提示：准备完成，开始下载
    if (showToast && downloadToastId) {
      const { toast } = await import('sonner');
      const fileSizeMB = (blob.size / 1024 / 1024).toFixed(2);
      toast.loading('文件已就绪，正在启动下载...', {
        id: downloadToastId,
        description: `${finalFilename} (${fileSizeMB} MB)`,
      });
    }

    document.body.appendChild(link);
    link.click();

    // 更新提示为成功
    if (showToast && downloadToastId) {
      const { toast } = await import('sonner');
      toast.success('下载已启动', {
        id: downloadToastId,
        description: finalFilename,
      });
    }

    // 清理 DOM 元素（立即清理）
    setTimeout(() => {
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    }, 100);

    // 根据文件大小动态调整清理下载标记的时间
    // 大文件需要更长时间，确保浏览器有足够时间开始下载
    const fileSizeMB = blob.size / 1024 / 1024;
    const cleanupDelay = fileSizeMB > 50 ? 5000 : fileSizeMB > 10 ? 3000 : 2000; // 大文件5秒，中等文件3秒，小文件2秒

    setTimeout(() => {
      downloadingFiles.delete(downloadKey);
    }, cleanupDelay);

    onSuccess?.(finalFilename);
  } catch (error: any) {
    // 移除下载标记
    downloadingFiles.delete(downloadKey);

    const errorMessage = error?.message || '下载文件失败';
    console.error('下载文件失败:', error);

    // 更新提示为错误
    if (showToast) {
      const { toast } = await import('sonner');
      if (downloadToastId) {
        toast.error('下载失败', {
          id: downloadToastId,
          description: errorMessage,
        });
      } else {
        toast.error(errorMessage);
      }
    }

    const downloadError = error instanceof Error ? error : new Error(errorMessage);
    onError?.(downloadError);
    throw downloadError;
  }
}
