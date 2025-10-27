package cloud.xcan.angus.core.ai.infra.ai.model;

import jakarta.annotation.Resource;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

/**
 * 智能模型选择器 - 根据业务场景和需求自动选择最佳模型
 */
@Component
@Slf4j
public class SmartModelSelector {

  @Resource
  private ModelFeatureDetector featureDetector;

  /**
   * 业务场景枚举
   */
  public enum BusinessScenario {
    GENERAL_CHAT,           // 通用对话
    CODE_GENERATION,        // 代码生成
    CODE_REVIEW,           // 代码审查
    TRANSLATION,           // 翻译
    SUMMARIZATION,         // 摘要
    CREATIVE_WRITING,      // 创意写作
    TECHNICAL_WRITING,     // 技术写作
    DATA_ANALYSIS,         // 数据分析
    RESEARCH_ASSISTANT,    // 研究助手
    CUSTOMER_SERVICE,     // 客服
    EDUCATION,            // 教育
    MEDICAL,              // 医疗
    LEGAL,                // 法律
    FINANCE,              // 金融
    MARKETING,            // 营销
    IMAGE_GENERATION,     // 图像生成
    IMAGE_ANALYSIS,       // 图像分析
    AUDIO_TRANSCRIPTION,  // 音频转录
    AUDIO_SYNTHESIS,      // 音频合成
    TEXT_EMBEDDING,       // 文本嵌入
    CONTENT_MODERATION,   // 内容审核
    SAFETY_CHECK          // 安全检查
  }

  /**
   * 选择策略枚举
   */
  public enum SelectionStrategy {
    PERFORMANCE_FIRST,     // 性能优先
    COST_FIRST,           // 成本优先
    FEATURE_FIRST,        // 特性优先
    LOCAL_FIRST,          // 本地优先
    BALANCED              // 平衡策略
  }

  /**
   * 模型选择请求
   */
  @Getter
  public static class ModelSelectionRequest {

    // Getters
    private ModelType modelType;
    private BusinessScenario scenario;
    private SelectionStrategy strategy;
    private Set<ModelFeature> requiredFeatures;
    private Set<String> requiredMultimodalityTypes;
    private Integer maxCostLevel;
    private Integer minPerformanceLevel;
    private Boolean preferLocal;
    private Boolean requireOpenAICompatible;
    private String preferredProvider;

    // 构造器
    public static ModelSelectionRequest builder() {
      return new ModelSelectionRequest();
    }

    public ModelSelectionRequest modelType(ModelType modelType) {
      this.modelType = modelType;
      return this;
    }

    public ModelSelectionRequest scenario(BusinessScenario scenario) {
      this.scenario = scenario;
      return this;
    }

    public ModelSelectionRequest strategy(SelectionStrategy strategy) {
      this.strategy = strategy;
      return this;
    }

    public ModelSelectionRequest requiredFeatures(Set<ModelFeature> features) {
      this.requiredFeatures = features;
      return this;
    }

    public ModelSelectionRequest requiredMultimodalityTypes(Set<String> types) {
      this.requiredMultimodalityTypes = types;
      return this;
    }

    public ModelSelectionRequest maxCostLevel(Integer level) {
      this.maxCostLevel = level;
      return this;
    }

    public ModelSelectionRequest minPerformanceLevel(Integer level) {
      this.minPerformanceLevel = level;
      return this;
    }

    public ModelSelectionRequest preferLocal(Boolean prefer) {
      this.preferLocal = prefer;
      return this;
    }

    public ModelSelectionRequest requireOpenAICompatible(Boolean require) {
      this.requireOpenAICompatible = require;
      return this;
    }

    public ModelSelectionRequest preferredProvider(String provider) {
      this.preferredProvider = provider;
      return this;
    }

  }

  /**
   * 根据模型类型从配置列表中自动选择最佳模型
   */
  public Optional<ModelConfig> selectBestModel(ModelType modelType, List<ModelConfig> configs) {
    log.info("为模型类型 {} 从 {} 个配置中选择最佳模型", modelType, configs.size());

    // 过滤出指定类型且启用的模型，按优先级排序
    List<ModelConfig> filteredConfigs = configs.stream()
        .filter(config -> config.getModelType() == modelType)
        .filter(config -> config.getEnabled() != null && config.getEnabled())
        .sorted((a, b) -> Integer.compare(a.getPriority(), b.getPriority()))
        .toList();

    if (filteredConfigs.isEmpty()) {
      log.warn("未找到模型类型 {} 的配置", modelType);
      return Optional.empty();
    }

    // 返回优先级最高的模型
    ModelConfig bestModel = filteredConfigs.get(0);
    log.info("选择模型: {} (提供商: {}, 优先级: {})",
        bestModel.getModelName(), bestModel.getProvider(), bestModel.getPriority());

    return Optional.of(bestModel);
  }

  /**
   * 根据业务场景从配置列表中选择最佳模型
   */
  public Optional<ModelConfig> selectModelByScenario(BusinessScenario scenario,
      List<ModelConfig> configs) {
    log.info("为业务场景 {} 从 {} 个配置中选择最佳模型", scenario, configs.size());

    ModelType modelType = getModelTypeByScenario(scenario);

    // 过滤出包含指定业务场景的模型
    List<ModelConfig> filteredConfigs = configs.stream()
        .filter(config -> config.getBusinessScenarios() != null &&
            config.getBusinessScenarios().contains(scenario.name()))
        .filter(config -> config.getEnabled() != null && config.getEnabled())
        .sorted((a, b) -> Integer.compare(a.getPriority(), b.getPriority()))
        .toList();

    if (filteredConfigs.isEmpty()) {
      // 如果没有特定场景配置，则按模型类型选择
      log.info("未找到业务场景 {} 的配置，按模型类型选择", scenario);
      return selectBestModel(modelType, configs);
    }

    ModelConfig bestModel = filteredConfigs.get(0);
    log.info("选择模型: {} (提供商: {}, 场景: {})",
        bestModel.getModelName(), bestModel.getProvider(), scenario);

    return Optional.of(bestModel);
  }

  /**
   * 根据选择请求从配置列表中智能选择模型
   */
  public Optional<ModelConfig> selectModel(ModelSelectionRequest request,
      List<ModelConfig> configs) {
    log.info("智能选择模型: {} 从 {} 个配置中", request, configs.size());

    List<ModelConfig> candidates = getCandidateModels(request, configs);

    if (candidates.isEmpty()) {
      log.warn("未找到满足条件的模型");
      return Optional.empty();
    }

    ModelConfig selectedModel = applySelectionStrategy(candidates, request);
    log.info("选择模型: {} (提供商: {}, 策略: {})",
        selectedModel.getModelName(), selectedModel.getProvider(), request.getStrategy());

    return Optional.of(selectedModel);
  }

  /**
   * 根据特性要求从配置列表中选择模型
   */
  public Optional<ModelConfig> selectModelByFeatures(ModelType modelType,
      Set<ModelFeature> requiredFeatures, List<ModelConfig> configs) {
    log.info("根据特性选择模型: 类型={}, 特性={}, 从 {} 个配置中", modelType, requiredFeatures,
        configs.size());

    // 过滤满足特性要求的模型
    List<ModelConfig> filteredCandidates = configs.stream()
        .filter(config -> config.getModelType() == modelType)
        .filter(config -> config.getEnabled() != null && config.getEnabled())
        .filter(config -> config.getFeatures() != null && config.getFeatures()
            .containsAll(requiredFeatures))
        .sorted((a, b) -> Integer.compare(a.getPriority(), b.getPriority()))
        .toList();

    if (filteredCandidates.isEmpty()) {
      log.warn("未找到满足特性要求的模型");
      return Optional.empty();
    }

    ModelConfig selectedModel = filteredCandidates.get(0);
    log.info("选择模型: {} (提供商: {}, 特性: {})",
        selectedModel.getModelName(), selectedModel.getProvider(), requiredFeatures);

    return Optional.of(selectedModel);
  }

  /**
   * 根据成本等级从配置列表中选择模型
   */
  public Optional<ModelConfig> selectModelByCost(ModelType modelType, Integer maxCostLevel,
      List<ModelConfig> configs) {
    log.info("根据成本选择模型: 类型={}, 最大成本等级={}, 从 {} 个配置中", modelType, maxCostLevel,
        configs.size());

    List<ModelConfig> filteredCandidates = configs.stream()
        .filter(config -> config.getModelType() == modelType)
        .filter(config -> config.getEnabled() != null && config.getEnabled())
        .filter(config -> config.getCostLevel() != null && config.getCostLevel() <= maxCostLevel)
        .sorted((a, b) -> Integer.compare(a.getPriority(), b.getPriority()))
        .toList();

    if (filteredCandidates.isEmpty()) {
      log.warn("未找到满足成本要求的模型");
      return Optional.empty();
    }

    ModelConfig selectedModel = filteredCandidates.get(0);
    log.info("选择模型: {} (提供商: {}, 成本等级: {})",
        selectedModel.getModelName(), selectedModel.getProvider(), selectedModel.getCostLevel());

    return Optional.of(selectedModel);
  }

  /**
   * 根据性能等级从配置列表中选择模型
   */
  public Optional<ModelConfig> selectModelByPerformance(ModelType modelType,
      Integer minPerformanceLevel, List<ModelConfig> configs) {
    log.info("根据性能选择模型: 类型={}, 最小性能等级={}, 从 {} 个配置中", modelType,
        minPerformanceLevel, configs.size());

    List<ModelConfig> filteredCandidates = configs.stream()
        .filter(config -> config.getModelType() == modelType)
        .filter(config -> config.getEnabled() != null && config.getEnabled())
        .filter(config -> config.getPerformanceLevel() != null
            && config.getPerformanceLevel() >= minPerformanceLevel)
        .sorted((a, b) -> Integer.compare(a.getPriority(), b.getPriority()))
        .toList();

    if (filteredCandidates.isEmpty()) {
      log.warn("未找到满足性能要求的模型");
      return Optional.empty();
    }

    ModelConfig selectedModel = filteredCandidates.get(0);
    log.info("选择模型: {} (提供商: {}, 性能等级: {})",
        selectedModel.getModelName(), selectedModel.getProvider(),
        selectedModel.getPerformanceLevel());

    return Optional.of(selectedModel);
  }

  /**
   * 从配置列表中选择本地部署模型
   */
  public Optional<ModelConfig> selectLocalModel(ModelType modelType, List<ModelConfig> configs) {
    log.info("选择本地部署模型: 类型={}, 从 {} 个配置中", modelType, configs.size());

    List<ModelConfig> filteredCandidates = configs.stream()
        .filter(config -> config.getModelType() == modelType)
        .filter(config -> config.getEnabled() != null && config.getEnabled())
        .filter(config -> config.getIsLocal() != null && config.getIsLocal())
        .sorted((a, b) -> Integer.compare(a.getPriority(), b.getPriority()))
        .toList();

    if (filteredCandidates.isEmpty()) {
      log.warn("未找到本地部署的模型");
      return Optional.empty();
    }

    ModelConfig selectedModel = filteredCandidates.get(0);
    log.info("选择本地模型: {} (提供商: {})",
        selectedModel.getModelName(), selectedModel.getProvider());

    return Optional.of(selectedModel);
  }

  /**
   * 从配置列表中选择OpenAI API兼容模型
   */
  public Optional<ModelConfig> selectOpenAICompatibleModel(ModelType modelType,
      List<ModelConfig> configs) {
    log.info("选择OpenAI API兼容模型: 类型={}, 从 {} 个配置中", modelType, configs.size());

    List<ModelConfig> filteredCandidates = configs.stream()
        .filter(config -> config.getModelType() == modelType)
        .filter(config -> config.getEnabled() != null && config.getEnabled())
        .filter(config -> config.getOpenaiCompatible() != null && config.getOpenaiCompatible())
        .sorted((a, b) -> Integer.compare(a.getPriority(), b.getPriority()))
        .toList();

    if (filteredCandidates.isEmpty()) {
      log.warn("未找到OpenAI API兼容的模型");
      return Optional.empty();
    }

    ModelConfig selectedModel = filteredCandidates.get(0);
    log.info("选择OpenAI兼容模型: {} (提供商: {})",
        selectedModel.getModelName(), selectedModel.getProvider());

    return Optional.of(selectedModel);
  }

  /**
   * 从配置列表中获取候选模型列表
   */
  private List<ModelConfig> getCandidateModels(ModelSelectionRequest request,
      List<ModelConfig> configs) {
    // 应用过滤条件
    return configs.stream()
        .filter(config -> config.getModelType() == request.getModelType())
        .filter(config -> config.getEnabled() != null && config.getEnabled())
        .filter(config -> filterByProvider(config, request.getPreferredProvider()))
        .filter(config -> filterByCost(config, request.getMaxCostLevel()))
        .filter(config -> filterByPerformance(config, request.getMinPerformanceLevel()))
        .filter(config -> filterByLocal(config, request.getPreferLocal()))
        .filter(config -> filterByOpenAICompatible(config, request.getRequireOpenAICompatible()))
        .filter(config -> filterByFeatures(config, request.getRequiredFeatures()))
        .filter(config -> filterByMultimodality(config, request.getRequiredMultimodalityTypes()))
        .sorted((a, b) -> Integer.compare(a.getPriority(), b.getPriority()))
        .toList();
  }

  /**
   * 应用选择策略
   */
  private ModelConfig applySelectionStrategy(List<ModelConfig> candidates,
      ModelSelectionRequest request) {
    switch (request.getStrategy()) {
      case PERFORMANCE_FIRST:
        return candidates.stream()
            .min((a, b) -> Integer.compare(b.getPerformanceLevel(), a.getPerformanceLevel()))
            .orElse(candidates.get(0));
      case COST_FIRST:
        return candidates.stream()
            .min((a, b) -> Integer.compare(a.getCostLevel(), b.getCostLevel()))
            .orElse(candidates.get(0));
      case LOCAL_FIRST:
        return candidates.stream()
            .filter(ModelConfig::getIsLocal)
            .findFirst()
            .orElse(candidates.get(0));
      case FEATURE_FIRST:
        return candidates.stream()
            .max((a, b) -> Integer.compare(
                a.getFeatures() != null ? a.getFeatures().size() : 0,
                b.getFeatures() != null ? b.getFeatures().size() : 0))
            .orElse(candidates.get(0));
      default:
        // 平衡策略：综合考虑优先级、性能和成本
        return candidates.stream()
            .min((a, b) -> {
              int scoreA = calculateScore(a);
              int scoreB = calculateScore(b);
              return Integer.compare(scoreA, scoreB);
            })
            .orElse(candidates.get(0));
    }
  }

  /**
   * 计算模型综合评分
   */
  private int calculateScore(ModelConfig config) {
    int score = 0;

    // 优先级权重最高
    score += config.getPriority() * 10;

    // 性能等级权重
    score += (6 - config.getPerformanceLevel()) * 5;

    // 成本等级权重
    score += config.getCostLevel() * 3;

    // 特性数量权重
    if (config.getFeatures() != null) {
      score -= config.getFeatures().size() * 2;
    }

    return score;
  }

  /**
   * 根据业务场景获取模型类型
   */
  private ModelType getModelTypeByScenario(BusinessScenario scenario) {
    switch (scenario) {
      case IMAGE_GENERATION:
      case IMAGE_ANALYSIS:
        return ModelType.IMAGE;
      case AUDIO_TRANSCRIPTION:
      case AUDIO_SYNTHESIS:
        return ModelType.AUDIO;
      case TEXT_EMBEDDING:
        return ModelType.EMBEDDING;
      case CONTENT_MODERATION:
      case SAFETY_CHECK:
        return ModelType.MODERATION;
      default:
        return ModelType.CHAT;
    }
  }

  // 过滤方法
  private boolean filterByProvider(ModelConfig config, String preferredProvider) {
    return preferredProvider == null || config.getProvider().name().equals(preferredProvider);
  }

  private boolean filterByCost(ModelConfig config, Integer maxCostLevel) {
    return maxCostLevel == null || config.getCostLevel() <= maxCostLevel;
  }

  private boolean filterByPerformance(ModelConfig config, Integer minPerformanceLevel) {
    return minPerformanceLevel == null || config.getPerformanceLevel() >= minPerformanceLevel;
  }

  private boolean filterByLocal(ModelConfig config, Boolean preferLocal) {
    return preferLocal == null || !preferLocal || config.getIsLocal();
  }

  private boolean filterByOpenAICompatible(ModelConfig config, Boolean requireOpenAICompatible) {
    return requireOpenAICompatible == null || !requireOpenAICompatible
        || config.getOpenaiCompatible();
  }

  private boolean filterByFeatures(ModelConfig config, Set<ModelFeature> requiredFeatures) {
    return requiredFeatures == null || requiredFeatures.isEmpty() ||
        (config.getFeatures() != null && config.getFeatures().containsAll(requiredFeatures));
  }

  private boolean filterByMultimodality(ModelConfig config, Set<String> requiredTypes) {
    return requiredTypes == null || requiredTypes.isEmpty() ||
        (config.getMultimodalityTypes() != null && config.getMultimodalityTypes()
            .containsAll(requiredTypes));
  }
}
