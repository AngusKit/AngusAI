package cloud.xcan.angus.core.ai.domain.knowledgebase;

import cloud.xcan.angus.core.ai.domain.Constants;
import cloud.xcan.angus.core.ai.domain.Visibility;
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
 * 知识库实体
 */
@Entity
@Table(name = "knowledge_base")
@Setter
@Getter
@Accessors(chain = true)
public class KnowledgeBase extends TenantAuditingEntity<KnowledgeBase, Long> {

  @Id
  private Long id;

  @Column(name = "name", nullable = false, length = Constants.KNOWLEDGE_BASE_NAME_MAX_LENGTH)
  private String name;

  @Column(name = "icon", nullable = false)
  private String icon;

  @Column(name = "icon_bg", nullable = false)
  private String iconBg;

  @Column(name = "description", length = Constants.KNOWLEDGE_BASE_DESCRIPTION_MAX_LENGTH)
  private String description;

  @Enumerated(EnumType.STRING)
  @Column(name = "visibility", nullable = false)
  private Visibility visibility;

  @Column(name = "enabled", nullable = false)
  private Boolean enabled = true;

  // 统计数据
  @Column(name = "documents_count")
  private Integer documentsCount = 0;

  @Column(name = "total_size")
  private Long totalSize = 0L;

  @Column(name = "total_chunks")
  private Integer totalChunks = 0;

  @Type(JsonType.class)
  @Column(columnDefinition = "json", name = "tags")
  private List<String> tags;

  @Type(JsonType.class)
  @Column(columnDefinition = "json", name = "config")
  private KnowledgeBaseConfig config;

  @Transient
  private String totalSizeFormatted;
  @Transient
  private Integer activeDocuments; // 已启用文档数

  @Override
  public Long identity() {
    return this.id;
  }
}
