package cloud.xcan.agentx.tool.http;

import dev.langchain4j.agent.tool.P;
import dev.langchain4j.agent.tool.Tool;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import lombok.extern.slf4j.Slf4j;

/**
 * 内置 HTTP 请求工具 — Agent 可通过 @Tool 注解调用
 */
@Slf4j
public class HttpRequestTool {

  private final HttpClient httpClient = HttpClient.newBuilder()
      .connectTimeout(Duration.ofSeconds(30))
      .build();

  @Tool("Send an HTTP GET request to the specified URL and return the response body")
  public String httpGet(@P("The URL to send GET request to") String url) {
    try {
      HttpRequest request = HttpRequest.newBuilder()
          .uri(URI.create(url))
          .GET()
          .timeout(Duration.ofSeconds(30))
          .build();
      HttpResponse<String> response = httpClient.send(request,
          HttpResponse.BodyHandlers.ofString());
      return "Status: " + response.statusCode() + "\nBody: " + response.body();
    } catch (Exception e) {
      return "HTTP GET failed: " + e.getMessage();
    }
  }

  @Tool("Send an HTTP POST request with a JSON body to the specified URL")
  public String httpPost(@P("The URL to send POST request to") String url,
      @P("The JSON body to send") String body) {
    try {
      HttpRequest request = HttpRequest.newBuilder()
          .uri(URI.create(url))
          .header("Content-Type", "application/json")
          .POST(HttpRequest.BodyPublishers.ofString(body))
          .timeout(Duration.ofSeconds(30))
          .build();
      HttpResponse<String> response = httpClient.send(request,
          HttpResponse.BodyHandlers.ofString());
      return "Status: " + response.statusCode() + "\nBody: " + response.body();
    } catch (Exception e) {
      return "HTTP POST failed: " + e.getMessage();
    }
  }
}
