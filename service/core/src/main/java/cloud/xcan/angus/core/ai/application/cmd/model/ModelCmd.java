package cloud.xcan.angus.core.ai.application.cmd.model;

import cloud.xcan.angus.core.ai.domain.model.Model;
import cloud.xcan.core.model.ModelConfigDefinition;

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
  Model updateConfig(Long id, ModelConfigDefinition config);

  /**
   * 测试模型连接
   */
  Model test(Long id, String testPrompt);

  /**
   * 删除模型
   */
  void delete(Long id);

}
