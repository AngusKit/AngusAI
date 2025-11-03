package cloud.xcan.angus.core.ai.application.query.model.impl;

import static cloud.xcan.angus.core.ai.infra.util.TimeRangeUtils.buildPeriodFilters;
import static cloud.xcan.angus.core.ai.infra.util.TimeRangeUtils.getPeriodRange;

import cloud.xcan.angus.core.ai.application.query.model.ModelQuery;
import cloud.xcan.angus.core.ai.domain.StatisticsPeriod;
import cloud.xcan.angus.core.ai.domain.model.LastMonthGrowthTrend;
import cloud.xcan.angus.core.ai.domain.model.Model;
import cloud.xcan.angus.core.ai.domain.model.ModelCallRecord;
import cloud.xcan.angus.core.ai.domain.model.ModelCallRecordRepo;
import cloud.xcan.angus.core.ai.domain.model.ModelRepo;
import cloud.xcan.angus.core.ai.domain.model.ModelSearchRepo;
import cloud.xcan.angus.core.ai.domain.model.ModelStats;
import cloud.xcan.angus.core.ai.domain.model.ModelStatus;
import cloud.xcan.angus.core.ai.domain.model.TodayGrowthTrend;
import cloud.xcan.angus.core.ai.domain.plugin.LongTotalView;
import cloud.xcan.angus.core.biz.BizTemplate;
import cloud.xcan.angus.core.jpa.criteria.GenericSpecification;
import cloud.xcan.angus.remote.message.http.ResourceNotFound;
import cloud.xcan.angus.remote.search.SearchCriteria;
import jakarta.annotation.Resource;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Set;
import lombok.Getter;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Component;

@Component
public class ModelQueryImpl implements ModelQuery {

  @Resource
  private ModelRepo modelRepo;

  @Resource
  private ModelSearchRepo modelSearchRepo;

  @Resource
  private ModelCallRecordRepo modelCallRecordRepo;

  @Override
  public Model findAndCheck(Long id) {
    return new BizTemplate<Model>() {
      @Override
      protected Model process() {
        return modelRepo.findById(id)
            .orElseThrow(() -> ResourceNotFound.of("模型不存在", new Object[]{}));
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
  public ModelStats getStatistics(StatisticsPeriod period) {
    return new BizTemplate<ModelStats>() {
      @Override
      protected ModelStats process() {
        ModelStats stats = new ModelStats();

        // Build a single base filter set from period and reuse for both model and call-record queries
        Set<SearchCriteria> baseFilters = buildPeriodFilters(period);

        // 全量模型统计 (respect period when provided)
        long totalModels = modelRepo.countAllByFilters(baseFilters);
        stats.setTotalModels(totalModels);

        // Count running models via repository filters (avoid reflection)
        long runningModels = modelRepo.countAllByFilters(
            SearchCriteria.merge(baseFilters, SearchCriteria.equal("status", ModelStatus.RUNNING)));
        stats.setRunningModels(runningModels);

        // Use the same base filters for ModelCallRecord queries so period applies to all queries when provided
        Set<SearchCriteria> callFilters = baseFilters;

        // Ensure the base callFilters contain an explicit time range if provided by getPeriodRange as well
        LocalDateTime[] range = getPeriodRange(period);
        if (range != null) {
          callFilters = SearchCriteria.merge(callFilters,
              SearchCriteria.greaterThanEqual("createdDate", range[0]),
              SearchCriteria.lessThanEqual("createdDate", range[1]));
        }

        // Total calls in period
        long totalCalls = modelCallRecordRepo.countAllByFilters(callFilters);
        stats.setTotalCalls(totalCalls);

        // Success / Failed
        long successCalls = modelCallRecordRepo.countAllByFilters(
            SearchCriteria.merge(callFilters, SearchCriteria.equal("success", true)));
        long failedCalls = modelCallRecordRepo.countAllByFilters(
            SearchCriteria.merge(callFilters, SearchCriteria.equal("success", false)));
        stats.setSuccessfulCalls(successCalls);
        stats.setFailedCalls(failedCalls);

        // Tokens sum
        LongTotalView tokensView = modelCallRecordRepo.sumByFilters(
            ModelCallRecord.class, LongTotalView.class, callFilters, "tokens");
        long totalTokens =
            (tokensView == null || tokensView.getTotal() == null) ? 0L : tokensView.getTotal();
        stats.setTotalTokens(totalTokens);

        // Cost sum (double) - use a small internal projection
        DoubleTotalView costView = modelCallRecordRepo.sumByFilters(
            ModelCallRecord.class, DoubleTotalView.class, callFilters, "cost");
        double totalCost =
            (costView == null || costView.getTotal() == null) ? 0.0 : costView.getTotal();
        stats.setTotalCost(totalCost);

        // Success rate
        if (totalCalls > 0) {
          stats.setSuccessRate((double) successCalls * 100.0 / (double) totalCalls);
        } else {
          stats.setSuccessRate(0.0);
        }

        // Average latency: sum(responseTimeMs) / totalCalls
        DoubleTotalView rtSum = modelCallRecordRepo.sumByFilters(
            ModelCallRecord.class, DoubleTotalView.class, callFilters, "responseTimeMs");
        double avgLatency = 0.0;
        if (totalCalls > 0 && rtSum != null && rtSum.getTotal() != null) {
          avgLatency = rtSum.getTotal() / (double) totalCalls;
        }
        stats.setAverageLatencyMs(avgLatency);

        // Trends: last month and today - compute totals but respect base period filters when provided
        LastMonthGrowthTrend lm = new LastMonthGrowthTrend();
        TodayGrowthTrend today = new TodayGrowthTrend();

        LocalDateTime now = LocalDateTime.now();
        LocalDateTime last30Start = now.minusDays(29).toLocalDate().atStartOfDay();
        LocalDateTime todayStart = LocalDate.now().atStartOfDay();

        // Last 30 days totals（合并 base callFilters，当 period 非空 时，baseFilters 会限制结果）
        Set<SearchCriteria> last30CallFilters = SearchCriteria.merge(callFilters,
            SearchCriteria.greaterThanEqual("createdDate", last30Start),
            SearchCriteria.lessThanEqual("createdDate", now));
        long callsLast30 = modelCallRecordRepo.countAllByFilters(last30CallFilters);
        DoubleTotalView costLast30 = modelCallRecordRepo.sumByFilters(
            ModelCallRecord.class, DoubleTotalView.class, last30CallFilters, "cost");
        LongTotalView tokensLast30View = modelCallRecordRepo.sumByFilters(
            ModelCallRecord.class, LongTotalView.class, last30CallFilters, "tokens");
        long tokensLast30 = (tokensLast30View == null || tokensLast30View.getTotal() == null) ? 0L
            : tokensLast30View.getTotal();
        lm.setAddedCalls(callsLast30);
        lm.setAddedCost(
            costLast30 == null || costLast30.getTotal() == null ? 0.0 : costLast30.getTotal());
        lm.setAddedTokens(tokensLast30);

        // Today totals（合并 base callFilters，当 period 非空 时，baseFilters 会限制结果）
        Set<SearchCriteria> todayCallFilters = SearchCriteria.merge(callFilters,
            SearchCriteria.greaterThanEqual("createdDate", todayStart),
            SearchCriteria.lessThanEqual("createdDate", now));
        long callsToday = modelCallRecordRepo.countAllByFilters(todayCallFilters);
        DoubleTotalView costToday = modelCallRecordRepo.sumByFilters(
            ModelCallRecord.class, DoubleTotalView.class, todayCallFilters, "cost");
        LongTotalView tokensTodayView = modelCallRecordRepo.sumByFilters(
            ModelCallRecord.class, LongTotalView.class, todayCallFilters, "tokens");
        long tokensToday = (tokensTodayView == null || tokensTodayView.getTotal() == null) ? 0L
            : tokensTodayView.getTotal();
        today.setAddedCalls(callsToday);
        today.setAddedCost(
            costToday == null || costToday.getTotal() == null ? 0.0 : costToday.getTotal());
        today.setAddedTokens(tokensToday);

        stats.setLastMonthGrowthTrend(lm);
        stats.setTodayGrowthTrend(today);

        return stats;
      }

      // Simple projection for double sums
      @Getter
      public static class DoubleTotalView {

        private final Double total;

        public DoubleTotalView(Double total) {
          this.total = total;
        }
      }
    }.execute();
  }

  // Backwards-compatible overload: delegate to the period-only version
  @SuppressWarnings("unused")
  public ModelStats getStatistics(Long id, StatisticsPeriod period) {
    return getStatistics(period);
  }

  @Override
  public boolean existsByNameAndVersion(String name, String version) {
    return modelRepo.existsByNameAndVersion(name, version);
  }

  @Override
  public boolean existsByNameAndVersionAndIdNot(String name, String version, Long id) {
    return modelRepo.existsByNameAndVersionAndIdNot(name, version, id);
  }

}
