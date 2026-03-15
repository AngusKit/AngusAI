package cloud.xcan.angus.core.ai.domain.chat.openai;

import java.util.List;

/**
 * OpenAI messages 格式转换器 将 messages 转为 AgentRegistry 所需的单条消息输入
 */
public final class OpenAIMessagesConverter {

  private OpenAIMessagesConverter() {
  }

  /**
   * 从 messages 中提取用于 Agent 的输入消息 规则： 1. 若有 sessionId，仅传最后一条 user 消息（依赖服务端记忆） 2. 若无 sessionId，将全量
   * user/assistant 历史格式化为上下文 + 最后 user 消息
   *
   * @param messages     OpenAI 格式的 messages
   * @param hasSessionId 是否提供了 sessionId（X-Session-Id）
   * @return 传给 AgentRegistry.chat 的 message 字符串
   */
  public static String toAgentMessage(List<OpenAIChatCompletionsRequest.ChatMessage> messages,
      boolean hasSessionId) {
    if (messages == null || messages.isEmpty()) {
      return "";
    }

    // 提取最后一条 user 消息
    String lastUserContent = null;
    for (int i = messages.size() - 1; i >= 0; i--) {
      OpenAIChatCompletionsRequest.ChatMessage m = messages.get(i);
      if ("user".equalsIgnoreCase(m.getRole()) && m.getContent() != null) {
        lastUserContent = m.getContent();
        break;
      }
    }
    if (lastUserContent == null) {
      return "";
    }

    if (hasSessionId) {
      // 有 sessionId：仅传最后 user 消息，历史由服务端记忆提供
      return lastUserContent;
    }

    // 无 sessionId：将全量 messages 格式化为上下文
    StringBuilder context = new StringBuilder();
    for (OpenAIChatCompletionsRequest.ChatMessage m : messages) {
      String role = m.getRole();
      String content = m.getContent();
      if (content == null) {
        continue;
      }
      if ("system".equalsIgnoreCase(role)) {
        context.append("[System] ").append(content).append("\n\n");
      } else if ("user".equalsIgnoreCase(role)) {
        context.append("User: ").append(content).append("\n");
      } else if ("assistant".equalsIgnoreCase(role)) {
        context.append("Assistant: ").append(content).append("\n");
      }
    }
    return context.toString().trim();
  }
}
