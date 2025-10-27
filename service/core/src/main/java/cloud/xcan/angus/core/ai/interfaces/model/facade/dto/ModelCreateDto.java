package cloud.xcan.angus.core.ai.interfaces.model.facade.dto;

import cloud.xcan.angus.core.ai.infra.ai.model.ModelProvider;
import cloud.xcan.angus.core.ai.infra.ai.model.ModelType;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.hibernate.validator.constraints.Length;

@Data
@Schema(description = "创建模型请求参数")
public class ModelCreateDto {

  @NotBlank(message = "模型名称不能为空")
  @Length(max = 50)
  @Schema(description = "模型名称", example = "GPT-4", required = true)
  private String name;

  @NotBlank(message = "模型描述不能为空")
  @Length(max = 500)
  @Schema(description = "模型描述", example = "OpenAI GPT-4 语言模型", required = true)
  private String description;

  @NotNull(message = "模型类型不能为空")
  @Schema(description = "模型类型", required = true)
  private ModelType type;

  @NotNull(message = "模型提供商不能为空")
  @Schema(description = "模型提供商", required = true)
  private ModelProvider provider;

  @Length(max = 20)
  @Schema(description = "版本号", example = "gpt-4-1106-preview")
  private String version;

  @Schema(description = "API端点", example = "https://api.openai.com/v1/chat/completions")
  private String apiEndpoint;

  @Schema(description = "API密钥")
  private String apiKey;

  @Schema(description = "模型参数配置")
  private Object parameters;

  @Schema(description = "部署配置")
  private Object deployment;

  @Schema(description = "限制配置")
  private Object limits;

  @Schema(description = "是否立即部署", example = "false")
  private Boolean autoDeploy = false;
}
