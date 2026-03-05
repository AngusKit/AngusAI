/**
 * 活动记录页面
 * 展示团队成员的操作活动记录，支持按目标类型、操作类型、关键词筛选与分页
 */
import { useActivityLog } from './hooks/useActivityLog';
import { ActivityHeader } from './components/ActivityHeader';
import { ActivityStatsCards } from './components/ActivityStatsCards';
import { ActivityFilters } from './components/ActivityFilters';
import { ActivityList } from './components/ActivityList';
import { ActivityDetailDialog } from './components/ActivityDetailDialog';

export function ActivityLogPage() {
  const {
    language,
    searchQuery,
    setSearchQuery,
    selectedTargetType,
    setSelectedTargetType,
    selectedActionType,
    setSelectedActionType,
    currentPage,
    setCurrentPage,
    selectedActivity,
    setSelectedActivity,
    showDetailDialog,
    setShowDetailDialog,
    loading,
    filteredActivities,
    totalPages,
    statsCards,
    handleStatDateRangeChange,
    clearFilters,
  } = useActivityLog();

  const hasFilters =
    searchQuery !== '' || selectedTargetType !== 'all' || selectedActionType !== 'all';

  const handleViewDetail = (activity: typeof selectedActivity) => {
    setSelectedActivity(activity);
    setShowDetailDialog(true);
  };

  return (
    <div className='space-y-6'>
      {/* 头部：标题 + 日期范围按钮 */}
      <ActivityHeader
        language={language}
        onStatDateRangeChange={handleStatDateRangeChange}
      />

      {/* 统计卡片 */}
      <ActivityStatsCards cards={statsCards} />

      {/* 筛选区域 */}
      <ActivityFilters
        language={language}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedTargetType={selectedTargetType}
        onTargetTypeChange={setSelectedTargetType}
        selectedActionType={selectedActionType}
        onActionTypeChange={setSelectedActionType}
      />

      {/* 活动列表 */}
      <ActivityList
        language={language}
        loading={loading}
        activities={filteredActivities}
        hasFilters={hasFilters}
        totalPages={totalPages}
        currentPage={currentPage}
        onClearFilters={clearFilters}
        onViewDetail={handleViewDetail}
        onPageChange={setCurrentPage}
      />

      {/* 详情弹窗 */}
      <ActivityDetailDialog
        open={showDetailDialog}
        onOpenChange={setShowDetailDialog}
        selectedActivity={selectedActivity}
        language={language}
      />
    </div>
  );
}
