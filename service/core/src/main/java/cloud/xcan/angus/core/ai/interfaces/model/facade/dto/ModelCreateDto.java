package cloud.xcan.angus.core.ai.interfaces.model.facade.dto;

import cloud.xcan.angus.core.ai.infra.ai.model.ModelProvider;
import cloud.xcan.angus.core.ai.infra.ai.model.ModelType;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.media.Schema.RequiredMode;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Data;
import org.hibernate.validator.constraints.Length;

@Data
@Schema(description = "创建模型请求参数")
public class ModelCreateDto {

  @NotBlank
  @Length(max = 50)
  @Schema(description = "模型名称", example = "GPT-4", requiredMode = RequiredMode.REQUIRED)
  private String name;

  @NotBlank
  @Length(max = 500)
  @Schema(description = "模型描述", example = "OpenAI GPT-4 语言模型", requiredMode = RequiredMode.REQUIRED)
  private String description;

  @NotNull
  @Schema(description = "模型类型", requiredMode = RequiredMode.REQUIRED)
  private ModelType type;

  @NotNull
  @Schema(description = "模型提供商", requiredMode = RequiredMode.REQUIRED)
  private ModelProvider provider;

  @Length(max = 40)
  @Schema(description = "版本号", example = "gpt-4-1106-preview")
  private String version;

  @Schema(description = "API端点", example = "https://api.openai.com/v1/chat/completions")
  private String apiEndpoint;

  @Schema(description = "API密钥")
  private String apiKey;

  @Schema(description = "温度参数")
  private Double temperature = 0.7;

  @Schema(description = "最大token数")
  private Integer maxTokens;

}
