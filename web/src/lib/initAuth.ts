import httpClient from '../services/HttpClient';

import { app, APP_CODE_MAP, appContext, AppOrServiceRoute, CLIENT_ID_KEY, cookieUtils, PageQuery, routerUtils, } from '@xcan-angus/infra';

const initAfterAuthentication = async ({
  code,
}: {
  code: keyof typeof AppOrServiceRoute;
}): Promise<{ [key: string]: any }> => {
  //   Check for private parameters in URL and update authentication tokens
  let { url, isPrivateParam } = app.updateAuthByPrivateParam();
  if (isPrivateParam) {
    location.href = url.href;
    return {};
  }

  // Validate client ID consistency to prevent authentication conflicts
  let currentClientId = appContext.getEnv().oauthClientId;
  let oldClientId = cookieUtils.get && cookieUtils.get(CLIENT_ID_KEY);
  if (currentClientId && oldClientId && currentClientId !== oldClientId) {
    await app.signOut();
    return {};
  }

  // Fetch current user information from server
  let currentUserUrl = routerUtils.getCurrentUserEndpoint();
  const currentAppCode = APP_CODE_MAP[code];
  const response = await httpClient.request<any>({
    path: currentUserUrl,
    method: 'get',
    query: {
      infoScope: PageQuery.InfoScope.DETAIL,
      appCode: currentAppCode,
      editionType: appContext.getEditionType(),
    },
  });
  if (response?.data?.message) {
    return {};
  }

  const userInfo = response.data;

  // Update application context with user information and permissions
  appContext
    .setUser(userInfo)
    .setTenant(userInfo.tenant)
    .setAuthApps(userInfo.authApps)
    .setAccessApp(userInfo.accessApp)
    .setAccessAppFuncTree(userInfo.accessAppFuncTree);
  return userInfo;
};

export { initAfterAuthentication };
