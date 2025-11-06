import {ApiLocaleResult} from '@xcan-angus/infra';
import {TeamSettingsDto, TeamSettingsResult,} from "./TeamTypes.ts";
import http, {ContentType, HttpClient, RequestParams} from "./HttpClient.ts";

export class Team<SecurityDataType = unknown> {
    http: HttpClient<SecurityDataType>;

    constructor(http: HttpClient<SecurityDataType>) {
        this.http = http;
    }

    /**
     * @description 查询完整团队设置信息
     *
     * @tags 团队设置
     * @name GetTeamSettingsDetail
     * @summary 查询团队设置
     * @request GET:/api/v1/team/settings
     * @secure
     */
    getTeamSettingsDetail = (params: RequestParams = {}) =>
        this.http.request<TeamSettingsResult, ApiLocaleResult>({
            path: `/api/v1/team/settings`,
            method: "GET",
            secure: true,
            ...params,
        });
    /**
     * @description 更新完整团队设置信息
     *
     * @tags 团队设置
     * @name UpdateTeamSettings
     * @summary 更新团队设置
     * @request PUT:/api/v1/team/settings
     * @secure
     */
    updateTeamSettings = (data: TeamSettingsDto, params: RequestParams = {}) =>
        this.http.request<TeamSettingsResult, ApiLocaleResult>({
            path: `/api/v1/team/settings`,
            method: "PUT",
            body: data,
            secure: true,
            type: ContentType.Json,
            ...params,
        });
}

export default new Team(http);
