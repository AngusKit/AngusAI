package cloud.xcan.angus.core.ai.domain.prompt;

import cloud.xcan.angus.core.jpa.multitenancy.TenantAuditingEntity;
import io.hypersistence.utils.hibernate.type.json.JsonType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;
import java.util.List;
import java.util.Objects;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.Type;

@Setter
@Getter
@Entity
@Table(name = "ai_prompt")
public class Prompt extends TenantAuditingEntity<Prompt, Long> {

  @Id
  private Long id;

  @Column(name = "title", nullable = false, length = 100)
  private String title;

  @Column(name = "content", nullable = false, columnDefinition = "TEXT")
  private String content;

  @Column(name = "category_id", nullable = false)
  private Long categoryId;

  @Type(JsonType.class)
  @Column(name = "tags", columnDefinition = "json")
  private List<String> tags;

  @Column(name = "usage_count", nullable = false)
  private Long usageCount = 0L;

  @Transient
  private Boolean isFavorite;
  @Transient
  private Boolean isSystem;
  @Transient
  private Long favorites;

  @Override
  public Long identity() {
    return id;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (!(o instanceof Prompt prompt)) {
      return false;
    }
    return Objects.equals(id, prompt.id)
        && Objects.equals(title, prompt.title)
        && Objects.equals(content, prompt.content)
        && Objects.equals(categoryId, prompt.categoryId)
        && Objects.equals(tags, prompt.tags)
        && Objects.equals(usageCount, prompt.usageCount);
  }

  @Override
  public int hashCode() {
    return Objects.hash(id, title, content, categoryId, tags, usageCount);
  }
}
