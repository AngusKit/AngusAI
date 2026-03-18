package cloud.xcan.angus.core.ai.domain.chat;

import cloud.xcan.angus.core.jpa.repository.BaseRepository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.NoRepositoryBean;
import org.springframework.data.repository.query.Param;

/**
 * 会话仓储接口
 */
@NoRepositoryBean
public interface SessionRepo extends BaseRepository<Session, Long> {

  /**
   * 根据会话ID(UUID)查询
   */
  Optional<Session> findBySessionId(String sessionId);

  /**
   * 根据会话ID(UUID)列表批量查询（用于 batchDelete 等）
   */
  List<Session> findBySessionIdIn(List<String> sessionIds);

  /**
   * 统计某用户创建的会话总数
   */
  long countByCreatedBy(Long createdBy);

  /**
   * 统计某用户在某应用下的会话数量（用于配额校验）
   */
  long countByCreatedByAndAppId(Long createdBy, Long appId);

  /**
   * 统计创建时间在指定范围内的会话数
   */
  long countByCreatedDateBetween(LocalDateTime start, LocalDateTime end);

  /**
   * 统计指定时间范围内去重用户数（按 created_by）
   */
  @Query("SELECT COUNT(DISTINCT s.createdBy) FROM Session s WHERE s.createdDate BETWEEN :start AND :end")
  long countDistinctCreatedByByCreatedDateBetween(@Param("start") LocalDateTime start,
      @Param("end") LocalDateTime end);

  /**
   * 统计历史去重用户总数（按 created_by）
   */
  @Query("SELECT COUNT(DISTINCT s.createdBy) FROM Session s")
  long countDistinctCreatedBy();

  /**
   * 统计应用的使用次数
   */
  long countByAppId(Long appId);

  /**
   * 按 appId 分组统计消息数（用于 Top 应用） 返回 List&lt;Object[]&gt;，[0]=appId, [1]=messageCount
   */
  @Query("SELECT s.appId, COUNT(m) FROM Message m, Session s WHERE m.sessionEntityId = s.id "
      + "GROUP BY s.appId ORDER BY COUNT(m) DESC")
  List<Object[]> countMessagesByAppId(org.springframework.data.domain.Pageable pageable);

  /**
   * 按 modelId 分组统计消息数（用于 Top 模型） 返回 List&lt;Object[]&gt;，[0]=modelId, [1]=messageCount
   */
  @Query("SELECT s.modelId, COUNT(m) FROM Message m, Session s WHERE m.sessionEntityId = s.id "
      + "GROUP BY s.modelId ORDER BY COUNT(m) DESC")
  List<Object[]> countMessagesByModelId(org.springframework.data.domain.Pageable pageable);

  /**
   * 批量删除消息
   */
  @Modifying
  int deleteByIdIn(List<Long> ids);

  /**
   * 按月份分组统计指定年份的会话数。 返回 List&lt;Object[]&gt;: [month, count]，month 为 1-12。
   */
  @Query(value = "SELECT MONTH(s.created_date) AS mth, COUNT(*) FROM ai_chat_session s "
      + "WHERE s.created_date >= :yearStart AND s.created_date <= :yearEnd "
      + "GROUP BY MONTH(s.created_date) ORDER BY mth", nativeQuery = true)
  List<Object[]> countByMonthForYear(@Param("yearStart") LocalDateTime yearStart,
      @Param("yearEnd") LocalDateTime yearEnd);

  /**
   * 按日分组统计指定月份的会话数。 返回 List&lt;Object[]&gt;: [day, count]。
   */
  @Query(value = "SELECT DAY(s.created_date) AS d, COUNT(*) FROM ai_chat_session s "
      + "WHERE s.created_date >= :monthStart AND s.created_date <= :monthEnd "
      + "GROUP BY DAY(s.created_date) ORDER BY d", nativeQuery = true)
  List<Object[]> countByDayForMonth(@Param("monthStart") LocalDateTime monthStart,
      @Param("monthEnd") LocalDateTime monthEnd);

  /**
   * 按小时分组统计指定日期的会话数。 返回 List&lt;Object[]&gt;: [hour, count]。
   */
  @Query(value = "SELECT HOUR(s.created_date) AS h, COUNT(*) FROM ai_chat_session s "
      + "WHERE s.created_date >= :dayStart AND s.created_date <= :dayEnd "
      + "GROUP BY HOUR(s.created_date) ORDER BY h", nativeQuery = true)
  List<Object[]> countByHourForDay(@Param("dayStart") LocalDateTime dayStart,
      @Param("dayEnd") LocalDateTime dayEnd);
}
