import { PageQuery, AI } from '@xcan-angus/infra';
import httpClient, { HttpClient, QueryParamsType, RequestParams } from './HttpClient.ts';
import {
  ActivityDetailResult,
  ActivityListOrderByEnum,
  ActivityStatisticsResult,
  SimpleStatisticsDto,
} from './ActivityTypes.ts';
import { FullResourceTypeEnum } from '@/enums/enums';

export class Activity<SecurityDataType = unknown> {
  http: HttpClient<SecurityDataType>;

  constructor(http: HttpClient<SecurityDataType>) {
    this.http = http;
  }

  /**
   * @description 分页查询活动日志，支持筛选与全文检索
   * @tags Activity
   * @summary 查询活动日志
   * @request GET:/api/v1/activity
   * @secure
   */
  activityList = (
    query?: PageQuery & {
      /** 活动记录ID @format int64 */
      id?: string;
      /** 关联资源ID @format int64 */
      resourceId?: string;
      /** 关联资源类型，用于分类筛选 */
      resourceType?: FullResourceTypeEnum | string;
      /** 操作用户ID @format int64 */
      userId?: string;
      /** 活动详情内容，全文检索 */
      detail?: string;
      /** 活动日期 @format date-time */
      activityDate?: string;
      /** 排序字段 @example "activityDate" */
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
   * @request GET:/api/v1/activity/stats
   * @secure
   */
  getActivityStatistics = (
    query?: SimpleStatisticsDto,
    params: RequestParams = {}
  ) =>
    this.http.request<ActivityStatisticsResult>({
      path: `${AI}/activity/stats`,
      method: 'GET',
      query: query as unknown as QueryParamsType,
      secure: true,
      ...params,
    });
}

export default new Activity(httpClient);
