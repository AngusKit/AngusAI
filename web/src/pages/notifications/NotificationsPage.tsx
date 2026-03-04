import { Bell } from 'lucide-react';
import { useLanguage } from '@/components/ui/LanguageProvider.tsx';
import { useNotificationsData } from './hooks/useNotificationsData.ts';
import { NotificationStatsCards } from './components/NotificationStatsCards.tsx';
import { NotificationCategorySidebar } from './components/NotificationCategorySidebar.tsx';
import { NotificationFilters } from './components/NotificationFilters.tsx';
import { NotificationList } from './components/NotificationList.tsx';

export function NotificationsPage () {
  const { t } = useLanguage();
  const {
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
      <div>
        <h1 className='text-gray-900 dark:text-white flex items-center gap-2'>
          <Bell className='size-6 text-blue-600'/>
          {t('notifications.pageTitle')}
        </h1>
        <p className='text-gray-600 dark:text-gray-400 mt-1'>
          {t('notifications.pageDescription')}
        </p>
      </div>

      <NotificationStatsCards stats={stats} statsLoading={statsLoading}/>

      <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
        <div className='space-y-6'>
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

        <div className='lg:col-span-3'>
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
