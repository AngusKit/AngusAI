package cloud.xcan.angus.core.ai.application.query.model.impl;

import static cloud.xcan.angus.core.ai.infra.util.TimeRangeUtils.parseEndDate;
import static cloud.xcan.angus.core.ai.infra.util.TimeRangeUtils.parseStartDate;

import cloud.xcan.angus.core.ai.application.query.model.ModelCallRecordQuery;
import cloud.xcan.angus.core.ai.application.query.model.ModelQuery;
import cloud.xcan.angus.core.ai.domain.model.Model;
import cloud.xcan.angus.core.ai.domain.model.ModelCallRecord;
import cloud.xcan.angus.core.ai.domain.model.ModelRepo;
import cloud.xcan.angus.core.ai.domain.model.ModelSearchRepo;
import cloud.xcan.angus.core.ai.domain.model.ModelStatus;
import cloud.xcan.angus.core.ai.domain.model.LastMonthGrowthTrend;
import cloud.xcan.angus.core.ai.domain.model.TodayGrowthTrend;
import cloud.xcan.angus.core.ai.domain.plugin.LongTotalView;
import cloud.xcan.angus.core.ai.interfaces.model.facade.vo.ModelStatisticsVo;
import cloud.xcan.angus.core.biz.BizTemplate;
import cloud.xcan.angus.core.jpa.criteria.GenericSpecification;
import cloud.xcan.angus.remote.dto.SimpleStatisticsDto;
import cloud.xcan.angus.remote.message.http.ResourceNotFound;
import cloud.xcan.angus.remote.search.SearchCriteria;
import jakarta.annotation.Resource;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Set;
import lombok.Getter;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

@Service
public class ModelQueryImpl implements ModelQuery {

  private static final int DEFAULT_MONTHS = 1;

  @Resource
  private ModelRepo modelRepo;

  @Resource
  private ModelSearchRepo modelSearchRepo;

  @Resource
  private ModelCallRecordQuery modelCallRecordQuery;

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
  public ModelStatisticsVo getStatistics(SimpleStatisticsDto dto) {
    LocalDateTime now = LocalDateTime.now();
    LocalDate today = now.toLocalDate();
    LocalDateTime todayStart = today.atStartOfDay();

    LocalDateTime start = parseStartDate(dto != null ? dto.getStartDate() : null);
    LocalDateTime end = parseEndDate(dto != null ? dto.getEndDate() : null);

    if (start.equals(LocalDateTime.of(1970, 1, 1, 0, 0))) {
      start = now.minusMonths(DEFAULT_MONTHS).toLocalDate().atStartOfDay();
    }

    LocalDateTime oneMonthAgoStart = now.minusMonths(DEFAULT_MONTHS).toLocalDate().atStartOfDay();

    ModelStatisticsVo vo = new ModelStatisticsVo();
    buildOverview(vo, start, end);
    buildLastMonthTrend(vo, oneMonthAgoStart, now);
    buildTodayTrend(vo, todayStart, now);
    return vo;
  }

  @Override
  public boolean existsByName(String name) {
    return modelRepo.existsByName(name);
  }

  @Override
  public boolean existsByNameAndIdNot(String name, Long id) {
    return modelRepo.existsByNameAndIdNot(name, id);
  }

  private void buildOverview(ModelStatisticsVo vo, LocalDateTime start, LocalDateTime end) {
    Set<SearchCriteria> callFilters = SearchCriteria.criteria();
    if (start != null && end != null) {
      callFilters = SearchCriteria.merge(callFilters,
          SearchCriteria.greaterThanEqual("createdDate", start),
          SearchCriteria.lessThanEqual("createdDate", end));
    }

    long totalModels = modelRepo.countAllByFilters(SearchCriteria.criteria());
    vo.setTotalModels(totalModels);

    Set<SearchCriteria> activeFilters = SearchCriteria.merge(SearchCriteria.criteria(),
        SearchCriteria.equal("status", ModelStatus.ACTIVE.getValue()));
    long activeModels = modelRepo.countAllByFilters(activeFilters);
    vo.setActiveModels(activeModels);

    long totalCalls = modelCallRecordQuery.countAllByFilters(callFilters);
    vo.setTotalCalls(totalCalls);

    long successCalls = modelCallRecordQuery.countAllByFilters(
        SearchCriteria.merge(callFilters, SearchCriteria.equal("success", true)));
    long failedCalls = modelCallRecordQuery.countAllByFilters(
        SearchCriteria.merge(callFilters, SearchCriteria.equal("success", false)));
    vo.setSuccessfulCalls(successCalls);
    vo.setFailedCalls(failedCalls);

    LongTotalView tokensView = modelCallRecordQuery.sumByFilters(
        ModelCallRecord.class, LongTotalView.class, callFilters, "tokens");
    long totalTokens =
        (tokensView == null || tokensView.getTotal() == null) ? 0L : tokensView.getTotal();
    vo.setTotalTokensConsumed(totalTokens);

    DoubleTotalView costView = modelCallRecordQuery.sumByFilters(
        ModelCallRecord.class, DoubleTotalView.class, callFilters, "cost");
    double totalCost =
        (costView == null || costView.getTotal() == null) ? 0.0 : costView.getTotal();
    vo.setTotalCost(totalCost);

    if (totalCalls > 0) {
      vo.setSuccessRate((double) successCalls * 100.0 / (double) totalCalls);
    } else {
      vo.setSuccessRate(0.0);
    }

    DoubleTotalView rtSum = modelCallRecordQuery.sumByFilters(
        ModelCallRecord.class, DoubleTotalView.class, callFilters, "responseTimeMs");
    double avgLatency = 0.0;
    if (totalCalls > 0 && rtSum != null && rtSum.getTotal() != null) {
      avgLatency = rtSum.getTotal() / (double) totalCalls;
    }
    vo.setAverageLatencyMs(avgLatency);
  }

  private void buildLastMonthTrend(ModelStatisticsVo vo, LocalDateTime start,
      LocalDateTime end) {
    Set<SearchCriteria> callFilters = SearchCriteria.merge(SearchCriteria.criteria(),
        SearchCriteria.greaterThanEqual("createdDate", start),
        SearchCriteria.lessThanEqual("createdDate", end));

    LastMonthGrowthTrend lm = new LastMonthGrowthTrend();

    long callsLast30 = modelCallRecordQuery.countAllByFilters(callFilters);
    DoubleTotalView costLast30 = modelCallRecordQuery.sumByFilters(
        ModelCallRecord.class, DoubleTotalView.class, callFilters, "cost");
    LongTotalView tokensLast30View = modelCallRecordQuery.sumByFilters(
        ModelCallRecord.class, LongTotalView.class, callFilters, "tokens");
    long tokensLast30 = (tokensLast30View == null || tokensLast30View.getTotal() == null) ? 0L
        : tokensLast30View.getTotal();

    lm.setAddedCalls(callsLast30);
    lm.setAddedCost(
        costLast30 == null || costLast30.getTotal() == null ? 0.0 : costLast30.getTotal());
    lm.setAddedTokens(tokensLast30);

    DoubleTotalView rtSum = modelCallRecordQuery.sumByFilters(
        ModelCallRecord.class, DoubleTotalView.class, callFilters, "responseTimeMs");
    if (callsLast30 > 0 && rtSum != null && rtSum.getTotal() != null) {
      lm.setAverageLatencyMs(rtSum.getTotal() / (double) callsLast30);
    }

    vo.setLastMonthGrowthTrend(lm);
  }

  private void buildTodayTrend(ModelStatisticsVo vo, LocalDateTime start,
      LocalDateTime end) {
    Set<SearchCriteria> callFilters = SearchCriteria.merge(SearchCriteria.criteria(),
        SearchCriteria.greaterThanEqual("createdDate", start),
        SearchCriteria.lessThanEqual("createdDate", end));

    TodayGrowthTrend today = new TodayGrowthTrend();

    long callsToday = modelCallRecordQuery.countAllByFilters(callFilters);
    DoubleTotalView costToday = modelCallRecordQuery.sumByFilters(
        ModelCallRecord.class, DoubleTotalView.class, callFilters, "cost");
    LongTotalView tokensTodayView = modelCallRecordQuery.sumByFilters(
        ModelCallRecord.class, LongTotalView.class, callFilters, "tokens");
    long tokensToday = (tokensTodayView == null || tokensTodayView.getTotal() == null) ? 0L
        : tokensTodayView.getTotal();

    today.setAddedCalls(callsToday);
    today.setAddedCost(
        costToday == null || costToday.getTotal() == null ? 0.0 : costToday.getTotal());
    today.setAddedTokens(tokensToday);

    DoubleTotalView rtSum = modelCallRecordQuery.sumByFilters(
        ModelCallRecord.class, DoubleTotalView.class, callFilters, "responseTimeMs");
    if (callsToday > 0 && rtSum != null && rtSum.getTotal() != null) {
      today.setAverageLatencyMs(rtSum.getTotal() / (double) callsToday);
    }
    vo.setTodayGrowthTrend(today);
  }

  @Getter
  public static class DoubleTotalView {
    private final Double total;

    public DoubleTotalView(Double total) {
      this.total = total;
    }
  }

}
