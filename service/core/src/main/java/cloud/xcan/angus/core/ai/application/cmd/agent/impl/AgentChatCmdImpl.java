package cloud.xcan.angus.core.ai.application.cmd.agent.impl;

import static cloud.xcan.angus.core.ai.application.converter.AgentConverter.toChatConfigOverride;
import static cloud.xcan.angus.core.ai.domain.Constants.CHAT_DEFAULT_TIMEOUT_MS;
import static cloud.xcan.angus.spec.principal.PrincipalContext.getUserId;
import static cloud.xcan.angus.spec.utils.ObjectUtils.lengthSafe;
import static cloud.xcan.angus.spec.utils.ObjectUtils.nullSafe;

import cloud.xcan.agentx.core.agent.AgentRegistry;
import cloud.xcan.agentx.core.agent.ChatConfigOverride;
import cloud.xcan.angus.core.ai.application.cmd.agent.AgentChatCmd;
import cloud.xcan.angus.core.ai.application.cmd.agent.AgentCmd;
import cloud.xcan.angus.core.ai.application.cmd.analytics.ApiUsageLogCmd;
import cloud.xcan.angus.core.ai.application.cmd.chat.MessageCmd;
import cloud.xcan.angus.core.ai.application.cmd.chat.SessionCmd;
import cloud.xcan.angus.core.ai.application.query.agent.AgentQuery;
import cloud.xcan.angus.core.ai.application.query.model.ModelQuery;
import cloud.xcan.angus.core.ai.domain.agent.Agent;
import cloud.xcan.angus.core.ai.domain.agent.AgentChatConfig;
import cloud.xcan.angus.core.ai.domain.agent.AgentChatResult;
import cloud.xcan.angus.core.ai.domain.analytics.ApiUsageLog;
import cloud.xcan.angus.core.ai.domain.chat.Message;
import cloud.xcan.angus.core.ai.domain.chat.MessageRole;
import cloud.xcan.angus.core.ai.domain.chat.Session;
import cloud.xcan.angus.core.ai.domain.model.Model;
import cloud.xcan.angus.core.ai.infra.agent.utils.ChatConfigMergeUtils;
import cloud.xcan.angus.core.biz.BizTemplate;
import cloud.xcan.angus.remote.message.SysException;
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
  private SessionCmd sessionCmd;

  @Resource
  private ModelQuery modelQuery;

  @Resource
  private ApiUsageLogCmd apiUsageLogCmd;

  /**
   * 流式 SSE 专用线程池
   */
  @Resource
  @Qualifier("sseEmitterChatExecutor")
  private Executor sseEmitterChatExecutor;

  @Override
  public AgentChatResult chat(Long agentId, String sessionId, String message,
      AgentChatConfig config) {
    return new BizTemplate<AgentChatResult>() {
      Agent agent;
      Session session;

      @Override
      protected void checkParams() {
        // 校验智能体并获取会话：有 sessionId 则复用，无则新建
        agent = agentQuery.findAndCheckValid(agentId);
        session = sessionCmd.createOrGetForAgentChat(agent, sessionId);
      }

      @Override
      protected AgentChatResult process() {
        agentCmd.ensureRegistered(agent);
        // 有会话时先落库用户消息
        messageCmd.create0(session, MessageRole.USER, message);

        // 合并请求/会话/智能体/模型配置，得到最终覆盖参数
        ChatConfigOverride override = getChatConfigOverride(agent, config, session);
        String agentIdStr = String.valueOf(agentId);
        String defaultModelIdStr = agent.getDefaultModelId() != null
            ? String.valueOf(agent.getDefaultModelId()) : null;

        // 执行对话请求
        long startMs = System.currentTimeMillis();
        String reply = "";
        Exception chatError = null;
        try {
          // 异步执行 LLM 调用，有 override 时指定模型与配置
          // 注意：可以改为在主线程直接调用 agentRegistry.chat()，但建议保留 executor，便于控制 LLM 并发。
          // 若需要 Java 层超时，可改用 future.get(timeout, unit)
          reply = override != null && agent.getDefaultModelId() != null
              ? agentRegistry.chat(agentIdStr, session.getSessionId(), message,
              defaultModelIdStr, override)
              : agentRegistry.chat(agentIdStr, session.getSessionId(), message);
        } catch (Exception e) {
          chatError = e;
          throw SysException.of(e.getMessage());
        } finally {
          int estInput = estimateTokens(message);
          int estOutput = chatError == null ? estimateTokens(reply) : 0;
          saveApiUsageLog(agent, session, "/api/v1/agents/chat", startMs, chatError == null,
              chatError != null ? chatError.getMessage() : null, estInput, estOutput,
              estInput + estOutput);
        }

        // 落库助手回复
        messageCmd.create0(session, MessageRole.ASSISTANT, reply);
        return new AgentChatResult(reply, session.getSessionId());
      }
    }.execute();
  }

  @Override
  public SseEmitter chatStream(Long agentId, String sessionId, String message,
      AgentChatConfig config) {
    return new BizTemplate<SseEmitter>() {
      Agent agent;
      Session session;
      Message assistantMessage;

      @Override
      protected void checkParams() {
        agent = agentQuery.findAndCheckValid(agentId);
        session = sessionCmd.createOrGetForAgentChat(agent, sessionId);
      }

      @Override
      protected SseEmitter process() {
        // 按照优先级获取会话配置
        ChatConfigOverride override = getChatConfigOverride(agent, config, session);
        Long timeoutMs = nullSafe(override.getTimeoutMs(), CHAT_DEFAULT_TIMEOUT_MS);

        // 构造SseEmitter
        final SseEmitter emitter = new SseEmitter(timeoutMs);

        // 注册智能体
        agentCmd.ensureRegistered(agent);

        // 落库用户消息
        messageCmd.create0(session, MessageRole.USER, message);

        // 预创建占位助手消息并标记为流式
        assistantMessage = messageCmd.create0(session, MessageRole.ASSISTANT,
            STREAMING_PLACEHOLDER);
        messageCmd.setStreaming(assistantMessage, true);

        // 合并配置，得到最终覆盖参数
        String agentIdStr = String.valueOf(agentId);
        String defaultModelId = String.valueOf(agent.getDefaultModelId());

        // 异步执行流式调用，通过 SSE 推送 token
        // 注意：必须保持使用 sseEmitterChatExecutor，否则会破坏 SSE 的流式模型和整体稳定性
        sseEmitterChatExecutor.execute(() -> {
          StringBuilder fullContent = new StringBuilder();
          long streamStartMs = System.currentTimeMillis();
          try {
            TokenStream stream = agent.getDefaultModelId() != null
                ? agentRegistry.chatStream(agentIdStr, session.getSessionId(), message,
                defaultModelId, override)
                : agentRegistry.chatStream(agentIdStr, session.getSessionId(), message);
            // 每收到 token：累积内容并推送前端
            stream.onPartialResponse(token -> {
                  fullContent.append(token);
                  try {
                    emitter.send(SseEmitter.event().data(token));
                  } catch (Exception e) {
                    emitter.completeWithError(e);
                  }
                })
                // 流结束：用完整内容覆盖占位消息，关闭流式标记，记录 ApiUsageLog（含 token 用量与成本）
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
                  saveApiUsageLog(agent, session, "/api/v1/agents/chat/stream",
                      streamStartMs, true, null, inTokens, outTokens, total);
                  emitter.complete();
                })
                .onError(e -> {
                  messageCmd.setStreaming(assistantMessage, false);
                  saveApiUsageLog(agent, session, "/api/v1/agents/chat/stream",
                      streamStartMs, false, e.getMessage(), null, null, null);
                  emitter.completeWithError(e);
                });
            stream.start();
          } catch (Exception e) {
            messageCmd.setStreaming(assistantMessage, false);
            saveApiUsageLog(agent, session, "/api/v1/agents/chat/stream",
                streamStartMs, false, e.getMessage(), null, null, null);
            emitter.completeWithError(e);
          }
        });
        return emitter;
      }
    }.execute();
  }

  /**
   * 合并请求/会话/智能体/模型配置，生成 ChatConfigOverride。 合并优先级：请求 config > 会话 config > 智能体 config > 模型 config。
   */
  private ChatConfigOverride getChatConfigOverride(Agent agent, AgentChatConfig config,
      Session session) {
    Model model = agent.getDefaultModelId() != null
        ? modelQuery.findById(agent.getDefaultModelId()).orElse(null) : null;
    AgentChatConfig merged = ChatConfigMergeUtils.merge(config, session, agent, model);
    return toChatConfigOverride(merged);
  }

  /**
   * 保存 API 使用日志，关联对话
   */
  private void saveApiUsageLog(Agent agent, Session session, String endpoint,
      long startMs, boolean isSuccessful, String errorMessage,
      Integer inputTokens, Integer outputTokens, Integer totalTokens) {
    try {
      int responseTimeMs = (int) (System.currentTimeMillis() - startMs);
      Integer cost = calculateCost(agent, inputTokens, outputTokens);
      ApiUsageLog log = new ApiUsageLog()
          .setAppId(session != null ? session.getAppId() : null)
          .setAgentId(agent != null ? agent.getId() : null)
          .setModelId(agent != null ? agent.getDefaultModelId() : null)
          .setUserId(getUserId())
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
          .setSessionId(session != null ? session.getSessionId() : null);
      apiUsageLogCmd.create(log);
    } catch (Exception e) {
      // 日志记录失败不影响主流程
    }
  }

  /**
   * 根据模型定价计算费用（美元分，即 cents）
   */
  private Integer calculateCost(Agent agent, Integer inputTokens, Integer outputTokens) {
    if (agent == null || agent.getDefaultModelId() == null || (inputTokens == null
        && outputTokens == null)) {
      return null;
    }
    return modelQuery.findById(agent.getDefaultModelId())
        .map(model -> {
          var config = model.getConfig();
          if (config == null) {
            return null;
          }
          Double inputPrice = config.getInputPricePerMillionTokens();
          Double outputPrice = config.getOutputPricePerMillionTokens();
          int in = inputTokens != null ? inputTokens : 0;
          int out = outputTokens != null ? outputTokens : 0;
          if ((inputPrice == null || inputPrice <= 0)
              && (outputPrice == null || outputPrice <= 0)) {
            return null;
          }
          double costUsd = 0;
          if (inputPrice != null && inputPrice > 0) {
            costUsd += (in / 1_000_000.0) * inputPrice;
          }
          if (outputPrice != null && outputPrice > 0) {
            costUsd += (out / 1_000_000.0) * outputPrice;
          }
          return costUsd > 0 ? (int) Math.round(costUsd * 100) : null;
        })
        .orElse(null);
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
