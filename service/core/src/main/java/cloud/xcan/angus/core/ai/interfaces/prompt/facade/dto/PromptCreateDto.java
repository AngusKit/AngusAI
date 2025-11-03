package cloud.xcan.angus.core.ai.interfaces.prompt.facade.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;
import lombok.Data;

@Data
@Schema(description = "创建提示词请求参数")
public class PromptCreateDto {

  @NotBlank(message = "标题不能为空")
  @Size(max = 100, message = "标题长度不能超过100")
  @Schema(description = "提示词标题", required = true)
  private String title;

  @NotBlank(message = "内容不能为空")
  @Size(max = 5000, message = "内容长度不能超过5000")
  @Schema(description = "提示词内容", required = true)
  private String content;

  @Size(max = 500, message = "描述长度不能超过500")
  @Schema(description = "描述")
  private String description;

  @NotNull(message = "分类不能为空")
  @Schema(description = "分类ID", required = true)
  private Long categoryId;

  @Schema(description = "标签")
  private List<String> tags;

}
