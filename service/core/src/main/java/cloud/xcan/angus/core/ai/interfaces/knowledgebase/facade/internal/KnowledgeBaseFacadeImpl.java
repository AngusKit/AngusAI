package cloud.xcan.angus.core.ai.interfaces.knowledgebase.facade.internal;

import static cloud.xcan.angus.core.ai.infra.util.TimeRangeUtils.DATE_FMT;
import static cloud.xcan.angus.core.ai.infra.util.TimeRangeUtils.parseEndDate;
import static cloud.xcan.angus.core.ai.infra.util.TimeRangeUtils.parseStartDate;
import static cloud.xcan.angus.core.ai.infra.util.CommonUtils.formatFileSize;
import static cloud.xcan.angus.core.jpa.criteria.SearchCriteriaBuilder.getMatchSearchFields;
import static cloud.xcan.angus.core.utils.CoreUtils.buildVoPageResult;

import cloud.xcan.angus.core.ai.application.cmd.knowledgebase.KnowledgeBaseCmd;
import cloud.xcan.angus.core.ai.application.query.knowledgebase.KnowledgeBaseDocQuery;
import cloud.xcan.angus.core.ai.application.query.knowledgebase.KnowledgeBaseDocUsageLogQuery;
import cloud.xcan.angus.core.ai.application.query.knowledgebase.KnowledgeBaseQuery;
import cloud.xcan.angus.core.ai.domain.Visibility;
import cloud.xcan.angus.core.ai.domain.knowledgebase.KnowledgeBase;
import cloud.xcan.angus.core.ai.domain.knowledgebase.KnowledgeBaseDocChunkRepo;
import cloud.xcan.angus.core.ai.domain.knowledgebase.KnowledgeBaseDocRepo;
import cloud.xcan.angus.core.ai.interfaces.knowledgebase.facade.KnowledgeBaseFacade;
import cloud.xcan.angus.core.ai.interfaces.knowledgebase.facade.dto.KnowledgeBaseCreateDto;
import cloud.xcan.angus.core.ai.interfaces.knowledgebase.facade.dto.KnowledgeBaseFindDto;
import cloud.xcan.angus.core.ai.interfaces.knowledgebase.facade.dto.KnowledgeBaseToggleDto;
import cloud.xcan.angus.core.ai.interfaces.knowledgebase.facade.dto.KnowledgeBaseUpdateDto;
import cloud.xcan.angus.core.ai.interfaces.knowledgebase.facade.internal.assembler.KnowledgeBaseAssembler;
import cloud.xcan.angus.core.ai.interfaces.knowledgebase.facade.vo.KnowledgeBaseDetailVo;
import cloud.xcan.angus.core.ai.interfaces.knowledgebase.facade.vo.KnowledgeBaseListVo;
import cloud.xcan.angus.core.ai.interfaces.knowledgebase.facade.vo.KnowledgeBaseStatisticsVo;
import cloud.xcan.angus.core.biz.NameJoin;
import cloud.xcan.angus.core.jpa.criteria.GenericSpecification;
import cloud.xcan.angus.remote.PageResult;
import cloud.xcan.angus.remote.dto.SimpleStatisticsDto;
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

@Component
public class KnowledgeBaseFacadeImpl implements KnowledgeBaseFacade {

  @Resource
  private KnowledgeBaseCmd knowledgeBaseCmd;

  @Resource
  private KnowledgeBaseQuery knowledgeBaseQuery;

  @Resource
  private KnowledgeBaseDocUsageLogQuery knowledgeBaseDocUsageLogQuery;

  @Resource
  private KnowledgeBaseDocQuery knowledgeBaseDocQuery;

  private static final int TOP_N = 10;
  private static final int DEFAULT_MONTHS = 1; // 默认统计近一月

  @NameJoin
  @Override
  public KnowledgeBaseDetailVo create(KnowledgeBaseCreateDto dto) {
    KnowledgeBase knowledgeBase = KnowledgeBaseAssembler.toCreateDomain(dto);
    KnowledgeBase saved = knowledgeBaseCmd.create(knowledgeBase);
    return KnowledgeBaseAssembler.toDetailVo(saved);
  }

  @NameJoin
  @Override
  public KnowledgeBaseDetailVo update(Long id, KnowledgeBaseUpdateDto dto) {
    KnowledgeBase knowledgeBase = KnowledgeBaseAssembler.toUpdateDomain(id, dto);
    KnowledgeBase saved = knowledgeBaseCmd.update(knowledgeBase);
    return KnowledgeBaseAssembler.toDetailVo(saved);
  }

  @NameJoin
  @Override
  public KnowledgeBaseDetailVo toggle(Long id, KnowledgeBaseToggleDto dto) {
    KnowledgeBase knowledgeBase = knowledgeBaseCmd.toggle(id, dto.getEnabled());
    return KnowledgeBaseAssembler.toDetailVo(knowledgeBase);
  }

  @NameJoin
  @Override
  public KnowledgeBaseDetailVo modifyVisibility(Long id, Visibility visibility) {
    KnowledgeBase knowledgeBase = knowledgeBaseCmd.modifyVisibility(id, visibility);
    return KnowledgeBaseAssembler.toDetailVo(knowledgeBase);
  }

  @Override
  public void delete(Long id) {
    knowledgeBaseCmd.delete(id);
  }

  @NameJoin
  @Override
  public KnowledgeBaseDetailVo getDetail(Long id) {
    KnowledgeBase knowledgeBase = knowledgeBaseQuery.findAndCheck(id);
    return KnowledgeBaseAssembler.toDetailVo(knowledgeBase);
  }

  @NameJoin
  @Override
  public PageResult<KnowledgeBaseListVo> list(KnowledgeBaseFindDto dto) {
    GenericSpecification<KnowledgeBase> spec = KnowledgeBaseAssembler.getSpecification(dto);
    Page<KnowledgeBase> page = knowledgeBaseQuery.find(spec, dto.tranPage(),
        dto.fullTextSearch, getMatchSearchFields(dto.getClass()));
    return buildVoPageResult(page, KnowledgeBaseAssembler::toListVo);
  }

  /**
   * 获取知识库统计信息
   *
   * @param dto 统计参数
   * @return 统计信息VO
   */
  @Override
  public KnowledgeBaseStatisticsVo getStatistics(SimpleStatisticsDto dto) {
    LocalDateTime now = LocalDateTime.now();
    LocalDate today = now.toLocalDate();
    LocalDateTime todayStart = today.atStartOfDay();
    LocalDateTime todayEnd = today.atTime(LocalTime.MAX);

    // 解析用户指定的时间范围，用于topKnowledgeBases和queryTrend
    LocalDateTime start = parseStartDate(dto != null ? dto.getStartDate() : null);
    LocalDateTime end = parseEndDate(dto != null ? dto.getEndDate() : null);

    // 如果开始时间为默认值（1970），则使用近一月作为默认范围
    if (start.equals(LocalDateTime.of(1970, 1, 1, 0, 0))) {
      start = now.minusMonths(DEFAULT_MONTHS).toLocalDate().atStartOfDay();
    }

    // 近一月时间范围（用于lastMonthGrowthTrend，固定使用近一月数据）
    LocalDateTime oneMonthAgoStart = now.minusMonths(DEFAULT_MONTHS).toLocalDate().atStartOfDay();

    KnowledgeBaseStatisticsVo vo = new KnowledgeBaseStatisticsVo();

    // 总体统计（今日数据，但今日查询次数固定使用今日数据）
    KnowledgeBaseStatisticsVo.Overview overview = buildOverview(todayStart, todayEnd);
    vo.setOverview(overview);

    // 近一月趋势（固定使用近一月数据，不受dto时间范围影响）
    KnowledgeBaseStatisticsVo.Overview lastMonthTrend = buildOverview(oneMonthAgoStart, now);
    vo.setLastMonthGrowthTrend(lastMonthTrend);

    // 使用率排行（使用用户指定的时间范围）
    vo.setTopKnowledgeBases(buildTopKnowledgeBases(start, end));

    // 查询趋势（使用用户指定的时间范围）
    vo.setQueryTrend(buildQueryTrend(start, end));
    return vo;
  }

  /**
   * 构建总体统计概览
   */
  private KnowledgeBaseStatisticsVo.Overview buildOverview(LocalDateTime start,
      LocalDateTime end) {
    KnowledgeBaseStatisticsVo.Overview overview = new KnowledgeBaseStatisticsVo.Overview();

    // 总知识库数
    Long totalKnowledgeBases = knowledgeBaseQuery.countTotalKnowledgeBases();
    overview.setTotalKnowledgeBases(totalKnowledgeBases != null ? totalKnowledgeBases : 0L);

    // 活跃（被引用）知识库数
    Long activeKnowledgeBases = knowledgeBaseQuery.countActiveKnowledgeBases();
    overview.setActiveKnowledgeBases(activeKnowledgeBases != null ? activeKnowledgeBases : 0L);

    // 总文件数
    Long totalFiles = knowledgeBaseDocQuery.countTotalFiles();
    overview.setTotalFiles(totalFiles != null ? totalFiles : 0L);

    // 活跃（被引用）文件数
    Long activeFiles = knowledgeBaseDocQuery.countActiveFiles();
    overview.setActiveFiles(activeFiles != null ? activeFiles : 0L);

    // 总分段数
    Long totalChunks = knowledgeBaseDocQuery.countTotalChunks();
    overview.setTotalChunks(totalChunks != null ? totalChunks.intValue() : 0);

    // 平均分段大小
    Double avgChunkSize = knowledgeBaseDocQuery.getAvgChunkSize();
    overview.setAvgChunkSize(avgChunkSize != null ? avgChunkSize.intValue() : 0);

    // 总查询次数（时间范围内的所有查询）
    Long totalQueryCount = knowledgeBaseDocUsageLogQuery.countByTimeRange(start, end);
    overview.setTotalQueryCount(totalQueryCount != null ? totalQueryCount : 0L);

    // 今日查询次数（固定使用今日数据，不受时间范围影响）
    LocalDate today = LocalDate.now();
    LocalDateTime todayStart = today.atStartOfDay();
    LocalDateTime todayEnd = today.atTime(LocalTime.MAX);
    Long todayQueryCount = knowledgeBaseDocUsageLogQuery.countByTimeRange(todayStart, todayEnd);
    overview.setTodayQueryCount(todayQueryCount != null ? todayQueryCount : 0L);

    // 已使用存储空间大小
    Long usedStoreSize = knowledgeBaseDocQuery.sumTotalStoreSize();
    overview.setUsedStoreSize(formatFileSize(usedStoreSize != null ? usedStoreSize : 0L));

    // 授权的存储空间大小，自定义数据源返回空
    overview.setTotalStoreSize(null);

    // 已使用存储空间占比，自定义数据源返回空
    overview.setUsedStoreRate(null);

    return overview;
  }

  /**
   * 构建使用率排行 优化：批量查询知识库，避免N+1查询问题
   */
  private List<KnowledgeBaseStatisticsVo.TopKnowledgeBase> buildTopKnowledgeBases(
      LocalDateTime start, LocalDateTime end) {
    // 获取查询次数和平均响应时间数据（按知识库分组，TOP N）
    // 返回格式：[0]=knowledgeBaseId, [1]=count, [2]=avgResponseTime
    List<Object[]> queryCountRows = knowledgeBaseDocUsageLogQuery.getTopKnowledgeBasesByQueryCount(
        start, end, TOP_N);

    if (queryCountRows == null || queryCountRows.isEmpty()) {
      return new ArrayList<>();
    }

    // 提取知识库ID列表
    List<Long> knowledgeBaseIds = new ArrayList<>();
    Map<Long, Long> queryCountMap = new HashMap<>();

    for (Object[] r : queryCountRows) {
      Long knowledgeBaseId = r[0] == null ? null : ((Number) r[0]).longValue();
      Long count = r[1] == null ? 0L : ((Number) r[1]).longValue();
      Double avgTime = r[2] == null ? null : ((Number) r[2]).doubleValue();

      if (knowledgeBaseId != null) {
        knowledgeBaseIds.add(knowledgeBaseId);
        queryCountMap.put(knowledgeBaseId, count);
      }
    }

    // 批量查询知识库详情，避免循环查询数据库
    Map<Long, KnowledgeBase> knowledgeBaseMap = knowledgeBaseQuery.findByIds(knowledgeBaseIds);

    // 批量查询文件数和分段数，避免循环查询数据库
    Map<Long, Long> fileCountMap = new HashMap<>();
    Map<Long, Long> chunkCountMap = new HashMap<>();

    // 批量查询文件数
    List<Object[]> fileCountRows = knowledgeBaseDocQuery.countByKnowledgeBaseIds(knowledgeBaseIds);
    if (fileCountRows != null) {
      for (Object[] row : fileCountRows) {
        Long knowledgeBaseId = row[0] == null ? null : ((Number) row[0]).longValue();
        Long count = row[1] == null ? 0L : ((Number) row[1]).longValue();
        if (knowledgeBaseId != null) {
          fileCountMap.put(knowledgeBaseId, count);
        }
      }
    }

    // 批量查询分段数
    List<Object[]> chunkCountRows = knowledgeBaseDocQuery.countByKnowledgeBaseIds(
        knowledgeBaseIds);
    if (chunkCountRows != null) {
      for (Object[] row : chunkCountRows) {
        Long knowledgeBaseId = row[0] == null ? null : ((Number) row[0]).longValue();
        Long count = row[1] == null ? 0L : ((Number) row[1]).longValue();
        if (knowledgeBaseId != null) {
          chunkCountMap.put(knowledgeBaseId, count);
        }
      }
    }

    // 为没有数据的知识库设置默认值0
    for (Long knowledgeBaseId : knowledgeBaseIds) {
      fileCountMap.putIfAbsent(knowledgeBaseId, 0L);
      chunkCountMap.putIfAbsent(knowledgeBaseId, 0L);
    }

    // 构建TopKnowledgeBase列表
    List<KnowledgeBaseStatisticsVo.TopKnowledgeBase> topKnowledgeBases = new ArrayList<>();
    for (Long knowledgeBaseId : knowledgeBaseIds) {
      KnowledgeBase knowledgeBase = knowledgeBaseMap.get(knowledgeBaseId);
      if (knowledgeBase == null) {
        continue; // 知识库不存在，跳过
      }

      KnowledgeBaseStatisticsVo.TopKnowledgeBase topKnowledgeBase = new KnowledgeBaseStatisticsVo.TopKnowledgeBase();
      topKnowledgeBase.setId(knowledgeBaseId);
      topKnowledgeBase.setName(knowledgeBase.getName());
      topKnowledgeBase.setQueryCount(queryCountMap.get(knowledgeBaseId));
      topKnowledgeBase.setFileCount(fileCountMap.getOrDefault(knowledgeBaseId, 0L));
      topKnowledgeBase.setChunkCount(chunkCountMap.getOrDefault(knowledgeBaseId, 0L));
      topKnowledgeBases.add(topKnowledgeBase);
    }
    return topKnowledgeBases;
  }

  /**
   * 构建查询趋势
   */
  private List<KnowledgeBaseStatisticsVo.QueryTrend> buildQueryTrend(LocalDateTime start,
      LocalDateTime end) {
    List<Object[]> rows = knowledgeBaseDocUsageLogQuery.getQueryTrendByDay(start, end);
    List<KnowledgeBaseStatisticsVo.QueryTrend> trends = new ArrayList<>();
    if (rows == null) {
      return trends;
    }

    for (Object[] r : rows) {
      KnowledgeBaseStatisticsVo.QueryTrend t = new KnowledgeBaseStatisticsVo.QueryTrend();
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
      long errors = r[3] == null ? 0L : ((Number) r[3]).longValue();

      t.setTotalQueries(totalQueries);
      t.setAvgResponseTime(avgResponseTime != null ? avgResponseTime.longValue() : 0L);
      t.setErrors(errors);
      double errorRate = totalQueries == 0 ? 0.0 : (errors * 100.0 / totalQueries);
      t.setErrorRate(errorRate);
      trends.add(t);
    }
    return trends;
  }
}
