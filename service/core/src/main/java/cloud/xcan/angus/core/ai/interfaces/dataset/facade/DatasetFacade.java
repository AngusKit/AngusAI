package cloud.xcan.angus.core.ai.interfaces.dataset.facade;

import cloud.xcan.angus.core.ai.domain.dataset.DatasetConfig;
import cloud.xcan.angus.core.ai.interfaces.dataset.facade.dto.DatasetCreateDto;
import cloud.xcan.angus.core.ai.interfaces.dataset.facade.dto.DatasetFindDto;
import cloud.xcan.angus.core.ai.interfaces.dataset.facade.dto.DatasetUpdateDto;
import cloud.xcan.angus.core.ai.interfaces.dataset.facade.dto.DataSourceCreateDto;
import cloud.xcan.angus.core.ai.interfaces.dataset.facade.dto.DataUploadDto;
import cloud.xcan.angus.core.ai.interfaces.dataset.facade.dto.BatchDeleteDto;
import cloud.xcan.angus.core.ai.interfaces.dataset.facade.dto.ConnectionTestDto;
import cloud.xcan.angus.core.ai.interfaces.dataset.facade.vo.DatasetDetailVo;
import cloud.xcan.angus.core.ai.interfaces.dataset.facade.vo.DatasetListVo;
import cloud.xcan.angus.core.ai.interfaces.dataset.facade.vo.DatasetStatisticsVo;
import cloud.xcan.angus.core.ai.interfaces.dataset.facade.vo.DataSourceListVo;
import cloud.xcan.angus.core.ai.interfaces.dataset.facade.vo.DataPreviewVo;
import cloud.xcan.angus.core.ai.interfaces.dataset.facade.vo.UploadResultVo;
import cloud.xcan.angus.core.ai.interfaces.dataset.facade.vo.SyncResultVo;
import cloud.xcan.angus.core.ai.interfaces.dataset.facade.vo.ConnectionTestVo;
import cloud.xcan.angus.remote.PageResult;

public interface DatasetFacade {

  /**
   * 创建数据集
   */
  DatasetDetailVo create(DatasetCreateDto dto);

  /**
   * 更新数据集基本信息
   */
  DatasetDetailVo update(Long id, DatasetUpdateDto dto);

  /**
   * 更新数据集配置
   */
  DatasetDetailVo updateConfig(Long id, DatasetConfig config);

  /**
   * 删除数据集
   */
  void delete(Long id);

  /**
   * 获取数据集详情
   */
  DatasetDetailVo getDetail(Long id);

  /**
   * 获取数据集列表
   */
  PageResult<DatasetListVo> list(DatasetFindDto dto);

  /**
   * 上传数据
   */
  UploadResultVo uploadData(Long id, DataUploadDto dto);

  /**
   * 添加数据源
   */
  DatasetDetailVo addDataSource(Long id, DataSourceCreateDto dto);

  /**
   * 获取数据源列表
   */
  PageResult<DataSourceListVo> getDataSources(Long id, Integer pageNo, Integer pageSize, String sourceType, String status);

  /**
   * 同步数据源
   */
  SyncResultVo syncDataSource(Long datasetId, Long sourceId);

  /**
   * 删除数据源
   */
  void deleteDataSource(Long datasetId, Long sourceId);

  /**
   * 数据预览
   */
  DataPreviewVo previewData(Long id, Integer pageNo, Integer pageSize, Long sourceId);

  /**
   * 数据导出
   */
  String exportData(Long id, String format, Long sourceId);

  /**
   * 获取数据集统计
   */
  DatasetStatisticsVo getStatistics();

  /**
   * 测试数据源连接
   */
  ConnectionTestVo testConnection(ConnectionTestDto dto);

  /**
   * 批量删除数据
   */
  DatasetStatisticsVo batchDeleteData(Long id, BatchDeleteDto dto);

}
