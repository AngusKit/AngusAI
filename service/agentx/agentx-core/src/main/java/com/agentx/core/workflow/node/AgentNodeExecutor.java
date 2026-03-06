package com.agentx.core.workflow.node;

import com.agentx.core.agent.AgentRegistry;
import com.agentx.core.workflow.engine.NodeExecutionContext;
import com.agentx.core.workflow.engine.NodeExecutor;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * AGENT 节点 — 调用一个完整智能体（含工具/记忆/RAG）
 */
@Slf4j
@RequiredArgsConstructor
public class AgentNodeExecutor implements NodeExecutor {

  private final AgentRegistry agentRegistry;

  @Override
  public String getNodeType() {
    return "AGENT";
  }

  @Override
  public Map<String, Object> execute(NodeExecutionContext context) {
    Map<String, Object> config = context.getNodeDefinition().getConfig();
    String agentId = (String) config.get("agentId");
    String input = (String) config.getOrDefault("input", "");

    log.debug("AGENT node calling agent: {}", agentId);

    String response = agentRegistry.chat(agentId, context.getExecutionId(), input);
    return Map.of("response", response);
  }
}
