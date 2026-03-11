import { useEffect, useState } from 'react';
import {
  Share2,
  Search,
  Filter,
  TrendingUp,
  Edit,
  Plus,
  Shield,
} from 'lucide-react';
import { Button } from '@/components/ui/button.tsx';
import { Card } from '@/components/ui/card.tsx';
import { Input } from '@/components/ui/input.tsx';
import { XcanPagination } from '@/components/ui/pagination.tsx';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select.tsx';
import { toast } from 'sonner';
import {
  ResourceTypeEnum,
  MemberPermissionEnum,
  SharedWithEnum,
} from '@/enums/enums.ts';
import { useDebounce } from '@/hooks/useDebounce.ts';
import { useResourceSharing } from './hooks/useResourceSharing.ts';
import { useAvailableResources } from './hooks/useAvailableResources.ts';
import { EmptyState } from './components/EmptyState.tsx';
import { ResourceTable } from './components/ResourceTable.tsx';
import { ResourceTableSkeleton } from './components/ResourceTableSkeleton.tsx';
import { ShareResourceDialog } from './components/ShareResourceDialog.tsx';

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
      <ShareResourceDialog
        open={shareDialogOpen}
        onOpenChange={(v) => {
          setShareDialogOpen(v);
          if (!v) {
            resetShareDialog();
            setResourceSearchKeyword('');
          }
        }}
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
          setShareDialogOpen(false);
        }}
        onConfirm={onConfirmShare}
      />
    </div>
  );
}
