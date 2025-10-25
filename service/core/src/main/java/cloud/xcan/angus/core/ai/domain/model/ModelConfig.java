package cloud.xcan.angus.core.ai.domain.model;

import io.hypersistence.utils.hibernate.type.json.JsonType;
import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.Data;
import org.hibernate.annotations.Type;

/**
 * 模型配置
 */
@Data
@Embeddable
public class ModelConfig {

  // API配置
  @Column(name = "api_endpoint")
  private String apiEndpoint;

  @Column(name = "api_key")
  private String apiKey;

  @Column(name = "api_key_masked")
  private String apiKeyMasked;

  // 模型参数
  @Type(JsonType.class)
  @Column(columnDefinition = "json", name = "parameters")
  private Object parameters;

  // 部署配置
  @Type(JsonType.class)
  @Column(columnDefinition = "json", name = "deployment")
  private Object deployment;

  // 限制配置
  @Type(JsonType.class)
  @Column(columnDefinition = "json", name = "limits")
  private Object limits;

  // 性能配置
  @Type(JsonType.class)
  @Column(columnDefinition = "json", name = "performance")
  private Object performance;

  // 监控配置
  @Type(JsonType.class)
  @Column(columnDefinition = "json", name = "monitoring")
  private Object monitoring;

  // 安全配置
  @Type(JsonType.class)
  @Column(columnDefinition = "json", name = "security")
  private Object security;
}
