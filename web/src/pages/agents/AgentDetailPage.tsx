import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  Bot,
  ChevronLeft,
  Edit,
  Play,
  Pause,
  BookOpen,
  Database,
  Zap,
  Code2,
  Cpu,
  MessageSquare,
  Brain,
  Settings2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import Agents from '@/services/Agents';
import Models from '@/services/Models';
import KnowledgeBases from '@/services/KnowledgeBases';
import Datasets from '@/services/Datasets';
import Workflows from '@/services/Workflows';
import ApiCollections from '@/services/ApiCollections';
import type { AgentDetailVo } from '@/services/AgentsTypes';
import { AgentStatusEnum, WorkflowStatusEnum } from '@/enums/enums';
import {
  InteractionModeEnum,
  ReasoningStrategyEnum,
  AutonomyLevelEnum,
  MemoryStrategyEnum,
} from '@/enums/enums';
import { getEnumDescription } from '@/enums/utils';

interface ResourceNames {
  knowledgeBases: Record<string, string>;
  datasets: Record<string, string>;
  workflow: string | null;
  apiCollections: Record<string, string>;
}

export function AgentDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState<AgentDetailVo | null>(null);
  const [modelName, setModelName] = useState<string | null>(null);
  const [resourceNames, setResourceNames] = useState<ResourceNames>({
    knowledgeBases: {},
    datasets: {},
    workflow: null,
    apiCollections: {},
  });

  const loadDetail = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const res = await Agents.getAgentDetail(id);
      const d: AgentDetailVo | undefined = (res as any)?.data;
      if (!d) {
        toast.error('智能体不存在');
        navigate('/agents');
        return;
      }
      setDetail(d);
    } catch (err: any) {
      toast.error(err?.message || '加载失败');
      navigate('/agents');
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    loadDetail();
  }, [loadDetail]);

  useEffect(() => {
    if (!detail?.id) return;
    const kbIds = detail.knowledgeBaseIds ?? [];
    const dsIds = detail.datasetIds ?? [];
    const wfId = detail.workflowId;
    const apiIds = detail.apiCollectionIds ?? [];

    const fetchNames = async () => {
      try {
        const [kbRes, dsRes, wfRes, apiRes, modelRes] = await Promise.all([
          kbIds.length ? KnowledgeBases.getKnowledgeBaseList({ pageNo: 1, pageSize: 100 }) : null,
          dsIds.length ? Datasets.getDatasetList({ pageNo: 1, pageSize: 100 }) : null,
          wfId ? Workflows.getWorkflowList({ pageNo: 1, pageSize: 100, status: WorkflowStatusEnum.RUNNING }) : null,
          apiIds.length ? ApiCollections.apiCollectionList({ pageNo: 1, pageSize: 100 }) : null,
          detail.defaultModelId ? Models.getModelList({ pageNo: 1, pageSize: 500 }) : null,
        ]);

        const toMap = (list: { id?: string; name?: string }[], ids: string[]) =>
          Object.fromEntries(
            (list ?? []).filter((i) => i?.id && ids.includes(i.id) && i.name).map((i) => [i.id!, i.name!])
          );

        const kbList = (kbRes as any)?.data?.list ?? [];
        const dsList = (dsRes as any)?.data?.list ?? [];
        const wfList = (wfRes as any)?.data?.list ?? [];
        const apiList = (apiRes as any)?.data?.list ?? [];
        const modelList = (modelRes as any)?.data?.list ?? [];

        const model = modelList.find((m: { id?: string }) => String(m?.id) === String(detail.defaultModelId));
        setModelName(model?.name ?? null);

        setResourceNames({
          knowledgeBases: toMap(kbList, kbIds),
          datasets: toMap(dsList, dsIds),
          workflow: wfId ? wfList.find((i: { id?: string }) => i?.id === wfId)?.name ?? null : null,
          apiCollections: toMap(apiList, apiIds),
        });
      } catch {
        // ignore
      }
    };
    fetchNames();
  }, [detail]);

  const onBack = () => navigate('/agents');
  const onEdit = () => navigate(`/agents/${id}/edit`);

  const handleToggleStatus = async () => {
    if (!id || !detail?.status) return;
    const newStatus: AgentStatusEnum =
      detail.status === AgentStatusEnum.ACTIVE ? AgentStatusEnum.INACTIVE : AgentStatusEnum.ACTIVE;
    try {
      await Agents.updateAgentStatus(id, newStatus);
      toast.success(newStatus === AgentStatusEnum.ACTIVE ? '已发布' : '离线');
      setDetail((d) => (d ? { ...d, status: newStatus } : null));
    } catch (error: any) {
      toast.error(error?.message || '操作失败');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <div className="w-10 h-10 border-2 border-gray-300 dark:border-gray-600 border-t-orange-500 rounded-full animate-spin" />
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">加载中...</p>
      </div>
    );
  }

  if (!detail) return null;

  const statusColor =
    detail.status === AgentStatusEnum.ACTIVE
      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
      : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400';

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* 顶部操作栏 */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={onBack} className="gap-1 -ml-2 text-gray-600 dark:text-gray-400">
          <ChevronLeft className="w-4 h-4" />
          返回列表
        </Button>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleToggleStatus}
            disabled={!detail.status}
            className="dark:bg-gray-800 dark:border-gray-600"
          >
            {detail.status === 'ACTIVE' ? <Pause className="w-4 h-4 mr-1.5" /> : <Play className="w-4 h-4 mr-1.5" />}
            {detail.status === 'ACTIVE' ? '下线' : '发布'}
          </Button>
          <Button size="sm" onClick={onEdit} className="bg-blue-500 hover:bg-blue-600">
            <Edit className="w-4 h-4 mr-1.5" />
            编辑
          </Button>
        </div>
      </div>

      {/* 基本信息卡片 */}
      <Card className="p-6 dark:bg-gray-800 dark:border-gray-700">
        <div className="flex items-start gap-5">
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0">
            <Bot className="w-7 h-7 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-semibold dark:text-white mb-1">{detail.name ?? '--'}</h1>
            <Badge className={`text-xs ${statusColor} border-0`}>
              {detail.status === 'ACTIVE' ? '已发布' : '离线'}
            </Badge>
            {detail.description && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 leading-relaxed">{detail.description}</p>
            )}
          </div>
        </div>
      </Card>

      {/* 对话配置 */}
      <Card className="p-6 dark:bg-gray-800 dark:border-gray-700">
        <h3 className="flex items-center gap-2 text-base font-medium dark:text-white mb-4">
          <MessageSquare className="w-4 h-4 text-orange-500" />
          对话配置
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <ConfigItem
            label="默认模型"
            value={modelName ?? (detail.defaultModelId ? String(detail.defaultModelId) : '未选择')}
            icon={<Cpu className="w-4 h-4 text-gray-500" />}
          />
          <ConfigItem
            label="交互模式"
            value={
              detail.interactionMode
                ? getEnumDescription(InteractionModeEnum, detail.interactionMode as InteractionModeEnum)
                : '--'
            }
          />
          <ConfigItem
            label="推理策略"
            value={
              detail.reasoningStrategy
                ? getEnumDescription(ReasoningStrategyEnum, detail.reasoningStrategy as ReasoningStrategyEnum)
                : '--'
            }
          />
          <ConfigItem
            label="自治等级"
            value={
              detail.autonomyLevel
                ? getEnumDescription(AutonomyLevelEnum, detail.autonomyLevel as AutonomyLevelEnum)
                : '--'
            }
          />
        </div>
        {detail.welcomeMessage && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">欢迎消息</div>
            <p className="text-sm dark:text-white">{detail.welcomeMessage}</p>
          </div>
        )}
        {detail.systemPrompt && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">系统提示词</div>
            <div className="text-sm dark:text-white whitespace-pre-wrap bg-gray-50 dark:bg-gray-900 rounded-lg p-3 max-h-40 overflow-y-auto">
              {detail.systemPrompt}
            </div>
          </div>
        )}
        {detail.suggestedQuestions && detail.suggestedQuestions.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">建议问题</div>
            <div className="flex flex-wrap gap-2">
              {detail.suggestedQuestions.map((q, i) => (
                <span
                  key={i}
                  className="text-xs px-2.5 py-1 bg-gray-100 dark:bg-gray-700 dark:text-gray-300 rounded-md"
                >
                  {q}
                </span>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* 记忆配置 */}
      <Card className="p-6 dark:bg-gray-800 dark:border-gray-700">
        <h3 className="flex items-center gap-2 text-base font-medium dark:text-white mb-4">
          <Brain className="w-4 h-4 text-orange-500" />
          记忆配置
        </h3>
        <div className="grid gap-4 sm:grid-cols-3">
          <ConfigItem
            label="记忆策略"
            value={
              detail.memoryStrategy
                ? getEnumDescription(MemoryStrategyEnum, detail.memoryStrategy as MemoryStrategyEnum)
                : '--'
            }
          />
          <ConfigItem
            label="窗口大小"
            value={detail.memoryWindowSize != null ? String(detail.memoryWindowSize) : '--'}
          />
          <ConfigItem
            label="最大 Token"
            value={detail.memoryMaxTokens != null ? String(detail.memoryMaxTokens) : '--'}
          />
        </div>
        {detail.memorySummaryPrompt && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">摘要提示词</div>
            <div className="text-sm dark:text-white whitespace-pre-wrap bg-gray-50 dark:bg-gray-900 rounded-lg p-3 max-h-24 overflow-y-auto">
              {detail.memorySummaryPrompt}
            </div>
          </div>
        )}
      </Card>

      {/* 关联资源 */}
      <Card className="p-6 dark:bg-gray-800 dark:border-gray-700">
        <h3 className="flex items-center gap-2 text-base font-medium dark:text-white mb-4">
          <Settings2 className="w-4 h-4 text-orange-500" />
          关联资源
        </h3>
        {(detail.knowledgeBaseIds?.length ?? 0) > 0 ||
        (detail.datasetIds?.length ?? 0) > 0 ||
        detail.workflowId != null ||
        (detail.apiCollectionIds?.length ?? 0) > 0 ? (
          <div className="space-y-4">
            {detail.knowledgeBaseIds && detail.knowledgeBaseIds.length > 0 && (
              <ResourceSection
                icon={<BookOpen className="w-4 h-4 text-blue-500" />}
                title="知识库"
                items={detail.knowledgeBaseIds.map((id) => resourceNames.knowledgeBases[id] ?? id)}
                baseLink="/knowledge"
              />
            )}
            {detail.datasetIds && detail.datasetIds.length > 0 && (
              <ResourceSection
                icon={<Database className="w-4 h-4 text-green-500" />}
                title="数据集"
                items={detail.datasetIds.map((id) => resourceNames.datasets[id] ?? id)}
                baseLink="/dataset"
              />
            )}
            {detail.workflowId != null && (
              <ResourceSection
                icon={<Zap className="w-4 h-4 text-purple-500" />}
                title="工作流"
                items={resourceNames.workflow ? [resourceNames.workflow] : [String(detail.workflowId)]}
                baseLink="/workflow"
              />
            )}
            {detail.apiCollectionIds && detail.apiCollectionIds.length > 0 && (
              <ResourceSection
                icon={<Code2 className="w-4 h-4 text-orange-500" />}
                title="接口集"
                items={detail.apiCollectionIds.map((id) => resourceNames.apiCollections[id] ?? id)}
                baseLink="/api-collection"
              />
            )}
          </div>
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400 py-4">暂无关联资源</p>
        )}
      </Card>
    </div>
  );
}

function ConfigItem({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3">
      {icon && <span className="text-gray-400">{icon}</span>}
      <div>
        <div className="text-xs text-gray-500 dark:text-gray-400">{label}</div>
        <div className="text-sm font-medium dark:text-white mt-0.5">{value}</div>
      </div>
    </div>
  );
}

function ResourceSection({
  icon,
  title,
  items,
  baseLink,
}: {
  icon: React.ReactNode;
  title: string;
  items: string[];
  baseLink: string;
}) {
  return (
    <div>
      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
        {icon}
        <span>{title}</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {items.map((name) => (
          <Link
            key={name}
            to={baseLink}
            className="inline-flex items-center px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            {name}
          </Link>
        ))}
      </div>
    </div>
  );
}
