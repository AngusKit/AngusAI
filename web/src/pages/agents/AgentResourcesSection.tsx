import { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Database, Zap, Code2, Check, Search, Link2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import KnowledgeBases from '@/services/KnowledgeBases';
import Datasets from '@/services/Datasets';
import Workflows from '@/services/Workflows';
import ApiCollections from '@/services/ApiCollections';
import type { KnowledgeBaseListVo } from '@/services/KnowledgeBasesTypes';
import type { DatasetListVo } from '@/services/DatasetsTypes';
import type { WorkflowListVo } from '@/services/WorkflowsTypes';
import type { ApiCollectionListVo } from '@/services/ApiCollectionsTypes';
import { WorkflowStatusEnum } from '@/enums/enums';
import { AGENT_MAX_API_COLLECTION, AGENT_MAX_DATASET, AGENT_MAX_KNOWLEDGE_BASE } from './constants';

export interface AgentResourcesFormValue {
  knowledgeBaseIds: string[];
  datasetIds: string[];
  workflowId: string | null;
  apiCollectionIds: string[];
}

interface AgentResourcesSectionProps {
  value: AgentResourcesFormValue;
  onChange: (v: AgentResourcesFormValue) => void;
}

function filterByKeyword<T extends { name?: string }>(items: T[], keyword: string): T[] {
  if (!keyword.trim()) return items;
  const k = keyword.trim().toLowerCase();
  return items.filter((i) => (i.name ?? '').toLowerCase().includes(k));
}

type ResourceType = 'knowledgeBase' | 'dataset' | 'workflow' | 'apiCollection';

export function AgentResourcesSection({ value, onChange }: AgentResourcesSectionProps) {
  const [knowledgeBases, setKnowledgeBases] = useState<KnowledgeBaseListVo[]>([]);
  const [datasets, setDatasets] = useState<DatasetListVo[]>([]);
  const [workflows, setWorkflows] = useState<WorkflowListVo[]>([]);
  const [apiCollections, setApiCollections] = useState<ApiCollectionListVo[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState<ResourceType | null>(null);
  const [dialogSearch, setDialogSearch] = useState('');

  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const [kbRes, dsRes, wfRes, apiRes] = await Promise.all([
        KnowledgeBases.getKnowledgeBaseList({ pageNo: 1, pageSize: 100 }),
        Datasets.getDatasetList({ pageNo: 1, pageSize: 100 }),
        Workflows.getWorkflowList({ pageNo: 1, pageSize: 100 }),
        ApiCollections.apiCollectionList({ pageNo: 1, pageSize: 100 }),
      ]);
      const kbData = (kbRes as any)?.data;
      const dsData = (dsRes as any)?.data;
      const wfData = (wfRes as any)?.data;
      const apiData = (apiRes as any)?.data;

      const kbList = (kbData?.list ?? []) as KnowledgeBaseListVo[];
      const dsList = (dsData?.list ?? []) as DatasetListVo[];
      const wfList = (wfData?.list ?? []) as WorkflowListVo[];
      const apiList = (apiData?.list ?? []) as ApiCollectionListVo[];
      setKnowledgeBases(kbList.filter((i): i is KnowledgeBaseListVo => i != null && i.id != null));
      setDatasets(dsList.filter((i): i is DatasetListVo => i != null && i.id != null));
      setWorkflows(wfList.filter((i): i is WorkflowListVo => i != null && i.id != null));
      setApiCollections(apiList.filter((i): i is ApiCollectionListVo => i != null && i.id != null));
    } catch (e) {
      console.error('Failed to load resources:', e);
      toast.error('加载资源失败');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const openDialog = (type: ResourceType) => {
    setDialogSearch('');
    setDialogOpen(type);
  };
  const closeDialog = () => {
    setDialogOpen(null);
    setDialogSearch('');
  };

  const toggleKnowledgeBase = (id: string) => {
    if (value.knowledgeBaseIds.includes(id)) {
      onChange({ ...value, knowledgeBaseIds: value.knowledgeBaseIds.filter((x) => x !== id) });
      return;
    }
    if (value.knowledgeBaseIds.length >= AGENT_MAX_KNOWLEDGE_BASE) {
      toast.error(`知识库最多选择 ${AGENT_MAX_KNOWLEDGE_BASE} 个`);
      return;
    }
    onChange({ ...value, knowledgeBaseIds: [...value.knowledgeBaseIds, id] });
  };

  const toggleDataset = (id: string) => {
    if (value.datasetIds.includes(id)) {
      onChange({ ...value, datasetIds: value.datasetIds.filter((x) => x !== id) });
      return;
    }
    if (value.datasetIds.length >= AGENT_MAX_DATASET) {
      toast.error(`数据集最多选择 ${AGENT_MAX_DATASET} 个`);
      return;
    }
    onChange({ ...value, datasetIds: [...value.datasetIds, id] });
  };

  const selectWorkflow = (id: string) => {
    onChange({ ...value, workflowId: value.workflowId === id ? null : id });
  };

  const toggleApiCollection = (id: string) => {
    if (value.apiCollectionIds.includes(id)) {
      onChange({ ...value, apiCollectionIds: value.apiCollectionIds.filter((x) => x !== id) });
      return;
    }
    if (value.apiCollectionIds.length >= AGENT_MAX_API_COLLECTION) {
      toast.error(`接口集最多选择 ${AGENT_MAX_API_COLLECTION} 个`);
      return;
    }
    onChange({ ...value, apiCollectionIds: [...value.apiCollectionIds, id] });
  };

  const ResourceRow = ({
    type,
    title,
    icon: Icon,
    selectedCount,
    maxCount,
    accent,
  }: {
    type: ResourceType;
    title: string;
    icon: React.ElementType;
    selectedCount: number;
    maxCount?: number;
    accent: string;
  }) => (
    <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700 last:border-0">
      <div className="flex items-center gap-3">
        <Icon className={`w-5 h-5 ${accent} shrink-0`} />
        <div>
          <span className="font-medium dark:text-white">{title}</span>
          {maxCount != null && (
            <Badge variant="secondary" className="ml-2 text-xs">
              {selectedCount}/{maxCount}
            </Badge>
          )}
          {maxCount == null && selectedCount > 0 && (
            <Badge className={`ml-2 text-xs ${accent.replace('text-', 'bg-')}`}>已选</Badge>
          )}
        </div>
      </div>
      <Button variant="outline" size="sm" onClick={() => openDialog(type)} className="shrink-0">
        <Link2 className="w-4 h-4 mr-1" />
        关联
      </Button>
    </div>
  );

  const ResourceSelectDialog = ({
    type,
    title,
    icon: Icon,
    items,
    selectedIds,
    selectedSingle,
    maxCount,
    accent,
    onToggle,
    emptyLink,
    emptyText,
  }: {
    type: ResourceType;
    title: string;
    icon: React.ElementType;
    items: { id?: string; name?: string; description?: string }[];
    selectedIds?: string[];
    selectedSingle?: string | null;
    maxCount?: number;
    accent: { selected: string; border: string; hover: string; bg: string };
    onToggle: (id: string) => void;
    emptyLink: string;
    emptyText: string;
  }) => {
    const filtered = useMemo(() => filterByKeyword(items, dialogSearch), [items, dialogSearch]);
    const open = dialogOpen === type;

    return (
      <Dialog open={open} onOpenChange={(v) => !v && closeDialog()}>
        <DialogContent className="sm:max-w-lg dark:bg-gray-800 dark:border-gray-700">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 dark:text-white">
              <Icon className={accent.selected} />
              {title}
              {maxCount != null && selectedIds && (
                <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                  （已选 {selectedIds.length}/{maxCount}）
                </span>
              )}
              {selectedSingle != null && selectedSingle !== '' && (
                <span className="text-sm font-normal text-gray-500 dark:text-gray-400">（已选 1 个）</span>
              )}
            </DialogTitle>
          </DialogHeader>
          {items.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400 py-4">
              {emptyText}
              <Link to={emptyLink} className="text-blue-500 hover:underline ml-1" onClick={closeDialog}>
                去创建
              </Link>
            </p>
          ) : (
            <>
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="搜索..."
                  value={dialogSearch}
                  onChange={(e) => setDialogSearch(e.target.value)}
                  className="pl-8 dark:bg-gray-900 dark:border-gray-700"
                />
              </div>
              <ScrollArea className="h-[320px] pr-2 -mx-2">
                <div className="space-y-2 pr-2">
                  {filtered
                    .filter((item): item is typeof item & { id: string } => item.id != null && item.id !== '')
                    .map((item) => {
                      const isSelected = selectedIds?.includes(item.id) ?? selectedSingle === item.id;
                      return (
                        <Card
                          key={item.id}
                          onClick={() => onToggle(item.id)}
                          className={`p-3 cursor-pointer transition-all select-none hover:shadow-sm ${
                            isSelected
                              ? `border-2 ${accent.border} ${accent.bg}`
                              : `border border-gray-200 dark:border-gray-700 ${accent.hover}`
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="dark:text-white truncate">{item.name ?? '--'}</span>
                            {isSelected && <Check className={`w-4 h-4 ${accent.selected} shrink-0`} />}
                          </div>
                          {item.description && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{item.description}</p>
                          )}
                        </Card>
                      );
                    })}
                  {filtered.length === 0 && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 py-4">
                      {dialogSearch.trim() ? '无匹配结果' : emptyText}
                    </p>
                  )}
                </div>
              </ScrollArea>
              <DialogFooter>
                <Button onClick={closeDialog}>确定</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    );
  };

  if (loading) {
    return (
      <Card className="p-6 dark:bg-gray-800 dark:border-gray-700">
        <p className="text-sm text-gray-500 dark:text-gray-400">加载关联资源中...</p>
      </Card>
    );
  }

  return (
    <>
      <Card className="p-6 dark:bg-gray-800 dark:border-gray-700">
        <div className="mb-2">
          <h3 className="text-lg dark:text-white">关联资源</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            为智能体关联知识库、数据集、工作流和接口集，提升能力
          </p>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          <ResourceRow
            type="knowledgeBase"
            title="知识库"
            icon={BookOpen}
            selectedCount={value.knowledgeBaseIds.length}
            maxCount={AGENT_MAX_KNOWLEDGE_BASE}
            accent="text-blue-500"
          />
          <ResourceRow
            type="dataset"
            title="数据集"
            icon={Database}
            selectedCount={value.datasetIds.length}
            maxCount={AGENT_MAX_DATASET}
            accent="text-green-500"
          />
          <ResourceRow
            type="workflow"
            title="工作流"
            icon={Zap}
            selectedCount={value.workflowId ? 1 : 0}
            accent="text-purple-500"
          />
          <ResourceRow
            type="apiCollection"
            title="接口集"
            icon={Code2}
            selectedCount={value.apiCollectionIds.length}
            maxCount={AGENT_MAX_API_COLLECTION}
            accent="text-orange-500"
          />
        </div>
      </Card>

      <ResourceSelectDialog
        type="knowledgeBase"
        title="选择知识库"
        icon={BookOpen}
        items={knowledgeBases}
        selectedIds={value.knowledgeBaseIds}
        maxCount={AGENT_MAX_KNOWLEDGE_BASE}
        accent={{
          selected: 'text-blue-500',
          border: 'border-blue-500',
          hover: 'hover:border-blue-200 dark:hover:border-blue-800',
          bg: 'bg-blue-50 dark:bg-blue-900/20',
        }}
        onToggle={toggleKnowledgeBase}
        emptyLink="/knowledge"
        emptyText="暂无知识库，"
      />
      <ResourceSelectDialog
        type="dataset"
        title="选择数据集"
        icon={Database}
        items={datasets}
        selectedIds={value.datasetIds}
        maxCount={AGENT_MAX_DATASET}
        accent={{
          selected: 'text-green-500',
          border: 'border-green-500',
          hover: 'hover:border-green-200 dark:hover:border-green-800',
          bg: 'bg-green-50 dark:bg-green-900/20',
        }}
        onToggle={toggleDataset}
        emptyLink="/dataset"
        emptyText="暂无数据集，"
      />
      <ResourceSelectDialog
        type="workflow"
        title="选择工作流"
        icon={Zap}
        items={workflows}
        selectedSingle={value.workflowId}
        accent={{
          selected: 'text-purple-500',
          border: 'border-purple-500',
          hover: 'hover:border-purple-200 dark:hover:border-purple-800',
          bg: 'bg-purple-50 dark:bg-purple-900/20',
        }}
        onToggle={selectWorkflow}
        emptyLink="/workflow"
        emptyText="暂无工作流，"
      />
      <ResourceSelectDialog
        type="apiCollection"
        title="选择接口集"
        icon={Code2}
        items={apiCollections}
        selectedIds={value.apiCollectionIds}
        maxCount={AGENT_MAX_API_COLLECTION}
        accent={{
          selected: 'text-orange-500',
          border: 'border-orange-500',
          hover: 'hover:border-orange-200 dark:hover:border-orange-800',
          bg: 'bg-orange-50 dark:bg-orange-900/20',
        }}
        onToggle={toggleApiCollection}
        emptyLink="/api-collection"
        emptyText="暂无接口集，"
      />
    </>
  );
}
