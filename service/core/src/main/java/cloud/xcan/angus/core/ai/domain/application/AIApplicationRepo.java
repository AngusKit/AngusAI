package cloud.xcan.angus.core.ai.domain.application;

import cloud.xcan.angus.core.jpa.repository.BaseRepository;
import cloud.xcan.angus.core.jpa.repository.NameJoinRepository;
import java.util.Optional;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.NoRepositoryBean;
import org.springframework.data.repository.query.Param;

@NoRepositoryBean
public interface AIApplicationRepo extends NameJoinRepository<AIApplication, Long>,
    BaseRepository<AIApplication, Long> {

  /**
   * 检查应用名称是否已存在（同一租户下）
   */
  boolean existsByName(String name);

  /**
   * 检查应用名称是否已存在（排除指定ID）
   */
  boolean existsByNameAndIdNot(String name, Long id);

  /**
   * 一次性聚合查询用户的各类应用数量（total/draft/published/paused），减少数据库往返
   */
  @Query(value = "SELECT COUNT(*) AS total, "
      + "COALESCE(SUM(CASE WHEN status = 'DRAFT' THEN 1 ELSE 0 END), 0) AS draft, "
      + "COALESCE(SUM(CASE WHEN status = 'PUBLISHED' THEN 1 ELSE 0 END), 0) AS published, "
      + "COALESCE(SUM(CASE WHEN status = 'PAUSED' THEN 1 ELSE 0 END), 0) AS paused "
      + "FROM ai_application WHERE created_by = :createdBy", nativeQuery = true)
  ApplicationCountsProjection countByCreatedByGrouped(@Param("createdBy") Long createdBy);

}
