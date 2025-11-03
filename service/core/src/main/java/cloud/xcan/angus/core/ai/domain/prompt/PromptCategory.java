package cloud.xcan.angus.core.ai.domain.prompt;

import cloud.xcan.angus.core.jpa.multitenancy.TenantAuditingEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;
import java.util.Objects;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
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

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (!(o instanceof PromptCategory category)) {
      return false;
    }
    return Objects.equals(id, category.id)
        && Objects.equals(name, category.name)
        && Objects.equals(icon, category.icon)
        && Objects.equals(color, category.color)
        && Objects.equals(parentId, category.parentId)
        && Objects.equals(isSystem, category.isSystem)
        && Objects.equals(orderNum, category.orderNum);
  }

  @Override
  public int hashCode() {
    return Objects.hash(id, name, icon, color, parentId, isSystem, orderNum);
  }
}
