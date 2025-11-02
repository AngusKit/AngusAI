package cloud.xcan.angus.core.ai.domain.settings.apikey;

import cloud.xcan.angus.core.jpa.repository.BaseRepository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.NoRepositoryBean;

/**
 * API密钥仓储接口
 */
@NoRepositoryBean
public interface ApiKeyRepo extends BaseRepository<ApiKey, Long> {

  // ==================== 查询方法 ====================

  /**
   * 根据密钥哈希查找
   */
  Optional<ApiKey> findByKeyHash(String keyHash);

  /**
   * 根据状态查找
   */
  List<ApiKey> findByStatus(ApiKeyStatus status);

  /**
   * 查找已过期但状态仍为ACTIVE的密钥
   */
  @Query("SELECT a FROM ApiKey a WHERE a.status = 'ACTIVE' AND a.expiresAt < :now")
  List<ApiKey> findExpiredActiveKeys(LocalDateTime now);

  /**
   * 查找用户的所有密钥
   */
  List<ApiKey> findByCreatedByOrderByCreatedAtDesc(Long userId);

  // ==================== 统计方法 ====================

  /**
   * 统计用户的密钥数量
   */
  long countByCreatedBy(Long userId);

  // ==================== 修改方法 ====================

  /**
   * 更新使用统计
   */
  @Query("UPDATE ApiKey a SET a.usageCount = a.usageCount + 1, a.lastUsedAt = :usedAt WHERE a.id = :id")
  int updateUsageStats(Long id, LocalDateTime usedAt);
}
