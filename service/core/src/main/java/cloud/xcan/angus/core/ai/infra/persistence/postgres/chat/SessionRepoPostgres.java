package cloud.xcan.angus.core.ai.infra.persistence.postgres.chat;

import cloud.xcan.angus.core.ai.domain.chat.SessionRepo;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface SessionRepoPostgres extends SessionRepo {

  @Override
  @Query(value = "SELECT EXTRACT(MONTH FROM s.created_date)::int AS mth, COUNT(*) FROM ai_chat_session s "
      + "WHERE s.created_date >= :yearStart AND s.created_date <= :yearEnd "
      + "GROUP BY EXTRACT(MONTH FROM s.created_date) ORDER BY mth", nativeQuery = true)
  List<Object[]> countByMonthForYear(@Param("yearStart") LocalDateTime yearStart,
      @Param("yearEnd") LocalDateTime yearEnd);

  @Override
  @Query(value = "SELECT EXTRACT(DAY FROM s.created_date)::int AS d, COUNT(*) FROM ai_chat_session s "
      + "WHERE s.created_date >= :monthStart AND s.created_date <= :monthEnd "
      + "GROUP BY EXTRACT(DAY FROM s.created_date) ORDER BY d", nativeQuery = true)
  List<Object[]> countByDayForMonth(@Param("monthStart") LocalDateTime monthStart,
      @Param("monthEnd") LocalDateTime monthEnd);

  @Override
  @Query(value = "SELECT EXTRACT(HOUR FROM s.created_date)::int AS h, COUNT(*) FROM ai_chat_session s "
      + "WHERE s.created_date >= :dayStart AND s.created_date <= :dayEnd "
      + "GROUP BY EXTRACT(HOUR FROM s.created_date) ORDER BY h", nativeQuery = true)
  List<Object[]> countByHourForDay(@Param("dayStart") LocalDateTime dayStart,
      @Param("dayEnd") LocalDateTime dayEnd);
}
