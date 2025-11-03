package cloud.xcan.angus.core.ai.domain.team.resourcesharing;

import cloud.xcan.angus.core.ai.domain.ResourceType;
import cloud.xcan.angus.core.jpa.multitenancy.TenantAuditingEntity;
import io.hypersistence.utils.hibernate.type.json.JsonType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;
import java.util.List;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;
import org.hibernate.annotations.Type;

/**
 * 资源共享实体
 */
@Entity
@Table(name = "resource_sharing")
@Setter
@Getter
@Accessors(chain = true)
public class ResourceSharing extends TenantAuditingEntity<ResourceSharing, Long> {

  @Id
  private Long id;

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

  /**
   * 资源名称（冗余字段，方便查询） TODO 共享资源名同步修改支持
   */
  @Column(name = "resource_name", length = 200)
  private String resourceName;

  /**
   * 资源所有者ID
   */
  @Column(name = "owner_id", nullable = false)
  private Long ownerId;

  /**
   * 共享范围
   */
  @Enumerated(EnumType.STRING)
  @Column(name = "shared_with", nullable = false, length = 20)
  private SharedWith sharedWith;

  /**
   * 共享成员IDs
   */
  @Type(JsonType.class)
  @Column(columnDefinition = "json", name = "member_ids")
  private List<Long> memberIds;

  /**
   * 默认权限
   */
  @Enumerated(EnumType.STRING)
  @Column(name = "permission", nullable = false, length = 20)
  private SharePermission permission;

  /**
   * 是否启用
   */
  @Column(name = "enabled")
  private Boolean enabled;

  @Transient
  private String ownerName;
  @Transient
  private String ownerAvatar;

  @Override
  public Long identity() {
    return this.id;
  }
}
