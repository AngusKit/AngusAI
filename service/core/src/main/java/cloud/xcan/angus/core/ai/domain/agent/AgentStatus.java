package cloud.xcan.angus.core.ai.domain.agent;

/**
 * 智能体状态
 */
public enum AgentStatus {
  /**
   * 已发布，可被对话
   */
  ACTIVE,
  /**
   * 已下线，不可对话
   */
  INACTIVE
}
