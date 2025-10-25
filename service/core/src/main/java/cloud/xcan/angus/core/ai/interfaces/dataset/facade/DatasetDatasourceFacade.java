package cloud.xcan.angus.core.ai.interfaces.dataset.facade;

import cloud.xcan.angus.core.ai.interfaces.dataset.facade.dto.ConnectionTestDto;
import cloud.xcan.angus.core.ai.interfaces.dataset.facade.dto.DataSourceCreateDto;
import cloud.xcan.angus.core.ai.interfaces.dataset.facade.vo.ConnectionTestVo;
import cloud.xcan.angus.core.ai.interfaces.dataset.facade.vo.DataSourceListVo;
import cloud.xcan.angus.core.ai.interfaces.dataset.facade.vo.DatasetDetailVo;
import cloud.xcan.angus.core.ai.interfaces.dataset.facade.vo.SyncResultVo;
import cloud.xcan.angus.remote.PageResult;

public interface DatasetDatasourceFacade {

  /**
   * 添加数据源
   */
  DatasetDetailVo addDataSource(Long datasetId, DataSourceCreateDto dto);

  /**
   * 获取数据源列表
   */
  PageResult<DataSourceListVo> getDataSources(Long datasetId, Integer pageNo, Integer pageSize, String sourceType, String status);

  /**
   * 同步数据源
   */
  SyncResultVo syncDataSource(Long datasetId, Long sourceId);

  /**
   * 删除数据源
   */
  void deleteDataSource(Long datasetId, Long sourceId);

  /**
   * 测试数据源连接
   */
  ConnectionTestVo testConnection(ConnectionTestDto dto);

}
