package cloud.xcan.angus.core.ai.interfaces.agent.facade.internal;

import static cloud.xcan.angus.core.ai.interfaces.agent.facade.internal.assembler.AgentChatAssembler.toAgentChatResponseVo;

import cloud.xcan.angus.core.ai.application.cmd.agent.AgentChatCmd;
import cloud.xcan.angus.core.ai.interfaces.agent.facade.AgentChatFacade;
import cloud.xcan.angus.core.ai.interfaces.agent.facade.dto.AgentChatRequestDto;
import cloud.xcan.angus.core.ai.interfaces.agent.facade.vo.AgentChatResponseVo;
import jakarta.annotation.Resource;
import java.util.UUID;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@Component
public class AgentChatFacadeImpl implements AgentChatFacade {

  @Resource
  private AgentChatCmd agentChatCmd;

  @Override
  public AgentChatResponseVo chat(AgentChatRequestDto dto) {
    long start = System.currentTimeMillis();
    String sessionId = dto.getSessionId() != null
        ? dto.getSessionId() : UUID.randomUUID().toString();
    String reply = agentChatCmd.chat(dto.getAgentId(), sessionId, dto.getMessage());
    long latencyMs = System.currentTimeMillis() - start;
    return toAgentChatResponseVo(dto, sessionId, reply, latencyMs);
  }

  @Override
  public SseEmitter chatStream(AgentChatRequestDto dto) {
    String sessionId = dto.getSessionId() != null
        ? dto.getSessionId() : UUID.randomUUID().toString();
    return agentChatCmd.chatStream(dto.getAgentId(), sessionId, dto.getMessage());
  }
}
