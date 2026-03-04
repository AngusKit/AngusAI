import { useState } from 'react';
import { BarChart3, TrendingUp, TrendingDown, Activity, Users, MessageSquare, Zap, Clock, Calendar, Filter, ChevronDown, } from 'lucide-react';
import { useLanguage } from '@/components/LanguageProvider.tsx';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, } from 'recharts';

export function UsageAnalytics() {
  const { t } = useLanguage();
  const [timeRange, setTimeRange] = useState('7days');
  const [selectedApp, setSelectedApp] = useState('all');

  // API调用趋势数据
  const apiCallsData = [
    { date: '10/16', calls: 1240, success: 1180, failed: 60 },
    { date: '10/17', calls: 1580, success: 1520, failed: 60 },
    { date: '10/18', calls: 1820, success: 1760, failed: 60 },
    { date: '10/19', calls: 1650, success: 1590, failed: 60 },
    { date: '10/20', calls: 2100, success: 2030, failed: 70 },
    { date: '10/21', calls: 2340, success: 2260, failed: 80 },
    { date: '10/22', calls: 2580, success: 2490, failed: 90 },
  ];

  // 令牌使用数据
  const tokenUsageData = [
    { date: '10/16', input: 45000, output: 32000 },
    { date: '10/17', input: 58000, output: 41000 },
    { date: '10/18', input: 62000, output: 44000 },
    { date: '10/19', input: 55000, output: 39000 },
    { date: '10/20', input: 72000, output: 51000 },
    { date: '10/21', input: 78000, output: 55000 },
    { date: '10/22', input: 85000, output: 60000 },
  ];

  // 响应时间数据
  const responseTimeData = [
    { date: '10/16', avgTime: 1.2, p95: 2.8, p99: 4.5 },
    { date: '10/17', avgTime: 1.3, p95: 2.9, p99: 4.6 },
    { date: '10/18', avgTime: 1.1, p95: 2.6, p99: 4.2 },
    { date: '10/19', avgTime: 1.4, p95: 3.1, p99: 4.8 },
    { date: '10/20', avgTime: 1.2, p95: 2.7, p99: 4.4 },
    { date: '10/21', avgTime: 1.3, p95: 2.8, p99: 4.5 },
    { date: '10/22', avgTime: 1.1, p95: 2.5, p99: 4.1 },
  ];

  // 应用使用分布
  const appDistributionData = [
    { name: '智能客服助手', value: 35, calls: 8950 },
    { name: '内容创作工具', value: 28, calls: 7168 },
    { name: '数据分析助手', value: 18, calls: 4608 },
    { name: '文档问答系统', value: 12, calls: 3072 },
    { name: '其他', value: 7, calls: 1792 },
  ];

  // 模型使用分布
  const modelDistributionData = [
    { name: 'GPT-4', value: 42, color: '#3b82f6' },
    { name: 'GPT-4 Turbo', value: 31, color: '#8b5cf6' },
    { name: 'GPT-3.5 Turbo', value: 20, color: '#10b981' },
    { name: 'Claude 3', value: 7, color: '#f59e0b' },
  ];

  const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#6b7280'];

  const stats = [
    {
      label: 'API总调用',
      value: '25,590',
      change: '+12.5%',
      trend: 'up',
      icon: Activity,
      color: 'blue',
    },
    {
      label: '活跃用户',
      value: '1,284',
      change: '+8.2%',
      trend: 'up',
      icon: Users,
      color: 'green',
    },
    {
      label: '令牌消耗',
      value: '1.2M',
      change: '+15.3%',
      trend: 'up',
      icon: Zap,
      color: 'purple',
    },
    {
      label: '平均响应时间',
      value: '1.2s',
      change: '-5.8%',
      trend: 'down',
      icon: Clock,
      color: 'orange',
    },
  ];

  const topEndpoints = [
    {
      endpoint: '/v1/chat/completions',
      calls: 12453,
      avgTime: '1.2s',
      successRate: '98.5%',
    },
    {
      endpoint: '/v1/embeddings',
      calls: 8921,
      avgTime: '0.8s',
      successRate: '99.2%',
    },
    {
      endpoint: '/v1/images/generations',
      calls: 3456,
      avgTime: '3.5s',
      successRate: '97.8%',
    },
    {
      endpoint: '/v1/audio/transcriptions',
      calls: 760,
      avgTime: '2.1s',
      successRate: '98.9%',
    },
  ];

  const errorAnalysis = [
    { code: '429', name: 'Rate Limit', count: 245, percentage: '45%' },
    { code: '500', name: 'Internal Error', count: 156, percentage: '29%' },
    { code: '401', name: 'Unauthorized', count: 89, percentage: '16%' },
    { code: '400', name: 'Bad Request', count: 54, percentage: '10%' },
  ];

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
        <div>
          <h1 className='text-2xl dark:text-white mb-2'>{t('analytics.title')}</h1>
          <p className='text-sm text-gray-600 dark:text-gray-400'>{t('analytics.subtitle')}</p>
        </div>
        <div className='flex items-center gap-3'>
          <Select value={selectedApp} onValueChange={setSelectedApp}>
            <SelectTrigger className='w-[180px] dark:bg-gray-800 dark:border-gray-700'>
              <SelectValue placeholder='选择应用' />
            </SelectTrigger>
            <SelectContent className='dark:bg-gray-800 dark:border-gray-700'>
              <SelectItem value='all'>全部应用</SelectItem>
              <SelectItem value='app1'>智能客服助手</SelectItem>
              <SelectItem value='app2'>内容创作工具</SelectItem>
              <SelectItem value='app3'>数据分析助手</SelectItem>
            </SelectContent>
          </Select>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className='w-[140px] dark:bg-gray-800 dark:border-gray-700'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className='dark:bg-gray-800 dark:border-gray-700'>
              <SelectItem value='24hours'>最近24小时</SelectItem>
              <SelectItem value='7days'>最近7天</SelectItem>
              <SelectItem value='30days'>最近30天</SelectItem>
              <SelectItem value='90days'>最近90天</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
        {stats.map((stat, index) => (
          <Card key={index} className='p-5 dark:bg-gray-800 dark:border-gray-700'>
            <div className='flex items-center justify-between mb-3'>
              <div className={`p-2 rounded-lg bg-${stat.color}-100 dark:bg-${stat.color}-900/30`}>
                <stat.icon className={`w-5 h-5 text-${stat.color}-600 dark:text-${stat.color}-400`} />
              </div>
              <Badge
                className={`${
                  stat.trend === 'up'
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                } border-0`}
              >
                {stat.trend === 'up' ? (
                  <TrendingUp className='w-3 h-3 mr-1' />
                ) : (
                  <TrendingDown className='w-3 h-3 mr-1' />
                )}
                {stat.change}
              </Badge>
            </div>
            <div className='text-2xl dark:text-white mb-1'>{stat.value}</div>
            <div className='text-sm text-gray-600 dark:text-gray-400'>{stat.label}</div>
          </Card>
        ))}
      </div>

      {/* Charts */}
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
              <p className='text-sm text-gray-600 dark:text-gray-400'>监控API调用量和成功率</p>
            </div>
            <ResponsiveContainer width='100%' height={350}>
              <AreaChart data={apiCallsData}>
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
                <Area type='monotone' dataKey='success' name='成功' stroke='#10b981' fill='none' strokeWidth={2} />
                <Area type='monotone' dataKey='failed' name='失败' stroke='#ef4444' fill='none' strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </Card>

          {/* Top Endpoints */}
          <Card className='p-6 dark:bg-gray-800 dark:border-gray-700'>
            <div className='mb-6'>
              <h2 className='text-lg dark:text-white mb-2'>热门API端点</h2>
              <p className='text-sm text-gray-600 dark:text-gray-400'>最常用的API接口统计</p>
            </div>
            <div className='space-y-4'>
              {topEndpoints.map((endpoint, index) => (
                <div
                  key={index}
                  className='flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg'
                >
                  <div className='flex-1'>
                    <div className='flex items-center gap-3 mb-2'>
                      <code className='text-sm bg-gray-100 dark:bg-gray-900 px-2 py-1 rounded'>
                        {endpoint.endpoint}
                      </code>
                      <Badge className='bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-0'>
                        {endpoint.calls.toLocaleString()} 调用
                      </Badge>
                    </div>
                    <div className='flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400'>
                      <span>平均响应: {endpoint.avgTime}</span>
                      <span>成功率: {endpoint.successRate}</span>
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
              <p className='text-sm text-gray-600 dark:text-gray-400'>输入和输出令牌消耗统计</p>
            </div>
            <ResponsiveContainer width='100%' height={350}>
              <BarChart data={tokenUsageData}>
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
                <Bar dataKey='input' name='输入令牌' fill='#3b82f6' radius={[8, 8, 0, 0]} />
                <Bar dataKey='output' name='输出令牌' fill='#8b5cf6' radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
            {/* 应用分布 */}
            <Card className='p-6 dark:bg-gray-800 dark:border-gray-700'>
              <div className='mb-6'>
                <h2 className='text-lg dark:text-white mb-2'>应用使用分布</h2>
                <p className='text-sm text-gray-600 dark:text-gray-400'>各应用调用占比</p>
              </div>
              <div className='space-y-4'>
                {appDistributionData.map((app, index) => (
                  <div key={index}>
                    <div className='flex items-center justify-between mb-2'>
                      <span className='text-sm dark:text-gray-300'>{app.name}</span>
                      <span className='text-sm text-gray-600 dark:text-gray-400'>
                        {app.value}% ({app.calls.toLocaleString()})
                      </span>
                    </div>
                    <div className='w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2'>
                      <div
                        className='h-2 rounded-full'
                        style={{
                          width: `${app.value}%`,
                          backgroundColor: COLORS[index % COLORS.length],
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* 模型分布 */}
            <Card className='p-6 dark:bg-gray-800 dark:border-gray-700'>
              <div className='mb-6'>
                <h2 className='text-lg dark:text-white mb-2'>模型使用分布</h2>
                <p className='text-sm text-gray-600 dark:text-gray-400'>各模型调用占比</p>
              </div>
              <ResponsiveContainer width='100%' height={200}>
                <PieChart>
                  <Pie
                    data={modelDistributionData}
                    cx='50%'
                    cy='50%'
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey='value'
                  >
                    {modelDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#fff',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className='grid grid-cols-2 gap-3 mt-4'>
                {modelDistributionData.map((model, index) => (
                  <div key={index} className='flex items-center gap-2'>
                    <div className='w-3 h-3 rounded-full' style={{ backgroundColor: model.color }} />
                    <span className='text-sm dark:text-gray-300'>
                      {model.name} ({model.value}%)
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value='performance' className='space-y-6'>
          <Card className='p-6 dark:bg-gray-800 dark:border-gray-700'>
            <div className='mb-6'>
              <h2 className='text-lg dark:text-white mb-2'>响应时间分析</h2>
              <p className='text-sm text-gray-600 dark:text-gray-400'>API响应时间统计（秒）</p>
            </div>
            <ResponsiveContainer width='100%' height={350}>
              <LineChart data={responseTimeData}>
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
                <Line type='monotone' dataKey='p95' name='P95' stroke='#8b5cf6' strokeWidth={2} dot={{ r: 4 }} />
                <Line type='monotone' dataKey='p99' name='P99' stroke='#f59e0b' strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Error Analysis */}
          <Card className='p-6 dark:bg-gray-800 dark:border-gray-700'>
            <div className='mb-6'>
              <h2 className='text-lg dark:text-white mb-2'>错误分析</h2>
              <p className='text-sm text-gray-600 dark:text-gray-400'>错误类型和频率统计</p>
            </div>
            <div className='space-y-4'>
              {errorAnalysis.map((error, index) => (
                <div
                  key={index}
                  className='flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg'
                >
                  <div className='flex items-center gap-4'>
                    <Badge className='bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-0'>
                      {error.code}
                    </Badge>
                    <div>
                      <div className='dark:text-white'>{error.name}</div>
                      <div className='text-sm text-gray-600 dark:text-gray-400'>
                        {error.count.toLocaleString()} 次错误
                      </div>
                    </div>
                  </div>
                  <div className='flex items-center gap-4'>
                    <div className='w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2'>
                      <div className='bg-red-500 h-2 rounded-full' style={{ width: error.percentage }} />
                    </div>
                    <span className='text-sm text-gray-600 dark:text-gray-400 w-12 text-right'>{error.percentage}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
