import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card.tsx';
import { Progress } from '@/components/ui/progress.tsx';
import { Zap, Activity, DollarSign } from 'lucide-react';
import Analytics from '@/services/Analytics.ts';
import type {
  DistributionItemVo,
  EndpointItemVo,
} from '@/services/AnalyticsTypes.ts';
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

/** 热度应用项（使用频次占比 TOP5） */
interface HotAppItem {
  rank: number;
  appName: string;
  callCount: number;
  percentage: number;
}

/** API 调用项（使用频次占比 TOP5） */
interface TopApiItem {
  rank: number;
  endpoint: string;
  method: string;
  callCount: number;
  percentage: number;
}

/** 费用成本项（费用占比 TOP5） */
interface CostModelItem {
  rank: number;
  modelName: string;
  cost: number;
  costDisplay: string;
  percentage: number;
}

export function UsageDetails() {
  const [hotApps, setHotApps] = useState<HotAppItem[]>([]);
  const [topApis, setTopApis] = useState<TopApiItem[]>([]);
  const [costModels, setCostModels] = useState<CostModelItem[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const [appRes, endpointRes, modelRes] = await Promise.all([
          Analytics.getAppDistribution({
            timeRange: TimeRangeEnum.Value7Days,
          }),
          Analytics.getTopEndpoints({
            timeRange: TimeRangeEnum.Value7Days,
            limit: 5,
            orderBy: 'calls',
          }),
          Analytics.getModelDistribution({
            timeRange: TimeRangeEnum.Value7Days,
          }),
        ]);

        const appData = (appRes as { data?: { items?: DistributionItemVo[] } })
          ?.data?.items ?? [];
        const totalAppCalls = appData.reduce((s, i) => s + (i.calls ?? 0), 0);

        const endpointData = (endpointRes as { data?: { items?: EndpointItemVo[] } })
          ?.data?.items ?? [];
        const totalApiCalls = endpointData.reduce(
          (s, i) => s + (i.calls ?? 0),
          0
        );

        const modelData = (modelRes as { data?: { items?: DistributionItemVo[] } })
          ?.data?.items ?? [];
        const totalCost = modelData.reduce((s, i) => s + (i.cost ?? 0), 0);

        setHotApps(
          appData.slice(0, 5).map((item, idx) => ({
            rank: idx + 1,
            appName: (item as DistributionItemVo & { appName?: string }).appName ?? item.modelName ?? '未知应用',
            callCount: item.calls ?? 0,
            percentage:
              totalAppCalls > 0
                ? Math.round(
                    ((item.calls ?? 0) / totalAppCalls) * 1000
                  ) / 10
                : 0,
          }))
        );

        setTopApis(
          endpointData.slice(0, 5).map((item, i) => ({
            rank: i + 1,
            endpoint: item.endpoint ?? '-',
            method: item.method ?? 'GET',
            callCount: item.calls ?? 0,
            percentage:
              totalApiCalls > 0
                ? Math.round(
                    ((item.calls ?? 0) / totalApiCalls) * 1000
                  ) / 10
                : 0,
          }))
        );

        setCostModels(
          modelData
            .slice(0, 10)
            .sort((a, b) => (b.cost ?? 0) - (a.cost ?? 0))
            .slice(0, 5)
            .map((item, i) => ({
              rank: i + 1,
              modelName: item.modelName ?? '未知模型',
              cost: item.cost ?? 0,
              costDisplay:
                item.cost != null
                  ? `¥${(item.cost / 100).toFixed(2)}`
                  : '¥0.00',
              percentage:
                totalCost > 0
                  ? Math.round(
                      ((item.cost ?? 0) / totalCost) * 1000
                    ) / 10
                  : 0,
            }))
        );
      } catch {
        setHotApps(MOCK_HOT_APPS);
        setTopApis(MOCK_TOP_APIS);
        setCostModels(MOCK_COST_MODELS);
      }
    }
    load();
  }, []);

  const hotAppsData = hotApps.length > 0 ? hotApps : MOCK_HOT_APPS;
  const topApisData = topApis.length > 0 ? topApis : MOCK_TOP_APIS;
  const costModelsData = costModels.length > 0 ? costModels : MOCK_COST_MODELS;

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
            {hotAppsData.map((item) => (
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
                  value={item.percentage}
                  className="h-2"
                  indicatorStyle={getProgressIndicatorStyle(item.percentage)}
                />
              </div>
            ))}
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
            {topApisData.map((item) => (
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
                  value={item.percentage}
                  className="h-2"
                  indicatorStyle={getProgressIndicatorStyle(item.percentage)}
                />
              </div>
            ))}
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
            {costModelsData.map((item) => (
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
                  value={item.percentage}
                  className="h-2"
                  indicatorStyle={getProgressIndicatorStyle(item.percentage)}
                />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

/** 默认模拟数据（接口失败或无数据时使用） */
const MOCK_HOT_APPS: HotAppItem[] = [
  { rank: 1, appName: '智能客服', callCount: 12580, percentage: 32 },
  { rank: 2, appName: '内容创作', callCount: 9840, percentage: 25 },
  { rank: 3, appName: '知识问答', callCount: 7560, percentage: 19 },
  { rank: 4, appName: '代码助手', callCount: 5120, percentage: 13 },
  { rank: 5, appName: '翻译助手', callCount: 3900, percentage: 11 },
];

const MOCK_TOP_APIS: TopApiItem[] = [
  {
    rank: 1,
    endpoint: '/v1/chat/completions',
    method: 'POST',
    callCount: 28500,
    percentage: 42,
  },
  {
    rank: 2,
    endpoint: '/v1/embeddings',
    method: 'POST',
    callCount: 15600,
    percentage: 23,
  },
  {
    rank: 3,
    endpoint: '/v1/completions',
    method: 'POST',
    callCount: 9800,
    percentage: 14,
  },
  {
    rank: 4,
    endpoint: '/v1/images/generations',
    method: 'POST',
    callCount: 6700,
    percentage: 10,
  },
  {
    rank: 5,
    endpoint: '/v1/moderations',
    method: 'POST',
    callCount: 5400,
    percentage: 8,
  },
];

const MOCK_COST_MODELS: CostModelItem[] = [
  {
    rank: 1,
    modelName: 'GPT-4',
    cost: 12580,
    costDisplay: '¥125.80',
    percentage: 38,
  },
  {
    rank: 2,
    modelName: 'Claude-3',
    cost: 9240,
    costDisplay: '¥92.40',
    percentage: 28,
  },
  {
    rank: 3,
    modelName: 'Llama-3-70B',
    cost: 5620,
    costDisplay: '¥56.20',
    percentage: 17,
  },
  {
    rank: 4,
    modelName: 'GPT-3.5',
    cost: 3980,
    costDisplay: '¥39.80',
    percentage: 12,
  },
  {
    rank: 5,
    modelName: 'Gemini-Pro',
    cost: 1680,
    costDisplay: '¥16.80',
    percentage: 5,
  },
];
