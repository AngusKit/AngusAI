package cloud.xcan.agentx.core.workflow.enums;

import io.swagger.v3.oas.annotations.media.Schema;

/**
 * WAIT 节点等待类型
 */
@Schema(description = "WAIT 节点等待类型 — 人工审批、延时、事件等")
public enum WaitType {
  @Schema(description = "人工审批")
  APPROVAL,
  @Schema(description = "延时等待")
  DELAY,
  @Schema(description = "等待外部事件")
  EVENT,
  @Schema(description = "通用等待")
  WAITING
}
