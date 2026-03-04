package cloud.xcan.angus.core.ai.domain.notification;

import cloud.xcan.angus.core.jpa.repository.BaseRepository;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.NoRepositoryBean;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

/**
 * 通知仓储接口
 */
@NoRepositoryBean
public interface NotificationRepo extends BaseRepository<Notification, Long> {

  @Query("SELECT COUNT(n) FROM Notification n WHERE n.targetUserId = :targetUserId OR n.targetUserId IS NULL")
  long countAll(@Param("targetUserId") Long targetUserId);

  @Query("SELECT COUNT(n) FROM Notification n WHERE (n.targetUserId = :targetUserId OR n.targetUserId IS NULL) AND n.isRead = false AND n.isArchived = false")
  long countUnread(@Param("targetUserId") Long targetUserId);

  @Query("SELECT COUNT(n) FROM Notification n WHERE (n.targetUserId = :targetUserId OR n.targetUserId IS NULL) AND n.isStarred = true AND n.isArchived = false")
  long countStarred(@Param("targetUserId") Long targetUserId);

  @Query("SELECT COUNT(n) FROM Notification n WHERE (n.targetUserId = :targetUserId OR n.targetUserId IS NULL) AND n.isArchived = true")
  long countArchived(@Param("targetUserId") Long targetUserId);

  @Query("SELECT COUNT(n) FROM Notification n WHERE (n.targetUserId = :targetUserId OR n.targetUserId IS NULL) AND DATE(n.timestamp) = CURRENT_DATE")
  long countTodayNew(@Param("targetUserId") Long targetUserId);

  @Query("SELECT n.type, COUNT(n) FROM Notification n WHERE (n.targetUserId = :targetUserId OR n.targetUserId IS NULL) GROUP BY n.type")
  List<Object[]> countByType(@Param("targetUserId") Long targetUserId);

  @Query("SELECT n.priority, COUNT(n) FROM Notification n WHERE (n.targetUserId = :targetUserId OR n.targetUserId IS NULL) GROUP BY n.priority")
  List<Object[]> countByPriority(@Param("targetUserId") Long targetUserId);

  @Query("SELECT n.category, COUNT(n) FROM Notification n WHERE (n.targetUserId = :targetUserId OR n.targetUserId IS NULL) GROUP BY n.category")
  List<Object[]> countByCategory(@Param("targetUserId") Long targetUserId);

  @Modifying
  @Transactional
  @Query("UPDATE Notification n SET n.isRead = :isRead WHERE n.id IN :ids")
  void updateReadStatus(@Param("ids") List<Long> ids, @Param("isRead") Boolean isRead);

  @Modifying
  @Transactional
  @Query("UPDATE Notification n SET n.isStarred = :isStarred WHERE n.id IN :ids")
  void updateStarredStatus(@Param("ids") List<Long> ids, @Param("isStarred") Boolean isStarred);

  @Modifying
  @Transactional
  @Query("UPDATE Notification n SET n.isArchived = true WHERE n.id IN :ids")
  void archiveByIds(@Param("ids") List<Long> ids);

  @Modifying
  @Transactional
  @Query("UPDATE Notification n SET n.isRead = true WHERE (n.targetUserId = :targetUserId OR n.targetUserId IS NULL) AND n.isRead = false AND n.isArchived = false")
  int markAllAsRead(@Param("targetUserId") Long targetUserId);

  @Query("SELECT n FROM Notification n WHERE (n.targetUserId = :targetUserId OR n.targetUserId IS NULL) AND n.timestamp BETWEEN :startTime AND :endTime ORDER BY n.timestamp DESC")
  List<Notification> findByTimeRange(@Param("targetUserId") Long targetUserId,
      @Param("startTime") LocalDateTime startTime,
      @Param("endTime") LocalDateTime endTime);

  @Query("SELECT n FROM Notification n WHERE n.targetUserId IS NOT NULL AND n.isEmailSent = false ORDER BY n.timestamp ASC LIMIT ?1")
  List<Notification> findUnsentEmailNotifications(int size);

  @Modifying
  @Transactional
  @Query("UPDATE Notification n SET n.isEmailSent = :isEmailSent WHERE n.id IN :ids")
  void updateEmailSentStatus(@Param("ids") List<Long> ids,
      @Param("isEmailSent") Boolean isEmailSent);

  @Query(value = "SELECT COUNT(*) FROM ai_notification n WHERE n.tenant_id IN :tenantIds", nativeQuery = true)
  long countAllByTenantIdIn(@Param("tenantIds") List<Long> tenantIds);

  @Query(value = "SELECT COUNT(*) FROM ai_notification n WHERE n.tenant_id IN :tenantIds AND n.is_email_sent = 0", nativeQuery = true)
  long countInternalByTenantIdIn(@Param("tenantIds") List<Long> tenantIds);

  @Query(value = "SELECT COUNT(*) FROM ai_notification n WHERE n.tenant_id IN :tenantIds AND n.is_email_sent = 1", nativeQuery = true)
  long countEmailSentByTenantIdIn(@Param("tenantIds") List<Long> tenantIds);

  @Query(value = "SELECT COUNT(*) FROM ai_notification n WHERE n.tenant_id IN :tenantIds AND n.timestamp BETWEEN :startTime AND :endTime", nativeQuery = true)
  long countByTenantIdInAndTimestampBetween(
      @Param("tenantIds") List<Long> tenantIds,
      @Param("startTime") LocalDateTime startTime,
      @Param("endTime") LocalDateTime endTime);
}
