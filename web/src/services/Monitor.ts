import { AI } from '@xcan-angus/infra';
import type { ChatMonitorOverviewVo, ChartDataPointVo, ChatMonitorChartQuery } from './MonitorTypes.ts';
import http, { HttpClient, RequestParams } from './HttpClient.ts';

export class Monitor<SecurityDataType = unknown> {
  http: HttpClient<SecurityDataType>;

  constructor(http: HttpClient<SecurityDataType>) {
    this.http = http;
  }

  /**
   * 获取统计概览
   * @request GET:/api/v1/monitor/overview
   */
  getOverview = (params: RequestParams = {}) =>
    this.http.request<ChatMonitorOverviewVo>({
      path: `${AI}/monitor/overview`,
      method: 'GET',
      secure: true,
      ...params,
    });

  /**
   * 获取会话趋势折线图数据
   * @request GET:/api/v1/monitor/charts/sessions
   */
  getSessionsChartData = (query?: ChatMonitorChartQuery, params: RequestParams = {}) =>
    this.http.request<ChartDataPointVo[]>({
      path: `${AI}/monitor/charts/sessions`,
      method: 'GET',
      query: query as Record<string, unknown>,
      secure: true,
      ...params,
    });

  /**
   * 获取消息趋势折线图数据
   * @request GET:/api/v1/monitor/charts/messages
   */
  getMessagesChartData = (query?: ChatMonitorChartQuery, params: RequestParams = {}) =>
    this.http.request<ChartDataPointVo[]>({
      path: `${AI}/monitor/charts/messages`,
      method: 'GET',
      query: query as Record<string, unknown>,
      secure: true,
      ...params,
    });

  /**
   * 获取反馈趋势折线图数据
   * @request GET:/api/v1/monitor/charts/feedback
   */
  getFeedbackChartData = (query?: ChatMonitorChartQuery, params: RequestParams = {}) =>
    this.http.request<ChartDataPointVo[]>({
      path: `${AI}/monitor/charts/feedback`,
      method: 'GET',
      query: query as Record<string, unknown>,
      secure: true,
      ...params,
    });
}

export default new Monitor(http);
