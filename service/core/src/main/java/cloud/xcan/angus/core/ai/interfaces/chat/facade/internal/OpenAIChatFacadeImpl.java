package cloud.xcan.angus.core.ai.interfaces.chat.facade.internal;

import cloud.xcan.agentx.core.agent.AgentRegistry;
import cloud.xcan.angus.core.ai.application.query.agent.AgentQuery;
import cloud.xcan.angus.core.ai.application.query.application.ApplicationQuery;
import cloud.xcan.angus.core.ai.domain.application.AIApplication;
import cloud.xcan.angus.core.ai.interfaces.chat.facade.OpenAIChatFacade;
import cloud.xcan.angus.core.ai.interfaces.chat.openai.OpenAIChatCompletionChunk;
import cloud.xcan.angus.core.ai.interfaces.chat.openai.OpenAIChatCompletionsRequest;
import cloud.xcan.angus.core.ai.interfaces.chat.openai.OpenAIChatCompletionsResponse;
import cloud.xcan.angus.core.ai.interfaces.chat.openai.OpenAIMessagesConverter;
import com.fasterxml.jackson.databind.ObjectMapper;
import cloud.xcan.angus.remote.message.ProtocolException;
import dev.langchain4j.service.TokenStream;
import jakarta.annotation.Resource;
import java.util.List;
import java.util.UUID;
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

  @Resource
  private ObjectMapper objectMapper;

  @Override
  public OpenAIChatCompletionsResponse chatCompletions(OpenAIChatCompletionsRequest request,
      String sessionId) {
    return doChatCompletions(request, sessionId, null, null);
  }

  @Override
  public SseEmitter chatCompletionsStream(OpenAIChatCompletionsRequest request, String sessionId) {
    return doChatCompletionsStream(request, sessionId, null, null);
  }

  @Override
  public OpenAIChatCompletionsResponse chatCompletionsByApp(Long appId,
      OpenAIChatCompletionsRequest request, String sessionId) {
    return doChatCompletions(request, sessionId, appId, null);
  }

  @Override
  public SseEmitter chatCompletionsStreamByApp(Long appId, OpenAIChatCompletionsRequest request,
      String sessionId) {
    return doChatCompletionsStream(request, sessionId, appId, null);
  }

  @Override
  public OpenAIChatCompletionsResponse chatCompletionsByAgent(Long agentId,
      OpenAIChatCompletionsRequest request, String sessionId) {
    return doChatCompletions(request, sessionId, null, agentId);
  }

  @Override
  public SseEmitter chatCompletionsStreamByAgent(Long agentId,
      OpenAIChatCompletionsRequest request, String sessionId) {
    return doChatCompletionsStream(request, sessionId, null, agentId);
  }

  private OpenAIChatCompletionsResponse doChatCompletions(OpenAIChatCompletionsRequest request,
      String sessionId, Long appId, Long agentId) {
    String resolvedAgentId = resolveAgentId(request.getModel(), appId, agentId);
    boolean hasSession = sessionId != null && !sessionId.isBlank();
    String effectiveSessionId = hasSession ? sessionId : "openai-" + UUID.randomUUID();

    String message = OpenAIMessagesConverter.toAgentMessage(request.getMessages(), hasSession);
    if (message.isBlank()) {
      throw ProtocolException.of("messages 中必须包含至少一条 user 消息");
    }

    String modelDisplay =
        request.getModel() != null ? request.getModel() : "agent_" + resolvedAgentId;
    return chatSync(resolvedAgentId, effectiveSessionId, message, modelDisplay);
  }

  private SseEmitter doChatCompletionsStream(OpenAIChatCompletionsRequest request, String sessionId,
      Long appId, Long agentId) {
    // TODO model参数为模型名称或者AngusAI智能体名称，智能体名称必须以 `Agent_`开头
    String resolvedAgentId = resolveAgentId(request.getModel(), appId, agentId);
    boolean hasSession = sessionId != null && !sessionId.isBlank();
    String effectiveSessionId = hasSession ? sessionId : "openai-" + UUID.randomUUID();

    String message = OpenAIMessagesConverter.toAgentMessage(request.getMessages(), hasSession);
    if (message.isBlank()) {
      throw ProtocolException.of("messages 中必须包含至少一条 user 消息");
    }

    String modelDisplay =
        request.getModel() != null ? request.getModel() : "agent_" + resolvedAgentId;
    return chatStream(resolvedAgentId, effectiveSessionId, message, modelDisplay);
  }

  private String resolveAgentId(String model, Long appId, Long agentId) {
    if (agentId != null) {
      agentQuery.findAndCheck(agentId);
      return String.valueOf(agentId);
    }
    if (appId != null) {
      AIApplication app = applicationQuery.findAndCheck(appId);
      Long defaultAgentId = applicationQuery.getDefaultAgentId(appId);
      if (defaultAgentId == null) {
        throw ProtocolException.of("应用未绑定智能体，请先配置应用");
      }
      return String.valueOf(defaultAgentId);
    }
    if (model == null || model.isBlank()) {
      throw ProtocolException.of("model 参数必填");
    }
    String id = parseAgentIdFromModel(model);
    if (id != null) {
      agentQuery.findAndCheck(Long.parseLong(id));
      return id;
    }
    throw ProtocolException.of("model 格式不支持，请使用 agent_123 或 123 指定智能体");
  }

  /**
   * 解析 model 参数为 Agent ID agent_123 或 123（纯数字）→ Agent
   */
  private String parseAgentIdFromModel(String model) {
    if (model == null) {
      return null;
    }
    model = model.trim();
    if (model.startsWith("agent_")) {
      String id = model.substring(6).trim();
      return isNumeric(id) ? id : null;
    }
    return isNumeric(model) ? model : null;
  }

  private boolean isNumeric(String s) {
    if (s == null || s.isEmpty()) {
      return false;
    }
    for (char c : s.toCharArray()) {
      if (!Character.isDigit(c)) {
        return false;
      }
    }
    return true;
  }

  private OpenAIChatCompletionsResponse chatSync(String agentId, String sessionId, String message,
      String model) {
    String reply = agentRegistry.chat(agentId, sessionId, message);

    return OpenAIChatCompletionsResponse.builder()
        .id("chatcmpl-" + UUID.randomUUID().toString().replace("-", "").substring(0, 24))
        .object("chat.completion")
        .created(System.currentTimeMillis() / 1000)
        .model(model)
        .choices(List.of(new OpenAIChatCompletionsResponse.Choice(
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

    new Thread(() -> {
      try {
        TokenStream stream = agentRegistry.chatStream(agentId, sessionId, message);

        stream.onPartialResponse(token -> {
              try {
                OpenAIChatCompletionChunk chunk = OpenAIChatCompletionChunk.builder()
                    .id("chatcmpl-stream")
                    .object("chat.completion.chunk")
                    .created(System.currentTimeMillis() / 1000)
                    .model(model)
                    .choices(List.of(new OpenAIChatCompletionChunk.ChunkChoice(
                        0,
                        new OpenAIChatCompletionsResponse.Delta(null, token),
                        null
                    )))
                    .build();
                String json = objectMapper.writeValueAsString(chunk);
                emitter.send(SseEmitter.event().data("data: " + json + "\n\n"));
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
    }).start();

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

  private int estimateTokens(String text) {
    if (text == null || text.isEmpty()) {
      return 0;
    }
    return text.length() / 2;
  }
}
