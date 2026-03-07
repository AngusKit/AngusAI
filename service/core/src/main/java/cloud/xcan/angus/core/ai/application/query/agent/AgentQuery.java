package cloud.xcan.angus.core.ai.application.query.agent;

import cloud.xcan.angus.core.ai.domain.agent.Agent;
import cloud.xcan.angus.core.ai.domain.agent.AgentStatus;
import cloud.xcan.agentx.core.agent.enums.InteractionMode;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface AgentQuery {

  /**
   * 查询智能体并检查是否存在
   */
  Agent findAndCheck(Long id);

  /**
   * 分页查询智能体列表
   */
  Page<Agent> find(String keyword, AgentStatus status, InteractionMode interactionMode,
      Pageable pageable);

  /**
   * 查询 ACTIVE 状态的智能体列表（用于应用绑定选择器、启动时注册）
   */
  List<Agent> findByStatus(AgentStatus status);

  /**
   * 检查智能体名称是否存在
   */
  boolean existsByName(String name);

  /**
   * 检查智能体名称是否存在（排除指定ID）
   */
  boolean existsByNameAndIdNot(String name, Long id);

  /**
   * 检查智能体是否被应用引用
   */
  boolean isReferencedByApplications(Long agentId);

}
