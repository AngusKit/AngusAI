import { ApiLocaleResult } from '@xcan-angus/infra';

/**
 * HTTP API 响应结果类型
 *
 * 扩展了 {@link ApiLocaleResult}，添加了 HTTP 层面的状态码和响应头信息。
 * 这是 {@link HttpClient.request} 方法的返回类型，用于统一处理成功和错误响应。
 *
 * @description
 * 该接口结合了业务层响应结构（ApiLocaleResult）和 HTTP 层响应信息（status, headers），
 * 使得调用方可以同时访问业务数据和 HTTP 元数据。
 *
 * @example 成功响应示例
 * ```ts
 * const response: HttpApiResult<IssueDetailVo> = await IssuesService.getIssueDetail('owner', 'repo', '1');
 * // response.status = 200
 * // response.code = 'S'
 * // response.data = { id: 1, title: 'Issue title', ... }
 * // response.headers = { 'content-type': 'application/json', ... }
 * ```
 *
 * @example 错误响应示例（GET 请求）
 * ```ts
 * try {
 *   const response = await IssuesService.listIssues('owner', 'repo');
 *   if (response.data === null) {
 *     // GET 请求错误时，返回包含 data: null 的对象，不会抛出异常
 *     console.error('Error:', response.message);
 *   }
 * } catch (error) {
 *   // 非 GET 请求错误时会抛出异常
 *   console.error('Request failed:', error);
 * }
 * ```
 *
 * @remarks
 * - 成功响应：包含 status (HTTP 状态码)、headers (响应头)、code (业务状态码)、data (业务数据) 等字段
 * - GET 请求错误：返回包含 data: null 的 HttpApiResult 对象，不会抛出异常
 * - 非 GET 请求错误：抛出包含 HttpApiResult 结构的异常
 * - 响应拦截器会将 response.data 的所有字段展开到顶层，因此可以直接访问业务数据字段
 *
 * @see {@link ApiLocaleResult} 基础业务响应结构
 * @see {@link HttpClient.request} HTTP 请求方法
 */
export interface HttpApiResult<T = any> extends Omit<ApiLocaleResult, 'data'> {
  /**
   * HTTP 响应状态码
   *
   * @example 200 - 成功
   * @example 400 - 客户端错误
   * @example 401 - 未授权
   * @example 500 - 服务器错误
   */
  status: number;

  /**
   * HTTP 响应头信息
   *
   * 包含服务器返回的所有响应头，可能包含：
   * - content-type: 响应内容类型
   * - filename: 文件下载时的文件名（由响应拦截器添加）
   * - 其他自定义响应头
   */
  headers: any;

  /**
   * 业务响应数据
   *
   * 成功时包含实际的业务数据，类型由泛型参数 T 指定。
   * GET 请求错误时为 null，非 GET 请求错误时会抛出异常。
   */
  data?: T | null;
}
