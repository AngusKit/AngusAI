package cloud.xcan.angus.core.ai.interfaces.dashboard.facade.internal;

import static cloud.xcan.angus.core.ai.infra.util.CommonUtils.toLong;
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
import cloud.xcan.angus.core.ai.interfaces.dashboard.facade.vo.StatItemVo;
import cloud.xcan.angus.core.ai.interfaces.dashboard.facade.vo.UsageDetailsVo;
import jakarta.annotation.Resource;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;
import org.springframework.stereotype.Component;

@Component
public class DashboardFacadeImpl implements DashboardFacade {

  private static final DateTimeFormatter DATE_FMT = DateTimeFormatter.ofPattern("yyyy-MM-dd");

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

    List<Map<String, Object>> appDist = analyticsQuery.getAppDistribution(
        timeRange.start, timeRange.end, limit);
    List<Map<String, Object>> topApis = analyticsQuery.getTopEndpoints(
        timeRange.start, timeRange.end, limit, "calls");
    List<Map<String, Object>> costModels = analyticsQuery.getModelDistributionByCost(
        timeRange.start, timeRange.end, limit);

    List<Long> appIds = appDist.stream()
        .map(a -> toLong(a.get("appId"), null))
        .filter(Objects::nonNull)
        .distinct()
        .collect(Collectors.toList());
    Map<Long, String> appNames = appIds.isEmpty() ? Map.of()
        : applicationQuery.findByIds(appIds).stream()
            .collect(Collectors.toMap(AIApplication::getId, AIApplication::getName, (a, b) -> a));
    for (Map<String, Object> app : appDist) {
      Long aid = toLong(app.get("appId"), null);
      app.put("appName", aid != null ? appNames.getOrDefault(aid, "未知应用") : "未知应用");
    }

    List<Long> modelIds = costModels.stream()
        .map(m -> toLong(m.get("modelId"), null))
        .filter(Objects::nonNull)
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
  public List<StatItemVo> getStatsOverview(DashboardQueryDto dto) {
    LocalDateTime now = LocalDateTime.now();
    LocalDateTime thisWeekStart = now.minusDays(7);
    LocalDateTime lastWeekStart = now.minusDays(14);
    LocalDateTime thisMonthStart = now.minusDays(30);
    LocalDateTime lastMonthStart = now.minusDays(60);

    Map<String, Object> thisWeek = analyticsQuery.getOverviewStatsForRange(thisWeekStart, now,
        null);
    Map<String, Object> lastWeek = analyticsQuery.getOverviewStatsForRange(lastWeekStart,
        thisWeekStart, null);
    Map<String, Object> thisMonth = analyticsQuery.getOverviewStatsForRange(thisMonthStart, now,
        null);
    Map<String, Object> lastMonth = analyticsQuery.getOverviewStatsForRange(lastMonthStart,
        thisMonthStart, null);

    long totalApps = 0L;
    if (getUserId() != null) {
      totalApps = applicationQuery.getCurrentUserCounts().getTotal();
    }

    return DashboardAssembler.toStatsOverviewVo(
        thisWeek, lastWeek, thisMonth, lastMonth, totalApps);
  }

  @Override
  public List<RecentApplicationItemVo> getRecentApplications(DashboardQueryDto dto) {
    int limit = dto.getLimit() != null && dto.getLimit() > 0 ? dto.getLimit() : 6;
    int offset = dto.getOffset() != null && dto.getOffset() >= 0 ? dto.getOffset() : 0;
    LocalDateTime since = LocalDateTime.now().minusDays(30);

    List<Map<String, Object>> usageStats = analyticsQuery.getRecentAppUsageStats(
        since, limit, offset);

    List<Long> appIds = usageStats.stream()
        .map(u -> toLong(u.get("appId"), null))
        .filter(Objects::nonNull)
        .distinct()
        .collect(Collectors.toList());
    Map<Long, AIApplication> appMap = applicationQuery.findByIds(appIds).stream()
        .collect(Collectors.toMap(AIApplication::getId, a -> a, (a, b) -> a));

    List<RecentApplicationItemVo> appItems = usageStats.stream()
        .map(usage -> {
          Long appId = toLong(usage.get("appId"), null);
          if (appId == null) {
            return null;
          }
          AIApplication app = appMap.get(appId);
          if (app == null) {
            return null;
          }
          String createdAt = app.getCreatedDate() != null
              ? app.getCreatedDate().format(DATE_FMT)
              : null;
          return DashboardAssembler.toRecentApplicationItemVo(
              app.getId(),
              app.getName(),
              app.getDescription(),
              app.getTags(),
              createdAt);
        })
        .filter(Objects::nonNull)
        .collect(Collectors.toList());
    return DashboardAssembler.toRecentApplicationsVo(usageStats, appItems);
  }

}
