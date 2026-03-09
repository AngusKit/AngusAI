/**
 * 工作流详情页 Hook
 * 加载详情、表单编辑、保存、标签管理
 */
import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import Workflows from '@/services/Workflows';
import { WorkflowDetailVo } from '@/services/WorkflowsTypes';
import { WorkflowStatusEnum } from '@/enums/enums';

export function useWorkflowDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [detail, setDetail] = useState<WorkflowDetailVo | null>(null);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<'view' | 'edit'>('view');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: WorkflowStatusEnum.DRAFT,
  });
  const [saving, setSaving] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  const loadDetail = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const res = await Workflows.getWorkflowDetail(id);
      const data = (res as { data?: WorkflowDetailVo }).data;
      if (data) {
        setDetail(data);
        setFormData({
          name: data.name ?? '',
          description: data.description ?? '',
          status: (data.status as WorkflowStatusEnum) ?? WorkflowStatusEnum.DRAFT,
        });
      } else {
        toast.error('工作流不存在');
        navigate('/workflow');
      }
    } catch (e: unknown) {
      toast.error((e as { message?: string })?.message ?? '加载失败');
      navigate('/workflow');
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    loadDetail();
  }, [loadDetail]);

  useEffect(() => {
    if (id && !loading && !detail) {
      navigate('/workflow');
    }
  }, [id, loading, detail, navigate]);

  const handleSave = useCallback(async () => {
    if (!id) return;
    setSaving(true);
    try {
      await Workflows.updateWorkflow(id, {
        name: formData.name,
        description: formData.description,
      });
      toast.success('工作流信息已保存');
      setMode('view');
      loadDetail();
    } catch (e: unknown) {
      toast.error((e as { message?: string })?.message ?? '保存失败');
    } finally {
      setSaving(false);
    }
  }, [id, formData.name, formData.description, loadDetail]);

  const handleEdit = useCallback(() => setMode('edit'), []);

  const handleCancel = useCallback(() => {
    if (detail) {
      setFormData({
        name: detail.name ?? '',
        description: detail.description ?? '',
        status: (detail.status as WorkflowStatusEnum) ?? WorkflowStatusEnum.DRAFT,
      });
    }
    setMode('view');
  }, [detail]);

  const handleAddTag = useCallback(() => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  }, [newTag, tags]);

  const handleRemoveTag = useCallback((tagToRemove: string) => {
    setTags(tags => tags.filter(tag => tag !== tagToRemove));
  }, []);

  const handleDesign = useCallback(() => {
    if (!detail) return;
    const statusDisplayMap: Record<WorkflowStatusEnum, string> = {
      [WorkflowStatusEnum.DRAFT]: '草稿',
      [WorkflowStatusEnum.RUNNING]: '运行中',
      [WorkflowStatusEnum.STOPPED]: '已停止',
    };
    const statusDisplay =
      statusDisplayMap[(detail.status as WorkflowStatusEnum) ?? WorkflowStatusEnum.DRAFT];
    navigate(
      `/workflow-design?workflowId=${id}&workflowName=${encodeURIComponent(detail.name ?? '')}&workflowStatus=${statusDisplay}`
    );
  }, [detail, id, navigate]);

  return {
    id,
    navigate,
    detail,
    loading,
    mode,
    formData,
    setFormData,
    saving,
    newTag,
    setNewTag,
    tags,
    loadDetail,
    handleSave,
    handleEdit,
    handleCancel,
    handleAddTag,
    handleRemoveTag,
    handleDesign,
  };
}
