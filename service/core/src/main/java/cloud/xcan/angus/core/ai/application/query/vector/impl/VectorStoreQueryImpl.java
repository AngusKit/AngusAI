package cloud.xcan.angus.core.ai.application.query.vector.impl;

import static cloud.xcan.angus.core.ai.infra.util.TimeRangeUtils.DATE_FMT;
import static cloud.xcan.angus.core.ai.infra.util.TimeRangeUtils.parseEndDate;
import static cloud.xcan.angus.core.ai.infra.util.TimeRangeUtils.parseStartDate;

import cloud.xcan.agentx.core.vectorstore.VectorStoreType;
import cloud.xcan.angus.core.ai.application.query.vector.VectorStoreQuery;
import cloud.xcan.angus.core.ai.domain.ConnectionStatus;
import cloud.xcan.angus.core.ai.domain.vector.VectorStore;
import cloud.xcan.angus.core.ai.domain.vector.VectorStoreAccessLogRepo;
import cloud.xcan.angus.core.ai.domain.vector.VectorStoreRepo;
import cloud.xcan.angus.core.ai.domain.vector.VectorStoreSearchRepo;
import cloud.xcan.angus.core.ai.interfaces.vector.facade.vo.VectorStoreStatisticsVo;
import cloud.xcan.angus.core.biz.BizTemplate;
import cloud.xcan.angus.core.jpa.criteria.GenericSpecification;
import cloud.xcan.angus.remote.dto.SimpleStatisticsDto;
import cloud.xcan.angus.remote.message.http.ResourceNotFound;
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
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

/**
 * 向量存储源查询服务实现
 */
@Service
public class VectorStoreQueryImpl implements VectorStoreQuery {

  @Resource
  private VectorStoreRepo vectorStoreRepo;

  @Resource
  private VectorStoreSearchRepo vectorStoreSearchRepo;

  @Resource
  private VectorStoreAccessLogRepo vectorStoreAccessLogRepo;

  private static final int TOP_N = 10;
  private static final int DEFAULT_MONTHS = 1;

  @Override
  public VectorStore findAndCheck(Long id) {
    return new BizTemplate<VectorStore>() {
      @Override
      protected VectorStore process() {
        return vectorStoreRepo.findById(id)
            .orElseThrow(() -> ResourceNotFound.of("存储源未找到", new Object[]{}));
      }
    }.execute();
  }

  @Override
  public Page<VectorStore> find(GenericSpecification<VectorStore> spec, Pageable pageable,
      boolean fullTextSearch, String[] match) {
    return new BizTemplate<Page<VectorStore>>() {
      @Override
      protected Page<VectorStore> process() {
        return fullTextSearch
            ? vectorStoreSearchRepo.find(spec.getCriteria(), pageable, VectorStore.class, match)
            : vectorStoreRepo.findAll(spec, pageable);
      }
    }.execute();
  }

  @Override
  public VectorStoreStatisticsVo getStatistics(SimpleStatisticsDto dto) {
    LocalDateTime now = LocalDateTime.now();
    LocalDate today = now.toLocalDate();
    LocalDateTime todayStart = today.atStartOfDay();
    LocalDateTime todayEnd = today.atTime(LocalTime.MAX);

    LocalDateTime start = parseStartDate(dto != null ? dto.getStartDate() : null);
    LocalDateTime end = parseEndDate(dto != null ? dto.getEndDate() : null);

    if (start.equals(LocalDateTime.of(1970, 1, 1, 0, 0))) {
      start = now.minusMonths(DEFAULT_MONTHS).toLocalDate().atStartOfDay();
    }

    LocalDateTime oneMonthAgoStart = now.minusMonths(DEFAULT_MONTHS).toLocalDate().atStartOfDay();

    VectorStoreStatisticsVo vo = new VectorStoreStatisticsVo();
    vo.setOverview(buildOverview(todayStart, todayEnd));
    vo.setLastMonthGrowthTrend(buildOverview(oneMonthAgoStart, now));
    vo.setTypeDistribution(buildTypeDistribution());
    vo.setTopStores(buildTopStores(start, end));
    vo.setPerformanceTrend(buildPerformanceTrend(start, end));
    return vo;
  }

  private VectorStoreStatisticsVo.Overview buildOverview(LocalDateTime start, LocalDateTime end) {
    VectorStoreStatisticsVo.Overview overview = new VectorStoreStatisticsVo.Overview();
    overview.setTotalStores(vectorStoreRepo.count());
    overview.setConnectedStores(vectorStoreRepo.countByStatus(ConnectionStatus.CONNECTED.name()));
    overview.setTotalVectors(0L); // TODO
    overview.setTodayQueries(vectorStoreAccessLogRepo.countByQueryDateBetween(start, end));
    return overview;
  }

  private List<VectorStoreStatisticsVo.TypeDistribution> buildTypeDistribution() {
    List<Object[]> rows = vectorStoreRepo.countGroupByType();
    List<VectorStoreStatisticsVo.TypeDistribution> list = new ArrayList<>();
    if (rows == null || rows.isEmpty()) {
      return list;
    }
    long total = vectorStoreRepo.count();
    for (Object[] r : rows) {
      String typeStr = Objects.toString(r[0], null);
      if (typeStr == null || typeStr.isBlank()) {
        continue;
      }
      VectorStoreType vectorStoreType = VectorStoreType.fromKey(typeStr);
      if (vectorStoreType == null) {
        continue;
      }
      VectorStoreStatisticsVo.TypeDistribution d = new VectorStoreStatisticsVo.TypeDistribution();
      d.setType(vectorStoreType);
      d.setCount(r[1] == null ? 0L : ((Number) r[1]).longValue());
      d.setPercentage(total == 0 ? 0.0 : (d.getCount() * 100.0 / total));
      list.add(d);
    }
    return list;
  }

  private List<VectorStoreStatisticsVo.TopStore> buildTopStores(LocalDateTime start,
      LocalDateTime end) {
    List<Object[]> queryCountRows = vectorStoreAccessLogRepo.topStoresByQueryCount(start, end,
        TOP_N);
    List<Object[]> avgResponseTimeRows = vectorStoreAccessLogRepo.avgResponseTimeByStore(start,
        end);

    if (queryCountRows == null || queryCountRows.isEmpty()) {
      return new ArrayList<>();
    }

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

    List<Long> storeIds = new ArrayList<>(queryCountMap.keySet());
    List<VectorStore> stores = vectorStoreRepo.findAllById(storeIds);
    Map<Long, VectorStore> storeMap = new HashMap<>();
    for (VectorStore store : stores) {
      storeMap.put(store.getId(), store);
    }

    List<VectorStoreStatisticsVo.TopStore> topStores = new ArrayList<>();
    for (Long storeId : storeIds) {
      VectorStore store = storeMap.get(storeId);
      if (store == null) {
        continue;
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

  private List<VectorStoreStatisticsVo.PerformanceTrend> buildPerformanceTrend(LocalDateTime start,
      LocalDateTime end) {
    List<Object[]> rows = vectorStoreAccessLogRepo.performanceTrendByDay(start, end);
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
      t.setErrorRate(totalQueries == 0 ? 0.0 : (errorCount * 100.0 / totalQueries));
      trends.add(t);
    }
    return trends;
  }

}
