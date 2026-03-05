import { Card } from '@/components/ui/card';

interface StatsCard {
  key: string;
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  iconBg: string;
}

interface ActivityStatsCardsProps {
  /** 统计卡片配置列表 */
  cards: StatsCard[];
}

/** 活动统计卡片区域：今日活动、活跃用户、成功率、总活动数 */
export function ActivityStatsCards({ cards }: ActivityStatsCardsProps) {
  return (
    <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
      {cards.map(card => {
        const Icon = card.icon;
        return (
          <Card key={card.key} className='p-6 dark:bg-gray-900 dark:border-gray-800'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-gray-600 dark:text-gray-400 mb-1'>{card.label}</p>
                <p className='text-2xl dark:text-white'>{card.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${card.iconBg}`}>
                <Icon className='w-6 h-6 text-white' />
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
