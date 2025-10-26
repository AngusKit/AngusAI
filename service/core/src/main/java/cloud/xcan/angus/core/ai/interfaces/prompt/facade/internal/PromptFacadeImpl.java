package cloud.xcan.angus.core.ai.interfaces.prompt.facade.internal;

import cloud.xcan.angus.core.ai.application.cmd.prompt.PromptCmd;
import cloud.xcan.angus.core.ai.application.query.prompt.PromptQuery;
import cloud.xcan.angus.core.ai.domain.prompt.Prompt;
import cloud.xcan.angus.core.ai.interfaces.prompt.facade.PromptFacade;
import cloud.xcan.angus.core.ai.interfaces.prompt.facade.dto.PromptCreateDto;
import cloud.xcan.angus.core.ai.interfaces.prompt.facade.dto.PromptFindDto;
import cloud.xcan.angus.core.ai.interfaces.prompt.facade.dto.PromptUpdateDto;
import cloud.xcan.angus.core.ai.interfaces.prompt.facade.internal.assembler.PromptAssembler;
import cloud.xcan.angus.core.ai.interfaces.prompt.facade.vo.PromptDetailVo;
import cloud.xcan.angus.core.ai.interfaces.prompt.facade.vo.PromptListVo;
import cloud.xcan.angus.core.utils.CoreUtils;
import cloud.xcan.angus.remote.PageResult;
import cloud.xcan.angus.remote.message.http.ResourceNotFound;
import jakarta.annotation.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
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
  private PromptAssembler promptAssembler;

  @Override
  public PromptDetailVo create(PromptCreateDto dto) {
    Prompt prompt = promptAssembler.toEntity(dto);
    prompt = promptCmd.create(prompt);
    return promptAssembler.toDetailVo(prompt);
  }

  @Override
  public PromptDetailVo update(Long id, PromptUpdateDto dto) {
    Prompt prompt = promptAssembler.toEntity(dto);
    prompt = promptCmd.update(prompt);
    return promptAssembler.toDetailVo(prompt);
  }

  @Override
  public PromptDetailVo toggleFavorite(Long id, Boolean isFavorite) {
    Prompt prompt = promptCmd.toggleFavorite(id, isFavorite);
    return promptAssembler.toDetailVo(prompt);
  }

  @Override
  public PromptDetailVo duplicate(Long id, String title) {
    Prompt prompt = promptCmd.duplicate(id, title);
    return promptAssembler.toDetailVo(prompt);
  }

  @Override
  public PromptDetailVo use(Long id) {
    Prompt prompt = promptCmd.use(id);
    return promptAssembler.toDetailVo(prompt);
  }

  @Override
  public void delete(Long id) {
    promptCmd.delete(id);
  }

  @Override
  public PromptDetailVo getDetail(Long id) {
    Prompt prompt = promptQuery.findById(id);
    if (prompt == null) {
      throw ResourceNotFound.of("提示词不存在", new Object[]{});
    }
    return promptAssembler.toDetailVo(prompt);
  }

  @Override
  public PageResult<PromptListVo> list(PromptFindDto dto) {
    // 使用固定分页参数
    PageRequest pageRequest = PageRequest.of(0, 20);
    
    // 根据条件选择不同的查询方法
    Page<Prompt> page;
    if (dto.getIsFavorite() != null && dto.getIsFavorite()) {
      // 查询收藏的提示词
      page = promptQuery.findFavoritePrompts(null, pageRequest);
    } else {
      // 查询最近的提示词
      page = promptQuery.findRecentPrompts(pageRequest);
    }
    
    return CoreUtils.buildVoPageResult(page, promptAssembler::toListVo);
  }

}
