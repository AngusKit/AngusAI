package cloud.xcan.angus.core.ai.interfaces.analytics.facade.internal.assembler;

import static cloud.xcan.angus.core.ai.infra.util.CommonUtils.PERCENTAGE_FORMAT;
import static cloud.xcan.angus.core.ai.infra.util.CommonUtils.formatLargeNumber;
import static cloud.xcan.angus.core.ai.infra.util.CommonUtils.formatNumber;
import static cloud.xcan.angus.core.ai.infra.util.CommonUtils.formatPercentage;
import static cloud.xcan.angus.core.ai.infra.util.CommonUtils.formatPercentageTo2Decimals;
import static cloud.xcan.angus.core.ai.infra.util.CommonUtils.formatResponseTime;
import static cloud.xcan.angus.core.ai.infra.util.CommonUtils.getTrend;

import cloud.xcan.angus.core.ai.interfaces.analytics.facade.vo.AnalyticsOverviewVo;
import cloud.xcan.angus.core.ai.interfaces.analytics.facade.vo.ApiCallsTrendVo;
import cloud.xcan.angus.core.ai.interfaces.analytics.facade.vo.AppDistributionVo;
import cloud.xcan.angus.core.ai.interfaces.analytics.facade.vo.ErrorAnalysisVo;
import cloud.xcan.angus.core.ai.interfaces.analytics.facade.vo.ModelDistributionVo;
import cloud.xcan.angus.core.ai.interfaces.analytics.facade.vo.ResponseTimeAnalysisVo;
import cloud.xcan.angus.core.ai.interfaces.analytics.facade.vo.TokenUsageTrendVo;
import cloud.xcan.angus.core.ai.interfaces.analytics.facade.vo.TopEndpointsVo;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Analytics数据转换器
 */
public class AnalyticsAssembler {

  private static Long toLong(Object value, Long defaultValue) {
    if (value == null) {
      return defaultValue;
    }
    if (value instanceof Number) {
      return ((Number) value).longValue();
    }
    return defaultValue;
  }

  private static Double toDouble(Object value, Double defaultValue) {
    if (value == null) {
      return defaultValue;
    }
    if (value instanceof Number) {
      return ((Number) value).doubleValue();
    }
    return defaultValue;
  }

  /**
   * 转换概览统计数据
   */
  public static AnalyticsOverviewVo toOverviewVo(Map<String, Object> stats, String timeRange,
      Long startTime, Long endTime) {
    AnalyticsOverviewVo vo = new AnalyticsOverviewVo();
    vo.setTimeRange(timeRange);

    // 周期
    AnalyticsOverviewVo.PeriodVo period = new AnalyticsOverviewVo.PeriodVo();
    period.setStart(startTime);
    period.setEnd(endTime);
    vo.setPeriod(period);

    // 核心指标
    AnalyticsOverviewVo.StatsVo statsVo = new AnalyticsOverviewVo.StatsVo();

    // API总调用
    AnalyticsOverviewVo.MetricVo totalApiCalls = new AnalyticsOverviewVo.MetricVo();
    Long calls = toLong(stats.get("totalCalls"), 0L);
    totalApiCalls.setValue(calls);
    totalApiCalls.setValueDisplay(formatNumber(calls));
    totalApiCalls.setChange(formatPercentage((Double) stats.get("callsChange")));
    totalApiCalls.setTrend(getTrend((Double) stats.get("callsChange")));
    totalApiCalls.setComparedTo("与上周期相比");
    statsVo.setTotalApiCalls(totalApiCalls);

    // 活跃用户
    AnalyticsOverviewVo.MetricVo activeUsers = new AnalyticsOverviewVo.MetricVo();
    Long users = toLong(stats.get("activeUsers"), 0L);
    activeUsers.setValue(users);
    activeUsers.setValueDisplay(formatNumber(users));
    activeUsers.setChange(formatPercentage((Double) stats.get("usersChange")));
    activeUsers.setTrend(getTrend((Double) stats.get("usersChange")));
    activeUsers.setComparedTo("与上周期相比");
    statsVo.setActiveUsers(activeUsers);

    // Token消耗
    AnalyticsOverviewVo.MetricVo tokenConsumption = new AnalyticsOverviewVo.MetricVo();
    Long tokens = toLong(stats.get("totalTokens"), 0L);
    tokenConsumption.setValue(tokens);
    tokenConsumption.setValueDisplay(formatLargeNumber(tokens));
    tokenConsumption.setChange(formatPercentage((Double) stats.get("tokensChange")));
    tokenConsumption.setTrend(getTrend((Double) stats.get("tokensChange")));
    tokenConsumption.setComparedTo("与上周期相比");
    statsVo.setTokenConsumption(tokenConsumption);

    // 平均响应时间
    AnalyticsOverviewVo.MetricVo avgResponseTime = new AnalyticsOverviewVo.MetricVo();
    Double responseTime = toDouble(stats.get("avgResponseTime"), 0.0);
    avgResponseTime.setValue(responseTime.longValue());
    avgResponseTime.setValueDisplay(formatResponseTime(responseTime));
    avgResponseTime.setChange(formatPercentage((Double) stats.get("responseTimeChange")));
    avgResponseTime.setTrend(getTrend((Double) stats.get("responseTimeChange")));
    avgResponseTime.setComparedTo("与上周期相比");
    statsVo.setAvgResponseTime(avgResponseTime);

    vo.setStats(statsVo);

    // 成功率
    AnalyticsOverviewVo.SuccessRateVo successRate = new AnalyticsOverviewVo.SuccessRateVo();
    Long total = toLong(stats.get("totalCalls"), 0L);
    Long successful = toLong(stats.get("successfulCalls"), 0L);
    successRate.setTotal(total);
    successRate.setSuccessful(successful);
    successRate.setFailed(toLong(stats.get("failedCalls"), 0L));
    successRate.setValue(total > 0 ? (successful * 100.0 / total) : 0.0);
    vo.setSuccessRate(successRate);

    return vo;
  }

  /**
   * 转换API调用趋势
   */
  public static ApiCallsTrendVo toApiCallsTrendVo(List<Map<String, Object>> trendData) {
    ApiCallsTrendVo vo = new ApiCallsTrendVo();
    List<ApiCallsTrendVo.TrendItemVo> items = new ArrayList<>();

    long totalCalls = 0;
    int peakCalls = 0;
    String peakTime = "";

    for (Map<String, Object> data : trendData) {
      ApiCallsTrendVo.TrendItemVo item = new ApiCallsTrendVo.TrendItemVo();
      item.setDate((String) data.get("date"));
      item.setDatetime(data.get("datetime") != null ? System.currentTimeMillis() : null);

      int calls = ((Number) data.get("totalCalls")).intValue();
      item.setTotalCalls(calls);
      item.setSuccessfulCalls(((Number) data.get("successfulCalls")).intValue());
      item.setFailedCalls(((Number) data.get("failedCalls")).intValue());
      item.setSuccessRate((Double) data.get("successRate"));

      items.add(item);

      totalCalls += calls;
      if (calls > peakCalls) {
        peakCalls = calls;
        peakTime = (String) data.get("date");
      }
    }

    vo.setItems(items);

    // 汇总统计
    ApiCallsTrendVo.SummaryVo summary = new ApiCallsTrendVo.SummaryVo();
    summary.setTotalCalls(totalCalls);
    summary.setAvgCallsPerPeriod(!items.isEmpty() ? (double) totalCalls / items.size() : 0.0);
    summary.setPeakCalls(peakCalls);
    summary.setPeakTime(peakTime);
    vo.setSummary(summary);

    return vo;
  }

  /**
   * 转换Token使用趋势
   */
  public static TokenUsageTrendVo toTokenUsageTrendVo(List<Map<String, Object>> trendData) {
    TokenUsageTrendVo vo = new TokenUsageTrendVo();
    List<TokenUsageTrendVo.TrendItemVo> items = new ArrayList<>();

    long totalInput = 0;
    long totalOutput = 0;
    long totalTokens = 0;
    long totalCost = 0;

    for (Map<String, Object> data : trendData) {
      TokenUsageTrendVo.TrendItemVo item = new TokenUsageTrendVo.TrendItemVo();
      item.setDate((String) data.get("date"));
      item.setDatetime(data.get("datetime") != null ? System.currentTimeMillis() : null);

      long inputTokens = ((Number) data.get("inputTokens")).longValue();
      long outputTokens = ((Number) data.get("outputTokens")).longValue();
      long tokens = ((Number) data.get("totalTokens")).longValue();
      long cost = ((Number) data.get("cost")).longValue();

      item.setInputTokens(inputTokens);
      item.setOutputTokens(outputTokens);
      item.setTotalTokens(tokens);
      item.setCost(cost);

      items.add(item);

      totalInput += inputTokens;
      totalOutput += outputTokens;
      totalTokens += tokens;
      totalCost += cost;
    }

    vo.setItems(items);

    // 汇总统计
    TokenUsageTrendVo.SummaryVo summary = new TokenUsageTrendVo.SummaryVo();
    summary.setTotalInput(totalInput);
    summary.setTotalOutput(totalOutput);
    summary.setTotalTokens(totalTokens);
    summary.setTotalCost(totalCost);
    summary.setAvgTokensPerCall(!items.isEmpty() ? (double) totalTokens / items.size() : 0.0);
    vo.setSummary(summary);

    return vo;
  }

  /**
   * 转换应用分布数据
   */
  public static AppDistributionVo toAppDistributionVo(List<Map<String, Object>> distributionData) {
    AppDistributionVo vo = new AppDistributionVo();
    List<AppDistributionVo.DistributionItemVo> items = new ArrayList<>();

    long totalCalls = 0;
    long totalTokens = 0;

    for (Map<String, Object> data : distributionData) {
      AppDistributionVo.DistributionItemVo item = new AppDistributionVo.DistributionItemVo();
      item.setAppId((Long) data.get("appId"));
      item.setAppName((String) data.getOrDefault("appName", "Unknown"));
      item.setCalls((Long) data.get("calls"));
      Double pct = toDouble(data.get("percentage"), 0.0);
      item.setPercentage(formatPercentageTo2Decimals(pct));
      item.setTokens((Long) data.getOrDefault("tokens", 0L));
      item.setCost((Long) data.getOrDefault("cost", 0L));
      item.setAvgResponseTime((Double) data.getOrDefault("avgResponseTime", 0.0));

      items.add(item);

      totalCalls += item.getCalls();
      totalTokens += item.getTokens();
    }

    vo.setItems(items);

    AppDistributionVo.TotalVo total = new AppDistributionVo.TotalVo();
    total.setApps(items.size());
    total.setCalls(totalCalls);
    total.setTokens(totalTokens);
    vo.setTotal(total);

    return vo;
  }

  /**
   * 转换模型分布数据
   */
  public static ModelDistributionVo toModelDistributionVo(
      List<Map<String, Object>> distributionData) {
    ModelDistributionVo vo = new ModelDistributionVo();
    List<ModelDistributionVo.DistributionItemVo> items = new ArrayList<>();

    long totalCalls = 0;
    long totalTokens = 0;
    long totalCost = 0;

    String[] colors = {"#3b82f6", "#8b5cf6", "#10b981", "#f59e0b", "#ef4444", "#6b7280"};

    int colorIndex = 0;
    for (Map<String, Object> data : distributionData) {
      ModelDistributionVo.DistributionItemVo item = new ModelDistributionVo.DistributionItemVo();
      item.setModelId((Long) data.get("modelId"));
      item.setModelName((String) data.getOrDefault("modelName", "Unknown"));
      item.setCalls((Long) data.get("calls"));
      Double pct = toDouble(data.get("percentage"), 0.0);
      item.setPercentage(formatPercentageTo2Decimals(pct));
      item.setTokens((Long) data.getOrDefault("tokens", 0L));
      item.setCost((Long) data.getOrDefault("cost", 0L));
      item.setAvgResponseTime((Double) data.getOrDefault("avgResponseTime", 0.0));
      item.setColor(colors[colorIndex % colors.length]);

      items.add(item);

      totalCalls += item.getCalls();
      totalTokens += item.getTokens();
      totalCost += item.getCost();
      colorIndex++;
    }

    vo.setItems(items);

    ModelDistributionVo.TotalVo total = new ModelDistributionVo.TotalVo();
    total.setModels(items.size());
    total.setCalls(totalCalls);
    total.setTokens(totalTokens);
    total.setCost(totalCost);
    vo.setTotal(total);

    return vo;
  }

  /**
   * 转换响应时间分析数据
   */
  public static ResponseTimeAnalysisVo toResponseTimeAnalysisVo(
      List<Map<String, Object>> analysisData, Map<String, Object> slowestEndpoint) {
    ResponseTimeAnalysisVo vo = new ResponseTimeAnalysisVo();
    List<ResponseTimeAnalysisVo.TrendItemVo> items = new ArrayList<>();

    double sumAvg = 0;
    int maxP95 = 0;
    int maxP99 = 0;
    int itemCount = 0;

    for (Map<String, Object> data : analysisData) {
      ResponseTimeAnalysisVo.TrendItemVo item = new ResponseTimeAnalysisVo.TrendItemVo();
      Object dtObj = data.get("datetime");
      item.setDatetime(dtObj instanceof Number ? ((Number) dtObj).longValue() : null);
      item.setDate((String) data.get("date"));

      int avgTime = data.get("avgTime") != null ? ((Number) data.get("avgTime")).intValue() : 0;
      int p50 = data.get("p50") != null ? ((Number) data.get("p50")).intValue() : 0;
      int p95 = data.get("p95") != null ? ((Number) data.get("p95")).intValue() : 0;
      int p99 = data.get("p99") != null ? ((Number) data.get("p99")).intValue() : 0;
      int minTime = data.get("minTime") != null ? ((Number) data.get("minTime")).intValue() : 0;
      int maxTime = data.get("maxTime") != null ? ((Number) data.get("maxTime")).intValue() : 0;

      item.setAvgTime(avgTime);
      item.setP50(p50);
      item.setP95(p95);
      item.setP99(p99);
      item.setMinTime(minTime);
      item.setMaxTime(maxTime);
      items.add(item);

      sumAvg += avgTime;
      if (p95 > maxP95) maxP95 = p95;
      if (p99 > maxP99) maxP99 = p99;
      itemCount++;
    }

    vo.setItems(items);

    ResponseTimeAnalysisVo.SummaryVo summary = new ResponseTimeAnalysisVo.SummaryVo();
    summary.setOverallAvg(itemCount > 0 ? sumAvg / itemCount : 0.0);
    summary.setOverallP95(maxP95);
    summary.setOverallP99(maxP99);

    ResponseTimeAnalysisVo.SlowestEndpointVo slowest = null;
    if (slowestEndpoint != null && !slowestEndpoint.isEmpty() && slowestEndpoint.get("endpoint") != null) {
      slowest = new ResponseTimeAnalysisVo.SlowestEndpointVo();
      slowest.setEndpoint((String) slowestEndpoint.get("endpoint"));
      Object avgMs = slowestEndpoint.get("avgTimeMs");
      slowest.setAvgTime(avgMs != null ? ((Number) avgMs).intValue() : 0);
    }
    summary.setSlowestEndpoint(slowest);
    vo.setSummary(summary);

    return vo;
  }

  /**
   * 转换Top接口数据
   */
  public static TopEndpointsVo toTopEndpointsVo(List<Map<String, Object>> endpointsData) {
    TopEndpointsVo vo = new TopEndpointsVo();
    List<TopEndpointsVo.EndpointItemVo> items = new ArrayList<>();

    for (Map<String, Object> data : endpointsData) {
      TopEndpointsVo.EndpointItemVo item = new TopEndpointsVo.EndpointItemVo();
      item.setEndpoint((String) data.get("endpoint"));
      item.setMethod((String) data.get("method"));
      item.setCalls((Long) data.get("calls"));

      Integer avgTimeMs = ((Number) data.get("avgTimeMs")).intValue();
      item.setAvgTimeMs(avgTimeMs);
      item.setAvgTime(formatResponseTime(avgTimeMs.doubleValue()));

      Double successRate = (Double) data.get("successRate");
      item.setSuccessRateValue(successRate);
      item.setSuccessRate(PERCENTAGE_FORMAT.format(successRate) + "%");

      item.setTotalTokens((Long) data.getOrDefault("totalTokens", 0L));
      item.setErrors((Long) data.getOrDefault("errors", 0L));

      items.add(item);
    }

    vo.setItems(items);
    return vo;
  }

  /**
   * 转换错误分析数据
   */
  public static ErrorAnalysisVo toErrorAnalysisVo(Map<String, Object> analysisData) {
    ErrorAnalysisVo vo = new ErrorAnalysisVo();

    // 按状态码统计
    @SuppressWarnings("unchecked")
    List<Map<String, Object>> byStatusCodeData = (List<Map<String, Object>>) analysisData.get(
        "byStatusCode");
    List<ErrorAnalysisVo.ErrorByStatusCodeVo> byStatusCode = new ArrayList<>();

    for (Map<String, Object> data : byStatusCodeData) {
      ErrorAnalysisVo.ErrorByStatusCodeVo item = new ErrorAnalysisVo.ErrorByStatusCodeVo();
      item.setStatusCode((Integer) data.get("statusCode"));
      item.setName((String) data.get("name"));
      item.setCount((Long) data.get("count"));
      Double percentage = (Double) data.get("percentage");
      item.setPercentageValue(percentage);
      item.setPercentage(PERCENTAGE_FORMAT.format(percentage) + "%");
      item.setTrend("up"); // 简化处理
      item.setChange("+0%");

      byStatusCode.add(item);
    }
    vo.setByStatusCode(byStatusCode);

    // 汇总统计
    ErrorAnalysisVo.SummaryVo summary = new ErrorAnalysisVo.SummaryVo();
    summary.setTotalErrors((Long) analysisData.get("totalErrors"));
    vo.setSummary(summary);

    return vo;
  }

}
