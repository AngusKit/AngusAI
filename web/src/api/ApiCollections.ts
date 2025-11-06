import {ApiLocaleResult, PageQuery} from '@xcan-angus/infra';
import {
    ApiCollectionCreateDto,
    ApiCollectionDetailResult,
    ApiCollectionImportDto,
    ApiCollectionListParamsOrderByEnum,
    ApiCollectionListResult,
    ApiCollectionStatisticsResult,
    ApiCollectionUpdateDto,
    ApiEndpointCreateDto,
    ApiEndpointDetailResult,
    ApiEndpointListParamsOrderByEnum,
    ApiEndpointResult,
    ApiEndpointTestDto,
    ApiEndpointTestResult,
    ApiEndpointUpdateDto,
    ResultApiEndpointVo
} from "./ApiCollectionsTypes.ts";
import {ContentType, HttpClient, RequestParams} from "./HttpClient.ts";
import {ApiCollectionSourceEnum, HttpMethodEnum, VisibilityEnum} from "@/enums/enums.ts";

export class ApiCollections<SecurityDataType = unknown> {
    http: HttpClient<SecurityDataType>;

    constructor(http: HttpClient<SecurityDataType>) {
        this.http = http;
    }

    /**
     * @description 根据ID获取端点的详细信息
     *
     * @tags 接口集端点
     * @name ApiEndpointGetDetail
     * @summary 获取端点详情
     * @request GET:/api/v1/api-collections/{collectionId}/endpoints/{endpointId}
     * @secure
     */
    apiEndpointGetDetail = (
        collectionId: number,
        endpointId: number,
        params: RequestParams = {},
    ) =>
        this.http.request<ApiEndpointDetailResult, ApiLocaleResult>({
            path: `/api/v1/api-collections/${collectionId}/endpoints/${endpointId}`,
            method: "GET",
            secure: true,
            ...params,
        });
    /**
     * @description 更新接口端点信息
     *
     * @tags 接口集端点
     * @name ApiEndpointUpdate
     * @summary 更新端点
     * @request PUT:/api/v1/api-collections/{collectionId}/endpoints/{endpointId}
     * @secure
     */
    apiEndpointUpdate = (
        collectionId: number,
        endpointId: number,
        data: ApiEndpointUpdateDto,
        params: RequestParams = {},
    ) =>
        this.http.request<ApiEndpointResult, ApiLocaleResult>({
            path: `/api/v1/api-collections/${collectionId}/endpoints/${endpointId}`,
            method: "PUT",
            body: data,
            secure: true,
            type: ContentType.Json,
            ...params,
        });
    /**
     * @description 删除接口端点
     *
     * @tags 接口集端点
     * @name ApiEndpointDelete
     * @summary 删除端点
     * @request DELETE:/api/v1/api-collections/{collectionId}/endpoints/{endpointId}
     * @secure
     */
    apiEndpointDelete = (
        collectionId: number,
        endpointId: number,
        params: RequestParams = {},
    ) =>
        this.http.request<ApiLocaleResult, ApiLocaleResult>({
            path: `/api/v1/api-collections/${collectionId}/endpoints/${endpointId}`,
            method: "DELETE",
            secure: true,
            ...params,
        });
    /**
     * @description 分页查询接口集列表，支持关键词搜索、来源筛选、可见性筛选等
     *
     * @tags 接口集
     * @name ApiCollectionList
     * @summary 获取接口集列表
     * @request GET:/api/v1/api-collections
     * @secure
     */
    apiCollectionList = (
        query?: PageQuery & {
            /**
             * 接口集ID
             * @format int64
             */
            id?: number;
            /** 接口集名称，支持模糊查询 */
            name?: string;
            /** 来源筛选：OPENAPI-OpenAPI 3.0，SWAGGER-Swagger 2.0，POSTMAN-Postman Collection，MANUAL-手动创建 */
            source?: ApiCollectionSourceEnum;
            /** 可见性筛选：PRIVATE-私有，TEAM-团队，PUBLIC-公开 */
            visibility?: VisibilityEnum;
            /** 排序字段 */
            orderBy?: ApiCollectionListParamsOrderByEnum;
        },
        params: RequestParams = {},
    ) =>
        this.http.request<
            ApiCollectionListResult,
            ApiLocaleResult
        >({
            path: `/api/v1/api-collections`,
            method: "GET",
            query: query,
            secure: true,
            ...params,
        });
    /**
     * @description 手动创建一个空的API接口集
     *
     * @tags 接口集
     * @name ApiCollectionCreate
     * @summary 创建接口集
     * @request POST:/api/v1/api-collections
     * @secure
     */
    apiCollectionCreate = (
        data: ApiCollectionCreateDto,
        params: RequestParams = {},
    ) =>
        this.http.request<ApiLocaleResult, ApiLocaleResult>({
            path: `/api/v1/api-collections`,
            method: "POST",
            body: data,
            secure: true,
            type: ContentType.Json,
            ...params,
        });
    /**
     * @description 导出接口集为OpenAPI 3.1规范
     *
     * @tags 接口集
     * @name ApiCollectionExportOpenApi
     * @summary 导出OpenAPI规范
     * @request POST:/api/v1/api-collections/{id}/export
     * @secure
     */
    apiCollectionExportOpenApi = (
        id: number,
        query?: {
            /**
             * 导出格式
             * @default "json"
             */
            format?: string;
            /**
             * 是否包含禁用的端点
             * @default false
             */
            includeDisabled?: boolean;
        },
        params: RequestParams = {},
    ) =>
        this.http.request<File, ApiLocaleResult>({
            path: `/api/v1/api-collections/${id}/export`,
            method: "POST",
            query: query,
            secure: true,
            ...params,
        });
    /**
     * @description 获取接口集的端点列表
     *
     * @tags 接口集端点
     * @name ApiEndpointList
     * @summary 获取端点列表
     * @request GET:/api/v1/api-collections/{collectionId}/endpoints
     * @secure
     */
    apiEndpointList = (
        collectionId: number,
        query?: PageQuery & {
            /**
             * 端点ID
             * @format int64
             */
            id?: number;
            /** 端点名称，支持模糊查询 */
            name?: string;
            /** 操作标识符，用于OpenAPI规范解析的唯一标识 */
            operationId?: string;
            /** HTTP方法筛选：GET、POST、PUT、DELETE、PATCH等 */
            method?: HttpMethodEnum;
            /** 标签筛选，支持按标签名称过滤 */
            tag?: string;
            /** 启用状态筛选：true-仅查询启用的接口，false-仅查询禁用的接口，null-查询所有 */
            enabled?: boolean;
            /** 排序字段 */
            orderBy?: ApiEndpointListParamsOrderByEnum;
        },
        params: RequestParams = {},
    ) =>
        this.http.request<ResultApiEndpointVo, ApiLocaleResult>({
            path: `/api/v1/api-collections/${collectionId}/endpoints`,
            method: "GET",
            query: query,
            secure: true,
            ...params,
        });
    /**
     * @description 手动添加接口端点
     *
     * @tags 接口集端点
     * @name ApiEndpointCreate
     * @summary 添加端点
     * @request POST:/api/v1/api-collections/{collectionId}/endpoints
     * @secure
     */
    apiEndpointCreate = (
        collectionId: number,
        data: ApiEndpointCreateDto,
        params: RequestParams = {},
    ) =>
        this.http.request<ApiLocaleResult, ApiLocaleResult>({
            path: `/api/v1/api-collections/${collectionId}/endpoints`,
            method: "POST",
            body: data,
            secure: true,
            type: ContentType.Json,
            ...params,
        });
    /**
     * @description 测试接口端点是否可用
     *
     * @tags 接口集端点
     * @name ApiEndpointTest
     * @summary 测试接口端点
     * @request POST:/api/v1/api-collections/{collectionId}/endpoints/{endpointId}/test
     * @secure
     */
    apiEndpointTest = (
        collectionId: number,
        endpointId: number,
        data: ApiEndpointTestDto,
        params: RequestParams = {},
    ) =>
        this.http.request<ApiEndpointTestResult, ApiLocaleResult>({
            path: `/api/v1/api-collections/${collectionId}/endpoints/${endpointId}/test`,
            method: "POST",
            body: data,
            secure: true,
            type: ContentType.Json,
            ...params,
        });
    /**
     * @description 从OpenAPI/Swagger/Postman文件导入接口集
     *
     * @tags 接口集
     * @name ApiCollectionImport
     * @summary 导入接口集
     * @request POST:/api/v1/api-collections/import
     * @secure
     */
    apiCollectionImport = (
        data: ApiCollectionImportDto,
        params: RequestParams = {},
    ) =>
        this.http.request<ApiLocaleResult, ApiLocaleResult>({
            path: `/api/v1/api-collections/import`,
            method: "POST",
            body: data,
            secure: true,
            type: ContentType.FormData,
            ...params,
        });
    /**
     * @description 根据ID获取接口集的详细信息
     *
     * @tags 接口集
     * @name ApiCollectionGetDetail
     * @summary 获取接口集详情
     * @request GET:/api/v1/api-collections/{id}
     * @secure
     */
    apiCollectionGetDetail = (id: number, params: RequestParams = {}) =>
        this.http.request<ApiCollectionDetailResult, ApiLocaleResult>({
            path: `/api/v1/api-collections/${id}`,
            method: "GET",
            secure: true,
            ...params,
        });
    /**
     * @description 删除指定的接口集，如果被引用需要force=true才能删除
     *
     * @tags 接口集
     * @name ApiCollectionDelete
     * @summary 删除接口集
     * @request DELETE:/api/v1/api-collections/{id}
     * @secure
     */
    apiCollectionDelete = (
        id: number,
        query?: {
            /** 强制删除（即使被引用） */
            force?: boolean;
        },
        params: RequestParams = {},
    ) =>
        this.http.request<ApiLocaleResult, ApiLocaleResult>({
            path: `/api/v1/api-collections/${id}`,
            method: "DELETE",
            query: query,
            secure: true,
            ...params,
        });
    /**
     * @description 更新接口集信息
     *
     * @tags 接口集
     * @name ApiCollectionUpdate
     * @summary 更新接口集
     * @request PATCH:/api/v1/api-collections/{id}
     * @secure
     */
    apiCollectionUpdate = (
        id: number,
        data: ApiCollectionUpdateDto,
        params: RequestParams = {},
    ) =>
        this.http.request<ApiCollectionDetailResult, ApiLocaleResult>({
            path: `/api/v1/api-collections/${id}`,
            method: "PATCH",
            body: data,
            secure: true,
            type: ContentType.Json,
            ...params,
        });
    /**
     * @description 启用/禁用端点
     *
     * @tags 接口集端点
     * @name ApiEndpointToggle
     * @summary 切换端点状态
     * @request PATCH:/api/v1/api-collections/{collectionId}/endpoints/{endpointId}/toggle
     * @secure
     */
    apiEndpointToggle = (
        collectionId: number,
        endpointId: number,
        query: {
            /** 目标状态 */
            enabled: boolean;
        },
        params: RequestParams = {},
    ) =>
        this.http.request<ApiEndpointResult, ApiLocaleResult>({
            path: `/api/v1/api-collections/${collectionId}/endpoints/${endpointId}/toggle`,
            method: "PATCH",
            query: query,
            secure: true,
            ...params,
        });
    /**
     * @description 获取接口集的统计数据，包括总体统计、使用率排行、性能趋势等
     *
     * @tags 接口集
     * @name ApiCollectionGetStatistics
     * @summary 获取统计信息
     * @request GET:/api/v1/api-collections/statistics
     * @secure
     */
    apiCollectionGetStatistics = (
        query?: {
            /**
             * 接口集总数
             * @format date string: yyyy-MM-dd or yyyy-MM-dd HH:mm:ss
             */
            "startDate"?: string;
            /**
             * 接口总数
             * @format date string: yyyy-MM-dd or yyyy-MM-dd HH:mm:ss
             */
            "endDate"?: string;
        },
        params: RequestParams = {},
    ) =>
        this.http.request<
            ApiCollectionStatisticsResult,
            ApiLocaleResult
        >({
            path: `/api/v1/api-collections/statistics`,
            method: "GET",
            query: query,
            secure: true,
            ...params,
        });
}
