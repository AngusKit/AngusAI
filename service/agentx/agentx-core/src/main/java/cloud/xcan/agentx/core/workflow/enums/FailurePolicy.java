package cloud.xcan.agentx.core.workflow.enums;

import io.swagger.v3.oas.annotations.media.Schema;

/**
 * 工作流节点/全局失败策略
 */
@Schema(description = "工作流全局失败策略 — 节点执行失败时的处理方式")
public enum FailurePolicy {
  @Schema(description = "立即停止并向上抛出异常")
  STOP,
  @Schema(description = "忽略失败，继续执行后续节点")
  CONTINUE,
  @Schema(description = "回滚已执行操作")
  ROLLBACK
}
