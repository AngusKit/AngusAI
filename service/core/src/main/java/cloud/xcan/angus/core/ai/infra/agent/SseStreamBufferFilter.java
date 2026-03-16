package cloud.xcan.angus.core.ai.infra.agent;

import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * SSE 流式接口专用 Filter
 * <p>
 * 在请求到达 Controller 前禁用响应缓冲，确保 emitter.send() 的数据立即 flush 到客户端。 Servlet 容器（如 Tomcat）默认缓冲约 8KB，导致
 * token 无法实时到达前端/Postman。
 * </p>
 */
public class SseStreamBufferFilter implements Filter {

  private static final String SSE_STREAM_PATH = "/api/v1/agents/chat/stream";

  @Override
  public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
      throws IOException, ServletException {
    HttpServletRequest httpRequest = (HttpServletRequest) request;
    HttpServletResponse httpResponse = (HttpServletResponse) response;

    if (isSseStreamPath(httpRequest)) {
      httpResponse.setBufferSize(0);
      httpResponse.setHeader("Cache-Control", "no-cache");
      httpResponse.setHeader("X-Accel-Buffering", "no");
    }

    chain.doFilter(request, response);
  }

  private boolean isSseStreamPath(HttpServletRequest request) {
    String path = request.getRequestURI();
    if (request.getContextPath() != null && !request.getContextPath().isEmpty()) {
      path = path.substring(request.getContextPath().length());
    }
    return path != null && path.endsWith(SSE_STREAM_PATH);
  }
}
