package cloud.xcan.core.workflow.node;

import cloud.xcan.core.workflow.engine.NodeExecutionContext;
import cloud.xcan.core.workflow.engine.NodeExecutor;
import cloud.xcan.core.workflow.enums.NodeType;
import cloud.xcan.core.workflow.enums.WaitType;
import java.util.Map;
import lombok.extern.slf4j.Slf4j;

/**
 * WAIT 节点 — 暂停等待人工审批或外部事件
 */
@Slf4j
public class WaitNodeExecutor implements NodeExecutor {

  @Override
  public String getNodeType() {
    return NodeType.WAIT.name();
  }

  @Override
  public Map<String, Object> execute(NodeExecutionContext context) {
    Map<String, Object> config = context.getNodeDefinition().getConfig();
    String waitType = (String) config.getOrDefault("waitType", "APPROVAL");
    int timeout =
        config.containsKey("timeout") ? ((Number) config.get("timeout")).intValue() : 3600;

    log.info("WAIT node: type={}, timeout={}s, execution={}", waitType, timeout,
        context.getExecutionId());

    // 实际实现需要持久化状态等待外部信号恢复
    return Map.of("waitType", waitType, "status", WaitType.WAITING.name(), "timeout", timeout);
  }
}
