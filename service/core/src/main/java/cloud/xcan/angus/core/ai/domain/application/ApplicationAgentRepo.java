package cloud.xcan.angus.core.ai.domain.application;

import cloud.xcan.angus.core.jpa.repository.BaseRepository;
import java.util.List;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.repository.NoRepositoryBean;

@NoRepositoryBean
public interface ApplicationAgentRepo extends BaseRepository<ApplicationAgent, Long> {

  /**
   * 检查是否有应用绑定指定智能体（用于 Agent 删除前校验）
   */
  boolean existsByAgentId(Long agentId);

  /**
   * 按应用ID查询绑定列表（按 sortOrder 升序）
   */
  List<ApplicationAgent> findByApplicationIdOrderBySortOrderAsc(Long applicationId);

  /**
   * 批量按应用ID查询绑定（用于列表页性能优化，结果需在内存中按 applicationId 分组排序）
   */
  List<ApplicationAgent> findByApplicationIdIn(java.util.List<Long> applicationIds);

  /**
   * 删除指定应用的所有智能体绑定
   */
  @Modifying
  void deleteByApplicationId(Long applicationId);
}
