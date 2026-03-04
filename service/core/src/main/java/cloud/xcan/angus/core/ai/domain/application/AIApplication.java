package cloud.xcan.angus.core.ai.domain.application;

import cloud.xcan.angus.core.ai.domain.Constants;
import cloud.xcan.angus.core.ai.domain.model.Model;
import cloud.xcan.angus.core.jpa.multitenancy.TenantAuditingEntity;
import io.hypersistence.utils.hibernate.type.json.JsonType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;
import java.time.LocalDateTime;
import java.util.List;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;
import org.hibernate.annotations.Type;

/**
 * 应用实体
 */
@Entity
@Table(name = "ai_application")
@Setter
@Getter
@Accessors(chain = true)
public class AIApplication extends TenantAuditingEntity<AIApplication, Long> {

  @Id
  private Long id;

  @Column(name = "name", nullable = false, length = Constants.APPLICATION_NAME_MAX_LENGTH)
  private String name;

  @Column(name = "icon", nullable = false)
  private String icon;

  @Column(name = "description", length = Constants.APPLICATION_DESCRIPTION_DB_LENGTH)
  private String description;

  @Enumerated(EnumType.STRING)
  @Column(name = "category", nullable = false)
  private ApplicationCategory category;

  @Enumerated(EnumType.STRING)
  @Column(name = "status", nullable = false)
  private ApplicationStatus status;

  @Column(name = "language", length = Constants.APPLICATION_LANGUAGE_MAX_LENGTH)
  private String language;

  @Column(name = "published_date")
  private LocalDateTime publishedDate;

  // 统计数据
  @Column(name = "api_calls")
  private Long apiCalls = 0L;

  @Column(name = "total_tokens")
  private Long totalTokens = 0L;

  @Column(name = "avg_response_time")
  private Double avgResponseTime = 0.0;

  @Column(name = "success_rate")
  private Double successRate = 0.0;

  // 配置信息（JSON格式存储）
  @Type(JsonType.class)
  @Column(columnDefinition = "json", name = "config")
  private ApplicationConfig config;

  // 关联资源（冗余字段）
  @Column(name = "model_id")
  private Long modelId;

  @Type(JsonType.class)
  @Column(columnDefinition = "json", name = "knowledge_base_ids")
  private List<Long> knowledgeBaseIds;

  @Type(JsonType.class)
  @Column(columnDefinition = "json", name = "dataset_ids")
  private List<Long> datasetIds;

  @Type(JsonType.class)
  @Column(columnDefinition = "json", name = "api_collection_ids")
  private List<Long> apiCollectionIds;

  @Column( name = "workflow_id")
  private Long workflowId;

  // 发布设置
  @Column(name = "public_access")
  private Boolean publicAccess = false;

  @Column(name = "embed_enabled")
  private Boolean embedEnabled = false;

  @Column(name = "api_enabled")
  private Boolean apiEnabled = false;

  // 分享相关
  @Column(name = "share_id")
  private String shareId;

  @Column(name = "share_expires_at")
  private LocalDateTime shareExpiresAt;

  @Type(JsonType.class)
  @Column(columnDefinition = "json", name = "share")
  private ApplicationShare share;

  @Transient
  private boolean sharePublicAccess;
  @Transient
  private boolean shareAnonymousAccess;
  @Transient
  private boolean shareAuthorizationRequired;
  @Transient
  private Model appDefaultModel;
  @Transient
  private Model currentUseMode;

  @Override
  public Long identity() {
    return this.id;
  }
}
