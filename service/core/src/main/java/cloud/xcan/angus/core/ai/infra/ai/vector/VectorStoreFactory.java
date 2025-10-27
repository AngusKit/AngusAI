package cloud.xcan.angus.core.ai.infra.ai.vector;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

/**
 * 向量存储库工厂类 - 根据代码配置参数创建向量存储库实例
 */
@Component
@Slf4j
public class VectorStoreFactory {

  // 缓存已创建的向量存储库实例
  private final Map<String, CachedVectorStore> storeCache = new ConcurrentHashMap<>();

  // 实例缓存配置（不缓存配置对象本身）
  private final CacheConfig cacheConfig = new CacheConfig();

  // 定时清理任务
  private final ScheduledExecutorService cleanupScheduler = Executors.newSingleThreadScheduledExecutor();

  // 自定义缓存键生成策略
  private CacheKeyStrategy cacheKeyStrategy = new DefaultCacheKeyStrategy();

  /**
   * 缓存键生成策略接口
   */
  public interface CacheKeyStrategy {

    /**
     * 生成缓存键
     *
     * @param config 向量存储库配置
     * @return 缓存键
     */
    String generateCacheKey(VectorStoreConfig config);

    /**
     * 生成配置指纹
     *
     * @param config 向量存储库配置
     * @return 配置指纹
     */
    String generateConfigFingerprint(VectorStoreConfig config);
  }

  /**
   * 默认缓存键生成策略
   */
  public static class DefaultCacheKeyStrategy implements CacheKeyStrategy {

    @Override
    public String generateCacheKey(VectorStoreConfig config) {
      // 只使用影响实例创建的关键配置信息
      StringBuilder keyBuilder = new StringBuilder();
      keyBuilder.append(config.getStoreType());

      // 根据不同的存储库类型，使用不同的关键配置
      switch (config.getStoreType()) {
        case AZURE_AI_SERVICE:
          keyBuilder.append(":").append(config.getApiEndpoint());
          break;
        case AZURE_COSMOS_DB:
        case MONGODB_ATLAS:
          keyBuilder.append(":").append(config.getConnectionString() != null ?
              config.getConnectionString().hashCode() : "null");
          break;
        case PINECONE:
          keyBuilder.append(":").append(config.getApiEndpoint());
          break;
        case CHROMA:
        case QDRANT:
        case REDIS:
        case WEAVIATE:
          keyBuilder.append(":").append(config.getHost()).append(":").append(config.getPort());
          break;
        case ELASTICSEARCH:
        case OPENSEARCH:
          keyBuilder.append(":").append(config.getHost()).append(":").append(config.getPort())
              .append(":").append(config.getIndexName());
          break;
        case MILVUS:
          keyBuilder.append(":").append(config.getHost()).append(":").append(config.getPort())
              .append(":").append(config.getCollection());
          break;
        case NEO4J:
        case MARIADB:
        case ORACLE:
        case PGVECTOR:
        case SAP_HANA:
          keyBuilder.append(":").append(config.getHost()).append(":").append(config.getPort())
              .append(":").append(config.getDatabase());
          break;
        case APACHE_CASSANDRA:
        case COUCHBASE:
        case GEMFIRE:
        case TYPESENSE:
          keyBuilder.append(":").append(config.getHost()).append(":").append(config.getPort())
              .append(":").append(config.getDatabase());
          break;
        default:
          keyBuilder.append(":").append(config.getHost()).append(":").append(config.getPort());
      }

      return keyBuilder.toString();
    }

    @Override
    public String generateConfigFingerprint(VectorStoreConfig config) {
      // 生成配置的指纹，用于检测配置变化
      StringBuilder fingerprint = new StringBuilder();
      fingerprint.append(config.getStoreType());
      fingerprint.append(":").append(config.getHost());
      fingerprint.append(":").append(config.getPort());
      fingerprint.append(":").append(config.getDatabase());
      fingerprint.append(":").append(config.getCollection());
      fingerprint.append(":").append(config.getIndexName());
      fingerprint.append(":").append(config.getApiEndpoint());
      fingerprint.append(":").append(config.getApiKey() != null ? "***" : "null");
      fingerprint.append(":").append(config.getUsername() != null ? "***" : "null");
      fingerprint.append(":").append(config.getDimension());
      fingerprint.append(":").append(config.getTimeout());
      fingerprint.append(":").append(config.getMaxConnections());
      fingerprint.append(":").append(config.getSslEnabled());
      fingerprint.append(":").append(config.getRegion());
      fingerprint.append(":").append(config.getProjectId());
      fingerprint.append(":").append(config.getNamespace());

      return fingerprint.toString();
    }
  }

  /**
   * 简单缓存键生成策略（只使用类型和主机端口）
   */
  public static class SimpleCacheKeyStrategy implements CacheKeyStrategy {

    @Override
    public String generateCacheKey(VectorStoreConfig config) {
      return String.format("%s:%s:%s",
          config.getStoreType(),
          config.getHost(),
          config.getPort());
    }

    @Override
    public String generateConfigFingerprint(VectorStoreConfig config) {
      return String.format("%s:%s:%s:%s",
          config.getStoreType(),
          config.getHost(),
          config.getPort(),
          config.getDatabase());
    }
  }

  /**
   * 完整缓存键生成策略（包含所有配置信息）
   */
  public static class FullCacheKeyStrategy implements CacheKeyStrategy {

    @Override
    public String generateCacheKey(VectorStoreConfig config) {
      StringBuilder keyBuilder = new StringBuilder();
      keyBuilder.append(config.getStoreType());
      keyBuilder.append(":").append(config.getHost());
      keyBuilder.append(":").append(config.getPort());
      keyBuilder.append(":").append(config.getDatabase());
      keyBuilder.append(":").append(config.getCollection());
      keyBuilder.append(":").append(config.getIndexName());
      keyBuilder.append(":").append(config.getApiEndpoint());
      keyBuilder.append(":")
          .append(config.getApiKey() != null ? config.getApiKey().hashCode() : "null");
      keyBuilder.append(":")
          .append(config.getUsername() != null ? config.getUsername().hashCode() : "null");
      keyBuilder.append(":").append(config.getDimension());
      keyBuilder.append(":").append(config.getTimeout());
      keyBuilder.append(":").append(config.getMaxConnections());
      keyBuilder.append(":").append(config.getSslEnabled());
      keyBuilder.append(":").append(config.getRegion());
      keyBuilder.append(":").append(config.getProjectId());
      keyBuilder.append(":").append(config.getNamespace());

      return keyBuilder.toString();
    }

    @Override
    public String generateConfigFingerprint(VectorStoreConfig config) {
      return generateCacheKey(config); // 完整策略中缓存键和指纹相同
    }
  }

  /**
   * 缓存配置类
   */
  public static class CacheConfig {

    private long maxCacheSize = 100;                    // 最大缓存数量
    private long defaultTtlMinutes = 60;               // 默认TTL（分钟）
    private long cleanupIntervalMinutes = 10;          // 清理间隔（分钟）
    private boolean enableAutoCleanup = true;          // 启用自动清理
    private boolean enableConnectionCheck = true;       // 启用连接检查

    // Getters and Setters
    public long getMaxCacheSize() {
      return maxCacheSize;
    }

    public void setMaxCacheSize(long maxCacheSize) {
      this.maxCacheSize = maxCacheSize;
    }

    public long getDefaultTtlMinutes() {
      return defaultTtlMinutes;
    }

    public void setDefaultTtlMinutes(long defaultTtlMinutes) {
      this.defaultTtlMinutes = defaultTtlMinutes;
    }

    public long getCleanupIntervalMinutes() {
      return cleanupIntervalMinutes;
    }

    public void setCleanupIntervalMinutes(long cleanupIntervalMinutes) {
      this.cleanupIntervalMinutes = cleanupIntervalMinutes;
    }

    public boolean isEnableAutoCleanup() {
      return enableAutoCleanup;
    }

    public void setEnableAutoCleanup(boolean enableAutoCleanup) {
      this.enableAutoCleanup = enableAutoCleanup;
    }

    public boolean isEnableConnectionCheck() {
      return enableConnectionCheck;
    }

    public void setEnableConnectionCheck(boolean enableConnectionCheck) {
      this.enableConnectionCheck = enableConnectionCheck;
    }
  }

  /**
   * 缓存的向量存储库包装类（只缓存实例，不缓存配置对象）
   */
  private static class CachedVectorStore {

    private final VectorStore store;
    private final LocalDateTime createdAt;
    private LocalDateTime lastAccessedAt;
    private final long ttlMinutes;
    private final String configFingerprint; // 只保存配置指纹，不保存配置对象
    private volatile int accessCount;

    public CachedVectorStore(VectorStore store, long ttlMinutes, String configFingerprint) {
      this.store = store;
      this.createdAt = LocalDateTime.now();
      this.lastAccessedAt = LocalDateTime.now();
      this.ttlMinutes = ttlMinutes;
      this.configFingerprint = configFingerprint;
      this.accessCount = 0;
    }

    public VectorStore getStore() {
      return store;
    }

    public LocalDateTime getCreatedAt() {
      return createdAt;
    }

    public LocalDateTime getLastAccessedAt() {
      return lastAccessedAt;
    }

    public long getTtlMinutes() {
      return ttlMinutes;
    }

    public String getConfigFingerprint() {
      return configFingerprint;
    }

    public int getAccessCount() {
      return accessCount;
    }

    public void updateLastAccessed() {
      this.lastAccessedAt = LocalDateTime.now();
      this.accessCount++;
    }

    public boolean isExpired() {
      return LocalDateTime.now().isAfter(lastAccessedAt.plusMinutes(ttlMinutes));
    }

    public boolean isStale() {
      return LocalDateTime.now().isAfter(createdAt.plusMinutes(ttlMinutes * 2));
    }

    /**
     * 检查配置是否发生变化
     */
    public boolean isConfigChanged(String newConfigFingerprint) {
      return !this.configFingerprint.equals(newConfigFingerprint);
    }
  }

  /**
   * 创建向量存储库实例
   */
  public VectorStore createVectorStore(VectorStoreConfig config) {
    return createVectorStore(config, cacheConfig.getDefaultTtlMinutes());
  }

  /**
   * 创建向量存储库实例（带TTL）
   */
  public VectorStore createVectorStore(VectorStoreConfig config, long ttlMinutes) {
    if (!config.isValid()) {
      throw new IllegalArgumentException("向量存储库配置无效: " + config.getStoreType());
    }

    String cacheKey = cacheKeyStrategy.generateCacheKey(config);
    String configFingerprint = cacheKeyStrategy.generateConfigFingerprint(config);

    // 检查缓存
    CachedVectorStore cachedStore = storeCache.get(cacheKey);
    if (cachedStore != null) {
      // 检查配置是否发生变化
      if (cachedStore.isConfigChanged(configFingerprint)) {
        log.info("配置已变化，移除缓存: {}", config.getStoreType());
        removeFromCache(cacheKey);
      }
      // 检查是否过期
      else if (cachedStore.isExpired()) {
        log.info("缓存已过期，移除: {}", config.getStoreType());
        removeFromCache(cacheKey);
      }
      // 检查连接状态
      else if (cacheConfig.isEnableConnectionCheck() && !cachedStore.getStore().isConnected()) {
        log.info("连接已断开，移除缓存: {}", config.getStoreType());
        removeFromCache(cacheKey);
      } else {
        // 更新访问时间和计数
        cachedStore.updateLastAccessed();
        log.info("使用缓存的向量存储库: {} (访问次数: {})",
            config.getStoreType(), cachedStore.getAccessCount());
        return cachedStore.getStore();
      }
    }

    // 检查缓存大小限制
    if (storeCache.size() >= cacheConfig.getMaxCacheSize()) {
      evictLeastRecentlyUsed();
    }

    // 创建新实例（不缓存配置对象）
    VectorStore store = createStoreInstance(config);
    CachedVectorStore cachedVectorStore = new CachedVectorStore(store, ttlMinutes,
        configFingerprint);
    storeCache.put(cacheKey, cachedVectorStore);

    // 启动自动清理任务
    if (cacheConfig.isEnableAutoCleanup()) {
      startAutoCleanup();
    }

    log.info("创建向量存储库实例: {} (TTL: {}分钟)", config.getStoreType(), ttlMinutes);
    return store;
  }

  /**
   * 创建特定类型的向量存储库实例
   */
  private VectorStore createStoreInstance(VectorStoreConfig config) {
    return switch (config.getStoreType()) {
      case AZURE_AI_SERVICE -> createAzureAIServiceStore(config);
      case AZURE_COSMOS_DB -> createAzureCosmosDBStore(config);
      case APACHE_CASSANDRA -> createCassandraStore(config);
      case CHROMA -> createChromaStore(config);
      case COUCHBASE -> createCouchbaseStore(config);
      case ELASTICSEARCH -> createElasticsearchStore(config);
      case GEMFIRE -> createGemFireStore(config);
      case MARIADB -> createMariaDBStore(config);
      case MILVUS -> createMilvusStore(config);
      case MONGODB_ATLAS -> createMongoDBAtlasStore(config);
      case NEO4J -> createNeo4jStore(config);
      case OPENSEARCH -> createOpenSearchStore(config);
      case ORACLE -> createOracleStore(config);
      case PGVECTOR -> createPGVectorStore(config);
      case PINECONE -> createPineconeStore(config);
      case QDRANT -> createQdrantStore(config);
      case REDIS -> createRedisStore(config);
      case SAP_HANA -> createSAPHanaStore(config);
      case TYPESENSE -> createTypesenseStore(config);
      case WEAVIATE -> createWeaviateStore(config);
      default ->
          throw new IllegalArgumentException("不支持的向量存储库类型: " + config.getStoreType());
    };
  }

  /**
   * 创建Azure AI Service向量存储库
   */
  private VectorStore createAzureAIServiceStore(VectorStoreConfig config) {
    log.info("创建Azure AI Service向量存储库");
    return new MockVectorService("Azure AI Service", config);
  }

  /**
   * 创建Azure Cosmos DB向量存储库
   */
  private VectorStore createAzureCosmosDBStore(VectorStoreConfig config) {
    log.info("创建Azure Cosmos DB向量存储库");
    return new MockVectorService("Azure Cosmos DB", config);
  }

  /**
   * 创建Apache Cassandra向量存储库
   */
  private VectorStore createCassandraStore(VectorStoreConfig config) {
    log.info("创建Apache Cassandra向量存储库");
    return new MockVectorService("Apache Cassandra", config);
  }

  /**
   * 创建Chroma向量存储库
   */
  private VectorStore createChromaStore(VectorStoreConfig config) {
    log.info("创建Chroma向量存储库");
    return new MockVectorService("Chroma", config);
  }

  /**
   * 创建Couchbase向量存储库
   */
  private VectorStore createCouchbaseStore(VectorStoreConfig config) {
    log.info("创建Couchbase向量存储库");
    return new MockVectorService("Couchbase", config);
  }

  /**
   * 创建Elasticsearch向量存储库
   */
  private VectorStore createElasticsearchStore(VectorStoreConfig config) {
    log.info("创建Elasticsearch向量存储库");
    return new MockVectorService("Elasticsearch", config);
  }

  /**
   * 创建GemFire向量存储库
   */
  private VectorStore createGemFireStore(VectorStoreConfig config) {
    log.info("创建GemFire向量存储库");
    return new MockVectorService("GemFire", config);
  }

  /**
   * 创建MariaDB向量存储库
   */
  private VectorStore createMariaDBStore(VectorStoreConfig config) {
    log.info("创建MariaDB向量存储库");
    return new MockVectorService("MariaDB", config);
  }

  /**
   * 创建Milvus向量存储库
   */
  private VectorStore createMilvusStore(VectorStoreConfig config) {
    log.info("创建Milvus向量存储库");
    return new MockVectorService("Milvus", config);
  }

  /**
   * 创建MongoDB Atlas向量存储库
   */
  private VectorStore createMongoDBAtlasStore(VectorStoreConfig config) {
    log.info("创建MongoDB Atlas向量存储库");
    return new MockVectorService("MongoDB Atlas", config);
  }

  /**
   * 创建Neo4j向量存储库
   */
  private VectorStore createNeo4jStore(VectorStoreConfig config) {
    log.info("创建Neo4j向量存储库");
    return new MockVectorService("Neo4j", config);
  }

  /**
   * 创建OpenSearch向量存储库
   */
  private VectorStore createOpenSearchStore(VectorStoreConfig config) {
    log.info("创建OpenSearch向量存储库");
    return new MockVectorService("OpenSearch", config);
  }

  /**
   * 创建Oracle向量存储库
   */
  private VectorStore createOracleStore(VectorStoreConfig config) {
    log.info("创建Oracle向量存储库");
    return new MockVectorService("Oracle", config);
  }

  /**
   * 创建PGvector向量存储库
   */
  private VectorStore createPGVectorStore(VectorStoreConfig config) {
    log.info("创建PGvector向量存储库");
    return new MockVectorService("PGvector", config);
  }

  /**
   * 创建Pinecone向量存储库
   */
  private VectorStore createPineconeStore(VectorStoreConfig config) {
    log.info("创建Pinecone向量存储库");
    return new MockVectorService("Pinecone", config);
  }

  /**
   * 创建Qdrant向量存储库
   */
  private VectorStore createQdrantStore(VectorStoreConfig config) {
    log.info("创建Qdrant向量存储库");
    return new MockVectorService("Qdrant", config);
  }

  /**
   * 创建Redis向量存储库
   */
  private VectorStore createRedisStore(VectorStoreConfig config) {
    log.info("创建Redis向量存储库");
    return new MockVectorService("Redis", config);
  }

  /**
   * 创建SAP Hana向量存储库
   */
  private VectorStore createSAPHanaStore(VectorStoreConfig config) {
    log.info("创建SAP Hana向量存储库");
    return new MockVectorService("SAP Hana", config);
  }

  /**
   * 创建Typesense向量存储库
   */
  private VectorStore createTypesenseStore(VectorStoreConfig config) {
    log.info("创建Typesense向量存储库");
    return new MockVectorService("Typesense", config);
  }

  /**
   * 创建Weaviate向量存储库
   */
  private VectorStore createWeaviateStore(VectorStoreConfig config) {
    log.info("创建Weaviate向量存储库");
    return new MockVectorService("Weaviate", config);
  }


  /**
   * 从缓存中移除
   */
  private void removeFromCache(String cacheKey) {
    CachedVectorStore cachedStore = storeCache.remove(cacheKey);
    if (cachedStore != null) {
      cachedStore.getStore().close();
      log.info("已从缓存中移除向量存储库: {}", cacheKey);
    }
  }

  /**
   * 驱逐最近最少使用的缓存项
   */
  private void evictLeastRecentlyUsed() {
    CachedVectorStore lruStore = storeCache.values().stream()
        .min((a, b) -> a.getLastAccessedAt().compareTo(b.getLastAccessedAt()))
        .orElse(null);

    if (lruStore != null) {
      String keyToRemove = storeCache.entrySet().stream()
          .filter(entry -> entry.getValue() == lruStore)
          .map(Map.Entry::getKey)
          .findFirst()
          .orElse(null);

      if (keyToRemove != null) {
        removeFromCache(keyToRemove);
        log.info("驱逐LRU缓存项: {}", keyToRemove);
      }
    }
  }

  /**
   * 启动自动清理任务
   */
  private void startAutoCleanup() {
    if (cleanupScheduler.isShutdown()) {
      return;
    }

    cleanupScheduler.scheduleAtFixedRate(
        this::cleanupExpiredCache,
        cacheConfig.getCleanupIntervalMinutes(),
        cacheConfig.getCleanupIntervalMinutes(),
        TimeUnit.MINUTES
    );
  }

  /**
   * 清理过期缓存
   */
  private void cleanupExpiredCache() {
    log.info("开始清理过期缓存，当前缓存数量: {}", storeCache.size());

    int removedCount = 0;
    for (Map.Entry<String, CachedVectorStore> entry : storeCache.entrySet()) {
      CachedVectorStore cachedStore = entry.getValue();
      if (cachedStore.isExpired() || cachedStore.isStale()) {
        removeFromCache(entry.getKey());
        removedCount++;
      }
    }

    if (removedCount > 0) {
      log.info("清理完成，移除 {} 个过期缓存项", removedCount);
    }
  }

  /**
   * 清除缓存
   */
  public void clearCache() {
    log.info("清除向量存储库缓存");
    storeCache.values().forEach(cachedStore -> cachedStore.getStore().close());
    storeCache.clear();
  }

  /**
   * 获取缓存统计信息
   */
  public Map<String, Object> getCacheStats() {
    Map<String, Object> stats = new ConcurrentHashMap<>();
    stats.put("totalStores", storeCache.size());
    stats.put("maxCacheSize", cacheConfig.getMaxCacheSize());
    stats.put("defaultTtlMinutes", cacheConfig.getDefaultTtlMinutes());
    stats.put("cleanupIntervalMinutes", cacheConfig.getCleanupIntervalMinutes());
    stats.put("enableAutoCleanup", cacheConfig.isEnableAutoCleanup());
    stats.put("enableConnectionCheck", cacheConfig.isEnableConnectionCheck());

    // 连接状态统计
    long connectedCount = storeCache.values().stream()
        .mapToLong(cachedStore -> cachedStore.getStore().isConnected() ? 1 : 0)
        .sum();
    stats.put("connectedStores", connectedCount);

    // 访问统计
    long totalAccessCount = storeCache.values().stream()
        .mapToLong(CachedVectorStore::getAccessCount)
        .sum();
    stats.put("totalAccessCount", totalAccessCount);

    // 平均访问次数
    double avgAccessCount = storeCache.isEmpty() ? 0 :
        (double) totalAccessCount / storeCache.size();
    stats.put("averageAccessCount", avgAccessCount);

    // 过期统计
    long expiredCount = storeCache.values().stream()
        .mapToLong(cachedStore -> cachedStore.isExpired() ? 1 : 0)
        .sum();
    stats.put("expiredStores", expiredCount);

    return stats;
  }

  /**
   * 获取缓存配置
   */
  public CacheConfig getCacheConfig() {
    return cacheConfig;
  }

  /**
   * 手动清理过期缓存
   */
  public int cleanupExpiredCacheManually() {
    log.info("手动清理过期缓存");
    int initialSize = storeCache.size();
    cleanupExpiredCache();
    return initialSize - storeCache.size();
  }

  /**
   * 预热缓存
   */
  public void warmupCache(VectorStoreConfig config) {
    log.info("预热缓存: {}", config.getStoreType());
    createVectorStore(config);
  }

  /**
   * 批量预热缓存
   */
  public void warmupCacheBatch(java.util.List<VectorStoreConfig> configs) {
    log.info("批量预热缓存: {} 个配置", configs.size());
    for (VectorStoreConfig config : configs) {
      try {
        createVectorStore(config);
      } catch (Exception e) {
        log.warn("预热缓存失败: {} - {}", config.getStoreType(), e.getMessage());
      }
    }
  }

  /**
   * 验证配置是否与缓存匹配（用于外部检查）
   */
  public boolean isConfigMatched(VectorStoreConfig config) {
    String cacheKey = cacheKeyStrategy.generateCacheKey(config);
    String configFingerprint = cacheKeyStrategy.generateConfigFingerprint(config);

    CachedVectorStore cachedStore = storeCache.get(cacheKey);
    if (cachedStore == null) {
      return false;
    }

    return !cachedStore.isConfigChanged(configFingerprint);
  }

  /**
   * 获取缓存中的配置指纹（用于调试）
   */
  public String getCachedConfigFingerprint(VectorStoreConfig config) {
    String cacheKey = cacheKeyStrategy.generateCacheKey(config);
    CachedVectorStore cachedStore = storeCache.get(cacheKey);
    return cachedStore != null ? cachedStore.getConfigFingerprint() : null;
  }

  /**
   * 强制刷新缓存（当配置发生变化时）
   */
  public void refreshCache(VectorStoreConfig config) {
    String cacheKey = cacheKeyStrategy.generateCacheKey(config);
    log.info("强制刷新缓存: {}", cacheKey);
    removeFromCache(cacheKey);
  }

  /**
   * 设置缓存键生成策略
   */
  public void setCacheKeyStrategy(CacheKeyStrategy strategy) {
    if (strategy == null) {
      throw new IllegalArgumentException("缓存键策略不能为空");
    }
    this.cacheKeyStrategy = strategy;
    log.info("已设置缓存键策略: {}", strategy.getClass().getSimpleName());
  }

  /**
   * 获取当前缓存键生成策略
   */
  public CacheKeyStrategy getCacheKeyStrategy() {
    return cacheKeyStrategy;
  }

  /**
   * 使用指定策略创建向量存储库实例
   */
  public VectorStore createVectorStore(VectorStoreConfig config, CacheKeyStrategy strategy) {
    CacheKeyStrategy originalStrategy = this.cacheKeyStrategy;
    try {
      this.cacheKeyStrategy = strategy;
      return createVectorStore(config);
    } finally {
      this.cacheKeyStrategy = originalStrategy;
    }
  }

  /**
   * 使用指定策略创建向量存储库实例（带TTL）
   */
  public VectorStore createVectorStore(VectorStoreConfig config, long ttlMinutes,
      CacheKeyStrategy strategy) {
    CacheKeyStrategy originalStrategy = this.cacheKeyStrategy;
    try {
      this.cacheKeyStrategy = strategy;
      return createVectorStore(config, ttlMinutes);
    } finally {
      this.cacheKeyStrategy = originalStrategy;
    }
  }

}
