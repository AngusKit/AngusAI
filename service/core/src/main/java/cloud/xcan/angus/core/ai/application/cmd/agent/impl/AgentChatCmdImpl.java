package cloud.xcan.angus.core.ai.application.cmd.agent.impl;

import static cloud.xcan.angus.core.ai.domain.Constants.AGENT_CHAT_SSE_TIMEOUT_MS;

import cloud.xcan.agentx.core.agent.AgentRegistry;
import cloud.xcan.angus.core.ai.application.cmd.agent.AgentChatCmd;
import cloud.xcan.angus.core.ai.application.cmd.agent.AgentChatResult;
import cloud.xcan.angus.core.ai.application.cmd.chat.MessageCmd;
import cloud.xcan.angus.core.ai.application.cmd.chat.SessionCmd;
import cloud.xcan.angus.core.ai.application.query.agent.AgentQuery;
import cloud.xcan.angus.core.ai.application.query.chat.MessageQuery;
import cloud.xcan.angus.core.ai.application.query.chat.SessionQuery;
import cloud.xcan.angus.core.ai.domain.agent.Agent;
import cloud.xcan.angus.core.ai.domain.chat.MessageRole;
import cloud.xcan.angus.core.ai.domain.chat.Session;
import cloud.xcan.angus.core.biz.BizTemplate;
import dev.langchain4j.service.TokenStream;
import jakarta.annotation.Resource;
import java.util.concurrent.Executor;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

/**
 * 智能体对话命令实现
 * <p>
 * 对话、Session、Message 统一使用 sessionId(UUID) 关联；入参 sessionId 为空时业务层初始化 Session。
 * </p>
 */
@Service
public class AgentChatCmdImpl implements AgentChatCmd {

  /** 流式助手消息占位内容，用于满足 MessageCmd 非空校验，最终由 updateContent 覆盖 */
  private static final String STREAMING_PLACEHOLDER = ".";

  @Resource
  private AgentQuery agentQuery;

  @Resource
  private AgentRegistry agentRegistry;

  @Resource
  private MessageCmd messageCmd;

  @Resource
  private MessageQuery messageQuery;

  @Resource
  private SessionQuery sessionQuery;

  @Resource
  private SessionCmd sessionCmd;

  @Resource
  @Qualifier("sseEmitterChatExecutor")
  private Executor sseEmitterChatExecutor;

  @Override
  public AgentChatResult chat(Long agentId, String sessionId, String message) {
    return new BizTemplate<AgentChatResult>() {
      Agent agent;
      Session session;
      String effectiveSessionId;

      @Override
      protected void checkParams() {
        agent = agentQuery.findAndCheck(agentId);
        session = sessionCmd.createOrGetForAgentChat(agent, sessionId);
        effectiveSessionId = session != null
            ? session.getSessionId()
            : (sessionId != null && !sessionId.isBlank() ? sessionId : java.util.UUID.randomUUID().toString());
      }

      @Override
      protected AgentChatResult process() {
        if (session != null) {
          messageCmd.create(effectiveSessionId, MessageRole.USER, message);
        }
        String reply = agentRegistry.chat(String.valueOf(agentId), effectiveSessionId, message);
        if (session != null) {
          messageCmd.create(effectiveSessionId, MessageRole.ASSISTANT, reply);
        }
        return new AgentChatResult(reply, effectiveSessionId);
      }
    }.execute();
  }

  @Override
  public SseEmitter chatStream(Long agentId, String sessionId, String message, Long timeoutMs) {
    long effectiveTimeout = timeoutMs != null && timeoutMs > 0 ? timeoutMs : AGENT_CHAT_SSE_TIMEOUT_MS;

    return new BizTemplate<SseEmitter>() {
      SseEmitter emitter = new SseEmitter(effectiveTimeout);
      Long assistantMessageId = null;
      Agent agent;
      Session session;
      String effectiveSessionId;

      @Override
      protected void checkParams() {
        agent = agentQuery.findAndCheck(agentId);
        session = sessionCmd.createOrGetForAgentChat(agent, sessionId);
        effectiveSessionId = session != null
            ? session.getSessionId()
            : (sessionId != null && !sessionId.isBlank() ? sessionId : java.util.UUID.randomUUID().toString());
      }

      @Override
      protected SseEmitter process() {
        if (session != null) {
          messageCmd.create(effectiveSessionId, MessageRole.USER, message);
          assistantMessageId = messageCmd.create(effectiveSessionId, MessageRole.ASSISTANT,
              STREAMING_PLACEHOLDER);
          messageCmd.setStreaming(assistantMessageId, true);
        }

        sseEmitterChatExecutor.execute(() -> {
          StringBuilder fullContent = new StringBuilder();
          try {
            TokenStream stream =
                agentRegistry.chatStream(String.valueOf(agentId), effectiveSessionId, message);
            stream.onPartialResponse(token -> {
                  fullContent.append(token);
                  try {
                    emitter.send(SseEmitter.event().data(token));
                  } catch (Exception e) {
                    emitter.completeWithError(e);
                  }
                })
                .onCompleteResponse(r -> {
                  if (assistantMessageId != null) {
                    messageQuery.updateContent(assistantMessageId, fullContent.toString());
                    messageCmd.setStreaming(assistantMessageId, false);
                  }
                  emitter.complete();
                })
                .onError(e -> {
                  if (assistantMessageId != null) {
                    messageCmd.setStreaming(assistantMessageId, false);
                  }
                  emitter.completeWithError(e);
                });
            stream.start();
          } catch (Exception e) {
            if (assistantMessageId != null) {
              messageCmd.setStreaming(assistantMessageId, false);
            }
            emitter.completeWithError(e);
          }
        });

        return emitter;
      }
    }.execute();
  }
}
