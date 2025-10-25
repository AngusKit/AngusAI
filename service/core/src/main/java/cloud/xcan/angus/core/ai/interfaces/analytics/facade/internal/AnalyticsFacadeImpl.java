package cloud.xcan.angus.core.ai.interfaces.analytics.facade.internal;

import cloud.xcan.angus.core.ai.application.query.analytics.AnalyticsQuery;
import cloud.xcan.angus.core.ai.interfaces.analytics.facade.AnalyticsFacade;
import cloud.xcan.angus.core.ai.interfaces.analytics.facade.dto.AnalyticsQueryDto;
import cloud.xcan.angus.core.ai.interfaces.analytics.facade.vo.*;
import jakarta.annotation.Resource;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Component;

@Component
public class AnalyticsFacadeImpl implements AnalyticsFacade {

  @Resource
  private AnalyticsQuery analyticsQuery;

  @Override
  public AnalyticsOverviewVo getOverview(AnalyticsQueryDto dto) {
    TimeRange timeRange = parseTimeRange(dto.getTimeRange());

    Map<String, Object> stats = analyticsQuery.getOverviewStats(
        timeRange.start, timeRange.end, dto.getAppId());

    return AnalyticsConverter.toOverviewVo(stats, dto.getTimeRange(),
        timeRange.start.atZone(ZoneId.systemDefault()).toInstant().toEpochMilli(),
        timeRange.end.atZone(ZoneId.systemDefault()).toInstant().toEpochMilli());
  }

  @Override
  public ApiCallsTrendVo getApiCallsTrend(AnalyticsQueryDto dto) {
    TimeRange timeRange = parseTimeRange(dto.getTimeRange());
    String granularity = determineGranularity(dto.getTimeRange(), dto.getGranularity());

    List<Map<String, Object>> trendData = analyticsQuery.getApiCallsTrend(
        timeRange.start, timeRange.end, dto.getAppId(), granularity);

    return AnalyticsConverter.toApiCallsTrendVo(trendData);
  }

  @Override
  public TokenUsageTrendVo getTokenUsageTrend(AnalyticsQueryDto dto) {
    TimeRange timeRange = parseTimeRange(dto.getTimeRange());
    String granularity = determineGranularity(dto.getTimeRange(), dto.getGranularity());

    List<Map<String, Object>> trendData = analyticsQuery.getTokenUsageTrend(
        timeRange.start, timeRange.end, dto.getAppId(), granularity);

    return AnalyticsConverter.toTokenUsageTrendVo(trendData);
  }

  @Override
  public ResponseTimeAnalysisVo getResponseTimeAnalysis(AnalyticsQueryDto dto) {
    TimeRange timeRange = parseTimeRange(dto.getTimeRange());
    String granularity = determineGranularity(dto.getTimeRange(), dto.getGranularity());

    List<Map<String, Object>> analysisData = analyticsQuery.getResponseTimeAnalysis(
        timeRange.start, timeRange.end, dto.getAppId(), granularity);

    // 简化实现：创建基本VO结构
    ResponseTimeAnalysisVo vo = new ResponseTimeAnalysisVo();
    // TODO: 使用AnalyticsConverter添加完整转换方法
    return vo;
  }

  @Override
  public AppDistributionVo getAppDistribution(AnalyticsQueryDto dto, Integer limit) {
    TimeRange timeRange = parseTimeRange(dto.getTimeRange());

    List<Map<String, Object>> distributionData = analyticsQuery.getAppDistribution(
        timeRange.start, timeRange.end, limit != null ? limit : 10);

    return AnalyticsConverter.toAppDistributionVo(distributionData);
  }

  @Override
  public ModelDistributionVo getModelDistribution(AnalyticsQueryDto dto) {
    TimeRange timeRange = parseTimeRange(dto.getTimeRange());

    List<Map<String, Object>> distributionData = analyticsQuery.getModelDistribution(
        timeRange.start, timeRange.end);

    return AnalyticsConverter.toModelDistributionVo(distributionData);
  }

  @Override
  public TopEndpointsVo getTopEndpoints(AnalyticsQueryDto dto, Integer limit, String orderBy) {
    TimeRange timeRange = parseTimeRange(dto.getTimeRange());

    List<Map<String, Object>> endpointsData = analyticsQuery.getTopEndpoints(
        timeRange.start, timeRange.end, limit != null ? limit : 10, orderBy);

    return AnalyticsConverter.toTopEndpointsVo(endpointsData);
  }

  @Override
  public ErrorAnalysisVo getErrorAnalysis(AnalyticsQueryDto dto) {
    TimeRange timeRange = parseTimeRange(dto.getTimeRange());

    Map<String, Object> analysisData = analyticsQuery.getErrorAnalysis(
        timeRange.start, timeRange.end, dto.getAppId());

    return AnalyticsConverter.toErrorAnalysisVo(analysisData);
  }

  // ==================== 辅助方法 ====================

  /**
   * 解析时间范围
   */
  private TimeRange parseTimeRange(String timeRangeStr) {
    LocalDateTime end = LocalDateTime.now();
    LocalDateTime start;

    switch (timeRangeStr) {
      case "24hours":
        start = end.minusHours(24);
        break;
      case "30days":
        start = end.minusDays(30);
        break;
      case "90days":
        start = end.minusDays(90);
        break;
      case "7days":
      default:
        start = end.minusDays(7);
        break;
    }

    return new TimeRange(start, end);
  }

  /**
   * 确定数据粒度
   */
  private String determineGranularity(String timeRange, String granularity) {
    if (granularity != null) {
      return granularity;
    }

    // 根据时间范围自动确定粒度
    switch (timeRange) {
      case "24hours":
        return "hour";
      case "90days":
        return "week";
      case "7days":
      case "30days":
      default:
        return "day";
    }
  }

  /**
   * 时间范围内部类
   */
  private static class TimeRange {
    final LocalDateTime start;
    final LocalDateTime end;

    TimeRange(LocalDateTime start, LocalDateTime end) {
      this.start = start;
      this.end = end;
    }
  }

}
