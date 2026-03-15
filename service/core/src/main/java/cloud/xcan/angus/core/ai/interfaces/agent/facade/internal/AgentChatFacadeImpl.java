package cloud.xcan.angus.core.ai.interfaces.agent.facade.internal;

import static cloud.xcan.angus.core.ai.interfaces.agent.facade.internal.assembler.AgentChatAssembler.toAgentChatResponseVo;
import static cloud.xcan.angus.spec.utils.ObjectUtils.nullSafe;

import cloud.xcan.angus.core.ai.application.cmd.agent.AgentChatCmd;
import cloud.xcan.angus.core.ai.application.cmd.chat.SessionCmd;
import cloud.xcan.angus.core.ai.application.query.chat.SessionQuery;
import cloud.xcan.angus.core.ai.domain.chat.Session;
import cloud.xcan.angus.core.ai.domain.chat.SessionConfig;
import cloud.xcan.angus.core.ai.interfaces.agent.facade.AgentChatFacade;
import cloud.xcan.angus.core.ai.interfaces.agent.facade.dto.AgentChatRequestDto;
import cloud.xcan.angus.core.ai.interfaces.agent.facade.vo.AgentChatResponseVo;
import cloud.xcan.angus.core.ai.domain.chat.openai.OpenAIMessagesConverter;
import cloud.xcan.angus.remote.message.ProtocolException;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@Component
public class AgentChatFacadeImpl implements AgentChatFacade {

  @Resource
  private AgentChatCmd agentChatCmd;

  @Resource
  private SessionCmd sessionCmd;

  @Resource
  private SessionQuery sessionQuery;

  @Override
  public AgentChatResponseVo chat(AgentChatRequestDto dto) {
    long start = System.currentTimeMillis();
    var session = resolveChatSession(dto);
    boolean hasSessionId = dto.getSessionId() != null && !dto.getSessionId().isBlank();
    String message = OpenAIMessagesConverter.toAgentMessage(dto.getMessages(), hasSessionId);
    if (message.isBlank()) {
      throw ProtocolException.of("messages 中必须包含至少一条 user 消息");
    }
    var result = agentChatCmd.chat(session, message, dto.getConfig());
    long latencyMs = System.currentTimeMillis() - start;
    return toAgentChatResponseVo(session.getAgentId(), result.getSessionId(),
        result.getReply(), latencyMs);
  }

  @Override
  public SseEmitter chatStream(AgentChatRequestDto dto) {
    var session = resolveChatSession(dto);
    boolean hasSessionId = dto.getSessionId() != null && !dto.getSessionId().isBlank();
    String message = OpenAIMessagesConverter.toAgentMessage(dto.getMessages(), hasSessionId);
    if (message.isBlank()) {
      throw ProtocolException.of("messages 中必须包含至少一条 user 消息");
    }
    return agentChatCmd.chatStream(session, message, dto.getConfig());
  }

  private Session resolveChatSession(AgentChatRequestDto dto) {
    if (dto.getSessionId() != null && !dto.getSessionId().isBlank()) {
      return sessionQuery.findAndCheckBySessionId(dto.getSessionId());
    }
    Session session = new Session();
    session.setAppId(dto.getAppId());
    session.setModelId(dto.getModelId());
    session.setAgentId(dto.getAgentId());
    session.setConfig(nullSafe(dto.getConfig(), new SessionConfig()));
    return sessionCmd.create(session);
  }
}
