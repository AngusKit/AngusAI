package cloud.xcan.core.core.workflow.engine;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import cloud.xcan.agentx.core.workflow.dsl.NodeDefinition;
import cloud.xcan.agentx.core.workflow.dsl.WorkflowDefinition;
import cloud.xcan.agentx.core.workflow.engine.NodeExecutionContext;
import cloud.xcan.agentx.core.workflow.engine.NodeExecutionStatus;
import cloud.xcan.agentx.core.workflow.engine.NodeExecutor;
import cloud.xcan.agentx.core.workflow.engine.WorkflowEngine;
import cloud.xcan.agentx.core.workflow.engine.WorkflowExecutionResult;
import cloud.xcan.agentx.core.workflow.engine.WorkflowExecutionStatus;
import cloud.xcan.agentx.core.workflow.enums.FailurePolicy;
import cloud.xcan.agentx.core.workflow.enums.NodeType;
import cloud.xcan.agentx.core.workflow.expression.ExpressionEngine;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

/**
 * WorkflowEngine 单元测试 — 覆盖拓扑排序、顺序执行、失败策略、变量合并、所有节点类型
 */
@DisplayName("WorkflowEngine Tests")
class WorkflowEngineTest {

  private ExpressionEngine expressionEngine;

  @BeforeEach
  void setUp() {
    expressionEngine = new ExpressionEngine();
  }

  private WorkflowEngine createEngine(List<NodeExecutor> executors) {
    return new WorkflowEngine(expressionEngine, executors);
  }

  // ==================== 简单工作流执行 ====================

  @Nested
  @DisplayName("Simple Workflow Execution")
  class SimpleExecution {

    @Test
    @DisplayName("执行 START → END 最简工作流")
    void executeMinimalWorkflow() {
      List<NodeExecutor> executors = List.of(
          new SimpleExecutor("START", Map.of("started", true)),
          new SimpleExecutor("END", Map.of("status", "done"))
      );

      WorkflowEngine engine = createEngine(executors);
      WorkflowDefinition wf = WorkflowDefinition.builder()
          .id("wf-1")
          .name("Simple")
          .nodes(List.of(
              NodeDefinition.builder().id("start").type(NodeType.START).next("end").build(),
              NodeDefinition.builder().id("end").type(NodeType.END).build()
          ))
          .build();

      WorkflowExecutionResult result = engine.execute(wf, null);

      assertEquals(WorkflowExecutionStatus.COMPLETED, result.getStatus());
      assertNotNull(result.getExecutionId());
      assertNotNull(result.getStartedAt());
      assertNotNull(result.getCompletedAt());
      assertTrue(result.getDurationMs() >= 0);
      assertEquals(2, result.getNodeRecords().size());

      // END node output is final output
      assertEquals("done", result.getOutput().get("status"));
    }

    @Test
    @DisplayName("执行三节点线性工作流")
    void executeThreeNodeLinearWorkflow() {
      List<NodeExecutor> executors = List.of(
          new SimpleExecutor("START", Map.of()),
          new SimpleExecutor("SET_VARIABLE", Map.of("x", "set")),
          new SimpleExecutor("END", Map.of("result", "ok"))
      );

      WorkflowEngine engine = createEngine(executors);
      WorkflowDefinition wf = WorkflowDefinition.builder()
          .id("wf-3")
          .name("Three Nodes")
          .nodes(List.of(
              NodeDefinition.builder().id("start").type(NodeType.START).next("mid").build(),
              NodeDefinition.builder().id("mid").type(NodeType.SET_VARIABLE).next("end").build(),
              NodeDefinition.builder().id("end").type(NodeType.END).build()
          ))
          .build();

      WorkflowExecutionResult result = engine.execute(wf, null);

      assertEquals(WorkflowExecutionStatus.COMPLETED, result.getStatus());
      assertEquals(3, result.getNodeRecords().size());
      result.getNodeRecords()
          .forEach(r -> assertEquals(NodeExecutionStatus.SUCCESS, r.getStatus()));
    }
  }

  // ==================== 变量处理 ====================

  @Nested
  @DisplayName("Variable Handling")
  class VariableHandling {

    @Test
    @DisplayName("工作流默认变量被传递")
    void workflowDefaultVariables() {
      VariableCapturingExecutor capturer = new VariableCapturingExecutor("START");
      List<NodeExecutor> executors = List.of(
          capturer,
          new SimpleExecutor("END", Map.of())
      );

      WorkflowEngine engine = createEngine(executors);
      WorkflowDefinition wf = WorkflowDefinition.builder()
          .id("wf-vars")
          .name("Vars")
          .variables(Map.of("defaultKey", "defaultValue"))
          .nodes(List.of(
              NodeDefinition.builder().id("start").type(NodeType.START).next("end").build(),
              NodeDefinition.builder().id("end").type(NodeType.END).build()
          ))
          .build();

      engine.execute(wf, null);

      assertEquals("defaultValue", capturer.capturedVariables.get("defaultKey"));
    }

    @Test
    @DisplayName("输入变量覆盖默认变量")
    void inputVariablesOverrideDefaults() {
      VariableCapturingExecutor capturer = new VariableCapturingExecutor("START");
      List<NodeExecutor> executors = List.of(
          capturer,
          new SimpleExecutor("END", Map.of())
      );

      WorkflowEngine engine = createEngine(executors);
      WorkflowDefinition wf = WorkflowDefinition.builder()
          .id("wf-override")
          .name("Override")
          .variables(Map.of("key", "default"))
          .nodes(List.of(
              NodeDefinition.builder().id("start").type(NodeType.START).next("end").build(),
              NodeDefinition.builder().id("end").type(NodeType.END).build()
          ))
          .build();

      engine.execute(wf, Map.of("key", "overridden"));

      assertEquals("overridden", capturer.capturedVariables.get("key"));
    }

    @Test
    @DisplayName("null 输入变量不报错")
    void nullInputVariables() {
      List<NodeExecutor> executors = List.of(
          new SimpleExecutor("START", Map.of()),
          new SimpleExecutor("END", Map.of())
      );

      WorkflowEngine engine = createEngine(executors);
      WorkflowDefinition wf = WorkflowDefinition.builder()
          .id("wf-null-input")
          .name("Null Input")
          .nodes(List.of(
              NodeDefinition.builder().id("start").type(NodeType.START).next("end").build(),
              NodeDefinition.builder().id("end").type(NodeType.END).build()
          ))
          .build();

      WorkflowExecutionResult result = engine.execute(wf, null);
      assertEquals(WorkflowExecutionStatus.COMPLETED, result.getStatus());
    }
  }

  // ==================== 失败策略 ====================

  @Nested
  @DisplayName("Failure Policies")
  class FailurePolicies {

    @Test
    @DisplayName("STOP 策略：节点失败时停止执行")
    void stopPolicyStopsOnFailure() {
      List<NodeExecutor> executors = List.of(
          new SimpleExecutor("START", Map.of()),
          new FailingExecutor("HTTP"),
          new SimpleExecutor("END", Map.of())
      );

      WorkflowEngine engine = createEngine(executors);
      WorkflowDefinition wf = WorkflowDefinition.builder()
          .id("wf-stop")
          .name("Stop")
          .settings(WorkflowDefinition.WorkflowSettings.builder()
              .onFailure(FailurePolicy.STOP).build())
          .nodes(List.of(
              NodeDefinition.builder().id("start").type(NodeType.START).next("http").build(),
              NodeDefinition.builder().id("http").type(NodeType.HTTP).next("end").build(),
              NodeDefinition.builder().id("end").type(NodeType.END).build()
          ))
          .build();

      WorkflowExecutionResult result = engine.execute(wf, null);

      assertEquals(WorkflowExecutionStatus.FAILED, result.getStatus());
      assertNotNull(result.getOutput().get("error"));
      // Should not have executed END
      assertTrue(result.getNodeRecords().size() < 3);
    }

    @Test
    @DisplayName("CONTINUE 策略：节点失败后继续执行")
    void continuePolicyContinuesOnFailure() {
      List<NodeExecutor> executors = List.of(
          new SimpleExecutor("START", Map.of()),
          new FailingExecutor("HTTP"),
          new SimpleExecutor("END", Map.of("result", "ok"))
      );

      WorkflowEngine engine = createEngine(executors);
      WorkflowDefinition wf = WorkflowDefinition.builder()
          .id("wf-continue")
          .name("Continue")
          .settings(WorkflowDefinition.WorkflowSettings.builder()
              .onFailure(FailurePolicy.CONTINUE).build())
          .nodes(List.of(
              NodeDefinition.builder().id("start").type(NodeType.START).next("http").build(),
              NodeDefinition.builder().id("http").type(NodeType.HTTP).next("end").build(),
              NodeDefinition.builder().id("end").type(NodeType.END).build()
          ))
          .build();

      WorkflowExecutionResult result = engine.execute(wf, null);

      assertEquals(WorkflowExecutionStatus.COMPLETED, result.getStatus());
      assertEquals(3, result.getNodeRecords().size());
      assertEquals(NodeExecutionStatus.FAILED, result.getNodeRecords().get(1).getStatus());
      assertEquals(NodeExecutionStatus.SUCCESS, result.getNodeRecords().get(2).getStatus());
    }

    @Test
    @DisplayName("默认策略为 STOP")
    void defaultPolicyIsStop() {
      List<NodeExecutor> executors = List.of(
          new SimpleExecutor("START", Map.of()),
          new FailingExecutor("HTTP"),
          new SimpleExecutor("END", Map.of())
      );

      WorkflowEngine engine = createEngine(executors);
      WorkflowDefinition wf = WorkflowDefinition.builder()
          .id("wf-default")
          .name("Default")
          // No settings → default STOP
          .nodes(List.of(
              NodeDefinition.builder().id("start").type(NodeType.START).next("http").build(),
              NodeDefinition.builder().id("http").type(NodeType.HTTP).next("end").build(),
              NodeDefinition.builder().id("end").type(NodeType.END).build()
          ))
          .build();

      WorkflowExecutionResult result = engine.execute(wf, null);
      assertEquals(WorkflowExecutionStatus.FAILED, result.getStatus());
    }
  }

  // ==================== 拓扑排序 ====================

  @Nested
  @DisplayName("Topological Sort")
  class TopologicalSort {

    @Test
    @DisplayName("按 next 链确定执行顺序")
    void executionFollowsNextChain() {
      List<String> executionOrder = Collections.synchronizedList(new ArrayList<>());
      List<NodeExecutor> executors = List.of(
          new OrderTrackingExecutor("START", executionOrder),
          new OrderTrackingExecutor("SET_VARIABLE", executionOrder),
          new OrderTrackingExecutor("END", executionOrder)
      );

      WorkflowEngine engine = createEngine(executors);
      WorkflowDefinition wf = WorkflowDefinition.builder()
          .id("wf-order")
          .name("Order")
          .nodes(List.of(
              NodeDefinition.builder().id("start").type(NodeType.START).next("mid").build(),
              NodeDefinition.builder().id("mid").type(NodeType.SET_VARIABLE).next("end").build(),
              NodeDefinition.builder().id("end").type(NodeType.END).build()
          ))
          .build();

      engine.execute(wf, null);

      assertEquals(List.of("start", "mid", "end"), executionOrder);
    }

    @Test
    @DisplayName("条件分支的拓扑排序包含所有分支")
    void conditionBranchesInTopologicalOrder() {
      List<String> executionOrder = Collections.synchronizedList(new ArrayList<>());
      List<NodeExecutor> executors = List.of(
          new OrderTrackingExecutor("START", executionOrder),
          new OrderTrackingExecutor("CONDITION", executionOrder),
          new OrderTrackingExecutor("SET_VARIABLE", executionOrder),
          new OrderTrackingExecutor("END", executionOrder)
      );

      WorkflowEngine engine = createEngine(executors);
      WorkflowDefinition wf = WorkflowDefinition.builder()
          .id("wf-cond-order")
          .name("Cond Order")
          .nodes(List.of(
              NodeDefinition.builder().id("start").type(NodeType.START).next("cond").build(),
              NodeDefinition.builder().id("cond").type(NodeType.CONDITION)
                  .config(Map.of("expression", "true", "ifTrue", "a", "ifFalse", "b"))
                  .build(),
              NodeDefinition.builder().id("a").type(NodeType.SET_VARIABLE).next("end").build(),
              NodeDefinition.builder().id("b").type(NodeType.SET_VARIABLE).next("end").build(),
              NodeDefinition.builder().id("end").type(NodeType.END).build()
          ))
          .build();

      engine.execute(wf, null);

      // All nodes should be executed in topological order
      assertTrue(executionOrder.indexOf("start") < executionOrder.indexOf("cond"));
    }

    @Test
    @DisplayName("PARALLEL 分支的拓扑排序")
    void parallelBranchesInTopologicalOrder() {
      List<String> executionOrder = Collections.synchronizedList(new ArrayList<>());
      List<NodeExecutor> executors = List.of(
          new OrderTrackingExecutor("START", executionOrder),
          new OrderTrackingExecutor("PARALLEL", executionOrder),
          new OrderTrackingExecutor("SET_VARIABLE", executionOrder),
          new OrderTrackingExecutor("END", executionOrder)
      );

      WorkflowEngine engine = createEngine(executors);
      WorkflowDefinition wf = WorkflowDefinition.builder()
          .id("wf-par-order")
          .name("Par Order")
          .nodes(List.of(
              NodeDefinition.builder().id("start").type(NodeType.START).next("par").build(),
              NodeDefinition.builder().id("par").type(NodeType.PARALLEL)
                  .config(Map.of("branches", List.of("b1", "b2")))
                  .next("end").build(),
              NodeDefinition.builder().id("b1").type(NodeType.SET_VARIABLE).build(),
              NodeDefinition.builder().id("b2").type(NodeType.SET_VARIABLE).build(),
              NodeDefinition.builder().id("end").type(NodeType.END).build()
          ))
          .build();

      engine.execute(wf, null);

      assertTrue(executionOrder.contains("start"));
      assertTrue(executionOrder.contains("par"));
      assertTrue(executionOrder.contains("end"));
    }
  }

  // ==================== 节点输出记录 ====================

  @Nested
  @DisplayName("Node Execution Records")
  class NodeRecords {

    @Test
    @DisplayName("记录每个节点的执行状态和输出")
    void recordNodeExecutionDetails() {
      List<NodeExecutor> executors = List.of(
          new SimpleExecutor("START", Map.of("key", "val")),
          new SimpleExecutor("END", Map.of("result", "ok"))
      );

      WorkflowEngine engine = createEngine(executors);
      WorkflowDefinition wf = WorkflowDefinition.builder()
          .id("wf-records")
          .name("Records")
          .nodes(List.of(
              NodeDefinition.builder().id("start").type(NodeType.START).next("end").build(),
              NodeDefinition.builder().id("end").type(NodeType.END).build()
          ))
          .build();

      WorkflowExecutionResult result = engine.execute(wf, null);

      assertEquals(2, result.getNodeRecords().size());

      WorkflowExecutionResult.NodeExecutionRecord startRecord = result.getNodeRecords().get(0);
      assertEquals("start", startRecord.getNodeId());
      assertEquals(NodeType.START.name(), startRecord.getNodeType());
      assertEquals(NodeExecutionStatus.SUCCESS, startRecord.getStatus());
      assertNotNull(startRecord.getStartedAt());
      assertNotNull(startRecord.getCompletedAt());
      assertTrue(startRecord.getDurationMs() >= 0);
    }

    @Test
    @DisplayName("失败记录包含错误信息")
    void failedRecordContainsError() {
      List<NodeExecutor> executors = List.of(
          new SimpleExecutor("START", Map.of()),
          new FailingExecutor("HTTP"),
          new SimpleExecutor("END", Map.of())
      );

      WorkflowEngine engine = createEngine(executors);
      WorkflowDefinition wf = WorkflowDefinition.builder()
          .id("wf-fail-record")
          .name("Fail Record")
          .settings(WorkflowDefinition.WorkflowSettings.builder()
              .onFailure(FailurePolicy.CONTINUE).build())
          .nodes(List.of(
              NodeDefinition.builder().id("start").type(NodeType.START).next("http").build(),
              NodeDefinition.builder().id("http").type(NodeType.HTTP).next("end").build(),
              NodeDefinition.builder().id("end").type(NodeType.END).build()
          ))
          .build();

      WorkflowExecutionResult result = engine.execute(wf, null);

      WorkflowExecutionResult.NodeExecutionRecord httpRecord = result.getNodeRecords().get(1);
      assertEquals(NodeExecutionStatus.FAILED, httpRecord.getStatus());
      assertNotNull(httpRecord.getError());
    }
  }

  // ==================== 无执行器的节点 ====================

  @Nested
  @DisplayName("Missing Executor Handling")
  class MissingExecutor {

    @Test
    @DisplayName("无执行器的节点类型被跳过")
    void nodeWithoutExecutorIsSkipped() {
      // Only provide START executor, not END
      List<NodeExecutor> executors = List.of(
          new SimpleExecutor("START", Map.of())
      );

      WorkflowEngine engine = createEngine(executors);
      WorkflowDefinition wf = WorkflowDefinition.builder()
          .id("wf-skip")
          .name("Skip")
          .nodes(List.of(
              NodeDefinition.builder().id("start").type(NodeType.START).next("end").build(),
              NodeDefinition.builder().id("end").type(NodeType.END).build()
          ))
          .build();

      WorkflowExecutionResult result = engine.execute(wf, null);

      assertEquals(WorkflowExecutionStatus.COMPLETED, result.getStatus());
      // Only START node should have a record
      assertEquals(1, result.getNodeRecords().size());
    }
  }

  // ==================== 复杂工作流 ====================

  @Nested
  @DisplayName("Complex Workflow Execution")
  class ComplexWorkflows {

    @Test
    @DisplayName("多分支条件工作流执行")
    void multiBranchConditionWorkflow() {
      List<NodeExecutor> executors = List.of(
          new SimpleExecutor("START", Map.of()),
          new SimpleExecutor("CONDITION", Map.of("result", true, "nextNode", "a")),
          new SimpleExecutor("SET_VARIABLE", Map.of("executed", true)),
          new SimpleExecutor("END", Map.of("final", "done"))
      );

      WorkflowEngine engine = createEngine(executors);
      WorkflowDefinition wf = WorkflowDefinition.builder()
          .id("wf-multi-branch")
          .name("Multi Branch")
          .nodes(List.of(
              NodeDefinition.builder().id("start").type(NodeType.START).next("cond").build(),
              NodeDefinition.builder().id("cond").type(NodeType.CONDITION)
                  .config(Map.of("expression", "true", "ifTrue", "a", "ifFalse", "b"))
                  .build(),
              NodeDefinition.builder().id("a").type(NodeType.SET_VARIABLE).next("end").build(),
              NodeDefinition.builder().id("b").type(NodeType.SET_VARIABLE).next("end").build(),
              NodeDefinition.builder().id("end").type(NodeType.END).build()
          ))
          .build();

      WorkflowExecutionResult result = engine.execute(wf, null);

      assertEquals(WorkflowExecutionStatus.COMPLETED, result.getStatus());
      assertTrue(result.getNodeRecords().size() >= 3);
    }

    @Test
    @DisplayName("长链工作流执行")
    void longChainWorkflow() {
      List<NodeExecutor> executors = List.of(
          new SimpleExecutor("START", Map.of()),
          new SimpleExecutor("SET_VARIABLE", Map.of()),
          new SimpleExecutor("END", Map.of("done", true))
      );

      WorkflowEngine engine = createEngine(executors);

      List<NodeDefinition> nodes = new ArrayList<>();
      nodes.add(NodeDefinition.builder().id("start").type(NodeType.START).next("n1").build());
      for (int i = 1; i <= 10; i++) {
        String next = i < 10 ? "n" + (i + 1) : "end";
        nodes.add(
            NodeDefinition.builder().id("n" + i).type(NodeType.SET_VARIABLE).next(next).build());
      }
      nodes.add(NodeDefinition.builder().id("end").type(NodeType.END).build());

      WorkflowDefinition wf = WorkflowDefinition.builder()
          .id("wf-long")
          .name("Long Chain")
          .nodes(nodes)
          .build();

      WorkflowExecutionResult result = engine.execute(wf, null);

      assertEquals(WorkflowExecutionStatus.COMPLETED, result.getStatus());
      assertEquals(12, result.getNodeRecords().size());
    }
  }

  // ==================== 辅助测试执行器 ====================

  /**
   * 简单测试执行器：返回固定输出
   */
  static class SimpleExecutor implements NodeExecutor {

    private final String nodeType;
    private final Map<String, Object> output;

    SimpleExecutor(String nodeType, Map<String, Object> output) {
      this.nodeType = nodeType;
      this.output = output;
    }

    @Override
    public String getNodeType() {
      return nodeType;
    }

    @Override
    public Map<String, Object> execute(NodeExecutionContext context) {
      return output;
    }
  }

  /**
   * 始终抛异常的执行器
   */
  static class FailingExecutor implements NodeExecutor {

    private final String nodeType;

    FailingExecutor(String nodeType) {
      this.nodeType = nodeType;
    }

    @Override
    public String getNodeType() {
      return nodeType;
    }

    @Override
    public Map<String, Object> execute(NodeExecutionContext context) {
      throw new RuntimeException("Simulated failure");
    }
  }

  /**
   * 捕获上下文变量的执行器
   */
  static class VariableCapturingExecutor implements NodeExecutor {

    private final String nodeType;
    Map<String, Object> capturedVariables;

    VariableCapturingExecutor(String nodeType) {
      this.nodeType = nodeType;
    }

    @Override
    public String getNodeType() {
      return nodeType;
    }

    @Override
    public Map<String, Object> execute(NodeExecutionContext context) {
      capturedVariables = new HashMap<>(context.getVariables());
      return Map.of();
    }
  }

  /**
   * 记录执行顺序的执行器
   */
  static class OrderTrackingExecutor implements NodeExecutor {

    private final String nodeType;
    private final List<String> executionOrder;

    OrderTrackingExecutor(String nodeType, List<String> executionOrder) {
      this.nodeType = nodeType;
      this.executionOrder = executionOrder;
    }

    @Override
    public String getNodeType() {
      return nodeType;
    }

    @Override
    public Map<String, Object> execute(NodeExecutionContext context) {
      executionOrder.add(context.getNodeDefinition().getId());
      return Map.of();
    }
  }
}
