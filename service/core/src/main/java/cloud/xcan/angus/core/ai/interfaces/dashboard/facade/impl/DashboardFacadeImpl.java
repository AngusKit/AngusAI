package cloud.xcan.angus.core.ai.interfaces.dashboard.facade.impl;

import static cloud.xcan.angus.core.ai.infra.util.TimeRangeUtils.parseTimeRange;
import static cloud.xcan.angus.spec.principal.PrincipalContext.getUserId;

import cloud.xcan.angus.core.ai.application.query.analytics.AnalyticsQuery;
import cloud.xcan.angus.core.ai.application.query.application.ApplicationQuery;
import cloud.xcan.angus.core.ai.application.query.model.ModelQuery;
import cloud.xcan.angus.core.ai.domain.application.AIApplication;
import cloud.xcan.angus.core.ai.domain.model.Model;
import cloud.xcan.angus.core.ai.interfaces.dashboard.facade.DashboardFacade;
import cloud.xcan.angus.core.ai.interfaces.dashboard.facade.dto.DashboardQueryDto;
import cloud.xcan.angus.core.ai.interfaces.dashboard.facade.internal.assembler.DashboardAssembler;
import cloud.xcan.angus.core.ai.interfaces.dashboard.facade.vo.RecentApplicationItemVo;
import cloud.xcan.angus.core.ai.interfaces.dashboard.facade.vo.RecentApplicationsVo;
import cloud.xcan.angus.core.ai.interfaces.dashboard.facade.vo.StatsOverviewVo;
import cloud.xcan.angus.core.ai.interfaces.dashboard.facade.vo.UsageDetailsVo;
import jakarta.annotation.Resource;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import org.springframework.stereotype.Component;

@Component
public class DashboardFacadeImpl implements DashboardFacade {

  private static final DateTimeFormatter DATE_FMT = DateTimeFormatter.ofPattern("yyyy-MM-dd");
  private static final String[] ICON_BGS = {"bg-blue-500", "bg-purple-500", "bg-green-500"};

  @Resource
  private AnalyticsQuery analyticsQuery;

  @Resource
  private ApplicationQuery applicationQuery;

  @Resource
  private ModelQuery modelQuery;

  @Override
  public UsageDetailsVo getUsageDetails(DashboardQueryDto dto) {
    var timeRange = parseTimeRange(dto.getTimeRange() != null ? dto.getTimeRange() : "7days");
    int limit = dto.getLimit() != null ? dto.getLimit() : 5;
    Long appId = dto.getAppId();

    List<Map<String, Object>> appDist = analyticsQuery.getAppDistribution(
        timeRange.start, timeRange.end, limit);
    List<Map<String, Object>> topApis = analyticsQuery.getTopEndpoints(
        timeRange.start, timeRange.end, limit, "calls");
    List<Map<String, Object>> costModels = analyticsQuery.getModelDistributionByCost(
        timeRange.start, timeRange.end, limit);

    for (Map<String, Object> app : appDist) {
      Long aid = toLong(app.get("appId"), null);
      if (aid != null) {
        applicationQuery.findById(aid)
            .ifPresent(a -> app.put("appName", a.getName()));
      }
      if (!app.containsKey("appName")) {
        app.put("appName", "未知应用");
      }
    }

    List<Long> modelIds = costModels.stream()
        .map(m -> toLong(m.get("modelId"), null))
        .filter(id -> id != null)
        .distinct()
        .collect(Collectors.toList());
    if (!modelIds.isEmpty()) {
      Map<Long, String> modelNames = modelQuery.findByIds(modelIds).stream()
          .collect(Collectors.toMap(Model::getId, Model::getName, (a, b) -> a));
      for (Map<String, Object> m : costModels) {
        Long mid = toLong(m.get("modelId"), null);
        m.put("modelName", mid != null ? modelNames.getOrDefault(mid, "未知模型") : "未知模型");
      }
    }

    return DashboardAssembler.toUsageDetailsVo(appDist, topApis, costModels, limit);
  }

  @Override
  public StatsOverviewVo getStatsOverview(DashboardQueryDto dto) {
    LocalDateTime now = LocalDateTime.now();
    LocalDateTime thisWeekStart = now.minusDays(7);
    LocalDateTime lastWeekStart = now.minusDays(14);
    LocalDateTime thisMonthStart = now.minusDays(30);
    LocalDateTime lastMonthStart = now.minusDays(60);

    Long appId = dto.getAppId();

    Map<String, Object> thisWeek = analyticsQuery.getOverviewStatsForRange(thisWeekStart, now, appId);
    Map<String, Object> lastWeek = analyticsQuery.getOverviewStatsForRange(lastWeekStart, thisWeekStart, appId);
    Map<String, Object> thisMonth = analyticsQuery.getOverviewStatsForRange(thisMonthStart, now, appId);
    Map<String, Object> lastMonth = analyticsQuery.getOverviewStatsForRange(lastMonthStart, thisMonthStart, appId);

    Long totalApps = 0L;
    if (getUserId() != null) {
      totalApps = applicationQuery.getCurrentUserCounts().getTotal();
    }

    return DashboardAssembler.toStatsOverviewVo(
        thisWeek, lastWeek, thisMonth, lastMonth, totalApps);
  }

  @Override
  public RecentApplicationsVo getRecentApplications(DashboardQueryDto dto) {
    int limit = dto.getLimit() != null && dto.getLimit() > 0 ? dto.getLimit() : 6;
    int offset = dto.getOffset() != null && dto.getOffset() >= 0 ? dto.getOffset() : 0;
    LocalDateTime since = LocalDateTime.now().minusDays(30);

    List<Map<String, Object>> usageStats = analyticsQuery.getRecentAppUsageStats(
        since, limit, offset);

    List<RecentApplicationItemVo> appItems = new ArrayList<>();
    for (Map<String, Object> usage : usageStats) {
      Long appId = toLong(usage.get("appId"), null);
      if (appId == null) {
        continue;
      }
      Optional<AIApplication> appOpt = applicationQuery.findById(appId);
      if (appOpt.isEmpty()) {
        continue;
      }
      AIApplication app = appOpt.get();
      String createdAt = app.getCreatedDate() != null
          ? app.getCreatedDate().format(DATE_FMT)
          : null;
      int colorIdx = Math.abs(appId.hashCode()) % ICON_BGS.length;
      RecentApplicationItemVo item = DashboardAssembler.toRecentApplicationItemVo(
          app.getId(),
          app.getName(),
          app.getDescription(),
          app.getTags(),
          createdAt,
          ICON_BGS[colorIdx]);
      appItems.add(item);
    }

    return DashboardAssembler.toRecentApplicationsVo(usageStats, appItems);
  }

  private static Long toLong(Object value, Long defaultValue) {
    if (value == null) {
      return defaultValue;
    }
    if (value instanceof Number) {
      return ((Number) value).longValue();
    }
    return defaultValue;
  }
}
