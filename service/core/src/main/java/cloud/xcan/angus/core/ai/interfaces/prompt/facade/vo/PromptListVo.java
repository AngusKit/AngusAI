package cloud.xcan.angus.core.ai.interfaces.prompt.facade.vo;

import cloud.xcan.angus.remote.NameJoinField;
import cloud.xcan.angus.remote.vo.TenantAuditingVo;
import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
@Schema(description = "提示词列表项")
public class PromptListVo extends TenantAuditingVo {

  @Schema(description = "ID")
  private Long id;

  @Schema(description = "标题")
  private String title;

  @Schema(description = "内容")
  private String content;

  @Schema(description = "分类ID")
  private Long categoryId;

  @Schema(description = "分类名称")
  @NameJoinField(id = "categoryId", repository = "promptCategoryRepo")
  private String categoryName;

  @Schema(description = "标签")
  private List<String> tags;

  @Schema(description = "是否收藏")
  private Boolean isFavorite;

  @Schema(description = "是否为系统模板")
  private Boolean isSystem;

}
