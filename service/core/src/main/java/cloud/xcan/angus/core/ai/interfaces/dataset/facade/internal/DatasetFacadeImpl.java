package cloud.xcan.angus.core.ai.interfaces.dataset.facade.internal;

import static cloud.xcan.angus.core.ai.infra.util.CommonUtils.formatFileSize;
import static cloud.xcan.angus.core.ai.infra.util.TimeRangeUtils.DATE_FMT;
import static cloud.xcan.angus.core.ai.infra.util.TimeRangeUtils.parseEndDate;
import static cloud.xcan.angus.core.ai.infra.util.TimeRangeUtils.parseStartDate;
import static cloud.xcan.angus.core.jpa.criteria.SearchCriteriaBuilder.getMatchSearchFields;
import static cloud.xcan.angus.core.utils.CoreUtils.buildVoPageResult;

import cloud.xcan.angus.core.ai.application.cmd.dataset.DatasetCmd;
import cloud.xcan.angus.core.ai.application.query.dataset.DatasetQuery;
import cloud.xcan.angus.core.ai.application.query.dataset.DatasetUsageLogQuery;
import cloud.xcan.angus.core.ai.domain.Visibility;
import cloud.xcan.angus.core.ai.domain.dataset.Dataset;
import cloud.xcan.angus.core.ai.domain.dataset.DatasetDataRepo;
import cloud.xcan.angus.core.ai.infra.util.DatasourceUtils.ConnectionTestResult;
import cloud.xcan.angus.core.ai.interfaces.dataset.facade.DatasetFacade;
import cloud.xcan.angus.core.ai.interfaces.dataset.facade.dto.DataSourceUpdateDto;
import cloud.xcan.angus.core.ai.interfaces.dataset.facade.dto.DatasetCreateDto;
import cloud.xcan.angus.core.ai.interfaces.dataset.facade.dto.DatasetFindDto;
import cloud.xcan.angus.core.ai.interfaces.dataset.facade.dto.DatasetUpdateDto;
import cloud.xcan.angus.core.ai.interfaces.dataset.facade.dto.DatasourceConnectionTestDto;
import cloud.xcan.angus.core.ai.interfaces.dataset.facade.internal.assembler.DatasetAssembler;
import cloud.xcan.angus.core.ai.interfaces.dataset.facade.vo.DatasetDetailVo;
import cloud.xcan.angus.core.ai.interfaces.dataset.facade.vo.DatasetListVo;
import cloud.xcan.angus.core.ai.interfaces.dataset.facade.vo.DatasetStatisticsVo;
import cloud.xcan.angus.core.ai.interfaces.dataset.facade.vo.DatasourceConfigVo;
import cloud.xcan.angus.core.ai.interfaces.dataset.facade.vo.DatasourceConnectionTestVo;
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
public class DatasetFacadeImpl implements DatasetFacade {

  @Resource
  private DatasetQuery datasetQuery;

  @Resource
  private DatasetCmd datasetCmd;

  @Resource
  private DatasetUsageLogQuery datasetUsageLogQuery;

  @Resource
  private DatasetDataRepo datasetDataRepo;

  private static final int TOP_N = 10;
  private static final int DEFAULT_MONTHS = 1; // 默认统计近一月

  @NameJoin
  @Override
  public DatasetDetailVo create(DatasetCreateDto dto) {
    Dataset dataset = DatasetAssembler.toCreateDomain(dto);
    Dataset saved = datasetCmd.create(dataset);
    return DatasetAssembler.toDetailVo(saved);
  }

  @NameJoin
  @Override
  public DatasetDetailVo update(Long id, DatasetUpdateDto dto) {
    Dataset dataset = DatasetAssembler.toUpdateDomain(id, dto);
    Dataset saved = datasetCmd.update(dataset);
    return DatasetAssembler.toDetailVo(saved);
  }

  @NameJoin
  @Override
  public DatasetDetailVo modifyVisibility(Long id, Visibility visibility) {
    Dataset saved = datasetCmd.modifyVisibility(id, visibility);
    return DatasetAssembler.toDetailVo(saved);
  }

  @Override
  public DatasourceConfigVo modifyDataSource(Long id, DataSourceUpdateDto dto) {
    Dataset saved = datasetCmd.modifyDataSource(id,
        DatasetAssembler.toDatasourceConfig(dto));
    return DatasetAssembler.toDatasourceConfigVo(saved.getConfig());
  }

  @Override
  public DatasourceConnectionTestVo testDatasourceConnection(DatasourceConnectionTestDto dto) {
    ConnectionTestResult result = datasetCmd.testDatasourceConnection(dto.getDatasetId(),
        DatasetAssembler.toDatasourceConfig(dto));
    return DatasetAssembler.toConnectionTestResultVo(result);
  }

  @Override
  public void deleteDataSource(Long id) {
    datasetCmd.deleteDataSource(id);
  }

  @Override
  public void delete(Long id) {
    datasetCmd.delete(id);
  }

  @NameJoin
  @Override
  public DatasetDetailVo getDetail(Long id) {
    Dataset dataset = datasetQuery.findAndCheck(id);
    return DatasetAssembler.toDetailVo(dataset);
  }

  @NameJoin
  @Override
  public PageResult<DatasetListVo> list(DatasetFindDto dto) {
    GenericSpecification<Dataset> spec = DatasetAssembler.getSpecification(dto);
    Page<Dataset> page = datasetQuery.find(spec, dto.tranPage(),
        dto.fullTextSearch, getMatchSearchFields(dto.getClass()));
    return buildVoPageResult(page, DatasetAssembler::toListVo);
  }

  /**
   * 获取数据集统计信息
   *
   * @param dto 统计参数
   * @return 统计信息VO
   */
  @Override
  public DatasetStatisticsVo getStatistics(SimpleStatisticsDto dto) {
    LocalDateTime now = LocalDateTime.now();
    LocalDate today = now.toLocalDate();
    LocalDateTime todayStart = today.atStartOfDay();
    LocalDateTime todayEnd = today.atTime(LocalTime.MAX);

    // 解析用户指定的时间范围，用于topDatasets和queryTrend
    LocalDateTime start = parseStartDate(dto != null ? dto.getStartDate() : null);
    LocalDateTime end = parseEndDate(dto != null ? dto.getEndDate() : null);

    // 如果开始时间为默认值（1970），则使用近一月作为默认范围
    if (start.equals(LocalDateTime.of(1970, 1, 1, 0, 0))) {
      start = now.minusMonths(DEFAULT_MONTHS).toLocalDate().atStartOfDay();
    }

    // 近一月时间范围（用于lastMonthGrowthTrend，固定使用近一月数据）
    LocalDateTime oneMonthAgoStart = now.minusMonths(DEFAULT_MONTHS).toLocalDate().atStartOfDay();

    DatasetStatisticsVo vo = new DatasetStatisticsVo();

    // 总体统计（今日数据，但今日查询次数固定使用今日数据）
    DatasetStatisticsVo.Overview overview = buildOverview(todayStart, todayEnd);
    vo.setOverview(overview);

    // 近一月趋势（固定使用近一月数据，不受dto时间范围影响）
    DatasetStatisticsVo.Overview lastMonthTrend = buildOverview(oneMonthAgoStart, now);
    vo.setLastMonthGrowthTrend(lastMonthTrend);

    // 使用率排行（使用用户指定的时间范围）
    vo.setTopDatasets(buildTopDatasets(start, end));

    // 查询趋势（使用用户指定的时间范围）
    vo.setQueryTrend(buildQueryTrend(start, end));
    return vo;
  }

  /**
   * 构建总体统计概览
   */
  private DatasetStatisticsVo.Overview buildOverview(LocalDateTime start, LocalDateTime end) {
    DatasetStatisticsVo.Overview overview = new DatasetStatisticsVo.Overview();

    // 总数据集数
    Long totalDatasets = datasetQuery.countTotalDatasets();
    overview.setTotalDatasets(totalDatasets != null ? totalDatasets : 0L);

    // 活跃（被引用）数据集数
    Long activeDatasets = datasetQuery.countActiveDatasets();
    overview.setActiveDatasets(activeDatasets != null ? activeDatasets : 0L);

    // 总文件或表数
    Long totalFilesOrTables = datasetDataRepo.countTotalFilesOrTables();
    overview.setTotalFilesOrTables(totalFilesOrTables != null ? totalFilesOrTables : 0L);

    // 总记录数
    Long totalRecords = datasetDataRepo.sumTotalRecords();
    overview.setTotalRecords(totalRecords != null ? totalRecords : 0L);

    // 记录总大小
    Long totalRecordsSize = datasetDataRepo.sumTotalRecordsSize();
    overview.setTotalRecordsSize(totalRecordsSize != null ? totalRecordsSize : 0L);

    // 总查询次数（时间范围内的所有查询）
    Long totalQueryCount = datasetUsageLogQuery.countByTimeRange(start, end);
    overview.setTotalQueryCount(totalQueryCount != null ? totalQueryCount : 0L);

    // 今日查询次数（固定使用今日数据，不受时间范围影响）
    LocalDate today = LocalDate.now();
    LocalDateTime todayStart = today.atStartOfDay();
    LocalDateTime todayEnd = today.atTime(LocalTime.MAX);
    Long todayQueryCount = datasetUsageLogQuery.countByTimeRange(todayStart, todayEnd);
    overview.setTodayQueryCount(todayQueryCount != null ? todayQueryCount : 0L);

    // 已使用存储空间大小（使用记录总大小）
    overview.setUsedStoreSize(formatFileSize(totalRecordsSize != null ? totalRecordsSize : 0L));

    // 授权的存储空间大小，自定义数据源返回空
    overview.setTotalStoreSize(null); // TODO

    // 已使用存储空间占比，自定义数据源返回空
    overview.setUsedStoreRate(null); // TODO

    return overview;
  }

  /**
   * 构建使用率排行 优化：批量查询数据集，避免N+1查询问题
   */
  private List<DatasetStatisticsVo.TopDataset> buildTopDatasets(LocalDateTime start,
      LocalDateTime end) {
    // 获取查询次数和平均响应时间数据（按数据集分组，TOP N）
    // 返回格式：[0]=datasetId, [1]=count, [2]=avgResponseTime
    List<Object[]> queryCountRows = datasetUsageLogQuery.getTopDatasetsByQueryCount(start, end,
        TOP_N);

    if (queryCountRows == null || queryCountRows.isEmpty()) {
      return new ArrayList<>();
    }

    // 提取数据集ID列表
    List<Long> datasetIds = new ArrayList<>();
    Map<Long, Long> queryCountMap = new HashMap<>();

    for (Object[] r : queryCountRows) {
      Long datasetId = r[0] == null ? null : ((Number) r[0]).longValue();
      Long count = r[1] == null ? 0L : ((Number) r[1]).longValue();

      if (datasetId != null) {
        datasetIds.add(datasetId);
        queryCountMap.put(datasetId, count);
      }
    }

    // 批量查询数据集详情，避免循环查询数据库
    Map<Long, Dataset> datasetMap = datasetQuery.findByIds(datasetIds);

    // 批量查询文件或表数和记录数，避免循环查询数据库
    Map<Long, Long> fileOrTableCountMap = new HashMap<>();
    Map<Long, Long> recordCountMap = new HashMap<>();

    // 批量查询文件或表数
    List<Object[]> fileOrTableCountRows = datasetDataRepo.countByDatasetIds(datasetIds);
    if (fileOrTableCountRows != null) {
      for (Object[] row : fileOrTableCountRows) {
        Long datasetId = row[0] == null ? null : ((Number) row[0]).longValue();
        Long count = row[1] == null ? 0L : ((Number) row[1]).longValue();
        if (datasetId != null) {
          fileOrTableCountMap.put(datasetId, count);
        }
      }
    }

    // 批量查询记录数
    List<Object[]> recordCountRows = datasetDataRepo.sumRecordsByDatasetIds(datasetIds);
    if (recordCountRows != null) {
      for (Object[] row : recordCountRows) {
        Long datasetId = row[0] == null ? null : ((Number) row[0]).longValue();
        Long count = row[1] == null ? 0L : ((Number) row[1]).longValue();
        if (datasetId != null) {
          recordCountMap.put(datasetId, count);
        }
      }
    }

    // 为没有数据的数据集设置默认值0
    for (Long datasetId : datasetIds) {
      fileOrTableCountMap.putIfAbsent(datasetId, 0L);
      recordCountMap.putIfAbsent(datasetId, 0L);
    }

    // 构建TopDataset列表
    List<DatasetStatisticsVo.TopDataset> topDatasets = new ArrayList<>();
    for (Long datasetId : datasetIds) {
      Dataset dataset = datasetMap.get(datasetId);
      if (dataset == null) {
        continue; // 数据集不存在，跳过
      }

      DatasetStatisticsVo.TopDataset topDataset = new DatasetStatisticsVo.TopDataset();
      topDataset.setId(datasetId);
      topDataset.setName(dataset.getName());
      topDataset.setQueryCount(queryCountMap.get(datasetId));
      topDataset.setFileOrTableCount(fileOrTableCountMap.getOrDefault(datasetId, 0L));
      topDataset.setRecordCount(recordCountMap.getOrDefault(datasetId, 0L));
      topDatasets.add(topDataset);
    }
    return topDatasets;
  }

  /**
   * 构建查询趋势
   */
  private List<DatasetStatisticsVo.QueryTrend> buildQueryTrend(LocalDateTime start,
      LocalDateTime end) {
    List<Object[]> rows = datasetUsageLogQuery.getQueryTrendByDay(start, end);
    List<DatasetStatisticsVo.QueryTrend> trends = new ArrayList<>();
    if (rows == null) {
      return trends;
    }

    for (Object[] r : rows) {
      DatasetStatisticsVo.QueryTrend t = new DatasetStatisticsVo.QueryTrend();
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
