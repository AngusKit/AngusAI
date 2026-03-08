package cloud.xcan.angus.core.ai.interfaces.agent;

import cloud.xcan.agentx.core.agent.AgentRegistry;
import cloud.xcan.angus.core.ai.interfaces.agent.facade.dto.AgentChatRequestDto;
import cloud.xcan.angus.core.ai.interfaces.agent.facade.vo.AgentChatResponseVo;
import cloud.xcan.angus.remote.ApiLocaleResult;
import dev.langchain4j.service.TokenStream;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.annotation.Resource;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

/**
 * 智能体对话 API — 同步对话、流式对话
 */
@Tag(name = "AgentChat", description = "智能体对话 - 与指定智能体进行同步或流式对话")
@Validated
@RestController
@RequestMapping("/api/v1/agents")
public class AgentChatRest {

  @Resource
  private AgentRegistry agentRegistry;

  @Operation(operationId = "agentChat", summary = "同步对话", description = "与指定智能体进行同步对话")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "对话成功"),
      @ApiResponse(responseCode = "400", description = "请求参数无效"),
      @ApiResponse(responseCode = "404", description = "智能体不存在或未发布")
  })
  @ResponseStatus(HttpStatus.OK)
  @PostMapping("/chat")
  public ApiLocaleResult<AgentChatResponseVo> chat(@Valid @RequestBody AgentChatRequestDto dto) {
    long start = System.currentTimeMillis();
    String agentIdStr = String.valueOf(dto.getAgentId());
    String sessionId = dto.getSessionId() != null ? dto.getSessionId() : "default";
    String reply = agentRegistry.chat(agentIdStr, sessionId, dto.getMessage());
    long latencyMs = System.currentTimeMillis() - start;

    AgentChatResponseVo vo = new AgentChatResponseVo();
    vo.setAgentId(dto.getAgentId());
    vo.setSessionId(sessionId);
    vo.setReply(reply);
    vo.setLatencyMs(latencyMs);
    return ApiLocaleResult.success(vo);
  }

  @Operation(operationId = "agentChatStream", summary = "流式对话", description = "与指定智能体进行流式对话，返回 SSE 事件流")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "SSE 流式输出"),
      @ApiResponse(responseCode = "400", description = "请求参数无效"),
      @ApiResponse(responseCode = "404", description = "智能体不存在或未发布")
  })
  @PostMapping(value = "/chat/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
  public SseEmitter chatStream(@Valid @RequestBody AgentChatRequestDto dto) {
    String agentIdStr = String.valueOf(dto.getAgentId());
    String sessionId = dto.getSessionId() != null ? dto.getSessionId() : "default";
    String message = dto.getMessage();

    SseEmitter emitter = new SseEmitter(120_000L);

    new Thread(() -> {
      try {
        TokenStream stream = agentRegistry.chatStream(agentIdStr, sessionId, message);
        stream.onPartialResponse(token -> {
              try {
                emitter.send(SseEmitter.event().data(token));
              } catch (Exception e) {
                emitter.completeWithError(e);
              }
            })
            .onCompleteResponse(r -> emitter.complete())
            .onError(emitter::completeWithError);
        stream.start();
      } catch (Exception e) {
        emitter.completeWithError(e);
      }
    }).start();

    return emitter;
  }
}
