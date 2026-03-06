package cloud.xcan.agentx.observability.logging;

import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;

/**
 * 结构化日志工具 —— 统一 MDC 字段管理
 */
public final class StructuredLogger {

  private StructuredLogger() {
  }

  public static Logger getLogger(Class<?> clazz) {
    return LoggerFactory.getLogger(clazz);
  }

  /**
   * 在 MDC 上下文中执行操作
   */
  public static void withContext(Map<String, String> context, Runnable action) {
    Map<String, String> previous = MDC.getCopyOfContextMap();
    try {
      if (context != null) {
        context.forEach(MDC::put);
      }
      action.run();
    } finally {
      MDC.setContextMap(previous != null ? previous : Map.of());
    }
  }

  public static void setAgentContext(String agentId, String sessionId) {
    MDC.put("agentId", agentId);
    MDC.put("sessionId", sessionId);
  }

  public static void setWorkflowContext(String workflowId, String executionId) {
    MDC.put("workflowId", workflowId);
    MDC.put("executionId", executionId);
  }

  public static void setTenantContext(String tenantId) {
    MDC.put("tenantId", tenantId);
  }

  public static void clearContext() {
    MDC.clear();
  }
}
