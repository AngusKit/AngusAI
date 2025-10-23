import { useState } from 'react';
import {
  Key,
  Plus,
  Copy,
  Eye,
  EyeOff,
  Trash2,
  MoreVertical,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  Shield,
  Code,
  RefreshCw,
  Settings,
  Zap,
  GitBranch,
  Database,
  BookOpen,
  Package,
  Bot,
} from 'lucide-react';
import { useLanguage } from '../layout/LanguageProvider';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Checkbox } from '../ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';
import { toast } from 'sonner';
import { copyToClipboard } from '../../lib/clipboard';

type ResourceType =
  | 'application'
  | 'workflow'
  | 'dataset'
  | 'knowledge'
  | 'plugin'
  | 'model';

interface AuthorizedResource {
  type: ResourceType;
  ids: string[]; // 选中的资源ID，空数组表示全部
}

interface APIKey {
  id: number;
  name: string;
  key: string;
  keyVisible: string;
  status: 'active' | 'inactive' | 'expired';
  created: string;
  lastUsed: string;
  expiresAt: string;
  permissions: string[];
  authorizedResources: AuthorizedResource[];
  usageCount: number;
  rateLimit: string;
}

export function APIKeys() {
  const { t } = useLanguage();
  const [apiKeys, setApiKeys] = useState<APIKey[]>([
    {
      id: 1,
      name: '全权限API密钥',
      key: 'sk-abc123def456ghi789jkl012mno345pqr678stu901',
      keyVisible: 'sk-abc123***********',
      status: 'active',
      created: '2024-01-15',
      lastUsed: '2分钟前',
      expiresAt: '2025-01-15',
      permissions: ['read', 'write', 'delete'],
      authorizedResources: [
        { type: 'application', ids: [] },
        { type: 'workflow', ids: [] },
        { type: 'dataset', ids: [] },
        { type: 'knowledge', ids: [] },
        { type: 'plugin', ids: [] },
        { type: 'model', ids: [] },
      ],
      usageCount: 25690,
      rateLimit: '1000/分钟',
    },
    {
      id: 2,
      name: '应用与工作流密钥',
      key: 'sk-xyz789abc123def456ghi789jkl012mno345pqr678',
      keyVisible: 'sk-xyz789***********',
      status: 'active',
      created: '2024-02-20',
      lastUsed: '3天前',
      expiresAt: '2025-02-20',
      permissions: ['read', 'write'],
      authorizedResources: [
        { type: 'application', ids: ['app-1', 'app-2'] },
        { type: 'workflow', ids: [] },
      ],
      usageCount: 8432,
      rateLimit: '500/分钟',
    },
    {
      id: 3,
      name: '只读数据密钥',
      key: 'sk-mno345pqr678stu901vwx234yz567abc890def123',
      keyVisible: 'sk-mno345***********',
      status: 'active',
      created: '2024-03-10',
      lastUsed: '1小时前',
      expiresAt: '2025-03-10',
      permissions: ['read'],
      authorizedResources: [
        { type: 'dataset', ids: [] },
        { type: 'knowledge', ids: [] },
      ],
      usageCount: 3216,
      rateLimit: '100/分钟',
    },
    {
      id: 4,
      name: '已过期的密钥',
      key: 'sk-old123old456old789old012old345old678old901',
      keyVisible: 'sk-old123***********',
      status: 'expired',
      created: '2023-10-01',
      lastUsed: '30天前',
      expiresAt: '2024-10-01',
      permissions: ['read', 'write'],
      authorizedResources: [{ type: 'application', ids: [] }],
      usageCount: 45230,
      rateLimit: '1000/分钟',
    },
  ]);

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedKeyId, setSelectedKeyId] = useState<number | null>(null);
  const [visibleKeys, setVisibleKeys] = useState<Set<number>>(new Set());
  const [newKeyData, setNewKeyData] = useState({
    name: '',
    expiresIn: '365',
    permissions: ['read'] as string[],
    authorizedResources: [] as ResourceType[],
    rateLimit: '100',
  });

  const handleCreateKey = () => {
    const randomKey =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);
    const newKey: APIKey = {
      id: apiKeys.length + 1,
      name: newKeyData.name,
      key: `sk-${randomKey}`,
      keyVisible: `sk-${randomKey.substring(0, 6)}***********`,
      status: 'active',
      created: new Date().toLocaleDateString('zh-CN'),
      lastUsed: '从未使用',
      expiresAt:
        newKeyData.expiresIn === 'never'
          ? '永不过期'
          : new Date(
              Date.now() + parseInt(newKeyData.expiresIn) * 24 * 60 * 60 * 1000
            ).toLocaleDateString('zh-CN'),
      permissions: newKeyData.permissions,
      authorizedResources: newKeyData.authorizedResources.map(type => ({
        type,
        ids: [],
      })),
      usageCount: 0,
      rateLimit: `${newKeyData.rateLimit}/分钟`,
    };
    setApiKeys([newKey, ...apiKeys]);
    setShowCreateDialog(false);
    setNewKeyData({
      name: '',
      expiresIn: '365',
      permissions: ['read'],
      authorizedResources: [],
      rateLimit: '100',
    });
    toast.success('API密钥创建成功');
  };

  const handleDeleteKey = () => {
    if (selectedKeyId) {
      setApiKeys(apiKeys.filter(key => key.id !== selectedKeyId));
      toast.success('API密钥已删除');
    }
    setShowDeleteDialog(false);
    setSelectedKeyId(null);
  };

  const handleRevokeKey = (id: number) => {
    setApiKeys(
      apiKeys.map(key =>
        key.id === id ? { ...key, status: 'inactive' as const } : key
      )
    );
    toast.success('API密钥已撤销');
  };

  const handleCopyKey = async (key: string) => {
    const success = await copyToClipboard(key);
    if (success) {
      toast.success('API密钥已复制到剪贴板');
    } else {
      toast.error('复制失败');
    }
  };

  const toggleKeyVisibility = (id: number) => {
    const newVisibleKeys = new Set(visibleKeys);
    if (newVisibleKeys.has(id)) {
      newVisibleKeys.delete(id);
    } else {
      newVisibleKeys.add(id);
    }
    setVisibleKeys(newVisibleKeys);
  };

  const handlePermissionToggle = (permission: string) => {
    const newPermissions = newKeyData.permissions.includes(permission)
      ? newKeyData.permissions.filter(p => p !== permission)
      : [...newKeyData.permissions, permission];
    setNewKeyData({ ...newKeyData, permissions: newPermissions });
  };

  const handleResourceToggle = (resource: ResourceType) => {
    const newResources = newKeyData.authorizedResources.includes(resource)
      ? newKeyData.authorizedResources.filter(r => r !== resource)
      : [...newKeyData.authorizedResources, resource];
    setNewKeyData({ ...newKeyData, authorizedResources: newResources });
  };

  const getResourceIcon = (type: ResourceType) => {
    switch (type) {
      case 'application':
        return Zap;
      case 'workflow':
        return GitBranch;
      case 'dataset':
        return Database;
      case 'knowledge':
        return BookOpen;
      case 'plugin':
        return Package;
      case 'model':
        return Bot;
    }
  };

  const getResourceLabel = (type: ResourceType) => {
    switch (type) {
      case 'application':
        return '应用';
      case 'workflow':
        return '工作流';
      case 'dataset':
        return '数据集';
      case 'knowledge':
        return '知识库';
      case 'plugin':
        return '插件';
      case 'model':
        return '模型';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'inactive':
        return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400';
      case 'expired':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className='w-3 h-3' />;
      case 'inactive':
        return <XCircle className='w-3 h-3' />;
      case 'expired':
        return <AlertCircle className='w-3 h-3' />;
      default:
        return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return t('apiKeys.active');
      case 'inactive':
        return t('apiKeys.inactive');
      case 'expired':
        return t('apiKeys.expired');
      default:
        return status;
    }
  };

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
        <div>
          <h1 className='text-2xl dark:text-white mb-2'>
            {t('apiKeys.title')}
          </h1>
          <p className='text-sm text-gray-600 dark:text-gray-400'>
            {t('apiKeys.subtitle')}
          </p>
        </div>
        <Button
          onClick={() => setShowCreateDialog(true)}
          className='bg-blue-500 hover:bg-blue-600'
        >
          <Plus className='w-4 h-4 mr-2' />
          创建新密钥
        </Button>
      </div>

      {/* Info Card */}
      <Card className='p-4 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'>
        <div className='flex items-start gap-3'>
          <Shield className='w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0' />
          <div className='text-sm text-blue-600 dark:text-blue-400'>
            <p className='mb-2'>安全提示：</p>
            <ul className='list-disc list-inside space-y-1 ml-2'>
              <li>请妥善保管您的API密钥，不要在公开代码中暴露</li>
              <li>定期轮换密钥以提高安全性</li>
              <li>根据实际需求选择授权资源，遵循最小权限原则</li>
              <li>设置适当的权限和速率限制</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* API Keys List */}
      <div className='space-y-4'>
        {apiKeys.map(key => (
          <Card
            key={key.id}
            className='p-6 dark:bg-gray-800 dark:border-gray-700'
          >
            <div className='space-y-4'>
              {/* Header */}
              <div className='flex items-start justify-between'>
                <div className='flex items-center gap-3'>
                  <div className='p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30'>
                    <Key className='w-5 h-5 text-blue-600 dark:text-blue-400' />
                  </div>
                  <div>
                    <h3 className='dark:text-white mb-1'>{key.name}</h3>
                    <div className='flex items-center gap-2'>
                      <Badge
                        className={`${getStatusColor(key.status)} border-0 text-xs`}
                      >
                        {getStatusIcon(key.status)}
                        {getStatusText(key.status)}
                      </Badge>
                    </div>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant='ghost' size='sm' className='h-8 w-8 p-0'>
                      <MoreVertical className='w-4 h-4' />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align='end'
                    className='dark:bg-gray-800 dark:border-gray-700'
                  >
                    <DropdownMenuItem
                      onClick={() => handleCopyKey(key.key)}
                      className='cursor-pointer'
                    >
                      <Copy className='w-4 h-4 mr-2' />
                      复制密钥
                    </DropdownMenuItem>
                    {key.status === 'active' && (
                      <DropdownMenuItem
                        onClick={() => handleRevokeKey(key.id)}
                        className='cursor-pointer'
                      >
                        <XCircle className='w-4 h-4 mr-2' />
                        撤销密钥
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => {
                        setSelectedKeyId(key.id);
                        setShowDeleteDialog(true);
                      }}
                      className='cursor-pointer text-red-600 dark:text-red-400'
                    >
                      <Trash2 className='w-4 h-4 mr-2' />
                      删除密钥
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Key Display */}
              <div className='flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg'>
                <code className='flex-1 text-sm font-mono dark:text-gray-300'>
                  {visibleKeys.has(key.id) ? key.key : key.keyVisible}
                </code>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={() => toggleKeyVisibility(key.id)}
                  className='h-8 w-8 p-0'
                >
                  {visibleKeys.has(key.id) ? (
                    <EyeOff className='w-4 h-4' />
                  ) : (
                    <Eye className='w-4 h-4' />
                  )}
                </Button>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={() => handleCopyKey(key.key)}
                  className='h-8 w-8 p-0'
                >
                  <Copy className='w-4 h-4' />
                </Button>
              </div>

              {/* Stats */}
              <div className='grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700'>
                <div>
                  <div className='text-xs text-gray-500 dark:text-gray-400 mb-1'>
                    创建时间
                  </div>
                  <div className='text-sm dark:text-gray-300'>
                    {key.created}
                  </div>
                </div>
                <div>
                  <div className='text-xs text-gray-500 dark:text-gray-400 mb-1'>
                    最后使用
                  </div>
                  <div className='text-sm dark:text-gray-300'>
                    {key.lastUsed}
                  </div>
                </div>
                <div>
                  <div className='text-xs text-gray-500 dark:text-gray-400 mb-1'>
                    过期时间
                  </div>
                  <div className='text-sm dark:text-gray-300'>
                    {key.expiresAt}
                  </div>
                </div>
                <div>
                  <div className='text-xs text-gray-500 dark:text-gray-400 mb-1'>
                    使用次数
                  </div>
                  <div className='text-sm dark:text-gray-300'>
                    {key.usageCount.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Permissions and Rate Limit */}
              <div className='space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700'>
                <div className='flex items-center gap-2'>
                  <Shield className='w-4 h-4 text-gray-400' />
                  <span className='text-sm text-gray-600 dark:text-gray-400'>
                    权限:
                  </span>
                  <div className='flex gap-1'>
                    {key.permissions.map(perm => (
                      <Badge
                        key={perm}
                        variant='outline'
                        className='text-xs dark:border-gray-600'
                      >
                        {perm}
                      </Badge>
                    ))}
                  </div>
                  <Clock className='w-4 h-4 text-gray-400 ml-4' />
                  <span className='text-sm text-gray-600 dark:text-gray-400'>
                    速率限制: {key.rateLimit}
                  </span>
                </div>

                {/* Authorized Resources */}
                {key.authorizedResources.length > 0 && (
                  <div className='flex items-start gap-2'>
                    <Shield className='w-4 h-4 text-gray-400 mt-0.5' />
                    <span className='text-sm text-gray-600 dark:text-gray-400'>
                      授权资源:
                    </span>
                    <div className='flex flex-wrap gap-1.5'>
                      {key.authorizedResources.map(resource => {
                        const Icon = getResourceIcon(resource.type);
                        return (
                          <Badge
                            key={resource.type}
                            variant='outline'
                            className='text-xs dark:border-gray-600 flex items-center gap-1'
                          >
                            <Icon className='w-3 h-3' />
                            {getResourceLabel(resource.type)}
                            {resource.ids.length > 0 && (
                              <span className='text-xs text-gray-500'>
                                ({resource.ids.length})
                              </span>
                            )}
                          </Badge>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* API Documentation */}
      <Card className='p-6 dark:bg-gray-800 dark:border-gray-700'>
        <div className='flex items-center gap-3 mb-6'>
          <div className='p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30'>
            <Code className='w-5 h-5 text-purple-600 dark:text-purple-400' />
          </div>
          <div>
            <h2 className='text-lg dark:text-white'>API使用文档</h2>
            <p className='text-sm text-gray-600 dark:text-gray-400'>
              了解如何在您的应用中使用API密钥
            </p>
          </div>
        </div>

        <div className='space-y-4'>
          <div>
            <Label className='dark:text-gray-300 text-sm mb-2 block'>
              1. 设置认证头
            </Label>
            <div className='bg-gray-900 rounded-lg p-4 overflow-x-auto'>
              <pre className='text-sm text-gray-100'>
                {`Authorization: Bearer YOUR_API_KEY`}
              </pre>
            </div>
          </div>

          <div>
            <Label className='dark:text-gray-300 text-sm mb-2 block'>
              2. 发起API请求
            </Label>
            <div className='bg-gray-900 rounded-lg p-4 overflow-x-auto'>
              <pre className='text-sm text-gray-100'>
                {`curl -X POST https://api.angusai.com/v1/chat/completions \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "gpt-4",
    "messages": [
      {"role": "user", "content": "Hello!"}
    ]
  }'`}
              </pre>
            </div>
          </div>

          <div>
            <Label className='dark:text-gray-300 text-sm mb-2 block'>
              3. 处理响应
            </Label>
            <div className='bg-gray-900 rounded-lg p-4 overflow-x-auto'>
              <pre className='text-sm text-gray-100'>
                {`{
  "id": "chatcmpl-123",
  "object": "chat.completion",
  "created": 1677652288,
  "choices": [{
    "message": {
      "role": "assistant",
      "content": "Hello! How can I help you?"
    },
    "finish_reason": "stop"
  }]
}`}
              </pre>
            </div>
          </div>
        </div>
      </Card>

      {/* Create Key Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className='dark:bg-gray-800 dark:border-gray-700'>
          <DialogHeader>
            <DialogTitle className='dark:text-white'>
              创建新的API密钥
            </DialogTitle>
            <DialogDescription className='dark:text-gray-400'>
              配置新密钥的名称、权限和授权资源
            </DialogDescription>
          </DialogHeader>

          <div className='space-y-4 py-4 max-h-[60vh] overflow-y-auto'>
            <div className='space-y-2'>
              <Label htmlFor='key-name' className='dark:text-gray-300'>
                密钥名称
              </Label>
              <Input
                id='key-name'
                value={newKeyData.name}
                onChange={e =>
                  setNewKeyData({ ...newKeyData, name: e.target.value })
                }
                placeholder='例如: 全权限API密钥'
                className='dark:bg-gray-700 dark:border-gray-600'
              />
            </div>

            <div className='space-y-2'>
              <Label className='dark:text-gray-300'>API权限</Label>
              <div className='flex gap-2'>
                {['read', 'write', 'delete'].map(perm => (
                  <Button
                    key={perm}
                    type='button'
                    variant={
                      newKeyData.permissions.includes(perm)
                        ? 'default'
                        : 'outline'
                    }
                    size='sm'
                    onClick={() => handlePermissionToggle(perm)}
                    className={
                      newKeyData.permissions.includes(perm) ? 'bg-blue-500' : ''
                    }
                  >
                    {perm}
                  </Button>
                ))}
              </div>
            </div>

            <div className='space-y-3'>
              <div className='flex items-center justify-between'>
                <Label className='dark:text-gray-300'>授权资源</Label>
                <Button
                  type='button'
                  variant='ghost'
                  size='sm'
                  onClick={() => {
                    const allResources: ResourceType[] = [
                      'application',
                      'workflow',
                      'dataset',
                      'knowledge',
                      'plugin',
                      'model',
                    ];
                    setNewKeyData({
                      ...newKeyData,
                      authorizedResources:
                        newKeyData.authorizedResources.length === 6
                          ? []
                          : allResources,
                    });
                  }}
                  className='text-xs h-7'
                >
                  {newKeyData.authorizedResources.length === 6
                    ? '取消全选'
                    : '全选'}
                </Button>
              </div>
              <div className='flex items-start gap-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800'>
                <AlertCircle className='w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0' />
                <p className='text-xs text-blue-600 dark:text-blue-400'>
                  选择此密钥可以访问的资源类型。至少需要选择一种资源类型才能创建密钥。
                </p>
              </div>
              <div className='grid grid-cols-2 gap-3'>
                {(
                  [
                    'application',
                    'workflow',
                    'dataset',
                    'knowledge',
                    'plugin',
                    'model',
                  ] as ResourceType[]
                ).map(resource => {
                  const Icon = getResourceIcon(resource);
                  const isSelected =
                    newKeyData.authorizedResources.includes(resource);
                  return (
                    <div
                      key={resource}
                      onClick={() => handleResourceToggle(resource)}
                      className={`
                        flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all
                        ${
                          isSelected
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                        }
                      `}
                    >
                      <div
                        className={`
                        p-2 rounded-lg
                        ${
                          isSelected
                            ? 'bg-blue-100 dark:bg-blue-900/30'
                            : 'bg-gray-100 dark:bg-gray-800'
                        }
                      `}
                      >
                        <Icon
                          className={`w-4 h-4 ${isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'}`}
                        />
                      </div>
                      <div className='flex-1'>
                        <div
                          className={`text-sm ${isSelected ? 'text-blue-900 dark:text-blue-100' : 'dark:text-gray-300'}`}
                        >
                          {getResourceLabel(resource)}
                        </div>
                      </div>
                      <Checkbox
                        checked={isSelected}
                        className={isSelected ? 'border-blue-500' : ''}
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='rate-limit' className='dark:text-gray-300'>
                速率限制（请求/分钟）
              </Label>
              <Input
                id='rate-limit'
                type='number'
                value={newKeyData.rateLimit}
                onChange={e =>
                  setNewKeyData({ ...newKeyData, rateLimit: e.target.value })
                }
                className='dark:bg-gray-700 dark:border-gray-600'
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='expires' className='dark:text-gray-300'>
                有效期（天）
              </Label>
              <Select
                value={newKeyData.expiresIn}
                onValueChange={value =>
                  setNewKeyData({ ...newKeyData, expiresIn: value })
                }
              >
                <SelectTrigger className='dark:bg-gray-700 dark:border-gray-600'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className='dark:bg-gray-800 dark:border-gray-700'>
                  <SelectItem value='30'>30天</SelectItem>
                  <SelectItem value='90'>90天</SelectItem>
                  <SelectItem value='180'>180天</SelectItem>
                  <SelectItem value='365'>1年</SelectItem>
                  <SelectItem value='never'>永不过期</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => setShowCreateDialog(false)}
            >
              取消
            </Button>
            <Button
              onClick={handleCreateKey}
              className='bg-blue-500 hover:bg-blue-600'
              disabled={
                !newKeyData.name ||
                newKeyData.permissions.length === 0 ||
                newKeyData.authorizedResources.length === 0
              }
            >
              创建密钥
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className='dark:bg-gray-800 dark:border-gray-700'>
          <AlertDialogHeader>
            <AlertDialogTitle className='dark:text-white'>
              确认删除
            </AlertDialogTitle>
            <AlertDialogDescription className='dark:text-gray-400'>
              此操作无法撤销。删除后，使用此密钥的所有API请求都将失败。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteKey}
              className='bg-red-500 hover:bg-red-600'
            >
              删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
