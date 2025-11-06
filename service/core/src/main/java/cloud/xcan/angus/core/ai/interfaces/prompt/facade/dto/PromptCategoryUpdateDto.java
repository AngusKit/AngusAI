package cloud.xcan.angus.core.ai.interfaces.prompt.facade.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import org.hibernate.validator.constraints.Length;

@Data
@Schema(description = "更新分类请求参数")
public class PromptCategoryUpdateDto {

  @Length(max = 50)
  @Schema(description = "分类名称")
  private String name;

  @Length(max = 50)
  @Schema(description = "图标名称")
  private String icon;

  @Length(max = 100)
  @Schema(description = "颜色类名")
  private String color;

  @Schema(description = "父分类ID（可选）")
  private Long parentId;

}
