import axios, {
  type AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type HeadersDefaults,
  type InternalAxiosRequestConfig,
  type ResponseType
} from 'axios';
import {
  API_SERVER_ERROR_CODE,
  API_SUCCESS_CODE,
  ApiLocaleResult,
  ApiType,
  app,
  appContext,
  AppOrServiceRoute,
  cookieUtils,
  DEFAULT_API_VERSION,
  DomainManager,
  eventQueue,
  httpUtils,
  IFRAME_ACCESS_TOKEN_NAME,
  IFRAME_EXPIRES_IN_NAME,
  IFRAME_REFRESH_TOKEN_NAME,
  IFRAME_REQUEST_AUTH_TIME_NAME,
  LockUtils,
  routerUtils as RouterUtils,
  SYSTEM_ERROR_MESSAGE,
  TokenInfo,
  typeUtils
} from '@xcan-angus/infra';
import { HttpApiResult } from './HttpApiResult.ts';
import {
  AUTH_BEARER_PREFIX,
  HEADER_ACCEPT_LANGUAGE,
  HEADER_AUTHORIZATION,
  HEADER_VARY,
  HEADER_DEVICE_ID,
  LOCK_KEY_REFRESH_TOKEN,
  HEADER_OPT_TENANT_ID,
  TENANT_HEADER_EXCLUDED_PATTERNS,
  TENANT_HEADER_WHITELIST_PATTERNS
} from '@/Constants';
import { getOptTenantId } from '@/lib/tenantRequestStore';

export type QueryParamsType = Record<string | number, unknown>;

// File upload/download endpoint paths
const filePaths: string[] = [
  `/${ApiType.API}/${DEFAULT_API_VERSION}/file/upload`, // Upload file endpoint
  `/${ApiType.API}/${DEFAULT_API_VERSION}/file`, // Download file endpoint
  `/${ApiType.PUB_API}/${DEFAULT_API_VERSION}/file` // Download file endpoint
];

export interface FullRequestParams extends Omit<
  AxiosRequestConfig,
  'data' | 'params' | 'url' | 'responseType'
> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<
  FullRequestParams,
  'body' | 'method' | 'query' | 'path'
>;

export interface ApiConfig<SecurityDataType = unknown> extends Omit<
  AxiosRequestConfig,
  'data' | 'cancelToken'
> {
  securityWorker?: (
    securityData: SecurityDataType | null
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = 'application/json',
  JsonApi = 'application/vnd.api+json',
  FormData = 'multipart/form-data',
  UrlEncoded = 'application/x-www-form-urlencoded',
  Text = 'text/plain',
}

const lockUtils = new LockUtils();

/**
 * 判断该请求是否需要添加 X-Opt-Tenant-Id 请求头
 * 需命中需添加白名单，且未命中不需要添加白名单
 */
function shouldAddTenantHeader(url: string): boolean {
  if (!url) return false;
  const lower = url.toLowerCase();
  const inWhitelist = TENANT_HEADER_WHITELIST_PATTERNS.some(p => lower.includes(p));
  const inExcluded = TENANT_HEADER_EXCLUDED_PATTERNS.some(p => lower.includes(p));
  return inWhitelist && !inExcluded;
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>['securityWorker'];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({
    securityWorker,
    secure,
    format,
    ...axiosConfig
  }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({
      ...axiosConfig,
      baseURL: axiosConfig.baseURL || '{env}.xcan.cloud/ai'
    });
    this.initInstanceUse();
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  // Refresh token logic, updates cookies and iframe params if needed
  refreshToken = async () => {
    const refreshToken = httpUtils.isInIframe()
      ? httpUtils.getParamsFromIframeUrl(IFRAME_ACCESS_TOKEN_NAME)
      : cookieUtils.getTokenInfo()?.refresh_token;

    // No refresh token, redirect to signin
    if (!refreshToken) {
      app.toSignIn(true);
    }

    const url = RouterUtils.getRefreshTokenUrl();
    const env = appContext.getContext().env;
    const body = {
      refreshToken,
      clientId: env.oauthClientId,
      clientSecret: env.oauthClientSecret
    };

    const response = await this.request({
      path: url,
      method: 'POST',
      query: body
    });

    if (!response.data) {
      // app.toSignIn(true);
      return;
    }

    const _resData = (response as AxiosResponse).data?.data as ApiLocaleResult;

    const tokenInfo: TokenInfo = {
      request_auth_time: new Date().toISOString(),
      ..._resData
    } as TokenInfo;
    cookieUtils.setTokenInfo(tokenInfo);

    if (httpUtils.isInIframe()) {
      const _url = new URL(window.location.href);
      _url.searchParams.set(
        IFRAME_ACCESS_TOKEN_NAME,
        tokenInfo.access_token as string
      );
      _url.searchParams.set(
        IFRAME_REFRESH_TOKEN_NAME,
        tokenInfo.refresh_token as string
      );
      _url.searchParams.set(IFRAME_EXPIRES_IN_NAME, tokenInfo.expires_in + '');
      _url.searchParams.set(
        IFRAME_REQUEST_AUTH_TIME_NAME,
        tokenInfo.request_auth_time as string
      );
      window.location.href = _url.href;
    }
  };

  initInstanceUse = () => {
    const domainManager: DomainManager = DomainManager.getInstance(
      appContext.getProfile()
    );
    this.instance?.interceptors.request.use(
      async config => await this.requestInterceptor(config, domainManager),
      err => {
        throw err;
      }
    );

    this.instance?.interceptors.response.use(
      (response: AxiosResponse): AxiosResponse =>
        this.responseInterceptor(response),
      (err: AxiosError) => this.responseErrorInterceptor(err)
    );
  };

  requestInterceptor = async (
    config: InternalAxiosRequestConfig,
    domainManager: DomainManager
  ) => {
    // Set language and device headers
    config.headers[HEADER_ACCEPT_LANGUAGE] = cookieUtils.getCurrentLanguage();
    config.headers[HEADER_VARY] = HEADER_ACCEPT_LANGUAGE;
    config.headers[HEADER_DEVICE_ID] = await httpUtils.preloadVisitorId();

    // Ensure config.url exists
    if (!config.url) {
      return config;
    }

    const url = config.url; // 保存 url 的引用，确保类型安全

    // 仅对需要租户上下文的业务接口添加可选租户 ID 请求头
    if (shouldAddTenantHeader(url)) {
      const optTenantId = getOptTenantId();
      if (optTenantId) {
        config.headers[HEADER_OPT_TENANT_ID] = optTenantId;
      }
    }

    // Token logic for API endpoints
    if (url.includes(ApiType.API)) {
      if (appContext.isTokenExpiringOrExpired()) {
        await lockUtils.executeWithLock(LOCK_KEY_REFRESH_TOKEN, () =>
          this.refreshToken()
        );
      }

      const accessToken = httpUtils.isInIframe()
        ? httpUtils.getParamsFromIframeUrl(IFRAME_ACCESS_TOKEN_NAME) || ''
        : cookieUtils.getTokenInfo()?.access_token ?? '';
      config.headers[HEADER_AUTHORIZATION] = `${AUTH_BEARER_PREFIX}${accessToken}`;
    }

    // Domain routing logic
    const isPrivateEdition = appContext.isPrivateEdition();
    const hasDomainInUrl = /^(https?:|\/\/)/.test(url);

    if (!hasDomainInUrl) {
      const isFile = filePaths.some(item => url.includes(item));
      const domain =
        isPrivateEdition || !isFile
          ? domainManager.getApiDomain()
          : domainManager.getFileApiDomain();
      config.url = domain + url;
    }

    // Private edition: adjust URL based on route
    if (isPrivateEdition) {
      const route: AppOrServiceRoute | null = RouterUtils.getRouteByUrl(
        config.url
      );
      if (!route) {
        return config;
      }

      const { pathname, search } = new URL(config.url);
      let _origin: string;
      const domainManager = DomainManager.getInstance(appContext.getProfile());
      switch (route) {
        case AppOrServiceRoute.tester: {
          _origin = domainManager.getApiDomain(AppOrServiceRoute.tester);
          break;
        }
        default: {
          _origin = domainManager.getApiDomain(AppOrServiceRoute.gm);
        }
      }
      const _pathname = pathname.replace('/' + route, '');
      config.url = _origin + _pathname + search;
    }
    return config;
  };

  // Response interceptor: formats response and attaches filename if present
  responseInterceptor = (response: AxiosResponse): AxiosResponse => {
    const filename = httpUtils.getFilenameFromResponse(response);
    const headers = { ...response.headers, filename };
    const status = response.status;
    if (
      response?.data &&
      typeUtils.isObject(response.data) &&
      (response.data?.message || response.data?.msg) &&
      response.data?.code !== API_SUCCESS_CODE
    ) {
      throw new Error(response.data.message || response.data.msg);
    }
    if (status === 401) {
      app.toSignIn(true);
    }
    // 将响应转换为 HttpApiResult 结构并存储在 response.data 中
    const httpApiResult: HttpApiResult = {
      status,
      headers,
      code: API_SUCCESS_CODE,
      data: response?.data,
      ...(response?.data || {})
    };
    // 返回 AxiosResponse，但 data 字段包含 HttpApiResult 结构
    return {
      ...response,
      data: httpApiResult
    };
  };

  // Response error interceptor: formats error as HttpApiResult
  responseErrorInterceptor = (err: AxiosError): never => {
    if (!err?.response) {
      throw new Error(err.message || 'Network error');
    }

    const response = err.response;
    const data = response.data as ApiLocaleResult;
    const result =
      data && data.code
        ? data
        : {
            code: API_SERVER_ERROR_CODE,
            message: SYSTEM_ERROR_MESSAGE
          };
    const resConfig = response.config || {};
    const isApi = (resConfig.url || '')?.includes('/api/');
    if (isApi && response.status === 401) {
      app.toSignIn(true);
    }

    throw new Error(result.message || 'Request failed');
  };

  setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  /**
   * 检查响应结果，如果 code !== 'S'，抛出包含后端 message 的错误
   *
   * @param response HTTP API 响应结果
   * @param defaultErrorMessage 默认错误信息（当 response.message 不存在时使用）
   * @throws {Error} 如果 code !== 'S'，抛出包含后端 message 的错误
   *
   * @example
   * ```ts
   * const response = await httpClient.request(...);
   * httpClient.checkResponseCode(response, '操作失败');
   * // 如果 code !== 'S'，会抛出错误，错误信息优先使用 response.message
   * ```
   */
  public checkResponseCode = <T = unknown>(
    response: HttpApiResult<T>,
    defaultErrorMessage: string
  ): void => {
    if (response.code !== API_SUCCESS_CODE) {
      const errorMessage = response.message || defaultErrorMessage;
      throw new Error(errorMessage);
    }
  };

  protected mergeRequestParams(
    params1: AxiosRequestConfig,
    params2?: AxiosRequestConfig
  ): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method &&
            this.instance.defaults.headers[
              method.toLowerCase() as keyof HeadersDefaults
            ]) ||
          {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {})
      }
    } as FullRequestParams;
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === 'object' && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(
    input: Record<string, unknown>
  ): globalThis.FormData {
    if (input instanceof globalThis.FormData) {
      return input;
    }
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: unknown[] =
        property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(
          key,
          isFileType ? formItem : this.stringifyFormItem(formItem)
        );
      }

      return formData;
    }, new globalThis.FormData());
  }

  public request = async <T = unknown>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<HttpApiResult<T>> => {
    const secureParams =
      ((typeof secure === 'boolean' ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (type === ContentType.FormData && body && typeof body === 'object') {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (type === ContentType.Text && body && typeof body !== 'string') {
      body = JSON.stringify(body);
    }
    const _params = query ? httpUtils.getURLSearchParams(query) : undefined;
    try {
      const axiosResponse = await this.instance.request({
        ...requestParams,
        headers: {
          ...(requestParams.headers || {}),
          ...(type ? { 'Content-Type': type } : {})
        },
        params: _params,
        responseType: responseFormat,
        data: body,
        url: path
      } as any);
      // 响应拦截器已经将 response.data 转换为 HttpApiResult 结构
      return axiosResponse.data as HttpApiResult<T>;
    } catch (err) {
      if (requestParams.method !== 'get') {
        eventQueue.commit(
          'http_error',
          (err as any)?.message || SYSTEM_ERROR_MESSAGE
        );
        throw err;
      } else {
        // GET 请求错误时，返回包含完整 HttpApiResult 结构的对象
        const errorResult = err as HttpApiResult;
        return {
          status: errorResult?.status || 0,
          headers: errorResult?.headers || {},
          code: errorResult?.code || API_SERVER_ERROR_CODE,
          message: errorResult?.message || SYSTEM_ERROR_MESSAGE,
          data: null
        } as HttpApiResult<T>;
      }
    }
  };
}

export default new HttpClient();
