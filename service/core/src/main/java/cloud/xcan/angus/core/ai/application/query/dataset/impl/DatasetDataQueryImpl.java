package cloud.xcan.angus.core.ai.application.query.dataset.impl;

import cloud.xcan.angus.core.ai.application.query.dataset.DatasetDataQuery;
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
