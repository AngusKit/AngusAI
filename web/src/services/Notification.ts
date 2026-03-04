import { AI, PageQuery } from '@xcan-angus/infra';

import {
  BatchOperationResultVoResult,
  NotificationArchiveDto,
  NotificationCreateDto,
  NotificationDeleteDto,
  NotificationDetailVoResult,
  NotificationReadStatusDto,
  NotificationStarStatusDto,
  NotificationStatisticsVoResult,
  NotificationUpdateDto,
  PageResultNotificationDetailVoResult
} from './NotificationTypes';
import {
  NotificationCategoryEnum,
  NotificationPriorityEnum,
  NotificationTypeEnum
} from '@/enums/enums';
import { ContentType, HttpClient, QueryParamsType, RequestParams } from './HttpClient.ts';
import http from '@/services/HttpClient.ts';

export class Notification<SecurityDataType = unknown> {
  http: HttpClient<SecurityDataType>;

  constructor (http: HttpClient<SecurityDataType>) {
    this.http = http;
  }

  createNotification = (
    data: NotificationCreateDto,
    params: RequestParams = {}
  ) =>
    this.http.request<NotificationDetailVoResult>({
      path: `${AI}/notifications`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params
    });

  updateNotification = (
    id: string,
    data: NotificationUpdateDto,
    params: RequestParams = {}
  ) =>
    this.http.request<NotificationDetailVoResult>({
      path: `${AI}/notifications/${id}`,
      method: 'PUT',
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params
    });

  updateReadStatus = (
    data: NotificationReadStatusDto,
    params: RequestParams = {}
  ) =>
    this.http.request<BatchOperationResultVoResult>({
      path: `${AI}/notifications/read-status`,
      method: 'PATCH',
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params
    });

  updateStarredStatus = (
    data: NotificationStarStatusDto,
    params: RequestParams = {}
  ) =>
    this.http.request<BatchOperationResultVoResult>({
      path: `${AI}/notifications/star-status`,
      method: 'PATCH',
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params
    });

  archiveNotification = (
    data: NotificationArchiveDto,
    params: RequestParams = {}
  ) =>
    this.http.request<BatchOperationResultVoResult>({
      path: `${AI}/notifications/archive`,
      method: 'PATCH',
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params
    });

  markAllAsRead = (params: RequestParams = {}) =>
    this.http.request<BatchOperationResultVoResult>({
      path: `${AI}/notifications/mark-all-read`,
      method: 'PATCH',
      secure: true,
      ...params
    });

  deleteNotification = (
    data: NotificationDeleteDto,
    params: RequestParams = {}
  ) =>
    this.http.request<void>({
      path: `${AI}/notifications`,
      method: 'DELETE',
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params
    });

  getNotificationDetail = (id: string, params: RequestParams = {}) =>
    this.http.request<NotificationDetailVoResult>({
      path: `${AI}/notifications/${id}`,
      method: 'GET',
      secure: true,
      ...params
    });

  listNotifications = (
    query?: PageQuery & {
      id?: string;
      title?: string;
      category?: NotificationCategoryEnum;
      source?: string;
      isRead?: boolean;
      isStarred?: boolean;
      isArchived?: boolean;
      type?: NotificationTypeEnum;
      priority?: NotificationPriorityEnum;
      keyword?: string;
    },
    params: RequestParams = {}
  ) =>
    this.http.request<PageResultNotificationDetailVoResult>({
      path: `${AI}/notifications`,
      method: 'GET',
      query: query as unknown as QueryParamsType,
      secure: true,
      ...params
    });

  getNotificationStatistics = (params: RequestParams = {}) =>
    this.http.request<NotificationStatisticsVoResult>({
      path: `${AI}/notifications/stats`,
      method: 'GET',
      secure: true,
      ...params
    });
}

export default new Notification(http);
