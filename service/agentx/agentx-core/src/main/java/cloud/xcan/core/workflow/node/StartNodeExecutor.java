package cloud.xcan.core.workflow.node;

import cloud.xcan.core.workflow.engine.NodeExecutionContext;
import cloud.xcan.core.workflow.engine.NodeExecutor;
import cloud.xcan.core.workflow.enums.NodeType;
import java.util.HashMap;
import java.util.Map;

/**
 * START 节点 — 流程入口
 */
public class StartNodeExecutor implements NodeExecutor {

  @Override
  public String getNodeType() {
    return NodeType.START.name();
  }

  @Override
  public Map<String, Object> execute(NodeExecutionContext context) {
    Map<String, Object> outputs = new HashMap<>();
    // 将全局变量传递到输出
    if (context.getVariables() != null) {
      outputs.putAll(context.getVariables());
    }
    // 解析节点定义的 outputs 映射
    if (context.getNodeDefinition().getOutputs() != null) {
      outputs.putAll(context.getNodeDefinition().getOutputs());
    }
    return outputs;
  }
}
