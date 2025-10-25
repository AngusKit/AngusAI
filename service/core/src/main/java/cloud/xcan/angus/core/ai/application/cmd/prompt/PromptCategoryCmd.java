package cloud.xcan.angus.core.ai.application.cmd.prompt;

import cloud.xcan.angus.core.ai.domain.prompt.PromptCategory;

/**
 * 提示词分类命令服务
 */
public interface PromptCategoryCmd {

  /**
   * 创建提示词分类
   *
   * @param name        分类名称
   * @param description 分类描述
   * @param icon        分类图标
   * @param color       分类颜色
   * @param parentId    父分类ID（可选）
   * @return 创建的分类
   */
  PromptCategory create(String name, String description, String icon, String color, Long parentId);

  /**
   * 更新提示词分类
   *
   * @param id          分类ID
   * @param name        分类名称
   * @param description 分类描述
   * @param icon        分类图标
   * @param color       分类颜色
   * @param parentId    父分类ID（可选）
   * @return 更新后的分类
   */
  PromptCategory update(Long id, String name, String description, String icon, String color, Long parentId);

  /**
   * 删除提示词分类
   *
   * @param id 分类ID
   */
  void delete(Long id);

  /**
   * 调整分类顺序
   *
   * @param id          分类ID
   * @param newPosition 新位置
   */
  void updateOrder(Long id, Integer newPosition);

  /**
   * 批量删除分类
   *
   * @param ids 分类ID列表
   */
  void batchDelete(Long[] ids);

}
