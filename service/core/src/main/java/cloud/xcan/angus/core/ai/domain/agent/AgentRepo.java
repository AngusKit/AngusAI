package cloud.xcan.angus.core.ai.domain.agent;

import cloud.xcan.angus.core.jpa.repository.BaseRepository;
import cloud.xcan.angus.core.jpa.repository.NameJoinRepository;
import java.util.List;
import org.springframework.data.repository.NoRepositoryBean;

/**
 * 智能体仓储
 */
@NoRepositoryBean
public interface AgentRepo extends NameJoinRepository<Agent, Long>, BaseRepository<Agent, Long> {

  /**
   * 检查名称是否存在（同租户下）
   */
  boolean existsByName(String name);

  /**
   * 检查名称是否存在（排除指定ID）
   */
  boolean existsByNameAndIdNot(String name, Long id);

  /**
   * 根据状态查询
   */
  List<Agent> findByStatus(AgentStatus status);

}
