package cloud.xcan.angus.core.ai.interfaces.prompt.facade.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.media.Schema.RequiredMode;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;
import lombok.Data;

@Data
@Schema(description = "创建提示词请求参数")
public class PromptCreateDto {

  @NotBlank
  @Size(max = 100)
  @Schema(description = "提示词标题", requiredMode = RequiredMode.REQUIRED)
  private String title;

  @NotBlank
  @Size(max = 5000)
  @Schema(description = "提示词内容", requiredMode = RequiredMode.REQUIRED)
  private String content;

  @Size(max = 500)
  @Schema(description = "描述")
  private String description;

  @NotNull
  @Schema(description = "分类ID", requiredMode = RequiredMode.REQUIRED)
  private Long categoryId;

  @Schema(description = "标签")
  private List<String> tags;

}
