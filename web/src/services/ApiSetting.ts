import {AI, ApiLocaleResult} from '@xcan-angus/infra';
import { OpenAPIV3_1 } from '@/types/openapi-types';
import httpClient, { ContentType, HttpClient, RequestParams } from './HttpClient.ts';
import {ApiSchemaResult} from "@/services/ApiSettingTypes.ts";

export class ApiSetting<SecurityDataType = unknown> {
  http: HttpClient<SecurityDataType>;

  constructor(http: HttpClient<SecurityDataType>) {
    this.http = http;
  }

  /**
   * @description 更新接口集服务器信息
   *
   * @tags 接口集设置
   * @name ApiServersUpdate
   * @summary 更新接口集服务器
   * @request PUT:/api/v1/api-collections/{collectionId}/servers
   * @secure
   */
  apiServersUpdate = (
    collectionId: string,
    data: OpenAPIV3_1.ServerObject[],
    params: RequestParams = {},
  ) =>
    this.http.request<ApiSchemaResult, ApiLocaleResult>({
      path: `${AI}/api-collections/${collectionId}/servers`,
      method: "PUT",
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description 更新接口集安全方案信息
   *
   * @tags 接口集设置
   * @name ApiSecuritiesUpdate
   * @summary 更新接口集安全方案
   * @request PUT:/api/v1/api-collections/{collectionId}/securities
   * @secure
   */
  apiSecuritiesUpdate = (
    collectionId: number,
    data: Record<string, OpenAPIV3_1.SecuritySchemeObject>,
    params: RequestParams = {},
  ) =>
    this.http.request<ApiSchemaResult, ApiLocaleResult>({
      path: `${AI}/api-collections/${collectionId}/securities`,
      method: "PUT",
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
}


export default new ApiSetting(httpClient);
