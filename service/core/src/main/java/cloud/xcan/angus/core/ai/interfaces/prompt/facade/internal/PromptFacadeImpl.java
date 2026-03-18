package cloud.xcan.angus.core.ai.interfaces.prompt.facade.internal;

import static cloud.xcan.angus.core.jpa.criteria.SearchCriteriaBuilder.getMatchSearchFields;
import static cloud.xcan.angus.core.utils.CoreUtils.buildVoPageResult;

import cloud.xcan.angus.api.commonlink.FullResourceType;
import cloud.xcan.angus.core.ai.application.cmd.activity.ActivityCmd;
import cloud.xcan.angus.core.ai.application.cmd.prompt.PromptCmd;
import cloud.xcan.angus.core.ai.domain.activity.ActivityActions;
import cloud.xcan.angus.core.ai.application.query.prompt.PromptQuery;
import cloud.xcan.angus.core.ai.domain.prompt.Prompt;
import cloud.xcan.angus.core.ai.interfaces.prompt.facade.PromptFacade;
import cloud.xcan.angus.core.ai.interfaces.prompt.facade.dto.PromptCreateDto;
import cloud.xcan.angus.core.ai.interfaces.prompt.facade.dto.PromptFindDto;
import cloud.xcan.angus.core.ai.interfaces.prompt.facade.dto.PromptUpdateDto;
import cloud.xcan.angus.core.ai.interfaces.prompt.facade.internal.assembler.PromptAssembler;
import cloud.xcan.angus.core.ai.interfaces.prompt.facade.vo.PromptDetailVo;
import cloud.xcan.angus.core.ai.interfaces.prompt.facade.vo.PromptListVo;
import cloud.xcan.angus.core.jpa.criteria.GenericSpecification;
import cloud.xcan.angus.remote.PageResult;
import jakarta.annotation.Resource;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

/**
 * 提示词门面服务实现
 */
@Service
public class PromptFacadeImpl implements PromptFacade {

  @Resource
  private PromptCmd promptCmd;

  @Resource
  private PromptQuery promptQuery;

  @Resource
  private ActivityCmd activityCmd;

  @Override
  public PromptDetailVo create(PromptCreateDto dto) {
    Prompt prompt = PromptAssembler.toCreateDomain(dto);
    Prompt saved = promptCmd.create(prompt);
    return PromptAssembler.toDetailVo(saved);
  }

  @Override
  public PromptDetailVo update(Long id, PromptUpdateDto dto) {
    Prompt prompt = PromptAssembler.toUpdateDomain(id, dto);
    Prompt saved = promptCmd.update(prompt);
    return PromptAssembler.toDetailVo(saved);
  }

  @Override
  public PromptDetailVo toggleFavorite(Long id, Boolean isFavorite) {
    Prompt prompt = promptCmd.toggleFavorite(id, isFavorite);
    return PromptAssembler.toDetailVo(prompt);
  }

  @Override
  public PromptDetailVo duplicate(Long id, String title) {
    Prompt prompt = promptCmd.duplicate(id, title);
    return PromptAssembler.toDetailVo(prompt);
  }

  @Override
  public PromptDetailVo use(Long id) {
    Prompt prompt = promptCmd.use(id);
    return PromptAssembler.toDetailVo(prompt);
  }

  @Override
  public void delete(Long id) {
    Prompt existing = promptQuery.findAndCheck(id);
    promptCmd.delete(id);
    activityCmd.recordActivity(FullResourceType.PROMPT, id, existing.getTitle(),
        ActivityActions.ACTIVITY_PROMPT_DELETED);
  }

  @Override
  public PromptDetailVo getDetail(Long id) {
    Prompt prompt = promptQuery.findAndCheck(id);
    return PromptAssembler.toDetailVo(prompt);
  }

  @Override
  public PageResult<PromptListVo> list(PromptFindDto dto) {
    GenericSpecification<Prompt> spec = PromptAssembler.getSpecification(dto);
    Page<Prompt> page = promptQuery.find(spec, dto.tranPage(),
        dto.fullTextSearch, getMatchSearchFields(dto.getClass()));
    return buildVoPageResult(page, PromptAssembler::toListVo);
  }
}
