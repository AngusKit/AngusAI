/**
 * 对话监控 API 类型定义
 */

/** 吞吐量统计 */
export interface ThroughputStatsVo {
  current: number;
  min: number;
  max: number;
  average: number;
}

/** 双值统计（活跃/总数） */
export interface DualStatsVo {
  active: number;
  total: number;
}

/** 反馈统计 */
export interface FeedbackStatsVo {
  like: number;
  dislike: number;
  total: number;
}

/** 对话监控统计概览 */
export interface ChatMonitorOverviewVo {
  throughput: ThroughputStatsVo;
  sessions: DualStatsVo;
  messages: DualStatsVo;
  users: DualStatsVo;
  feedback: FeedbackStatsVo;
  applications: DualStatsVo;
  agents: DualStatsVo;
  models: DualStatsVo;
}

/** 折线图数据点 */
export interface ChartDataPointVo {
  id: string;
  date: string;
  value: number;
}

/** 折线图查询参数 */
export interface ChatMonitorChartQuery {
  range?: 'year' | 'month' | 'day';
  year?: string;
  month?: string;
  day?: string;
}
