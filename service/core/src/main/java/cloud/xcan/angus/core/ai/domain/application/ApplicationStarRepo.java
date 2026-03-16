package cloud.xcan.angus.core.ai.domain.application;

import cloud.xcan.angus.core.jpa.repository.BaseRepository;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.repository.NoRepositoryBean;

@NoRepositoryBean
public interface ApplicationStarRepo extends BaseRepository<ApplicationStar, Long> {

  /**
   * 根据应用ID和用户ID查询标星记录
   */
  Optional<ApplicationStar> findByApplicationIdAndUserId(Long applicationId, Long userId);

  /**
   * 检查用户是否已标星指定应用
   */
  boolean existsByApplicationIdAndUserId(Long applicationId, Long userId);

  /**
   * 统计用户标星的应用数量
   */
  long countByUserId(Long userId);

  /**
   * 批量查询用户已标星的应用ID列表
   */
  List<ApplicationStar> findByUserIdAndApplicationIdIn(Long userId,
      Collection<Long> applicationIds);

  /**
   * 查询用户已标星的所有应用
   */
  List<ApplicationStar> findByUserId(Long userId);

  /**
   * 删除指定应用和用户的标星记录
   */
  @Modifying
  void deleteByApplicationIdAndUserId(Long applicationId, Long userId);
}
