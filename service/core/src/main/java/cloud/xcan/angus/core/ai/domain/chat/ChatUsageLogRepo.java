package cloud.xcan.angus.core.ai.domain.chat;

import cloud.xcan.angus.core.jpa.repository.BaseRepository;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.NoRepositoryBean;
import org.springframework.data.repository.query.Param;

@NoRepositoryBean
public interface ChatUsageLogRepo extends BaseRepository<ChatUsageLog, Long> {

  /**
   * 查询时间范围内的日志
   */
  List<ChatUsageLog> findByRequestTimeBetween(LocalDateTime start, LocalDateTime end);

  /**
   * 查询应用的日志
   */
  List<ChatUsageLog> findByAppIdAndRequestTimeBetween(Long appId, LocalDateTime start,
      LocalDateTime end);

  /**
   * 查询最近的调用记录
   */
  @Query("SELECT l FROM ChatUsageLog l ORDER BY l.requestTime DESC")
  List<ChatUsageLog> findRecentCalls(org.springframework.data.domain.Pageable pageable);

  /**
   * 统计总调用次数
   */
  @Query("SELECT COUNT(l) FROM ChatUsageLog l WHERE l.requestTime BETWEEN :start AND :end")
  Long countByTimeRange(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

  /**
   * 统计成功调用次数
   */
  @Query("SELECT COUNT(l) FROM ChatUsageLog l WHERE l.requestTime BETWEEN :start AND :end AND l.isSuccessful = true")
  Long countSuccessfulByTimeRange(@Param("start") LocalDateTime start,
      @Param("end") LocalDateTime end);

  /**
   * 统计应用调用次数
   */
  @Query("SELECT COUNT(l) FROM ChatUsageLog l WHERE l.appId = :appId AND l.requestTime BETWEEN :start AND :end")
  Long countByAppIdAndTimeRange(@Param("appId") Long appId, @Param("start") LocalDateTime start,
      @Param("end") LocalDateTime end);

  /**
   * 统计活跃用户数
   */
  @Query("SELECT COUNT(DISTINCT l.userId) FROM ChatUsageLog l WHERE l.requestTime BETWEEN :start AND :end")
  Long countDistinctUsersByTimeRange(@Param("start") LocalDateTime start,
      @Param("end") LocalDateTime end);

  /**
   * 统计Token使用量
   */
  @Query("SELECT SUM(l.totalTokens) FROM ChatUsageLog l WHERE l.requestTime BETWEEN :start AND :end")
  Long sumTokensByTimeRange(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

  /**
   * 统计平均响应时间
   */
  @Query("SELECT AVG(l.responseTimeMs) FROM ChatUsageLog l WHERE l.requestTime BETWEEN :start AND :end")
  Double avgResponseTimeByTimeRange(@Param("start") LocalDateTime start,
      @Param("end") LocalDateTime end);

  /**
   * 全局概览统计（一次聚合，用于模型统计等） 返回 [totalCalls, successfulCalls, totalTokens, totalCost,
   * avgResponseTimeMs]。cost 单位：美元(USD)
   */
  @Query("SELECT COUNT(l), "
      + "SUM(CASE WHEN l.isSuccessful = true THEN 1 ELSE 0 END), "
      + "COALESCE(SUM(l.totalTokens), 0), "
      + "COALESCE(SUM(l.cost), 0), "
      + "AVG(l.responseTimeMs) "
      + "FROM ChatUsageLog l WHERE l.requestTime BETWEEN :start AND :end")
  Object[] getGlobalOverviewStats(@Param("start") LocalDateTime start,
      @Param("end") LocalDateTime end);

  /**
   * 按应用分组统计 返回 [appId, calls, tokens, avgResponseTime, cost] cost 单位：美元(USD)
   */
  @Query(
      "SELECT l.appId, COUNT(l), COALESCE(SUM(l.totalTokens), 0), AVG(l.responseTimeMs), COALESCE(SUM(l.cost), 0) "
          +
          "FROM ChatUsageLog l WHERE l.requestTime BETWEEN :start AND :end GROUP BY l.appId ORDER BY COUNT(l) DESC")
  List<Object[]> groupByApp(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

  /**
   * 按模型分组统计 返回 [modelId, calls, tokens, avgResponseTime, cost] cost 单位：美元(USD)
   */
  @Query(
      "SELECT l.modelId, COUNT(l), COALESCE(SUM(l.totalTokens), 0), AVG(l.responseTimeMs), COALESCE(SUM(l.cost), 0) "
          +
          "FROM ChatUsageLog l WHERE l.requestTime BETWEEN :start AND :end GROUP BY l.modelId ORDER BY COUNT(l) DESC")
  List<Object[]> groupByModel(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

  /**
   * 按模型分组统计（按费用降序，用于费用成本 TOP5） 返回 cost 单位：美分(cents)
   */
  @Query("SELECT l.modelId, COUNT(l), COALESCE(SUM(l.totalTokens), 0), COALESCE(SUM(l.cost), 0) " +
      "FROM ChatUsageLog l WHERE l.requestTime BETWEEN :start AND :end GROUP BY l.modelId ORDER BY COALESCE(SUM(l.cost), 0) DESC")
  List<Object[]> groupByModelOrderByCost(@Param("start") LocalDateTime start,
      @Param("end") LocalDateTime end);

  /**
   * 最近使用的应用及使用统计（按最后使用时间降序）
   */
  @Query(value =
      "SELECT app_id, MAX(request_time) AS last_used, COUNT(*) AS total_calls, AVG(response_time_ms) AS avg_response_ms "
          + "FROM ai_api_usage_log WHERE request_time >= :since AND app_id IS NOT NULL "
          + "GROUP BY app_id ORDER BY MAX(request_time) DESC", nativeQuery = true)
  List<Object[]> getRecentAppUsageStats(@Param("since") LocalDateTime since, Pageable pageable);

  /**
   * 按接口分组统计
   */
  @Query("SELECT l.endpoint, l.method, COUNT(l), AVG(l.responseTimeMs), " +
      "SUM(CASE WHEN l.isSuccessful = true THEN 1 ELSE 0 END), SUM(l.totalTokens) " +
      "FROM ChatUsageLog l WHERE l.requestTime BETWEEN :start AND :end GROUP BY l.endpoint, l.method ORDER BY COUNT(l) DESC")
  List<Object[]> groupByEndpoint(@Param("start") LocalDateTime start,
      @Param("end") LocalDateTime end);

  /**
   * 按接口分组统计（按平均响应时间降序，用于获取最慢接口） 返回 [endpoint, method, calls, avgTimeMs, successfulCalls,
   * totalTokens]
   */
  @Query("SELECT l.endpoint, l.method, COUNT(l), AVG(l.responseTimeMs), " +
      "SUM(CASE WHEN l.isSuccessful = true THEN 1 ELSE 0 END), COALESCE(SUM(l.totalTokens), 0) " +
      "FROM ChatUsageLog l WHERE l.requestTime BETWEEN :start AND :end GROUP BY l.endpoint, l.method ORDER BY AVG(l.responseTimeMs) DESC")
  List<Object[]> groupByEndpointOrderByAvgTime(@Param("start") LocalDateTime start,
      @Param("end") LocalDateTime end, Pageable pageable);

  /**
   * 按状态码分组统计错误
   */
  @Query("SELECT l.statusCode, COUNT(l) FROM ChatUsageLog l " +
      "WHERE l.requestTime BETWEEN :start AND :end AND l.isSuccessful = false " +
      "GROUP BY l.statusCode ORDER BY COUNT(l) DESC")
  List<Object[]> groupByStatusCode(@Param("start") LocalDateTime start,
      @Param("end") LocalDateTime end);

  /**
   * 应用概览统计（一次聚合：总调用、成功数、token、成本、平均响应时间） 返回 Object[]: [totalCalls, successfulCalls, totalTokens,
   * totalCost, avgResponseTime]。cost 单位：美元(USD)
   */
  @Query("SELECT COUNT(l), "
      + "SUM(CASE WHEN l.isSuccessful = true THEN 1 ELSE 0 END), "
      + "COALESCE(SUM(l.totalTokens), 0), "
      + "COALESCE(SUM(l.cost), 0), "
      + "AVG(l.responseTimeMs) "
      + "FROM ChatUsageLog l WHERE l.appId = :appId AND l.requestTime BETWEEN :start AND :end")
  Object[] getAppOverviewStats(@Param("appId") Long appId, @Param("start") LocalDateTime start,
      @Param("end") LocalDateTime end);

  /**
   * 应用趋势统计（按日聚合） 返回 List&lt;Object[]&gt;: [date, callCount, totalTokens, avgResponseTime] 使用 CAST
   * 兼容 MySQL/PostgreSQL
   */
  @Query(value = "SELECT CAST(l.request_time AS date) AS d, COUNT(*), "
      + "COALESCE(SUM(l.total_tokens), 0), "
      + "AVG(l.response_time_ms) "
      + "FROM ai_api_usage_log l "
      + "WHERE l.app_id = :appId AND l.request_time >= :start AND l.request_time <= :end "
      + "GROUP BY CAST(l.request_time AS date) ORDER BY d ASC", nativeQuery = true)
  List<Object[]> getAppTrendByDay(@Param("appId") Long appId, @Param("start") LocalDateTime start,
      @Param("end") LocalDateTime end);

  /**
   * 应用热门用户 TOP N（按调用次数排序） 返回 List&lt;Object[]&gt;: [userId, callCount]
   */
  @Query("SELECT l.userId, COUNT(l) FROM ChatUsageLog l "
      + "WHERE l.appId = :appId AND l.requestTime BETWEEN :start AND :end AND l.userId IS NOT NULL "
      + "GROUP BY l.userId ORDER BY COUNT(l) DESC")
  List<Object[]> getTopUsersByAppId(@Param("appId") Long appId, @Param("start") LocalDateTime start,
      @Param("end") LocalDateTime end, Pageable pageable);

}
