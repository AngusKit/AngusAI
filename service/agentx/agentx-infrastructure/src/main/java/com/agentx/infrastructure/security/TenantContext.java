package com.agentx.infrastructure.security;

/**
 * 租户上下文 —— 使用 ThreadLocal / ScopedValue 存储当前请求的租户 ID
 */
public final class TenantContext {

  private static final ThreadLocal<String> CURRENT_TENANT = new ThreadLocal<>();

  private TenantContext() {
  }

  public static void setTenantId(String tenantId) {
    CURRENT_TENANT.set(tenantId);
  }

  public static String getTenantId() {
    return CURRENT_TENANT.get();
  }

  public static void clear() {
    CURRENT_TENANT.remove();
  }
}
