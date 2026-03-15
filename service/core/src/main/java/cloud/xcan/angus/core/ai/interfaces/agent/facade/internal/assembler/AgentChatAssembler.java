package cloud.xcan.angus.core.ai.interfaces.agent.facade.internal.assembler;

import cloud.xcan.angus.core.ai.interfaces.agent.facade.vo.AgentChatResponseVo;
import org.jetbrains.annotations.NotNull;

public class AgentChatAssembler {

  public static @NotNull AgentChatResponseVo toAgentChatResponseVo(Long agentId,
      String sessionId, String reply, long latencyMs) {
    AgentChatResponseVo vo = new AgentChatResponseVo();
    vo.setAgentId(agentId);
    vo.setSessionId(sessionId);
    vo.setReply(reply);
    vo.setLatencyMs(latencyMs);
    return vo;
  }

}
