package cloud.xcan.angus.core.ai.application.query.model.impl;

import static cloud.xcan.angus.core.ai.infra.util.CommonUtils.formatCostFromDollars;
import static cloud.xcan.angus.core.ai.infra.util.CommonUtils.getDouble;
import static cloud.xcan.angus.core.ai.infra.util.CommonUtils.getLong;
import static cloud.xcan.angus.core.ai.infra.util.TimeRangeUtils.parseEndDate;
import static cloud.xcan.angus.core.ai.infra.util.TimeRangeUtils.parseStartDate;

import cloud.xcan.angus.core.ai.application.query.analytics.ChatAnalyticsQuery;
import cloud.xcan.angus.core.ai.application.query.model.ModelQuery;
import cloud.xcan.angus.core.ai.domain.chat.ChatUsageLogRepo;
import cloud.xcan.angus.core.ai.domain.model.LastMonthGrowthTrend;
import cloud.xcan.angus.core.ai.domain.model.Model;
import cloud.xcan.angus.core.ai.domain.model.ModelRepo;
import cloud.xcan.angus.core.ai.domain.model.ModelSearchRepo;
import cloud.xcan.angus.core.ai.domain.model.ModelStatus;
import cloud.xcan.angus.core.ai.domain.model.TodayGrowthTrend;
import cloud.xcan.angus.core.ai.interfaces.model.facade.vo.ModelStatisticsVo;
import cloud.xcan.angus.core.biz.BizTemplate;
import cloud.xcan.angus.core.jpa.criteria.GenericSpecification;
import cloud.xcan.angus.remote.dto.SimpleStatisticsDto;
import cloud.xcan.angus.remote.message.http.ResourceNotFound;
import cloud.xcan.angus.remote.search.SearchCriteria;
import jakarta.annotation.Resource;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import lombok.Getter;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

@Service
public class ModelQueryImpl implements ModelQuery {

  @Resource
  private ModelRepo modelRepo;

  @Resource
  private ModelSearchRepo modelSearchRepo;

  @Resource
  private ChatAnalyticsQuery chatAnalyticsQuery;

  @Resource
  private ChatUsageLogRepo chatUsageLogRepo;

  @Override
  public Model findAndCheck(Long id) {
    return new BizTemplate<Model>() {
      @Override
      protected Model process() {
        return modelRepo.findById(id)
            .orElseThrow(() -> ResourceNotFound.of("模型「{0}」不存在", new Object[]{id}));
      }
    }.execute();
  }

  @Override
  public Page<Model> find(GenericSpecification<Model> spec, PageRequest pageable,
      boolean fullTextSearch, String[] match) {
    return new BizTemplate<Page<Model>>() {
      @Override
      protected Page<Model> process() {
        return fullTextSearch
            ? modelSearchRepo.find(spec.getCriteria(), pageable, Model.class, match)
            : modelRepo.findAll(spec, pageable);
      }
    }.execute();
  }

  @Override
  public ModelStatisticsVo getStatistics(SimpleStatisticsDto dto) {
    LocalDateTime now = LocalDateTime.now();
    LocalDate today = now.toLocalDate();
    LocalDateTime todayStart = today.atStartOfDay();

    LocalDateTime start = parseStartDate(dto != null ? dto.getStartDate() : null);
    LocalDateTime end = parseEndDate(dto != null ? dto.getEndDate() : null);

    //    // 如果开始时间为默认值（1970），则使用近一月作为默认范围
    //    if (start.equals(LocalDateTime.of(1970, 1, 1, 0, 0))) {
    //      start = now.minusMonths(DEFAULT_MONTHS).toLocalDate().atStartOfDay();
    //    }

    LocalDateTime oneMonthAgoStart = now.minusMonths(1).toLocalDate().atStartOfDay();

    ModelStatisticsVo vo = new ModelStatisticsVo();
    buildOverview(vo, start, end);
    buildLastMonthTrend(vo, oneMonthAgoStart, now);
    buildTodayTrend(vo, todayStart, now);
    return vo;
  }

  private void buildOverview(ModelStatisticsVo vo, LocalDateTime start, LocalDateTime end) {
    long totalModels = modelRepo.countAllByFilters(SearchCriteria.criteria());
    vo.setTotalModels(totalModels);

    Set<SearchCriteria> activeFilters = SearchCriteria.merge(SearchCriteria.criteria(),
        SearchCriteria.equal("status", ModelStatus.ACTIVE.getValue()));
    long activeModels = modelRepo.countAllByFilters(activeFilters);
    vo.setActiveModels(activeModels);

    Map<String, Object> overview = chatAnalyticsQuery.getModelOverviewStatsForRange(start, end);
    long totalCalls = getLong(overview, "totalCalls");
    long successCalls = getLong(overview, "successfulCalls");
    long failedCalls = getLong(overview, "failedCalls");
    long totalTokens = getLong(overview, "totalTokens");
    double totalCost = getDouble(overview, "totalCost");
    Double avgResponseTimeMs = (Double) overview.get("avgResponseTimeMs");

    vo.setTotalCalls(totalCalls);
    vo.setSuccessfulCalls(successCalls);
    vo.setFailedCalls(failedCalls);
    vo.setTotalTokens(totalTokens);
    vo.setTotalTokensConsumed(totalTokens);
    vo.setTotalCost(totalCost);
    vo.setTotalCostDisplay(formatCostFromDollars(totalCost));

    if (totalCalls > 0) {
      vo.setSuccessRate((double) successCalls * 100.0 / (double) totalCalls);
    } else {
      vo.setSuccessRate(0.0);
    }

    if (totalCalls > 0 && avgResponseTimeMs != null) {
      vo.setAverageLatencySec(avgResponseTimeMs / 1000.0);
    } else {
      vo.setAverageLatencySec(0.0);
    }
  }

  private void buildLastMonthTrend(ModelStatisticsVo vo, LocalDateTime start, LocalDateTime end) {
    Map<String, Object> lmStats = chatAnalyticsQuery.getModelOverviewStatsForRange(start, end);
    LastMonthGrowthTrend lm = new LastMonthGrowthTrend();

    long callsLast30 = getLong(lmStats, "totalCalls");
    double totalCost = getDouble(lmStats, "totalCost");
    long tokensLast30 = getLong(lmStats, "totalTokens");
    Double avgResponseTimeMs = (Double) lmStats.get("avgResponseTimeMs");

    lm.setAddedCalls(callsLast30);
    lm.setAddedCost(totalCost);
    lm.setAddedCostDisplay(formatCostFromDollars(totalCost));
    lm.setAddedTokens(tokensLast30);

    Set<SearchCriteria> addedFilters = SearchCriteria.merge(SearchCriteria.criteria(),
        SearchCriteria.greaterThanEqual("createdDate", start),
        SearchCriteria.lessThanEqual("createdDate", end));
    lm.setAddedModels(modelRepo.countAllByFilters(addedFilters));

    if (callsLast30 > 0 && avgResponseTimeMs != null) {
      lm.setAverageLatencySec(avgResponseTimeMs / 1000.0);
    }

    vo.setLastMonthGrowthTrend(lm);
  }

  private void buildTodayTrend(ModelStatisticsVo vo, LocalDateTime start, LocalDateTime end) {
    Map<String, Object> todayStats = chatAnalyticsQuery.getModelOverviewStatsForRange(start, end);
    TodayGrowthTrend trend = new TodayGrowthTrend();

    long callsToday = getLong(todayStats, "totalCalls");
    double totalCost = getDouble(todayStats, "totalCost");
    long tokensToday = getLong(todayStats, "totalTokens");
    Double avgResponseTimeMs = (Double) todayStats.get("avgResponseTimeMs");

    trend.setAddedCalls(callsToday);
    trend.setAddedCost(totalCost);
    trend.setAddedCostDisplay(formatCostFromDollars(totalCost));
    trend.setAddedTokens(tokensToday);

    Set<SearchCriteria> addedFilters = SearchCriteria.merge(SearchCriteria.criteria(),
        SearchCriteria.greaterThanEqual("createdDate", start),
        SearchCriteria.lessThanEqual("createdDate", end));
    trend.setAddedModels(modelRepo.countAllByFilters(addedFilters));

    if (callsToday > 0 && avgResponseTimeMs != null) {
      trend.setAverageLatencySec(avgResponseTimeMs / 1000.0);
    }

    vo.setTodayGrowthTrend(trend);
  }

  @Override
  public boolean existsByName(String name) {
    return modelRepo.existsByName(name);
  }

  @Override
  public boolean existsByNameAndIdNot(String name, Long id) {
    return modelRepo.existsByNameAndIdNot(name, id);
  }

  @Override
  public Optional<Model> findById(Long id) {
    return id == null ? Optional.empty() : modelRepo.findById(id);
  }

  @Override
  public List<Model> findByIds(Collection<Long> ids) {
    return modelRepo.findAllById(ids);
  }

  @Override
  public List<Model> findModelsForConfig(String tenantId) {
    Set<SearchCriteria> filters = SearchCriteria.merge(SearchCriteria.criteria(),
        SearchCriteria.equal("status", ModelStatus.ACTIVE.getValue()));
    if (tenantId != null && !tenantId.isBlank()) {
      filters = SearchCriteria.merge(filters, SearchCriteria.equal("tenantId", tenantId));
    }
    GenericSpecification<Model> spec = new GenericSpecification<>(filters);
    return modelRepo.findAll(spec);
  }

  @Override
  public Map<Long, ModelDetailStats> getDetailStatsForModelIds(List<Long> modelIds,
      LocalDateTime start, LocalDateTime end) {
    Map<Long, ModelDetailStats> result = new HashMap<>();
    if (modelIds == null || modelIds.isEmpty()) {
      return result;
    }
    List<Object[]> rows = chatUsageLogRepo.groupByModelIds(modelIds, start, end);
    for (Object[] row : rows) {
      Long modelId = row[0] != null ? ((Number) row[0]).longValue() : null;
      if (modelId == null) {
        continue;
      }
      long calls = row[1] != null ? ((Number) row[1]).longValue() : 0L;
      long tokens = row[2] != null ? ((Number) row[2]).longValue() : 0L;
      Double avgResponseTimeMs = row[3] != null ? ((Number) row[3]).doubleValue() : null;
      double cost = row[4] != null ? ((Number) row[4]).doubleValue() : 0.0;
      String costDisplay = formatCostFromDollars(cost);
      result.put(modelId, new ModelDetailStats(calls, tokens, cost, costDisplay, avgResponseTimeMs));
    }
    return result;
  }

  @Getter
  public static class DoubleTotalView {

    private final Double total;

    public DoubleTotalView(Double total) {
      this.total = total;
    }
  }

}
