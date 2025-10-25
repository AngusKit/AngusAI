package cloud.xcan.angus.core.ai.interfaces.prompt.facade.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
@Schema(description = "更新分类请求参数")
public class PromptCategoryUpdateDto {

  @Size(max = 50, message = "分类名称长度不能超过50")
  @Schema(description = "分类名称")
  private String name;

  @Size(max = 200, message = "分类描述长度不能超过200")
  @Schema(description = "分类描述")
  private String description;

  @Size(max = 50, message = "图标名称长度不能超过50")
  @Schema(description = "图标名称")
  private String icon;

  @Size(max = 20, message = "颜色类名长度不能超过20")
  @Schema(description = "颜色类名")
  private String color;

  @Schema(description = "父分类ID（可选）")
  private Long parentId;

}
