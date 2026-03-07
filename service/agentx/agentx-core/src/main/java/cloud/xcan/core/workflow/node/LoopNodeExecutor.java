package cloud.xcan.core.workflow.node;

import cloud.xcan.core.workflow.engine.NodeExecutionContext;
import cloud.xcan.core.workflow.engine.NodeExecutor;
import cloud.xcan.core.workflow.enums.NodeType;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import lombok.extern.slf4j.Slf4j;

/**
 * LOOP 节点 — 遍历集合执行子节点
 */
@Slf4j
public class LoopNodeExecutor implements NodeExecutor {

  @Override
  public String getNodeType() {
    return NodeType.LOOP.name();
  }

  @Override
  @SuppressWarnings("unchecked")
  public Map<String, Object> execute(NodeExecutionContext context) {
    Map<String, Object> config = context.getNodeDefinition().getConfig();
    Object collection = config.get("collection");
    String iterator = (String) config.getOrDefault("iterator", "item");
    int maxIterations = config.containsKey("maxIterations") ?
        ((Number) config.get("maxIterations")).intValue() : 1000;

    List<?> items = collection instanceof List<?> list ? list : List.of();
    int count = Math.min(items.size(), maxIterations);

    log.debug("LOOP executing {} iterations (max: {})", count, maxIterations);

    List<Object> results = new ArrayList<>();
    for (int i = 0; i < count; i++) {
      context.getVariables().put(iterator, items.get(i));
      context.getVariables().put("loopIndex", i);
      results.add(items.get(i));
    }

    return Map.of("iterations", count, "results", results);
  }
}
