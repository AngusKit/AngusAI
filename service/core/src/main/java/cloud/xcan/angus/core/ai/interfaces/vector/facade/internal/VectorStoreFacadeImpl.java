package cloud.xcan.angus.core.ai.interfaces.vector.facade.internal;

import static cloud.xcan.angus.core.ai.infra.util.TimeRangeUtils.DATE_FMT;
import static cloud.xcan.angus.core.ai.infra.util.TimeRangeUtils.parseEndDate;
import static cloud.xcan.angus.core.ai.infra.util.TimeRangeUtils.parseStartDate;
import static cloud.xcan.angus.core.jpa.criteria.SearchCriteriaBuilder.getMatchSearchFields;
import static cloud.xcan.angus.core.utils.CoreUtils.buildVoPageResult;

import cloud.xcan.angus.core.ai.application.query.vector.VectorStoreQuery;
import cloud.xcan.angus.core.ai.application.query.vector.impl.VectorStoreQueryImpl;
import cloud.xcan.angus.core.ai.application.cmd.vector.VectorStoreCmd;
import cloud.xcan.angus.core.ai.domain.vector.VectorStore;
import cloud.xcan.angus.core.ai.domain.vector.VectorStoreRepo;
import cloud.xcan.angus.core.ai.interfaces.team.facade.dto.ActivityStatisticsDto;
import cloud.xcan.angus.core.ai.interfaces.vector.facade.VectorStoreFacade;
import cloud.xcan.angus.core.ai.interfaces.vector.facade.dto.ConnectionTestDto;
import cloud.xcan.angus.core.ai.interfaces.vector.facade.dto.VectorStoreCreateDto;
import cloud.xcan.angus.core.ai.interfaces.vector.facade.dto.VectorStoreFindDto;
import cloud.xcan.angus.core.ai.interfaces.vector.facade.dto.VectorStoreUpdateDto;
import cloud.xcan.angus.core.ai.interfaces.vector.facade.internal.assembler.VectorStoreAssembler;
import cloud.xcan.angus.core.ai.interfaces.vector.facade.vo.ConnectionTestVo;
import cloud.xcan.angus.core.ai.interfaces.vector.facade.vo.VectorStoreStatisticsVo;
import cloud.xcan.angus.core.ai.interfaces.vector.facade.vo.VectorStoreVo;
import cloud.xcan.angus.core.ai.infra.ai.vector.VectorStoreType;
import cloud.xcan.angus.core.jpa.criteria.GenericSpecification;
import cloud.xcan.angus.remote.PageResult;
import jakarta.annotation.Resource;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;

/**
 * 向量存储源门面服务实现
 */
@Component
public class VectorStoreFacadeImpl implements VectorStoreFacade {

  @Resource
  private VectorStoreCmd vectorStoreCmd;

  @Resource
  private VectorStoreQuery vectorStoreQuery;

  @Resource
  private VectorStoreQueryImpl vectorStoreQueryImpl;

  @Resource
  private VectorStoreRepo vectorStoreRepo;

  private static final int TOP_N = 10;
  private static final int DEFAULT_MONTHS = 1; // 默认统计近一月

  @Override
  public VectorStoreVo create(VectorStoreCreateDto dto) {
    VectorStore vectorStore = VectorStoreAssembler.toCreateDomain(dto);
    VectorStore saved = vectorStoreCmd.create(vectorStore);
    return VectorStoreAssembler.toVo(saved);
  }

  @Override
  public VectorStoreVo update(Long id, VectorStoreUpdateDto dto) {
    VectorStore vectorStore = VectorStoreAssembler.toUpdateDomain(id, dto);
    VectorStore saved = vectorStoreCmd.update(vectorStore);
    return VectorStoreAssembler.toVo(saved);
  }

  @Override
  public VectorStoreVo toggleEnabled(Long id, Boolean enabled) {
    VectorStore saved = vectorStoreCmd.toggleEnabled(id, enabled);
    return VectorStoreAssembler.toVo(saved);
  }

  @Override
  public ConnectionTestVo testConnection(Long id, ConnectionTestDto dto) {
    VectorStore vectorStore = vectorStoreCmd.testConnection(id, dto.getTimeout(), dto.getConfig());
    return VectorStoreAssembler.toConnectionTestVo(vectorStore);
  }

  @Override
  public void delete(Long id, Boolean force) {
    vectorStoreCmd.delete(id, force != null ? force : false);
  }

  @Override
  public VectorStoreVo getDetail(Long id) {
    VectorStore vectorStore = vectorStoreQuery.findAndCheck(id);
    return VectorStoreAssembler.toVo(vectorStore);
  }

  @Override
  public PageResult<VectorStoreVo> list(VectorStoreFindDto dto) {
    GenericSpecification<VectorStore> spec = VectorStoreAssembler.getSpecification(dto);
    Page<VectorStore> page = vectorStoreQuery.find(spec, dto.tranPage(),
        dto.fullTextSearch, getMatchSearchFields(dto.getClass()));
    return buildVoPageResult(page, VectorStoreAssembler::toVo);
  }

  /**
   * 获取向量存储源统计信息
   *
   * @param dto 统计参数，包含可选的开始时间和结束时间
   * @return 统计信息VO
   */
  @Override
  public VectorStoreStatisticsVo getStatistics(ActivityStatisticsDto dto) {
    LocalDateTime now = LocalDateTime.now();
    LocalDate today = now.toLocalDate();
    LocalDateTime todayStart = today.atStartOfDay();
    LocalDateTime todayEnd = today.atTime(LocalTime.MAX);

    // 解析用户指定的时间范围，用于topStores和performanceTrend
    LocalDateTime start = parseStartDate(dto != null ? dto.getStartDate() : null);
    LocalDateTime end = parseEndDate(dto != null ? dto.getEndDate() : null);

    // 如果开始时间为默认值（1970），则使用近一月作为默认范围
    if (start.equals(LocalDateTime.of(1970, 1, 1, 0, 0))) {
      start = now.minusMonths(DEFAULT_MONTHS).toLocalDate().atStartOfDay();
    }

    // 近一月时间范围（用于lastMonthGrowthTrend）
    LocalDateTime oneMonthAgoStart = now.minusMonths(DEFAULT_MONTHS).toLocalDate().atStartOfDay();

    VectorStoreStatisticsVo vo = new VectorStoreStatisticsVo();

    // 总体统计（今日数据）
    VectorStoreStatisticsVo.Overview overview = buildOverview(todayStart, todayEnd);
    vo.setOverview(overview);

    // 近一月趋势（固定使用近一月数据）
    VectorStoreStatisticsVo.Overview lastMonthTrend = buildOverview(oneMonthAgoStart, now);
    vo.setLastMonthGrowthTrend(lastMonthTrend);

    // 类型分布
    vo.setTypeDistribution(buildTypeDistribution());

    // 使用率排行（使用用户指定的时间范围）
    vo.setTopStores(buildTopStores(start, end));

    // 性能趋势（使用用户指定的时间范围）
    vo.setPerformanceTrend(buildPerformanceTrend(start, end));

    return vo;
  }

  /**
   * 构建总体统计概览
   */
  private VectorStoreStatisticsVo.Overview buildOverview(LocalDateTime start, LocalDateTime end) {
    VectorStoreStatisticsVo.Overview overview = new VectorStoreStatisticsVo.Overview();
    overview.setTotalStores(vectorStoreQueryImpl.countTotalStores());
    overview.setConnectedStores(vectorStoreQueryImpl.countConnectedStores());
    overview.setTotalVectors(0L); // TODO: 从向量数据统计，需要其他数据源
    overview.setTodayQueries(vectorStoreQueryImpl.countQueriesByDateRange(start, end));
    return overview;
  }

  /**
   * 构建类型分布
   */
  private List<VectorStoreStatisticsVo.TypeDistribution> buildTypeDistribution() {
    List<Object[]> rows = vectorStoreQueryImpl.countGroupByType();
    List<VectorStoreStatisticsVo.TypeDistribution> list = new ArrayList<>();
    if (rows == null || rows.isEmpty()) {
      return list;
    }

    long total = vectorStoreQueryImpl.countTotalStores();
    for (Object[] r : rows) {
      VectorStoreStatisticsVo.TypeDistribution d = new VectorStoreStatisticsVo.TypeDistribution();
      String typeStr = Objects.toString(r[0], null);
      try {
        d.setType(VectorStoreType.valueOf(typeStr));
      } catch (Exception e) {
        continue; // 跳过无效类型
      }
      d.setCount(r[1] == null ? 0L : ((Number) r[1]).longValue());
      d.setPercentage(total == 0 ? 0.0 : (d.getCount() * 100.0 / total));
      list.add(d);
    }
    return list;
  }

  /**
   * 构建使用率排行
   * 优化：批量查询存储源，避免N+1查询问题
   */
  private List<VectorStoreStatisticsVo.TopStore> buildTopStores(LocalDateTime start, LocalDateTime end) {
    // 获取查询次数和平均响应时间数据
    List<Object[]> queryCountRows = vectorStoreQueryImpl.getTopStoresByQueryCount(start, end, TOP_N);
    List<Object[]> avgResponseTimeRows = vectorStoreQueryImpl.getAvgResponseTimeByStore(start, end);

    if (queryCountRows == null || queryCountRows.isEmpty()) {
      return new ArrayList<>();
    }

    // 构建查询次数Map和平均响应时间Map
    Map<Long, Long> queryCountMap = new HashMap<>();
    for (Object[] r : queryCountRows) {
      Long storeId = r[0] == null ? null : ((Number) r[0]).longValue();
      Long count = r[1] == null ? 0L : ((Number) r[1]).longValue();
      if (storeId != null) {
        queryCountMap.put(storeId, count);
      }
    }

    Map<Long, Long> avgResponseTimeMap = new HashMap<>();
    for (Object[] r : avgResponseTimeRows) {
      Long storeId = r[0] == null ? null : ((Number) r[0]).longValue();
      Double avgTime = r[1] == null ? null : ((Number) r[1]).doubleValue();
      if (storeId != null && avgTime != null) {
        avgResponseTimeMap.put(storeId, avgTime.longValue());
      }
    }

    // 批量查询存储源详情，避免循环查询数据库
    List<Long> storeIds = new ArrayList<>(queryCountMap.keySet());
    List<VectorStore> stores = vectorStoreRepo.findAllById(storeIds);
    Map<Long, VectorStore> storeMap = new HashMap<>();
    for (VectorStore store : stores) {
      storeMap.put(store.getId(), store);
    }

    // 构建TopStore列表
    List<VectorStoreStatisticsVo.TopStore> topStores = new ArrayList<>();
    for (Long storeId : storeIds) {
      VectorStore store = storeMap.get(storeId);
      if (store == null) {
        continue; // 存储源不存在，跳过
      }

      VectorStoreStatisticsVo.TopStore topStore = new VectorStoreStatisticsVo.TopStore();
      topStore.setId(storeId);
      topStore.setName(store.getName());
      topStore.setType(store.getType());
      topStore.setQueryCount(queryCountMap.get(storeId));
      topStore.setIndexCount(store.getIndexCount() != null ? store.getIndexCount() : 0L);
      topStore.setAvgResponseTime(avgResponseTimeMap.getOrDefault(storeId, 0L));
      topStores.add(topStore);
    }
    return topStores;
  }

  /**
   * 构建性能趋势
   */
  private List<VectorStoreStatisticsVo.PerformanceTrend> buildPerformanceTrend(LocalDateTime start, LocalDateTime end) {
    List<Object[]> rows = vectorStoreQueryImpl.getPerformanceTrendByDay(start, end);
    List<VectorStoreStatisticsVo.PerformanceTrend> trends = new ArrayList<>();
    if (rows == null) {
      return trends;
    }

    for (Object[] r : rows) {
      VectorStoreStatisticsVo.PerformanceTrend t = new VectorStoreStatisticsVo.PerformanceTrend();
      String date = Objects.toString(r[0], null);
      t.setDate(date);
      try {
        LocalDateTime dt = LocalDate.parse(date, DATE_FMT).atStartOfDay();
        long ts = dt.atZone(ZoneId.systemDefault()).toInstant().toEpochMilli();
        t.setTimestamp(ts);
      } catch (Exception e) {
        t.setTimestamp(null);
      }

      long totalQueries = r[1] == null ? 0L : ((Number) r[1]).longValue();
      Double avgResponseTime = r[2] == null ? null : ((Number) r[2]).doubleValue();
      long errorCount = r[3] == null ? 0L : ((Number) r[3]).longValue();

      t.setTotalQueries(totalQueries);
      t.setAvgResponseTime(avgResponseTime != null ? avgResponseTime.longValue() : 0L);
      double errorRate = totalQueries == 0 ? 0.0 : (errorCount * 100.0 / totalQueries);
      t.setErrorRate(errorRate);
      trends.add(t);
    }
    return trends;
  }
}
