package cloud.xcan.angus.core.ai.interfaces.model.facade.dto;

import cloud.xcan.angus.core.ai.domain.model.ModelProvider;
import cloud.xcan.angus.core.ai.domain.model.ModelType;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import org.hibernate.validator.constraints.Length;

@Data
@Schema(description = "更新模型请求参数")
public class ModelUpdateDto {

  @Length(max = 50)
  @Schema(description = "模型名称", example = "GPT-4")
  private String name;

  @Length(max = 500)
  @Schema(description = "模型描述", example = "OpenAI GPT-4 语言模型")
  private String description;

  @Schema(description = "模型类型")
  private ModelType type;

  @Schema(description = "模型提供商")
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
}
