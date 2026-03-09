/**
 * 新建工作流表单 Hook
 * 表单状态、标签管理、创建提交
 */
import { useState } from 'react';
import { toast } from 'sonner';
import Workflows from '@/services/Workflows';
import { WorkflowTypeEnum } from '@/enums/enums';

const ICON_BG_MAP = ['bg-blue-500', 'bg-yellow-500', 'bg-purple-500', 'bg-green-500', 'bg-indigo-500', 'bg-pink-500', 'bg-orange-500', 'bg-cyan-500', 'bg-gray-500', 'bg-teal-500'];

export function useCreateWorkflowForm(onOpenChange: (open: boolean) => void, onSuccess?: () => void) {
  const [workflowName, setWorkflowName] = useState('');
  const [description, setDescription] = useState('');
  const [workflowType, setWorkflowType] = useState<WorkflowTypeEnum>(WorkflowTypeEnum.SINGLE_TASK);
  const [submitting, setSubmitting] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState(0);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [autoStart, setAutoStart] = useState(false);

  const resetForm = () => {
    setWorkflowName('');
    setDescription('');
    setWorkflowType(WorkflowTypeEnum.SINGLE_TASK);
    setSelectedIcon(0);
    setTags([]);
    setTagInput('');
    setAutoStart(false);
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newTag = tagInput.trim();
      if (!newTag) return;
      if (newTag.length > 10) {
        toast.error('标签长度不能超过10个字符');
        return;
      }
      if (tags.length >= 5) {
        toast.error('最多只能添加5个标签');
        return;
      }
      if (tags.includes(newTag)) {
        toast.error('标签已存在');
        return;
      }
      setTags([...tags, newTag]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleCreate = async () => {
    if (!workflowName.trim()) {
      toast.error('请输入工作流名称');
      return;
    }
    if (!description.trim()) {
      toast.error('请输入工作流描述');
      return;
    }
    setSubmitting(true);
    try {
      const iconBg = ICON_BG_MAP[selectedIcon] ?? 'bg-blue-500';
      await Workflows.createWorkflow({
        name: workflowName.trim(),
        description: description.trim(),
        type: workflowType,
        icon: '🔄',
        iconBg,
      });
      toast.success('工作流创建成功！');
      resetForm();
      onOpenChange(false);
      onSuccess?.();
    } catch (e: unknown) {
      toast.error((e as { message?: string })?.message ?? '创建工作流失败');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    resetForm();
    onOpenChange(false);
  };

  return {
    workflowName,
    setWorkflowName,
    description,
    setDescription,
    workflowType,
    setWorkflowType,
    submitting,
    selectedIcon,
    setSelectedIcon,
    tags,
    tagInput,
    setTagInput,
    autoStart,
    setAutoStart,
    handleAddTag,
    handleRemoveTag,
    handleCreate,
    handleCancel,
  };
}
