package cloud.xcan.angus.core.ai.interfaces.prompt.facade.internal.assembler;

import cloud.xcan.angus.core.ai.domain.prompt.Prompt;
import cloud.xcan.angus.core.ai.interfaces.prompt.facade.dto.PromptCreateDto;
import cloud.xcan.angus.core.ai.interfaces.prompt.facade.dto.PromptFindDto;
import cloud.xcan.angus.core.ai.interfaces.prompt.facade.dto.PromptUpdateDto;
import cloud.xcan.angus.core.ai.interfaces.prompt.facade.vo.PromptDetailVo;
import cloud.xcan.angus.core.ai.interfaces.prompt.facade.vo.PromptListVo;
import cloud.xcan.angus.core.ai.interfaces.prompt.facade.vo.PromptStatsVo;
import cloud.xcan.angus.core.jpa.criteria.GenericSpecification;
import cloud.xcan.angus.core.jpa.criteria.SearchCriteriaBuilder;
import cloud.xcan.angus.remote.search.SearchCriteria;
import java.util.Set;

public class PromptAssembler {

  public static Prompt toCreateDomain(PromptCreateDto dto) {
    Prompt prompt = new Prompt();
    prompt.setTitle(dto.getTitle());
    prompt.setDescription(dto.getDescription());
    prompt.setContent(dto.getContent());
    prompt.setCategoryId(dto.getCategoryId());
    prompt.setTags(dto.getTags());
    prompt.setUsageCount(0L);
    return prompt;
  }

  public static Prompt toUpdateDomain(Long id, PromptUpdateDto dto) {
    Prompt prompt = new Prompt();
    prompt.setId(id);
    prompt.setTitle(dto.getTitle());
    prompt.setDescription(dto.getDescription());
    prompt.setContent(dto.getContent());
    prompt.setCategoryId(dto.getCategoryId());
    prompt.setTags(dto.getTags());
    return prompt;
  }

  public static PromptDetailVo toDetailVo(Prompt prompt) {
    PromptDetailVo vo = new PromptDetailVo();
    vo.setId(prompt.getId());
    vo.setTitle(prompt.getTitle());
    vo.setDescription(prompt.getDescription());
    vo.setContent(prompt.getContent());
    vo.setCategoryId(prompt.getCategoryId());
    vo.setTags(prompt.getTags());

    // 设置关联状态
    vo.setIsFavorite(prompt.getIsFavorite());
    vo.setIsSystem(prompt.getIsSystem());

    // 设置统计信息
    PromptStatsVo statsVo = new PromptStatsVo();
    statsVo.setFavorites(prompt.getFavorites());
    statsVo.setTotalUses(prompt.getTotalUses());
    vo.setStats(statsVo);

    // 设置审计信息
    vo.setTenantId(prompt.getTenantId());
    vo.setCreatedBy(prompt.getCreatedBy());
    vo.setCreatedDate(prompt.getCreatedDate());
    vo.setModifiedBy(prompt.getModifiedBy());
    vo.setModifiedDate(prompt.getModifiedDate());
    return vo;
  }

  public static PromptListVo toListVo(Prompt prompt) {
    PromptListVo vo = new PromptListVo();
    vo.setId(prompt.getId());
    vo.setTitle(prompt.getTitle());
    vo.setContent(prompt.getContent());
    vo.setCategoryId(prompt.getCategoryId());
    vo.setTags(prompt.getTags());

    // 设置关联状态
    vo.setIsFavorite(prompt.getIsFavorite());
    vo.setIsSystem(prompt.getIsSystem());

    // 设置审计信息
    vo.setTenantId(prompt.getTenantId());
    vo.setCreatedBy(prompt.getCreatedBy());
    vo.setCreatedDate(prompt.getCreatedDate());
    vo.setModifiedBy(prompt.getModifiedBy());
    vo.setModifiedDate(prompt.getModifiedDate());
    return vo;
  }

  public static GenericSpecification<Prompt> getSpecification(PromptFindDto dto) {
    // Build the final filters
    Set<SearchCriteria> filters = new SearchCriteriaBuilder<>(dto)
        .rangeSearchFields("id", "createdDate", "modifiedDate")
        .orderByFields("id", "createdDate", "modifiedDate", "title")
        .matchSearchFields("title", "content")
        .build();
    return new GenericSpecification<>(filters);
  }
}
