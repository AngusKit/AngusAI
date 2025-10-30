package cloud.xcan.angus.core.ai.interfaces.prompt.facade.dto;

import cloud.xcan.angus.remote.PageQuery;
import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDateTime;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
@Schema(description = "查询提示词请求参数")
public class PromptFindDto extends PageQuery {

  @Schema(description = "提示词标题")
  private String title;

  @Schema(description = "分类ID")
  private Long categoryId;

  @Schema(description = "是否收藏")
  private Boolean isFavorite;

  @Schema(description = "所属租户ID", example = "1")
  private Long tenantId;

  @Schema(description = "创建人ID", example = "1")
  private Long createdBy;

  @Schema(description = "创建时间", example = "2024-10-12 00:00:00")
  private LocalDateTime createdDate;

  @Schema(description = "排序字段", allowableValues = {"id", "createdDate", "name", "size"})
  private String orderBy = "createdDate";

}
