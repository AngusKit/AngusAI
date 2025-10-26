package cloud.xcan.angus.core.ai.domain.settings.resourcesharing;

import cloud.xcan.angus.core.jpa.multitenancy.TenantAuditingEntity;
import cloud.xcan.angus.core.jpa.multitenancy.TenantListener;
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

/**
 * 资源共享实体
 */
@Entity
@Table(name = "resource_sharing")
@EntityListeners({TenantListener.class})
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
   * 资源名称（冗余字段，方便查询）
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
   * 默认权限
   */
  @Enumerated(EnumType.STRING)
  @Column(name = "permission", nullable = false, length = 20)
  private SharePermission permission;

  /**
   * 是否通知成员
   */
  @Column(name = "notify_members")
  private Boolean notifyMembers = true;

  /**
   * 共享消息
   */
  @Column(name = "message", length = 500)
  private String message;

  /**
   * 统计：总访问次数
   */
  @Column(name = "total_views")
  private Long totalViews = 0L;

  /**
   * 统计：总编辑次数
   */
  @Column(name = "total_edits")
  private Long totalEdits = 0L;

  /**
   * 统计：总下载次数
   */
  @Column(name = "total_downloads")
  private Long totalDownloads = 0L;

  /**
   * 统计：独立访客数
   */
  @Column(name = "unique_visitors")
  private Long uniqueVisitors = 0L;

  /**
   * 是否启用
   */
  @Column(name = "enabled")
  private Boolean enabled = true;

  @Override
  public Long identity() {
    return this.id;
  }
}
