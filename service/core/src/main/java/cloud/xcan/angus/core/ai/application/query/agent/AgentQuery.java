package cloud.xcan.angus.core.ai.application.query.agent;

import cloud.xcan.angus.core.ai.domain.agent.Agent;
import cloud.xcan.angus.core.ai.domain.agent.AgentStatus;
import cloud.xcan.angus.core.ai.domain.application.ApplicationAgent;
import cloud.xcan.angus.core.jpa.criteria.GenericSpecification;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

public interface AgentQuery {

  /**
   * 查询智能体并检查是否存在
   */
  Agent findAndCheck(Long id);

  /**
   * 查询智能体并检查是否存在且有效
   */
  Agent findAndCheckValid(Long id);

  /**
   * 分页查询智能体列表
   */
  Page<Agent> find(GenericSpecification<Agent> spec, PageRequest pageable,
      boolean fullTextSearch, String[] match);

  /**
   * 批量根据ID查询智能体（用于性能优化，不存在的ID将不会出现在结果中）
   */
  List<Agent> findByIds(List<Long> ids);

  /**
   * 根据应用ID查询绑定的智能体列表
   */
  List<ApplicationAgent> findAgentByApplicationIdIn(List<Long> applicationIds);

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
