package cloud.xcan.angus.core.ai.domain.prompt;

import cloud.xcan.angus.core.jpa.multitenancy.TenantAuditingEntity;
import com.fasterxml.jackson.databind.JsonNode;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "ai_prompt")
public class Prompt extends TenantAuditingEntity<Prompt, Long> {

  @Id
  private Long id;

  @Column(name = "title", nullable = false, length = 100)
  private String title;

  @Column(name = "content", nullable = false, columnDefinition = "TEXT")
  private String content;

  @Column(name = "description", length = 500)
  private String description;

  @Column(name = "category_id", nullable = false)
  private Long categoryId;

  @JdbcTypeCode(SqlTypes.JSON)
  @Column(name = "tags", columnDefinition = "json")
  private JsonNode tags;

  @Column(name = "is_favorite", nullable = false)
  private Boolean isFavorite = false;

  @Column(name = "usage_count", nullable = false)
  private Long usageCount = 0L;

  @Column(name = "is_system", nullable = false)
  private Boolean isSystem = false;

  @Column(name = "is_public", nullable = false)
  private Boolean isPublic = false;

  @JdbcTypeCode(SqlTypes.JSON)
  @Column(name = "variables", columnDefinition = "json")
  private JsonNode variables;

  @JdbcTypeCode(SqlTypes.JSON)
  @Column(name = "examples", columnDefinition = "json")
  private JsonNode examples;

  @Enumerated(EnumType.STRING)
  @Column(name = "status", nullable = false, length = 20)
  private PromptStatus status = PromptStatus.ACTIVE;

  @Column(name = "archived", nullable = false)
  private Boolean archived = false;

  @Column(name = "archived_at")
  private Long archivedAt;

  @Override
  public Long identity() {
    return id;
  }
}
