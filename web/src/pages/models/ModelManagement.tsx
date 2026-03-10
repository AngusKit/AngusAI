import { useLanguage } from '@/components/LanguageProvider.tsx';
import { Search, Filter, Grid3x3, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CreateModelDialog } from './components/CreateModelDialog';
import { EditModelDialog } from './components/EditModelDialog';
import { ModelDetailsDialog } from './components/ModelDetailsDialog';
import { ModelList } from './components/ModelList';
import { useModelManagement, type SortOption } from './hooks/useModelManagement';
import { ModelStatusEnum, ModelTypeEnum } from '@/enums/enums';
import { PAGINATION_CONFIG } from './constants';

export function ModelManagement() {
  const { t } = useLanguage();

  const {
    models,
    modelsLoading,
    modelsTotal,
    currentPage,
    searchQuery,
    typeFilter,
    statusFilter,
    sortBy,
    viewMode,
    addModelDialogOpen,
    detailsDialogOpen,
    editDialogOpen,
    selectedModel,
    formData,
    editFormData,
    providerOptions,
    setCurrentPage,
    setSearchQuery,
    setTypeFilter,
    setStatusFilter,
    setSortBy,
    setViewMode,
    setAddModelDialogOpen,
    setDetailsDialogOpen,
    setEditDialogOpen,
    handleToggleStatus,
    handleViewDetails,
    handleOpenEdit,
    handleSaveEdit,
    handleDeleteModel,
    handleAddModel,
    handleFormDataChange,
    handleEditFormDataChange,
    resetForm,
    resetEditForm,
    statsCards,
    shouldShowPagination,
    modelTypeOptions,
  } = useModelManagement();

  const itemsPerPage = PAGINATION_CONFIG.DEFAULT_PAGE_SIZE;

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div>
        <h1 className='text-2xl mb-1 dark:text-white'>{t('models.title')}</h1>
        <p className='text-sm text-gray-600 dark:text-gray-400'>{t('models.subtitle')}</p>
      </div>

      {/* Stats Cards */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
        {statsCards.map(stat => {
          const Icon = stat.icon;
          return (
            <Card key={stat.key} className='px-5 pt-5 pb-3 dark:bg-gray-800 dark:border-gray-700'>
              <div className='flex items-start justify-between mb-1.5'>
                <div className={`${stat.iconBg} w-10 h-10 rounded-lg flex items-center justify-center`}>
                  <Icon className='w-5 h-5 text-white' />
                </div>
                {stat.trend && (
                  <span
                    className={`text-sm ${stat.trendUp ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}
                  >
                    {stat.trend}
                  </span>
                )}
              </div>
              <div className='text-base font-semibold text-gray-600 dark:text-gray-400 mb-0.5'>{stat.label}</div>
              <div className='text-3xl dark:text-white mb-0.5'>{stat.value}</div>
              <div className='text-xs text-gray-500 dark:text-gray-400'>{stat.subtext}</div>
            </Card>
          );
        })}
      </div>

      {/* Action Bar */}
      <div className='flex items-center justify-between gap-3'>
        <div className='relative w-[390px]'>
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400' />
          <Input
            placeholder={t('models.searchPlaceholder')}
            value={searchQuery}
            onChange={e => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className='pl-9 dark:bg-gray-800 dark:border-gray-700'
          />
        </div>

        <div className='flex items-center gap-2'>
          <Select
            value={typeFilter}
            onValueChange={value => {
              setTypeFilter(value as 'all' | ModelTypeEnum);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className='w-[140px] dark:bg-gray-800 dark:border-gray-700'>
              <Filter className='w-4 h-4 mr-2' />
              <SelectValue placeholder={t('models.filters.typeFilterPlaceholder')} />
            </SelectTrigger>
            <SelectContent className='dark:bg-gray-800 dark:border-gray-700'>
              <SelectItem value='all' className='dark:text-gray-300'>
                {t('models.filters.allTypes')}
              </SelectItem>
              {modelTypeOptions.map(option => {
                const Icon = option.icon;
                return (
                  <SelectItem key={option.value} value={option.value} className='dark:text-gray-300'>
                    <div className='flex items-center gap-2'>
                      <Icon className='w-4 h-4' />
                      {option.label}
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>

          <Select
            value={statusFilter}
            onValueChange={value => {
              setStatusFilter(value as 'all' | ModelStatusEnum);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className='w-[140px] dark:bg-gray-800 dark:border-gray-700'>
              <SelectValue placeholder={t('models.filters.statusFilterPlaceholder')} />
            </SelectTrigger>
            <SelectContent className='dark:bg-gray-800 dark:border-gray-700'>
              <SelectItem value='all' className='dark:text-gray-300'>
                {t('models.filters.allStatuses')}
              </SelectItem>
              <SelectItem value={ModelStatusEnum.ACTIVE} className='dark:text-gray-300'>
                {t('models.filters.active')}
              </SelectItem>
              <SelectItem value={ModelStatusEnum.DISABLED} className='dark:text-gray-300'>
                {t('models.filters.disabled')}
              </SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={sortBy}
            onValueChange={value => {
              setSortBy(value as SortOption);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className='w-[140px] dark:bg-gray-800 dark:border-gray-700'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className='dark:bg-gray-800 dark:border-gray-700'>
              <SelectItem value='default' className='dark:text-gray-300'>
                {t('models.filters.defaultSort')}
              </SelectItem>
              <SelectItem value='name' className='dark:text-gray-300'>
                {t('common.labels.name')}
              </SelectItem>
              <SelectItem value='provider' className='dark:text-gray-300'>
                {t('models.provider')}
              </SelectItem>
              <SelectItem value='status' className='dark:text-gray-300'>
                {t('models.status')}
              </SelectItem>
              <SelectItem value='createdDate' className='dark:text-gray-300'>
                {t('models.filters.createdDate')}
              </SelectItem>
            </SelectContent>
          </Select>

          <div className='flex items-center gap-1 border border-gray-200 dark:border-gray-700 rounded-lg p-1'>
            <Button
              variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
              size='sm'
              onClick={() => setViewMode('grid')}
              className='h-8 w-8 p-0'
            >
              <Grid3x3 className='w-4 h-4' />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'secondary' : 'ghost'}
              size='sm'
              onClick={() => setViewMode('list')}
              className='h-8 w-8 p-0'
            >
              <List className='w-4 h-4' />
            </Button>
          </div>

          <CreateModelDialog
            open={addModelDialogOpen}
            onOpenChange={setAddModelDialogOpen}
            formData={formData}
            onFormDataChange={handleFormDataChange}
            onSubmit={handleAddModel}
            onReset={resetForm}
            providerOptions={providerOptions}
          />
        </div>
      </div>

      <ModelList
        models={models}
        modelsLoading={modelsLoading}
        modelsTotal={modelsTotal}
        currentPage={currentPage}
        viewMode={viewMode}
        itemsPerPage={itemsPerPage}
        shouldShowPagination={shouldShowPagination}
        onPageChange={setCurrentPage}
        onToggleStatus={handleToggleStatus}
        onViewDetails={handleViewDetails}
        onOpenEdit={handleOpenEdit}
        onDelete={handleDeleteModel}
      />

      <ModelDetailsDialog
        open={detailsDialogOpen}
        onOpenChange={setDetailsDialogOpen}
        selectedModel={selectedModel}
        onEdit={handleOpenEdit}
      />

      <EditModelDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        formData={editFormData}
        onFormDataChange={handleEditFormDataChange}
        onSubmit={handleSaveEdit}
        onReset={resetEditForm}
        providerOptions={providerOptions}
      />
    </div>
  );
}
