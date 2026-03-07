package cloud.xcan.agentx.core.vectorstore;

import java.util.Map;
import lombok.Builder;
import lombok.Data;

/**
 * 向量存储配置定义 — 从数据库或其他外部源加载
 */
@Data
@Builder
public class VectorStoreConfigDefinition {

  /**
   * 配置唯一标识
   */
  private String id;

  /**
   * 向量存储类型: pgvector / milvus / qdrant / chroma 等
   */
  private String type;

  /**
   * 数据库连接 URL
   */
  private String url;

  /**
   * 用户名
   */
  private String username;

  /**
   * 密码（加密存储）
   */
  private String password;

  /**
   * 集合/表名
   */
  private String collectionName;

  /**
   * 向量维度
   */
  @Builder.Default
  private Integer dimension = 1536;

  /**
   * 是否为默认配置
   */
  @Builder.Default
  private boolean defaultConfig = false;

  /**
   * 租户 ID（null 为全局）
   */
  private String tenantId;

  /**
   * 扩展参数
   */
  private Map<String, Object> extraProperties;
}
