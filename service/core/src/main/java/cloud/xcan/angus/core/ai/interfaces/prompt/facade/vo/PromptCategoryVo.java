package cloud.xcan.angus.core.ai.interfaces.prompt.facade.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Schema(description = "分类详情")
public class PromptCategoryVo {

  @Schema(description = "ID")
  private Long id;

  @Schema(description = "分类名称（中文）")
  private String name;

  @Schema(description = "分类名称（英文）")
  private String nameEn;

  @Schema(description = "分类描述")
  private String description;

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

  @Schema(description = "创建时间")
  private LocalDateTime createdAt;

  @Schema(description = "最后修改时间")
  private LocalDateTime updatedAt;

  @Schema(description = "子分类列表")
  private List<PromptCategoryVo> children;

}
