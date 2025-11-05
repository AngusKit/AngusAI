package cloud.xcan.angus.core.ai.domain.vector;

import cloud.xcan.angus.core.ai.infra.ai.vector.VectorStoreType;
import cloud.xcan.angus.core.jpa.multitenancy.TenantAuditingEntity;
import io.hypersistence.utils.hibernate.type.json.JsonType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;
import java.util.Map;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;
import org.hibernate.annotations.Type;

/**
 * 向量存储源实体
 */
@Entity
@Table(name = "vector_store")
@Setter
@Getter
@Accessors(chain = true)
public class VectorStore extends TenantAuditingEntity<VectorStore, Long> {

  @Id
  private Long id;

  @Column(name = "name", nullable = false, length = 100)
  private String name;

  @Enumerated(EnumType.STRING)
  @Column(name = "type", nullable = false)
  private VectorStoreType type;

  @Column(name = "description", length = 500)
  private String description;

  @Column(name = "endpoint", nullable = false, length = 500)
  private String endpoint;

  @Column(name = "dimension", nullable = false)
  private Integer dimension;

  @Type(JsonType.class)
  @Column(columnDefinition = "json", name = "config")
  private Map<String, String> config;

  @Column(name = "status", nullable = false, length = 20)
  private String status = "disconnected"; // connected, disconnected, testing

  @Column(name = "enabled", nullable = false)
  private Boolean enabled = true;

  @Column(name = "auto_sync", nullable = false)
  private Boolean autoSync = false;

  @Column(name = "sync_interval")
  private Integer syncInterval = 60; // 分钟

  @Column(name = "index_count")
  private Long indexCount = 0L;

  @Column(name = "last_sync_time")
  private Long lastSyncTime;

  @Transient
  private String typeLabel;

  @Transient
  private String typeIcon;

  @Transient
  private String statusLabel;

  @Transient
  private String statusColor;

  @Transient
  private Map<String, Object> performance;

  @Override
  public Long identity() {
    return this.id;
  }
}

