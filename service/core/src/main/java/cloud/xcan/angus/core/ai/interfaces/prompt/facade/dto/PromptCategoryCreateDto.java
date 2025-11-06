package cloud.xcan.angus.core.ai.interfaces.prompt.facade.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import org.hibernate.validator.constraints.Length;

@Data
@Schema(description = "创建分类请求参数")
public class PromptCategoryCreateDto {

  @NotBlank
  @Length(max = 50, message = "分类名称长度不能超过50")
  @Schema(description = "分类名称", required = true)
  private String name;

  @Length(max = 50)
  @Schema(description = "图标名称")
  private String icon;

  @Length(max = 100)
  @Schema(description = "颜色类名")
  private String color;

  @Schema(description = "父分类ID（可选，为空表示根分类）")
  private Long parentId;

}
