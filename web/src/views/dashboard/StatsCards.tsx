import { FileText, Zap, Coins, Users, TrendingUp, TrendingDown } from 'lucide-react';
import { Card } from '@/ui/card';
import { Skeleton } from '@/ui/skeleton';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/ui/dialog';
import { useState } from 'react';
import { useLanguage } from '@/ui/LanguageProvider';

interface StatData {
  icon: any;
  label: string;
  value: string;
  subtitle: string;
  trend: string;
  trendUp: boolean;
  iconBg: string;
  details: {
    thisWeek: string;
    lastWeek: string;
    thisMonth: string;
    lastMonth: string;
  };
}

function StatCardSkeleton() {
  return (
    <Card className='p-5 dark:bg-gray-800'>
      <div className='flex items-start justify-between'>
        <div className='flex items-start gap-4'>
          <Skeleton className='w-12 h-12 rounded-xl dark:bg-gray-700 flex-shrink-0' />
          <div>
            <Skeleton className='h-4 w-20 mb-1 dark:bg-gray-700' />
            <Skeleton className='h-8 w-16 mb-1 dark:bg-gray-700' />
            <Skeleton className='h-3 w-32 dark:bg-gray-700' />
          </div>
        </div>
        <Skeleton className='w-16 h-6 rounded dark:bg-gray-700 flex-shrink-0' />
      </div>
    </Card>
  );
}

export function StatsCards() {
  const { t } = useLanguage();
  const [selectedStat, setSelectedStat] = useState<StatData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const stats: StatData[] = [
    {
      icon: FileText,
      label: t('stats.totalApps'),
      value: '24',
      subtitle: '较上周增加 3 个',
      trend: '+12%',
      trendUp: true,
      iconBg: 'bg-blue-500',
      details: {
        thisWeek: '24',
        lastWeek: '21',
        thisMonth: '72',
        lastMonth: '64',
      },
    },
    {
      icon: Zap,
      label: t('stats.apiCalls'),
      value: '156.8K',
      subtitle: '本月累积调用 7.6M',
      trend: '+28%',
      trendUp: true,
      iconBg: 'bg-emerald-500',
      details: {
        thisWeek: '156.8K',
        lastWeek: '122.5K',
        thisMonth: '7.6M',
        lastMonth: '5.9M',
      },
    },
    {
      icon: Coins,
      label: t('stats.tokenUsage'),
      value: '2.4M',
      subtitle: '较上周减少 7.6M',
      trend: '-5%',
      trendUp: false,
      iconBg: 'bg-orange-500',
      details: {
        thisWeek: '2.4M',
        lastWeek: '2.5M',
        thisMonth: '9.8M',
        lastMonth: '10.3M',
      },
    },
    {
      icon: Users,
      label: t('stats.activeUsers'),
      value: '1,248',
      subtitle: '日均活跃 342 人',
      trend: '+18%',
      trendUp: true,
      iconBg: 'bg-purple-500',
      details: {
        thisWeek: '1,248',
        lastWeek: '1,058',
        thisMonth: '4,892',
        lastMonth: '4,145',
      },
    },
  ];

  return (
    <>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
        {isLoading ? (
          <>
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </>
        ) : (
          stats.map((stat, index) => (
            <Card
              key={index}
              className='p-5 hover:shadow-lg transition-all cursor-pointer dark:bg-gray-800 dark:hover:bg-gray-750'
              onClick={() => setSelectedStat(stat)}
            >
              <div className='flex items-start justify-between'>
                <div className='flex items-start gap-4'>
                  <div className={`${stat.iconBg} w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0`}>
                    <stat.icon className='w-6 h-6 text-white' />
                  </div>
                  <div>
                    <div className='text-gray-500 dark:text-gray-400 text-sm mb-0.5'>{stat.label}</div>
                    <div className='text-3xl mb-0.5 dark:text-white'>{stat.value}</div>
                    <div className='text-gray-400 dark:text-gray-500 text-xs'>{stat.subtitle}</div>
                  </div>
                </div>
                <div
                  className={`flex items-center gap-1 text-sm flex-shrink-0 ${stat.trendUp ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}
                >
                  {stat.trendUp ? <TrendingUp className='w-4 h-4' /> : <TrendingDown className='w-4 h-4' />}
                  <span>{stat.trend}</span>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Detail Dialog */}
      <Dialog open={!!selectedStat} onOpenChange={() => setSelectedStat(null)}>
        <DialogContent className='max-w-lg'>
          <DialogHeader>
            {selectedStat && (
              <div className='flex items-center gap-4 mb-4'>
                <div className={`${selectedStat.iconBg} w-14 h-14 rounded-xl flex items-center justify-center`}>
                  <selectedStat.icon className='w-7 h-7 text-white' />
                </div>
                <div>
                  <DialogTitle className='text-xl dark:text-white'>{selectedStat.label}</DialogTitle>
                  <div
                    className={`flex items-center gap-1 text-sm mt-1 ${selectedStat.trendUp ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}
                  >
                    {selectedStat.trendUp ? <TrendingUp className='w-4 h-4' /> : <TrendingDown className='w-4 h-4' />}
                    <span>{selectedStat.trend}</span>
                    <span className='text-gray-500 dark:text-gray-400 ml-1'>{selectedStat.subtitle}</span>
                  </div>
                </div>
              </div>
            )}
          </DialogHeader>

          {selectedStat && (
            <div className='space-y-4'>
              <div className='grid grid-cols-2 gap-4'>
                <div className='p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg'>
                  <div className='text-xs text-gray-500 dark:text-gray-400 mb-1'>本周数据</div>
                  <div className='text-2xl dark:text-white'>{selectedStat.details.thisWeek}</div>
                </div>
                <div className='p-4 bg-gray-50 dark:bg-gray-700 rounded-lg'>
                  <div className='text-xs text-gray-500 dark:text-gray-400 mb-1'>上周数据</div>
                  <div className='text-2xl text-gray-600 dark:text-gray-300'>{selectedStat.details.lastWeek}</div>
                </div>
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <div className='p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg'>
                  <div className='text-xs text-gray-500 dark:text-gray-400 mb-1'>本月数据</div>
                  <div className='text-2xl dark:text-white'>{selectedStat.details.thisMonth}</div>
                </div>
                <div className='p-4 bg-gray-50 dark:bg-gray-700 rounded-lg'>
                  <div className='text-xs text-gray-500 dark:text-gray-400 mb-1'>上月数据</div>
                  <div className='text-2xl text-gray-600 dark:text-gray-300'>{selectedStat.details.lastMonth}</div>
                </div>
              </div>

              <div className='pt-4 border-t dark:border-gray-700'>
                <DialogDescription className='text-sm dark:text-gray-300'>
                  点击卡片可查看详细的统计数据和趋势分析。数据每小时更新一次。
                </DialogDescription>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
