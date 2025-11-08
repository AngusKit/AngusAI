package cloud.xcan.angus.core.ai.application.query.dataset;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 数据集查询使用记录查询服务
 */
public interface DatasetUsageLogQuery {

  /**
   * 统计时间范围内的查询次数
   */
  Long countByTimeRange(LocalDateTime start, LocalDateTime end);

  /**
   * 查询时间范围内的日志
   */
  List<cloud.xcan.angus.core.ai.domain.dataset.DatasetUsageLog> findByQueryDateBetween(
      LocalDateTime start, LocalDateTime end);

  /**
   * 按数据集分组统计查询次数和平均响应时间（TOP N） 返回 List<Object[]>，其中 [0]=datasetId (Long), [1]=count (Long),
   * [2]=avgResponseTime (Double)
   */
  List<Object[]> getTopDatasetsByQueryCount(LocalDateTime start, LocalDateTime end,
      Integer limit);

  /**
   * 按日期分组统计查询趋势 返回 List<Object[]>，其中 [0]=date (String), [1]=totalQueries (Long), [2]=avgResponseTime
   * (Double), [3]=errorCount (Long)
   */
  List<Object[]> getQueryTrendByDay(LocalDateTime start, LocalDateTime end);
}

