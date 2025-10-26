package cloud.xcan.angus.core.ai.application.cmd.dataset;

import cloud.xcan.angus.core.ai.domain.dataset.Dataset;
import cloud.xcan.angus.core.ai.interfaces.dataset.facade.dto.DataSourceCreateDto;

public interface DatasetDatasourceCmd {

  /**
   * 添加数据源
   */
  Dataset addDataSource(Long datasetId, DataSourceCreateDto dto);

  /**
   * 同步数据源
   */
  Dataset syncDataSource(Long datasetId, Long sourceId);

  /**
   * 删除数据源
   */
  void deleteDataSource(Long datasetId, Long sourceId);

  /**
   * 测试数据源连接
   */
  boolean testDataSourceConnection(DataSourceCreateDto dto);

}