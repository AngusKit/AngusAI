package cloud.xcan.angus.core.ai.domain.vector;

import cloud.xcan.angus.core.ai.domain.ConnectionStatus;
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

  @Type(JsonType.class)
  @Column(columnDefinition = "json", name = "config")
  private VectorStoreConfig config;

  @Enumerated(EnumType.STRING)
  @Column(name = "status", nullable = false, length = 20)
  private ConnectionStatus status;

  @Column(name = "enabled", nullable = false)
  private Boolean enabled = true;

  // 测试连接返回信息
  @Column(name = "index_count")
  private Long indexCount;
  @Column(name = "dimension")
  private Integer dimension;
  @Column(name = "response_time")
  private Long responseTime;
  @Column(name = "version")
  private String version;

  @Transient
  private Map<String, Object> performance;
  @Transient
  private boolean testConnectionSuccess;
  @Transient
  private String testConnectionMessage;

  @Override
  public Long identity() {
    return this.id;
  }
}

