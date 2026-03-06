package cloud.xcan.core.agent.enums;

/**
 * 多 Agent 协作模式
 */
public enum CollaborationPattern {
  /**
   * 意图分类 → 分发给专业 Agent
   */
  ROUTER,
  /**
   * 任务分解 → 分配子 Agent → 汇总结果
   */
  SUPERVISOR,
  /**
   * 对等 Agent 按协议动态交接控制权
   */
  SWARM,
  /**
   * 串行传递，上游输出 = 下游输入
   */
  SEQUENTIAL
}
