import { PageQuery, AI } from '@xcan-angus/infra';
import httpClient, { HttpClient, QueryParamsType, RequestParams } from './HttpClient.ts';
import {
  ActivityDetailResult,
  ActivityListOrderByEnum,
  ActivityStatisticsResult,
  SimpleStatisticsDto,
} from './ActivityTypes.ts';

export class Activity<SecurityDataType = unknown> {
  http: HttpClient<SecurityDataType>;

  constructor(http: HttpClient<SecurityDataType>) {
    this.http = http;
  }

  /**
   * @description Retrieve paginated list of user activity logs with filtering and search capabilities
   *
   * @tags Activity
   * @summary Query activity logs
   * @request GET:/api/v1/activity
   * @secure
   */
  activityList = (
    query?: PageQuery & {
      /**
       * Activity record identifier
       * @format int64
       */
      id?: string;
      /**
       * Target resource identifier
       * @format int64
       */
      resourceId?: string;
      /** Target resource type for activity categorization */
      resourceType?: string;
      /**
       * User identifier who performed the operation
       * @format int64
       */
      userId?: string;
      /** Activity detail content for full-text search */
      detail?: string;
      /**
       * Activity date
       * @format date-time
       */
      activityDate?: string;
      /**
       * 排序字段
       * @example "activityDate"
       */
      orderBy?: ActivityListOrderByEnum;
    },
    params: RequestParams = {}
  ) =>
    this.http.request<ActivityDetailResult>({
      path: `${AI}/activity`,
      method: 'GET',
      query: query as unknown as QueryParamsType,
      secure: true,
      ...params,
    });

  /**
   * @description 获取活动模块统计数据
   * @tags Activity
   * @summary 获取活动统计
   * @request GET:/api/v1/activity/statistics
   * @secure
   */
  getActivityStatistics = (
    query?: SimpleStatisticsDto,
    params: RequestParams = {}
  ) =>
    this.http.request<ActivityStatisticsResult>({
      path: `${AI}/activity/statistics`,
      method: 'GET',
      query: query as unknown as QueryParamsType,
      secure: true,
      ...params,
    });
}

export default new Activity(httpClient);
