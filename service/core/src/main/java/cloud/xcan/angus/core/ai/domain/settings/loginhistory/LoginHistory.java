package cloud.xcan.angus.core.ai.domain.settings.loginhistory;

import cloud.xcan.angus.core.jpa.multitenancy.TenantAuditingEntity;
import cloud.xcan.angus.core.jpa.multitenancy.TenantListener;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;

/**
 * 登录历史实体
 */
@Entity
@Table(name = "login_history")
@Setter
@Getter
@Accessors(chain = true)
public class LoginHistory extends TenantAuditingEntity<LoginHistory, Long> {

  @Id
  private Long id;

  @Column(name = "user_id", nullable = false)
  private Long userId;

  @Column(name = "login_datetime", nullable = false)
  private LocalDateTime loginDatetime;

  @Column(name = "ip", length = 50)
  private String ip;

  @Column(name = "location", length = 200)
  private String location;

  @Column(name = "device", length = 200)
  private String device;

  @Column(name = "browser", length = 100)
  private String browser;

  @Column(name = "status", nullable = false, length = 20)
  private String status; // success, failed

  @Column(name = "fail_reason", length = 500)
  private String failReason;

  @Override
  public Long identity() {
    return this.id;
  }
}
