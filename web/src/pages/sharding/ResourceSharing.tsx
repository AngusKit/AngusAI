import { useEffect, useState } from 'react';
import {
  Share2,
  Search,
  Filter,
  Workflow,
  Database,
  Zap,
  FileText,
  Trash2,
  MoreHorizontal,
  TrendingUp,
  Edit,
  Globe,
  UserCheck,
  Plus,
  Shield,
  Eye,
} from 'lucide-react';
import { Button } from '@/components/ui/button.tsx';
import { Card } from '@/components/ui/card.tsx';
import { Skeleton } from '@/components/ui/skeleton.tsx';
import { Badge } from '@/components/ui/badge.tsx';
import { Input } from '@/components/ui/input.tsx';
import { XcanPagination } from '@/components/ui/pagination.tsx';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select.tsx';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog.tsx';
import { Label } from '@/components/ui/label.tsx';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu.tsx';
import { Checkbox } from '@/components/ui/checkbox.tsx';
import { toast } from 'sonner';
import {
  ResourceTypeEnum,
  MemberPermissionEnum,
  SharedWithEnum,
} from '@/enums/enums.ts';
import { getEnumDescription } from '@/enums/utils.ts';
import { useDebounce } from '@/hooks/useDebounce.ts';
import { useResourceSharing } from './hooks/useResourceSharing.ts';
import { useAvailableResources } from './hooks/useAvailableResources.ts';
import {
  mapResourceTypeToDisplay,
  getPermissionBadge,
} from './utils/resourceSharingUtils.ts';

/**
 * 资源共享页面
 * 功能：管理团队资源共享、权限设置、查看访问统计
 */
export function ResourceSharing() {
  const {
    searchQuery,
    setSearchQuery,
    typeFilter,
    setTypeFilter,
    permissionFilter,
    setPermissionFilter,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    isLoading,
    totalCount,
    resources,
    shouldShowPagination,
    shareDialogOpen,
    setShareDialogOpen,
    shareType,
    setShareType,
    sharePermission,
    setSharePermission,
    selectedResourceType,
    setSelectedResourceType,
    selectedResourceId,
    setSelectedResourceId,
    teamMembers,
    setTeamMembers,
    handleShare,
    handleRemoveSharing,
    handleChangePermission,
    resetShareDialog,
  } = useResourceSharing();

  const { availableResources, loading: resourcesLoading, loadResourcesByType } =
    useAvailableResources();

  /** 共享弹窗内资源搜索关键字 */
  const [resourceSearchKeyword, setResourceSearchKeyword] = useState('');
  const debouncedResourceKeyword = useDebounce(resourceSearchKeyword, 400);

  /** 弹窗关闭时清空搜索关键字 */
  useEffect(() => {
    if (!shareDialogOpen) setResourceSearchKeyword('');
  }, [shareDialogOpen]);

  /** 选择资源类型或关键字变化时，加载可共享资源（使用 keyword 调用接口） */
  useEffect(() => {
    if (selectedResourceType && shareDialogOpen) {
      loadResourcesByType(
        selectedResourceType as ResourceTypeEnum,
        debouncedResourceKeyword
      );
    }
  }, [
    selectedResourceType,
    shareDialogOpen,
    debouncedResourceKeyword,
    loadResourcesByType,
  ]);

  /** 确认共享：校验并调用创建接口 */
  const onConfirmShare = async () => {
    if (!selectedResourceType) {
      toast.error('请选择资源类型');
      return;
    }
    if (!selectedResourceId) {
      toast.error('请选择资源');
      return;
    }
    if (shareType === SharedWithEnum.SPECIFIC) {
      const selectedCount = teamMembers.filter((m) => m.selected).length;
      if (selectedCount === 0) {
        toast.error('请至少选择一个成员');
        return;
      }
    }

    const memberIds =
      shareType === SharedWithEnum.SPECIFIC
        ? teamMembers.filter((m) => m.selected).map((m) => String(m.id))
        : undefined;

    const resourceName = availableResources[
      selectedResourceType as ResourceTypeEnum
    ]?.find((r) => r.id === selectedResourceId)?.name;

    await handleShare({
      resourceId: selectedResourceId,
      resourceType: selectedResourceType as ResourceTypeEnum,
      sharedWith: shareType,
      permission: sharePermission,
      memberIds,
      resourceName,
    });
  };

  /** 统计数据（从当前页列表聚合，总访问量、编辑次数等） */
  const stats = [
    {
      label: '共享资源',
      value: totalCount,
      subtext: `${resources.filter((r) => r.sharedWith === SharedWithEnum.ALL).length} 个全员共享`,
      icon: Share2,
      color: 'text-blue-600',
    },
    {
      label: '总访问量',
      value: resources.reduce((sum, r) => sum + r.views, 0),
      subtext: '当前页统计',
      icon: TrendingUp,
      color: 'text-green-600',
    },
    {
      label: '编辑次数',
      value: resources.reduce((sum, r) => sum + r.edits, 0),
      subtext: '当前页统计',
      icon: Edit,
      color: 'text-orange-600',
    },
    {
      label: '平均权限',
      value: '编辑',
      subtext: '大多数资源可编辑',
      icon: Shield,
      color: 'text-purple-600',
    },
  ];

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div>
        <h1 className="text-2xl mb-1 dark:text-white">资源共享</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          管理团队资源共享和权限设置
        </p>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card
              key={index}
              className="p-5 dark:bg-gray-800 dark:border-gray-700"
            >
              <div className="flex items-start justify-between mb-3">
                <div
                  className={`p-2 rounded-lg bg-gray-100 dark:bg-gray-700 ${stat.color}`}
                >
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div className="text-base text-gray-600 dark:text-gray-400 mb-0.5">
                {stat.label}
              </div>
              <div className="text-3xl dark:text-white mb-0.5">{stat.value}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {stat.subtext}
              </div>
            </Card>
          );
        })}
      </div>

      {/* 筛选与操作栏 */}
      <div className="flex items-center justify-between gap-3">
        <div className="relative w-[390px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="搜索共享资源（当前页内过滤）..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 dark:bg-gray-800 dark:border-gray-700"
          />
        </div>

        <div className="flex items-center gap-3">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[140px] dark:bg-gray-800 dark:border-gray-700">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="资源类型" />
            </SelectTrigger>
            <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
              <SelectItem value="all">全部类型</SelectItem>
              <SelectItem value="应用">应用</SelectItem>
              <SelectItem value="知识库">知识库</SelectItem>
              <SelectItem value="工作流">工作流</SelectItem>
              <SelectItem value="模型">模型</SelectItem>
              <SelectItem value="数据集">数据集</SelectItem>
            </SelectContent>
          </Select>

          <Select value={permissionFilter} onValueChange={setPermissionFilter}>
            <SelectTrigger className="w-[140px] dark:bg-gray-800 dark:border-gray-700">
              <SelectValue placeholder="权限筛选" />
            </SelectTrigger>
            <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
              <SelectItem value="all">全部权限</SelectItem>
              <SelectItem value="view">查看</SelectItem>
              <SelectItem value="edit">编辑</SelectItem>
              <SelectItem value="manage">管理</SelectItem>
            </SelectContent>
          </Select>

          <Button
            onClick={() => setShareDialogOpen(true)}
            className="bg-blue-500 hover:bg-blue-600"
          >
            <Plus className="w-4 h-4 mr-2" />
            共享资源
          </Button>
        </div>
      </div>

      {/* 资源列表表格 */}
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        {isLoading ? (
          <ResourceTableSkeleton />
        ) : resources.length === 0 ? (
          <EmptyState />
        ) : (
          <ResourceTable
            resources={resources}
            onRemove={handleRemoveSharing}
            onChangePermission={handleChangePermission}
            getPermissionBadge={getPermissionBadge}
            mapResourceTypeToDisplay={mapResourceTypeToDisplay}
          />
        )}

        {/* 分页 */}
        {!isLoading && shouldShowPagination && (
          <div className="flex items-center justify-center px-6 py-4 border-t border-gray-200 dark:border-gray-700">
            <XcanPagination
              total={totalCount}
              pageNo={currentPage}
              pageSize={itemsPerPage}
              onChange={({ pageNo }) => setCurrentPage(pageNo)}
            />
          </div>
        )}
      </Card>

      {/* 共享资源弹窗 */}
      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent className="dark:bg-gray-800 dark:border-gray-700 sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="dark:text-white">共享资源</DialogTitle>
            <DialogDescription className="dark:text-gray-400">
              选择共享范围和权限设置
            </DialogDescription>
          </DialogHeader>

          <ShareDialogContent
            selectedResourceType={selectedResourceType}
            setSelectedResourceType={(v) => {
              setSelectedResourceType(v);
              setResourceSearchKeyword('');
            }}
            selectedResourceId={selectedResourceId}
            setSelectedResourceId={setSelectedResourceId}
            resourceSearchKeyword={resourceSearchKeyword}
            setResourceSearchKeyword={setResourceSearchKeyword}
            availableResources={availableResources}
            resourcesLoading={resourcesLoading}
            shareType={shareType}
            setShareType={setShareType}
            sharePermission={sharePermission}
            setSharePermission={setSharePermission}
            teamMembers={teamMembers}
            setTeamMembers={setTeamMembers}
            onCancel={() => {
              resetShareDialog();
              setResourceSearchKeyword('');
            }}
            onConfirm={onConfirmShare}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

/** 表格加载骨架 */
function ResourceTableSkeleton() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
          <tr>
            {Array.from({ length: 8 }).map((_, i) => (
              <th
                key={i}
                className="px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400"
              />
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {Array.from({ length: 5 }).map((_, i) => (
            <tr key={i} className="border-b border-gray-200 dark:border-gray-700">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <Skeleton className="w-10 h-10 rounded-lg dark:bg-gray-700 shrink-0" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32 dark:bg-gray-700" />
                    <Skeleton className="h-3 w-24 dark:bg-gray-700" />
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <Skeleton className="h-5 w-14 rounded dark:bg-gray-700" />
              </td>
              <td className="px-6 py-4">
                <Skeleton className="h-4 w-20 dark:bg-gray-700" />
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <Skeleton className="w-4 h-4 dark:bg-gray-700" />
                  <Skeleton className="h-4 w-24 dark:bg-gray-700" />
                </div>
              </td>
              <td className="px-6 py-4">
                <Skeleton className="h-5 w-12 rounded dark:bg-gray-700" />
              </td>
              <td className="px-6 py-4">
                <div className="space-y-1">
                  <Skeleton className="h-3 w-16 dark:bg-gray-700" />
                  <Skeleton className="h-3 w-14 dark:bg-gray-700" />
                </div>
              </td>
              <td className="px-6 py-4">
                <Skeleton className="h-4 w-12 dark:bg-gray-700" />
              </td>
              <td className="px-6 py-4">
                <Skeleton className="w-8 h-8 rounded dark:bg-gray-700" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** 空状态展示 */
function EmptyState() {
  return (
    <div className="p-12 text-center">
      <Share2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg mb-2 dark:text-white">未找到共享资源</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        尝试调整搜索条件或筛选器
      </p>
    </div>
  );
}

/** 资源表格（列表主体） */
function ResourceTable({
  resources,
  onRemove,
  onChangePermission,
  getPermissionBadge,
  mapResourceTypeToDisplay,
}: {
  resources: ReturnType<typeof useResourceSharing>['resources'];
  onRemove: (r: (typeof resources)[0]) => void;
  onChangePermission: (
    r: (typeof resources)[0],
    p: MemberPermissionEnum
  ) => void;
  getPermissionBadge: typeof import('./utils/resourceSharingUtils').getPermissionBadge;
  mapResourceTypeToDisplay: typeof import('./utils/resourceSharingUtils').mapResourceTypeToDisplay;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
          <tr>
            <th className="px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400">
              资源名称
            </th>
            <th className="px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400">
              类型
            </th>
            <th className="px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400">
              所有者
            </th>
            <th className="px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400">
              共享范围
            </th>
            <th className="px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400">
              权限
            </th>
            <th className="px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400">
              使用统计
            </th>
            <th className="px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400">
              最后共享
            </th>
            <th className="px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400">
              操作
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {resources.map((resource) => {
            const Icon = resource.icon;
            const permissionBadge = getPermissionBadge(resource.permission);
            const PermissionIcon = permissionBadge.icon;

            return (
              <tr
                key={resource.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-900"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`${resource.iconBg} w-10 h-10 rounded-lg flex items-center justify-center`}
                    >
                      <Icon
                        className={`w-5 h-5 ${resource.iconColor}`}
                      />
                    </div>
                    <div>
                      <div className="dark:text-white">{resource.name}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        创建于 {resource.createdDate}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <Badge className="text-xs bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400 border-0">
                    {mapResourceTypeToDisplay(resource.type)}
                  </Badge>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                  {resource.owner}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {resource.sharedWith === SharedWithEnum.ALL ? (
                      <>
                        <Globe className="w-4 h-4 text-blue-500" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          全部成员 ({resource.memberCount})
                        </span>
                      </>
                    ) : (
                      <>
                        <UserCheck className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {resource.memberCount} 名成员
                        </span>
                      </>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <Badge
                    className={`text-xs ${permissionBadge.color} border-0 gap-1`}
                  >
                    <PermissionIcon className="w-3 h-3" />
                    {permissionBadge.label}
                  </Badge>
                </td>
                <td className="px-6 py-4">
                  <div className="text-xs">
                    <div className="text-gray-600 dark:text-gray-400">
                      <Eye className="w-3 h-3 inline mr-1" />
                      {resource.views} 次查看
                    </div>
                    <div className="text-gray-600 dark:text-gray-400">
                      <Edit className="w-3 h-3 inline mr-1" />
                      {resource.edits} 次编辑
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                  {resource.lastShared}
                </td>
                <td className="px-6 py-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                        <MoreHorizontal className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="dark:bg-gray-800 dark:border-gray-700"
                    >
                      <DropdownMenuItem
                        onClick={() =>
                          onChangePermission(resource, MemberPermissionEnum.VIEW)
                        }
                        className="dark:text-gray-300"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        设为查看权限
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          onChangePermission(resource, MemberPermissionEnum.EDIT)
                        }
                        className="dark:text-gray-300"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        设为编辑权限
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          onChangePermission(
                            resource,
                            MemberPermissionEnum.MANAGE
                          )
                        }
                        className="dark:text-gray-300"
                      >
                        <Shield className="w-4 h-4 mr-2" />
                        设为管理权限
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onRemove(resource)}
                        className="text-red-600 dark:text-red-400"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        停止共享
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/** 共享弹窗内容区 */
function ShareDialogContent({
  selectedResourceType,
  setSelectedResourceType,
  selectedResourceId,
  setSelectedResourceId,
  resourceSearchKeyword,
  setResourceSearchKeyword,
  availableResources,
  resourcesLoading,
  shareType,
  setShareType,
  sharePermission,
  setSharePermission,
  teamMembers,
  setTeamMembers,
  onCancel,
  onConfirm,
}: {
  selectedResourceType: string;
  setSelectedResourceType: (v: ResourceTypeEnum | '') => void;
  selectedResourceId: string;
  setSelectedResourceId: (v: string) => void;
  resourceSearchKeyword: string;
  setResourceSearchKeyword: (v: string) => void;
  availableResources: ReturnType<
    typeof useAvailableResources
  >['availableResources'];
  resourcesLoading: boolean;
  shareType: SharedWithEnum;
  setShareType: (v: SharedWithEnum) => void;
  sharePermission: MemberPermissionEnum;
  setSharePermission: (v: MemberPermissionEnum) => void;
  teamMembers: ReturnType<typeof useResourceSharing>['teamMembers'];
  setTeamMembers: React.Dispatch<
    React.SetStateAction<ReturnType<typeof useResourceSharing>['teamMembers']>
  >;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="space-y-6">
      {/* 资源类型选择 */}
      <div className="space-y-2">
        <Label className="dark:text-gray-300">资源类型 *</Label>
        <Select
          value={selectedResourceType}
          onValueChange={(value) => {
            setSelectedResourceType(value as ResourceTypeEnum);
            setSelectedResourceId('');
          }}
        >
          <SelectTrigger className="dark:bg-gray-900 dark:border-gray-700 dark:text-white">
            <SelectValue placeholder="请选择资源类型" />
          </SelectTrigger>
          <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
            <SelectItem value={ResourceTypeEnum.APPLICATION} className="dark:text-white">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-blue-500" />
                {getEnumDescription(
                  ResourceTypeEnum,
                  ResourceTypeEnum.APPLICATION
                )}
              </div>
            </SelectItem>
            <SelectItem value={ResourceTypeEnum.KNOWLEDGE} className="dark:text-white">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-purple-500" />
                {getEnumDescription(
                  ResourceTypeEnum,
                  ResourceTypeEnum.KNOWLEDGE
                )}
              </div>
            </SelectItem>
            <SelectItem value={ResourceTypeEnum.WORKFLOW} className="dark:text-white">
              <div className="flex items-center gap-2">
                <Workflow className="w-4 h-4 text-green-500" />
                {getEnumDescription(
                  ResourceTypeEnum,
                  ResourceTypeEnum.WORKFLOW
                )}
              </div>
            </SelectItem>
            <SelectItem value={ResourceTypeEnum.MODEL} className="dark:text-white">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-orange-500" />
                {getEnumDescription(ResourceTypeEnum, ResourceTypeEnum.MODEL)}
              </div>
            </SelectItem>
            <SelectItem value={ResourceTypeEnum.DATASET} className="dark:text-white">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-pink-500" />
                {getEnumDescription(
                  ResourceTypeEnum,
                  ResourceTypeEnum.DATASET
                )}
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 资源搜索与选择（选择类型后支持按 keyword 搜索） */}
      {selectedResourceType && (
        <div className="space-y-2">
          <Label className="dark:text-gray-300">资源名称 *</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="输入关键字搜索资源..."
              value={resourceSearchKeyword}
              onChange={(e) => setResourceSearchKeyword(e.target.value)}
              className="pl-9 mb-2 dark:bg-gray-900 dark:border-gray-700 dark:text-white"
            />
          </div>
          <Select
            value={selectedResourceId}
            onValueChange={setSelectedResourceId}
            disabled={resourcesLoading}
          >
            <SelectTrigger className="dark:bg-gray-900 dark:border-gray-700 dark:text-white">
              <SelectValue
                placeholder={
                  resourcesLoading ? '加载中...' : '请选择要共享的资源'
                }
              />
            </SelectTrigger>
            <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
              {(availableResources[
                selectedResourceType as ResourceTypeEnum
              ] ?? []).map((resource) => {
                const Icon = resource.icon;
                return (
                  <SelectItem
                    key={resource.id}
                    value={resource.id}
                    className="dark:text-white"
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4" />
                      {resource.name}
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* 共享范围 */}
      <div className="space-y-2">
        <Label className="dark:text-gray-300">共享范围 *</Label>
        <div className="grid grid-cols-2 gap-3">
          <Card
            className={`p-4 cursor-pointer transition-all ${
              shareType === SharedWithEnum.ALL
                ? 'border-blue-500 dark:border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'dark:bg-gray-900 dark:border-gray-700'
            }`}
            onClick={() => setShareType(SharedWithEnum.ALL)}
          >
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-blue-500" />
              <div>
                <div className="dark:text-white">全部成员</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  所有团队成员可访问
                </div>
              </div>
            </div>
          </Card>

          <Card
            className={`p-4 cursor-pointer transition-all ${
              shareType === SharedWithEnum.SPECIFIC
                ? 'border-blue-500 dark:border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'dark:bg-gray-900 dark:border-gray-700'
            }`}
            onClick={() => setShareType(SharedWithEnum.SPECIFIC)}
          >
            <div className="flex items-center gap-3">
              <UserCheck className="w-5 h-5 text-green-500" />
              <div>
                <div className="dark:text-white">指定成员</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  选择特定成员访问
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* 指定成员时展示成员选择 */}
      {shareType === SharedWithEnum.SPECIFIC && (
        <div className="space-y-2">
          <Label className="dark:text-gray-300">选择成员</Label>
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 max-h-[200px] overflow-y-auto space-y-2">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className="flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-900 rounded"
              >
                <Checkbox
                  checked={member.selected}
                  onCheckedChange={(checked) => {
                    setTeamMembers(
                      teamMembers.map((m) =>
                        m.id === member.id
                          ? { ...m, selected: checked as boolean }
                          : m
                      )
                    );
                  }}
                />
                <div className="flex items-center gap-2 flex-1">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 flex items-center justify-center text-xs">
                    {member.avatar}
                  </div>
                  <div>
                    <div className="text-sm dark:text-white">{member.name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {member.email}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            已选择 {teamMembers.filter((m) => m.selected).length} 名成员
          </div>
        </div>
      )}

      {/* 权限设置 */}
      <div className="space-y-2">
        <Label htmlFor="share-permission" className="dark:text-gray-300">
          权限设置 *
        </Label>
        <Select
          value={sharePermission}
          onValueChange={(value) =>
            setSharePermission(value as MemberPermissionEnum)
          }
        >
          <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
            <SelectItem value={MemberPermissionEnum.VIEW}>
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                <div>
                  <div>查看</div>
                  <div className="text-xs text-gray-500">仅可查看资源内容</div>
                </div>
              </div>
            </SelectItem>
            <SelectItem value={MemberPermissionEnum.EDIT}>
              <div className="flex items-center gap-2">
                <Edit className="w-4 h-4" />
                <div>
                  <div>编辑</div>
                  <div className="text-xs text-gray-500">可查看和编辑资源</div>
                </div>
              </div>
            </SelectItem>
            <SelectItem value={MemberPermissionEnum.MANAGE}>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <div>
                  <div>管理</div>
                  <div className="text-xs text-gray-500">完整管理权限</div>
                </div>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DialogFooter>
        <Button
          variant="outline"
          onClick={onCancel}
          className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
        >
          取消
        </Button>
        <Button onClick={onConfirm} className="bg-blue-500 hover:bg-blue-600">
          <Share2 className="w-4 h-4 mr-2" />
          确认共享
        </Button>
      </DialogFooter>
    </div>
  );
}
