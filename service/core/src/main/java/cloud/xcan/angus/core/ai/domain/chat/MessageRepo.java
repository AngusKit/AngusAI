package cloud.xcan.angus.core.ai.domain.chat;

import cloud.xcan.angus.core.jpa.repository.BaseRepository;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.NoRepositoryBean;
import org.springframework.data.repository.query.Param;

/**
 * 消息仓储接口
 */
@NoRepositoryBean
public interface MessageRepo extends BaseRepository<Message, Long> {

  /**
   * 统计创建时间在指定范围内的消息数
   */
  long countByCreatedDateBetween(LocalDateTime start, LocalDateTime end);

  /**
   * 统计指定反馈类型的消息数
   */
  long countByFeedbackType(String feedbackType);

  /**
   * 查询正在流式生成的消息（按会话ID UUID）
   */
  List<Message> findBySessionIdAndIsStreamingTrue(String sessionId);

  /**
   * 统计进行中对话数量：当前有消息正在流式生成的会话数（is_streaming=true 的 distinct session）。 仅统计 createdDate 在 cutoff
   * 之后的消息，超过 cutoff 的视为超时对话，不计入进行中。
   *
   * @param cutoff 截止时间，通常为 now().minusMinutes(10)，即 10 分钟内的消息才计入
   */
  @Query("SELECT COUNT(DISTINCT m.sessionId) FROM Message m WHERE m.isStreaming = true AND m.sessionId IS NOT NULL AND m.createdDate >= :cutoff")
  long countActiveSessions(@Param("cutoff") LocalDateTime cutoff);

  /**
   * 活动统计：在 cutoff 之后且 is_streaming=true 的消息中，统计消息数、去重会话数、去重应用/助手/模型/用户数。 返回 Object[]: [messages,
   * sessions, apps, agents, models, users]
   */
  @Query(
      "SELECT COUNT(m), COUNT(DISTINCT m.sessionId), COUNT(DISTINCT m.appId), COUNT(DISTINCT m.agentId), COUNT(DISTINCT m.modelId), COUNT(DISTINCT m.createdBy) "
          + "FROM Message m WHERE m.isStreaming = true AND m.sessionId IS NOT NULL AND m.createdDate >= :cutoff")
  Object[] countActiveBreakdown(@Param("cutoff") LocalDateTime cutoff);

  /**
   * 消息表中去重应用数（历史消息中使用过的不同 app_id 数）
   */
  @Query("SELECT COUNT(DISTINCT m.appId) FROM Message m WHERE m.appId IS NOT NULL")
  long countDistinctAppId();

  /**
   * 消息表中去重助手数
   */
  @Query("SELECT COUNT(DISTINCT m.agentId) FROM Message m WHERE m.agentId IS NOT NULL")
  long countDistinctAgentId();

  /**
   * 消息表中去重模型数
   */
  @Query("SELECT COUNT(DISTINCT m.modelId) FROM Message m WHERE m.modelId IS NOT NULL")
  long countDistinctModelId();

  /**
   * 批量查询多个会话各自的最后一条消息（一次 SQL，兼容 MySQL 5.7）
   */
  @Query(
      value = "SELECT m.* FROM ai_chat_message m"
          + " INNER JOIN ("
          + "   SELECT session_id_uuid, MAX(id) AS max_id"
          + "   FROM ai_chat_message"
          + "   WHERE session_id_uuid IN (:sessionIds)"
          + "   GROUP BY session_id_uuid"
          + " ) latest ON m.session_id_uuid = latest.session_id_uuid AND m.id = latest.max_id"
          + " WHERE m.session_id_uuid IN (:sessionIds)",
      nativeQuery = true)
  List<Message> findLastMessageBySessionIds(@Param("sessionIds") List<String> sessionIds);

  /**
   * 根据会话实体ID删除消息
   */
  @Modifying
  int deleteBySessionEntityId(Long sessionEntityId);

  /**
   * 批量删除会话的所有消息
   */
  @Modifying
  int deleteBySessionEntityIdIn(List<Long> ids);

  /**
   * 按分钟分组统计当天消息数（用于吞吐量）。 返回 List&lt;Object[]&gt;: [minuteOfDay, count]，minuteOfDay 为 0-1439。 MySQL:
   * 使用 HOUR*60+MINUTE
   */
  @Query(value =
      "SELECT (HOUR(m.created_date) * 60 + MINUTE(m.created_date)) AS minute_of_day, COUNT(*) "
          + "FROM ai_chat_message m WHERE m.created_date >= :dayStart AND m.created_date <= :dayEnd "
          + "GROUP BY (HOUR(m.created_date) * 60 + MINUTE(m.created_date)) ORDER BY 1", nativeQuery = true)
  List<Object[]> countByMinuteForDate(@Param("dayStart") LocalDateTime dayStart,
      @Param("dayEnd") LocalDateTime dayEnd);

  /**
   * 按月份分组统计指定年份的消息数。 返回 List&lt;Object[]&gt;: [month, count]，month 为 1-12。
   */
  @Query(value = "SELECT MONTH(m.created_date) AS mth, COUNT(*) FROM ai_chat_message m "
      + "WHERE m.created_date >= :yearStart AND m.created_date <= :yearEnd "
      + "GROUP BY MONTH(m.created_date) ORDER BY mth", nativeQuery = true)
  List<Object[]> countByMonthForYear(@Param("yearStart") LocalDateTime yearStart,
      @Param("yearEnd") LocalDateTime yearEnd);

  /**
   * 按日分组统计指定月份的消息数。 返回 List&lt;Object[]&gt;: [day, count]，day 为 1-31。
   */
  @Query(value = "SELECT DAY(m.created_date) AS d, COUNT(*) FROM ai_chat_message m "
      + "WHERE m.created_date >= :monthStart AND m.created_date <= :monthEnd "
      + "GROUP BY d ORDER BY d", nativeQuery = true)
  List<Object[]> countByDayForMonth(@Param("monthStart") LocalDateTime monthStart,
      @Param("monthEnd") LocalDateTime monthEnd);

  /**
   * 按小时分组统计指定日期的消息数。 返回 List&lt;Object[]&gt;: [hour, count]，hour 为 0-23。
   */
  @Query(value = "SELECT HOUR(m.created_date) AS h, COUNT(*) FROM ai_chat_message m "
      + "WHERE m.created_date >= :dayStart AND m.created_date <= :dayEnd "
      + "GROUP BY HOUR(m.created_date) ORDER BY h", nativeQuery = true)
  List<Object[]> countByHourForDay(@Param("dayStart") LocalDateTime dayStart,
      @Param("dayEnd") LocalDateTime dayEnd);

  /**
   * 按月份分组统计指定年份的反馈数（like+dislike）。 返回 List&lt;Object[]&gt;: [month, count]，month 为 1-12。
   */
  @Query(value = "SELECT MONTH(m.created_date) AS mth, COUNT(*) FROM ai_chat_message m "
      + "WHERE m.feedback_type IN ('like', 'dislike') AND m.created_date >= :yearStart AND m.created_date <= :yearEnd "
      + "GROUP BY MONTH(m.created_date) ORDER BY mth", nativeQuery = true)
  List<Object[]> countFeedbackByMonthForYear(@Param("yearStart") LocalDateTime yearStart,
      @Param("yearEnd") LocalDateTime yearEnd);

  /**
   * 按日分组统计指定月份的反馈数。 返回 List&lt;Object[]&gt;: [day, count]。
   */
  @Query(value = "SELECT DAY(m.created_date) AS d, COUNT(*) FROM ai_chat_message m "
      + "WHERE m.feedback_type IN ('like', 'dislike') AND m.created_date >= :monthStart AND m.created_date <= :monthEnd "
      + "GROUP BY DAY(m.created_date) ORDER BY d", nativeQuery = true)
  List<Object[]> countFeedbackByDayForMonth(@Param("monthStart") LocalDateTime monthStart,
      @Param("monthEnd") LocalDateTime monthEnd);

  /**
   * 按小时分组统计指定日期的反馈数。 返回 List&lt;Object[]&gt;: [hour, count]。
   */
  @Query(value = "SELECT HOUR(m.created_date) AS h, COUNT(*) FROM ai_chat_message m "
      + "WHERE m.feedback_type IN ('like', 'dislike') AND m.created_date >= :dayStart AND m.created_date <= :dayEnd "
      + "GROUP BY HOUR(m.created_date) ORDER BY h", nativeQuery = true)
  List<Object[]> countFeedbackByHourForDay(@Param("dayStart") LocalDateTime dayStart,
      @Param("dayEnd") LocalDateTime dayEnd);

}
