package cloud.xcan.core.agent.enums;

/**
 * 推理策略
 */
public enum ReasoningStrategy {
  /**
   * Prompt → Response
   */
  SIMPLE_LLM,
  /**
   * 模型自动选择并调用函数（单步）
   */
  FUNCTION_CALLING,
  /**
   * Thought → Action → Observation 循环（多步）
   */
  REACT,
  /**
   * 先规划 → 逐步执行 → 动态调整
   */
  PLAN_AND_EXECUTE,
  /**
   * 多个 Agent 协作分工
   */
  MULTI_AGENT
}
