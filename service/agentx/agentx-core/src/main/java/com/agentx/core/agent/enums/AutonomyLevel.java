package com.agentx.core.agent.enums;

/**
 * 自治等级 L0-L4
 */
public enum AutonomyLevel {
  /**
   * L0 — 被动响应，无自主判断
   */
  TOOL(0, "工具"),
  /**
   * L1 — 提供建议/草稿，人类确认后执行
   */
  ASSISTANT(1, "助手"),
  /**
   * L2 — 低风险自主执行，高风险需审批
   */
  COLLABORATOR(2, "协作"),
  /**
   * L3 — 自主规划执行，定期汇报
   */
  DELEGATE(3, "代理"),
  /**
   * L4 — 自主发现→决策→执行→复盘
   */
  AUTONOMOUS(4, "自主");

  private final int level;
  private final String label;

  AutonomyLevel(int level, String label) {
    this.level = level;
    this.label = label;
  }

  public int getLevel() {
    return level;
  }

  public String getLabel() {
    return label;
  }
}
