import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import Datasets from '@/services/Datasets';
import DatasetsData from '@/services/DatasetsData';
import { DatasetDetailVo, DatasetListVo, DatasetStatisticsVo } from '@/services/DatasetsTypes';
import { DatasetDataListVo } from '@/services/DatasetsDataTypes';
import { GetDatasetListOrderByEnum } from '@/services/DatasetsTypes';
import { convertDatasetVoToItem, convertDataListVoToFile, convertDataListVoToTable } from '../utils';
import { DatasetItem, DataFileItem, DatabaseTable } from '../utils';
import { PAGINATION } from '../constants';
import { useLanguage } from '@/components/ui/LanguageProvider';

/**
 * 数据集列表管理 Hook
 */
export function useDatasetList() {
  const [datasets, setDatasets] = useState<DatasetItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const { t } = useLanguage();

  /** 加载数据集列表 */
  const loadDatasets = useCallback(
    async (params: { keyword?: string; pageNo: number; pageSize: number; orderBy: GetDatasetListOrderByEnum }) => {
      setIsLoading(true);
      try {
        const response = await Datasets.getDatasetList(params);
        const responseData = (response as any).data;
        const listData: DatasetListVo[] | undefined = responseData?.list;

        if (Array.isArray(listData)) {
          const mappedList = listData.map(convertDatasetVoToItem);
          setDatasets(mappedList);
          setTotalCount(responseData?.total || 0);
          setTotalPages(Math.ceil((responseData?.total || 0) / params.pageSize));
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
    },
    []
  );

  return {
    datasets,
    isLoading,
    totalPages,
    totalCount,
    loadDatasets,
    setDatasets,
  };
}

/**
 * 数据集详情管理 Hook
 */
export function useDatasetDetail() {
  const [datasetDetail, setDatasetDetail] = useState<DatasetDetailVo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useLanguage();

  /** 加载数据集详情 */
  const loadDatasetDetail = useCallback(async (datasetId: string) => {
    setIsLoading(true);
    try {
      const response = await Datasets.getDatasetDetail(datasetId);
      const responseData = (response as any).data;
      const detail: DatasetDetailVo | undefined = responseData;

      if (detail) {
        setDatasetDetail(detail);
        return detail;
      }
      return null;
    } catch (error: any) {
      console.error('Failed to load dataset detail:', error);
      toast.error(error?.message || t('dataset.toasts.loadDetailFailed'));
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    datasetDetail,
    isLoading,
    loadDatasetDetail,
    setDatasetDetail,
  };
}

/**
 * 数据集统计数据管理 Hook
 */
export function useDatasetStatistics() {
  const [statistics, setStatistics] = useState<DatasetStatisticsVo | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  /** 加载统计数据 */
  const loadStatistics = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await Datasets.getDatasetStatistics();
      const responseData = (response as any).data;
      const statsData: DatasetStatisticsVo | undefined = responseData;

      if (statsData) {
        setStatistics(statsData);
      }
    } catch (error: any) {
      console.error('Failed to load dataset statistics:', error);
      // 不显示错误提示，使用默认值
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    statistics,
    isLoading,
    loadStatistics,
  };
}

/**
 * 数据集文件列表管理 Hook
 */
export function useDatasetFiles() {
  const [dataFiles, setDataFiles] = useState<DatasetDataListVo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useLanguage();

  /** 加载文件列表 */
  const loadFiles = useCallback(async (datasetId: string) => {
    setIsLoading(true);
    try {
      const response = await DatasetsData.getDatasetDataList(datasetId, {
        pageNo: 1,
        pageSize: PAGINATION.DATA_LIST_PAGE_SIZE,
      });

      const responseData = (response as any).data;
      const listData: DatasetDataListVo[] | undefined = responseData?.list;

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
      setIsLoading(false);
    }
  }, []);

  /** 转换为文件项列表 */
  const getFileItems = useCallback((): DataFileItem[] => {
    return dataFiles.map(convertDataListVoToFile);
  }, [dataFiles]);

  return {
    dataFiles,
    isLoading,
    loadFiles,
    getFileItems,
  };
}

/**
 * 数据源表列表管理 Hook
 */
export function useDataSourceTables() {
  const [databaseTables, setDatabaseTables] = useState<DatasetDataListVo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useLanguage();

  /** 加载表列表 */
  const loadTables = useCallback(async (datasetId: string) => {
    setIsLoading(true);
    try {
      const response = await DatasetsData.getDatasetDataList(datasetId, {
        pageNo: 1,
        pageSize: PAGINATION.DATA_LIST_PAGE_SIZE,
      });

      const responseData = (response as any).data;
      const listData: DatasetDataListVo[] | undefined = responseData?.list;

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
      setIsLoading(false);
    }
  }, []);

  /** 转换为表项列表 */
  const getTableItems = useCallback((): DatabaseTable[] => {
    return databaseTables.map(convertDataListVoToTable);
  }, [databaseTables]);

  return {
    databaseTables,
    isLoading,
    loadTables,
    getTableItems,
  };
}
