package cloud.xcan.angus.core.ai.domain.agent;

import cloud.xcan.angus.core.jpa.repository.BaseRepository;
import cloud.xcan.angus.core.jpa.repository.NameJoinRepository;
import java.util.List;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.NoRepositoryBean;
import org.springframework.data.repository.query.Param;

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
   * 检查编码是否存在（同租户下）
   */
  boolean existsByEncoding(String encoding);

  /**
   * 检查编码是否存在（排除指定ID）
   */
  boolean existsByEncodingAndIdNot(String encoding, Long id);

  /**
   * 根据状态查询
   */
  List<Agent> findByStatus(AgentStatus status);

  /**
   * 一次性聚合查询用户的各类智能体数量（total/active/inactive），减少数据库往返
   */
  @Query(value = "SELECT COUNT(*) AS total, "
      + "COALESCE(SUM(CASE WHEN status = 'ACTIVE' THEN 1 ELSE 0 END), 0) AS active, "
      + "COALESCE(SUM(CASE WHEN status = 'INACTIVE' THEN 1 ELSE 0 END), 0) AS inactive "
      + "FROM ai_agent WHERE created_by = :createdBy", nativeQuery = true)
  AgentCountsProjection countByCreatedByGrouped(@Param("createdBy") Long createdBy);

}
