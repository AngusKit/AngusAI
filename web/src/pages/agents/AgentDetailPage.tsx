import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Bot, ChevronLeft, Edit, Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import Agents from '@/services/Agents';
import type { AgentDetailVo } from '@/services/AgentsTypes';
import { AgentStatusEnum } from '@/enums/enums';
import {
  InteractionModeEnum,
  ReasoningStrategyEnum,
  AutonomyLevelEnum,
  MemoryStrategyEnum,
} from '@/enums/enums';
import { getEnumDescription } from '@/enums/utils';

const LABELS: Record<string, string> = {
  interactionMode: '交互模式',
  reasoningStrategy: '推理策略',
  autonomyLevel: '自治等级',
  defaultModelId: '默认模型',
  systemPrompt: '系统提示词',
  welcomeMessage: '欢迎消息',
  suggestedQuestions: '建议问题',
  memoryStrategy: '记忆策略',
  memoryWindowSize: '记忆窗口大小',
  memoryMaxTokens: '记忆最大 Token',
  memorySummaryPrompt: '摘要提示词',
};

export function AgentDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState<AgentDetailVo | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    Agents.getAgentDetail(id)
      .then((res: any) => {
        const d = res?.data;
        if (!d) {
          toast.error('智能体不存在');
          navigate('/agents');
          return;
        }
        setDetail(d);
      })
      .catch((err: any) => {
        toast.error(err?.message || '加载失败');
        navigate('/agents');
      })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const onBack = () => navigate('/agents');
  const onEdit = () => navigate(`/agents/${id}/edit`);

  const handleToggleStatus = async () => {
    if (!id || !detail?.status) return;
    const newStatus: AgentStatusEnum =
      detail.status === AgentStatusEnum.ACTIVE ? AgentStatusEnum.INACTIVE : AgentStatusEnum.ACTIVE;
    try {
      await Agents.updateAgentStatus(id, newStatus);
      toast.success(newStatus === AgentStatusEnum.ACTIVE ? '已发布' : '已下线');
      setDetail((d) => (d ? { ...d, status: newStatus } : null));
    } catch (error: any) {
      toast.error(error?.message || '操作失败');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Bot className="w-12 h-12 text-gray-400 animate-pulse" />
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
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl mb-1 dark:text-white">智能体详情</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            查看智能体配置与状态
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handleToggleStatus}
            disabled={!detail.status}
            className="dark:bg-gray-800 dark:border-gray-600"
          >
            {detail.status === 'ACTIVE' ? (
              <>
                <Pause className="w-4 h-4 mr-2" />
                下线
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                发布
              </>
            )}
          </Button>
          <Button onClick={onEdit} className="bg-blue-500 hover:bg-blue-600">
            <Edit className="w-4 h-4 mr-2" />
            编辑
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 左侧：基本信息 */}
        <div className="space-y-6">
          <Card className="p-6 dark:bg-gray-800 dark:border-gray-700">
            <div className="flex items-start gap-4">
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0">
                <Bot className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-xl dark:text-white mb-2">{detail.name ?? '--'}</h2>
                <Badge className={`text-xs ${statusColor} border-0`}>
                  {detail.status === 'ACTIVE' ? '已发布' : '已下线'}
                </Badge>
                {detail.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    {detail.description}
                  </p>
                )}
              </div>
            </div>
          </Card>

          <Card className="p-6 dark:bg-gray-800 dark:border-gray-700">
            <h3 className="text-lg mb-4 dark:text-white">对话配置</h3>
            <div className="space-y-3 text-sm">
              <DetailRow
                label={LABELS.defaultModelId}
                value={
                  detail.defaultModelId != null && detail.defaultModelId !== ''
                    ? String(detail.defaultModelId)
                    : '（未选择）'
                }
              />
              <DetailRow
                label={LABELS.interactionMode}
                value={
                  detail.interactionMode
                    ? getEnumDescription(InteractionModeEnum, detail.interactionMode as InteractionModeEnum)
                    : '--'
                }
              />
              <DetailRow
                label={LABELS.reasoningStrategy}
                value={
                  detail.reasoningStrategy
                    ? getEnumDescription(ReasoningStrategyEnum, detail.reasoningStrategy as ReasoningStrategyEnum)
                    : '--'
                }
              />
              <DetailRow
                label={LABELS.autonomyLevel}
                value={
                  detail.autonomyLevel
                    ? getEnumDescription(AutonomyLevelEnum, detail.autonomyLevel as AutonomyLevelEnum)
                    : '--'
                }
              />
              {detail.welcomeMessage && (
                <DetailRow label={LABELS.welcomeMessage} value={detail.welcomeMessage} />
              )}
            </div>
            {detail.systemPrompt && (
              <>
                <Separator className="my-4 dark:bg-gray-700" />
                <div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                    {LABELS.systemPrompt}
                  </div>
                  <div className="text-sm dark:text-white whitespace-pre-wrap bg-gray-50 dark:bg-gray-900 rounded-lg p-3 max-h-48 overflow-y-auto">
                    {detail.systemPrompt}
                  </div>
                </div>
              </>
            )}
            {detail.suggestedQuestions && detail.suggestedQuestions.length > 0 && (
              <>
                <Separator className="my-4 dark:bg-gray-700" />
                <div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                    {LABELS.suggestedQuestions}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {detail.suggestedQuestions.map((q, i) => (
                      <span
                        key={i}
                        className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded"
                      >
                        {q}
                      </span>
                    ))}
                  </div>
                </div>
              </>
            )}
          </Card>
        </div>

        {/* 右侧：记忆与资源 */}
        <div className="space-y-6">
          <Card className="p-6 dark:bg-gray-800 dark:border-gray-700">
            <h3 className="text-lg mb-4 dark:text-white">记忆配置</h3>
            <div className="space-y-3 text-sm">
              <DetailRow
                label={LABELS.memoryStrategy}
                value={
                  detail.memoryStrategy
                    ? getEnumDescription(MemoryStrategyEnum, detail.memoryStrategy as MemoryStrategyEnum)
                    : '--'
                }
              />
              <DetailRow
                label={LABELS.memoryWindowSize}
                value={detail.memoryWindowSize != null ? String(detail.memoryWindowSize) : '--'}
              />
              <DetailRow
                label={LABELS.memoryMaxTokens}
                value={detail.memoryMaxTokens != null ? String(detail.memoryMaxTokens) : '--'}
              />
            </div>
            {detail.memorySummaryPrompt && (
              <>
                <Separator className="my-4 dark:bg-gray-700" />
                <div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                    {LABELS.memorySummaryPrompt}
                  </div>
                  <div className="text-sm dark:text-white whitespace-pre-wrap bg-gray-50 dark:bg-gray-900 rounded-lg p-3 max-h-24 overflow-y-auto">
                    {detail.memorySummaryPrompt}
                  </div>
                </div>
              </>
            )}
          </Card>

          <Card className="p-6 dark:bg-gray-800 dark:border-gray-700">
            <h3 className="text-lg mb-4 dark:text-white">关联资源</h3>
            <div className="space-y-2 text-sm">
              {(detail.knowledgeBaseIds?.length ?? 0) > 0 ||
              (detail.datasetIds?.length ?? 0) > 0 ||
              detail.workflowId != null ||
              (detail.apiCollectionIds?.length ?? 0) > 0 ? (
                <>
                  {detail.knowledgeBaseIds && detail.knowledgeBaseIds.length > 0 && (
                    <DetailRow
                      label="知识库"
                      value={detail.knowledgeBaseIds.map(String).join(', ')}
                    />
                  )}
                  {detail.datasetIds && detail.datasetIds.length > 0 && (
                    <DetailRow
                      label="数据集"
                      value={detail.datasetIds.map(String).join(', ')}
                    />
                  )}
                  {detail.workflowId != null && (
                    <DetailRow label="工作流" value={String(detail.workflowId)} />
                  )}
                  {detail.apiCollectionIds && detail.apiCollectionIds.length > 0 && (
                    <DetailRow
                      label="接口集"
                      value={detail.apiCollectionIds.map(String).join(', ')}
                    />
                  )}
                </>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">暂无关联资源</p>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* 底部 */}
      <div className="flex justify-start pt-4">
        <Button
          variant="outline"
          onClick={onBack}
          className="dark:bg-gray-800 dark:border-gray-700 dark:text-white"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          返回列表
        </Button>
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label?: string; value?: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-gray-500 dark:text-gray-400 shrink-0">{label ?? ''}</span>
      <span className="dark:text-white text-right">{value ?? '--'}</span>
    </div>
  );
}
