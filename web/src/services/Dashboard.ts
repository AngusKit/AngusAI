import { AI } from '@xcan-angus/infra';
import {
  UsageDetailsResult,
  StatsOverviewResult,
  RecentApplicationsResult,
} from './DashboardTypes.ts';
import http, { HttpClient, RequestParams } from './HttpClient.ts';
import { TimeRangeEnum } from '@/enums/enums.ts';

export class Dashboard<SecurityDataType = unknown> {
  http: HttpClient<SecurityDataType>;

  constructor(http: HttpClient<SecurityDataType>) {
    this.http = http;
  }

  /**
   * @description 获取使用详情（热度应用 TOP5、API 调用 TOP5、费用成本 TOP5）
   *
   * @tags Dashboard
   * @name GetUsageDetails
   * @summary 获取使用详情
   * @request GET:/api/v1/dashboard/usage-details
   * @secure
   */
  getUsageDetails = (
    query?: {
      /**
       * 应用 ID 筛选
       * @format int64
       */
      appId?: string;
      /**
       * 时间范围
       * @example "7days"
       */
      timeRange?: TimeRangeEnum;
      /**
       * TOP N 数量，默认 5
       * @format int32
       * @default 5
       */
      limit?: number;
    },
    params: RequestParams = {}
  ) =>
    this.http.request<UsageDetailsResult>({
      path: `${AI}/dashboard/usage-details`,
      method: 'GET',
      query: query,
      secure: true,
      ...params,
    });

  /**
   * @description 获取统计概览（总应用数、API 调用、Token 消耗、活跃用户等）
   *
   * @tags Dashboard
   * @name GetStatsOverview
   * @summary 获取统计概览
   * @request GET:/api/v1/dashboard/stats-overview
   * @secure
   */
  getStatsOverview = (
    query?: {
      /**
       * 应用 ID 筛选
       * @format int64
       */
      appId?: string;
      /**
       * 时间范围
       * @example "7days"
       */
      timeRange?: TimeRangeEnum;
    },
    params: RequestParams = {}
  ) =>
    this.http.request<StatsOverviewResult>({
      path: `${AI}/dashboard/stats-overview`,
      method: 'GET',
      query: query,
      secure: true,
      ...params,
    });

  /**
   * @description 获取最近使用的应用列表
   *
   * @tags Dashboard
   * @name GetRecentApplications
   * @summary 获取最近应用
   * @request GET:/api/v1/dashboard/recent-applications
   * @secure
   */
  getRecentApplications = (
    query?: {
      /**
       * 返回数量，默认 6
       * @format int32
       * @default 6
       */
      limit?: number;
      /**
       * 偏移量，用于分页
       * @format int32
       * @default 0
       */
      offset?: number;
    },
    params: RequestParams = {}
  ) =>
    this.http.request<RecentApplicationsResult>({
      path: `${AI}/dashboard/recent-applications`,
      method: 'GET',
      query: query,
      secure: true,
      ...params,
    });
}

export default new Dashboard(http);
