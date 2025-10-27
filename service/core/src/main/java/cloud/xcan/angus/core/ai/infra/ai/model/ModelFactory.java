package cloud.xcan.angus.core.ai.infra.ai.model;

import com.azure.ai.openai.OpenAIClient;
import com.azure.ai.openai.OpenAIClientBuilder;
import com.google.cloud.vertexai.VertexAI;
import jakarta.annotation.Resource;
import java.time.Duration;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.anthropic.AnthropicChatModel;
import org.springframework.ai.anthropic.AnthropicChatOptions;
import org.springframework.ai.anthropic.api.AnthropicApi;
import org.springframework.ai.azure.openai.AzureOpenAiChatModel;
import org.springframework.ai.azure.openai.AzureOpenAiChatOptions;
import org.springframework.ai.azure.openai.AzureOpenAiEmbeddingModel;
import org.springframework.ai.azure.openai.AzureOpenAiImageModel;
import org.springframework.ai.azure.openai.AzureOpenAiImageOptions;
import org.springframework.ai.bedrock.cohere.BedrockCohereEmbeddingModel;
import org.springframework.ai.bedrock.cohere.BedrockCohereEmbeddingOptions;
import org.springframework.ai.bedrock.cohere.api.CohereEmbeddingBedrockApi;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.ai.deepseek.DeepSeekChatModel;
import org.springframework.ai.deepseek.DeepSeekChatOptions;
import org.springframework.ai.deepseek.api.DeepSeekApi;
import org.springframework.ai.embedding.EmbeddingModel;
import org.springframework.ai.huggingface.HuggingfaceChatModel;
import org.springframework.ai.image.ImageModel;
import org.springframework.ai.minimax.MiniMaxChatModel;
import org.springframework.ai.minimax.MiniMaxChatOptions;
import org.springframework.ai.minimax.api.MiniMaxApi;
import org.springframework.ai.mistralai.MistralAiChatModel;
import org.springframework.ai.mistralai.MistralAiChatOptions;
import org.springframework.ai.mistralai.MistralAiEmbeddingModel;
import org.springframework.ai.mistralai.api.MistralAiApi;
import org.springframework.ai.mistralai.api.MistralAiModerationApi;
import org.springframework.ai.mistralai.moderation.MistralAiModerationModel;
import org.springframework.ai.moderation.ModerationModel;
import org.springframework.ai.ollama.OllamaChatModel;
import org.springframework.ai.ollama.OllamaEmbeddingModel;
import org.springframework.ai.ollama.api.OllamaApi;
import org.springframework.ai.ollama.api.OllamaOptions;
import org.springframework.ai.openai.OpenAiAudioSpeechModel;
import org.springframework.ai.openai.OpenAiAudioSpeechOptions;
import org.springframework.ai.openai.OpenAiChatModel;
import org.springframework.ai.openai.OpenAiChatOptions;
import org.springframework.ai.openai.OpenAiEmbeddingModel;
import org.springframework.ai.openai.OpenAiImageModel;
import org.springframework.ai.openai.OpenAiModerationModel;
import org.springframework.ai.openai.api.OpenAiApi;
import org.springframework.ai.openai.api.OpenAiAudioApi;
import org.springframework.ai.openai.api.OpenAiImageApi;
import org.springframework.ai.openai.api.OpenAiModerationApi;
import org.springframework.ai.openai.audio.speech.SpeechModel;
import org.springframework.ai.postgresml.PostgresMlEmbeddingModel;
import org.springframework.ai.postgresml.PostgresMlEmbeddingOptions;
import org.springframework.ai.vertexai.gemini.VertexAiGeminiChatModel;
import org.springframework.ai.vertexai.gemini.VertexAiGeminiChatOptions;
import org.springframework.ai.zhipuai.ZhiPuAiChatModel;
import org.springframework.ai.zhipuai.ZhiPuAiChatOptions;
import org.springframework.ai.zhipuai.api.ZhiPuAiApi;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

/**
 * AI模型工厂 - 按需创建模型实例
 */
@Component
@Slf4j
public class ModelFactory {

  // 模型实例缓存，使用配置ID作为key
  private final Map<String, ChatModel> chatModelCache = new ConcurrentHashMap<>();
  private final Map<String, EmbeddingModel> embeddingModelCache = new ConcurrentHashMap<>();
  private final Map<String, ImageModel> imageModelCache = new ConcurrentHashMap<>();
  private final Map<String, SpeechModel> audioModelCache = new ConcurrentHashMap<>();
  private final Map<String, ModerationModel> moderationModelCache = new ConcurrentHashMap<>();

  @Resource
  private SmartModelSelector smartModelSelector;

  @Resource
  private ModelFeatureDetector featureDetector;

  // 自定义缓存键生成策略
  private CacheKeyStrategy cacheKeyStrategy = new DefaultCacheKeyStrategy();

  // 缓存键生成策略接口和实现类保持不变...
  public interface CacheKeyStrategy {

    String generateCacheKey(ModelType modelType, ModelConfig config);
  }

  public static class DefaultCacheKeyStrategy implements CacheKeyStrategy {

    @Override
    public String generateCacheKey(ModelType modelType, ModelConfig config) {
      return modelType.name().toLowerCase() + "_" + config.hashCode();
    }
  }

  public static class SimpleCacheKeyStrategy implements CacheKeyStrategy {

    @Override
    public String generateCacheKey(ModelType modelType, ModelConfig config) {
      return modelType.name().toLowerCase();
    }
  }

  public static class FullCacheKeyStrategy implements CacheKeyStrategy {

    @Override
    public String generateCacheKey(ModelType modelType, ModelConfig config) {
      return String.format("%s_%s_%s_%s",
          modelType.name().toLowerCase(),
          config.getProvider().name().toLowerCase(),
          config.getModelName(),
          config.getApiKey().hashCode());
    }
  }

  public static class ProviderCacheKeyStrategy implements CacheKeyStrategy {

    @Override
    public String generateCacheKey(ModelType modelType, ModelConfig config) {
      return String.format("%s_%s_%s",
          modelType.name().toLowerCase(),
          config.getProvider().name().toLowerCase(),
          config.getApiKey().hashCode());
    }
  }

  // 公共方法保持不变...
  public ChatModel getChatModel(ModelConfig config) {
    String cacheKey = cacheKeyStrategy.generateCacheKey(ModelType.CHAT, config);
    return chatModelCache.computeIfAbsent(cacheKey, k -> createChatModel(config));
  }

  public ChatModel getChatModel(ModelType modelType, List<ModelConfig> configs) {
    Optional<ModelConfig> config = smartModelSelector.selectBestModel(modelType, configs);
    return config.map(this::getChatModel)
        .orElseThrow(() -> new IllegalArgumentException("未找到模型类型: " + modelType));
  }

  public ChatModel getChatModel(SmartModelSelector.BusinessScenario scenario,
      List<ModelConfig> configs) {
    Optional<ModelConfig> config = smartModelSelector.selectModelByScenario(scenario, configs);
    return config.map(this::getChatModel)
        .orElseThrow(() -> new IllegalArgumentException("未找到业务场景: " + scenario));
  }

  public EmbeddingModel getEmbeddingModel(ModelConfig config) {
    String cacheKey = cacheKeyStrategy.generateCacheKey(ModelType.EMBEDDING, config);
    return embeddingModelCache.computeIfAbsent(cacheKey, k -> createEmbeddingModel(config));
  }

  public EmbeddingModel getEmbeddingModel(ModelType modelType, List<ModelConfig> configs) {
    Optional<ModelConfig> config = smartModelSelector.selectBestModel(modelType, configs);
    return config.map(this::getEmbeddingModel)
        .orElseThrow(() -> new IllegalArgumentException("未找到模型类型: " + modelType));
  }

  public ImageModel getImageModel(ModelConfig config) {
    String cacheKey = cacheKeyStrategy.generateCacheKey(ModelType.IMAGE, config);
    return imageModelCache.computeIfAbsent(cacheKey, k -> createImageModel(config));
  }

  public ImageModel getImageModel(ModelType modelType, List<ModelConfig> configs) {
    Optional<ModelConfig> config = smartModelSelector.selectBestModel(modelType, configs);
    return config.map(this::getImageModel)
        .orElseThrow(() -> new IllegalArgumentException("未找到模型类型: " + modelType));
  }

  public SpeechModel getSpeechModel(ModelConfig config) {
    String cacheKey = cacheKeyStrategy.generateCacheKey(ModelType.AUDIO, config);
    return audioModelCache.computeIfAbsent(cacheKey, k -> createSpeechModel(config));
  }

  public SpeechModel getSpeechModel(ModelType modelType, List<ModelConfig> configs) {
    Optional<ModelConfig> config = smartModelSelector.selectBestModel(modelType, configs);
    return config.map(this::getSpeechModel)
        .orElseThrow(() -> new IllegalArgumentException("未找到模型类型: " + modelType));
  }

  public ModerationModel getModerationModel(ModelConfig config) {
    String cacheKey = cacheKeyStrategy.generateCacheKey(ModelType.MODERATION, config);
    return moderationModelCache.computeIfAbsent(cacheKey, k -> createModerationModel(config));
  }

  public ModerationModel getModerationModel(ModelType modelType, List<ModelConfig> configs) {
    Optional<ModelConfig> config = smartModelSelector.selectBestModel(modelType, configs);
    return config.map(this::getModerationModel)
        .orElseThrow(() -> new IllegalArgumentException("未找到模型类型: " + modelType));
  }

  public ChatClient getChatClient(ModelConfig config) {
    ChatModel chatModel = getChatModel(config);
    return ChatClient.builder(chatModel).build();
  }

  public ChatClient getChatClient(ModelType modelType, List<ModelConfig> configs) {
    ChatModel chatModel = getChatModel(modelType, configs);
    return ChatClient.builder(chatModel).build();
  }

  public ChatClient getChatClient(SmartModelSelector.BusinessScenario scenario,
      List<ModelConfig> configs) {
    ChatModel chatModel = getChatModel(scenario, configs);
    return ChatClient.builder(chatModel).build();
  }

  // ==================== 各提供商ChatModel具体实现 ====================

  private ChatModel createChatModel(ModelConfig config) {
    log.info("创建ChatModel: {} (提供商: {})", config.getModelName(), config.getProvider());

    if (!config.isAvailable()) {
      throw new IllegalArgumentException("模型配置不可用: " + config.getSummary());
    }

    return switch (config.getProvider()) {
      case OPENAI -> createOpenAIChatModel(config);
      case ANTHROPIC -> createAnthropicChatModel(config);
      case AZURE_OPENAI -> createAzureOpenAIChatModel(config);
      case GOOGLE_VERTEXAI -> createGoogleVertexAIChatModel(config);
      //case AMAZON_BEDROCK -> createAmazonBedrockChatModel(config);
      case OLLAMA -> createOllamaChatModel(config);
      case MISTRAL_AI -> createMistralAIChatModel(config);
      case DEEPSEEK -> createDeepSeekChatModel(config);
      case MOONSHOT_AI -> createMoonshotAIChatModel(config);
      case ZHIPU_AI -> createZhipuAIChatModel(config);
      case MINIMAX -> createMiniMaxChatModel(config);
      //case GROQ -> createGroqChatModel(config);
      case NVIDIA -> createNvidiaChatModel(config);
      case PERPLEXITY -> createPerplexityChatModel(config);
      case QIANFAN -> createQianFanChatModel(config);
      case HUGGINGFACE -> createHuggingFaceChatModel(config);
      // ONNX Transformers ChatModel 需要本地模型文件，暂使用模拟实现
      //case ONNX_TRANSFORMERS -> createONNXTransformersChatModel(config);
      case POSTGRESML -> createPostgresMLChatModel(config);
      case LOCAL -> createLocalChatModel(config);
      case CUSTOM -> createCustomChatModel(config);
      default -> throw new IllegalArgumentException("不支持的模型提供商: " + config.getProvider());
    };
  }

  private ChatModel createOpenAIChatModel(ModelConfig config) {
    OpenAiApi openAiApi = OpenAiApi.builder()
        .apiKey(config.getApiKey())
        .baseUrl(config.getBaseUrl())
        .build();

    var options = OpenAiChatOptions.builder()
        .model(config.getModelName())
        .temperature(config.getTemperature())
        .maxTokens(config.getMaxTokens())
        .build();

    return new OpenAiChatModel(openAiApi, options, null, null, null);
  }

  private ChatModel createAnthropicChatModel(ModelConfig config) {
    AnthropicApi anthropicApi = AnthropicApi.builder()
        .apiKey(config.getApiKey())
        .baseUrl(config.getBaseUrl())
        .build();

    var options = AnthropicChatOptions.builder()
        .model(config.getModelName())
        .temperature(config.getTemperature())
        .maxTokens(config.getMaxTokens())
        .build();

    return new AnthropicChatModel(anthropicApi, options, null, null, null);
  }

  private ChatModel createAzureOpenAIChatModel(ModelConfig config) {
    OpenAIClientBuilder builder = new OpenAIClientBuilder();

    var options = AzureOpenAiChatOptions.builder()
        .temperature(config.getTemperature())
        .maxTokens(config.getMaxTokens())
        .build();

    return new AzureOpenAiChatModel(builder, options, null, null);
  }

  private ChatModel createGoogleVertexAIChatModel(ModelConfig config) {
    String projectId = (String) config.getCustomParams()
        .getOrDefault("projectId", "default-project");
    String location = (String) config.getCustomParams().getOrDefault("location", "us-central1");

    VertexAI vertexAiApi = new VertexAI(projectId, location);

    var options = VertexAiGeminiChatOptions.builder()
        .model(config.getModelName())
        .temperature(config.getTemperature())
        .maxOutputTokens(config.getMaxTokens())
        .build();

    return new VertexAiGeminiChatModel(vertexAiApi, options, null, null, null);
  }

  private ChatModel createOllamaChatModel(ModelConfig config) {
    OllamaApi ollamaApi = OllamaApi.builder()
        .baseUrl(config.getBaseUrl())
        .build();

    var options = OllamaOptions.builder()
        .model(config.getModelName())
        .temperature(config.getTemperature())
        .numPredict(config.getMaxTokens())
        .build();

    return new OllamaChatModel(ollamaApi, options, null, null, null);
  }

  private ChatModel createMistralAIChatModel(ModelConfig config) {
    MistralAiApi mistralAiApi = new MistralAiApi(config.getBaseUrl(), config.getApiKey());

    var options = MistralAiChatOptions.builder()
        .model(config.getModelName())
        .temperature(config.getTemperature())
        .maxTokens(config.getMaxTokens())
        .build();

    return new MistralAiChatModel(mistralAiApi, options, null, null, null);
  }

  private ChatModel createDeepSeekChatModel(ModelConfig config) {
    DeepSeekApi deepSeekApi = DeepSeekApi.builder()
        .apiKey(config.getApiKey())
        .baseUrl(config.getBaseUrl())
        .build();

    var options = DeepSeekChatOptions.builder()
        .model(config.getModelName())
        .temperature(config.getTemperature())
        .maxTokens(config.getMaxTokens())
        .build();

    return new DeepSeekChatModel(deepSeekApi, options, null, null, null);
  }

  private ChatModel createZhipuAIChatModel(ModelConfig config) {
    ZhiPuAiApi zhiPuAiApi = new ZhiPuAiApi(config.getBaseUrl(), config.getApiKey());

    var options = ZhiPuAiChatOptions.builder()
        .model(config.getModelName())
        .temperature(config.getTemperature())
        .maxTokens(config.getMaxTokens())
        .build();

    return new ZhiPuAiChatModel(zhiPuAiApi, options);
  }

  private ChatModel createMiniMaxChatModel(ModelConfig config) {
    MiniMaxApi miniMaxApi = new MiniMaxApi(config.getBaseUrl(), config.getMaxTokens().toString());

    var options = MiniMaxChatOptions.builder()
        .model(config.getModelName())
        .temperature(config.getTemperature())
        .maxTokens(config.getMaxTokens())
        .build();

    return new MiniMaxChatModel(miniMaxApi, options);
  }

  private ChatModel createHuggingFaceChatModel(ModelConfig config) {
    return new HuggingfaceChatModel(config.getApiKey(), config.getBaseUrl());
  }

  // 以下提供商使用OpenAI兼容接口
  private ChatModel createMoonshotAIChatModel(ModelConfig config) {
    return createOpenAICompatibleChatModel(config, "Moonshot AI");
  }

  private ChatModel createNvidiaChatModel(ModelConfig config) {
    return createOpenAICompatibleChatModel(config, "NVIDIA");
  }

  private ChatModel createPerplexityChatModel(ModelConfig config) {
    return createOpenAICompatibleChatModel(config, "Perplexity");
  }

  private ChatModel createQianFanChatModel(ModelConfig config) {
    return createOpenAICompatibleChatModel(config, "QianFan");
  }

  private ChatModel createPostgresMLChatModel(ModelConfig config) {
    // PostgresML ChatModel 需要数据库连接;
    return null;
  }

  private ChatModel createLocalChatModel(ModelConfig config) {
    return createOpenAICompatibleChatModel(config, "Local");
  }

  private ChatModel createCustomChatModel(ModelConfig config) {
    return createOpenAICompatibleChatModel(config, "Custom");
  }

  private ChatModel createOpenAICompatibleChatModel(ModelConfig config, String providerName) {
    OpenAiApi openAiApi = OpenAiApi.builder()
        .apiKey(config.getApiKey())
        .baseUrl(config.getBaseUrl())
        .build();

    var options = OpenAiChatOptions.builder()
        .model(config.getModelName())
        .temperature(config.getTemperature())
        .maxTokens(config.getMaxTokens())
        .build();

    log.info("创建 {} ChatModel (OpenAI兼容): {}", providerName, config.getModelName());
    return new OpenAiChatModel(openAiApi, options, null, null, null);
  }

  // ==================== 各提供商EmbeddingModel具体实现 ====================

  private EmbeddingModel createEmbeddingModel(ModelConfig config) {
    log.info("创建EmbeddingModel: {} (提供商: {})", config.getModelName(), config.getProvider());

    if (!config.isAvailable()) {
      throw new IllegalArgumentException("模型配置不可用: " + config.getSummary());
    }

    return switch (config.getProvider()) {
      case OPENAI -> createOpenAIEmbeddingModel(config);
      case AZURE_OPENAI -> createAzureOpenAIEmbeddingModel(config);
      case AMAZON_BEDROCK -> createAmazonBedrockEmbeddingModel(config);
      case OLLAMA -> createOllamaEmbeddingModel(config);
      case MISTRAL_AI -> createMistralAIEmbeddingModel(config);
      case MINIMAX -> createMiniMaxEmbeddingModel(config);
      case POSTGRESML -> createPostgresMLEmbeddingModel(config);
      case QIANFAN -> createQianFanEmbeddingModel(config);
      case ZHIPU_AI -> createZhipuAIEmbeddingModel(config);
      case LOCAL -> createLocalEmbeddingModel(config);
      case CUSTOM -> createCustomEmbeddingModel(config);
      default -> throw new IllegalArgumentException(
          "EmbeddingModel 不支持的提供商: " + config.getProvider());
    };
  }

  private EmbeddingModel createOpenAIEmbeddingModel(ModelConfig config) {
    OpenAiApi openAiApi = OpenAiApi.builder()
        .apiKey(config.getApiKey())
        .baseUrl(config.getBaseUrl())
        .build();

    return new OpenAiEmbeddingModel(openAiApi);
  }

  private EmbeddingModel createAzureOpenAIEmbeddingModel(ModelConfig config) {
    OpenAIClient azureOpenAiClient = null;
    return new AzureOpenAiEmbeddingModel(azureOpenAiClient);
  }

  private EmbeddingModel createAmazonBedrockEmbeddingModel(ModelConfig config) {
    String region = (String) config.getCustomParams().getOrDefault("region", "us-east-1");

    CohereEmbeddingBedrockApi bedrockApi = null;

    var options = BedrockCohereEmbeddingOptions.builder()
        //.model(config.getModelName())
        .build();

    return new BedrockCohereEmbeddingModel(bedrockApi, options);
  }

  private EmbeddingModel createOllamaEmbeddingModel(ModelConfig config) {
    OllamaApi ollamaApi = OllamaApi.builder()
        .baseUrl(config.getBaseUrl())
        .build();
    var options = OllamaOptions.builder()
        .model(config.getModelName())
        .build();

    return new OllamaEmbeddingModel(ollamaApi, options, null, null);
  }

  private EmbeddingModel createMistralAIEmbeddingModel(ModelConfig config) {
    MistralAiApi mistralAiApi = null;
    return new MistralAiEmbeddingModel(mistralAiApi);
  }

  // 以下提供商使用OpenAI兼容接口
  private EmbeddingModel createMiniMaxEmbeddingModel(ModelConfig config) {
    return createOpenAICompatibleEmbeddingModel(config, "MiniMax");
  }

  private EmbeddingModel createQianFanEmbeddingModel(ModelConfig config) {
    return createOpenAICompatibleEmbeddingModel(config, "QianFan");
  }

  private EmbeddingModel createZhipuAIEmbeddingModel(ModelConfig config) {
    return createOpenAICompatibleEmbeddingModel(config, "ZhiPuAI");
  }

  private EmbeddingModel createLocalEmbeddingModel(ModelConfig config) {
    return createOpenAICompatibleEmbeddingModel(config, "Local");
  }

  private EmbeddingModel createCustomEmbeddingModel(ModelConfig config) {
    return createOpenAICompatibleEmbeddingModel(config, "Custom");
  }

  private EmbeddingModel createOpenAICompatibleEmbeddingModel(ModelConfig config,
      String providerName) {
    OpenAiApi openAiApi = OpenAiApi.builder()
        .apiKey(config.getApiKey())
        .baseUrl(config.getBaseUrl())
        .build();

    log.info("创建 {} EmbeddingModel (OpenAI兼容): {}", providerName, config.getModelName());
    return new OpenAiEmbeddingModel(openAiApi);
  }

  private EmbeddingModel createPostgresMLEmbeddingModel(ModelConfig config) {
    String jdbcUrl = (String) config.getCustomParams().get("jdbcUrl");
    if (jdbcUrl == null) {
      throw new IllegalArgumentException("PostgresML EmbeddingModel 需要 jdbcUrl 参数");
    }

    JdbcTemplate jdbcTemplate = null;
    var options = PostgresMlEmbeddingOptions.builder()
        //.model(config.getModelName())
        .build();
    return new PostgresMlEmbeddingModel(jdbcTemplate, options);
  }

  // ==================== 各提供商ImageModel具体实现 ====================

  private ImageModel createImageModel(ModelConfig config) {
    log.info("创建ImageModel: {} (提供商: {})", config.getModelName(), config.getProvider());

    return switch (config.getProvider()) {
      case OPENAI -> createOpenAIImageModel(config);
      case AZURE_OPENAI -> createAzureOpenAIImageModel(config);
      //      case STABILITY -> createStabilityImageModel(config);
      //      case ZHIPU_AI -> createZhipuAIImageModel(config);
      //      case QIANFAN -> createQianFanImageModel(config);
      default -> throw new IllegalArgumentException(
          "ImageModel 不支持的提供商: " + config.getProvider());
    };
  }

  private ImageModel createOpenAIImageModel(ModelConfig config) {
    OpenAiImageApi openAiImageApi = null;
    return new OpenAiImageModel(openAiImageApi);
  }

  private ImageModel createAzureOpenAIImageModel(ModelConfig config) {
    OpenAIClient microsoftOpenAiClient = null;

    var options = AzureOpenAiImageOptions.builder()
        .model(config.getModelName())
        .build();
    return new AzureOpenAiImageModel(microsoftOpenAiClient, options);
  }

  // ==================== 各提供商SpeechModel具体实现 ====================
  private SpeechModel createSpeechModel(ModelConfig config) {
    log.info("创建SpeechModel: {} (提供商: {})", config.getModelName(), config.getProvider());

    if (Objects.requireNonNull(config.getProvider()) == ModelProvider.OPENAI) {
      return createOpenAISpeechModel(config);
    }
    throw new IllegalArgumentException(
        "SpeechModel 只支持 OpenAI 提供商，不支持的提供商: " + config.getProvider());
  }

  private SpeechModel createOpenAISpeechModel(ModelConfig config) {
    OpenAiAudioApi audioApi = null;
    OpenAiAudioSpeechOptions options = null;
    return new OpenAiAudioSpeechModel(audioApi, options);
  }

  // ==================== 各提供商ModerationModel具体实现 ====================

  private ModerationModel createModerationModel(ModelConfig config) {
    log.info("创建ModerationModel: {} (提供商: {})", config.getModelName(), config.getProvider());

    return switch (config.getProvider()) {
      case OPENAI -> createOpenAIModerationModel(config);
      case MISTRAL_AI -> createMistralAIModerationModel(config);
      default -> throw new IllegalArgumentException(
          "ModerationModel 不支持的提供商: " + config.getProvider());
    };
  }

  private ModerationModel createOpenAIModerationModel(ModelConfig config) {
    OpenAiModerationApi openAiModerationApi = null;
    return new OpenAiModerationModel(openAiModerationApi);
  }

  private ModerationModel createMistralAIModerationModel(ModelConfig config) {
    MistralAiModerationApi mistralAiModerationApi = null;
    return new MistralAiModerationModel(mistralAiModerationApi);
  }

  // 缓存管理方法保持不变...
  public void clearCache() {
    chatModelCache.clear();
    embeddingModelCache.clear();
    imageModelCache.clear();
    audioModelCache.clear();
    moderationModelCache.clear();
    log.info("已清除所有模型缓存");
  }

  public void clearCache(ModelProvider provider) {
    chatModelCache.entrySet().removeIf(entry -> entry.getKey().contains(provider.name()));
    embeddingModelCache.entrySet().removeIf(entry -> entry.getKey().contains(provider.name()));
    imageModelCache.entrySet().removeIf(entry -> entry.getKey().contains(provider.name()));
    audioModelCache.entrySet().removeIf(entry -> entry.getKey().contains(provider.name()));
    moderationModelCache.entrySet().removeIf(entry -> entry.getKey().contains(provider.name()));
    log.info("已清除提供商 {} 的所有缓存", provider);
  }

  public Map<String, Object> getCacheStats() {
    Map<String, Object> stats = new HashMap<>();
    stats.put("chatModelCacheSize", chatModelCache.size());
    stats.put("embeddingModelCacheSize", embeddingModelCache.size());
    stats.put("imageModelCacheSize", imageModelCache.size());
    stats.put("audioModelCacheSize", audioModelCache.size());
    stats.put("moderationModelCacheSize", moderationModelCache.size());
    stats.put("totalCacheSize", chatModelCache.size() + embeddingModelCache.size() +
        imageModelCache.size() + audioModelCache.size() + moderationModelCache.size());
    return stats;
  }

  public void setCacheKeyStrategy(CacheKeyStrategy strategy) {
    if (strategy == null) {
      throw new IllegalArgumentException("缓存键策略不能为空");
    }
    this.cacheKeyStrategy = strategy;
    log.info("已设置缓存键策略: {}", strategy.getClass().getSimpleName());
  }

  public CacheKeyStrategy getCacheKeyStrategy() {
    return cacheKeyStrategy;
  }

  public ChatModel getChatModel(ModelConfig config, CacheKeyStrategy strategy) {
    CacheKeyStrategy originalStrategy = this.cacheKeyStrategy;
    try {
      this.cacheKeyStrategy = strategy;
      return getChatModel(config);
    } finally {
      this.cacheKeyStrategy = originalStrategy;
    }
  }

  public EmbeddingModel getEmbeddingModel(ModelConfig config, CacheKeyStrategy strategy) {
    CacheKeyStrategy originalStrategy = this.cacheKeyStrategy;
    try {
      this.cacheKeyStrategy = strategy;
      return getEmbeddingModel(config);
    } finally {
      this.cacheKeyStrategy = originalStrategy;
    }
  }
}
