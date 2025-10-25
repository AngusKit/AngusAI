package cloud.xcan.angus.core.ai.domain.dataset;

import cloud.xcan.angus.core.jpa.multitenancy.TenantAuditingEntity;
import cloud.xcan.angus.core.jpa.multitenancy.TenantListener;
import io.hypersistence.utils.hibernate.type.json.JsonType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;
import java.time.LocalDateTime;
import java.util.List;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;
import org.hibernate.annotations.Type;

/**
 * 数据集实体
 */
@Entity
@Table(name = "dataset")
@EntityListeners({TenantListener.class})
@Setter
@Getter
@Accessors(chain = true)
public class Dataset extends TenantAuditingEntity<Dataset, Long> {

  @Id
  private Long id;

  @Column(name = "name", nullable = false, length = 50)
  private String name;

  @Column(name = "description", nullable = false, length = 500)
  private String description;

  @Column(name = "icon", nullable = false)
  private String icon;

  @Column(name = "icon_bg")
  private String iconBg;

  @Enumerated(EnumType.STRING)
  @Column(name = "type", nullable = false)
  private DatasetType type;

  @Enumerated(EnumType.STRING)
  @Column(name = "status", nullable = false)
  private DatasetStatus status;

  @Column(name = "status_color")
  private String statusColor;

  @Enumerated(EnumType.STRING)
  @Column(name = "visibility", nullable = false)
  private Visibility visibility;

  // 统计数据
  @Column(name = "data_count")
  private String dataCount;

  @Column(name = "data_count_raw")
  private Long dataCountRaw = 0L;

  @Column(name = "size")
  private String size;

  @Column(name = "size_bytes")
  private Long sizeBytes = 0L;

  @Column(name = "total_records")
  private Long totalRecords = 0L;

  @Column(name = "total_size")
  private Long totalSize = 0L;

  @Column(name = "columns")
  private Integer columns = 0;

  @Column(name = "data_sources")
  private Integer dataSources = 0;

  @Column(name = "last_update_time")
  private Long lastUpdateTime;

  // 配置信息（JSON格式存储）
  @Type(JsonType.class)
  @Column(columnDefinition = "json", name = "config")
  private DatasetConfig config;

  // 标签
  @Type(JsonType.class)
  @Column(columnDefinition = "json", name = "tags")
  private List<String> tags;

  // 访问统计
  @Column(name = "access_count")
  private Long accessCount = 0L;

  @Column(name = "last_access_time")
  private Long lastAccessTime;

  // 同步相关
  @Column(name = "last_sync_time")
  private Long lastSyncTime;

  @Column(name = "sync_status")
  private String syncStatus;

  @Column(name = "sync_error")
  private String syncError;

  // 备份相关
  @Column(name = "backup_enabled")
  private Boolean backupEnabled = false;

  @Column(name = "last_backup_time")
  private Long lastBackupTime;

  @Column(name = "backup_count")
  private Long backupCount = 0L;

  // 归档相关
  @Column(name = "archived")
  private Boolean archived = false;

  @Column(name = "archived_at")
  private Long archivedAt;

  // 错误信息
  @Column(name = "error_message")
  private String errorMessage;

  @Column(name = "error_count")
  private Long errorCount = 0L;

  @Transient
  private boolean configValidated;
  @Transient
  private boolean dependenciesChecked;
  @Transient
  private boolean resourcesCleaned;

  @Override
  public Long identity() {
    return this.id;
  }
}
