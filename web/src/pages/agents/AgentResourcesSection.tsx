import { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Database, Zap, Code2, Check, Search, X } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
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

export function AgentResourcesSection({ value, onChange }: AgentResourcesSectionProps) {
  const [knowledgeBases, setKnowledgeBases] = useState<KnowledgeBaseListVo[]>([]);
  const [datasets, setDatasets] = useState<DatasetListVo[]>([]);
  const [workflows, setWorkflows] = useState<WorkflowListVo[]>([]);
  const [apiCollections, setApiCollections] = useState<ApiCollectionListVo[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchKb, setSearchKb] = useState('');
  const [searchDs, setSearchDs] = useState('');
  const [searchWf, setSearchWf] = useState('');
  const [searchApi, setSearchApi] = useState('');

  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const [kbRes, dsRes, wfRes, apiRes] = await Promise.all([
        KnowledgeBases.getKnowledgeBaseList({ pageNo: 1, pageSize: 100 }),
        Datasets.getDatasetList({ pageNo: 1, pageSize: 100 }),
        Workflows.getWorkflowList({ pageNo: 1, pageSize: 100, status: WorkflowStatusEnum.RUNNING }),
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

  const filteredKb = useMemo(() => filterByKeyword(knowledgeBases, searchKb), [knowledgeBases, searchKb]);
  const filteredDs = useMemo(() => filterByKeyword(datasets, searchDs), [datasets, searchDs]);
  const filteredWf = useMemo(() => filterByKeyword(workflows, searchWf), [workflows, searchWf]);
  const filteredApi = useMemo(() => filterByKeyword(apiCollections, searchApi), [apiCollections, searchApi]);

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

  const clearKb = () => onChange({ ...value, knowledgeBaseIds: [] });
  const clearDs = () => onChange({ ...value, datasetIds: [] });
  const clearWf = () => onChange({ ...value, workflowId: null });
  const clearApi = () => onChange({ ...value, apiCollectionIds: [] });

  if (loading) {
    return (
      <Card className="p-6 dark:bg-gray-800 dark:border-gray-700">
        <p className="text-sm text-gray-500 dark:text-gray-400">加载关联资源中...</p>
      </Card>
    );
  }

  const ResourceCard = <T extends { id?: string; name?: string; description?: string }>({
    title,
    description,
    icon: Icon,
    items,
    filtered,
    search,
    onSearch,
    selectedIds,
    selectedSingle,
    maxCount,
    accent,
    onToggle,
    onClear,
    emptyLink,
    emptyText,
  }: {
    title: string;
    description: string;
    icon: React.ElementType;
    items: T[];
    filtered: T[];
    search: string;
    onSearch: (v: string) => void;
    selectedIds?: string[];
    selectedSingle?: string | null;
    maxCount?: number;
    accent: { selected: string; border: string; hover: string; bg: string };
    onToggle: (id: string) => void;
    onClear: () => void;
    emptyLink: string;
    emptyText: string;
  }) => {
    const selected = selectedIds?.length ?? (selectedSingle ? 1 : 0);
    const hasSelection = selected > 0;
    return (
      <Card className="p-6 dark:bg-gray-800 dark:border-gray-700">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Icon className={`w-5 h-5 ${accent.selected}`} />
            <h3 className="text-lg dark:text-white">{title}</h3>
          </div>
          <div className="flex items-center gap-2">
            {maxCount != null && (
              <Badge variant="secondary" className="text-xs">
                已选 {selected}/{maxCount}
              </Badge>
            )}
            {maxCount == null && hasSelection && <Badge className={accent.selected.replace('text-', 'bg-')}>已选择</Badge>}
            {hasSelection && (
              <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={onClear}>
                <X className="w-3 h-3 mr-1" />
                清空
              </Button>
            )}
          </div>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{description}</p>
        {items.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400 py-4">
            {emptyText}
            <Link to={emptyLink} className="text-blue-500 hover:underline ml-1">
              去创建
            </Link>
          </p>
        ) : (
          <>
            <div className="relative mb-3">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="搜索..."
                value={search}
                onChange={(e) => onSearch(e.target.value)}
                className="pl-8 h-8 text-sm bg-gray-50 dark:bg-gray-900 dark:border-gray-700"
              />
            </div>
            <ScrollArea className="h-[240px] pr-4">
              <div className="space-y-2">
                {filtered
                  .filter((item): item is T & { id: string } => item.id != null && item.id !== '')
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
                    {search.trim() ? '无匹配结果' : emptyText}
                  </p>
                )}
              </div>
            </ScrollArea>
          </>
        )}
      </Card>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <ResourceCard
        title="知识库"
        description="选择知识库为智能体提供专业知识支持"
        icon={BookOpen}
        items={knowledgeBases}
        filtered={filteredKb}
        search={searchKb}
        onSearch={setSearchKb}
        selectedIds={value.knowledgeBaseIds}
        maxCount={AGENT_MAX_KNOWLEDGE_BASE}
        accent={{
          selected: 'text-blue-500',
          border: 'border-blue-500',
          hover: 'hover:border-blue-200 dark:hover:border-blue-800',
          bg: 'bg-blue-50 dark:bg-blue-900/20',
        }}
        onToggle={toggleKnowledgeBase}
        onClear={clearKb}
        emptyLink="/knowledge"
        emptyText="暂无知识库，"
      />
      <ResourceCard
        title="数据集"
        description="选择数据集为智能体提供数据支持"
        icon={Database}
        items={datasets}
        filtered={filteredDs}
        search={searchDs}
        onSearch={setSearchDs}
        selectedIds={value.datasetIds}
        maxCount={AGENT_MAX_DATASET}
        accent={{
          selected: 'text-green-500',
          border: 'border-green-500',
          hover: 'hover:border-green-200 dark:hover:border-green-800',
          bg: 'bg-green-50 dark:bg-green-900/20',
        }}
        onToggle={toggleDataset}
        onClear={clearDs}
        emptyLink="/dataset"
        emptyText="暂无数据集，"
      />
      <ResourceCard
        title="工作流"
        description="选择工作流为智能体提供自动化流程（单选）"
        icon={Zap}
        items={workflows}
        filtered={filteredWf}
        search={searchWf}
        onSearch={setSearchWf}
        selectedSingle={value.workflowId}
        accent={{
          selected: 'text-purple-500',
          border: 'border-purple-500',
          hover: 'hover:border-purple-200 dark:hover:border-purple-800',
          bg: 'bg-purple-50 dark:bg-purple-900/20',
        }}
        onToggle={selectWorkflow}
        onClear={clearWf}
        emptyLink="/workflow"
        emptyText="暂无工作流，"
      />
      <ResourceCard
        title="接口集"
        description="选择接口集为智能体提供 API 调用能力"
        icon={Code2}
        items={apiCollections}
        filtered={filteredApi}
        search={searchApi}
        onSearch={setSearchApi}
        selectedIds={value.apiCollectionIds}
        maxCount={AGENT_MAX_API_COLLECTION}
        accent={{
          selected: 'text-orange-500',
          border: 'border-orange-500',
          hover: 'hover:border-orange-200 dark:hover:border-orange-800',
          bg: 'bg-orange-50 dark:bg-orange-900/20',
        }}
        onToggle={toggleApiCollection}
        onClear={clearApi}
        emptyLink="/api-collection"
        emptyText="暂无接口集，"
      />
    </div>
  );
}
