package cloud.xcan.angus.core.ai.interfaces.prompt.facade.internal;

import cloud.xcan.angus.core.ai.application.cmd.prompt.PromptCategoryCmd;
import cloud.xcan.angus.core.ai.application.query.prompt.PromptCategoryQuery;
import cloud.xcan.angus.core.ai.domain.prompt.PromptCategory;
import cloud.xcan.angus.core.ai.interfaces.prompt.facade.PromptCategoryFacade;
import cloud.xcan.angus.core.ai.interfaces.prompt.facade.dto.PromptCategoryCreateDto;
import cloud.xcan.angus.core.ai.interfaces.prompt.facade.dto.PromptCategoryUpdateDto;
import cloud.xcan.angus.core.ai.interfaces.prompt.facade.internal.assembler.PromptCategoryAssembler;
import cloud.xcan.angus.core.ai.interfaces.prompt.facade.vo.PromptCategoryVo;
import jakarta.annotation.Resource;
import java.util.List;
import org.springframework.stereotype.Service;

/**
 * 提示词分类门面服务实现
 */
@Service
public class PromptCategoryFacadeImpl implements PromptCategoryFacade {

  @Resource
  private PromptCategoryCmd promptCategoryCmd;

  @Resource
  private PromptCategoryQuery promptCategoryQuery;

  @Override
  public PromptCategoryVo create(PromptCategoryCreateDto dto) {
    PromptCategory category = PromptCategoryAssembler.toCreateDomain(dto);
    PromptCategory saved = promptCategoryCmd.create(category);
    return PromptCategoryAssembler.toVo(saved);
  }

  @Override
  public PromptCategoryVo update(Long id, PromptCategoryUpdateDto dto) {
    PromptCategory category = PromptCategoryAssembler.toUpdateDomain(id, dto);
    PromptCategory saved = promptCategoryCmd.update(category);
    return PromptCategoryAssembler.toVo(saved);
  }

  @Override
  public PromptCategoryVo updateOrder(Long id, Integer newPosition) {
    promptCategoryCmd.updateOrder(id, newPosition);
    PromptCategory category = promptCategoryQuery.findAndCheck(id);
    return PromptCategoryAssembler.toVo(category);
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
    PromptCategory category = promptCategoryQuery.findAndCheck(id);
    return PromptCategoryAssembler.toVo(category);
  }

  @Override
  public List<PromptCategoryVo> getTree() {
    List<PromptCategory> allCategories = promptCategoryQuery.findAll();
    return PromptCategoryAssembler.buildTree(allCategories);
  }

}
