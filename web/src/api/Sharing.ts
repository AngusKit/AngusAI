import {ApiLocaleResult, PageQuery} from '@xcan-angus/infra';
import {
    GetResourceSharingListOrderByEnum,
    ResourceAccessCheckResult,
    ResourceInfoListSharePermissionResult,
    ResourceSharingCreateDto,
    ResourceSharingDetailResult,
    ResourceSharingListResult,
    ResourceSharingStatisticsResult,
    ResourceSharingToggleDto,
    ResourceSharingUpdateDto,
} from "./SharingTypes.ts";
import http, {ContentType, HttpClient, RequestParams} from "./HttpClient.ts";
import {
    MemberPermissionEnum,
    ResourceTypeEnum,
    SharedWithEnum,
    StatisticsPeriodEnum
} from "@/enums/enums.ts";

export class Sharing<SecurityDataType = unknown> {
    http: HttpClient<SecurityDataType>;

    constructor(http: HttpClient<SecurityDataType>) {
        this.http = http;
    }

    /**
     * @description 启用或停止资源共享
     *
     * @tags Resource Sharing
     * @name ToggleResourceSharingStatus
     * @summary 切换资源共享状态
     * @request PUT:/api/v1/sharing/{id}/toggle
     * @secure
     */
    toggleResourceSharingStatus = (
        id: number,
        data: ResourceSharingToggleDto,
        params: RequestParams = {},
    ) =>
        this.http.request<ResourceSharingDetailResult, ApiLocaleResult>({
            path: `/api/v1/sharing/${id}/toggle`,
            method: "PUT",
            body: data,
            secure: true,
            type: ContentType.Json,
            ...params,
        });
    /**
     * @description 获取资源共享的详细信息
     *
     * @tags Resource Sharing
     * @name GetResourceSharingDetail
     * @summary 获取共享详情
     * @request GET:/api/v1/sharing/resources/{id}
     * @secure
     */
    getResourceSharingDetail = (id: number, params: RequestParams = {}) =>
        this.http.request<ResourceSharingDetailResult, ApiLocaleResult>({
            path: `/api/v1/sharing/resources/${id}`,
            method: "GET",
            secure: true,
            ...params,
        });
    /**
     * @description 更新资源共享配置
     *
     * @tags Resource Sharing
     * @name UpdateResourceSharing
     * @summary 更新共享权限
     * @request PUT:/api/v1/sharing/resources/{id}
     * @secure
     */
    updateResourceSharing = (
        id: number,
        data: ResourceSharingUpdateDto,
        params: RequestParams = {},
    ) =>
        this.http.request<ResourceSharingDetailResult, ApiLocaleResult>({
            path: `/api/v1/sharing/resources/${id}`,
            method: "PUT",
            body: data,
            secure: true,
            type: ContentType.Json,
            ...params,
        });
    /**
     * @description 取消资源共享
     *
     * @tags Resource Sharing
     * @name DeleteResourceSharing
     * @summary 取消资源共享
     * @request DELETE:/api/v1/sharing/resources/{id}
     * @secure
     */
    deleteResourceSharing = (id: number, params: RequestParams = {}) =>
        this.http.request<ApiLocaleResult, ApiLocaleResult>({
            path: `/api/v1/sharing/resources/${id}`,
            method: "DELETE",
            secure: true,
            ...params,
        });
    /**
     * @description 获取当前用户可访问的共享资源列表
     *
     * @tags Resource Sharing
     * @name GetResourceSharingList
     * @summary 获取共享资源列表
     * @request GET:/api/v1/sharing/resources
     * @secure
     */
    getResourceSharingList = (
        query?: PageQuery & {
            /**
             * 共享ID
             * @format int64
             */
            id?: number;
            /** 资源类型筛选 */
            type?: ResourceTypeEnum;
            /** 权限筛选 */
            permission?: MemberPermissionEnum;
            /** 共享范围筛选 */
            sharedWith?: SharedWithEnum;
            /** 排序字段 */
            orderBy?: GetResourceSharingListOrderByEnum;
        },
        params: RequestParams = {},
    ) =>
        this.http.request<
            ResourceSharingListResult,
            ApiLocaleResult
        >({
            path: `/api/v1/sharing/resources`,
            method: "GET",
            query: query,
            secure: true,
            ...params,
        });
    /**
     * @description 创建新的资源共享
     *
     * @tags Resource Sharing
     * @name CreateResourceSharing
     * @summary 创建资源共享
     * @request POST:/api/v1/sharing/resources
     * @secure
     */
    createResourceSharing = (
        data: ResourceSharingCreateDto,
        params: RequestParams = {},
    ) =>
        this.http.request<ApiLocaleResult, ApiLocaleResult>({
            path: `/api/v1/sharing/resources`,
            method: "POST",
            body: data,
            secure: true,
            type: ContentType.Json,
            ...params,
        });
    /**
     * @description 获取资源共享的访问统计
     *
     * @tags Resource Sharing
     * @name GetResourceSharingStatistics
     * @summary 获取共享访问统计
     * @request GET:/api/v1/sharing/resources/{id}/statistics
     * @secure
     */
    getResourceSharingStatistics = (
        id: number,
        query?: {
            /** 统计周期 */
            period?: StatisticsPeriodEnum;
        },
        params: RequestParams = {},
    ) =>
        this.http.request<
            ResourceSharingStatisticsResult,
            ApiLocaleResult
        >({
            path: `/api/v1/sharing/resources/${id}/statistics`,
            method: "GET",
            query: query,
            secure: true,
            ...params,
        });
    /**
     * @description 检查当前用户对资源的访问权限
     *
     * @tags Resource Sharing
     * @name CheckResourceAccess
     * @summary 检查资源访问权限
     * @request GET:/api/v1/sharing/check-access
     * @secure
     */
    checkResourceAccess = (
        query: {
            /**
             * 资源ID
             * @format int64
             */
            resourceId: number;
            /** 资源类型 */
            resourceType: ResourceTypeEnum;
        },
        params: RequestParams = {},
    ) =>
        this.http.request<ResourceAccessCheckResult, ApiLocaleResult>({
            path: `/api/v1/sharing/check-access`,
            method: "GET",
            query: query,
            secure: true,
            ...params,
        });
    /**
     * @description 获取当前用户对资源的访问权限
     *
     * @tags Resource Sharing
     * @name GetResourcePermissions
     * @summary 获取资源访问权限
     * @request GET:/api/v1/sharing/access-permissions
     * @secure
     */
    getResourcePermissions = (
        query: {
            /**
             * 资源ID
             * @format int64
             */
            resourceId: number;
            /** 资源类型 */
            resourceType: ResourceTypeEnum;
        },
        params: RequestParams = {},
    ) =>
        this.http.request<
            ResourceInfoListSharePermissionResult,
            ApiLocaleResult
        >({
            path: `/api/v1/sharing/access-permissions`,
            method: "GET",
            query: query,
            secure: true,
            ...params,
        });
}

export default new Sharing(http);
