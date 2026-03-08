package cloud.xcan.angus.core.ai.domain.activity;


import cloud.xcan.angus.api.commonlink.FullResourceType;
import cloud.xcan.angus.core.jpa.multitenancy.TenantEntity;
import cloud.xcan.angus.core.jpa.multitenancy.TenantListener;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;
import java.time.LocalDateTime;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;

/**
 * Only a single activity is recorded, and resource information is not recorded during batch
 * operations
 */
@Entity
@Table(name = "ai_activity")
@Setter
@Getter
@Accessors(chain = true)
public class Activity extends TenantEntity<Activity, Long> {

  @Id
  private Long id;

  @Column(name = "resource_id")
  private Long resourceId;

  @Column(name = "resource_type")
  @Enumerated(EnumType.STRING)
  private FullResourceType resourceType;

  @Column(name = "resource_name")
  private String resourceName;

  @Column(name = "user_id")
  private Long userId;

  @Enumerated(EnumType.STRING)
  @Column(name = "action_type")
  private ActionType actionType;

  @Enumerated(EnumType.STRING)
  @Column(name = "status")
  private ActivityStatus status;

  @Column(name = "activity_date")
  private LocalDateTime activityDate;

  @Column(name = "ip_address")
  private String ipAddress;

  @Column(name = "user_agent")
  private String userAgent;

  private String description;

  private String detail;

  @Transient
  private String userName;
  @Transient
  private String userAvatar;

  @Override
  public Long identity() {
    return this.id;
  }
}
