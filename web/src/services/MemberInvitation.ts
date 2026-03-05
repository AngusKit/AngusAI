import { ApiLocaleResult, AI, PageQuery } from '@xcan-angus/infra';
import {
  UserInviteDto,
  UserInviteFindDto,
  UserInviteListVoResult,
  PageResultUserInviteVoResult,
  UserInviteResendVoResult,
} from './MemberInvitationTypes';
import httpClient, {
  HttpClient,
  ContentType,
  QueryParamsType,
  RequestParams,
} from './HttpClient';
/**
 * 用户邀请管理 - 委托 AngusGM UserInviteRemote 实现
 * 接口与 AngusAI MemberInviteRest.java 保持一致
 */
export class MemberInvitation<SecurityDataType = unknown> {
  http: HttpClient<SecurityDataType>;

  constructor(http: HttpClient<SecurityDataType>) {
    this.http = http;
  }

  /**
   * 邀请用户
   * @request POST:/api/v1/member/invites
   */
  inviteUser = (data: UserInviteDto, params: RequestParams = {}) =>
    this.http.request<UserInviteListVoResult>({
      path: `${AI}/member/invites`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });

  /**
   * 取消邀请
   * @request DELETE:/api/v1/member/invites/{id}
   */
  cancelInvite = (id: string, params: RequestParams = {}) =>
    this.http.request<ApiLocaleResult>({
      path: `${AI}/member/invites/${id}`,
      method: 'DELETE',
      secure: true,
      ...params,
    });

  /**
   * 重新发送邀请
   * @request POST:/api/v1/member/invites/{id}/resend
   */
  resendInvite = (id: string, params: RequestParams = {}) =>
    this.http.request<UserInviteResendVoResult>({
      path: `${AI}/member/invites/${id}/resend`,
      method: 'POST',
      secure: true,
      ...params,
    });

  /**
   * 获取邀请列表
   * @request GET:/api/v1/member/invites
   */
  listInvites = (
    query?: PageQuery & UserInviteFindDto & {
      keyword?: string;
    },
    params: RequestParams = {}
  ) =>
    this.http.request<PageResultUserInviteVoResult>({
      path: `${AI}/member/invites`,
      method: 'GET',
      query: query as QueryParamsType,
      secure: true,
      ...params,
    });
}

export default new MemberInvitation(httpClient);
