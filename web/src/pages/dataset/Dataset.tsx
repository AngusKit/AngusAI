import { Database, Plus, MoreHorizontal, Eye, Trash2, Edit, FileText, Search, X, Filter, Grid3x3, List, Upload, Download, RefreshCw, } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, } from '@/components/ui/pagination';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, } from '@/components/ui/alert-dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { formatDateOnly, getTagColor } from '@/utils';
import { CreateDatasetDialog } from './CreateDatasetDialog';
import { EditDatasetDialog } from './EditDatasetDialog';
import { AddDataSourceDialog } from './AddDataSourceDialog';
import { useDebounce } from '@/hooks/useDebounce';
import Datasets from '@/services/Datasets';
import DatasetsData from '@/services/DatasetsData';
import { DatasetListVo, DatasetStatisticsVo, DatasetDetailVo, DatasourceTableDataPreviewVo } from '@/services/DatasetsTypes';
import { DatasetDataListVo } from '@/services/DatasetsDataTypes';
import { DatasetTypeEnum, VisibilityEnum, DatasetDataTypeEnum } from '@/enums/enums';
import { GetDatasetListOrderByEnum } from '@/services/DatasetsTypes';

interface DatasetItem {
  id: string;
  name: string;
  description: string;
  icon: string;
  iconBg: string;
  type: '文本' | '表格' | '数据源';
  dataCount: string;
  size: string;
  status: '已启用' | '禁用';
  statusColor: string;
  enabled: boolean;
  visibility?: string;
  modifiedDate: string;
  createdDate: string;
  creator: string;
  tags?: string[];
}

export function Dataset() {
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

  /**
   * 数据集状态颜色
   */
  const DATASET_STATUS_COLORS = {
    enabled: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    disabled: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400',
  } as const;

  // 数据集列表
  const [datasets, setDatasets] = useState<DatasetItem[]>([]);

  // 文件上传列表 - 用于文本和表格类型的数据集
  interface DataFileItem {
    id: string;
    name: string;
    type: DatasetDataTypeEnum;
    typeDisplay: string; // 用于UI显示的类型名称
    typeColor: string;
    typeIcon: string;
    size: string;
    status: '已处理' | '处理中' | '待处理';
    statusColor: string;
    modifiedDate: string;
    recordCount: string;
  }

  // 将DatasetDataListVo转换为DataFileItem（先定义转换函数）
  const convertDataListVoToFile = useCallback((vo: DatasetDataListVo): DataFileItem => {
    // 枚举值到显示字符串的映射
    const typeDisplayMap: Record<DatasetDataTypeEnum, string> = {
      [DatasetDataTypeEnum.CSV]: 'CSV',
      [DatasetDataTypeEnum.JSON]: 'JSON',
      [DatasetDataTypeEnum.EXCEL]: 'Excel',
      [DatasetDataTypeEnum.XML]: 'XML',
      [DatasetDataTypeEnum.TABLE]: 'Table',
    };

    // API返回的字符串到枚举值的映射
    const stringToEnumMap: Record<string, DatasetDataTypeEnum> = {
      CSV: DatasetDataTypeEnum.CSV,
      JSON: DatasetDataTypeEnum.JSON,
      EXCEL: DatasetDataTypeEnum.EXCEL,
      XML: DatasetDataTypeEnum.XML,
      TABLE: DatasetDataTypeEnum.TABLE,
    };

    const statusMap: Record<string, '已处理' | '处理中' | '待处理'> = {
      COMPLETED: '已处理',
      PROCESSING: '处理中',
      PENDING: '待处理',
    } as any;

    const typeIconMap: Record<DatasetDataTypeEnum, string> = {
      [DatasetDataTypeEnum.CSV]: '📊',
      [DatasetDataTypeEnum.JSON]: '📝',
      [DatasetDataTypeEnum.EXCEL]: '📈',
      [DatasetDataTypeEnum.XML]: '📄',
      [DatasetDataTypeEnum.TABLE]: '📋',
    };

    const typeEnum = stringToEnumMap[vo.type || 'CSV'] || DatasetDataTypeEnum.CSV;
    const typeDisplay = typeDisplayMap[typeEnum];
    const status = statusMap[vo.status || 'PENDING'] || '待处理';

    return {
      id: vo.id ? String(vo.id) : '',
      name: vo.name || '',
      type: typeEnum,
      typeDisplay,
      typeColor: typeEnum === DatasetDataTypeEnum.CSV
        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
        : typeEnum === DatasetDataTypeEnum.JSON
        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
        : typeEnum === DatasetDataTypeEnum.EXCEL
        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
        : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
      typeIcon: typeIconMap[typeEnum] || '📄',
      size: vo.dataSize || '0 MB',
      status,
      statusColor: status === '已处理'
        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
        : status === '处理中'
        ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
        : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400',
      modifiedDate: vo.createdDate || '',
      recordCount: vo.dataCount ? vo.dataCount.toLocaleString() : '0',
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
  const [stats, setStats] = useState([
    {
      label: '数据集数量',
      value: '0',
      subtext: '活跃数据集 0个',
      icon: Database,
      iconBg: 'bg-blue-500',
      trend: '+0%',
      trendUp: true,
    },
    {
      label: '数据总量',
      value: '0',
      subtext: '0 条记录',
      icon: FileText,
      iconBg: 'bg-green-500',
      trend: '+0%',
      trendUp: true,
    },
    {
      label: '今日查询',
      value: '0',
      subtext: '累计查询数 0 次',
      icon: Eye,
      iconBg: 'bg-orange-500',
      trend: '+0%',
      trendUp: true,
    },
    {
      label: '存储空间',
      value: '0GB / 0GB',
      subtext: '已使用 0%',
      icon: Database,
      iconBg: 'bg-purple-500',
      progress: 0,
      showProgress: true,
      trend: '+0MB',
      trendUp: true,
    },
  ]);

  // 将DatasetListVo转换为DatasetItem
  const convertDatasetVoToItem = useCallback((vo: DatasetListVo): DatasetItem => {
    const typeMap: Record<DatasetTypeEnum, '文本' | '表格' | '数据源'> = {
      [DatasetTypeEnum.FILE]: '文本', // FILE类型对应文本/表格，这里统一为文本
      [DatasetTypeEnum.DATASOURCE]: '数据源',
    };

    const visibilityMap: Record<VisibilityEnum, string> = {
      [VisibilityEnum.PRIVATE]: 'private',
      [VisibilityEnum.TEAM]: 'team',
      [VisibilityEnum.PUBLIC]: 'public',
    };

    const dataCount = vo.dataStatistics?.totalFilesOrTables 
      ? String(vo.dataStatistics.totalFilesOrTables) 
      : '0';
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
      type: typeMap[vo.type || DatasetTypeEnum.FILE] || '文本',
      dataCount,
      size,
      status: vo.enabled ? '已启用' : '禁用',
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
      console.error('加载数据集列表失败:', error);
      toast.error(error?.message || '加载数据集列表失败');
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

      if (statsData) {
        const totalDatasets = statsData.totalDatasets || 0;
        const activeDatasets = statsData.activeDatasets || 0;
        const totalRecords = statsData.totalRecords || 0;
        const usedStoreSize = statsData.usedStoreSize || '0GB';
        const authorizedStoreSize = statsData.authorizedStoreSize || '0GB';
        
        // 计算存储空间使用率
        const usedSizeNum = parseFloat(usedStoreSize.replace(/[^0-9.]/g, '')) || 0;
        const totalSizeNum = parseFloat(authorizedStoreSize.replace(/[^0-9.]/g, '')) || 0;
        const progress = totalSizeNum > 0 ? Math.round((usedSizeNum / totalSizeNum) * 100) : 0;

        setStats([
          {
            label: '数据集数量',
            value: String(totalDatasets),
            subtext: `活跃数据集 ${activeDatasets}个`,
            icon: Database,
            iconBg: 'bg-blue-500',
            trend: '+0%',
            trendUp: true,
          },
          {
            label: '数据总量',
            value: totalRecords >= 1000 ? `${(totalRecords / 1000).toFixed(1)}K` : String(totalRecords),
            subtext: `${totalRecords.toLocaleString()} 条记录`,
            icon: FileText,
            iconBg: 'bg-green-500',
            trend: '+0%',
            trendUp: true,
          },
          {
            label: '今日查询',
            value: '0',
            subtext: '累计查询数 0 次',
            icon: Eye,
            iconBg: 'bg-orange-500',
            trend: '+0%',
            trendUp: true,
          },
          {
            label: '存储空间',
            value: `${usedStoreSize} / ${authorizedStoreSize}`,
            subtext: `已使用 ${progress}%`,
            icon: Database,
            iconBg: 'bg-purple-500',
            progress,
            showProgress: true,
            trend: '+0MB',
            trendUp: true,
          },
        ]);
      }
    } catch (error: any) {
      console.error('加载统计数据失败:', error);
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

  const handleAction = (action: string, name: string) => {
    toast.success(`${action}: ${name}`);
  };

  const handleView = async (dataset: DatasetItem) => {
    setViewingDataset(dataset);
    setViewDialogOpen(true);
    
    try {
      const response = await Datasets.getDatasetDetail(dataset.id);
      const responseData = (response as any).data;
      const detail: DatasetDetailVo | undefined = responseData;
      
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
      console.error('加载数据集详情失败:', error);
      toast.error(error?.message || '加载数据集详情失败');
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
              status: newEnabled ? '已启用' : '禁用',
              statusColor: newEnabled ? DATASET_STATUS_COLORS.enabled : DATASET_STATUS_COLORS.disabled,
            };
          }
          return ds;
        })
      );
      toast.success(newEnabled ? '数据集已启用' : '数据集已禁用');
    } catch (error: any) {
      console.error('切换数据集状态失败:', error);
      toast.error(error?.message || '切换数据集状态失败');
    }
  };

  const confirmDelete = async () => {
    if (deletingDataset) {
      try {
        await Datasets.deleteDataset(deletingDataset.id);
        toast.success(`数据集 "${deletingDataset.name}" 已删除`);
        setDeleteDialogOpen(false);
        setDeletingDataset(null);
        // 重新加载列表
        loadDatasets();
      } catch (error: any) {
        console.error('删除数据集失败:', error);
        toast.error(error?.message || '删除数据集失败');
      }
    }
  };

  // 使用接口返回的数据，不需要客户端过滤
  const currentDatasets = datasets;
  const shouldShowPagination = totalCount > itemsPerPage;

  // 获取选中的数据集
  const selectedDS = datasets.find(ds => ds.id === selectedDataset);

  // 加载数据集数据列表（文件/表格类型）
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
      console.error('加载数据集数据列表失败:', error);
      toast.error(error?.message || '加载数据集数据列表失败');
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
      console.error('加载数据源表列表失败:', error);
      toast.error(error?.message || '加载数据源表列表失败');
      setDatabaseTables([]);
    } finally {
      setIsLoadingDataList(false);
    }
  }, []);

  // 预览数据源表数据
  const loadTablePreview = useCallback(async (datasetId: string, tableName: string) => {
    setIsLoadingTablePreview(true);
    try {
      const response = await Datasets.previewDatasourceData(datasetId, {
        tableName,
        pageNo: tableCurrentPage,
        pageSize: tablePageSize,
      });

      const responseData = (response as any).data;
      const previewData: DatasourceTableDataPreviewVo | undefined = responseData;

      if (previewData) {
        setTablePreviewData(previewData);
      } else {
        setTablePreviewData(null);
      }
    } catch (error: any) {
      console.error('加载表预览数据失败:', error);
      toast.error(error?.message || '加载表预览数据失败');
      setTablePreviewData(null);
    } finally {
      setIsLoadingTablePreview(false);
    }
  }, [tableCurrentPage, tablePageSize]);

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
          console.error('加载数据集详情失败:', error);
        });

      if (selectedDS.type === '文本' || selectedDS.type === '表格') {
        loadDatasetDataList(selectedDS.id);
      } else if (selectedDS.type === '数据源') {
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
    if (selectedDS && selectedDS.type === '数据源' && selectedTable) {
      loadTablePreview(selectedDS.id, selectedTable.tableName);
    }
  }, [selectedDS, selectedTable, loadTablePreview]);

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div>
        <h1 className='text-2xl mb-1 dark:text-white'>数据集</h1>
        <p className='text-sm text-gray-600 dark:text-gray-400'>数据集是关系型数据组织与管理工具，用于AI模型应用知识补充和数据分析</p>
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
              placeholder='搜索数据集名称、描述'
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
                  筛选
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end' className='dark:bg-gray-800 dark:border-gray-700'>
                <DropdownMenuItem 
                  className='dark:text-gray-300'
                  onClick={() => setSort(GetDatasetListOrderByEnum.ModifiedDate)}
                >
                  按时间排序
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className='dark:text-gray-300'
                  onClick={() => setSort(GetDatasetListOrderByEnum.Name)}
                >
                  按名称排序
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className='dark:text-gray-300'
                  onClick={() => setSort(GetDatasetListOrderByEnum.Type)}
                >
                  按类型排序
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className='dark:text-gray-300'
                  onClick={() => setSort(GetDatasetListOrderByEnum.CreatedDate)}
                >
                  按创建时间排序
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
              创建数据集
            </Button>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className='text-center py-12'>
            <div className='w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3' />
            <p className='text-gray-600 dark:text-gray-400'>加载中...</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && datasets.length === 0 && (
          <div className='text-center py-12'>
            <Database className='w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-3' />
            <p className='text-gray-600 dark:text-gray-400'>未找到匹配的数据集</p>
            <p className='text-sm text-gray-500 dark:text-gray-500 mt-1'>
              {searchQuery ? '尝试使用其他搜索词' : '暂无数据集'}
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
                    <th className='px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400'>数据集名称</th>
                    <th className='px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400'>类型</th>
                    <th className='px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400'>文档数</th>
                    <th className='px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400'>状态</th>
                    <th className='px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400'>更新时间</th>
                    <th className='px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400'>操作</th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-gray-200 dark:divide-gray-700'>
                  {currentDatasets.map(dataset => (
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
                                {dataset.visibility === 'private'
                                  ? '🔒 私有'
                                  : dataset.visibility === 'team'
                                    ? '👥 团队'
                                    : '🌐 公开'}
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
                      <td className='px-6 py-4 text-sm text-gray-600 dark:text-gray-400'>{dataset.type}</td>
                      <td className='px-6 py-4 text-sm text-gray-600 dark:text-gray-400'>{dataset.dataCount}</td>
                      <td className='px-6 py-4'>
                        <div className='flex items-center gap-2' onClick={e => e.stopPropagation()}>
                          <Badge className={`text-xs ${dataset.statusColor} border-0`}>{dataset.status}</Badge>
                          <Switch
                            checked={dataset.enabled}
                            onCheckedChange={() => handleToggleDatasetStatus(dataset.id)}
                            className='data-[state=checked]:bg-blue-500'
                          />
                        </div>
                      </td>
                      <td className='px-6 py-4 text-sm text-gray-600 dark:text-gray-400'>{formatDateOnly(dataset.modifiedDate)}</td>
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
                  ))}
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
                        上一页
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
                        下一页
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
                  className={`p-5 hover:shadow-md transition-all cursor-pointer ${
                    selectedDataset === dataset.id
                      ? 'ring-2 ring-blue-500 dark:ring-blue-400 shadow-lg bg-blue-50/50 dark:bg-blue-900/10'
                      : 'dark:bg-gray-800'
                  } dark:border-gray-700`}
                  onClick={() => setSelectedDataset(dataset.id)}
                >
                  <div className='flex items-start justify-between mb-4'>
                    <div className='flex items-center gap-3'>
                      <div className={`${dataset.iconBg} w-12 h-12 rounded-lg flex items-center justify-center text-2xl`}>
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
                          {dataset.status}
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
                          查看
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEdit(dataset)} className='dark:text-gray-300'>
                          <Edit className='w-4 h-4 mr-2' />
                          编辑
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(dataset)}
                          className='text-red-600 dark:text-red-400'
                        >
                          <Trash2 className='w-4 h-4 mr-2' />
                          删除
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <p className='text-sm text-gray-600 dark:text-gray-400 mb-1 line-clamp-2'>{dataset.description}</p>

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
                        {dataset.type === '数据源' ? '表数量' : '文件数'}
                      </div>
                      <div className='dark:text-white'>{dataset.dataCount}</div>
                    </div>
                    <div>
                      <div className='text-xs text-gray-500 dark:text-gray-400 mb-1'>大小</div>
                      <div className='dark:text-white'>{dataset.size}</div>
                    </div>
                  </div>

                  {/* 附加信息 */}
                  {dataset.visibility && (
                    <div className='mt-0.5 pt-3 border-t border-gray-100 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400'>
                      <div className='flex items-center justify-between'>
                        <span>
                          可见性: {dataset.visibility === 'team' ? '团队' : dataset.visibility === 'private' ? '私有' : '公开'}
                        </span>
                        <span>{formatDateOnly(dataset.modifiedDate)}</span>
                      </div>
                    </div>
                  )}
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
                        上一页
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
                        下一页
                      </PaginationNext>
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        )}
      </div>

      {/* 文件/表格类型 - 文件上传区域 */}
      {selectedDS && (selectedDS.type === '文本' || selectedDS.type === '表格') && (
        <div className='border-t-2 border-gray-200 dark:border-gray-700 pt-6'>
          <div className='mb-4'>
            <h2 className='text-xl dark:text-white mb-1'>文件管理</h2>
            <p className='text-sm text-gray-600 dark:text-gray-400'>
              {selectedDS.name} - 上传和管理{selectedDS.type}文件
            </p>
          </div>

          {/* Upload Area */}
          <Card className='p-6 mb-4 dark:bg-gray-800 dark:border-gray-700'>
            <div className='border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-blue-500 dark:hover:border-blue-400 transition-colors cursor-pointer'>
              <input
                type='file'
                id='file-upload'
                multiple
                accept='.csv,.json,.xml,.xlsx,.xls'
                className='hidden'
                onChange={async (e) => {
                  const files = e.target.files;
                  if (!files || files.length === 0) return;
                  if (!selectedDS) {
                    toast.error('请先选择数据集');
                    return;
                  }

                  for (const file of Array.from(files)) {
                    try {
                      await DatasetsData.uploadDatasetFile(selectedDS.id, { file });
                      toast.success(`文件 "${file.name}" 上传成功`);
                      // 重新加载文件列表
                      loadDatasetDataList(selectedDS.id);
                    } catch (error: any) {
                      console.error('上传文件失败:', error);
                      toast.error(`文件 "${file.name}" 上传失败: ${error?.message || '未知错误'}`);
                    }
                  }
                  // 重置input
                  e.target.value = '';
                }}
              />
              <Upload className='w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4' />
              <Button
                className='bg-blue-500 hover:bg-blue-600 text-white mb-4'
                onClick={() => {
                  const input = document.getElementById('file-upload');
                  if (input) {
                    input.click();
                  }
                }}
              >
                <Upload className='w-4 h-4 mr-2' />
                选择文件
              </Button>
              <p className='text-sm text-gray-600 dark:text-gray-400'>
                拖拽文件到此处或点击选择文件 · 支持 CSV, JSON, XML, Excel 格式，最大 50MB
              </p>
            </div>
          </Card>

          {/* Uploaded Files List */}
          <div className='mb-4'>
            <h3 className='text-lg dark:text-white mb-3'>已上传文件</h3>
          </div>

          <Card className='dark:bg-gray-800 dark:border-gray-700'>
            <div className='overflow-x-auto'>
              <table className='w-full'>
                <thead className='bg-gray-50 dark:bg-gray-900'>
                  <tr>
                    <th className='px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400'>文件名称</th>
                    <th className='px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400'>类型</th>
                    <th className='px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400'>大小</th>
                    <th className='px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400'>记录数</th>
                    <th className='px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400'>状态</th>
                    <th className='px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400'>上传时间</th>
                    <th className='px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400'>操作</th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-gray-200 dark:divide-gray-700'>
                  {isLoadingDataList ? (
                    <tr>
                      <td colSpan={7} className='px-6 py-8 text-center'>
                        <div className='w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2' />
                        <p className='text-sm text-gray-600 dark:text-gray-400'>加载中...</p>
                      </td>
                    </tr>
                  ) : convertedDataFiles.length === 0 ? (
                    <tr>
                      <td colSpan={7} className='px-6 py-8 text-center text-gray-500 dark:text-gray-400'>
                        暂无文件
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
                        <Badge className={`text-xs ${file.typeColor} border-0`}>{file.typeDisplay}</Badge>
                      </td>
                      <td className='px-6 py-4 text-sm text-gray-600 dark:text-gray-400'>{file.size}</td>
                      <td className='px-6 py-4 text-sm text-gray-600 dark:text-gray-400'>{file.recordCount}</td>
                      <td className='px-6 py-4'>
                        <Badge className={`text-xs ${file.statusColor} border-0`}>{file.status}</Badge>
                      </td>
                      <td className='px-6 py-4 text-sm text-gray-600 dark:text-gray-400'>{file.modifiedDate}</td>
                      <td className='px-6 py-4'>
                        <div className='flex items-center gap-2'>
                          <button
                            onClick={() => handleAction('下载', file.name)}
                            className='p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded'
                            title='下载文件'
                          >
                            <Download className='w-4 h-4 text-blue-500' />
                          </button>
                          <button
                            onClick={() => handleAction('查看', file.name)}
                            className='p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded'
                            title='预览'
                          >
                            <Eye className='w-4 h-4 text-gray-600 dark:text-gray-400' />
                          </button>
                          <button
                            onClick={() => handleAction('删除', file.name)}
                            className='p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded'
                            title='删除文件'
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
      )}

      {/* 数据源类型 - 数据库表管理区域 */}
      {selectedDS && selectedDS.type === '数据源' && datasetDetail && (
        <div className='border-t-2 border-gray-200 dark:border-gray-700 pt-6'>
          {/* 数据库信息头部 */}
          <div className='mb-6'>
            <div className='flex items-start justify-between mb-4'>
              <div className='flex items-center gap-4'>
                <div className='bg-blue-500 w-14 h-14 rounded-xl flex items-center justify-center text-3xl'>
                  {datasetDetail.datasourceConfig?.databaseType === 'MySQL' ? '🐬' :
                   datasetDetail.datasourceConfig?.databaseType === 'PostgreSQL' ? '🐘' :
                   datasetDetail.datasourceConfig?.databaseType === 'SQLServer' ? '🔷' :
                   datasetDetail.datasourceConfig?.databaseType === 'Oracle' ? '🔴' : '🔌'}
                </div>
                <div>
                  <h2 className='text-xl dark:text-white mb-1'>{datasetDetail.datasourceConfig?.name || '数据源'}</h2>
                  <p className='text-sm text-gray-600 dark:text-gray-400'>
                    {datasetDetail.datasourceConfig?.jdbcUrl || '未配置JDBC URL'}
                  </p>
                  <div className='flex items-center gap-3 mt-2'>
                    <Badge className='text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-0'>
                      已连接
                    </Badge>
                    <span className='text-xs text-gray-500 dark:text-gray-400'>
                      最后同步: {datasetDetail.modifiedDate || '未知'}
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
                      toast.success('同步已启动');
                      // 重新加载表列表
                      loadDataSourceTables(selectedDS.id);
                    } catch (error: any) {
                      console.error('同步数据库失败:', error);
                      toast.error(error?.message || '同步数据库失败');
                    }
                  }}
                >
                  <RefreshCw className='w-4 h-4 mr-2' />
                  同步
                </Button>
                <Button
                  variant='outline'
                  size='sm'
                  className='dark:bg-gray-800 dark:border-gray-700'
                  onClick={() => setAddDataSourceOpen(true)}
                >
                  <Edit className='w-4 h-4 mr-2' />
                  编辑连接
                </Button>
              </div>
            </div>

            {/* 数据库统计 */}
            <div className='grid grid-cols-4 gap-4'>
              <Card className='p-4 dark:bg-gray-800 dark:border-gray-700'>
                <div className='text-sm text-gray-600 dark:text-gray-400 mb-1'>数据库大小</div>
                <div className='text-2xl dark:text-white'>{datasetDetail.dataStatistics?.usedStoreSize || '0 MB'}</div>
              </Card>
              <Card className='p-4 dark:bg-gray-800 dark:border-gray-700'>
                <div className='text-sm text-gray-600 dark:text-gray-400 mb-1'>表数量</div>
                <div className='text-2xl dark:text-white'>{databaseTables.length} 张</div>
              </Card>
              <Card className='p-4 dark:bg-gray-800 dark:border-gray-700'>
                <div className='text-sm text-gray-600 dark:text-gray-400 mb-1'>总记录数</div>
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
                <div className='text-sm text-gray-600 dark:text-gray-400 mb-1'>连接状态</div>
                <div className='text-2xl text-green-600 dark:text-green-400'>正常</div>
              </Card>
            </div>
          </div>

          {/* 左右分栏：表列表（左）+ 记录预览（右） */}
          <div className='grid grid-cols-5 gap-6'>
            {/* 左侧：表列表 */}
            <div className='col-span-2'>
              <div className='mb-4'>
                <h3 className='text-lg dark:text-white mb-1'>数据表</h3>
                <p className='text-sm text-gray-600 dark:text-gray-400'>点击表名查看数据记录</p>
              </div>

              <Card className='dark:bg-gray-800 dark:border-gray-700'>
                {isLoadingDataList ? (
                  <div className='p-8 text-center'>
                    <div className='w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2' />
                    <p className='text-sm text-gray-600 dark:text-gray-400'>加载中...</p>
                  </div>
                ) : databaseTables.length === 0 ? (
                  <div className='p-8 text-center text-gray-500 dark:text-gray-400'>
                    暂无数据表
                  </div>
                ) : (
                  <div className='divide-y divide-gray-200 dark:divide-gray-700'>
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
                            <span>{table.rowCount} 行</span>
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
                        数据记录预览 -{' '}
                        <span className='font-mono text-blue-600 dark:text-blue-400'>{selectedTable.tableName}</span>
                      </h3>
                      <p className='text-sm text-gray-600 dark:text-gray-400'>
                        共 {totalTableRecords.toLocaleString()} 行记录，当前第 {tableCurrentPage} 页
                      </p>
                    </div>
                    <Button
                      variant='outline'
                      size='sm'
                      className='dark:bg-gray-800 dark:border-gray-700'
                      onClick={() => setSelectedTable(null)}
                    >
                      关闭预览
                    </Button>
                  </div>

                  <Card className='dark:bg-gray-800 dark:border-gray-700'>
                    {isLoadingTablePreview ? (
                      <div className='p-8 text-center'>
                        <div className='w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2' />
                        <p className='text-sm text-gray-600 dark:text-gray-400'>加载预览数据中...</p>
                      </div>
                    ) : tablePreviewData && tablePreviewData.success === false ? (
                      <div className='p-8 text-center text-red-500 dark:text-red-400'>
                        <p className='text-sm'>{tablePreviewData.message || '加载预览数据失败'}</p>
                        {tablePreviewData.details && (
                          <p className='text-xs mt-2 text-gray-500 dark:text-gray-400'>{tablePreviewData.details}</p>
                        )}
                      </div>
                    ) : tableColumns.length === 0 ? (
                      <div className='p-8 text-center text-gray-500 dark:text-gray-400'>
                        暂无数据
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
                                上一页
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
                                下一页
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
                  <p className='text-gray-500 dark:text-gray-400 text-sm'>选择左侧的数据表以查看记录预览</p>
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
            <DialogTitle className='text-xl dark:text-white'>数据集详情</DialogTitle>
            <DialogDescription className='text-sm text-gray-500 dark:text-gray-400'>
              查看数据集的详细信息
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
                <Badge className={`text-xs ${viewingDataset.statusColor} border-0`}>{viewingDataset.status}</Badge>
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <Label className='text-sm text-gray-600 dark:text-gray-400'>数据类型</Label>
                  <p className='text-sm dark:text-white mt-1'>{viewingDataset.type}</p>
                </div>
                <div>
                  <Label className='text-sm text-gray-600 dark:text-gray-400'>{viewingDataset.type === '数据源' ? '表数量' : '文件数量'}</Label>
                  <p className='text-sm dark:text-white mt-1'>{viewingDataset.dataCount} </p>
                </div>
                <div>
                  <Label className='text-sm text-gray-600 dark:text-gray-400'>数据量</Label>
                  <p className='text-sm dark:text-white mt-1'>{viewingDataset.size}</p>
                </div>
                <div>
                  <Label className='text-sm text-gray-600 dark:text-gray-400'>创建者</Label>
                  <p className='text-sm dark:text-white mt-1'>{viewingDataset.creator}</p>
                </div>
                <div>
                  <Label className='text-sm text-gray-600 dark:text-gray-400'>创建时间</Label>
                  <p className='text-sm dark:text-white mt-1'>{viewingDataset.createdDate}</p>
                </div>
                <div>
                  <Label className='text-sm text-gray-600 dark:text-gray-400'>最后更新</Label>
                  <p className='text-sm dark:text-white mt-1'>{viewingDataset.modifiedDate}</p>
                </div>
              </div>

              {viewingDataset.tags && viewingDataset.tags.length > 0 && (
                <div>
                  <Label className='text-sm text-gray-600 dark:text-gray-400 mb-2 block'>标签</Label>
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
        dataset={editingDataset}
        onSuccess={() => {
          loadDatasets();
        }}
      />

      {/* Add Data Source Dialog */}
      <AddDataSourceDialog
        open={addDataSourceOpen}
        onOpenChange={setAddDataSourceOpen}
        datasetName={selectedDS?.name}
        datasetId={selectedDS?.id}
        onSuccess={() => {
          if (selectedDS?.id) {
            loadDatasets();
          }
        }}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className='dark:bg-gray-900 dark:border-gray-700'>
          <AlertDialogHeader>
            <AlertDialogTitle className='dark:text-white'>确认删除</AlertDialogTitle>
            <AlertDialogDescription className='dark:text-gray-400'>
              确定要删除数据集 "{deletingDataset?.name}" 吗？此操作无法撤销。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className='dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300'>
              取消
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className='bg-red-600 hover:bg-red-700 text-white'>
              删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
