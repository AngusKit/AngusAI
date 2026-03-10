package cloud.xcan.angus.core.ai.interfaces.agent;

import cloud.xcan.angus.core.ai.interfaces.agent.facade.AgentChatFacade;
import cloud.xcan.angus.core.ai.interfaces.agent.facade.AgentFacade;
import cloud.xcan.angus.core.ai.interfaces.agent.facade.dto.AgentChatRequestDto;
import cloud.xcan.angus.core.ai.interfaces.agent.facade.vo.AgentChatResponseVo;
import cloud.xcan.angus.remote.ApiLocaleResult;
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

@Tag(name = "AgentChat", description = "智能体对话 - 与指定智能体进行同步或流式对话")
@Validated
@RestController
@RequestMapping("/api/v1/agents")
public class AgentChatRest {

  @Resource
  private AgentChatFacade agentChatFacade;

  @Operation(operationId = "agentChat", summary = "同步对话", description = "与指定智能体进行同步对话")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "对话成功"),
      @ApiResponse(responseCode = "400", description = "请求参数无效"),
      @ApiResponse(responseCode = "404", description = "智能体不存在或未发布")
  })
  @ResponseStatus(HttpStatus.OK)
  @PostMapping("/chat")
  public ApiLocaleResult<AgentChatResponseVo> chat(@Valid @RequestBody AgentChatRequestDto dto) {
    return ApiLocaleResult.success(agentChatFacade.chat(dto));
  }

  @Operation(operationId = "agentChatStream", summary = "流式对话", description = "与指定智能体进行流式对话，返回 SSE 事件流")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "SSE 流式输出"),
      @ApiResponse(responseCode = "400", description = "请求参数无效"),
      @ApiResponse(responseCode = "404", description = "智能体不存在或未发布")
  })
  @PostMapping(value = "/chat/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
  public SseEmitter chatStream(@Valid @RequestBody AgentChatRequestDto dto) {
    return agentChatFacade.chatStream(dto);
  }
}
