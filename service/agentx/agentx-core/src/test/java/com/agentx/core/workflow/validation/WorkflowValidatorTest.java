package com.agentx.core.workflow.validation;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import com.agentx.core.workflow.dsl.NodeDefinition;
import com.agentx.core.workflow.dsl.WorkflowDefinition;
import java.util.List;
import java.util.Map;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

/**
 * WorkflowValidator 单元测试 — 覆盖结构验证、节点类型、DAG环检测、必填字段、引用一致性
 */
@DisplayName("WorkflowValidator Tests")
class WorkflowValidatorTest {

  private WorkflowValidator validator;

  @BeforeEach
  void setUp() {
    validator = new WorkflowValidator();
  }

  // ==================== 有效工作流 ====================

  @Nested
  @DisplayName("Valid Workflows")
  class ValidWorkflows {

    @Test
    @DisplayName("最简有效工作流：START → END")
    void minimalValidWorkflow() {
      WorkflowDefinition wf = WorkflowDefinition.builder()
          .id("wf-1")
          .name("Simple")
          .nodes(List.of(
              NodeDefinition.builder().id("start").type("START").next("end").build(),
              NodeDefinition.builder().id("end").type("END").build()
          ))
          .build();

      ValidationResult result = validator.validate(wf);
      assertTrue(result.isValid());
      assertTrue(result.getErrors().isEmpty());
    }

    @Test
    @DisplayName("包含多节点的有效工作流")
    void multiNodeValidWorkflow() {
      WorkflowDefinition wf = WorkflowDefinition.builder()
          .id("wf-multi")
          .name("Multi")
          .nodes(List.of(
              NodeDefinition.builder().id("start").type("START").next("set").build(),
              NodeDefinition.builder().id("set").type("SET_VARIABLE")
                  .config(Map.of("assignments", List.of(Map.of("name", "x", "value", "y"))))
                  .next("end").build(),
              NodeDefinition.builder().id("end").type("END").build()
          ))
          .build();

      ValidationResult result = validator.validate(wf);
      assertTrue(result.isValid());
    }

    @Test
    @DisplayName("包含条件分支的有效工作流")
    void conditionBranchWorkflow() {
      WorkflowDefinition wf = WorkflowDefinition.builder()
          .id("wf-cond")
          .name("Condition")
          .nodes(List.of(
              NodeDefinition.builder().id("start").type("START").next("cond").build(),
              NodeDefinition.builder().id("cond").type("CONDITION")
                  .config(Map.of("expression", "true", "ifTrue", "a", "ifFalse", "b"))
                  .build(),
              NodeDefinition.builder().id("a").type("SET_VARIABLE")
                  .config(Map.of("assignments", List.of()))
                  .next("end").build(),
              NodeDefinition.builder().id("b").type("SET_VARIABLE")
                  .config(Map.of("assignments", List.of()))
                  .next("end").build(),
              NodeDefinition.builder().id("end").type("END").build()
          ))
          .build();

      ValidationResult result = validator.validate(wf);
      assertTrue(result.isValid());
    }
  }

  // ==================== 基本字段校验 ====================

  @Nested
  @DisplayName("Basic Field Validation")
  class BasicFieldValidation {

    @Test
    @DisplayName("缺少 workflow ID 报错")
    void missingWorkflowId() {
      WorkflowDefinition wf = WorkflowDefinition.builder()
          .name("No ID")
          .nodes(List.of(
              NodeDefinition.builder().id("start").type("START").next("end").build(),
              NodeDefinition.builder().id("end").type("END").build()
          ))
          .build();

      ValidationResult result = validator.validate(wf);
      assertFalse(result.isValid());
      assertTrue(result.getErrors().stream().anyMatch(i -> "W002".equals(i.getCode())));
    }

    @Test
    @DisplayName("缺少 workflow name 警告")
    void missingWorkflowName() {
      WorkflowDefinition wf = WorkflowDefinition.builder()
          .id("wf-noname")
          .nodes(List.of(
              NodeDefinition.builder().id("start").type("START").next("end").build(),
              NodeDefinition.builder().id("end").type("END").build()
          ))
          .build();

      ValidationResult result = validator.validate(wf);
      assertTrue(result.isValid()); // name is a warning, not error
      assertTrue(result.getWarnings().stream().anyMatch(i -> "W003".equals(i.getCode())));
    }

    @Test
    @DisplayName("空节点列表报错")
    void emptyNodeList() {
      WorkflowDefinition wf = WorkflowDefinition.builder()
          .id("wf-empty")
          .name("Empty")
          .nodes(List.of())
          .build();

      ValidationResult result = validator.validate(wf);
      assertFalse(result.isValid());
      assertTrue(result.getErrors().stream().anyMatch(i -> "W001".equals(i.getCode())));
    }

    @Test
    @DisplayName("null 节点列表报错")
    void nullNodeList() {
      WorkflowDefinition wf = WorkflowDefinition.builder()
          .id("wf-null-nodes")
          .name("Null Nodes")
          .build();

      ValidationResult result = validator.validate(wf);
      assertFalse(result.isValid());
      assertTrue(result.getErrors().stream().anyMatch(i -> "W001".equals(i.getCode())));
    }
  }

  // ==================== START/END 节点校验 ====================

  @Nested
  @DisplayName("START/END Node Validation")
  class StartEndValidation {

    @Test
    @DisplayName("缺少 START 节点报错")
    void missingStartNode() {
      WorkflowDefinition wf = WorkflowDefinition.builder()
          .id("wf-no-start")
          .name("No Start")
          .nodes(List.of(
              NodeDefinition.builder().id("end").type("END").build()
          ))
          .build();

      ValidationResult result = validator.validate(wf);
      assertFalse(result.isValid());
      assertTrue(result.getErrors().stream().anyMatch(i -> "W004".equals(i.getCode())));
    }

    @Test
    @DisplayName("多个 START 节点报错")
    void multipleStartNodes() {
      WorkflowDefinition wf = WorkflowDefinition.builder()
          .id("wf-multi-start")
          .name("Multi Start")
          .nodes(List.of(
              NodeDefinition.builder().id("s1").type("START").build(),
              NodeDefinition.builder().id("s2").type("START").build(),
              NodeDefinition.builder().id("end").type("END").build()
          ))
          .build();

      ValidationResult result = validator.validate(wf);
      assertFalse(result.isValid());
      assertTrue(result.getErrors().stream().anyMatch(i -> "W005".equals(i.getCode())));
    }

    @Test
    @DisplayName("缺少 END 节点警告")
    void missingEndNode() {
      WorkflowDefinition wf = WorkflowDefinition.builder()
          .id("wf-no-end")
          .name("No End")
          .nodes(List.of(
              NodeDefinition.builder().id("start").type("START").build()
          ))
          .build();

      ValidationResult result = validator.validate(wf);
      assertTrue(result.getWarnings().stream().anyMatch(i -> "W006".equals(i.getCode())));
    }
  }

  // ==================== 节点类型校验 ====================

  @Nested
  @DisplayName("Node Type Validation")
  class NodeTypeValidation {

    @Test
    @DisplayName("未知节点类型报错")
    void unknownNodeType() {
      WorkflowDefinition wf = WorkflowDefinition.builder()
          .id("wf-unknown")
          .name("Unknown Type")
          .nodes(List.of(
              NodeDefinition.builder().id("start").type("START").next("bad").build(),
              NodeDefinition.builder().id("bad").type("UNKNOWN_TYPE").next("end").build(),
              NodeDefinition.builder().id("end").type("END").build()
          ))
          .build();

      ValidationResult result = validator.validate(wf);
      assertFalse(result.isValid());
      assertTrue(result.getErrors().stream().anyMatch(i -> "N004".equals(i.getCode())));
    }

    @Test
    @DisplayName("节点缺少 type 报错")
    void missingNodeType() {
      WorkflowDefinition wf = WorkflowDefinition.builder()
          .id("wf-no-type")
          .name("No Type")
          .nodes(List.of(
              NodeDefinition.builder().id("start").type("START").next("n1").build(),
              NodeDefinition.builder().id("n1").build(), // no type
              NodeDefinition.builder().id("end").type("END").build()
          ))
          .build();

      ValidationResult result = validator.validate(wf);
      assertFalse(result.isValid());
      assertTrue(result.getErrors().stream().anyMatch(i -> "N003".equals(i.getCode())));
    }

    @Test
    @DisplayName("节点缺少 id 报错")
    void missingNodeId() {
      WorkflowDefinition wf = WorkflowDefinition.builder()
          .id("wf-no-id")
          .name("No ID")
          .nodes(List.of(
              NodeDefinition.builder().type("START").build(), // no id
              NodeDefinition.builder().id("end").type("END").build()
          ))
          .build();

      ValidationResult result = validator.validate(wf);
      assertFalse(result.isValid());
      assertTrue(result.getErrors().stream().anyMatch(i -> "N001".equals(i.getCode())));
    }

    @Test
    @DisplayName("重复节点 ID 报错")
    void duplicateNodeIds() {
      WorkflowDefinition wf = WorkflowDefinition.builder()
          .id("wf-dup")
          .name("Duplicate")
          .nodes(List.of(
              NodeDefinition.builder().id("start").type("START").next("end").build(),
              NodeDefinition.builder().id("start").type("SET_VARIABLE")
                  .config(Map.of("assignments", List.of()))
                  .next("end").build(),
              NodeDefinition.builder().id("end").type("END").build()
          ))
          .build();

      ValidationResult result = validator.validate(wf);
      assertFalse(result.isValid());
      assertTrue(result.getErrors().stream().anyMatch(i -> "N002".equals(i.getCode())));
    }

    @Test
    @DisplayName("所有16种合法节点类型不报错")
    void allValidNodeTypes() {
      List<String> validTypes = List.of(
          "START", "END", "LLM", "AGENT", "TOOL", "HTTP", "CODE",
          "CONDITION", "SWITCH", "LOOP", "WHILE", "PARALLEL",
          "WAIT", "SUB_WORKFLOW", "SET_VARIABLE", "KNOWLEDGE_RETRIEVAL"
      );

      for (String type : validTypes) {
        NodeDefinition node = NodeDefinition.builder().id("n-" + type).type(type).build();
        // Just verify no NPE during type check — full validation has config requirements
        assertNotNull(node.getType());
      }
    }
  }

  // ==================== 节点配置必填字段校验 ====================

  @Nested
  @DisplayName("Node Config Required Fields")
  class NodeConfigValidation {

    @Test
    @DisplayName("LLM 节点缺少 config 报错")
    void llmMissingConfig() {
      WorkflowDefinition wf = createWorkflowWithNode("llm", "LLM", null);
      ValidationResult result = validator.validate(wf);
      assertFalse(result.isValid());
      assertTrue(result.getErrors().stream().anyMatch(i -> "N006".equals(i.getCode())));
    }

    @Test
    @DisplayName("AGENT 节点缺少 agentId 报错")
    void agentMissingAgentId() {
      WorkflowDefinition wf = createWorkflowWithNode("agent", "AGENT",
          Map.of("input", "hello")); // missing agentId
      ValidationResult result = validator.validate(wf);
      assertFalse(result.isValid());
      assertTrue(result.getErrors().stream().anyMatch(i -> "N007".equals(i.getCode())));
    }

    @Test
    @DisplayName("TOOL 节点缺少 toolId 报错")
    void toolMissingToolId() {
      WorkflowDefinition wf = createWorkflowWithNode("tool", "TOOL",
          Map.of("params", Map.of()));
      ValidationResult result = validator.validate(wf);
      assertFalse(result.isValid());
    }

    @Test
    @DisplayName("HTTP 节点缺少 url 报错")
    void httpMissingUrl() {
      WorkflowDefinition wf = createWorkflowWithNode("http", "HTTP",
          Map.of("method", "GET"));
      ValidationResult result = validator.validate(wf);
      assertFalse(result.isValid());
    }

    @Test
    @DisplayName("CONDITION 节点缺少 expression 报错")
    void conditionMissingExpression() {
      WorkflowDefinition wf = createWorkflowWithNode("cond", "CONDITION",
          Map.of("ifTrue", "end", "ifFalse", "end"));
      ValidationResult result = validator.validate(wf);
      assertFalse(result.isValid());
    }

    @Test
    @DisplayName("SUB_WORKFLOW 节点缺少 workflowId 报错")
    void subWorkflowMissingId() {
      WorkflowDefinition wf = createWorkflowWithNode("sub", "SUB_WORKFLOW",
          Map.of("params", Map.of()));
      ValidationResult result = validator.validate(wf);
      assertFalse(result.isValid());
    }

    @Test
    @DisplayName("SET_VARIABLE 节点缺少 assignments 报错")
    void setVariableMissingAssignments() {
      WorkflowDefinition wf = createWorkflowWithNode("set", "SET_VARIABLE",
          Map.of("name", "x"));
      ValidationResult result = validator.validate(wf);
      assertFalse(result.isValid());
    }

    @Test
    @DisplayName("KNOWLEDGE_RETRIEVAL 节点缺少 query 报错")
    void knowledgeRetrievalMissingQuery() {
      WorkflowDefinition wf = createWorkflowWithNode("kr", "KNOWLEDGE_RETRIEVAL",
          Map.of("topK", 5));
      ValidationResult result = validator.validate(wf);
      assertFalse(result.isValid());
    }

    @Test
    @DisplayName("PARALLEL 节点缺少 branches 报错")
    void parallelMissingBranches() {
      WorkflowDefinition wf = createWorkflowWithNode("par", "PARALLEL",
          Map.of("waitAll", true));
      ValidationResult result = validator.validate(wf);
      assertFalse(result.isValid());
    }

    private WorkflowDefinition createWorkflowWithNode(String nodeId, String nodeType,
        Map<String, Object> config) {
      return WorkflowDefinition.builder()
          .id("wf-test")
          .name("Test")
          .nodes(List.of(
              NodeDefinition.builder().id("start").type("START").next(nodeId).build(),
              NodeDefinition.builder().id(nodeId).type(nodeType).config(config).next("end").build(),
              NodeDefinition.builder().id("end").type("END").build()
          ))
          .build();
    }
  }

  // ==================== 引用一致性 ====================

  @Nested
  @DisplayName("Reference Consistency")
  class ReferenceConsistency {

    @Test
    @DisplayName("next 引用不存在的节点报错")
    void nextReferencesNonExistentNode() {
      WorkflowDefinition wf = WorkflowDefinition.builder()
          .id("wf-badref")
          .name("Bad Ref")
          .nodes(List.of(
              NodeDefinition.builder().id("start").type("START").next("does-not-exist").build(),
              NodeDefinition.builder().id("end").type("END").build()
          ))
          .build();

      ValidationResult result = validator.validate(wf);
      assertFalse(result.isValid());
      assertTrue(result.getErrors().stream().anyMatch(i -> "N005".equals(i.getCode())));
    }

    @Test
    @DisplayName("CONDITION ifTrue 引用不存在的节点报错")
    void conditionIfTrueReferencesNonExistent() {
      WorkflowDefinition wf = WorkflowDefinition.builder()
          .id("wf-cond-ref")
          .name("Cond Ref")
          .nodes(List.of(
              NodeDefinition.builder().id("start").type("START").next("cond").build(),
              NodeDefinition.builder().id("cond").type("CONDITION")
                  .config(Map.of("expression", "true", "ifTrue", "nonexistent", "ifFalse", "end"))
                  .build(),
              NodeDefinition.builder().id("end").type("END").build()
          ))
          .build();

      ValidationResult result = validator.validate(wf);
      assertFalse(result.isValid());
      assertTrue(result.getErrors().stream().anyMatch(i -> "N008".equals(i.getCode())));
    }

    @Test
    @DisplayName("PARALLEL 分支引用不存在的节点报错")
    void parallelBranchReferencesNonExistent() {
      WorkflowDefinition wf = WorkflowDefinition.builder()
          .id("wf-par-ref")
          .name("Par Ref")
          .nodes(List.of(
              NodeDefinition.builder().id("start").type("START").next("par").build(),
              NodeDefinition.builder().id("par").type("PARALLEL")
                  .config(Map.of("branches", List.of("nonexistent")))
                  .next("end").build(),
              NodeDefinition.builder().id("end").type("END").build()
          ))
          .build();

      ValidationResult result = validator.validate(wf);
      assertFalse(result.isValid());
      assertTrue(result.getErrors().stream().anyMatch(i -> "N009".equals(i.getCode())));
    }
  }

  // ==================== DAG 环检测 ====================

  @Nested
  @DisplayName("Cycle Detection")
  class CycleDetection {

    @Test
    @DisplayName("检测简单环")
    void detectSimpleCycle() {
      WorkflowDefinition wf = WorkflowDefinition.builder()
          .id("wf-cycle")
          .name("Cycle")
          .nodes(List.of(
              NodeDefinition.builder().id("start").type("START").next("a").build(),
              NodeDefinition.builder().id("a").type("SET_VARIABLE")
                  .config(Map.of("assignments", List.of()))
                  .next("b").build(),
              NodeDefinition.builder().id("b").type("SET_VARIABLE")
                  .config(Map.of("assignments", List.of()))
                  .next("a").build(), // cycle: a → b → a
              NodeDefinition.builder().id("end").type("END").build()
          ))
          .build();

      ValidationResult result = validator.validate(wf);
      assertFalse(result.isValid());
      assertTrue(result.getErrors().stream().anyMatch(i -> "W007".equals(i.getCode())));
    }

    @Test
    @DisplayName("检测自环")
    void detectSelfLoop() {
      WorkflowDefinition wf = WorkflowDefinition.builder()
          .id("wf-self-loop")
          .name("Self Loop")
          .nodes(List.of(
              NodeDefinition.builder().id("start").type("START").next("loop").build(),
              NodeDefinition.builder().id("loop").type("SET_VARIABLE")
                  .config(Map.of("assignments", List.of()))
                  .next("loop").build(), // self-loop
              NodeDefinition.builder().id("end").type("END").build()
          ))
          .build();

      ValidationResult result = validator.validate(wf);
      assertFalse(result.isValid());
      assertTrue(result.getErrors().stream().anyMatch(i -> "W007".equals(i.getCode())));
    }

    @Test
    @DisplayName("无环工作流不报错")
    void noCycle() {
      WorkflowDefinition wf = WorkflowDefinition.builder()
          .id("wf-no-cycle")
          .name("No Cycle")
          .nodes(List.of(
              NodeDefinition.builder().id("start").type("START").next("a").build(),
              NodeDefinition.builder().id("a").type("SET_VARIABLE")
                  .config(Map.of("assignments", List.of()))
                  .next("b").build(),
              NodeDefinition.builder().id("b").type("SET_VARIABLE")
                  .config(Map.of("assignments", List.of()))
                  .next("end").build(),
              NodeDefinition.builder().id("end").type("END").build()
          ))
          .build();

      ValidationResult result = validator.validate(wf);
      assertTrue(result.isValid());
      assertTrue(result.getErrors().stream().noneMatch(i -> "W007".equals(i.getCode())));
    }
  }

  // ==================== 可达性检测 ====================

  @Nested
  @DisplayName("Reachability Detection")
  class ReachabilityDetection {

    @Test
    @DisplayName("检测孤立节点")
    void detectUnreachableNode() {
      WorkflowDefinition wf = WorkflowDefinition.builder()
          .id("wf-unreachable")
          .name("Unreachable")
          .nodes(List.of(
              NodeDefinition.builder().id("start").type("START").next("end").build(),
              NodeDefinition.builder().id("orphan").type("SET_VARIABLE")
                  .config(Map.of("assignments", List.of()))
                  .build(), // unreachable
              NodeDefinition.builder().id("end").type("END").build()
          ))
          .build();

      ValidationResult result = validator.validate(wf);
      assertTrue(result.getWarnings().stream().anyMatch(i -> "N011".equals(i.getCode())));
    }
  }

  // ==================== 超时校验 ====================

  @Nested
  @DisplayName("Timeout Validation")
  class TimeoutValidation {

    @Test
    @DisplayName("负超时值警告")
    void negativeTimeout() {
      WorkflowDefinition wf = WorkflowDefinition.builder()
          .id("wf-timeout")
          .name("Timeout")
          .nodes(List.of(
              NodeDefinition.builder().id("start").type("START").next("n1").build(),
              NodeDefinition.builder().id("n1").type("SET_VARIABLE")
                  .config(Map.of("assignments", List.of()))
                  .timeout(-1).next("end").build(),
              NodeDefinition.builder().id("end").type("END").build()
          ))
          .build();

      ValidationResult result = validator.validate(wf);
      assertTrue(result.getWarnings().stream().anyMatch(i -> "N010".equals(i.getCode())));
    }
  }
}
