package cloud.xcan.angus.core.ai.interfaces.dashboard.facade.internal.assembler;

import static cloud.xcan.angus.core.ai.infra.util.CommonUtils.formatLargeNumber;
import static cloud.xcan.angus.core.ai.infra.util.CommonUtils.formatNumber;
import static cloud.xcan.angus.core.ai.infra.util.CommonUtils.formatResponseTime;
import static cloud.xcan.angus.core.ai.infra.util.CommonUtils.toDouble;
import static cloud.xcan.angus.core.ai.infra.util.CommonUtils.toLocalDateTime;
import static cloud.xcan.angus.core.ai.infra.util.CommonUtils.toLong;

import cloud.xcan.angus.core.ai.interfaces.dashboard.facade.vo.CostModelItemVo;
import cloud.xcan.angus.core.ai.interfaces.dashboard.facade.vo.HotAppItemVo;
import cloud.xcan.angus.core.ai.interfaces.dashboard.facade.vo.RecentApplicationItemVo;
import cloud.xcan.angus.core.ai.interfaces.dashboard.facade.vo.StatItemVo;
import cloud.xcan.angus.core.ai.interfaces.dashboard.facade.vo.StatPeriodDetailsVo;
import cloud.xcan.angus.core.ai.interfaces.dashboard.facade.vo.TopApiItemVo;
import cloud.xcan.angus.core.ai.interfaces.dashboard.facade.vo.UsageDetailsVo;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Dashboard 数据组装器
 */
public class DashboardAssembler {

  private static final DateTimeFormatter ISO_DATETIME = DateTimeFormatter.ISO_LOCAL_DATE_TIME;

  /**
   * 组装使用详情 VO
   */
  public static UsageDetailsVo toUsageDetailsVo(
      List<Map<String, Object>> appDist,
      List<Map<String, Object>> topApis,
      List<Map<String, Object>> costModels,
      int limit) {
    UsageDetailsVo vo = new UsageDetailsVo();

    List<HotAppItemVo> hotApps = new ArrayList<>();
    for (int i = 0; i < Math.min(appDist.size(), limit); i++) {
      Map<String, Object> d = appDist.get(i);
      HotAppItemVo item = new HotAppItemVo();
      item.setRank(i + 1);
      item.setAppName((String) d.getOrDefault("appName", "未知应用"));
      item.setCallCount(toLong(d.get("calls"), 0L));
      item.setPercentage(toDouble(d.get("percentage"), 0.0));
      hotApps.add(item);
    }
    vo.setHotApps(hotApps);

    long totalApiCalls = topApis.stream()
        .mapToLong(m -> toLong(m.get("calls"), 0L))
        .sum();
    List<TopApiItemVo> topApiList = new ArrayList<>();
    for (int i = 0; i < Math.min(topApis.size(), limit); i++) {
      Map<String, Object> d = topApis.get(i);
      TopApiItemVo item = new TopApiItemVo();
      item.setRank(i + 1);
      item.setEndpoint((String) d.getOrDefault("endpoint", "-"));
      item.setMethod((String) d.getOrDefault("method", "GET"));
      item.setCallCount(toLong(d.get("calls"), 0L));
      item.setPercentage(totalApiCalls > 0
          ? toLong(d.get("calls"), 0L) * 100.0 / totalApiCalls
          : 0.0);
      topApiList.add(item);
    }
    vo.setTopApis(topApiList);

    List<CostModelItemVo> costModelList = new ArrayList<>();
    for (int i = 0; i < Math.min(costModels.size(), limit); i++) {
      Map<String, Object> d = costModels.get(i);
      CostModelItemVo item = new CostModelItemVo();
      item.setRank(i + 1);
      item.setModelName((String) d.getOrDefault("modelName", "未知模型"));
      long cost = toLong(d.get("cost"), 0L);
      item.setCost(cost);
      item.setCostDisplay("¥" + String.format("%.2f", cost / 100.0));
      item.setPercentage(toDouble(d.get("percentage"), 0.0));
      costModelList.add(item);
    }
    vo.setCostModels(costModelList);

    return vo;
  }

  /**
   * 组装统计概览 VO
   *
   * @param thisWeek  本周统计数据（totalCalls, activeUsers, totalTokens）
   * @param lastWeek  上周统计数据
   * @param thisMonth 本月统计数据
   * @param lastMonth 上月统计数据
   * @param totalApps 当前应用总数（跨周期一致）
   */
  public static List<StatItemVo> toStatsOverviewVo(
      Map<String, Object> thisWeek,
      Map<String, Object> lastWeek,
      Map<String, Object> thisMonth,
      Map<String, Object> lastMonth,
      Long totalApps) {
    List<StatItemVo> stats = new ArrayList<>();

    String appsStr = formatNumber(totalApps != null ? totalApps : 0L);
    StatItemVo totalAppsStat = new StatItemVo();
    totalAppsStat.setType("totalApps");
    totalAppsStat.setLabel("stats.totalApps");
    totalAppsStat.setValue(appsStr);
    totalAppsStat.setSubtitle("较上周");
    totalAppsStat.setTrend("+0%");
    totalAppsStat.setTrendUp(true);
    totalAppsStat.setDetails(buildPeriodDetails(appsStr, appsStr, appsStr, appsStr));
    stats.add(totalAppsStat);

    // apiCalls
    long thisWeekCalls = toLong(thisWeek.get("totalCalls"), 0L);
    long lastWeekCalls = toLong(lastWeek.get("totalCalls"), 0L);
    long thisMonthCalls = toLong(thisMonth.get("totalCalls"), 0L);
    long lastMonthCalls = toLong(lastMonth.get("totalCalls"), 0L);
    double callsChange =
        lastWeekCalls > 0 ? (thisWeekCalls - lastWeekCalls) * 100.0 / lastWeekCalls : 0;

    StatItemVo apiCallsStat = new StatItemVo();
    apiCallsStat.setType("apiCalls");
    apiCallsStat.setLabel("stats.apiCalls");
    apiCallsStat.setValue(formatLargeNumber(thisWeekCalls));
    apiCallsStat.setSubtitle("本月累积调用 " + formatLargeNumber(thisMonthCalls));
    apiCallsStat.setTrend((callsChange >= 0 ? "+" : "") + String.format("%.0f%%", callsChange));
    apiCallsStat.setTrendUp(callsChange >= 0);
    apiCallsStat.setDetails(buildPeriodDetails(
        formatLargeNumber(thisWeekCalls),
        formatLargeNumber(lastWeekCalls),
        formatLargeNumber(thisMonthCalls),
        formatLargeNumber(lastMonthCalls)));
    stats.add(apiCallsStat);

    // tokenUsage
    long thisWeekTokens = toLong(thisWeek.get("totalTokens"), 0L);
    long lastWeekTokens = toLong(lastWeek.get("totalTokens"), 0L);
    long thisMonthTokens = toLong(thisMonth.get("totalTokens"), 0L);
    long lastMonthTokens = toLong(lastMonth.get("totalTokens"), 0L);
    double tokensChange = lastWeekTokens > 0
        ? (thisWeekTokens - lastWeekTokens) * 100.0 / lastWeekTokens
        : 0;

    StatItemVo tokenStat = new StatItemVo();
    tokenStat.setType("tokenUsage");
    tokenStat.setLabel("stats.tokenUsage");
    tokenStat.setValue(formatLargeNumber(thisWeekTokens));
    tokenStat.setSubtitle(
        "较上周" + (tokensChange >= 0 ? "增加" : "减少") + formatLargeNumber(
            Math.abs(thisWeekTokens - lastWeekTokens)));
    tokenStat.setTrend((tokensChange >= 0 ? "+" : "") + String.format("%.0f%%", tokensChange));
    tokenStat.setTrendUp(tokensChange >= 0);
    tokenStat.setDetails(buildPeriodDetails(
        formatLargeNumber(thisWeekTokens),
        formatLargeNumber(lastWeekTokens),
        formatLargeNumber(thisMonthTokens),
        formatLargeNumber(lastMonthTokens)));
    stats.add(tokenStat);

    // activeUsers
    long thisWeekUsers = toLong(thisWeek.get("activeUsers"), 0L);
    long lastWeekUsers = toLong(lastWeek.get("activeUsers"), 0L);
    long thisMonthUsers = toLong(thisMonth.get("activeUsers"), 0L);
    long lastMonthUsers = toLong(lastMonth.get("activeUsers"), 0L);
    double usersChange = lastWeekUsers > 0
        ? (thisWeekUsers - lastWeekUsers) * 100.0 / lastWeekUsers
        : 0;

    StatItemVo usersStat = new StatItemVo();
    usersStat.setType("activeUsers");
    usersStat.setLabel("stats.activeUsers");
    usersStat.setValue(formatNumber(thisWeekUsers));
    usersStat.setSubtitle("日均活跃 " + (thisWeekUsers > 0 ? thisWeekUsers / 7 : 0) + " 人");
    usersStat.setTrend((usersChange >= 0 ? "+" : "") + String.format("%.0f%%", usersChange));
    usersStat.setTrendUp(usersChange >= 0);
    usersStat.setDetails(buildPeriodDetails(
        formatNumber(thisWeekUsers),
        formatNumber(lastWeekUsers),
        formatNumber(thisMonthUsers),
        formatNumber(lastMonthUsers)));
    stats.add(usersStat);
    return stats;
  }

  private static StatPeriodDetailsVo buildPeriodDetails(String thisWeek, String lastWeek,
      String thisMonth, String lastMonth) {
    StatPeriodDetailsVo d = new StatPeriodDetailsVo();
    d.setThisWeek(thisWeek);
    d.setLastWeek(lastWeek);
    d.setThisMonth(thisMonth);
    d.setLastMonth(lastMonth);
    return d;
  }

  /**
   * 组装最近应用 VO
   */
  public static List<RecentApplicationItemVo> toRecentApplicationsVo(
      List<Map<String, Object>> usageStats,
      List<RecentApplicationItemVo> appItems) {
    List<RecentApplicationItemVo> items = new ArrayList<>();

    for (Map<String, Object> usage : usageStats) {
      Long appId = toLong(usage.get("appId"), null);
      if (appId == null) {
        continue;
      }
      RecentApplicationItemVo appItem = appItems.stream()
          .filter(a -> String.valueOf(appId).equals(a.getId()))
          .findFirst()
          .orElse(null);
      if (appItem == null) {
        continue;
      }
      appItem.setTotalCalls(formatNumber(toLong(usage.get("totalCalls"), 0L)));
      Double avgMs = toDouble(usage.get("avgResponseMs"), 0.0);
      appItem.setAvgResponseTime(formatResponseTime(avgMs));
      Object lastUsed = usage.get("lastUsed");
      if (lastUsed != null) {
        LocalDateTime ldt = toLocalDateTime(lastUsed);
        appItem.setLastUsed(ldt != null ? ldt.format(ISO_DATETIME) : null);
      }
      appItem.setUsage("已 " + formatLargeNumber(toLong(usage.get("totalCalls"), 0L)) + " 次调用");
      items.add(appItem);
    }
    return items;
  }

  /**
   * 将应用领域对象转为 RecentApplicationItemVo（基础字段）
   */
  public static RecentApplicationItemVo toRecentApplicationItemVo(
      Long id, String name, String description, List<String> tags, String createdAt) {
    RecentApplicationItemVo vo = new RecentApplicationItemVo();
    vo.setId(id != null ? String.valueOf(id) : null);
    vo.setName(name);
    vo.setDescription(description);
    vo.setFullDescription(description);
    vo.setCreatedAt(createdAt);
    vo.setTags(tags);
    return vo;
  }
}
