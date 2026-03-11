package cloud.xcan.angus.core.ai.domain.agent;

/**
 * 智能体数量统计投影（用于一次查询聚合 total/active/inactive）
 */
public interface AgentCountsProjection {

  long getTotal();

  long getActive();

  long getInactive();
}
