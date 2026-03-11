import {
  Share2,
  Workflow,
  Database,
  Zap,
  FileText,
  Globe,
  UserCheck,
  Edit,
  Shield,
  Eye,
} from 'lucide-react';
import { Button } from '@/components/ui/button.tsx';
import { Card } from '@/components/ui/card.tsx';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select.tsx';
import { Checkbox } from '@/components/ui/checkbox.tsx';
import {
  ResourceTypeEnum,
  MemberPermissionEnum,
  SharedWithEnum,
} from '@/enums/enums.ts';
import { getEnumDescription } from '@/enums/utils.ts';
import type { TeamMember } from '../hooks/useResourceSharing.ts';
import type { AvailableResourcesMap } from '../hooks/useAvailableResources.ts';
import { ResourceSelectCombobox } from './ResourceSelectCombobox.tsx';

export interface ShareResourceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedResourceType: string;
  setSelectedResourceType: (v: ResourceTypeEnum | '') => void;
  selectedResourceId: string;
  setSelectedResourceId: (v: string) => void;
  resourceSearchKeyword: string;
  setResourceSearchKeyword: (v: string) => void;
  availableResources: AvailableResourcesMap;
  resourcesLoading: boolean;
  shareType: SharedWithEnum;
  setShareType: (v: SharedWithEnum) => void;
  sharePermission: MemberPermissionEnum;
  setSharePermission: (v: MemberPermissionEnum) => void;
  teamMembers: TeamMember[];
  setTeamMembers: React.Dispatch<React.SetStateAction<TeamMember[]>>;
  onCancel: () => void;
  onConfirm: () => void;
}

/** 共享资源弹窗（含资源选择、共享范围、权限设置、成员选择） */
export function ShareResourceDialog({
  open,
  onOpenChange,
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
}: ShareResourceDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="dark:bg-gray-800 dark:border-gray-700 sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="dark:text-white">共享资源</DialogTitle>
          <DialogDescription className="dark:text-gray-400">
            选择共享范围和权限设置
          </DialogDescription>
        </DialogHeader>

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
                    {getEnumDescription(
                      ResourceTypeEnum,
                      ResourceTypeEnum.MODEL
                    )}
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

          {/* 资源名称（搜索 + 选择合并为一个 Combobox） */}
          {selectedResourceType && (
            <div className="space-y-2">
              <Label className="dark:text-gray-300">资源名称 *</Label>
              <ResourceSelectCombobox
                selectedResourceId={selectedResourceId}
                setSelectedResourceId={setSelectedResourceId}
                resourceSearchKeyword={resourceSearchKeyword}
                setResourceSearchKeyword={setResourceSearchKeyword}
                availableResources={
                  availableResources[
                    selectedResourceType as ResourceTypeEnum
                  ] ?? []
                }
                resourcesLoading={resourcesLoading}
              />
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
                        <div className="text-sm dark:text-white">
                          {member.name}
                        </div>
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
                      <div className="text-xs text-gray-500">
                        仅可查看资源内容
                      </div>
                    </div>
                  </div>
                </SelectItem>
                <SelectItem value={MemberPermissionEnum.EDIT}>
                  <div className="flex items-center gap-2">
                    <Edit className="w-4 h-4" />
                    <div>
                      <div>编辑</div>
                      <div className="text-xs text-gray-500">
                        可查看和编辑资源
                      </div>
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
      </DialogContent>
    </Dialog>
  );
}
