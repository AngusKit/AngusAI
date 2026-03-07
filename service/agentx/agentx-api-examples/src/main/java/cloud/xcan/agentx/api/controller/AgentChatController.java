package cloud.xcan.agentx.api.controller;

import cloud.xcan.agentx.api.dto.ApiResponse;
import cloud.xcan.agentx.api.dto.ChatRequest;
import cloud.xcan.agentx.api.dto.ChatResponse;
import cloud.xcan.agentx.core.agent.AgentRegistry;
import dev.langchain4j.service.TokenStream;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
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
@Tag(name = "Agent", description = "Agent 对话 - 同步对话、流式对话")
@RestController
@RequestMapping("/api/v1/agents")
public class AgentChatController {

  private final AgentRegistry agentRegistry;

  public AgentChatController(AgentRegistry agentRegistry) {
    this.agentRegistry = agentRegistry;
  }

  @Operation(operationId = "chat", summary = "同步对话", description = "与指定 Agent 进行同步对话")
  @ApiResponses(value = {
      @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "对话成功"),
      @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "请求参数无效")
  })
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

  @Operation(operationId = "chatStream", summary = "流式对话", description = "与指定 Agent 进行流式对话，返回 SSE 事件流")
  @ApiResponses(value = {
      @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "SSE 流式输出"),
      @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "请求参数无效")
  })
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
