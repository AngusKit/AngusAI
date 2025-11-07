package cloud.xcan.angus.core.ai.interfaces.prompt.facade.internal.assembler;

import cloud.xcan.angus.core.ai.domain.prompt.PromptCategory;
import cloud.xcan.angus.core.ai.interfaces.prompt.facade.dto.PromptCategoryCreateDto;
import cloud.xcan.angus.core.ai.interfaces.prompt.facade.dto.PromptCategoryUpdateDto;
import cloud.xcan.angus.core.ai.interfaces.prompt.facade.vo.PromptCategoryVo;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class PromptCategoryAssembler {

  public static PromptCategory toCreateDomain(PromptCategoryCreateDto dto) {
    PromptCategory category = new PromptCategory();
    category.setName(dto.getName());
    category.setIcon(dto.getIcon());
    category.setColor(dto.getColor());
    category.setParentId(dto.getParentId());
    category.setIsSystem(false); // 默认非系统分类
    category.setOrderNum(0); // 默认排序为0，实际创建时会调整
    return category;
  }

  public static PromptCategory toUpdateDomain(Long id, PromptCategoryUpdateDto dto) {
    PromptCategory category = new PromptCategory();
    category.setId(id);
    category.setName(dto.getName());
    category.setIcon(dto.getIcon());
    category.setColor(dto.getColor());
    category.setParentId(dto.getParentId());
    category.setIsSystem(false); // 默认非系统分类
    category.setOrderNum(0); // 默认排序为0，实际创建时会调整
    return category;
  }

  public static PromptCategoryVo toVo(PromptCategory category) {
    PromptCategoryVo vo = new PromptCategoryVo();
    vo.setId(category.getId());
    vo.setName(category.getName());
    vo.setIcon(category.getIcon());
    vo.setColor(category.getColor());
    vo.setParentId(category.getParentId());
    vo.setIsSystem(category.getIsSystem());
    vo.setOrderNum(category.getOrderNum());
    vo.setPromptCount(category.getPromptCount());

    // 设置审计信息
    vo.setTenantId(category.getTenantId());
    vo.setCreatedBy(category.getCreatedBy());
    vo.setCreatedDate(category.getCreatedDate());
    vo.setModifiedBy(category.getModifiedBy());
    vo.setModifiedDate(category.getModifiedDate());
    return vo;
  }

  public static List<PromptCategoryVo> buildTree(List<PromptCategory> categories) {
    // 转换为 VO
    List<PromptCategoryVo> vos = categories.stream()
        .map(PromptCategoryAssembler::toVo).collect(Collectors.toList());

    // 按 parentId 分组
    Map<Long, List<PromptCategoryVo>> groupByParent = new HashMap<>();
    for (PromptCategoryVo vo : vos) {
      Long parentId = vo.getParentId();
      groupByParent.computeIfAbsent(parentId, k -> new ArrayList<>()).add(vo);
    }

    // 定义排序规则：先按 isSystem 排序（true 靠前），再按 orderNum 排序（越小越靠前）
    Comparator<PromptCategoryVo> comparator = Comparator
        .comparing((PromptCategoryVo vo) -> Boolean.TRUE.equals(vo.getIsSystem()), Comparator.reverseOrder())
        .thenComparing(vo -> vo.getOrderNum() != null ? vo.getOrderNum() : Integer.MAX_VALUE);

    // 对每个分组内的节点进行排序
    for (List<PromptCategoryVo> group : groupByParent.values()) {
      group.sort(comparator);
    }

    // 为每个节点设置 children（children 已经排序）
    for (PromptCategoryVo vo : vos) {
      List<PromptCategoryVo> children = groupByParent.get(vo.getId());
      if (children != null) {
        vo.setChildren(children);
      }
    }

    // 返回根节点（已排序）
    return groupByParent.getOrDefault(null, new ArrayList<>());
  }

}
