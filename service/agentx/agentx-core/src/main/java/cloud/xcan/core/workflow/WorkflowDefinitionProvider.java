package cloud.xcan.core.workflow;

import cloud.xcan.core.workflow.dsl.WorkflowDefinition;
import java.util.List;
import java.util.Optional;

/**
 * 工作流定义提供者 — 统一工作流加载入口，供 AgentRegistry、SubWorkflowNodeExecutor、WorkflowController 共用。
 */
public interface WorkflowDefinitionProvider {

  /**
   * 根据 ID 加载工作流定义
   */
  Optional<WorkflowDefinition> loadById(String workflowId);

  /**
   * 根据 Long 类型 ID 加载（兼容 Agent.workflowId），内部转为 String 后查找
   */
  default Optional<WorkflowDefinition> loadByLongId(Long workflowId) {
    return workflowId != null ? loadById(String.valueOf(workflowId)) : Optional.empty();
  }

  /**
   * 加载所有已注册的工作流
   */
  List<WorkflowDefinition> loadAll();

  /**
   * 注册工作流定义（可选，内存实现支持；持久化实现可写库）
   */
  default void register(WorkflowDefinition definition) {
    throw new UnsupportedOperationException("This provider does not support runtime registration");
  }
}
