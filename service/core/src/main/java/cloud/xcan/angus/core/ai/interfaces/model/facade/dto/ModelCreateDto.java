package cloud.xcan.angus.core.ai.interfaces.model.facade.dto;

import static cloud.xcan.angus.spec.experimental.BizConstant.MAX_DESC_LENGTH_X4;
import static cloud.xcan.angus.spec.experimental.BizConstant.MAX_KEY_LENGTH;
import static cloud.xcan.angus.spec.experimental.BizConstant.MAX_PARAM_VALUE_LENGTH;
import static cloud.xcan.angus.spec.experimental.BizConstant.MAX_URL_LENGTH_X2;

import cloud.xcan.agentx.core.model.ModelProvider;
import dev.langchain4j.model.catalog.ModelType;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.media.Schema.RequiredMode;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.Map;
import lombok.Data;
import org.hibernate.validator.constraints.Length;
import org.hibernate.validator.constraints.Range;

@Data
@Schema(description = "创建模型请求参数")
public class ModelCreateDto {

  @NotBlank
  @Length(max = MAX_KEY_LENGTH)
  @Schema(description = "模型名称", example = "GPT-4", requiredMode = RequiredMode.REQUIRED)
  private String name;

  @NotBlank
  @Length(max = MAX_DESC_LENGTH_X4)
  @Schema(description = "模型描述", example = "OpenAI GPT-4 语言模型", requiredMode = RequiredMode.REQUIRED)
  private String description;

  @NotNull
  @Schema(description = "模型类型", requiredMode = RequiredMode.REQUIRED)
  private ModelType type;

  @NotNull
  @Schema(description = "模型提供商", requiredMode = RequiredMode.REQUIRED)
  private ModelProvider provider;

  @Schema(description = "API Base URL（用于自托管或代理）", example = "https://api.openai.com/v1")
  @Length(max = MAX_URL_LENGTH_X2)
  private String baseUrl;

  @Length(max = MAX_PARAM_VALUE_LENGTH)
  @Schema(description = "API密钥")
  private String apiKey;

  @Schema(description = "温度参数")
  @Range(min = 0, max = 2)
  private Double temperature = 0.5;

  @Schema(description = "最大token数", example = "128000")
  private Integer maxTokens;

  @Length(max = MAX_KEY_LENGTH)
  @Schema(description = "Embedding 模型名称（用于 RAG 等场景）")
  private String embeddingModelName;

  @Schema(description = "是否为默认配置 — 多个模型时优先选择默认模型")
  private boolean defaultConfig = false;

  @Schema(description = "优先级 — 数值越大优先级越高；无默认模型时选择优先级最高的", example = "0")
  private Integer priority = 0;

  @Schema(description = "扩展参数")
  private Map<String, Object> extraProperties;

}
