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
   * 删除模型
   */
  void delete(Long id);

}
