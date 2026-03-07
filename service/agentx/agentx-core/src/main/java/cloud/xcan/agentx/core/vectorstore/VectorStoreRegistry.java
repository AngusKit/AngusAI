package cloud.xcan.agentx.core.vectorstore;

import dev.langchain4j.data.segment.TextSegment;
import dev.langchain4j.store.embedding.EmbeddingStore;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;
import lombok.extern.slf4j.Slf4j;

/**
 * 向量存储注册中心 — 统一管理所有 EmbeddingStore 实例。
 * <p>
 * 通过 {@link VectorStoreConfigProvider} 从数据库加载配置， 通过 {@link VectorStoreFactory} 创建对应类型的存储实例。
 * </p>
 */
@Slf4j
public class VectorStoreRegistry {

  private final Map<String, VectorStoreFactory> factories;
  private final VectorStoreConfigProvider configProvider;
  private final Map<String, EmbeddingStore<TextSegment>> storeCache = new ConcurrentHashMap<>();

  public VectorStoreRegistry(List<VectorStoreFactory> factoryList,
      VectorStoreConfigProvider configProvider) {
    this.factories = factoryList.stream()
        .collect(Collectors.toMap(VectorStoreFactory::getType, f -> f));
    this.configProvider = configProvider;
    log.info("VectorStoreRegistry initialized with types: {}", factories.keySet());
  }

  /**
   * 根据配置 ID 获取或创建 EmbeddingStore
   */
  public EmbeddingStore<TextSegment> getStore(String configId) {
    return storeCache.computeIfAbsent(configId, id -> {
      VectorStoreConfigDefinition config = configProvider.loadById(id)
          .orElseThrow(() -> new IllegalArgumentException("VectorStore config not found: " + id));
      return getFactory(config.getType()).createEmbeddingStore(config);
    });
  }

  /**
   * 获取指定类型的默认 EmbeddingStore
   */
  public Optional<EmbeddingStore<TextSegment>> getDefaultStore(String type) {
    return configProvider.loadDefault(type)
        .map(config -> storeCache.computeIfAbsent(config.getId(),
            id -> getFactory(config.getType()).createEmbeddingStore(config)));
  }

  /**
   * 清除缓存
   */
  public void refresh() {
    storeCache.clear();
    log.info("VectorStore cache cleared");
  }

  /**
   * 列出所有配置
   */
  public List<VectorStoreConfigDefinition> listConfigs() {
    return configProvider.loadAll();
  }

  private VectorStoreFactory getFactory(String type) {
    VectorStoreFactory factory = factories.get(type);
    if (factory == null) {
      throw new IllegalArgumentException("Unsupported vector store type: " + type
          + ". Available: " + factories.keySet());
    }
    return factory;
  }
}
