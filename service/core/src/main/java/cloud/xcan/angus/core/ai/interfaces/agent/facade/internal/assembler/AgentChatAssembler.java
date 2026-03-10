package cloud.xcan.angus.core.ai.interfaces.agent.facade.internal.assembler;

import cloud.xcan.angus.core.ai.interfaces.agent.facade.dto.AgentChatRequestDto;
import cloud.xcan.angus.core.ai.interfaces.agent.facade.vo.AgentChatResponseVo;
import org.jetbrains.annotations.NotNull;

public class AgentChatAssembler {

  public static @NotNull AgentChatResponseVo toAgentChatResponseVo(AgentChatRequestDto dto,
      String sessionId, String reply, long latencyMs) {
    AgentChatResponseVo vo = new AgentChatResponseVo();
    vo.setAgentId(dto.getAgentId());
    vo.setSessionId(sessionId);
    vo.setReply(reply);
    vo.setLatencyMs(latencyMs);
    return vo;
  }

}
