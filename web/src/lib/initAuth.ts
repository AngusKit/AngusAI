import httpClient from '@/services/HttpClient';

import {
  app,
  APP_CODE_MAP,
  appContext,
  AppOrServiceRoute,
  CLIENT_ID_KEY,
  cookieUtils,
  PageQuery,
  routerUtils
} from '@xcan-angus/infra';

const initAfterAuthentication = async ({
  code
}: {
  code: keyof typeof AppOrServiceRoute;
}): Promise<{ [key: string]: any }> => {
  // 检查URL中的私有参数并更新认证令牌
  const { url, isPrivateParam } = app.updateAuthByPrivateParam();
  if (isPrivateParam) {
    location.href = url.href;
    return {};
  }

  // 验证客户端ID一致性，防止认证冲突
  const currentClientId = appContext.getEnv().oauthClientId;
  const ck = cookieUtils as unknown as { get?: (k: string) => string };
  const oldClientId = ck.get && ck.get(CLIENT_ID_KEY);
  if (currentClientId && oldClientId && currentClientId !== oldClientId) {
    await app.signOut();
    return {};
  }

  // 从服务器获取当前用户信息
  const currentUserUrl = routerUtils.getCurrentUserEndpoint();
  const currentAppCode = APP_CODE_MAP[code];
  const response = await httpClient.request<any>({
    path: currentUserUrl,
    method: 'get',
    query: {
      infoScope: PageQuery.InfoScope.DETAIL,
      appCode: currentAppCode,
      editionType: appContext.getEditionType()
    }
  });

  // 检查响应数据是否有效
  if (response?.data?.message) {
    return {};
  }

  // 检查 response.data 是否为空对象或无效
  if (!response?.data || typeof response.data !== 'object' || Object.keys(response.data).length === 0) {
    return {};
  }

  const userInfo = response.data;

  // 使用用户信息和权限更新应用上下文
  // 使用可选链和默认值，防止访问空对象的属性时报错
  appContext
    .setUser(userInfo)
    .setTenant(userInfo?.tenant)
    .setAuthApps(userInfo?.authApps)
    .setAccessApp(userInfo?.accessApp)
    .setAccessAppFuncTree(userInfo?.accessAppFuncTree);
  return userInfo;
};

export { initAfterAuthentication };
