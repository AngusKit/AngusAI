package cloud.xcan.angus.core.ai.application.query.analytics;

import cloud.xcan.angus.core.ai.interfaces.application.facade.vo.ApplicationDetailVo.ApplicationStatsVo;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

public interface AnalyticsQuery {

  /**
   * 获取概览统计数据
   */
  Map<String, Object> getOverviewStats(LocalDateTime start, LocalDateTime end, Long appId);

  /**
   * 获取指定时间范围的概览统计（不含上周期对比，用于多周期展示）
   */
  Map<String, Object> getOverviewStatsForRange(LocalDateTime start, LocalDateTime end, Long appId);

  /**
   * 获取API调用趋势数据
   */
  List<Map<String, Object>> getApiCallsTrend(LocalDateTime start, LocalDateTime end, Long appId,
      String granularity);

  /**
   * 获取Token使用趋势
   */
  List<Map<String, Object>> getTokenUsageTrend(LocalDateTime start, LocalDateTime end, Long appId,
      String granularity);

  /**
   * 获取响应时间分析
   */
  List<Map<String, Object>> getResponseTimeAnalysis(LocalDateTime start, LocalDateTime end,
      Long appId, String granularity);

  /**
   * 获取应用使用分布
   */
  List<Map<String, Object>> getAppDistribution(LocalDateTime start, LocalDateTime end,
      Integer limit);

  /**
   * 获取模型使用分布
   */
  List<Map<String, Object>> getModelDistribution(LocalDateTime start, LocalDateTime end);

  /**
   * 获取模型费用分布（按费用降序，用于费用成本 TOP5）
   */
  List<Map<String, Object>> getModelDistributionByCost(LocalDateTime start, LocalDateTime end,
      Integer limit);

  /**
   * 获取Top接口统计
   */
  List<Map<String, Object>> getTopEndpoints(LocalDateTime start, LocalDateTime end, Integer limit,
      String orderBy);

  /**
   * 获取错误分析
   */
  Map<String, Object> getErrorAnalysis(LocalDateTime start, LocalDateTime end, Long appId);

  /**
   * 获取最近使用的应用及使用统计（按最后使用时间降序）
   */
  List<Map<String, Object>> getRecentAppUsageStats(LocalDateTime since, Integer limit,
      Integer offset);

  /**
   * 获取应用统计数据（总调用次数、成功率、平均响应时间、Token使用量等）
   */
  Map<Long, ApplicationStatsVo> getApplicationStats(List<Long> appIds);
}
