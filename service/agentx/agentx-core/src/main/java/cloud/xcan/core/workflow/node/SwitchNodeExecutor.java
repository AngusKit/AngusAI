package cloud.xcan.core.workflow.node;

import cloud.xcan.core.workflow.engine.NodeExecutionContext;
import cloud.xcan.core.workflow.engine.NodeExecutor;
import cloud.xcan.core.workflow.enums.NodeType;

import java.util.List;
import java.util.Map;
import lombok.extern.slf4j.Slf4j;

/**
 * SWITCH 节点 — 多路分支（switch-case）
 */
@Slf4j
public class SwitchNodeExecutor implements NodeExecutor {

  @Override
  public String getNodeType() {
    return NodeType.SWITCH.name();
  }

  @Override
  @SuppressWarnings("unchecked")
  public Map<String, Object> execute(NodeExecutionContext context) {
    Map<String, Object> config = context.getNodeDefinition().getConfig();
    Object expressionValue = config.get("expression");
    List<Map<String, Object>> cases = (List<Map<String, Object>>) config.getOrDefault("cases",
        List.of());
    String defaultNext = (String) config.get("default");

    String matched = defaultNext;
    for (Map<String, Object> caseItem : cases) {
      if (String.valueOf(caseItem.get("value")).equals(String.valueOf(expressionValue))) {
        matched = (String) caseItem.get("next");
        break;
      }
    }

    return Map.of("nextNode", matched != null ? matched : "");
  }
}
