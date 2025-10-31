package cloud.xcan.angus.core.ai.infra.ai.model;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * AI模型配置类 - 支持动态参数配置
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ModelConfig {

  /**
   * 模型名称
   */
  @NotEmpty
  @Schema(description = "模型名称，例如 gpt-4o-mini")
  private String modelName;

  /**
   * 模型类型
   */
  @NotNull
  @Schema(description = "模型类型，如：CHAT, EMBEDDING, VISION 等")
  private ModelType modelType;

  /**
   * 模型提供商
   */
  @NotNull
  @Schema(description = "模型提供商，如：OPENAI、ANTHROPIC、OLLAMA 等")
  private ModelProvider provider;

  /**
   * 模型版本
   */
  @NotNull
  @Schema(description = "模型版本标识")
  private String version;

  /**
   * 模型描述
   */
  @Schema(description = "模型用途或能力描述")
  private String description;

  /**
   * API密钥
   */
  @NotEmpty
  @Schema(description = "访问模型所需的API密钥")
  private String apiKey;

  /**
   * API基础URL
   */
  @NotEmpty
  @Schema(description = "模型服务的基础URL")
  private String apiEndpoint;

  /**
   * 温度参数
   */
  @Builder.Default
  @Schema(description = "温度，控制创造性，通常0.0-1.0")
  private Double temperature = 0.7;

  /**
   * 最大token数
   */
  @Builder.Default
  @Schema(description = "最大生成token数")
  private Integer maxTokens = 2000;

  /**
   * 上下文窗口大小
   */
  @Schema(description = "上下文窗口大小，模型最大可处理的上下文长度")
  private Integer contextWindow;

  /**
   * 超时时间（毫秒）
   */
  @Builder.Default
  @Schema(description = "请求超时时间（毫秒）")
  private Long timeout = 30000L;

  /**
   * 重试次数
   */
  @Builder.Default
  @Schema(description = "失败重试次数")
  private Integer retryCount = 3;

  /**
   * 是否启用流式响应
   */
  @Builder.Default
  @Schema(description = "是否启用流式响应")
  private Boolean streaming = false;

  /**
   * 优先级（数字越小优先级越高）
   */
  @Builder.Default
  @Schema(description = "优先级（越小越高）")
  private Integer priority = 100;

  /**
   * 是否启用
   */
  @Builder.Default
  @Schema(description = "是否启用该模型配置")
  private Boolean enabled = true;

  /**
   * 是否本地部署
   */
  @Builder.Default
  @Schema(description = "是否本地部署模型")
  private Boolean isLocal = false;

  /**
   * 是否OpenAI API兼容
   */
  @Builder.Default
  @Schema(description = "是否兼容OpenAI API接口")
  private Boolean openaiCompatible = false;

  /**
   * 成本等级（1-5，1最便宜，5最贵）
   */
  @Builder.Default
  @Schema(description = "成本等级（1-5）")
  private Integer costLevel = 3;

  /**
   * 性能等级（1-5，1最慢，5最快）
   */
  @Builder.Default
  @Schema(description = "性能等级（1-5）")
  private Integer performanceLevel = 3;

  /**
   * 模型特性
   */
  @Builder.Default
  @Schema(description = "模型支持的特性枚举集合")
  private Set<ModelFeature> features = new HashSet<>();

  /**
   * 多模态支持类型
   */
  @Builder.Default
  @Schema(description = "支持的多模态类型，例如：image, audio")
  private Set<String> multimodalityTypes = new HashSet<>();

  /**
   * 默认参数
   */
  @Builder.Default
  @Schema(description = "默认请求参数键值对")
  private Map<String, Object> defaultParams = new HashMap<>();

  /**
   * 支持的输入格式
   */
  @Builder.Default
  @Schema(description = "支持的输入格式集合")
  private Set<String> inputFormats = new HashSet<>();

  /**
   * 支持的输出格式
   */
  @Builder.Default
  @Schema(description = "支持的输出格式集合")
  private Set<String> outputFormats = new HashSet<>();

  /**
   * 业务场景标签
   */
  @Builder.Default
  @Schema(description = "业务场景标签集合")
  private Set<String> businessScenarios = new HashSet<>();

  /**
   * 自定义参数（兼容旧版本）
   */
  @Builder.Default
  @Schema(description = "自定义参数（兼容旧版配置）")
  private Map<String, Object> customParams = new HashMap<>();

  /**
   * 添加自定义参数
   */
  public ModelConfig addCustomParam(String key, Object value) {
    if (this.customParams == null) {
      this.customParams = new HashMap<>();
    }
    this.customParams.put(key, value);
    return this;
  }

  /**
   * 设置温度参数
   */
  public ModelConfig withTemperature(Double temperature) {
    this.temperature = temperature;
    return this;
  }

  /**
   * 设置最大token数
   */
  public ModelConfig withMaxTokens(Integer maxTokens) {
    this.maxTokens = maxTokens;
    return this;
  }

  /**
   * 设置超时时间
   */
  public ModelConfig withTimeout(Long timeout) {
    this.timeout = timeout;
    return this;
  }

  /**
   * 设置重试次数
   */
  public ModelConfig withRetryCount(Integer retryCount) {
    this.retryCount = retryCount;
    return this;
  }

  /**
   * 启用流式响应
   */
  public ModelConfig enableStreaming() {
    this.streaming = true;
    return this;
  }

  /**
   * 禁用流式响应
   */
  public ModelConfig disableStreaming() {
    this.streaming = false;
    return this;
  }

  /**
   * 设置优先级
   */
  public ModelConfig withPriority(Integer priority) {
    this.priority = priority;
    return this;
  }

  /**
   * 启用模型
   */
  public ModelConfig enable() {
    this.enabled = true;
    return this;
  }

  /**
   * 禁用模型
   */
  public ModelConfig disable() {
    this.enabled = false;
    return this;
  }

  /**
   * 设置描述信息
   */
  public ModelConfig withDescription(String description) {
    this.description = description;
    return this;
  }

  /**
   * 设置模型类型
   */
  public ModelConfig withModelType(ModelType modelType) {
    this.modelType = modelType;
    return this;
  }

  /**
   * 设置版本
   */
  public ModelConfig withVersion(String version) {
    this.version = version;
    return this;
  }

  /**
   * 设置上下文窗口大小
   */
  public ModelConfig withContextWindow(Integer contextWindow) {
    this.contextWindow = contextWindow;
    return this;
  }

  /**
   * 设置本地部署
   */
  public ModelConfig asLocal() {
    this.isLocal = true;
    return this;
  }

  /**
   * 设置OpenAI兼容
   */
  public ModelConfig asOpenAICompatible() {
    this.openaiCompatible = true;
    return this;
  }

  /**
   * 设置成本等级
   */
  public ModelConfig withCostLevel(Integer costLevel) {
    this.costLevel = costLevel;
    return this;
  }

  /**
   * 设置性能等级
   */
  public ModelConfig withPerformanceLevel(Integer performanceLevel) {
    this.performanceLevel = performanceLevel;
    return this;
  }

  /**
   * 添加模型特性
   */
  public ModelConfig addFeature(ModelFeature feature) {
    if (this.features == null) {
      this.features = new HashSet<>();
    }
    this.features.add(feature);
    return this;
  }

  /**
   * 添加多模态类型
   */
  public ModelConfig addMultimodalityType(String type) {
    if (this.multimodalityTypes == null) {
      this.multimodalityTypes = new HashSet<>();
    }
    this.multimodalityTypes.add(type);
    return this;
  }

  /**
   * 添加业务场景
   */
  public ModelConfig addBusinessScenario(String scenario) {
    if (this.businessScenarios == null) {
      this.businessScenarios = new HashSet<>();
    }
    this.businessScenarios.add(scenario);
    return this;
  }

  /**
   * 添加输入格式
   */
  public ModelConfig addInputFormat(String format) {
    if (this.inputFormats == null) {
      this.inputFormats = new HashSet<>();
    }
    this.inputFormats.add(format);
    return this;
  }

  /**
   * 添加输出格式
   */
  public ModelConfig addOutputFormat(String format) {
    if (this.outputFormats == null) {
      this.outputFormats = new HashSet<>();
    }
    this.outputFormats.add(format);
    return this;
  }

  /**
   * 设置高优先级（优先级1）
   */
  public ModelConfig withHighPriority() {
    this.priority = 1;
    return this;
  }

  /**
   * 设置中优先级（优先级50）
   */
  public ModelConfig withMediumPriority() {
    this.priority = 50;
    return this;
  }

  /**
   * 设置低优先级（优先级100）
   */
  public ModelConfig withLowPriority() {
    this.priority = 100;
    return this;
  }

  /**
   * 验证配置是否完整
   */
  public boolean isValid() {
    if (provider == null || modelName == null || modelName.trim().isEmpty()) {
      return false;
    }

    if (modelType == null) {
      return false;
    }

    // 检查优先级范围
    if (priority == null || priority < 1 || priority > 1000) {
      return false;
    }

    // 检查成本等级范围
    if (costLevel == null || costLevel < 1 || costLevel > 5) {
      return false;
    }

    // 检查性能等级范围
    if (performanceLevel == null || performanceLevel < 1 || performanceLevel > 5) {
      return false;
    }

    // 检查必要的参数
    return switch (provider) {
      case OPENAI, ANTHROPIC, AZURE_OPENAI, GOOGLE_VERTEXAI, AMAZON_BEDROCK, MISTRAL_AI, DEEPSEEK,
           MOONSHOT_AI, ZHIPU_AI, MINIMAX, GROQ, NVIDIA, PERPLEXITY, QIANFAN, HUGGINGFACE,
           ONNX_TRANSFORMERS, POSTGRESML, CUSTOM -> apiKey != null && !apiKey.trim().isEmpty();
      case OLLAMA, LOCAL -> apiEndpoint != null && !apiEndpoint.trim().isEmpty();
      default -> false;
    };
  }

  /**
   * 验证配置是否可用（启用且有效）
   */
  public boolean isAvailable() {
    return enabled != null && enabled && isValid();
  }

  /**
   * 获取配置摘要
   */
  public String getSummary() {
    return String.format(
        "ModelConfig{provider=%s, model=%s, type=%s, baseUrl=%s, temperature=%.2f, maxTokens=%d, priority=%d, enabled=%s, costLevel=%d, performanceLevel=%d}",
        provider, modelName, modelType, apiEndpoint, temperature, maxTokens, priority, enabled,
        costLevel, performanceLevel);
  }
}
