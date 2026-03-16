package cloud.xcan.angus.core.ai.domain.dataset;

import cloud.xcan.angus.core.ai.domain.Visibility;
import cloud.xcan.angus.core.jpa.multitenancy.TenantAuditingEntity;
import io.hypersistence.utils.hibernate.type.json.JsonType;
import io.swagger.v3.oas.annotations.media.Schema;
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
 * 数据集实体
 */
@Entity
@Table(name = "ai_dataset")
@Setter
@Getter
@Accessors(chain = true)
public class Dataset extends TenantAuditingEntity<Dataset, Long> {

  @Id
  private Long id;

  @Column(name = "name", nullable = false, length = 100)
  private String name;

  @Column(name = "description", nullable = false, length = 800)
  private String description;

  @Enumerated(EnumType.STRING)
  @Column(name = "type", nullable = false)
  private DatasetType type;

  @Column(name = "enabled", nullable = false)
  private Boolean enabled;

  @Enumerated(EnumType.STRING)
  @Column(name = "visibility", nullable = false)
  private Visibility visibility;

  @Column(name = "icon", nullable = false)
  private String icon;

  @Column(name = "icon_bg")
  private String iconBg;

  // 标签
  @Type(JsonType.class)
  @Column(columnDefinition = "json", name = "tags")
  private List<String> tags;

  // 配置信息（JSON格式存储）
  @Type(JsonType.class)
  @Column(columnDefinition = "json", name = "config")
  private DatasourceConfig config;

  // 访问统计
  @Column(name = "access_count")
  private Long accessCount = 0L;

  // 同步相关
  @Column(name = "last_sync_time")
  private Long lastSyncTime;

  @Column(name = "sync_status")
  private String syncStatus;

  @Column(name = "sync_error")
  private String syncError;

  // 错误信息
  @Column(name = "error_message")
  private String errorMessage;

  @Column(name = "error_count")
  private Long errorCount = 0L;

  // 统计数据（临时字段，由门面层通过 DatasetDataQuery 批量统计填充）
  @Transient
  private long totalFilesOrTables;
  @Transient
  private long totalRecords;
  @Transient
  private long totalRecordsSize;
  @Transient
  private long usedStoreSize;

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
