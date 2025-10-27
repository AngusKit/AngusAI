package cloud.xcan.angus.core.ai.application.cmd.model;

import cloud.xcan.angus.core.ai.domain.model.Model;
import cloud.xcan.angus.core.ai.infra.ai.model.ModelConfig;

public interface ModelCmd {

  /**
   * 创建模型
   */
  Model create(Model model);

  /**
   * 更新模型基本信息
   */
  Model update(Model model);

  /**
   * 更新模型配置
   */
  Model updateConfig(Long id, ModelConfig config);

  /**
   * 启动模型
   */
  Model start(Long id);

  /**
   * 停止模型
   */
  Model stop(Long id, Boolean graceful);

  /**
   * 重启模型
   */
  Model restart(Long id);

  /**
   * 测试模型连接
   */
  Model test(Long id, String testPrompt);

  /**
   * 更新模型状态
   */
  Model updateStatus(Long id, String status);

  /**
   * 记录模型调用
   */
  void recordCall(Long id, Long tokens, Double cost, Long responseTime);

  /**
   * 更新模型性能指标
   */
  void updateMetrics(Long id, Double latency, Double throughput, Double accuracy);

  /**
   * 批量启动模型
   */
  void batchStart(Long[] ids);

  /**
   * 批量停止模型
   */
  void batchStop(Long[] ids, Boolean graceful);

  /**
   * 批量重启模型
   */
  void batchRestart(Long[] ids);

  /**
   * 批量删除模型
   */
  void batchDelete(Long[] ids);

  /**
   * 导入模型配置
   */
  Model importConfig(String configJson);

  /**
   * 清理模型资源
   */
  void cleanupResources(Long id);

  /**
   * 删除模型
   */
  void delete(Long id);

  /**
   * 导出模型配置
   */
  String exportConfig(Long id);

  /**
   * 验证模型配置
   */
  boolean validateConfig(ModelConfig config);

  /**
   * 检查模型依赖
   */
  boolean checkDependencies(Long id);

}
