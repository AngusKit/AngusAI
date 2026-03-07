package cloud.xcan.agentx.core.vectorstore;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

/**
 * 向量存储类型枚举 — 与 VectorStoreFactory 实现支持的类型一致。
 */
public enum VectorStoreType {
  /** PostgreSQL pgvector 扩展 */
  PGVECTOR,
  /** Milvus 向量数据库 */
  MILVUS,
  /** Qdrant 向量数据库 */
  QDRANT,
  /** Chroma 向量数据库 */
  CHROMA,
  /** Elasticsearch */
  ELASTICSEARCH,
  /** Weaviate 向量数据库 */
  WEAVIATE,
  /** MariaDB 向量扩展 */
  MARIADB;

  /**
   * 用于 Map 查找、JSON 序列化 — 与 VectorStoreFactory.getType() 返回值一致（小写）
   */
  @JsonValue
  public String getKey() {
    return name().toLowerCase();
  }

  @JsonCreator
  public static VectorStoreType fromKey(String key) {
    if (key == null || key.isBlank()) {
      return null;
    }
    String normalized = key.toLowerCase().trim();
    for (VectorStoreType t : values()) {
      if (t.name().toLowerCase().equals(normalized)) {
        return t;
      }
    }
    try {
      return valueOf(key.toUpperCase().replace("-", "_"));
    } catch (IllegalArgumentException e) {
      return null;
    }
  }
}
