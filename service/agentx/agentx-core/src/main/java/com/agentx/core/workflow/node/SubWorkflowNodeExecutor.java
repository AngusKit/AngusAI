package com.agentx.core.workflow.node;

import com.agentx.core.workflow.enums.NodeType;
import com.agentx.core.workflow.WorkflowDefinitionProvider;
import com.agentx.core.workflow.dsl.WorkflowDefinition;
import com.agentx.core.workflow.engine.NodeExecutionContext;
import com.agentx.core.workflow.engine.NodeExecutor;
import com.agentx.core.workflow.engine.WorkflowEngine;
import com.agentx.core.workflow.engine.WorkflowExecutionResult;
import com.agentx.core.workflow.expression.ExpressionEngine;
import java.util.HashMap;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * SUB_WORKFLOW 节点 — 调用子工作流并真正执行
 */
@Slf4j
@RequiredArgsConstructor
public class SubWorkflowNodeExecutor implements NodeExecutor {

  private final WorkflowEngine workflowEngine;
  private final WorkflowDefinitionProvider workflowDefinitionProvider;
  private final ExpressionEngine expressionEngine;

  @Override
  public String getNodeType() {
    return NodeType.SUB_WORKFLOW.name();
  }

  @Override
  @SuppressWarnings("unchecked")
  public Map<String, Object> execute(NodeExecutionContext context) {
    Map<String, Object> config = context.getNodeDefinition().getConfig();
    if (config == null) {
      throw new IllegalArgumentException("SUB_WORKFLOW node requires config with workflowId");
    }
    String workflowId = (String) config.get("workflowId");
    if (workflowId == null || workflowId.isBlank()) {
      throw new IllegalArgumentException("SUB_WORKFLOW node requires workflowId");
    }

    log.info("SUB_WORKFLOW executing: {}", workflowId);

    WorkflowDefinition subDef = workflowDefinitionProvider.loadById(workflowId)
        .orElseThrow(() -> new IllegalArgumentException("Sub-workflow not found: " + workflowId));

    Map<String, Object> subInputs = buildSubInputs(context, config);
    WorkflowExecutionResult result = workflowEngine.execute(subDef, subInputs);

    Map<String, Object> output = result.getOutput() != null ? result.getOutput() : Map.of();
    return Map.of(
        "subWorkflowId", workflowId,
        "status", result.getStatus() != null ? result.getStatus().name() : "UNKNOWN",
        "output", output,
        "executionId", result.getExecutionId() != null ? result.getExecutionId() : ""
    );
  }

  /**
   * 构建子工作流入参：优先使用 config.inputVariables（支持表达式），否则透传父工作流 variables
   */
  private Map<String, Object> buildSubInputs(NodeExecutionContext context, Map<String, Object> config) {
    Object inputVars = config.get("inputVariables");
    if (inputVars instanceof Map) {
      Map<String, Object> copy = new HashMap<>((Map<String, Object>) inputVars);
      return expressionEngine.resolveMap(copy, buildExprContext(context));
    }
    return context.getVariables() != null ? new HashMap<>(context.getVariables()) : new HashMap<>();
  }

  private Map<String, Object> buildExprContext(NodeExecutionContext context) {
    Map<String, Object> ctx = new HashMap<>();
    ctx.put("variables", context.getVariables() != null ? context.getVariables() : Map.of());
    ctx.put("nodes", context.getNodeOutputs() != null ? context.getNodeOutputs() : Map.of());
    ctx.put("executionId", context.getExecutionId());
    return ctx;
  }
}
