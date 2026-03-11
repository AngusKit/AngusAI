import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card.tsx';
import { Progress } from '@/components/ui/progress.tsx';
import { Zap, Activity, DollarSign, Inbox } from 'lucide-react';
import DashboardApi from '@/services/Dashboard.ts';
import type {
  UsageDetailsVo,
  HotAppItemVo,
  TopApiItemVo,
  CostModelItemVo,
} from '@/services/DashboardTypes.ts';
import { TimeRangeEnum } from '@/enums/enums.ts';

/** 根据占比返回进度条配色（使用 CSS 变量，确保在任何主题下生效） */
const PROGRESS_COLORS = {
  high: 'var(--color-rose-500)',
  mediumHigh: 'var(--color-amber-500)',
  medium: 'var(--color-emerald-500)',
  low: 'var(--color-blue-500)',
  lowest: 'var(--color-slate-500)',
} as const;

function getProgressIndicatorStyle(percentage: number): React.CSSProperties {
  const backgroundColor =
    percentage >= 40
      ? PROGRESS_COLORS.high
      : percentage >= 25
        ? PROGRESS_COLORS.mediumHigh
        : percentage >= 15
          ? PROGRESS_COLORS.medium
          : percentage >= 8
            ? PROGRESS_COLORS.low
            : PROGRESS_COLORS.lowest;
  return { backgroundColor };
}

export function UsageDetails() {
  const [hotApps, setHotApps] = useState<HotAppItemVo[]>([]);
  const [topApis, setTopApis] = useState<TopApiItemVo[]>([]);
  const [costModels, setCostModels] = useState<CostModelItemVo[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const res = await DashboardApi.getUsageDetails({
          timeRange: TimeRangeEnum.Value7Days,
          limit: 5,
        });
        const data = (res as { data?: UsageDetailsVo })?.data;
        setHotApps(data?.hotApps ?? []);
        setTopApis(data?.topApis ?? []);
        setCostModels(data?.costModels ?? []);
      } catch {
        setHotApps([]);
        setTopApis([]);
        setCostModels([]);
      }
    }
    load();
  }, []);

  const emptyPlaceholder = (
    <div className="py-8 flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
      <Inbox className="w-8 h-8 mb-2 opacity-60" />
      <span className="text-sm">暂无数据</span>
    </div>
  );

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-6 bg-blue-500 rounded-full" />
        <h2 className="text-lg dark:text-white">使用详情</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 热度应用 TOP5 */}
        <Card className="p-5 dark:bg-gray-800 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-lg"
              style={{
                backgroundColor: 'color-mix(in oklab, var(--color-amber-500) 15%, transparent)',
                color: 'var(--color-amber-500)',
              }}
            >
              <Zap className="h-4 w-4" strokeWidth={2} />
            </div>
            <h3 className="text-sm font-medium dark:text-white">
              热度应用（TOP5）
            </h3>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            使用频次占比最高的前 5 个应用
          </p>
          <div className="space-y-4">
            {hotApps.length > 0 ? hotApps.map((item) => (
              <div key={item.rank}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="dark:text-gray-300">
                    {item.rank}. {item.appName}
                  </span>
                  <span className="text-gray-600 dark:text-gray-400">
                    {item.percentage}%
                  </span>
                </div>
                <Progress
                  value={item.percentage ?? 0}
                  className="h-2"
                  indicatorStyle={getProgressIndicatorStyle(item.percentage ?? 0)}
                />
              </div>
            )) : emptyPlaceholder}
          </div>
        </Card>

        {/* API 调用 TOP5 */}
        <Card className="p-5 dark:bg-gray-800 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-lg"
              style={{
                backgroundColor: 'color-mix(in oklab, var(--color-emerald-500) 15%, transparent)',
                color: 'var(--color-emerald-500)',
              }}
            >
              <Activity className="h-4 w-4" strokeWidth={2} />
            </div>
            <h3 className="text-sm font-medium dark:text-white">
              API 调用（TOP5）
            </h3>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            使用频次占比最高的前 5 个接口
          </p>
          <div className="space-y-4">
            {topApis.length > 0 ? topApis.map((item) => (
              <div key={item.rank}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="dark:text-gray-300 truncate mr-2">
                    {item.rank}. [{item.method}] {item.endpoint}
                  </span>
                  <span className="text-gray-600 dark:text-gray-400 shrink-0">
                    {item.percentage}%
                  </span>
                </div>
                <Progress
                  value={item.percentage ?? 0}
                  className="h-2"
                  indicatorStyle={getProgressIndicatorStyle(item.percentage ?? 0)}
                />
              </div>
            )) : emptyPlaceholder}
          </div>
        </Card>

        {/* 费用成本 TOP5 */}
        <Card className="p-5 dark:bg-gray-800 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-lg"
              style={{
                backgroundColor: 'color-mix(in oklab, var(--color-rose-500) 15%, transparent)',
                color: 'var(--color-rose-500)',
              }}
            >
              <DollarSign className="h-4 w-4" strokeWidth={2} />
            </div>
            <h3 className="text-sm font-medium dark:text-white">
              费用成本（TOP5）
            </h3>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            费用占比最高的前 5 个模型
          </p>
          <div className="space-y-4">
            {costModels.length > 0 ? costModels.map((item) => (
              <div key={item.rank}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="dark:text-gray-300">
                    {item.rank}. {item.modelName}
                  </span>
                  <span className="text-gray-600 dark:text-gray-400">
                    {item.costDisplay} · {item.percentage}%
                  </span>
                </div>
                <Progress
                  value={item.percentage ?? 0}
                  className="h-2"
                  indicatorStyle={getProgressIndicatorStyle(item.percentage ?? 0)}
                />
              </div>
            )) : emptyPlaceholder}
          </div>
        </Card>
      </div>
    </div>
  );
}
