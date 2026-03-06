package com.agentx.core.workflow.node;

import com.agentx.core.workflow.engine.NodeExecutionContext;
import com.agentx.core.workflow.engine.NodeExecutor;
import java.util.HashMap;
import java.util.Map;
import org.springframework.stereotype.Component;

/**
 * START 节点 — 流程入口
 */
@Component
public class StartNodeExecutor implements NodeExecutor {

  @Override
  public String getNodeType() {
    return "START";
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
