package cloud.xcan.angus.core.ai.interfaces.application.facade.dto;

import cloud.xcan.angus.core.ai.domain.application.ApplicationCategory;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.hibernate.validator.constraints.Length;

@Data
@Schema(description = "创建应用请求参数")
public class ApplicationCreateDto {

  @NotBlank(message = "应用名称不能为空")
  @Length(max = 50)
  @Schema(description = "应用名称", example = "我的智能助手", required = true)
  private String name;

  @NotBlank(message = "应用图标不能为空")
  @Schema(description = "应用图标（emoji或URL）", example = "🤖", required = true)
  private String icon;

  @Length(max = 400)
  @Schema(description = "应用描述", example = "这是一个智能助手应用")
  private String description;

  @NotNull(message = "应用分类不能为空")
  @Schema(description = "应用分类", required = true)
  private ApplicationCategory category;

  @Length(max = 20)
  @Schema(description = "默认语言", example = "zh-CN")
  private String language = "zh-CN";
}
