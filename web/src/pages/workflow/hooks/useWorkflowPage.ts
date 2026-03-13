/**
 * 工作流列表主页面 Hook
 * 管理视图模式、新建页面跳转、工作流操作
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import Workflows from '@/services/Workflows';
import { VisibilityEnum } from '@/enums/enums';
import { useWorkflowList } from './useWorkflowList';
import type { WorkflowDisplayItem } from '../utils';

export function useWorkflowPage() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

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

  /** 克隆工作流 */
  const handleCloneWorkflow = async (w: WorkflowDisplayItem) => {
    try {
      const res = await Workflows.cloneWorkflow(w.id);
      const data = (res as { data?: { id?: string } }).data;
      toast.success(`工作流已复制: ${w.name}`);
      loadWorkflows();
      if (data?.id) {
        navigate(`/workflow/${data.id}`);
      }
    } catch (e: unknown) {
      toast.error((e as { message?: string })?.message ?? '复制失败');
    }
  };

  /** 修改可见性 */
  const handleModifyVisibility = async (w: WorkflowDisplayItem, visibility: VisibilityEnum) => {
    try {
      await Workflows.modifyWorkflowVisibility(w.id, { visibility });
      toast.success(`可见性已修改`);
      loadWorkflows();
    } catch (e: unknown) {
      toast.error((e as { message?: string })?.message ?? '修改失败');
    }
  };

  /** 编辑流程信息（跳转详情页） */
  const handleEditInfo = (w: WorkflowDisplayItem) => {
    navigate(`/workflow/${w.id}`);
  };

  /** 下拉菜单操作分发 */
  const handleAction = (action: string, w: WorkflowDisplayItem, extra?: unknown) => {
    if (action === '编辑信息') {
      handleEditInfo(w);
    } else if (action === '删除') {
      handleDeleteWorkflow(w);
    } else if (action === '复制') {
      handleCloneWorkflow(w);
    } else if (action === '修改可见性' && extra != null) {
      handleModifyVisibility(w, extra as VisibilityEnum);
    } else if (action === '编辑') {
      navigate(`/workflow/${w.id}`);
    } else {
      toast.info(`${action}功能敬请期待`);
    }
  };

  /** 传入子组件的操作集合 */
  const workflowActions = {
    onStart: handleStartWorkflow,
    onStop: handleStopWorkflow,
    onDesign: handleDesignWorkflow,
    onNavigate: (w: WorkflowDisplayItem) => navigate(`/workflow/${w.id}`),
    onEditInfo: handleEditInfo,
    onModifyVisibility: handleModifyVisibility,
    onClone: handleCloneWorkflow,
    onAction: handleAction,
  };

  return {
    viewMode,
    setViewMode,
    workflowList,
    workflowActions,
    openCreatePage: () => navigate('/workflow/create'),
  };
}
