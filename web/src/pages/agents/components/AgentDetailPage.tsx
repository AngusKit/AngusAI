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
import { Button } from '@/components/ui/button.tsx';
import { Card } from '@/components/ui/card.tsx';
import { Badge } from '@/components/ui/badge.tsx';
import { toast } from 'sonner';
import Agents from '@/services/Agents.ts';
import type { AgentDetailVo } from '@/services/AgentsTypes.ts';
import { AgentStatusEnum } from '@/enums/enums.ts';
import {
  InteractionModeEnum,
  ReasoningStrategyEnum,
  AutonomyLevelEnum,
  MemoryStrategyEnum,
} from '@/enums/enums.ts';
import { getEnumDescription } from '@/enums/utils.ts';

export function AgentDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState<AgentDetailVo | null>(null);

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
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onBack} className="dark:text-gray-300">
          <ChevronLeft className="w-4 h-4 mr-1" />
          返回
        </Button>
      </div>

      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl dark:text-white mb-1">{detail.name ?? '--'}</h1>
            <Badge className={`text-xs mt-2 ${statusColor} border-0`}>
              {detail.status === 'ACTIVE' ? '已发布' : '离线'}
            </Badge>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleToggleStatus}
            disabled={!detail.status}
            className="dark:bg-gray-800 dark:border-gray-700"
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

      <div className="space-y-6">
      {/* 基本信息 */}
      <Card className="p-6 dark:bg-gray-800 dark:border-gray-700">
        <h3 className="flex items-center gap-2 text-gray-900 dark:text-white mb-4">
          <Bot className="w-4 h-4" />
          基本信息
        </h3>
        <div className="space-y-4 pl-6">
          <div className="space-y-2">
            <div className="text-xs text-gray-500 dark:text-gray-400">名称</div>
            <p className="text-sm text-gray-700 dark:text-gray-300">{detail.name ?? '--'}</p>
          </div>
          <div className="space-y-2">
            <div className="text-xs text-gray-500 dark:text-gray-400">描述</div>
            <p className="text-sm text-gray-700 dark:text-gray-300">{detail.description || '--'}</p>
          </div>
        </div>
      </Card>

      {/* 对话配置 */}
      <Card className="p-6 dark:bg-gray-800 dark:border-gray-700">
        <h3 className="flex items-center gap-2 text-gray-900 dark:text-white mb-4">
          <MessageSquare className="w-4 h-4" />
          对话配置
        </h3>
        <div className="grid gap-4 sm:grid-cols-2 pl-6">
          <ConfigItem
            label="默认模型"
            value={detail.defaultModel?.name ?? (detail.defaultModel?.id != null ? String(detail.defaultModel.id) : '未选择')}
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
        <h3 className="flex items-center gap-2 text-gray-900 dark:text-white mb-4">
          <Brain className="w-4 h-4" />
          记忆配置
        </h3>
        <div className="grid gap-4 sm:grid-cols-3 pl-6">
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

      {/* 关联资源（优先使用后端返回的 resources，含 id+name） */}
      <Card className="p-6 dark:bg-gray-800 dark:border-gray-700">
        <h3 className="flex items-center gap-2 text-gray-900 dark:text-white mb-4">
          <Settings2 className="w-4 h-4" />
          关联资源
        </h3>
        {(detail.resources?.knowledgeBases?.length ?? 0) > 0 ||
        (detail.resources?.datasets?.length ?? 0) > 0 ||
        detail.resources?.workflow != null ||
        (detail.resources?.apiCollections?.length ?? 0) > 0 ? (
          <div className="space-y-4 pl-6">
            {detail.resources?.knowledgeBases && detail.resources.knowledgeBases.length > 0 && (
              <ResourceSection
                icon={<BookOpen className="w-4 h-4 text-blue-500" />}
                title="知识库"
                items={detail.resources.knowledgeBases.map((r) => r.name ?? String(r.id))}
                baseLink="/knowledge"
              />
            )}
            {detail.resources?.datasets && detail.resources.datasets.length > 0 && (
              <ResourceSection
                icon={<Database className="w-4 h-4 text-green-500" />}
                title="数据集"
                items={detail.resources.datasets.map((r) => r.name ?? String(r.id))}
                baseLink="/dataset"
              />
            )}
            {detail.resources?.apiCollections && detail.resources.apiCollections.length > 0 && (
              <ResourceSection
                icon={<Code2 className="w-4 h-4 text-orange-500" />}
                title="接口集"
                items={detail.resources.apiCollections.map((r) => r.name ?? String(r.id))}
                baseLink="/api-collection"
              />
            )}
            {detail.resources?.workflow && (
              <ResourceSection
                icon={<Zap className="w-4 h-4 text-purple-500" />}
                title="工作流"
                items={[detail.resources.workflow.name ?? String(detail.resources.workflow.id)]}
                baseLink="/workflow"
              />
            )}
          </div>
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400 py-4 pl-6">暂无关联资源</p>
        )}
      </Card>
      </div>
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
