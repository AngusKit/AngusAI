package cloud.xcan.angus.core.ai.infra.persistence.postgres.chat;

import cloud.xcan.angus.core.ai.domain.chat.MessageRepo;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface MessageRepoPostgres extends MessageRepo {

  @Override
  @Query(value =
      "SELECT (EXTRACT(HOUR FROM m.created_date)::int * 60 + EXTRACT(MINUTE FROM m.created_date)::int) AS minute_of_day, COUNT(*) "
          + "FROM ai_chat_message m WHERE m.created_date >= :dayStart AND m.created_date <= :dayEnd "
          + "GROUP BY (EXTRACT(HOUR FROM m.created_date)::int * 60 + EXTRACT(MINUTE FROM m.created_date)::int) ORDER BY 1", nativeQuery = true)
  List<Object[]> countByMinuteForDate(@Param("dayStart") LocalDateTime dayStart,
      @Param("dayEnd") LocalDateTime dayEnd);

  @Override
  @Query(value =
      "SELECT EXTRACT(MONTH FROM m.created_date)::int AS mth, COUNT(*) FROM ai_chat_message m "
          + "WHERE m.created_date >= :yearStart AND m.created_date <= :yearEnd "
          + "GROUP BY EXTRACT(MONTH FROM m.created_date) ORDER BY mth", nativeQuery = true)
  List<Object[]> countByMonthForYear(@Param("yearStart") LocalDateTime yearStart,
      @Param("yearEnd") LocalDateTime yearEnd);

  @Override
  @Query(value =
      "SELECT EXTRACT(DAY FROM m.created_date)::int AS d, COUNT(*) FROM ai_chat_message m "
          + "WHERE m.created_date >= :monthStart AND m.created_date <= :monthEnd "
          + "GROUP BY EXTRACT(DAY FROM m.created_date) ORDER BY d", nativeQuery = true)
  List<Object[]> countByDayForMonth(@Param("monthStart") LocalDateTime monthStart,
      @Param("monthEnd") LocalDateTime monthEnd);

  @Override
  @Query(value =
      "SELECT EXTRACT(HOUR FROM m.created_date)::int AS h, COUNT(*) FROM ai_chat_message m "
          + "WHERE m.created_date >= :dayStart AND m.created_date <= :dayEnd "
          + "GROUP BY EXTRACT(HOUR FROM m.created_date) ORDER BY h", nativeQuery = true)
  List<Object[]> countByHourForDay(@Param("dayStart") LocalDateTime dayStart,
      @Param("dayEnd") LocalDateTime dayEnd);

  @Override
  @Query(value =
      "SELECT EXTRACT(MONTH FROM m.created_date)::int AS mth, COUNT(*) FROM ai_chat_message m "
          + "WHERE m.feedback_type IN ('like', 'dislike') AND m.created_date >= :yearStart AND m.created_date <= :yearEnd "
          + "GROUP BY EXTRACT(MONTH FROM m.created_date) ORDER BY mth", nativeQuery = true)
  List<Object[]> countFeedbackByMonthForYear(@Param("yearStart") LocalDateTime yearStart,
      @Param("yearEnd") LocalDateTime yearEnd);

  @Override
  @Query(value =
      "SELECT EXTRACT(DAY FROM m.created_date)::int AS d, COUNT(*) FROM ai_chat_message m "
          + "WHERE m.feedback_type IN ('like', 'dislike') AND m.created_date >= :monthStart AND m.created_date <= :monthEnd "
          + "GROUP BY EXTRACT(DAY FROM m.created_date) ORDER BY d", nativeQuery = true)
  List<Object[]> countFeedbackByDayForMonth(@Param("monthStart") LocalDateTime monthStart,
      @Param("monthEnd") LocalDateTime monthEnd);

  @Override
  @Query(value =
      "SELECT EXTRACT(HOUR FROM m.created_date)::int AS h, COUNT(*) FROM ai_chat_message m "
          + "WHERE m.feedback_type IN ('like', 'dislike') AND m.created_date >= :dayStart AND m.created_date <= :dayEnd "
          + "GROUP BY EXTRACT(HOUR FROM m.created_date) ORDER BY h", nativeQuery = true)
  List<Object[]> countFeedbackByHourForDay(@Param("dayStart") LocalDateTime dayStart,
      @Param("dayEnd") LocalDateTime dayEnd);
}
