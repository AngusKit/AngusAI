package com.agentx.core.workflow.node;

import com.agentx.core.workflow.enums.NodeType;

import com.agentx.core.workflow.engine.NodeExecutionContext;
import com.agentx.core.workflow.engine.NodeExecutor;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import lombok.extern.slf4j.Slf4j;

/**
 * PARALLEL 节点 — 并行执行多个分支
 */
@Slf4j
public class ParallelNodeExecutor implements NodeExecutor {

  @Override
  public String getNodeType() {
    return NodeType.PARALLEL.name();
  }

  @Override
  @SuppressWarnings("unchecked")
  public Map<String, Object> execute(NodeExecutionContext context) {
    Map<String, Object> config = context.getNodeDefinition().getConfig();
    List<String> branches = (List<String>) config.getOrDefault("branches", List.of());
    boolean waitAll = (boolean) config.getOrDefault("waitAll", true);

    log.debug("PARALLEL executing {} branches, waitAll={}", branches.size(), waitAll);

    // 并行分支的实际执行由 WorkflowEngine 负责调度
    // 这里记录需要执行的分支
    Map<String, Object> outputs = new HashMap<>();
    outputs.put("branches", branches);
    outputs.put("waitAll", waitAll);
    return outputs;
  }
}
