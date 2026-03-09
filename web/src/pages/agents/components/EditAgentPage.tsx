import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Bot, ChevronLeft, ChevronRight, Cpu, Link2 } from 'lucide-react';
import { Button } from '@/components/ui/button.tsx';
import { Card } from '@/components/ui/card.tsx';
import { Input } from '@/components/ui/input.tsx';
import { Label } from '@/components/ui/label.tsx';
import { Textarea } from '@/components/ui/textarea.tsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.tsx';
import { ScrollArea } from '@/components/ui/scroll-area.tsx';
import { toast } from 'sonner';
import Agents from '@/services/Agents.ts';
import type { AgentUpdateDto, AgentDetailVo } from '@/services/AgentsTypes.ts';
import {
  InteractionModeEnum,
  ReasoningStrategyEnum,
  AutonomyLevelEnum,
  MemoryStrategyEnum,
} from '@/enums/enums.ts';
import { enumToMessages } from '@/enums/utils.ts';
import {
  AGENT_SYSTEM_PROMPT_MAX_LENGTH,
  AGENT_WELCOME_MESSAGE_MAX_LENGTH,
  AGENT_SUMMARY_PROMPT_MAX_LENGTH,
} from '../constants.ts';
import { AgentResourcesSection, type AgentResourcesFormValue } from './AgentResourcesSection.tsx';
import { ModelSelectDialog } from './ModelSelectDialog.tsx';

export function EditAgentPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [modelDialogOpen, setModelDialogOpen] = useState(false);
  const [form, setForm] = useState({
    name: '',
    description: '',
    interactionMode: InteractionModeEnum.CHATBOT,
    reasoningStrategy: ReasoningStrategyEnum.FUNCTION_CALLING,
    autonomyLevel: AutonomyLevelEnum.ASSISTANT,
    defaultModelId: undefined as string | undefined,
    defaultModelName: undefined as string | undefined,
    systemPrompt: '',
    welcomeMessage: '',
    suggestedQuestions: [] as string[],
    memory: {
      strategy: MemoryStrategyEnum.TOKEN_WINDOW,
      windowSize: 20,
      maxTokens: 8000,
      summaryPrompt: '',
    },
    resources: {
      knowledgeBaseIds: [] as string[],
      datasetIds: [] as string[],
      workflowId: null as string | null,
      apiCollectionIds: [] as string[],
    } as AgentResourcesFormValue,
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
      const defaultModel = d.defaultModel;
      const defaultModelId =
        defaultModel?.id != null ? String(defaultModel.id) : undefined;
      const defaultModelName = defaultModel?.name ?? undefined;

      const resources = d.resources;
      const kbIds = (resources?.knowledgeBases ?? []).map((r) => String(r.id));
      const dsIds = (resources?.datasets ?? []).map((r) => String(r.id));
      const apiIds = (resources?.apiCollections ?? []).map((r) => String(r.id));
      const wfId = resources?.workflow?.id != null ? String(resources.workflow.id) : null;
      const wfName = resources?.workflow?.name ?? null;
      const kbNames = Object.fromEntries(
        (resources?.knowledgeBases ?? []).filter((r) => r.id != null && r.name).map((r) => [String(r.id), r.name!])
      );
      const dsNames = Object.fromEntries(
        (resources?.datasets ?? []).filter((r) => r.id != null && r.name).map((r) => [String(r.id), r.name!])
      );
      const apiNames = Object.fromEntries(
        (resources?.apiCollections ?? []).filter((r) => r.id != null && r.name).map((r) => [String(r.id), r.name!])
      );

      setForm({
        name: d.name ?? '',
        description: d.description ?? '',
        interactionMode: (d.interactionMode ?? InteractionModeEnum.CHATBOT) as InteractionModeEnum,
        reasoningStrategy: (d.reasoningStrategy ?? ReasoningStrategyEnum.FUNCTION_CALLING) as ReasoningStrategyEnum,
        autonomyLevel: (d.autonomyLevel ?? AutonomyLevelEnum.ASSISTANT) as AutonomyLevelEnum,
        defaultModelId,
        defaultModelName,
        systemPrompt: d.systemPrompt ?? '',
        welcomeMessage: d.welcomeMessage ?? '',
        suggestedQuestions: Array.isArray(d.suggestedQuestions) ? [...d.suggestedQuestions] : [],
        memory: {
          strategy: (d.memoryStrategy ?? MemoryStrategyEnum.TOKEN_WINDOW) as MemoryStrategyEnum,
          windowSize: d.memoryWindowSize ?? 20,
          maxTokens: d.memoryMaxTokens ?? 8000,
          summaryPrompt: d.memorySummaryPrompt ?? '',
        },
        resources: {
          knowledgeBaseIds: kbIds,
          knowledgeBaseNames: Object.keys(kbNames).length ? kbNames : undefined,
          datasetIds: dsIds,
          datasetNames: Object.keys(dsNames).length ? dsNames : undefined,
          workflowId: wfId,
          workflowName: wfName,
          apiCollectionIds: apiIds,
          apiCollectionNames: Object.keys(apiNames).length ? apiNames : undefined,
        },
      });
    } catch (error: any) {
      toast.error(error?.message || '加载失败');
      navigate('/agents');
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    loadDetail();
  }, [loadDetail]);

  const onBack = () => navigate('/agents');

  const handleSubmit = async () => {
    if (!id) return;
    if (!form.name.trim()) {
      toast.error('请输入智能体名称');
      return;
    }
    if (form.systemPrompt.length > AGENT_SYSTEM_PROMPT_MAX_LENGTH) {
      toast.error(`系统提示词不超过 ${AGENT_SYSTEM_PROMPT_MAX_LENGTH.toLocaleString()} 字`);
      return;
    }
    if (form.welcomeMessage.length > AGENT_WELCOME_MESSAGE_MAX_LENGTH) {
      toast.error(`欢迎消息不超过 ${AGENT_WELCOME_MESSAGE_MAX_LENGTH} 字`);
      return;
    }
    if (form.memory.summaryPrompt.length > AGENT_SUMMARY_PROMPT_MAX_LENGTH) {
      toast.error(`摘要提示词不超过 ${AGENT_SUMMARY_PROMPT_MAX_LENGTH} 字`);
      return;
    }
    setSubmitting(true);
    try {
      const dto: AgentUpdateDto = {
        name: form.name.trim(),
        description: form.description.trim() || undefined,
        interactionMode: form.interactionMode,
        reasoningStrategy: form.reasoningStrategy,
        autonomyLevel: form.autonomyLevel,
        defaultModelId: form.defaultModelId ?? undefined,
        systemPrompt: form.systemPrompt.trim() || undefined,
        welcomeMessage: form.welcomeMessage.trim() || undefined,
        suggestedQuestions: form.suggestedQuestions.length > 0 ? form.suggestedQuestions : undefined,
        memory: {
          strategy: form.memory.strategy,
          windowSize: form.memory.windowSize,
          maxTokens: form.memory.maxTokens,
          summaryPrompt: form.memory.summaryPrompt.trim() || undefined,
        },
        resources:
          form.resources.knowledgeBaseIds.length > 0 ||
          form.resources.datasetIds.length > 0 ||
          form.resources.workflowId != null ||
          form.resources.apiCollectionIds.length > 0
            ? {
                knowledgeBaseIds: form.resources.knowledgeBaseIds.length > 0 ? form.resources.knowledgeBaseIds : undefined,
                datasetIds: form.resources.datasetIds.length > 0 ? form.resources.datasetIds : undefined,
                workflowId: form.resources.workflowId ?? undefined,
                apiCollectionIds: form.resources.apiCollectionIds.length > 0 ? form.resources.apiCollectionIds : undefined,
              }
            : undefined,
      };
      await Agents.updateAgent(id, dto);
      toast.success('智能体已更新');
      navigate(`/agents/${id}`);
    } catch (error: any) {
      toast.error(error?.message || '更新失败');
    } finally {
      setSubmitting(false);
    }
  };

  const addSuggestedQuestion = () => {
    setForm((f) => ({
      ...f,
      suggestedQuestions: [...f.suggestedQuestions, ''],
    }));
  };
  const updateSuggestedQuestion = (index: number, value: string) => {
    setForm((f) => {
      const next = [...f.suggestedQuestions];
      next[index] = value;
      return { ...f, suggestedQuestions: next };
    });
  };
  const removeSuggestedQuestion = (index: number) => {
    setForm((f) => ({
      ...f,
      suggestedQuestions: f.suggestedQuestions.filter((_, i) => i !== index),
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Bot className="w-12 h-12 text-gray-400 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl mb-1 dark:text-white">编辑智能体</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          修改智能体配置
        </p>
      </div>

      <ScrollArea className="h-[calc(100vh-280px)] pr-4">
        <div className="space-y-6 pb-6">
          {/* 基本信息 */}
          <Card className="p-6 dark:bg-gray-800 dark:border-gray-700">
            <h3 className="text-lg mb-4 dark:text-white">基本信息</h3>
            <div className="space-y-4">
              <div>
                <Label className="dark:text-gray-300">名称（必填）</Label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="智能体名称"
                  maxLength={100}
                  className="mt-2 dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                />
              </div>
              <div>
                <Label className="dark:text-gray-300">描述</Label>
                <Textarea
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  placeholder="智能体简要介绍"
                  maxLength={800}
                  rows={4}
                  className="mt-2 dark:bg-gray-900 dark:border-gray-700 dark:text-white resize-none"
                />
              </div>
              <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <Cpu className="w-5 h-5 text-orange-500 shrink-0" />
                  <div>
                    <div className="text-sm font-medium dark:text-white">默认模型</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                      {form.defaultModelName ?? (form.defaultModelId ? String(form.defaultModelId) : '未选择')}
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => setModelDialogOpen(true)} className="shrink-0">
                  <Link2 className="w-4 h-4 mr-1" />
                  关联
                </Button>
              </div>
            </div>
          </Card>

          {/* 对话配置 */}
          <Card className="p-6 dark:bg-gray-800 dark:border-gray-700">
            <h3 className="text-lg mb-4 dark:text-white">对话配置</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label className="dark:text-gray-300">交互模式</Label>
                  <Select
                    value={form.interactionMode}
                    onValueChange={(v) => setForm((f) => ({ ...f, interactionMode: v as InteractionModeEnum }))}
                  >
                    <SelectTrigger className="mt-2 dark:bg-gray-900 dark:border-gray-700 dark:text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                      {enumToMessages(InteractionModeEnum).map((o) => (
                        <SelectItem key={o.value} value={o.value} className="dark:text-gray-300">
                          {o.message}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="dark:text-gray-300">推理策略</Label>
                  <Select
                    value={form.reasoningStrategy}
                    onValueChange={(v) => setForm((f) => ({ ...f, reasoningStrategy: v as ReasoningStrategyEnum }))}
                  >
                    <SelectTrigger className="mt-2 dark:bg-gray-900 dark:border-gray-700 dark:text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                      {enumToMessages(ReasoningStrategyEnum).map((o) => (
                        <SelectItem key={o.value} value={o.value} className="dark:text-gray-300">
                          {o.message}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="dark:text-gray-300">自治等级</Label>
                  <Select
                    value={form.autonomyLevel}
                    onValueChange={(v) => setForm((f) => ({ ...f, autonomyLevel: v as AutonomyLevelEnum }))}
                  >
                    <SelectTrigger className="mt-2 dark:bg-gray-900 dark:border-gray-700 dark:text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                      {enumToMessages(AutonomyLevelEnum).map((o) => (
                        <SelectItem key={o.value} value={o.value} className="dark:text-gray-300">
                          {o.message}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label className="dark:text-gray-300">系统提示词</Label>
                <Textarea
                  value={form.systemPrompt}
                  onChange={(e) => setForm((f) => ({ ...f, systemPrompt: e.target.value }))}
                  placeholder="定义智能体的角色、能力和行为准则"
                  maxLength={AGENT_SYSTEM_PROMPT_MAX_LENGTH}
                  rows={6}
                  className="mt-2 dark:bg-gray-900 dark:border-gray-700 dark:text-white resize-none"
                />
                <p className="text-xs text-gray-500 mt-1">
                  不超过 {AGENT_SYSTEM_PROMPT_MAX_LENGTH.toLocaleString()} 字
                </p>
              </div>
              <div>
                <Label className="dark:text-gray-300">欢迎消息</Label>
                <Input
                  value={form.welcomeMessage}
                  onChange={(e) => setForm((f) => ({ ...f, welcomeMessage: e.target.value }))}
                  placeholder="对话开始时的欢迎语"
                  maxLength={AGENT_WELCOME_MESSAGE_MAX_LENGTH}
                  className="mt-2 dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                />
                <p className="text-xs text-gray-500 mt-1">不超过 {AGENT_WELCOME_MESSAGE_MAX_LENGTH} 字</p>
              </div>
              <div>
                <Label className="dark:text-gray-300">建议问题</Label>
                <div className="space-y-2 mt-2">
                  {form.suggestedQuestions.map((q, i) => (
                    <div key={i} className="flex gap-2">
                      <Input
                        value={q}
                        onChange={(e) => updateSuggestedQuestion(i, e.target.value)}
                        placeholder={`建议问题 ${i + 1}`}
                        className="dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeSuggestedQuestion(i)}
                        className="shrink-0 dark:bg-gray-800 dark:border-gray-600"
                      >
                        删除
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addSuggestedQuestion}
                    className="dark:bg-gray-800 dark:border-gray-600"
                  >
                    + 添加建议问题
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* 记忆配置 */}
          <Card className="p-6 dark:bg-gray-800 dark:border-gray-700">
            <h3 className="text-lg mb-4 dark:text-white">记忆配置</h3>
            <div className="space-y-4">
              <div>
                <Label className="dark:text-gray-300">记忆策略</Label>
                <Select
                  value={form.memory.strategy}
                  onValueChange={(v) =>
                    setForm((f) => ({
                      ...f,
                      memory: { ...f.memory, strategy: v as MemoryStrategyEnum },
                    }))
                  }
                >
                  <SelectTrigger className="mt-2 dark:bg-gray-900 dark:border-gray-700 dark:text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                    {enumToMessages(MemoryStrategyEnum).map((o) => (
                      <SelectItem key={o.value} value={o.value} className="dark:text-gray-300">
                        {o.message}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="dark:text-gray-300">窗口大小</Label>
                  <Input
                    type="number"
                    min={1}
                    max={100}
                    value={form.memory.windowSize}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        memory: { ...f.memory, windowSize: parseInt(e.target.value, 10) || 20 },
                      }))
                    }
                    className="mt-2 dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <Label className="dark:text-gray-300">最大 Token 数</Label>
                  <Input
                    type="number"
                    min={100}
                    value={form.memory.maxTokens}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        memory: { ...f.memory, maxTokens: parseInt(e.target.value, 10) || 8000 },
                      }))
                    }
                    className="mt-2 dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                  />
                </div>
              </div>
              <div>
                <Label className="dark:text-gray-300">摘要提示词</Label>
                <Textarea
                  value={form.memory.summaryPrompt}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      memory: { ...f.memory, summaryPrompt: e.target.value },
                    }))
                  }
                  placeholder="用于生成对话摘要的提示词（可选）"
                  maxLength={AGENT_SUMMARY_PROMPT_MAX_LENGTH}
                  rows={3}
                  className="mt-2 dark:bg-gray-900 dark:border-gray-700 dark:text-white resize-none"
                />
                <p className="text-xs text-gray-500 mt-1">不超过 {AGENT_SUMMARY_PROMPT_MAX_LENGTH} 字</p>
              </div>
            </div>
          </Card>

          {/* 关联资源 */}
          <Card className="p-6 dark:bg-gray-800 dark:border-gray-700">
            <h3 className="text-lg mb-4 dark:text-white">关联资源</h3>
            <AgentResourcesSection
              value={form.resources}
              onChange={(v) => setForm((f) => ({ ...f, resources: v }))}
            />
          </Card>
        </div>
      </ScrollArea>

      {/* 底部操作 */}
      <div className="flex justify-between sticky bottom-0 bg-gray-50 dark:bg-gray-900 py-4 border-t border-gray-200 dark:border-gray-700 -mx-7 px-7">
        <Button
          variant="outline"
          onClick={onBack}
          className="dark:bg-gray-800 dark:border-gray-700 dark:text-white"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          取消
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={submitting}
          className="bg-blue-500 hover:bg-blue-600"
        >
          {submitting ? '保存中...' : '保存'}
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>

      <ModelSelectDialog
        open={modelDialogOpen}
        onClose={() => setModelDialogOpen(false)}
        selectedModelId={form.defaultModelId}
        selectedModelName={form.defaultModelName}
        onSelect={(id, name) =>
          setForm((f) => ({
            ...f,
            defaultModelId: id ?? undefined,
            defaultModelName: name ?? undefined,
          }))
        }
      />
    </div>
  );
}
