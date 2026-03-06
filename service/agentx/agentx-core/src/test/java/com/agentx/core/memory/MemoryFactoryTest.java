package com.agentx.core.memory;

import com.agentx.core.agent.definition.AgentDefinition;
import dev.langchain4j.memory.chat.ChatMemoryProvider;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

/**
 * MemoryFactory 单元测试 — 覆盖所有记忆策略
 */
@DisplayName("MemoryFactory Tests")
class MemoryFactoryTest {

  private MemoryFactory factory;

  @BeforeEach
  void setUp() {
    factory = new MemoryFactory();
  }

  @Nested
  @DisplayName("Strategy Selection")
  class StrategySelection {

    @Test
    @DisplayName("null 配置 — 默认策略")
    void nullConfig() {
      ChatMemoryProvider provider = factory.create(null);
      assertNotNull(provider);
      assertNotNull(provider.get("session-1"));
    }

    @Test
    @DisplayName("SLIDING_WINDOW 策略")
    void slidingWindowStrategy() {
      AgentDefinition.MemoryConfig config = AgentDefinition.MemoryConfig.builder()
          .strategy("SLIDING_WINDOW")
          .windowSize(30)
          .build();

      ChatMemoryProvider provider = factory.create(config);
      assertNotNull(provider);
      assertNotNull(provider.get("session-1"));
    }

    @Test
    @DisplayName("SLIDING_WINDOW 默认窗口大小")
    void slidingWindowDefault() {
      AgentDefinition.MemoryConfig config = AgentDefinition.MemoryConfig.builder()
          .strategy("SLIDING_WINDOW")
          .build();

      ChatMemoryProvider provider = factory.create(config);
      assertNotNull(provider);
      assertNotNull(provider.get("test"));
    }

    @Test
    @DisplayName("NONE 策略")
    void noneStrategy() {
      AgentDefinition.MemoryConfig config = AgentDefinition.MemoryConfig.builder()
          .strategy("NONE")
          .build();

      ChatMemoryProvider provider = factory.create(config);
      assertNotNull(provider);
      assertNotNull(provider.get("session-1"));
    }

    @Test
    @DisplayName("TOKEN_WINDOW 策略")
    void tokenWindowStrategy() {
      AgentDefinition.MemoryConfig config = AgentDefinition.MemoryConfig.builder()
          .strategy("TOKEN_WINDOW")
          .maxTokens(8000)
          .build();

      ChatMemoryProvider provider = factory.create(config);
      assertNotNull(provider);
      assertNotNull(provider.get("session-1"));
    }

    @Test
    @DisplayName("TOKEN_WINDOW 默认 maxTokens")
    void tokenWindowDefaultTokens() {
      AgentDefinition.MemoryConfig config = AgentDefinition.MemoryConfig.builder()
          .strategy("TOKEN_WINDOW")
          .maxTokens(null)
          .build();

      ChatMemoryProvider provider = factory.create(config);
      assertNotNull(provider);
    }

    @Test
    @DisplayName("SUMMARY 策略")
    void summaryStrategy() {
      AgentDefinition.MemoryConfig config = AgentDefinition.MemoryConfig.builder()
          .strategy("SUMMARY")
          .windowSize(10)
          .build();

      ChatMemoryProvider provider = factory.create(config);
      assertNotNull(provider);
      assertNotNull(provider.get("session-1"));
    }

    @Test
    @DisplayName("SUMMARY 默认窗口大小")
    void summaryDefaultWindow() {
      AgentDefinition.MemoryConfig config = AgentDefinition.MemoryConfig.builder()
          .strategy("SUMMARY")
          .windowSize(null)
          .build();

      ChatMemoryProvider provider = factory.create(config);
      assertNotNull(provider);
    }

    @Test
    @DisplayName("PERSISTENT 策略")
    void persistentStrategy() {
      AgentDefinition.MemoryConfig config = AgentDefinition.MemoryConfig.builder()
          .strategy("PERSISTENT")
          .windowSize(50)
          .build();

      ChatMemoryProvider provider = factory.create(config);
      assertNotNull(provider);
      assertNotNull(provider.get("session-1"));
    }

    @Test
    @DisplayName("PERSISTENT 默认窗口大小")
    void persistentDefaultWindow() {
      AgentDefinition.MemoryConfig config = AgentDefinition.MemoryConfig.builder()
          .strategy("PERSISTENT")
          .windowSize(null)
          .build();

      ChatMemoryProvider provider = factory.create(config);
      assertNotNull(provider);
    }

    @Test
    @DisplayName("未知策略使用默认 SLIDING_WINDOW")
    void unknownStrategy() {
      AgentDefinition.MemoryConfig config = AgentDefinition.MemoryConfig.builder()
          .strategy("UNKNOWN_STRATEGY")
          .windowSize(15)
          .build();

      ChatMemoryProvider provider = factory.create(config);
      assertNotNull(provider);
      assertNotNull(provider.get("session-1"));
    }
  }

  @Nested
  @DisplayName("Provider Functionality")
  class ProviderFunctionality {

    @Test
    @DisplayName("不同 memoryId 返回不同实例")
    void differentMemoryIds() {
      ChatMemoryProvider provider = factory.create(null);
      var mem1 = provider.get("session-1");
      var mem2 = provider.get("session-2");

      assertNotNull(mem1);
      assertNotNull(mem2);
      assertNotSame(mem1, mem2);
    }
  }
}
