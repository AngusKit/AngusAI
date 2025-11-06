package cloud.xcan.angus.core.ai.interfaces.prompt.facade.vo;

import cloud.xcan.angus.remote.vo.TenantAuditingVo;
import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
@Schema(description = "分类详情")
public class PromptCategoryVo  extends TenantAuditingVo {

  @Schema(description = "ID")
  private Long id;

  @Schema(description = "分类名称")
  private String name;

  @Schema(description = "图标名称")
  private String icon;

  @Schema(description = "颜色类名")
  private String color;

  @Schema(description = "父分类ID")
  private Long parentId;

  @Schema(description = "是否为系统分类")
  private Boolean isSystem;

  @Schema(description = "该分类下的提示词数量")
  private Long promptCount;

  @Schema(description = "排序")
  private Integer orderNum;

  @Schema(description = "子分类列表")
  private List<PromptCategoryVo> children;

}
