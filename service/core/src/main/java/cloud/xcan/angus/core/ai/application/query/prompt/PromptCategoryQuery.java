package cloud.xcan.angus.core.ai.application.query.prompt;

import cloud.xcan.angus.core.ai.domain.prompt.PromptCategory;

import java.util.List;

/**
 * 提示词分类查询服务
 */
public interface PromptCategoryQuery {

  /**
   * 根据ID查询分类
   *
   * @param id 分类ID
   * @return 分类信息，不存在返回null
   */
  PromptCategory findById(Long id);

  /**
   * 查询所有分类（树形结构）
   *
   * @return 分类树
   */
  List<PromptCategory> findAll();

  /**
   * 查询根分类列表
   *
   * @return 根分类列表
   */
  List<PromptCategory> findRootCategories();

  /**
   * 查询指定父分类下的子分类
   *
   * @param parentId 父分类ID
   * @return 子分类列表
   */
  List<PromptCategory> findByParentId(Long parentId);

  /**
   * 查询分类路径（从根到指定分类）
   *
   * @param id 分类ID
   * @return 分类路径
   */
  List<PromptCategory> findPath(Long id);

  /**
   * 统计分类下的提示词数量
   *
   * @param categoryId 分类ID
   * @return 提示词数量
   */
  long countPrompts(Long categoryId);

  /**
   * 检查分类是否存在
   *
   * @param id 分类ID
   * @return 是否存在
   */
  boolean exists(Long id);

}
