package cloud.xcan.angus.core.ai.interfaces.prompt.facade.internal.assembler;

import cloud.xcan.angus.core.ai.application.query.prompt.PromptCategoryQuery;
import cloud.xcan.angus.core.ai.domain.prompt.Prompt;
import cloud.xcan.angus.core.ai.domain.prompt.PromptCategory;
import cloud.xcan.angus.core.ai.domain.prompt.PromptStatus;
import cloud.xcan.angus.core.ai.interfaces.prompt.facade.dto.PromptCreateDto;
import cloud.xcan.angus.core.ai.interfaces.prompt.facade.dto.PromptUpdateDto;
import cloud.xcan.angus.core.ai.interfaces.prompt.facade.vo.PromptDetailVo;
import cloud.xcan.angus.core.ai.interfaces.prompt.facade.vo.PromptListVo;
import cloud.xcan.angus.spec.utils.ObjectUtils;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.ZoneId;

/**
 * 提示词组装器
 */
@Component
public class PromptAssembler {

  @Resource
  private PromptCategoryQuery promptCategoryQuery;

  /**
   * CreateDTO 转换为领域对象
   */
  public Prompt toEntity(PromptCreateDto dto) {
    if (dto == null) {
      return null;
    }

    Prompt prompt = new Prompt();
    prompt.setTitle(dto.getTitle());
    prompt.setDescription(dto.getDescription());
    prompt.setContent(dto.getContent());
    prompt.setCategoryId(dto.getCategoryId());
    prompt.setTags(dto.getTags());
    prompt.setVariables(dto.getVariables());
    prompt.setExamples(dto.getExamples());
    prompt.setStatus(PromptStatus.ACTIVE);
    prompt.setIsPublic(false);
    prompt.setIsSystem(false);
    prompt.setIsFavorite(false);
    prompt.setUsageCount(0L);
    prompt.setArchived(false);

    return prompt;
  }

  /**
   * UpdateDTO 转换为领域对象
   */
  public Prompt toEntity(PromptUpdateDto dto) {
    if (dto == null) {
      return null;
    }

    Prompt prompt = new Prompt();
    if (ObjectUtils.isNotEmpty(dto.getTitle())) {
      prompt.setTitle(dto.getTitle());
    }
    if (ObjectUtils.isNotEmpty(dto.getDescription())) {
      prompt.setDescription(dto.getDescription());
    }
    if (ObjectUtils.isNotEmpty(dto.getContent())) {
      prompt.setContent(dto.getContent());
    }
    if (dto.getCategoryId() != null) {
      prompt.setCategoryId(dto.getCategoryId());
    }
    if (dto.getTags() != null) {
      prompt.setTags(dto.getTags());
    }
    if (dto.getVariables() != null) {
      prompt.setVariables(dto.getVariables());
    }
    if (dto.getExamples() != null) {
      prompt.setExamples(dto.getExamples());
    }
    if (dto.getIsPublic() != null) {
      prompt.setIsPublic(dto.getIsPublic());
    }

    return prompt;
  }

  /**
   * 领域对象转换为详情视图对象
   */
  public PromptDetailVo toDetailVo(Prompt prompt) {
    if (prompt == null) {
      return null;
    }

    PromptDetailVo vo = new PromptDetailVo();
    vo.setId(prompt.getId());
    vo.setTitle(prompt.getTitle());
    vo.setDescription(prompt.getDescription());
    vo.setContent(prompt.getContent());
    vo.setCategoryId(prompt.getCategoryId());
    vo.setTags(prompt.getTags());
    vo.setVariables(prompt.getVariables());
    vo.setExamples(prompt.getExamples());
    vo.setStatus(prompt.getStatus());
    vo.setIsPublic(prompt.getIsPublic());
    vo.setIsSystem(prompt.getIsSystem());
    vo.setIsFavorite(prompt.getIsFavorite());
    vo.setUsageCount(prompt.getUsageCount());
    vo.setCreatedDate(toTimestamp(prompt.getCreatedAt()));
    vo.setLastModifiedDate(toTimestamp(prompt.getUpdatedAt()));
    vo.setCreatedBy(prompt.getCreatedBy());

    // 获取分类名称
    if (prompt.getCategoryId() != null) {
      PromptCategory category = promptCategoryQuery.findById(prompt.getCategoryId());
      if (category != null) {
        vo.setCategoryName(category.getName());
      }
    }

    return vo;
  }

  /**
   * 领域对象转换为列表视图对象
   */
  public PromptListVo toListVo(Prompt prompt) {
    if (prompt == null) {
      return null;
    }

    PromptListVo vo = new PromptListVo();
    vo.setId(prompt.getId());
    vo.setTitle(prompt.getTitle());
    vo.setContent(prompt.getContent());
    vo.setCategoryId(prompt.getCategoryId());
    vo.setTags(prompt.getTags());
    vo.setStatus(prompt.getStatus());
    vo.setIsPublic(prompt.getIsPublic());
    vo.setIsSystem(prompt.getIsSystem());
    vo.setIsFavorite(prompt.getIsFavorite());
    vo.setUsageCount(prompt.getUsageCount());
    vo.setCreatedDate(toTimestamp(prompt.getCreatedAt()));
    vo.setLastModifiedDate(toTimestamp(prompt.getUpdatedAt()));
    vo.setCreatedBy(prompt.getCreatedBy());

    // 获取分类名称
    if (prompt.getCategoryId() != null) {
      PromptCategory category = promptCategoryQuery.findById(prompt.getCategoryId());
      if (category != null) {
        vo.setCategoryName(category.getName());
      }
    }

    return vo;
  }

  /**
   * LocalDateTime 转换为时间戳
   */
  private Long toTimestamp(LocalDateTime dateTime) {
    if (dateTime == null) {
      return null;
    }
    return dateTime.atZone(ZoneId.systemDefault()).toInstant().toEpochMilli();
  }

}
