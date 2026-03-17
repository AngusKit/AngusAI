package cloud.xcan.angus.core.ai.interfaces.analytics.facade.internal;

import static cloud.xcan.angus.core.ai.infra.util.TimeRangeUtils.determineGranularity;
import static cloud.xcan.angus.core.ai.infra.util.TimeRangeUtils.parseTimeRange;
import static cloud.xcan.angus.spec.principal.PrincipalContext.getUserId;

import cloud.xcan.angus.core.ai.application.query.agent.AgentQuery;
import cloud.xcan.angus.core.ai.application.query.analytics.ChatAnalyticsQuery;
import cloud.xcan.angus.core.ai.application.query.application.ApplicationQuery;
import cloud.xcan.angus.core.ai.application.query.chat.SessionQuery;
import cloud.xcan.angus.core.ai.application.query.model.ModelQuery;
import cloud.xcan.angus.core.ai.application.query.notification.NotificationQuery;
import cloud.xcan.angus.core.ai.infra.util.TimeRangeUtils.TimeRange;
import cloud.xcan.angus.core.ai.interfaces.analytics.facade.ChatAnalyticsFacade;
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
import java.util.stream.Collectors;
import org.springframework.stereotype.Component;

@Component
public class ChatAnalyticsFacadeImpl implements ChatAnalyticsFacade {

  @Resource
  private ChatAnalyticsQuery chatAnalyticsQuery;

  @Resource
  private ApplicationQuery applicationQuery;

  @Resource
  private AgentQuery agentQuery;

  @Resource
  private ModelQuery modelQuery;

  @Resource
  private SessionQuery sessionQuery;

  @Resource
  private NotificationQuery notificationQuery;

  @Override
  public AnalyticsOverviewVo getOverview(AnalyticsQueryDto dto) {
    TimeRange timeRange = parseTimeRange(dto.getTimeRange());

    Map<String, Object> stats = chatAnalyticsQuery.getOverviewStats(
        timeRange.start, timeRange.end, dto.getAppId());

    return AnalyticsAssembler.toOverviewVo(stats, dto.getTimeRange(),
        timeRange.start.atZone(ZoneId.systemDefault()).toInstant().toEpochMilli(),
        timeRange.end.atZone(ZoneId.systemDefault()).toInstant().toEpochMilli());
  }

  @Override
  public ApiCallsTrendVo getApiCallsTrend(AnalyticsQueryDto dto) {
    TimeRange timeRange = parseTimeRange(dto.getTimeRange());
    String granularity = determineGranularity(dto.getTimeRange(), dto.getGranularity());

    List<Map<String, Object>> trendData = chatAnalyticsQuery.getApiCallsTrend(
        timeRange.start, timeRange.end, dto.getAppId(), granularity);
    return AnalyticsAssembler.toApiCallsTrendVo(trendData);
  }

  @Override
  public TokenUsageTrendVo getTokenUsageTrend(AnalyticsQueryDto dto) {
    TimeRange timeRange = parseTimeRange(dto.getTimeRange());
    String granularity = determineGranularity(dto.getTimeRange(), dto.getGranularity());

    List<Map<String, Object>> trendData = chatAnalyticsQuery.getTokenUsageTrend(
        timeRange.start, timeRange.end, dto.getAppId(), granularity);
    return AnalyticsAssembler.toTokenUsageTrendVo(trendData);
  }

  @Override
  public ResponseTimeAnalysisVo getResponseTimeAnalysis(AnalyticsQueryDto dto) {
    TimeRange timeRange = parseTimeRange(dto.getTimeRange());
    String granularity = determineGranularity(dto.getTimeRange(), dto.getGranularity());

    List<Map<String, Object>> analysisData = chatAnalyticsQuery.getResponseTimeAnalysis(
        timeRange.start, timeRange.end, dto.getAppId(), granularity);
    Map<String, Object> slowestEndpoint = chatAnalyticsQuery.getSlowestEndpoint(
        timeRange.start, timeRange.end, dto.getAppId());

    return AnalyticsAssembler.toResponseTimeAnalysisVo(analysisData, slowestEndpoint);
  }

  @Override
  public AppDistributionVo getAppDistribution(AnalyticsQueryDto dto, Integer limit) {
    TimeRange timeRange = parseTimeRange(dto.getTimeRange());

    List<Map<String, Object>> distributionData = chatAnalyticsQuery.getAppDistribution(
        timeRange.start, timeRange.end, limit != null ? limit : 10);
    return AnalyticsAssembler.toAppDistributionVo(fillAppNames(distributionData));
  }

  @Override
  public ModelDistributionVo getModelDistribution(AnalyticsQueryDto dto) {
    TimeRange timeRange = parseTimeRange(dto.getTimeRange());

    List<Map<String, Object>> distributionData = chatAnalyticsQuery.getModelDistribution(
        timeRange.start, timeRange.end);
    return AnalyticsAssembler.toModelDistributionVo(fillModelNames(distributionData));
  }

  @Override
  public TopEndpointsVo getTopEndpoints(AnalyticsQueryDto dto, Integer limit, String orderBy) {
    TimeRange timeRange = parseTimeRange(dto.getTimeRange());

    List<Map<String, Object>> endpointsData = chatAnalyticsQuery.getTopEndpoints(
        timeRange.start, timeRange.end, limit != null ? limit : 10, orderBy);
    return AnalyticsAssembler.toTopEndpointsVo(endpointsData);
  }

  @Override
  public ErrorAnalysisVo getErrorAnalysis(AnalyticsQueryDto dto) {
    TimeRange timeRange = parseTimeRange(dto.getTimeRange());

    Map<String, Object> analysisData = chatAnalyticsQuery.getErrorAnalysis(
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

  /**
   * 批量查询并填充 appName（appId 可能是应用或智能体）
   */
  private List<Map<String, Object>> fillAppNames(List<Map<String, Object>> distributionData) {
    List<Long> appIds = distributionData.stream()
        .map(d -> (Long) d.get("appId"))
        .filter(id -> id != null)
        .distinct()
        .collect(Collectors.toList());
    if (appIds.isEmpty()) {
      return distributionData;
    }

    List<cloud.xcan.angus.core.ai.domain.application.AIApplication> applications =
        applicationQuery.findByIds(appIds);
    Map<Long, String> appNameMap = applications.stream()
        .collect(Collectors.toMap(a -> a.getId(), a -> a.getName()));

    List<Long> remainingIds = appIds.stream()
        .filter(id -> !appNameMap.containsKey(id))
        .collect(Collectors.toList());
    if (!remainingIds.isEmpty()) {
      List<cloud.xcan.angus.core.ai.domain.agent.Agent> agents = agentQuery.findByIds(remainingIds);
      agents.forEach(a -> appNameMap.put(a.getId(), a.getName()));
    }

    for (Map<String, Object> data : distributionData) {
      Long appId = (Long) data.get("appId");
      if (appId != null) {
        data.put("appName", appNameMap.getOrDefault(appId, "Unknown"));
      }
    }
    return distributionData;
  }

  /**
   * 批量查询并填充 modelName
   */
  private List<Map<String, Object>> fillModelNames(List<Map<String, Object>> distributionData) {
    List<Long> modelIds = distributionData.stream()
        .map(d -> (Long) d.get("modelId"))
        .filter(id -> id != null)
        .distinct()
        .collect(Collectors.toList());
    if (modelIds.isEmpty()) {
      return distributionData;
    }

    List<cloud.xcan.angus.core.ai.domain.model.Model> models = modelQuery.findByIds(modelIds);
    Map<Long, String> modelNameMap = models.stream()
        .collect(Collectors.toMap(m -> m.getId(), m -> m.getName()));

    for (Map<String, Object> data : distributionData) {
      Long modelId = (Long) data.get("modelId");
      if (modelId != null) {
        data.put("modelName", modelNameMap.getOrDefault(modelId, "Unknown"));
      }
    }
    return distributionData;
  }

}
