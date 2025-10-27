package cloud.xcan.angus.core.ai.interfaces.prompt.facade.dto;

import cloud.xcan.angus.core.ai.domain.prompt.PromptStatus;
import cloud.xcan.angus.core.jpa.criteria.SearchCriteria;
import cloud.xcan.angus.remote.PageQuery;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
@Schema(description = "查询提示词请求参数")
public class PromptFindDto extends PageQuery {

  @Schema(description = "分类ID")
  private Long categoryId;

  @Schema(description = "仅收藏")
  private Boolean isFavorite;

  @Schema(description = "标签筛选")
  private String[] tags;

  @Schema(description = "排序字段")
  private String orderBy;

  @Schema(description = "排序方式")
  private String orderSort;

  @Schema(description = "是否公开")
  private Boolean isPublic;

  @Schema(description = "状态")
  private PromptStatus status;

}
