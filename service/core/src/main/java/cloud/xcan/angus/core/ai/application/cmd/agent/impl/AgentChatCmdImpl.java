package cloud.xcan.angus.core.ai.application.cmd.agent.impl;

import static cloud.xcan.angus.core.ai.application.converter.AgentConverter.toChatConfigOverride;
import static cloud.xcan.angus.core.ai.domain.Constants.CHAT_DEFAULT_TIMEOUT_MS;
import static cloud.xcan.angus.core.utils.GsonUtils.toJson;
import static cloud.xcan.angus.spec.principal.PrincipalContext.get;
import static cloud.xcan.angus.spec.utils.ObjectUtils.lengthSafe;
import static cloud.xcan.angus.spec.utils.ObjectUtils.nullSafe;

import cloud.xcan.agentx.core.agent.AgentRegistry;
import cloud.xcan.agentx.core.agent.ChatConfigOverride;
import cloud.xcan.angus.core.ai.application.cmd.agent.AgentChatCmd;
import cloud.xcan.angus.core.ai.application.cmd.agent.AgentCmd;
import cloud.xcan.angus.core.ai.application.cmd.analytics.ChatUsageLogCmd;
import cloud.xcan.angus.core.ai.application.cmd.chat.MessageCmd;
import cloud.xcan.angus.core.ai.application.query.agent.AgentQuery;
import cloud.xcan.angus.core.ai.application.query.model.ModelQuery;
import cloud.xcan.angus.core.ai.domain.agent.Agent;
import cloud.xcan.angus.core.ai.domain.agent.AgentChatResult;
import cloud.xcan.angus.core.ai.domain.chat.ChatUsageLog;
import cloud.xcan.angus.core.ai.domain.chat.Message;
import cloud.xcan.angus.core.ai.domain.chat.MessageRole;
import cloud.xcan.angus.core.ai.domain.chat.Session;
import cloud.xcan.angus.core.ai.domain.chat.SessionConfig;
import cloud.xcan.angus.core.ai.domain.chat.openai.OpenAIChatCompletionChunk;
import cloud.xcan.angus.core.ai.domain.chat.openai.OpenAIChatCompletionsResponse;
import cloud.xcan.angus.core.ai.domain.model.Model;
import cloud.xcan.angus.core.ai.infra.agent.utils.ChatConfigMergeUtils;
import cloud.xcan.angus.core.biz.BizTemplate;
import cloud.xcan.angus.remote.message.SysException;
import cloud.xcan.angus.spec.principal.Principal;
import cloud.xcan.angus.spec.principal.PrincipalContext;
import dev.langchain4j.service.TokenStream;
import jakarta.annotation.Resource;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.concurrent.Executor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

/**
 * 智能体对话命令实现
 * <p>
 * 对话、Session、Message 统一使用 sessionId(UUID) 关联；入参 sessionId 为空时业务层初始化 Session。
 * </p>
 */
@Slf4j
@Service
public class AgentChatCmdImpl implements AgentChatCmd {

  /**
   * 流式助手消息占位内容，用于满足 MessageCmd 非空校验，最终由 updateContent 覆盖
   */
  private static final String STREAMING_PLACEHOLDER = ".";

  @Resource
  private AgentCmd agentCmd;

  @Resource
  private AgentQuery agentQuery;

  @Resource
  private AgentRegistry agentRegistry;

  @Resource
  private MessageCmd messageCmd;

  @Resource
  private ModelQuery modelQuery;

  @Resource
  private ChatUsageLogCmd chatUsageLogCmd;

  /**
   * 流式 SSE 专用线程池
   */
  @Resource
  @Qualifier("sseEmitterChatExecutor")
  private Executor sseEmitterChatExecutor;

  @Override
  public AgentChatResult chat(Session sessionDb, String message, SessionConfig config) {
    return new BizTemplate<AgentChatResult>() {
      Agent agent;

      @Override
      protected void checkParams() {
        // 校验智能体是否存在
        agent = agentQuery.findAndCheckValid(sessionDb.getAgentId());
      }

      @Override
      protected AgentChatResult process() {
        agentCmd.ensureRegistered(agent);
        // 有会话时先落库用户消息
        Message userMessage = messageCmd.create0(sessionDb, MessageRole.USER, message);

        // 预创建占位助手消息并标记为流式，便于进行中对话统计（与流式 chatStream 一致）
        Message assistantMessage = messageCmd.create0(sessionDb, MessageRole.ASSISTANT,
            STREAMING_PLACEHOLDER, userMessage.getId());
        messageCmd.setStreaming(assistantMessage, true);

        // Model 优先从会话取 modelId，其次从 agent 取 defaultModelId
        Long modelId = sessionDb.getModelId() != null ? sessionDb.getModelId() : agent.getDefaultModelId();
        Model model = modelId != null ? modelQuery.findById(modelId).orElse(null) : null;

        // 合并请求/会话/智能体/模型配置，得到最终覆盖参数
        ChatConfigOverride override = getChatConfigOverride(agent, config, sessionDb, model);
        String agentIdStr = String.valueOf(sessionDb.getAgentId());
        String modelIdStr = modelId != null ? String.valueOf(modelId) : null;

        // 执行对话请求
        long startMs = System.currentTimeMillis();
        String reply = "";
        Exception chatError = null;
        try {
          // 异步执行 LLM 调用，有 override 时指定模型与配置
          // 注意：可以改为在主线程直接调用 agentRegistry.chat()，但建议保留 executor，便于控制 LLM 并发。
          // 若需要 Java 层超时，可改用 future.get(timeout, unit)
          reply = override != null && modelId != null
              ? agentRegistry.chat(agentIdStr, sessionDb.getSessionId(), message,
              modelIdStr, override)
              : agentRegistry.chat(agentIdStr, sessionDb.getSessionId(), message);
        } catch (Exception e) {
          chatError = e;
          throw SysException.of(e.getMessage());
        } finally {
          int estInput = estimateTokens(message);
          int estOutput = chatError == null ? estimateTokens(reply) : 0;
          saveApiUsageLog(get(), agent, sessionDb, model, "/api/v1/agents/chat", startMs,
              chatError == null, chatError != null ? chatError.getMessage() : null, estInput,
              estOutput, estInput + estOutput, userMessage.getId());
          // 更新助手消息内容并关闭流式标记
          assistantMessage.setContent(chatError == null ? reply : "");
          messageCmd.setStreaming(assistantMessage, false);
        }

        return new AgentChatResult(reply, sessionDb.getSessionId());
      }
    }.execute();
  }

  @Override
  public SseEmitter chatStream(Session sessionDb, String message, SessionConfig config) {
    return new BizTemplate<SseEmitter>() {
      Agent agent;
      Message assistantMessage;

      @Override
      protected void checkParams() {
        // 校验智能体是否存在
        agent = agentQuery.findAndCheckValid(sessionDb.getAgentId());
      }

      @Override
      protected SseEmitter process() {
        // Model 优先从会话取 modelId，其次从 agent 取 defaultModelId
        Long modelId = sessionDb.getModelId() != null ? sessionDb.getModelId() : agent.getDefaultModelId();
        Model model = modelId != null ? modelQuery.findById(modelId).orElse(null) : null;

        // 按照优先级获取会话配置
        ChatConfigOverride override = getChatConfigOverride(agent, config, sessionDb, model);
        Long timeoutMs = nullSafe(override.getTimeoutMs(), CHAT_DEFAULT_TIMEOUT_MS);

        // 构造SseEmitter
        final SseEmitter emitter = new SseEmitter(timeoutMs);

        // 注册智能体
        agentCmd.ensureRegistered(agent);

        // 落库用户消息
        Message userMessage = messageCmd.create0(sessionDb, MessageRole.USER, message);

        // 预创建占位助手消息并标记为流式，关联对应的 USER 消息 ID
        assistantMessage = messageCmd.create0(sessionDb, MessageRole.ASSISTANT,
            STREAMING_PLACEHOLDER, userMessage.getId());
        messageCmd.setStreaming(assistantMessage, true);

        // 合并配置，得到最终覆盖参数
        String agentIdStr = String.valueOf(sessionDb.getAgentId());
        String modelIdStr = modelId != null ? String.valueOf(modelId) : null;

        // 异步执行流式调用，通过 SSE 推送 token
        // 注意：必须保持使用 sseEmitterChatExecutor，否则会破坏 SSE 的流式模型和整体稳定性
        final Model modelForAsync = model;
        final Long userMessageIdForLog = userMessage.getId();
        Principal principal = PrincipalContext.get();
        sseEmitterChatExecutor.execute(() -> {
          StringBuilder fullContent = new StringBuilder();
          long streamStartMs = System.currentTimeMillis();
          try {
            TokenStream stream = modelId != null
                ? agentRegistry.chatStream(agentIdStr, sessionDb.getSessionId(), message,
                modelIdStr, override)
                : agentRegistry.chatStream(agentIdStr, sessionDb.getSessionId(), message);
            stream.onPartialResponse(token -> {
                  fullContent.append(token);
                  try {
                    OpenAIChatCompletionChunk chunk = OpenAIChatCompletionChunk.builder()
                        .id("chatcmpl-stream")
                        .sessionId(sessionDb.getSessionId())
                        .object("chat.completion.chunk")
                        .created(System.currentTimeMillis() / 1000)
                        .model(agent.getEncoding())
                        .choices(List.of(new OpenAIChatCompletionChunk.ChunkChoice(
                            0,
                            new OpenAIChatCompletionsResponse.Delta(null, token),
                            null)))
                        .build();
                    emitter.send(SseEmitter.event().data("data: " + toJson(chunk) + "\n\n"));
                  } catch (Exception e) {
                    emitter.completeWithError(e);
                  }
                })
                // 流结束：用完整内容覆盖占位消息，关闭流式标记，记录 ChatUsageLog（含 token 用量与成本）
                .onCompleteResponse(r -> {
                  assistantMessage.setContent(fullContent.toString());
                  messageCmd.setStreaming(assistantMessage, false);
                  Integer inTokens = null;
                  Integer outTokens = null;
                  Integer total = null;
                  if (r != null && r.tokenUsage() != null) {
                    var usage = r.tokenUsage();
                    inTokens = usage.inputTokenCount();
                    outTokens = usage.outputTokenCount();
                    total = usage.totalTokenCount();
                  }
                  if (total == null && (inTokens != null || outTokens != null)) {
                    total = (inTokens != null ? inTokens : 0) + (outTokens != null ? outTokens : 0);
                  }
                  saveApiUsageLog(principal, agent, sessionDb, modelForAsync,
                      "/api/v1/agents/chat/stream", streamStartMs, true, null,
                      inTokens, outTokens, total, userMessageIdForLog);
                  try {
                    emitter.send(SseEmitter.event().data("data: [DONE]\n\n"));
                  } catch (Exception ignored) {
                  }
                  emitter.complete();
                })
                .onError(e -> {
                  messageCmd.setStreaming(assistantMessage, false);
                  saveApiUsageLog(principal, agent, sessionDb, modelForAsync,
                      "/api/v1/agents/chat/stream", streamStartMs, false, e.getMessage(),
                      null, null, null, userMessageIdForLog);
                  emitter.completeWithError(e);
                });
            stream.start();
          } catch (Exception e) {
            messageCmd.setStreaming(assistantMessage, false);
            saveApiUsageLog(principal, agent, sessionDb, modelForAsync,
                "/api/v1/agents/chat/stream", streamStartMs, false, e.getMessage(), null, null,
                null, userMessageIdForLog);
            emitter.completeWithError(e);
          }
        });
        return emitter;
      }
    }.execute();
  }

  /**
   * 合并请求/会话/智能体/模型配置，生成 ChatConfigOverride。 合并优先级：请求 config > 会话 config > 智能体 config > 模型 config。
   *
   * @param model 已查询的模型，可为 null；为 null 时内部会按需查询（优先用 session.modelId，其次 agent.defaultModelId）
   */
  private ChatConfigOverride getChatConfigOverride(Agent agent, SessionConfig config,
      Session session, Model model) {
    Long modelId = model != null ? model.getId()
        : (session != null && session.getModelId() != null ? session.getModelId()
            : (agent != null && agent.getDefaultModelId() != null ? agent.getDefaultModelId()
                : null));
    Model m = model != null ? model
        : (modelId != null ? modelQuery.findById(modelId).orElse(null) : null);
    SessionConfig merged = ChatConfigMergeUtils.merge(config, session, agent, m);
    return toChatConfigOverride(merged);
  }

  /**
   * 保存 API 使用日志，关联对话
   *
   * @param model 已查询的模型，可为 null；为 null 时 calculateCost 内部会按需查询
   * @param userMessageId 用户消息ID，可为 null
   */
  private void saveApiUsageLog(Principal principal, Agent agent, Session session, Model model,
      String endpoint, long startMs, boolean isSuccessful, String errorMessage,
      Integer inputTokens, Integer outputTokens, Integer totalTokens, Long userMessageId) {
    try {
      int responseTimeMs = (int) (System.currentTimeMillis() - startMs);
      BigDecimal cost = calculateCost(agent, model, inputTokens, outputTokens);
      Long logModelId = session != null && session.getModelId() != null ? session.getModelId()
          : (agent != null ? agent.getDefaultModelId() : null);
      ChatUsageLog usageLog = new ChatUsageLog()
          .setAppId(session != null ? session.getAppId() : null)
          .setAgentId(agent != null ? agent.getId() : null)
          .setModelId(logModelId)
          .setEndpoint(endpoint)
          .setMethod("POST")
          .setStatusCode(isSuccessful ? 200 : 500)
          .setResponseTimeMs(responseTimeMs)
          .setInputTokens(inputTokens)
          .setOutputTokens(outputTokens)
          .setTotalTokens(totalTokens)
          .setCost(cost)
          .setIsSuccessful(isSuccessful)
          .setErrorMessage(lengthSafe(errorMessage, 1000))
          .setSessionId(session != null ? session.getSessionId() : null)
          .setUserMessageId(userMessageId);
      chatUsageLogCmd.create(usageLog, principal);
    } catch (Exception e) {
      log.error(e.getMessage());
    }
  }

  /**
   * Calculate cost in USD from model pricing. Uses BigDecimal to preserve decimals
   * and avoid rounding to zero when token count is very small.
   *
   * @param model model already loaded, or null to load by session.modelId / agent.defaultModelId
   */
  private BigDecimal calculateCost(Agent agent, Model model, Integer inputTokens,
      Integer outputTokens) {
    if (model == null && agent == null) {
      return null;
    }
    if ((inputTokens == null && outputTokens == null)) {
      return null;
    }
    Model m = model;
    if (m == null || m.getConfig() == null) {
      return null;
    }
    var config = m.getConfig();
    Double inputPrice = config.getInputPricePerMillionTokens();
    Double outputPrice = config.getOutputPricePerMillionTokens();
    int in = inputTokens != null ? inputTokens : 0;
    int out = outputTokens != null ? outputTokens : 0;
    if ((inputPrice == null || inputPrice <= 0)
        && (outputPrice == null || outputPrice <= 0)) {
      return null;
    }
    BigDecimal costUsd = BigDecimal.ZERO;
    if (inputPrice != null && inputPrice > 0) {
      costUsd = costUsd.add(
          BigDecimal.valueOf(in).divide(BigDecimal.valueOf(1_000_000), 8, RoundingMode.HALF_UP)
              .multiply(BigDecimal.valueOf(inputPrice)));
    }
    if (outputPrice != null && outputPrice > 0) {
      costUsd = costUsd.add(
          BigDecimal.valueOf(out).divide(BigDecimal.valueOf(1_000_000), 8, RoundingMode.HALF_UP)
              .multiply(BigDecimal.valueOf(outputPrice)));
    }
    return costUsd.compareTo(BigDecimal.ZERO) > 0 ? costUsd.setScale(8, RoundingMode.HALF_UP) : null;
  }

  /**
   * 粗略估算 token 数量（约 1 token ≈ 4 字符，适用于中英文混合）
   */
  private static int estimateTokens(String text) {
    if (text == null || text.isEmpty()) {
      return 0;
    }
    return Math.max(1, text.length() / 4);
  }

}
