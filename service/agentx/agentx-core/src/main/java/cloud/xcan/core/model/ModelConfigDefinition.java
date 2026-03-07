package cloud.xcan.core.model;

import dev.langchain4j.model.catalog.ModelType;
import java.util.Map;
import lombok.Builder;
import lombok.Data;

/**
 * 模型配置定义 — 从数据库或其他外部源加载的模型配置
 */
@Data
@Builder
public class ModelConfigDefinition {

  /**
   * 配置唯一标识
   */
  private String id;

  /**
   * 模型提供商
   */
  private ModelProvider provider;

  /**
   * 模型类型: chat / image / audio / embedding / moderation
   */
  private ModelType type;

  /**
   * 模型名称
   */
  private String modelName;

  /**
   * API Key（加密存储）
   */
  private String apiKey;

  /**
   * API Base URL（用于自托管或代理）
   */
  private String baseUrl;

  /**
   * 温度参数
   */
  @Builder.Default
  private Double temperature = 0.7;

  /**
   * 最大 Token 数
   */
  @Builder.Default
  private Integer maxTokens = 4096;

  /**
   * Embedding 模型名称
   */
  private String embeddingModelName;

  /**
   * 是否为默认配置 — 多个模型时优先选择默认模型
   */
  @Builder.Default
  private boolean defaultConfig = false;

  /**
   * 优先级 — 数值越大优先级越高；无默认模型时选择优先级最高的
   */
  @Builder.Default
  private Integer priority = 0;

  /**
   * 租户 ID（null 为全局）
   */
  private String tenantId;

  /**
   * 扩展参数
   */
  private Map<String, Object> extraProperties;
}
