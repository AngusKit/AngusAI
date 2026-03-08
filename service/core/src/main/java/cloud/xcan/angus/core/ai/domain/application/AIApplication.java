package cloud.xcan.angus.core.ai.domain.application;

import cloud.xcan.angus.core.ai.domain.model.Model;
import cloud.xcan.angus.core.jpa.multitenancy.TenantAuditingEntity;
import io.hypersistence.utils.hibernate.type.json.JsonType;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
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

  @Column(name = "name", nullable = false, length = 100)
  private String name;

  @Column(name = "icon", nullable = false)
  private String icon;

  @Column(name = "description", length = 800)
  private String description;

  @Enumerated(EnumType.STRING)
  @Column(name = "category", nullable = false)
  private ApplicationCategory category;

  @Enumerated(EnumType.STRING)
  @Column(name = "status", nullable = false)
  private ApplicationStatus status;

  @Column(name = "language", length = 20)
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

  /**
   * 应用与智能体的一对多绑定关系（每个应用可绑定多个智能体）
   */
  @OneToMany(mappedBy = "application", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
  @OrderBy("sortOrder ASC")
  private List<ApplicationAgent> agentBindings = new java.util.ArrayList<>();

  /**
   * 获取默认智能体ID（用于对话时选用） 优先返回 isDefault=true 的绑定，否则按 sortOrder 取第一个
   */
  public Long getDefaultAgentId() {
    if (agentBindings == null || agentBindings.isEmpty()) {
      return null;
    }
    return agentBindings.stream()
        .filter(b -> Boolean.TRUE.equals(b.getIsDefault()))
        .findFirst()
        .map(ApplicationAgent::getAgentId)
        .orElseGet(() -> agentBindings.get(0).getAgentId());
  }

  /**
   * 获取所有绑定的智能体ID列表（按 sortOrder 排序）
   */
  public List<Long> getAgentIds() {
    if (agentBindings == null || agentBindings.isEmpty()) {
      return List.of();
    }
    return agentBindings.stream()
        .map(ApplicationAgent::getAgentId)
        .toList();
  }

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
