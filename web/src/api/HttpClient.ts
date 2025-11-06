import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  HeadersDefaults,
  ResponseType,
} from "axios";
import axios from "axios";
import { app, appContext, DomainManager, ApiType, httpUtils, LockUtils, cookieUtils, API_SUCCESS_CODE, typeUtils, API_SUCCESS_MESSAGE, API_SERVER_ERROR_CODE, SYSTEM_ERROR_MESSAGE, eventQueue, REFRESH_TOKEN_AUTH_KEY } from '@xcan-angus/infra';

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams
  extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
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
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown>
  extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
  JsonApi = "application/vnd.api+json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

const lockUtils = new LockUtils();
export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
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
      baseURL: axiosConfig.baseURL || "{env}.xcan.cloud/ai",
    });
    this.initInstanceUse();
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  // Refresh token logic, updates cookies and iframe params if needed
  refreshToken = async () => {
    let refreshToken = httpUtils.isInIframe()
        ? httpUtils.getParamsFromIframeUrl(IFRAME_ACCESS_TOKEN_NAME)
        : cookieUtils.get(REFRESH_TOKEN_AUTH_KEY);

    // No refresh token, redirect to signin
    if (!refreshToken) {
        app.toSignIn(true);
    }

    let url = RouterUtils.getRefreshTokenUrl();
    let env = appContext.getContext().env;
    let body = {
        refreshToken,
        clientId: env.oauthClientId,
        clientSecret: env.oauthClientSecret,
    };

    const response = await this.request({
      url: url,
      method: 'post',
      query: body
    });

    if (!response.data) {
        app.toSignIn(true);
        return
    }

    const _resData = (response as AxiosResponse).data?.data as ApiResult;

    let tokenInfo: TokenInfo = {
        request_auth_time: new Date().toISOString(),
        ..._resData
    };
    cookieUtils.setTokenInfo(tokenInfo);

    if (httpUtils.isInIframe()) {
        const _url = new URL(location.href);
        _url.searchParams.set(IFRAME_ACCESS_TOKEN_NAME, tokenInfo.access_token as string);
        _url.searchParams.set(IFRAME_REFRESH_TOKEN_NAME, tokenInfo.refresh_token as string);
        _url.searchParams.set(IFRAME_EXPIRES_IN_NAME, tokenInfo.expires_in + '');
        _url.searchParams.set(IFRAME_REQUEST_AUTH_TIME_NAME, tokenInfo.request_auth_time as string);
        location.href = _url.href;
    }
  }

  initInstanceUse = () => {
    let domainManager: DomainManager = DomainManager.getInstance(appContext.getProfile());
    this.instance?.interceptors.request.use(
      async (config) => await this.requestInterceptor(config, domainManager),
      (err) => { throw err; }
    );

    this.instance?.interceptors.response.use(
      (response: AxiosResponse): Promise<AxiosResponse<ApiResult>> => this.responseInterceptor(response),
      (err: AxiosError) => this.responseErrorInterceptor(err)
  );
  }
  requestInterceptor = async (config: InternalAxiosRequestConfig, domainManager: DomainManager) => {

    // Set language and device headers
    config.headers['Accept-Language'] = cookieUtils.getCurrentLanguage();
    config.headers['Vary'] = 'Accept-Language';
    config.headers['XC-Auth-Device-Id'] = await httpUtils.preloadVisitorId();

    // Token logic for API endpoints
    if (config.url.includes(ApiType.API)) {
      if (appContext.isTokenExpiringOrExpired()) {
          await lockUtils.executeWithLock('refreshToken',  () => this.refreshToken());
      }

      let accessToken = httpUtils.isInIframe()
          ? getParamsFromIframeUrl(IFRAME_ACCESS_TOKEN_NAME) || ''
          : cookieUtils.get('access_token');
      config.headers.Authorization = `Bearer ${accessToken}`;
  }
    return config;
  }

  // Response interceptor: formats response and attaches filename if present
  responseInterceptor = (response: AxiosResponse) => {
    let filename = httpUtils.getFilenameFromResponse(response);
    const headers = {...response.headers, filename};
    const status = response.status;
    // TODO: If code != 'S', should show a prompt
    if (response?.data && typeUtils.isObject(response.data) && (response.data?.message || response.data?.msg) && response.data?.code !== API_SUCCESS_CODE) {
        throw {
            message: response.data.message || response.data.msg
        };
    }
    if (status === 401) {
        app.toSignIn(true);
    }
    return {
        status,
        headers,
        code: API_SUCCESS_CODE,
        data: response?.data,
        ...(response?.data || {})
    };
  }

  // Response error interceptor: formats error as ApiResult
  responseErrorInterceptor = (err: AxiosError) => {
    if (!err?.response) {
        throw {
            status: err.status,
            config: err.config,
            code: API_SERVER_ERROR_CODE,
            message: err.message
        } as ApiResult;
    }

    const response = err.response;
    const data = response.data as ApiResult;
    const result = data && data.code ? {
        ...data,
        message: data.message || data.msg
    } : {
        code: API_SERVER_ERROR_CODE,
        message: SYSTEM_ERROR_MESSAGE
    }
    const resConfig = response.config || {};
    const isApi = (resConfig.url || '')?.includes('/api/');
    if (isApi && response.status === 401) {
        app.toSignIn(true);
    }

    throw {
        status: response.status,
        headers: response.headers,
        config: response.config,
        ...result,
    } as ApiResult;
  }

  setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(
    params1: AxiosRequestConfig,
    params2?: AxiosRequestConfig,
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
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    if (input instanceof FormData) {
      return input;
    }
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] =
        property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(
          key,
          isFileType ? formItem : this.stringifyFormItem(formItem),
        );
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (
      type === ContentType.FormData &&
      body &&
      body !== null &&
      typeof body === "object"
    ) {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (
      type === ContentType.Text &&
      body &&
      body !== null &&
      typeof body !== "string"
    ) {
      body = JSON.stringify(body);
    }

    try {
      const response = await this.instance.request({
        ...requestParams,
        headers: {
          ...(requestParams.headers || {}),
          ...(type ? { "Content-Type": type } : {}),
        },
        params: query,
        responseType: responseFormat,
        data: body,
        url: path,
      });
      return response;
    } catch (err) {
      if (requestParams.method !== 'get') {
        eventQueue.commit('http_error', error?.message || SYSTEM_ERROR_MESSAGE);
      }
      return {
        ...err,
        data: null
      };
    }
  };
}

export default new HttpClient();
