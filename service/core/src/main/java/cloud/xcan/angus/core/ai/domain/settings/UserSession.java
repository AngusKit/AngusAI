package cloud.xcan.angus.core.ai.domain.settings;

import cloud.xcan.angus.core.jpa.multitenancy.TenantAuditingEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;

/**
 * 用户会话实体
 */
@Entity
@Table(name = "user_session")
@Setter
@Getter
@Accessors(chain = true)
public class UserSession extends TenantAuditingEntity<UserSession, Long> {

  @Id
  private Long id;

  @Column(name = "user_id", nullable = false)
  private Long userId;

  @Column(name = "session_id", nullable = false, unique = true, length = 500)
  private String sessionId;

  @Column(name = "device", length = 200)
  private String device;

  @Column(name = "browser", length = 100)
  private String browser;

  @Column(name = "ip", length = 50)
  private String ip;

  @Column(name = "location", length = 200)
  private String location;

  @Column(name = "is_current")
  private Boolean isCurrent = false;

  @Column(name = "last_active_at")
  private LocalDateTime lastActiveAt;

  @Column(name = "expires_at")
  private LocalDateTime expiresAt;

  @Override
  public Long identity() {
    return this.id;
  }
}
