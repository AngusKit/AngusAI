package cloud.xcan.angus.core.ai.application.query.dataset;

import cloud.xcan.angus.core.ai.domain.dataset.DatasetData;
import cloud.xcan.angus.core.ai.infra.util.DatasourceUtils.TableDataResult;
import cloud.xcan.angus.core.jpa.criteria.GenericSpecification;
import java.util.List;
import java.util.Map;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

public interface DatasetDataQuery {

  Page<DatasetData> find(GenericSpecification<DatasetData> spec, PageRequest pageable,
      boolean fullTextSearch, String[] match);

  TableDataResult previewDatasourceData(Long id, String tableName, Integer pageNo,
      Integer pageSize);

  /**
   * 批量根据数据集ID统计数据（文件/表数、记录数、总大小）
   */
  Map<Long, DatasetDataStats> getStatsByDatasetIds(List<Long> datasetIds);
}
