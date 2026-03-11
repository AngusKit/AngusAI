import { useState, useCallback } from 'react';
import type { LucideIcon } from 'lucide-react';
import Applications from '@/services/Applications.ts';
import KnowledgeBases from '@/services/KnowledgeBases.ts';
import Workflows from '@/services/Workflows.ts';
import Models from '@/services/Models.ts';
import Datasets from '@/services/Datasets.ts';
import type { ApplicationListVo } from '@/services/ApplicationsTypes.ts';
import type { KnowledgeBaseListVo } from '@/services/KnowledgeBasesTypes.ts';
import type { WorkflowListVo } from '@/services/WorkflowsTypes.ts';
import type { ModelListVo } from '@/services/ModelsTypes.ts';
import type { DatasetListVo } from '@/services/DatasetsTypes.ts';
import { ResourceTypeEnum } from '@/enums/enums.ts';
import { WorkflowStatusEnum } from '@/enums/enums.ts';
import { getResourceIcon } from '../utils.ts';

/** 可共享资源项（用于弹窗选择） */
export interface AvailableResourceItem {
  id: string;
  name: string;
  icon: LucideIcon;
}

/** 可共享资源按类型分组 */
export type AvailableResourcesMap = Partial<
  Record<ResourceTypeEnum, AvailableResourceItem[]>
>;

/** 按资源类型加载可共享资源列表 */
export function useAvailableResources() {
  const [availableResources, setAvailableResources] =
    useState<AvailableResourcesMap>({});
  const [loading, setLoading] = useState(false);

  /** 根据资源类型从各服务加载可共享资源 */
  const loadResourcesByType = useCallback(
    async (resourceType: ResourceTypeEnum, keyword?: string) => {
      setLoading(true);
      try {
        const pageSize = 10;
        const search = keyword?.trim() || undefined;

        if (resourceType === ResourceTypeEnum.APPLICATION) {
          const res = await Applications.getApplicationList({
            pageNo: 1,
            pageSize,
            keyword: search,
          });
          const list =
            (res as { data?: { list?: ApplicationListVo[] } })?.data?.list ?? [];
          const items: AvailableResourceItem[] = list
            .filter((i) => i?.id != null)
            .map((i) => ({
              id: String(i.id),
              name: i.name ?? '',
              icon: getResourceIcon(ResourceTypeEnum.APPLICATION),
            }));
          setAvailableResources((prev) => ({
            ...prev,
            [ResourceTypeEnum.APPLICATION]: items,
          }));
          return items;
        }

        if (resourceType === ResourceTypeEnum.KNOWLEDGE) {
          const res = await KnowledgeBases.getKnowledgeBaseList({
            pageNo: 1,
            pageSize,
            keyword: search,
          });
          const list =
            (res as { data?: { list?: KnowledgeBaseListVo[] } })?.data?.list ??
            [];
          const items: AvailableResourceItem[] = list
            .filter((i) => i?.id != null)
            .map((i) => ({
              id: String(i.id),
              name: i.name ?? '',
              icon: getResourceIcon(ResourceTypeEnum.KNOWLEDGE),
            }));
          setAvailableResources((prev) => ({
            ...prev,
            [ResourceTypeEnum.KNOWLEDGE]: items,
          }));
          return items;
        }

        if (resourceType === ResourceTypeEnum.WORKFLOW) {
          const res = await Workflows.getWorkflowList({
            pageNo: 1,
            pageSize,
            keyword: search,
            status: WorkflowStatusEnum.RUNNING,
          });
          const list =
            (res as { data?: { list?: WorkflowListVo[] } })?.data?.list ?? [];
          const items: AvailableResourceItem[] = list
            .filter((i) => i?.id != null)
            .map((i) => ({
              id: String(i.id),
              name: i.name ?? '',
              icon: getResourceIcon(ResourceTypeEnum.WORKFLOW),
            }));
          setAvailableResources((prev) => ({
            ...prev,
            [ResourceTypeEnum.WORKFLOW]: items,
          }));
          return items;
        }

        if (resourceType === ResourceTypeEnum.MODEL) {
          const res = await Models.getModelList({
            pageNo: 1,
            pageSize,
            keyword: search,
          });
          const list =
            (res as { data?: { list?: ModelListVo[] } })?.data?.list ?? [];
          const items: AvailableResourceItem[] = list
            .filter((i) => i?.id != null)
            .map((i) => ({
              id: String(i.id),
              name: i.name ?? '',
              icon: getResourceIcon(ResourceTypeEnum.MODEL),
            }));
          setAvailableResources((prev) => ({
            ...prev,
            [ResourceTypeEnum.MODEL]: items,
          }));
          return items;
        }

        if (resourceType === ResourceTypeEnum.DATASET) {
          const res = await Datasets.getDatasetList({
            pageNo: 1,
            pageSize,
            keyword: search,
          });
          const list =
            (res as { data?: { list?: DatasetListVo[] } })?.data?.list ?? [];
          const items: AvailableResourceItem[] = list
            .filter((i) => i?.id != null)
            .map((i) => ({
              id: String(i.id),
              name: i.name ?? '',
              icon: getResourceIcon(ResourceTypeEnum.DATASET),
            }));
          setAvailableResources((prev) => ({
            ...prev,
            [ResourceTypeEnum.DATASET]: items,
          }));
          return items;
        }

        return [];
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { availableResources, loading, loadResourcesByType };
}
