package cloud.xcan.angus.core.ai.application.cmd.dataset;

import cloud.xcan.angus.core.ai.infra.util.DatasourceUtils.ConnectionTestResult;
import cloud.xcan.angus.core.ai.domain.dataset.Dataset;
import cloud.xcan.angus.core.ai.domain.dataset.DatasourceConfig;

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
   * 更新数据集数据源配置
   */
  Dataset modifyDataSource(Long id, DatasourceConfig config);

  /**
   * 测试数据源连接是否可用
   */
  ConnectionTestResult testDatasourceConnection(Long id, DatasourceConfig config);

  /**
   *  删除数据源配置
   */
  void deleteDataSource(Long id);

  /**
   * 删除数据集
   */
  void delete(Long id);

  /**
   * 记录数据集访问
   */
  void recordAccess(Long id);
}
