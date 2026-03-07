package cloud.xcan.agentx.core.agent.enums;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "多 Agent 协作模式")
public enum CollaborationPattern {
  @Schema(description = "意图分类 → 分发给专业 Agent")
  ROUTER,
  @Schema(description = "任务分解 → 分配子 Agent → 汇总结果")
  SUPERVISOR,
  @Schema(description = "对等 Agent 按协议动态交接控制权")
  SWARM,
  @Schema(description = "串行传递，上游输出 = 下游输入")
  SEQUENTIAL
}
