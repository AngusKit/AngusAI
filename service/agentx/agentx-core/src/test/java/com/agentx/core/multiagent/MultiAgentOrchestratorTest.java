package com.agentx.core.multiagent;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.contains;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.agentx.core.agent.AgentRegistry;
import com.agentx.core.agent.enums.CollaborationPattern;
import com.agentx.core.agent.multi.MultiAgentDefinition;
import com.agentx.core.agent.multi.MultiAgentOrchestrator;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

/**
 * MultiAgentOrchestrator 单元测试 — 覆盖四种协作模式 + 汇总策略
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("MultiAgentOrchestrator Tests")
class MultiAgentOrchestratorTest {

  @Mock
  private AgentRegistry agentRegistry;

  private MultiAgentOrchestrator orchestrator;

  @BeforeEach
  void setUp() {
    orchestrator = new MultiAgentOrchestrator(agentRegistry);
  }

  // ==================== SEQUENTIAL 模式 ====================

  @Nested
  @DisplayName("Sequential Pattern")
  class SequentialPattern {

    @Test
    @DisplayName("链式传递 — 逐步转发")
    void sequentialChaining() {
      MultiAgentDefinition def = MultiAgentDefinition.builder()
          .pattern(CollaborationPattern.SEQUENTIAL)
          .workers(List.of(
              MultiAgentDefinition.WorkerConfig.builder()
                  .agentId("agent-a").role("translator").build(),
              MultiAgentDefinition.WorkerConfig.builder()
                  .agentId("agent-b").role("reviewer").build(),
              MultiAgentDefinition.WorkerConfig.builder()
                  .agentId("agent-c").role("formatter").build()
          ))
          .build();

      when(agentRegistry.chat("agent-a", "s1", "input text"))
          .thenReturn("translated");
      when(agentRegistry.chat("agent-b", "s1", "translated"))
          .thenReturn("reviewed");
      when(agentRegistry.chat("agent-c", "s1", "reviewed"))
          .thenReturn("final output");

      String result = orchestrator.execute(def, "s1", "input text");

      assertEquals("final output", result);
      verify(agentRegistry).chat("agent-a", "s1", "input text");
      verify(agentRegistry).chat("agent-b", "s1", "translated");
      verify(agentRegistry).chat("agent-c", "s1", "reviewed");
    }

    @Test
    @DisplayName("单个 worker")
    void singleWorker() {
      MultiAgentDefinition def = MultiAgentDefinition.builder()
          .pattern(CollaborationPattern.SEQUENTIAL)
          .workers(List.of(
              MultiAgentDefinition.WorkerConfig.builder()
                  .agentId("only-agent").role("worker").build()
          ))
          .build();

      when(agentRegistry.chat("only-agent", "s1", "hello"))
          .thenReturn("response");

      String result = orchestrator.execute(def, "s1", "hello");
      assertEquals("response", result);
    }
  }

  // ==================== SWARM 模式 ====================

  @Nested
  @DisplayName("Swarm Pattern")
  class SwarmPattern {

    @Test
    @DisplayName("动态交接 — agents 依次处理")
    void swarmHandoff() {
      MultiAgentDefinition def = MultiAgentDefinition.builder()
          .pattern(CollaborationPattern.SWARM)
          .workers(List.of(
              MultiAgentDefinition.WorkerConfig.builder()
                  .agentId("swarm-a").role("researcher").build(),
              MultiAgentDefinition.WorkerConfig.builder()
                  .agentId("swarm-b").role("analyst").build()
          ))
          .build();

      when(agentRegistry.chat("swarm-a", "s1", "question"))
          .thenReturn("research result");
      when(agentRegistry.chat("swarm-b", "s1", "research result"))
          .thenReturn("analysis");

      String result = orchestrator.execute(def, "s1", "question");

      assertEquals("analysis", result);
    }
  }

  // ==================== ROUTER 模式 ====================

  @Nested
  @DisplayName("Router Pattern")
  class RouterPattern {

    @Test
    @DisplayName("路由到匹配的 worker")
    void routeToMatchingWorker() {
      MultiAgentDefinition def = MultiAgentDefinition.builder()
          .pattern(CollaborationPattern.ROUTER)
          .supervisor(MultiAgentDefinition.SupervisorConfig.builder()
              .agentId("router").build())
          .workers(List.of(
              MultiAgentDefinition.WorkerConfig.builder()
                  .agentId("code-expert").role("Code expert").build(),
              MultiAgentDefinition.WorkerConfig.builder()
                  .agentId("math-expert").role("Math expert").build()
          ))
          .build();

      // Router selects the matching agent
      when(agentRegistry.chat(eq("router"), eq("s1"), anyString()))
          .thenReturn("code-expert");
      when(agentRegistry.chat("code-expert", "s1", "write code"))
          .thenReturn("code result");

      String result = orchestrator.execute(def, "s1", "write code");

      assertEquals("code result", result);
    }

    @Test
    @DisplayName("路由返回无效 agentId 时使用第一个 worker")
    void routeToFirstWorkerOnInvalidId() {
      MultiAgentDefinition def = MultiAgentDefinition.builder()
          .pattern(CollaborationPattern.ROUTER)
          .supervisor(MultiAgentDefinition.SupervisorConfig.builder()
              .agentId("router").build())
          .workers(List.of(
              MultiAgentDefinition.WorkerConfig.builder()
                  .agentId("worker-1").role("default").build(),
              MultiAgentDefinition.WorkerConfig.builder()
                  .agentId("worker-2").role("backup").build()
          ))
          .build();

      // Router returns invalid agentId
      when(agentRegistry.chat(eq("router"), eq("s1"), anyString()))
          .thenReturn("invalid-agent-id");
      when(agentRegistry.chat("worker-1", "s1", "user input"))
          .thenReturn("default response");

      String result = orchestrator.execute(def, "s1", "user input");

      assertEquals("default response", result);
    }
  }

  // ==================== SUPERVISOR 模式 ====================

  @Nested
  @DisplayName("Supervisor Pattern")
  class SupervisorPattern {

    @Test
    @DisplayName("Supervisor 分解任务并汇总 — DONE 在第一轮")
    void supervisorDoneFirstRound() {
      MultiAgentDefinition def = MultiAgentDefinition.builder()
          .pattern(CollaborationPattern.SUPERVISOR)
          .supervisor(MultiAgentDefinition.SupervisorConfig.builder()
              .agentId("supervisor").maxRounds(3).build())
          .workers(List.of(
              MultiAgentDefinition.WorkerConfig.builder()
                  .agentId("worker-1").role("writer").build()
          ))
          .summarization(MultiAgentDefinition.SummarizationConfig.builder()
              .strategy("CONCAT").build())
          .build();

      // First assignment prompt — supervisor says DONE
      when(agentRegistry.chat(eq("supervisor"), eq("s1"), anyString()))
          .thenReturn("DONE");

      String result = orchestrator.execute(def, "s1", "task");

      // DONE on first round — no worker results — CONCAT of empty
      assertNotNull(result);
    }

    @Test
    @DisplayName("Supervisor 多轮分配任务")
    void supervisorMultiRound() {
      MultiAgentDefinition def = MultiAgentDefinition.builder()
          .pattern(CollaborationPattern.SUPERVISOR)
          .supervisor(MultiAgentDefinition.SupervisorConfig.builder()
              .agentId("supervisor").maxRounds(3).build())
          .workers(List.of(
              MultiAgentDefinition.WorkerConfig.builder()
                  .agentId("writer").role("writer").build()
          ))
          .summarization(MultiAgentDefinition.SummarizationConfig.builder()
              .strategy("CONCAT").build())
          .build();

      // Round 1: supervisor assigns a task
      when(agentRegistry.chat(eq("supervisor"), eq("s1"), contains("Round: 1")))
          .thenReturn("Write a summary");
      // Worker produces result
      when(agentRegistry.chat(eq("writer"), eq("s1"), eq("Write a summary")))
          .thenReturn("Summary written");
      // Round 2: supervisor says DONE
      when(agentRegistry.chat(eq("supervisor"), eq("s1"), contains("Round: 2")))
          .thenReturn("DONE");
      // Summarization: CONCAT — no supervisor call needed
      // But summarize() with CONCAT just joins results

      String result = orchestrator.execute(def, "s1", "task");

      assertTrue(result.contains("Summary written"));
    }

    @Test
    @DisplayName("maxRounds 限制轮数")
    void maxRoundsLimit() {
      MultiAgentDefinition def = MultiAgentDefinition.builder()
          .pattern(CollaborationPattern.SUPERVISOR)
          .supervisor(MultiAgentDefinition.SupervisorConfig.builder()
              .agentId("supervisor").maxRounds(1).build())
          .workers(List.of(
              MultiAgentDefinition.WorkerConfig.builder()
                  .agentId("worker").role("worker").build()
          ))
          .summarization(MultiAgentDefinition.SummarizationConfig.builder()
              .strategy("LAST_ONLY").build())
          .build();

      // Round 1: assign task
      when(agentRegistry.chat(eq("supervisor"), eq("s1"), anyString()))
          .thenReturn("Do something");
      when(agentRegistry.chat(eq("worker"), eq("s1"), eq("Do something")))
          .thenReturn("Result");

      String result = orchestrator.execute(def, "s1", "task");

      // LAST_ONLY returns last worker result
      assertEquals("worker: Result", result);
    }
  }

  // ==================== 汇总策略 ====================

  @Nested
  @DisplayName("Summarization Strategies")
  class SummarizationStrategies {

    @Test
    @DisplayName("LLM_MERGE 通过 supervisor 汇总")
    void llmMergeSummarization() {
      MultiAgentDefinition def = MultiAgentDefinition.builder()
          .pattern(CollaborationPattern.SUPERVISOR)
          .supervisor(MultiAgentDefinition.SupervisorConfig.builder()
              .agentId("supervisor").maxRounds(1).build())
          .workers(List.of(
              MultiAgentDefinition.WorkerConfig.builder()
                  .agentId("worker").role("worker").build()
          ))
          .summarization(MultiAgentDefinition.SummarizationConfig.builder()
              .strategy("LLM_MERGE").build())
          .build();

      // Round 1: assign
      when(agentRegistry.chat(eq("supervisor"), eq("s1"), contains("Round: 1")))
          .thenReturn("Do task");
      when(agentRegistry.chat(eq("worker"), eq("s1"), eq("Do task")))
          .thenReturn("Worker result");
      // LLM_MERGE summarization call
      when(agentRegistry.chat(eq("supervisor"), eq("s1"), contains("Summarize")))
          .thenReturn("Merged summary");

      String result = orchestrator.execute(def, "s1", "task");

      assertEquals("Merged summary", result);
    }

    @Test
    @DisplayName("null 汇总配置默认 CONCAT")
    void nullSummarizationDefaultsToConcat() {
      MultiAgentDefinition def = MultiAgentDefinition.builder()
          .pattern(CollaborationPattern.SUPERVISOR)
          .supervisor(MultiAgentDefinition.SupervisorConfig.builder()
              .agentId("supervisor").maxRounds(1).build())
          .workers(List.of(
              MultiAgentDefinition.WorkerConfig.builder()
                  .agentId("worker").role("worker").build()
          ))
          .summarization(null) // null
          .build();

      when(agentRegistry.chat(eq("supervisor"), eq("s1"), contains("Round: 1")))
          .thenReturn("task assignment");
      when(agentRegistry.chat(eq("worker"), eq("s1"), eq("task assignment")))
          .thenReturn("done");

      String result = orchestrator.execute(def, "s1", "input");

      // CONCAT strategy
      assertTrue(result.contains("done"));
    }
  }

  // ==================== CollaborationPattern 枚举 ====================

  @Nested
  @DisplayName("CollaborationPattern Enum")
  class CollaborationPatternEnum {

    @Test
    @DisplayName("所有协作模式枚举值")
    void allPatterns() {
      assertEquals(4, CollaborationPattern.values().length);
      assertNotNull(CollaborationPattern.ROUTER);
      assertNotNull(CollaborationPattern.SUPERVISOR);
      assertNotNull(CollaborationPattern.SWARM);
      assertNotNull(CollaborationPattern.SEQUENTIAL);
    }
  }

  // ==================== MultiAgentDefinition ====================

  @Nested
  @DisplayName("MultiAgentDefinition Builder")
  class DefinitionBuilder {

    @Test
    @DisplayName("SupervisorConfig 默认 maxRounds")
    void defaultMaxRounds() {
      MultiAgentDefinition.SupervisorConfig config =
          MultiAgentDefinition.SupervisorConfig.builder()
              .agentId("sup").build();
      assertEquals(5, config.getMaxRounds());
    }

    @Test
    @DisplayName("SummarizationConfig 默认策略")
    void defaultSummarizationStrategy() {
      MultiAgentDefinition.SummarizationConfig config =
          MultiAgentDefinition.SummarizationConfig.builder().build();
      assertEquals("LLM_MERGE", config.getStrategy());
    }
  }
}
