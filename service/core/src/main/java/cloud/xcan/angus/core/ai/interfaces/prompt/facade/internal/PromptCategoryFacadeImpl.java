package cloud.xcan.angus.core.ai.interfaces.prompt.facade.internal;

import cloud.xcan.angus.core.ai.application.cmd.prompt.PromptCategoryCmd;
import cloud.xcan.angus.core.ai.application.query.prompt.PromptCategoryQuery;
import cloud.xcan.angus.core.ai.domain.prompt.PromptCategory;
import cloud.xcan.angus.core.ai.interfaces.prompt.facade.PromptCategoryFacade;
import cloud.xcan.angus.core.ai.interfaces.prompt.facade.dto.PromptCategoryCreateDto;
import cloud.xcan.angus.core.ai.interfaces.prompt.facade.dto.PromptCategoryUpdateDto;
import cloud.xcan.angus.core.ai.interfaces.prompt.facade.internal.assembler.PromptCategoryAssembler;
import cloud.xcan.angus.core.ai.interfaces.prompt.facade.vo.PromptCategoryVo;
import cloud.xcan.angus.remote.message.http.ResourceNotFound;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * 提示词分类门面服务实现
 */
@Service
public class PromptCategoryFacadeImpl implements PromptCategoryFacade {

  @Resource
  private PromptCategoryCmd promptCategoryCmd;

  @Resource
  private PromptCategoryQuery promptCategoryQuery;

  @Resource
  private PromptCategoryAssembler promptCategoryAssembler;

  @Override
  public PromptCategoryVo create(PromptCategoryCreateDto dto) {
    PromptCategory category = promptCategoryCmd.create(
        dto.getName(),
        dto.getDescription(),
        dto.getIcon(),
        dto.getColor(),
        dto.getParentId()
    );
    return promptCategoryAssembler.toVo(category);
  }

  @Override
  public PromptCategoryVo update(Long id, PromptCategoryUpdateDto dto) {
    PromptCategory category = promptCategoryCmd.update(
        id,
        dto.getName(),
        dto.getDescription(),
        dto.getIcon(),
        dto.getColor(),
        dto.getParentId()
    );
    return promptCategoryAssembler.toVo(category);
  }

  @Override
  public PromptCategoryVo updateOrder(Long id, Integer newPosition) {
    promptCategoryCmd.updateOrder(id, newPosition);
    PromptCategory category = promptCategoryQuery.findById(id);
    return promptCategoryAssembler.toVo(category);
  }

  @Override
  public void delete(Long id) {
    promptCategoryCmd.delete(id);
  }

  @Override
  public void batchDelete(Long[] ids) {
    promptCategoryCmd.batchDelete(ids);
  }

  @Override
  public PromptCategoryVo getDetail(Long id) {
    PromptCategory category = promptCategoryQuery.findById(id);
    if (category == null) {
      throw ResourceNotFound.of("分类不存在", new Object[]{});
    }
    return promptCategoryAssembler.toVo(category);
  }

  @Override
  public List<PromptCategoryVo> getTree() {
    List<PromptCategory> allCategories = promptCategoryQuery.findAll();
    return buildTree(allCategories);
  }

  /**
   * 构建分类树
   */
  private List<PromptCategoryVo> buildTree(List<PromptCategory> categories) {
    // 转换为 VO
    List<PromptCategoryVo> vos = categories.stream()
        .map(promptCategoryAssembler::toVo)
        .collect(Collectors.toList());

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
