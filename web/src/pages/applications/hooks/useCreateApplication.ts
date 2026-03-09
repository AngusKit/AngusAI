import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import Agents from '@/services/Agents';
import Applications from '@/services/Applications';
import { AgentStatusEnum } from '@/enums/enums';
import { TAG_MAX_COUNT, TAG_MAX_LENGTH } from '../constants';

/** 智能体列表项（简化） */
export interface AgentListItem {
  id: string;
  name: string;
  description?: string;
}

/**
 * 创建应用页 Hook：两步流程、智能体选择、创建
 */
export function useCreateApplication() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [agentSearchQuery, setAgentSearchQuery] = useState('');
  const [agentsList, setAgentsList] = useState<AgentListItem[]>([]);
  const [agentsLoading, setAgentsLoading] = useState(false);
  const [selectedAgentIds, setSelectedAgentIds] = useState<string[]>([]);
  const [defaultAgentId, setDefaultAgentId] = useState<string | undefined>();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('🤖');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  /** 加载可绑定智能体列表 */
  useEffect(() => {
    setAgentsLoading(true);
    Agents.getAgentList({
      status: AgentStatusEnum.ACTIVE,
      bindable: true,
      pageNo: 1,
      pageSize: 100,
      keyword: agentSearchQuery.trim() || undefined,
    })
      .then((res: any) => {
        const list = (res?.data?.list ?? []).map((a: any) => ({
          id: a.id != null ? String(a.id) : '',
          name: a.name ?? '--',
          description: a.description,
        }));
        setAgentsList(list);
      })
      .catch(() => setAgentsList([]))
      .finally(() => setAgentsLoading(false));
  }, [currentStep, agentSearchQuery]);

  /** 添加标签 */
  const addTag = () => {
    const t = tagInput.trim().slice(0, TAG_MAX_LENGTH);
    if (!t || tags.length >= TAG_MAX_COUNT) return;
    if (tags.includes(t)) return;
    setTags([...tags, t]);
    setTagInput('');
  };
  /** 移除标签 */
  const removeTag = (idx: number) => setTags(tags.filter((_, i) => i !== idx));

  /** 切换智能体选中 */
  const toggleAgent = (id: string) => {
    let next: string[];
    if (selectedAgentIds.includes(id)) {
      next = selectedAgentIds.filter(a => a !== id);
      if (defaultAgentId === id) setDefaultAgentId(next[0]);
    } else {
      next = [...selectedAgentIds, id];
      if (!defaultAgentId) setDefaultAgentId(id);
    }
    setSelectedAgentIds(next);
  };
  /** 设为默认智能体 */
  const setAsDefault = (id: string) => setDefaultAgentId(id);

  /** 下一步 / 完成创建 */
  const handleNext = () => {
    if (currentStep === 1) {
      if (!name.trim()) {
        toast.error('请输入应用名称');
        return;
      }
      setCurrentStep(2);
    } else {
      if (selectedAgentIds.length === 0) {
        toast.error('请至少选择一个智能体');
        return;
      }
      if (!defaultAgentId || !selectedAgentIds.includes(defaultAgentId)) {
        setDefaultAgentId(selectedAgentIds[0]);
      }
      handleCreate();
    }
  };

  /** 调用创建接口 */
  const handleCreate = async () => {
    setSubmitting(true);
    try {
      const res: any = await Applications.createApplication({
        name: name.trim(),
        icon,
        description: description.trim() || undefined,
        tags: tags.length > 0 ? tags : undefined,
        agentIds: selectedAgentIds,
        defaultAgentId: defaultAgentId || selectedAgentIds[0],
      });
      const data = res?.data ?? res;
      const newId = data?.id ?? data?.id;
      toast.success('应用创建成功');
      if (newId) navigate(`/apps/${newId}`);
      else navigate('/apps');
    } catch (error: any) {
      toast.error(error?.data?.message ?? error?.message ?? '创建失败');
    } finally {
      setSubmitting(false);
    }
  };

  /** 上一步 / 取消 */
  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(1);
    else navigate('/apps');
  };

  return {
    currentStep,
    agentSearchQuery,
    setAgentSearchQuery,
    agentsList,
    agentsLoading,
    selectedAgentIds,
    defaultAgentId,
    name,
    setName,
    description,
    setDescription,
    icon,
    setIcon,
    tagInput,
    setTagInput,
    tags,
    submitting,
    addTag,
    removeTag,
    toggleAgent,
    setAsDefault,
    handleNext,
    handleBack,
  };
}
