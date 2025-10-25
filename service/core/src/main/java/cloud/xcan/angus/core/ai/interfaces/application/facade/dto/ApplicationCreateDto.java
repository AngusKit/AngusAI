package cloud.xcan.angus.core.ai.interfaces.application.facade.dto;

import cloud.xcan.angus.core.ai.domain.Constants;
import cloud.xcan.angus.core.ai.domain.application.ApplicationCategory;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.hibernate.validator.constraints.Length;

@Data
@Schema(description = "创建应用请求参数")
public class ApplicationCreateDto {

  @NotBlank
  @Length(max = Constants.APPLICATION_NAME_MAX_LENGTH)
  @Schema(description = "应用名称", example = "我的智能助手", requiredMode = Schema.RequiredMode.REQUIRED)
  private String name;

  @NotBlank
  @Schema(description = "应用图标（emoji或URL）", example = "🤖", requiredMode = Schema.RequiredMode.REQUIRED)
  private String icon;

  @Length(max = Constants.APPLICATION_DESCRIPTION_MAX_LENGTH)
  @Schema(description = "应用描述", example = "这是一个智能助手应用")
  private String description;

  @NotNull
  @Schema(description = "应用分类", requiredMode = Schema.RequiredMode.REQUIRED)
  private ApplicationCategory category;

  @Length(max = Constants.APPLICATION_LANGUAGE_MAX_LENGTH)
  @Schema(description = "默认语言", example = "zh-CN")
  private String language = "zh-CN";
}
