package cloud.xcan.angus.core.ai.interfaces.chat;

import cloud.xcan.angus.core.ai.interfaces.chat.facade.OpenAIChatFacade;
import cloud.xcan.angus.core.ai.interfaces.chat.openai.OpenAIChatCompletionsRequest;
import cloud.xcan.angus.core.ai.interfaces.chat.openai.OpenAIChatCompletionsResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.annotation.Resource;
import jakarta.validation.Valid;
import org.springframework.http.MediaType;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

/**
 * OpenAI Chat Completions 兼容接口 遵循 OpenAI API 标准，支持 SDK/第三方集成
 *
 * @see <a href="https://platform.openai.com/docs/api-reference/chat/create">OpenAI API
 * Reference</a>
 */
@Tag(name = "OpenAIChat", description = "OpenAI Chat Completions 兼容接口 - 支持 OpenAI SDK 及第三方集成")
@Validated
@RestController
@RequestMapping(value = {"/api/v1", "/v1"})
public class OpenAIChatRest {

  @Resource
  private OpenAIChatFacade openAIChatFacade;

  /**
   * 通用 Chat Completions（必须传 model） POST /api/v1/chat/completions 根据 request.stream 及 Accept 头返回同步
   * JSON 或 SSE 流
   */
  @Operation(operationId = "openaiChatCompletions", summary = "Chat Completions",
      description = "OpenAI 标准对话接口，model 必填，支持 agent_123 或 123 指定智能体")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "成功"),
      @ApiResponse(responseCode = "400", description = "请求参数无效")
  })
  @PostMapping(value = "/chat/completions", produces = {MediaType.APPLICATION_JSON_VALUE,
      MediaType.TEXT_EVENT_STREAM_VALUE})
  public Object chatCompletions(
      @Valid @RequestBody OpenAIChatCompletionsRequest request,
      @RequestHeader(value = "X-Session-Id", required = false) String sessionId,
      @RequestHeader(value = "Accept", required = false) String accept) {
    boolean wantStream = Boolean.TRUE.equals(request.getStream())
        || (accept != null && accept.contains("text/event-stream"));
    if (wantStream) {
      return openAIChatFacade.chatCompletionsStream(request, sessionId);
    }
    return openAIChatFacade.chatCompletions(request, sessionId);
  }

  /**
   * 应用入口 Chat Completions（model 可选） POST /api/v1/applications/{appId}/chat/completions
   */
  @Operation(operationId = "openaiChatCompletionsByApp", summary = "应用入口 Chat Completions",
      description = "按应用默认智能体对话，model 可选")
  @PostMapping(value = "/applications/{appId}/chat/completions", produces = MediaType.APPLICATION_JSON_VALUE)
  public OpenAIChatCompletionsResponse chatCompletionsByApp(
      @Parameter(description = "应用ID") @PathVariable Long appId,
      @Valid @RequestBody OpenAIChatCompletionsRequest request,
      @RequestHeader(value = "X-Session-Id", required = false) String sessionId) {
    if (Boolean.TRUE.equals(request.getStream())) {
      throw new UnsupportedOperationException("流式请求请使用 Accept: text/event-stream");
    }
    return openAIChatFacade.chatCompletionsByApp(appId, request, sessionId);
  }

  /**
   * 应用入口 Chat Completions 流式
   */
  @PostMapping(value = "/applications/{appId}/chat/completions", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
  public SseEmitter chatCompletionsStreamByApp(
      @PathVariable Long appId,
      @Valid @RequestBody OpenAIChatCompletionsRequest request,
      @RequestHeader(value = "X-Session-Id", required = false) String sessionId) {
    return openAIChatFacade.chatCompletionsStreamByApp(appId, request, sessionId);
  }

  /**
   * 智能体直连 Chat Completions（等价于 model=agent_{agentId}） POST
   * /api/v1/agents/{agentId}/chat/completions
   */
  @Operation(operationId = "openaiChatCompletionsByAgent", summary = "智能体直连 Chat Completions")
  @PostMapping(value = "/agents/{agentId}/chat/completions", produces = MediaType.APPLICATION_JSON_VALUE)
  public OpenAIChatCompletionsResponse chatCompletionsByAgent(
      @Parameter(description = "智能体ID") @PathVariable Long agentId,
      @Valid @RequestBody OpenAIChatCompletionsRequest request,
      @RequestHeader(value = "X-Session-Id", required = false) String sessionId) {
    if (Boolean.TRUE.equals(request.getStream())) {
      throw new UnsupportedOperationException("流式请求请使用 Accept: text/event-stream");
    }
    return openAIChatFacade.chatCompletionsByAgent(agentId, request, sessionId);
  }

  /**
   * 智能体直连 Chat Completions 流式
   */
  @PostMapping(value = "/agents/{agentId}/chat/completions", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
  public SseEmitter chatCompletionsStreamByAgent(
      @PathVariable Long agentId,
      @Valid @RequestBody OpenAIChatCompletionsRequest request,
      @RequestHeader(value = "X-Session-Id", required = false) String sessionId) {
    return openAIChatFacade.chatCompletionsStreamByAgent(agentId, request, sessionId);
  }
}
