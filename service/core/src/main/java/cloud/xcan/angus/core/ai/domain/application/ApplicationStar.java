package cloud.xcan.angus.core.ai.domain.application;

import cloud.xcan.angus.core.jpa.multitenancy.TenantAuditingEntity;
import cloud.xcan.angus.spec.experimental.EntitySupport;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;

/**
 * 应用标星实体：用户对应用的收藏关系
 */
@Entity
@Table(name = "ai_application_star")
@Setter
@Getter
@Accessors(chain = true)
public class ApplicationStar extends EntitySupport<ApplicationStar, Long> {

  @Id
  private Long id;

  @Column(name = "application_id", nullable = false)
  private Long applicationId;

  /**
   * 标星用户ID（冗余 createdBy，便于查询）
   */
  @Column(name = "user_id", nullable = false)
  private Long userId;

  @Override
  public Long identity() {
    return this.id;
  }
}
