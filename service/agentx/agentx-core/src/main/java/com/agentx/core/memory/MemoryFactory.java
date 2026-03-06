package com.agentx.core.memory;

import com.agentx.core.agent.definition.AgentDefinition;
import dev.langchain4j.memory.ChatMemory;
import dev.langchain4j.memory.chat.ChatMemoryProvider;
import dev.langchain4j.memory.chat.MessageWindowChatMemory;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

/**
 * 记忆工厂 — 根据配置创建不同策略的 ChatMemory
 */
@Slf4j
@Component
public class MemoryFactory {

  /**
   * 根据 MemoryConfig 创建 ChatMemoryProvider
   */
  public ChatMemoryProvider create(AgentDefinition.MemoryConfig config) {
    if (config == null) {
      return memoryId -> MessageWindowChatMemory.withMaxMessages(20);
    }

    return switch (config.getStrategy()) {
      case "NONE" -> memoryId -> MessageWindowChatMemory.withMaxMessages(0);
      case "TOKEN_WINDOW" -> memoryId -> createTokenWindowMemory(config);
      case "SUMMARY" -> memoryId -> createSummaryMemory(config);
      case "PERSISTENT" -> memoryId -> createPersistentMemory(config);
      default -> memoryId -> MessageWindowChatMemory.withMaxMessages(
          config.getWindowSize() != null ? config.getWindowSize() : 20);
    };
  }

  private ChatMemory createTokenWindowMemory(AgentDefinition.MemoryConfig config) {
    // TokenWindowChatMemory 需要 Tokenizer，简化为滑动窗口
    int maxMessages = config.getMaxTokens() != null ? config.getMaxTokens() / 500 : 16;
    return MessageWindowChatMemory.withMaxMessages(maxMessages);
  }

  private ChatMemory createSummaryMemory(AgentDefinition.MemoryConfig config) {
    // 摘要记忆需要 LLM 支持，简化为滑动窗口
    log.info("Summary memory requested — falling back to window memory with compaction");
    return MessageWindowChatMemory.withMaxMessages(
        config.getWindowSize() != null ? config.getWindowSize() : 10);
  }

  private ChatMemory createPersistentMemory(AgentDefinition.MemoryConfig config) {
    // 持久化记忆需要 Redis/DB 支持
    log.info("Persistent memory requested — using in-memory window as fallback");
    return MessageWindowChatMemory.withMaxMessages(
        config.getWindowSize() != null ? config.getWindowSize() : 50);
  }
}
