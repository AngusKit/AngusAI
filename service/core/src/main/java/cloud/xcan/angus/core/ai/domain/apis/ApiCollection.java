package cloud.xcan.angus.core.ai.domain.apis;

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
import java.util.Map;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;
import org.hibernate.annotations.Type;

/**
 * 接口集实体
 */
@Entity
@Table(name = "api_collection")
@Setter
@Getter
@Accessors(chain = true)
public class ApiCollection extends TenantAuditingEntity<ApiCollection, Long> {

  @Id
  private Long id;

  @Column(name = "name", nullable = false, length = 100)
  private String name;

  @Column(name = "description", length = 500)
  private String description;

  @Enumerated(EnumType.STRING)
  @Column(name = "source", nullable = false)
  private ApiCollectionSource source = ApiCollectionSource.MANUAL;

  @Enumerated(EnumType.STRING)
  @Column(name = "visibility", nullable = false)
  private Visibility visibility = Visibility.PRIVATE;

  @Type(JsonType.class)
  @Column(columnDefinition = "json", name = "server_config")
  private Map<String, Object> serverConfig;

  @Type(JsonType.class)
  @Column(columnDefinition = "json", name = "security_config")
  private Map<String, Object> securityConfig;

  @Column(name = "last_used_at")
  private Long lastUsedAt;

  @Transient
  private Long endpointsCount = 0L;

  @Transient
  private Long enabledCount = 0L;

  @Transient
  private String sourceLabel;

  @Transient
  private String sourceIcon;

  @Transient
  private String visibilityLabel;

  @Transient
  private Boolean hasServerConfig;

  @Transient
  private Boolean hasSecurityConfig;

  @Override
  public Long identity() {
    return this.id;
  }
}

