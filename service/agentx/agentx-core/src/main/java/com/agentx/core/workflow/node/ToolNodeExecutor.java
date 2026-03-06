package com.agentx.core.workflow.node;

import com.agentx.core.tool.ToolRegistry;
import com.agentx.core.workflow.engine.NodeExecutionContext;
import com.agentx.core.workflow.engine.NodeExecutor;
import java.util.HashMap;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

/**
 * TOOL 节点 — 调用已注册工具
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class ToolNodeExecutor implements NodeExecutor {

  private final ToolRegistry toolRegistry;

  @Override
  public String getNodeType() {
    return "TOOL";
  }

  @Override
  @SuppressWarnings("unchecked")
  public Map<String, Object> execute(NodeExecutionContext context) {
    Map<String, Object> config = context.getNodeDefinition().getConfig();
    String toolId = (String) config.get("toolId");
    Map<String, Object> params = (Map<String, Object>) config.getOrDefault("params", Map.of());

    log.debug("Executing tool: {} with params: {}", toolId, params.keySet());

    String result = toolRegistry.executeTool(toolId, params);

    Map<String, Object> outputs = new HashMap<>();
    outputs.put("result", result);
    return outputs;
  }
}
