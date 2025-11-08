package cloud.xcan.angus.core.ai.domain.knowledgebase;

import cloud.xcan.angus.core.ai.domain.Constants;
import cloud.xcan.angus.core.jpa.multitenancy.TenantAuditingEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;

/**
 * 文档实体
 */
@Entity
@Table(name = "knowledge_base_document")
@Setter
@Getter
@Accessors(chain = true)
public class KnowledgeBaseDoc extends TenantAuditingEntity<KnowledgeBaseDoc, Long> {

  @Id
  private Long id;

  @Column(name = "knowledge_base_id", nullable = false)
  private Long knowledgeBaseId;

  @Column(name = "name", nullable = false, length = Constants.DOCUMENT_NAME_MAX_LENGTH)
  private String name;

  @Enumerated(EnumType.STRING)
  @Column(name = "type", nullable = false)
  private DocumentType type;

  @Column(name = "size", nullable = false)
  private Long size;

  @Enumerated(EnumType.STRING)
  @Column(name = "status", nullable = false)
  private DocumentStatus status;

  @Column(name = "enabled", nullable = false)
  private Boolean enabled = true;

  @Column(name = "chunks")
  private Integer chunks = 0;

  @Column(name = "processing_progress")
  private Double processingProgress = 0D;

  @Column(name = "error_message", length = Constants.DOCUMENT_ERROR_MESSAGE_MAX_LENGTH)
  private String errorMessage;

  @Column(name = "file_path", length = Constants.DOCUMENT_FILE_PATH_MAX_LENGTH)
  private String filePath;

  @Column(name = "content_hash", length = Constants.DOCUMENT_CONTENT_HASH_MAX_LENGTH)
  private String contentHash;

  @Transient
  private String sizeFormatted;

  @Override
  public Long identity() {
    return this.id;
  }
}
