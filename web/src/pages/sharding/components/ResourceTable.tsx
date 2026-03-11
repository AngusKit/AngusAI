import {
  Trash2,
  MoreHorizontal,
  Edit,
  Globe,
  UserCheck,
  Shield,
  Eye,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge.tsx';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu.tsx';
import { MemberPermissionEnum, SharedWithEnum } from '@/enums/enums.ts';
import type { SharedResource } from '../hooks/useResourceSharing.ts';
import {
  getPermissionBadge,
  mapResourceTypeToDisplay,
} from '../utils.ts';

export interface ResourceTableProps {
  resources: SharedResource[];
  onRemove: (resource: SharedResource) => void;
  onChangePermission: (resource: SharedResource, permission: MemberPermissionEnum) => void;
}

/** 资源表格（列表主体） */
export function ResourceTable({
  resources,
  onRemove,
  onChangePermission,
}: ResourceTableProps) {
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
                      <Icon className={`w-5 h-5 ${resource.iconColor}`} />
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
