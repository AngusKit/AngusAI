package cloud.xcan.angus.core.ai.domain.application;

import cloud.xcan.angus.core.jpa.repository.BaseRepository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.NoRepositoryBean;
import org.springframework.data.repository.query.Param;

@NoRepositoryBean
public interface ApplicationRepo extends BaseRepository<Application, Long> {

  /**
   * 根据分享ID查询应用
   */
  Optional<Application> findByShareId(String shareId);

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

  /**
   * 更新API调用次数
   */
  @Modifying
  @Query("UPDATE Application a SET a.apiCalls = a.apiCalls + :increment WHERE a.id = :id")
  void incrementApiCalls(@Param("id") Long id, @Param("increment") Long increment);

  /**
   * 更新总token数
   */
  @Modifying
  @Query("UPDATE Application a SET a.totalTokens = a.totalTokens + :increment WHERE a.id = :id")
  void incrementTotalTokens(@Param("id") Long id, @Param("increment") Long increment);

  /**
   * 更新平均响应时间
   */
  @Modifying
  @Query("UPDATE Application a SET a.avgResponseTime = :avgResponseTime WHERE a.id = :id")
  void updateAvgResponseTime(@Param("id") Long id,
      @Param("avgResponseTime") Double avgResponseTime);

  /**
   * 更新成功率
   */
  @Modifying
  @Query("UPDATE Application a SET a.successRate = :successRate WHERE a.id = :id")
  void updateSuccessRate(@Param("id") Long id, @Param("successRate") Double successRate);

  /**
   * 查询过期的分享应用
   */
  @Query("SELECT a FROM Application a WHERE a.shareExpiresAt IS NOT NULL AND a.shareExpiresAt < :now")
  List<Application> findExpiredShareApplications(@Param("now") LocalDateTime now);

  /**
   * 清理过期的分享链接
   */
  @Modifying
  @Query("UPDATE Application a SET a.shareId = NULL, a.shareExpiresAt = NULL WHERE a.shareExpiresAt IS NOT NULL AND a.shareExpiresAt < :now")
  void clearExpiredShareLinks(@Param("now") LocalDateTime now);

}
