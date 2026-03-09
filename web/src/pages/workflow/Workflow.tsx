/**
 * 工作流列表主页面
 * 展示工作流统计、搜索筛选、列表（网格/表格视图）
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import Workflows from '@/services/Workflows';
import { WorkflowStatusEnum } from '@/enums/enums';
import { CreateWorkflowDialog } from './components/CreateWorkflowDialog';
import { WorkflowStatsCards } from './components/WorkflowStatsCards';
import { WorkflowToolbar } from './components/WorkflowToolbar';
import { WorkflowGridView } from './components/WorkflowGridView';
import { WorkflowTableView } from './components/WorkflowTableView';
import { WorkflowPagination } from './components/WorkflowPagination';
import { useWorkflowList, getStatsFromStatistics } from './hooks/useWorkflowList';
import type { WorkflowDisplayItem } from './utils';

export function Workflow() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const {
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    currentPage,
    setCurrentPage,
    workflows,
    totalPages,
    loading,
    statistics,
    statsLoading,
    loadWorkflows,
  } = useWorkflowList();

  const statsDisplay = getStatsFromStatistics(statistics);

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

  return (
    <div className='space-y-6'>
      {/* 页面标题 */}
      <div>
        <h1 className='text-2xl mb-1 dark:text-white'>工作流</h1>
        <p className='text-sm text-gray-600 dark:text-gray-400'>自动化AI任务流程管理</p>
      </div>

      {/* 统计卡片 */}
      <WorkflowStatsCards statsDisplay={statsDisplay} statsLoading={statsLoading} />

      {/* 工具栏 + 列表 */}
      <div>
        <WorkflowToolbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onCreateClick={() => setCreateDialogOpen(true)}
        />

        {viewMode === 'grid' && (
          <>
            <WorkflowGridView
              workflows={workflows}
              loading={loading}
              actions={workflowActions}
              hasFilter={!!(searchQuery.trim() || statusFilter !== 'all')}
              searchQuery={searchQuery.trim() || undefined}
              onCreateClick={() => setCreateDialogOpen(true)}
            />
            <WorkflowPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </>
        )}

        {viewMode === 'table' && (
          <>
            <WorkflowTableView
              workflows={workflows}
              loading={loading}
              actions={workflowActions}
              hasFilter={!!(searchQuery.trim() || statusFilter !== 'all')}
              searchQuery={searchQuery.trim() || undefined}
              onCreateClick={() => setCreateDialogOpen(true)}
            />
            <WorkflowPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </div>

      {/* 新建工作流对话框 */}
      <CreateWorkflowDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSuccess={handleCreateSuccess}
      />
    </div>
  );
}
