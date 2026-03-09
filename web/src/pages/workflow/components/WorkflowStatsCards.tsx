/**
 * 工作流统计卡片组件
 * 展示工作流总数、运行中、今日调用、成功率等数据
 */
import React from 'react';
import { Card } from '@/components/ui/card';
import { STATS_CARDS_CONFIG } from '../constants';
import type { StatsDisplay } from '../utils';

interface WorkflowStatsCardsProps {
  /** 格式化后的统计展示数据 */
  statsDisplay: StatsDisplay;
  /** 统计是否加载中 */
  statsLoading: boolean;
}

export function WorkflowStatsCards({ statsDisplay, statsLoading }: WorkflowStatsCardsProps) {
  const stats = [
    { ...STATS_CARDS_CONFIG[0], value: statsLoading ? '--' : statsDisplay.totalWorkflows },
    { ...STATS_CARDS_CONFIG[1], value: statsLoading ? '--' : statsDisplay.runningWorkflows },
    { ...STATS_CARDS_CONFIG[2], value: statsLoading ? '--' : statsDisplay.todayCalls },
    { ...STATS_CARDS_CONFIG[3], value: statsLoading ? '--' : statsDisplay.successRate },
  ];

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
      {stats.map((stat, index) => {
        const IconComponent = stat.icon!;
        return (
          <Card key={index} className='px-5 pt-5 pb-3 dark:bg-gray-800 dark:border-gray-700'>
            <div className='flex items-start justify-between mb-1.5'>
              <div className={`${stat.iconBg} w-10 h-10 rounded-lg flex items-center justify-center`}>
                {React.createElement(IconComponent, { className: 'w-5 h-5 text-white' })}
              </div>
            </div>
            <div className='text-base font-semibold text-gray-600 dark:text-gray-400 mb-0.5'>{stat.label}</div>
            <div className='text-3xl dark:text-white mb-0.5'>{stat.value}</div>
            <div className='text-xs text-gray-500 dark:text-gray-400'>{stat.subtext}</div>
          </Card>
        );
      })}
    </div>
  );
}
