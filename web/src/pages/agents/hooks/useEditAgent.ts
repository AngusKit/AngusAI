import { useState, useCallback, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import Agents from '@/services/Agents';
import type { AgentUpdateDto, AgentDetailVo } from '@/services/AgentsTypes';
import {
  InteractionModeEnum,
  ReasoningStrategyEnum,
  AutonomyLevelEnum,
  MemoryStrategyEnum,
} from '@/enums/enums';
import {
  AGENT_ENCODING_MAX_LENGTH,
  AGENT_SYSTEM_PROMPT_MAX_LENGTH,
  AGENT_WELCOME_MESSAGE_MAX_LENGTH,
  AGENT_SUMMARY_PROMPT_MAX_LENGTH,
} from '../constants';
import { DEFAULT_AGENT_FORM } from './useAgentForm';
import type { AgentResourcesFormValue } from '../components/AgentResourcesSection';

/**
 * 编辑智能体页 Hook：加载详情、表单、提交
 */
export function useEditAgent() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState(DEFAULT_AGENT_FORM);

  /** 加载智能体详情并填充表单 */
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
      const defaultModelId = defaultModel?.id != null ? String(defaultModel.id) : undefined;
      const defaultModelName = defaultModel?.name ?? undefined;
      const resources = d.resources;
      const kbIds = (resources?.knowledgeBases ?? []).map(r => String(r.id));
      const dsIds = (resources?.datasets ?? []).map(r => String(r.id));
      const apiIds = (resources?.apiCollections ?? []).map(r => String(r.id));
      const wfId = resources?.workflow?.id != null ? String(resources.workflow.id) : null;
      const wfName = resources?.workflow?.name ?? null;
      const kbNames = Object.fromEntries(
        (resources?.knowledgeBases ?? []).filter(r => r.id != null && r.name).map(r => [String(r.id), r.name!])
      );
      const dsNames = Object.fromEntries(
        (resources?.datasets ?? []).filter(r => r.id != null && r.name).map(r => [String(r.id), r.name!])
      );
      const apiNames = Object.fromEntries(
        (resources?.apiCollections ?? []).filter(r => r.id != null && r.name).map(r => [String(r.id), r.name!])
      );
      setForm({
        name: d.name ?? '',
        encoding: d.encoding ?? '',
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
        } as AgentResourcesFormValue,
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

  /** 提交更新 */
  const handleSubmit = async () => {
    if (!id) return;
    if (!form.name.trim()) {
      toast.error('请输入智能体名称');
      return;
    }
    if (!form.encoding.trim()) {
      toast.error('请输入智能体编码');
      return;
    }
    if (form.encoding.length > AGENT_ENCODING_MAX_LENGTH) {
      toast.error(`智能体编码不超过 ${AGENT_ENCODING_MAX_LENGTH} 字符`);
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
        encoding: form.encoding.trim(),
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
    id,
    loading,
    form,
    setForm,
    submitting,
    handleSubmit,
    addSuggestedQuestion,
    updateSuggestedQuestion,
    removeSuggestedQuestion,
    onBack: () => navigate('/agents'),
  };
}
