package cloud.xcan.angus.core.ai.interfaces.model.facade.internal;

import static cloud.xcan.angus.core.ai.infra.util.TimeRangeUtils.parseEndDate;
import static cloud.xcan.angus.core.ai.infra.util.TimeRangeUtils.parseStartDate;
import static cloud.xcan.angus.core.jpa.criteria.SearchCriteriaBuilder.getMatchSearchFields;
import static cloud.xcan.angus.core.utils.CoreUtils.buildVoPageResult;

import cloud.xcan.angus.core.ai.application.cmd.model.ModelCmd;
import cloud.xcan.angus.core.ai.application.query.model.ModelCallRecordQuery;
import cloud.xcan.angus.core.ai.application.query.model.ModelQuery;
import cloud.xcan.angus.core.ai.domain.model.LastMonthGrowthTrend;
import cloud.xcan.angus.core.ai.domain.model.Model;
import cloud.xcan.angus.core.ai.domain.model.ModelCallRecord;
import cloud.xcan.angus.core.ai.domain.model.ModelCallRecordRepo;
import cloud.xcan.angus.core.ai.domain.model.ModelRepo;
import cloud.xcan.angus.core.ai.domain.model.ModelStatus;
import cloud.xcan.angus.core.ai.domain.model.TodayGrowthTrend;
import cloud.xcan.angus.core.ai.domain.plugin.LongTotalView;
import cloud.xcan.angus.core.ai.infra.ai.model.ModelConfig;
import cloud.xcan.angus.core.ai.interfaces.model.facade.ModelFacade;
import cloud.xcan.angus.core.ai.interfaces.model.facade.dto.ModelCreateDto;
import cloud.xcan.angus.core.ai.interfaces.model.facade.dto.ModelFindDto;
import cloud.xcan.angus.core.ai.interfaces.model.facade.dto.ModelTestDto;
import cloud.xcan.angus.core.ai.interfaces.model.facade.dto.ModelUpdateDto;
import cloud.xcan.angus.core.ai.interfaces.model.facade.internal.assembler.ModelAssembler;
import cloud.xcan.angus.core.ai.interfaces.model.facade.vo.ModelDetailVo;
import cloud.xcan.angus.core.ai.interfaces.model.facade.vo.ModelListVo;
import cloud.xcan.angus.core.ai.interfaces.model.facade.vo.ModelStatisticsVo;
import cloud.xcan.angus.core.biz.NameJoin;
import cloud.xcan.angus.core.jpa.criteria.GenericSpecification;
import cloud.xcan.angus.remote.PageResult;
import cloud.xcan.angus.remote.dto.SimpleStatisticsDto;
import cloud.xcan.angus.remote.search.SearchCriteria;
import jakarta.annotation.Resource;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Set;
import lombok.Getter;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;

@Component
public class ModelFacadeImpl implements ModelFacade {

  @Resource
  private ModelQuery modelQuery;

  @Resource
  private ModelCmd modelCmd;

  @Resource
  private ModelRepo modelRepo;

  @Resource
  private ModelCallRecordQuery modelCallRecordQuery;

  private static final int DEFAULT_MONTHS = 1; // 默认统计近一月

  @NameJoin
  @Override
  public ModelDetailVo create(ModelCreateDto dto) {
    Model model = ModelAssembler.toDomain(dto);
    Model saved = modelCmd.create(model);
    return ModelAssembler.toDetailVo(saved);
  }

  @NameJoin
  @Override
  public ModelDetailVo update(Long id, ModelUpdateDto dto) {
    Model model = ModelAssembler.updateDomain(id, dto);
    Model saved = modelCmd.update(model);
    return ModelAssembler.toDetailVo(saved);
  }

  @NameJoin
  @Override
  public ModelDetailVo updateConfig(Long id, ModelConfig config) {
    Model saved = modelCmd.updateConfig(id, config);
    return ModelAssembler.toDetailVo(saved);
  }

  @NameJoin
  @Override
  public ModelDetailVo start(Long id) {
    Model saved = modelCmd.start(id);
    return ModelAssembler.toDetailVo(saved);
  }

  @NameJoin
  @Override
  public ModelDetailVo stop(Long id, Boolean graceful) {
    Model saved = modelCmd.stop(id, graceful);
    return ModelAssembler.toDetailVo(saved);
  }

  @NameJoin
  @Override
  public ModelDetailVo restart(Long id) {
    Model saved = modelCmd.restart(id);
    return ModelAssembler.toDetailVo(saved);
  }

  @NameJoin
  @Override
  public ModelDetailVo test(Long id, ModelTestDto dto) {
    Model saved = modelCmd.test(id, dto.getTestPrompt());
    return ModelAssembler.toDetailVo(saved);
  }

  @Override
  public void delete(Long id) {
    modelCmd.delete(id);
  }

  @NameJoin
  @Override
  public ModelDetailVo getDetail(Long id) {
    Model model = modelQuery.findAndCheck(id);
    return ModelAssembler.toDetailVo(model);
  }

  @NameJoin
  @Override
  public PageResult<ModelListVo> list(ModelFindDto dto) {
    GenericSpecification<Model> spec = ModelAssembler.getSpecification(dto);
    Page<Model> page = modelQuery.find(spec, dto.tranPage(), dto.fullTextSearch,
        getMatchSearchFields(dto.getClass()));
    return buildVoPageResult(page, ModelAssembler::toListVo);
  }

  /**
   * 获取模型统计信息
   *
   * @param dto 统计参数
   * @return 统计信息VO
   */
  @Override
  public ModelStatisticsVo getStatistics(SimpleStatisticsDto dto) {
    LocalDateTime now = LocalDateTime.now();
    LocalDate today = now.toLocalDate();
    LocalDateTime todayStart = today.atStartOfDay();

    // 解析用户指定的时间范围
    LocalDateTime start = parseStartDate(dto != null ? dto.getStartDate() : null);
    LocalDateTime end = parseEndDate(dto != null ? dto.getEndDate() : null);

    // 如果开始时间为默认值（1970），则使用近一月作为默认范围
    if (start.equals(LocalDateTime.of(1970, 1, 1, 0, 0))) {
      start = now.minusMonths(DEFAULT_MONTHS).toLocalDate().atStartOfDay();
    }

    // 近一月时间范围（用于lastMonthGrowthTrend，固定使用近一月数据）
    LocalDateTime oneMonthAgoStart = now.minusMonths(DEFAULT_MONTHS).toLocalDate().atStartOfDay();

    ModelStatisticsVo vo = new ModelStatisticsVo();

    // 总体统计（使用用户指定的时间范围）
    buildOverview(vo, start, end);

    // 近一月趋势（固定使用近一月数据，不受dto时间范围影响）
    buildLastMonthTrend(vo, oneMonthAgoStart, now);

    // 今天趋势（固定使用今天数据）
    buildTodayTrend(vo, todayStart, now);
    return vo;
  }

  /**
   * 构建总体统计概览
   */
  private void buildOverview(ModelStatisticsVo vo, LocalDateTime start, LocalDateTime end) {
    // 构建时间范围过滤器
    Set<SearchCriteria> callFilters = SearchCriteria.criteria();
    if (start != null && end != null) {
      callFilters = SearchCriteria.merge(callFilters,
          SearchCriteria.greaterThanEqual("createdDate", start),
          SearchCriteria.lessThanEqual("createdDate", end));
    }

    // 总模型数（不按时间过滤）
    long totalModels = modelRepo.countAllByFilters(SearchCriteria.criteria());
    vo.setTotalModels(totalModels);

    // 运行中的模型数（不按时间过滤）
    Set<SearchCriteria> runningFilters = SearchCriteria.merge(SearchCriteria.criteria(),
        SearchCriteria.equal("status", ModelStatus.RUNNING.getValue()));
    long runningModels = modelRepo.countAllByFilters(runningFilters);
    vo.setRunningModels(runningModels);

    // 总调用次数（时间范围内）
    long totalCalls = modelCallRecordQuery.countAllByFilters(callFilters);
    vo.setTotalCalls(totalCalls);

    // 成功/失败调用次数
    long successCalls = modelCallRecordQuery.countAllByFilters(
        SearchCriteria.merge(callFilters, SearchCriteria.equal("success", true)));
    long failedCalls = modelCallRecordQuery.countAllByFilters(
        SearchCriteria.merge(callFilters, SearchCriteria.equal("success", false)));
    vo.setSuccessfulCalls(successCalls);
    vo.setFailedCalls(failedCalls);

    // Tokens sum
    LongTotalView tokensView = modelCallRecordQuery.sumByFilters(
        ModelCallRecord.class, LongTotalView.class, callFilters, "tokens");
    long totalTokens =
        (tokensView == null || tokensView.getTotal() == null) ? 0L : tokensView.getTotal();
    vo.setTotalTokensConsumed(totalTokens);

    // Cost sum (double)
    DoubleTotalView costView = modelCallRecordQuery.sumByFilters(
        ModelCallRecord.class, DoubleTotalView.class, callFilters, "cost");
    double totalCost =
        (costView == null || costView.getTotal() == null) ? 0.0 : costView.getTotal();
    vo.setTotalCost(totalCost);

    // Success rate
    if (totalCalls > 0) {
      vo.setSuccessRate((double) successCalls * 100.0 / (double) totalCalls);
    } else {
      vo.setSuccessRate(0.0);
    }

    // Average latency: sum(responseTimeMs) / totalCalls
    DoubleTotalView rtSum = modelCallRecordQuery.sumByFilters(
        ModelCallRecord.class, DoubleTotalView.class, callFilters, "responseTimeMs");
    double avgLatency = 0.0;
    if (totalCalls > 0 && rtSum != null && rtSum.getTotal() != null) {
      avgLatency = rtSum.getTotal() / (double) totalCalls;
    }
    vo.setAverageLatencyMs(avgLatency);
  }

  /**
   * 构建近一月增长趋势
   */
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

    // 计算平均延迟
    DoubleTotalView rtSum = modelCallRecordQuery.sumByFilters(
        ModelCallRecord.class, DoubleTotalView.class, callFilters, "responseTimeMs");
    if (callsLast30 > 0 && rtSum != null && rtSum.getTotal() != null) {
      lm.setAverageLatencyMs(rtSum.getTotal() / (double) callsLast30);
    }

    vo.setLastMonthGrowthTrend(lm);
  }

  /**
   * 构建今天增长趋势
   */
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

    // 计算平均延迟
    DoubleTotalView rtSum = modelCallRecordQuery.sumByFilters(
        ModelCallRecord.class, DoubleTotalView.class, callFilters, "responseTimeMs");
    if (callsToday > 0 && rtSum != null && rtSum.getTotal() != null) {
      today.setAverageLatencyMs(rtSum.getTotal() / (double) callsToday);
    }
    vo.setTodayGrowthTrend(today);
  }

  // Simple projection for double sums
  @Getter
  public static class DoubleTotalView {

    private final Double total;

    public DoubleTotalView(Double total) {
      this.total = total;
    }
  }

}
