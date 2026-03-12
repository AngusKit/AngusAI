import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import Applications from '@/services/Applications';
import { ApplicationStatusEnum } from '@/enums/enums';
import { TAG_MAX_COUNT, TAG_MAX_LENGTH } from '../constants';

/** 发布状态（前端 Select 用） */
export type PublishStatusValue = 'draft' | 'published' | 'paused';

/**
 * 应用设置页 Hook：加载详情、表单状态、保存各 Tab 配置
 */
export function useAppSettings() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // 基本信息
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  // 配置更新需要保留的 agentIds
  const [agentIds, setAgentIds] = useState<string[]>([]);
  const [defaultAgentId, setDefaultAgentId] = useState<string | undefined>();

  // 功能设置
  const [enableFileUpload, setEnableFileUpload] = useState(true);
  const [enableVoiceInput, setEnableVoiceInput] = useState(true);
  const [enableImageInput, setEnableImageInput] = useState(false);
  const [enablePromptLibrary, setEnablePromptLibrary] = useState(true);
  const [enableSessionList, setEnableSessionList] = useState(true);
  const [enableSwitchApp, setEnableSwitchApp] = useState(true);

  // 安全与隐私
  const [enableContentFilter, setEnableContentFilter] = useState(true);
  const [enableDataEncryption, setEnableDataEncryption] = useState(true);
  const [dataRetentionDays, setDataRetentionDays] = useState('30');

  // 发布设置
  const [publishStatus, setPublishStatus] = useState<PublishStatusValue>('published');
  const [publicAccess, setPublicAccess] = useState(false);
  const [embedEnabled, setEmbedEnabled] = useState(true);
  const [apiEnabled, setApiEnabled] = useState(true);

  // 各 Tab 保存中状态
  const [savingBasic, setSavingBasic] = useState(false);
  const [savingFeatures, setSavingFeatures] = useState(false);
  const [savingSecurity, setSavingSecurity] = useState(false);
  const [savingPublish, setSavingPublish] = useState(false);

  /** 加载应用详情并初始化表单 */
  const loadDetail = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const res: any = await Applications.getApplicationDetail(id);
      const d = res?.data ?? res;
      if (!d?.id && !d?.name) {
        toast.error('应用不存在');
        navigate('/apps');
        return;
      }
      setName(d.name ?? '');
      setDescription(d.description ?? '');
      setTags(d.tags ?? []);
      const agents = d.config?.agents ?? d.agents ?? [];
      const ids = agents.map((a: any) => String(a.id)).filter(Boolean);
      setAgentIds(ids.length > 0 ? ids : []);
      const def = d.config?.defaultAgent ?? d.defaultAgent;
      setDefaultAgentId(def?.id != null ? String(def.id) : ids[0]);
      const f = d.config?.features;
      if (f) {
        setEnableFileUpload(f.enableFileUpload ?? true);
        setEnableVoiceInput(f.enableVoiceInput ?? true);
        setEnableImageInput(f.enableImageInput ?? false);
        setEnablePromptLibrary(f.enablePromptLibrary ?? true);
        setEnableSessionList(f.enableSessionList ?? true);
        setEnableSwitchApp(f.enableSwitchApp ?? true);
      }
      const s = d.config?.security;
      if (s) {
        setEnableContentFilter(s.enableContentFilter ?? true);
        setEnableDataEncryption(s.enableDataEncryption ?? true);
        setDataRetentionDays(String(s.dataRetentionDays ?? 30));
      }
      const p = d.config?.publish;
      if (p) {
        setPublicAccess(p.publicAccess ?? false);
        setEmbedEnabled(p.embedEnabled ?? true);
        setApiEnabled(p.apiEnabled ?? true);
      }
      const status = d.status;
      setPublishStatus(
        status === 'PUBLISHED' ? 'published' : status === 'DRAFT' ? 'draft' : status === 'PAUSED' ? 'paused' : 'published'
      );
    } catch (err: any) {
      toast.error(err?.message || err?.data?.message || '加载失败');
      navigate('/apps');
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    loadDetail();
  }, [loadDetail]);

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

  /** 保存基本信息 */
  const handleSaveBasicInfo = async () => {
    if (!id) return;
    if (!name.trim()) {
      toast.error('请输入应用名称');
      return;
    }
    setSavingBasic(true);
    try {
      await Applications.updateApplication(id, {
        name: name.trim(),
        description: description.trim() || undefined,
        tags: tags.length > 0 ? tags : undefined,
      });
      toast.success('基本信息已保存');
    } catch (err: any) {
      toast.error(err?.data?.message ?? err?.message ?? '保存失败');
    } finally {
      setSavingBasic(false);
    }
  };

  /** 统一保存配置（功能/安全 Tab） */
  const saveConfig = async (
    payload: { features?: object; security?: object; publish?: object },
    setSaving: (v: boolean) => void,
    successMsg: string
  ) => {
    if (!id) return;
    if (agentIds.length === 0) {
      toast.error('应用未绑定智能体，请先在编辑页绑定');
      return;
    }
    setSaving(true);
    try {
      await Applications.updateApplicationConfig(id, {
        agentIds,
        defaultAgentId,
        ...payload,
      } as any);
      toast.success(successMsg);
    } catch (err: any) {
      toast.error(err?.data?.message ?? err?.message ?? '保存失败');
    } finally {
      setSaving(false);
    }
  };

  /** 保存功能设置 */
  const handleSaveFeatures = () =>
    saveConfig(
      {
        features: {
          enableFileUpload,
          enableVoiceInput,
          enableImageInput,
          enablePromptLibrary,
          enableSessionList,
          enableSwitchApp,
        },
      },
      setSavingFeatures,
      '功能设置已保存'
    );

  /** 保存安全设置 */
  const handleSaveSecurity = () => {
    const days = parseInt(String(dataRetentionDays), 10);
    if (isNaN(days) || days < 1) {
      toast.error('数据保留天数须大于 0');
      return;
    }
    saveConfig(
      {
        security: {
          enableContentFilter,
          enableDataEncryption,
          dataRetentionDays: days,
        },
      },
      setSavingSecurity,
      '安全设置已保存'
    );
  };

  /** 保存发布设置（含发布状态 modifyApplicationStatus） */
  const handleSavePublish = async () => {
    if (!id) return;
    if (agentIds.length === 0) {
      toast.error('应用未绑定智能体，请先在编辑页绑定');
      return;
    }
    setSavingPublish(true);
    try {
      await Applications.updateApplicationConfig(id, {
        agentIds,
        defaultAgentId,
        publish: { publicAccess, embedEnabled, apiEnabled },
      } as any);
      const targetStatus =
        publishStatus === 'published'
          ? ApplicationStatusEnum.PUBLISHED
          : publishStatus === 'paused'
            ? ApplicationStatusEnum.PAUSED
            : ApplicationStatusEnum.DRAFT;
      await Applications.modifyApplicationStatus(id, { status: targetStatus });
      toast.success('发布设置已保存');
    } catch (err: any) {
      toast.error(err?.data?.message ?? err?.message ?? '保存失败');
    } finally {
      setSavingPublish(false);
    }
  };

  return {
    id,
    loading,
    name,
    setName,
    description,
    setDescription,
    tagInput,
    setTagInput,
    tags,
    agentIds,
    enableFileUpload,
    setEnableFileUpload,
    enableVoiceInput,
    setEnableVoiceInput,
    enableImageInput,
    setEnableImageInput,
    enablePromptLibrary,
    setEnablePromptLibrary,
    enableSessionList,
    setEnableSessionList,
    enableSwitchApp,
    setEnableSwitchApp,
    enableContentFilter,
    setEnableContentFilter,
    enableDataEncryption,
    setEnableDataEncryption,
    dataRetentionDays,
    setDataRetentionDays,
    publishStatus,
    setPublishStatus,
    publicAccess,
    setPublicAccess,
    embedEnabled,
    setEmbedEnabled,
    apiEnabled,
    setApiEnabled,
    savingBasic,
    savingFeatures,
    savingSecurity,
    savingPublish,
    addTag,
    removeTag,
    handleSaveBasicInfo,
    handleSaveFeatures,
    handleSaveSecurity,
    handleSavePublish,
    handleBack: () => navigate(id ? `/apps/${id}` : '/apps'),
  };
}
