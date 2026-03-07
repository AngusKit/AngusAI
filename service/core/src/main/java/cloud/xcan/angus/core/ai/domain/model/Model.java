package cloud.xcan.angus.core.ai.domain.model;

import cloud.xcan.angus.core.jpa.multitenancy.TenantAuditingEntity;
import cloud.xcan.angus.core.jpa.multitenancy.TenantListener;
import cloud.xcan.core.model.ModelConfigDefinition;
import cloud.xcan.core.model.ModelProvider;
import dev.langchain4j.model.catalog.ModelType;
import io.hypersistence.utils.hibernate.type.json.JsonType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;
import org.hibernate.annotations.Type;

/**
 * 模型实体
 */
@Entity
@Table(name = "ai_model")
@EntityListeners(TenantListener.class)
@Setter
@Getter
@Accessors(chain = true)
public class Model extends TenantAuditingEntity<Model, Long> {

  @Id
  private Long id;

  @Column(name = "name", nullable = false, length = 50)
  private String name;

  @Column(name = "description", nullable = false, length = 500)
  private String description;

  @Enumerated(EnumType.STRING)
  @Column(name = "type", nullable = false)
  private ModelType type;

  @Enumerated(EnumType.STRING)
  @Column(name = "provider", nullable = false)
  private ModelProvider provider;

  @Enumerated(EnumType.STRING)
  @Column(name = "status", nullable = false)
  private ModelStatus status;

  // 配置信息（JSON格式存储）
  @Type(JsonType.class)
  @Column(columnDefinition = "json", name = "config")
  private ModelConfigDefinition config;

  @Type(JsonType.class)
  @Column(columnDefinition = "json", name = "access_limit")
  private ModelAccessLimit accessLimit;

  @Transient
  private ModelStats stats;
  @Transient
  private ModelPerformance performance;

  @Override
  public Long identity() {
    return this.id;
  }
}
