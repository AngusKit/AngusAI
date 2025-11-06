import {ApiLocaleResult} from '@xcan-angus/infra';
import {
    AnalyticsOverviewResult,
    ApiCallsTrendResult,
    AppDistributionResult,
    ErrorAnalysisResult,
    ModelDistributionResult,
    ResponseTimeAnalysisResult,
    TokenUsageTrendResult,
    TopEndpointsResult,
} from "./AnalyticsTypes.ts";

import http, {HttpClient, RequestParams} from "./HttpClient.ts";
import {GranularityEnum, TimeRangeEnum} from "@/enums/enums.ts";

export class Analytics<SecurityDataType = unknown> {
    http: HttpClient<SecurityDataType>;

    constructor(http: HttpClient<SecurityDataType>) {
        this.http = http;
    }

    /**
     * @description 获取调用最多的接口统计，包括调用次数、响应时间、成功率等
     *
     * @tags Analytics
     * @name GetTopEndpoints
     * @summary 获取Top接口统计
     * @request GET:/api/v1/analytics/top-endpoints
     * @secure
     */
    getTopEndpoints = (
        query?: {
            /**
             * 应用ID筛选
             * @format int64
             */
            appId?: number;
            /**
             * 时间范围
             * @example "7days"
             */
            timeRange?: TimeRangeEnum;
            /** 数据粒度 */
            granularity?: GranularityEnum;
            /**
             * Top N，默认10
             * @format int32
             * @default 10
             */
            limit?: number;
            /**
             * 排序字段
             * @default "calls"
             */
            orderBy?: string;
        },
        params: RequestParams = {},
    ) =>
        this.http.request<TopEndpointsResult, ApiLocaleResult>({
            path: `/api/v1/analytics/top-endpoints`,
            method: "GET",
            query: query,
            secure: true,
            ...params,
        });
    /**
     * @description 获取Token使用量的时间序列数据，包括输入Token、输出Token和总消耗
     *
     * @tags Analytics
     * @name GetTokenUsageTrend
     * @summary 获取Token使用趋势
     * @request GET:/api/v1/analytics/token-usage
     * @secure
     */
    getTokenUsageTrend = (
        query?: {
            /**
             * 应用ID筛选
             * @format int64
             */
            appId?: number;
            /**
             * 时间范围
             * @example "7days"
             */
            timeRange?: TimeRangeEnum;
            /** 数据粒度 */
            granularity?: GranularityEnum;
        },
        params: RequestParams = {},
    ) =>
        this.http.request<TokenUsageTrendResult, ApiLocaleResult>({
            path: `/api/v1/analytics/token-usage`,
            method: "GET",
            query: query,
            secure: true,
            ...params,
        });
    /**
     * @description 获取API响应时间的统计数据，包括平均值、P50、P95、P99等性能指标
     *
     * @tags Analytics
     * @name GetResponseTimeAnalysis
     * @summary 获取响应时间分析
     * @request GET:/api/v1/analytics/response-time
     * @secure
     */
    getResponseTimeAnalysis = (
        query?: {
            /**
             * 应用ID筛选
             * @format int64
             */
            appId?: number;
            /**
             * 时间范围
             * @example "7days"
             */
            timeRange?: TimeRangeEnum;
            /** 数据粒度 */
            granularity?: GranularityEnum;
        },
        params: RequestParams = {},
    ) =>
        this.http.request<ResponseTimeAnalysisResult, ApiLocaleResult>({
            path: `/api/v1/analytics/response-time`,
            method: "GET",
            query: query,
            secure: true,
            ...params,
        });
    /**
     * @description 获取使用分析的概览统计数据，包括API调用、活跃用户、Token消耗、响应时间等核心指标
     *
     * @tags Analytics
     * @name GetAnalyticsOverview
     * @summary 获取分析概览
     * @request GET:/api/v1/analytics/overview
     * @secure
     */
    getAnalyticsOverview = (
        query?: {
            /**
             * 应用ID筛选
             * @format int64
             */
            appId?: number;
            /**
             * 时间范围
             * @example "7days"
             */
            timeRange?: TimeRangeEnum;
            /** 数据粒度 */
            granularity?: GranularityEnum;
        },
        params: RequestParams = {},
    ) =>
        this.http.request<AnalyticsOverviewResult, ApiLocaleResult>({
            path: `/api/v1/analytics/overview`,
            method: "GET",
            query: query,
            secure: true,
            ...params,
        });
    /**
     * @description 获取不同模型的使用分布情况，显示各模型的调用占比、Token消耗等
     *
     * @tags Analytics
     * @name GetModelDistribution
     * @summary 获取模型使用分布
     * @request GET:/api/v1/analytics/model-distribution
     * @secure
     */
    getModelDistribution = (
        query?: {
            /**
             * 应用ID筛选
             * @format int64
             */
            appId?: number;
            /**
             * 时间范围
             * @example "7days"
             */
            timeRange?: TimeRangeEnum;
            /** 数据粒度 */
            granularity?: GranularityEnum;
        },
        params: RequestParams = {},
    ) =>
        this.http.request<ModelDistributionResult, ApiLocaleResult>({
            path: `/api/v1/analytics/model-distribution`,
            method: "GET",
            query: query,
            secure: true,
            ...params,
        });
    /**
     * @description 获取错误统计和分析，包括按状态码分组、错误趋势等
     *
     * @tags Analytics
     * @name GetErrorAnalysis
     * @summary 获取错误分析
     * @request GET:/api/v1/analytics/errors
     * @secure
     */
    getErrorAnalysis = (
        query?: {
            /**
             * 应用ID筛选
             * @format int64
             */
            appId?: number;
            /**
             * 时间范围
             * @example "7days"
             */
            timeRange?: TimeRangeEnum;
            /** 数据粒度 */
            granularity?: GranularityEnum;
        },
        params: RequestParams = {},
    ) =>
        this.http.request<ErrorAnalysisResult, ApiLocaleResult>({
            path: `/api/v1/analytics/errors`,
            method: "GET",
            query: query,
            secure: true,
            ...params,
        });
    /**
     * @description 获取不同应用的使用分布情况，包括调用次数、Token消耗、占比等
     *
     * @tags Analytics
     * @name GetAppDistribution
     * @summary 获取应用使用分布
     * @request GET:/api/v1/analytics/app-distribution
     * @secure
     */
    getAppDistribution = (
        query?: {
            /**
             * 应用ID筛选
             * @format int64
             */
            appId?: number;
            /**
             * 时间范围
             * @example "7days"
             */
            timeRange?: TimeRangeEnum;
            /** 数据粒度 */
            granularity?: GranularityEnum;
            /**
             * Top N，默认10
             * @format int32
             * @default 10
             */
            limit?: number;
        },
        params: RequestParams = {},
    ) =>
        this.http.request<AppDistributionResult, ApiLocaleResult>({
            path: `/api/v1/analytics/app-distribution`,
            method: "GET",
            query: query,
            secure: true,
            ...params,
        });
    /**
     * @description 获取API调用量的时间序列数据，显示总调用、成功调用、失败调用的趋势变化
     *
     * @tags Analytics
     * @name GetApiCallsTrend
     * @summary 获取API调用趋势
     * @request GET:/api/v1/analytics/api-calls
     * @secure
     */
    getApiCallsTrend = (
        query?: {
            /**
             * 应用ID筛选
             * @format int64
             */
            appId?: number;
            /**
             * 时间范围
             * @example "7days"
             */
            timeRange?: TimeRangeEnum;
            /** 数据粒度 */
            granularity?: GranularityEnum;
        },
        params: RequestParams = {},
    ) =>
        this.http.request<ApiCallsTrendResult, ApiLocaleResult>({
            path: `/api/v1/analytics/api-calls`,
            method: "GET",
            query: query,
            secure: true,
            ...params,
        });
}

export default new Analytics(http);
