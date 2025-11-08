import { ApiLocaleResult, PageQuery, AI } from '@xcan-angus/infra';
import httpClient, { HttpClient, RequestParams } from './HttpClient.ts';
import { ActivityDetailResult, ActivityListOrderByEnum } from './ActivityTypes.ts';

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
    this.http.request<ActivityDetailResult, ApiLocaleResult>({
      path: `${AI}/activity`,
      method: 'GET',
      query: query,
      secure: true,
      ...params,
    });
}

export default new Activity(httpClient);
