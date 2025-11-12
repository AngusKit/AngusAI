package cloud.xcan.angus.core.ai.domain.vector;

import cloud.xcan.angus.core.jpa.repository.BaseRepository;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.NoRepositoryBean;
import org.springframework.data.repository.query.Param;

@NoRepositoryBean
public interface VectorStoreAccessLogRepo extends BaseRepository<VectorStoreAccessLog, Long> {

  /**
   * 统计指定日期范围内的查询数
   */
  @Query(value = "SELECT COUNT(1) FROM vector_store_access_log WHERE query_date >= :start AND query_date <= :end", nativeQuery = true)
  long countByQueryDateBetween(@Param("start") LocalDateTime start,
      @Param("end") LocalDateTime end);

  /**
   * 按存储源分组统计查询次数（TOP N）
   */
  @Query(value = "SELECT vector_store_id, COUNT(1) cnt FROM vector_store_access_log WHERE query_date >= :start AND query_date <= :end GROUP BY vector_store_id ORDER BY cnt DESC LIMIT :limit", nativeQuery = true)
  List<Object[]> topStoresByQueryCount(@Param("start") LocalDateTime start,
      @Param("end") LocalDateTime end, @Param("limit") Integer limit);

  /**
   * 按存储源分组统计平均响应时间
   */
  @Query(value = "SELECT vector_store_id, AVG(response_time) avg_time FROM vector_store_access_log WHERE query_date >= :start AND query_date <= :end AND response_time IS NOT NULL GROUP BY vector_store_id", nativeQuery = true)
  List<Object[]> avgResponseTimeByStore(@Param("start") LocalDateTime start,
      @Param("end") LocalDateTime end);

  /**
   * 按天统计性能趋势
   */
  @Query(value = "SELECT DATE(query_date) d, COUNT(1) cnt, AVG(response_time) avg_time, SUM(CASE WHEN status='FAILED' THEN 1 ELSE 0 END) error_cnt FROM vector_store_access_log WHERE query_date >= :start AND query_date <= :end GROUP BY DATE(query_date) ORDER BY d ASC", nativeQuery = true)
  List<Object[]> performanceTrendByDay(@Param("start") LocalDateTime start,
      @Param("end") LocalDateTime end);

}

