package cloud.xcan.angus.core.ai.domain.notification;

import cloud.xcan.angus.core.ai.domain.notification.enums.NotificationPriority;
import cloud.xcan.angus.core.ai.domain.notification.enums.NotificationType;
import cloud.xcan.angus.core.jpa.multitenancy.TenantEntity;
import cloud.xcan.angus.core.jpa.multitenancy.TenantListener;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;

/**
 * 通知领域实体
 */
@Entity
@Table(name = "ai_notification", indexes = {
    @Index(name = "idx_ai_notification_tenant_id", columnList = "tenant_id"),
    @Index(name = "idx_ai_notification_is_read", columnList = "is_read"),
    @Index(name = "idx_ai_notification_is_starred", columnList = "is_starred"),
    @Index(name = "idx_ai_notification_is_archived", columnList = "is_archived"),
    @Index(name = "idx_ai_notification_is_email_sent", columnList = "is_email_sent"),
    @Index(name = "idx_ai_notification_category", columnList = "category"),
    @Index(name = "idx_ai_notification_priority", columnList = "priority"),
    @Index(name = "idx_ai_notification_timestamp", columnList = "timestamp")
})
@EntityListeners({TenantListener.class})
@Setter
@Getter
@Accessors(chain = true)
public class Notification extends TenantEntity<Notification, Long> {

  @Id
  private Long id;

  @Column(name = "type", nullable = false, length = 20)
  @Enumerated(EnumType.STRING)
  private NotificationType type;

  @Column(name = "title", nullable = false, length = 200)
  private String title;

  @Column(name = "description", nullable = false, length = 1000)
  private String description;

  @Column(name = "category", nullable = false, length = 100)
  private String category;

  @Column(name = "is_read", nullable = false)
  private Boolean isRead = false;

  @Column(name = "is_starred", nullable = false)
  private Boolean isStarred = false;

  @Column(name = "is_archived", nullable = false)
  private Boolean isArchived = false;

  @Column(name = "is_email_sent", nullable = false)
  private Boolean isEmailSent = false;

  @Column(name = "priority", nullable = false, length = 20)
  @Enumerated(EnumType.STRING)
  private NotificationPriority priority = NotificationPriority.MEDIUM;

  @Column(name = "timestamp", nullable = false)
  private LocalDateTime timestamp;

  @Column(name = "target_user_id")
  private Long targetUserId;

  @Override
  public Long identity() {
    return this.id;
  }
}
