package cloud.xcan.angus.core.ai.infra.ai.vector;

import jakarta.annotation.Resource;
import java.util.List;
import java.util.Map;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

/**
 * 向量存储库使用示例 展示如何使用 EnhancedVectorStoreFactory 创建和管理各种类型的向量存储库 包含基本使用、缓存管理、配置变更检测等功能演示
 */
@Component
@Slf4j
public class VectorStoreExample {

  @Resource
  private EnhancedVectorStoreFactory enhancedVectorStoreFactory;

  /**
   * 演示向量存储库的基本使用
   */
  public void demonstrateBasicUsage() {
    log.info("=== 向量存储库基本使用演示 ===");

    // 1. Redis 向量存储库
    demonstrateRedisVectorStore();

    // 2. Pinecone 向量存储库
    demonstratePineconeVectorStore();

    // 3. Milvus 向量存储库
    demonstrateMilvusVectorStore();

    // 4. Elasticsearch 向量存储库
    demonstrateElasticsearchVectorStore();

    // 5. MongoDB Atlas 向量存储库
    demonstrateMongoDBVectorStore();
  }

  /**
   * 演示缓存功能
   */
  public void demonstrateCacheFeatures() {
    log.info("=== 向量存储库缓存功能演示 ===");

    // 1. 配置缓存参数
    configureCache();

    // 2. 演示基本缓存功能
    demonstrateBasicCaching();

    // 3. 演示TTL功能
    demonstrateTTL();

    // 4. 演示LRU驱逐
    demonstrateLRUEviction();

    // 5. 演示缓存统计
    demonstrateCacheStats();

    // 6. 演示预热缓存
    demonstrateCacheWarmup();
  }

  /**
   * 演示配置变更检测
   */
  public void demonstrateConfigChangeDetection() {
    log.info("=== 向量存储库配置变更检测演示 ===");

    // 1. 创建初始配置
    VectorStoreConfig originalConfig = VectorStoreConfigBuilder
        .pinecone("original-key", "https://original.svc.pinecone.io")
        .dimension(1536)
        .indexName("original-index")
        .timeout(30000)
        .build();

    // 2. 创建实例
    VectorStore store1 = enhancedVectorStoreFactory.createVectorStore(originalConfig);
    log.info("创建初始实例: {}", store1);

    // 3. 使用相同配置创建（应该命中缓存）
    VectorStore store2 = enhancedVectorStoreFactory.createVectorStore(originalConfig);
    log.info("相同配置创建: {} (应该命中缓存)", store1 == store2);

    // 4. 修改配置（API密钥）
    VectorStoreConfig modifiedConfig = VectorStoreConfigBuilder
        .pinecone("modified-key", "https://original.svc.pinecone.io")
        .dimension(1536)
        .indexName("original-index")
        .timeout(30000)
        .build();

    // 5. 使用修改后的配置创建（应该创建新实例）
    VectorStore store3 = enhancedVectorStoreFactory.createVectorStore(modifiedConfig);
    log.info("修改配置创建: {} (应该创建新实例)", store1 == store3);

    // 6. 清理资源
    store1.close();
    store2.close();
    store3.close();
  }

  /**
   * 演示批量操作
   */
  public void demonstrateBatchOperations() {
    log.info("=== 向量存储库批量操作演示 ===");

    // 定义多个配置
    VectorStoreConfig[] configs = {
        VectorStoreConfigBuilder.redis("localhost", 6379).indexName("redis_vectors").build(),
        VectorStoreConfigBuilder.milvus("localhost", 19530, "milvus_collection").build(),
        VectorStoreConfigBuilder.elasticsearch("localhost", 9200, "es_index").build(),
        VectorStoreConfigBuilder.weaviate("localhost", 8080)
            .collection("WeaviateCollection").build()
    };

    // 批量创建
    for (int i = 0; i < configs.length; i++) {
      try {
        VectorStore store = enhancedVectorStoreFactory.createVectorStore(configs[i]);
        log.info("成功创建向量存储库 {}: {}", i + 1, configs[i].getStoreType().getDisplayName());

        // 简单测试
        boolean connected = store.isConnected();
        log.info("存储库 {} 连接状态: {}", i + 1, connected);

        store.close();
      } catch (Exception e) {
        log.error("创建向量存储库 {} 失败: {}", i + 1, e.getMessage());
      }
    }
  }

  // ==================== 具体向量存储库演示方法 ====================

  /**
   * Redis 向量存储库示例
   */
  private void demonstrateRedisVectorStore() {
    log.info("--- Redis 向量存储库示例 ---");

    VectorStoreConfig config = VectorStoreConfigBuilder
        .redis("localhost", 6379)
        .database("0")
        .indexName("document_vectors")
        .dimension(1536)
        .timeout(30000)
        .maxConnections(10)
        .sslEnabled(false)
        .build();

    VectorStore store = enhancedVectorStoreFactory.createVectorStore(config);
    testVectorStoreOperations(store, "Redis");
    store.close();
  }

  /**
   * Pinecone 向量存储库示例
   */
  private void demonstratePineconeVectorStore() {
    log.info("--- Pinecone 向量存储库示例 ---");

    VectorStoreConfig config = VectorStoreConfigBuilder
        .pinecone("your-api-key", "https://your-index.svc.pinecone.io")
        .namespace("production")
        .indexName("document-index")
        .dimension(1536)
        .region("us-east-1")
        .build();

    VectorStore store = enhancedVectorStoreFactory.createVectorStore(config);
    testVectorStoreOperations(store, "Pinecone");
    store.close();
  }

  /**
   * Milvus 向量存储库示例
   */
  private void demonstrateMilvusVectorStore() {
    log.info("--- Milvus 向量存储库示例 ---");

    VectorStoreConfig config = VectorStoreConfigBuilder
        .milvus("localhost", 19530, "document_collection")
        .database("vector_db")
        .username("root")
        .password("milvus")
        .dimension(1024)
        .timeout(30000)
        .build();

    VectorStore store = enhancedVectorStoreFactory.createVectorStore(config);
    testVectorStoreOperations(store, "Milvus");
    store.close();
  }

  /**
   * Elasticsearch 向量存储库示例
   */
  private void demonstrateElasticsearchVectorStore() {
    log.info("--- Elasticsearch 向量存储库示例 ---");

    VectorStoreConfig config = VectorStoreConfigBuilder
        .elasticsearch("localhost", 9200, "document_index")
        .username("elastic")
        .password("password")
        .dimension(768)
        .sslEnabled(false)
        .timeout(30000)
        .build();

    VectorStore store = enhancedVectorStoreFactory.createVectorStore(config);
    testVectorStoreOperations(store, "Elasticsearch");
    store.close();
  }

  /**
   * MongoDB Atlas 向量存储库示例
   */
  private void demonstrateMongoDBVectorStore() {
    log.info("--- MongoDB Atlas 向量存储库示例 ---");

    VectorStoreConfig config = VectorStoreConfigBuilder
        .mongodbAtlas("mongodb+srv://username:password@cluster.mongodb.net/vector_db")
        .database("vector_db")
        .collection("documents")
        .dimension(1536)
        .build();

    VectorStore store = enhancedVectorStoreFactory.createVectorStore(config);
    testVectorStoreOperations(store, "MongoDB Atlas");
    store.close();
  }

  // ==================== 缓存功能演示方法 ====================

  /**
   * 配置缓存参数
   */
  private void configureCache() {
    log.info("配置缓存参数");

    EnhancedVectorStoreFactory.CacheConfig cacheConfig = enhancedVectorStoreFactory.getCacheConfig();
    cacheConfig.setMaxCacheSize(50);
    cacheConfig.setDefaultTtlMinutes(30);
    cacheConfig.setCleanupIntervalMinutes(5);
    cacheConfig.setEnableAutoCleanup(true);
    cacheConfig.setEnableConnectionCheck(true);

    log.info("缓存配置: 最大数量={}, TTL={}分钟, 清理间隔={}分钟",
        cacheConfig.getMaxCacheSize(),
        cacheConfig.getDefaultTtlMinutes(),
        cacheConfig.getCleanupIntervalMinutes());
  }

  /**
   * 演示基本缓存功能
   */
  private void demonstrateBasicCaching() {
    log.info("演示基本缓存功能");

    VectorStoreConfig config = VectorStoreConfigBuilder
        .redis("localhost", 6379)
        .indexName("cache_test")
        .build();

    // 第一次创建
    VectorStore store1 = enhancedVectorStoreFactory.createVectorStore(config);
    log.info("第一次创建: {}", store1);

    // 第二次创建（应该命中缓存）
    VectorStore store2 = enhancedVectorStoreFactory.createVectorStore(config);
    log.info("第二次创建: {} (应该命中缓存)", store1 == store2);

    store1.close();
    store2.close();
  }

  /**
   * 演示TTL功能
   */
  private void demonstrateTTL() {
    log.info("演示TTL功能");

    VectorStoreConfig config = VectorStoreConfigBuilder
        .milvus("localhost", 19530, "ttl_test")
        .build();

    // 创建短期TTL实例
    VectorStore store = enhancedVectorStoreFactory.createVectorStore(config, 1); // 1分钟TTL
    log.info("创建短期TTL实例: {}", store);

    // 等待TTL过期
    try {
      Thread.sleep(61000); // 等待61秒
    } catch (InterruptedException e) {
      Thread.currentThread().interrupt();
    }

    // 再次创建（应该创建新实例）
    VectorStore newStore = enhancedVectorStoreFactory.createVectorStore(config);
    log.info("TTL过期后创建: {} (应该创建新实例)", store == newStore);

    store.close();
    newStore.close();
  }

  /**
   * 演示LRU驱逐
   */
  private void demonstrateLRUEviction() {
    log.info("演示LRU驱逐");

    // 创建多个配置以触发LRU驱逐
    for (int i = 0; i < 5; i++) {
      VectorStoreConfig config = VectorStoreConfigBuilder
          .redis("localhost", 6379)
          .indexName("lru_test_" + i)
          .build();

      VectorStore store = enhancedVectorStoreFactory.createVectorStore(config);
      log.info("创建LRU测试实例 {}: {}", i, store);
      store.close();
    }

    // 获取缓存统计
    Map<String, Object> stats = enhancedVectorStoreFactory.getCacheStats();
    log.info("LRU驱逐后缓存统计: {}", stats);
  }

  /**
   * 演示缓存统计
   */
  private void demonstrateCacheStats() {
    log.info("演示缓存统计");

    Map<String, Object> stats = enhancedVectorStoreFactory.getCacheStats();
    log.info("缓存统计信息: {}", stats);

    // 显示详细统计
    log.info("总存储库数量: {}", stats.get("totalStores"));
    log.info("已连接存储库数量: {}", stats.get("connectedStores"));
    log.info("总访问次数: {}", stats.get("totalAccessCount"));
    log.info("平均访问次数: {}", stats.get("averageAccessCount"));
    log.info("过期存储库数量: {}", stats.get("expiredStores"));
  }

  /**
   * 演示预热缓存
   */
  private void demonstrateCacheWarmup() {
    log.info("演示预热缓存");

    List<VectorStoreConfig> configs = List.of(
        VectorStoreConfigBuilder.redis("localhost", 6379).indexName("warmup_1").build(),
        VectorStoreConfigBuilder.milvus("localhost", 19530, "warmup_2").build(),
        VectorStoreConfigBuilder.elasticsearch("localhost", 9200, "warmup_3").build()
    );

    enhancedVectorStoreFactory.warmupCacheBatch(configs);

    Map<String, Object> stats = enhancedVectorStoreFactory.getCacheStats();
    log.info("预热后缓存统计: {}", stats);
  }

  // ==================== 辅助方法 ====================

  /**
   * 测试向量存储库的基本操作
   */
  private void testVectorStoreOperations(VectorStore store, String storeType) {
    try {
      log.info("测试 {} 向量存储库操作", storeType);

      // 检查连接状态
      boolean connected = store.isConnected();
      log.info("{} 连接状态: {}", storeType, connected);

      if (!connected) {
        log.warn("{} 未连接，跳过操作测试", storeType);
        return;
      }

      // 生成测试向量
      float[] testVector = generateTestVector(1536);
      Map<String, Object> metadata = Map.of(
          "title", "测试文档",
          "type", "example",
          "timestamp", System.currentTimeMillis()
      );

      // 添加文档
      store.addDocument("test_doc_1", testVector, metadata);
      log.info("{} 添加文档成功", storeType);

      // 更新文档
      float[] updatedVector = generateTestVector(1536);
      Map<String, Object> updatedMetadata = Map.of(
          "title", "更新的测试文档",
          "type", "updated_example",
          "timestamp", System.currentTimeMillis()
      );
      store.updateDocument("test_doc_1", updatedVector, updatedMetadata);
      log.info("{} 更新文档成功", storeType);

      // 相似性搜索
      float[] queryVector = generateTestVector(1536);
      Map<String, Object> searchResults = store.searchSimilar(queryVector, 5);
      log.info("{} 相似性搜索结果: {}", storeType, searchResults);

      // 删除文档
      store.deleteDocument("test_doc_1");
      log.info("{} 删除文档成功", storeType);

      log.info("{} 所有操作测试完成", storeType);

    } catch (Exception e) {
      log.error("{} 操作测试失败: {}", storeType, e.getMessage(), e);
    }
  }

  /**
   * 生成测试向量
   */
  private float[] generateTestVector(int dimension) {
    float[] vector = new float[dimension];
    for (int i = 0; i < dimension; i++) {
      vector[i] = (float) (Math.random() * 2 - 1); // 生成 -1 到 1 之间的随机数
    }
    return vector;
  }

  /**
   * 演示配置验证
   */
  public void demonstrateConfigValidation() {
    log.info("=== 配置验证示例 ===");

    // 有效配置
    VectorStoreConfig validConfig = VectorStoreConfigBuilder
        .redis("localhost", 6379)
        .indexName("test_index")
        .build();

    boolean isValid = validConfig.isValid();
    log.info("有效配置验证结果: {}", isValid);

    // 无效配置（缺少必需参数）
    VectorStoreConfig invalidConfig = VectorStoreConfigBuilder
        .pinecone("", "") // 空的 API Key 和 Endpoint
        .build();

    boolean isInvalid = invalidConfig.isValid();
    log.info("无效配置验证结果: {}", isInvalid);

    // 测试创建
    try {
      VectorStore validStore = enhancedVectorStoreFactory.createVectorStore(validConfig);
      log.info("有效配置创建成功");
      validStore.close();
    } catch (Exception e) {
      log.error("有效配置创建失败: {}", e.getMessage());
    }

    try {
      VectorStore invalidStore = enhancedVectorStoreFactory.createVectorStore(invalidConfig);
      log.info("无效配置创建成功（使用了模拟实现）");
      invalidStore.close();
    } catch (Exception e) {
      log.error("无效配置创建失败: {}", e.getMessage());
    }
  }
}
