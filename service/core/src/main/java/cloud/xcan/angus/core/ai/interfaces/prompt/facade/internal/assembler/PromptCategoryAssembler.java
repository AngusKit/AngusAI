package cloud.xcan.angus.core.ai.interfaces.prompt.facade.internal.assembler;

import cloud.xcan.angus.core.ai.application.query.prompt.PromptCategoryQuery;
import cloud.xcan.angus.core.ai.domain.prompt.PromptCategory;
import cloud.xcan.angus.core.ai.interfaces.prompt.facade.vo.PromptCategoryVo;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Component;

/**
 * 提示词分类组装器
 */
@Component
public class PromptCategoryAssembler {

  @Resource
  private PromptCategoryQuery promptCategoryQuery;

  /**
   * 领域对象转换为视图对象
   */
  public PromptCategoryVo toVo(PromptCategory category) {
    if (category == null) {
      return null;
    }

    PromptCategoryVo vo = new PromptCategoryVo();
    vo.setId(category.getId());
    vo.setName(category.getName());
    vo.setDescription(category.getDescription());
    vo.setIcon(category.getIcon());
    vo.setColor(category.getColor());
    vo.setParentId(category.getParentId());
    vo.setIsSystem(category.getIsSystem());
    vo.setOrderNum(category.getOrderNum());
    vo.setCreatedAt(category.getCreatedAt());
    vo.setUpdatedAt(category.getUpdatedAt());

    // 统计提示词数量
    long promptCount = promptCategoryQuery.countPrompts(category.getId());
    vo.setPromptCount(promptCount);

    return vo;
  }

}
