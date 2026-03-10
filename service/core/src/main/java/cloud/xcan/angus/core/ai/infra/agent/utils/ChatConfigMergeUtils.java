package cloud.xcan.angus.core.ai.infra.agent.utils;

import static cloud.xcan.angus.core.ai.domain.Constants.CHAT_DEFAULT_FREQUENCY_PENALTY;
import static cloud.xcan.angus.core.ai.domain.Constants.CHAT_DEFAULT_MAX_TOKENS;
import static cloud.xcan.angus.core.ai.domain.Constants.CHAT_DEFAULT_PRESENCE_PENALTY;
import static cloud.xcan.angus.core.ai.domain.Constants.CHAT_DEFAULT_TEMPERATURE;
import static cloud.xcan.angus.core.ai.domain.Constants.CHAT_DEFAULT_TOP_P;
import cloud.xcan.angus.core.ai.domain.agent.Agent;
import cloud.xcan.angus.core.ai.domain.chat.Session;
import cloud.xcan.angus.core.ai.domain.chat.SessionConfig;
import cloud.xcan.angus.core.ai.domain.model.Model;
import cloud.xcan.angus.core.ai.domain.agent.AgentChatConfig;

/**
 * 对话配置合并工具
 * <p>
 * 优先级：请求参数 > 会话参数 > 智能体参数 > 默认值。未设置的参数不传，使用下游默认。
 * </p>
 */
public final class ChatConfigMergeUtils {

  private ChatConfigMergeUtils() {}

  /**
   * 合并对话配置
   *
   * @param requestConfig 请求层配置（可选）
   * @param session       会话（含 config，可选）
   * @param agent         智能体（含 systemPrompt）
   * @param model         智能体默认模型（含 temperature、maxTokens 等，可选）
   * @return 合并后的配置，未设置的为 null（由下游使用默认）
   */
  public static AgentChatConfig merge(AgentChatConfig requestConfig,
      Session session, Agent agent, Model model) {
    SessionConfig sessionConfig = session != null ? session.getConfig() : null;

    Double temperature = firstNonNull(
        getRequestTemperature(requestConfig),
        getSessionTemperature(sessionConfig),
        getModelTemperature(model),
        CHAT_DEFAULT_TEMPERATURE);

    Integer maxTokens = firstNonNull(
        getRequestMaxTokens(requestConfig),
        getSessionMaxTokens(sessionConfig),
        getModelMaxTokens(model),
        CHAT_DEFAULT_MAX_TOKENS);

    Double topP = firstNonNull(
        getRequestTopP(requestConfig),
        getSessionTopP(sessionConfig),
        CHAT_DEFAULT_TOP_P);

    Double frequencyPenalty = firstNonNull(
        getRequestFrequencyPenalty(requestConfig),
        getSessionFrequencyPenalty(sessionConfig),
        CHAT_DEFAULT_FREQUENCY_PENALTY);

    Double presencePenalty = firstNonNull(
        getRequestPresencePenalty(requestConfig),
        getSessionPresencePenalty(sessionConfig),
        CHAT_DEFAULT_PRESENCE_PENALTY);

    String systemPrompt = firstNonNull(
        getRequestSystemPrompt(requestConfig),
        getSessionSystemPrompt(sessionConfig),
        agent != null ? agent.getSystemPrompt() : null);

    AgentChatConfig merged = new AgentChatConfig();
    merged.setTemperature(temperature);
    merged.setMaxTokens(maxTokens);
    merged.setTopP(topP);
    merged.setFrequencyPenalty(frequencyPenalty);
    merged.setPresencePenalty(presencePenalty);
    merged.setSystemPrompt(systemPrompt);
    return merged;
  }

  @SafeVarargs
  private static <T> T firstNonNull(T... values) {
    for (T v : values) {
      if (v != null) {
        return v;
      }
    }
    return null;
  }

  private static Double getRequestTemperature(AgentChatConfig c) {
    return c != null ? c.getTemperature() : null;
  }

  private static Integer getRequestMaxTokens(AgentChatConfig c) {
    return c != null ? c.getMaxTokens() : null;
  }

  private static Double getRequestTopP(AgentChatConfig c) {
    return c != null ? c.getTopP() : null;
  }

  private static Double getRequestFrequencyPenalty(AgentChatConfig c) {
    return c != null ? c.getFrequencyPenalty() : null;
  }

  private static Double getRequestPresencePenalty(AgentChatConfig c) {
    return c != null ? c.getPresencePenalty() : null;
  }

  private static String getRequestSystemPrompt(AgentChatConfig c) {
    return c != null ? c.getSystemPrompt() : null;
  }

  private static Double getSessionTemperature(SessionConfig c) {
    return c != null ? c.getTemperature() : null;
  }

  private static Integer getSessionMaxTokens(SessionConfig c) {
    return c != null ? c.getMaxTokens() : null;
  }

  private static Double getSessionTopP(SessionConfig c) {
    return c != null ? c.getTopP() : null;
  }

  private static Double getSessionFrequencyPenalty(SessionConfig c) {
    return c != null ? c.getFrequencyPenalty() : null;
  }

  private static Double getSessionPresencePenalty(SessionConfig c) {
    return c != null ? c.getPresencePenalty() : null;
  }

  private static String getSessionSystemPrompt(SessionConfig c) {
    return c != null ? c.getSystemPrompt() : null;
  }

  private static Double getModelTemperature(Model m) {
    return m != null && m.getConfig() != null ? m.getConfig().getTemperature() : null;
  }

  private static Integer getModelMaxTokens(Model m) {
    return m != null && m.getConfig() != null ? m.getConfig().getMaxTokens() : null;
  }
}
