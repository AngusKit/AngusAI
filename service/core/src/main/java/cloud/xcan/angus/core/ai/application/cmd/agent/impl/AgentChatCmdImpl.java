package cloud.xcan.angus.core.ai.application.cmd.agent.impl;

import static cloud.xcan.angus.core.ai.domain.Constants.AGENT_CHAT_SSE_TIMEOUT_MS;

import cloud.xcan.agentx.core.agent.AgentRegistry;
import cloud.xcan.angus.core.ai.application.cmd.agent.AgentChatCmd;
import cloud.xcan.angus.core.ai.application.cmd.chat.MessageCmd;
import cloud.xcan.angus.core.ai.application.cmd.chat.SessionCmd;
import cloud.xcan.angus.core.ai.application.query.agent.AgentQuery;
import cloud.xcan.angus.core.ai.domain.chat.MessageRole;
import cloud.xcan.angus.core.biz.BizTemplate;
import dev.langchain4j.service.TokenStream;
import jakarta.annotation.Resource;
import java.util.concurrent.Executor;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@Service
public class AgentChatCmdImpl implements AgentChatCmd {

  @Resource
  private AgentQuery agentQuery;

  @Resource
  private AgentRegistry agentRegistry;

  @Resource
  private SessionCmd sessionCmd;

  @Resource
  private MessageCmd messageCmd;    

  @Resource
  @Qualifier("sseEmitterChatExecutor")
  private Executor sseEmitterChatExecutor;

  @Override
  public String chat(Long agentId, String sessionId, String message) {
    return new BizTemplate<String>() {
      @Override
      protected void checkParams() {
        agentQuery.findAndCheck(agentId);
      }

      @Override
      protected String process() {
        // 1. TODO 创建用户消息
        Long userMessageId = messageCmd.create(sessionId, MessageRole.USER, message);
        // 2. 发送消息
        String reply = agentRegistry.chat(String.valueOf(agentId), sessionId, message);
        // 3. TODO 创建助手消息
        Long assistantMessageId = messageCmd.create(sessionId, MessageRole.ASSISTANT, reply);
        return reply;
      }
    }.execute();
  }

  @Override
  public SseEmitter chatStream(Long agentId, String sessionId, String message, Long timeoutMs) {

    return new BizTemplate<SseEmitter>() {
      long effectiveTimeout = timeoutMs != null && timeoutMs > 0 ? timeoutMs : AGENT_CHAT_SSE_TIMEOUT_MS;
      SseEmitter emitter = new SseEmitter(effectiveTimeout);

      @Override
      protected void checkParams() {
        agentQuery.findAndCheck(agentId);
      }

      @Override
      protected SseEmitter process() {
        sseEmitterChatExecutor.execute(() -> {
          try {
            TokenStream stream =
                agentRegistry.chatStream(String.valueOf(agentId), sessionId, message);
            stream.onPartialResponse(token -> {
                  try {
                    // 1. TODO 创建用户消息
                    Long userMessageId = messageCmd.create(sessionId, MessageRole.USER, message);
                    // 2. TODO 发送消息
                    emitter.send(SseEmitter.event().data(token));
                    // 3. TODO 创建助手消息
                    Long assistantMessageId = messageCmd.create(sessionId, MessageRole.ASSISTANT, reply);
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
        });

        return emitter;
      }
    }.execute();
  }
}
