package cloud.xcan.core.model;

import dev.langchain4j.model.catalog.ModelType;
import dev.langchain4j.model.chat.ChatModel;
import dev.langchain4j.model.chat.StreamingChatModel;
import dev.langchain4j.model.embedding.EmbeddingModel;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;
import lombok.extern.slf4j.Slf4j;

/**
 * 模型注册中心 — 统一管理所有模型实例的创建和获取。
 * <p>
 * 通过 {@link ModelConfigProvider} 从数据库等外部源加载配置， 通过 {@link ModelFactory} 创建对应提供商的模型实例。
 * </p>
 */
@Slf4j
public class ModelRegistry {

  private final Map<ModelProvider, ModelFactory> factories;
  private final ModelConfigProvider configProvider;
  private final Map<String, ChatModel> chatModelCache = new ConcurrentHashMap<>();
  private final Map<String, StreamingChatModel> streamingModelCache = new ConcurrentHashMap<>();
  private final Map<String, EmbeddingModel> embeddingModelCache = new ConcurrentHashMap<>();

  public ModelRegistry(List<ModelFactory> factoryList, ModelConfigProvider configProvider) {
    this.factories = factoryList.stream()
        .collect(Collectors.toMap(ModelFactory::getProvider, f -> f));
    this.configProvider = configProvider;
    log.info("ModelRegistry initialized with providers: {}", factories.keySet());
  }

  /**
   * 根据配置 ID 获取或创建 ChatModel
   */
  public ChatModel getChatModel(String configId) {
    return chatModelCache.computeIfAbsent(configId, id -> {
      ModelConfigDefinition config = configProvider.loadById(id)
          .orElseThrow(() -> new IllegalArgumentException("Model config not found: " + id));
      return getFactory(config.getProvider()).createChatModel(config);
    });
  }

  /**
   * 根据配置 ID 获取或创建 StreamingChatModel
   */
  public StreamingChatModel getStreamingChatModel(String configId) {
    return streamingModelCache.computeIfAbsent(configId, id -> {
      ModelConfigDefinition config = configProvider.loadById(id)
          .orElseThrow(() -> new IllegalArgumentException("Model config not found: " + id));
      return getFactory(config.getProvider()).createStreamingChatModel(config);
    });
  }

  /**
   * 根据配置 ID 获取或创建 EmbeddingModel
   */
  public Optional<EmbeddingModel> getEmbeddingModel(String configId) {
    EmbeddingModel model = embeddingModelCache.computeIfAbsent(configId, id -> {
      ModelConfigDefinition config = configProvider.loadById(id)
          .orElseThrow(() -> new IllegalArgumentException("Model config not found: " + id));
      return getFactory(config.getProvider()).createEmbeddingModel(config);
    });
    return Optional.ofNullable(model);
  }

  /**
   * 获取指定 provider 的默认 ChatModel
   */
  public Optional<ChatModel> getDefaultChatModel(ModelProvider provider) {
    return configProvider.loadDefault(provider)
        .map(config -> chatModelCache.computeIfAbsent(config.getId(),
            id -> getFactory(config.getProvider()).createChatModel(config)));
  }

  /**
   * 获取指定 provider 的默认 StreamingChatModel
   */
  public Optional<StreamingChatModel> getDefaultStreamingChatModel(ModelProvider provider) {
    return configProvider.loadDefault(provider)
        .map(config -> streamingModelCache.computeIfAbsent(config.getId(),
            id -> getFactory(config.getProvider()).createStreamingChatModel(config)));
  }

  /**
   * 获取指定 provider（字符串 key）的默认 EmbeddingModel，用于 ContentRetrieverFactory 等兼容场景
   */
  public Optional<EmbeddingModel> getDefaultEmbeddingModel(String providerKey) {
    ModelProvider p = ModelProvider.fromKey(providerKey);
    return p != null ? getDefaultEmbeddingModel(p) : Optional.empty();
  }

  /**
   * 获取指定 provider 的默认 EmbeddingModel（优先 type=EMBEDDING 的配置）
   */
  public Optional<EmbeddingModel> getDefaultEmbeddingModel(ModelProvider provider) {
    return configProvider.loadDefault(provider, ModelType.EMBEDDING)
        .flatMap(config -> {
          EmbeddingModel cached = embeddingModelCache.get(config.getId());
          if (cached != null) {
            return Optional.of(cached);
          }
          EmbeddingModel model = getFactory(config.getProvider()).createEmbeddingModel(config);
          if (model == null) {
            return Optional.empty();
          }
          embeddingModelCache.put(config.getId(), model);
          return Optional.of(model);
        });
  }

  /**
   * 获取指定 provider 的默认 ChatModel
   */
  public Optional<ChatModel> getDefaultChatModel() {
    return configProvider.loadDefault()
        .map(config -> chatModelCache.computeIfAbsent(config.getId(),
            id -> getFactory(config.getProvider()).createChatModel(config)));
  }

  /**
   * 获取指定 provider 的默认 StreamingChatModel
   */
  public Optional<StreamingChatModel> getDefaultStreamingChatModel() {
    return configProvider.loadDefault()
        .map(config -> streamingModelCache.computeIfAbsent(config.getId(),
            id -> getFactory(config.getProvider()).createStreamingChatModel(config)));
  }

  /**
   * 获取指定 provider 的默认 EmbeddingModel
   */
  public Optional<EmbeddingModel> getDefaultEmbeddingModel() {
    return configProvider.loadDefault()
        .flatMap(config -> {
          EmbeddingModel cached = embeddingModelCache.get(config.getId());
          if (cached != null) {
            return Optional.of(cached);
          }
          EmbeddingModel model = getFactory(config.getProvider()).createEmbeddingModel(config);
          if (model == null) {
            return Optional.empty();
          }
          embeddingModelCache.put(config.getId(), model);
          return Optional.of(model);
        });
  }

  /**
   * 清除缓存并强制从数据库重新加载
   */
  public void refresh() {
    chatModelCache.clear();
    streamingModelCache.clear();
    embeddingModelCache.clear();
    log.info("Model cache cleared — will reload on next access");
  }

  /**
   * 列出所有可用的模型配置
   */
  public List<ModelConfigDefinition> listConfigs() {
    return configProvider.loadAll();
  }

  private ModelFactory getFactory(ModelProvider provider) {
    ModelFactory factory = factories.get(provider);
    if (factory == null) {
      throw new IllegalArgumentException("Unsupported model provider: " + provider
          + ". Available: " + factories.keySet());
    }
    return factory;
  }
}
