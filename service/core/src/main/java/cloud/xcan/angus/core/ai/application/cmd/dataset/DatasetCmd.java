package cloud.xcan.angus.core.ai.application.cmd.dataset;

import cloud.xcan.angus.core.ai.domain.dataset.Dataset;
import cloud.xcan.angus.core.ai.domain.dataset.DatasetConfig;
import cloud.xcan.angus.core.ai.interfaces.dataset.facade.dto.DataUploadDto;
import cloud.xcan.angus.core.ai.interfaces.dataset.facade.dto.BatchDeleteDto;

public interface DatasetCmd {

  /**
   * 创建数据集
   */
  Dataset create(Dataset dataset);

  /**
   * 更新数据集基本信息
   */
  Dataset update(Dataset dataset);

  /**
   * 更新数据集配置
   */
  Dataset updateConfig(Long id, DatasetConfig config);

  /**
   * 删除数据集
   */
  void delete(Long id);

  /**
   * 上传数据
   */
  Dataset uploadData(Long id, DataUploadDto dto);

  /**
   * 导出数据
   */
  String exportData(Long id, String format, Long sourceId);

  /**
   * 批量删除数据
   */
  Dataset batchDeleteData(Long id, BatchDeleteDto dto);

  /**
   * 验证数据集配置
   */
  boolean validateConfig(DatasetConfig config);

  /**
   * 检查数据集依赖
   */
  boolean checkDependencies(Long id);

  /**
   * 清理数据集资源
   */
  void cleanupResources(Long id);

  /**
   * 更新数据集状态
   */
  Dataset updateStatus(Long id, String status);

  /**
   * 记录数据集访问
   */
  void recordAccess(Long id);

  /**
   * 更新数据集统计
   */
  void updateStatistics(Long id, Long recordCount, Long totalSize);

  /**
   * 备份数据集
   */
  Dataset backupDataset(Long id);

  /**
   * 恢复数据集
   */
  Dataset restoreDataset(Long id, String backupId);

  /**
   * 复制数据集
   */
  Dataset duplicateDataset(Long id, String name);

  /**
   * 批量操作数据集
   */
  void batchOperation(Long[] ids, String operation);

  /**
   * 归档数据集
   */
  Dataset archiveDataset(Long id);

  /**
   * 取消归档数据集
   */
  Dataset unarchiveDataset(Long id);

}
