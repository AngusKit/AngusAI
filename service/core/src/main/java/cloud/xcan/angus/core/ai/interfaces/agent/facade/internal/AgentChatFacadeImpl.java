package cloud.xcan.angus.core.ai.interfaces.agent.facade.internal;

import static cloud.xcan.angus.core.ai.interfaces.agent.facade.internal.assembler.AgentChatAssembler.toAgentChatResponseVo;

import cloud.xcan.angus.core.ai.application.cmd.agent.AgentChatCmd;
import cloud.xcan.angus.core.ai.interfaces.agent.facade.AgentChatFacade;
import cloud.xcan.angus.core.ai.interfaces.agent.facade.dto.AgentChatRequestDto;
import cloud.xcan.angus.core.ai.interfaces.agent.facade.vo.AgentChatResponseVo;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@Component
public class AgentChatFacadeImpl implements AgentChatFacade {

  @Resource
  private AgentChatCmd agentChatCmd;

  @Override
  public AgentChatResponseVo chat(AgentChatRequestDto dto) {
    long start = System.currentTimeMillis();
    var result = agentChatCmd.chat(
        dto.getAgentId(), dto.getSessionId(), dto.getMessage(), dto.getConfig());
    long latencyMs = System.currentTimeMillis() - start;
    return toAgentChatResponseVo(dto, result.getSessionId(), result.getReply(), latencyMs);
  }

  @Override
  public SseEmitter chatStream(AgentChatRequestDto dto) {
    return agentChatCmd.chatStream(
        dto.getAgentId(), dto.getSessionId(), dto.getMessage(), dto.getTimeoutMs(),
        dto.getConfig());
  }
}
