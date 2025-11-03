package cloud.xcan.angus.core.ai.interfaces.prompt.facade.internal.assembler;

import static cloud.xcan.angus.spec.experimental.BizConstant.DEFAULT_ROOT_PID;
import static cloud.xcan.angus.spec.utils.ObjectUtils.nullSafe;

import cloud.xcan.angus.core.ai.domain.prompt.PromptCategory;
import cloud.xcan.angus.core.ai.interfaces.prompt.facade.dto.PromptCategoryCreateDto;
import cloud.xcan.angus.core.ai.interfaces.prompt.facade.dto.PromptCategoryUpdateDto;
import cloud.xcan.angus.core.ai.interfaces.prompt.facade.vo.PromptCategoryVo;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class PromptCategoryAssembler {

  public static PromptCategory toCreateDomain(PromptCategoryCreateDto dto) {
    PromptCategory category = new PromptCategory();
    category.setName(dto.getName());
    category.setName(dto.getIcon());
    category.setColor(dto.getColor());
    category.setParentId(nullSafe(dto.getParentId(), DEFAULT_ROOT_PID));
    category.setIsSystem(false); // 默认非系统分类
    category.setOrderNum(0); // 默认排序为0，实际创建时会调整
    return category;
  }

  public static PromptCategory toUpdateDomain(Long id, PromptCategoryUpdateDto dto) {
    PromptCategory category = new PromptCategory();
    category.setId(id);
    category.setName(dto.getName());
    category.setName(dto.getIcon());
    category.setColor(dto.getColor());
    category.setParentId(dto.getParentId());
    category.setIsSystem(false); // 默认非系统分类
    category.setOrderNum(0); // 默认排序为0，实际创建时会调整
    return category;
  }

  public static PromptCategoryVo toVo(PromptCategory category) {
    if (category == null) {
      return null;
    }
    PromptCategoryVo vo = new PromptCategoryVo();
    vo.setId(category.getId());
    vo.setName(category.getName());
    vo.setIcon(category.getIcon());
    vo.setColor(category.getColor());
    vo.setParentId(category.getParentId());
    vo.setIsSystem(category.getIsSystem());
    vo.setOrderNum(category.getOrderNum());
    vo.setPromptCount(category.getPromptCount());
    return vo;
  }

  public static List<PromptCategoryVo> buildTree(List<PromptCategory> categories) {
    // 转换为 VO
    List<PromptCategoryVo> vos = categories.stream()
        .map(PromptCategoryAssembler::toVo).toList();

    // 按 parentId 分组
    Map<Long, List<PromptCategoryVo>> groupByParent = new HashMap<>();
    for (PromptCategoryVo vo : vos) {
      Long parentId = vo.getParentId();
      groupByParent.computeIfAbsent(parentId, k -> new ArrayList<>()).add(vo);
    }

    // 为每个节点设置 children
    for (PromptCategoryVo vo : vos) {
      List<PromptCategoryVo> children = groupByParent.get(vo.getId());
      if (children != null) {
        vo.setChildren(children);
      }
    }

    // 返回根节点
    return groupByParent.getOrDefault(null, new ArrayList<>());
  }

}
