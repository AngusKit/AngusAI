package com.agentx.api.controller;

import com.agentx.api.dto.ApiResponse;
import com.agentx.api.dto.ChatRequest;
import com.agentx.api.dto.ChatResponse;
import com.agentx.core.agent.AgentRegistry;
import jakarta.validation.Valid;
import java.time.Duration;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Flux;

/**
 * Agent 对话接口
 */
@RestController
@RequestMapping("/api/v1/agents")
public class AgentChatController {

  private final AgentRegistry agentRegistry;

  public AgentChatController(AgentRegistry agentRegistry) {
    this.agentRegistry = agentRegistry;
  }

  /**
   * 同步对话
   */
  @PostMapping("/chat")
  public ApiResponse<ChatResponse> chat(@Valid @RequestBody ChatRequest request) {
    long start = System.currentTimeMillis();
    String sessionId = request.getSessionId() != null ? request.getSessionId() : "default";
    String reply = agentRegistry.chat(request.getAgentId(), sessionId, request.getMessage());
    long elapsed = System.currentTimeMillis() - start;

    ChatResponse response = new ChatResponse();
    response.setAgentId(request.getAgentId());
    response.setSessionId(request.getSessionId());
    response.setReply(reply);
    response.setLatencyMs(elapsed);
    return ApiResponse.ok(response);
  }

  /**
   * 流式对话 (SSE)
   */
  @PostMapping(value = "/chat/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
  public Flux<String> chatStream(@Valid @RequestBody ChatRequest request) {
    String sessionId = request.getSessionId() != null ? request.getSessionId() : "default";
    String reply = agentRegistry.chat(request.getAgentId(), sessionId, request.getMessage());
    return Flux.fromArray(reply.split("(?<=\\. )"))
        .delayElements(Duration.ofMillis(50));
  }
}
