import { Database, Plus, MoreHorizontal, Eye, Trash2, Edit, FileText, Copy, Search, X, Filter, Grid3x3, List, Upload, File, Download, Code, Globe, Cloud, Link as LinkIcon, RefreshCw, } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, } from '@/components/ui/pagination';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, } from '@/components/ui/alert-dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useState } from 'react';
import { useLanguage } from '@/components/ui/LanguageProvider';
import { toast } from 'sonner';
import { CreateDatasetDialog } from './CreateDatasetDialog';
import { EditDatasetDialog } from './EditDatasetDialog';
import { AddDataSourceDialog } from './AddDataSourceDialog';

interface DatasetItem {
  id: number;
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
  updateTime: string;
  createdTime: string;
  creator: string;
  tags?: string[];
}

interface DataSourceItem {
  id: number;
  name: string;
  sourceType: 'file' | 'api' | 'database' | 'web' | 'text' | 'cloud';
  sourceTypeLabel: string;
  typeColor: string;
  typeIcon: string;
  size: string;
  status: '已连接' | '处理中' | '失败' | '未激活';
  statusColor: string;
  addedTime: string;
  recordCount: string;
  lastSync?: string;
}

export function Dataset() {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');
  const [sortBy, setSort] = useState('default');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedDataset, setSelectedDataset] = useState<number | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [viewingDataset, setViewingDataset] = useState<DatasetItem | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingDataset, setEditingDataset] = useState<DatasetItem | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingDataset, setDeletingDataset] = useState<DatasetItem | null>(null);
  const [addDataSourceOpen, setAddDataSourceOpen] = useState(false);
  const [dataSourcePage, setDataSourcePage] = useState(1);
  const dataSourcesPerPage = 6;

  /**
   * 数据集状态颜色
   */
  const DATASET_STATUS_COLORS = {
    enabled: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    disabled: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400',
  } as const;

  // 标签颜色映射
  const getTagColor = (tag: string): string => {
    const colors = [
      'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
      'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
      'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400',
      'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
      'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400',
      'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
    ];

    // 根据标签内容生成一个稳定的索引
    const index = tag.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
    return colors[index]!;
  };

  // 统计数据
  const stats = [
    {
      label: '数据集数量',
      value: '10',
      subtext: '较上月增加 2个',
      icon: Database,
      iconBg: 'bg-blue-500',
      trend: '+25%',
      trendUp: true,
    },
    {
      label: '数据总量',
      value: '45.8K',
      subtext: '45,800 条记录',
      icon: FileText,
      iconBg: 'bg-green-500',
      trend: '+39%',
      trendUp: true,
    },
    {
      label: '今日查询',
      value: '128',
      subtext: '累计查询数 2418 次',
      icon: Eye,
      iconBg: 'bg-orange-500',
      trend: '+5%',
      trendUp: true,
    },
    {
      label: '存储空间',
      value: '1.8GB / 10GB',
      subtext: '已使用 18%',
      icon: Database,
      iconBg: 'bg-purple-500',
      progress: 18,
      showProgress: true,
      trend: '+150.5MB',
      trendUp: true,
    },
  ];

  // 数据集列表 - 扩展到10条
  const [datasets, setDatasets] = useState<DatasetItem[]>([
    {
      id: 1,
      name: '客户对话数据集',
      description: '基于客服场景的真实对话数据',
      icon: '📚',
      iconBg: 'bg-blue-50 dark:bg-blue-900/20',
      type: '文本',
      dataCount: '24',
      size: '12.5K 条',
      status: '已启用',
      statusColor: DATASET_STATUS_COLORS.enabled,
      enabled: true,
      visibility: 'team',
      updateTime: '2023-10-12',
      createdTime: '2023-09-01 10:30',
      creator: '张三',
      tags: ['客服', '对话'],
    },
    {
      id: 2,
      name: '技术问答集',
      description: 'IT技术类常见问题及答案',
      icon: '📗',
      iconBg: 'bg-green-50 dark:bg-green-900/20',
      type: '表格',
      dataCount: '8',
      size: '5.2K 条',
      status: '已启用',
      statusColor: DATASET_STATUS_COLORS.enabled,
      enabled: true,
      visibility: 'private',
      updateTime: '2023-10-10',
      createdTime: '2023-08-15 14:20',
      creator: '李四',
      tags: ['技术', 'IT', 'Q&A'],
    },
    {
      id: 3,
      name: '产品评价数据集',
      description: '电商平台产品评价及推荐相关',
      icon: '📙',
      iconBg: 'bg-yellow-50 dark:bg-yellow-900/20',
      type: '文本',
      dataCount: '42',
      size: '18.7K 条',
      status: '禁用',
      statusColor: DATASET_STATUS_COLORS.disabled,
      enabled: false,
      visibility: 'public',
      updateTime: '2023-10-18',
      createdTime: '2023-10-01 09:15',
      creator: '王五',
      tags: ['电商', '评价', '推荐'],
    },
    {
      id: 4,
      name: 'CRM客户数据源',
      description: '连接到CRM系统的客户数据',
      icon: '🔌',
      iconBg: 'bg-purple-50 dark:bg-purple-900/20',
      type: '数据源',
      dataCount: '3',
      size: '45.6K 条',
      status: '已启用',
      statusColor: DATASET_STATUS_COLORS.enabled,
      enabled: true,
      visibility: 'team',
      updateTime: '2023-10-20',
      createdTime: '2023-07-20 16:45',
      creator: '赵六',
      tags: ['CRM', 'API', '客户'],
    },
    {
      id: 5,
      name: '新闻文档',
      description: '行业相关新闻报道及分析',
      icon: '📘',
      iconBg: 'bg-blue-50 dark:bg-blue-900/20',
      type: '文本',
      dataCount: '67',
      size: '22.3K 条',
      status: '已启用',
      statusColor: DATASET_STATUS_COLORS.enabled,
      enabled: true,
      visibility: 'team',
      updateTime: '2023-10-05',
      createdTime: '2023-08-10 11:00',
      creator: '孙七',
      tags: ['新闻', '行业分析'],
    },
    {
      id: 6,
      name: '电商订单数据源',
      description: '连接到电商平台的订单数据库',
      icon: '🗄️',
      iconBg: 'bg-indigo-50 dark:bg-indigo-900/20',
      type: '数据源',
      dataCount: '2',
      size: '128.4K 条',
      status: '已启用',
      statusColor: DATASET_STATUS_COLORS.enabled,
      enabled: true,
      visibility: 'private',
      updateTime: '2023-10-12',
      createdTime: '2023-09-05 13:30',
      creator: '周八',
      tags: ['电商', '订单', 'MySQL'],
    },
    {
      id: 7,
      name: '医疗知识库',
      description: '医疗健康相关知识和问答',
      icon: '💊',
      iconBg: 'bg-red-50 dark:bg-red-900/20',
      type: '文本',
      dataCount: '35',
      size: '15.2K 条',
      status: '已启用',
      statusColor: DATASET_STATUS_COLORS.enabled,
      enabled: true,
      visibility: 'public',
      updateTime: '2023-10-08',
      createdTime: '2023-08-25 15:20',
      creator: '吴九',
      tags: ['医疗', '健康', '知识库'],
    },
    {
      id: 8,
      name: '金融数据集',
      description: '股票、基金等金融数据',
      icon: '💰',
      iconBg: 'bg-yellow-50 dark:bg-yellow-900/20',
      type: '表格',
      dataCount: '89',
      size: '28.9K 条',
      status: '已启用',
      statusColor: DATASET_STATUS_COLORS.enabled,
      enabled: true,
      visibility: 'team',
      updateTime: '2023-10-15',
      createdTime: '2023-09-10 10:00',
      creator: '郑十',
      tags: ['金融', '股票', '基金'],
    },
    {
      id: 9,
      name: '网站内容数据源',
      description: '从官网爬取的产品信息和文档',
      icon: '🌐',
      iconBg: 'bg-orange-50 dark:bg-orange-900/20',
      type: '数据源',
      dataCount: '1',
      size: '8.2K 条',
      status: '禁用',
      statusColor: DATASET_STATUS_COLORS.disabled,
      enabled: false,
      visibility: 'private',
      updateTime: '2023-10-19',
      createdTime: '2023-10-05 14:30',
      creator: '钱十一',
      tags: ['网站', '爬虫', '内容'],
    },
    {
      id: 10,
      name: '社交媒体数据',
      description: '社交平台用户行为和内容分析',
      icon: '📱',
      iconBg: 'bg-pink-50 dark:bg-pink-900/20',
      type: '文本',
      dataCount: '120',
      size: '35.6K 条',
      status: '已启用',
      statusColor: DATASET_STATUS_COLORS.enabled,
      enabled: true,
      visibility: 'public',
      updateTime: '2023-10-21',
      createdTime: '2023-09-20 09:45',
      creator: '孙十二',
      tags: ['社交', '媒体', '用户行为'],
    },
  ]);

  // 文件上传列表 - 用于文本和表格类型的数据集
  interface DataFileItem {
    id: number;
    name: string;
    type: 'CSV' | 'JSON' | 'Excel' | 'Text' | 'PDF';
    typeColor: string;
    typeIcon: string;
    size: string;
    status: '已处理' | '处理中' | '待处理';
    statusColor: string;
    uploadTime: string;
    recordCount: string;
  }

  const dataFiles: DataFileItem[] = [
    {
      id: 1,
      name: '客户对话记录_2023Q3.csv',
      type: 'CSV',
      typeColor: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      typeIcon: '📊',
      size: '3.2 MB',
      status: '已处理',
      statusColor: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      uploadTime: '2023-10-10 14:30',
      recordCount: '5,240',
    },
    {
      id: 2,
      name: '客户反馈数据.json',
      type: 'JSON',
      typeColor: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      typeIcon: '📝',
      size: '1.8 MB',
      status: '处理中',
      statusColor: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
      uploadTime: '2023-10-11 09:15',
      recordCount: '3,180',
    },
    {
      id: 3,
      name: '服务质量评分.xlsx',
      type: 'Excel',
      typeColor: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
      typeIcon: '📈',
      size: '2.5 MB',
      status: '已处理',
      statusColor: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      uploadTime: '2023-10-09 16:20',
      recordCount: '4,320',
    },
    {
      id: 4,
      name: '问题分类标签.txt',
      type: 'Text',
      typeColor: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
      typeIcon: '📄',
      size: '0.5 MB',
      status: '待处理',
      statusColor: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400',
      uploadTime: '2023-10-12 11:45',
      recordCount: '1,500',
    },
  ];

  // 数据库数据源列表 - 用于数据源类型的数据集
  const dataSources: DataSourceItem[] = [
    {
      id: 1,
      name: 'MySQL生产库',
      sourceType: 'database',
      sourceTypeLabel: 'MySQL',
      typeColor: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      typeIcon: '🐬',
      size: '125.6 MB',
      status: '已连接',
      statusColor: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      addedTime: '2023-10-09 16:20',
      recordCount: '8 张表',
      lastSync: '2023-10-23 11:15',
    },
    {
      id: 2,
      name: 'PostgreSQL数据仓库',
      sourceType: 'database',
      sourceTypeLabel: 'PostgreSQL',
      typeColor: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
      typeIcon: '🐘',
      size: '256.8 MB',
      status: '已连接',
      statusColor: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      addedTime: '2023-10-10 14:30',
      recordCount: '15 张表',
      lastSync: '2023-10-23 10:00',
    },
    {
      id: 3,
      name: 'SQL Server报表库',
      sourceType: 'database',
      sourceTypeLabel: 'SQL Server',
      typeColor: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
      typeIcon: '🔷',
      size: '89.2 MB',
      status: '处理中',
      statusColor: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
      addedTime: '2023-10-11 09:15',
      recordCount: '6 张表',
      lastSync: '2023-10-23 09:30',
    },
    {
      id: 4,
      name: 'Oracle业务系统',
      sourceType: 'database',
      sourceTypeLabel: 'Oracle',
      typeColor: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
      typeIcon: '🔴',
      size: '512.4 MB',
      status: '已连接',
      statusColor: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      addedTime: '2023-10-08 13:45',
      recordCount: '24 张表',
      lastSync: '2023-10-23 08:00',
    },
    {
      id: 5,
      name: 'MySQL测试环境',
      sourceType: 'database',
      sourceTypeLabel: 'MySQL',
      typeColor: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      typeIcon: '🐬',
      size: '45.8 MB',
      status: '未激活',
      statusColor: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400',
      addedTime: '2023-10-05 10:00',
      recordCount: '12,340',
      lastSync: '2023-10-20 15:30',
    },
    {
      id: 7,
      name: 'GraphQL数据接口',
      sourceType: 'api',
      sourceTypeLabel: 'GraphQL',
      typeColor: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      typeIcon: '🔌',
      size: '3.4 MB',
      status: '失败',
      statusColor: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400',
      addedTime: '2023-10-07 11:20',
      recordCount: '3 张表',
    },
  ];

  // 数据库表列表 - 模拟数据
  interface DatabaseTable {
    id: number;
    tableName: string;
    rowCount: string;
    size: string;
    lastUpdated: string;
    description?: string;
  }

  const [selectedTable, setSelectedTable] = useState<DatabaseTable | null>(null);
  const [tableCurrentPage, setTableCurrentPage] = useState(1);
  const tablePageSize = 10;

  const databaseTables: DatabaseTable[] = [
    {
      id: 1,
      tableName: 'customers',
      rowCount: '125,680',
      size: '45.2 MB',
      lastUpdated: '2023-10-23 11:00',
      description: '客户基本信息表',
    },
    {
      id: 2,
      tableName: 'orders',
      rowCount: '356,240',
      size: '128.5 MB',
      lastUpdated: '2023-10-23 10:45',
      description: '订单记录表',
    },
    {
      id: 3,
      tableName: 'products',
      rowCount: '8,560',
      size: '12.8 MB',
      lastUpdated: '2023-10-22 15:30',
      description: '产品信息表',
    },
    {
      id: 4,
      tableName: 'order_items',
      rowCount: '890,125',
      size: '256.4 MB',
      lastUpdated: '2023-10-23 10:45',
      description: '订单明细表',
    },
    {
      id: 5,
      tableName: 'user_sessions',
      rowCount: '1,245,360',
      size: '512.6 MB',
      lastUpdated: '2023-10-23 11:15',
      description: '用户会话记录',
    },
    {
      id: 6,
      tableName: 'payments',
      rowCount: '298,450',
      size: '89.2 MB',
      lastUpdated: '2023-10-23 09:20',
      description: '支付交易记录',
    },
    {
      id: 7,
      tableName: 'categories',
      rowCount: '245',
      size: '0.8 MB',
      lastUpdated: '2023-10-20 14:00',
      description: '商品分类表',
    },
    {
      id: 8,
      tableName: 'reviews',
      rowCount: '456,780',
      size: '156.4 MB',
      lastUpdated: '2023-10-23 08:30',
      description: '用户评价表',
    },
  ];

  // 表记录数据 - 模拟预览
  interface TableRecord {
    [key: string]: string | number;
  }

  const tableRecords: TableRecord[] = [
    {
      id: 1,
      customer_name: '张三',
      email: 'zhangsan@example.com',
      phone: '13800138000',
      city: '北京',
      registration_date: '2023-01-15',
      status: '活跃',
    },
    {
      id: 2,
      customer_name: '李四',
      email: 'lisi@example.com',
      phone: '13900139000',
      city: '上海',
      registration_date: '2023-02-20',
      status: '活跃',
    },
    {
      id: 3,
      customer_name: '王五',
      email: 'wangwu@example.com',
      phone: '13700137000',
      city: '广州',
      registration_date: '2023-03-10',
      status: '休眠',
    },
    {
      id: 4,
      customer_name: '赵六',
      email: 'zhaoliu@example.com',
      phone: '13600136000',
      city: '深圳',
      registration_date: '2023-04-05',
      status: '活跃',
    },
    {
      id: 5,
      customer_name: '孙七',
      email: 'sunqi@example.com',
      phone: '13500135000',
      city: '杭州',
      registration_date: '2023-05-12',
      status: '活跃',
    },
    {
      id: 6,
      customer_name: '周八',
      email: 'zhouba@example.com',
      phone: '13400134000',
      city: '成都',
      registration_date: '2023-06-18',
      status: '休眠',
    },
    {
      id: 7,
      customer_name: '吴九',
      email: 'wujiu@example.com',
      phone: '13300133000',
      city: '武汉',
      registration_date: '2023-07-22',
      status: '活跃',
    },
    {
      id: 8,
      customer_name: '郑十',
      email: 'zhengshi@example.com',
      phone: '13200132000',
      city: '西安',
      registration_date: '2023-08-08',
      status: '活跃',
    },
    {
      id: 9,
      customer_name: '钱十一',
      email: 'qianshiyi@example.com',
      phone: '13100131000',
      city: '南京',
      registration_date: '2023-09-14',
      status: '休眠',
    },
    {
      id: 10,
      customer_name: '陈十二',
      email: 'chenshier@example.com',
      phone: '13000130000',
      city: '天津',
      registration_date: '2023-10-01',
      status: '活跃',
    },
  ];

  const tableColumns = selectedTable ? Object.keys(tableRecords[0] || {}) : [];
  const totalTableRecords = tableRecords.length;
  const totalTablePages = Math.ceil(totalTableRecords / tablePageSize);
  const paginatedTableRecords = tableRecords.slice(
    (tableCurrentPage - 1) * tablePageSize,
    tableCurrentPage * tablePageSize
  );

  const handleAction = (action: string, name: string) => {
    toast.success(`${action}: ${name}`);
  };

  const handleView = (dataset: DatasetItem) => {
    setViewingDataset(dataset);
    setViewDialogOpen(true);
  };

  const handleEdit = (dataset: DatasetItem) => {
    setEditingDataset(dataset);
    setEditDialogOpen(true);
  };

  const handleDelete = (dataset: DatasetItem) => {
    setDeletingDataset(dataset);
    setDeleteDialogOpen(true);
  };

  const handleToggleDatasetStatus = (id: number) => {
    const dataset = datasets.find(ds => ds.id === id);
    if (!dataset) return;

    const newEnabled = !dataset.enabled;
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
  };

  const confirmDelete = () => {
    if (deletingDataset) {
      toast.success(`数据集 "${deletingDataset.name}" 已删除`);
      setDeleteDialogOpen(false);
      setDeletingDataset(null);
    }
  };

  // 过滤数据集
  const filteredDatasets = datasets.filter(dataset => {
    const searchLower = searchQuery.toLowerCase();
    return (
      dataset.name.toLowerCase().includes(searchLower) ||
      dataset.description.toLowerCase().includes(searchLower) ||
      dataset.type.toLowerCase().includes(searchLower)
    );
  });

  // 分页逻辑
  const totalPages = Math.ceil(filteredDatasets.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentDatasets = filteredDatasets.slice(startIndex, endIndex);
  const shouldShowPagination = filteredDatasets.length > itemsPerPage;

  // 获取选中的数据集
  const selectedDS = datasets.find(ds => ds.id === selectedDataset);

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
              placeholder='搜索数据集名称、描述或类型...'
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
                <DropdownMenuItem className='dark:text-gray-300'>默认排序</DropdownMenuItem>
                <DropdownMenuItem className='dark:text-gray-300'>按名称排序</DropdownMenuItem>
                <DropdownMenuItem className='dark:text-gray-300'>按时间排序</DropdownMenuItem>
                <DropdownMenuItem className='dark:text-gray-300'>按大小排序</DropdownMenuItem>
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

        {/* Empty State */}
        {filteredDatasets.length === 0 && (
          <div className='text-center py-12'>
            <Database className='w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-3' />
            <p className='text-gray-600 dark:text-gray-400'>未找到匹配的数据集</p>
            <p className='text-sm text-gray-500 dark:text-gray-500 mt-1'>
              {searchQuery ? '尝试使用其他搜索词' : '暂无数据集'}
            </p>
          </div>
        )}

        {/* Table View */}
        {viewMode === 'table' && filteredDatasets.length > 0 && (
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
                      <td className='px-6 py-4 text-sm text-gray-600 dark:text-gray-400'>{dataset.updateTime}</td>
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
        {viewMode === 'grid' && filteredDatasets.length > 0 && (
          <>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
              {currentDatasets.map(dataset => (
                <Card
                  key={dataset.id}
                  className={`p-4 dark:bg-gray-800 dark:border-gray-700 hover:shadow-lg transition-shadow cursor-pointer ${
                    selectedDataset === dataset.id ? 'ring-2 ring-blue-500 dark:ring-blue-400' : ''
                  }`}
                  onClick={() => setSelectedDataset(dataset.id)}
                >
                  <div className='flex items-start justify-between gap-3 mb-3'>
                    <div className='flex items-center gap-2 flex-1 min-w-0'>
                      <div
                        className={`${dataset.iconBg} w-10 h-10 rounded-lg flex items-center justify-center text-xl shrink-0`}
                      >
                        {dataset.icon}
                      </div>
                      <div className='flex items-center gap-2 flex-1 min-w-0'>
                        <h3 className='dark:text-white truncate'>{dataset.name}</h3>
                        <Badge variant='outline' className='text-xs shrink-0 dark:border-gray-600'>
                          {dataset.visibility === 'private'
                            ? '🔒 私有'
                            : dataset.visibility === 'team'
                              ? '👥 团队'
                              : '🌐 公开'}
                        </Badge>
                        <Switch
                          checked={dataset.enabled}
                          onCheckedChange={() => {
                            handleToggleDatasetStatus(dataset.id);
                          }}
                          onClick={e => e.stopPropagation()}
                          className='data-[state=checked]:bg-blue-500'
                        />
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={e => e.stopPropagation()}>
                        <button className='p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors shrink-0'>
                          <MoreHorizontal className='w-4 h-4 text-gray-600 dark:text-gray-400' />
                        </button>
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
                          onClick={() => handleAction('复制', dataset.name)}
                          className='dark:text-gray-300'
                        >
                          <Copy className='w-4 h-4 mr-2' />
                          复制
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

                  <p className='text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2'>{dataset.description}</p>

                  {dataset.tags && dataset.tags.length > 0 && (
                    <div className='flex flex-wrap gap-1 mb-3'>
                      {dataset.tags.slice(0, 3).map((tag, index) => (
                        <Badge key={index} className={`text-xs px-1.5 py-0 border-0 ${getTagColor(tag)}`}>
                          {tag}
                        </Badge>
                      ))}
                      {dataset.tags.length > 3 && (
                        <Badge
                          variant='secondary'
                          className='text-xs px-1.5 py-0 bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 border-0'
                        >
                          +{dataset.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}

                  <div className='flex items-center justify-between text-xs text-gray-500 dark:text-gray-400'>
                    <div className='flex items-center gap-2'>
                      <span>{dataset.dataCount} 文档</span>
                      <span>·</span>
                      <span>{dataset.size}</span>
                    </div>
                    <Badge className={`text-xs ${dataset.statusColor} border-0`}>{dataset.status}</Badge>
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
              <Upload className='w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4' />
              <Button
                className='bg-blue-500 hover:bg-blue-600 text-white mb-4'
                onClick={() => toast.success('文件上传功能')}
              >
                <Upload className='w-4 h-4 mr-2' />
                选择文件
              </Button>
              <p className='text-sm text-gray-600 dark:text-gray-400'>
                拖拽文件到此处或点击选择文件 · 支持 CSV, JSON, Excel, TXT, PDF 格式，最大 100MB
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
                  {dataFiles.map(file => (
                    <tr key={file.id} className='hover:bg-gray-50 dark:hover:bg-gray-900'>
                      <td className='px-6 py-4'>
                        <div className='flex items-center gap-3'>
                          <span className='text-xl'>{file.typeIcon}</span>
                          <span className='text-sm dark:text-white'>{file.name}</span>
                        </div>
                      </td>
                      <td className='px-6 py-4'>
                        <Badge className={`text-xs ${file.typeColor} border-0`}>{file.type}</Badge>
                      </td>
                      <td className='px-6 py-4 text-sm text-gray-600 dark:text-gray-400'>{file.size}</td>
                      <td className='px-6 py-4 text-sm text-gray-600 dark:text-gray-400'>{file.recordCount}</td>
                      <td className='px-6 py-4'>
                        <Badge className={`text-xs ${file.statusColor} border-0`}>{file.status}</Badge>
                      </td>
                      <td className='px-6 py-4 text-sm text-gray-600 dark:text-gray-400'>{file.uploadTime}</td>
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
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* 数据源类型 - 数据库表管理区域 */}
      {selectedDS && selectedDS.type === '数据源' && (
        <div className='border-t-2 border-gray-200 dark:border-gray-700 pt-6'>
          {/* 数据库信息头部 */}
          <div className='mb-6'>
            <div className='flex items-start justify-between mb-4'>
              <div className='flex items-center gap-4'>
                <div className='bg-blue-500 w-14 h-14 rounded-xl flex items-center justify-center text-3xl'>🐬</div>
                <div>
                  <h2 className='text-xl dark:text-white mb-1'>MySQL生产库</h2>
                  <p className='text-sm text-gray-600 dark:text-gray-400'>
                    jdbc:mysql://192.168.1.100:3306/production_db
                  </p>
                  <div className='flex items-center gap-3 mt-2'>
                    <Badge className='text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-0'>
                      已连接
                    </Badge>
                    <span className='text-xs text-gray-500 dark:text-gray-400'>最后同步: 2023-10-23 11:15</span>
                  </div>
                </div>
              </div>
              <div className='flex items-center gap-2'>
                <Button
                  variant='outline'
                  size='sm'
                  className='dark:bg-gray-800 dark:border-gray-700'
                  onClick={() => toast.success('同步数据库')}
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
                <div className='text-2xl dark:text-white'>125.6 MB</div>
              </Card>
              <Card className='p-4 dark:bg-gray-800 dark:border-gray-700'>
                <div className='text-sm text-gray-600 dark:text-gray-400 mb-1'>表数量</div>
                <div className='text-2xl dark:text-white'>{databaseTables.length} 张</div>
              </Card>
              <Card className='p-4 dark:bg-gray-800 dark:border-gray-700'>
                <div className='text-sm text-gray-600 dark:text-gray-400 mb-1'>总记录数</div>
                <div className='text-2xl dark:text-white'>3.2M</div>
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
                <div className='divide-y divide-gray-200 dark:divide-gray-700'>
                  {databaseTables.map(table => (
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
                  ))}
                </div>
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
                        共 {selectedTable.rowCount} 行记录，显示前 {totalTableRecords} 条
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
                                  {String(record[column])}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

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
                  <Label className='text-sm text-gray-600 dark:text-gray-400'>文档数量</Label>
                  <p className='text-sm dark:text-white mt-1'>{viewingDataset.dataCount} 个文档</p>
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
                  <p className='text-sm dark:text-white mt-1'>{viewingDataset.createdTime}</p>
                </div>
                <div>
                  <Label className='text-sm text-gray-600 dark:text-gray-400'>最后更新</Label>
                  <p className='text-sm dark:text-white mt-1'>{viewingDataset.updateTime}</p>
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

          <div className='flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700'>
            <Button
              variant='outline'
              onClick={() => setViewDialogOpen(false)}
              className='dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300'
            >
              关闭
            </Button>
            <Button
              className='bg-blue-500 hover:bg-blue-600 text-white'
              onClick={() => {
                setViewDialogOpen(false);
                viewingDataset && handleAction('编辑', viewingDataset.name);
              }}
            >
              编辑数据集
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Dataset Dialog */}
      <CreateDatasetDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} />

      {/* Edit Dataset Dialog */}
      <EditDatasetDialog open={editDialogOpen} onOpenChange={setEditDialogOpen} dataset={editingDataset} />

      {/* Add Data Source Dialog */}
      <AddDataSourceDialog
        open={addDataSourceOpen}
        onOpenChange={setAddDataSourceOpen}
        datasetName={selectedDS?.name}
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
