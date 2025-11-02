package cloud.xcan.angus.core.ai.interfaces.knowledgebase.facade.internal;

import static cloud.xcan.angus.core.jpa.criteria.SearchCriteriaBuilder.getMatchSearchFields;
import static cloud.xcan.angus.core.utils.CoreUtils.buildVoPageResult;

import cloud.xcan.angus.core.ai.application.cmd.knowledgebase.KnowledgeBaseCmd;
import cloud.xcan.angus.core.ai.application.query.knowledgebase.KnowledgeBaseQuery;
import cloud.xcan.angus.core.ai.domain.Visibility;
import cloud.xcan.angus.core.ai.domain.knowledgebase.KnowledgeBase;
import cloud.xcan.angus.core.ai.interfaces.knowledgebase.facade.KnowledgeBaseFacade;
import cloud.xcan.angus.core.ai.interfaces.knowledgebase.facade.dto.KnowledgeBaseCreateDto;
import cloud.xcan.angus.core.ai.interfaces.knowledgebase.facade.dto.KnowledgeBaseFindDto;
import cloud.xcan.angus.core.ai.interfaces.knowledgebase.facade.dto.KnowledgeBaseToggleDto;
import cloud.xcan.angus.core.ai.interfaces.knowledgebase.facade.dto.KnowledgeBaseUpdateDto;
import cloud.xcan.angus.core.ai.interfaces.knowledgebase.facade.internal.assembler.KnowledgeBaseAssembler;
import cloud.xcan.angus.core.ai.interfaces.knowledgebase.facade.vo.KnowledgeBaseDetailVo;
import cloud.xcan.angus.core.ai.interfaces.knowledgebase.facade.vo.KnowledgeBaseListVo;
import cloud.xcan.angus.core.jpa.criteria.GenericSpecification;
import cloud.xcan.angus.remote.PageResult;
import jakarta.annotation.Resource;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;

@Component
public class KnowledgeBaseFacadeImpl implements KnowledgeBaseFacade {

  @Resource
  private KnowledgeBaseCmd knowledgeBaseCmd;

  @Resource
  private KnowledgeBaseQuery knowledgeBaseQuery;

  @Override
  public KnowledgeBaseDetailVo create(KnowledgeBaseCreateDto dto) {
    KnowledgeBase knowledgeBase = KnowledgeBaseAssembler.toCreateDomain(dto);
    KnowledgeBase saved = knowledgeBaseCmd.create(knowledgeBase);
    return KnowledgeBaseAssembler.toDetailVo(saved);
  }

  @Override
  public KnowledgeBaseDetailVo update(Long id, KnowledgeBaseUpdateDto dto) {
    KnowledgeBase knowledgeBase = KnowledgeBaseAssembler.toUpdateDomain(id, dto);
    KnowledgeBase saved = knowledgeBaseCmd.update(knowledgeBase);
    return KnowledgeBaseAssembler.toDetailVo(saved);
  }

  @Override
  public KnowledgeBaseDetailVo toggle(Long id, KnowledgeBaseToggleDto dto) {
    KnowledgeBase knowledgeBase = knowledgeBaseCmd.toggle(id, dto.getEnabled());
    return KnowledgeBaseAssembler.toDetailVo(knowledgeBase);
  }

  @Override
  public KnowledgeBaseDetailVo modifyVisibility(Long id, Visibility visibility) {
    KnowledgeBase knowledgeBase = knowledgeBaseCmd.modifyVisibility(id, visibility);
    return KnowledgeBaseAssembler.toDetailVo(knowledgeBase);
  }

  @Override
  public void delete(Long id) {
    knowledgeBaseCmd.delete(id);
  }

  @Override
  public KnowledgeBaseDetailVo getDetail(Long id) {
    KnowledgeBase knowledgeBase = knowledgeBaseQuery.findAndCheck(id);
    return KnowledgeBaseAssembler.toDetailVo(knowledgeBase);
  }

  @Override
  public PageResult<KnowledgeBaseListVo> list(KnowledgeBaseFindDto dto) {
    GenericSpecification<KnowledgeBase> spec = KnowledgeBaseAssembler.getSpecification(dto);
    Page<KnowledgeBase> page = knowledgeBaseQuery.find(spec, dto.tranPage(),
        dto.fullTextSearch, getMatchSearchFields(dto.getClass()));
    return buildVoPageResult(page, KnowledgeBaseAssembler::toListVo);
  }
}
