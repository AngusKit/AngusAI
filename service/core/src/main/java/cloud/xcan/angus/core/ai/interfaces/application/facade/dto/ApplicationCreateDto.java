package cloud.xcan.angus.core.ai.interfaces.application.facade.dto;

import static cloud.xcan.angus.spec.experimental.BizConstant.MAX_DESC_LENGTH_X4;
import static cloud.xcan.angus.spec.experimental.BizConstant.MAX_NAME_LENGTH;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import java.util.List;
import lombok.Data;
import org.hibernate.validator.constraints.Length;

@Data
@Schema(description = "创建应用请求参数")
public class ApplicationCreateDto {

  @NotBlank
  @Length(max = MAX_NAME_LENGTH)
  @Schema(description = "应用名称", example = "我的智能助手", requiredMode = Schema.RequiredMode.REQUIRED)
  private String name;

  @NotBlank
  @Schema(description = "应用图标（emoji或URL）", example = "🤖", requiredMode = Schema.RequiredMode.REQUIRED)
  private String icon;

  @Length(max = MAX_DESC_LENGTH_X4)
  @Schema(description = "应用描述", example = "这是一个智能助手应用")
  private String description;

  @Size(max = 5, message = "最多设置5个标签")
  @Schema(description = "应用标签（最多5个）")
  private List<String> tags;

  @NotEmpty
  @Schema(description = "绑定的智能体ID列表（必填，每个应用至少绑定一个智能体）", requiredMode = Schema.RequiredMode.REQUIRED)
  private List<Long> agentIds;

  @Schema(description = "默认智能体ID（用于对话，不传则取 agentIds 第一个）")
  private Long defaultAgentId;
}
