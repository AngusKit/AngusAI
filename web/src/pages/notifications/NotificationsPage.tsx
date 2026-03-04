import { Bell } from 'lucide-react';
import { useLanguage } from '@/components/ui/LanguageProvider';
import { useNotificationsData } from './hooks/useNotificationsData';
import { NotificationStatsCards } from './components/NotificationStatsCards';
import { NotificationCategorySidebar } from './components/NotificationCategorySidebar';
import { NotificationFilters } from './components/NotificationFilters';
import { NotificationList } from './components/NotificationList';

/**
 * 通知页面主组件
 * 提供通知消息的查看、筛选、管理等功能
 */
export function NotificationsPage () {
  const { t } = useLanguage();
  const {
    // 状态
    searchTerm,
    setSearchTerm,
    selectedCategory,
    selectedType,
    setSelectedType,
    selectedPriority,
    setSelectedPriority,
    currentPage,
    setCurrentPage,
    notifications,
    stats,
    loading,
    statsLoading,
    total,
    totalPages,

    // 操作方法
    handleToggleRead,
    handleToggleStar,
    handleArchive,
    handleDelete,
    handleMarkAllRead,
    handleRefresh,
    handleCategoryChange
  } = useNotificationsData();

  return (
    <div className='space-y-6'>
      {/* 页面标题 */}
      <div>
        <h1 className='text-gray-900 dark:text-white flex items-center gap-2'>
          <Bell className='size-6 text-blue-600'/>
          {t('notifications.pageTitle')}
        </h1>
        <p className='text-gray-600 dark:text-gray-400 mt-1'>
          {t('notifications.pageDescription')}
        </p>
      </div>

      {/* 统计卡片 */}
      <NotificationStatsCards stats={stats} statsLoading={statsLoading}/>

      {/* 主要内容区域：左侧分类+筛选一列，右侧列表占满剩余空间，两侧最小高度一致 */}
      <div className='flex flex-col sm:flex-row sm:items-stretch gap-6'>
        {/* 左侧边栏 - 消息分类和筛选条件同一列 */}
        <div className='flex shrink-0 flex-col gap-6' style={{ minWidth: 288 }}>
          <NotificationCategorySidebar
            selectedCategory={selectedCategory}
            stats={stats}
            onCategoryChange={handleCategoryChange}
          />
          <NotificationFilters
            selectedType={selectedType}
            selectedPriority={selectedPriority}
            onTypeChange={setSelectedType}
            onPriorityChange={setSelectedPriority}
          />
        </div>

        {/* 右侧内容 - 通知列表占满剩余空间，与左侧同高 */}
        <div className='min-w-0 flex-1 flex flex-col min-h-0'>
          <NotificationList
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            notifications={notifications}
            loading={loading}
            totalPages={totalPages}
            currentPage={currentPage}
            total={total}
            onToggleRead={handleToggleRead}
            onToggleStar={handleToggleStar}
            onArchive={handleArchive}
            onDelete={handleDelete}
            onMarkAllRead={handleMarkAllRead}
            onRefresh={handleRefresh}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
}
