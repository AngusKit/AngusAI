package cloud.xcan.angus.core.ai.interfaces.dataset.facade;

import cloud.xcan.angus.core.ai.interfaces.dataset.facade.dto.DatasetDataBatchDeleteDto;
import cloud.xcan.angus.core.ai.interfaces.dataset.facade.dto.DatasetDataFindDto;
import cloud.xcan.angus.core.ai.interfaces.dataset.facade.vo.DatasetDataListVo;
import cloud.xcan.angus.core.ai.interfaces.dataset.facade.vo.DatasourceTableDataPreviewVo;
import cloud.xcan.angus.core.ai.interfaces.dataset.facade.vo.SyncDataVo;
import cloud.xcan.angus.remote.PageResult;
import java.util.List;

public interface DatasetDataFacade {

  /**
   * 同步文件数据到关系数据库或同步表信息
   */
  List<SyncDataVo> syncDatasetData(Long id, List<String> names);

  /**
   * 批量删除文件或表
   */
  void batchDeleteData(Long id, DatasetDataBatchDeleteDto dto);

  /**
   * 获取数据集数据列表
   */
  PageResult<DatasetDataListVo> listData(Long id, DatasetDataFindDto dto);

  /**
   * 数据源数据预览
   */
  DatasourceTableDataPreviewVo previewDatasourceData(Long id, String tableName, Integer pageNo,
      Integer pageSize);

}
