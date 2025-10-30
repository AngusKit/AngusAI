package cloud.xcan.angus.core.ai.domain.prompt;

import cloud.xcan.angus.core.jpa.multitenancy.TenantAuditingEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "ai_prompt_category")
public class PromptCategory extends TenantAuditingEntity<PromptCategory, Long> {

  @Id
  private Long id;

  @Column(name = "name", nullable = false, length = 20)
  private String name;

  @Column(name = "icon", length = 50)
  private String icon;

  @Column(name = "color", length = 20)
  private String color;

  @Column(name = "parent_id")
  private Long parentId;

  @Column(name = "is_system", nullable = false)
  private Boolean isSystem = false;

  @Column(name = "order_num", nullable = false)
  private Integer orderNum = 0;

  @Transient
  private Long promptCount = 0L;

  @Override
  public Long identity() {
    return id;
  }
}
