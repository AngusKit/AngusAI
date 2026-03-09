/**
 * 工作流列表主页面 Hook
 * 管理视图模式、新建对话框、工作流操作
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import Workflows from '@/services/Workflows';
import { WorkflowStatusEnum } from '@/enums/enums';
import { useWorkflowList } from './useWorkflowList';
import type { WorkflowDisplayItem } from '../utils';

export function useWorkflowPage() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const workflowList = useWorkflowList();
  const { loadWorkflows } = workflowList;

  /** 跳转至设计器 */
  const handleDesignWorkflow = (w: WorkflowDisplayItem) => {
    navigate(
      `/workflow-design?workflowId=${w.id}&workflowName=${encodeURIComponent(w.name)}&workflowStatus=${w.statusDisplay}`
    );
  };

  /** 启动工作流 */
  const handleStartWorkflow = async (w: WorkflowDisplayItem) => {
    try {
      await Workflows.startWorkflow(w.id);
      toast.success(`工作流已启动: ${w.name}`);
      loadWorkflows();
    } catch (e: unknown) {
      toast.error((e as { message?: string })?.message ?? '启动失败');
    }
  };

  /** 停止工作流 */
  const handleStopWorkflow = async (w: WorkflowDisplayItem) => {
    try {
      await Workflows.stopWorkflow(w.id);
      toast.success(`工作流已停止: ${w.name}`);
      loadWorkflows();
    } catch (e: unknown) {
      toast.error((e as { message?: string })?.message ?? '停止失败');
    }
  };

  /** 删除工作流 */
  const handleDeleteWorkflow = async (w: WorkflowDisplayItem) => {
    try {
      await Workflows.deleteWorkflow(w.id);
      toast.success(`工作流已删除: ${w.name}`);
      loadWorkflows();
    } catch (e: unknown) {
      toast.error((e as { message?: string })?.message ?? '删除失败');
    }
  };

  /** 下拉菜单操作分发 */
  const handleAction = (action: string, w: WorkflowDisplayItem) => {
    if (action === '编辑') {
      navigate(`/workflow/${w.id}`);
    } else if (action === '删除') {
      handleDeleteWorkflow(w);
    } else {
      toast.info(`${action}功能敬请期待`);
    }
  };

  /** 创建成功回调 */
  const handleCreateSuccess = () => {
    loadWorkflows();
    setCreateDialogOpen(false);
  };

  /** 传入子组件的操作集合 */
  const workflowActions = {
    onStart: handleStartWorkflow,
    onStop: handleStopWorkflow,
    onDesign: handleDesignWorkflow,
    onNavigate: (w: WorkflowDisplayItem) => navigate(`/workflow/${w.id}`),
    onAction: handleAction,
  };

  return {
    viewMode,
    setViewMode,
    createDialogOpen,
    setCreateDialogOpen,
    workflowList,
    workflowActions,
    handleCreateSuccess,
    openCreateDialog: () => setCreateDialogOpen(true),
  };
}
