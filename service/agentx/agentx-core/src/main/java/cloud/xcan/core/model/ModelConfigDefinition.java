package cloud.xcan.core.model;

import dev.langchain4j.model.catalog.ModelType;
import io.swagger.v3.oas.annotations.media.Schema;
import java.util.Map;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 模型配置定义 — 从数据库或其他外部源加载的模型配置
 */
@Schema(description = "模型配置定义 — 从数据库或外部源加载的模型配置")
@Data
@Builder
@NoArgsConstructor
public class ModelConfigDefinition {

  @Schema(description = "配置唯一标识", example = "config-001")
  private String id;

  @Schema(description = "模型提供商：OPEN_AI/ANTHROPIC/OLLAMA/GEMINI/QWEN/ZHIPU/DEEPSEEK 等")
  private ModelProvider provider;

  @Schema(description = "模型类型：chat/image/audio/embedding/moderation")
  private ModelType type;

  @Schema(description = "模型名称", example = "gpt-4")
  private String modelName;

  @Schema(description = "API Key（加密存储，敏感字段）")
  private String apiKey;

  @Schema(description = "API Base URL（用于自托管或代理）", example = "https://api.openai.com/v1")
  private String baseUrl;

  @Schema(description = "温度参数，0-2", example = "0.7")
  @Builder.Default
  private Double temperature = 0.7;

  @Schema(description = "最大 Token 数", example = "4096")
  @Builder.Default
  private Integer maxTokens = 4096;

  @Schema(description = "Embedding 模型名称（用于 RAG 等场景）")
  private String embeddingModelName;

  @Schema(description = "是否为默认配置 — 多个模型时优先选择默认模型")
  @Builder.Default
  private boolean defaultConfig = false;

  @Schema(description = "优先级 — 数值越大优先级越高；无默认模型时选择优先级最高的", example = "0")
  @Builder.Default
  private Integer priority = 0;

  @Schema(description = "租户 ID（null 为全局）")
  private String tenantId;

  @Schema(description = "扩展参数")
  private Map<String, Object> extraProperties;
}
