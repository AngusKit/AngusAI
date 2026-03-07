package cloud.xcan.agentx.core.vectorstore;

import dev.langchain4j.data.segment.TextSegment;
import dev.langchain4j.store.embedding.EmbeddingStore;

/**
 * 向量存储工厂 SPI — 根据配置创建具体的 EmbeddingStore 实例。
 * <p>
 * 每种向量存储适配器（PgVector、Milvus 等）各自实现此接口。
 * </p>
 */
public interface VectorStoreFactory {

  /**
   * 该工厂支持的向量存储类型（如 "pgvector"、"milvus"）
   */
  String getType();

  /**
   * 根据配置创建 EmbeddingStore
   */
  EmbeddingStore<TextSegment> createEmbeddingStore(VectorStoreConfigDefinition config);
}
