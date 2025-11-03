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

  void setPromptCount(List<PromptCategory> categories);
}

