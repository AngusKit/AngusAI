import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import Sharing from '@/services/Sharing.ts';
import type { ResourceSharingListVo } from '@/services/SharingTypes.ts';
import {
  ResourceTypeEnum,
  MemberPermissionEnum,
  SharedWithEnum,
} from '@/enums/enums.ts';
import { useDebounce } from '@/hooks/useDebounce.ts';
import {
  getResourceIcon,
  getResourceIconBg,
  getResourceIconColor,
  formatDate,
  getPermissionBadge,
} from '../utils/resourceSharingUtils.ts';

/** 页面展示用的共享资源项（与接口字段映射后） */
export interface SharedResource {
  id: string;
  name: string;
  type: ResourceTypeEnum;
  icon: ReturnType<typeof getResourceIcon>;
  iconBg: string;
  iconColor: string;
  owner: string;
  sharedWith: SharedWithEnum;
  memberCount: number;
  permission: MemberPermissionEnum;
  lastShared: string;
  views: number;
  edits: number;
  createdDate: string;
  enabled?: boolean;
}

/** 团队成员（指定成员共享时使用，暂无成员列表接口，暂用模拟数据） */
export interface TeamMember {
  id: number;
  name: string;
  email: string;
  avatar: string;
  selected: boolean;
}

/** 页面筛选类型与接口类型的映射 */
const TYPE_MAP: Record<string, ResourceTypeEnum> = {
  '应用': ResourceTypeEnum.APPLICATION,
  '知识库': ResourceTypeEnum.KNOWLEDGE,
  '工作流': ResourceTypeEnum.WORKFLOW,
  '模型': ResourceTypeEnum.MODEL,
  '数据集': ResourceTypeEnum.DATASET,
};

const PERMISSION_MAP: Record<string, MemberPermissionEnum> = {
  view: MemberPermissionEnum.VIEW,
  edit: MemberPermissionEnum.EDIT,
  manage: MemberPermissionEnum.MANAGE,
};

/** 资源共享主逻辑 Hook */
export function useResourceSharing() {
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const [typeFilter, setTypeFilter] = useState('all');
  const [permissionFilter, setPermissionFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [isLoading, setIsLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [resources, setResources] = useState<SharedResource[]>([]);

  /** 共享弹窗相关状态 */
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [shareType, setShareType] = useState<SharedWithEnum>(SharedWithEnum.ALL);
  const [sharePermission, setSharePermission] = useState<MemberPermissionEnum>(
    MemberPermissionEnum.VIEW
  );
  const [selectedResourceType, setSelectedResourceType] = useState<
    ResourceTypeEnum | ''
  >('');
  const [selectedResourceId, setSelectedResourceId] = useState('');

  /** 团队成员列表（后端无获取成员列表接口，暂用模拟数据） */
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    { id: 1, name: '张伟', email: 'zhangwei@example.com', avatar: 'ZW', selected: false },
    { id: 2, name: '李娜', email: 'lina@example.com', avatar: 'LN', selected: false },
    { id: 3, name: '王芳', email: 'wangfang@example.com', avatar: 'WF', selected: false },
    { id: 4, name: '刘强', email: 'liuqiang@example.com', avatar: 'LQ', selected: false },
    { id: 5, name: '陈静', email: 'chenjing@example.com', avatar: 'CJ', selected: false },
    { id: 6, name: '赵磊', email: 'zhaolei@example.com', avatar: 'ZL', selected: false },
  ]);

  /** 从接口加载资源共享列表（注意：后端 ResourceSharingFindDto 无 keyword 字段） */
  const loadResourceSharingList = useCallback(async () => {
    setIsLoading(true);
    try {
      const queryParams: Record<string, unknown> = {
        pageNo: currentPage,
        pageSize: itemsPerPage,
      };

      if (typeFilter !== 'all') {
        queryParams.type = TYPE_MAP[typeFilter];
      }
      if (permissionFilter !== 'all') {
        queryParams.permission = PERMISSION_MAP[permissionFilter];
      }

      const response = await Sharing.getResourceSharingList(queryParams);
      const responseData = (response as { data?: { list?: ResourceSharingListVo[]; total?: number } })
        ?.data;
      const listData = responseData?.list;
      const total = responseData?.total ?? 0;
      setTotalCount(total);

      if (Array.isArray(listData)) {
        const mappedList: SharedResource[] = listData.map(
          (item: ResourceSharingListVo) => ({
            id: item.id ?? '',
            name: item.resourceName ?? '',
            type: (item.resourceType as ResourceTypeEnum) ?? ResourceTypeEnum.APPLICATION,
            icon: getResourceIcon(item.resourceType as ResourceTypeEnum),
            iconBg: getResourceIconBg(item.resourceType as ResourceTypeEnum),
            iconColor: getResourceIconColor(item.resourceType as ResourceTypeEnum),
            owner: item.ownerName ?? '',
            sharedWith: (item.sharedWith as SharedWithEnum) ?? SharedWithEnum.ALL,
            memberCount: item.memberCount ?? 0,
            permission:
              (item.permission as MemberPermissionEnum) ?? MemberPermissionEnum.VIEW,
            lastShared: formatDate(item.modifiedDate ?? item.createdDate),
            views: item.views ?? 0,
            edits: item.edits ?? 0,
            createdDate: item.createdDate ?? '',
            enabled: item.enabled,
          })
        );
        setResources(mappedList);
      } else {
        setResources([]);
      }
    } catch (error: unknown) {
      const err = error as { data?: { message?: string }; message?: string };
      console.error('Failed to load resource sharing list:', error);
      toast.error(err?.data?.message || err?.message || '加载资源共享列表失败');
      setResources([]);
      setTotalCount(0);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, typeFilter, permissionFilter]);

  useEffect(() => {
    loadResourceSharingList();
  }, [loadResourceSharingList]);

  /** 对当前页数据进行客户端关键字过滤（后端接口不支持 keyword） */
  const filteredResources = debouncedSearchQuery.trim()
    ? resources.filter(
        (r) =>
          r.name
            .toLowerCase()
            .includes(debouncedSearchQuery.trim().toLowerCase()) ||
          r.owner.toLowerCase().includes(debouncedSearchQuery.trim().toLowerCase())
      )
    : resources;

  /** 创建资源共享 */
  const handleShare = useCallback(
    async (params: {
      resourceId: string;
      resourceType: ResourceTypeEnum;
      sharedWith: SharedWithEnum;
      permission: MemberPermissionEnum;
      memberIds?: string[];
      resourceName?: string;
    }) => {
      try {
        await Sharing.createResourceSharing({
          resourceId: params.resourceId,
          resourceType: params.resourceType,
          sharedWith: params.sharedWith,
          permission: params.permission,
          memberIds: params.memberIds,
        });
        toast.success(`已将"${params.resourceName ?? params.resourceId}"共享成功`);
        setShareDialogOpen(false);
        setTeamMembers((prev) => prev.map((m) => ({ ...m, selected: false })));
        setSelectedResourceType('');
        setSelectedResourceId('');
        setShareType(SharedWithEnum.ALL);
        setSharePermission(MemberPermissionEnum.VIEW);
        await loadResourceSharingList();
      } catch (error: unknown) {
        const err = error as { data?: { message?: string }; message?: string };
        console.error('Failed to create resource sharing:', error);
        toast.error(err?.data?.message || err?.message || '创建资源共享失败');
      }
    },
    [loadResourceSharingList]
  );

  /** 取消资源共享 */
  const handleRemoveSharing = useCallback(
    async (resource: SharedResource) => {
      try {
        await Sharing.deleteResourceSharing(resource.id);
        toast.success(`已停止共享: ${resource.name}`);
        await loadResourceSharingList();
      } catch (error: unknown) {
        const err = error as { data?: { message?: string }; message?: string };
        console.error('Failed to delete resource sharing:', error);
        toast.error(err?.data?.message || err?.message || '停止共享失败');
      }
    },
    [loadResourceSharingList]
  );

  /** 修改共享权限 */
  const handleChangePermission = useCallback(
    async (resource: SharedResource, newPermission: MemberPermissionEnum) => {
      try {
        await Sharing.updateResourceSharing(resource.id, {
          sharedWith: resource.sharedWith,
          permission: newPermission,
          memberIds:
            resource.sharedWith === SharedWithEnum.SPECIFIC ? [] : undefined,
        });
        toast.success(`已更改权限为: ${getPermissionBadge(newPermission).label}`);
        await loadResourceSharingList();
      } catch (error: unknown) {
        const err = error as { data?: { message?: string }; message?: string };
        console.error('Failed to update resource sharing:', error);
        toast.error(err?.data?.message || err?.message || '更新权限失败');
      }
    },
    [loadResourceSharingList]
  );

  /** 重置共享弹窗状态 */
  const resetShareDialog = useCallback(() => {
    setShareDialogOpen(false);
    setTeamMembers((prev) => prev.map((m) => ({ ...m, selected: false })));
    setSelectedResourceType('');
    setSelectedResourceId('');
    setShareType(SharedWithEnum.ALL);
    setSharePermission(MemberPermissionEnum.VIEW);
  }, []);

  const totalPages = Math.ceil(totalCount / itemsPerPage);
  const shouldShowPagination = totalCount > itemsPerPage;

  return {
    // 列表相关
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
    resources: filteredResources,
    totalPages,
    shouldShowPagination,
    loadResourceSharingList,
    // 共享弹窗相关
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
  };
}
