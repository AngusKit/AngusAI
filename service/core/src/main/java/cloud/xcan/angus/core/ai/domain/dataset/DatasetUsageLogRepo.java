package cloud.xcan.angus.core.ai.domain.dataset;

import cloud.xcan.angus.core.jpa.repository.BaseRepository;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.NoRepositoryBean;
import org.springframework.data.repository.query.Param;

@NoRepositoryBean
public interface DatasetUsageLogRepo extends BaseRepository<DatasetUsageLog, Long> {

  /**
   * 统计时间范围内的查询次数
   */
  @Query("SELECT COUNT(l) FROM DatasetUsageLog l WHERE l.queryDate BETWEEN :start AND :end")
  Long countByTimeRange(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

  /**
   * 查询时间范围内的日志
   */
  List<DatasetUsageLog> findByQueryDateBetween(LocalDateTime start, LocalDateTime end);

  /**
   * 按数据集分组统计查询次数和平均响应时间（TOP N） 返回 List<Object[]>，其中 [0]=datasetId (Long), [1]=count (Long),
   * [2]=avgResponseTime (Double)
   */
  @Query(value = "SELECT dataset_id, COUNT(1) cnt, AVG(response_time_ms) avg_time " +
      "FROM ai_dataset_usage_log WHERE query_date >= :start AND query_date <= :end " +
      "GROUP BY dataset_id ORDER BY cnt DESC LIMIT :limit", nativeQuery = true)
  List<Object[]> getTopDatasetsByQueryCount(@Param("start") LocalDateTime start,
      @Param("end") LocalDateTime end, @Param("limit") Integer limit);

  /**
   * 按日期分组统计查询趋势 返回 List<Object[]>，其中 [0]=date (String), [1]=totalQueries (Long),
   * [2]=avgResponseTime (Double), [3]=errorCount (Long)
   */
  @Query(value = "SELECT DATE(query_date) d, COUNT(1) cnt, AVG(response_time_ms) avg_time, " +
      "SUM(CASE WHEN status='FAILED' THEN 1 ELSE 0 END) error_cnt " +
      "FROM ai_dataset_usage_log WHERE query_date >= :start AND query_date <= :end " +
      "GROUP BY DATE(query_date) ORDER BY d ASC", nativeQuery = true)
  List<Object[]> getQueryTrendByDay(@Param("start") LocalDateTime start,
      @Param("end") LocalDateTime end);
}

