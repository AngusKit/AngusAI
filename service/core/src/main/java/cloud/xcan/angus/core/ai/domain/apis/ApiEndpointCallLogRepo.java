package cloud.xcan.angus.core.ai.domain.apis;

import cloud.xcan.angus.core.jpa.repository.BaseRepository;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.NoRepositoryBean;
import org.springframework.data.repository.query.Param;

@NoRepositoryBean
public interface ApiEndpointCallLogRepo extends BaseRepository<ApiEndpointCallLog, Long> {

  /**
   * 统计时间范围内的调用次数
   */
  @Query("SELECT COUNT(l) FROM ApiEndpointCallLog l WHERE l.callDate BETWEEN :start AND :end")
  Long countByTimeRange(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

  /**
   * 查询时间范围内的日志
   */
  List<ApiEndpointCallLog> findByCallDateBetween(LocalDateTime start, LocalDateTime end);

  /**
   * 按端点分组统计调用次数和平均响应时间（TOP N） 返回 List<Object[]>，其中 [0]=endpointId (Long), [1]=count (Long),
   * [2]=avgResponseTime (Double)
   */
  @Query(value = "SELECT endpoint_id, COUNT(1) cnt, AVG(response_time_ms) avg_time " +
      "FROM api_endpoint_call_log WHERE call_date >= :start AND call_date <= :end " +
      "GROUP BY endpoint_id ORDER BY cnt DESC LIMIT :limit", nativeQuery = true)
  List<Object[]> getTopEndpointsByCallCount(@Param("start") LocalDateTime start,
      @Param("end") LocalDateTime end, @Param("limit") Integer limit);

  /**
   * 按端点分组统计平均响应时间 返回 List<Object[]>，其中 [0]=endpointId (Long), [1]=avgResponseTime (Double)
   */
  @Query("SELECT l.endpointId, AVG(l.responseTimeMs) " +
      "FROM ApiEndpointCallLog l WHERE l.callDate BETWEEN :start AND :end " +
      "AND l.responseTimeMs IS NOT NULL GROUP BY l.endpointId")
  List<Object[]> getAvgResponseTimeByEndpoint(@Param("start") LocalDateTime start,
      @Param("end") LocalDateTime end);

  /**
   * 按日期分组统计性能趋势 返回 List<Object[]>，其中 [0]=date (String), [1]=totalCalls (Long), [2]=avgResponseTime
   * (Double), [3]=errorCount (Long)
   */
  @Query(value = "SELECT DATE(call_date) d, COUNT(1) cnt, AVG(response_time_ms) avg_time, " +
      "SUM(CASE WHEN status='FAILED' THEN 1 ELSE 0 END) error_cnt " +
      "FROM api_endpoint_call_log WHERE call_date >= :start AND call_date <= :end " +
      "GROUP BY DATE(call_date) ORDER BY d ASC", nativeQuery = true)
  List<Object[]> getPerformanceTrendByDay(@Param("start") LocalDateTime start,
      @Param("end") LocalDateTime end);
}

