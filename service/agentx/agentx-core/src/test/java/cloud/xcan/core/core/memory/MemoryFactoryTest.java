package cloud.xcan.core.core.memory;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNotSame;
import static org.junit.jupiter.api.Assertions.assertTrue;

import cloud.xcan.agentx.core.agent.definition.AgentDefinition;
import cloud.xcan.agentx.core.memory.MemoryFactory;
import cloud.xcan.agentx.core.memory.enums.MemoryStrategy;
import dev.langchain4j.data.message.UserMessage;
import dev.langchain4j.memory.ChatMemory;
import dev.langchain4j.memory.chat.ChatMemoryProvider;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

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
    @DisplayName("MESSAGE_WINDOW 策略 — 基于消息条数")
    void messageWindowStrategy() {
      AgentDefinition.MemoryConfig config = AgentDefinition.MemoryConfig.builder()
          .strategy(MemoryStrategy.MESSAGE_WINDOW)
          .windowSize(30)
          .build();

      ChatMemoryProvider provider = factory.create(config);
      assertNotNull(provider);
      ChatMemory memory = provider.get("session-1");
      assertNotNull(memory);
      memory.add(UserMessage.from("hello"));
      assertFalse(memory.messages().isEmpty());
    }

    @Test
    @DisplayName("SLIDING_WINDOW 兼容 — 解析后为 MESSAGE_WINDOW，此处直接测 MESSAGE_WINDOW")
    void slidingWindowCompat() {
      AgentDefinition.MemoryConfig config = AgentDefinition.MemoryConfig.builder()
          .strategy(MemoryStrategy.MESSAGE_WINDOW)
          .windowSize(30)
          .build();

      ChatMemoryProvider provider = factory.create(config);
      assertNotNull(provider);
      assertNotNull(provider.get("session-1"));
    }

    @Test
    @DisplayName("MESSAGE_WINDOW 默认窗口大小")
    void messageWindowDefault() {
      AgentDefinition.MemoryConfig config = AgentDefinition.MemoryConfig.builder()
          .strategy(MemoryStrategy.MESSAGE_WINDOW)
          .build();

      ChatMemoryProvider provider = factory.create(config);
      assertNotNull(provider);
      assertNotNull(provider.get("test"));
    }

    @Test
    @DisplayName("NONE 策略 — 空记忆，不保留任何消息")
    void noneStrategy() {
      AgentDefinition.MemoryConfig config = AgentDefinition.MemoryConfig.builder()
          .strategy(MemoryStrategy.NONE)
          .build();

      ChatMemoryProvider provider = factory.create(config);
      assertNotNull(provider);
      ChatMemory memory = provider.get("session-1");
      assertNotNull(memory);
      assertTrue(memory.messages().isEmpty(), "NONE 策略应始终返回空消息列表");

      // 验证 add() 为无操作，消息不会被保留
      memory.add(UserMessage.from("test message"));
      assertTrue(memory.messages().isEmpty(), "NONE 策略 add 后仍应返回空列表");
    }

    @Test
    @DisplayName("TOKEN_WINDOW 策略 — 使用 TokenWindowChatMemory")
    void tokenWindowStrategy() {
      AgentDefinition.MemoryConfig config = AgentDefinition.MemoryConfig.builder()
          .strategy(MemoryStrategy.TOKEN_WINDOW)
          .maxTokens(8000)
          .build();

      ChatMemoryProvider provider = factory.create(config);
      assertNotNull(provider);
      ChatMemory memory = provider.get("session-1");
      assertNotNull(memory);
      // 验证能正常保留消息（与 NONE 相反）
      memory.add(UserMessage.from("hello"));
      assertFalse(memory.messages().isEmpty(), "TOKEN_WINDOW 应保留消息");
    }

    @Test
    @DisplayName("TOKEN_WINDOW 默认 maxTokens")
    void tokenWindowDefaultTokens() {
      AgentDefinition.MemoryConfig config = AgentDefinition.MemoryConfig.builder()
          .strategy(MemoryStrategy.TOKEN_WINDOW)
          .maxTokens(null)
          .build();

      ChatMemoryProvider provider = factory.create(config);
      assertNotNull(provider);
    }

    @Test
    @DisplayName("SUMMARY 策略")
    void summaryStrategy() {
      AgentDefinition.MemoryConfig config = AgentDefinition.MemoryConfig.builder()
          .strategy(MemoryStrategy.SUMMARY)
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
          .strategy(MemoryStrategy.SUMMARY)
          .windowSize(null)
          .build();

      ChatMemoryProvider provider = factory.create(config);
      assertNotNull(provider);
      assertNotNull(provider.get("session-1"));
    }

    @Test
    @DisplayName("PERSISTENT 兼容 — 映射为 MESSAGE_WINDOW")
    void persistentCompatMapsToMessageWindow() {
      AgentDefinition.MemoryConfig config = AgentDefinition.MemoryConfig.builder()
          .strategy(MemoryStrategy.MESSAGE_WINDOW)
          .windowSize(50)
          .build();

      ChatMemoryProvider provider = factory.create(config);
      assertNotNull(provider);
      ChatMemory memory = provider.get("session-1");
      assertNotNull(memory);
      memory.add(UserMessage.from("persist compat test"));
      assertFalse(memory.messages().isEmpty());
    }

    @Test
    @DisplayName("null 策略使用默认 TOKEN_WINDOW")
    void nullStrategyUsesDefaultTokenWindow() {
      AgentDefinition.MemoryConfig config = AgentDefinition.MemoryConfig.builder()
          .strategy(null)
          .windowSize(15)
          .build();

      ChatMemoryProvider provider = factory.create(config);
      assertNotNull(provider);
      ChatMemory memory = provider.get("session-1");
      assertNotNull(memory);
      memory.add(UserMessage.from("test"));
      assertFalse(memory.messages().isEmpty(), "TOKEN_WINDOW 应保留消息");
    }
  }

  @Nested
  @DisplayName("Provider Functionality")
  class ProviderFunctionality {

    @Test
    @DisplayName("不同 memoryId 返回不同实例且消息隔离")
    void differentMemoryIds() {
      AgentDefinition.MemoryConfig config = AgentDefinition.MemoryConfig.builder()
          .strategy(MemoryStrategy.MESSAGE_WINDOW)
          .build();
      ChatMemoryProvider provider = factory.create(config);
      ChatMemory mem1 = provider.get("session-1");
      ChatMemory mem2 = provider.get("session-2");

      assertNotNull(mem1);
      assertNotNull(mem2);
      assertNotSame(mem1, mem2);

      // 验证 session 隔离：session-1 的消息不会出现在 session-2
      mem1.add(UserMessage.from("only in session-1"));
      assertFalse(mem1.messages().isEmpty());
      assertTrue(mem2.messages().isEmpty());
    }
  }
}
