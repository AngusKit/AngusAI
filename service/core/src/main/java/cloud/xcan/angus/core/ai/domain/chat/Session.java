package cloud.xcan.angus.core.ai.domain.chat;

import cloud.xcan.angus.core.jpa.multitenancy.TenantAuditingEntity;
import io.hypersistence.utils.hibernate.type.json.JsonType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.Type;

/**
 * 对话会话实体
 */
@Getter
@Setter
@Entity
@Table(name = "ai_chat_session")
public class Session extends TenantAuditingEntity<Session, Long> {

  @Id
  private Long id;

  /**
   * 会话业务标识，UUID 格式，对话、Session、Message 统一使用此字段关联
   */
  @Column(name = "session_id", unique = true, length = 36)
  private String sessionId;

  @Column(nullable = false, length = 200)
  private String title;

  @Column(name = "app_id", nullable = false)
  private Long appId;

  @Column(name = "agent_id", nullable = false)
  private Long agentId;

  @Column(name = "model_id", nullable = false)
  private Long modelId;

  @Column(name = "is_starred", nullable = false)
  private Boolean isStarred = false;

  @Column(name = "is_archived", nullable = false)
  private Boolean isArchived = false;

  @Column(name = "is_pinned", nullable = false)
  private Boolean isPinned = false;

  @Column(name = "message_count", nullable = false)
  private Integer messageCount = 0;

  @Type(JsonType.class)
  @Column(name = "config", columnDefinition = "json", length = 2000)
  private SessionConfig config;

  @Transient
  private Message lastMessage;

  @Override
  public Long identity() {
    return id;
  }
}
