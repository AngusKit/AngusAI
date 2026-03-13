import { MessageSquare, ExternalLink, Edit, Clock, BarChart, Settings, Layers } from 'lucide-react';
import { Card } from '@/components/ui/card.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog.tsx';
import { Skeleton } from '@/components/ui/skeleton.tsx';
import { useState } from 'react';
import { useLanguage } from '@/components/LanguageProvider.tsx';
import { toast } from 'sonner';
import { formatLastUsedDisplay } from '@/utils/FormatUtils.ts';
import { getTagColor } from '@/pages/applications/utils.ts';
import { useRecentApplications, type Application } from '../hooks/useDashboard.ts';

function ApplicationSkeleton() {
  return (
    <Card className='p-5 dark:bg-gray-800'>
      <div className='flex items-start justify-between mb-3'>
        <div className='flex items-center gap-3'>
          <Skeleton className='w-12 h-12 rounded-xl dark:bg-gray-700' />
          <Skeleton className='h-6 w-32 dark:bg-gray-700' />
        </div>
        <div className='flex gap-2'>
          <Skeleton className='w-8 h-8 rounded-lg dark:bg-gray-700' />
          <Skeleton className='w-8 h-8 rounded-lg dark:bg-gray-700' />
        </div>
      </div>

      <Skeleton className='h-4 w-full mb-2 dark:bg-gray-700' />
      <Skeleton className='h-4 w-3/4 mb-2 dark:bg-gray-700' />

      <div className='flex gap-2 mb-2'>
        <Skeleton className='h-6 w-16 rounded-md dark:bg-gray-700' />
        <Skeleton className='h-6 w-16 rounded-md dark:bg-gray-700' />
      </div>

      <Skeleton className='h-3 w-24 dark:bg-gray-700' />
    </Card>
  );
}

export function RecentApplications({ onNavigate }: { onNavigate?: (page: string) => void }) {
  const { t } = useLanguage();
  const { applications, isLoading } = useRecentApplications();
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);

  const handleCardClick = (app: Application) => {
    setSelectedApp(app);
  };

  const handleUseApp = (app: Application) => {
    toast.success(`${t('recentApps.startingApp')} ${app.name}...`);
    setSelectedApp(null);
    setTimeout(() => {
      onNavigate?.('chat');
    }, 300);
  };

  const handleShareApp = (_app: Application) => {
    toast.success(t('recentApps.shareLinkCopied'));
  };

  return (
    <div>
      <div className='flex items-center justify-between mb-4'>
        <div className='flex items-center gap-2'>
          <div className='w-2 h-6 bg-blue-500 rounded-full'></div>
          <h2 className='text-lg dark:text-white'>{t('recentApps.title')}</h2>
        </div>
        <Button variant='link' className='text-blue-500 dark:text-blue-400'>
          {t('recentApps.viewAll')} →
        </Button>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-4'>
        {isLoading ? (
          <>
            <ApplicationSkeleton />
            <ApplicationSkeleton />
            <ApplicationSkeleton />
          </>
        ) : applications.length > 0 ? (
          applications.map(app => (
            <Card key={app.id} className='p-5 hover:shadow-lg transition-all group dark:bg-gray-800'>
              <div className='flex items-start justify-between mb-3'>
                <div className='flex items-center gap-3'>
                  <div
                    className={`${app.iconBg} w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}
                  >
                    <app.icon className='w-6 h-6 text-white' />
                  </div>
                  <h3 className='dark:text-white'>{app.name}</h3>
                </div>
                <div className='flex gap-2'>
                  <Button
                    size='sm'
                    variant='outline'
                    onClick={e => {
                      e.stopPropagation();
                      handleUseApp(app);
                    }}
                    className='gap-2 h-8 opacity-0 group-hover:opacity-100 transition-opacity dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700'
                    title={t('recentApps.useNow')}
                  >
                    <MessageSquare className='w-3.5 h-3.5' />
                    {t('recentApps.enterChat')}
                  </Button>
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      handleShareApp(app);
                    }}
                    className='p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity'
                    title={t('recentApps.shareApp')}
                  >
                    <ExternalLink className='w-4 h-4 text-gray-600 dark:text-gray-300' />
                  </button>
                </div>
              </div>

              <div onClick={() => handleCardClick(app)} className='cursor-pointer'>
                <p className='text-sm text-gray-500 dark:text-gray-400 mb-2 leading-relaxed line-clamp-2'>
                  {app.description}
                </p>

                <div className='flex flex-wrap gap-2 mb-2'>
                  {app.tags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className={`text-xs px-2 py-1 rounded-md ${getTagColor(tag, tagIndex)}`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className='flex items-center justify-between text-xs text-gray-400 dark:text-gray-500'>
                  <span>{app.usage}</span>
                  <span>
                    {t('recentApps.lastAccess')}：{formatLastUsedDisplay(app.lastUsed)}
                  </span>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <Card className="col-span-full p-12 dark:bg-gray-800 dark:border-gray-700">
            <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
              <Layers className="w-12 h-12 mb-3 opacity-50" />
              <p className="text-sm font-medium mb-1">暂无最近应用</p>
              <p className="text-xs">使用应用后将显示在此处</p>
            </div>
          </Card>
        )}
      </div>

      {/* Detail Dialog */}
      <Dialog open={!!selectedApp} onOpenChange={() => setSelectedApp(null)}>
        <DialogContent className='max-w-2xl dark:bg-gray-800 dark:border-gray-700'>
          <DialogHeader>
            <div className='flex items-start gap-4 mb-4'>
              {selectedApp && (
                <>
                  <div className={`${selectedApp.iconBg} w-16 h-16 rounded-xl flex items-center justify-center`}>
                    <selectedApp.icon className='w-8 h-8 text-white' />
                  </div>
                  <div className='flex-1'>
                    <DialogTitle className='text-2xl mb-2'>{selectedApp.name}</DialogTitle>
                    <div className='flex flex-wrap gap-2'>
                      {selectedApp.tags.map((tag, index) => (
                        <span
                          key={index}
                          className={`text-xs px-2 py-1 rounded-md ${getTagColor(tag, index)}`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </DialogHeader>

          {selectedApp && (
            <div className='space-y-6'>
              <div>
                <h4 className='text-sm text-gray-500 dark:text-gray-400 mb-2'>{t('recentApps.appDescription')}</h4>
                <DialogDescription className='text-base leading-relaxed dark:text-gray-300'>
                  {selectedApp.fullDescription}
                </DialogDescription>
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <div className='flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg'>
                  <Clock className='w-5 h-5 text-blue-500' />
                  <div>
                    <div className='text-xs text-gray-500 dark:text-gray-400'>{t('recentApps.lastUsedTime')}</div>
                    <div className='text-sm dark:text-gray-200'>{formatLastUsedDisplay(selectedApp.lastUsed)}</div>
                  </div>
                </div>
                <div className='flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg'>
                  <BarChart className='w-5 h-5 text-green-500' />
                  <div>
                    <div className='text-xs text-gray-500 dark:text-gray-400'>{t('recentApps.totalCalls')}</div>
                    <div className='text-sm dark:text-gray-200'>{selectedApp.totalCalls}</div>
                  </div>
                </div>
                <div className='flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg'>
                  <Settings className='w-5 h-5 text-purple-500' />
                  <div>
                    <div className='text-xs text-gray-500 dark:text-gray-400'>{t('recentApps.avgResponseTime')}</div>
                    <div className='text-sm dark:text-gray-200'>{selectedApp.avgResponseTime}</div>
                  </div>
                </div>
                <div className='flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg'>
                  <Clock className='w-5 h-5 text-orange-500' />
                  <div>
                    <div className='text-xs text-gray-500 dark:text-gray-400'>{t('recentApps.createdAt')}</div>
                    <div className='text-sm dark:text-gray-200'>{selectedApp.createdAt}</div>
                  </div>
                </div>
              </div>

              <div className='flex gap-3 pt-4 border-t dark:border-gray-700'>
                <Button
                  className='flex-1 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700'
                  onClick={() => handleUseApp(selectedApp)}
                >
                  <MessageSquare className='w-4 h-4 mr-2' />
                  {t('recentApps.useNow')}
                </Button>
                <Button
                  variant='outline'
                  className='flex-1 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700'
                  onClick={() => handleEditApp(selectedApp)}
                >
                  <Edit className='w-4 h-4 mr-2' />
                  {t('recentApps.editApp')}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
