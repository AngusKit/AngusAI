package cloud.xcan.angus.core.ai.domain.dataset;

import cloud.xcan.angus.core.ai.domain.Constants;
import cloud.xcan.angus.core.jpa.multitenancy.TenantAuditingEntity;
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
 * 数据集实体
 */
@Entity
@Table(name = "dataset_data")
@Setter
@Getter
@Accessors(chain = true)
public class DatasetData extends TenantAuditingEntity<DatasetData, Long> {

  @Id
  private Long id;

  @Column(name = "dataset_id")
  private Long datasetId;

  @Column(name = "name", nullable = false, length = 400)
  private String name;

  @Enumerated(EnumType.STRING)
  @Column(name = "type", nullable = false)
  private DatasetDataType type;

  @Enumerated(EnumType.STRING)
  @Column(name = "status", nullable = false)
  private DatasetDataStatus status;

  @Column(name = "file_path", length = Constants.DOCUMENT_FILE_PATH_MAX_LENGTH)
  private String filePath;

  @Column(name = "content_hash", length = Constants.DOCUMENT_CONTENT_HASH_MAX_LENGTH)
  private String contentHash;

  @Column(name = "data_count")
  private Long dataCount;

  @Column(name = "data_size")
  private Long dataSize;

  @Override
  public Long identity() {
    return this.id;
  }
}
