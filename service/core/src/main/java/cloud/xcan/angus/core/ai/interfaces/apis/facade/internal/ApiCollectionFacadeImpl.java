package cloud.xcan.angus.core.ai.interfaces.apis.facade.internal;

import static cloud.xcan.angus.core.ai.infra.util.TimeRangeUtils.DATE_FMT;
import static cloud.xcan.angus.core.ai.infra.util.TimeRangeUtils.parseEndDate;
import static cloud.xcan.angus.core.ai.infra.util.TimeRangeUtils.parseStartDate;
import static cloud.xcan.angus.core.jpa.criteria.SearchCriteriaBuilder.getMatchSearchFields;
import static cloud.xcan.angus.core.utils.CoreUtils.buildVoPageResult;

import cloud.xcan.angus.core.ai.application.cmd.apis.ApiCollectionCmd;
import cloud.xcan.angus.core.ai.application.query.apis.ApiCollectionQuery;
import cloud.xcan.angus.core.ai.application.query.apis.ApiEndpointCallLogQuery;
import cloud.xcan.angus.core.ai.application.query.apis.ApiEndpointQuery;
import cloud.xcan.angus.core.ai.domain.apis.ApiCollection;
import cloud.xcan.angus.core.ai.domain.apis.ApiEndpoint;
import cloud.xcan.angus.core.ai.interfaces.apis.facade.ApiCollectionFacade;
import cloud.xcan.angus.core.ai.interfaces.apis.facade.dto.ApiCollectionCreateDto;
import cloud.xcan.angus.core.ai.interfaces.apis.facade.dto.ApiCollectionFindDto;
import cloud.xcan.angus.core.ai.interfaces.apis.facade.dto.ApiCollectionImportDto;
import cloud.xcan.angus.core.ai.interfaces.apis.facade.dto.ApiCollectionUpdateDto;
import cloud.xcan.angus.core.ai.interfaces.apis.facade.internal.assembler.ApiCollectionAssembler;
import cloud.xcan.angus.core.ai.interfaces.apis.facade.vo.ApiCollectionDetailVo;
import cloud.xcan.angus.core.ai.interfaces.apis.facade.vo.ApiCollectionImportVo;
import cloud.xcan.angus.core.ai.interfaces.apis.facade.vo.ApiCollectionListVo;
import cloud.xcan.angus.core.ai.interfaces.apis.facade.vo.ApiCollectionStatisticsVo;
import cloud.xcan.angus.core.biz.NameJoin;
import cloud.xcan.angus.core.jpa.criteria.GenericSpecification;
import cloud.xcan.angus.remote.PageResult;
import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpServletResponse;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

/**
 * 接口集门面服务实现
 */
@Component
public class ApiCollectionFacadeImpl implements ApiCollectionFacade {

  @Resource
  private ApiCollectionCmd apiCollectionCmd;

  @Resource
  private ApiCollectionQuery apiCollectionQuery;

  @Resource
  private ApiEndpointQuery apiEndpointQuery;

  @Resource
  private ApiEndpointCallLogQuery apiEndpointCallLogQuery;

  private static final int TOP_N = 10;
  private static final int DEFAULT_MONTHS = 1; // 默认统计近一月

  @NameJoin
  @Override
  public ApiCollectionDetailVo create(ApiCollectionCreateDto dto) {
    ApiCollection collection = ApiCollectionAssembler.toCreateDomain(dto);
    ApiCollection saved = apiCollectionCmd.create(collection);
    return ApiCollectionAssembler.toVo(saved);
  }

  @NameJoin
  @Override
  public ApiCollectionDetailVo update(Long id, ApiCollectionUpdateDto dto) {
    ApiCollection collection = ApiCollectionAssembler.toUpdateDomain(id, dto);
    ApiCollection saved = apiCollectionCmd.update(collection);
    return ApiCollectionAssembler.toVo(saved);
  }

  @Override
  public void delete(Long id, Boolean force) {
    apiCollectionCmd.delete(id, force != null ? force : false);
  }

  @NameJoin
  @Override
  public ApiCollectionDetailVo getDetail(Long id) {
    ApiCollection collection = apiCollectionQuery.findAndCheck(id);

    // 设置统计信息
    Long endpointsCount = apiEndpointQuery.countEndpointsByCollectionId(id);
    Long enabledCount = apiEndpointQuery.countEnabledEndpointsByCollectionId(id);
    collection.setEndpointsCount(endpointsCount);
    collection.setEnabledEndpointsCount(enabledCount);
    return ApiCollectionAssembler.toVo(collection);
  }

  @NameJoin
  @Override
  public PageResult<ApiCollectionListVo> list(ApiCollectionFindDto dto) {
    GenericSpecification<ApiCollection> spec = ApiCollectionAssembler.getSpecification(dto);
    Page<ApiCollection> page = apiCollectionQuery.find(spec, dto.tranPage(),
        dto.fullTextSearch, getMatchSearchFields(dto.getClass()));

    // 批量查询统计信息
    List<ApiCollection> collections = page.getContent();
    if (!collections.isEmpty()) {
      List<Long> collectionIds = collections.stream()
          .map(ApiCollection::getId)
          .collect(Collectors.toList());

      Map<Long, Long> endpointsCountMap = apiEndpointQuery.countEndpointsByCollectionIds(collectionIds);
      Map<Long, Long> enabledEndpointsCountMap = apiEndpointQuery.countEnabledEndpointsByCollectionIds(collectionIds);

      collections.forEach(collection -> {
        Long endpointsCount = endpointsCountMap.getOrDefault(collection.getId(), 0L);
        Long enabledCount = enabledEndpointsCountMap.getOrDefault(collection.getId(), 0L);
        collection.setEndpointsCount(endpointsCount);
        collection.setEnabledEndpointsCount(enabledCount);
      });
    }
    return buildVoPageResult(page, ApiCollectionAssembler::toListVo);
  }

  /**
   * 获取接口集统计信息
   *
   * @param dto 统计参数，注意：接口定义中参数类型可能有误，实际应该使用 ActivityStatisticsDto
   * @return 统计信息VO
   */
  @Override
  public ApiCollectionStatisticsVo getStatistics(ApiCollectionStatisticsVo dto) {
    LocalDateTime now = LocalDateTime.now();
    LocalDate today = now.toLocalDate();
    LocalDateTime todayStart = today.atStartOfDay();
    LocalDateTime todayEnd = today.atTime(LocalTime.MAX);

    // 解析用户指定的时间范围，用于topStores和performanceTrend
    // 由于接口定义问题，暂时使用默认值（近一月）
    LocalDateTime start = parseStartDate(null);
    LocalDateTime end = parseEndDate(null);

    // 如果开始时间为默认值（1970），则使用近一月作为默认范围
    if (start.equals(LocalDateTime.of(1970, 1, 1, 0, 0))) {
      start = now.minusMonths(DEFAULT_MONTHS).toLocalDate().atStartOfDay();
    }

    // 近一月时间范围（用于lastMonthGrowthTrend）
    LocalDateTime oneMonthAgoStart = now.minusMonths(DEFAULT_MONTHS).toLocalDate().atStartOfDay();

    ApiCollectionStatisticsVo vo = new ApiCollectionStatisticsVo();

    // 总体统计（今日数据）
    ApiCollectionStatisticsVo.Overview overview = buildOverview(todayStart, todayEnd);
    vo.setOverview(overview);

    // 近一月趋势（固定使用近一月数据）
    ApiCollectionStatisticsVo.Overview lastMonthTrend = buildOverview(oneMonthAgoStart, now);
    vo.setLastMonthGrowthTrend(lastMonthTrend);

    // 使用率排行（使用用户指定的时间范围）
    vo.setTopStores(buildTopStores(start, end));

    // 性能趋势（使用用户指定的时间范围）
    vo.setPerformanceTrend(buildPerformanceTrend(start, end));
    return vo;
  }

  /**
   * 构建总体统计概览
   */
  private ApiCollectionStatisticsVo.Overview buildOverview(LocalDateTime start, LocalDateTime end) {
    ApiCollectionStatisticsVo.Overview overview = new ApiCollectionStatisticsVo.Overview();

    // 接口集总数
    Long apiCollectionCount = apiCollectionQuery.countTotalCollections();
    overview.setApiCollectionCount(apiCollectionCount != null ? apiCollectionCount.intValue() : 0);

    // 接口总数
    Long apiTotalCount = apiEndpointQuery.countTotalEndpoints();
    overview.setApiTotalCount(apiTotalCount != null ? apiTotalCount.intValue() : 0);

    // 已启用接口总数
    Long enabledCount = apiEndpointQuery.countTotalEnabledEndpoints();
    overview.setEnabledApiCount(enabledCount != null ? enabledCount.intValue() : 0);

    // 总调用次数（时间范围内的所有调用）
    Long totalCallCount = apiEndpointCallLogQuery.countByTimeRange(start, end);
    overview.setTotalCallCount(totalCallCount != null ? totalCallCount.intValue() : 0);

    // 今日调用次数
    LocalDate today = LocalDate.now();
    LocalDateTime todayStart = today.atStartOfDay();
    LocalDateTime todayEnd = today.atTime(LocalTime.MAX);
    Long todayCallCount = apiEndpointCallLogQuery.countByTimeRange(todayStart, todayEnd);
    overview.setTodayCallCount(todayCallCount != null ? todayCallCount.intValue() : 0);

    return overview;
  }

  /**
   * 构建使用率排行
   * 优化：批量查询端点，避免N+1查询问题
   */
  private List<ApiCollectionStatisticsVo.TopStore> buildTopStores(LocalDateTime start, LocalDateTime end) {
    // 获取调用次数和平均响应时间数据（按端点分组，TOP N）
    // 返回格式：[0]=endpointId, [1]=count, [2]=avgResponseTime
    List<Object[]> callCountRows = apiEndpointCallLogQuery.getTopEndpointsByCallCount(start, end, TOP_N);

    if (callCountRows == null || callCountRows.isEmpty()) {
      return new ArrayList<>();
    }

    // 提取端点ID列表
    List<Long> endpointIds = new ArrayList<>();
    Map<Long, Long> callCountMap = new HashMap<>();
    Map<Long, Long> avgResponseTimeMap = new HashMap<>();

    for (Object[] r : callCountRows) {
      Long endpointId = r[0] == null ? null : ((Number) r[0]).longValue();
      Long count = r[1] == null ? 0L : ((Number) r[1]).longValue();
      Double avgTime = r[2] == null ? null : ((Number) r[2]).doubleValue();

      if (endpointId != null) {
        endpointIds.add(endpointId);
        callCountMap.put(endpointId, count);
        if (avgTime != null) {
          avgResponseTimeMap.put(endpointId, avgTime.longValue());
        }
      }
    }

    // 批量查询端点详情，避免循环查询数据库
    Map<Long, ApiEndpoint> endpointMap = apiEndpointQuery.findByIds(endpointIds);

    // 构建TopStore列表
    List<ApiCollectionStatisticsVo.TopStore> topStores = new ArrayList<>();
    for (Long endpointId : endpointIds) {
      ApiEndpoint endpoint = endpointMap.get(endpointId);
      if (endpoint == null) {
        continue; // 端点不存在，跳过
      }

      ApiCollectionStatisticsVo.TopStore topStore = new ApiCollectionStatisticsVo.TopStore();
      topStore.setId(endpointId);
      topStore.setName(endpoint.getName());
      topStore.setType(endpoint.getMethod());
      topStore.setCallCount(callCountMap.get(endpointId));
      topStore.setAvgResponseTime(avgResponseTimeMap.getOrDefault(endpointId, 0L));
      topStores.add(topStore);
    }
    return topStores;
  }

  /**
   * 构建性能趋势
   */
  private List<ApiCollectionStatisticsVo.PerformanceTrend> buildPerformanceTrend(LocalDateTime start, LocalDateTime end) {
    List<Object[]> rows = apiEndpointCallLogQuery.getPerformanceTrendByDay(start, end);
    List<ApiCollectionStatisticsVo.PerformanceTrend> trends = new ArrayList<>();
    if (rows == null) {
      return trends;
    }

    for (Object[] r : rows) {
      ApiCollectionStatisticsVo.PerformanceTrend t = new ApiCollectionStatisticsVo.PerformanceTrend();
      String date = Objects.toString(r[0], null);
      t.setDate(date);
      try {
        LocalDateTime dt = LocalDate.parse(date, DATE_FMT).atStartOfDay();
        long ts = dt.atZone(ZoneId.systemDefault()).toInstant().toEpochMilli();
        t.setTimestamp(ts);
      } catch (Exception e) {
        t.setTimestamp(null);
      }

      long totalCalls = r[1] == null ? 0L : ((Number) r[1]).longValue();
      Double avgResponseTime = r[2] == null ? null : ((Number) r[2]).doubleValue();
      long errors = r[3] == null ? 0L : ((Number) r[3]).longValue();

      t.setTotalCalls(totalCalls);
      t.setAvgResponseTime(avgResponseTime != null ? avgResponseTime.longValue() : 0L);
      t.setErrors(errors);
      double errorRate = totalCalls == 0 ? 0.0 : (errors * 100.0 / totalCalls);
      t.setErrorRate(errorRate);
      trends.add(t);
    }
    return trends;
  }

  @Override
  public ApiCollectionImportVo importCollection(ApiCollectionImportDto dto) {
    ApiCollection collection = apiCollectionCmd.importCollection(dto);
    // TODO
    ApiCollectionImportVo vo = new ApiCollectionImportVo();
    return vo;
  }

  @Override
  public ResponseEntity<org.springframework.core.io.Resource> exportOpenApi(Long id,
      String format, Boolean includeDisabled, HttpServletResponse response) {
    return null; // TODO
  }
}

