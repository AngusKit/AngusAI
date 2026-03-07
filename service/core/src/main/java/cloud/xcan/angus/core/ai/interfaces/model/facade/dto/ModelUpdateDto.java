package cloud.xcan.angus.core.ai.interfaces.model.facade.dto;

import cloud.xcan.agentx.core.model.ModelProvider;
import dev.langchain4j.model.catalog.ModelType;
import io.swagger.v3.oas.annotations.media.Schema;
import java.util.Map;
import lombok.Data;
import org.hibernate.validator.constraints.Length;
import org.hibernate.validator.constraints.Range;

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

  @Schema(description = "API Base URL（用于自托管或代理）", example = "https://api.openai.com/v1")
  @Length(max = 400)
  private String baseUrl;

  @Length(max = 4096)
  @Schema(description = "API密钥")
  private String apiKey;

  @Schema(description = "温度参数")
  @Range(min = 0, max = 2)
  private Double temperature;

  @Schema(description = "最大token数", example = "128000")
  private Integer maxTokens;

  @Schema(description = "Embedding 模型名称（用于 RAG 等场景）")
  private String embeddingModelName;

  @Schema(description = "是否为默认配置 — 多个模型时优先选择默认模型")
  private boolean defaultConfig = false;

  @Schema(description = "优先级 — 数值越大优先级越高；无默认模型时选择优先级最高的", example = "0")
  private Integer priority = 0;

  @Schema(description = "租户 ID（null 为全局）")
  private String tenantId;

  @Schema(description = "扩展参数")
  private Map<String, Object> extraProperties;
}
