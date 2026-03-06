package com.agentx.core.workflow.node;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import com.agentx.core.workflow.InMemoryWorkflowDefinitionProvider;
import com.agentx.core.workflow.WorkflowDefinitionProvider;
import com.agentx.core.workflow.dsl.NodeDefinition;
import com.agentx.core.workflow.dsl.WorkflowDefinition;
import com.agentx.core.workflow.engine.NodeExecutionContext;
import com.agentx.core.workflow.engine.WorkflowEngine;
import com.agentx.core.workflow.expression.ExpressionEngine;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

/**
 * 所有节点执行器单元测试 — 覆盖 START, END, CODE, CONDITION, SWITCH, LOOP, WHILE, PARALLEL, WAIT, SUB_WORKFLOW,
 * SET_VARIABLE, KNOWLEDGE_RETRIEVAL
 */
@DisplayName("Node Executor Tests")
class NodeExecutorTest {

  private NodeExecutionContext buildContext(NodeDefinition nodeDef) {
    return buildContext(nodeDef, new HashMap<>(), new ConcurrentHashMap<>());
  }

  private NodeExecutionContext buildContext(NodeDefinition nodeDef, Map<String, Object> variables,
      Map<String, Map<String, Object>> nodeOutputs) {
    return NodeExecutionContext.builder()
        .nodeDefinition(nodeDef)
        .variables(variables)
        .nodeOutputs(nodeOutputs)
        .secrets(Map.of())
        .runtimeContext(Map.of())
        .executionId("test-exec-001")
        .build();
  }

  // ==================== StartNodeExecutor ====================

  @Nested
  @DisplayName("StartNodeExecutor")
  class StartNodeTests {

    private final StartNodeExecutor executor = new StartNodeExecutor();

    @Test
    @DisplayName("返回节点类型 START")
    void nodeType() {
      assertEquals("START", executor.getNodeType());
    }

    @Test
    @DisplayName("传递全局变量到输出")
    void passesVariablesToOutput() {
      Map<String, Object> vars = new HashMap<>(Map.of("key1", "val1", "key2", 42));
      NodeDefinition node = NodeDefinition.builder().id("start").type("START").build();
      NodeExecutionContext ctx = buildContext(node, vars, new ConcurrentHashMap<>());

      Map<String, Object> outputs = executor.execute(ctx);

      assertEquals("val1", outputs.get("key1"));
      assertEquals(42, outputs.get("key2"));
    }

    @Test
    @DisplayName("合并输出映射")
    void mergesOutputMappings() {
      NodeDefinition node = NodeDefinition.builder()
          .id("start").type("START")
          .outputs(Map.of("extra", "value"))
          .build();
      Map<String, Object> vars = new HashMap<>(Map.of("base", "data"));
      NodeExecutionContext ctx = buildContext(node, vars, new ConcurrentHashMap<>());

      Map<String, Object> outputs = executor.execute(ctx);

      assertEquals("data", outputs.get("base"));
      assertEquals("value", outputs.get("extra"));
    }

    @Test
    @DisplayName("空变量不报错")
    void emptyVariables() {
      NodeDefinition node = NodeDefinition.builder().id("start").type("START").build();
      NodeExecutionContext ctx = buildContext(node, new HashMap<>(), new ConcurrentHashMap<>());

      Map<String, Object> outputs = executor.execute(ctx);

      assertNotNull(outputs);
      assertTrue(outputs.isEmpty());
    }

    @Test
    @DisplayName("null 变量不报错")
    void nullVariables() {
      NodeDefinition node = NodeDefinition.builder().id("start").type("START").build();
      NodeExecutionContext ctx = NodeExecutionContext.builder()
          .nodeDefinition(node)
          .variables(null)
          .nodeOutputs(new ConcurrentHashMap<>())
          .executionId("test")
          .build();

      Map<String, Object> outputs = executor.execute(ctx);

      assertNotNull(outputs);
    }
  }

  // ==================== EndNodeExecutor ====================

  @Nested
  @DisplayName("EndNodeExecutor")
  class EndNodeTests {

    private final EndNodeExecutor executor = new EndNodeExecutor();

    @Test
    @DisplayName("返回节点类型 END")
    void nodeType() {
      assertEquals("END", executor.getNodeType());
    }

    @Test
    @DisplayName("提取 config.output 作为输出")
    void extractsConfigOutput() {
      NodeDefinition node = NodeDefinition.builder()
          .id("end").type("END")
          .config(Map.of("output", Map.of("status", "done", "code", 200)))
          .build();
      NodeExecutionContext ctx = buildContext(node);

      Map<String, Object> outputs = executor.execute(ctx);

      assertEquals("done", outputs.get("status"));
      assertEquals(200, outputs.get("code"));
    }

    @Test
    @DisplayName("无 output 配置返回空 Map")
    void noOutputConfig() {
      NodeDefinition node = NodeDefinition.builder()
          .id("end").type("END")
          .config(Map.of())
          .build();
      NodeExecutionContext ctx = buildContext(node);

      Map<String, Object> outputs = executor.execute(ctx);

      assertNotNull(outputs);
      assertTrue(outputs.isEmpty());
    }

    @Test
    @DisplayName("null config 返回空 Map")
    void nullConfig() {
      NodeDefinition node = NodeDefinition.builder().id("end").type("END").build();
      NodeExecutionContext ctx = buildContext(node);

      Map<String, Object> outputs = executor.execute(ctx);

      assertNotNull(outputs);
      assertTrue(outputs.isEmpty());
    }

    @Test
    @DisplayName("output 不是 Map 时返回空")
    void outputNotMap() {
      NodeDefinition node = NodeDefinition.builder()
          .id("end").type("END")
          .config(Map.of("output", "just a string"))
          .build();
      NodeExecutionContext ctx = buildContext(node);

      Map<String, Object> outputs = executor.execute(ctx);
      assertTrue(outputs.isEmpty());
    }
  }

  // ==================== CodeNodeExecutor ====================

  @Nested
  @DisplayName("CodeNodeExecutor")
  class CodeNodeTests {

    private final CodeNodeExecutor executor = new CodeNodeExecutor();

    @Test
    @DisplayName("返回节点类型 CODE")
    void nodeType() {
      assertEquals("CODE", executor.getNodeType());
    }

    @Test
    @DisplayName("执行代码节点返回语言和代码")
    void executesCodeNode() {
      NodeDefinition node = NodeDefinition.builder()
          .id("code").type("CODE")
          .config(Map.of("language", "javascript", "code", "return 1 + 2;"))
          .build();
      NodeExecutionContext ctx = buildContext(node);

      Map<String, Object> outputs = executor.execute(ctx);

      assertEquals("javascript", outputs.get("language"));
      assertEquals(true, outputs.get("executed"));
      assertEquals("return 1 + 2;", outputs.get("code"));
    }

    @Test
    @DisplayName("默认语言为 javascript")
    void defaultLanguage() {
      NodeDefinition node = NodeDefinition.builder()
          .id("code").type("CODE")
          .config(Map.of("code", "console.log('hi')"))
          .build();
      NodeExecutionContext ctx = buildContext(node);

      Map<String, Object> outputs = executor.execute(ctx);

      assertEquals("javascript", outputs.get("language"));
    }

    @Test
    @DisplayName("null 代码返回空字符串")
    void nullCode() {
      NodeDefinition node = NodeDefinition.builder()
          .id("code").type("CODE")
          .config(new HashMap<>(Map.of("language", "python")))
          .build();
      NodeExecutionContext ctx = buildContext(node);

      Map<String, Object> outputs = executor.execute(ctx);

      assertEquals("", outputs.get("code"));
    }
  }

  // ==================== ConditionNodeExecutor ====================

  @Nested
  @DisplayName("ConditionNodeExecutor")
  class ConditionNodeTests {

    private final ConditionNodeExecutor executor = new ConditionNodeExecutor();

    @Test
    @DisplayName("返回节点类型 CONDITION")
    void nodeType() {
      assertEquals("CONDITION", executor.getNodeType());
    }

    @Test
    @DisplayName("表达式为真返回 ifTrue 节点")
    void trueCondition() {
      NodeDefinition node = NodeDefinition.builder()
          .id("cond").type("CONDITION")
          .config(Map.of("expression", "1 == 1", "ifTrue", "nodeA", "ifFalse", "nodeB"))
          .build();
      Map<String, Object> vars = new HashMap<>();
      NodeExecutionContext ctx = buildContext(node, vars, new ConcurrentHashMap<>());

      Map<String, Object> outputs = executor.execute(ctx);

      assertEquals(true, outputs.get("result"));
      assertEquals("nodeA", outputs.get("nextNode"));
    }

    @Test
    @DisplayName("表达式为假返回 ifFalse 节点")
    void falseCondition() {
      NodeDefinition node = NodeDefinition.builder()
          .id("cond").type("CONDITION")
          .config(Map.of("expression", "1 == 2", "ifTrue", "nodeA", "ifFalse", "nodeB"))
          .build();
      NodeExecutionContext ctx = buildContext(node, new HashMap<>(), new ConcurrentHashMap<>());

      Map<String, Object> outputs = executor.execute(ctx);

      assertEquals(false, outputs.get("result"));
      assertEquals("nodeB", outputs.get("nextNode"));
    }

    @Test
    @DisplayName("使用变量进行条件判断")
    void conditionWithVariables() {
      NodeDefinition node = NodeDefinition.builder()
          .id("cond").type("CONDITION")
          .config(Map.of("expression", "#variables['score'] > 60",
              "ifTrue", "pass", "ifFalse", "fail"))
          .build();
      Map<String, Object> vars = new HashMap<>(Map.of("score", 80));
      NodeExecutionContext ctx = buildContext(node, vars, new ConcurrentHashMap<>());

      Map<String, Object> outputs = executor.execute(ctx);

      assertEquals(true, outputs.get("result"));
      assertEquals("pass", outputs.get("nextNode"));
    }

    @Test
    @DisplayName("无效表达式返回 false")
    void invalidExpressionReturnsFalse() {
      NodeDefinition node = NodeDefinition.builder()
          .id("cond").type("CONDITION")
          .config(Map.of("expression", "undefined.method()",
              "ifTrue", "nodeA", "ifFalse", "nodeB"))
          .build();
      NodeExecutionContext ctx = buildContext(node, new HashMap<>(), new ConcurrentHashMap<>());

      Map<String, Object> outputs = executor.execute(ctx);

      assertEquals(false, outputs.get("result"));
      assertEquals("nodeB", outputs.get("nextNode"));
    }

    @Test
    @DisplayName("null config 抛出异常")
    void nullConfigThrowsException() {
      NodeDefinition node = NodeDefinition.builder()
          .id("cond").type("CONDITION").build();
      NodeExecutionContext ctx = buildContext(node);

      assertThrows(IllegalArgumentException.class, () -> executor.execute(ctx));
    }
  }

  // ==================== SwitchNodeExecutor ====================

  @Nested
  @DisplayName("SwitchNodeExecutor")
  class SwitchNodeTests {

    private final SwitchNodeExecutor executor = new SwitchNodeExecutor();

    @Test
    @DisplayName("返回节点类型 SWITCH")
    void nodeType() {
      assertEquals("SWITCH", executor.getNodeType());
    }

    @Test
    @DisplayName("匹配 case 返回对应节点")
    void matchesCase() {
      NodeDefinition node = NodeDefinition.builder()
          .id("sw").type("SWITCH")
          .config(Map.of(
              "expression", "A",
              "cases", List.of(
                  Map.of("value", "A", "next", "nodeA"),
                  Map.of("value", "B", "next", "nodeB")
              ),
              "default", "nodeDefault"
          ))
          .build();
      NodeExecutionContext ctx = buildContext(node);

      Map<String, Object> outputs = executor.execute(ctx);

      assertEquals("nodeA", outputs.get("nextNode"));
    }

    @Test
    @DisplayName("无匹配 case 返回 default")
    void noMatchReturnsDefault() {
      NodeDefinition node = NodeDefinition.builder()
          .id("sw").type("SWITCH")
          .config(Map.of(
              "expression", "C",
              "cases", List.of(
                  Map.of("value", "A", "next", "nodeA"),
                  Map.of("value", "B", "next", "nodeB")
              ),
              "default", "nodeDefault"
          ))
          .build();
      NodeExecutionContext ctx = buildContext(node);

      Map<String, Object> outputs = executor.execute(ctx);

      assertEquals("nodeDefault", outputs.get("nextNode"));
    }

    @Test
    @DisplayName("无 default 且不匹配返回空字符串")
    void noDefaultNoMatch() {
      NodeDefinition node = NodeDefinition.builder()
          .id("sw").type("SWITCH")
          .config(Map.of(
              "expression", "Z",
              "cases", List.of(Map.of("value", "A", "next", "nodeA"))
          ))
          .build();
      NodeExecutionContext ctx = buildContext(node);

      Map<String, Object> outputs = executor.execute(ctx);

      assertEquals("", outputs.get("nextNode"));
    }
  }

  // ==================== LoopNodeExecutor ====================

  @Nested
  @DisplayName("LoopNodeExecutor")
  class LoopNodeTests {

    private final LoopNodeExecutor executor = new LoopNodeExecutor();

    @Test
    @DisplayName("返回节点类型 LOOP")
    void nodeType() {
      assertEquals("LOOP", executor.getNodeType());
    }

    @Test
    @DisplayName("遍历集合并记录迭代次数")
    void iteratesOverCollection() {
      NodeDefinition node = NodeDefinition.builder()
          .id("loop").type("LOOP")
          .config(Map.of("collection", List.of("a", "b", "c"), "iterator", "item"))
          .build();
      Map<String, Object> vars = new HashMap<>();
      NodeExecutionContext ctx = buildContext(node, vars, new ConcurrentHashMap<>());

      Map<String, Object> outputs = executor.execute(ctx);

      assertEquals(3, outputs.get("iterations"));
      assertEquals(List.of("a", "b", "c"), outputs.get("results"));
    }

    @Test
    @DisplayName("设置迭代器变量和 loopIndex")
    void setsIteratorVariable() {
      NodeDefinition node = NodeDefinition.builder()
          .id("loop").type("LOOP")
          .config(Map.of("collection", List.of("x", "y"), "iterator", "elem"))
          .build();
      Map<String, Object> vars = new HashMap<>();
      NodeExecutionContext ctx = buildContext(node, vars, new ConcurrentHashMap<>());

      executor.execute(ctx);

      // After loop, last iteration values should be in variables
      assertEquals("y", vars.get("elem"));
      assertEquals(1, vars.get("loopIndex"));
    }

    @Test
    @DisplayName("maxIterations 限制迭代次数")
    void maxIterationsLimit() {
      List<String> bigList = List.of("1", "2", "3", "4", "5", "6", "7", "8", "9", "10");
      NodeDefinition node = NodeDefinition.builder()
          .id("loop").type("LOOP")
          .config(Map.of("collection", bigList, "iterator", "item", "maxIterations", 3))
          .build();
      Map<String, Object> vars = new HashMap<>();
      NodeExecutionContext ctx = buildContext(node, vars, new ConcurrentHashMap<>());

      Map<String, Object> outputs = executor.execute(ctx);

      assertEquals(3, outputs.get("iterations"));
    }

    @Test
    @DisplayName("默认迭代器名称为 item")
    void defaultIteratorName() {
      NodeDefinition node = NodeDefinition.builder()
          .id("loop").type("LOOP")
          .config(Map.of("collection", List.of("val")))
          .build();
      Map<String, Object> vars = new HashMap<>();
      NodeExecutionContext ctx = buildContext(node, vars, new ConcurrentHashMap<>());

      executor.execute(ctx);

      assertEquals("val", vars.get("item"));
    }

    @Test
    @DisplayName("空集合迭代0次")
    void emptyCollection() {
      NodeDefinition node = NodeDefinition.builder()
          .id("loop").type("LOOP")
          .config(Map.of("collection", List.of()))
          .build();
      NodeExecutionContext ctx = buildContext(node, new HashMap<>(), new ConcurrentHashMap<>());

      Map<String, Object> outputs = executor.execute(ctx);

      assertEquals(0, outputs.get("iterations"));
    }

    @Test
    @DisplayName("非列表 collection 当空列表处理")
    void nonListCollection() {
      NodeDefinition node = NodeDefinition.builder()
          .id("loop").type("LOOP")
          .config(Map.of("collection", "not a list"))
          .build();
      NodeExecutionContext ctx = buildContext(node, new HashMap<>(), new ConcurrentHashMap<>());

      Map<String, Object> outputs = executor.execute(ctx);

      assertEquals(0, outputs.get("iterations"));
    }
  }

  // ==================== WhileNodeExecutor ====================

  @Nested
  @DisplayName("WhileNodeExecutor")
  class WhileNodeTests {

    private final WhileNodeExecutor executor = new WhileNodeExecutor();

    @Test
    @DisplayName("返回节点类型 WHILE")
    void nodeType() {
      assertEquals("WHILE", executor.getNodeType());
    }

    @Test
    @DisplayName("条件始终为 false 迭代0次")
    void falseConditionNoIterations() {
      NodeDefinition node = NodeDefinition.builder()
          .id("while").type("WHILE")
          .config(Map.of("condition", "false", "maxIterations", 10))
          .build();
      NodeExecutionContext ctx = buildContext(node, new HashMap<>(), new ConcurrentHashMap<>());

      Map<String, Object> outputs = executor.execute(ctx);

      assertEquals(0, outputs.get("iterations"));
    }

    @Test
    @DisplayName("maxIterations 限制循环次数")
    void maxIterationsBreaksLoop() {
      NodeDefinition node = NodeDefinition.builder()
          .id("while").type("WHILE")
          .config(Map.of("condition", "true", "maxIterations", 5))
          .build();
      NodeExecutionContext ctx = buildContext(node, new HashMap<>(), new ConcurrentHashMap<>());

      Map<String, Object> outputs = executor.execute(ctx);

      assertEquals(5, outputs.get("iterations"));
    }

    @Test
    @DisplayName("无效条件表达式不循环")
    void invalidConditionNoLoop() {
      NodeDefinition node = NodeDefinition.builder()
          .id("while").type("WHILE")
          .config(Map.of("condition", "undefined.broken()", "maxIterations", 10))
          .build();
      NodeExecutionContext ctx = buildContext(node, new HashMap<>(), new ConcurrentHashMap<>());

      Map<String, Object> outputs = executor.execute(ctx);

      assertEquals(0, outputs.get("iterations"));
    }
  }

  // ==================== ParallelNodeExecutor ====================

  @Nested
  @DisplayName("ParallelNodeExecutor")
  class ParallelNodeTests {

    private final ParallelNodeExecutor executor = new ParallelNodeExecutor();

    @Test
    @DisplayName("返回节点类型 PARALLEL")
    void nodeType() {
      assertEquals("PARALLEL", executor.getNodeType());
    }

    @Test
    @DisplayName("返回分支列表和 waitAll 标记")
    void returnsBranchesAndWaitAll() {
      NodeDefinition node = NodeDefinition.builder()
          .id("par").type("PARALLEL")
          .config(Map.of("branches", List.of("b1", "b2", "b3"), "waitAll", true))
          .build();
      NodeExecutionContext ctx = buildContext(node);

      Map<String, Object> outputs = executor.execute(ctx);

      assertEquals(List.of("b1", "b2", "b3"), outputs.get("branches"));
      assertEquals(true, outputs.get("waitAll"));
    }

    @Test
    @DisplayName("默认 waitAll 为 true")
    void defaultWaitAllTrue() {
      NodeDefinition node = NodeDefinition.builder()
          .id("par").type("PARALLEL")
          .config(Map.of("branches", List.of("b1")))
          .build();
      NodeExecutionContext ctx = buildContext(node);

      Map<String, Object> outputs = executor.execute(ctx);

      assertEquals(true, outputs.get("waitAll"));
    }

    @Test
    @DisplayName("空分支列表")
    void emptyBranches() {
      NodeDefinition node = NodeDefinition.builder()
          .id("par").type("PARALLEL")
          .config(Map.of("waitAll", false))
          .build();
      NodeExecutionContext ctx = buildContext(node);

      Map<String, Object> outputs = executor.execute(ctx);

      assertEquals(List.of(), outputs.get("branches"));
    }
  }

  // ==================== WaitNodeExecutor ====================

  @Nested
  @DisplayName("WaitNodeExecutor")
  class WaitNodeTests {

    private final WaitNodeExecutor executor = new WaitNodeExecutor();

    @Test
    @DisplayName("返回节点类型 WAIT")
    void nodeType() {
      assertEquals("WAIT", executor.getNodeType());
    }

    @Test
    @DisplayName("返回等待类型和超时")
    void returnsWaitConfig() {
      NodeDefinition node = NodeDefinition.builder()
          .id("wait").type("WAIT")
          .config(Map.of("waitType", "APPROVAL", "timeout", 300))
          .build();
      NodeExecutionContext ctx = buildContext(node);

      Map<String, Object> outputs = executor.execute(ctx);

      assertEquals("APPROVAL", outputs.get("waitType"));
      assertEquals("WAITING", outputs.get("status"));
      assertEquals(300, outputs.get("timeout"));
    }

    @Test
    @DisplayName("默认 waitType 为 APPROVAL，timeout 为 3600")
    void defaults() {
      NodeDefinition node = NodeDefinition.builder()
          .id("wait").type("WAIT")
          .config(Map.of())
          .build();
      NodeExecutionContext ctx = buildContext(node);

      Map<String, Object> outputs = executor.execute(ctx);

      assertEquals("APPROVAL", outputs.get("waitType"));
      assertEquals(3600, outputs.get("timeout"));
    }
  }

  // ==================== SubWorkflowNodeExecutor ====================

  @Nested
  @DisplayName("SubWorkflowNodeExecutor")
  class SubWorkflowNodeTests {

    private SubWorkflowNodeExecutor createExecutor() {
      ExpressionEngine expressionEngine = new ExpressionEngine();
      WorkflowDefinitionProvider provider = new InMemoryWorkflowDefinitionProvider();
      WorkflowDefinition subWf = WorkflowDefinition.builder()
          .id("sub-wf-001")
          .name("Test Sub Workflow")
          .nodes(List.of(
              NodeDefinition.builder().id("s1").type("START").next("e1").build(),
              NodeDefinition.builder().id("e1").type("END").build()
          ))
          .build();
      provider.register(subWf);
      WorkflowEngine engine = new WorkflowEngine(expressionEngine,
          List.of(new StartNodeExecutor(), new EndNodeExecutor()));
      return new SubWorkflowNodeExecutor(engine, provider, expressionEngine);
    }

    @Test
    @DisplayName("返回节点类型 SUB_WORKFLOW")
    void nodeType() {
      assertEquals("SUB_WORKFLOW", createExecutor().getNodeType());
    }

    @Test
    @DisplayName("真正执行子工作流并返回结果")
    void executesSubWorkflow() {
      SubWorkflowNodeExecutor executor = createExecutor();
      NodeDefinition node = NodeDefinition.builder()
          .id("sub").type("SUB_WORKFLOW")
          .config(Map.of("workflowId", "sub-wf-001"))
          .build();
      NodeExecutionContext ctx = buildContext(node);

      Map<String, Object> outputs = executor.execute(ctx);

      assertEquals("sub-wf-001", outputs.get("subWorkflowId"));
      assertEquals("COMPLETED", outputs.get("status"));
      assertTrue(outputs.containsKey("output"));
      assertTrue(outputs.containsKey("executionId"));
    }

    @Test
    @DisplayName("子工作流不存在时抛异常")
    void throwsWhenSubWorkflowNotFound() {
      ExpressionEngine expressionEngine = new ExpressionEngine();
      WorkflowDefinitionProvider provider = new InMemoryWorkflowDefinitionProvider();
      WorkflowEngine engine = new WorkflowEngine(expressionEngine, List.of());
      SubWorkflowNodeExecutor executor = new SubWorkflowNodeExecutor(engine, provider, expressionEngine);

      NodeDefinition node = NodeDefinition.builder()
          .id("sub").type("SUB_WORKFLOW")
          .config(Map.of("workflowId", "non-existent-wf"))
          .build();
      NodeExecutionContext ctx = buildContext(node);

      assertThrows(IllegalArgumentException.class, () -> executor.execute(ctx));
    }
  }

  // ==================== SetVariableNodeExecutor ====================

  @Nested
  @DisplayName("SetVariableNodeExecutor")
  class SetVariableNodeTests {

    private final SetVariableNodeExecutor executor = new SetVariableNodeExecutor();

    @Test
    @DisplayName("返回节点类型 SET_VARIABLE")
    void nodeType() {
      assertEquals("SET_VARIABLE", executor.getNodeType());
    }

    @Test
    @DisplayName("设置单个变量")
    void setSingleVariable() {
      NodeDefinition node = NodeDefinition.builder()
          .id("set").type("SET_VARIABLE")
          .config(Map.of("assignments", List.of(Map.of("name", "x", "value", "hello"))))
          .build();
      Map<String, Object> vars = new HashMap<>();
      NodeExecutionContext ctx = buildContext(node, vars, new ConcurrentHashMap<>());

      Map<String, Object> outputs = executor.execute(ctx);

      assertEquals("hello", vars.get("x"));
      assertEquals("hello", outputs.get("x"));
    }

    @Test
    @DisplayName("设置多个变量")
    void setMultipleVariables() {
      NodeDefinition node = NodeDefinition.builder()
          .id("set").type("SET_VARIABLE")
          .config(Map.of("assignments", List.of(
              Map.of("name", "a", "value", 1),
              Map.of("name", "b", "value", "two"),
              Map.of("name", "c", "value", true)
          )))
          .build();
      Map<String, Object> vars = new HashMap<>();
      NodeExecutionContext ctx = buildContext(node, vars, new ConcurrentHashMap<>());

      Map<String, Object> outputs = executor.execute(ctx);

      assertEquals(1, vars.get("a"));
      assertEquals("two", vars.get("b"));
      assertEquals(true, vars.get("c"));
      assertEquals(3, outputs.size());
    }

    @Test
    @DisplayName("覆盖已有变量")
    void overrideExistingVariable() {
      NodeDefinition node = NodeDefinition.builder()
          .id("set").type("SET_VARIABLE")
          .config(Map.of("assignments", List.of(Map.of("name", "x", "value", "new"))))
          .build();
      Map<String, Object> vars = new HashMap<>(Map.of("x", "old"));
      NodeExecutionContext ctx = buildContext(node, vars, new ConcurrentHashMap<>());

      executor.execute(ctx);

      assertEquals("new", vars.get("x"));
    }

    @Test
    @DisplayName("空 assignments 不修改变量")
    void emptyAssignments() {
      NodeDefinition node = NodeDefinition.builder()
          .id("set").type("SET_VARIABLE")
          .config(Map.of("assignments", List.of()))
          .build();
      Map<String, Object> vars = new HashMap<>();
      NodeExecutionContext ctx = buildContext(node, vars, new ConcurrentHashMap<>());

      Map<String, Object> outputs = executor.execute(ctx);

      assertTrue(outputs.isEmpty());
      assertTrue(vars.isEmpty());
    }
  }

  // ==================== KnowledgeRetrievalNodeExecutor ====================

  @Nested
  @DisplayName("KnowledgeRetrievalNodeExecutor")
  class KnowledgeRetrievalNodeTests {

    private final KnowledgeRetrievalNodeExecutor executor = new KnowledgeRetrievalNodeExecutor();

    @Test
    @DisplayName("返回节点类型 KNOWLEDGE_RETRIEVAL")
    void nodeType() {
      assertEquals("KNOWLEDGE_RETRIEVAL", executor.getNodeType());
    }

    @Test
    @DisplayName("返回查询参数")
    void returnsQueryParams() {
      NodeDefinition node = NodeDefinition.builder()
          .id("kr").type("KNOWLEDGE_RETRIEVAL")
          .config(Map.of("query", "test query", "topK", 3,
              "knowledgeBaseIds", List.of("kb1", "kb2")))
          .build();
      NodeExecutionContext ctx = buildContext(node);

      Map<String, Object> outputs = executor.execute(ctx);

      assertEquals("test query", outputs.get("query"));
      assertEquals(3, outputs.get("topK"));
      assertNotNull(outputs.get("results"));
    }

    @Test
    @DisplayName("默认 topK 为 5")
    void defaultTopK() {
      NodeDefinition node = NodeDefinition.builder()
          .id("kr").type("KNOWLEDGE_RETRIEVAL")
          .config(Map.of("query", "test"))
          .build();
      NodeExecutionContext ctx = buildContext(node);

      Map<String, Object> outputs = executor.execute(ctx);

      assertEquals(5, outputs.get("topK"));
    }
  }
}
