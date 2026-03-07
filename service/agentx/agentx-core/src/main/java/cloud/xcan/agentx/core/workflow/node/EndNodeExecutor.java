package cloud.xcan.agentx.core.workflow.node;

import cloud.xcan.agentx.core.workflow.engine.NodeExecutionContext;
import cloud.xcan.agentx.core.workflow.engine.NodeExecutor;
import cloud.xcan.agentx.core.workflow.enums.NodeType;
import java.util.HashMap;
import java.util.Map;

/**
 * END 节点 — 流程出口
 */
public class EndNodeExecutor implements NodeExecutor {

  @Override
  public String getNodeType() {
    return NodeType.END.name();
  }

  @Override
  @SuppressWarnings("unchecked")
  public Map<String, Object> execute(NodeExecutionContext context) {
    Map<String, Object> outputs = new HashMap<>();
    Map<String, Object> config = context.getNodeDefinition().getConfig();
    if (config != null && config.containsKey("output")) {
      Object output = config.get("output");
      if (output instanceof Map) {
        outputs.putAll((Map<String, Object>) output);
      }
    }
    return outputs;
  }
}
