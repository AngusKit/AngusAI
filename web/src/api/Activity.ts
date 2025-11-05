import { PageQuery, ApiLocaleResult } from '@xcan-angus/infra';
import httpClient from './HttpClient.ts';
import {
    ActivityListOrderByEnum,
    ActivityDetailResult
} from "./DataContracts.ts";
import {HttpClient, RequestParams} from "./HttpClient.ts";

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
            id?: number;
            /**
             * Target resource identifier
             * @format int64
             */
            resourceId?: number;
            /** Target resource type for activity categorization */
            resourceType?: string;
            /**
             * User identifier who performed the operation
             * @format int64
             */
            userId?: number;
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
        params: RequestParams = {},
    ) =>
        this.http.request<
            ActivityDetailResult,
            ApiLocaleResult
        >({
            path: `/api/v1/activity`,
            method: "GET",
            query: query,
            secure: true,
            ...params,
        });
}

export default new Activity(httpClient);
