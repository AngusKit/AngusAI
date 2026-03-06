package cloud.xcan.core.workflow.node;

import cloud.xcan.core.workflow.engine.NodeExecutionContext;
import cloud.xcan.core.workflow.enums.NodeType;
import cloud.xcan.core.workflow.engine.NodeExecutor;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.HashMap;
import java.util.Map;
import lombok.extern.slf4j.Slf4j;

/**
 * HTTP 节点 — 发起 HTTP 请求
 */
@Slf4j
public class HttpNodeExecutor implements NodeExecutor {

  private final HttpClient httpClient = HttpClient.newBuilder()
      .connectTimeout(Duration.ofSeconds(30))
      .build();
  private final ObjectMapper objectMapper = new ObjectMapper();

  @Override
  public String getNodeType() {
    return NodeType.HTTP.name();
  }

  @Override
  @SuppressWarnings("unchecked")
  public Map<String, Object> execute(NodeExecutionContext context) {
    Map<String, Object> config = context.getNodeDefinition().getConfig();
    if (config == null || !config.containsKey("url")) {
      throw new IllegalArgumentException("HTTP node requires config with url");
    }

    String method = ((String) config.getOrDefault("method", "GET")).toUpperCase();
    String url = (String) config.get("url");
    Map<String, String> headers = (Map<String, String>) config.getOrDefault("headers", Map.of());
    int timeout = config.containsKey("timeout") ? ((Number) config.get("timeout")).intValue() : 30;

    try {
      HttpRequest.Builder requestBuilder = HttpRequest.newBuilder()
          .uri(URI.create(url))
          .timeout(Duration.ofSeconds(timeout));

      headers.forEach(requestBuilder::header);

      switch (method) {
        case "POST" -> {
          Object body = config.get("body");
          String bodyStr =
              body instanceof String ? (String) body : objectMapper.writeValueAsString(body);
          requestBuilder.POST(HttpRequest.BodyPublishers.ofString(bodyStr));
          if (!headers.containsKey("Content-Type")) {
            requestBuilder.header("Content-Type", "application/json");
          }
        }
        case "PUT" -> {
          Object body = config.get("body");
          String bodyStr =
              body instanceof String ? (String) body : objectMapper.writeValueAsString(body);
          requestBuilder.PUT(HttpRequest.BodyPublishers.ofString(bodyStr));
        }
        case "DELETE" -> requestBuilder.DELETE();
        default -> requestBuilder.GET();
      }

      HttpResponse<String> response = httpClient.send(requestBuilder.build(),
          HttpResponse.BodyHandlers.ofString());

      Map<String, Object> outputs = new HashMap<>();
      outputs.put("statusCode", response.statusCode());
      outputs.put("body", response.body());
      outputs.put("response", Map.of("body", response.body(), "statusCode", response.statusCode()));
      return outputs;

    } catch (Exception e) {
      throw new RuntimeException("HTTP request failed: " + e.getMessage(), e);
    }
  }
}
