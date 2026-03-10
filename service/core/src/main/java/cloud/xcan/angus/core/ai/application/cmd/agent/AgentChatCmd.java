package cloud.xcan.angus.core.ai.application.cmd.agent;

import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

public interface AgentChatCmd {

  String chat(Long agentId, String sessionId, String message);

  SseEmitter chatStream(Long agentId, String sessionId, String message);

}
