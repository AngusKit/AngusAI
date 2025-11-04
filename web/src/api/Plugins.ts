import { PageQuery, ApiLocaleResult } from '@xcan-angus/infra';
import {
  ListPluginReviewResult,
  PageResultPluginListResult,
  PluginDetailResult,
  PluginStatisticsResult,
  GetPluginListOrderByEnum,
  PluginCreateDto,
  PluginReviewCreateDto,
  PluginUpdateDto,
  PluginVerifyDto,
} from "./DataContracts.ts";
import { ContentType, HttpClient, RequestParams } from "./HttpClient.ts";
import {PluginCategoryEnum, PluginStatusEnum, PluginTypeEnum, StatisticsPeriodEnum} from "@/enums/enums.ts";

export class Plugins<SecurityDataType = unknown> {
  http: HttpClient<SecurityDataType>;

  constructor(http: HttpClient<SecurityDataType>) {
    this.http = http;
  }

  /**
   * @description 修改插件状态
   *
   * @tags Plugin
   * @name ModifyPluginStatus
   * @summary 修改插件状态
   * @request PUT:/api/v1/plugins/{id}/status
   * @secure
   */
  modifyPluginStatus = (
    id: number,
    query: {
      /** 插件状态 */
      status: PluginStatusEnum;
    },
    params: RequestParams = {},
  ) =>
    this.http.request<PluginDetailResult, ApiLocaleResult>({
      path: `/api/v1/plugins/${id}/status`,
      method: "PUT",
      query: query,
      secure: true,
      ...params,
    });
  /**
   * @description 获取插件列表，支持分页、搜索和筛选
   *
   * @tags Plugin
   * @name GetPluginList
   * @summary 获取插件列表
   * @request GET:/api/v1/plugins
   * @secure
   */
  getPluginList = (
    query?: PageQuery & {
      /**
       * 插件ID
       * @format int64
       */
      id?: number;
      /** 插件名称 */
      name?: string;
      /** 分类筛选 */
      category?: PluginCategoryEnum;
      /** 状态筛选 */
      status?: PluginStatusEnum;
      /** 类型筛选 */
      type?: PluginTypeEnum;
      /** 是否公开 */
      isPublic?: boolean;
      /** 是否系统插件 */
      isSystem?: boolean;
      /** 是否已验证 */
      isVerified?: boolean;
      /** 是否收藏 */
      isFavorite?: boolean;
      /** 标签筛选 */
      tags?: string[];
      /**
       * 安装次数
       * @format int64
       */
      installCount?: number;
      /**
       * 使用次数
       * @format int64
       */
      usageCount?: number;
      /**
       * 评价数量
       * @format int64
       */
      reviewCount?: number;
      /**
       * 评分
       * @format double
       */
      rating?: number;
      /**
       * 最小评分
       * @format double
       */
      minRating?: number;
      /** 排序字段 */
      orderBy?: GetPluginListOrderByEnum;
    },
    params: RequestParams = {},
  ) =>
    this.http.request<PageResultPluginListResult, ApiLocaleResult>({
      path: `/api/v1/plugins`,
      method: "GET",
      query: query,
      secure: true,
      ...params,
    });
  /**
   * @description 创建新插件
   *
   * @tags Plugin
   * @name CreatePlugin
   * @summary 创建插件
   * @request POST:/api/v1/plugins
   * @secure
   */
  createPlugin = (data: PluginCreateDto, params: RequestParams = {}) =>
    this.http.request<ApiLocaleResult, ApiLocaleResult>({
      path: `/api/v1/plugins`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.FormData,
      ...params,
    });
  /**
   * @description 查询指定插件的所有评级记录（不分页）
   *
   * @tags PluginReview
   * @name ListPluginReviews
   * @summary 查询插件评级记录
   * @request GET:/api/v1/plugins/{pluginId}/reviews
   * @secure
   */
  listPluginReviews = (pluginId: number, params: RequestParams = {}) =>
    this.http.request<ListPluginReviewResult, ApiLocaleResult>({
      path: `/api/v1/plugins/${pluginId}/reviews`,
      method: "GET",
      secure: true,
      ...params,
    });
  /**
   * @description 为指定插件提交评级记录
   *
   * @tags PluginReview
   * @name CreatePluginReview
   * @summary 提交插件评级
   * @request POST:/api/v1/plugins/{pluginId}/reviews
   * @secure
   */
  createPluginReview = (
    pluginId: number,
    data: PluginReviewCreateDto,
    params: RequestParams = {},
  ) =>
    this.http.request<ApiLocaleResult, ApiLocaleResult>({
      path: `/api/v1/plugins/${pluginId}/reviews`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description 标记插件使用，增加使用计数
   *
   * @tags Plugin
   * @name UsePlugin
   * @summary 使用插件
   * @request POST:/api/v1/plugins/{id}/use
   * @secure
   */
  usePlugin = (id: number, params: RequestParams = {}) =>
    this.http.request<PluginDetailResult, ApiLocaleResult>({
      path: `/api/v1/plugins/${id}/use`,
      method: "POST",
      secure: true,
      ...params,
    });
  /**
   * @description 卸载指定插件（只删除运行时，保留安装包）
   *
   * @tags Plugin
   * @name UninstallPlugin
   * @summary 卸载插件
   * @request POST:/api/v1/plugins/{id}/uninstall
   * @secure
   */
  uninstallPlugin = (id: number, params: RequestParams = {}) =>
    this.http.request<ApiLocaleResult, ApiLocaleResult>({
      path: `/api/v1/plugins/${id}/uninstall`,
      method: "POST",
      secure: true,
      ...params,
    });
  /**
   * @description 发布插件到插件市场
   *
   * @tags Plugin
   * @name PublishPlugin
   * @summary 发布插件
   * @request POST:/api/v1/plugins/{id}/publish
   * @secure
   */
  publishPlugin = (id: number, params: RequestParams = {}) =>
    this.http.request<PluginDetailResult, ApiLocaleResult>({
      path: `/api/v1/plugins/${id}/publish`,
      method: "POST",
      secure: true,
      ...params,
    });
  /**
   * @description 安装指定插件
   *
   * @tags Plugin
   * @name InstallPlugin
   * @summary 安装插件
   * @request POST:/api/v1/plugins/{id}/install
   * @secure
   */
  installPlugin = (id: number, params: RequestParams = {}) =>
    this.http.request<PluginDetailResult, ApiLocaleResult>({
      path: `/api/v1/plugins/${id}/install`,
      method: "POST",
      secure: true,
      ...params,
    });
  /**
   * @description 管理员验证插件（需要管理员权限）
   *
   * @tags Plugin
   * @name VerifyPlugin
   * @summary 验证插件有效性
   * @request POST:/api/v1/plugins/verify
   * @secure
   */
  verifyPlugin = (data: PluginVerifyDto, params: RequestParams = {}) =>
    this.http.request<PluginDetailResult, ApiLocaleResult>({
      path: `/api/v1/plugins/verify`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.FormData,
      ...params,
    });
  /**
   * @description 获取指定插件的详细信息
   *
   * @tags Plugin
   * @name GetPluginDetail
   * @summary 获取插件详情
   * @request GET:/api/v1/plugins/{id}
   * @secure
   */
  getPluginDetail = (id: number, params: RequestParams = {}) =>
    this.http.request<PluginDetailResult, ApiLocaleResult>({
      path: `/api/v1/plugins/${id}`,
      method: "GET",
      secure: true,
      ...params,
    });
  /**
   * @description 删除指定插件（先卸载插件，再删除所有插件信息）
   *
   * @tags Plugin
   * @name DeletePlugin
   * @summary 删除插件
   * @request DELETE:/api/v1/plugins/{id}
   * @secure
   */
  deletePlugin = (id: number, params: RequestParams = {}) =>
    this.http.request<ApiLocaleResult, ApiLocaleResult>({
      path: `/api/v1/plugins/${id}`,
      method: "DELETE",
      secure: true,
      ...params,
    });
  /**
   * @description 更新插件的基本信息
   *
   * @tags Plugin
   * @name UpdatePlugin
   * @summary 更新插件基本信息
   * @request PATCH:/api/v1/plugins/{id}
   * @secure
   */
  updatePlugin = (
    id: number,
    data: PluginUpdateDto,
    params: RequestParams = {},
  ) =>
    this.http.request<PluginDetailResult, ApiLocaleResult>({
      path: `/api/v1/plugins/${id}`,
      method: "PATCH",
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description 获取插件的详细统计数据
   *
   * @tags Plugin
   * @name GetPluginStatistics
   * @summary 获取插件统计
   * @request GET:/api/v1/plugins/statistics
   * @secure
   */
  getPluginStatistics = (
    query?: {
      /** 统计周期 */
      period?: StatisticsPeriodEnum;
    },
    params: RequestParams = {},
  ) =>
    this.http.request<PluginStatisticsResult, ApiLocaleResult>({
      path: `/api/v1/plugins/statistics`,
      method: "GET",
      query: query,
      secure: true,
      ...params,
    });
}
