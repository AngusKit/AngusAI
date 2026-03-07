package cloud.xcan.core.workflow.enums;

import io.swagger.v3.oas.annotations.media.Schema;

/**
 * 工作流触发类型
 */
@Schema(description = "工作流触发类型")
public enum TriggerType {
  @Schema(description = "手动触发")
  MANUAL,
  @Schema(description = "HTTP Webhook 触发")
  WEBHOOK,
  @Schema(description = "定时任务触发")
  CRON,
  @Schema(description = "消息队列事件触发")
  MQ_EVENT,
  @Schema(description = "SaaS 事件触发")
  SAAS_EVENT
}
