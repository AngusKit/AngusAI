package cloud.xcan.angus.core.ai.infra.ai.model;

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
  private String modelName;

  /**
   * 模型类型
   */
  private ModelType modelType;

  /**
   * 模型提供商
   */
  private ModelProvider provider;

  /**
   * 模型版本
   */
  private String version;

  /**
   * 模型描述
   */
  private String description;

  /**
   * API密钥
   */
  private String apiKey;

  /**
   * API基础URL
   */
  private String baseUrl;

  /**
   * 温度参数
   */
  @Builder.Default
  private Double temperature = 0.7;

  /**
   * 最大token数
   */
  @Builder.Default
  private Integer maxTokens = 2000;

  /**
   * 上下文窗口大小
   */
  private Integer contextWindow;

  /**
   * 超时时间（毫秒）
   */
  @Builder.Default
  private Long timeout = 30000L;

  /**
   * 重试次数
   */
  @Builder.Default
  private Integer retryCount = 3;

  /**
   * 是否启用流式响应
   */
  @Builder.Default
  private Boolean streaming = false;

  /**
   * 优先级（数字越小优先级越高）
   */
  @Builder.Default
  private Integer priority = 100;

  /**
   * 是否启用
   */
  @Builder.Default
  private Boolean enabled = true;

  /**
   * 是否本地部署
   */
  @Builder.Default
  private Boolean isLocal = false;

  /**
   * 是否OpenAI API兼容
   */
  @Builder.Default
  private Boolean openaiCompatible = false;

  /**
   * 成本等级（1-5，1最便宜，5最贵）
   */
  @Builder.Default
  private Integer costLevel = 3;

  /**
   * 性能等级（1-5，1最慢，5最快）
   */
  @Builder.Default
  private Integer performanceLevel = 3;

  /**
   * 模型特性
   */
  @Builder.Default
  private Set<ModelFeature> features = new HashSet<>();

  /**
   * 多模态支持类型
   */
  @Builder.Default
  private Set<String> multimodalityTypes = new HashSet<>();

  /**
   * 默认参数
   */
  @Builder.Default
  private Map<String, Object> defaultParams = new HashMap<>();

  /**
   * 支持的输入格式
   */
  @Builder.Default
  private Set<String> inputFormats = new HashSet<>();

  /**
   * 支持的输出格式
   */
  @Builder.Default
  private Set<String> outputFormats = new HashSet<>();

  /**
   * 业务场景标签
   */
  @Builder.Default
  private Set<String> businessScenarios = new HashSet<>();

  /**
   * 自定义参数（兼容旧版本）
   */
  @Builder.Default
  private Map<String, Object> customParams = new HashMap<>();

  /**
   * 创建OpenAI配置
   */
  public static ModelConfig createOpenAI(String apiKey, String modelName) {
    return ModelConfig.builder()
        .provider(ModelProvider.OPENAI)
        .modelName(modelName)
        .modelType(ModelType.CHAT)
        .apiKey(apiKey)
        .baseUrl("https://api.openai.com")
        .priority(10) // 高优先级
        .enabled(true)
        .description("OpenAI " + modelName + " 模型")
        .openaiCompatible(true)
        .costLevel(4)
        .performanceLevel(5)
        .build();
  }

  /**
   * 创建OpenAI配置（带优先级）
   */
  public static ModelConfig createOpenAI(String apiKey, String modelName, Integer priority) {
    return ModelConfig.builder()
        .provider(ModelProvider.OPENAI)
        .modelName(modelName)
        .modelType(ModelType.CHAT)
        .apiKey(apiKey)
        .baseUrl("https://api.openai.com")
        .priority(priority)
        .enabled(true)
        .description("OpenAI " + modelName + " 模型")
        .openaiCompatible(true)
        .costLevel(4)
        .performanceLevel(5)
        .build();
  }

  /**
   * 创建Anthropic配置
   */
  public static ModelConfig createAnthropic(String apiKey, String modelName) {
    return ModelConfig.builder()
        .provider(ModelProvider.ANTHROPIC)
        .modelName(modelName)
        .modelType(ModelType.CHAT)
        .apiKey(apiKey)
        .priority(20) // 高优先级
        .enabled(true)
        .description("Anthropic " + modelName + " 模型")
        .costLevel(4)
        .performanceLevel(4)
        .build();
  }

  /**
   * 创建Ollama配置
   */
  public static ModelConfig createOllama(String baseUrl, String modelName) {
    return ModelConfig.builder()
        .provider(ModelProvider.OLLAMA)
        .modelName(modelName)
        .modelType(ModelType.CHAT)
        .baseUrl(baseUrl)
        .priority(50) // 中优先级
        .enabled(true)
        .description("Ollama " + modelName + " 模型")
        .isLocal(true)
        .costLevel(1)
        .performanceLevel(3)
        .build();
  }

  /**
   * 创建DeepSeek配置
   */
  public static ModelConfig createDeepseek(String apiKey, String modelName) {
    return ModelConfig.builder()
        .provider(ModelProvider.DEEPSEEK)
        .modelName(modelName)
        .apiKey(apiKey)
        .baseUrl("https://api.deepseek.com")
        .build();
  }

  /**
   * 创建本地配置
   */
  public static ModelConfig createLocal(String baseUrl, String modelName) {
    return ModelConfig.builder()
        .provider(ModelProvider.LOCAL)
        .modelName(modelName)
        .baseUrl(baseUrl)
        .build();
  }

  /**
   * 创建自定义配置
   */
  public static ModelConfig createCustom(String apiKey, String baseUrl, String modelName) {
    return ModelConfig.builder()
        .provider(ModelProvider.CUSTOM)
        .modelName(modelName)
        .apiKey(apiKey)
        .baseUrl(baseUrl)
        .build();
  }

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
      case OLLAMA, LOCAL -> baseUrl != null && !baseUrl.trim().isEmpty();
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
        provider, modelName, modelType, baseUrl, temperature, maxTokens, priority, enabled,
        costLevel, performanceLevel);
  }
}
