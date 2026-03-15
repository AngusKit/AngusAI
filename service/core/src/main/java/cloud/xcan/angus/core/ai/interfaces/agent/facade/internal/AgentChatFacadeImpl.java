package cloud.xcan.angus.core.ai.interfaces.agent.facade.internal;

import static cloud.xcan.angus.core.ai.interfaces.agent.facade.internal.assembler.AgentChatAssembler.toAgentChatResponseVo;
import static cloud.xcan.angus.spec.utils.ObjectUtils.nullSafe;

import cloud.xcan.angus.core.ai.application.cmd.agent.AgentChatCmd;
import cloud.xcan.angus.core.ai.application.cmd.chat.SessionCmd;
import cloud.xcan.angus.core.ai.domain.chat.Session;
import cloud.xcan.angus.core.ai.domain.chat.SessionConfig;
import cloud.xcan.angus.core.ai.interfaces.agent.facade.AgentChatFacade;
import cloud.xcan.angus.core.ai.interfaces.agent.facade.dto.AgentChatRequestDto;
import cloud.xcan.angus.core.ai.interfaces.agent.facade.vo.AgentChatResponseVo;
import cloud.xcan.angus.core.ai.application.query.chat.SessionQuery;
import cloud.xcan.angus.core.ai.interfaces.chat.openai.OpenAIMessagesConverter;
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
    var ctx = resolveChatContext(dto);
    boolean hasSessionId = dto.getSessionId() != null && !dto.getSessionId().isBlank();
    String message = OpenAIMessagesConverter.toAgentMessage(dto.getMessages(), hasSessionId);
    if (message.isBlank()) {
      throw ProtocolException.of("messages 中必须包含至少一条 user 消息");
    }
    var result = agentChatCmd.chat(ctx.agentId(), ctx.sessionId(), message, dto.getConfig());
    long latencyMs = System.currentTimeMillis() - start;
    return toAgentChatResponseVo(ctx.agentId(), result.getSessionId(), result.getReply(), latencyMs);
  }

  @Override
  public SseEmitter chatStream(AgentChatRequestDto dto) {
    var ctx = resolveChatContext(dto);
    boolean hasSessionId = dto.getSessionId() != null && !dto.getSessionId().isBlank();
    String message = OpenAIMessagesConverter.toAgentMessage(dto.getMessages(), hasSessionId);
    if (message.isBlank()) {
      throw ProtocolException.of("messages 中必须包含至少一条 user 消息");
    }
    return agentChatCmd.chatStream(ctx.agentId(), ctx.sessionId(), message, dto.getConfig());
  }

  /**
   * 根据请求解析对话上下文：有 sessionId 则复用会话，否则按 appId 创建会话
   */
  private record ChatContext(long agentId, String sessionId) {
  }

  private ChatContext resolveChatContext(AgentChatRequestDto dto) {
    if (dto.getSessionId() != null && !dto.getSessionId().isBlank()) {
      Session session = sessionQuery.findAndCheckBySessionId(dto.getSessionId());
      return new ChatContext(session.getAgentId(), session.getSessionId());
    }
    Session session = new Session();
    session.setAppId(dto.getAppId());
    session.setModelId(dto.getModelId());
    session.setAgentId(dto.getAgentId());
    session.setConfig(nullSafe(dto.getConfig(), new SessionConfig()));
    Session created = sessionCmd.create(session);
    return new ChatContext(created.getAgentId(), created.getSessionId());
  }
}
