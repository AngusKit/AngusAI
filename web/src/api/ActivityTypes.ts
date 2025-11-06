import {ApiLocaleResult} from '@xcan-angus/infra';

/** Activity详情 */
export interface ActivityDetailVo {
    /** @format int64 */
    id?: number;
    /** @format int64 */
    userId?: number;
    userName?: string;
    userAvatar?: string;
    /** @format int64 */
    targetId?: number;
    targetType?: string;
    targetName?: string;
    /** @format date-time */
    activityDate?: string;
    description?: string;
    detail?: string;
}

/** 分页Activity详情 */
export interface PageActivityDetailVo {
    /**
     * Total number
     * @format int64
     * @example 10
     */
    total?: number;
    /** Page data */
    list?: ActivityDetailVo[];
}

/** The API response result of supporting international message. */
export type ActivityDetailResult = ApiLocaleResult & {
    /** Actual response data or error details. */
    data?: PageActivityDetailVo;
};

/**
 * 排序字段
 * @example "activityDate"
 */
export enum ActivityListOrderByEnum {
    Id = "id",
    ActivityDate = "activityDate",
}
