package cloud.xcan.angus.core.ai.application.query.analytics.impl;

import static cloud.xcan.angus.core.ai.infra.util.CommonUtils.calculateChangePercentage;
import static cloud.xcan.angus.core.ai.infra.util.CommonUtils.calculatePercentile;
import static cloud.xcan.angus.core.ai.infra.util.CommonUtils.formatDateByGranularity;
import static cloud.xcan.angus.core.ai.infra.util.CommonUtils.getStatusErrorName;

import cloud.xcan.angus.core.ai.application.query.analytics.ChatAnalyticsQuery;
import cloud.xcan.angus.core.ai.domain.chat.ChatUsageLog;
import cloud.xcan.angus.core.ai.domain.chat.ChatUsageLogRepo;
import cloud.xcan.angus.core.ai.interfaces.application.facade.vo.ApplicationDetailVo.ApplicationStatsVo;
import cloud.xcan.angus.core.biz.BizTemplate;
import jakarta.annotation.Resource;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class ChatAnalyticsQueryImpl implements ChatAnalyticsQuery {

  @Resource
  private ChatUsageLogRepo chatUsageLogRepo;

  @Override
  public Map<String, Object> getOverviewStatsForRange(LocalDateTime start, LocalDateTime end,
      Long appId) {
    return new BizTemplate<Map<String, Object>>() {
      @Override
      protected Map<String, Object> process() {
        Map<String, Object> stats = new HashMap<>();
        Long totalCalls = appId != null
            ? chatUsageLogRepo.countByAppIdAndTimeRange(appId, start, end)
            : chatUsageLogRepo.countByTimeRange(start, end);
        Long activeUsers = chatUsageLogRepo.countDistinctUsersByTimeRange(start, end);
        Long totalTokens = chatUsageLogRepo.sumTokensByTimeRange(start, end);
        Double avgResponseTime = chatUsageLogRepo.avgResponseTimeByTimeRange(start, end);

        stats.put("totalCalls", totalCalls);
        stats.put("activeUsers", activeUsers);
        stats.put("totalTokens", totalTokens);
        stats.put("avgResponseTime", avgResponseTime);
        return stats;
      }
    }.execute();
  }

  @Override
  public Map<String, Object> getModelOverviewStatsForRange(LocalDateTime start, LocalDateTime end) {
    return new BizTemplate<Map<String, Object>>() {
      @Override
      protected Map<String, Object> process() {
        Object[] row = chatUsageLogRepo.getGlobalOverviewStats(start, end);
        Map<String, Object> stats = new HashMap<>();
        Object[] data = unwrapRow(row);
        if (data == null || data.length < 5) {
          stats.put("totalCalls", 0L);
          stats.put("successfulCalls", 0L);
          stats.put("failedCalls", 0L);
          stats.put("totalTokens", 0L);
          stats.put("totalCostCents", 0L);
          stats.put("avgResponseTimeMs", null);
          return stats;
        }
        long totalCalls = data[0] != null ? ((Number) data[0]).longValue() : 0L;
        long successfulCalls = data[1] != null ? ((Number) data[1]).longValue() : 0L;
        long totalTokens = data[2] != null ? ((Number) data[2]).longValue() : 0L;
        long totalCostCents = data[3] != null ? ((Number) data[3]).longValue() : 0L;
        Double avgResponseTimeMs = data[4] != null ? ((Number) data[4]).doubleValue() : null;

        stats.put("totalCalls", totalCalls);
        stats.put("successfulCalls", successfulCalls);
        stats.put("failedCalls", totalCalls - successfulCalls);
        stats.put("totalTokens", totalTokens);
        stats.put("totalCostCents", totalCostCents);
        stats.put("avgResponseTimeMs", avgResponseTimeMs);
        return stats;
      }

      /** JPQL 聚合可能返回 Object[1]{Object[5]} 的嵌套结构，需解包 */
      private Object[] unwrapRow(Object[] row) {
        if (row == null || row.length == 0) {
          return null;
        }
        if (row[0] instanceof Object[]) {
          return (Object[]) row[0];
        }
        return row;
      }
    }.execute();
  }

  @Override
  public Map<String, Object> getOverviewStats(LocalDateTime start, LocalDateTime end, Long appId) {
    return new BizTemplate<Map<String, Object>>() {
      @Override
      protected Map<String, Object> process() {
        Map<String, Object> stats = new HashMap<>();

        // 当前周期数据
        Long totalCalls = appId != null
            ? chatUsageLogRepo.countByAppIdAndTimeRange(appId, start, end)
            : chatUsageLogRepo.countByTimeRange(start, end);

        Long successfulCalls = appId != null
            ? chatUsageLogRepo.countByAppIdAndTimeRange(appId, start, end) // 简化，实际需要过滤成功的
            : chatUsageLogRepo.countSuccessfulByTimeRange(start, end);

        Long activeUsers = chatUsageLogRepo.countDistinctUsersByTimeRange(start, end);
        Long totalTokens = chatUsageLogRepo.sumTokensByTimeRange(start, end);
        Double avgResponseTime = chatUsageLogRepo.avgResponseTimeByTimeRange(start, end);

        // 上一周期数据(用于计算变化)
        long periodDuration = ChronoUnit.SECONDS.between(start, end);
        LocalDateTime prevStart = start.minusSeconds(periodDuration);
        LocalDateTime prevEnd = start;

        Long prevTotalCalls = appId != null
            ? chatUsageLogRepo.countByAppIdAndTimeRange(appId, prevStart, prevEnd)
            : chatUsageLogRepo.countByTimeRange(prevStart, prevEnd);

        Long prevActiveUsers = chatUsageLogRepo.countDistinctUsersByTimeRange(prevStart, prevEnd);
        Long prevTotalTokens = chatUsageLogRepo.sumTokensByTimeRange(prevStart, prevEnd);
        Double prevAvgResponseTime = chatUsageLogRepo.avgResponseTimeByTimeRange(prevStart, prevEnd);

        stats.put("totalCalls", totalCalls);
        stats.put("successfulCalls", successfulCalls);
        stats.put("failedCalls", totalCalls - successfulCalls);
        stats.put("activeUsers", activeUsers);
        stats.put("totalTokens", totalTokens);
        stats.put("avgResponseTime", avgResponseTime);

        // 计算变化百分比
        stats.put("callsChange", calculateChangePercentage(totalCalls, prevTotalCalls));
        stats.put("usersChange", calculateChangePercentage(activeUsers, prevActiveUsers));
        stats.put("tokensChange", calculateChangePercentage(totalTokens, prevTotalTokens));
        stats.put("responseTimeChange", calculateChangePercentage(
            avgResponseTime != null ? avgResponseTime.longValue() : 0,
            prevAvgResponseTime != null ? prevAvgResponseTime.longValue() : 0));

        return stats;
      }
    }.execute();
  }

  @Override
  public List<Map<String, Object>> getApiCallsTrend(LocalDateTime start, LocalDateTime end,
      Long appId, String granularity) {
    return new BizTemplate<List<Map<String, Object>>>() {
      @Override
      protected List<Map<String, Object>> process() {
        List<Map<String, Object>> trend = new ArrayList<>();
        List<ChatUsageLog> logs = appId != null
            ? chatUsageLogRepo.findByAppIdAndRequestTimeBetween(appId, start, end)
            : chatUsageLogRepo.findByRequestTimeBetween(start, end);

        // 按时间粒度分组聚合
        Map<String, List<ChatUsageLog>> grouped = groupByGranularity(logs, granularity);

        for (Map.Entry<String, List<ChatUsageLog>> entry : grouped.entrySet()) {
          Map<String, Object> dataPoint = new HashMap<>();
          List<ChatUsageLog> groupLogs = entry.getValue();

          long totalCalls = groupLogs.size();
          long successfulCalls = groupLogs.stream().filter(ChatUsageLog::getIsSuccessful).count();
          long failedCalls = totalCalls - successfulCalls;

          dataPoint.put("date", entry.getKey());
          dataPoint.put("totalCalls", totalCalls);
          dataPoint.put("successfulCalls", successfulCalls);
          dataPoint.put("failedCalls", failedCalls);
          dataPoint.put("successRate",
              totalCalls > 0 ? (successfulCalls * 100.0 / totalCalls) : 0.0);

          if (!groupLogs.isEmpty()) {
            dataPoint.put("datetime", groupLogs.get(0).getRequestTime().toString());
          }
          trend.add(dataPoint);
        }
        return trend;
      }
    }.execute();
  }

  @Override
  public List<Map<String, Object>> getTokenUsageTrend(LocalDateTime start, LocalDateTime end,
      Long appId, String granularity) {
    return new BizTemplate<List<Map<String, Object>>>() {
      @Override
      protected List<Map<String, Object>> process() {
        List<Map<String, Object>> trend = new ArrayList<>();
        List<ChatUsageLog> logs = appId != null
            ? chatUsageLogRepo.findByAppIdAndRequestTimeBetween(appId, start, end)
            : chatUsageLogRepo.findByRequestTimeBetween(start, end);

        Map<String, List<ChatUsageLog>> grouped = groupByGranularity(logs, granularity);

        for (Map.Entry<String, List<ChatUsageLog>> entry : grouped.entrySet()) {
          Map<String, Object> dataPoint = new HashMap<>();
          List<ChatUsageLog> groupLogs = entry.getValue();

          long inputTokens = groupLogs.stream()
              .mapToLong(log -> log.getInputTokens() != null ? log.getInputTokens() : 0)
              .sum();
          long outputTokens = groupLogs.stream()
              .mapToLong(log -> log.getOutputTokens() != null ? log.getOutputTokens() : 0)
              .sum();
          long totalTokens = groupLogs.stream()
              .mapToLong(log -> log.getTotalTokens() != null ? log.getTotalTokens() : 0)
              .sum();
          long cost = groupLogs.stream()
              .mapToLong(log -> log.getCost() != null ? log.getCost() : 0)
              .sum();

          dataPoint.put("date", entry.getKey());
          dataPoint.put("inputTokens", inputTokens);
          dataPoint.put("outputTokens", outputTokens);
          dataPoint.put("totalTokens", totalTokens);
          dataPoint.put("cost", cost);

          if (!groupLogs.isEmpty()) {
            dataPoint.put("datetime", groupLogs.get(0).getRequestTime().toString());
          }
          trend.add(dataPoint);
        }
        return trend;
      }
    }.execute();
  }

  @Override
  public List<Map<String, Object>> getResponseTimeAnalysis(LocalDateTime start, LocalDateTime end,
      Long appId, String granularity) {
    return new BizTemplate<List<Map<String, Object>>>() {
      @Override
      protected List<Map<String, Object>> process() {
        List<Map<String, Object>> trend = new ArrayList<>();
        List<ChatUsageLog> logs = appId != null
            ? chatUsageLogRepo.findByAppIdAndRequestTimeBetween(appId, start, end)
            : chatUsageLogRepo.findByRequestTimeBetween(start, end);

        Map<String, List<ChatUsageLog>> grouped = groupByGranularity(logs, granularity);

        for (Map.Entry<String, List<ChatUsageLog>> entry : grouped.entrySet()) {
          Map<String, Object> dataPoint = new HashMap<>();
          List<ChatUsageLog> groupLogs = entry.getValue();

          if (!groupLogs.isEmpty()) {
            List<Integer> responseTimes = groupLogs.stream()
                .map(ChatUsageLog::getResponseTimeMs)
                .sorted()
                .collect(Collectors.toList());

            int avgTime = (int) responseTimes.stream().mapToInt(Integer::intValue).average()
                .orElse(0);
            int p50 = calculatePercentile(responseTimes, 50);
            int p95 = calculatePercentile(responseTimes, 95);
            int p99 = calculatePercentile(responseTimes, 99);
            int minTime = responseTimes.get(0);
            int maxTime = responseTimes.get(responseTimes.size() - 1);

            dataPoint.put("date", entry.getKey());
            dataPoint.put("avgTime", avgTime);
            dataPoint.put("p50", p50);
            dataPoint.put("p95", p95);
            dataPoint.put("p99", p99);
            dataPoint.put("minTime", minTime);
            dataPoint.put("maxTime", maxTime);
            dataPoint.put("datetime",
                groupLogs.get(0).getRequestTime().atZone(ZoneId.systemDefault()).toInstant()
                    .toEpochMilli());
            trend.add(dataPoint);
          }
        }
        return trend;
      }
    }.execute();
  }

  @Override
  public Map<String, Object> getSlowestEndpoint(LocalDateTime start, LocalDateTime end,
      Long appId) {
    return new BizTemplate<Map<String, Object>>() {
      @Override
      protected Map<String, Object> process() {
        List<Object[]> results = chatUsageLogRepo.groupByEndpointOrderByAvgTime(start, end,
            PageRequest.of(0, 1));
        if (results.isEmpty()) {
          return new HashMap<>();
        }
        Object[] r = results.get(0);
        Map<String, Object> map = new HashMap<>();
        map.put("endpoint", r[0]);
        map.put("method", r[1]);
        map.put("calls", r[2]);
        double avgMs = r[3] != null ? ((Number) r[3]).doubleValue() : 0.0;
        map.put("avgTimeMs", (int) avgMs);
        map.put("successfulCalls", r[4]);
        map.put("totalTokens", r[5]);
        return map;
      }
    }.execute();
  }

  @Override
  public List<Map<String, Object>> getAppDistribution(LocalDateTime start, LocalDateTime end,
      Integer limit) {
    return new BizTemplate<List<Map<String, Object>>>() {
      @Override
      protected List<Map<String, Object>> process() {
        List<Object[]> results = chatUsageLogRepo.groupByApp(start, end);
        List<Map<String, Object>> distribution = new ArrayList<>();

        long total = results.stream().mapToLong(r -> ((Number) r[1]).longValue()).sum();

        int count = 0;
        for (Object[] result : results) {
          if (limit != null && count >= limit) {
            break;
          }

          Map<String, Object> item = new HashMap<>();
          item.put("appId", result[0]);
          item.put("calls", result[1]);
          item.put("tokens", result[2]);
          item.put("avgResponseTime", result[3]);
          item.put("cost", result.length > 4 ? result[4] : 0L);
          item.put("percentage",
              total > 0 ? (((Number) result[1]).doubleValue() / total * 100) : 0.0);

          distribution.add(item);
          count++;
        }
        return distribution;
      }
    }.execute();
  }

  @Override
  public List<Map<String, Object>> getModelDistribution(LocalDateTime start, LocalDateTime end) {
    return new BizTemplate<List<Map<String, Object>>>() {
      @Override
      protected List<Map<String, Object>> process() {
        List<Object[]> results = chatUsageLogRepo.groupByModel(start, end);
        List<Map<String, Object>> distribution = new ArrayList<>();

        long totalCalls = results.stream().mapToLong(r -> ((Number) r[1]).longValue()).sum();

        for (Object[] result : results) {
          Map<String, Object> item = new HashMap<>();
          item.put("modelId", result[0]);
          item.put("calls", result[1]);
          item.put("tokens", result[2]);
          item.put("avgResponseTime", result.length > 3 ? result[3] : null);
          item.put("cost", result.length > 4 ? result[4] : 0L);
          item.put("percentage", totalCalls > 0
              ? (((Number) result[1]).doubleValue() / totalCalls * 100) : 0.0);

          distribution.add(item);
        }
        return distribution;
      }
    }.execute();
  }

  @Override
  public List<Map<String, Object>> getModelDistributionByCost(LocalDateTime start,
      LocalDateTime end, Integer limit) {
    return new BizTemplate<List<Map<String, Object>>>() {
      @Override
      protected List<Map<String, Object>> process() {
        List<Object[]> results = chatUsageLogRepo.groupByModelOrderByCost(start, end);
        List<Map<String, Object>> distribution = new ArrayList<>();

        long totalCost = results.stream()
            .mapToLong(r -> ((Number) r[3]).longValue())
            .sum();

        int count = 0;
        for (Object[] result : results) {
          if (limit != null && count >= limit) {
            break;
          }
          Map<String, Object> item = new HashMap<>();
          item.put("modelId", result[0]);
          item.put("calls", result[1]);
          item.put("tokens", result[2] != null ? result[2] : 0L);
          item.put("cost", result[3] != null ? result[3] : 0L);
          item.put("percentage",
              totalCost > 0 ? (((Number) Objects.requireNonNull(result[3])).longValue() * 100.0
                  / totalCost) : 0.0);

          distribution.add(item);
          count++;
        }
        return distribution;
      }
    }.execute();
  }

  @Override
  public List<Map<String, Object>> getTopEndpoints(LocalDateTime start, LocalDateTime end,
      Integer limit, String orderBy) {
    return new BizTemplate<List<Map<String, Object>>>() {
      @Override
      protected List<Map<String, Object>> process() {
        List<Object[]> results = chatUsageLogRepo.groupByEndpoint(start, end);
        List<Map<String, Object>> endpoints = new ArrayList<>();

        int count = 0;
        for (Object[] result : results) {
          if (limit != null && count >= limit) {
            break;
          }

          Map<String, Object> item = new HashMap<>();
          item.put("endpoint", result[0]);
          item.put("method", result[1]);
          item.put("calls", result[2]);
          item.put("avgTimeMs", result[3]);
          item.put("successfulCalls", result[4]);
          item.put("totalTokens", result[5]);

          long calls = ((Number) result[2]).longValue();
          long successful = ((Number) result[4]).longValue();
          item.put("successRate", calls > 0 ? (successful * 100.0 / calls) : 0.0);
          item.put("errors", calls - successful);

          endpoints.add(item);
          count++;
        }
        return endpoints;
      }
    }.execute();
  }

  @Override
  public Map<String, Object> getErrorAnalysis(LocalDateTime start, LocalDateTime end, Long appId) {
    return new BizTemplate<Map<String, Object>>() {
      @Override
      protected Map<String, Object> process() {
        Map<String, Object> analysis = new HashMap<>();

        // 按状态码统计
        List<Object[]> statusCodeResults = chatUsageLogRepo.groupByStatusCode(start, end);
        List<Map<String, Object>> byStatusCode = new ArrayList<>();

        long totalErrors = statusCodeResults.stream()
            .mapToLong(r -> ((Number) r[1]).longValue())
            .sum();

        for (Object[] result : statusCodeResults) {
          Map<String, Object> item = new HashMap<>();
          Integer statusCode = (Integer) result[0];
          long count = ((Number) result[1]).longValue();

          item.put("statusCode", statusCode);
          item.put("name", getStatusErrorName(statusCode));
          item.put("count", count);
          item.put("percentage", totalErrors > 0 ? (count * 100.0 / totalErrors) : 0.0);

          byStatusCode.add(item);
        }

        analysis.put("byStatusCode", byStatusCode);
        analysis.put("totalErrors", totalErrors);

        return analysis;
      }
    }.execute();
  }

  @Override
  public List<Map<String, Object>> getRecentAppUsageStats(LocalDateTime since, Integer limit,
      Integer offset) {
    return new BizTemplate<List<Map<String, Object>>>() {
      @Override
      protected List<Map<String, Object>> process() {
        int pageSize = limit != null && limit > 0 ? limit : 6;
        int page = offset != null && offset > 0 ? offset / pageSize : 0;
        Pageable pageable = PageRequest.of(page, pageSize);

        List<Object[]> results = chatUsageLogRepo.getRecentAppUsageStats(since, pageable);
        List<Map<String, Object>> stats = new ArrayList<>();

        for (Object[] result : results) {
          Map<String, Object> item = new HashMap<>();
          item.put("appId", result[0]);
          item.put("lastUsed", result[1]);
          item.put("totalCalls", result[2]);
          item.put("avgResponseMs", result[3]);
          stats.add(item);
        }
        return stats;
      }
    }.execute();
  }

  @Override
  public Map<Long, ApplicationStatsVo> getApplicationStats(List<Long> appIds) {
    return new BizTemplate<Map<Long, ApplicationStatsVo>>() {
      @Override
      protected Map<Long, ApplicationStatsVo> process() {
        Map<Long, ApplicationStatsVo> result = new HashMap<>();
        if (appIds == null || appIds.isEmpty()) {
          return result;
        }
        LocalDateTime end = LocalDateTime.now();
        LocalDateTime start = LocalDateTime.of(2000, 1, 1, 0, 0);
        for (Long appId : appIds) {
          result.put(appId, buildStatsVo(appId, start, end));
        }
        return result;
      }

      private ApplicationStatsVo buildStatsVo(Long appId, LocalDateTime start, LocalDateTime end) {
        Object[] row = chatUsageLogRepo.getAppOverviewStats(appId, start, end);
        ApplicationStatsVo vo = new ApplicationStatsVo();
        // JPQL 聚合可能返回 Object[1]{Object[5]} 的嵌套结构，需解包
        if (row[0] == null) {
          vo.setTotalApiCalls(0L);
          vo.setTotalTokens(0L);
          vo.setAvgResponseTime(0L);
          vo.setSuccessRate(0.0);
          return vo;
        }

        Object[] data = (Object[]) row[0];
        long totalCalls = data[0] != null ? ((Number) data[0]).longValue() : 0L;
        long successfulCalls = data[1] != null ? ((Number) data[1]).longValue() : 0L;
        Long totalTokens = data[2] != null ? ((Number) data[2]).longValue() : 0L;
        Long avgResponseTime =
            data[4] != null ? Math.round(((Number) data[4]).doubleValue() / 1000) : null;
        Double successRate =
            totalCalls > 0 ? Math.round(successfulCalls * 10000.0 / totalCalls) / 100.0 : null;

        vo.setTotalApiCalls(totalCalls);
        vo.setTotalTokens(totalTokens);
        vo.setAvgResponseTime(avgResponseTime);
        vo.setSuccessRate(successRate);
        return vo;
      }
    }.execute();
  }

  /**
   * 按时间粒度分组日志
   */
  private Map<String, List<ChatUsageLog>> groupByGranularity(List<ChatUsageLog> logs,
      String granularity) {
    Map<String, List<ChatUsageLog>> grouped = new HashMap<>();

    for (ChatUsageLog log : logs) {
      String key = formatDateByGranularity(log.getRequestTime(), granularity);
      grouped.computeIfAbsent(key, k -> new ArrayList<>()).add(log);
    }
    return grouped;
  }

}
