package com.agentx.tool.notify;

import dev.langchain4j.agent.tool.P;
import dev.langchain4j.agent.tool.Tool;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;

/**
 * 通知工具 — 支持通过 Webhook 发送通知消息
 */
@Slf4j
@Component
public class NotificationTool {

  private final HttpClient httpClient = HttpClient.newBuilder()
      .connectTimeout(Duration.ofSeconds(10))
      .build();

  @Tool("Send a notification message to a webhook URL (supports Slack, DingTalk, WeCom, Feishu, or any generic webhook)")
  public String sendWebhook(
      @P("The webhook URL to send the notification to") String webhookUrl,
      @P("The notification message content") String message) {
    log.info("Sending webhook notification to: {}", webhookUrl);

    // Validate URL scheme
    if (!webhookUrl.startsWith("https://")) {
      return "Error: Only HTTPS webhook URLs are allowed.";
    }

    String body = buildPayload(webhookUrl, message);

    try {
      HttpRequest request = HttpRequest.newBuilder()
          .uri(URI.create(webhookUrl))
          .header("Content-Type", "application/json")
          .POST(HttpRequest.BodyPublishers.ofString(body))
          .timeout(Duration.ofSeconds(15))
          .build();

      HttpResponse<String> response = httpClient.send(request,
          HttpResponse.BodyHandlers.ofString());

      if (response.statusCode() >= 200 && response.statusCode() < 300) {
        return "Notification sent successfully (status: " + response.statusCode() + ")";
      }
      return "Notification failed (status: " + response.statusCode() + "): " + response.body();
    } catch (IOException | InterruptedException e) {
      Thread.currentThread().interrupt();
      return "Webhook notification failed: " + e.getMessage();
    }
  }

  @Tool("Log a notification message locally (useful for testing or when no webhook is configured)")
  public String logNotification(
      @P("The notification level: INFO, WARNING, or ERROR") String level,
      @P("The notification message") String message) {
    switch (level.toUpperCase()) {
      case "WARNING" -> log.warn("[NOTIFICATION] {}", message);
      case "ERROR" -> log.error("[NOTIFICATION] {}", message);
      default -> log.info("[NOTIFICATION] {}", message);
    }
    return "Notification logged at level " + level.toUpperCase() + ": " + message;
  }

  private String buildPayload(String webhookUrl, String message) {
    String escaped = message.replace("\\", "\\\\").replace("\"", "\\\"").replace("\n", "\\n");

    // DingTalk format
    if (webhookUrl.contains("dingtalk") || webhookUrl.contains("oapi.dingtalk.com")) {
      return "{\"msgtype\":\"text\",\"text\":{\"content\":\"" + escaped + "\"}}";
    }
    // Feishu format
    if (webhookUrl.contains("feishu") || webhookUrl.contains("open.feishu.cn")) {
      return "{\"msg_type\":\"text\",\"content\":{\"text\":\"" + escaped + "\"}}";
    }
    // WeCom format
    if (webhookUrl.contains("qyapi.weixin") || webhookUrl.contains("wecom")) {
      return "{\"msgtype\":\"text\",\"text\":{\"content\":\"" + escaped + "\"}}";
    }
    // Slack / generic webhook format
    return "{\"text\":\"" + escaped + "\"}";
  }
}
