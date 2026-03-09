import { useState, useEffect, useCallback } from 'react';
import { BookOpen, Database, Zap, Code2, Check } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import KnowledgeBases from '@/services/KnowledgeBases';
import Datasets from '@/services/Datasets';
import Workflows from '@/services/Workflows';
import ApiCollections from '@/services/ApiCollections';
import { WorkflowStatusEnum } from '@/enums/enums';

const MAX_KNOWLEDGE_BASE = 5;
const MAX_DATASET = 5;
const MAX_API_COLLECTION = 5;

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

interface KnowledgeBaseItem {
  id: number;
  name: string;
  description?: string;
}
interface DatasetItem {
  id: number;
  name: string;
  description?: string;
  type?: string;
}
interface WorkflowItem {
  id: number;
  name: string;
  description?: string;
  status?: string;
}
interface ApiCollectionItem {
  id: number;
  name: string;
  description?: string;
  source?: string;
}

export function AgentResourcesSection({ value, onChange }: AgentResourcesSectionProps) {
  const [knowledgeBases, setKnowledgeBases] = useState<KnowledgeBaseItem[]>([]);
  const [datasets, setDatasets] = useState<DatasetItem[]>([]);
  const [workflows, setWorkflows] = useState<WorkflowItem[]>([]);
  const [apiCollections, setApiCollections] = useState<ApiCollectionItem[]>([]);
  const [loading, setLoading] = useState(false);

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

      setKnowledgeBases(
        (kbData?.list ?? []).map((i: any) => ({
          id: i.id != null ? Number(i.id) : 0,
          name: i.name ?? '--',
          description: i.description,
        }))
      );
      setDatasets(
        (dsData?.list ?? []).map((i: any) => ({
          id: i.id != null ? Number(i.id) : 0,
          name: i.name ?? '--',
          description: i.description,
          type: i.type,
        }))
      );
      setWorkflows(
        (wfData?.list ?? []).map((i: any) => ({
          id: i.id != null ? Number(i.id) : 0,
          name: i.name ?? '--',
          description: i.description,
          status: i.status,
        }))
      );
      setApiCollections(
        (apiData?.list ?? []).map((i: any) => ({
          id: i.id != null ? Number(i.id) : 0,
          name: i.name ?? '--',
          description: i.description,
          source: i.source,
        }))
      );
    } catch (e) {
      console.error('Failed to load resources:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const toggleKnowledgeBase = (id: number) => {
    const idStr = String(id);
    const next = value.knowledgeBaseIds.includes(idStr)
      ? value.knowledgeBaseIds.filter((x) => x !== idStr)
      : value.knowledgeBaseIds.length < MAX_KNOWLEDGE_BASE
        ? [...value.knowledgeBaseIds, idStr]
        : value.knowledgeBaseIds;
    onChange({ ...value, knowledgeBaseIds: next });
  };

  const toggleDataset = (id: number) => {
    const idStr = String(id);
    const next = value.datasetIds.includes(idStr)
      ? value.datasetIds.filter((x) => x !== idStr)
      : value.datasetIds.length < MAX_DATASET
        ? [...value.datasetIds, idStr]
        : value.datasetIds;
    onChange({ ...value, datasetIds: next });
  };

  const selectWorkflow = (id: number) => {
    const idStr = String(id);
    onChange({ ...value, workflowId: value.workflowId === idStr ? null : idStr });
  };

  const toggleApiCollection = (id: number) => {
    const idStr = String(id);
    const next = value.apiCollectionIds.includes(idStr)
      ? value.apiCollectionIds.filter((x) => x !== idStr)
      : value.apiCollectionIds.length < MAX_API_COLLECTION
        ? [...value.apiCollectionIds, idStr]
        : value.apiCollectionIds;
    onChange({ ...value, apiCollectionIds: next });
  };

  if (loading) {
    return (
      <Card className="p-6 dark:bg-gray-800 dark:border-gray-700">
        <p className="text-sm text-gray-500 dark:text-gray-400">加载关联资源中...</p>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 知识库 */}
      <Card className="p-6 dark:bg-gray-800 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-500" />
            <h3 className="text-lg dark:text-white">知识库</h3>
          </div>
          <Badge variant="secondary" className="text-xs">
            最多 {MAX_KNOWLEDGE_BASE} 个
          </Badge>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          选择知识库为智能体提供专业知识支持
        </p>
        <ScrollArea className="h-[280px] pr-4">
          <div className="space-y-2">
            {knowledgeBases.map((kb) => (
              <Card
                key={kb.id}
                onClick={() => toggleKnowledgeBase(kb.id)}
                className={`p-3 cursor-pointer transition-all ${
                  value.knowledgeBaseIds.includes(String(kb.id))
                    ? 'border-2 border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border border-gray-200 dark:border-gray-700 hover:border-blue-200'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="dark:text-white truncate">{kb.name}</span>
                  {value.knowledgeBaseIds.includes(String(kb.id)) && <Check className="w-4 h-4 text-blue-500 shrink-0" />}
                </div>
                {kb.description && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{kb.description}</p>
                )}
              </Card>
            ))}
            {knowledgeBases.length === 0 && (
              <p className="text-sm text-gray-500 dark:text-gray-400 py-4">暂无知识库</p>
            )}
          </div>
        </ScrollArea>
      </Card>

      {/* 数据集 */}
      <Card className="p-6 dark:bg-gray-800 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-green-500" />
            <h3 className="text-lg dark:text-white">数据集</h3>
          </div>
          <Badge variant="secondary" className="text-xs">
            最多 {MAX_DATASET} 个
          </Badge>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">选择数据集为智能体提供数据支持</p>
        <ScrollArea className="h-[280px] pr-4">
          <div className="space-y-2">
            {datasets.map((ds) => (
              <Card
                key={ds.id}
                onClick={() => toggleDataset(ds.id)}
                className={`p-3 cursor-pointer transition-all ${
                  value.datasetIds.includes(String(ds.id))
                    ? 'border-2 border-green-500 bg-green-50 dark:bg-green-900/20'
                    : 'border border-gray-200 dark:border-gray-700 hover:border-green-200'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="dark:text-white truncate">{ds.name}</span>
                  {value.datasetIds.includes(String(ds.id)) && <Check className="w-4 h-4 text-green-500 shrink-0" />}
                </div>
                {ds.description && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{ds.description}</p>
                )}
              </Card>
            ))}
            {datasets.length === 0 && (
              <p className="text-sm text-gray-500 dark:text-gray-400 py-4">暂无数据集</p>
            )}
          </div>
        </ScrollArea>
      </Card>

      {/* 工作流 */}
      <Card className="p-6 dark:bg-gray-800 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-purple-500" />
            <h3 className="text-lg dark:text-white">工作流</h3>
          </div>
          {value.workflowId && <Badge className="bg-purple-500">已选择</Badge>}
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">选择工作流为智能体提供自动化流程（单选）</p>
        <ScrollArea className="h-[280px] pr-4">
          <div className="space-y-2">
            {workflows.map((wf) => (
              <Card
                key={wf.id}
                onClick={() => selectWorkflow(wf.id)}
                className={`p-3 cursor-pointer transition-all ${
                  value.workflowId === String(wf.id)
                    ? 'border-2 border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                    : 'border border-gray-200 dark:border-gray-700 hover:border-purple-200'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="dark:text-white truncate">{wf.name}</span>
                  {value.workflowId === String(wf.id) && <Check className="w-4 h-4 text-purple-500 shrink-0" />}
                </div>
                {wf.description && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{wf.description}</p>
                )}
              </Card>
            ))}
            {workflows.length === 0 && (
              <p className="text-sm text-gray-500 dark:text-gray-400 py-4">暂无工作流</p>
            )}
          </div>
        </ScrollArea>
      </Card>

      {/* 接口集 */}
      <Card className="p-6 dark:bg-gray-800 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Code2 className="w-5 h-5 text-orange-500" />
            <h3 className="text-lg dark:text-white">接口集</h3>
          </div>
          <Badge variant="secondary" className="text-xs">
            最多 {MAX_API_COLLECTION} 个
          </Badge>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">选择接口集为智能体提供 API 调用能力</p>
        <ScrollArea className="h-[280px] pr-4">
          <div className="space-y-2">
            {apiCollections.map((api) => (
              <Card
                key={api.id}
                onClick={() => toggleApiCollection(api.id)}
                className={`p-3 cursor-pointer transition-all ${
                  value.apiCollectionIds.includes(String(api.id))
                    ? 'border-2 border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                    : 'border border-gray-200 dark:border-gray-700 hover:border-orange-200'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="dark:text-white truncate">{api.name}</span>
                  {value.apiCollectionIds.includes(String(api.id)) && <Check className="w-4 h-4 text-orange-500 shrink-0" />}
                </div>
                {api.description && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{api.description}</p>
                )}
              </Card>
            ))}
            {apiCollections.length === 0 && (
              <p className="text-sm text-gray-500 dark:text-gray-400 py-4">暂无接口集</p>
            )}
          </div>
        </ScrollArea>
      </Card>
    </div>
  );
}
