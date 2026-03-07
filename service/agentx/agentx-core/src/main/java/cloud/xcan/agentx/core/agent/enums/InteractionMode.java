package cloud.xcan.agentx.core.agent.enums;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Agent 交互模式")
public enum InteractionMode {
  @Schema(description = "多轮对话")
  CHATBOT,
  @Schema(description = "单次生成")
  COMPLETION,
  @Schema(description = "工作流触发")
  WORKFLOW,
  @Schema(description = "纯 REST API")
  AGENT_AS_API,
  @Schema(description = "多轮引导任务")
  MULTI_TURN_TASK
}
