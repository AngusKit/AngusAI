package cloud.xcan.angus.core.ai.domain.team.resourcesharing;

import cloud.xcan.angus.core.ai.domain.ResourceType;
import cloud.xcan.angus.core.jpa.multitenancy.TenantEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
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
@Table(name = "ai_resource_sharing")
@Setter
@Getter
@Accessors(chain = true)
public class ResourceSharingStat extends TenantEntity<ResourceSharingStat, Long> {

  @Id
  private Long id;

  // TODO resourceId和resourceType添加唯一索引

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
   * 统计：总访问次数
   */
  @Column(name = "total_accesses")
  private Long totalAccesses = 0L;
  /**
   * 统计：总查看次数
   */
  @Column(name = "total_views")
  private Long totalViews = 0L;
  /**
   * 统计：总编辑次数
   */
  @Column(name = "total_edits")
  private Long totalEdits = 0L;
  /**
   * 统计：总删除次数
   */
  @Column(name = "total_deletions")
  private Long totalDeletions = 0L;

  @Override
  public Long identity() {
    return this.id;
  }
}
