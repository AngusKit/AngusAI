import { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Database, Zap, Code2, Check, Search, Link2, Inbox, SearchX } from 'lucide-react';
import { Card } from '@/components/ui/card.tsx';
import { Badge } from '@/components/ui/badge.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Input } from '@/components/ui/input.tsx';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog.tsx';
import { toast } from 'sonner';
import { useDebounce } from '@/hooks/useDebounce.ts';
import KnowledgeBases from '@/services/KnowledgeBases.ts';
import Datasets from '@/services/Datasets.ts';
import Workflows from '@/services/Workflows.ts';
import ApiCollections from '@/services/ApiCollections.ts';
import type { KnowledgeBaseListVo } from '@/services/KnowledgeBasesTypes.ts';
import type { DatasetListVo } from '@/services/DatasetsTypes.ts';
import type { WorkflowListVo } from '@/services/WorkflowsTypes.ts';
import type { ApiCollectionListVo } from '@/services/ApiCollectionsTypes.ts';
import { WorkflowStatusEnum } from '@/enums/enums.ts';
import { AGENT_MAX_API_COLLECTION, AGENT_MAX_DATASET, AGENT_MAX_KNOWLEDGE_BASE } from '../constants.ts';

/** 资源选择弹窗每页条数 */
const PAGE_SIZE = 10;
/** 弹窗最小高度 */
const DIALOG_MIN_HEIGHT = 480;

export interface AgentResourcesFormValue {
  knowledgeBaseIds: string[];
  knowledgeBaseNames?: Record<string, string>;
  datasetIds: string[];
  datasetNames?: Record<string, string>;
  workflowId: string | null;
  workflowName?: string | null;
  apiCollectionIds: string[];
  apiCollectionNames?: Record<string, string>;
}

interface AgentResourcesSectionProps {
  value: AgentResourcesFormValue;
  onChange: (v: AgentResourcesFormValue) => void;
}

type ResourceType = 'knowledgeBase' | 'dataset' | 'workflow' | 'apiCollection';

interface ResourceItem {
  id?: string;
  name?: string;
  description?: string;
}

type FetchResourceFn = (pageNo: number, keyword: string) => Promise<{ list: ResourceItem[]; total: number }>;

interface ResourceSelectDialogProps {
  title: string;
  icon: React.ElementType;
  fetchFn: FetchResourceFn;
  selectedIds?: string[];
  selectedSingle?: string | null;
  maxCount?: number;
  accent: { selected: string; border: string; hover: string; bg: string };
  onToggle: (id: string, name?: string) => void;
  emptyLink: string;
  emptyText: string;
  open: boolean;
  search: string;
  onSearchChange: (v: string) => void;
  debouncedSearch: string;
  onClose: () => void;
}

function ResourceSelectDialog({
  title,
  icon: Icon,
  fetchFn,
  selectedIds,
  selectedSingle,
  maxCount,
  accent,
  onToggle,
  emptyLink,
  emptyText,
  open,
  search,
  onSearchChange,
  debouncedSearch,
  onClose,
}: ResourceSelectDialogProps) {
  const [items, setItems] = useState<ResourceItem[]>([]);
  const [total, setTotal] = useState(0);
  const [pageNo, setPageNo] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadMore, setLoadMore] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const loadingRef = useRef(false);

  const load = useCallback(
    async (p: number, append: boolean) => {
      if (loadingRef.current) return;
      loadingRef.current = true;
      if (append) setLoadMore(true);
      else setLoading(true);
      try {
        const { list, total: t } = await fetchFn(p, debouncedSearch);
        if (append) {
          setItems((prev) => {
            const seen = new Set(prev.map((i) => i.id));
            return [...prev, ...list.filter((i) => i.id && !seen.has(i.id))];
          });
        } else {
          setItems(list.filter((i): i is ResourceItem & { id: string } => i != null && i.id != null && i.id !== ''));
        }
        setTotal(t);
      } catch (e) {
        console.error('Failed to load resources:', e);
        toast.error('加载失败');
      } finally {
        loadingRef.current = false;
        setLoading(false);
        setLoadMore(false);
      }
    },
    [fetchFn, debouncedSearch]
  );

  const loadRef = useRef(load);
  loadRef.current = load;

  useEffect(() => {
    if (!open) return;
    setPageNo(1);
    loadRef.current(1, false);
  }, [open, debouncedSearch]);

  const loadMoreIfNeeded = useCallback(() => {
    if (loading || loadMore || items.length >= total) return;
    const nextPage = pageNo + 1;
    setPageNo(nextPage);
    load(nextPage, true);
  }, [loading, loadMore, items.length, total, pageNo, load]);

  useEffect(() => {
    if (!open || !scrollRef.current || !sentinelRef.current) return;
    const ob = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) loadMoreIfNeeded();
      },
      { root: scrollRef.current, rootMargin: '100px', threshold: 0 }
    );
    ob.observe(sentinelRef.current);
    return () => ob.disconnect();
  }, [open, loadMoreIfNeeded]);

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        className="sm:max-w-lg dark:bg-gray-800 dark:border-gray-700 flex flex-col"
        style={{ minHeight: DIALOG_MIN_HEIGHT, height: DIALOG_MIN_HEIGHT }}
      >
        <DialogHeader className="shrink-0">
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
        <div className="relative shrink-0 mt-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="搜索关键字..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 dark:bg-gray-900 dark:border-gray-700"
          />
        </div>
        <div
          ref={scrollRef}
          className="flex-1 min-h-0 overflow-y-auto pr-2 -mx-2 mt-2"
          style={{ height: 320 }}
        >
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-10 h-10 border-2 border-gray-300 dark:border-gray-600 border-t-blue-500 dark:border-t-blue-400 rounded-full animate-spin" />
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">加载中...</p>
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4">
              {debouncedSearch.trim() ? (
                <>
                  <SearchX className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-3" />
                  <p className="text-base font-medium text-gray-600 dark:text-gray-400 mb-1">无匹配结果</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">尝试更换关键词搜索</p>
                </>
              ) : (
                <>
                  <Inbox className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-3" />
                  <p className="text-base font-medium text-gray-600 dark:text-gray-400 mb-2">{emptyText.replace('，', '')}</p>
                  <Link
                    to={emptyLink}
                    onClick={onClose}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                  >
                    去创建
                  </Link>
                </>
              )}
            </div>
          ) : (
            <div className="space-y-2 pr-2 pb-4">
              {items
                .filter((item): item is ResourceItem & { id: string } => item.id != null && item.id !== '')
                .map((item) => {
                  const isSelected = selectedIds?.includes(item.id) ?? selectedSingle === item.id;
                  return (
                    <Card
                      key={item.id}
                      onClick={() => onToggle(item.id, item.name)}
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
              <div ref={sentinelRef} className="h-1" />
              {loadMore && <p className="text-sm text-gray-500 dark:text-gray-400 py-2">加载更多...</p>}
            </div>
          )}
        </div>
        <DialogFooter className="shrink-0">
          <Button onClick={onClose}>确定</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function AgentResourcesSection({ value, onChange }: AgentResourcesSectionProps) {
  const [dialogOpen, setDialogOpen] = useState<ResourceType | null>(null);
  const [dialogSearch, setDialogSearch] = useState('');
  const debouncedSearch = useDebounce(dialogSearch, 400);

  const openDialog = (type: ResourceType) => {
    setDialogSearch('');
    setDialogOpen(type);
  };
  const closeDialog = () => {
    setDialogOpen(null);
    setDialogSearch('');
  };

  const toggleKnowledgeBase = (id: string, name?: string) => {
    if (value.knowledgeBaseIds.includes(id)) {
      const nextIds = value.knowledgeBaseIds.filter((x) => x !== id);
      const nextNames = { ...value.knowledgeBaseNames };
      delete nextNames[id];
      onChange({ ...value, knowledgeBaseIds: nextIds, knowledgeBaseNames: nextIds.length ? nextNames : undefined });
      return;
    }
    if (value.knowledgeBaseIds.length >= AGENT_MAX_KNOWLEDGE_BASE) {
      toast.error(`知识库最多选择 ${AGENT_MAX_KNOWLEDGE_BASE} 个`);
      return;
    }
    const nextNames = name ? { ...(value.knowledgeBaseNames ?? {}), [id]: name } : value.knowledgeBaseNames;
    onChange({ ...value, knowledgeBaseIds: [...value.knowledgeBaseIds, id], knowledgeBaseNames: nextNames });
  };

  const toggleDataset = (id: string, name?: string) => {
    if (value.datasetIds.includes(id)) {
      const nextIds = value.datasetIds.filter((x) => x !== id);
      const nextNames = { ...value.datasetNames };
      delete nextNames[id];
      onChange({ ...value, datasetIds: nextIds, datasetNames: nextIds.length ? nextNames : undefined });
      return;
    }
    if (value.datasetIds.length >= AGENT_MAX_DATASET) {
      toast.error(`数据集最多选择 ${AGENT_MAX_DATASET} 个`);
      return;
    }
    const nextNames = name ? { ...(value.datasetNames ?? {}), [id]: name } : value.datasetNames;
    onChange({ ...value, datasetIds: [...value.datasetIds, id], datasetNames: nextNames });
  };

  const selectWorkflow = (id: string, name?: string) => {
    onChange({
      ...value,
      workflowId: value.workflowId === id ? null : id,
      workflowName: value.workflowId === id ? null : name ?? null,
    });
  };

  const toggleApiCollection = (id: string, name?: string) => {
    if (value.apiCollectionIds.includes(id)) {
      const nextIds = value.apiCollectionIds.filter((x) => x !== id);
      const nextNames = { ...value.apiCollectionNames };
      delete nextNames[id];
      onChange({ ...value, apiCollectionIds: nextIds, apiCollectionNames: nextIds.length ? nextNames : undefined });
      return;
    }
    if (value.apiCollectionIds.length >= AGENT_MAX_API_COLLECTION) {
      toast.error(`接口集最多选择 ${AGENT_MAX_API_COLLECTION} 个`);
      return;
    }
    const nextNames = name ? { ...(value.apiCollectionNames ?? {}), [id]: name } : value.apiCollectionNames;
    onChange({ ...value, apiCollectionIds: [...value.apiCollectionIds, id], apiCollectionNames: nextNames });
  };

  const ResourceRow = ({
    type,
    title,
    icon: Icon,
    selectedIds,
    selectedNames,
    selectedSingleName,
    maxCount,
    accent,
  }: {
    type: ResourceType;
    title: string;
    icon: React.ElementType;
    selectedIds: string[];
    selectedNames?: Record<string, string>;
    selectedSingleName?: string | null;
    maxCount?: number;
    accent: string;
  }) => {
    const items: { id: string; name: string }[] = selectedSingleName
      ? selectedIds.length > 0 && selectedIds[0]
        ? [{ id: selectedIds[0], name: selectedSingleName }]
        : []
      : selectedIds
          .filter((id): id is string => !!id)
          .map((id) => ({ id, name: selectedNames?.[id] ?? id }));
    return (
      <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700 last:border-0">
        <div className="flex flex-col gap-1.5 min-w-0 flex-1">
          <div className="flex items-center gap-3">
            <Icon className={`w-5 h-5 ${accent} shrink-0`} />
            <div className="flex items-center gap-2 min-w-0">
              <span className="font-medium dark:text-white">{title}</span>
              {maxCount != null && (
                <Badge variant="secondary" className="text-xs shrink-0">
                  {selectedIds.length}/{maxCount}
                </Badge>
              )}
              {maxCount == null && selectedIds.length > 0 && (
                <Badge className={`text-xs shrink-0 ${accent.replace('text-', 'bg-')}`}>已选</Badge>
              )}
            </div>
          </div>
          {items.length > 0 && (
            <div className="flex flex-wrap gap-2 pl-8">
              {items.map(({ id, name }) => (
                <span
                  key={id}
                  className="inline-flex items-center px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 dark:text-gray-300 rounded-lg"
                >
                  {name}
                </span>
              ))}
            </div>
          )}
        </div>
        <Button variant="outline" size="sm" onClick={() => openDialog(type)} className="shrink-0 ml-2">
          <Link2 className="w-4 h-4 mr-1" />
          关联
        </Button>
      </div>
    );
  };

  const fetchKnowledgeBases: FetchResourceFn = useCallback(async (pageNo, keyword) => {
    const res = await KnowledgeBases.getKnowledgeBaseList({
      pageNo,
      pageSize: PAGE_SIZE,
      keyword: keyword.trim() || undefined,
    });
    const data = (res as any)?.data;
    const list = ((data?.list ?? []) as KnowledgeBaseListVo[]).filter(
      (i): i is KnowledgeBaseListVo => i != null && i.id != null
    );
    return { list, total: data?.total ?? 0 };
  }, []);

  const fetchDatasets: FetchResourceFn = useCallback(async (pageNo, keyword) => {
    const res = await Datasets.getDatasetList({
      pageNo,
      pageSize: PAGE_SIZE,
      keyword: keyword.trim() || undefined,
    });
    const data = (res as any)?.data;
    const list = ((data?.list ?? []) as DatasetListVo[]).filter((i): i is DatasetListVo => i != null && i.id != null);
    return { list, total: data?.total ?? 0 };
  }, []);

  const fetchWorkflows: FetchResourceFn = useCallback(async (pageNo, keyword) => {
    const res = await Workflows.getWorkflowList({
      pageNo,
      pageSize: PAGE_SIZE,
      keyword: keyword.trim() || undefined,
      status: WorkflowStatusEnum.RUNNING,
    });
    const data = (res as any)?.data;
    const list = ((data?.list ?? []) as WorkflowListVo[]).filter(
      (i): i is WorkflowListVo => i != null && i.id != null
    );
    return { list, total: data?.total ?? 0 };
  }, []);

  const fetchApiCollections: FetchResourceFn = useCallback(async (pageNo, keyword) => {
    const res = await ApiCollections.apiCollectionList({
      pageNo,
      pageSize: PAGE_SIZE,
      keyword: keyword.trim() || undefined,
    });
    const data = (res as any)?.data;
    const list = ((data?.list ?? []) as ApiCollectionListVo[]).filter(
      (i): i is ApiCollectionListVo => i != null && i.id != null
    );
    return { list, total: data?.total ?? 0 };
  }, []);

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
            selectedIds={value.knowledgeBaseIds}
            selectedNames={value.knowledgeBaseNames}
            maxCount={AGENT_MAX_KNOWLEDGE_BASE}
            accent="text-blue-500"
          />
          <ResourceRow
            type="dataset"
            title="数据集"
            icon={Database}
            selectedIds={value.datasetIds}
            selectedNames={value.datasetNames}
            maxCount={AGENT_MAX_DATASET}
            accent="text-green-500"
          />
          <ResourceRow
            type="apiCollection"
            title="接口集"
            icon={Code2}
            selectedIds={value.apiCollectionIds}
            selectedNames={value.apiCollectionNames}
            maxCount={AGENT_MAX_API_COLLECTION}
            accent="text-blue-500"
          />
          <ResourceRow
            type="workflow"
            title="工作流"
            icon={Zap}
            selectedIds={value.workflowId ? [value.workflowId] : []}
            selectedSingleName={value.workflowName}
            accent="text-purple-500"
          />
        </div>
      </Card>

      <ResourceSelectDialog
        title="选择知识库"
        icon={BookOpen}
        fetchFn={fetchKnowledgeBases}
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
        open={dialogOpen === 'knowledgeBase'}
        search={dialogSearch}
        onSearchChange={setDialogSearch}
        debouncedSearch={debouncedSearch}
        onClose={closeDialog}
      />
      <ResourceSelectDialog
        title="选择数据集"
        icon={Database}
        fetchFn={fetchDatasets}
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
        open={dialogOpen === 'dataset'}
        search={dialogSearch}
        onSearchChange={setDialogSearch}
        debouncedSearch={debouncedSearch}
        onClose={closeDialog}
      />
      <ResourceSelectDialog
        title="选择接口集"
        icon={Code2}
        fetchFn={fetchApiCollections}
        selectedIds={value.apiCollectionIds}
        maxCount={AGENT_MAX_API_COLLECTION}
        accent={{
          selected: 'text-blue-500',
          border: 'border-blue-500',
          hover: 'hover:border-blue-200 dark:hover:border-blue-800',
          bg: 'bg-blue-50 dark:bg-blue-900/20',
        }}
        onToggle={toggleApiCollection}
        emptyLink="/api-collection"
        emptyText="暂无接口集，"
        open={dialogOpen === 'apiCollection'}
        search={dialogSearch}
        onSearchChange={setDialogSearch}
        debouncedSearch={debouncedSearch}
        onClose={closeDialog}
      />
      <ResourceSelectDialog
        title="选择工作流"
        icon={Zap}
        fetchFn={fetchWorkflows}
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
        open={dialogOpen === 'workflow'}
        search={dialogSearch}
        onSearchChange={setDialogSearch}
        debouncedSearch={debouncedSearch}
        onClose={closeDialog}
      />
    </>
  );
}
