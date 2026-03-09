/**
 * 工作流列表主页面
 * 展示工作流统计、搜索筛选、列表（网格/表格视图）
 */
import { CreateWorkflowDialog } from './components/CreateWorkflowDialog';
import { WorkflowStatsCards } from './components/WorkflowStatsCards';
import { WorkflowToolbar } from './components/WorkflowToolbar';
import { WorkflowGridView } from './components/WorkflowGridView';
import { WorkflowTableView } from './components/WorkflowTableView';
import { WorkflowPagination } from './components/WorkflowPagination';
import { useWorkflowPage } from './hooks/useWorkflowPage';
import { getStatsFromStatistics } from './hooks/useWorkflowList';

export function Workflow() {
  const {
    viewMode,
    setViewMode,
    createDialogOpen,
    setCreateDialogOpen,
    workflowList,
    workflowActions,
    handleCreateSuccess,
    openCreateDialog,
  } = useWorkflowPage();

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
  } = workflowList;

  const statsDisplay = getStatsFromStatistics(statistics);

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
          onCreateClick={openCreateDialog}
        />

        {viewMode === 'grid' && (
          <>
            <WorkflowGridView
              workflows={workflows}
              loading={loading}
              actions={workflowActions}
              hasFilter={!!(searchQuery.trim() || statusFilter !== 'all')}
              searchQuery={searchQuery.trim() || undefined}
              onCreateClick={openCreateDialog}
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
              onCreateClick={openCreateDialog}
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
