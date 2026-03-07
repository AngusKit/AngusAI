package cloud.xcan.angus.core.ai.application.cmd.agent;

import cloud.xcan.angus.core.ai.domain.agent.Agent;
import cloud.xcan.angus.core.ai.domain.agent.AgentStatus;

public interface AgentCmd {

  /**
   * 创建智能体
   */
  Agent create(Agent agent);

  /**
   * 更新智能体
   */
  Agent update(Agent agent);

  /**
   * 更新智能体状态（发布/下线）
   */
  Agent updateStatus(Long id, AgentStatus status);

  /**
   * 删除智能体
   *
   * @param id    智能体ID
   * @param force 是否强制删除（解除应用绑定）
   */
  void delete(Long id, boolean force);

}
