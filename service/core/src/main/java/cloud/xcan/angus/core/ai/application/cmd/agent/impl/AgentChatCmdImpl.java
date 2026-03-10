package cloud.xcan.angus.core.ai.application.cmd.agent.impl;

import cloud.xcan.agentx.core.agent.AgentRegistry;
import cloud.xcan.angus.core.ai.application.cmd.agent.AgentChatCmd;
import cloud.xcan.angus.core.ai.application.query.agent.AgentQuery;
import cloud.xcan.angus.core.ai.domain.agent.Agent;
import cloud.xcan.angus.core.biz.BizTemplate;
import dev.langchain4j.service.TokenStream;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@Service
public class AgentChatCmdImpl implements AgentChatCmd {

  private AgentQuery agentQuery;

  @Resource
  private AgentRegistry agentRegistry;

  @Override
  public String chat(Long agentId, String sessionId, String message) {
    return new BizTemplate<String>() {
      Agent agent;

      @Override
      protected void checkParams() {
        // 验证智能体是否存在
        agent = agentQuery.findAndCheck(agentId);
      }

      @Override
      protected String process() {
        // 智能体对话
        String reply = agentRegistry.chat(String.valueOf(agentId), sessionId, message);

        // 如果会话不存在创建会话

        // 记录会话消息记录

        return reply;
      }
    }.execute();
  }

  @Override
  public SseEmitter chatStream(Long agentId, String sessionId, String message) {
    return new BizTemplate<SseEmitter>() {
      SseEmitter emitter = new SseEmitter(120_000L);
      Agent agent;

      @Override
      protected void checkParams() {
        // 验证智能体是否存在

      }

      @Override
      protected SseEmitter process() {

        new Thread(() -> {
          try {
            TokenStream stream = agentRegistry.chatStream(String.valueOf(agentId), sessionId,
                message);
            stream.onPartialResponse(token -> {
                  try {
                    emitter.send(SseEmitter.event().data(token));

                    // 如果会话不存在创建会话

                    // 记录会话消息记录

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
    }.execute();
  }
}
