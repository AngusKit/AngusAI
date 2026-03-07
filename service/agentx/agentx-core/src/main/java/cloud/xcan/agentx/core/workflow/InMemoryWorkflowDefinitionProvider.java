package cloud.xcan.agentx.core.workflow;

import cloud.xcan.agentx.core.workflow.dsl.WorkflowDefinition;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import lombok.extern.slf4j.Slf4j;

/**
 * 内存工作流定义提供者 — 基于 ConcurrentHashMap 存储，支持运行时注册。
 */
@Slf4j
public class InMemoryWorkflowDefinitionProvider implements WorkflowDefinitionProvider {

  private final Map<String, WorkflowDefinition> store = new ConcurrentHashMap<>();

  @Override
  public Optional<WorkflowDefinition> loadById(String workflowId) {
    return Optional.ofNullable(store.get(workflowId));
  }

  @Override
  public List<WorkflowDefinition> loadAll() {
    return new ArrayList<>(store.values());
  }

  @Override
  public void register(WorkflowDefinition definition) {
    if (definition != null && definition.getId() != null) {
      store.put(definition.getId(), definition);
      log.info("Workflow registered: {} ({})", definition.getName(), definition.getId());
    }
  }
}
