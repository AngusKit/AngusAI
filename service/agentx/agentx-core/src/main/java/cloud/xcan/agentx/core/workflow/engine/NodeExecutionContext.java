package cloud.xcan.agentx.core.workflow.engine;

import cloud.xcan.agentx.core.workflow.dsl.NodeDefinition;
import java.util.Map;
import lombok.Builder;
import lombok.Data;

/**
 * 节点执行上下文
 */
@Data
@Builder
public class NodeExecutionContext {

  /**
   * 当前节点定义
   */
  private NodeDefinition nodeDefinition;

  /**
   * 工作流全局变量
   */
  private Map<String, Object> variables;

  /**
   * 所有已执行节点的输出 (nodeId → outputs)
   */
  private Map<String, Map<String, Object>> nodeOutputs;

  /**
   * 加密密钥引用
   */
  private Map<String, String> secrets;

  /**
   * 运行时上下文 (tenantId, userId 等)
   */
  private Map<String, Object> runtimeContext;

  /**
   * 工作流执行 ID
   */
  private String executionId;
}
