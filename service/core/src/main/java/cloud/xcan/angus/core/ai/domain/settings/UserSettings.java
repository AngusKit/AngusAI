package cloud.xcan.angus.core.ai.domain.settings;

import cloud.xcan.angus.core.jpa.multitenancy.TenantAuditingEntity;
import cloud.xcan.angus.core.jpa.multitenancy.TenantListener;
import io.hypersistence.utils.hibernate.type.json.JsonType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;
import org.hibernate.annotations.Type;

/**
 * 用户设置实体
 */
@Entity
@Table(name = "user_settings")
@EntityListeners({TenantListener.class})
@Setter
@Getter
@Accessors(chain = true)
public class UserSettings extends TenantAuditingEntity<UserSettings, Long> {

  @Id
  private Long id;

  @Column(name = "user_id", nullable = false, unique = true)
  private Long userId;

  // 基本信息
  @Column(name = "name", length = 100)
  private String name;

  @Column(name = "email", nullable = false, length = 255)
  private String email;

  @Column(name = "avatar", length = 500)
  private String avatar;

  @Column(name = "phone", length = 50)
  private String phone;

  @Column(name = "company", length = 200)
  private String company;

  @Column(name = "position", length = 100)
  private String position;

  @Column(name = "timezone", length = 50)
  private String timezone = "Asia/Shanghai";

  @Column(name = "language", length = 20)
  private String language = "zh-CN";

  // 偏好设置（JSON格式）
  @Type(JsonType.class)
  @Column(columnDefinition = "json", name = "preferences")
  private UserPreferences preferences;

  // 隐私设置（JSON格式）
  @Type(JsonType.class)
  @Column(columnDefinition = "json", name = "privacy")
  private PrivacySettings privacy;

  // 通知设置（JSON格式）
  @Type(JsonType.class)
  @Column(columnDefinition = "json", name = "notification_settings")
  private NotificationSettings notificationSettings;

  // 账户删除相关
  @Column(name = "deletion_scheduled_at")
  private java.time.LocalDateTime deletionScheduledAt;

  @Column(name = "deletion_reason", length = 500)
  private String deletionReason;

  @Override
  public Long identity() {
    return this.id;
  }
}
