package com.agentx.core.agent.enums;

/**
 * 自治等级 L0-L4
 */
public enum AutonomyLevel {
  /** L0 — 被动响应，无自主判断 */
  TOOL,
  /** L1 — 提供建议/草稿，人类确认后执行 */
  ASSISTANT,
  /** L2 — 低风险自主执行，高风险需审批 */
  COLLABORATOR,
  /** L3 — 自主规划执行，定期汇报 */
  DELEGATE,
  /** L4 — 自主发现→决策→执行→复盘 */
  AUTONOMOUS
}
