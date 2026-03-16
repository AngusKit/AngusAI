package cloud.xcan.angus.core.ai.application.query.dataset.impl;

import cloud.xcan.angus.core.ai.application.query.dataset.DatasetDataQuery;
import cloud.xcan.angus.core.ai.application.query.dataset.DatasetDataStats;
import cloud.xcan.angus.core.ai.application.query.dataset.DatasetQuery;
import cloud.xcan.angus.core.ai.domain.dataset.Dataset;
import cloud.xcan.angus.core.ai.domain.dataset.DatasetData;
import cloud.xcan.angus.core.ai.domain.dataset.DatasetDataRepo;
import cloud.xcan.angus.core.ai.domain.dataset.DatasetDataSearchRepo;
import cloud.xcan.angus.core.ai.infra.util.DatasourceUtils;
import cloud.xcan.angus.core.ai.infra.util.DatasourceUtils.TableDataResult;
import cloud.xcan.angus.core.biz.BizTemplate;
import cloud.xcan.angus.core.jpa.criteria.GenericSpecification;
import jakarta.annotation.Resource;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Service;

@Service
public class DatasetDataQueryImpl implements DatasetDataQuery {

  @Resource
  private DatasetDataRepo datasetDataRepo;

  @Resource
  private DatasetDataSearchRepo datasetDataSearchRepo;

  @Resource
  private DatasetQuery datasetQuery;

  @Override
  public Page<DatasetData> find(GenericSpecification<DatasetData> spec, PageRequest pageable,
      boolean fullTextSearch, String[] match) {
    return new BizTemplate<Page<DatasetData>>() {
      @Override
      protected Page<DatasetData> process() {
        return fullTextSearch
            ? datasetDataSearchRepo.find(spec.getCriteria(), pageable, DatasetData.class, match)
            : datasetDataRepo.findAll(spec, pageable);
      }
    }.execute();
  }

  @Override
  public Map<Long, DatasetDataStats> getStatsByDatasetIds(List<Long> datasetIds) {
    return new BizTemplate<Map<Long, DatasetDataStats>>() {
      @Override
      protected Map<Long, DatasetDataStats> process() {
        if (datasetIds == null || datasetIds.isEmpty()) {
          return new HashMap<>();
        }
        List<Object[]> rows = datasetDataRepo.getStatsByDatasetIds(datasetIds);
        Map<Long, DatasetDataStats> result = new HashMap<>();
        for (Object[] row : rows) {
          Long datasetId = row[0] == null ? null : ((Number) row[0]).longValue();
          if (datasetId == null) {
            continue;
          }
          long totalFilesOrTables = row[1] == null ? 0 : ((Number) row[1]).longValue();
          long totalRecords = row[2] == null ? 0 : ((Number) row[2]).longValue();
          long totalRecordsSize = row[3] == null ? 0 : ((Number) row[3]).longValue();
          result.put(datasetId,
              new DatasetDataStats(datasetId, totalFilesOrTables, totalRecords, totalRecordsSize));
        }
        return result;
      }
    }.execute();
  }

  @Override
  public TableDataResult previewDatasourceData(Long id, String tableName,
      @Nullable Integer pageNo, @Nullable Integer pageSize) {
    return new BizTemplate<TableDataResult>() {
      Dataset datasetDb;

      @Override
      protected void checkParams() {
        // 获取数据集并检查是否存在
        datasetDb = datasetQuery.findAndCheck(id);
      }

      @Override
      protected TableDataResult process() {
        if (datasetDb.getConfig() == null || !datasetDb.getConfig().isValid()) {
          return new TableDataResult();
        }
        return DatasourceUtils.queryTableData(datasetDb.getConfig(), tableName, pageNo, pageSize);
      }
    }.execute();
  }
}
