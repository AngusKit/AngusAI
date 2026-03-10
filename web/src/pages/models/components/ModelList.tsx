import { useLanguage } from '@/components/LanguageProvider.tsx';
import { Database, Eye, Edit, Trash2, MoreHorizontal, Play, Pause } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { XcanPagination } from '@/components/ui/pagination';
import { ModelStatusEnum } from '@/enums/enums';
import type { ModelListItem } from '../types';

export interface ModelListProps {
  models: ModelListItem[];
  modelsLoading: boolean;
  modelsTotal: number;
  currentPage: number;
  viewMode: 'grid' | 'list';
  itemsPerPage: number;
  shouldShowPagination: boolean;
  onPageChange: (pageNo: number) => void;
  onToggleStatus: (model: ModelListItem) => void;
  onViewDetails: (model: ModelListItem) => void;
  onOpenEdit: (model: ModelListItem) => void;
  onDelete: (model: ModelListItem) => void;
}

export function ModelList({
  models,
  modelsLoading,
  modelsTotal,
  currentPage,
  viewMode,
  itemsPerPage,
  shouldShowPagination,
  onPageChange,
  onToggleStatus,
  onViewDetails,
  onOpenEdit,
  onDelete,
}: ModelListProps) {
  const { t } = useLanguage();

  return (
    <>
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
              <h3 className='text-lg mb-2 dark:text-white'>{t('models.empty.noModelsFound')}</h3>
              <p className='text-sm text-gray-600 dark:text-gray-400'>{t('models.empty.tryAdjustingSearch')}</p>
            </Card>
          ) : (
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
                        onClick={() => onToggleStatus(model)}
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
                          <DropdownMenuItem onClick={() => onViewDetails(model)} className='dark:text-gray-300'>
                            <Eye className='w-4 h-4 mr-2' />
                            {t('models.actions.viewDetails')}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onOpenEdit(model)} className='dark:text-gray-300'>
                            <Edit className='w-4 h-4 mr-2' />
                            {t('models.actions.editConfig')}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onDelete(model)} className='text-red-600 dark:text-red-400'>
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

                    <p className='text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2'>{model.description}</p>

                    <div className='space-y-2 mb-4 text-xs'>
                      <div className='flex items-center justify-between'>
                        <span className='text-gray-500 dark:text-gray-400'>{t('models.table.provider')}</span>
                        <span className='dark:text-white'>{model.provider}</span>
                      </div>
                      <div className='flex items-center justify-between'>
                        <span className='text-gray-500 dark:text-gray-400'>{t('models.table.type')}</span>
                        <span className='dark:text-white'>{model.type}</span>
                      </div>
                      {model.maxTokens != null && (
                        <div className='flex items-center justify-between'>
                          <span className='text-gray-500 dark:text-gray-400'>{t('models.table.maxTokens')}</span>
                          <span className='dark:text-white'>{model.maxTokens}</span>
                        </div>
                      )}
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
                    <th className='px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400 w-[120px]' />
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
                        <Skeleton className='h-4 w-14 dark:bg-gray-700' />
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
                      <td className='px-6 py-4 w-[120px]'>
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
              <h3 className='text-lg mb-2 dark:text-white'>{t('models.empty.noModelsFound')}</h3>
              <p className='text-sm text-gray-600 dark:text-gray-400'>{t('models.empty.tryAdjustingSearch')}</p>
            </div>
          ) : (
            <div className='overflow-x-auto'>
              <table className='w-full'>
                <thead className='bg-gray-50 dark:bg-gray-900'>
                  <tr>
                    <th className='px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400'>{t('models.table.model')}</th>
                    <th className='px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400'>{t('models.table.status')}</th>
                    <th className='px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400'>{t('models.table.type')}</th>
                    <th className='px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400'>{t('models.table.maxTokens')}</th>
                    <th className='px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400'>{t('models.table.performance')}</th>
                    <th className='px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400'>{t('models.table.callsCost')}</th>
                    <th className='px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400 w-[120px]'>{t('models.table.actions')}</th>
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
                              <div className='text-xs text-gray-500 dark:text-gray-400'>{model.provider}</div>
                            </div>
                          </div>
                        </td>
                        <td className='px-6 py-4'>
                          <Badge className={`text-xs ${model.statusColor} border-0`}>{model.status}</Badge>
                        </td>
                        <td className='px-6 py-4 text-sm text-gray-600 dark:text-gray-400'>{model.type}</td>
                        <td className='px-6 py-4 text-sm text-gray-600 dark:text-gray-400'>{model.maxTokens ?? '--'}</td>
                        <td className='px-6 py-4 text-sm text-gray-600 dark:text-gray-400'>
                          <div>{model.performance.latency}</div>
                          <div className='text-xs'>{model.performance.accuracy}</div>
                        </td>
                        <td className='px-6 py-4 text-sm text-gray-600 dark:text-gray-400'>
                          <div>{model.calls}</div>
                          <div className='text-xs dark:text-white'>{model.cost}</div>
                        </td>
                        <td className='px-6 py-4 w-[120px]'>
                          <div className='flex items-center gap-2'>
                            <button
                              onClick={() => onToggleStatus(model)}
                              className='p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded'
                              disabled={!model.statusEnum || modelsLoading}
                            >
                              {model.statusEnum === ModelStatusEnum.ACTIVE ? (
                                <Pause className='w-4 h-4 text-orange-500' />
                              ) : (
                                <Play className='w-4 h-4 text-green-500' />
                              )}
                            </button>
                            <button
                              onClick={() => onViewDetails(model)}
                              className='p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded'
                            >
                              <Eye className='w-4 h-4 text-blue-500' />
                            </button>
                            <button
                              onClick={() => onOpenEdit(model)}
                              className='p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded'
                            >
                              <Edit className='w-4 h-4 text-gray-600 dark:text-gray-400' />
                            </button>
                            <button
                              onClick={() => onDelete(model)}
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

      {shouldShowPagination && (
        <XcanPagination
          pageSize={itemsPerPage}
          pageNo={currentPage}
          total={modelsTotal}
          onChange={({ pageNo }) => onPageChange(pageNo)}
        />
      )}
    </>
  );
}
