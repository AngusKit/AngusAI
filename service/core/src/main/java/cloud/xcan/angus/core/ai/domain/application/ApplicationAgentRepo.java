package cloud.xcan.angus.core.ai.domain.application;

import cloud.xcan.angus.core.jpa.repository.BaseRepository;
import org.springframework.data.repository.NoRepositoryBean;

@NoRepositoryBean
public interface ApplicationAgentRepo extends BaseRepository<ApplicationAgent, Long> {

  /**
   * 检查是否有应用绑定指定智能体（用于 Agent 删除前校验）
   */
  boolean existsByAgentId(Long agentId);
}
