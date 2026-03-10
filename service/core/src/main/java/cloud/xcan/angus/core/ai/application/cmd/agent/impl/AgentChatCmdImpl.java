package cloud.xcan.angus.core.ai.application.cmd.agent.impl;

import cloud.xcan.agentx.core.agent.AgentRegistry;
import cloud.xcan.angus.core.ai.application.cmd.agent.AgentChatCmd;
import cloud.xcan.angus.core.biz.BizTemplate;
import dev.langchain4j.service.TokenStream;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@Service
public class AgentChatCmdImpl implements AgentChatCmd {

  @Resource
  private AgentRegistry agentRegistry;

  @Override
  public String chat(Long agentId, String sessionId, String message) {
    return new BizTemplate<String>() {
      @Override
      protected String process() {
        return agentRegistry.chat(String.valueOf(agentId), sessionId, message);
      }
    }.execute();
  }

  @Override
  public SseEmitter chatStream(Long agentId, String sessionId, String message) {
    return new BizTemplate<SseEmitter>() {
      @Override
      protected SseEmitter process() {
        SseEmitter emitter = new SseEmitter(120_000L);

        new Thread(() -> {
          try {
            TokenStream stream = agentRegistry.chatStream(String.valueOf(agentId), sessionId, message);
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
    }.execute();
  }
}
