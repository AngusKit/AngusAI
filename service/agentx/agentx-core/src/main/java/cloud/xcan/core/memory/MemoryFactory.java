package cloud.xcan.core.memory;

import cloud.xcan.core.agent.definition.AgentDefinition;
import cloud.xcan.core.memory.enums.MemoryStrategy;
import dev.langchain4j.memory.ChatMemory;
import dev.langchain4j.memory.chat.ChatMemoryProvider;
import dev.langchain4j.memory.chat.MessageWindowChatMemory;
import dev.langchain4j.memory.chat.TokenWindowChatMemory;
import dev.langchain4j.model.chat.ChatModel;
import dev.langchain4j.store.memory.chat.ChatMemoryStore;
import lombok.extern.slf4j.Slf4j;

/**
 * 记忆工厂 — 根据配置创建不同策略的 ChatMemory
 * <p>
 * 支持可选注入 ChatModel — SUMMARY 策略需要，用于摘要压缩。 PERSISTENT 已移除，业务可从数据库加载后使用 MESSAGE_WINDOW。
 * </p>
 */
@Slf4j
public class MemoryFactory {

  private static final SimpleTokenCountEstimator TOKEN_ESTIMATOR = new SimpleTokenCountEstimator();

  private final ChatMemoryStore memoryStore;
  private final ChatModel chatModel;

  /**
   * 无依赖构造函数，用于简单场景
   */
  public MemoryFactory() {
    this.chatModel = null;
    this.memoryStore = new InMemoryChatMemoryStore();
  }

  /**
   * 注入 ChatModel 的构造函数，支持 SUMMARY 策略
   */
  public MemoryFactory(ChatModel chatModel) {
    this.chatModel = chatModel;
    this.memoryStore = new InMemoryChatMemoryStore();
  }

  /**
   * 注入 ChatMemoryStore 和 ChatModel 的构造函数，支持自定义存储和 SUMMARY 策略
   */
  public MemoryFactory(ChatMemoryStore memoryStore, ChatModel chatModel) {
    this.memoryStore = memoryStore != null ? memoryStore : new InMemoryChatMemoryStore();
    this.chatModel = chatModel;
  }

  /**
   * 根据 MemoryConfig 创建 ChatMemoryProvider
   */
  public ChatMemoryProvider create(AgentDefinition.MemoryConfig config) {
    if (config == null) {
      return memoryId -> MessageWindowChatMemory.builder()
          .id(memoryId)
          .maxMessages(20)
          .chatMemoryStore(memoryStore)
          .build();
    }

    MemoryStrategy strategy =
        config.getStrategy() != null ? config.getStrategy() : MemoryStrategy.TOKEN_WINDOW;

    return switch (strategy) {
      case NONE -> EmptyChatMemory::new;
      case MESSAGE_WINDOW -> memoryId -> createMessageWindowMemory(config, memoryId);
      case TOKEN_WINDOW -> memoryId -> createTokenWindowMemory(config);
      case SUMMARY -> memoryId -> createSummaryMemory(config, memoryId);
    };
  }

  private ChatMemory createMessageWindowMemory(AgentDefinition.MemoryConfig config,
      Object memoryId) {
    int max = config.getWindowSize() != null && config.getWindowSize() > 0
        ? config.getWindowSize() : 20;
    return MessageWindowChatMemory.builder()
        .id(memoryId)
        .maxMessages(max)
        .chatMemoryStore(memoryStore)
        .build();
  }

  private ChatMemory createTokenWindowMemory(AgentDefinition.MemoryConfig config) {
    int maxTokens = config.getMaxTokens() != null && config.getMaxTokens() > 0
        ? config.getMaxTokens() : 8000;
    return TokenWindowChatMemory.withMaxTokens(maxTokens, TOKEN_ESTIMATOR);
  }

  private ChatMemory createSummaryMemory(AgentDefinition.MemoryConfig config, Object memoryId) {
    int windowSize = config.getWindowSize() != null && config.getWindowSize() > 0
        ? config.getWindowSize() : 10;

    if (chatModel != null) {
      String summaryPrompt =
          config.getSummaryPrompt() != null && !config.getSummaryPrompt().isBlank()
              ? config.getSummaryPrompt()
              : SummarizingChatMemory.DEFAULT_SUMMARY_PROMPT;
      return new SummarizingChatMemory(memoryId, windowSize, summaryPrompt, chatModel,
          memoryStore);
    }
    log.info("SUMMARY 策略未注入 ChatModel，回退为 MESSAGE_WINDOW(windowSize={})", windowSize);
    return MessageWindowChatMemory.builder()
        .id(memoryId)
        .maxMessages(windowSize)
        .chatMemoryStore(memoryStore)
        .build();
  }
}
