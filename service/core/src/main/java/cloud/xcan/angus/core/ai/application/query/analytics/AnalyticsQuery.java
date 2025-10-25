package cloud.xcan.angus.core.ai.application.query.analytics;

import cloud.xcan.angus.core.ai.domain.analytics.ApiUsageLog;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

public interface AnalyticsQuery {

  /**
   * 获取概览统计数据
   */
  Map<String, Object> getOverviewStats(LocalDateTime start, LocalDateTime end, Long appId);

  /**
   * 获取API调用趋势数据
   */
  List<Map<String, Object>> getApiCallsTrend(LocalDateTime start, LocalDateTime end, Long appId, String granularity);

  /**
   * 获取Token使用趋势
   */
  List<Map<String, Object>> getTokenUsageTrend(LocalDateTime start, LocalDateTime end, Long appId, String granularity);

  /**
   * 获取响应时间分析
   */
  List<Map<String, Object>> getResponseTimeAnalysis(LocalDateTime start, LocalDateTime end, Long appId, String granularity);

  /**
   * 获取应用使用分布
   */
  List<Map<String, Object>> getAppDistribution(LocalDateTime start, LocalDateTime end, Integer limit);

  /**
   * 获取模型使用分布
   */
  List<Map<String, Object>> getModelDistribution(LocalDateTime start, LocalDateTime end);

  /**
   * 获取Top接口统计
   */
  List<Map<String, Object>> getTopEndpoints(LocalDateTime start, LocalDateTime end, Integer limit, String orderBy);

  /**
   * 获取错误分析
   */
  Map<String, Object> getErrorAnalysis(LocalDateTime start, LocalDateTime end, Long appId);

  /**
   * 获取最近的调用记录
   */
  List<ApiUsageLog> getRecentCalls(Integer limit);

  /**
   * 统计总调用次数
   */
  Long countTotalCalls(LocalDateTime start, LocalDateTime end, Long appId);

  /**
   * 统计成功调用次数
   */
  Long countSuccessfulCalls(LocalDateTime start, LocalDateTime end, Long appId);

  /**
   * 统计活跃用户数
   */
  Long countActiveUsers(LocalDateTime start, LocalDateTime end, Long appId);

  /**
   * 统计Token总量
   */
  Long sumTotalTokens(LocalDateTime start, LocalDateTime end, Long appId);

  /**
   * 计算平均响应时间
   */
  Double calculateAvgResponseTime(LocalDateTime start, LocalDateTime end, Long appId);

}
