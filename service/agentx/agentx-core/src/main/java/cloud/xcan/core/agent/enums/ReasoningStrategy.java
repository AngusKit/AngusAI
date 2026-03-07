package cloud.xcan.core.agent.enums;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Agent 推理策略")
public enum ReasoningStrategy {
  @Schema(description = "Prompt → Response")
  SIMPLE_LLM,
  @Schema(description = "模型自动选择并调用函数（单步）")
  FUNCTION_CALLING,
  @Schema(description = "Thought → Action → Observation 循环（多步）")
  REACT,
  @Schema(description = "先规划 → 逐步执行 → 动态调整")
  PLAN_AND_EXECUTE,
  @Schema(description = "多个 Agent 协作分工")
  MULTI_AGENT
}
