/**
 * 当前请求使用的租户 ID 存储
 * 供 HttpClient 请求拦截器读取，用于添加 X-Opt-Tenant-Id 请求头
 */

let currentOptTenantId: string | null = null;

/** 设置当前请求使用的租户 ID */
export function setOptTenantId(id: string | null): void {
  currentOptTenantId = id ?? null;
}

/** 获取当前请求使用的租户 ID */
export function getOptTenantId(): string | null {
  return currentOptTenantId;
}
