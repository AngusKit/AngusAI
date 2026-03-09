import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import Agents from '@/services/Agents';
import Models from '@/services/Models';
import type { AgentCreateDto } from '@/services/AgentsTypes';
import type { ModelListVo } from '@/services/ModelsTypes';
import {
  ModelStatusEnum,
  InteractionModeEnum,
  ReasoningStrategyEnum,
  AutonomyLevelEnum,
  MemoryStrategyEnum,
} from '@/enums/enums';
import {
  AGENT_SYSTEM_PROMPT_MAX_LENGTH,
  AGENT_WELCOME_MESSAGE_MAX_LENGTH,
  AGENT_SUMMARY_PROMPT_MAX_LENGTH,
} from '../constants';
import type { AgentResourcesFormValue } from '../components/AgentResourcesSection';

/** 创建智能体表单初始值 */
export const DEFAULT_AGENT_FORM = {
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
};

/**
 * 创建智能体页 Hook：加载模型、表单、提交
 */
export function useCreateAgent() {
  const navigate = useNavigate();
  const [models, setModels] = useState<ModelListVo[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState(DEFAULT_AGENT_FORM);

  /** 加载模型列表 */
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
      console.error('加载模型失败:', e);
    }
  }, []);

  useEffect(() => {
    loadModels();
  }, [loadModels]);

  /** 提交创建 */
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

  /** 建议问题增删改 */
  const addSuggestedQuestion = () => {
    setForm(f => ({ ...f, suggestedQuestions: [...f.suggestedQuestions, ''] }));
  };
  const updateSuggestedQuestion = (index: number, value: string) => {
    setForm(f => {
      const next = [...f.suggestedQuestions];
      next[index] = value;
      return { ...f, suggestedQuestions: next };
    });
  };
  const removeSuggestedQuestion = (index: number) => {
    setForm(f => ({
      ...f,
      suggestedQuestions: f.suggestedQuestions.filter((_, i) => i !== index),
    }));
  };

  return {
    form,
    setForm,
    models,
    submitting,
    handleSubmit,
    addSuggestedQuestion,
    updateSuggestedQuestion,
    removeSuggestedQuestion,
    onBack: () => navigate('/agents'),
  };
}
