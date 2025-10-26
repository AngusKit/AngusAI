package cloud.xcan.angus.core.ai.domain.settings.securitysettings;

import cloud.xcan.angus.core.ai.domain.settings.TwoFactorMethod;
import cloud.xcan.angus.core.jpa.multitenancy.TenantAuditingEntity;
import cloud.xcan.angus.core.jpa.multitenancy.TenantListener;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;

/**
 * 安全设置实体
 */
@Entity
@Table(name = "security_settings")
@EntityListeners({TenantListener.class})
@Setter
@Getter
@Accessors(chain = true)
public class SecuritySettings extends TenantAuditingEntity<SecuritySettings, Long> {

  @Id
  private Long id;

  @Column(name = "user_id", nullable = false, unique = true)
  private Long userId;

  // 双因素认证
  @Column(name = "two_factor_enabled")
  private Boolean twoFactorEnabled = false;

  @Enumerated(EnumType.STRING)
  @Column(name = "two_factor_method", length = 20)
  private TwoFactorMethod twoFactorMethod;

  @Column(name = "two_factor_secret", length = 500)
  private String twoFactorSecret;

  @Column(name = "two_factor_setup_at")
  private LocalDateTime twoFactorSetupAt;

  @Column(name = "backup_codes", length = 1000)
  private String backupCodes; // JSON数组

  // 会话管理
  @Column(name = "max_active_sessions")
  private Integer maxActiveSessions = 5;

  @Column(name = "session_timeout")
  private Integer sessionTimeout = 1440; // 分钟，默认24小时

  // 密码策略
  @Column(name = "password_last_changed_at")
  private LocalDateTime passwordLastChangedAt;

  @Column(name = "password_expires_in")
  private Integer passwordExpiresIn; // 天数，null表示不过期

  // IP白名单
  @Column(name = "ip_whitelist_enabled")
  private Boolean ipWhitelistEnabled = false;

  @Column(name = "ip_whitelist", length = 2000)
  private String ipWhitelist; // JSON数组

  @Override
  public Long identity() {
    return this.id;
  }
}
