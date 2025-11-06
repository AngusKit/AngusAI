import { Database, Plus, Upload, MoreHorizontal, Eye, Trash2, Download, FileText, File, Search, X, Filter, Grid3x3, List, Edit, FolderOpen, Files, Check, RefreshCw, } from 'lucide-react';
import { Button } from '@/ui/button';
import { Card } from '@/ui/card';
import { Badge } from '@/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/ui/dropdown-menu';
import { Input } from '@/ui/input';
import { Progress } from '@/ui/progress';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, } from '@/ui/pagination';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/ui/dialog';
import { Label } from '@/ui/label';
import { Switch } from '@/ui/switch';
import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/ui/LanguageProvider';
import { toast } from 'sonner';
import { EditKnowledgeBaseDialog } from './EditKnowledgeBaseDialog';
import { CreateKnowledgeBaseDialog } from './CreateKnowledgeBaseDialog';

interface KnowledgeBaseItem {
  id: number;
  name: string;
  description: string;
  icon: string;
  iconBg: string;
  documentCount: string;
  size: string;
  status: '已启用' | '禁用';
  statusColor: string;
  enabled: boolean;
  visibility?: string;
  createdTime?: string;
  creator?: string;
  updateTime?: string;
  tags?: string[];
}

interface DocumentItem {
  id: number;
  name: string;
  type: 'PDF' | 'Word' | 'Text';
  typeColor: string;
  typeIcon: string;
  size: string;
  status: '已启用' | '禁用' | '处理中';
  statusColor: string;
  enabled: boolean;
  uploadTime: string;
}

interface UploadFile {
  id: string;
  file: File;
  name: string;
  size: number;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
}

export function KnowledgeBase() {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [selectedKnowledgeBase, setSelectedKnowledgeBase] = useState<number | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [viewingKB, setViewingKB] = useState<KnowledgeBaseItem | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingKB, setEditingKB] = useState<KnowledgeBaseItem | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [documentPage, setDocumentPage] = useState(1);
  const documentsPerPage = 6;

  // 文件上传相关状态
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);
  const uploadIntervalsRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

  // 清理所有上传任务的定时器
  useEffect(() => {
    return () => {
      uploadIntervalsRef.current.forEach(interval => clearInterval(interval));
      uploadIntervalsRef.current.clear();
    };
  }, []);

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
    return colors[index];
  };

  // 统计数据
  const stats = [
    {
      label: '知识库数量',
      value: '10',
      subtext: '累计创建数 15个',
      icon: Database,
      iconBg: 'bg-blue-500',
      trend: '+25%',
      trendUp: true,
    },
    {
      label: '文档总量',
      value: '234',
      subtext: '总大小：4.8 GB',
      icon: FileText,
      iconBg: 'bg-green-500',
      trend: '+30%',
      trendUp: true,
    },
    {
      label: '今日查询',
      value: '298',
      subtext: '相较昨日增长 12%',
      icon: Eye,
      iconBg: 'bg-orange-500',
      trend: '+12%',
      trendUp: true,
    },
    {
      label: '存储空间',
      value: '4.8GB / 100GB',
      subtext: '已使用 4.8%',
      icon: Database,
      iconBg: 'bg-purple-500',
      progress: 4.8,
      showProgress: true,
      trend: '+520.3MB',
      trendUp: true,
    },
  ];

  const handleAction = (action: string, name: string) => {
    toast.success(`${action}: ${name}`);
  };

  // 知识库启用/禁用处理
  const [knowledgeBases, setKnowledgeBases] = useState<KnowledgeBaseItem[]>([
    {
      id: 1,
      name: '产品文档',
      description: '公司所有产品的使用说明和技术文档',
      icon: '📘',
      iconBg: 'bg-blue-50 dark:bg-blue-900/20',
      documentCount: '24',
      size: '456 MB',
      status: '已启用',
      statusColor: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      enabled: true,
      visibility: 'team',
      createdTime: '2023-08-15 10:30',
      creator: '张三',
      updateTime: '2023-10-20',
      tags: ['产品', '文档', '技术'],
    },
    {
      id: 2,
      name: '培训资料',
      description: '新员工培训及各类培训资料汇总',
      icon: '📚',
      iconBg: 'bg-green-50 dark:bg-green-900/20',
      documentCount: '13',
      size: '312 MB',
      status: '已启用',
      statusColor: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      enabled: true,
      visibility: 'private',
      createdTime: '2023-09-01 14:20',
      creator: '李四',
      updateTime: '2023-10-18',
      tags: ['培训', '入职'],
    },
    {
      id: 3,
      name: '市场分析',
      description: '市场调研报告和竞品分析文档',
      icon: '📊',
      iconBg: 'bg-orange-50 dark:bg-orange-900/20',
      documentCount: '7',
      size: '703 MB',
      status: '禁用',
      statusColor: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400',
      enabled: false,
      visibility: 'public',
      createdTime: '2023-07-20 09:15',
      creator: '王五',
      updateTime: '2023-10-15',
      tags: ['市场', '分析', '竞品'],
    },
    {
      id: 4,
      name: '客户服务手册',
      description: '客服团队使用的标准操作流程和常见问题',
      icon: '💬',
      iconBg: 'bg-purple-50 dark:bg-purple-900/20',
      documentCount: '18',
      size: '285 MB',
      status: '已启用',
      statusColor: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      enabled: true,
      visibility: 'team',
      createdTime: '2023-08-05 11:00',
      creator: '赵六',
      updateTime: '2023-10-22',
      tags: ['客服', '流程'],
    },
    {
      id: 5,
      name: '技术规范',
      description: '开发团队的编码规范和技术标准文档',
      icon: '⚙️',
      iconBg: 'bg-cyan-50 dark:bg-cyan-900/20',
      documentCount: '31',
      size: '520 MB',
      status: '已启用',
      statusColor: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      enabled: true,
      visibility: 'private',
      createdTime: '2023-07-10 15:45',
      creator: '孙七',
      updateTime: '2023-10-21',
      tags: ['技术', '编码', '规范', '标准'],
    },
    {
      id: 6,
      name: '财务制度',
      description: '公司财务管理制度和报销流程',
      icon: '💰',
      iconBg: 'bg-yellow-50 dark:bg-yellow-900/20',
      documentCount: '9',
      size: '156 MB',
      status: '已启用',
      statusColor: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      enabled: true,
      visibility: 'team',
      createdTime: '2023-06-25 13:30',
      creator: '周八',
      updateTime: '2023-10-10',
      tags: ['财务', '报销'],
    },
    {
      id: 7,
      name: '法律合规',
      description: '法律法规和合规性要求文档',
      icon: '⚖️',
      iconBg: 'bg-red-50 dark:bg-red-900/20',
      documentCount: '15',
      size: '428 MB',
      status: '已启用',
      statusColor: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      enabled: true,
      visibility: 'private',
      createdTime: '2023-08-20 16:00',
      creator: '吴九',
      updateTime: '2023-10-19',
      tags: ['法律', '合规'],
    },
    {
      id: 8,
      name: '行业研究',
      description: '行业趋势分析和研究报告',
      icon: '📈',
      iconBg: 'bg-indigo-50 dark:bg-indigo-900/20',
      documentCount: '42',
      size: '1.2 GB',
      status: '已启用',
      statusColor: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      enabled: true,
      visibility: 'public',
      createdTime: '2023-09-10 10:15',
      creator: '郑十',
      updateTime: '2023-10-23',
      tags: ['行业', '研究', '趋势'],
    },
    {
      id: 9,
      name: '安全规范',
      description: '信息安全和数据保护相关文档',
      icon: '🔒',
      iconBg: 'bg-pink-50 dark:bg-pink-900/20',
      documentCount: '21',
      size: '380 MB',
      status: '禁用',
      statusColor: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400',
      enabled: false,
      visibility: 'private',
      createdTime: '2023-07-05 14:30',
      creator: '钱十一',
      updateTime: '2023-10-16',
      tags: ['安全', '数据保护'],
    },
    {
      id: 10,
      name: '项目案例',
      description: '成功项目案例和最佳实践分享',
      icon: '🎯',
      iconBg: 'bg-teal-50 dark:bg-teal-900/20',
      documentCount: '54',
      size: '890 MB',
      status: '已启用',
      statusColor: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      enabled: true,
      visibility: 'team',
      createdTime: '2023-09-25 09:45',
      creator: '孙十二',
      updateTime: '2023-10-24',
      tags: ['项目', '案例', '实践'],
    },
  ]);

  const handleToggleKB = (id: number) => {
    setKnowledgeBases(prev =>
      prev.map(kb => {
        if (kb.id === id) {
          const newEnabled = !kb.enabled;
          return {
            ...kb,
            enabled: newEnabled,
            status: newEnabled ? '已启用' : '禁用',
            statusColor: newEnabled
              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
              : 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400',
          };
        }
        return kb;
      })
    );
  };

  // 文档列表状态
  const [documents, setDocuments] = useState<DocumentItem[]>([
    {
      id: 1,
      name: '产品功能说明书.pdf',
      type: 'PDF',
      typeColor: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
      typeIcon: '📄',
      size: '2.4 MB',
      status: '已启用',
      statusColor: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      enabled: true,
      uploadTime: '2023-10-15 16:30',
    },
    {
      id: 2,
      name: '用户使用指南.docx',
      type: 'Word',
      typeColor: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      typeIcon: '📘',
      size: '1.8 MB',
      status: '处理中',
      statusColor: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
      enabled: false,
      uploadTime: '2023-10-14 08:45',
    },
    {
      id: 3,
      name: 'API接口文档.pdf',
      type: 'PDF',
      typeColor: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
      typeIcon: '📄',
      size: '3.1 MB',
      status: '已启用',
      statusColor: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      enabled: true,
      uploadTime: '2023-10-13 11:20',
    },
    {
      id: 4,
      name: '安装配置手册.pdf',
      type: 'PDF',
      typeColor: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
      typeIcon: '📄',
      size: '1.5 MB',
      status: '已启用',
      statusColor: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      enabled: true,
      uploadTime: '2023-10-12 14:15',
    },
    {
      id: 5,
      name: '常见问题FAQ.docx',
      type: 'Word',
      typeColor: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      typeIcon: '📘',
      size: '980 KB',
      status: '禁用',
      statusColor: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400',
      enabled: false,
      uploadTime: '2023-10-11 10:30',
    },
    {
      id: 6,
      name: '开发者指南.pdf',
      type: 'PDF',
      typeColor: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
      typeIcon: '📄',
      size: '4.2 MB',
      status: '已启用',
      statusColor: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      enabled: true,
      uploadTime: '2023-10-10 09:00',
    },
    {
      id: 7,
      name: '系统架构说明.pdf',
      type: 'PDF',
      typeColor: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
      typeIcon: '📄',
      size: '3.6 MB',
      status: '已启用',
      statusColor: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      enabled: true,
      uploadTime: '2023-10-09 16:45',
    },
    {
      id: 8,
      name: '数据库设计文档.txt',
      type: 'Text',
      typeColor: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400',
      typeIcon: '📝',
      size: '256 KB',
      status: '处理中',
      statusColor: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
      enabled: false,
      uploadTime: '2023-10-08 13:20',
    },
    {
      id: 9,
      name: '版本更新日志.txt',
      type: 'Text',
      typeColor: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400',
      typeIcon: '📝',
      size: '128 KB',
      status: '已启用',
      statusColor: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      enabled: true,
      uploadTime: '2023-10-07 11:10',
    },
    {
      id: 10,
      name: '性能测试报告.docx',
      type: 'Word',
      typeColor: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      typeIcon: '📘',
      size: '2.1 MB',
      status: '禁用',
      statusColor: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400',
      enabled: false,
      uploadTime: '2023-10-06 15:00',
    },
  ]);

  // 文档启用/禁用处理
  const handleToggleDocument = (id: number) => {
    setDocuments(prev =>
      prev.map(doc => {
        if (doc.id === id && doc.status !== '处理中') {
          const newEnabled = !doc.enabled;
          return {
            ...doc,
            enabled: newEnabled,
            status: newEnabled ? '已启用' : '禁用',
            statusColor: newEnabled
              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
              : 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400',
          };
        }
        return doc;
      })
    );
  };

  // 重新解析文档
  const handleReparse = (doc: DocumentItem) => {
    toast.info(`正在重新解析文档: ${doc.name}`);
    setDocuments(prev =>
      prev.map(d => {
        if (d.id === doc.id) {
          return {
            ...d,
            status: '处理中',
            statusColor: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
            enabled: false,
          };
        }
        return d;
      })
    );

    // 模拟处理完成
    setTimeout(() => {
      setDocuments(prev =>
        prev.map(d => {
          if (d.id === doc.id) {
            return {
              ...d,
              status: '已启用',
              statusColor: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
              enabled: true,
            };
          }
          return d;
        })
      );
      toast.success(`文档 ${doc.name} 解析完成`);
    }, 3000);
  };

  // 删除文档
  const handleDeleteDocument = (doc: DocumentItem) => {
    setDocuments(prev => prev.filter(d => d.id !== doc.id));
    toast.success(`已删除文档: ${doc.name}`);
  };

  const handleView = (kb: KnowledgeBaseItem) => {
    setViewingKB(kb);
    setViewDialogOpen(true);
  };

  const handleEdit = (kb: KnowledgeBaseItem) => {
    setEditingKB(kb);
    setEditDialogOpen(true);
  };

  // 文件上传处理函数
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const handleFiles = (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const maxSize = 100 * 1024 * 1024; // 100MB
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
    ];

    const newFiles: UploadFile[] = fileArray
      .filter(file => {
        if (file.size > maxSize) {
          toast.error(
            `${t('knowledgeUpload.fileAdded')} ${file.name} ${t('knowledgeUpload.fileSizeExceeded')} (100MB)`
          );
          return false;
        }
        if (!allowedTypes.includes(file.type)) {
          toast.error(`${t('knowledgeUpload.fileAdded')} ${file.name} ${t('knowledgeUpload.fileFormatNotSupported')}`);
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

    if (newFiles.length > 0) {
      setUploadFiles(prev => [...prev, ...newFiles]);
      toast.success(`${t('knowledgeUpload.fileAdded')} ${newFiles.length} ${t('knowledgeUpload.filesCount')}`);

      // 自动开始上传 - 传递文件名用于成功提示
      newFiles.forEach(uploadFile => {
        simulateUpload(uploadFile.id, uploadFile.name);
      });
    }
  };

  const simulateUpload = (fileId: string, fileName: string) => {
    setUploadFiles(prev => prev.map(f => (f.id === fileId ? { ...f, status: 'uploading' as const } : f)));

    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 30;
      if (progress >= 100) {
        progress = 100;
        const currentInterval = uploadIntervalsRef.current.get(fileId);
        if (currentInterval) {
          clearInterval(currentInterval);
          uploadIntervalsRef.current.delete(fileId);
        }

        setUploadFiles(prev =>
          prev.map(f => (f.id === fileId ? { ...f, progress: 100, status: 'success' as const } : f))
        );

        // 使用传入的文件名，避免闭包问题
        toast.success(`${fileName} ${t('knowledgeUpload.uploadSuccess')}`);
      } else {
        setUploadFiles(prev => prev.map(f => (f.id === fileId ? { ...f, progress } : f)));
      }
    }, 500);

    // 保存 interval 引用以便清理
    uploadIntervalsRef.current.set(fileId, interval);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFiles(files);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  const handleSelectFiles = () => {
    fileInputRef.current?.click();
  };

  const handleSelectFolder = () => {
    folderInputRef.current?.click();
  };

  const removeFile = (fileId: string) => {
    // 清理该文件的上传定时器
    const interval = uploadIntervalsRef.current.get(fileId);
    if (interval) {
      clearInterval(interval);
      uploadIntervalsRef.current.delete(fileId);
    }

    setUploadFiles(prev => prev.filter(f => f.id !== fileId));
    toast.info(t('knowledgeUpload.fileRemoved'));
  };

  const clearAllFiles = () => {
    // 清理所有上传定时器
    uploadIntervalsRef.current.forEach(interval => clearInterval(interval));
    uploadIntervalsRef.current.clear();

    setUploadFiles([]);
    toast.info(t('knowledgeUpload.listCleared'));
  };

  // 过滤知识库
  const filteredKnowledgeBases = knowledgeBases.filter(kb => {
    const searchLower = searchQuery.toLowerCase();
    return kb.name.toLowerCase().includes(searchLower) || kb.description.toLowerCase().includes(searchLower);
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
        <h1 className='text-2xl mb-1 dark:text-white'>知识库</h1>
        <p className='text-sm text-gray-600 dark:text-gray-400'>智能化知识库管理，用于AI助手知识增强</p>
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
              placeholder='搜索知识库名称、描述或文档...'
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
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
                <DropdownMenuItem className='dark:text-gray-300'>最近创建</DropdownMenuItem>
                <DropdownMenuItem className='dark:text-gray-300'>文档数量</DropdownMenuItem>
                <DropdownMenuItem className='dark:text-gray-300'>存储大小</DropdownMenuItem>
                <DropdownMenuItem className='dark:text-gray-300'>按名称排序</DropdownMenuItem>
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
              创建知识库
            </Button>
          </div>
        </div>

        {/* Empty State */}
        {filteredKnowledgeBases.length === 0 && (
          <div className='text-center py-12'>
            <Database className='w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-3' />
            <p className='text-gray-600 dark:text-gray-400'>未找到匹配的知识库</p>
            <p className='text-sm text-gray-500 dark:text-gray-500 mt-1'>
              {searchQuery ? '尝试使用其他搜索词' : '暂无知识库'}
            </p>
          </div>
        )}

        {/* Grid View */}
        {viewMode === 'grid' && filteredKnowledgeBases.length > 0 && (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {currentKnowledgeBases.map(kb => (
              <Card
                key={kb.id}
                className={`p-5 hover:shadow-md transition-all cursor-pointer ${
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
                          onCheckedChange={checked => {
                            handleToggleKB(kb.id);
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
                      <DropdownMenuItem onClick={() => handleView(kb)} className='dark:text-gray-300'>
                        <Eye className='w-4 h-4 mr-2' />
                        查看
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEdit(kb)} className='dark:text-gray-300'>
                        <Edit className='w-4 h-4 mr-2' />
                        编辑
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleAction('下载', kb.name)} className='dark:text-gray-300'>
                        <Download className='w-4 h-4 mr-2' />
                        导出
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleAction('删除', kb.name)}
                        className='text-red-600 dark:text-red-400'
                      >
                        <Trash2 className='w-4 h-4 mr-2' />
                        删除
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <p className='text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2'>{kb.description}</p>

                {/* 标签 */}
                {kb.tags && kb.tags.length > 0 && (
                  <div className='flex flex-wrap gap-2 mb-4'>
                    {kb.tags.map((tag, index) => (
                      <Badge key={index} variant='secondary' className={`${getTagColor(tag)} text-xs`}>
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}

                <div className='grid grid-cols-2 gap-4 pt-4 border-t border-gray-100 dark:border-gray-700'>
                  <div>
                    <div className='text-xs text-gray-500 dark:text-gray-400 mb-1'>文档数</div>
                    <div className='dark:text-white'>{kb.documentCount}</div>
                  </div>
                  <div>
                    <div className='text-xs text-gray-500 dark:text-gray-400 mb-1'>大小</div>
                    <div className='dark:text-white'>{kb.size}</div>
                  </div>
                </div>

                {/* 附加信息 */}
                {kb.visibility && (
                  <div className='mt-3 pt-3 border-t border-gray-100 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400'>
                    <div className='flex items-center justify-between'>
                      <span>
                        可见性: {kb.visibility === 'team' ? '团队' : kb.visibility === 'private' ? '私有' : '公开'}
                      </span>
                      <span>{kb.updateTime}</span>
                    </div>
                    {kb.creator && <div className='mt-1'>创建者: {kb.creator}</div>}
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
                    <th className='px-5 py-3 text-left text-xs text-gray-500 dark:text-gray-400'>知识库</th>
                    <th className='px-5 py-3 text-left text-xs text-gray-500 dark:text-gray-400'>描述</th>
                    <th className='px-5 py-3 text-left text-xs text-gray-500 dark:text-gray-400'>文档数</th>
                    <th className='px-5 py-3 text-left text-xs text-gray-500 dark:text-gray-400'>大小</th>
                    <th className='px-5 py-3 text-left text-xs text-gray-500 dark:text-gray-400'>状态</th>
                    <th className='px-5 py-3 text-left text-xs text-gray-500 dark:text-gray-400'>可见性</th>
                    <th className='px-5 py-3 text-left text-xs text-gray-500 dark:text-gray-400'>更新时间</th>
                    <th className='px-5 py-3 text-right text-xs text-gray-500 dark:text-gray-400'>操作</th>
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
                            onCheckedChange={() => handleToggleKB(kb.id)}
                            className='data-[state=checked]:bg-blue-500'
                          />
                        </div>
                      </td>
                      <td className='px-5 py-4'>
                        <div className='text-sm dark:text-white'>
                          {kb.visibility === 'team' ? '团队' : kb.visibility === 'private' ? '私有' : '公开'}
                        </div>
                      </td>
                      <td className='px-5 py-4'>
                        <div className='text-sm text-gray-600 dark:text-gray-400'>{kb.updateTime}</div>
                      </td>
                      <td className='px-5 py-4 text-right' onClick={e => e.stopPropagation()}>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant='ghost' size='sm' className='dark:text-gray-400'>
                              <MoreHorizontal className='w-4 h-4' />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align='end' className='dark:bg-gray-800 dark:border-gray-700'>
                            <DropdownMenuItem onClick={() => handleView(kb)} className='dark:text-gray-300'>
                              <Eye className='w-4 h-4 mr-2' />
                              查看
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEdit(kb)} className='dark:text-gray-300'>
                              <Edit className='w-4 h-4 mr-2' />
                              编辑
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleAction('下载', kb.name)}
                              className='dark:text-gray-300'
                            >
                              <Download className='w-4 h-4 mr-2' />
                              导出
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleAction('删除', kb.name)}
                              className='text-red-600 dark:text-red-400'
                            >
                              <Trash2 className='w-4 h-4 mr-2' />
                              删除
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
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
                  {selectedKB.description} · {selectedKB.documentCount} 个文档 · {selectedKB.size}
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
                上传文档
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
                    {t('knowledgeUpload.supportedFormats')} · {t('knowledgeUpload.maxFileSize')}
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
                文档列表
              </h3>
              <Card className='dark:bg-gray-800 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm'>
                <div className='p-5 border-b border-gray-200 dark:border-gray-700'>
                  <div className='flex items-center justify-between'>
                    <h4 className='dark:text-white'>已上传文档</h4>
                    <span className='text-sm text-gray-500 dark:text-gray-400'>{documents.length} 个文档</span>
                  </div>
                </div>

                <div className='divide-y divide-gray-100 dark:divide-gray-700'>
                  {documents.slice((documentPage - 1) * documentsPerPage, documentPage * documentsPerPage).map(doc => (
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
                            disabled={doc.status === '处理中'}
                            className='data-[state=checked]:bg-blue-500'
                          />
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant='ghost' size='sm' className='dark:text-gray-400'>
                                <MoreHorizontal className='w-4 h-4' />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align='end' className='dark:bg-gray-800 dark:border-gray-700'>
                              <DropdownMenuItem
                                onClick={() => handleAction('查看', doc.name)}
                                className='dark:text-gray-300'
                              >
                                <Eye className='w-4 h-4 mr-2' />
                                查看
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleReparse(doc)} className='dark:text-gray-300'>
                                <RefreshCw className='w-4 h-4 mr-2' />
                                重新解析
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleAction('下载', doc.name)}
                                className='dark:text-gray-300'
                              >
                                <Download className='w-4 h-4 mr-2' />
                                下载
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDeleteDocument(doc)}
                                className='text-red-600 dark:text-red-400'
                              >
                                <Trash2 className='w-4 h-4 mr-2' />
                                删除
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Document Pagination */}
                {documents.length > documentsPerPage && (
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
                            length: Math.ceil(documents.length / documentsPerPage),
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
                              setDocumentPage(prev =>
                                Math.min(Math.ceil(documents.length / documentsPerPage), prev + 1)
                              )
                            }
                            className={
                              documentPage === Math.ceil(documents.length / documentsPerPage)
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
            <DialogTitle className='dark:text-white'>知识库详情</DialogTitle>
            <DialogDescription className='dark:text-gray-400'>查看知识库的详细信息</DialogDescription>
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
                  <label className='text-sm text-gray-600 dark:text-gray-400'>描述</label>
                  <p className='text-sm dark:text-white mt-1'>{viewingKB.description}</p>
                </div>

                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <label className='text-sm text-gray-600 dark:text-gray-400'>文档数量</label>
                    <p className='text-sm dark:text-white mt-1'>{viewingKB.documentCount} 个</p>
                  </div>
                  <div>
                    <label className='text-sm text-gray-600 dark:text-gray-400'>存储大小</label>
                    <p className='text-sm dark:text-white mt-1'>{viewingKB.size}</p>
                  </div>
                </div>

                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <label className='text-sm text-gray-600 dark:text-gray-400'>可见性</label>
                    <p className='text-sm dark:text-white mt-1'>
                      {viewingKB.visibility === 'team' ? '团队' : viewingKB.visibility === 'private' ? '私有' : '公开'}
                    </p>
                  </div>
                  <div>
                    <label className='text-sm text-gray-600 dark:text-gray-400'>创建者</label>
                    <p className='text-sm dark:text-white mt-1'>{viewingKB.creator}</p>
                  </div>
                </div>

                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <label className='text-sm text-gray-600 dark:text-gray-400'>创建时间</label>
                    <p className='text-sm dark:text-white mt-1'>{viewingKB.createdTime}</p>
                  </div>
                  <div>
                    <label className='text-sm text-gray-600 dark:text-gray-400'>更新时间</label>
                    <p className='text-sm dark:text-white mt-1'>{viewingKB.updateTime}</p>
                  </div>
                </div>

                {viewingKB.tags && viewingKB.tags.length > 0 && (
                  <div>
                    <label className='text-sm text-gray-600 dark:text-gray-400'>标签</label>
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
        knowledgeBase={editingKB}
        onSave={updated => {
          setKnowledgeBases(prev => prev.map(kb => (kb.id === updated.id ? updated : kb)));
          toast.success('知识库更新成功');
        }}
      />

      {/* Create Dialog */}
      <CreateKnowledgeBaseDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSave={newKB => {
          setKnowledgeBases(prev => [...prev, newKB]);
          toast.success('知识库创建成功');
        }}
      />
    </div>
  );
}
