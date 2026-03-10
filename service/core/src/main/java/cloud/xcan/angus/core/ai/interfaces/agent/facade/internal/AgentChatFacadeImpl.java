package cloud.xcan.angus.core.ai.interfaces.agent.facade.internal;

import cloud.xcan.agentx.core.agent.AgentRegistry;
import cloud.xcan.angus.core.ai.application.cmd.agent.AgentChatCmd;
import cloud.xcan.angus.core.ai.interfaces.agent.facade.AgentChatFacade;
import cloud.xcan.angus.core.ai.interfaces.agent.facade.dto.AgentChatRequestDto;
import cloud.xcan.angus.core.ai.interfaces.agent.facade.vo.AgentChatResponseVo;
import dev.langchain4j.service.TokenStream;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@Component
public class AgentChatFacadeImpl implements AgentChatFacade {

  @Resource
  private AgentRegistry agentRegistry;

  @Resource
  private AgentChatCmd agentChatCmd;

  @Override
  public AgentChatResponseVo chat(AgentChatRequestDto dto) {
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
    return vo;
  }

  @Override
  public SseEmitter chatStream(AgentChatRequestDto dto) {
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
