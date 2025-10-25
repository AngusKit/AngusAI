package cloud.xcan.angus.core.ai.domain.knowledgebase;

import cloud.xcan.angus.core.jpa.multitenancy.TenantAuditingEntity;
import cloud.xcan.angus.core.jpa.multitenancy.TenantListener;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;

/**
 * 文档分段实体
 */
@Entity
@Table(name = "knowledge_base_document_chunk")
@EntityListeners({TenantListener.class})
@Setter
@Getter
@Accessors(chain = true)
public class KnowledgeBaseDocChunk extends TenantAuditingEntity<KnowledgeBaseDocChunk, Long> {

  @Id
  private Long id;

  @Column(name = "document_id", nullable = false)
  private Long documentId;

  @Column(name = "chunk_index", nullable = false)
  private Integer chunkIndex;

  @Column(name = "content", columnDefinition = "TEXT", nullable = false)
  private String content;

  @Column(name = "embedding_vector", columnDefinition = "TEXT")
  private String embeddingVector;

  @Column(name = "metadata", columnDefinition = "TEXT")
  private String metadata;

  @Column(name = "page_no")
  private Integer pageNo;

  @Column(name = "position")
  private String position;

  @Override
  public Long identity() {
    return this.id;
  }
}
