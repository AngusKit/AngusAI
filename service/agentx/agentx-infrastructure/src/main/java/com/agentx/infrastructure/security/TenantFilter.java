package com.agentx.infrastructure.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.boot.autoconfigure.condition.ConditionalOnWebApplication;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * 多租户过滤器 —— 从请求头提取租户 ID 并设置到 TenantContext
 */
@Component
@ConditionalOnWebApplication
public class TenantFilter extends OncePerRequestFilter {

  private static final String TENANT_HEADER = "X-Tenant-Id";

  @Override
  protected void doFilterInternal(HttpServletRequest request,
      HttpServletResponse response,
      FilterChain filterChain) throws ServletException, IOException {
    try {
      String tenantId = request.getHeader(TENANT_HEADER);
      if (tenantId != null && !tenantId.isBlank()) {
        TenantContext.setTenantId(tenantId.trim());
      }
      filterChain.doFilter(request, response);
    } finally {
      TenantContext.clear();
    }
  }
}
