package cloud.xcan.angus.core.ai.domain.analytics;

import cloud.xcan.angus.core.jpa.repository.BaseRepository;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.NoRepositoryBean;
import org.springframework.data.repository.query.Param;

@NoRepositoryBean
public interface ApiUsageLogRepo extends BaseRepository<ApiUsageLog, Long> {

  /**
   * 查询时间范围内的日志
   */
  List<ApiUsageLog> findByRequestTimeBetween(LocalDateTime start, LocalDateTime end);

  /**
   * 查询应用的日志
   */
  List<ApiUsageLog> findByAppIdAndRequestTimeBetween(Long appId, LocalDateTime start, LocalDateTime end);

  /**
   * 查询最近的调用记录
   */
  @Query("SELECT l FROM ApiUsageLog l ORDER BY l.requestTime DESC")
  List<ApiUsageLog> findRecentCalls(org.springframework.data.domain.Pageable pageable);

  /**
   * 统计总调用次数
   */
  @Query("SELECT COUNT(l) FROM ApiUsageLog l WHERE l.requestTime BETWEEN :start AND :end")
  Long countByTimeRange(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

  /**
   * 统计成功调用次数
   */
  @Query("SELECT COUNT(l) FROM ApiUsageLog l WHERE l.requestTime BETWEEN :start AND :end AND l.isSuccessful = true")
  Long countSuccessfulByTimeRange(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

  /**
   * 统计应用调用次数
   */
  @Query("SELECT COUNT(l) FROM ApiUsageLog l WHERE l.appId = :appId AND l.requestTime BETWEEN :start AND :end")
  Long countByAppIdAndTimeRange(@Param("appId") Long appId, @Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

  /**
   * 统计活跃用户数
   */
  @Query("SELECT COUNT(DISTINCT l.userId) FROM ApiUsageLog l WHERE l.requestTime BETWEEN :start AND :end")
  Long countDistinctUsersByTimeRange(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

  /**
   * 统计Token使用量
   */
  @Query("SELECT SUM(l.totalTokens) FROM ApiUsageLog l WHERE l.requestTime BETWEEN :start AND :end")
  Long sumTokensByTimeRange(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

  /**
   * 统计平均响应时间
   */
  @Query("SELECT AVG(l.responseTimeMs) FROM ApiUsageLog l WHERE l.requestTime BETWEEN :start AND :end")
  Double avgResponseTimeByTimeRange(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

  /**
   * 按应用分组统计
   */
  @Query("SELECT l.appId, COUNT(l), SUM(l.totalTokens), AVG(l.responseTimeMs) " +
      "FROM ApiUsageLog l WHERE l.requestTime BETWEEN :start AND :end GROUP BY l.appId ORDER BY COUNT(l) DESC")
  List<Object[]> groupByApp(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

  /**
   * 按模型分组统计
   */
  @Query("SELECT l.modelId, l.modelName, COUNT(l), SUM(l.totalTokens) " +
      "FROM ApiUsageLog l WHERE l.requestTime BETWEEN :start AND :end GROUP BY l.modelId, l.modelName ORDER BY COUNT(l) DESC")
  List<Object[]> groupByModel(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

  /**
   * 按接口分组统计
   */
  @Query("SELECT l.endpoint, l.method, COUNT(l), AVG(l.responseTimeMs), " +
      "SUM(CASE WHEN l.isSuccessful = true THEN 1 ELSE 0 END), SUM(l.totalTokens) " +
      "FROM ApiUsageLog l WHERE l.requestTime BETWEEN :start AND :end GROUP BY l.endpoint, l.method ORDER BY COUNT(l) DESC")
  List<Object[]> groupByEndpoint(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

  /**
   * 按状态码分组统计错误
   */
  @Query("SELECT l.statusCode, COUNT(l) FROM ApiUsageLog l " +
      "WHERE l.requestTime BETWEEN :start AND :end AND l.isSuccessful = false " +
      "GROUP BY l.statusCode ORDER BY COUNT(l) DESC")
  List<Object[]> groupByStatusCode(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

}
