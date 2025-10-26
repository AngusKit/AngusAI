package cloud.xcan.angus.core.ai.domain.settings.dataexport;

import cloud.xcan.angus.core.jpa.multitenancy.TenantAuditingEntity;
import cloud.xcan.angus.core.jpa.multitenancy.TenantListener;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;

/**
 * 数据导出实体
 */
@Entity
@Table(name = "data_export")
@Setter
@Getter
@Accessors(chain = true)
public class DataExport extends TenantAuditingEntity<DataExport, Long> {

  @Id
  private Long id;

  @Column(name = "user_id", nullable = false)
  private Long userId;

  @Enumerated(EnumType.STRING)
  @Column(name = "type", nullable = false, length = 20)
  private ExportType type;

  @Enumerated(EnumType.STRING)
  @Column(name = "format", nullable = false, length = 20)
  private ExportFormat format;

  @Enumerated(EnumType.STRING)
  @Column(name = "status", nullable = false, length = 20)
  private ExportStatus status;

  @Column(name = "scope", length = 1000)
  private String scope; // JSON格式

  @Column(name = "file_size")
  private Long fileSize;

  @Column(name = "download_url", length = 500)
  private String downloadUrl;

  @Column(name = "expires_at")
  private LocalDateTime expiresAt;

  @Column(name = "requested_at")
  private LocalDateTime requestedAt;

  @Column(name = "completed_at")
  private LocalDateTime completedAt;

  @Column(name = "error_message", length = 1000)
  private String errorMessage;

  @Override
  public Long identity() {
    return this.id;
  }
}
