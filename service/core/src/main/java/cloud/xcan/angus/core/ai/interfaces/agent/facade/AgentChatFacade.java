package cloud.xcan.angus.core.ai.interfaces.agent.facade;

import cloud.xcan.angus.core.ai.interfaces.agent.facade.dto.AgentChatRequestDto;
import cloud.xcan.angus.core.ai.interfaces.agent.facade.vo.AgentChatResponseVo;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

public interface AgentChatFacade {

  AgentChatResponseVo chat(AgentChatRequestDto dto);

  SseEmitter chatStream(AgentChatRequestDto dto);
}
