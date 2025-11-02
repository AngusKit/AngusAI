package cloud.xcan.angus.core.ai.domain.team.activity;


import cloud.xcan.angus.api.commonlink.CombinedTargetType;
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
@Table(name = "activity")
@EntityListeners({TenantListener.class})
@Setter
@Getter
@Accessors(chain = true)
public class Activity extends TenantEntity<Activity, Long> {

  @Id
  private Long id;

  @Column(name = "project_id")
  private Long projectId;

  @Column(name = "target_id")
  private Long targetId;

  @Column(name = "parent_target_id")
  private Long parentTargetId;

  @Column(name = "target_type")
  @Enumerated(EnumType.STRING)
  private CombinedTargetType targetType;

  @Column(name = "target_name")
  private String targetName;

  @Column(name = "main_target_id")
  private Long mainTargetId;

  @Column(name = "user_id")
  private Long userId;

  @Enumerated(EnumType.STRING)
  @Column(name = "type")
  private ActivityType type;

  @Column(name = "opt_date")
  private LocalDateTime optDate;

  private String description;

  private String detail;

  @Transient
  private String projectName;
  @Transient
  private String fullName;
  @Transient
  private String avatar;

  @Override
  public Long identity() {
    return this.id;
  }
}
