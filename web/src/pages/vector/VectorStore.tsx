import { useCallback, useState } from 'react';
import { Database, Plus, Search, X, Settings, Trash2, Play, Grid3x3, List, Edit, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, } from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { useLanguage } from '@/components/ui/LanguageProvider';
import { XcanPagination } from '@/components/ui/pagination';
import VectorStoresService from '@/services/VectorStores';
import { VectorStoreTypeEnum } from '@/enums/enums';
import { PAGINATION_CONFIG } from './constants';
import { formatNumber, formatVectorCount, getVectorStoreTypeInfo, getVectorStoreStatusInfo } from './utils';
import { useVectorStoreManagement } from './hooks/useVectorStoreManagement';
import { useVectorStoreForm } from './hooks/useVectorStoreForm';
import { CreateVectorStoreDialog } from './components/CreateVectorStoreDialog';
import { EditVectorStoreDialog } from './components/EditVectorStoreDialog';
import type { VectorStoreItem, VectorStoreStatus } from './types';

export function VectorStore() {
  const { language, t } = useLanguage();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingStore, setEditingStore] = useState<VectorStoreItem | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [testingConnectionId, setTestingConnectionId] = useState<string | null>(null);

  // 使用业务逻辑 Hook
  const {
    vectorStores,
    vectorStoresLoading,
    vectorStoresTotal,
    currentPage,
    searchQuery,
    viewMode,
    setCurrentPage,
    setSearchQuery,
    setViewMode,
    loadVectorStores,
    loadStatistics,
    ensureVectorStoreDetail,
    statsCards,
    shouldShowPagination,
  } = useVectorStoreManagement();

  // 使用表单 Hook
  const {
    formData,
    setFormData,
    resetForm,
    handleCreateStore,
    handleUpdateStore,
    handleTestConnection,
    populateFormFromStore,
  } = useVectorStoreForm();

  // 获取类型和状态信息的辅助函数
  const getTypeInfo = useCallback((type?: VectorStoreTypeEnum | string) => {
    return getVectorStoreTypeInfo(type);
  }, []);

  const getStatusInfo = useCallback(
    (status: VectorStoreStatus) => {
      return getVectorStoreStatusInfo(status, language);
    },
    [language]
  );


  const handleToggleStore = async (store: VectorStoreItem) => {
    if (togglingId === store.id) {
      return;
    }
    setTogglingId(store.id);
    try {
      await VectorStoresService.vectorStoreToggleEnabled(store.id, { enabled: !store.enabled });
      toast.success(
        store.enabled ? t('vector.messages.storeDisabled', { name: store.name }) : t('vector.messages.storeEnabled', { name: store.name })
      );
      await Promise.all([loadVectorStores(), loadStatistics()]);
    } catch (error: any) {
      console.error('Failed to toggle vector store:', error);
      toast.error(error?.message || t('vector.messages.updateEnabledStatusFailed'));
    } finally {
      setTogglingId(null);
    }
  };

  const handleTestConnectionWrapper = async (store: VectorStoreItem) => {
    if (testingConnectionId === store.id) {
      return;
    }
    setTestingConnectionId(store.id);
    try {
      const detailedStore = await ensureVectorStoreDetail(store);
      const success = await handleTestConnection(detailedStore, () => {
        // Status update callback - could be used to update local state if needed
      });
      if (success) {
        await loadVectorStores();
      }
    } catch (error: any) {
      console.error('Failed to test vector store connection:', error);
    } finally {
      setTestingConnectionId(null);
    }
  };

  const handleCreateStoreSubmit = async () => {
    const success = await handleCreateStore(async () => {
    setShowCreateDialog(false);
      setCurrentPage(1);
      await Promise.all([loadVectorStores(), loadStatistics()]);
    });
    if (!success) {
      // Error already handled in hook
    }
  };

  const handleEditStoreSubmit = async () => {
    if (!editingStore) {
      return;
    }
    const success = await handleUpdateStore(editingStore.id, editingStore.type, async () => {
    setShowEditDialog(false);
    setEditingStore(null);
      await Promise.all([loadVectorStores(), loadStatistics()]);
    });
    if (!success) {
      // Error already handled in hook
    }
  };

  const handleFormDataChange = (data: Partial<typeof formData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const handleDeleteStore = async (store: VectorStoreItem) => {
    if (deletingId === store.id) {
      return;
    }
    setDeletingId(store.id);
    try {
      await VectorStoresService.vectorStoreDelete(store.id);
      toast.success(t('vector.messages.storeDeleted', { name: store.name }));
      await Promise.all([loadVectorStores(), loadStatistics()]);
    } catch (error: any) {
      console.error('Failed to delete vector store:', error);
      toast.error(error?.message || t('vector.messages.deleteStoreFailed'));
    } finally {
      setDeletingId(null);
    }
  };

  const openEditDialog = async (store: VectorStoreItem) => {
    const detailedStore = await ensureVectorStoreDetail(store);
    setEditingStore(detailedStore);
    populateFormFromStore(detailedStore);
    setShowEditDialog(true);
  };

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div>
        <h1 className='text-2xl mb-1 dark:text-white'>{t('vector.title')}</h1>
        <p className='text-sm text-gray-600 dark:text-gray-400'>
          {t('vector.subtitle')}
        </p>
      </div>

      {/* Stats Cards */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
        {statsCards.map(card => {
          const Icon = card.icon;
          return (
            <Card key={card.key} className='px-5 pt-5 pb-3 dark:bg-gray-800 dark:border-gray-700'>
              <div className='flex items-start justify-between mb-1.5'>
                <div className={`${card.iconBg} w-10 h-10 rounded-lg flex items-center justify-center`}>
                  <Icon className='w-5 h-5 text-white' />
                </div>
              </div>
              <div className='text-base font-semibold text-gray-600 dark:text-gray-400 mb-0.5'>{card.label}</div>
              <div className='text-3xl dark:text-white mb-0.5'>{card.value}</div>
              <div className='text-xs text-gray-500 dark:text-gray-400'>{card.subtext}</div>
            </Card>
          );
        })}
      </div>

      {/* Search and Actions */}
      <div className='flex items-center justify-between gap-3'>
        <div className='relative w-[390px]'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500' />
          <Input
            placeholder={t('vector.searchPlaceholder')}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className='pl-10 pr-10 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100'
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors'
            >
              <X className='w-4 h-4' />
            </button>
          )}
        </div>

        <div className='flex items-center gap-3'>
          {/* View Toggle */}
          <div className='flex items-center gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg'>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded transition-colors ${
                viewMode === 'grid' ? 'bg-white dark:bg-gray-700 shadow-sm' : 'hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
              title={t('vector.gridView')}
            >
              <Grid3x3 className='w-4 h-4 text-gray-600 dark:text-gray-400' />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded transition-colors ${
                viewMode === 'list' ? 'bg-white dark:bg-gray-700 shadow-sm' : 'hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
              title={t('vector.listView')}
            >
              <List className='w-4 h-4 text-gray-600 dark:text-gray-400' />
            </button>
          </div>

          <Button onClick={() => setShowCreateDialog(true)} className='gap-2 dark:bg-blue-600 dark:hover:bg-blue-700'>
            <Plus className='w-4 h-4' />
            {t('vector.addStore')}
          </Button>
        </div>
      </div>

      {/* Vector Stores Content */}
      {vectorStoresLoading ? (
        <div className='text-center py-12'>
          <Activity className='w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-3 animate-spin' />
          <p className='text-gray-600 dark:text-gray-400'>
            {t('vector.loadingStores')}
          </p>
        </div>
      ) : vectorStores.length === 0 ? (
        <div className='text-center py-12'>
          <Database className='w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-3' />
          <p className='text-gray-600 dark:text-gray-400'>
            {t('vector.noStoresFound')}
          </p>
          <p className='text-sm text-gray-500 dark:text-gray-500 mt-1'>
            {searchQuery ? t('vector.tryDifferentSearch') : t('vector.clickToAddStore')}
          </p>
        </div>
      ) : (
        <>
          {/* Grid View */}
          {viewMode === 'grid' && (
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
              {vectorStores.map(store => {
                const typeInfo = getTypeInfo(store.type);
                const statusInfo = getStatusInfo(store.status);
                const isToggling = togglingId === store.id;
                const isTesting = testingConnectionId === store.id;
                const isDeleting = deletingId === store.id;
                return (
                  <Card
                    key={store.id}
                    className='p-5 dark:bg-gray-800 dark:border-gray-700 hover:shadow-md transition-shadow'
                  >
                    <div className='flex items-start justify-between mb-4'>
                      <div className='flex items-center gap-3'>
                        <div className='w-12 h-12 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg flex items-center justify-center text-2xl'>
                          {typeInfo.icon}
                        </div>
                        <div>
                          <div className='flex items-center gap-2 mb-1'>
                            <h3 className='dark:text-white'>{store.name}</h3>
                            <Switch
                              checked={store.enabled}
                              disabled={isToggling}
                              onCheckedChange={() => handleToggleStore(store)}
                              onClick={e => e.stopPropagation()}
                            />
                          </div>
                          <p className='text-sm text-gray-600 dark:text-gray-400'>
                            {store.description === '--' ? '' : store.description}
                          </p>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant='ghost' size='sm' className='h-8 w-8 p-0'>
                            <Settings className='w-4 h-4' />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align='end' className='dark:bg-gray-800 dark:border-gray-700'>
                          <DropdownMenuItem onClick={() => void openEditDialog(store)} className='dark:text-gray-300'>
                            <Edit className='w-4 h-4 mr-2' />
                            {t('common.actions.edit')}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleTestConnectionWrapper(store)}
                            disabled={isTesting}
                            className='dark:text-gray-300'
                          >
                            <Play className='w-4 h-4 mr-2' />
                            {t('vector.actions.testConnection')}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteStore(store)}
                            disabled={isDeleting}
                            className='text-red-600 dark:text-red-400'
                          >
                            <Trash2 className='w-4 h-4 mr-2' />
                            {t('common.actions.delete')}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <div className='space-y-3'>
                      <div className='flex items-center gap-2'>
                        <Badge variant='outline' className='dark:border-gray-600 dark:text-gray-300'>
                          {typeInfo.label}
                        </Badge>
                        <Badge className={statusInfo.badgeClass}>{statusInfo.label}</Badge>
                      </div>

                      <div className='grid grid-cols-2 gap-4 text-sm'>
                        <div>
                          <div className='text-gray-500 dark:text-gray-400 mb-1'>
                            {t('vector.details.endpoint')}
                          </div>
                          <div className='text-gray-700 dark:text-gray-300 truncate'>{store.endpoint ?? '--'}</div>
                        </div>
                        <div>
                          <div className='text-gray-500 dark:text-gray-400 mb-1'>
                            {t('vector.details.dimension')}
                          </div>
                          <div className='text-gray-700 dark:text-gray-300'>{store.dimension ?? '--'}</div>
                        </div>
                        <div>
                          <div className='text-gray-500 dark:text-gray-400 mb-1'>
                            {t('vector.details.vectors')}
                          </div>
                          <div className='text-gray-700 dark:text-gray-300'>
                            {store.indexCount !== undefined ? formatNumber(store.indexCount) : '--'}
                          </div>
                        </div>
                        <div>
                          <div className='text-gray-500 dark:text-gray-400 mb-1'>
                            {t('vector.details.lastSync')}
                          </div>
                          <div className='text-gray-700 dark:text-gray-300'>{store.lastSync}</div>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}

          {/* List View */}
          {viewMode === 'list' && (
            <Card className='dark:bg-gray-800 dark:border-gray-700 overflow-hidden'>
              <div className='overflow-x-auto'>
                <table className='w-full table-fixed'>
                  <colgroup>
                    <col style={{ width: '28%' }} />
                    <col style={{ width: '12%' }} />
                    <col style={{ width: '14%' }} />
                    <col style={{ width: '20%' }} />
                    <col style={{ width: '8%' }} />
                    <col style={{ width: '10%' }} />
                    <col style={{ width: '8%' }} />
                  </colgroup>
                  <thead className='bg-gray-50 dark:bg-gray-900'>
                    <tr>
                      <th className='px-4 py-3 text-left text-xs text-gray-600 dark:text-gray-400'>
                        {t('vector.table.store')}
                      </th>
                      <th className='px-4 py-3 text-left text-xs text-gray-600 dark:text-gray-400'>
                        {t('common.labels.type')}
                      </th>
                      <th className='px-4 py-3 text-left text-xs text-gray-600 dark:text-gray-400'>
                        {t('vector.table.status')}
                      </th>
                      <th className='px-4 py-3 text-left text-xs text-gray-600 dark:text-gray-400'>
                        {t('vector.table.endpoint')}
                      </th>
                      <th className='px-4 py-3 text-left text-xs text-gray-600 dark:text-gray-400'>
                        {t('vector.table.dimensionShort')}
                      </th>
                      <th className='px-4 py-3 text-left text-xs text-gray-600 dark:text-gray-400'>
                        {t('vector.table.vectors')}
                      </th>
                      <th className='px-4 py-3 text-center text-xs text-gray-600 dark:text-gray-400'>
                        {t('vector.table.actions')}
                      </th>
                    </tr>
                  </thead>
                  <tbody className='divide-y divide-gray-200 dark:divide-gray-700'>
                    {vectorStores.map(store => {
                      const typeInfo = getTypeInfo(store.type);
                      const statusInfo = getStatusInfo(store.status);
                      const isToggling = togglingId === store.id;
                      const isTesting = testingConnectionId === store.id;
                      const isDeleting = deletingId === store.id;
                      return (
                        <tr key={store.id} className='hover:bg-gray-50 dark:hover:bg-gray-900/50'>
                          <td className='px-4 py-3'>
                            <div className='flex items-center gap-2 min-w-0'>
                              <div className='w-8 h-8 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg flex items-center justify-center text-lg flex-shrink-0'>
                                {typeInfo.icon}
                              </div>
                              <div className='min-w-0 flex-1'>
                                <div className='dark:text-white text-sm truncate'>{store.name}</div>
                                <div className='text-xs text-gray-500 dark:text-gray-400 truncate'>
                                  {store.description === '--' ? '' : store.description}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className='px-4 py-3 text-xs text-gray-600 dark:text-gray-400'>
                            <div className='truncate'>{typeInfo.label}</div>
                          </td>
                          <td className='px-4 py-3'>
                            <div className='flex flex-col gap-1.5'>
                              <Badge className={statusInfo.badgeClass}>{statusInfo.label}</Badge>
                              <Switch
                                checked={store.enabled}
                                disabled={isToggling}
                                onCheckedChange={() => handleToggleStore(store)}
                                onClick={e => e.stopPropagation()}
                                className='scale-75 origin-left'
                              />
                            </div>
                          </td>
                          <td className='px-4 py-3 text-xs text-gray-600 dark:text-gray-400'>
                            <div className='truncate' title={store.endpoint}>
                              {store.endpoint ?? '--'}
                            </div>
                          </td>
                          <td className='px-4 py-3 text-xs text-gray-600 dark:text-gray-400'>
                            {store.dimension ?? '--'}
                          </td>
                          <td className='px-4 py-3 text-xs text-gray-600 dark:text-gray-400'>
                            {store.indexCount !== undefined ? formatVectorCount(store.indexCount) : '--'}
                          </td>
                          <td className='px-4 py-3'>
                            <div className='flex items-center justify-center gap-1'>
                              <button
                                onClick={() => handleTestConnectionWrapper(store)}
                                disabled={isTesting}
                                className='p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors'
                                title={t('vector.actions.testConnection')}
                              >
                                <Play className='w-3.5 h-3.5 text-green-500' />
                              </button>
                              <button
                                onClick={() => void openEditDialog(store)}
                                className='p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors'
                                title={t('common.actions.edit')}
                              >
                                <Edit className='w-3.5 h-3.5 text-gray-600 dark:text-gray-400' />
                              </button>
                              <button
                                onClick={() => handleDeleteStore(store)}
                                disabled={isDeleting}
                                className='p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors'
                                title={t('common.actions.delete')}
                              >
                                <Trash2 className='w-3.5 h-3.5 text-red-500' />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          {shouldShowPagination && (
            <div className='flex items-center justify-center mt-6'>
              <XcanPagination
                pageSize={PAGINATION_CONFIG.DEFAULT_PAGE_SIZE}
                pageNo={currentPage}
                total={vectorStoresTotal}
                onChange={({ pageNo }) => {
                  setCurrentPage(pageNo);
                }}
              />
            </div>
          )}
        </>
      )}

      {/* Create Dialog */}
      <CreateVectorStoreDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        formData={formData}
        onFormDataChange={handleFormDataChange}
        onSubmit={handleCreateStoreSubmit}
        onReset={resetForm}
      />

      {/* Edit Dialog */}
      <EditVectorStoreDialog
        open={showEditDialog}
        onOpenChange={(open) => {
          setShowEditDialog(open);
          if (!open) {
                setEditingStore(null);
          }
        }}
        formData={formData}
        onFormDataChange={handleFormDataChange}
        onSubmit={handleEditStoreSubmit}
        onReset={resetForm}
      />
    </div>
  );
}
