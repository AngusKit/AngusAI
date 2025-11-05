package cloud.xcan.angus.core.ai.application.query.apis;

import java.time.LocalDateTime;
import java.util.List;

/**
 * API端点调用日志查询服务
 */
public interface ApiEndpointCallLogQuery {

  /**
   * 统计时间范围内的调用次数
   */
  Long countByTimeRange(LocalDateTime start, LocalDateTime end);

  /**
   * 查询时间范围内的日志
   */
  List<cloud.xcan.angus.core.ai.domain.apis.ApiEndpointCallLog> findByCallDateBetween(
      LocalDateTime start, LocalDateTime end);

  /**
   * 按端点分组统计调用次数和平均响应时间（TOP N）
   * 返回 List<Object[]>，其中 [0]=endpointId (Long), [1]=count (Long), [2]=avgResponseTime (Double)
   */
  List<Object[]> getTopEndpointsByCallCount(LocalDateTime start, LocalDateTime end, Integer limit);

  /**
   * 按端点分组统计平均响应时间
   * 返回 List<Object[]>，其中 [0]=endpointId (Long), [1]=avgResponseTime (Double)
   */
  List<Object[]> getAvgResponseTimeByEndpoint(LocalDateTime start, LocalDateTime end);

  /**
   * 按日期分组统计性能趋势
   * 返回 List<Object[]>，其中 [0]=date (String), [1]=totalCalls (Long), [2]=avgResponseTime (Double), [3]=errorCount (Long)
   */
  List<Object[]> getPerformanceTrendByDay(LocalDateTime start, LocalDateTime end);
}

