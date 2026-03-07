package cloud.xcan.agentx.core.workflow.enums;

import io.swagger.v3.oas.annotations.media.Schema;

/**
 * 节点失败/超时处理策略 — 用于 NodeDefinition.FailureHandler
 */
@Schema(description = "节点失败/超时处理策略")
public enum FailureStrategy {
  @Schema(description = "停止执行并向上抛出")
  STOP,
  @Schema(description = "跳过当前节点继续执行")
  SKIP,
  @Schema(description = "跳转到备用节点")
  FALLBACK,
  @Schema(description = "跳转到指定节点")
  GOTO
}
