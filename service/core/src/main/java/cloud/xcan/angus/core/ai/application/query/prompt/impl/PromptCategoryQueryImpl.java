package cloud.xcan.angus.core.ai.application.query.prompt.impl;

import cloud.xcan.angus.core.ai.application.query.prompt.PromptCategoryQuery;
import cloud.xcan.angus.core.ai.domain.prompt.PromptCategory;
import cloud.xcan.angus.core.ai.domain.prompt.PromptCategoryRepo;
import cloud.xcan.angus.core.ai.domain.prompt.PromptRepo;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

/**
 * 提示词分类查询服务实现
 */
@Service
public class PromptCategoryQueryImpl implements PromptCategoryQuery {

  @Resource
  private PromptCategoryRepo promptCategoryRepo;

  @Resource
  private PromptRepo promptRepo;

  @Override
  public PromptCategory findById(Long id) {
    if (id == null) {
      return null;
    }
    return promptCategoryRepo.findById(id);
  }

  @Override
  public List<PromptCategory> findAll() {
    return promptCategoryRepo.findAllOrderByOrderNum();
  }

  @Override
  public List<PromptCategory> findRootCategories() {
    return promptCategoryRepo.findByParentIdOrderByOrderNum(null);
  }

  @Override
  public List<PromptCategory> findByParentId(Long parentId) {
    return promptCategoryRepo.findByParentIdOrderByOrderNum(parentId);
  }

  @Override
  public List<PromptCategory> findPath(Long id) {
    List<PromptCategory> path = new ArrayList<>();
    if (id == null) {
      return path;
    }

    PromptCategory current = promptCategoryRepo.findById(id);
    while (current != null) {
      path.add(0, current); // 添加到列表开头
      if (current.getParentId() != null) {
        current = promptCategoryRepo.findById(current.getParentId());
      } else {
        current = null;
      }
    }
    return path;
  }

  @Override
  public long countPrompts(Long categoryId) {
    if (categoryId == null) {
      return 0;
    }
    return promptRepo.countByCategoryId(categoryId);
  }

  @Override
  public boolean exists(Long id) {
    if (id == null) {
      return false;
    }
    return promptCategoryRepo.findById(id) != null;
  }

}
