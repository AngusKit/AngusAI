package cloud.xcan.angus.core.ai.application.cmd.prompt;

import cloud.xcan.angus.core.ai.domain.prompt.PromptCategory;

/**
 * 提示词分类命令服务
 */
public interface PromptCategoryCmd {

  /**
   * 创建提示词分类
   *
   * @return 创建的分类
   */
  PromptCategory create(PromptCategory category);

  /**
   * 更新提示词分类
   */
  PromptCategory update(PromptCategory category);

  /**
   * 调整分类顺序
   */
  PromptCategory updateOrder(Long id, Integer newPosition);

  /**
   * 删除提示词分类
   */
  void delete(Long id);

  /**
   * 批量删除分类
   */
  void batchDelete(Long[] ids);

}
