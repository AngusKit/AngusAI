/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

import {
    ActivityListParamsFilters0OpEnum,
    ActivityListParamsFilters1OpEnum,
    ActivityListParamsInfoScopeEnum,
    ActivityListParamsOrderByEnum,
    ActivityListParamsOrderSortEnum,
    ApiLocaleResultPageResultActivityDetailVo,
    ApiResultObject,
} from "./data-contracts.ts";
import {HttpClient, RequestParams} from "./http-client.ts";

export class Activity<SecurityDataType = unknown> {
    http: HttpClient<SecurityDataType>;

    constructor(http: HttpClient<SecurityDataType>) {
        this.http = http;
    }

    /**
     * @description Retrieve paginated list of user activity logs with filtering and search capabilities
     *
     * @tags Activity
     * @name ActivityList
     * @summary Query activity logs
     * @request GET:/api/v1/activity
     * @secure
     */
    activityList = (
        query?: {
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
             * 所属租户ID
             * @format int64
             * @example 1
             */
            tenantId?: number;
            /**
             * Page number for paginated data (default: 1)
             * @format int32
             * @min 1
             * @max 100000
             */
            pageNo?: number;
            /**
             * Number of items per page (default: 10)
             * @format int32
             * @min 1
             * @max 2000
             */
            pageSize?: number;
            /**
             * 排序字段
             * @example "activityDate"
             */
            orderBy?: ActivityListParamsOrderByEnum;
            /** Specifies the direction of the sorting (ascending or descending) */
            orderSort?: ActivityListParamsOrderSortEnum;
            /** Scope of information to query (BASIC or DETAIL). Interface performance optimization parameters, only valid for some interfaces */
            infoScope?: ActivityListParamsInfoScopeEnum;
            /** Whether to use full-text search (default: false, uses DB index search if false) */
            fullTextSearch?: boolean;
            /** Search keyword */
            keyword?: string;
            /**
             * ID of the creator
             * @format int64
             * @example 1
             */
            createdBy?: number;
            /**
             * Creation date
             * @format date-time
             * @example "2024-10-12 00:00:00"
             */
            createdDate?: string;
            /**
             * ID of the last modifier
             * @format int64
             * @example 1
             */
            modifiedBy?: number;
            /**
             * Last modification date
             * @format date-time
             * @example "2024-10-12 00:00:00"
             */
            lastModifiedDate?: string;
            /** Customize the filter parameter name. Note: The parameter name must be a whitelist parameter */
            "filters[0].key"?: string;
            /** Customize the filter condition (EQUAL, NOT_EQUAL, GREATER_THAN, etc.) */
            "filters[0].op"?: ActivityListParamsFilters0OpEnum;
            /** Customize the filter value */
            "filters[0].value"?: any;
            /** Customize the filter parameter name. Note: The parameter name must be a whitelist parameter */
            "filters[1].key"?: string;
            /** Customize the filter condition (EQUAL, NOT_EQUAL, GREATER_THAN, etc.) */
            "filters[1].op"?: ActivityListParamsFilters1OpEnum;
            /** Customize the filter value */
            "filters[1].value"?: any;
        },
        params: RequestParams = {},
    ) =>
        this.http.request<
            ApiLocaleResultPageResultActivityDetailVo,
            ApiResultObject
        >({
            path: `/api/v1/activity`,
            method: "GET",
            query: query,
            secure: true,
            ...params,
        });
}
