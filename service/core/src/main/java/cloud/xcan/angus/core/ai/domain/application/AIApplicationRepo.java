package cloud.xcan.angus.core.ai.domain.application;

import cloud.xcan.angus.core.jpa.repository.BaseRepository;
import cloud.xcan.angus.core.jpa.repository.NameJoinRepository;
import java.util.Optional;
import org.springframework.data.repository.NoRepositoryBean;

@NoRepositoryBean
public interface AIApplicationRepo extends NameJoinRepository<AIApplication, Long>,
    BaseRepository<AIApplication, Long> {

  /**
   * 根据分享ID查询应用
   */
  Optional<AIApplication> findByShareId(String shareId);

  /**
   * 检查应用名称是否已存在（同一租户下）
   */
  boolean existsByName(String name);

  /**
   * 检查应用名称是否已存在（排除指定ID）
   */
  boolean existsByNameAndIdNot(String name, Long id);

  /**
   * 统计用户的应用程序数量
   */
  long countByCreatedBy(Long createdBy);

  /**
   * 统计指定状态的应用数量
   */
  long countByStatus(ApplicationStatus status);

}
