import { Check, Database, Download, Edit, Eye, Files, FileText, Filter, FolderOpen, Grid3x3, List, MoreHorizontal, Plus, RefreshCw, Search, Trash2, Upload, X, } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, } from '@/components/ui/pagination';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, } from '@/components/ui/alert-dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';
import { formatDateOnly, formatFileSize, getTagColor } from '@/utils';
import { downloadFile } from '@/utils/DownloadUtils';
import { clearAllUploadIntervals, clearUploadInterval, createDragHandlers, type FileValidationConfig, processFiles, type UploadConfig, UploadFile, uploadFileWithProgress, } from '@/utils/UploadUtils';
import { CreateDatasetDialog } from './CreateDatasetDialog';
import { EditDatasetDialog } from './EditDatasetDialog';
import { EditDataSourceDialog } from './EditDataSourceDialog';
import { useDebounce } from '@/hooks/useDebounce';
import Datasets from '@/services/Datasets';
import DatasetsData from '@/services/DatasetsData';
import { DatasetDetailVo, DatasetListVo, DatasetStatisticsVo, DatasourceTableDataPreviewVo, GetDatasetListOrderByEnum, } from '@/services/DatasetsTypes';
import { DatasetDataListVo } from '@/services/DatasetsDataTypes';
import { DatasetDataTypeEnum, DatasetTypeEnum, VisibilityEnum } from '@/enums/enums';
import { useLanguage } from '@/components/ui/LanguageProvider';

interface DatasetItem {
  id: string;
  name: string;
  description: string;
  icon: string;
  iconBg: string;
  type: DatasetTypeEnum;
  typeLabelKey: string;
  dataCount: string;
  size: string;
  statusKey: string;
  statusColor: string;
  enabled: boolean;
  visibility?: string;
  modifiedDate: string;
  createdDate: string;
  creator: string;
  tags?: string[];
}

interface StatCard {
  label: string;
  value: string;
  subtext: string;
  icon: typeof Database;
  iconBg: string;
  trend?: string;
  trendUp?: boolean;
  progress?: number;
  showProgress?: boolean;
}

export function Dataset() {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');
  const [sortBy, setSort] = useState<GetDatasetListOrderByEnum>(GetDatasetListOrderByEnum.ModifiedDate);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedDataset, setSelectedDataset] = useState<string | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [viewingDataset, setViewingDataset] = useState<DatasetItem | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingDataset, setEditingDataset] = useState<DatasetItem | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingDataset, setDeletingDataset] = useState<DatasetItem | null>(null);
  const [deleteFileDialogOpen, setDeleteFileDialogOpen] = useState(false);
  const [deletingFile, setDeletingFile] = useState<DataFileItem | null>(null);
  const [addDataSourceOpen, setAddDataSourceOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoadingDataList, setIsLoadingDataList] = useState(false);
  const [isLoadingTablePreview, setIsLoadingTablePreview] = useState(false);
  const [datasetDetail, setDatasetDetail] = useState<DatasetDetailVo | null>(null);
  const [dataFiles, setDataFiles] = useState<DatasetDataListVo[]>([]);
  const [databaseTables, setDatabaseTables] = useState<DatasetDataListVo[]>([]);
  const [tablePreviewData, setTablePreviewData] = useState<DatasourceTableDataPreviewVo | null>(null);
  const visibilityBadgeMap = useMemo(
    () => ({
      private: { icon: '🔒', label: t('dataset.visibility.private') },
      team: { icon: '👥', label: t('dataset.visibility.team') },
      public: { icon: '🌐', label: t('dataset.visibility.public') },
    }),
    [t]
  );

  // 文件上传相关状态
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);
  const uploadIntervalsRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

  // 清理所有上传任务的定时器
  useEffect(() => {
    return () => {
      clearAllUploadIntervals(uploadIntervalsRef);
    };
  }, []);

  /**
   * 数据集状态颜色
   */
  const DATASET_STATUS_COLORS = {
    enabled: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    disabled: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400',
  } as const;

  // 数据集列表
  const [datasets, setDatasets] = useState<DatasetItem[]>([]);

  // 文件上传列表 - 用于文件类型的数据集
  interface DataFileItem {
    id: string;
    name: string;
    type: DatasetDataTypeEnum;
    typeLabelKey: string;
    typeColor: string;
    typeIcon: string;
    size: string;
    statusKey: string;
    statusColor: string;
    modifiedDate: string;
    recordCount: string;
    filePath?: string; // 文件存储URL路径
  }

  // 将DatasetDataListVo转换为DataFileItem（先定义转换函数）
  const convertDataListVoToFile = useCallback((vo: DatasetDataListVo): DataFileItem => {
    const typeLabelKeyMap: Record<DatasetDataTypeEnum, string> = {
      [DatasetDataTypeEnum.CSV]: t('dataset.dataTypes.csv'),
      [DatasetDataTypeEnum.JSON]: t('dataset.dataTypes.json'),
      [DatasetDataTypeEnum.EXCEL]: t('dataset.dataTypes.excel'),
      [DatasetDataTypeEnum.XML]: t('dataset.dataTypes.xml'),
      [DatasetDataTypeEnum.TABLE]: t('dataset.dataTypes.table'),
    };

    const stringToEnumMap: Record<string, DatasetDataTypeEnum> = {
      CSV: DatasetDataTypeEnum.CSV,
      JSON: DatasetDataTypeEnum.JSON,
      EXCEL: DatasetDataTypeEnum.EXCEL,
      XML: DatasetDataTypeEnum.XML,
      TABLE: DatasetDataTypeEnum.TABLE,
    };

    const statusKeyMap: Record<string, string> = {
      COMPLETED: t('common.status.completed'),
      PROCESSING: t('common.status.processing'),
      PENDING: t('common.status.pending'),
    };

    const typeIconMap: Record<DatasetDataTypeEnum, string> = {
      [DatasetDataTypeEnum.CSV]: '📊',
      [DatasetDataTypeEnum.JSON]: '📝',
      [DatasetDataTypeEnum.EXCEL]: '📈',
      [DatasetDataTypeEnum.XML]: '📄',
      [DatasetDataTypeEnum.TABLE]: '📋',
    };

    const typeEnum = stringToEnumMap[vo.type || 'CSV'] || DatasetDataTypeEnum.CSV;
    const statusRaw = (vo.status || 'PENDING').toUpperCase();
    const statusKey = statusKeyMap[statusRaw] || 'common.status.pending';

    return {
      id: vo.id ? String(vo.id) : '',
      name: vo.name || '',
      type: typeEnum,
      typeLabelKey: typeLabelKeyMap[typeEnum],
      typeColor:
        typeEnum === DatasetDataTypeEnum.CSV
          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
          : typeEnum === DatasetDataTypeEnum.JSON
            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
            : typeEnum === DatasetDataTypeEnum.EXCEL
              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
              : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
      typeIcon: typeIconMap[typeEnum] || '📄',
      size: vo.dataSize || '0 MB',
      statusKey,
      statusColor:
        statusRaw === 'COMPLETED'
          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
          : statusRaw === 'PROCESSING'
            ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
            : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400',
      modifiedDate: vo.createdDate || '',
      recordCount: vo.dataCount ? vo.dataCount.toLocaleString() : '0',
      filePath: vo.filePath,
    };
  }, []);

  // 文件上传列表 - 使用接口数据，转换为DataFileItem格式
  const convertedDataFiles: DataFileItem[] = dataFiles.map(convertDataListVoToFile);

  // 数据库表列表 - 模拟数据
  interface DatabaseTable {
    id: string;
    tableName: string;
    rowCount: string;
    size: string;
    modifiedDate: string;
    description?: string;
  }

  const [selectedTable, setSelectedTable] = useState<DatabaseTable | null>(null);
  const [tableCurrentPage, setTableCurrentPage] = useState(1);
  const tablePageSize = 10;

  // 将DatasetDataListVo转换为DatabaseTable
  const convertDataListVoToTable = useCallback((vo: DatasetDataListVo): DatabaseTable => {
    return {
      id: vo.id ? String(vo.id) : '',
      tableName: vo.name || '',
      rowCount: vo.dataCount ? vo.dataCount.toLocaleString() : '0',
      size: vo.dataSize || '0 MB',
      modifiedDate: vo.modifiedDate || '',
      description: vo.name || '',
    };
  }, []);

  // 使用接口返回的预览数据
  const tableColumns = tablePreviewData?.columns || [];
  const totalTableRecords = tablePreviewData?.total || 0;
  const totalTablePages = Math.ceil(totalTableRecords / tablePageSize);
  const paginatedTableRecords = tablePreviewData?.data || [];

  // 统计数据
  const [stats, setStats] = useState<StatCard[]>(() => [
    {
      label: t('dataset.page.stats.totalDatasets.label'),
      value: '--',
      subtext: t('dataset.page.stats.totalDatasets.placeholder'),
      icon: Database,
      iconBg: 'bg-blue-500',
    },
    {
      label: t('dataset.page.stats.totalData.label'),
      value: '--',
      subtext: t('dataset.page.stats.totalData.placeholder'),
      icon: FileText,
      iconBg: 'bg-green-500',
    },
    {
      label: t('dataset.page.stats.todayQueries.label'),
      value: '--',
      subtext: t('dataset.page.stats.todayQueries.placeholder'),
      icon: Eye,
      iconBg: 'bg-orange-500',
    },
    {
      label: t('dataset.page.stats.storage.label'),
      value: '-- / --',
      subtext: t('dataset.page.stats.storage.placeholder'),
      icon: Database,
      iconBg: 'bg-purple-500',
      progress: 0,
      showProgress: false,
    },
  ]);

  // 将DatasetListVo转换为DatasetItem
  const convertDatasetVoToItem = useCallback((vo: DatasetListVo): DatasetItem => {
    const visibilityMap: Record<VisibilityEnum, string> = {
      [VisibilityEnum.PRIVATE]: 'private',
      [VisibilityEnum.TEAM]: 'team',
      [VisibilityEnum.PUBLIC]: 'public',
    };

    const type = vo.type || DatasetTypeEnum.FILE;
    const typeLabelKey = type === DatasetTypeEnum.FILE ? t('dataset.types.file') : t('dataset.types.datasource');

    const dataCount = vo.dataStatistics?.totalFilesOrTables ? String(vo.dataStatistics.totalFilesOrTables) : '0';
    const size = vo.dataStatistics?.totalRecordsSize || '0 条';
    const createdDate = vo.createdDate || '';
    const modifiedDate = vo.modifiedDate || '';
    const creator = vo.creator ? vo.creator : '';

    return {
      id: vo.id ? vo.id : '',
      name: vo.name || '',
      description: vo.description || '',
      icon: vo.icon || '📊',
      iconBg: vo.iconBg || 'bg-blue-50 dark:bg-blue-900/20',
      type,
      typeLabelKey,
      dataCount,
      size,
      statusKey: vo.enabled ? 'common.status.enabled' : 'common.status.disabled',
      statusColor: vo.enabled ? DATASET_STATUS_COLORS.enabled : DATASET_STATUS_COLORS.disabled,
      enabled: vo.enabled || false,
      visibility: vo.visibility ? visibilityMap[vo.visibility] : 'private',
      modifiedDate,
      createdDate,
      creator,
      tags: vo.tags || [],
    };
  }, []);

  // 加载数据集列表
  const loadDatasets = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await Datasets.getDatasetList({
        keyword: debouncedSearchQuery.trim() || undefined,
        pageNo: currentPage,
        pageSize: itemsPerPage,
        orderBy: sortBy,
      });

      // 处理响应结构
      const responseData = (response as any).data;
      let listData: DatasetListVo[] | undefined;
      if (responseData) {
        listData = responseData.list;
      }

      if (Array.isArray(listData)) {
        const mappedList = listData.map(convertDatasetVoToItem);
        setDatasets(mappedList);
        setTotalCount(responseData?.total || 0);
        setTotalPages(Math.ceil((responseData?.total || 0) / itemsPerPage));
      } else {
        setDatasets([]);
        setTotalCount(0);
        setTotalPages(1);
      }
    } catch (error: any) {
      console.error('Failed to load dataset list:', error);
      toast.error(error?.message || t('dataset.toasts.loadListFailed'));
      setDatasets([]);
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearchQuery, currentPage, itemsPerPage, sortBy, convertDatasetVoToItem]);

  // 加载统计数据
  const loadStatistics = useCallback(async () => {
    try {
      const response = await Datasets.getDatasetStatistics();
      const responseData = (response as any).data;
      const statsData: DatasetStatisticsVo | undefined = responseData;

      if (statsData?.overview) {
        const overview = statsData.overview;
        const totalDatasets = overview.totalDatasets || 0;
        const activeDatasets = overview.activeDatasets || 0;
        const totalFilesOrTables = overview.totalFilesOrTables || 0;
        const activeFilesOrTables = overview.activeFilesOrTables || 0;
        const totalRecords = overview.totalRecords || 0;
        const totalQueryCount = overview.totalQueryCount || 0;
        const todayQueryCount = overview.todayQueryCount || 0;
        const usedStoreSize = overview.usedStoreSize || '0 MB';
        const totalStoreSize = overview.totalStoreSize;
        const usedStoreRate = overview.usedStoreRate;

        setStats([
          {
            label: t('dataset.page.stats.totalDatasets.label'),
            value: String(totalDatasets),
            subtext: t('dataset.page.stats.totalDatasets.subtext', { count: activeDatasets }),
            icon: Database,
            iconBg: 'bg-blue-500',
            trend: undefined,
            trendUp: undefined,
          },
          {
            label: t('dataset.page.stats.totalData.label'),
            value:
              totalRecords >= 1000
                ? totalRecords >= 1000000
                  ? `${(totalRecords / 1000000).toFixed(1)}M`
                  : `${(totalRecords / 1000).toFixed(1)}K`
                : String(totalRecords),
            subtext: t('dataset.page.stats.totalData.subtext', {
              total: totalFilesOrTables,
              active: activeFilesOrTables,
              size: usedStoreSize,
            }),
            icon: FileText,
            iconBg: 'bg-green-500',
            trend: undefined,
            trendUp: undefined,
          },
          {
            label: t('dataset.page.stats.todayQueries.label'),
            value: String(todayQueryCount),
            subtext: t('dataset.page.stats.todayQueries.subtext', { total: totalQueryCount }),
            icon: Eye,
            iconBg: 'bg-orange-500',
            trend: undefined,
            trendUp: undefined,
          },
          {
            label: t('dataset.page.stats.storage.label'),
            value: totalStoreSize ? `${usedStoreSize} / ${totalStoreSize}` : `${usedStoreSize} / --`,
            subtext: totalStoreSize
              ? t('dataset.page.stats.storage.subtext', { rate: usedStoreRate || '0%' })
              : t('dataset.page.stats.storage.unlimited'),
            icon: Database,
            iconBg: 'bg-purple-500',
            progress: usedStoreRate ? parseFloat(usedStoreRate.replace('%', '')) || 0 : 0,
            showProgress: !!totalStoreSize,
            trend: undefined,
            trendUp: undefined,
          },
        ]);
      }
    } catch (error: any) {
      console.error('Failed to load dataset statistics:', error);
      // 不显示错误提示，使用默认值
    }
  }, []);

  // 初始化加载数据
  useEffect(() => {
    loadStatistics();
  }, [loadStatistics]);

  useEffect(() => {
    loadDatasets();
  }, [loadDatasets]);

  // 当搜索关键词变化时重置到第一页
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchQuery]);

  const handleView = async (dataset: DatasetItem) => {
    setViewingDataset(dataset);
    setViewDialogOpen(true);

    try {
      const response = await Datasets.getDatasetDetail(dataset.id);
      const detail: DatasetDetailVo | undefined = (response as any).data;

      if (detail) {
        setDatasetDetail(detail);
        // 更新viewingDataset的详细信息
        setViewingDataset({
          ...dataset,
          dataCount: detail.dataStatistics?.totalFilesOrTables
            ? String(detail.dataStatistics.totalFilesOrTables)
            : dataset.dataCount,
          size: detail.dataStatistics?.totalRecordsSize || dataset.size,
        });
      }
    } catch (error: any) {
      console.error('Failed to load dataset detail:', error);
      toast.error(error?.message || t('dataset.toasts.loadDetailFailed'));
    }
  };

  const handleEdit = (dataset: DatasetItem) => {
    setEditingDataset(dataset);
    setEditDialogOpen(true);
  };

  const handleDelete = (dataset: DatasetItem) => {
    setDeletingDataset(dataset);
    setDeleteDialogOpen(true);
  };

  const handleToggleDatasetStatus = async (id: string) => {
    const dataset = datasets.find(ds => ds.id === id);
    if (!dataset) return;

    const newEnabled = !dataset.enabled;
    try {
      await Datasets.toggleDatasetStatus(id, { enabled: newEnabled });

      // 更新本地状态
      setDatasets(prev =>
        prev.map(ds => {
          if (ds.id === id) {
            return {
              ...ds,
              enabled: newEnabled,
              statusKey: newEnabled ? 'common.status.enabled' : 'common.status.disabled',
              statusColor: newEnabled ? DATASET_STATUS_COLORS.enabled : DATASET_STATUS_COLORS.disabled,
            };
          }
          return ds;
        })
      );
      toast.success(newEnabled ? t('dataset.toasts.enableSuccess') : t('dataset.toasts.disableSuccess'));
    } catch (error: any) {
      console.error('Failed to toggle dataset status:', error);
      toast.error(error?.message || t('dataset.toasts.toggleFailed'));
    }
  };

  const confirmDelete = async () => {
    if (deletingDataset) {
      try {
        await Datasets.deleteDataset(deletingDataset.id);
        toast.success(t('dataset.toasts.deleteSuccess', { name: deletingDataset.name }));
        setDeleteDialogOpen(false);
        setDeletingDataset(null);
        // 重新加载列表
        loadDatasets();
      } catch (error: any) {
        console.error('Failed to delete dataset:', error);
        toast.error(error?.message || t('dataset.toasts.deleteFailed'));
      }
    }
  };

  // 使用接口返回的数据，不需要客户端过滤
  const currentDatasets = datasets;
  const shouldShowPagination = totalCount > itemsPerPage;

  // 获取选中的数据集
  const selectedDS = datasets.find(ds => ds.id === selectedDataset);

  // 加载数据集数据列表（文件类型）
  const loadDatasetDataList = useCallback(async (datasetId: string) => {
    setIsLoadingDataList(true);
    try {
      const response = await DatasetsData.getDatasetDataList(datasetId, {
        pageNo: 1,
        pageSize: 100, // 加载所有数据
      });

      const responseData = (response as any).data;
      let listData: DatasetDataListVo[] | undefined;
      if (responseData) {
        listData = responseData.list;
      }

      if (Array.isArray(listData)) {
        setDataFiles(listData);
      } else {
        setDataFiles([]);
      }
    } catch (error: any) {
      console.error('Failed to load dataset data list:', error);
      toast.error(error?.message || t('dataset.toasts.loadDataListFailed'));
      setDataFiles([]);
    } finally {
      setIsLoadingDataList(false);
    }
  }, []);

  // 加载数据源表列表（数据源类型）
  const loadDataSourceTables = useCallback(async (datasetId: string) => {
    setIsLoadingDataList(true);
    try {
      const response = await DatasetsData.getDatasetDataList(datasetId, {
        pageNo: 1,
        pageSize: 100,
      });

      const responseData = (response as any).data;
      let listData: DatasetDataListVo[] | undefined;
      if (responseData) {
        listData = responseData.list;
      }

      if (Array.isArray(listData)) {
        setDatabaseTables(listData);
      } else {
        setDatabaseTables([]);
      }
    } catch (error: any) {
      console.error('Failed to load datasource tables:', error);
      toast.error(error?.message || t('dataset.toasts.loadDatasourceTablesFailed'));
      setDatabaseTables([]);
    } finally {
      setIsLoadingDataList(false);
    }
  }, []);

  // 预览数据源表数据
  const loadTablePreview = useCallback(
    async (datasetId: string, tableName: string) => {
      setIsLoadingTablePreview(true);
      try {
        const response = await Datasets.previewDatasourceData(datasetId, {
          tableName,
          pageNo: tableCurrentPage,
          pageSize: tablePageSize,
        });

        const previewData: DatasourceTableDataPreviewVo | undefined = (response as any).data;

        if (previewData) {
          setTablePreviewData(previewData);
        } else {
          setTablePreviewData(null);
        }
      } catch (error: any) {
        console.error('Failed to load table preview:', error);
        toast.error(error?.message || t('dataset.toasts.loadTablePreviewFailed'));
        setTablePreviewData(null);
      } finally {
        setIsLoadingTablePreview(false);
      }
    },
    [tableCurrentPage, tablePageSize]
  );

  // 当选中数据集变化时，加载对应的数据和详情
  useEffect(() => {
    if (selectedDS) {
      // 加载数据集详情
      Datasets.getDatasetDetail(selectedDS.id)
        .then((response: any) => {
          const detail: DatasetDetailVo | undefined = response.data;
          if (detail) {
            setDatasetDetail(detail);
          }
        })
        .catch((error: any) => {
          console.error('Failed to load dataset detail:', error);
        });

      if (selectedDS.type === DatasetTypeEnum.FILE) {
        loadDatasetDataList(selectedDS.id);
      } else if (selectedDS.type === DatasetTypeEnum.DATASOURCE) {
        loadDataSourceTables(selectedDS.id);
      }
    } else {
      setDatasetDetail(null);
      setDataFiles([]);
      setDatabaseTables([]);
      setTablePreviewData(null);
      setSelectedTable(null);
    }
  }, [selectedDS, loadDatasetDataList, loadDataSourceTables]);

  // 当选中表变化时，加载预览数据
  useEffect(() => {
    if (selectedDS && selectedDS.type === DatasetTypeEnum.DATASOURCE && selectedTable) {
      loadTablePreview(selectedDS.id, selectedTable.tableName);
    }
  }, [selectedDS, selectedTable, loadTablePreview]);

  // 当切换数据集时，清空上传文件列表
  useEffect(() => {
    if (!selectedDS || selectedDS.type !== DatasetTypeEnum.FILE) {
      // 清理所有上传定时器
      clearAllUploadIntervals(uploadIntervalsRef);
      setUploadFiles([]);
    }
  }, [selectedDS]);

  // 文件验证配置
  const MAX_FILE_SIZE_MB = 50;
  const SUPPORTED_FORMATS_LABEL = 'CSV, JSON, XML, Excel';

  const fileValidationConfig: FileValidationConfig = {
    maxSize: MAX_FILE_SIZE_MB * 1024 * 1024, // 50MB
    allowedTypes: [
      'text/csv',
      'application/json',
      'application/xml',
      'text/xml',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
    ],
    allowedExtensions: ['.csv', '.json', '.xml', '.xlsx', '.xls'],
    errorMessages: {
      sizeExceeded: t('dataset.upload.errors.sizeExceeded', { maxSize: `${MAX_FILE_SIZE_MB}MB` }),
      formatNotSupported: t('dataset.upload.errors.formatNotSupported', {
        formats: SUPPORTED_FORMATS_LABEL,
      }),
    },
  };

  // 处理文件选择
  const handleFiles = (files: FileList | File[], isFolderUpload: boolean = false) => {
    // 文件夹上传时使用静默模式，避免显示大量错误提示
    const result = processFiles(files, fileValidationConfig, undefined, isFolderUpload);

    if (result.validFiles.length > 0) {
      setUploadFiles(prev => [...prev, ...result.validFiles]);

      const filteredPreview = result.filteredFiles.slice(0, 3).join(', ');
      const filteredDescription =
        result.filteredCount > 0
          ? t('dataset.upload.folderFilteredDescription', {
              preview: filteredPreview,
              total: result.filteredFiles.length,
            })
          : undefined;

      if (isFolderUpload) {
        if (result.filteredCount > 0) {
          toast.success(
            t('dataset.upload.folderSuccessDetailed', {
              added: result.validFiles.length,
              filtered: result.filteredCount,
            }),
            filteredDescription ? { description: filteredDescription } : undefined
          );
        } else {
          toast.success(t('dataset.upload.folderSuccess', { added: result.validFiles.length }));
        }
      } else {
        toast.success(t('dataset.upload.fileSuccess', { count: result.validFiles.length }));
      }

      result.validFiles.forEach(uploadFile => {
        handleUpload(uploadFile);
      });
    } else if (isFolderUpload && result.filteredCount > 0) {
      toast.warning(t('dataset.upload.noSupportedFiles'), {
        description: t('dataset.upload.noSupportedFilesDescription', {
          count: result.filteredCount,
        }),
      });
    }
  };

  // 更新文件状态的辅助函数
  const updateFile = (fileId: string, updates: Partial<UploadFile>) => {
    setUploadFiles(prev => prev.map(f => (f.id === fileId ? { ...f, ...updates } : f)));
  };

  // 上传文件
  const handleUpload = async (uploadFile: UploadFile) => {
    const uploadConfig: UploadConfig = {
      uploadApi: async (id: string, file: File, params?: any) => {
        return DatasetsData.uploadDatasetFile(id, { file }, params);
      },
      resourceId: selectedDS?.id || null,
      resourceName: t('dataset.upload.resourceName'),
      onSuccess: () => {
        // 重新加载文件列表
        setTimeout(() => {
          if (selectedDS) {
            loadDatasetDataList(selectedDS.id);
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
      const isFolderUpload = e.target.hasAttribute('webkitdirectory') || e.target.hasAttribute('directory');
      handleFiles(e.target.files, isFolderUpload);
    }
    // 重置input，允许重复选择同一文件
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
    toast.info(t('dataset.upload.fileRemoved'));
  };

  const clearAllFiles = () => {
    // 清理所有上传定时器
    clearAllUploadIntervals(uploadIntervalsRef);

    setUploadFiles([]);
    toast.info(t('dataset.upload.filesCleared'));
  };

  // 同步单个文件
  const handleSyncFile = async (file: DataFileItem) => {
    if (!selectedDS) {
      toast.error(t('dataset.toasts.selectDatasetFirst'));
      return;
    }

    try {
      await DatasetsData.syncDatasetData(selectedDS.id, { dataIds: [file.id] });
      toast.success(t('dataset.toasts.syncFileStarted', { name: file.name }));
      // 重新加载文件列表
      setTimeout(() => {
        loadDatasetDataList(selectedDS.id);
      }, 1000);
    } catch (error: any) {
      console.error('Failed to sync file:', error);
      toast.error(error?.data?.message || error?.message || t('dataset.toasts.syncFileFailed'));
    }
  };

  // 处理删除文件
  const handleDeleteFile = (file: DataFileItem) => {
    setDeletingFile(file);
    setDeleteFileDialogOpen(true);
  };

  // 确认删除文件
  const confirmDeleteFile = async () => {
    if (deletingFile && selectedDS) {
      try {
        await DatasetsData.batchDeleteData(selectedDS.id, { dataIds: [deletingFile.id] });
        toast.success(t('dataset.toasts.deleteFileSuccess', { name: deletingFile.name }));
        setDeleteFileDialogOpen(false);
        setDeletingFile(null);
        // 重新加载文件列表
        loadDatasetDataList(selectedDS.id);
      } catch (error: any) {
        console.error('Failed to delete file:', error);
        toast.error(error?.data?.message || error?.message || t('dataset.toasts.deleteFileFailed'));
      }
    }
  };

  // 下载文件
  const handleDownloadFile = async (file: DataFileItem) => {
    if (!file.filePath) {
      toast.error(t('dataset.toasts.filePathMissing'));
      return;
    }

    try {
      await downloadFile(file.filePath, {
        filename: file.name,
        showToast: true,
      });
    } catch (error: any) {
      // 错误已在 downloadFile 中处理
      console.error('Failed to download file:', error);
    }
  };

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div>
        <h1 className='text-2xl mb-1 dark:text-white'>{t('dataset.page.title')}</h1>
        <p className='text-sm text-gray-600 dark:text-gray-400'>{t('dataset.page.description')}</p>
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
                  <Progress value={stat.progress} className='h-1.5 w-[70%]' />
                  <div className='text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap'>{stat.subtext}</div>
                </div>
              ) : (
                <div className='text-xs text-gray-500 dark:text-gray-400'>{stat.subtext}</div>
              )}
            </Card>
          );
        })}
      </div>

      {/* Dataset List */}
      <div>
        {/* Action Buttons and Search - 与应用列表一致 */}
        <div className='flex items-center justify-between gap-3 mb-4'>
          {/* Search Bar - 左侧390px */}
          <div className='relative w-[390px]'>
            <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500' />
            <Input
              type='text'
              placeholder={t('dataset.page.searchInputPlaceholder')}
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value);
                setCurrentPage(1); // 重置到第一页
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
                  className='dark:text-gray-300'
                  onClick={() => setSort(GetDatasetListOrderByEnum.ModifiedDate)}
                >
                  {t('dataset.page.sort.modifiedDate')}
                </DropdownMenuItem>
                <DropdownMenuItem
                  className='dark:text-gray-300'
                  onClick={() => setSort(GetDatasetListOrderByEnum.Name)}
                >
                  {t('dataset.page.sort.name')}
                </DropdownMenuItem>
                <DropdownMenuItem
                  className='dark:text-gray-300'
                  onClick={() => setSort(GetDatasetListOrderByEnum.Type)}
                >
                  {t('dataset.page.sort.type')}
                </DropdownMenuItem>
                <DropdownMenuItem
                  className='dark:text-gray-300'
                  onClick={() => setSort(GetDatasetListOrderByEnum.CreatedDate)}
                >
                  {t('dataset.page.sort.createdDate')}
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
              {t('dataset.createNew')}
            </Button>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className='text-center py-12'>
            <div className='w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3' />
            <p className='text-gray-600 dark:text-gray-400'>{t('common.messages.loading')}</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && datasets.length === 0 && (
          <div className='text-center py-12'>
            <Database className='w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-3' />
            <p className='text-gray-600 dark:text-gray-400'>{t('dataset.page.empty.title')}</p>
            <p className='text-sm text-gray-500 dark:text-gray-500 mt-1'>
              {searchQuery ? t('dataset.page.empty.noResultsSuggestion') : t('dataset.page.empty.noData')}
            </p>
          </div>
        )}

        {/* Table View */}
        {viewMode === 'table' && !isLoading && datasets.length > 0 && (
          <Card className='dark:bg-gray-800 dark:border-gray-700'>
            <div className='overflow-x-auto'>
              <table className='w-full'>
                <thead className='bg-gray-50 dark:bg-gray-900'>
                  <tr>
                    <th className='px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400'>
                      {t('dataset.table.columns.name')}
                    </th>
                    <th className='px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400'>
                      {t('dataset.table.columns.type')}
                    </th>
                    <th className='px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400'>
                      {t('dataset.table.columns.items')}
                    </th>
                    <th className='px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400'>
                      {t('dataset.table.columns.status')}
                    </th>
                    <th className='px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400'>
                      {t('dataset.table.columns.updatedAt')}
                    </th>
                    <th className='px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400'>
                      {t('dataset.table.columns.actions')}
                    </th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-gray-200 dark:divide-gray-700'>
                  {currentDatasets.map(dataset => {
                    const visibilityKey = (dataset.visibility || 'private') as keyof typeof visibilityBadgeMap;
                    const visibilityInfo = visibilityBadgeMap[visibilityKey];

                    return (
                      <tr
                        key={dataset.id}
                        className={`hover:bg-gray-50 dark:hover:bg-gray-900 cursor-pointer ${
                          selectedDataset === dataset.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                        }`}
                        onClick={() => setSelectedDataset(dataset.id)}
                      >
                        <td className='px-6 py-4'>
                          <div className='flex items-center gap-3'>
                            <div
                              className={`${dataset.iconBg} w-10 h-10 rounded-lg flex items-center justify-center text-xl`}
                            >
                              {dataset.icon}
                            </div>
                            <div className='flex-1'>
                              <div className='flex items-center gap-2 mb-1'>
                                <span className='text-sm dark:text-white'>{dataset.name}</span>
                                <Badge variant='outline' className='text-xs dark:border-gray-600'>
                                  {`${visibilityInfo.icon} ${visibilityInfo.label}`}
                                </Badge>
                                {dataset.tags && dataset.tags.length > 0 && (
                                  <div className='flex gap-1'>
                                    {dataset.tags.slice(0, 2).map((tag, index) => (
                                      <Badge key={index} className={`text-xs px-1.5 py-0 border-0 ${getTagColor(tag)}`}>
                                        {tag}
                                      </Badge>
                                    ))}
                                    {dataset.tags.length > 2 && (
                                      <Badge
                                        variant='secondary'
                                        className='text-xs px-1.5 py-0 bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 border-0'
                                      >
                                        +{dataset.tags.length - 2}
                                      </Badge>
                                    )}
                                  </div>
                                )}
                              </div>
                              <div className='text-xs text-gray-500 dark:text-gray-400'>{dataset.description}</div>
                            </div>
                          </div>
                        </td>
                        <td className='px-6 py-4 text-sm text-gray-600 dark:text-gray-400'>{dataset.typeLabelKey}</td>
                        <td className='px-6 py-4 text-sm text-gray-600 dark:text-gray-400'>{dataset.dataCount}</td>
                        <td className='px-6 py-4'>
                          <div className='flex items-center gap-2' onClick={e => e.stopPropagation()}>
                            <Badge className={`text-xs ${dataset.statusColor} border-0`}>{t(dataset.statusKey)}</Badge>
                            <Switch
                              checked={dataset.enabled}
                              onCheckedChange={() => handleToggleDatasetStatus(dataset.id)}
                              className='data-[state=checked]:bg-blue-500'
                            />
                          </div>
                        </td>
                        <td className='px-6 py-4 text-sm text-gray-600 dark:text-gray-400'>
                          {formatDateOnly(dataset.modifiedDate)}
                        </td>
                        <td className='px-6 py-4'>
                          <div className='flex items-center gap-2' onClick={e => e.stopPropagation()}>
                            <button
                              onClick={() => handleView(dataset)}
                              className='p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded'
                            >
                              <Eye className='w-4 h-4 text-blue-500' />
                            </button>
                            <button
                              onClick={() => handleEdit(dataset)}
                              className='p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded'
                            >
                              <Edit className='w-4 h-4 text-gray-600 dark:text-gray-400' />
                            </button>
                            <button
                              onClick={() => handleDelete(dataset)}
                              className='p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded'
                            >
                              <Trash2 className='w-4 h-4 text-red-500' />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination - 只在数据超过6条时显示 */}
            {shouldShowPagination && (
              <div className='flex items-center justify-center px-6 py-4 border-t border-gray-200 dark:border-gray-700'>
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                      >
                        {t('common.pagination.previous')}
                      </PaginationPrevious>
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
                      >
                        {t('common.pagination.next')}
                      </PaginationNext>
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </Card>
        )}

        {/* Grid View */}
        {viewMode === 'grid' && !isLoading && datasets.length > 0 && (
          <>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
              {currentDatasets.map(dataset => (
                <Card
                  key={dataset.id}
                  className={`p-5 hover:shadow-md transition-all cursor-pointer gap-2 ${
                    selectedDataset === dataset.id
                      ? 'ring-2 ring-blue-500 dark:ring-blue-400 shadow-lg bg-blue-50/50 dark:bg-blue-900/10'
                      : 'dark:bg-gray-800'
                  } dark:border-gray-700`}
                  onClick={() => setSelectedDataset(dataset.id)}
                >
                  <div className='flex items-start justify-between mb-4'>
                    <div className='flex items-center gap-3'>
                      <div
                        className={`${dataset.iconBg} w-12 h-12 rounded-lg flex items-center justify-center text-2xl`}
                      >
                        {dataset.icon}
                      </div>
                      <div>
                        <div className='flex items-center gap-2'>
                          <h3 className='dark:text-white'>{dataset.name}</h3>
                          <Switch
                            checked={dataset.enabled}
                            onCheckedChange={() => {
                              handleToggleDatasetStatus(dataset.id);
                            }}
                            onClick={e => e.stopPropagation()}
                            className='data-[state=checked]:bg-blue-500'
                          />
                        </div>
                        <Badge variant='secondary' className={`${dataset.statusColor} text-xs mt-1`}>
                          {t(dataset.statusKey)}
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
                        <DropdownMenuItem onClick={() => handleView(dataset)} className='dark:text-gray-300'>
                          <Eye className='w-4 h-4 mr-2' />
                          {t('common.actions.view')}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEdit(dataset)} className='dark:text-gray-300'>
                          <Edit className='w-4 h-4 mr-2' />
                          {t('common.actions.edit')}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(dataset)}
                          className='text-red-600 dark:text-red-400'
                        >
                          <Trash2 className='w-4 h-4 mr-2' />
                          {t('common.actions.delete')}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <p className='text-sm text-gray-600 dark:text-gray-400 mb-1 line-clamp-2 flex-1'>
                    {dataset.description}
                  </p>

                  {/* 标签 */}
                  {dataset.tags && dataset.tags.length > 0 && (
                    <div className='flex flex-wrap gap-1 mb-0.5'>
                      {dataset.tags.map((tag, index) => (
                        <Badge key={index} variant='secondary' className={`${getTagColor(tag)} text-xs`}>
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}

                  <div className='grid grid-cols-2 gap-4 pt-2 border-t border-gray-100 dark:border-gray-700'>
                    <div>
                      <div className='text-xs text-gray-500 dark:text-gray-400 mb-1'>
                        {t(
                          dataset.type === DatasetTypeEnum.DATASOURCE
                            ? 'dataset.card.metrics.tables'
                            : 'dataset.card.metrics.files'
                        )}
                      </div>
                      <div className='dark:text-white'>{dataset.dataCount}</div>
                    </div>
                    <div>
                      <div className='text-xs text-gray-500 dark:text-gray-400 mb-1'>
                        {t('dataset.card.metrics.size')}
                      </div>
                      <div className='dark:text-white'>{dataset.size}</div>
                    </div>
                  </div>

                  {/* 附加信息 */}
                  <div className='mt-0.5 pt-3 border-t border-gray-100 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400'>
                    <div className='flex items-center justify-between'>
                      <span>
                        {t('dataset.card.visibility', {
                          visibility: t(`dataset.visibility.${dataset.visibility || 'private'}`),
                        })}
                      </span>
                      <span>{formatDateOnly(dataset.modifiedDate)}</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Grid View Pagination */}
            {shouldShowPagination && (
              <div className='flex items-center justify-center mt-4'>
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                      >
                        {t('common.pagination.previous')}
                      </PaginationPrevious>
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
                      >
                        {t('common.pagination.next')}
                      </PaginationNext>
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        )}
      </div>

      {/* 文件类型 - 文件上传区域 */}
      {selectedDS && selectedDS.type === DatasetTypeEnum.FILE && (
        <div className='border-t-4 border-blue-500 dark:border-blue-400 bg-gradient-to-b from-blue-50/50 to-transparent dark:from-blue-900/10 dark:to-transparent -mx-6 px-6 pt-6 pb-6 mt-6'>
          {/* Header with Dataset info */}
          <div className='flex items-center justify-between mb-6'>
            <div className='flex items-center gap-3'>
              <div className={`${selectedDS.iconBg} w-12 h-12 rounded-lg flex items-center justify-center text-2xl`}>
                {selectedDS.icon}
              </div>
              <div>
                <div className='flex items-center gap-3'>
                  <h2 className='text-xl dark:text-white'>{selectedDS.name}</h2>
                  <Badge variant='secondary' className={`${selectedDS.statusColor}`}>
                    {t(selectedDS.statusKey)}
                  </Badge>
                </div>
                <p className='text-sm text-gray-600 dark:text-gray-400 mt-1'>
                  {t('dataset.page.selected.summary', {
                    description: selectedDS.description,
                    count: selectedDS.dataCount,
                    size: selectedDS.size,
                  })}
                </p>
              </div>
            </div>
            <Button
              variant='ghost'
              size='sm'
              onClick={() => setSelectedDataset(null)}
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
                {t('dataset.upload.sectionTitle')}
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
                      {t('dataset.upload.buttons.selectFiles')}
                    </Button>
                    <Button
                      variant='outline'
                      className='dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-gray-600'
                      onClick={handleSelectFolder}
                    >
                      <FolderOpen className='w-4 h-4 mr-2' />
                      {t('dataset.upload.buttons.selectFolder')}
                    </Button>
                  </div>

                  <p className='text-sm text-gray-600 dark:text-gray-400'>
                    {isDragging ? t('dataset.upload.dropHintActive') : t('dataset.upload.dropHint')}
                  </p>
                  <p className='text-xs text-gray-500 dark:text-gray-500 mt-2'>
                    {t('dataset.upload.supportedFormatsDetail', {
                      formats: SUPPORTED_FORMATS_LABEL,
                      maxSize: `${MAX_FILE_SIZE_MB}MB`,
                    })}
                  </p>

                  {/* 隐藏的文件输入 */}
                  <input
                    ref={fileInputRef}
                    type='file'
                    multiple
                    accept='.csv,.json,.xml,.xlsx,.xls'
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
                    accept='.csv,.json,.xml,.xlsx,.xls'
                    onChange={handleFileInputChange}
                    className='hidden'
                  />
                </div>

                {/* 上传文件列表 */}
                {uploadFiles.length > 0 && (
                  <div className='mt-6'>
                    <div className='flex items-center justify-between mb-3'>
                      <h4 className='text-sm dark:text-white'>
                        {t('dataset.upload.queueTitle', { count: uploadFiles.length })}
                      </h4>
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={clearAllFiles}
                        className='text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400'
                      >
                        <X className='w-4 h-4 mr-1' />
                        {t('dataset.upload.clearList')}
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
                                <span className='text-xs'>{t('dataset.upload.status.success')}</span>
                              </div>
                            )}

                            {uploadFile.status === 'error' && (
                              <span className='text-xs text-red-600 dark:text-red-400'>
                                {uploadFile.error || t('dataset.upload.status.error')}
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
                {t('dataset.files.sectionTitle')}
              </h3>
              <Card className='dark:bg-gray-800 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm'>
                <div className='overflow-x-auto'>
                  <table className='w-full'>
                    <thead className='bg-gray-50 dark:bg-gray-900'>
                      <tr>
                        <th className='px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400'>
                          {t('dataset.files.columns.name')}
                        </th>
                        <th className='px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400'>
                          {t('dataset.files.columns.type')}
                        </th>
                        <th className='px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400'>
                          {t('dataset.files.columns.size')}
                        </th>
                        <th className='px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400'>
                          {t('dataset.files.columns.records')}
                        </th>
                        <th className='px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400'>
                          {t('dataset.files.columns.status')}
                        </th>
                        <th className='px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400'>
                          {t('dataset.files.columns.uploadedAt')}
                        </th>
                        <th className='px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400'>
                          {t('dataset.files.columns.actions')}
                        </th>
                      </tr>
                    </thead>
                    <tbody className='divide-y divide-gray-200 dark:divide-gray-700'>
                      {isLoadingDataList ? (
                        <tr>
                          <td colSpan={7} className='px-6 py-8 text-center'>
                            <div className='w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2' />
                            <p className='text-sm text-gray-600 dark:text-gray-400'>{t('common.messages.loading')}</p>
                          </td>
                        </tr>
                      ) : convertedDataFiles.length === 0 ? (
                        <tr>
                          <td colSpan={7} className='px-6 py-8 text-center text-gray-500 dark:text-gray-400'>
                            {t('dataset.files.empty')}
                          </td>
                        </tr>
                      ) : (
                        convertedDataFiles.map(file => (
                          <tr key={file.id} className='hover:bg-gray-50 dark:hover:bg-gray-900'>
                            <td className='px-6 py-4'>
                              <div className='flex items-center gap-3'>
                                <span className='text-xl'>{file.typeIcon}</span>
                                <span className='text-sm dark:text-white'>{file.name}</span>
                              </div>
                            </td>
                            <td className='px-6 py-4'>
                              <Badge className={`text-xs ${file.typeColor} border-0`}>{file.typeLabelKey}</Badge>
                            </td>
                            <td className='px-6 py-4 text-sm text-gray-600 dark:text-gray-400'>{file.size}</td>
                            <td className='px-6 py-4 text-sm text-gray-600 dark:text-gray-400'>{file.recordCount}</td>
                            <td className='px-6 py-4'>
                              <Badge className={`text-xs ${file.statusColor} border-0`}>{t(file.statusKey)}</Badge>
                            </td>
                            <td className='px-6 py-4 text-sm text-gray-600 dark:text-gray-400'>{file.modifiedDate}</td>
                            <td className='px-6 py-4'>
                              <div className='flex items-center gap-2'>
                                <button
                                  onClick={() => handleSyncFile(file)}
                                  className='p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded'
                                  title={t('dataset.files.actions.syncTooltip')}
                                >
                                  <RefreshCw className='w-4 h-4 text-green-500' />
                                </button>
                                <button
                                  onClick={() => handleDownloadFile(file)}
                                  className='p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded'
                                  title={t('dataset.files.actions.downloadTooltip')}
                                >
                                  <Download className='w-4 h-4 text-blue-500' />
                                </button>
                                <button
                                  onClick={() => handleDeleteFile(file)}
                                  className='p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded'
                                  title={t('dataset.files.actions.deleteTooltip')}
                                >
                                  <Trash2 className='w-4 h-4 text-red-500' />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          </div>
        </div>
      )}

      {/* 数据源类型 - 数据库表管理区域 */}
      {selectedDS && selectedDS.type === DatasetTypeEnum.DATASOURCE && datasetDetail && (
        <div className='border-t-2 border-gray-200 dark:border-gray-700 pt-6'>
          {/* 数据库信息头部 */}
          <div className='mb-6'>
            <div className='flex items-start justify-between mb-4'>
              <div className='flex items-center gap-4'>
                <div className='bg-blue-500 w-14 h-14 rounded-xl flex items-center justify-center text-3xl'>
                  {datasetDetail.datasourceConfig?.databaseType === 'MySQL'
                    ? '🐬'
                    : datasetDetail.datasourceConfig?.databaseType === 'PostgreSQL'
                      ? '🐘'
                      : datasetDetail.datasourceConfig?.databaseType === 'SQLServer'
                        ? '🔷'
                        : datasetDetail.datasourceConfig?.databaseType === 'Oracle'
                          ? '🔴'
                          : '🔌'}
                </div>
                <div>
                  <h2 className='text-xl dark:text-white mb-1'>
                    {datasetDetail.datasourceConfig?.name || t('dataset.datasource.header.defaultName')}
                  </h2>
                  <p className='text-sm text-gray-600 dark:text-gray-400'>
                    {datasetDetail.datasourceConfig?.jdbcUrl || t('dataset.datasource.header.noJdbcUrl')}
                  </p>
                  <div className='flex items-center gap-3 mt-2'>
                    <Badge className='text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-0'>
                      {t('dataset.datasource.status.connected')}
                    </Badge>
                    <span className='text-xs text-gray-500 dark:text-gray-400'>
                      {t('dataset.datasource.status.lastSynced', {
                        time: datasetDetail.modifiedDate || t('dataset.datasource.status.unknown'),
                      })}
                    </span>
                  </div>
                </div>
              </div>
              <div className='flex items-center gap-2'>
                <Button
                  variant='outline'
                  size='sm'
                  className='dark:bg-gray-800 dark:border-gray-700'
                  onClick={async () => {
                    if (!selectedDS) return;
                    try {
                      await DatasetsData.syncDatasetData(selectedDS.id);
                      toast.success(t('dataset.toasts.datasourceSyncStarted'));
                      // 重新加载表列表
                      loadDataSourceTables(selectedDS.id);
                    } catch (error: any) {
                      console.error('Failed to sync datasource:', error);
                      toast.error(error?.message || t('dataset.toasts.syncDatasourceFailed'));
                    }
                  }}
                >
                  <RefreshCw className='w-4 h-4 mr-2' />
                  {t('dataset.datasource.actions.sync')}
                </Button>
                <Button
                  variant='outline'
                  size='sm'
                  className='dark:bg-gray-800 dark:border-gray-700'
                  onClick={() => setAddDataSourceOpen(true)}
                >
                  <Edit className='w-4 h-4 mr-2' />
                  {t('dataset.datasource.actions.editConnection')}
                </Button>
              </div>
            </div>

            {/* 数据库统计 */}
            <div className='grid grid-cols-4 gap-4'>
              <Card className='p-4 dark:bg-gray-800 dark:border-gray-700'>
                <div className='text-sm text-gray-600 dark:text-gray-400 mb-1'>
                  {t('dataset.datasource.stats.databaseSize')}
                </div>
                <div className='text-2xl dark:text-white'>{datasetDetail.dataStatistics?.usedStoreSize || '0 MB'}</div>
              </Card>
              <Card className='p-4 dark:bg-gray-800 dark:border-gray-700'>
                <div className='text-sm text-gray-600 dark:text-gray-400 mb-1'>
                  {t('dataset.datasource.stats.tableCount')}
                </div>
                <div className='text-2xl dark:text-white'>
                  {t('dataset.datasource.stats.tableCountValue', { count: databaseTables.length })}
                </div>
              </Card>
              <Card className='p-4 dark:bg-gray-800 dark:border-gray-700'>
                <div className='text-sm text-gray-600 dark:text-gray-400 mb-1'>
                  {t('dataset.datasource.stats.totalRecords')}
                </div>
                <div className='text-2xl dark:text-white'>
                  {datasetDetail.dataStatistics?.totalRecords
                    ? datasetDetail.dataStatistics.totalRecords >= 1000000
                      ? `${(datasetDetail.dataStatistics.totalRecords / 1000000).toFixed(1)}M`
                      : datasetDetail.dataStatistics.totalRecords >= 1000
                        ? `${(datasetDetail.dataStatistics.totalRecords / 1000).toFixed(1)}K`
                        : String(datasetDetail.dataStatistics.totalRecords)
                    : '0'}
                </div>
              </Card>
              <Card className='p-4 dark:bg-gray-800 dark:border-gray-700'>
                <div className='text-sm text-gray-600 dark:text-gray-400 mb-1'>
                  {t('dataset.datasource.stats.connectionStatus')}
                </div>
                <div className='text-2xl text-green-600 dark:text-green-400'>
                  {t('dataset.datasource.stats.connectionStatusValue')}
                </div>
              </Card>
            </div>
          </div>

          {/* 左右分栏：表列表（左）+ 记录预览（右） */}
          <div className='grid grid-cols-5 gap-6'>
            {/* 左侧：表列表 */}
            <div className='col-span-2'>
              <div className='mb-4'>
                <h3 className='text-lg dark:text-white mb-1'>{t('dataset.datasource.tables.title')}</h3>
                <p className='text-sm text-gray-600 dark:text-gray-400'>{t('dataset.datasource.tables.subtitle')}</p>
              </div>

              <Card className='dark:bg-gray-800 dark:border-gray-700'>
                {isLoadingDataList ? (
                  <div className='p-8 text-center'>
                    <div className='w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2' />
                    <p className='text-sm text-gray-600 dark:text-gray-400'>{t('common.messages.loading')}</p>
                  </div>
                ) : databaseTables.length === 0 ? (
                  <div
                    className='p-8 text-center text-gray-500 dark:text-gray-400 flex items-center justify-center'
                    style={{ height: '350px' }}
                  >
                    {t('dataset.datasource.tables.empty')}
                  </div>
                ) : (
                  <div className='divide-y divide-gray-200 dark:divide-gray-700 max-h-[660px] overflow-y-auto'>
                    {databaseTables.map(vo => {
                      const table = convertDataListVoToTable(vo);
                      return (
                        <div
                          key={table.id}
                          onClick={() => {
                            setSelectedTable(table);
                            setTableCurrentPage(1);
                          }}
                          className={`p-4 cursor-pointer transition-all ${
                            selectedTable?.id === table.id
                              ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500'
                              : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                          }`}
                        >
                          <div className='flex items-center gap-3 mb-2'>
                            <Database
                              className={`w-5 h-5 ${selectedTable?.id === table.id ? 'text-blue-500' : 'text-gray-400'}`}
                            />
                            <span
                              className={`text-sm font-mono ${selectedTable?.id === table.id ? 'text-blue-600 dark:text-blue-400' : 'dark:text-white'}`}
                            >
                              {table.tableName}
                            </span>
                          </div>
                          <div className='flex items-center gap-4 text-xs text-gray-600 dark:text-gray-400 ml-8'>
                            <span>{t('dataset.datasource.tables.rowCount', { count: table.rowCount })}</span>
                            <span>{table.size}</span>
                            <span>{table.description}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </Card>
            </div>

            {/* 右侧：记录预览 */}
            <div className='col-span-3'>
              {selectedTable ? (
                <>
                  <div className='mb-4 flex items-center justify-between'>
                    <div>
                      <h3 className='text-lg dark:text-white mb-1'>
                        {t('dataset.datasource.preview.title', {
                          table: selectedTable.tableName,
                        })}
                      </h3>
                      <p className='text-sm text-gray-600 dark:text-gray-400'>
                        {t('dataset.datasource.preview.summary', {
                          total: totalTableRecords.toLocaleString(),
                          page: tableCurrentPage,
                        })}
                      </p>
                    </div>
                    <Button
                      variant='outline'
                      size='sm'
                      className='dark:bg-gray-800 dark:border-gray-700'
                      onClick={() => setSelectedTable(null)}
                    >
                      {t('dataset.datasource.preview.close')}
                    </Button>
                  </div>

                  <Card className='dark:bg-gray-800 dark:border-gray-700'>
                    {isLoadingTablePreview ? (
                      <div className='p-8 text-center'>
                        <div className='w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2' />
                        <p className='text-sm text-gray-600 dark:text-gray-400'>
                          {t('dataset.datasource.preview.loading')}
                        </p>
                      </div>
                    ) : tablePreviewData && tablePreviewData.success === false ? (
                      <div className='p-8 text-center text-red-500 dark:text-red-400'>
                        <p className='text-sm'>{tablePreviewData.message || t('dataset.datasource.preview.failed')}</p>
                        {tablePreviewData.details && (
                          <p className='text-xs mt-2 text-gray-500 dark:text-gray-400'>{tablePreviewData.details}</p>
                        )}
                      </div>
                    ) : tableColumns.length === 0 ? (
                      <div className='p-8 text-center text-gray-500 dark:text-gray-400'>
                        {t('dataset.datasource.preview.noData')}
                      </div>
                    ) : (
                      <div className='overflow-x-auto'>
                        <table className='w-full text-sm'>
                          <thead className='bg-gray-50 dark:bg-gray-900'>
                            <tr>
                              {tableColumns.map(column => (
                                <th
                                  key={column}
                                  className='px-4 py-3 text-left text-xs text-gray-600 dark:text-gray-400 font-mono'
                                >
                                  {column}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className='divide-y divide-gray-200 dark:divide-gray-700'>
                            {paginatedTableRecords.map((record, index) => (
                              <tr key={index} className='hover:bg-gray-50 dark:hover:bg-gray-900'>
                                {tableColumns.map(column => (
                                  <td key={column} className='px-4 py-3 text-xs text-gray-700 dark:text-gray-300'>
                                    {String(record[column] || '')}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {/* 表记录分页 */}
                    {totalTablePages > 1 && (
                      <div className='flex items-center justify-center px-6 py-4 border-t border-gray-200 dark:border-gray-700'>
                        <Pagination>
                          <PaginationContent>
                            <PaginationItem>
                              <PaginationPrevious
                                onClick={() => setTableCurrentPage(prev => Math.max(1, prev - 1))}
                                className={tableCurrentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                              >
                                {t('common.pagination.previous')}
                              </PaginationPrevious>
                            </PaginationItem>
                            {Array.from({ length: totalTablePages }, (_, i) => i + 1).map(page => (
                              <PaginationItem key={page}>
                                <PaginationLink
                                  onClick={() => setTableCurrentPage(page)}
                                  isActive={tableCurrentPage === page}
                                  className='cursor-pointer'
                                >
                                  {page}
                                </PaginationLink>
                              </PaginationItem>
                            ))}
                            <PaginationItem>
                              <PaginationNext
                                onClick={() => setTableCurrentPage(prev => Math.min(totalTablePages, prev + 1))}
                                className={
                                  tableCurrentPage === totalTablePages
                                    ? 'pointer-events-none opacity-50'
                                    : 'cursor-pointer'
                                }
                              >
                                {t('common.pagination.next')}
                              </PaginationNext>
                            </PaginationItem>
                          </PaginationContent>
                        </Pagination>
                      </div>
                    )}
                  </Card>
                </>
              ) : (
                <div className='flex flex-col items-center justify-center h-96 text-center'>
                  <Database className='w-16 h-16 text-gray-300 dark:text-gray-600 mb-4' />
                  <p className='text-gray-500 dark:text-gray-400 text-sm'>
                    {t('dataset.datasource.preview.placeholder')}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* View Dataset Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className='max-w-2xl dark:bg-gray-900 dark:border-gray-700'>
          <DialogHeader>
            <DialogTitle className='text-xl dark:text-white'>{t('dataset.dialogs.view.title')}</DialogTitle>
            <DialogDescription className='text-sm text-gray-500 dark:text-gray-400'>
              {t('dataset.dialogs.view.description')}
            </DialogDescription>
          </DialogHeader>

          {viewingDataset && (
            <div className='space-y-4 py-4'>
              <div className='flex items-center gap-4 pb-4 border-b border-gray-200 dark:border-gray-700'>
                <div
                  className={`${viewingDataset.iconBg} w-16 h-16 rounded-lg flex items-center justify-center text-3xl`}
                >
                  {viewingDataset.icon}
                </div>
                <div className='flex-1'>
                  <h3 className='text-lg dark:text-white mb-1'>{viewingDataset.name}</h3>
                  <p className='text-sm text-gray-600 dark:text-gray-400'>{viewingDataset.description}</p>
                </div>
                <Badge className={`text-xs ${viewingDataset.statusColor} border-0`}>
                  {t(
                    viewingDataset.statusKey ||
                      (viewingDataset.enabled ? 'common.status.enabled' : 'common.status.disabled')
                  )}
                </Badge>
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <Label className='text-sm text-gray-600 dark:text-gray-400'>
                    {t('dataset.dialogs.view.typeLabel')}
                  </Label>
                  <p className='text-sm dark:text-white mt-1'>
                    {t(viewingDataset.typeLabelKey || 'dataset.types.file')}
                  </p>
                </div>
                <div>
                  <Label className='text-sm text-gray-600 dark:text-gray-400'>
                    {t(
                      viewingDataset.type === DatasetTypeEnum.DATASOURCE
                        ? 'dataset.dialogs.view.itemsLabel.tables'
                        : 'dataset.dialogs.view.itemsLabel.files'
                    )}
                  </Label>
                  <p className='text-sm dark:text-white mt-1'>{viewingDataset.dataCount}</p>
                </div>
                <div>
                  <Label className='text-sm text-gray-600 dark:text-gray-400'>
                    {t('dataset.dialogs.view.dataVolumeLabel')}
                  </Label>
                  <p className='text-sm dark:text-white mt-1'>{viewingDataset.size}</p>
                </div>
                <div>
                  <Label className='text-sm text-gray-600 dark:text-gray-400'>
                    {t('dataset.dialogs.view.creatorLabel')}
                  </Label>
                  <p className='text-sm dark:text-white mt-1'>{viewingDataset.creator}</p>
                </div>
                <div>
                  <Label className='text-sm text-gray-600 dark:text-gray-400'>
                    {t('dataset.dialogs.view.createdAt')}
                  </Label>
                  <p className='text-sm dark:text-white mt-1'>{viewingDataset.createdDate}</p>
                </div>
                <div>
                  <Label className='text-sm text-gray-600 dark:text-gray-400'>
                    {t('dataset.dialogs.view.updatedAt')}
                  </Label>
                  <p className='text-sm dark:text-white mt-1'>{viewingDataset.modifiedDate}</p>
                </div>
              </div>

              {viewingDataset.tags && viewingDataset.tags.length > 0 && (
                <div>
                  <Label className='text-sm text-gray-600 dark:text-gray-400 mb-2 block'>
                    {t('common.labels.tags')}
                  </Label>
                  <div className='flex flex-wrap gap-2'>
                    {viewingDataset.tags.map((tag, index) => (
                      <Badge key={index} className={`text-xs px-2 py-1 border-0 ${getTagColor(tag)}`}>
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Create Dataset Dialog */}
      <CreateDatasetDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSuccess={() => {
          loadDatasets();
          loadStatistics();
        }}
      />

      {/* Edit Dataset Dialog */}
      <EditDatasetDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        dataset={
          editingDataset
            ? {
                id: editingDataset.id,
                name: editingDataset.name,
                description: editingDataset.description,
                icon: editingDataset.icon,
                iconBg: editingDataset.iconBg,
                visibility: editingDataset.visibility,
                tags: editingDataset.tags,
                type: editingDataset.type === DatasetTypeEnum.DATASOURCE ? '数据源' : '文件',
              }
            : null
        }
        onSuccess={() => {
          loadDatasets();
        }}
      />

      {/* Add Data Source Dialog */}
      <EditDataSourceDialog
        open={addDataSourceOpen}
        onOpenChange={setAddDataSourceOpen}
        datasetName={selectedDS?.name}
        datasetId={selectedDS?.id}
        onSuccess={() => {
          if (selectedDS?.id) {
            loadDatasets();
            // 重新加载数据集详情
            Datasets.getDatasetDetail(selectedDS.id)
              .then((response: any) => {
                const detail: DatasetDetailVo | undefined = response.data;
                if (detail) {
                  setDatasetDetail(detail);
                }
              })
              .catch((error: any) => {
                console.error('Failed to load dataset detail:', error);
              });
          }
        }}
      />

      {/* Delete Dataset Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className='dark:bg-gray-900 dark:border-gray-700'>
          <AlertDialogHeader>
            <AlertDialogTitle className='dark:text-white'>{t('dataset.dialogs.deleteDataset.title')}</AlertDialogTitle>
            <AlertDialogDescription className='dark:text-gray-400'>
              {t('dataset.dialogs.deleteDataset.description', {
                name: deletingDataset?.name ?? '',
              })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className='dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300'>
              {t('common.actions.cancel')}
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className='bg-red-600 hover:bg-red-700 text-white'>
              {t('common.actions.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete File Confirmation Dialog */}
      <AlertDialog open={deleteFileDialogOpen} onOpenChange={setDeleteFileDialogOpen}>
        <AlertDialogContent className='dark:bg-gray-900 dark:border-gray-700'>
          <AlertDialogHeader>
            <AlertDialogTitle className='dark:text-white'>{t('dataset.dialogs.deleteFile.title')}</AlertDialogTitle>
            <AlertDialogDescription className='dark:text-gray-400'>
              {t('dataset.dialogs.deleteFile.description', {
                name: deletingFile?.name ?? '',
              })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className='dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300'>
              {t('common.actions.cancel')}
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteFile} className='bg-red-600 hover:bg-red-700 text-white'>
              {t('common.actions.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
