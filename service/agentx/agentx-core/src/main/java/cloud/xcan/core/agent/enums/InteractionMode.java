package cloud.xcan.core.agent.enums;

/**
 * 交互模式
 */
public enum InteractionMode {
  /**
   * 多轮对话
   */
  CHATBOT,
  /**
   * 单次生成
   */
  COMPLETION,
  /**
   * 工作流触发
   */
  WORKFLOW,
  /**
   * 纯 REST API
   */
  AGENT_AS_API,
  /**
   * 多轮引导任务
   */
  MULTI_TURN_TASK
}
