package cloud.xcan.agentx.core.agent.enums;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Agent 生命周期状态")
public enum AgentStatus {
  @Schema(description = "草稿")
  DRAFT,
  @Schema(description = "已配置")
  CONFIGURED,
  @Schema(description = "已发布")
  PUBLISHED,
  @Schema(description = "运行中")
  RUNNING,
  @Schema(description = "已暂停")
  PAUSED,
  @Schema(description = "已归档")
  ARCHIVED
}
