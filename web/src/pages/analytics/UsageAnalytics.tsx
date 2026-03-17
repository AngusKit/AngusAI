import {
  TrendingUp,
  TrendingDown,
  Activity,
  Users,
  Zap,
  Clock,
  RefreshCw,
} from 'lucide-react';
import { useLanguage } from '@/components/LanguageProvider.tsx';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  useUsageAnalytics,
  mapApiCallsToChartData,
  mapTokenUsageToChartData,
  mapResponseTimeToChartData,
  mapTopEndpointsToList,
  mapAppDistributionToChartData,
  mapModelDistributionToChartData,
  mapErrorAnalysisToList,
} from './hooks/useUsageAnalytics';
import { TimeRangeEnum } from '@/enums/enums';
import type { MetricTrendEnum } from '@/enums/enums';

const STAT_CARD_COLORS: Record<string, string> = {
  blue: 'bg-blue-100 dark:bg-blue-900/30',
  green: 'bg-green-100 dark:bg-green-900/30',
  purple: 'bg-purple-100 dark:bg-purple-900/30',
  orange: 'bg-orange-100 dark:bg-orange-900/30',
};

const STAT_ICON_COLORS: Record<string, string> = {
  blue: 'text-blue-600 dark:text-blue-400',
  green: 'text-green-600 dark:text-green-400',
  purple: 'text-purple-600 dark:text-purple-400',
  orange: 'text-orange-600 dark:text-orange-400',
};

/** 默认占位数据：空数据或加载失败时使用 */
const DEFAULT_STATS = [
  { label: 'API总调用', value: '0', change: '-', trend: 'none' as const, icon: Activity, color: 'blue' },
  { label: '活跃用户', value: '0', change: '-', trend: 'none' as const, icon: Users, color: 'green' },
  { label: '令牌消耗', value: '0', change: '-', trend: 'none' as const, icon: Zap, color: 'purple' },
  { label: '平均响应时间', value: '-', change: '-', trend: 'none' as const, icon: Clock, color: 'orange' },
];

const DEFAULT_API_CALLS_DATA = [
  { date: '10/16', calls: 0, success: 0, failed: 0 },
  { date: '10/17', calls: 0, success: 0, failed: 0 },
  { date: '10/18', calls: 0, success: 0, failed: 0 },
  { date: '10/19', calls: 0, success: 0, failed: 0 },
  { date: '10/20', calls: 0, success: 0, failed: 0 },
  { date: '10/21', calls: 0, success: 0, failed: 0 },
  { date: '10/22', calls: 0, success: 0, failed: 0 },
];

const DEFAULT_TOKEN_USAGE_DATA = [
  { date: '10/16', input: 0, output: 0 },
  { date: '10/17', input: 0, output: 0 },
  { date: '10/18', input: 0, output: 0 },
  { date: '10/19', input: 0, output: 0 },
  { date: '10/20', input: 0, output: 0 },
  { date: '10/21', input: 0, output: 0 },
  { date: '10/22', input: 0, output: 0 },
];

const DEFAULT_RESPONSE_TIME_DATA = [
  { date: '10/16', avgTime: 0, p95: 0, p99: 0 },
  { date: '10/17', avgTime: 0, p95: 0, p99: 0 },
  { date: '10/18', avgTime: 0, p95: 0, p99: 0 },
  { date: '10/19', avgTime: 0, p95: 0, p99: 0 },
  { date: '10/20', avgTime: 0, p95: 0, p99: 0 },
  { date: '10/21', avgTime: 0, p95: 0, p99: 0 },
  { date: '10/22', avgTime: 0, p95: 0, p99: 0 },
];

const DEFAULT_TOP_ENDPOINTS = [
  { endpoint: '/v1/chat/completions', calls: 0, avgTime: '-', successRate: '-' },
  { endpoint: '/v1/embeddings', calls: 0, avgTime: '-', successRate: '-' },
  { endpoint: '/api/v1/agents/chat', calls: 0, avgTime: '-', successRate: '-' },
  { endpoint: '/api/v1/agents/stream', calls: 0, avgTime: '-', successRate: '-' },
];

const DEFAULT_APP_DISTRIBUTION = {
  items: [{ name: '暂无数据', value: 100, calls: 0, tokens: 0, color: '#6b7280' }],
  total: { apps: 0, calls: 0, tokens: 0 },
};

const DEFAULT_MODEL_DISTRIBUTION = {
  items: [{ name: '暂无数据', value: 100, calls: 0, tokens: 0, color: '#6b7280' }],
  total: { models: 0, calls: 0, tokens: 0, cost: 0, costDisplay: '$0.00' },
};

const DEFAULT_ERROR_ANALYSIS = [
  { statusCode: 0, name: '暂无错误数据', count: 0, percentage: '0%', percentageValue: 0 },
];

export function UsageAnalytics() {
  const { t } = useLanguage();
  const {
    timeRange,
    setTimeRange,
    selectedAppId,
    setSelectedAppId,
    isLoading,
    applications,
    overview,
    apiCallsTrend,
    tokenUsageTrend,
    responseTimeAnalysis,
    topEndpoints,
    appDistribution,
    modelDistribution,
    errorAnalysis,
    refresh,
  } = useUsageAnalytics();

  const apiCallsChartData = mapApiCallsToChartData(apiCallsTrend);
  const tokenUsageChartData = mapTokenUsageToChartData(tokenUsageTrend);
  const responseTimeChartData = mapResponseTimeToChartData(responseTimeAnalysis);
  const topEndpointsListData = mapTopEndpointsToList(topEndpoints);
  const appDistData = mapAppDistributionToChartData(appDistribution);
  const modelDistData = mapModelDistributionToChartData(modelDistribution);
  const errorListData = mapErrorAnalysisToList(errorAnalysis);

  const displayApiCallsData = apiCallsChartData.length > 0 ? apiCallsChartData : DEFAULT_API_CALLS_DATA;
  const displayTokenData = tokenUsageChartData.length > 0 ? tokenUsageChartData : DEFAULT_TOKEN_USAGE_DATA;
  const displayResponseTimeData = responseTimeChartData.length > 0 ? responseTimeChartData : DEFAULT_RESPONSE_TIME_DATA;
  const displayTopEndpoints = topEndpointsListData.length > 0 ? topEndpointsListData : DEFAULT_TOP_ENDPOINTS;
  const displayAppDist = appDistData.items.length > 0 ? appDistData : DEFAULT_APP_DISTRIBUTION;
  const displayModelDist = modelDistData.items.length > 0 ? modelDistData : DEFAULT_MODEL_DISTRIBUTION;
  const displayErrorList = errorListData.length > 0 ? errorListData : DEFAULT_ERROR_ANALYSIS;

  const statsFromOverview = overview?.stats
    ? [
        {
          label: 'API总调用',
          metric: overview.stats.totalApiCalls,
          icon: Activity,
          color: 'blue',
        },
        {
          label: '活跃用户',
          metric: overview.stats.activeUsers,
          icon: Users,
          color: 'green',
        },
        {
          label: '令牌消耗',
          metric: overview.stats.tokenConsumption,
          icon: Zap,
          color: 'purple',
        },
        {
          label: '平均响应时间',
          metric: overview.stats.avgResponseTime,
          icon: Clock,
          color: 'orange',
        },
      ]
    : [];

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
        <div>
          <h1 className='text-2xl dark:text-white mb-2'>{t('analytics.title')}</h1>
          <p className='text-sm text-gray-600 dark:text-gray-400'>
            {t('analytics.subtitle')}
          </p>
        </div>
        <div className='flex items-center gap-3'>
          <Select value={selectedAppId} onValueChange={setSelectedAppId}>
            <SelectTrigger className='w-[180px] dark:bg-gray-800 dark:border-gray-700'>
              <SelectValue placeholder='选择应用' />
            </SelectTrigger>
            <SelectContent className='dark:bg-gray-800 dark:border-gray-700'>
              <SelectItem value='all'>全部应用</SelectItem>
              {applications.map((app) => (
                <SelectItem key={app.id ?? ''} value={String(app.id ?? '')}>
                  {app.name ?? app.id ?? '未命名'}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={timeRange}
            onValueChange={(v) => setTimeRange(v as TimeRangeEnum)}
          >
            <SelectTrigger className='w-[140px] dark:bg-gray-800 dark:border-gray-700'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className='dark:bg-gray-800 dark:border-gray-700'>
              <SelectItem value={TimeRangeEnum.Value24Hours}>最近24小时</SelectItem>
              <SelectItem value={TimeRangeEnum.Value7Days}>最近7天</SelectItem>
              <SelectItem value={TimeRangeEnum.Value30Days}>最近30天</SelectItem>
              <SelectItem value={TimeRangeEnum.Value90Days}>最近90天</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant='outline'
            size='icon'
            onClick={refresh}
            disabled={isLoading}
            className='dark:bg-gray-800 dark:border-gray-700'
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
        {isLoading ? (
          <>
            {[1, 2, 3, 4].map((i) => (
              <Card
                key={i}
                className='p-5 dark:bg-gray-800 dark:border-gray-700'
              >
                <div className='flex items-center justify-between mb-3'>
                  <Skeleton className='w-9 h-9 rounded-lg dark:bg-gray-700' />
                  <Skeleton className='h-5 w-14 rounded dark:bg-gray-700' />
                </div>
                <Skeleton className='h-8 w-20 mb-1 dark:bg-gray-700' />
                <Skeleton className='h-4 w-32 dark:bg-gray-700' />
              </Card>
            ))}
          </>
        ) : statsFromOverview.length > 0 ? (
          statsFromOverview.map(({ label, metric, icon: Icon, color }, index) => {
            const value = metric?.valueDisplay ?? String(metric?.value ?? '0');
            const change = metric?.change ?? '-';
            const trend = (metric?.trend as MetricTrendEnum | undefined) ?? undefined;
            const isUp = trend === 'up' || (typeof change === 'string' && change.startsWith('+'));
            const isDown = trend === 'down' || (typeof change === 'string' && change.startsWith('-') && change !== '-');
            return (
              <Card
                key={index}
                className='p-5 dark:bg-gray-800 dark:border-gray-700'
              >
                <div className='flex items-center justify-between mb-3'>
                  <div className={`p-2 rounded-lg ${STAT_CARD_COLORS[color] ?? STAT_CARD_COLORS.blue}`}>
                    <Icon className={`w-5 h-5 ${STAT_ICON_COLORS[color] ?? STAT_ICON_COLORS.blue}`} />
                  </div>
                  {(isUp || isDown) && (
                    <Badge
                      className={`${
                        isUp
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                      } border-0`}
                    >
                      {isUp ? (
                        <TrendingUp className='w-3 h-3 mr-1' />
                      ) : (
                        <TrendingDown className='w-3 h-3 mr-1' />
                      )}
                      {change}
                    </Badge>
                  )}
                </div>
                <div className='text-2xl dark:text-white mb-1'>{value}</div>
                <div className='text-sm text-gray-600 dark:text-gray-400'>
                  {label}
                </div>
              </Card>
            );
          })
        ) : (
          DEFAULT_STATS.map(({ label, value, icon: Icon, color }, index) => (
            <Card key={index} className='p-5 dark:bg-gray-800 dark:border-gray-700'>
              <div className='flex items-center justify-between mb-3'>
                <div className={`p-2 rounded-lg ${STAT_CARD_COLORS[color] ?? STAT_CARD_COLORS.blue}`}>
                  <Icon className={`w-5 h-5 ${STAT_ICON_COLORS[color] ?? STAT_ICON_COLORS.blue}`} />
                </div>
              </div>
              <div className='text-2xl dark:text-white mb-1'>{value}</div>
              <div className='text-sm text-gray-600 dark:text-gray-400'>{label}</div>
            </Card>
          ))
        )}
      </div>

      {/* Charts */}
      {isLoading ? (
        <Card className='p-6 dark:bg-gray-800 dark:border-gray-700'>
          <div className='mb-6'>
            <Skeleton className='h-6 w-40 mb-2 dark:bg-gray-700' />
            <Skeleton className='h-4 w-64 dark:bg-gray-700' />
          </div>
          <Skeleton className='h-[350px] w-full rounded dark:bg-gray-700' />
        </Card>
      ) : (
        <Tabs defaultValue='api-calls' className='space-y-6'>
          <TabsList className='grid w-full grid-cols-3 h-auto p-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'>
            <TabsTrigger
              value='api-calls'
              className='data-[state=active]:bg-blue-50 dark:data-[state=active]:bg-blue-900/30'
            >
              API调用趋势
            </TabsTrigger>
            <TabsTrigger
              value='tokens'
              className='data-[state=active]:bg-blue-50 dark:data-[state=active]:bg-blue-900/30'
            >
              令牌使用
            </TabsTrigger>
            <TabsTrigger
              value='performance'
              className='data-[state=active]:bg-blue-50 dark:data-[state=active]:bg-blue-900/30'
            >
              性能分析
            </TabsTrigger>
          </TabsList>

          <TabsContent value='api-calls' className='space-y-6'>
            <Card className='p-6 dark:bg-gray-800 dark:border-gray-700'>
              <div className='mb-6'>
                <h2 className='text-lg dark:text-white mb-2'>API调用趋势</h2>
                <p className='text-sm text-gray-600 dark:text-gray-400'>
                  监控API调用量和成功率
                </p>
              </div>
              <ResponsiveContainer width='100%' height={350}>
                <AreaChart data={displayApiCallsData}>
                    <defs>
                      <linearGradient id='colorCalls' x1='0' y1='0' x2='0' y2='1'>
                        <stop offset='5%' stopColor='#3b82f6' stopOpacity={0.3} />
                        <stop offset='95%' stopColor='#3b82f6' stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray='3 3' stroke='#374151' />
                    <XAxis dataKey='date' stroke='#9ca3af' />
                    <YAxis stroke='#9ca3af' />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1f2937',
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: '#fff',
                      }}
                    />
                    <Legend />
                    <Area
                      type='monotone'
                      dataKey='calls'
                      name='总调用'
                      stroke='#3b82f6'
                      fill='url(#colorCalls)'
                      strokeWidth={2}
                    />
                    <Area
                      type='monotone'
                      dataKey='success'
                      name='成功'
                      stroke='#10b981'
                      fill='none'
                      strokeWidth={2}
                    />
                    <Area
                      type='monotone'
                      dataKey='failed'
                      name='失败'
                      stroke='#ef4444'
                      fill='none'
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
            </Card>

            <Card className='p-6 dark:bg-gray-800 dark:border-gray-700'>
              <div className='mb-6'>
                <h2 className='text-lg dark:text-white mb-2'>热门API端点</h2>
                <p className='text-sm text-gray-600 dark:text-gray-400'>
                  最常用的API接口统计
                </p>
              </div>
              <div className='space-y-4'>
                {displayTopEndpoints.map((endpoint, index) => (
                    <div
                      key={index}
                      className='flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg'
                    >
                      <div className='flex-1'>
                        <div className='flex items-center gap-3 mb-2'>
                          <code className='text-sm bg-gray-100 dark:bg-gray-900 px-2 py-1 rounded'>
                            {(endpoint as { endpoint?: string }).endpoint ??
                              (endpoint as { method?: string }).method ??
                              '-'}
                          </code>
                          <Badge className='bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-0'>
                            {((endpoint as { calls?: number }).calls ?? 0).toLocaleString()} 调用
                          </Badge>
                        </div>
                        <div className='flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400'>
                          <span>
                            平均响应:{' '}
                            {(endpoint as { avgTime?: string }).avgTime ??
                              ((endpoint as { avgTimeMs?: number }).avgTimeMs != null
                                ? `${(endpoint as { avgTimeMs?: number }).avgTimeMs}ms`
                                : '-')}
                          </span>
                          <span>成功率: {(endpoint as { successRate?: string }).successRate ?? '-'}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
            </Card>
          </TabsContent>

          <TabsContent value='tokens' className='space-y-6'>
            <Card className='p-6 dark:bg-gray-800 dark:border-gray-700'>
              <div className='mb-6'>
                <h2 className='text-lg dark:text-white mb-2'>令牌使用趋势</h2>
                <p className='text-sm text-gray-600 dark:text-gray-400'>
                  输入和输出令牌消耗统计
                </p>
              </div>
              <ResponsiveContainer width='100%' height={350}>
                <AreaChart data={displayTokenData}>
                    <CartesianGrid strokeDasharray='3 3' stroke='#374151' />
                    <XAxis dataKey='date' stroke='#9ca3af' />
                    <YAxis stroke='#9ca3af' />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1f2937',
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: '#fff',
                      }}
                    />
                    <Legend />
                    <Area
                      type='monotone'
                      dataKey='input'
                      name='输入令牌'
                      stroke='#3b82f6'
                      fill='#3b82f6'
                      fillOpacity={0.3}
                      strokeWidth={2}
                    />
                    <Area
                      type='monotone'
                      dataKey='output'
                      name='输出令牌'
                      stroke='#8b5cf6'
                      fill='#8b5cf6'
                      fillOpacity={0.3}
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
            </Card>

            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
              <Card className='p-6 dark:bg-gray-800 dark:border-gray-700'>
                <div className='mb-6'>
                  <h2 className='text-lg dark:text-white mb-2'>应用使用分布</h2>
                  <p className='text-sm text-gray-600 dark:text-gray-400 mb-4'>
                    各应用 Token 消耗占比
                  </p>
                  <div className='grid grid-cols-3 gap-3'>
                    <div className='rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 px-4 py-3'>
                      <div className='text-xs text-gray-500 dark:text-gray-400 mb-0.5'>应用数</div>
                      <div className='text-lg font-semibold text-gray-900 dark:text-white'>
                        {displayAppDist.total.apps.toLocaleString()}
                      </div>
                    </div>
                    <div className='rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 px-4 py-3'>
                      <div className='text-xs text-gray-500 dark:text-gray-400 mb-0.5'>调用</div>
                      <div className='text-lg font-semibold text-gray-900 dark:text-white'>
                        {displayAppDist.total.calls.toLocaleString()}
                      </div>
                    </div>
                    <div className='rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 px-4 py-3'>
                      <div className='text-xs text-gray-500 dark:text-gray-400 mb-0.5'>Token</div>
                      <div className='text-lg font-semibold text-gray-900 dark:text-white'>
                        {displayAppDist.total.tokens.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
                <div className='space-y-4'>
                  {displayAppDist.items.map((app, index) => (
                    <div key={index}>
                      <div className='flex items-center justify-between mb-2'>
                        <span className='text-sm dark:text-gray-300'>{app.name}</span>
                        <span className='text-sm text-gray-600 dark:text-gray-400'>
                          {app.value}% ({app.tokens.toLocaleString()} Token)
                        </span>
                      </div>
                      <div className='w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5'>
                        <div
                          className='h-2.5 rounded-full transition-all duration-300'
                          style={{
                            width: `${app.value}%`,
                            backgroundColor: app.color,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className='p-6 dark:bg-gray-800 dark:border-gray-700'>
                <div className='mb-6'>
                  <h2 className='text-lg dark:text-white mb-2'>模型使用分布</h2>
                  <p className='text-sm text-gray-600 dark:text-gray-400 mb-4'>
                    各模型 Token 消耗占比
                  </p>
                  <div className='grid grid-cols-3 gap-3'>
                    <div className='rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 px-4 py-3'>
                      <div className='text-xs text-gray-500 dark:text-gray-400 mb-0.5'>模型数</div>
                      <div className='text-lg font-semibold text-gray-900 dark:text-white'>
                        {displayModelDist.total.models.toLocaleString()}
                      </div>
                    </div>
                    <div className='rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 px-4 py-3'>
                      <div className='text-xs text-gray-500 dark:text-gray-400 mb-0.5'>调用</div>
                      <div className='text-lg font-semibold text-gray-900 dark:text-white'>
                        {displayModelDist.total.calls.toLocaleString()}
                      </div>
                    </div>
                    <div className='rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 px-4 py-3'>
                      <div className='text-xs text-gray-500 dark:text-gray-400 mb-0.5'>费用</div>
                      <div className='text-lg font-semibold text-gray-900 dark:text-white'>
                        {displayModelDist.total.costDisplay ?? '$0.00'}
                      </div>
                    </div>
                  </div>
                </div>
                <ResponsiveContainer width='100%' height={240}>
                  <PieChart margin={{ right: 120 }}>
                    <Pie
                      data={displayModelDist.items}
                      cx='40%'
                      cy='50%'
                      innerRadius={55}
                      outerRadius={90}
                      paddingAngle={2}
                      cornerRadius={8}
                      dataKey='value'
                      nameKey='name'
                      stroke='#1f2937'
                      strokeWidth={2}
                    >
                      {displayModelDist.items.map((entry, idx) => (
                        <Cell key={`cell-${idx}`} fill={entry.color} strokeOpacity={1} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1f2937',
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: '#fff',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                      }}
                      formatter={(value: number, name: string, props: { payload?: { tokens?: number; calls?: number } }) => [
                        `${value}% (${(props.payload?.tokens ?? 0).toLocaleString()} Token)`,
                        name,
                      ]}
                    />
                    <Legend
                      layout='vertical'
                      align='right'
                      verticalAlign='middle'
                      wrapperStyle={{ paddingLeft: '16px' }}
                      formatter={(value, entry) => (
                        <span className='text-sm dark:text-gray-300'>
                          {value} ({(entry.payload as { value?: number })?.value ?? 0}%)
                        </span>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value='performance' className='space-y-6'>
            <Card className='p-6 dark:bg-gray-800 dark:border-gray-700'>
              <div className='mb-6'>
                <h2 className='text-lg dark:text-white mb-2'>响应时间分析</h2>
                <p className='text-sm text-gray-600 dark:text-gray-400'>
                  API响应时间统计（秒）
                </p>
              </div>
              <ResponsiveContainer width='100%' height={350}>
                <LineChart data={displayResponseTimeData}>
                    <CartesianGrid strokeDasharray='3 3' stroke='#374151' />
                    <XAxis dataKey='date' stroke='#9ca3af' />
                    <YAxis stroke='#9ca3af' />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1f2937',
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: '#fff',
                      }}
                    />
                    <Legend />
                    <Line
                      type='monotone'
                      dataKey='avgTime'
                      name='平均响应时间'
                      stroke='#3b82f6'
                      strokeWidth={2}
                      dot={{ r: 4 }}
                    />
                    <Line
                      type='monotone'
                      dataKey='p95'
                      name='P95'
                      stroke='#8b5cf6'
                      strokeWidth={2}
                      dot={{ r: 4 }}
                    />
                    <Line
                      type='monotone'
                      dataKey='p99'
                      name='P99'
                      stroke='#f59e0b'
                      strokeWidth={2}
                      dot={{ r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
            </Card>

            <Card className='p-6 dark:bg-gray-800 dark:border-gray-700'>
              <div className='mb-6'>
                <h2 className='text-lg dark:text-white mb-2'>错误分析</h2>
                <p className='text-sm text-gray-600 dark:text-gray-400'>
                  错误类型和频率统计
                </p>
              </div>
              <div className='space-y-4'>
                {displayErrorList.map((error, index) => (
                    <div
                      key={index}
                      className='flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg'
                    >
                      <div className='flex items-center gap-4'>
                        <Badge className='bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-0'>
                          {(error as { statusCode?: number }).statusCode ??
                            (error as { code?: string }).code ??
                            '-'}
                        </Badge>
                        <div>
                          <div className='dark:text-white'>
                            {(error as { name?: string }).name ?? '-'}
                          </div>
                          <div className='text-sm text-gray-600 dark:text-gray-400'>
                            {((error as { count?: number }).count ?? 0).toLocaleString()} 次错误
                          </div>
                        </div>
                      </div>
                      <div className='flex items-center gap-4'>
                        <div className='w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2'>
                          <div
                            className='bg-red-500 h-2 rounded-full'
                            style={{
                              width:
                                (error as { percentage?: string }).percentage ??
                                `${(error as { percentageValue?: number }).percentageValue ?? 0}%`,
                            }}
                          />
                        </div>
                        <span className='text-sm text-gray-600 dark:text-gray-400 w-12 text-right'>
                          {(error as { percentage?: string }).percentage ?? '-'}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
              <div className='mt-8 pt-6 border-t border-gray-200 dark:border-gray-700'>
                <h3 className='text-base dark:text-white mb-3'>近10次接口错误</h3>
                <p className='text-sm text-gray-600 dark:text-gray-400 mb-4'>
                  按时间倒序展示最近的接口错误记录
                </p>
                <div className='space-y-3'>
                  {(errorAnalysis?.recentErrors ?? []).length === 0 ? (
                    <div className='py-8 text-center text-gray-500 dark:text-gray-400 text-sm'>
                      无错误记录
                    </div>
                  ) : (
                    (errorAnalysis?.recentErrors ?? []).map((err, index) => (
                      <div
                        key={index}
                        className='flex flex-col gap-2 p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50/50 dark:bg-gray-700/30'
                      >
                        <div className='flex items-center justify-between flex-wrap gap-2'>
                          <code className='text-sm bg-gray-200 dark:bg-gray-600 px-2 py-0.5 rounded'>
                            {(err as { method?: string }).method ?? 'POST'} {(err as { endpoint?: string }).endpoint ?? '-'}
                          </code>
                          <Badge variant='destructive' className='text-xs'>
                            {(err as { statusCode?: number }).statusCode ?? '-'}
                          </Badge>
                        </div>
                        {(err as { errorMessage?: string }).errorMessage && (
                          <div className='text-sm text-gray-600 dark:text-gray-400 line-clamp-2'>
                            {(err as { errorMessage?: string }).errorMessage}
                          </div>
                        )}
                        <div className='flex items-center gap-4 text-xs text-gray-500 dark:text-gray-500'>
                          <span>
                            请求时间: {(err as { requestTime?: string }).requestTime ?? '-'}
                          </span>
                          {(err as { responseTimeMs?: number }).responseTimeMs != null && (
                            <span>响应: {(err as { responseTimeMs?: number }).responseTimeMs}ms</span>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
