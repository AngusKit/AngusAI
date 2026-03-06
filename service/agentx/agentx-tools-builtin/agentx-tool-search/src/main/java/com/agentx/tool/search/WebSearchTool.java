package com.agentx.tool.search;

import dev.langchain4j.agent.tool.P;
import dev.langchain4j.agent.tool.Tool;
import java.io.IOException;
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import lombok.extern.slf4j.Slf4j;

/**
 * 网络搜索工具 — 通过 HTTP 请求执行搜索查询
 */
@Slf4j
public class WebSearchTool {

  private final HttpClient httpClient = HttpClient.newBuilder()
      .connectTimeout(Duration.ofSeconds(10))
      .build();

  @Tool("Search the web for information about a given query and return the results")
  public String search(@P("The search query string") String query) {
    log.info("Executing web search: {}", query);
    try {
      String encoded = URLEncoder.encode(query, StandardCharsets.UTF_8);
      HttpRequest request = HttpRequest.newBuilder()
          .uri(URI.create("https://html.duckduckgo.com/html/?q=" + encoded))
          .header("User-Agent", "AgentX/1.0")
          .GET()
          .timeout(Duration.ofSeconds(15))
          .build();

      HttpResponse<String> response = httpClient.send(request,
          HttpResponse.BodyHandlers.ofString());
      if (response.statusCode() == 200) {
        return extractResults(response.body());
      }
      return "Search returned status: " + response.statusCode();
    } catch (IOException | InterruptedException e) {
      Thread.currentThread().interrupt();
      return "Web search failed: " + e.getMessage();
    }
  }

  @Tool("Search for the latest news about a topic")
  public String searchNews(@P("The news topic to search for") String topic) {
    return search(topic + " latest news");
  }

  private String extractResults(String html) {
    // Simple extraction of text content between result snippets
    StringBuilder sb = new StringBuilder();
    int count = 0;
    int idx = 0;
    while (count < 5 && (idx = html.indexOf("result__snippet", idx)) != -1) {
      int start = html.indexOf('>', idx) + 1;
      int end = html.indexOf('<', start);
      if (start > 0 && end > start) {
        String snippet = html.substring(start, end).trim();
        if (!snippet.isEmpty()) {
          sb.append(++count).append(". ").append(snippet).append("\n");
        }
      }
      idx = end;
    }
    return sb.isEmpty() ? "No results found for the query." : sb.toString();
  }
}
