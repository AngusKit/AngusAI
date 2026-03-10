import { useLanguage } from '@/components/LanguageProvider.tsx';
import { Database, Search, Filter, Grid3x3, List, Eye, Edit, Trash2, MoreHorizontal, Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { XcanPagination } from '@/components/ui/pagination';
import { CreateModelDialog } from './components/CreateModelDialog';
import { EditModelDialog } from './components/EditModelDialog';
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
            {/* Search Bar */}
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

            {/* Right Side Actions */}
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

          {/* Grid View */}
          {viewMode === 'grid' && (
            <>
              {modelsLoading ? (
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 col-span-full'>
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Card key={i} className='p-5 dark:bg-gray-800 dark:border-gray-700'>
                      <div className='flex items-start justify-between mb-2'>
                        <Skeleton className='w-10 h-10 rounded-lg dark:bg-gray-700' />
                        <Skeleton className='w-10 h-10 rounded-lg dark:bg-gray-700' />
                      </div>
                      <div className='flex items-start gap-3 mb-3'>
                        <Skeleton className='w-12 h-12 rounded-lg dark:bg-gray-700 shrink-0' />
                        <div className='flex-1 space-y-2'>
                          <Skeleton className='h-4 w-28 dark:bg-gray-700' />
                          <Skeleton className='h-5 w-16 dark:bg-gray-700' />
                        </div>
                      </div>
                      <Skeleton className='h-4 w-full mb-2 dark:bg-gray-700' />
                      <Skeleton className='h-4 w-3/4 mb-3 dark:bg-gray-700' />
                      <div className='space-y-2 mb-4'>
                        <div className='flex justify-between'>
                          <Skeleton className='h-3 w-16 dark:bg-gray-700' />
                          <Skeleton className='h-3 w-12 dark:bg-gray-700' />
                        </div>
                        <div className='flex justify-between'>
                          <Skeleton className='h-3 w-14 dark:bg-gray-700' />
                          <Skeleton className='h-3 w-16 dark:bg-gray-700' />
                        </div>
                      </div>
                      <div className='flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700'>
                        <div>
                          <Skeleton className='h-3 w-16 mb-1 dark:bg-gray-700' />
                          <Skeleton className='h-4 w-8 dark:bg-gray-700' />
                        </div>
                        <div>
                          <Skeleton className='h-3 w-16 mb-1 dark:bg-gray-700' />
                          <Skeleton className='h-4 w-12 dark:bg-gray-700' />
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : models.length === 0 ? (
                <Card className='p-12 text-center dark:bg-gray-800 dark:border-gray-700 col-span-full'>
                  <Database className='w-12 h-12 text-gray-400 mx-auto mb-4' />
                  <h3 className='text-lg mb-2 dark:text-white'>
                    {t('models.empty.noModelsFound')}
                  </h3>
                  <p className='text-sm text-gray-600 dark:text-gray-400'>
                    {t('models.empty.tryAdjustingSearch')}
                  </p>
                </Card>
              ) : (
                <>
                  <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                    {models.map(model => {
                      const Icon = model.icon;
                      const toggleDisabled = !model.statusEnum;
                      return (
                        <Card
                          key={model.id}
                          className='p-5 dark:bg-gray-800 dark:border-gray-700 hover:shadow-lg transition-shadow gap-0'
                        >
                          <div className='flex items-start justify-between mb-2'>
                            <button
                              onClick={() => handleToggleStatus(model)}
                              className='p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors'
                              disabled={toggleDisabled || modelsLoading}
                            >
                              {model.statusEnum === ModelStatusEnum.ACTIVE ? (
                                <Pause className='w-4 h-4 text-orange-600 dark:text-orange-400' />
                              ) : (
                                <Play className='w-4 h-4 text-green-600 dark:text-green-400' />
                              )}
                            </button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <button className='p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors'>
                                  <MoreHorizontal className='w-4 h-4 text-gray-600 dark:text-gray-400' />
                                </button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align='end' className='dark:bg-gray-800 dark:border-gray-700'>
                                <DropdownMenuItem
                                  onClick={() => handleViewDetails(model)}
                                  className='dark:text-gray-300'
                                >
                                  <Eye className='w-4 h-4 mr-2' />
                                  {t('models.actions.viewDetails')}
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleOpenEdit(model)} className='dark:text-gray-300'>
                                  <Edit className='w-4 h-4 mr-2' />
                                  {t('models.actions.editConfig')}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleDeleteModel(model)}
                                  className='text-red-600 dark:text-red-400'
                                >
                                  <Trash2 className='w-4 h-4 mr-2' />
                                  {t('models.actions.delete')}
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>

                          <div className='flex items-start gap-3 mb-3'>
                            <div
                              className={`${model.iconBg} w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0`}
                            >
                              <Icon className={`w-6 h-6 ${model.iconColor}`} />
                            </div>
                            <div className='flex-1 min-w-0'>
                              <h3 className='mb-1 dark:text-white'>{model.name}</h3>
                              <Badge className={`text-xs ${model.statusColor} border-0`}>{model.status}</Badge>
                            </div>
                          </div>

                          <p className='text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2'>
                            {model.description}
                          </p>

                          <div className='space-y-2 mb-4 text-xs'>
                            <div className='flex items-center justify-between'>
                              <span className='text-gray-500 dark:text-gray-400'>{t('models.table.provider')}</span>
                              <span className='dark:text-white'>{model.provider}</span>
                            </div>
                            <div className='flex items-center justify-between'>
                              <span className='text-gray-500 dark:text-gray-400'>{t('models.table.latency')}</span>
                              <span className='dark:text-white'>{model.performance.latency}</span>
                            </div>
                          </div>

                          <div className='flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700 text-sm'>
                            <div>
                              <div className='text-gray-500 dark:text-gray-400 text-xs'>{t('models.table.todayCalls')}</div>
                              <div className='dark:text-white'>{model.calls}</div>
                            </div>
                            <div className='text-right'>
                              <div className='text-gray-500 dark:text-gray-400 text-xs'>{t('models.table.todayCost')}</div>
                              <div className='dark:text-white'>{model.cost}</div>
                            </div>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                </>
              )}
            </>
          )}

          {/* List View */}
          {viewMode === 'list' && (
            <Card className='dark:bg-gray-800 dark:border-gray-700'>
              {modelsLoading ? (
                <div className='overflow-x-auto'>
                  <table className='w-full'>
                    <thead className='bg-gray-50 dark:bg-gray-900'>
                      <tr>
                        <th className='px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400' />
                        <th className='px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400' />
                        <th className='px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400' />
                        <th className='px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400' />
                        <th className='px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400' />
                        <th className='px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400' />
                      </tr>
                    </thead>
                    <tbody className='divide-y divide-gray-200 dark:divide-gray-700'>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <tr key={i} className='border-b border-gray-200 dark:border-gray-700'>
                          <td className='px-6 py-4'>
                            <div className='flex items-center gap-3'>
                              <Skeleton className='w-10 h-10 rounded-lg dark:bg-gray-700 shrink-0' />
                              <div className='space-y-2'>
                                <Skeleton className='h-4 w-32 dark:bg-gray-700' />
                                <Skeleton className='h-3 w-20 dark:bg-gray-700' />
                              </div>
                            </div>
                          </td>
                          <td className='px-6 py-4'>
                            <Skeleton className='h-4 w-16 dark:bg-gray-700' />
                          </td>
                          <td className='px-6 py-4'>
                            <Skeleton className='h-5 w-14 rounded dark:bg-gray-700' />
                          </td>
                          <td className='px-6 py-4'>
                            <div className='space-y-2'>
                              <Skeleton className='h-4 w-12 dark:bg-gray-700' />
                              <Skeleton className='h-3 w-16 dark:bg-gray-700' />
                            </div>
                          </td>
                          <td className='px-6 py-4'>
                            <div className='space-y-2'>
                              <Skeleton className='h-4 w-8 dark:bg-gray-700' />
                              <Skeleton className='h-3 w-12 dark:bg-gray-700' />
                            </div>
                          </td>
                          <td className='px-6 py-4'>
                            <div className='flex gap-2'>
                              <Skeleton className='w-8 h-8 rounded dark:bg-gray-700' />
                              <Skeleton className='w-8 h-8 rounded dark:bg-gray-700' />
                              <Skeleton className='w-8 h-8 rounded dark:bg-gray-700' />
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : models.length === 0 ? (
                <div className='p-12 text-center'>
                  <Database className='w-12 h-12 text-gray-400 mx-auto mb-4' />
                  <h3 className='text-lg mb-2 dark:text-white'>
                    {t('models.empty.noModelsFound')}
                  </h3>
                  <p className='text-sm text-gray-600 dark:text-gray-400'>
                    {t('models.empty.tryAdjustingSearch')}
                  </p>
                </div>
              ) : (
                <div className='overflow-x-auto'>
                  <table className='w-full'>
                    <thead className='bg-gray-50 dark:bg-gray-900'>
                      <tr>
                        <th className='px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400'>{t('models.table.model')}</th>
                        <th className='px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400'>{t('models.table.type')}</th>
                        <th className='px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400'>{t('models.table.status')}</th>
                        <th className='px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400'>{t('models.table.performance')}</th>
                        <th className='px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400'>{t('models.table.callsCost')}</th>
                        <th className='px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400'>{t('models.table.actions')}</th>
                      </tr>
                    </thead>
                    <tbody className='divide-y divide-gray-200 dark:divide-gray-700'>
                      {models.map(model => {
                        const Icon = model.icon;
                        return (
                          <tr key={model.id} className='hover:bg-gray-50 dark:hover:bg-gray-900'>
                            <td className='px-6 py-4'>
                              <div className='flex items-center gap-3'>
                                <div
                                  className={`${model.iconBg} w-10 h-10 rounded-lg flex items-center justify-center`}
                                >
                                  <Icon className={`w-5 h-5 ${model.iconColor}`} />
                                </div>
                                <div>
                                  <div className='dark:text-white'>{model.name}</div>
                                  <div className='text-xs text-gray-500 dark:text-gray-400'>
                                    {model.provider}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className='px-6 py-4 text-sm text-gray-600 dark:text-gray-400'>{model.type}</td>
                            <td className='px-6 py-4'>
                              <Badge className={`text-xs ${model.statusColor} border-0`}>{model.status}</Badge>
                            </td>
                            <td className='px-6 py-4 text-sm text-gray-600 dark:text-gray-400'>
                              <div>{model.performance.latency}</div>
                              <div className='text-xs'>{model.performance.accuracy}</div>
                            </td>
                            <td className='px-6 py-4 text-sm text-gray-600 dark:text-gray-400'>
                              <div>{model.calls}</div>
                              <div className='text-xs dark:text-white'>{model.cost}</div>
                            </td>
                            <td className='px-6 py-4'>
                              <div className='flex items-center gap-2'>
                                <button
                                  onClick={() => handleToggleStatus(model)}
                                  className='p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded'
                                  disabled={
                                    !model.statusEnum || modelsLoading
                                  }
                                >
                                  {model.statusEnum === ModelStatusEnum.ACTIVE ? (
                                    <Pause className='w-4 h-4 text-orange-500' />
                                  ) : (
                                    <Play className='w-4 h-4 text-green-500' />
                                  )}
                                </button>
                                <button
                                  onClick={() => handleViewDetails(model)}
                                  className='p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded'
                                >
                                  <Eye className='w-4 h-4 text-blue-500' />
                                </button>
                                <button
                                  onClick={() => handleOpenEdit(model)}
                                  className='p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded'
                                >
                                  <Edit className='w-4 h-4 text-gray-600 dark:text-gray-400' />
                                </button>
                                <button
                                  onClick={() => handleDeleteModel(model)}
                                  className='p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded'
                                >
                                  <Trash2 className='w-4 h-4 text-red-500' />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          )}
          {/* Table View Pagination */}
          {shouldShowPagination && (
            <XcanPagination
              pageSize={itemsPerPage}
              pageNo={currentPage}
              total={modelsTotal}
              onChange={({ pageNo }) => {
                setCurrentPage(pageNo);
              }}
            />
          )}

      {/* 查看详情对话框 */}
      <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
        <DialogContent className='dark:bg-gray-800 dark:border-gray-700 sm:max-w-[700px] max-h-[90vh] overflow-y-auto'>
          <DialogHeader>
            <DialogTitle className='dark:text-white'>{t('models.details.title')}</DialogTitle>
            <DialogDescription className='dark:text-gray-400'>{t('models.details.description')}</DialogDescription>
          </DialogHeader>

          {selectedModel && (
            <div className='space-y-6 py-4'>
              {/* 基本信息 */}
              <div className='flex items-start gap-4'>
                <div
                  className={`${selectedModel.iconBg} w-16 h-16 rounded-lg flex items-center justify-center flex-shrink-0`}
                >
                  {(() => {
                  const Icon = selectedModel.icon;
                  return Icon ? <Icon className={`w-8 h-8 ${selectedModel.iconColor}`} /> : null;
                })()}
                </div>
                <div className='flex-1'>
                  <h3 className='text-xl mb-1 dark:text-white'>{selectedModel.name}</h3>
                  <p className='text-sm text-gray-600 dark:text-gray-400 mb-2'>{selectedModel.description}</p>
                  <Badge className={`text-xs ${selectedModel.statusColor} border-0`}>{selectedModel.status}</Badge>
                </div>
              </div>

              {/* 模型信息 */}
              <div className='grid grid-cols-2 gap-4'>
                <div className='space-y-1'>
                  <div className='text-xs text-gray-500 dark:text-gray-400'>{t('models.table.provider')}</div>
                  <div className='dark:text-white'>{selectedModel.provider}</div>
                </div>
                <div className='space-y-1'>
                  <div className='text-xs text-gray-500 dark:text-gray-400'>{t('models.table.type')}</div>
                  <div className='dark:text-white'>{selectedModel.type}</div>
                </div>
                <div className='space-y-1'>
                  <div className='text-xs text-gray-500 dark:text-gray-400'>{t('models.details.addedAt')}</div>
                  <div className='dark:text-white'>{selectedModel.deployed}</div>
                </div>
              </div>

              {/* 性能指标 */}
              <div className='pt-4 border-t border-gray-200 dark:border-gray-700'>
                <h4 className='text-sm mb-3 dark:text-white'>{t('models.details.performanceMetrics')}</h4>
                <div className='grid grid-cols-3 gap-4'>
                  <Card className='p-4 dark:bg-gray-900 dark:border-gray-700'>
                    <div className='text-xs text-gray-500 dark:text-gray-400 mb-1'>{t('models.table.latency')}</div>
                    <div className='text-lg dark:text-white'>{selectedModel.performance.latency}</div>
                  </Card>
                  <Card className='p-4 dark:bg-gray-900 dark:border-gray-700'>
                    <div className='text-xs text-gray-500 dark:text-gray-400 mb-1'>{t('models.details.throughput')}</div>
                    <div className='text-lg dark:text-white'>{selectedModel.performance.throughput}</div>
                  </Card>
                  <Card className='p-4 dark:bg-gray-900 dark:border-gray-700'>
                    <div className='text-xs text-gray-500 dark:text-gray-400 mb-1'>{t('models.details.accuracy')}</div>
                    <div className='text-lg dark:text-white'>{selectedModel.performance.accuracy}</div>
                  </Card>
                </div>
              </div>

              {/* 使用统计 */}
              <div className='pt-4 border-t border-gray-200 dark:border-gray-700'>
                <h4 className='text-sm mb-3 dark:text-white'>{t('models.details.usageStats')}</h4>
                <div className='grid grid-cols-3 gap-4'>
                  <div className='space-y-1'>
                    <div className='text-xs text-gray-500 dark:text-gray-400'>{t('models.details.totalCalls')}</div>
                    <div className='text-xl dark:text-white'>{selectedModel.calls}</div>
                  </div>
                  <div className='space-y-1'>
                    <div className='text-xs text-gray-500 dark:text-gray-400'>{t('models.details.totalCost')}</div>
                    <div className='text-xl dark:text-white'>{selectedModel.cost}</div>
                  </div>
                  <div className='space-y-1'>
                    <div className='text-xs text-gray-500 dark:text-gray-400'>{t('models.details.totalTokens')}</div>
                    <div className='text-xl dark:text-white'>{selectedModel.tokens || '2.5M'}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => setDetailsDialogOpen(false)}
              className='dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300'
            >
              {t('models.actions.close')}
            </Button>
            <Button
              onClick={() => {
                setDetailsDialogOpen(false);
                selectedModel && handleOpenEdit(selectedModel);
              }}
              className='bg-blue-500 hover:bg-blue-600'
            >
              {t('models.actions.editConfig')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 编辑配置对话框 */}
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
