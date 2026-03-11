package cloud.xcan.angus.core.ai.interfaces.analytics.facade.internal;

import static cloud.xcan.angus.core.ai.infra.util.TimeRangeUtils.determineGranularity;
import static cloud.xcan.angus.core.ai.infra.util.TimeRangeUtils.parseTimeRange;
import static cloud.xcan.angus.spec.principal.PrincipalContext.getUserId;

import cloud.xcan.angus.core.ai.application.query.application.ApplicationQuery;
import cloud.xcan.angus.core.ai.application.query.chat.SessionQuery;
import cloud.xcan.angus.core.ai.application.query.notification.NotificationQuery;
import cloud.xcan.angus.core.ai.application.query.analytics.AnalyticsQuery;
import cloud.xcan.angus.core.ai.infra.util.TimeRangeUtils.TimeRange;
import cloud.xcan.angus.core.ai.interfaces.analytics.facade.AnalyticsFacade;
import cloud.xcan.angus.core.ai.interfaces.analytics.facade.dto.AnalyticsQueryDto;
import cloud.xcan.angus.core.ai.interfaces.analytics.facade.internal.assembler.AnalyticsAssembler;
import cloud.xcan.angus.core.ai.interfaces.analytics.facade.vo.AnalyticsOverviewVo;
import cloud.xcan.angus.core.ai.interfaces.analytics.facade.vo.ApiCallsTrendVo;
import cloud.xcan.angus.core.ai.interfaces.analytics.facade.vo.AppDistributionVo;
import cloud.xcan.angus.core.ai.interfaces.analytics.facade.vo.ErrorAnalysisVo;
import cloud.xcan.angus.core.ai.interfaces.analytics.facade.vo.ModelDistributionVo;
import cloud.xcan.angus.core.ai.interfaces.analytics.facade.vo.ResourcesBadgeVo;
import cloud.xcan.angus.core.ai.interfaces.analytics.facade.vo.ResponseTimeAnalysisVo;
import cloud.xcan.angus.core.ai.interfaces.analytics.facade.vo.TokenUsageTrendVo;
import cloud.xcan.angus.core.ai.interfaces.analytics.facade.vo.TopEndpointsVo;
import jakarta.annotation.Resource;
import java.time.ZoneId;
import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Component;

@Component
public class AnalyticsFacadeImpl implements AnalyticsFacade {

  @Resource
  private AnalyticsQuery analyticsQuery;

  @Resource
  private ApplicationQuery applicationQuery;

  @Resource
  private SessionQuery sessionQuery;

  @Resource
  private NotificationQuery notificationQuery;

  @Override
  public AnalyticsOverviewVo getOverview(AnalyticsQueryDto dto) {
    TimeRange timeRange = parseTimeRange(dto.getTimeRange());

    Map<String, Object> stats = analyticsQuery.getOverviewStats(
        timeRange.start, timeRange.end, dto.getAppId());

    return AnalyticsAssembler.toOverviewVo(stats, dto.getTimeRange(),
        timeRange.start.atZone(ZoneId.systemDefault()).toInstant().toEpochMilli(),
        timeRange.end.atZone(ZoneId.systemDefault()).toInstant().toEpochMilli());
  }

  @Override
  public ApiCallsTrendVo getApiCallsTrend(AnalyticsQueryDto dto) {
    TimeRange timeRange = parseTimeRange(dto.getTimeRange());
    String granularity = determineGranularity(dto.getTimeRange(), dto.getGranularity());

    List<Map<String, Object>> trendData = analyticsQuery.getApiCallsTrend(
        timeRange.start, timeRange.end, dto.getAppId(), granularity);
    return AnalyticsAssembler.toApiCallsTrendVo(trendData);
  }

  @Override
  public TokenUsageTrendVo getTokenUsageTrend(AnalyticsQueryDto dto) {
    TimeRange timeRange = parseTimeRange(dto.getTimeRange());
    String granularity = determineGranularity(dto.getTimeRange(), dto.getGranularity());

    List<Map<String, Object>> trendData = analyticsQuery.getTokenUsageTrend(
        timeRange.start, timeRange.end, dto.getAppId(), granularity);
    return AnalyticsAssembler.toTokenUsageTrendVo(trendData);
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
    return AnalyticsAssembler.toAppDistributionVo(distributionData);
  }

  @Override
  public ModelDistributionVo getModelDistribution(AnalyticsQueryDto dto) {
    TimeRange timeRange = parseTimeRange(dto.getTimeRange());

    List<Map<String, Object>> distributionData = analyticsQuery.getModelDistribution(
        timeRange.start, timeRange.end);
    return AnalyticsAssembler.toModelDistributionVo(distributionData);
  }

  @Override
  public TopEndpointsVo getTopEndpoints(AnalyticsQueryDto dto, Integer limit, String orderBy) {
    TimeRange timeRange = parseTimeRange(dto.getTimeRange());

    List<Map<String, Object>> endpointsData = analyticsQuery.getTopEndpoints(
        timeRange.start, timeRange.end, limit != null ? limit : 10, orderBy);
    return AnalyticsAssembler.toTopEndpointsVo(endpointsData);
  }

  @Override
  public ErrorAnalysisVo getErrorAnalysis(AnalyticsQueryDto dto) {
    TimeRange timeRange = parseTimeRange(dto.getTimeRange());

    Map<String, Object> analysisData = analyticsQuery.getErrorAnalysis(
        timeRange.start, timeRange.end, dto.getAppId());
    return AnalyticsAssembler.toErrorAnalysisVo(analysisData);
  }

  @Override
  public ResourcesBadgeVo getResourcesBadge() {
    Long userId = getUserId();
    ResourcesBadgeVo vo = new ResourcesBadgeVo();
    vo.setSessionCount(sessionQuery.countByCreatedBy(userId));
    vo.setApplicationCount(
        userId != null ? applicationQuery.getCurrentUserCounts().getTotal() : 0L);
    vo.setNotificationCount(notificationQuery.countUnread(userId));
    return vo;
  }

}
