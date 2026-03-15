package cloud.xcan.angus.core.ai.interfaces.chat.facade.internal;

import static cloud.xcan.angus.core.utils.GsonUtils.toJson;

import cloud.xcan.agentx.core.agent.AgentRegistry;
import cloud.xcan.angus.core.ai.application.query.agent.AgentQuery;
import cloud.xcan.angus.core.ai.application.query.application.ApplicationQuery;
import cloud.xcan.angus.core.ai.domain.agent.Agent;
import cloud.xcan.angus.core.ai.domain.chat.openai.OpenAIChatCompletionChunk;
import cloud.xcan.angus.core.ai.domain.chat.openai.OpenAIChatCompletionsRequest;
import cloud.xcan.angus.core.ai.domain.chat.openai.OpenAIChatCompletionsResponse;
import cloud.xcan.angus.core.ai.domain.chat.openai.OpenAIMessagesConverter;
import cloud.xcan.angus.core.ai.interfaces.chat.facade.OpenAIChatFacade;
import cloud.xcan.angus.remote.message.ProtocolException;
import dev.langchain4j.service.TokenStream;
import jakarta.annotation.Resource;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.Executor;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

/**
 * OpenAI Chat Completions 兼容实现 解析 model → Agent，调用 AgentRegistry.chat/chatStream，组装 OpenAI 格式响应
 */
@Component
public class OpenAIChatFacadeImpl implements OpenAIChatFacade {

  @Resource
  private AgentRegistry agentRegistry;

  @Resource
  private AgentQuery agentQuery;

  @Resource
  private ApplicationQuery applicationQuery;

  /**
   * 流式 SSE 专用线程池
   */
  @Resource
  @Qualifier("sseEmitterChatExecutor")
  private Executor sseEmitterChatExecutor;

  @Override
  public OpenAIChatCompletionsResponse chatCompletions(
      OpenAIChatCompletionsRequest request, String sessionId) {
    return doChatCompletions(request, sessionId, null, null);
  }

  @Override
  public SseEmitter chatCompletionsStream(
      OpenAIChatCompletionsRequest request, String sessionId) {
    return doChatCompletionsStream(request, sessionId, null, null);
  }

  @Override
  public OpenAIChatCompletionsResponse chatCompletionsByApp(
      Long appId, OpenAIChatCompletionsRequest request, String sessionId) {
    return doChatCompletions(request, sessionId, appId, null);
  }

  @Override
  public SseEmitter chatCompletionsStreamByApp(
      Long appId, OpenAIChatCompletionsRequest request, String sessionId) {
    return doChatCompletionsStream(request, sessionId, appId, null);
  }

  @Override
  public OpenAIChatCompletionsResponse chatCompletionsByAgent(
      Long agentId, OpenAIChatCompletionsRequest request, String sessionId) {
    return doChatCompletions(request, sessionId, null, agentId);
  }

  @Override
  public SseEmitter chatCompletionsStreamByAgent(
      Long agentId, OpenAIChatCompletionsRequest request, String sessionId) {
    return doChatCompletionsStream(request, sessionId, null, agentId);
  }

  private OpenAIChatCompletionsResponse doChatCompletions(
      OpenAIChatCompletionsRequest request, String sessionId, Long appId, Long agentId) {
    Agent resolvedAgent = resolveAgent(request.getModel(), appId, agentId);
    boolean hasSession = sessionId != null && !sessionId.isBlank();
    String effectiveSessionId = hasSession ? sessionId : "angusai-" + UUID.randomUUID();

    String message = OpenAIMessagesConverter.toAgentMessage(request.getMessages(), hasSession);
    if (message.isBlank()) {
      throw ProtocolException.of("messages 中必须包含至少一条 user 消息");
    }
    return chatSync(String.valueOf(resolvedAgent.getId()), effectiveSessionId,
        message, resolvedAgent.getEncoding());
  }

  private SseEmitter doChatCompletionsStream(
      OpenAIChatCompletionsRequest request, String sessionId, Long appId, Long agentId) {
    Agent resolveAgent = resolveAgent(request.getModel(), appId, agentId);
    boolean hasSession = sessionId != null && !sessionId.isBlank();
    String effectiveSessionId = hasSession ? sessionId : "openai-" + UUID.randomUUID();

    String message = OpenAIMessagesConverter.toAgentMessage(request.getMessages(), hasSession);
    if (message.isBlank()) {
      throw ProtocolException.of("messages 中必须包含至少一条 user 消息");
    }
    return chatStream(String.valueOf(resolveAgent.getId()), effectiveSessionId,
        message, resolveAgent.getEncoding());
  }

  private OpenAIChatCompletionsResponse chatSync(
      String agentId, String sessionId, String message, String model) {
    String reply = agentRegistry.chat(agentId, sessionId, message);
    return OpenAIChatCompletionsResponse.builder()
        .id("chatcmpl-" + UUID.randomUUID().toString().replace("-", "").substring(0, 24))
        .object("chat.completion")
        .created(System.currentTimeMillis() / 1000)
        .model(model)
        .choices(List.of(
            new OpenAIChatCompletionsResponse.Choice(
                0,
                new OpenAIChatCompletionsResponse.Message("assistant", reply),
                null,
                "stop"
            )))
        .usage(estimateUsage(message, reply))
        .build();
  }

  private SseEmitter chatStream(String agentId, String sessionId, String message, String model) {
    SseEmitter emitter = new SseEmitter(120_000L);

    sseEmitterChatExecutor.execute(() -> {
      try {
        TokenStream stream = agentRegistry.chatStream(agentId, sessionId, message);

        stream.onPartialResponse(token -> {
              try {
                OpenAIChatCompletionChunk chunk = OpenAIChatCompletionChunk.builder()
                    .id("chatcmpl-stream")
                    .sessionId(sessionId)
                    .object("chat.completion.chunk")
                    .created(System.currentTimeMillis() / 1000)
                    .model(model)
                    .choices(
                        List.of(new OpenAIChatCompletionChunk.ChunkChoice(
                            0,
                            new OpenAIChatCompletionsResponse.Delta(null, token),
                            null
                        )))
                    .build();
                emitter.send(SseEmitter.event().data("data: " + toJson(chunk) + "\n\n"));
              } catch (Exception e) {
                emitter.completeWithError(e);
              }
            })
            .onCompleteResponse(r -> {
              try {
                emitter.send(SseEmitter.event().data("data: [DONE]\n\n"));
                emitter.complete();
              } catch (Exception e) {
                emitter.completeWithError(e);
              }
            })
            .onError(emitter::completeWithError);
        stream.start();
      } catch (Exception e) {
        emitter.completeWithError(e);
      }
    });
    return emitter;
  }

  private OpenAIChatCompletionsResponse.Usage estimateUsage(String prompt, String completion) {
    int promptTokens = estimateTokens(prompt);
    int completionTokens = estimateTokens(completion);
    return new OpenAIChatCompletionsResponse.Usage(
        promptTokens,
        completionTokens,
        promptTokens + completionTokens
    );
  }

  private Agent resolveAgent(String model, Long appId, Long agentId) {
    if (agentId != null) {
      return agentQuery.findAndCheck(agentId);
    }
    if (appId != null) {
      Long defaultAgentId = applicationQuery.getDefaultAgentId(appId);
      if (defaultAgentId == null) {
        throw ProtocolException.of("应用未绑定智能体，请先配置应用");
      }
      return agentQuery.findAndCheck(defaultAgentId);
    }
    if (model == null || model.isBlank()) {
      throw ProtocolException.of("model 参数必填");
    }
    return agentQuery.findAndCheck(model);
  }

  private int estimateTokens(String text) {
    if (text == null || text.isEmpty()) {
      return 0;
    }
    return text.length() / 2;
  }
}
