package cloud.xcan.angus.core.ai.domain.team.resourcesharing;

import static cloud.xcan.angus.spec.SpecConstant.DateFormat.DATE_FMT;

import cloud.xcan.angus.core.ai.domain.ResourceType;
import cloud.xcan.angus.spec.experimental.EntitySupport;
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
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import org.springframework.format.annotation.DateTimeFormat;

/**
 * 共享成员实体
 */
@Entity
@Table(name = "resource_sharing_member")
@EntityListeners(AuditingEntityListener.class)
@Setter
@Getter
@Accessors(chain = true)
public class ResourceSharingMember extends EntitySupport<ResourceSharingMember, Long> {

  @Id
  private Long id;

  /**
   * 共享ID
   */
  @Column(name = "sharing_id")
  private Long sharingId;

  /**
   * 资源ID
   */
  @Column(name = "resource_id", nullable = false)
  private Long resourceId;

  /**
   * 资源类型
   */
  @Enumerated(EnumType.STRING)
  @Column(name = "resource_type", nullable = false, length = 20)
  private ResourceType resourceType;

  // TODO 成员和权限添加唯一索引

  /**
   * 用户ID
   */
  @Column(name = "user_id", nullable = false)
  private Long userId;

  /**
   * 成员权限（可覆盖共享默认权限）
   */
  @Enumerated(EnumType.STRING)
  @Column(name = "permission", length = 20, nullable = false)
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

  @CreatedBy
  @Column(name = "created_by", nullable = false, updatable = false)
  protected Long createdBy;

  @CreatedDate
  @DateTimeFormat(pattern = DATE_FMT)
  @Column(name = "created_date", nullable = false, updatable = false, columnDefinition = "TIMESTAMP")
  protected LocalDateTime createdDate;

  @Transient
  private String userName;
  @Transient
  private String userAvatar;

  @Override
  public Long identity() {
    return this.id;
  }
}
