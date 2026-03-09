import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
 * 编辑应用页 Hook：加载详情、智能体列表、保存
 */
export function useEditApplication() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState<any>(null);
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

  /** 加载应用详情 */
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    Applications.getApplicationDetail(id)
      .then((res: any) => {
        const d = res?.data ?? res;
        if (!d) {
          toast.error('应用不存在');
          navigate('/apps');
          return;
        }
        setDetail(d);
        setName(d.name ?? '');
        setDescription(d.description ?? '');
        setIcon(d.icon && /[\u{1F300}-\u{1F9FF}\u2600-\u26FF\u2700-\u27BF]/u.test(d.icon) ? d.icon : '🤖');
        setTags(d.tags ?? []);
        const agents = d.config?.agents ?? d.agents ?? [];
        const ids = agents.map((a: any) => String(a.id)).filter(Boolean);
        setSelectedAgentIds(ids.length > 0 ? ids : []);
        const def = d.config?.defaultAgent ?? d.defaultAgent;
        setDefaultAgentId(def?.id != null ? String(def.id) : ids[0]);
      })
      .catch(() => {
        toast.error('加载失败');
        navigate('/apps');
      })
      .finally(() => setLoading(false));
  }, [id, navigate]);

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
  }, [agentSearchQuery]);

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
  const toggleAgent = (agentId: string) => {
    if (selectedAgentIds.includes(agentId)) {
      const next = selectedAgentIds.filter(a => a !== agentId);
      setSelectedAgentIds(next);
      if (defaultAgentId === agentId) setDefaultAgentId(next[0]);
    } else {
      const next = [...selectedAgentIds, agentId];
      setSelectedAgentIds(next);
      if (!defaultAgentId) setDefaultAgentId(agentId);
    }
  };
  /** 设为默认智能体 */
  const setAsDefault = (agentId: string) => setDefaultAgentId(agentId);

  /** 保存 */
  const handleSave = async () => {
    if (!id) return;
    if (!name.trim()) {
      toast.error('请输入应用名称');
      return;
    }
    if (selectedAgentIds.length === 0) {
      toast.error('请至少选择一个智能体');
      return;
    }
    setSubmitting(true);
    try {
      await Applications.updateApplication(id, {
        name: name.trim(),
        icon,
        description: description.trim() || undefined,
        tags: tags.length > 0 ? tags : undefined,
        agentIds: selectedAgentIds,
        defaultAgentId: defaultAgentId || selectedAgentIds[0],
      });
      toast.success('保存成功');
      navigate(`/apps/${id}`);
    } catch (error: any) {
      toast.error(error?.data?.message ?? error?.message ?? '保存失败');
    } finally {
      setSubmitting(false);
    }
  };

  return {
    id,
    loading,
    detail,
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
    handleSave,
    handleBack: () => navigate(`/apps/${id}`),
  };
}
