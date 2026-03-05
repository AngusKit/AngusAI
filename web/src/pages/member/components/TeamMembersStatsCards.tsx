import { Card } from '@/components/ui/card';
import type { LucideIcon } from 'lucide-react';

interface StatsCardItem {
  label: string;
  value: string | number;
  subtext: string;
  icon: LucideIcon;
  color: string;
}

interface TeamMembersStatsCardsProps {
  /** 统计卡片配置 */
  cards: StatsCardItem[];
}

/** 统计卡片区域：团队成员数、待处理邀请、禁用数、活跃率 */
export function TeamMembersStatsCards({ cards }: TeamMembersStatsCardsProps) {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
      {cards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className='p-5 dark:bg-gray-800 dark:border-gray-700'>
            <div className='flex items-start justify-between'>
              <div className={`p-2 rounded-lg bg-gray-100 dark:bg-gray-700 ${stat.color}`}>
                <Icon className='w-5 h-5' />
              </div>
            </div>
            <div className='text-base text-gray-600 dark:text-gray-400'>{stat.label}</div>
            <div className='text-3xl dark:text-white'>{stat.value}</div>
            <div className='text-xs text-gray-500 dark:text-gray-400'>{stat.subtext}</div>
          </Card>
        );
      })}
    </div>
  );
}
