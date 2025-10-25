package cloud.xcan.angus.core.ai.application.query.dataset;

import cloud.xcan.angus.core.ai.domain.dataset.Dataset;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

public interface DatasetDatasourceQuery {

  /**
   * 查询有数据源的数据集列表
   */
  Page<Dataset> findDatasetsWithDataSources(PageRequest pageable);

  /**
   * 查询无数据源的数据集列表
   */
  Page<Dataset> findDatasetsWithoutDataSources(PageRequest pageable);

  /**
   * 查询需要同步的数据集
   */
  Page<Dataset> findDatasetsNeedingSync(PageRequest pageable);

}
