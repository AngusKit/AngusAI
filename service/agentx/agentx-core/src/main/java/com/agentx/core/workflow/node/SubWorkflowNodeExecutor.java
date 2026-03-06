package com.agentx.core.workflow.node;

import com.agentx.core.workflow.engine.NodeExecutionContext;
import com.agentx.core.workflow.engine.NodeExecutor;
import java.util.Map;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

/**
 * SUB_WORKFLOW 节点 — 调用另一个工作流
 */
@Slf4j
@Component
public class SubWorkflowNodeExecutor implements NodeExecutor {

  @Override
  public String getNodeType() {
    return "SUB_WORKFLOW";
  }

  @Override
  public Map<String, Object> execute(NodeExecutionContext context) {
    Map<String, Object> config = context.getNodeDefinition().getConfig();
    String workflowId = (String) config.get("workflowId");

    log.info("SUB_WORKFLOW calling: {}", workflowId);

    // 实际实现需要通过 WorkflowEngine 递归调用子工作流
    return Map.of("subWorkflowId", workflowId, "status", "DELEGATED");
  }
}
