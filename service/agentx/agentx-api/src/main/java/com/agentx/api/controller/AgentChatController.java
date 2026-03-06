package com.agentx.api.controller;

import com.agentx.api.dto.ApiResponse;
import com.agentx.api.dto.ChatRequest;
import com.agentx.api.dto.ChatResponse;
import com.agentx.core.agent.AgentRegistry;
import dev.langchain4j.service.TokenStream;
import jakarta.validation.Valid;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Flux;
import reactor.core.scheduler.Schedulers;

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
   * 流式对话 (SSE) — 基于 TokenStream 的真实流式输出
   */
  @PostMapping(value = "/chat/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
  public Flux<String> chatStream(@Valid @RequestBody ChatRequest request) {
    String sessionId = request.getSessionId() != null ? request.getSessionId() : "default";
    String agentId = request.getAgentId();
    String message = request.getMessage();

    return Flux.<String>create(sink -> {
      TokenStream stream = agentRegistry.chatStream(agentId, sessionId, message);
      stream.onPartialResponse(sink::next)
          .onRetrieved(contents -> { /* no-op */ })
          .onToolExecuted(exec -> { /* no-op */ })
          .onCompleteResponse(r -> sink.complete())
          .onError(e -> sink.error(e));

      Schedulers.boundedElastic().schedule(() -> {
        try {
          stream.start();
        } catch (Exception e) {
          sink.error(e);
        }
      });
    }).subscribeOn(Schedulers.boundedElastic());
  }
}
