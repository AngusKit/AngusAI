import { Activity, Users, Zap, Clock } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export const STAT_CARD_COLORS: Record<string, string> = {
  blue: 'bg-blue-100 dark:bg-blue-900/30',
  green: 'bg-green-100 dark:bg-green-900/30',
  purple: 'bg-purple-100 dark:bg-purple-900/30',
  orange: 'bg-orange-100 dark:bg-orange-900/30',
};

export const STAT_ICON_COLORS: Record<string, string> = {
  blue: 'text-blue-600 dark:text-blue-400',
  green: 'text-green-600 dark:text-green-400',
  purple: 'text-purple-600 dark:text-purple-400',
  orange: 'text-orange-600 dark:text-orange-400',
};

/** 默认占位数据：空数据或加载失败时使用 */
export const DEFAULT_STATS: Array<{
  label: string;
  value: string;
  change: string;
  trend: 'none';
  icon: LucideIcon;
  color: string;
}> = [
  { label: 'API总调用', value: '0', change: '-', trend: 'none', icon: Activity, color: 'blue' },
  { label: '活跃用户', value: '0', change: '-', trend: 'none', icon: Users, color: 'green' },
  { label: '令牌消耗', value: '0', change: '-', trend: 'none', icon: Zap, color: 'purple' },
  { label: '平均响应时间', value: '-', change: '-', trend: 'none', icon: Clock, color: 'orange' },
];

export const DEFAULT_API_CALLS_DATA = [
  { date: '10/16', calls: 0, success: 0, failed: 0 },
  { date: '10/17', calls: 0, success: 0, failed: 0 },
  { date: '10/18', calls: 0, success: 0, failed: 0 },
  { date: '10/19', calls: 0, success: 0, failed: 0 },
  { date: '10/20', calls: 0, success: 0, failed: 0 },
  { date: '10/21', calls: 0, success: 0, failed: 0 },
  { date: '10/22', calls: 0, success: 0, failed: 0 },
];

export const DEFAULT_TOKEN_USAGE_DATA = [
  { date: '10/16', input: 0, output: 0 },
  { date: '10/17', input: 0, output: 0 },
  { date: '10/18', input: 0, output: 0 },
  { date: '10/19', input: 0, output: 0 },
  { date: '10/20', input: 0, output: 0 },
  { date: '10/21', input: 0, output: 0 },
  { date: '10/22', input: 0, output: 0 },
];

export const DEFAULT_RESPONSE_TIME_DATA = [
  { date: '10/16', avgTime: 0, p95: 0, p99: 0 },
  { date: '10/17', avgTime: 0, p95: 0, p99: 0 },
  { date: '10/18', avgTime: 0, p95: 0, p99: 0 },
  { date: '10/19', avgTime: 0, p95: 0, p99: 0 },
  { date: '10/20', avgTime: 0, p95: 0, p99: 0 },
  { date: '10/21', avgTime: 0, p95: 0, p99: 0 },
  { date: '10/22', avgTime: 0, p95: 0, p99: 0 },
];

export const DEFAULT_TOP_ENDPOINTS = [
  { endpoint: '/v1/chat/completions', calls: 0, avgTime: '-', successRate: '-' },
  { endpoint: '/v1/embeddings', calls: 0, avgTime: '-', successRate: '-' },
  { endpoint: '/api/v1/agents/chat', calls: 0, avgTime: '-', successRate: '-' },
  { endpoint: '/api/v1/agents/stream', calls: 0, avgTime: '-', successRate: '-' },
];

export const DEFAULT_APP_DISTRIBUTION = {
  items: [{ name: '暂无数据', value: 100, calls: 0, tokens: 0, color: '#6b7280' }],
  total: { apps: 0, calls: 0, tokens: 0 },
};

export const DEFAULT_MODEL_DISTRIBUTION = {
  items: [{ name: '暂无数据', value: 100, calls: 0, tokens: 0, color: '#6b7280' }],
  total: { models: 0, calls: 0, tokens: 0, cost: 0, costDisplay: '$0.00' },
};

export const DEFAULT_ERROR_ANALYSIS = [
  { statusCode: 0, name: '暂无错误数据', count: 0, percentage: '0%', percentageValue: 0 },
];
