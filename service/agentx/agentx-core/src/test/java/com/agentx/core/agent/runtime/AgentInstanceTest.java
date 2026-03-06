package com.agentx.core.agent.runtime;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertTrue;

import com.agentx.core.agent.definition.AgentDefinition;
import com.agentx.core.agent.enums.AgentStatus;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

/**
 * AgentInstance 单元测试 — 覆盖生命周期状态转换和运行时上下文管理
 */
@DisplayName("AgentInstance Tests")
class AgentInstanceTest {

  private AgentInstance instance;
  private AgentDefinition definition;

  @BeforeEach
  void setUp() {
    definition = AgentDefinition.builder()
        .id("test-agent")
        .name("Test Agent")
        .build();
    instance = new AgentInstance(definition);
  }

  // ==================== 初始化 ====================

  @Nested
  @DisplayName("Initialization")
  class Initialization {

    @Test
    @DisplayName("构造函数正确初始化")
    void constructorInitialization() {
      assertEquals("test-agent", instance.getAgentId());
      assertEquals(definition, instance.getDefinition());
      assertEquals(AgentStatus.CONFIGURED, instance.getStatus());
      assertNotNull(instance.getCreatedAt());
      assertNull(instance.getLastInvokedAt());
      assertNotNull(instance.getRuntimeContext());
      assertTrue(instance.getRuntimeContext().isEmpty());
    }

    @Test
    @DisplayName("AiServiceProxy 初始为 null")
    void proxyInitiallyNull() {
      assertNull(instance.getAiServiceProxy());
    }
  }

  // ==================== 状态转换 ====================

  @Nested
  @DisplayName("Lifecycle State Transitions")
  class LifecycleTransitions {

    @Test
    @DisplayName("activate → RUNNING")
    void activateTransition() {
      instance.activate();
      assertEquals(AgentStatus.RUNNING, instance.getStatus());
    }

    @Test
    @DisplayName("pause → PAUSED")
    void pauseTransition() {
      instance.activate();
      instance.pause();
      assertEquals(AgentStatus.PAUSED, instance.getStatus());
    }

    @Test
    @DisplayName("archive → ARCHIVED")
    void archiveTransition() {
      instance.activate();
      instance.archive();
      assertEquals(AgentStatus.ARCHIVED, instance.getStatus());
    }

    @Test
    @DisplayName("CONFIGURED → RUNNING → PAUSED → RUNNING → ARCHIVED")
    void fullLifecycle() {
      assertEquals(AgentStatus.CONFIGURED, instance.getStatus());

      instance.activate();
      assertEquals(AgentStatus.RUNNING, instance.getStatus());

      instance.pause();
      assertEquals(AgentStatus.PAUSED, instance.getStatus());

      instance.activate();
      assertEquals(AgentStatus.RUNNING, instance.getStatus());

      instance.archive();
      assertEquals(AgentStatus.ARCHIVED, instance.getStatus());
    }

    @Test
    @DisplayName("直接从 CONFIGURED 归档")
    void directArchive() {
      instance.archive();
      assertEquals(AgentStatus.ARCHIVED, instance.getStatus());
    }
  }

  // ==================== 调用记录 ====================

  @Nested
  @DisplayName("Invocation Recording")
  class InvocationRecording {

    @Test
    @DisplayName("首次调用记录 lastInvokedAt")
    void firstInvocation() {
      assertNull(instance.getLastInvokedAt());
      instance.recordInvocation();
      assertNotNull(instance.getLastInvokedAt());
    }

    @Test
    @DisplayName("多次调用更新 lastInvokedAt")
    void multipleInvocations() throws InterruptedException {
      instance.recordInvocation();
      var first = instance.getLastInvokedAt();
      Thread.sleep(5);
      instance.recordInvocation();
      var second = instance.getLastInvokedAt();
      assertTrue(second.isAfter(first) || second.equals(first));
    }
  }

  // ==================== 运行时上下文 ====================

  @Nested
  @DisplayName("Runtime Context")
  class RuntimeContext {

    @Test
    @DisplayName("存取上下文变量")
    void putAndGetContext() {
      instance.putContext("key1", "value1");
      assertEquals("value1", instance.<String>getContext("key1"));
    }

    @Test
    @DisplayName("获取不存在的键返回 null")
    void getNotExists() {
      assertNull(instance.getContext("nonexistent"));
    }

    @Test
    @DisplayName("覆盖已有上下文")
    void overwriteContext() {
      instance.putContext("key", "old");
      instance.putContext("key", "new");
      assertEquals("new", instance.<String>getContext("key"));
    }

    @Test
    @DisplayName("支持不同类型值")
    void differentTypes() {
      instance.putContext("string", "hello");
      instance.putContext("number", 42);
      instance.putContext("list", java.util.List.of("a", "b"));

      assertEquals("hello", instance.<String>getContext("string"));
      assertEquals(42, instance.<Integer>getContext("number"));
      assertEquals(2, instance.<java.util.List<String>>getContext("list").size());
    }
  }

  // ==================== AiServiceProxy ====================

  @Nested
  @DisplayName("AiService Proxy")
  class AiServiceProxy {

    @Test
    @DisplayName("设置和获取 proxy")
    void setAndGetProxy() {
      Object mockProxy = new Object();
      instance.setAiServiceProxy(mockProxy);
      assertSame(mockProxy, instance.getAiServiceProxy());
    }
  }
}
