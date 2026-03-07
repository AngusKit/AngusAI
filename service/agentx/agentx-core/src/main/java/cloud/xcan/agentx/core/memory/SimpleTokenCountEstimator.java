package cloud.xcan.agentx.core.memory;

import dev.langchain4j.data.message.AiMessage;
import dev.langchain4j.data.message.ChatMessage;
import dev.langchain4j.data.message.SystemMessage;
import dev.langchain4j.data.message.UserMessage;
import dev.langchain4j.model.TokenCountEstimator;
import java.util.Iterator;

/**
 * 基于字符的简单 Token 估算器 — 约 4 字符 ≈ 1 token。
 * <p>
 * 用于 TokenWindowChatMemory，在无法接入模型分词器时的通用近似。
 * </p>
 */
public class SimpleTokenCountEstimator implements TokenCountEstimator {

  private static final int CHARS_PER_TOKEN = 4;

  @Override
  public int estimateTokenCountInText(String text) {
    if (text == null || text.isEmpty()) {
      return 0;
    }
    return (int) Math.ceil((double) text.length() / CHARS_PER_TOKEN);
  }

  @Override
  public int estimateTokenCountInMessage(ChatMessage message) {
    if (message == null) {
      return 0;
    }
    return estimateTokenCountInText(extractText(message));
  }

  @Override
  public int estimateTokenCountInMessages(Iterable<ChatMessage> messages) {
    if (messages == null) {
      return 0;
    }
    int total = 0;
    Iterator<ChatMessage> it = messages.iterator();
    while (it.hasNext()) {
      total += estimateTokenCountInMessage(it.next());
    }
    return total;
  }

  private static String extractText(ChatMessage message) {
    if (message instanceof UserMessage) {
      return ((UserMessage) message).singleText();
    }
    if (message instanceof AiMessage) {
      return ((AiMessage) message).text();
    }
    if (message instanceof SystemMessage) {
      return ((SystemMessage) message).text();
    }
    return "";
  }
}
