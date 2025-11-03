package cloud.xcan.angus.core.ai.domain.team.resourcesharing;

import cloud.xcan.angus.core.jpa.multitenancy.TenantAuditingEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;

/**
 * 共享成员实体
 */
@Entity
@Table(name = "resource_sharing_member")
@Setter
@Getter
@Accessors(chain = true)
public class ResourceSharingMember extends TenantAuditingEntity<ResourceSharingMember, Long> {

  @Id
  private Long id;

  /**
   * 共享ID
   */
  @Column(name = "sharing_id", nullable = false)
  private Long sharingId;

  /**
   * 用户ID
   */
  @Column(name = "user_id", nullable = false)
  private Long userId;

  /**
   * 成员权限（可覆盖共享默认权限）
   */
  @Enumerated(EnumType.STRING)
  @Column(name = "permission", length = 20)
  private SharePermission permission;

  /**
   * 最后访问时间
   */
  @Column(name = "last_accessed")
  private LocalDateTime lastAccessed;

  /**
   * 访问次数
   */
  @Column(name = "access_count")
  private Long accessCount = 0L;

  @Override
  public Long identity() {
    return this.id;
  }
}
