package com.agentx.core.workflow.node;

import com.agentx.core.workflow.engine.NodeExecutionContext;
import com.agentx.core.workflow.engine.NodeExecutor;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import lombok.extern.slf4j.Slf4j;

/**
 * SET_VARIABLE 节点 — 设置/修改流程变量
 */
@Slf4j
public class SetVariableNodeExecutor implements NodeExecutor {

  @Override
  public String getNodeType() {
    return "SET_VARIABLE";
  }

  @Override
  @SuppressWarnings("unchecked")
  public Map<String, Object> execute(NodeExecutionContext context) {
    Map<String, Object> config = context.getNodeDefinition().getConfig();
    List<Map<String, Object>> assignments = (List<Map<String, Object>>) config.getOrDefault(
        "assignments", List.of());

    Map<String, Object> outputs = new HashMap<>();
    for (Map<String, Object> assignment : assignments) {
      String name = (String) assignment.get("name");
      Object value = assignment.get("value");
      context.getVariables().put(name, value);
      outputs.put(name, value);
    }
    return outputs;
  }
}
