import {
  Check,
  Database,
  Download,
  Edit,
  Eye,
  Files,
  FileText,
  FileX,
  Filter,
  FolderOpen,
  Grid3x3,
  List,
  MoreHorizontal,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {Card} from '@/components/ui/card';
import {Badge} from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {Input} from '@/components/ui/input';
import {Progress} from '@/components/ui/progress';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {Switch} from '@/components/ui/switch';
import {useEffect, useRef, useState} from 'react';
import {useLanguage} from '@/components/LanguageProvider.tsx';
import {toast} from 'sonner';
import KnowledgeBases from '@/services/KnowledgeBases';
import Documents from '@/services/Documents';
import {KnowledgeBaseDocStatusEnum, KnowledgeBaseDocTypeEnum} from '@/enums/enums';
import type {KnowledgeBaseListVo, KnowledgeBaseStatisticsVo} from '@/services/KnowledgeBasesTypes';
import {GetKnowledgeBaseListOrderByEnum} from '@/services/KnowledgeBasesTypes';
import type {KnowledgeBaseDocListVo} from '@/services/DocumentsTypes';
import {ENABLED_STATUS_COLOR, formatDateOnly, formatFileSize, getTagColor} from '@/utils';
import {downloadFile} from '@/utils/DownloadUtils';
import {useDebounce} from '@/hooks/useDebounce';
import {DOCUMENT_STATUS_MAP, DOCUMENT_TYPE_MAP, FILE_MAX_SIZE_BYTES, FILE_MAX_SIZE_MB} from './constants';
import { VisibilityEnum } from '@/enums/enums';
import {
  clearAllUploadIntervals,
  clearUploadInterval,
  createDragHandlers,
  type FileValidationConfig,
  processFiles,
  type UploadConfig,
  UploadFile,
  uploadFileWithProgress,
} from '@/utils/UploadUtils';

import {EditKnowledgeBaseDialog} from './EditKnowledgeBaseDialog';
import {CreateKnowledgeBaseDialog} from './CreateKnowledgeBaseDialog';
import { getEnumDescription } from '@/enums/utils';

interface KnowledgeBaseItem {
  id: string;
  name: string;
  description: string;
  icon: string;
  iconBg: string;
  documentCount: string;
  size: string;
  status: string;
  statusColor: string;
  enabled: boolean;
  visibility?: string;
  createdDate?: string;
  creator?: string;
  modifiedDate?: string;
  modifier?: string;
  tags?: string[];
  chunkSize?: number;
  chunkOverlap?: number;
  embeddingModelId?: number;
}

export function KnowledgeBase() {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [selectedKnowledgeBase, setSelectedKnowledgeBase] = useState<string | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [viewingKB, setViewingKB] = useState<KnowledgeBaseItem | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingKnowledgeBase, setEditingKnowledgeBase] = useState<KnowledgeBaseItem | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingKnowledgeBase, setDeletingKnowledgeBase] = useState<KnowledgeBaseItem | null>(null);
  const [deleteDocumentDialogOpen, setDeleteDocumentDialogOpen] = useState(false);
  const [deletingDocument, setDeletingDocument] = useState<any | null>(null);
  const [documentPage, setDocumentPage] = useState(1);
  const documentsPerPage = 6;
  const [_isLoadingKnowledgeBases, setIsLoadingKnowledgeBases] = useState(false);
  const [_isLoadingDocuments, setIsLoadingDocuments] = useState(false);
  const [statistics, setStatistics] = useState<KnowledgeBaseStatisticsVo | null>(null);
  const [_isLoadingStatistics, setIsLoadingStatistics] = useState(false);
  const [sortBy, setSortBy] = useState<'createdDate' | 'documentsCount' | 'totalSize' | 'name'>('createdDate');

  // 文件上传相关状态
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);
  const uploadIntervalsRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

  const getVisibilityLabel = (visibility?: VisibilityEnum) => {
    return getEnumDescription(VisibilityEnum, visibility as VisibilityEnum);
  };

  const getKnowledgeStatusLabel = (enabled: boolean) => t(enabled ? 'common.status.enabled' : 'common.status.disabled');

  const getDocumentStatusText = (status: KnowledgeBaseDocStatusEnum) => {
    switch (status) {
      case KnowledgeBaseDocStatusEnum.PENDING:
        return t('common.status.pending');
      case KnowledgeBaseDocStatusEnum.PROCESSING:
        return t('common.status.processing');
      case KnowledgeBaseDocStatusEnum.COMPLETED:
        return t('common.status.completed');
      case KnowledgeBaseDocStatusEnum.FAILED:
        return t('common.status.failed');
      default:
        return t('common.status.pending');
    }
  };

  // 清理所有上传任务的定时器
  useEffect(() => {
    return () => {
      clearAllUploadIntervals(uploadIntervalsRef);
    };
  }, []);

  // 搜索时重置到第一页
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchQuery]);

  // 加载统计数据
  const loadStatistics = async () => {
    setIsLoadingStatistics(true);
    try {
      const response = await KnowledgeBases.getKnowledgeBaseStatistics();
      // 处理响应结构
      let statsData = (response as any).data;

      // 如果 statsData 有 overview 字段，说明是正确的统计数据
      if (statsData && typeof statsData === 'object' && 'overview' in statsData) {
        setStatistics(statsData);
      } else {
        console.warn('Unexpected statistics data format:', statsData);
      }
    } catch (error: any) {
      console.error('Failed to load statistics:', error);
      // 不显示错误提示，避免影响用户体验
    } finally {
      setIsLoadingStatistics(false);
    }
  };

  useEffect(() => {
    loadStatistics();
  }, []);

  // 统计数据映射
  const stats = statistics
    ? [
        {
          label: t('knowledge.stats.totalKnowledgeBasesLabel'),
          value: String(statistics.overview?.totalKnowledgeBases || 0),
          subtext: t('knowledge.stats.totalKnowledgeBasesSubtext', {
            count: statistics.overview?.activeKnowledgeBases || 0,
          }),
          icon: Database,
          iconBg: 'bg-blue-500',
          trend: undefined,
          trendUp: undefined,
        },
        {
          label: t('knowledge.stats.totalDocumentsLabel'),
          value: String(statistics.overview?.totalFiles || 0),
          subtext: t('knowledge.stats.totalDocumentsSubtext', {
            count: statistics.overview?.activeFiles || 0,
            size: statistics.overview?.usedStoreSize || '0 MB',
          }),
          icon: FileText,
          iconBg: 'bg-green-500',
          trend: undefined,
          trendUp: undefined,
        },
        {
          label: t('knowledge.stats.todayQueriesLabel'),
          value: String(statistics.overview?.todayQueryCount || 0),
          subtext: t('knowledge.stats.todayQueriesSubtext', {
            count: statistics.overview?.totalQueryCount || 0,
          }),
          icon: Eye,
          iconBg: 'bg-orange-500',
          trend: undefined,
          trendUp: undefined,
        },
        {
          label: t('knowledge.stats.storageLabel'),
          value: statistics.overview?.totalStoreSize
            ? `${statistics.overview?.usedStoreSize || '0 MB'} / ${statistics.overview.totalStoreSize}`
            : `${statistics.overview?.usedStoreSize || '0 MB'} / --`,
          subtext: statistics.overview?.totalStoreSize
            ? t('knowledge.stats.storageSubtext', {
                rate: statistics.overview.usedStoreRate || '0%',
              })
            : t('knowledge.stats.storageUnlimited'),
          icon: Database,
          iconBg: 'bg-purple-500',
          progress: statistics.overview?.usedStoreRate
            ? parseFloat(statistics.overview.usedStoreRate.replace('%', '')) || 0
            : 0,
          showProgress: !!statistics.overview?.totalStoreSize,
          trend: undefined,
          trendUp: undefined,
        },
      ]
    : [
        {
          label: t('knowledge.stats.totalKnowledgeBasesLabel'),
          value: '--',
          subtext: t('knowledge.loading'),
          icon: Database,
          iconBg: 'bg-blue-500',
          trend: undefined,
          trendUp: undefined,
        },
        {
          label: t('knowledge.stats.totalDocumentsLabel'),
          value: '--',
          subtext: t('knowledge.loading'),
          icon: FileText,
          iconBg: 'bg-green-500',
          trend: undefined,
          trendUp: undefined,
        },
        {
          label: t('knowledge.stats.todayQueriesLabel'),
          value: '--',
          subtext: t('knowledge.loading'),
          icon: Eye,
          iconBg: 'bg-orange-500',
          trend: undefined,
          trendUp: undefined,
        },
        {
          label: t('knowledge.stats.storageLabel'),
          value: '--',
          subtext: t('knowledge.loading'),
          icon: Database,
          iconBg: 'bg-purple-500',
          progress: 0,
          showProgress: false,
          trend: undefined,
          trendUp: undefined,
        },
      ];

  // 知识库列表
  const [knowledgeBases, setKnowledgeBases] = useState<KnowledgeBaseItem[]>([]);

  // 加载知识库列表
  const loadKnowledgeBases = async () => {
    setIsLoadingKnowledgeBases(true);
    try {
      // 构建查询参数
      const queryParams: any = {
        keyword: debouncedSearchQuery.trim() || undefined,
        pageNo: currentPage,
        pageSize: itemsPerPage,
      };

      // 根据排序方式设置 orderBy
      queryParams.orderBy = sortBy as GetKnowledgeBaseListOrderByEnum;

      const response = await KnowledgeBases.getKnowledgeBaseList(queryParams);

      // 处理响应结构
      const responseData = (response as any).data;
      let listData: KnowledgeBaseListVo[] | undefined;
      if (responseData) {
        listData = responseData.list;
      }

      if (Array.isArray(listData)) {
        const mappedList: KnowledgeBaseItem[] = listData.map((kb: KnowledgeBaseListVo) => ({
          id: kb.id ? String(kb.id) : '',
          name: kb.name || '',
          description: kb.description || '',
          icon: kb.icon || '📚',
          iconBg: kb.iconBg || 'bg-blue-50 dark:bg-blue-900/20',
          documentCount: String(kb.documentsCount || 0),
          size: kb.totalSize || '0 MB',
          status: getKnowledgeStatusLabel(!!kb.enabled),
          statusColor: kb.enabled ? ENABLED_STATUS_COLOR.enabled : ENABLED_STATUS_COLOR.disabled,
          enabled: kb.enabled || false,
          visibility: kb.visibility,
          createdDate: kb.createdDate,
          creator: kb.creator,
          modifiedDate: kb.modifiedDate,
          modifier: kb.modifier,
          tags: kb.tags,
        }));

        // 注意：createdDate 需要降序排序（最近创建在前），但 API 可能默认是升序
        // 如果后端不支持排序方向，这里需要客户端处理 createdDate 的降序
        if (sortBy === 'createdDate') {
          mappedList.sort((a, b) => {
            const dateA = a.createdDate ? new Date(a.createdDate).getTime() : 0;
            const dateB = b.createdDate ? new Date(b.createdDate).getTime() : 0;
            return dateB - dateA; // 降序：最近创建在前
          });
        }

        setKnowledgeBases(mappedList);
      } else {
        setKnowledgeBases([]);
      }
    } catch (error: any) {
      console.error('Failed to load knowledge base list:', error);
      toast.error(error?.data?.message || error?.message || t('knowledge.toasts.loadKnowledgeBasesFailed'));
      setKnowledgeBases([]);
    } finally {
      setIsLoadingKnowledgeBases(false);
    }
  };

  useEffect(() => {
    loadKnowledgeBases();
  }, [currentPage, debouncedSearchQuery, sortBy]);

  // 旧的模拟数据已移除，现在使用API加载

  const handleToggleKnowledgeBaseStatus = async (id: string) => {
    const knowledgeBase = knowledgeBases.find(kb => kb.id === id);
    if (!knowledgeBase) return;

    const newEnabled = !knowledgeBase.enabled;
    try {
      await KnowledgeBases.toggleKnowledgeStatus(id, { enabled: newEnabled });

      setKnowledgeBases(prev =>
        prev.map(kb => {
          if (kb.id === id) {
            return {
              ...kb,
              enabled: newEnabled,
              status: getKnowledgeStatusLabel(newEnabled),
              statusColor: newEnabled ? ENABLED_STATUS_COLOR.enabled : ENABLED_STATUS_COLOR.disabled,
            };
          }
          return kb;
        })
      );
      toast.success(
        newEnabled
          ? t('knowledge.toasts.enableKnowledgeBaseSuccess')
          : t('knowledge.toasts.disableKnowledgeBaseSuccess')
      );
    } catch (error: any) {
      toast.error(error?.data?.message || t('knowledge.toasts.toggleKnowledgeBaseFailed'));
    }
  };

  // 文档列表状态
  const [documents, setDocuments] = useState<any[]>([]);
  const [totalDocuments, setTotalDocuments] = useState<number>(0);

  // 加载文档列表
  const loadDocuments = async (knowledgeBaseId: string) => {
    if (!knowledgeBaseId) return;

    setIsLoadingDocuments(true);
    try {
      const response = await Documents.getDocumentList(knowledgeBaseId, {
        pageNo: documentPage,
        pageSize: documentsPerPage,
      } as any);

      const responseData = (response as any).data;
      let listData: KnowledgeBaseDocListVo[] | undefined;
      let total: number = 0;

      if (responseData) {
        listData = responseData.list;
        total = responseData.total || 0;
      }

      if (Array.isArray(listData)) {
        const mappedDocs = listData.map((doc: KnowledgeBaseDocListVo) => {
          const status = (doc.status ?? KnowledgeBaseDocStatusEnum.PENDING) as KnowledgeBaseDocStatusEnum;
          const type = (doc.type ?? KnowledgeBaseDocTypeEnum.TXT) as KnowledgeBaseDocTypeEnum;
          const statusInfo = DOCUMENT_STATUS_MAP[status] || DOCUMENT_STATUS_MAP[KnowledgeBaseDocStatusEnum.PENDING]!;
          const typeInfo = DOCUMENT_TYPE_MAP[type] || DOCUMENT_TYPE_MAP[KnowledgeBaseDocTypeEnum.TXT]!;

          return {
            id: doc.id ? String(doc.id) : '',
            name: doc.name || '',
            type: typeInfo.labelKey,
            typeColor: typeInfo.color,
            typeIcon: typeInfo.icon,
            size: doc.size || '0 MB',
            status: getDocumentStatusText(status),
            statusColor: statusInfo.color,
            enabled: doc.enabled || false,
            uploadTime: doc.createdDate || '',
            processingProgress: doc.processingProgress,
            chunks: doc.chunks,
            errorMessage: doc.errorMessage,
            statusEnum: status,
            filePath: doc.filePath,
          };
        });
        setDocuments(mappedDocs);
        setTotalDocuments(total);
      } else {
        setDocuments([]);
        setTotalDocuments(0);
      }
    } catch (error: any) {
      console.error('Failed to load document list:', error);
      toast.error(error?.data?.message || error?.message || t('knowledge.toasts.loadDocumentsFailed'));
      setDocuments([]);
      setTotalDocuments(0);
    } finally {
      setIsLoadingDocuments(false);
    }
  };

  useEffect(() => {
    // 切换知识库时，立即清空文档列表
    setDocuments([]);
    setTotalDocuments(0);

    if (selectedKnowledgeBase) {
      // 重置到第一页
      setDocumentPage(1);
      loadDocuments(selectedKnowledgeBase);
    }
  }, [selectedKnowledgeBase]);

  // 当文档页码改变时，重新加载当前知识库的文档
  useEffect(() => {
    if (selectedKnowledgeBase) {
      loadDocuments(selectedKnowledgeBase);
    }
  }, [documentPage]);

  // 旧的模拟数据已移除，现在使用API加载

  // 文档启用/禁用处理
  const handleToggleDocument = async (id: string) => {
    if (!selectedKnowledgeBase) return;

    const doc = documents.find(d => d.id === id);
    if (!doc || doc.statusEnum === KnowledgeBaseDocStatusEnum.PROCESSING) return;

    const newEnabled = !doc.enabled;
    try {
      await Documents.toggleDocument(id, selectedKnowledgeBase, { enabled: newEnabled });

      setDocuments(prev =>
        prev.map(d => {
          if (d.id === id) {
            const completedStatus = DOCUMENT_STATUS_MAP[KnowledgeBaseDocStatusEnum.COMPLETED];
            return {
              ...d,
              enabled: newEnabled,
              status: newEnabled
                ? getDocumentStatusText(KnowledgeBaseDocStatusEnum.COMPLETED)
                : t('common.status.disabled'),
              statusColor: newEnabled
                ? completedStatus?.color || ENABLED_STATUS_COLOR.enabled
                : ENABLED_STATUS_COLOR.disabled,
            };
          }
          return d;
        })
      );
      toast.success(
        newEnabled ? t('knowledge.toasts.enableDocumentSuccess') : t('knowledge.toasts.disableDocumentSuccess')
      );
    } catch (error: any) {
      toast.error(error?.data?.message || t('knowledge.toasts.toggleDocumentFailed'));
    }
  };

  // 重新解析文档
  const handleReparse = async (doc: any) => {
    if (!selectedKnowledgeBase) return;

    try {
      toast.info(t('knowledge.toasts.reparseDocumentStart', { name: doc.name }));

      const response = await Documents.reprocessDocument(doc.id, selectedKnowledgeBase);

      const responseData = (response as any).data;
      const statusData = responseData?.data;

      if (statusData) {
        setDocuments(prev =>
          prev.map(d => {
            if (d.id === doc.id) {
              const status = (statusData.status ?? KnowledgeBaseDocStatusEnum.PROCESSING) as KnowledgeBaseDocStatusEnum;
              const statusInfo =
                DOCUMENT_STATUS_MAP[status] || DOCUMENT_STATUS_MAP[KnowledgeBaseDocStatusEnum.PROCESSING]!;

              return {
                ...d,
                status: statusInfo.textKey,
                statusColor: statusInfo.color,
                enabled: statusData.enabled || false,
                processingProgress: statusData.processingProgress,
                chunks: statusData.chunks,
                errorMessage: statusData.errorMessage,
                statusEnum: status,
              };
            }
            return d;
          })
        );

        if (statusData.status === KnowledgeBaseDocStatusEnum.COMPLETED) {
          toast.success(t('knowledge.toasts.reparseDocumentCompleted', { name: doc.name }));
        } else if (statusData.status === KnowledgeBaseDocStatusEnum.PROCESSING) {
          toast.info(t('knowledge.toasts.reparseDocumentProcessing', { name: doc.name }));
        }
      }
    } catch (error: any) {
      toast.error(error?.data?.message || t('knowledge.toasts.reparseDocumentFailed'));
    }
  };

  // 删除文档
  const handleDeleteDocument = (doc: any) => {
    if (!selectedKnowledgeBase) return;

    setDeletingDocument(doc);
    setDeleteDocumentDialogOpen(true);
  };

  // 确认删除文档
  const confirmDeleteDocument = async () => {
    if (deletingDocument && selectedKnowledgeBase) {
      try {
        await Documents.deleteDocument(deletingDocument.id, selectedKnowledgeBase);
        toast.success(t('knowledge.toasts.deleteDocumentSuccess', { name: deletingDocument.name }));
        setDeleteDocumentDialogOpen(false);
        setDeletingDocument(null);
        loadDocuments(selectedKnowledgeBase); // 重新加载列表
      } catch (error: any) {
        toast.error(error?.data?.message || t('knowledge.toasts.deleteDocumentFailed'));
      }
    }
  };

  // 下载文档
  const handleDownloadDocument = async (doc: any) => {
    if (!doc.filePath) {
      toast.error(t('knowledge.toasts.missingFilePath'));
      return;
    }

    try {
      await downloadFile(doc.filePath, {
        filename: doc.name,
        showToast: true,
      });
    } catch (error: any) {
      // 错误已在 downloadFile 中处理
      console.error('Failed to download document:', error);
    }
  };

  const handleViewKnowledgeBase = async (knowledgeBase: KnowledgeBaseItem) => {
    try {
      const response = await KnowledgeBases.getKnowledgeBaseDetail(knowledgeBase.id);
      const responseData = (response as any).data;
      const detail = responseData?.data;

      if (detail) {
        const mappedKnowledgeBase: KnowledgeBaseItem = {
          ...knowledgeBase,
          description: detail.description || knowledgeBase.description,
          documentCount: String(detail.documentsCount || 0),
          size: detail.totalSize || knowledgeBase.size,
          tags: detail.tags,
          visibility: detail.visibility,
          chunkSize: detail.config?.chunkSize,
          chunkOverlap: detail.config?.chunkOverlap,
          embeddingModelId: detail.config?.embeddingModelId,
        };
        setViewingKB(mappedKnowledgeBase);
        setViewDialogOpen(true);
      } else {
        setViewingKB(knowledgeBase);
        setViewDialogOpen(true);
      }
    } catch (error: any) {
      toast.error(error?.data?.message || t('knowledge.toasts.loadKnowledgeBaseDetailFailed'));
      // 失败时仍显示基本信息
      setViewingKB(knowledgeBase);
      setViewDialogOpen(true);
    }
  };

  const handleEditKnowledgeBase = (knowledgeBase: KnowledgeBaseItem) => {
    setEditingKnowledgeBase(knowledgeBase);
    setEditDialogOpen(true);
  };

  const handleDeleteKnowledgeBase = (knowledgeBase: KnowledgeBaseItem) => {
    setDeletingKnowledgeBase(knowledgeBase);
    setDeleteDialogOpen(true);
  };

  // 确认删除知识库
  const confirmDeleteKnowledgeBase = async () => {
    if (deletingKnowledgeBase) {
      try {
        await KnowledgeBases.deleteKnowledgeBase(deletingKnowledgeBase.id);
        toast.success(t('knowledge.toasts.deleteKnowledgeBaseSuccess', { name: deletingKnowledgeBase.name }));
        setDeleteDialogOpen(false);
        setDeletingKnowledgeBase(null);
        loadKnowledgeBases(); // 重新加载列表
        if (selectedKnowledgeBase === deletingKnowledgeBase.id) {
          setSelectedKnowledgeBase(null);
        }
      } catch (error: any) {
        toast.error(error?.data?.message || t('knowledge.toasts.deleteKnowledgeBaseFailed'));
      }
    }
  };

  // 文件验证配置
  const fileValidationConfig: FileValidationConfig = {
    maxSize: FILE_MAX_SIZE_BYTES,
    allowedTypes: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
    ],
    allowedExtensions: ['.pdf', '.doc', '.docx', '.txt'],
    errorMessages: {
      sizeExceeded: `${t('knowledgeUpload.fileSizeExceeded')} (${FILE_MAX_SIZE_MB}MB)`,
      formatNotSupported: t('knowledgeUpload.fileFormatNotSupported'),
    },
  };

  const handleFiles = (files: FileList | File[], isFolderUpload: boolean = false) => {
    // 文件夹上传时使用静默模式，避免显示大量错误提示
    const result = processFiles(
      files,
      fileValidationConfig,
      {
        sizeExceeded: `${t('knowledgeUpload.fileAdded')} {fileName} ${t('knowledgeUpload.fileSizeExceeded')} (50MB)`,
        formatNotSupported: `${t('knowledgeUpload.fileAdded')} {fileName} ${t('knowledgeUpload.fileFormatNotSupported')}`,
      },
      isFolderUpload // 文件夹上传时静默处理
    );

    if (result.validFiles.length > 0) {
      setUploadFiles(prev => [...prev, ...result.validFiles]);

      // 显示成功消息
      if (isFolderUpload) {
        // 文件夹上传：显示有效文件数和被过滤的文件数
        if (result.filteredCount > 0) {
          const previewFiles = result.filteredFiles.slice(0, 3).join('、');
          const description =
            previewFiles.length > 0
              ? t('knowledge.upload.filteredDescription', {
                  preview: previewFiles,
                  total: result.filteredFiles.length,
                })
              : undefined;
          toast.success(
            t('knowledge.upload.folderSummary', {
              added: result.validFiles.length,
              filtered: result.filteredCount,
            }),
            {
              description,
            }
          );
        } else {
          toast.success(t('knowledge.upload.folderAdded', { count: result.validFiles.length }));
        }
      } else {
        // 单个文件上传：显示成功消息
        toast.success(t('knowledge.upload.filesAdded', { count: result.validFiles.length }));
      }

      // 自动开始上传 分组上传(5个一组 执行)
      uploadFilesInBatches(result.validFiles);
    } else if (isFolderUpload && result.filteredCount > 0) {
      // 文件夹中没有有效文件
      toast.warning(t('knowledge.upload.noSupportedFiles'), {
        description: t('knowledge.upload.noSupportedFilesDescription', {
          count: result.filteredCount,
        }),
      });
    }
  };

  // 更新文件状态的辅助函数
  const updateFile = (fileId: string, updates: Partial<UploadFile>) => {
    setUploadFiles(prev => prev.map(f => (f.id === fileId ? { ...f, ...updates } : f)));
  };

  // 分组上传文件（每5个一组）
  const uploadFilesInBatches = async (files: UploadFile[]) => {
    const BATCH_SIZE = 5;

    // 如果文件数量小于等于5，直接并行上传
    if (files.length <= BATCH_SIZE) {
      await Promise.all(files.map(file => handleUpload(file)));
      return;
    }

    // 将文件按5个一组分组
    const batches: UploadFile[][] = [];
    for (let i = 0; i < files.length; i += BATCH_SIZE) {
      batches.push(files.slice(i, i + BATCH_SIZE));
    }

    // 按组顺序上传，每组内并行上传
    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];
      if (!batch || batch.length === 0) {
        continue;
      }

      console.log(`Uploading batch ${i + 1}/${batches.length}, files: ${batch.length}`);

      // 等待当前组的所有文件上传完成
      await Promise.all(batch.map(file => handleUpload(file)));

      // 每组之间可以添加短暂延迟，避免服务器压力过大
      if (i < batches.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    console.log(`Finished uploading files. Total: ${files.length}`);
  };

  // 上传文件
  const handleUpload = async (uploadFile: UploadFile) => {
    const uploadConfig: UploadConfig = {
      uploadApi: async (id: string, file: File, params?: any) => {
        return Documents.uploadDocument(id, { file }, params);
      },
      resourceId: selectedKnowledgeBase,
      resourceName: t('knowledge.resourceName'),
      onSuccess: () => {
        // 重新加载文档列表
        setTimeout(() => {
          if (selectedKnowledgeBase) {
            loadDocuments(selectedKnowledgeBase);
          }
        }, 1000);
      },
    };

    await uploadFileWithProgress(uploadFile, uploadConfig, updateFile, uploadIntervalsRef);
  };

  // 拖拽处理
  const dragHandlers = createDragHandlers(setIsDragging, handleFiles);
  const { handleDragOver, handleDragLeave, handleDrop } = dragHandlers;

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      // 检查是否是文件夹上传（通过检查 input 是否有 webkitdirectory 属性）
      const isFolderUpload = e.target.hasAttribute('webkitdirectory')
        || e.target.hasAttribute('directory');
      handleFiles(e.target.files, isFolderUpload);
    }
    // 重置 input，允许重复选择同一文件
    e.target.value = '';
  };

  const handleSelectFiles = () => {
    fileInputRef.current?.click();
  };

  const handleSelectFolder = () => {
    folderInputRef.current?.click();
  };

  const removeFile = (fileId: string) => {
    // 清理该文件的上传定时器
    clearUploadInterval(fileId, uploadIntervalsRef);

    setUploadFiles(prev => prev.filter(f => f.id !== fileId));
    toast.info(t('knowledgeUpload.fileRemoved'));
  };

  const clearAllFiles = () => {
    // 清理所有上传定时器
    clearAllUploadIntervals(uploadIntervalsRef);

    setUploadFiles([]);
    toast.info(t('knowledgeUpload.listCleared'));
  };

  // 过滤知识库
  const filteredKnowledgeBases = knowledgeBases.filter(kb => {
    const searchLower = searchQuery.toLowerCase();
    return kb.name.toLowerCase().includes(searchLower)
      || kb.description.toLowerCase().includes(searchLower);
  });

  // 分页逻辑
  const totalPages = Math.ceil(filteredKnowledgeBases.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentKnowledgeBases = filteredKnowledgeBases.slice(startIndex, endIndex);
  const shouldShowPagination = filteredKnowledgeBases.length > itemsPerPage;

  // 获取选中的知识库
  const selectedKB = knowledgeBases.find(kb => kb.id === selectedKnowledgeBase);

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div>
        <h1 className='text-2xl mb-1 dark:text-white'>{t('knowledge.title')}</h1>
        <p className='text-sm text-gray-600 dark:text-gray-400'>{t('knowledge.subtitle')}</p>
      </div>

      {/* Stats Cards */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className='px-5 pt-5 pb-3 dark:bg-gray-800 dark:border-gray-700'>
              <div className='flex items-start justify-between mb-1.5'>
                <div className={`${stat.iconBg} w-10 h-10 rounded-lg flex items-center justify-center`}>
                  <Icon className='w-5 h-5 text-white' />
                </div>
                {stat.trend && (
                  <span
                    className={`text-sm ${stat.trendUp ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}
                  >
                    {stat.trend}
                  </span>
                )}
              </div>
              <div className='text-base font-semibold text-gray-600 dark:text-gray-400 mb-0.5'>{stat.label}</div>
              <div className='text-3xl dark:text-white mb-0.5'>{stat.value}</div>
              {stat.showProgress ? (
                <div className='flex items-center gap-2'>
                  <Progress value={stat.progress} className='h-1.5 flex-1' />
                  <div className='text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap'>{stat.subtext}</div>
                </div>
              ) : (
                <div className='text-xs text-gray-500 dark:text-gray-400'>{stat.subtext}</div>
              )}
            </Card>
          );
        })}
      </div>

      {/* Knowledge Base List */}
      <div>
        {/* Action Buttons and Search - 与应用列表一致 */}
        <div className='flex items-center justify-between gap-3 mb-4'>
          {/* Search Bar - 左侧390px */}
          <div className='relative w-[390px]'>
            <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500' />
            <Input
              type='text'
              placeholder={t('knowledge.searchPlaceholder')}
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value);
              }}
              className='pl-10 pr-10 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 focus-visible:border-blue-500 focus-visible:ring-blue-500/50'
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setCurrentPage(1);
                }}
                className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors'
              >
                <X className='w-4 h-4' />
              </button>
            )}
          </div>

          {/* Action Buttons - 右侧 */}
          <div className='flex items-center gap-3'>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant='outline'
                  size='sm'
                  className='dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300'
                >
                  <Filter className='w-4 h-4 mr-2' />
                  {t('common.actions.filter')}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end' className='dark:bg-gray-800 dark:border-gray-700'>
                <DropdownMenuItem
                  className={`dark:text-gray-300 ${sortBy === 'createdDate' ? 'bg-blue-50 dark:bg-blue-900/30' : ''}`}
                  onClick={() => {
                    setSortBy('createdDate');
                    setCurrentPage(1); // 重置到第一页
                  }}
                >
                  {t('knowledge.sort.recentCreated')}
                </DropdownMenuItem>
                <DropdownMenuItem
                  className={`dark:text-gray-300 ${sortBy === 'documentsCount' ? 'bg-blue-50 dark:bg-blue-900/30' : ''}`}
                  onClick={() => {
                    setSortBy('documentsCount');
                    setCurrentPage(1);
                  }}
                >
                  {t('knowledge.sort.documentsCount')}
                </DropdownMenuItem>
                <DropdownMenuItem
                  className={`dark:text-gray-300 ${sortBy === 'totalSize' ? 'bg-blue-50 dark:bg-blue-900/30' : ''}`}
                  onClick={() => {
                    setSortBy('totalSize');
                    setCurrentPage(1);
                  }}
                >
                  {t('knowledge.sort.totalSize')}
                </DropdownMenuItem>
                <DropdownMenuItem
                  className={`dark:text-gray-300 ${sortBy === 'name' ? 'bg-blue-50 dark:bg-blue-900/30' : ''}`}
                  onClick={() => {
                    setSortBy('name');
                    setCurrentPage(1);
                  }}
                >
                  {t('knowledge.sort.name')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <div className='flex items-center gap-1 border border-gray-200 dark:border-gray-700 rounded-lg p-1'>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded ${
                  viewMode === 'grid'
                    ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Grid3x3 className='w-4 h-4' />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded ${
                  viewMode === 'table'
                    ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <List className='w-4 h-4' />
              </button>
            </div>

            <Button
              size='sm'
              className='bg-blue-500 hover:bg-blue-600 text-white'
              onClick={() => setCreateDialogOpen(true)}
            >
              <Plus className='w-4 h-4 mr-2' />
              {t('knowledge.actions.create')}
            </Button>
          </div>
        </div>

        {/* Empty State */}
        {filteredKnowledgeBases.length === 0 && (
          <div className='text-center py-12'>
            <Database className='w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-3' />
            <p className='text-gray-600 dark:text-gray-400'>{t('knowledge.empty.noMatch')}</p>
            <p className='text-sm text-gray-500 dark:text-gray-500 mt-1'>
              {searchQuery ? t('knowledge.empty.tryAnotherSearch') : t('knowledge.empty.noData')}
            </p>
          </div>
        )}

        {/* Grid View */}
        {viewMode === 'grid' && filteredKnowledgeBases.length > 0 && (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {currentKnowledgeBases.map(kb => (
              <Card
                key={kb.id}
                className={`p-5 hover:shadow-md transition-all cursor-pointer gap-2 ${
                  selectedKnowledgeBase === kb.id
                    ? 'ring-2 ring-blue-500 dark:ring-blue-400 shadow-lg bg-blue-50/50 dark:bg-blue-900/10'
                    : 'dark:bg-gray-800'
                } dark:border-gray-700`}
                onClick={() => setSelectedKnowledgeBase(selectedKnowledgeBase === kb.id ? null : kb.id)}
              >
                <div className='flex items-start justify-between mb-4'>
                  <div className='flex items-center gap-3'>
                    <div className={`${kb.iconBg} w-12 h-12 rounded-lg flex items-center justify-center text-2xl`}>
                      {kb.icon}
                    </div>
                    <div>
                      <div className='flex items-center gap-2'>
                        <h3 className='dark:text-white'>{kb.name}</h3>
                        <Switch
                          checked={kb.enabled}
                          onCheckedChange={() => {
                            handleToggleKnowledgeBaseStatus(kb.id);
                          }}
                          onClick={e => e.stopPropagation()}
                          className='data-[state=checked]:bg-blue-500'
                        />
                      </div>
                      <Badge variant='secondary' className={`${kb.statusColor} text-xs mt-1`}>
                        {kb.status}
                      </Badge>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant='ghost'
                        size='sm'
                        className='dark:text-gray-400'
                        onClick={e => e.stopPropagation()}
                      >
                        <MoreHorizontal className='w-4 h-4' />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='end' className='dark:bg-gray-800 dark:border-gray-700'>
                      <DropdownMenuItem onClick={() => handleViewKnowledgeBase(kb)} className='dark:text-gray-300'>
                        <Eye className='w-4 h-4 mr-2' />
                        {t('common.actions.view')}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEditKnowledgeBase(kb)} className='dark:text-gray-300'>
                        <Edit className='w-4 h-4 mr-2' />
                        {t('common.actions.edit')}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDeleteKnowledgeBase(kb)}
                        className='text-red-600 dark:text-red-400'
                      >
                        <Trash2 className='w-4 h-4 mr-2' />
                        {t('common.actions.delete')}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <p className='text-sm text-gray-600 dark:text-gray-400 mb-1 line-clamp-2 flex-1'>{kb.description}</p>

                {/* 标签 */}
                {kb.tags && kb.tags.length > 0 && (
                  <div className='flex flex-wrap gap-1'>
                    {kb.tags.map((tag, index) => (
                      <Badge key={index} variant='secondary' className={`${getTagColor(tag)} text-xs`}>
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}

                <div className='grid grid-cols-2 gap-4 pt-2 border-t border-gray-100 dark:border-gray-700'>
                  <div>
                    <div className='text-xs text-gray-500 dark:text-gray-400 mb-1'>
                      {t('knowledge.card.documentsLabel')}
                    </div>
                    <div className='dark:text-white'>{kb.documentCount}</div>
                  </div>
                  <div>
                    <div className='text-xs text-gray-500 dark:text-gray-400 mb-1'>{t('knowledge.card.sizeLabel')}</div>
                    <div className='dark:text-white'>{kb.size}</div>
                  </div>
                </div>

                {/* 附加信息 */}
                {kb.visibility && (
                  <div className='mt-0.5 pt-3 border-t border-gray-100 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400'>
                    <div className='flex items-center justify-between'>
                      <span>
                        {t('knowledge.card.visibilityPrefix', {
                          visibility: getVisibilityLabel(kb.visibility),
                        })}
                      </span>
                      <span>{formatDateOnly(kb.modifiedDate)}</span>
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}

        {/* Table View */}
        {viewMode === 'table' && filteredKnowledgeBases.length > 0 && (
          <Card className='dark:bg-gray-800 dark:border-gray-700'>
            <div className='overflow-x-auto'>
              <table className='w-full'>
                <thead className='border-b border-gray-200 dark:border-gray-700'>
                  <tr>
                    <th className='px-5 py-3 text-left text-xs text-gray-500 dark:text-gray-400'>
                      {t('common.labels.name')}
                    </th>
                    <th className='px-5 py-3 text-left text-xs text-gray-500 dark:text-gray-400'>
                      {t('common.labels.description')}
                    </th>
                    <th className='px-5 py-3 text-left text-xs text-gray-500 dark:text-gray-400'>
                      {t('knowledge.table.columns.documents')}
                    </th>
                    <th className='px-5 py-3 text-left text-xs text-gray-500 dark:text-gray-400'>
                      {t('knowledge.table.columns.size')}
                    </th>
                    <th className='px-5 py-3 text-left text-xs text-gray-500 dark:text-gray-400'>
                      {t('knowledge.table.columns.status')}
                    </th>
                    <th className='px-5 py-3 text-left text-xs text-gray-500 dark:text-gray-400'>
                      {t('knowledge.table.columns.visibility')}
                    </th>
                    <th className='px-5 py-3 text-left text-xs text-gray-500 dark:text-gray-400'>
                      {t('knowledge.table.columns.updatedAt')}
                    </th>
                    <th className='px-5 py-3 text-left text-xs text-gray-500 dark:text-gray-400'>
                      {t('common.actions.actions')}
                    </th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-gray-100 dark:divide-gray-700'>
                  {currentKnowledgeBases.map(kb => (
                    <tr
                      key={kb.id}
                      className={`cursor-pointer transition-colors ${
                        selectedKnowledgeBase === kb.id
                          ? 'bg-blue-50 dark:bg-blue-900/10 hover:bg-blue-100 dark:hover:bg-blue-900/20'
                          : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                      }`}
                      onClick={() => setSelectedKnowledgeBase(selectedKnowledgeBase === kb.id ? null : kb.id)}
                    >
                      <td className='px-5 py-4'>
                        <div className='flex items-center gap-3'>
                          <div
                            className={`${kb.iconBg} w-10 h-10 rounded-lg flex items-center justify-center text-xl flex-shrink-0`}
                          >
                            {kb.icon}
                          </div>
                          <div className='min-w-0'>
                            <div className='dark:text-white truncate'>{kb.name}</div>
                            {kb.tags && kb.tags.length > 0 && (
                              <div className='flex flex-wrap gap-1 mt-1'>
                                {kb.tags.map((tag, index) => (
                                  <Badge key={index} variant='secondary' className={`${getTagColor(tag)} text-xs`}>
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className='px-5 py-4 max-w-xs'>
                        <div className='text-sm text-gray-600 dark:text-gray-400 line-clamp-2'>{kb.description}</div>
                      </td>
                      <td className='px-5 py-4'>
                        <div className='text-sm dark:text-white'>{kb.documentCount}</div>
                      </td>
                      <td className='px-5 py-4'>
                        <div className='text-sm dark:text-white'>{kb.size}</div>
                      </td>
                      <td className='px-5 py-4'>
                        <div className='flex items-center gap-2' onClick={e => e.stopPropagation()}>
                          <Badge variant='secondary' className={`${kb.statusColor} text-xs`}>
                            {kb.status}
                          </Badge>
                          <Switch
                            checked={kb.enabled}
                            onCheckedChange={() => handleToggleKnowledgeBaseStatus(kb.id)}
                            className='data-[state=checked]:bg-blue-500'
                          />
                        </div>
                      </td>
                      <td className='px-5 py-4'>
                        <div className='text-sm dark:text-white'>{getVisibilityLabel(kb.visibility)}</div>
                      </td>
                      <td className='px-5 py-4'>
                        <div className='text-sm text-gray-600 dark:text-gray-400'>
                          {formatDateOnly(kb.modifiedDate)}
                        </div>
                      </td>
                      <td className='px-5 py-4'>
                        <div className='flex items-center gap-2' onClick={e => e.stopPropagation()}>
                          <button
                            onClick={() => handleViewKnowledgeBase(kb)}
                            className='p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded'
                          >
                            <Eye className='w-4 h-4 text-blue-500' />
                          </button>
                          <button
                            onClick={() => handleEditKnowledgeBase(kb)}
                            className='p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded'
                          >
                            <Edit className='w-4 h-4 text-gray-600 dark:text-gray-400' />
                          </button>
                          <button
                            onClick={() => handleDeleteKnowledgeBase(kb)}
                            className='p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded'
                          >
                            <Trash2 className='w-4 h-4 text-red-500' />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* Pagination */}
        {shouldShowPagination && (
          <div className='flex justify-center mt-6'>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      onClick={() => setCurrentPage(page)}
                      isActive={currentPage === page}
                      className='cursor-pointer'
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>

      {/* Document Management Section - Shows when a knowledge base is selected */}
      {selectedKnowledgeBase && selectedKB && (
        <div className='border-t-4 border-blue-500 dark:border-blue-400 bg-gradient-to-b from-blue-50/50 to-transparent dark:from-blue-900/10 dark:to-transparent -mx-6 px-6 pt-6 pb-6 mt-6'>
          {/* Header with KB info and close button */}
          <div className='flex items-center justify-between mb-6'>
            <div className='flex items-center gap-3'>
              <div className={`${selectedKB.iconBg} w-12 h-12 rounded-lg flex items-center justify-center text-2xl`}>
                {selectedKB.icon}
              </div>
              <div>
                <div className='flex items-center gap-3'>
                  <h2 className='text-xl dark:text-white'>{selectedKB.name}</h2>
                  <Badge variant='secondary' className={`${selectedKB.statusColor}`}>
                    {selectedKB.status}
                  </Badge>
                </div>
                <p className='text-sm text-gray-600 dark:text-gray-400 mt-1'>
                  {t('knowledge.selected.summary', {
                    description: selectedKB.description || '',
                    count: selectedKB.documentCount,
                    size: selectedKB.size,
                  })}
                </p>
              </div>
            </div>
            <Button
              variant='ghost'
              size='sm'
              onClick={() => setSelectedKnowledgeBase(null)}
              className='dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
            >
              <X className='w-4 h-4' />
            </Button>
          </div>

          <div className='space-y-6'>
            {/* Upload Section */}
            <div>
              <h3 className='text-lg dark:text-white mb-3 flex items-center gap-2'>
                <Upload className='w-5 h-5 text-blue-500 dark:text-blue-400' />
                {t('knowledge.upload.sectionTitle')}
              </h3>
              <Card className='p-6 dark:bg-gray-800 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm'>
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
                    isDragging
                      ? 'border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-900/20'
                      : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <Upload
                    className={`w-12 h-12 mx-auto mb-4 ${
                      isDragging ? 'text-blue-500 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'
                    }`}
                  />

                  <div className='flex items-center justify-center gap-3 mb-4'>
                    <Button className='bg-blue-500 hover:bg-blue-600 text-white' onClick={handleSelectFiles}>
                      <Files className='w-4 h-4 mr-2' />
                      {t('knowledgeUpload.selectFiles')}
                    </Button>
                    <Button
                      variant='outline'
                      className='dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-gray-600'
                      onClick={handleSelectFolder}
                    >
                      <FolderOpen className='w-4 h-4 mr-2' />
                      {t('knowledgeUpload.selectFolder')}
                    </Button>
                  </div>

                  <p className='text-sm text-gray-600 dark:text-gray-400'>
                    {isDragging ? t('knowledgeUpload.dragDropActive') : t('knowledgeUpload.dragDropHint')}
                  </p>
                  <p className='text-xs text-gray-500 dark:text-gray-500 mt-2'>
                    {t('knowledge.upload.supportedFormats')}
                  </p>

                  {/* 隐藏的文件输入 */}
                  <input
                    ref={fileInputRef}
                    type='file'
                    multiple
                    accept='.pdf,.doc,.docx,.txt'
                    onChange={handleFileInputChange}
                    className='hidden'
                  />
                  <input
                    ref={folderInputRef}
                    type='file'
                    // @ts-ignore - webkitdirectory is not in TypeScript types
                    webkitdirectory=''
                    directory=''
                    multiple
                    accept='.pdf,.doc,.docx,.txt'
                    onChange={handleFileInputChange}
                    className='hidden'
                  />
                </div>

                {/* 上传文件列表 */}
                {uploadFiles.length > 0 && (
                  <div className='mt-6'>
                    <div className='flex items-center justify-between mb-3'>
                      <h4 className='text-sm dark:text-white'>
                        {t('knowledgeUpload.uploadQueue')} ({uploadFiles.length} {t('knowledgeUpload.filesCount')})
                      </h4>
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={clearAllFiles}
                        className='text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400'
                      >
                        <X className='w-4 h-4 mr-1' />
                        {t('knowledgeUpload.clearList')}
                      </Button>
                    </div>

                    <div className='space-y-2 max-h-60 overflow-y-auto'>
                      {uploadFiles.map(uploadFile => (
                        <div
                          key={uploadFile.id}
                          className='flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg'
                        >
                          <div className='flex-1 min-w-0'>
                            <div className='flex items-center justify-between mb-1'>
                              <span className='text-sm dark:text-white truncate'>{uploadFile.name}</span>
                              <span className='text-xs text-gray-500 dark:text-gray-400 ml-2'>
                                {formatFileSize(uploadFile.size)}
                              </span>
                            </div>

                            {uploadFile.status === 'uploading' && (
                              <div className='flex items-center gap-2'>
                                <Progress value={uploadFile.progress} className='h-1.5 flex-1' />
                                <span className='text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap'>
                                  {Math.round(uploadFile.progress)}%
                                </span>
                              </div>
                            )}

                            {uploadFile.status === 'success' && (
                              <div className='flex items-center gap-1 text-green-600 dark:text-green-400'>
                                <Check className='w-3 h-3' />
                                <span className='text-xs'>{t('knowledgeUpload.uploadSuccess')}</span>
                              </div>
                            )}

                            {uploadFile.status === 'error' && (
                              <span className='text-xs text-red-600 dark:text-red-400'>
                                {uploadFile.error || t('knowledgeUpload.uploadFailed')}
                              </span>
                            )}
                          </div>

                          <Button
                            variant='ghost'
                            size='sm'
                            onClick={() => removeFile(uploadFile.id)}
                            className='text-gray-400 hover:text-red-600 dark:hover:text-red-400 flex-shrink-0'
                          >
                            <X className='w-4 h-4' />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            </div>

            {/* Document List Section */}
            <div>
              <h3 className='text-lg dark:text-white mb-3 flex items-center gap-2'>
                <FileText className='w-5 h-5 text-green-500 dark:text-green-400' />
                {t('knowledge.documents.sectionTitle')}
              </h3>
              <Card className='dark:bg-gray-800 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm gap-0'>
                <div className='p-5 border-b border-gray-200 dark:border-gray-700'>
                  <div className='flex items-center justify-between'>
                    <h4 className='dark:text-white'>{t('knowledge.documents.uploadedTitle')}</h4>
                    <span className='text-sm text-gray-500 dark:text-gray-400'>
                      {totalDocuments > 0
                        ? t('knowledge.documents.totalSummary', {
                            total: totalDocuments,
                          })
                        : t('knowledge.documents.empty')}
                      {totalDocuments > 0 &&
                        t('knowledge.documents.paginationInfo', {
                          page: documentPage,
                          perPage: documentsPerPage,
                        })}
                    </span>
                  </div>
                </div>

                {!documents || documents.length === 0 ? (
                  <div className='flex flex-col items-center justify-center py-16 px-5'>
                    <div className='mb-4'>
                      <div className='w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-700/50 flex items-center justify-center'>
                        <FileX className='w-10 h-10 text-gray-400 dark:text-gray-500' />
                      </div>
                    </div>
                    <h4 className='text-lg font-medium text-gray-900 dark:text-white mb-2'>
                      {t('knowledge.documents.empty')}
                    </h4>
                    <p className='text-sm text-gray-500 dark:text-gray-400 text-center max-w-sm mb-4'>
                      {t('knowledge.documents.emptyDescription')}
                    </p>
                  </div>
                ) : (
                  <div className='divide-y divide-gray-100 dark:divide-gray-700'>
                    {documents.map(doc => (
                      <div key={doc.id} className='p-5 hover:bg-gray-50 dark:hover:bg-gray-700/50'>
                        <div className='flex items-center justify-between'>
                          <div className='flex items-center gap-3 flex-1 min-w-0'>
                            <div className='text-2xl flex-shrink-0'>{doc.typeIcon}</div>
                            <div className='min-w-0 flex-1'>
                              <div className='flex items-center gap-2 mb-1'>
                                <h4 className='dark:text-white truncate'>{doc.name}</h4>
                                <Badge variant='secondary' className={`${doc.typeColor} text-xs flex-shrink-0`}>
                                  {doc.type}
                                </Badge>
                                <Badge variant='secondary' className={`${doc.statusColor} text-xs flex-shrink-0`}>
                                  {doc.status}
                                </Badge>
                              </div>
                              <div className='flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400'>
                                <span>{doc.size}</span>
                                <span>{doc.uploadTime}</span>
                              </div>
                            </div>
                          </div>

                          <div className='flex items-center gap-2 flex-shrink-0'>
                            <Switch
                              checked={doc.enabled}
                              onCheckedChange={() => handleToggleDocument(doc.id)}
                              disabled={doc.statusEnum === KnowledgeBaseDocStatusEnum.PROCESSING}
                              className='data-[state=checked]:bg-blue-500'
                            />
                            <div className='flex items-center gap-2'>
                              <button
                                onClick={() => handleReparse(doc)}
                                className='p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded'
                                title={t('knowledge.documents.actions.reparse')}
                              >
                                <RefreshCw className='w-4 h-4 text-green-500' />
                              </button>
                              <button
                                onClick={() => handleDownloadDocument(doc)}
                                className='p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded'
                                title={t('knowledge.documents.actions.download')}
                              >
                                <Download className='w-4 h-4 text-blue-500' />
                              </button>
                              <button
                                onClick={() => handleDeleteDocument(doc)}
                                className='p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded'
                                title={t('knowledge.documents.actions.delete')}
                              >
                                <Trash2 className='w-4 h-4 text-red-500' />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Document Pagination */}
                {totalDocuments > documentsPerPage && (
                  <div className='p-4 border-t border-gray-200 dark:border-gray-700'>
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            onClick={() => setDocumentPage(prev => Math.max(1, prev - 1))}
                            className={documentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                          />
                        </PaginationItem>
                        {Array.from(
                          {
                            length: Math.ceil(totalDocuments / documentsPerPage),
                          },
                          (_, i) => i + 1
                        ).map(page => (
                          <PaginationItem key={page}>
                            <PaginationLink
                              onClick={() => setDocumentPage(page)}
                              isActive={documentPage === page}
                              className='cursor-pointer'
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        ))}
                        <PaginationItem>
                          <PaginationNext
                            onClick={() =>
                              setDocumentPage(prev => Math.min(Math.ceil(totalDocuments / documentsPerPage), prev + 1))
                            }
                            className={
                              documentPage === Math.ceil(totalDocuments / documentsPerPage)
                                ? 'pointer-events-none opacity-50'
                                : 'cursor-pointer'
                            }
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}
              </Card>
            </div>
          </div>
        </div>
      )}

      {/* View Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className='max-w-2xl dark:bg-gray-800 dark:border-gray-700'>
          <DialogHeader>
            <DialogTitle className='dark:text-white'>{t('knowledge.viewDialog.title')}</DialogTitle>
            <DialogDescription className='dark:text-gray-400'>
              {t('knowledge.viewDialog.description')}
            </DialogDescription>
          </DialogHeader>
          {viewingKB && (
            <div className='space-y-4'>
              <div className='flex items-center gap-3 pb-4 border-b border-gray-200 dark:border-gray-700'>
                <div className={`${viewingKB.iconBg} w-16 h-16 rounded-lg flex items-center justify-center text-3xl`}>
                  {viewingKB.icon}
                </div>
                <div className='flex-1'>
                  <h3 className='text-xl dark:text-white'>{viewingKB.name}</h3>
                  <Badge variant='secondary' className={`${viewingKB.statusColor} text-xs mt-1`}>
                    {viewingKB.status}
                  </Badge>
                </div>
              </div>

              <div className='space-y-3'>
                <div>
                  <label className='text-sm text-gray-600 dark:text-gray-400'>
                    {t('knowledge.viewDialog.descriptionLabel')}
                  </label>
                  <p className='text-sm dark:text-white mt-1'>{viewingKB.description}</p>
                </div>

                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <label className='text-sm text-gray-600 dark:text-gray-400'>
                      {t('knowledge.viewDialog.documentsLabel')}
                    </label>
                    <p className='text-sm dark:text-white mt-1'>
                      {t('knowledge.viewDialog.documentsValue', { count: viewingKB.documentCount })}
                    </p>
                  </div>
                  <div>
                    <label className='text-sm text-gray-600 dark:text-gray-400'>
                      {t('knowledge.viewDialog.sizeLabel')}
                    </label>
                    <p className='text-sm dark:text-white mt-1'>{viewingKB.size}</p>
                  </div>
                </div>

                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <label className='text-sm text-gray-600 dark:text-gray-400'>
                      {t('knowledge.viewDialog.visibilityLabel')}
                    </label>
                    <p className='text-sm dark:text-white mt-1'>{getVisibilityLabel(viewingKB.visibility)}</p>
                  </div>
                  <div>
                    <label className='text-sm text-gray-600 dark:text-gray-400'>
                      {t('knowledge.viewDialog.creatorLabel')}
                    </label>
                    <p className='text-sm dark:text-white mt-1'>{viewingKB.creator}</p>
                  </div>
                </div>

                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <label className='text-sm text-gray-600 dark:text-gray-400'>
                      {t('knowledge.viewDialog.createdLabel')}
                    </label>
                    <p className='text-sm dark:text-white mt-1'>{viewingKB.createdDate}</p>
                  </div>
                  <div>
                    <label className='text-sm text-gray-600 dark:text-gray-400'>
                      {t('knowledge.viewDialog.updatedLabel')}
                    </label>
                    <p className='text-sm dark:text-white mt-1'>{viewingKB.modifiedDate}</p>
                  </div>
                </div>

                {viewingKB.tags && viewingKB.tags.length > 0 && (
                  <div>
                    <label className='text-sm text-gray-600 dark:text-gray-400'>
                      {t('knowledge.viewDialog.tagsLabel')}
                    </label>
                    <div className='flex flex-wrap gap-2 mt-2'>
                      {viewingKB.tags.map((tag, index) => (
                        <Badge key={index} variant='secondary' className={`${getTagColor(tag)} text-xs`}>
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <EditKnowledgeBaseDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        knowledgeBase={editingKnowledgeBase}
        onSuccess={() => {
          loadKnowledgeBases();
          if (editingKnowledgeBase) {
            // 更新当前选中的知识库信息
            const updatedKnowledgeBase = knowledgeBases.find(kb => kb.id === editingKnowledgeBase.id);
            if (updatedKnowledgeBase && selectedKnowledgeBase === editingKnowledgeBase.id) {
              loadDocuments(editingKnowledgeBase.id);
            }
          }
        }}
      />

      {/* Create Dialog */}
      <CreateKnowledgeBaseDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSuccess={() => {
          loadKnowledgeBases();
        }}
      />

      {/* Delete Knowledge Base Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className='dark:bg-gray-900 dark:border-gray-700'>
          <AlertDialogHeader>
            <AlertDialogTitle className='dark:text-white'>{t('knowledge.deleteKnowledgeBase.title')}</AlertDialogTitle>
            <AlertDialogDescription className='dark:text-gray-400'>
              {t('knowledge.deleteKnowledgeBase.description', { name: deletingKnowledgeBase?.name || '' })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className='dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300'>
              {t('common.actions.cancel')}
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteKnowledgeBase} className='bg-red-600 hover:bg-red-700 text-white'>
              {t('common.actions.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Document Confirmation Dialog */}
      <AlertDialog open={deleteDocumentDialogOpen} onOpenChange={setDeleteDocumentDialogOpen}>
        <AlertDialogContent className='dark:bg-gray-900 dark:border-gray-700'>
          <AlertDialogHeader>
            <AlertDialogTitle className='dark:text-white'>{t('knowledge.deleteDocument.title')}</AlertDialogTitle>
            <AlertDialogDescription className='dark:text-gray-400'>
              {t('knowledge.deleteDocument.description', { name: deletingDocument?.name || '' })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className='dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300'>
              {t('common.actions.cancel')}
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteDocument} className='bg-red-600 hover:bg-red-700 text-white'>
              {t('common.actions.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
