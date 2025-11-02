package cloud.xcan.angus.core.ai.domain.settings;

import cloud.xcan.angus.core.jpa.repository.BaseRepository;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.NoRepositoryBean;
import org.springframework.transaction.annotation.Transactional;

/**
 * 用户会话仓储接口
 */
@NoRepositoryBean
public interface UserSessionRepo extends BaseRepository<UserSession, Long> {

  // ==================== 查询方法 ====================

  /**
   * 根据用户ID查询所有会话
   */
  List<UserSession> findByUserIdOrderByLastActiveAtDesc(Long userId);

  /**
   * 根据会话ID查询
   */
  UserSession findBySessionId(String sessionId);

  // ==================== 统计方法 ====================

  /**
   * 根据用户ID统计活跃会话数
   */
  @Query("SELECT COUNT(s) FROM UserSession s WHERE s.userId = ?1 AND s.expiresAt > ?2")
  int countActiveSessionsByUserId(Long userId, LocalDateTime now);

  // ==================== 删除方法 ====================

  /**
   * 删除用户的所有会话（除了当前会话）
   */
  @Transactional
  @Modifying
  @Query("DELETE FROM UserSession s WHERE s.userId = ?1 AND s.sessionId != ?2")
  void deleteByUserIdExceptCurrent(Long userId, String currentSessionId);

  /**
   * 删除过期会话
   */
  @Transactional
  @Modifying
  @Query("DELETE FROM UserSession s WHERE s.expiresAt < ?1")
  void deleteExpiredSessions(LocalDateTime now);

  /**
   * 根据用户ID删除所有会话
   */
  void deleteByUserId(Long userId);
}
