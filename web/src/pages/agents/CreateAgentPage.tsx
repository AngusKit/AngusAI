import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import Agents from '@/services/Agents';
import Models from '@/services/Models';
import type { AgentCreateDto } from '@/services/AgentsTypes';
import { ModelListVo } from '@/services/ModelsTypes';
import {
  ModelStatusEnum,
  InteractionModeEnum,
  ReasoningStrategyEnum,
  AutonomyLevelEnum,
  MemoryStrategyEnum,
} from '@/enums/enums';
import { enumToMessages } from '@/enums/utils';
import {
  AGENT_SYSTEM_PROMPT_MAX_LENGTH,
  AGENT_WELCOME_MESSAGE_MAX_LENGTH,
  AGENT_SUMMARY_PROMPT_MAX_LENGTH,
} from './constants';
import { AgentResourcesSection, type AgentResourcesFormValue } from './AgentResourcesSection';

export function CreateAgentPage() {
  const navigate = useNavigate();
  const [models, setModels] = useState<ModelListVo[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: '',
    description: '',
    interactionMode: InteractionModeEnum.CHATBOT,
    reasoningStrategy: ReasoningStrategyEnum.FUNCTION_CALLING,
    autonomyLevel: AutonomyLevelEnum.ASSISTANT,
    defaultModelId: undefined as string | undefined,
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

  const loadModels = useCallback(async () => {
    try {
      const res = await Models.getModelList({
        status: ModelStatusEnum.ACTIVE,
        pageNo: 1,
        pageSize: 100,
      });
      const data = (res as any)?.data;
      setModels(data?.list ?? []);
    } catch (e) {
      console.error('Failed to load models:', e);
    }
  }, []);

  useEffect(() => {
    loadModels();
  }, [loadModels]);

  const onBack = () => navigate('/agents');

  const handleSubmit = async () => {
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
      const dto: AgentCreateDto = {
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
      await Agents.createAgent(dto);
      toast.success('智能体创建成功');
      navigate('/agents');
    } catch (error: any) {
      toast.error(error?.message || '创建失败');
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl mb-1 dark:text-white">创建智能体</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          配置智能体名称、模型、对话与记忆能力
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
                <p className="text-xs text-gray-500 mt-1">不超过 100 字</p>
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
                <p className="text-xs text-gray-500 mt-1">不超过 800 字</p>
              </div>
              <div>
                <Label className="dark:text-gray-300">默认模型</Label>
                <Select
                  value={form.defaultModelId != null ? String(form.defaultModelId) : '__none__'}
                  onValueChange={(v) =>
                    setForm((f) => ({
                      ...f,
                      defaultModelId: v && v !== '__none__' ? v : undefined,
                    }))
                  }
                >
                  <SelectTrigger className="mt-2 dark:bg-gray-900 dark:border-gray-700 dark:text-white">
                    <SelectValue placeholder="选择默认模型（可选）" />
                  </SelectTrigger>
                  <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                    <SelectItem value="__none__" className="dark:text-gray-300">
                      （不选择）
                    </SelectItem>
                    {models
                      .filter((m) => m.id != null)
                      .map((m) => (
                        <SelectItem
                          key={String(m.id)}
                          value={String(m.id)}
                          className="dark:text-gray-300"
                        >
                          {m.name ?? m.id}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500 mt-1">可选，可后续修改</p>
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
          {submitting ? '创建中...' : '创建'}
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}
