package cloud.xcan.angus.core.ai.application.query.prompt;

import cloud.xcan.angus.core.ai.domain.prompt.PromptCategory;
import java.util.List;

/**
 * 提示词分类查询服务
 */
public interface PromptCategoryQuery {

  /**
   * 根据ID查询分类
   */
  PromptCategory findAndCheck(Long id);

  /**
   * 查询所有分类（树形结构）
   */
  List<PromptCategory> findAll();

  /**
   * 检查分类是否存在
   */
  boolean exists(Long id);

  /**
   * 计算分类的层级深度
   * @param parentId 父分类ID，如果为null表示是第一级
   * @return 层级深度，从1开始（第一级为1，第二级为2，第三级为3）
   */
  int calculateCategoryLevel(Long parentId);

  /**
   * 设置提示词数量
   */
  void setPromptCount(List<PromptCategory> categories);
}

